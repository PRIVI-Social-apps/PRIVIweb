import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useHistory } from "react-router-dom";

import { FormControl, Grid, SvgIcon } from "@material-ui/core";

import TokenCard from "components/legacy/Wallet/components/TokenCard/TokenCard";
// ----------------- For the balance Graphs ---------------------
import PrintWalletChart from "components/legacy/Wallet/components/Wallet-Chart/Wallet-Chart";
import CryptoChartConfig from "components/legacy/Wallet/components/Wallet-Chart/configs/Crypto-Chart-Config";
import FTChartConfig from "components/legacy/Wallet/components/Wallet-Chart/configs/FT-Chart-Config";
import NFTChartConfig from "components/legacy/Wallet/components/Wallet-Chart/configs/NFT-Chart-Config";
import SocialChartConfig from "components/legacy/Wallet/components/Wallet-Chart/configs/Social-Chart-Config";
import { StyledMenuItem, StyledSelect } from "shared/ui-kit/Styled-components/StyledComponents";
import PrintWalletGraph from "components/legacy/Wallet/components/Wallet-Graph/WalletGraph";
import { walletPageStyles } from "./index.styles";
import { useTypedSelector } from "store/reducers/Reducer";
import { GenericGrid } from "shared/ui-kit/GenericGrid/GenericGrid";
import { getWaxInstance, getWaxBalances, getWaxNFTs } from "shared/connectors/bridge/wax";
import URL from "shared/functions/getURL";
import { LoadingWrapper } from "shared/ui-kit/Hocs";
import { useSubstrate } from "shared/connectors/substrate";
import { ContractInstance } from "shared/connectors/substrate/functions";
import ERC20_META from "shared/connectors/substrate/contracts/ERC20_META.json";
import substrateTokens from "shared/connectors/substrate/tokens";
import { PrimaryButton } from "shared/ui-kit";
import { ReactComponent as StarRegular } from "assets/icons/star-regular.svg";
import { ReactComponent as StarSolid } from "assets/icons/star-solid.svg";
import { ReactComponent as CopyIcon } from "assets/icons/copy-regular.svg";
import TransHistory from "components/PriviWallet/components/TransHistory";
import { ChevronIconLeft } from "shared/ui-kit/Icons";
import PrintChart from "shared/ui-kit/Chart/Chart";
import Box from "shared/ui-kit/Box";
import { formatNumber } from "shared/functions/commonFunctions";

const YearLabels: any[] = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];
const DominanceFilters: any[] = ["Max", "Min"];

const FreeHoursChartConfig = {
  config: {
    data: {
      labels: [] as any[],
      datasets: [
        {
          type: "bar",
          label: "",
          data: [] as any[],
          pointRadius: 0,
          backgroundColor: "#F9E373",
          borderColor: "#F9E373",
          pointBackgroundColor: "#F9E373",
          hoverBackgroundColor: "#F9E373",
          borderJoinStyle: "round",
          borderCapStyle: "round",
          borderWidth: 3,
          cubicInterpolationMode: "monotone",
          lineTension: 0.1,
        },
      ],
    },

    options: {
      responsive: true,
      maintainAspectRatio: false,
      chartArea: {
        backgroundColor: "#F7F9FECC",
      },
      elements: {
        point: {
          radius: 0,
          hitRadius: 5,
          hoverRadius: 5,
        },
      },

      legend: {
        display: false,
      },

      layout: {
        padding: {
          left: 0,
          right: 0,
          top: 50,
          bottom: 0,
        },
      },

      scales: {
        xAxes: [
          {
            offset: true,
            display: true,
            gridLines: {
              color: "#ffffff",
              lineWidth: 50,
            },
            ticks: {
              beginAtZero: true,
              fontColor: "#6B6B6B",
              fontFamily: "Agrandir",
            },
          },
        ],
        yAxes: [
          {
            display: true,
            gridLines: {
              color: "#EFF2F8",
            },
            ticks: {
              display: true,
              beginAtZero: true,
            },
          },
        ],
      },

      tooltips: {
        mode: "label",
        intersect: false,
        callbacks: {
          //This removes the tooltip title
          title: function () {},
          label: function (tooltipItem, data) {
            return `$${tooltipItem.yLabel.toFixed(4)}`;
          },
        },
        //this removes legend color
        displayColors: false,
        yPadding: 10,
        xPadding: 10,
        position: "nearest",
        caretSize: 10,
        backgroundColor: "rgba(255,255,255,0.9)",
        bodyFontSize: 15,
        bodyFontColor: "#303030",
      },

      plugins: {
        datalabels: {
          display: function (context) {
            return context.dataset.data[context.dataIndex] !== 0;
          },
        },
      },
    },
  },
};

