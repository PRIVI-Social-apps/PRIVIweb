import "../../Wallet.css";
import React, { useState, useEffect, useRef } from "react";
import { useTypedSelector } from "store/reducers/Reducer";
import { useHistory } from "react-router-dom";
import axios from "axios";
import URL from "shared/functions/getURL";
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
import TokenCard from "../TokenCard/TokenCard";
import { formatNumber } from "shared/functions/commonFunctions";
import Swap from "shared/connectors/bridge/SwapModal";
import TransactionHistoryModal from "../TransactionHistoryModal/TransactionHistoryModal";
import useWindowDimensions from "shared/hooks/useWindowDimensions";
import { StyledMenuItem, StyledSelect } from "shared/ui-kit/Styled-components/StyledComponents";
import Sidebar from "../Sidebar/Sidebar";
import { GenericGrid } from "shared/ui-kit/GenericGrid/GenericGrid";
import SendTokensModal from "components/legacy/Wallet/components/SendTokensModal";
import { LoadingWrapper } from "shared/ui-kit/Hocs";
import { PrimaryButton } from "shared/ui-kit";
import { ChevronIconLeft } from "shared/ui-kit/Icons";
import { SearchWithCreate } from "shared/ui-kit/SearchWithCreate";

const tokenCategories = {
  1: ["CRYPTO"],
  2: ["NFTPOD", "MEDIAPOD"],
  3: ["FTPOD"],
  4: ["SOCIAL", "COMMUNITY", "ETHEREUM"],
};

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
      maxHeight: 210,
      overflowY: "auto",
      outline: "none",
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

