import React, { useState, useEffect, useRef } from "react";

import { Grid, InputBase } from "@material-ui/core";
import { useWeb3React } from "@web3-react/core";
import Web3 from "web3";

import { Color, PrimaryButton } from "shared/ui-kit";
import InputWithLabelAndTooltip from "shared/ui-kit/InputWithLabelAndTooltip";
import { TokenSelect } from "shared/ui-kit/Select/TokenSelect";
import { BlockchainNets } from "shared/constants/constants";
import { NetworkTokenSelect } from "components/PriviWallet/components/NetworkSelect";
import { DateInput } from "shared/ui-kit/DateTimeInput";
import { TimeInput } from "shared/ui-kit/TimeInput";
import Box from "shared/ui-kit/Box";
import { useTypedSelector } from "store/reducers/Reducer";
import { getPriviWallet } from "shared/helpers";
import ConnectWalletModal from "components/PriviWallet/components/Modals/ConnectWalletModal";
import { LoadingWrapper } from "shared/ui-kit/Hocs";
import { sendTokensStyles } from "./index.styles";
import { useAlertMessage } from "shared/hooks/useAlertMessage";
import { POLYGON_CHAIN_IDS, polygonConnector } from "shared/constants/constants";
import substrateTokens from "shared/connectors/substrate/tokens";
import { ContractInstance } from "shared/connectors/substrate/functions";
import { useSubstrate } from "shared/connectors/substrate";
import { getPolygonWalletBalances } from "./utils";
import { transferPolygonToken, streamPolygonToken, stopStreamPolygonToken } from "./api";
import { buildJsxFromObject } from "shared/functions/commonFunctions";
import { SignatureRequestModal } from "shared/ui-kit/Modal/Modals";
import {
  ITransfer,
  transfer,
  ICreateStreaming,
  createStreaming,
  getUserRegisteredWallets,
} from "shared/services/API";
import * as WalletAPIProvider from "shared/services/API/WalletAPI";

const TOKEN_TYPES = ["CRYPTO", "NFTMEDIA", "FT", "SOCIAL"];
const COVALENT_BALANCE_TYPE = {
  cryptocurrency: TOKEN_TYPES[0],
};

type NetworkType = "PRIVI" | "SUBSTRATE" | "POLYGON";