const configurer = (config: any, ref: CanvasRenderingContext2D): object => {
  for (let index = 0; index < config.data.datasets.length; index++) {
    let gradient = ref.createLinearGradient(0, 0, 0, ref.canvas.clientHeight);
    gradient.addColorStop(1, `${config.data.datasets[index].backgroundColor}33`);
    gradient.addColorStop(0.5, `${config.data.datasets[index].backgroundColor}b0`);
    config.data.datasets[index].backgroundColor = gradient;
  }

  return config;
};

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

const WalletPage = () => {
  const classes = walletPageStyles();
  const history = useHistory();

  // STORE
  const user = useTypedSelector(state => state.user);
  const userBalances = useTypedSelector(state => state.userBalances);

  const [dominance, setDominance] = useState<any>(DominanceFilters[0]);

  const [dominanceConfig, setDominanceConfig] = useState<any>();

  // HOOKS
  const [wallet, setWallet] = useState<any>();

  const [tokensRateChange, setTokensRateChange] = useState<{}>({}); // difference of currentRate respect lastRate
  const [tabsTokenValue, setTabsTokenValue] = useState(0);
  const [totalBalance, setTotalBalance] = useState<Number>(0);
  const [selectedWallet, setSelectedWallet] = useState<any>();
  const [walletList, setWalletList] = useState<any[]>([]);
  const [waxWallet, setWaxWallet] = useState<any>();
  const [externalWaxWallet, setExternalWaxWallet] = useState<any>([]);

  const [cryptoChart, setCryptoChart] = useState<any>(CryptoChartConfig);
  const [ftChart, setFTChart] = useState<any>(FTChartConfig);
  const [nftChart, setNFTChart] = useState<any>(NFTChartConfig);
  const [socialChart, setSocialChart] = useState<any>(SocialChartConfig);
  const [walletTopBoxFlag, setWalletTopBoxFlag] = useState(true);

  const externalBalancesRef = useRef<any>({});
  const [userCurrBalances, setUserCurrBalances] = useState<any>({});
  const [tokenBalanceList, setTokenBalanceList] = useState<any[]>([]); // balance objs in list
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
  const [openWalletsMenu, setOpenWalletsMenu] = React.useState(false);

  const [isWalletLoading, setIsWalletLoading] = useState<boolean>(false);
  const [isGraphLoading, setIsGraphLoading] = useState<boolean>(false);

  const anchorWalletsMenuRef = React.useRef<HTMLImageElement>(null);
  const rateOfChangeRef = useRef<any>({});

  // return focus to the button when we transitioned from !open -> open
  const prevWalletsMenuOpen = React.useRef(openWalletsMenu);

  const { api } = useSubstrate();

  // dominance chart
  useEffect(() => {
    const newDominanceConfig = JSON.parse(JSON.stringify(FreeHoursChartConfig));
    newDominanceConfig.configurer = configurer;
    newDominanceConfig.config.data.labels = YearLabels;
    newDominanceConfig.config.data.datasets[0].data = [10, 20, 40, 55, 65, 75, 80, 120, 340, 230, 130, 125];
    newDominanceConfig.config.data.datasets[0].type = "line";
    newDominanceConfig.config.data.datasets[0].backgroundColor = "#E113F9";
    newDominanceConfig.config.data.datasets[0].borderColor = "#E113F9";
    newDominanceConfig.config.data.datasets[0].pointBackgroundColor = "#E113F9";
    newDominanceConfig.config.data.datasets[0].hoverBackgroundColor = "#E113F9";

    newDominanceConfig.config.data.datasets.push(
      JSON.parse(JSON.stringify(newDominanceConfig.config.data.datasets[0]))
    );
    newDominanceConfig.config.data.datasets[1].data = [
      10, 20, 40, 55, 65, 75, 80, 120, 340, 230, 130, 125,
    ].reverse();
    newDominanceConfig.config.data.datasets[1].type = "line";
    newDominanceConfig.config.data.datasets[1].backgroundColor = "#F9E373";
    newDominanceConfig.config.data.datasets[1].borderColor = "#F9E373";
    newDominanceConfig.config.data.datasets[1].pointBackgroundColor = "#F9E373";
    newDominanceConfig.config.data.datasets[1].hoverBackgroundColor = "#F9E373";

    newDominanceConfig.config.options.scales.xAxes[0].offset = false;

    setDominanceConfig(newDominanceConfig);
  }, []);

  useEffect(() => {
    if (prevWalletsMenuOpen.current === true && openWalletsMenu === false) {
      anchorWalletsMenuRef.current!.focus();
    }
    prevWalletsMenuOpen.current = openWalletsMenu;
  }, [openWalletsMenu]);

  useEffect(() => {
    axios
      .get(`${URL()}/wallet/getUserRegisteredEthAccounts`)
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
      // fetchSubstrateBalances(polkadotWallet[0].address).then(data => {
      //   setTokenBalanceList([...newTokenList, ...data]);
      // });
    } else {
      setTokenBalanceList(newTokenList);
    }
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
        // const balance = output ? output.toHuman() : 0;
        const balance = 0;
        return {
          Token: name,
          Type: "CRYPTO",
          Balance: balance,
          Chain: "SUBS",
          Debt: 0,
          InitialBalance: 0,
          LastUpdate: 0,
          NextUpdate: 0,
        };
      })
    );
    return balances;
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
    switch (tokenIndex) {
      case 0: // ALL
        return true;
      case 1:
        return tokenType.includes("CRYPTO");
      case 2: // NFT Pods
        return tokenType.includes("NFT") || tokenType.includes("MEDIA");
      case 3: //  FT Pods
        return tokenType.includes("FT") && !tokenType.includes("NFT") && !tokenType.includes("MEDIA");
      default:
        // Social
        return (
          !tokenType.includes("CRYPTO") &&
          !tokenType.includes("MEDIA") &&
          !tokenType.includes("NFT") &&
          !tokenType.includes("FT")
        );
    }
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

  const handleWalletTopBoxClose = () => {
    setWalletTopBoxFlag(false);
  };

  return (
    <Box className={classes.container}>
      <Box className={classes.subContainer}>
        <Box
          className={classes.backPage}
          onClick={() => {
            history.push("/privi-wallet/manager");
          }}
        >
          <ChevronIconLeft />
          <Box ml="10px">Back to Wallet Manager</Box>
        </Box>
        {wallet && (
          <Box className={classes.flexBoxHeader}>
            <Box className={classes.flexBox}>
              <Box className={classes.walletShadowBox} mr={2}>
                <div className={classes.icon}>
                  {wallet.name && wallet.name.toUpperCase().includes("METAMASK") ? (
                    <img src={require("assets/walletImages/metamask.svg")} width={35} />
                  ) : wallet.walletType && wallet.walletType.toUpperCase().includes("WAX") ? (
                    <img src={require("assets/walletImages/waxWallet.png")} width={35} />
                  ) : wallet.walletType && wallet.walletType.toUpperCase().includes("WALLETCONNECT") ? (
                    <img src={require("assets/walletImages/wallet_connect.svg")} width={35} />
                  ) : wallet.walletType && wallet.walletType.toUpperCase().includes("POLKADOT") ? (
                    <img src={require("assets/walletImages/polkadot.svg")} width={35} />
                  ) : (
                    <img src={require("assets/logos/PRIVILOGO.png")} width={35} />
                  )}
                </div>
                <Box ml={3}>
                  <Box className={`${classes.balance} ${classes.flexBox}`} justifyContent="flex-end">
                    <Box className={classes.addressBox} mr={1}>
                      {wallet?.address ?? ""}
                    </Box>
                    <SvgIcon
                      style={{ width: "16px" }}
                      onClick={() => {
                        navigator.clipboard.writeText(wallet && wallet.address ? wallet.address : "");
                      }}
                    >
                      <CopyIcon />
                    </SvgIcon>
                  </Box>
                  <Box className={classes.flexBox} justifyContent="space-between">
                    <Box className={classes.walletName} mr={3}>
                      {wallet.name}
                    </Box>
                    {wallet && wallet.main && (
                      <SvgIcon style={{ width: "16px" }} htmlColor={"#FF79D1"}>
                        <StarSolid />
                      </SvgIcon>
                    )}
                    {wallet && !wallet.main && (
                      <SvgIcon style={{ width: "16px" }}>
                        <StarRegular />
                      </SvgIcon>
                    )}
                  </Box>
                </Box>
              </Box>
              <Box className={classes.shadowBox} mr={2}>
                <Box className={classes.balance}>Total Wallet Balance</Box>
                <Box className={classes.title} mt={1}>
                  {formatNumber(totalBalance, "USD", 4)}
                </Box>
              </Box>
            </Box>
            {walletTopBoxFlag && (
              <Box className={`${classes.flexBox} ${classes.walletTopBox}`}>
                <img src={require("assets/icons/wallet.png")} height="100%" />
                <div className={classes.startNowSection}>
                  <Box className={classes.topHeaderLabel}>
                    Get your <b>Privi</b>
                  </Box>
                  <Box className={classes.topHeaderLabel}>
                    <b>Wallet</b>
                  </Box>
                  <PrimaryButton size="small" onClick={() => {}} mt={1}>
                    Create New
                  </PrimaryButton>
                </div>
                <div className={classes.closeButton} onClick={handleWalletTopBoxClose}>
                  <img src={require("assets/icons/x_darkblue.png")} className={classes.closeIcon} alt={"x"} />
                </div>
              </Box>
            )}
          </Box>
        )}
        <Box className={classes.flexBox} mt={4} mb={3} justifyContent="space-between">
          {PrintWalletChart("Crypto", cryptoChart, cryptoBalanceInfo)}
          {PrintWalletChart("NFT", nftChart, nftBalanceInfo)}
          {PrintWalletChart("FT", ftChart, ftBalanceInfo)}
          {PrintWalletChart("Social", socialChart, socialBalanceInfo)}
        </Box>
        <Grid container>
          <Grid item xs={12} sm={3}>
            <Box m={1}>
              {PrintWalletGraph(
                cryptoBalanceInfo.balanceInUSD,
                nftBalanceInfo.balanceInUSD,
                ftBalanceInfo.balanceInUSD,
                socialBalanceInfo.balanceInUSD
              )}
            </Box>
          </Grid>
          <Grid item xs={12} sm={9}>
            <Box className={classes.graphBox}>
              <Box className={classes.graphHeader}>
                <Box className={classes.header1}>Dominance</Box>
                <FormControl variant="outlined">
                  <StyledSelect className={classes.select} value={dominance} onChange={v => {}}>
                    {DominanceFilters.map((item, index) => (
                      <StyledMenuItem key={index} value={item}>
                        {item}
                      </StyledMenuItem>
                    ))}
                  </StyledSelect>
                </FormControl>
              </Box>
              <Box style={{ height: "100%" }}>
                {dominanceConfig && <PrintChart config={dominanceConfig} />}
              </Box>
            </Box>
          </Grid>
        </Grid>
        <Box mt={3}>
          <Box className={classes.flexBox} mb={3}>
            <Box fontSize={18} fontWeight={700}>
              My Tokens
            </Box>
          </Box>
          <Box className={classes.flexBoxHeader}>
            <Box className={classes.flexBox}>
              <span className={classes.header2}>Filter by</span>
              <Box className={classes.flexBox}>
                <Box className={"scrollable"}>
                  {["All 🔮", "Crypto 💸", "NFT Pods 🏆", "FT Pods 👘", "Social 📸"].map(
                    (tokenOption, index) => (
                      <button
                        className={
                          tabsTokenValue === index
                            ? `${classes.optionButton} ${classes.selected}`
                            : `${classes.optionButton}`
                        }
                        onClick={() => clickTab(index)}
                        key={index}
                      >
                        {tokenOption}
                      </button>
                    )
                  )}
                </Box>
              </Box>
            </Box>
            <Box className={classes.flexBox}>
              <Box className={classes.header2} mr={2}>
                Order by
              </Box>
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
            </Box>
          </Box>
          <Box className="token-cards" mt={2}>
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
                </GenericGrid>
              ) : (
                <Box className="no-pods">No Token Balance List to Show</Box>
              )}
            </LoadingWrapper>
          </Box>
          <Box mt={8}>
            <Box className={classes.flexBoxHeader} mb={3}>
              <Box fontSize={18} fontWeight={700}>
                Transaction History
              </Box>
            </Box>
            <TransHistory />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default WalletPage;
