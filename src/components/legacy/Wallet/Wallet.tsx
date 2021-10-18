import "./Wallet.css";
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import {
  ClickAwayListener,
  createStyles,
  Grow,
  makeStyles,
  MenuList,
  Paper,
  Popper,
  Theme,
} from "@material-ui/core";
import { useTypedSelector } from "store/reducers/Reducer";
import TokenCard from "./components/TokenCard/TokenCard";
import SendTokensModal from "./components/SendTokensModal";
import { formatNumber } from "shared/functions/commonFunctions";
import Swap from "shared/connectors/bridge/SwapModal";
import TransactionHistoryModal from "./components/TransactionHistoryModal/TransactionHistoryModal";

// ----------------- For the balance Graphs ---------------------
import PrintWalletChart from "./components/Wallet-Chart/Wallet-Chart";
import CryptoChartConfig from "./components/Wallet-Chart/configs/Crypto-Chart-Config";
import FTChartConfig from "./components/Wallet-Chart/configs/FT-Chart-Config";
import NFTChartConfig from "./components/Wallet-Chart/configs/NFT-Chart-Config";
import SocialChartConfig from "./components/Wallet-Chart/configs/Social-Chart-Config";
import { StyledMenuItem, StyledSelect } from "shared/ui-kit/Styled-components/StyledComponents";
import PrintWalletGraph from "./components/Wallet-Graph/WalletGraph";
import Sidebar from "./components/Sidebar/Sidebar";
import { GenericGrid } from "shared/ui-kit/GenericGrid/GenericGrid";

import { getWaxInstance, getWaxBalances, getWaxNFTs } from "shared/connectors/bridge/wax";

import URL from "shared/functions/getURL";
import { LoadingWrapper } from "shared/ui-kit/Hocs";
import { useSubstrate } from "shared/connectors/substrate";
import { ContractInstance } from "shared/connectors/substrate/functions";
import ERC20_META from "shared/connectors/substrate/contracts/ERC20_META.json";
import substrateTokens from "shared/connectors/substrate/tokens";

import { PrimaryButton } from "shared/ui-kit";
import { SearchWithCreate } from "shared/ui-kit/SearchWithCreate";
// ---------------------------------------------------

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: "flex",
    },
    paper: {
      width: 320,
      marginTop: 80,
      marginLeft: -300,
      borderRadius: 10,
      boxShadow: "0px 2px 20px rgba(0, 0, 0, 0.1)",
      position: "inherit",
    },
    menuList: {
      maxHeight: 200,
      overflowY: "auto",
    },
  })
);

interface TokenTypeInfo {
  balanceInUSD: number;
  balanceInETH: number;
}

const tokenTypeInfoInit = {
  balanceInUSD: 0,
  balanceInETH: 0,
};

const columnsCountBreakPoints = { 1400: 5, 1200: 4, 900: 3, 670: 2 };
//----------------------------

//TODO: get and manage wallets

