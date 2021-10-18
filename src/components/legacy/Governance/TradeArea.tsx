import React from "react";
import { useSelector } from "react-redux";
import { Color, FontSize, Header3, Header4, HeaderBold4, PrimaryButton, StyledDivider, Text } from "shared/ui-kit";
import { Input } from "shared/ui-kit/inputs";
import { Dropdown } from "shared/ui-kit/Select/Select";
import { TokenSelect } from "shared/ui-kit/Select/TokenSelect";
import { RootState } from "store/reducers/Reducer";
import { SignatureRequestModal } from "shared/ui-kit/Modal/Modals";
import { signTransaction } from "shared/functions/signTransaction";
import AlertMessage from "shared/ui-kit/Alert/AlertMessage";
import * as API from "shared/services/API/TradeAPI";
import { BlockchainNets } from "shared/constants/constants";
import { useSubstrate } from "shared/connectors/substrate";
import { ContractInstance, decodeAbiData } from "shared/connectors/substrate/functions";
import STABLECOINCONTRACT from "shared/connectors/substrate/contracts/StableCoin.json";
import { STABLECOIN_CONTRACT } from "shared/connectors/substrate/config/test.json";
import Box from "shared/ui-kit/Box";
import "./Governance.css";

const TradeArea = () => {

  const userSelector = useSelector((state: RootState) => state.user);
  const [haveTokens, setHaveTokens] = React.useState<any[]>([]);
  const [getTokens, setGetTokens] = React.useState<any[]>([]);
  const [haveToken, setHaveToken] = React.useState<string>('');
  const [getToken, setGetToken] = React.useState<string>('');
  const [status, setStatus] = React.useState<any>("");
  const [amount, setAmount] = React.useState<number>(0);
  const [convertAmount, setConvertAmount] = React.useState<number>(0);
  const [openSignRequestModal, setOpenSignRequestModal] = React.useState<boolean>(false);
  const [signRequestModalDetail, setSignRequestModalDetail] = React.useState<any>(null);
  const [blockchainNet, setBlockchainNet] = React.useState<string>('Privi Chain');
  const { api, apiState, keyring, keyringState } = useSubstrate();

  React.useEffect(()=> {
    setAmount(0);
    setHaveTokens([
      {
        token: "PRIVI",
        name: "PRIVI"
      },
      {
        token: "pUSD",
        name: "pUSD"
      }
    ]);
    const tokens = haveTokens.filter((token)=> token.name !== haveToken)
    console.log({tokens, haveTokens});
    setGetTokens(tokens);
  }, [haveToken]);

  React.useEffect(() => {
    if(haveToken === "PRIVI"){
      setConvertAmount(amount * 0.1);
    } else {
      setConvertAmount(amount * 10);
    }
  }, [amount, haveToken])

  const handleTrade = async () => {
    console.log({blockchainNet});
    if(blockchainNet === "Privi Chain")
      setOpenSignRequestModal(true);
    else {
      if (!api) return;
      const contract = ContractInstance(api, JSON.stringify(STABLECOINCONTRACT), STABLECOIN_CONTRACT);

      const keyringOptions = (keyring as any).getPairs().map(account => ({
        key: account.address,
        value: account.address,
        text: account.meta.name ? account.meta.name.toUpperCase() : "",
        icon: "user",
      }));

      const accountAddress = keyringOptions.length > 0 ? keyringOptions[0].value : "";

      const accountPair =
        accountAddress && keyringState === "READY" && (keyring as any).getPair(accountAddress);

      const value = 0;
      const gasLimit = 30000 * 10000000;

      if(haveToken === 'PRIVI'){
        await (await contract).tx.convertToPusd(
          { value, gasLimit },
          {
            address: accountPair.address,
            amount: amount
          }
        )
        .signAndSend(accountPair, async result => {
          if (result.status.isInBlock) {
            console.log("in a block");
          } else if (result.status.isError) {
            setStatus({
              msg: "Error when making the request",
              key: Math.random(),
              variant: "error",
            });
          } else if (result.status.isFinalized) {
            result.events
            .filter(({ event }) => api?.events.system.ExtrinsicSuccess.is(event))
            .forEach(({ event }) => {
              const [dispatchInfo] = event.data;
              console.log(dispatchInfo.toHuman());
            })

            const events = result.events
            .filter(({ event }) => api?.events.contracts.ContractEmitted.is(event))
            .forEach(
              async ({
                event: {
                  data: [, data],
                },
              }) => {
                const { args } = decodeAbiData(api, JSON.stringify(STABLECOINCONTRACT), data);
                let blockchainRes: any = args[0].toHuman();
                console.log("ContractEmitted: state => ", blockchainRes);
              }
            );
            if (events && events.length) {
              setStatus({
                msg: "Error when making the request",
                key: Math.random(),
                variant: "error",
              });
            } else {
              setStatus({
                msg: "Convert Privi to pUSD successfully",
                key: Math.random(),
                variant: "success",
              });
            }
          }
        });
      } else {
        await (await contract).tx.convertToPrivi(
          { value, gasLimit },
          {
            address: accountPair.address,
            amount: amount
          }
        )
        .signAndSend(accountPair, async result => {
          if (result.status.isInBlock) {
            console.log("in a block");
          } else if (result.status.isError) {
            setStatus({
              msg: "Error when making the request",
              key: Math.random(),
              variant: "error",
            });
          } else if (result.status.isFinalized) {
            result.events
            .filter(({ event }) => api?.events.system.ExtrinsicSuccess.is(event))
            .forEach(({ event }) => {
              const [dispatchInfo] = event.data;
              console.log(dispatchInfo.toHuman());
            })

            const events = result.events
            .filter(({ event }) => api?.events.contracts.ContractEmitted.is(event))
            .forEach(
              async ({
                event: {
                  data: [, data],
                },
              }) => {
                const { args } = decodeAbiData(api, JSON.stringify(STABLECOINCONTRACT), data);
                let blockchainRes: any = args[0].toHuman();
                console.log("ContractEmitted: state => ", blockchainRes);
              }
            );
            if (events && events.length) {
              setStatus({
                msg: "Error when making the request",
                key: Math.random(),
                variant: "error",
              });
            } else {
              setStatus({
                msg: "Convert pUSD to PRIVI successfully",
                key: Math.random(),
                variant: "success",
              });
            }
          }
        });
      }
    }
  }

  const handleConfirmSign = async () => {
    const sigBody = {
      UserAddress: userSelector.id,
      Token: haveToken,
      Amount: Number(amount),
    };
    const [hash, signature] = await signTransaction(userSelector.mnemonic, sigBody);
    console.log({hash, signature});
    const requestBody = {
      signature,
      address: userSelector.address,
      amount
    }
    if(haveToken === 'PRIVI'){
      const resp = await API.convertPrivi(requestBody);
      if(resp.success) {
        setStatus({
          msg: "Convert Privi to PUSD successfully",
          key: Math.random(),
          variant: "success",
        });
        setTimeout(() => {
          setSignRequestModalDetail(false);
        }, 1000);
      } else {
        setStatus({
          msg: "Convert Privi to PUSD failed",
          key: Math.random(),
          variant: "error",
        });
        setTimeout(() => {
          setSignRequestModalDetail(false);
        }, 1000);
      }
    } else {
      const resp = await API.convertPusd(requestBody);
      if(resp.success) {
        setStatus({
          msg: "Convert pUSD to PRIVI successfully",
          key: Math.random(),
          variant: "success",
        });
        setTimeout(() => {
          setSignRequestModalDetail(false);
        }, 1000);
      } else {
        setStatus({
          msg: "Convert pUSD to PRIVI failed",
          key: Math.random(),
          variant: "error",
        });
        setTimeout(() => {
          setSignRequestModalDetail(false);
        }, 1000);
      }
    }

  }

  const handleAmount = (value) => {
    setAmount(value);
  }

  return (
    <div className="governancePage">
      <div className="headerPriviGovernance">
        <SignatureRequestModal
          open={openSignRequestModal}
          address={userSelector.address}
          transactionFee="0.0000"
          detail={signRequestModalDetail}
          handleOk={handleConfirmSign}
          handleClose={() => setOpenSignRequestModal(false)}
        />
        <div className="headerSelectedTabPriviGovernance headerLabel">Trade Area</div>
        <Header4>Make Transacitons Between the <b>Most Popular Coins on Privi</b> Platform</Header4>
        <div className="headerGovernanceTradeBox">
          <img src={require("assets/priviIcons/vault.png")} alt="vault" />
          <Box display="flex" flexDirection="row" alignItems="flex-end" flex={1} ml={2}>
            <Box>
              <Text color={Color.White} size={FontSize.XXL}>I Have</Text>
              <div className="tokenSelectorBox">
                <Input value={amount} onChange={(e)=>handleAmount(e.target.value)} />
                <TokenSelect
                  className="tokenSelector"
                  tokens={haveTokens}
                  value={haveToken}
                  onChange={e => {
                    setHaveToken(e.target.value);
                  }}
                />
              </div>
            </Box>
            <Box ml={3}>
              <Text color={Color.White} size={FontSize.XXL}>I’ll Get</Text>
              <div className="tokenSelectorBox">
                <Input value={convertAmount} />
                <TokenSelect
                  className="tokenSelector"
                  tokens={getTokens}
                  value={getToken}
                  onChange={e => {
                    setGetToken(e.target.value);
                  }}
                />
              </div>
            </Box>
            <Box display="flex" flexDirection="column" mt={2} mb={2}>
              <Dropdown
                value={blockchainNet}
                menuList={BlockchainNets}
                onChange={e=>setBlockchainNet(e.target.value)}
                hasImage
              />
            </Box>
            <PrimaryButton size="medium" onClick={handleTrade}>Trade</PrimaryButton>
          </Box>
        </div>
        <Box mt={4} display="flex" flexDirection="row" justifyContent="space-between">
          <Box width={1} mr={3}>
            <StyledDivider type="solid" mb={2} />
            <HeaderBold4 noMargin>Privi - USD</HeaderBold4>
            <StyledDivider type="solid" mb={2} />
            <Box display="flex" flexDirection="row">
              <Box display="flex" flexDirection="column" mr={2}>
                <Text size={FontSize.XL} mb={1}>Price</Text>
                <Header3 noMargin>$34</Header3>
                <Text size={FontSize.XL} mt={1} color={Color.Green}>+3 (+11.5%)</Text>
              </Box>
              <Box display="flex" flexDirection="column">
                <Text size={FontSize.XL} mb={1}>Total Supply</Text>
                <Header3 noMargin>$1,897,007</Header3>
                <Text size={FontSize.XL} mt={1} color={Color.Green}>$1,897,007</Text>
              </Box>
            </Box>
            <StyledDivider type="solid" mt={2} />
          </Box>
          <Box width={1} mx={3}>
            <StyledDivider type="solid" mb={2} />
            <HeaderBold4 noMargin>USDp - USD</HeaderBold4>
            <StyledDivider type="solid" mb={2} />
            <Box display="flex" flexDirection="row">
              <Box display="flex" flexDirection="column" mr={2}>
                <Text size={FontSize.XL} mb={1}>Price</Text>
                <Header3 noMargin>$34</Header3>
                <Text size={FontSize.XL} mt={1} color={Color.Green}>+3 (+11.5%)</Text>
              </Box>
              <Box display="flex" flexDirection="column">
                <Text size={FontSize.XL} mb={1}>Total Supply</Text>
                <Header3 noMargin>$1,897,007</Header3>
                <Text size={FontSize.XL} mt={1} color={Color.Green}>$1,897,007</Text>
              </Box>
            </Box>
            <StyledDivider type="solid" mt={2} />
          </Box>
          <Box width={1} ml={3}>
            <StyledDivider type="solid" mb={2} />
            <HeaderBold4 noMargin>DATAp- USD</HeaderBold4>
            <StyledDivider type="solid" mb={2} />
            <Box display="flex" flexDirection="row">
              <Box display="flex" flexDirection="column" mr={2}>
                <Text size={FontSize.XL} mb={1}>Price</Text>
                <Header3 noMargin>$34</Header3>
                <Text size={FontSize.XL} mt={1} color={Color.Red}>+3 (+11.5%)</Text>
              </Box>
              <Box display="flex" flexDirection="column">
                <Text size={FontSize.XL} mb={1}>Total Supply</Text>
                <Header3 noMargin>$1,897,007</Header3>
                <Text size={FontSize.XL} mt={1} color={Color.Red}>$1,897,007</Text>
              </Box>
            </Box>
            <StyledDivider type="solid" mt={2} />
          </Box>
        </Box>
      </div>
      {status ? (
          <AlertMessage
            key={status.key}
            message={status.msg}
            variant={status.variant}
          />
        ) : (
          ""
        )}
    </div>
  )
}

export default TradeArea;