const WalletCard = ({ wallet }) => (
  <>
    <div
      className={"icon"}
      style={{
        backgroundImage:
          wallet && wallet.name && wallet.name.toUpperCase().includes("METAMASK")
            ? `url(${require("assets/walletImages/metamask.svg")})`
            : `url(${require("assets/logos/PRIVILOGO.png")})`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    />
    <div className={"info"}>
      <div className="title">
        <h4>{wallet?.name ?? "name"}</h4>
        <span>Account</span>
      </div>
      <div className={"address"}>
        {wallet?.address ?? ""}
        <img
          src={require("assets/icons/copy.png")}
          alt={"copy"}
          onClick={() => {
            navigator.clipboard.writeText(wallet?.address ?? "");
          }}
          style={{ cursor: "pointer" }}
        />
      </div>
    </div>
  </>
);

const MyTokens = () => {
  // STORE
  const user = useTypedSelector(state => state.user);
  const userBalances = useTypedSelector(state => state.userBalances);

  // HOOKS
  const width = useWindowDimensions().width;
  const [tokensRateChange, setTokensRateChange] = useState<{}>({}); // difference of currentRate respect lastRate
  const rateOfChangeRef = useRef<any>({});
  const [tabsTokenValue, setTabsTokenValue] = useState(0);
  const [totalBalance, setTotalBalance] = useState<Number>(0);
  const [selectedWallet, setSelectedWallet] = useState<any>();
  const [walletList, setWalletList] = useState<any[]>([]);

  const [openTranscationHistory, setOpenTranscationHistory] = useState<boolean>(false);
  const [disableClick, setDisableClick] = useState<boolean>(false);
  const [openAtomicSwap, setOpenAtomicSwap] = useState<boolean>(false);
  const [openSendTokens, setOpenSendTokens] = useState<boolean>(false);

  const externalBalancesRef = useRef<any>({});
  const [userCurrBalances, setUserCurrBalances] = useState<any>({});
  const [tokenBalanceList, setTokenBalanceList] = useState<any[]>([]); // balance objs in list
  const [tokensLoading, setTokensLoading] = useState<boolean>(false);
  const [searchToken, setSearchToken] = useState<string>("");
  const [sortToken, setSortToken] = useState<string>("Last Transaction");
  const [isWalletLoading, setIsWalletLoading] = useState<boolean>(false);

  const history = useHistory();

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
  const handleOpenSidebar = () => {
    setOpenSidebar(true);
  };
  const handleCoseSidebar = () => {
    setOpenSidebar(false);
  };

  const classes = useStyles();
  const [openWalletsMenu, setOpenWalletsMenu] = React.useState(false);
  const anchorWalletsMenuRef = React.useRef<HTMLImageElement>(null);

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

  // return focus to the button when we transitioned from !open -> open
  const prevWalletsMenuOpen = React.useRef(openWalletsMenu);
  useEffect(() => {
    if (prevWalletsMenuOpen.current === true && openWalletsMenu === false) {
      anchorWalletsMenuRef.current!.focus();
    }
    prevWalletsMenuOpen.current = openWalletsMenu;
  }, [openWalletsMenu]);

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

  // filter tokens when tab or userCurrBalances obj changed
  useEffect(() => {
    let newTokenList: any[] = [];
    setTokensLoading(true);
    // -------- PRIVI -----------
    let token = "";
    let val: any = null;
    // add and filter from userCurrBalances
    for ([token, val] of Object.entries(userCurrBalances)) {
      if (tabsTokenValue === 0 || tokenCategories[tabsTokenValue].includes(val.Type))
        newTokenList.push({
          ...val,
          Chain: "PRIVI",
        });
    }
    // -------- ETHEREUM -----------
    const externalWallet: any = externalBalancesRef.current;
    for ([token, val] of Object.entries(externalWallet)) {
      newTokenList.push(val);
    }
    if (searchToken !== "") {
      newTokenList = newTokenList.filter(token =>
        token.Token.toUpperCase().includes(searchToken.toUpperCase())
      );
    }
    setTokenBalanceList(newTokenList);
    setTokensLoading(false);
  }, [tabsTokenValue, userCurrBalances, user.ethExternalWallet, searchToken, sortToken]);

  // load external wallet
  useEffect(() => {
    const externalWallet: any = {};
    if (user && user.ethExternalWallet) {
      user.ethExternalWallet.forEach(extWalletObj => {
        const tokens = extWalletObj.tokens ?? [];
        tokens.forEach((tokenObj: any) => {
          const tokenType = tokenObj.tokenType ?? "";
          if (tabsTokenValue === 0 || tokenCategories[tabsTokenValue].includes(tokenType)) {
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
          }
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

  const loadData = () => {
    const config = {
      params: {
        userId: user.id,
      },
    };
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
          console.log(res.data);
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

  console.log("userCurrBalances", userCurrBalances);

  return (
    <div className="wallet-page">
      <Sidebar
        open={openSidebar}
        handleClose={handleCoseSidebar}
        walletsList={walletList}
        setWalletsList={setWalletList}
        handleOpenAtomicSwap={handleOpenAtomicSwap}
      />
      <div className={"data"}>
        <div className={"metrics"} style={{ position: "relative" }}>
          <div className="backButton" onClick={() => history.goBack()}>
            <ChevronIconLeft />
          </div>
          <h4>My Wallet in metrics</h4>
          <div className={"row"} style={{ alignItems: "stretch" }}>
            <LoadingWrapper loading={isWalletLoading}>
              <div className="currentWallet">
                <WalletCard wallet={selectedWallet} />
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
                                onClick={e => {
                                  setSelectedWallet(wallet);
                                  handleCloseWalletsMenu(e);
                                }}
                              >
                                <WalletCard wallet={wallet} />
                              </div>
                            ))}
                          </MenuList>
                        </ClickAwayListener>
                      </Paper>
                    </Grow>
                  )}
                </Popper>
              </div>
            </LoadingWrapper>
            <div className={"balance"}>
              <h5>Current Balance</h5>
              <h2>{`$ ${(userCurrBalances[selectedWallet?.name] ?? 0).toFixed(2)}`}</h2>
              <span style={{ color: "#949bab" }}>
                Total Wallet Balance{" "}
                <span style={{ whiteSpace: "nowrap" }}>{formatNumber(totalBalance, "USD", 2)}</span>
              </span>
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
        <div className="my-tokens">
          <div className="title">
            <h3>My Tokens</h3>
            <button onClick={handleOpenSendTokens}>Send Tokens</button>
            <SendTokensModal
              disabled={disableClick}
              open={openSendTokens}
              handleClose={handleCloseSendTokens}
              handleRefresh={loadData}
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
                    margin: 0,
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
                        className={tabsTokenValue === index ? "option-button selected" : "option-button "}
                        onClick={() => setTabsTokenValue(index)}
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
                    margin: 0,
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
                  {["Last Transaction"].map(option => (
                    <StyledMenuItem key={option} value={option}>
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
                <img src={require("assets/icons/search.png")} alt={"search"} />
              </div>
            </div>
          </div>
          <div className="token-cards">
            <LoadingWrapper loading={tokensLoading}>
              {tokenBalanceList.length > 0 ? (
                <GenericGrid columnsCountBreakPoints={columnsCountBreakPoints}>
                  {tokenBalanceList.map(token => (
                    <TokenCard
                      token={token}
                      rateOfChange={tokensRateChange[token.Token] ?? 0.0}
                      key={`${tabsTokenValue + token.Token}-${token.Token}`}
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

export default MyTokens;