export default function SendTokens() {
  const classes = sendTokensStyles();
  const { showAlertMessage } = useAlertMessage();
  const users = useTypedSelector(state => state.usersInfoList);
  const user = useTypedSelector(state => state.user);
  const { activate, account, chainId, active, library } = useWeb3React();
  const userBalances = useTypedSelector(state => state.userBalances);

  const [loading, setLoading] = useState<boolean>(false);
  const [walletsList, setWalletsList] = useState<any>([]);
  const [priviWalletAddress, setPriviWalletAddress] = useState<string>("");
  const [polkadotWalletAddress, setPolkadotWalletAddress] = useState<string>("");
  const [selectedToken, setSelectedToken] = useState<string>("");
  const [amountValue, setAmountValue] = useState<string>("");
  const [fromDate, setFromDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date>(new Date());
  const [originNetwork, setOriginNetwork] = useState<NetworkType>("PRIVI");
  const [isDirect, setIsDirect] = useState<boolean>(true);
  const [tokenType, setTokenType] = useState<string>(TOKEN_TYPES[0]);
  const [openAddWalletDlg, setOpenAddWalletDlg] = useState<boolean>(false);
  const [recipient, setRecipient] = useState<string>("");
  const [tokenList, setTokenList] = useState<any[]>([]);
  const [ethTokenList, setEthTokenList] = useState<any[]>([]);
  const { api, apiState, keyring, keyringState } = useSubstrate();
  const [substrateTokenBalanceList, setSubstrateTokenBalanceList] = useState<any[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);

  const payloadRef = useRef<any>({});
  const [openSignRequestModal, setOpenSignRequestModal] = useState<boolean>(false);
  const [signRequestModalDetail, setSignRequestModalDetail] = useState<any>(null);

  useEffect(() => {
    const tokens = Object.keys(userBalances).map(tokenName => ({
      ...userBalances[tokenName],
      token: userBalances[tokenName].Token,
    }));
    setTokenList(tokens);
  }, [userBalances]);

  useEffect(() => {
    const firstToken = tokenList.find(token => (token as any).Type === tokenType);
    setSelectedToken(firstToken ? firstToken.Token : "");
  }, [tokenType]);

  useEffect(() => {
    setLoading(true);
    const fetchWallets = async () => {
      try {
        const wallets = await getUserRegisteredWallets();
        setWalletsList(wallets);
        const { address } = await getPriviWallet();
        setPriviWalletAddress(address);
        setLoading(false);
      } catch (e) {
        showAlertMessage(e.message || "Fetching Wallets Failed", { variant: "error" });
        setLoading(false);
      }
    };

    fetchWallets();
  }, []);

  useEffect(() => {
    const polkadotWallet = walletsList.filter(wallet => wallet.name.toUpperCase() === "POLKADOT");
    if (polkadotWallet.length) {
      setPolkadotWalletAddress(polkadotWallet[0].address);
    }
  }, [walletsList]);

  useEffect(() => {
    if (polkadotWalletAddress) {
      fetchSubstrateBalances().then(data => {
        setSubstrateTokenBalanceList(data);
      });
    }
  }, [polkadotWalletAddress]);

  const getTokenList = () => {
    if (originNetwork === "PRIVI") return tokenList.filter(token => (token as any).Type === tokenType);
    else if (originNetwork === "SUBSTRATE")
      return substrateTokenBalanceList.filter(token => (token as any).Type === tokenType);
    else if (originNetwork === "POLYGON") {
      return ethTokenList.filter(token => token.Type === tokenType);
    } else return [];
  };

  const getMaxQuantity = () => {
    if (selectedToken && originNetwork === "PRIVI" && userBalances[selectedToken]) {
      return userBalances[selectedToken].Balance || 0;
    } else if (selectedToken && originNetwork === "SUBSTRATE") {
      const substrateTokenBalance = substrateTokenBalanceList.find(token => token.Token === selectedToken);
      if (substrateTokenBalance) return substrateTokenBalance.Balance;
    } else if (selectedToken && originNetwork === "POLYGON") {
      const token = ethTokenList.find(token => token.token === selectedToken);
      if (token) return token.balance;
    }
    return 0;
  };

  React.useEffect(() => {
    if (chainId && account) {
      getPolygonWalletBalances(account, chainId).then(resp => {
        setEthTokenList(
          resp.data.items.map(item => ({
            balance: Number(item.balance / 10 ** item.contract_decimals),
            decimalBalanace: item.balance,
            contractAddress: item.contract_address,
            contractDecimals: item.contract_decimals,
            name: item.contract_name,
            token: item.contract_ticker_symbol,
            Type: COVALENT_BALANCE_TYPE[item.type],
          }))
        );
      });
    }
  }, [chainId, account]);

  const hasWalletConnection = () => {
    if (originNetwork === "PRIVI" && priviWalletAddress) {
      return true;
    } else if (originNetwork === "SUBSTRATE") {
      const polkadotWallets = walletsList.filter(wallet => wallet.name.toUpperCase() === "POLKADOT");
      return polkadotWallets.length > 0;
    } else if (originNetwork === "POLYGON") {
      if (active && chainId && account && POLYGON_CHAIN_IDS.includes(chainId)) {
        return true;
      }
    }
    return false;
  };

  const handleOpenSignatureModal = () => {
    if (canDoTransaction()) {
      let payload;
      if (isDirect) {
        payload = {
          Type: "Transfer",
          Token: selectedToken,
          From: priviWalletAddress,
          To: recipient,
          Amount: amountValue,
        };
      } else {
        const startingDate = Math.floor(fromDate.getTime() / 1000);
        const endingDate = Math.floor(endDate.getTime() / 1000);
        const amountPerSec = Number(amountValue) / (endingDate - startingDate);
        payload = {
          Type: "Streaming Transfer",
          SenderAddress: priviWalletAddress,
          ReceiverAddress: recipient,
          Token: selectedToken,
          Frequency: "1",
          Amount: amountPerSec,
          StartingDate: startingDate,
          EndingDate: endingDate,
        };
      }
      if (payload) {
        payloadRef.current = payload;
        setSignRequestModalDetail(buildJsxFromObject(payload));
        setOpenSignRequestModal(true);
      }
    }
  };

  const handleConfirmSignature = () => {
    const payload = payloadRef.current;
    if (isDirect) {
      transfer(payload, {}).then(resp => {
        if (resp?.success) showAlertMessage("Token transfered", { variant: "success" });
        else showAlertMessage("Token transfer failed", { variant: "error" });
      });
    } else {
      createStreaming(payload, {}).then(resp => {
        if (resp?.success) showAlertMessage("Token streaming strated", { variant: "success" });
        else showAlertMessage("Streaming transfer failed", { variant: "error" });
      });
    }
  };

  const canDoTransaction = () => {
    if (!selectedToken) {
      showAlertMessage("A token should be selected", { variant: "error" });
      return false;
    } else if (!amountValue || Number(amountValue) <= 0) {
      showAlertMessage("Invalid quantity", { variant: "error" });
      return false;
    } else if (Number(amountValue) > getMaxQuantity()) {
      showAlertMessage("Insufficient balance", { variant: "error" });
      return false;
    }
    if (!recipient || !recipient.startsWith("0x")) {
      showAlertMessage("Invalid recipient", { variant: "error" });
      return false;
    }
    if (!isDirect) {
      if (fromDate >= endDate) {
        showAlertMessage("To Date have to be later than From Date", { variant: "error" });
        return false;
      }
    }
    return true;
  };

  const fetchSubstrateBalances = async () => {
    const balances = await Promise.all(
      substrateTokens.map(async token => {
        const { name } = token;
        const contract = ContractInstance(api!, JSON.stringify(token.meta), token.address);

        const { result, output, gasConsumed } = await (
          await contract
        ).query.balanceOf(polkadotWalletAddress, { value: 0, gasLimit: -1 }, polkadotWalletAddress);
        const balance = output ? Number(output.toString()) / 10 ** 12 : 0;
        return {
          Token: name,
          token: name,
          Type: "CRYPTO",
          Balance: balance,
          Chain: "SUBS",
          Debt: 0,
          InitialBalance: balance,
          LastUpdate: 0,
          NextUpdate: 0,
        };
      })
    );
    return balances;
  };

  const transferSubstrateToken = async () => {
    try {
      const toUser = users.find(u => {
        return u.address === recipient && u.wallets.find(wallet => wallet.name.toUpperCase() === "POLKADOT");
      });
      const toAddress = toUser
        ? toUser.wallets.find(wallet => wallet.name.toUpperCase() === "POLKADOT").address
        : "";
      const token = substrateTokens.find(token => selectedToken === token.name);
      const contract = ContractInstance(api as any, JSON.stringify(token?.meta), (token as any).address);

      const value = 0;
      const gasLimit = 30000 * 10000000;

      const aliceAddress = "5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY";
      const accountPair =
        polkadotWalletAddress && keyringState === "READY" && (keyring as any).getPair(polkadotWalletAddress);
      console.log(polkadotWalletAddress);
      console.log(accountPair);
      if (accountPair.isLocked) {
        accountPair.unlock();
      }

      setLoading(false);

      await (await contract).tx
        .transfer({ value, gasLimit }, toAddress, amountValue)
        .signAndSend(accountPair, async result => {
          console.log({ result });
          showAlertMessage("Tokens send successfully!", { variant: "success" });
        });
    } catch (e) {
      showAlertMessage(e.message || "Substrate token transfer faild", { variant: "error" });
    }
  };

  const stopPolygonStreaming = (streamId: number, endDate: number) => {
    const currentTime = new Date().getTime();
    const elapse = endDate - currentTime;

    setIsStreaming(true);

    setTimeout(async () => {
      showAlertMessage(`Stop streaming ${streamId}`, { variant: "info" });
      try {
        await stopStreamPolygonToken(
          new Web3(library.provider),
          {
            account,
            streamId,
            token: selectedToken,
          },
          showAlertMessage
        );
      } catch (e) {
        console.log("stopStreamPolygonToken", e);
      } finally {
        setIsStreaming(false);
      }
    }, elapse);
  };

  const transferPolygonNetwork = async () => {
    if (!account) throw new Error("Not connected to Metamask wallet");

    const web3 = new Web3(library.provider);
    const ethToken = ethTokenList.filter(token => token.token === selectedToken)[0];
    const bnAmount = web3.utils.toBN(amountValue + new Array(ethToken.contractDecimals).fill("0").join(""));

    try {
      setLoading(true);

      if (isDirect) {
        await transferPolygonToken(
          web3,
          account,
          {
            to: recipient,
            amount: bnAmount,
            token: selectedToken,
          },
          showAlertMessage
        );
      } else {
        await streamPolygonToken(
          web3,
          account,
          {
            to: recipient,
            amount: bnAmount,
            startSec: Math.floor(fromDate.getTime() / 1000),
            endSec: Math.floor(endDate.getTime() / 1000),
            token: selectedToken,
          },
          payload => WalletAPIProvider.recordStartedStreaming(payload),
          showAlertMessage
        );
      }
    } catch (e) {
    } finally {
      setLoading(false);
    }
  };

  const handleClickSend = async () => {
    if (canDoTransaction()) {
      if (originNetwork === "PRIVI") {
        handleOpenSignatureModal();
      } else if (originNetwork === "SUBSTRATE") {
        transferSubstrateToken();
      } else if (originNetwork === "POLYGON" && account) {
        await transferPolygonNetwork();
        // Used for manual stopping
        // await stopPolygonStreaming(23, (new Date()).getTime() + 2);
      }
    }
  };

  return (
    <Box className={classes.container}>
      <Box className={classes.types}>
        <Box
          className={`${classes.type} ${isDirect ? classes.typeSelected : ""}`}
          onClick={() => setIsDirect(true)}
        >
          <img src={require("assets/icons/instant-flag.png")} />
          <Box>
            <Box className={classes.header1}>Instant</Box>
            <Box className={classes.header2}>Send tokens in a single transaction</Box>
          </Box>
        </Box>
        <Box
          className={`${classes.type} ${!isDirect ? classes.typeSelected : ""}`}
          ml={2}
          onClick={() => setIsDirect(false)}
        >
          <img src={require("assets/icons/streaming-flag.png")} />
          <Box>
            <Box className={classes.header1}>Streaming</Box>
            <Box className={classes.header2}>ITransfer tokens for a time period</Box>
          </Box>
        </Box>
      </Box>

      <Box className={classes.flexBox} flexDirection="column">
        <Box className={classes.shadowBox} mt={3}>
          <Box className={classes.contentTitle} style={{ marginBottom: "32px" }}>
            Token Type
          </Box>
          <div className={`${classes.flexBox} ${classes.typesBox}`}>
            {TOKEN_TYPES.map((item, index) => (
              <Box
                key={index}
                className={`${classes.typeBox} ${item === tokenType ? classes.selectedTypeBox : ""}`}
                mr={2}
                onClick={() => setTokenType(item)}
              >
                {item}
              </Box>
            ))}
          </div>
          <Grid container spacing={3} alignItems="flex-end">
            <Grid item md={12} xs={12} style={{ marginBottom: "40px" }}>
              <div className={classes.contentTitle}>Chain Network</div>
              <NetworkTokenSelect
                token={originNetwork}
                setToken={setOriginNetwork}
                BlockchainNets={BlockchainNets}
              />
              <Box
                className={classes.flexBox}
                justifyContent="space-between"
                mt={"8px"}
                fontSize="14px"
                fontFamily="Montserrat"
              >
                <Box color="#F43E5F">
                  {!hasWalletConnection() && <span>You don’t have a connected wallet</span>}
                </Box>
                {!hasWalletConnection() && (
                  <Box
                    fontWeight="bold"
                    style={{ cursor: "pointer", textTransform: "uppercase" }}
                    color="#4218B5"
                    onClick={() => {
                      if (originNetwork === "POLYGON") {
                        activate(polygonConnector);
                      } else {
                        setOpenAddWalletDlg(true);
                      }
                    }}
                  >
                    Connect Wallet
                  </Box>
                )}
              </Box>
            </Grid>
            <Grid item md={6} xs={12}>
              <div className={classes.contentTitle}>Asset</div>
              <TokenSelect
                value={selectedToken}
                onChange={e => setSelectedToken(e.target.value)}
                tokens={getTokenList()}
              />
              <Box
                className={classes.flexBox}
                fontWeight={500}
                mt={"8px"}
                fontSize="14px"
                fontFamily="Montserrat"
              >
                <Box className={classes.flexBox}>
                  <Box color={Color.MusicDAOLightBlue}>Available</Box>
                  <Box color={Color.Black} fontWeight={600} ml={"8px"}>
                    {getMaxQuantity()} {selectedToken}
                  </Box>
                </Box>
                <Box
                  color="#4218B5"
                  onClick={() => setAmountValue(getMaxQuantity())}
                  style={{ cursor: "pointer" }}
                  ml={"24px"}
                >
                  Use Max.
                </Box>
              </Box>
            </Grid>
            <Grid item md={6} xs={12}>
              <div className={classes.contentTitle}>Amount</div>
              <InputWithLabelAndTooltip
                type="text"
                inputValue={amountValue}
                onInputValueChange={e => setAmountValue(e.target.value)}
                style={{ margin: 0 }}
              />
              <Box
                className={classes.flexBox}
                mt={"8px"}
                fontSize="14px"
                fontFamily="Montserrat"
                justifyContent="flex-end"
              >
                <div color={Color.MusicDAOLightBlue}>Txn Fee</div>
                <Box color={Color.Black} fontWeight={600} ml={"8px"}>
                  0 PRIVI
                </Box>
              </Box>
            </Grid>

            {!isDirect && (
              <>
                <Grid item md={3} sm={6} xs={12}>
                  <Box className={classes.contentTitle}>From</Box>
                  <DateInput value={fromDate} onChange={date => setFromDate(date)} width="100%" />
                </Grid>

                <Grid item md={3} sm={6} xs={12} style={{ paddingLeft: 0 }}>
                  <TimeInput
                    minDate={new Date()}
                    format="HH:mm"
                    value={fromDate}
                    onChange={date => setFromDate(date)}
                    width="100%"
                  />
                </Grid>
                <Grid item md={3} sm={6} xs={12}>
                  <Box className={classes.contentTitle}>To</Box>
                  <DateInput value={endDate} onChange={date => setEndDate(date)} width="100%" />
                </Grid>
                <Grid item md={3} sm={6} xs={12} style={{ paddingLeft: 0 }}>
                  <TimeInput
                    minDate={new Date()}
                    format="HH:mm"
                    value={endDate}
                    onChange={date => setEndDate(date)}
                    width="100%"
                  />
                </Grid>
              </>
            )}

            <Grid item md={12} xs={12}>
              <Box className={classes.contentTitle}>Recipient Address</Box>
              <InputBase
                placeholder={"Enter recipient address"}
                className={classes.autocomplete}
                value={recipient}
                onChange={e => setRecipient(e.target.value)}
              />
            </Grid>
          </Grid>
        </Box>

        <LoadingWrapper loading={loading}>
          <PrimaryButton
            size="medium"
            disabled={isStreaming}
            onClick={handleClickSend}
            style={{ width: "100%", marginTop: "20px", fontWeight: 400, fontSize: "18px" }}
          >
            Submit
          </PrimaryButton>
        </LoadingWrapper>
      </Box>
      <SignatureRequestModal
        open={openSignRequestModal}
        address={user.address}
        transactionFee="0.0000"
        detail={signRequestModalDetail}
        handleOk={handleConfirmSignature}
        handleClose={() => setOpenSignRequestModal(false)}
      />
      <ConnectWalletModal
        open={openAddWalletDlg}
        handleClose={() => setOpenAddWalletDlg(false)}
        walletsList={walletsList}
        setWalletsList={setWalletsList}
        connectPrivi={() => {}}
      />
    </Box>
  );
}