const Wallet = () => {
  const classes = useStyles();
  // STORE
  const user = useTypedSelector(state => state.user);
  const userBalances = useTypedSelector(state => state.userBalances);

  // HOOKS
  const [tokensRateChange, setTokensRateChange] = useState<{}>({}); // difference of currentRate respect lastRate
  const [tabsTokenValue, setTabsTokenValue] = useState(0);
  const [totalBalance, setTotalBalance] = useState<Number>(0);
  const [selectedWallet, setSelectedWallet] = useState<any>();
  const [walletList, setWalletList] = useState<any[]>([]);
  const [waxWallet, setWaxWallet] = useState<any>();
  const [externalWaxWallet, setExternalWaxWallet] = useState<any>([]);

  const [openTranscationHistory, setOpenTranscationHistory] = useState<boolean>(false);
  const [disableClick, setDisableClick] = useState<boolean>(false);
  const [openAtomicSwap, setOpenAtomicSwap] = useState<boolean>(false);
  const [openSendTokens, setOpenSendTokens] = useState<boolean>(false);

  const [cryptoChart, setCryptoChart] = useState<any>(CryptoChartConfig);
  const [ftChart, setFTChart] = useState<any>(FTChartConfig);
  const [nftChart, setNFTChart] = useState<any>(NFTChartConfig);
  const [socialChart, setSocialChart] = useState<any>(SocialChartConfig);
  const [showBalances, setShowBalances] = useState<boolean>(true);

  const externalBalancesRef = useRef<any>({});
  const [userCurrBalances, setUserCurrBalances] = useState<any>({});
  const [tokenBalanceList, setTokenBalanceList] = useState<any[]>([]); // balance objs in list
  const [substrateTokenBalanceList, setSubstrateTokenBalanceList] = useState<any[]>([]);
  const [tokensLoading, setTokensLoading] = useState<boolean>(false);
  const [searchToken, setSearchToken] = useState<string>("");
  const [sortToken, setSortToken] = useState<string>("Last Transaction");
  const [cryptoBalanceInfo, setCryptoBalanceInfo] = useState<TokenTypeInfo>({
    ...tokenTypeInfoInit,
  });
  const [ftBalanceInfo, setFTBalanceInfo] = useState<TokenTypeInfo>({
    ...tokenTypeInfoInit,
  });
  const [nftBalanceInfo, setNFTBalanceInfo] = useState<TokenTypeInfo>({
    ...tokenTypeInfoInit,
  });
  const [socialBalanceInfo, setSocialBalanceInfo] = useState<TokenTypeInfo>({
    ...tokenTypeInfoInit,
  });
  const [openSidebar, setOpenSidebar] = useState<boolean>(false);
  const [openWalletsMenu, setOpenWalletsMenu] = React.useState(false);

  const [isWalletLoading, setIsWalletLoading] = useState<boolean>(false);
  const [isGraphLoading, setIsGraphLoading] = useState<boolean>(false);

  const anchorWalletsMenuRef = React.useRef<HTMLImageElement>(null);
  const rateOfChangeRef = useRef<any>({});

  // return focus to the button when we transitioned from !open -> open
  const prevWalletsMenuOpen = React.useRef(openWalletsMenu);

  const { api, apiState, keyring, keyringState } = useSubstrate();

  useEffect(() => {
    if (prevWalletsMenuOpen.current === true && openWalletsMenu === false) {
      anchorWalletsMenuRef.current!.focus();
    }
    prevWalletsMenuOpen.current = openWalletsMenu;
  }, [openWalletsMenu]);

  useEffect(() => {
    axios
      .get(`${URL()}/wallet/getUserRegisteredWallets`)
      .then(res => {
        if (res.data.success) {
          const wallets = res.data.data.filter(w => w.walletType === "WAX");
          if (wallets.length > 0) {
            initWaxNetworkSetting(wallets[0]);
          }
        }
      })
      .catch(err => {
        console.error("Swap-Modal connect getUserRegisteredEthAccount failed", err);
      });
  }, []);

  const fetchSubstrateBalances = async walletAddress => {
    const balances = await Promise.all(
      substrateTokens.map(async token => {
        const { name, address } = token;
        const contract = ContractInstance(api!, JSON.stringify(ERC20_META), token.address);

        const value = 0;
        const gasLimit = 30000 * 10000000;

        // const { result, output, gasConsumed } = await (await contract)
        //   .read("balanceOf", { value, gasLimit }, walletAddress)
        //   .send(walletAddress);
        // const balance = output ? Number(output.toString()) / 10 ** 12 : 0;
        const balance = 0;
        console.log({ balance });
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

  // filter tokens when tab or userCurrBalances obj changed
  useEffect(() => {
    let newTokenList: any[] = [];
    let token = "";
    let val: any = null;

    setTokensLoading(true);
    // -------- PRIVI -----------
    // add and filter from userCurrBalances
    for ([token, val] of Object.entries(userCurrBalances)) {
      if (filterTokenType(tabsTokenValue, val.Type))
        newTokenList.push({
          ...val,
          Chain: "PRIVI",
        });
    }
    // -------- ETHEREUM -----------
    const externalWallet: any = externalBalancesRef.current;
    for ([token, val] of Object.entries(externalWallet)) {
      if (filterTokenType(tabsTokenValue, val.Type)) {
        newTokenList.push(val);
      }
    }

    // -------- WAX ----------------
    externalWaxWallet.map(wallet => {
      if (wallet && wallet.Type && filterTokenType(tabsTokenValue, wallet.Type)) {
        newTokenList.push(wallet);
      }
    });

    if (searchToken !== "") {
      newTokenList = newTokenList.filter(token =>
        token.Token.toUpperCase().includes(searchToken.toUpperCase())
      );
    }

    // -------- Substrate ------------
    const polkadotWallet = walletList.filter(wallet => wallet.name.toUpperCase() === "POLKADOT");
    if (polkadotWallet.length) {
      fetchSubstrateBalances(polkadotWallet[0].address).then(data => {
        setSubstrateTokenBalanceList(data);
      });
    }

    setTokenBalanceList(newTokenList);
    setTokensLoading(false);
  }, [tabsTokenValue, userCurrBalances, user.ethExternalWallet, searchToken, sortToken, externalWaxWallet]);

  // load external wallet
  useEffect(() => {
    const externalWallet: any = {};
    if (user && user.ethExternalWallet) {
      user.ethExternalWallet.forEach(extWalletObj => {
        const tokens = extWalletObj.tokens ?? [];
        tokens.forEach((tokenObj: any) => {
          const tokenType = tokenObj.tokenType ?? "";
          let imgUrl = "none";
          if (tokenObj.isOpenSea && tokenObj.openSeaImage && tokenObj.openSeaImage.includes("http"))
            imgUrl = tokenObj.openSeaImage;
          else if (tokenObj.images && tokenObj.images.small) imgUrl = tokenObj.images.small;
          const token = tokenObj.tokenSymbol;
          const tokenName = tokenObj.tokenName;
          // calculate balance
          const decimalPos = Number(tokenObj.tokenDecimal) ?? 0;
          const balanceStr: string = tokenObj.balance;
          const balanceStrWithDecimal =
            balanceStr.slice(0, -decimalPos) + "." + balanceStr.slice(-decimalPos + 1);
          const balance = Number(balanceStrWithDecimal);

          if (externalWallet[token]) externalWallet[token].Balance += balance;
          else
            externalWallet[token] = {
              Token: token,
              TokenName: tokenName,
              Balance: balance,
              Type: tokenType,
              ImageUrl: imgUrl,
              Chain: "Ethereum",
            };
        });
      });
    }
    externalBalancesRef.current = externalWallet;
  }, [user.ethExternalWallet]);

  // create interval to update balance each sec
  useEffect(() => {
    if (userBalances) {
      updateUserBalances();
      const interval = setInterval(() => {
        updateUserBalances();
      }, 1200);
      return () => clearInterval(interval);
    }
  }, [userBalances]);

  useEffect(() => {
    if (user && user.id) {
      loadData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user.id]);

  const isSignedIn = () => {
    return !!sessionStorage.getItem("token");
  };

  // FUNCTIONS
  const handleOpenAtomicSwap = () => {
    setOpenAtomicSwap(true);
  };

  const handleOpenSendTokens = () => {
    setOpenSendTokens(true);
  };

  const handleCloseAtomicSwap = () => {
    setOpenAtomicSwap(false);
  };

  const handleCloseSendTokens = () => {
    setOpenSendTokens(false);
  };

  // periodical function: load user balance from redux store and calculate current balance based on current time
  const updateUserBalances = () => {
    const rateOfChange = rateOfChangeRef.current;
    const ethRate = rateOfChange.ETH ?? 1;
    const newUserBalances: any = {};
    // total balances
    let newTotalBalance = 0;
    let newTotalCrypto = 0;
    let newTotalNFT = 0;
    let newTotalFT = 0;
    let newTotalSocial = 0;
    let newTotalCryptoETH = 0;
    let newTotalNFTETH = 0;
    let newTotalFTETH = 0;
    let newTotalSocialETH = 0;

    const currTime = Math.floor(Date.now() / 1200);
    let token: string = "";
    let obj: any = undefined;
    // PRIVI Wallet
    for ([token, obj] of Object.entries(userBalances)) {
      const newObj = { ...obj };
      const newBalance = Math.max(0, obj.InitialBalance + (currTime - obj.LastUpdate) * obj.AmountPerSecond);
      newObj.Balance = newBalance;
      newUserBalances[token] = newObj;
      // balance in usd
      const rate = rateOfChange[token] ?? 1;
      const newBalanceInUSD = rate * newBalance;
      // add to total balance
      newTotalBalance += newBalanceInUSD;
      // add to corresponding toptal type balance
      if (obj.Type.toUpperCase().includes("NFT") || obj.Type.toUpperCase().includes("MEDIA")) {
        newTotalNFT = newTotalNFT + newBalanceInUSD;
        newTotalNFTETH = newTotalNFTETH + newBalanceInUSD / ethRate;
      } else if (obj.Type.toUpperCase().includes("FT")) {
        newTotalFT += newBalanceInUSD;
        newTotalFTETH += newBalanceInUSD / ethRate;
      } else if (obj.Type.toUpperCase().includes("CRYPTO") || obj.Type.toUpperCase().includes("ERC20")) {
        newTotalCrypto += newBalanceInUSD;
        newTotalCryptoETH += newBalanceInUSD / ethRate;
      } else {
        newTotalSocial += newBalanceInUSD;
        newTotalSocialETH += newBalanceInUSD / ethRate;
      }
    }
    // ETH Wallet
    for ([token, obj] of Object.entries(externalBalancesRef.current)) {
      // balance in usd
      const rate = rateOfChange[token] ?? 1;
      const newBalanceInUSD = rate * obj.Balance;
      // add to total balance
      newTotalBalance += newBalanceInUSD;
      // add to corresponding toptal type balance
      if (obj.Type.toUpperCase().includes("NFT") || obj.Type.toUpperCase().includes("MEDIA")) {
        newTotalNFT = newTotalNFT + newBalanceInUSD;
        newTotalNFTETH = newTotalNFTETH + newBalanceInUSD / ethRate;
      } else if (obj.Type.toUpperCase().includes("FT")) {
        newTotalFT += newBalanceInUSD;
        newTotalFTETH += newBalanceInUSD / ethRate;
      } else if (obj.Type.toUpperCase().includes("CRYPTO") || obj.Type.toUpperCase().includes("ERC20")) {
        newTotalCrypto += newBalanceInUSD;
        newTotalCryptoETH += newBalanceInUSD / ethRate;
      } else {
        newTotalSocial += newBalanceInUSD;
        newTotalSocialETH += newBalanceInUSD / ethRate;
      }
    }
    setUserCurrBalances(newUserBalances);
    setTotalBalance(newTotalBalance);
    setCryptoBalanceInfo({
      balanceInUSD: newTotalCrypto,
      balanceInETH: newTotalCryptoETH,
    });
    setNFTBalanceInfo({
      balanceInUSD: newTotalNFT,
      balanceInETH: newTotalNFTETH,
    });
    setFTBalanceInfo({
      balanceInUSD: newTotalFT,
      balanceInETH: newTotalFTETH,
    });
    setSocialBalanceInfo({
      balanceInUSD: newTotalSocial,
      balanceInETH: newTotalSocialETH,
    });
  };

  const filterTokenType = (tokenIndex, tokenType) => {
    if (tokenIndex === 0) {
      // All
      return true;
    } else if (tokenIndex === 1) {
      if (tokenType.includes("CRYPTO")) {
        // CRYPTO
        return true;
      }
    } else if (tokenIndex === 2) {
      // NFT Pods
      if (tokenType.includes("NFT") || tokenType.includes("MEDIA")) {
        return true;
      }
    } else if (tokenIndex === 3) {
      // FT Pods
      if (tokenType.includes("FT") && !tokenType.includes("NFT") && !tokenType.includes("MEDIA")) {
        return true;
      }
    } else {
      // Social
      if (
        !tokenType.includes("CRYPTO") &&
        !tokenType.includes("MEDIA") &&
        !tokenType.includes("NFT") &&
        !tokenType.includes("FT")
      ) {
        return true;
      }
    }
    return false;
  };

  const initWaxNetworkSetting = async wallet => {
    const wax = getWaxInstance(wallet.name, wallet.pubKey);
    const externalWallet: any[] = [];
    setWaxWallet(wallet);
    const balances = await getWaxBalances(wax, wallet.name);

    await getWaxNFTs(wax, wallet.name);

    balances.map(balance => {
      externalWallet.push({
        Token: balance.symbol,
        TokenName: balance.symbol,
        Balance: balance.amount,
        Type: "NFT",
        ImageUrl: require("assets/walletImages/waxWallet.png"),
        Chain: "WAX",
      });
    });
    setExternalWaxWallet(externalWallet);
  };

  const handleOpenSidebar = () => {
    setOpenSidebar(true);
  };
  const handleCoseSidebar = () => {
    setOpenSidebar(false);
  };

  const handleToggleWalletsMenu = e => {
    e.stopPropagation();
    e.preventDefault();
    if (isSignedIn()) setOpenWalletsMenu(prevWalletsMenuOpen => !prevWalletsMenuOpen);
  };

  const handleCloseWalletsMenu = (event: React.MouseEvent<EventTarget>) => {
    if (anchorWalletsMenuRef.current && anchorWalletsMenuRef.current.contains(event.target as HTMLElement)) {
      return;
    }

    setOpenWalletsMenu(false);
  };

  function handleListKeyDownWalletsMenu(event: React.KeyboardEvent) {
    if (event.key === "Tab") {
      event.preventDefault();
      setOpenWalletsMenu(false);
    }
  }

  const clickTab = index => {
    if (index == 2) {
      getNTFlist();
    }
    setTabsTokenValue(index);
  };
  const getNTFlist = () => {
    const config = {
      params: {
        address: user.address,
      },
    };

    axios.get(`${URL()}/pod/NFT/getNFTsList`, config).then(response => {
      const resp = response.data;
      if (resp.success) {
        setTokenBalanceList(resp.nfts);
      }
    });
  };

  const setGraphData = (graphData: any[], prevLineData: any, tokenType: string) => {
    const formattedGraphData = graphData
      .map(point => {
        return {
          x: point.date,
          y: point.price,
        };
      })
      .reverse()
      .slice(0, 10)
      .reverse();

    const labels = formattedGraphData
      .map(point =>
        new Date(point.x).toLocaleString("eu", {
          day: "numeric",
          month: "numeric",
        })
      )
      .reverse()
      .slice(0, 10)
      .reverse();

    switch (tokenType) {
      case "CRYPTO":
        const newCryptoChart = { ...prevLineData };
        newCryptoChart.config.data.labels = labels;
        newCryptoChart.config.data.datasets[0].data = formattedGraphData;
        setCryptoChart(newCryptoChart);
        break;
      case "FTPOD":
        const newFTChart = { ...prevLineData };
        newFTChart.config.data.labels = labels;
        newFTChart.config.data.datasets[0].data = formattedGraphData;
        setFTChart(newFTChart);
        break;
      case "NFTPOD":
        const newNFTChart = { ...prevLineData };
        newNFTChart.config.data.labels = labels;
        newNFTChart.config.data.datasets[0].data = formattedGraphData;
        setNFTChart(newNFTChart);
        break;
      case "SOCIAL":
        const newSocialChart = { ...prevLineData };
        newSocialChart.config.data.labels = labels;
        newSocialChart.config.data.datasets[0].data = formattedGraphData;
        setSocialChart(newSocialChart);
        break;
    }
  };

  const loadData = () => {
    const config = {
      params: {
        userId: user.id,
      },
    };
    setIsGraphLoading(true);
    axios
      .get(`${URL()}/wallet/getUserTokenTypeBalanceHistory`, config)
      .then(response => {
        const resp = response.data;
        if (resp.success) {
          const data = resp.data;
          setGraphData(data.cryptoHistory, cryptoChart, "CRYPTO");
          setGraphData(data.socialHistory, socialChart, "SOCIAL");
          setGraphData(data.ftHistory, ftChart, "FTPOD");
          setGraphData(data.nftHistory, nftChart, "NFTPOD");
        }
        setIsGraphLoading(false);
      })
      .catch(() => {
        setIsGraphLoading(false);
      });

    axios
      .get(`${URL()}/wallet/getTokensRateChange`)
      .then(res => {
        const resp = res.data;
        if (resp.success) {
          setTokensRateChange(resp.data);
        }
      })
      .catch(error => {
        console.error(error);
      });
    // get token rate of change (conversion to dollar)
    axios
      .get(`${URL()}/wallet/getCryptosRateAsMap`)
      .then(res => {
        const resp = res.data;
        if (resp.success) {
          rateOfChangeRef.current = resp.data;
        }
      })
      .catch(error => {
        console.error(error);
      });
    setIsWalletLoading(true);
    axios
      .get(`${URL()}/wallet/getUserRegisteredWallets`)
      .then(res => {
        const resp = res.data;
        if (res.data.success) {
          setWalletList(res.data.data);
          setSelectedWallet(res.data.data[0]);
        }
        setIsWalletLoading(false);
      })
      .catch(err => {
        console.error("handleConnect getUserRegisteredEthAccount failed", err);
        setIsWalletLoading(false);
      });
  };

  return (
    <div className="wallet-page">
      <LoadingWrapper loading={isWalletLoading}>
        <Sidebar
          open={openSidebar}
          handleClose={handleCoseSidebar}
          walletsList={walletList}
          setWalletsList={setWalletList}
          handleOpenAtomicSwap={handleOpenAtomicSwap}
        />
      </LoadingWrapper>
      <div className={"data"}>
        <div className={"metrics"}>
          <h4>My Wallet in metrics</h4>
          <div className={"row"}>
            <LoadingWrapper loading={isWalletLoading}>
              {selectedWallet && selectedWallet.id ? (
                <div className="currentWallet">
                  <div
                    className={"icon"}
                    style={{
                      backgroundImage:
                        selectedWallet &&
                        selectedWallet.name &&
                        selectedWallet.name.toUpperCase().includes("METAMASK")
                          ? `url(${require("assets/walletImages/metamask.svg")})`
                          : selectedWallet.name === "Polkadot"
                          ? `url(${require("assets/walletImages/polkadot.svg")}`
                          : `url(${require("assets/logos/PRIVILOGO.png")})`,
                      backgroundRepeat: "no-repeat",
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }}
                  />
                  <div className={"info"}>
                    <div className="title">
                      <h4>{selectedWallet && selectedWallet.name ? selectedWallet.name : "name"}</h4>
                      <span>Account</span>
                    </div>
                    <div className={"address"}>
                      {selectedWallet && selectedWallet.id ? selectedWallet.id : ""}
                      {selectedWallet && selectedWallet.id ? (
                        <img
                          src={require("assets/icons/copy.png")}
                          alt={"copy"}
                          onClick={() => {
                            navigator.clipboard.writeText(
                              selectedWallet && selectedWallet.id ? selectedWallet.id : ""
                            );
                          }}
                          style={{ cursor: "pointer" }}
                        />
                      ) : null}
                    </div>
                  </div>
                  <img
                    src={require("assets/icons/arrow.png")}
                    alt={""}
                    className="arrow"
                    onClick={handleToggleWalletsMenu}
                    ref={anchorWalletsMenuRef}
                  />
                  <Popper
                    open={openWalletsMenu}
                    anchorEl={anchorWalletsMenuRef.current}
                    transition
                    disablePortal
                    style={{ position: "inherit" }}
                  >
                    {({ TransitionProps, placement }) => (
                      <Grow
                        {...TransitionProps}
                        style={{
                          transformOrigin: placement === "bottom" ? "center top" : "center bottom",
                          position: "inherit",
                        }}
                      >
                        <Paper className={classes.paper}>
                          <ClickAwayListener onClickAway={handleCloseWalletsMenu}>
                            <MenuList
                              autoFocusItem={openWalletsMenu}
                              id="menu-list-grow"
                              onKeyDown={handleListKeyDownWalletsMenu}
                              className={classes.menuList}
                            >
                              {walletList.map((wallet, index) => (
                                <div
                                  className="wallet-option"
                                  key={`select-wallet-${index}`}
                                  onClick={() => setSelectedWallet(wallet)}
                                >
                                  <div
                                    className={"icon"}
                                    style={{
                                      backgroundImage:
                                        wallet &&
                                        wallet.name &&
                                        wallet.name.toUpperCase().includes("METAMASK")
                                          ? `url(${require("assets/walletImages/metamask.svg")})`
                                          : wallet.name === "Polkadot"
                                          ? `url(${require("assets/walletImages/polkadot_logo.png")})`
                                          : `url({require("assets/logos/PRIVILOGOpng")})`,
                                      backgroundRepeat: "no-repeat",
                                      backgroundSize: "cover",
                                      backgroundPosition: "center",
                                    }}
                                  />
                                  {wallet.id}
                                </div>
                              ))}
                            </MenuList>
                          </ClickAwayListener>
                        </Paper>
                      </Grow>
                    )}
                  </Popper>
                </div>
              ) : null}
            </LoadingWrapper>
            <div className={"balance"}>
              <h5>Total Wallet Balance</h5>
              <h2>{formatNumber(totalBalance, "USD", 2)}</h2>
            </div>
            <div className={"buttons"}>
              <PrimaryButton
                size="medium"
                onClick={() => {
                  setOpenTranscationHistory(!openTranscationHistory);
                }}
              >
                My Transaction History
              </PrimaryButton>
              <TransactionHistoryModal
                open={openTranscationHistory}
                handleClose={() => setOpenTranscationHistory(false)}
              />
              <div />
              <PrimaryButton size="medium" onClick={handleOpenAtomicSwap}>
                Atomic Swap
              </PrimaryButton>
              <Swap open={openAtomicSwap} handleClose={handleCloseAtomicSwap} />
            </div>
          </div>
        </div>
        <div className={"manager"}>
          <button onClick={handleOpenSidebar}>
            <img src={require("assets/icons/arrow_white.png")} alt="wallets-manager" />
          </button>
          <h4>Wallets Manager</h4>
        </div>
      </div>
      <div className={"scroll-data"}>
        <div className="my-balances" style={{ width: "98%" }}>
          <div className="row">
            <h3>My Balances</h3>
            <img
              src={require("assets/icons/arrow.png")}
              alt={"arrow"}
              onClick={() => setShowBalances(!showBalances)}
              style={{
                cursor: "pointer",
                transform: showBalances ? "rotate(90deg)" : "rotate(270deg)",
              }}
            />
          </div>
          <div className={showBalances ? "graphs" : "graphs hidden"}>
            {PrintWalletChart("Crypto", cryptoChart, cryptoBalanceInfo)}
            {PrintWalletChart("NFT", nftChart, nftBalanceInfo)}
            {PrintWalletChart("FT", ftChart, ftBalanceInfo)}
            {PrintWalletChart("Social", socialChart, socialBalanceInfo)}
            {PrintWalletGraph(
              cryptoBalanceInfo.balanceInUSD,
              nftBalanceInfo.balanceInUSD,
              ftBalanceInfo.balanceInUSD,
              socialBalanceInfo.balanceInUSD
            )}
          </div>
        </div>
        <div className="my-tokens">
          <div className="title">
            <h3>My Tokens</h3>
            <PrimaryButton size="medium" onClick={handleOpenSendTokens}>
              Send Tokens
            </PrimaryButton>
            <SendTokensModal
              disabled={disableClick}
              open={openSendTokens}
              handleClose={handleCloseSendTokens}
              handleRefresh={loadData}
              substrateTokenList={substrateTokenBalanceList}
            />
          </div>
          <div className={"filters"}>
            <div className="fitlerItem">
              <span className="filterTitle">Filter by</span>
              <div>
                <button
                  className={"slideLeft"}
                  type="button"
                  style={{
                    backgroundColor: "transparent",
                    padding: 0,
                    outline: "none",
                    opacity: 0.5,
                  }}
                  onClick={() => {
                    document.getElementsByClassName("scrollable")[0]!.scrollLeft -= 75;
                  }}
                >
                  <img src={require("assets/icons/arrow.png")} alt="" />
                </button>
                <div className={"scrollable"}>
                  {["All 🔮", "Crypto 💸", "NFT Pods 🏆", "FT Pods 👘", "Social 📸"].map(
                    (tokenOption, index) => (
                      <button
                        className={tabsTokenValue === index ? "option-button selected" : "option-button"}
                        onClick={() => clickTab(index)}
                        key={index}
                      >
                        {tokenOption}
                      </button>
                    )
                  )}
                </div>
                <button
                  className={"slideRight"}
                  type="button"
                  style={{
                    backgroundColor: "transparent",
                    padding: 0,
                    outline: "none",
                    opacity: 0.5,
                  }}
                  onClick={() => {
                    document.getElementsByClassName("scrollable")[0]!.scrollLeft += 75;
                  }}
                >
                  <img src={require("assets/icons/arrow.png")} alt="" />
                </button>
              </div>
            </div>
            <div className="fitlerItem">
              <div>
                <span className="filterTitle">Order by</span>
                <StyledSelect
                  disableUnderline
                  value={sortToken}
                  onChange={e => setSortToken(e.target.value as string)}
                >
                  {["Last Transaction"].map((option, index) => (
                    <StyledMenuItem key={`${option}-${index}`} value={option}>
                      {option}
                    </StyledMenuItem>
                  ))}
                </StyledSelect>
              </div>
              <div className="searcher">
                <SearchWithCreate
                  searchPlaceholder={"Search for token"}
                  searchValue={searchToken}
                  handleSearchChange={e => setSearchToken(e.target.value)}
                />
              </div>
            </div>
          </div>
          <div className="token-cards">
            <LoadingWrapper loading={tokensLoading}>
              {tokenBalanceList.length > 0 ? (
                <GenericGrid columnsCountBreakPoints={columnsCountBreakPoints}>
                  {tokenBalanceList.map((token, index) => (
                    <TokenCard
                      token={token}
                      rateOfChange={tokensRateChange[token.Token] ?? 0.0}
                      key={`${tabsTokenValue + token.Token}-${token.Token}-${index}`}
                    />
                  ))}
                  {substrateTokenBalanceList.map((token, index) => (
                    <TokenCard
                      token={token}
                      rateOfChange={tokensRateChange[token.Token] ?? 0.0}
                      key={`${tabsTokenValue + token.Token}-${token.Token}-${index}`}
                    />
                  ))}
                </GenericGrid>
              ) : (
                <div className="no-pods">No Token Balance List to Show</div>
              )}
            </LoadingWrapper>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Wallet;
