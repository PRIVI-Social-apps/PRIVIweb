import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import createPlotlyComponent from "react-plotly.js/factory";
import Plotly from "plotly.js-basic-dist";
import { connect } from "react-redux";

import { Fade, FormControl, Grid, Modal, Tooltip } from "@material-ui/core";

//import { loadavg } from "os";
import { StyledSelect, StyledMenuItem } from "shared/ui-kit/Styled-components/StyledComponents";
import { signTransaction } from "shared/functions/signTransaction";
import URL from "shared/functions/getURL";
import BridgeTokenManager from "shared/connectors/bridge/classes/bridgeTokenManager";
import Connect from "shared/connectors/bridge/Connect";
import { waitTransaction } from "shared/connectors/bridge/classes/transactionStatus";
import AlertMessage from "shared/ui-kit/Alert/AlertMessage";
import { LoadingWrapper } from "shared/ui-kit/Hocs";
import ERC20Json from "shared/contracts/ABI_V5/ERC20.json";

import "./CreateImportTokenModal.css";

import SvgIcon from "@material-ui/core/SvgIcon";
import { ReactComponent as CloseSolid } from "assets/icons/close-solid.svg";
import InputWithLabelAndTooltip from "shared/ui-kit/InputWithLabelAndTooltip";

// ----------------- For the Graphs in Template ---------------------
const Plot = createPlotlyComponent(Plotly);
// Main line
const lineInitState = {
  maxPoints: 100,
  data: {
    x: [],
    y: [],
    mode: "lines",
    name: "AMM",
    line: {
      dash: "solid",
      color: "black",
    },
  },
  data2: {
    x: [],
    y: [],
    mode: "lines",
    name: "Target Supply",
    line: {
      dash: "dash",
      color: "grey",
    },
  },
  data3: {
    x: [],
    y: [],
    mode: "lines",
    name: "Target Price",
    line: {
      dash: "dash",
      color: "grey",
    },
  },
  layout: {
    autosize: false,
    height: 500,
    width: 850,
    bordercolor: "FFFFFF",
    showlegend: true,
    plot_bgcolor: "rgb(227, 233, 239)",
    datarevision: 0,
    xaxis: {
      linecolor: "rgb(100, 200, 158)",
      linewidth: 2,
      mirror: true,
      automargin: true,
      autorange: false,
      range: [0, 10],
      title: {
        text: "",
        font: {
          family: "Agrandir",
          size: 12,
          color: "rgb(0,0,0)",
        },
      },
    },
    yaxis: {
      linecolor: "rgb(100, 200, 158)",
      linewidth: 2,
      mirror: true,
      automargin: true,
      autorange: false,
      range: [0, 10],
      title: {
        text: "",
        font: {
          family: "Agrandir",
          size: 12,
          color: "rgb(0,0,0)",
        },
      },
    },
    margin: {
      l: 10,
      r: 10,
      b: 10,
      t: 10,
      pad: 0,
    },
  },
};
const typeAMMs = ["Linear", "Quadratic", "Exponential", "Sigmoid"];
// ---------------------------------------------------

const imageIcon = require("assets/icons/image_icon.png");
const infoIcon = require("assets/icons/info_icon.png");

const equal = require("deep-equal");

const arePropsEqual = (prevProps, currProps) => {
  return (
    prevProps.open == currProps.open &&
    JSON.stringify(prevProps.community) === JSON.stringify(currProps.community) &&
    equal(prevProps.user, currProps.user)
  );
};

const CreateImportTokenModal = React.memo((props: any) => {
  const bridgeTokenManager = new BridgeTokenManager();
  const inputRef = useRef<any>();
  const [web3, setWeb3] = useState<any>(undefined);
  const [isEthWalletConnected, setIsEthWalletConnected] = useState(false);

  const [line, setLine] = useState<any>(lineInitState); // for AMM graph

  const [createAToken, setCreateAToken] = useState<boolean>(true);
  const [vestingTaxation, setVestingTaxation] = useState<boolean>(true);

  const [token, setToken] = useState<any>({
    TokenName: "",
    TokenSymbol: "",
    FundingToken: "",
    SpreadDividend: 0,
    TargetPrice: 0,
    TargetSupply: 0,
    InitialSupply: 0,
    CollateralQuantity: 0,
    //CollateralOption: "Use my investments as collateral",
    CollateralToken: "",
    AMM: "Linear",
  });

  const [tokenImport, setTokenImport] = useState<any>({
    TokenName: "",
    TokenSymbol: "",
    TokenDecimals: 18,
    FundingToken: "",
    EthereumContractAddress: "",
    Frequency: "DAILY",
    TokenType: "ETHEREUM",
    InitialSupply: "",
  });

  const [readTokenName, setReadTokenName] = useState<any>(undefined);
  const [readTokenSymbol, setReadTokenSymbol] = useState<any>(undefined);
  const [readTokenDecimal, setReadTokenDecimal] = useState<number>(18);

  const [status, setStatus] = useState<any>();

  //general info
  const [photo, setPhoto] = useState<any>(null);
  const [photoImg, setPhotoImg] = useState<any>(null);

  //token
  const [tokenObjs, setTokenObjs] = useState<any[]>([
    { token: "ETH", name: "Ethereum" },
    { token: "PRIVI", name: "Privi Coin" },
    { token: "BC", name: "Base Coin" },
    { token: "DC", name: "Data Coin" },
  ]);
  const [tokenNames, setTokenNames] = useState<string[]>([
    "Ethereum",
    "Privi Coin",
    "Base Coin",
    "Data Coin",
  ]);
  const [fundingTokenName, setFundingTokenName] = useState<string>("Ethereum");
  const [fundingTokenImportName, setFundingTokenImportName] = useState<string>("Ethereum");
  const [collateralTokenName, setCollateralTokenName] = useState<string>("Ethereum");

  useEffect(() => {
    const load = async () => {
      if (props.user && props.user.web3) {
        setWeb3(props.user.web3);
        setIsEthWalletConnected(true);
      }
    };
    load();
  }, [props.user.web3]);

  useEffect(() => {
    const load = async () => {
      if (
        typeof web3 !== "undefined" &&
        typeof tokenImport !== "undefined" &&
        typeof tokenImport.EthereumContractAddress !== "undefined" &&
        tokenImport.EthereumContractAddress !== ""
      ) {
        try {
          console.log("loading info from smart contract");
          const tokenAbi: any = ERC20Json.abi;
          const tokenContract = new web3.eth.Contract(tokenAbi, tokenImport.EthereumContractAddress);
          const tokenName = await tokenContract.methods.name().call();
          const tokenSymbol = await tokenContract.methods.symbol().call();
          const tokenDecimals = await tokenContract.methods.decimals().call();
          setReadTokenName(tokenName);
          setReadTokenSymbol(tokenSymbol);
          setReadTokenDecimal(tokenDecimals);
          const tokenCopy = { ...tokenImport };
          tokenCopy.TokenName = tokenName;
          tokenCopy.TokenSymbol = tokenSymbol;
          tokenCopy.TokenDecimals = tokenDecimals;
          setTokenImport(tokenCopy);
        } catch (error) {
          console.log("loading smart contract info:", error);
        }
      }
    };
    load();
  }, [web3, tokenImport.EthereumContractAddress]);

  const handleChangeTokenSelector = e => {
    if (createAToken) {
      setFundingTokenName(e.target.value);
      const tokenCopy = { ...token };
      const t = tokenObjs.find(token => token.name === e.target.value);
      tokenCopy.FundingToken = t.token;
      setToken(tokenCopy);
    } else {
      setFundingTokenImportName(e.target.value);
      const tokenCopy = { ...tokenImport };
      const t = tokenObjs.find(token => token.name === e.target.value);
      tokenCopy.FundingToken = t.token;
      setTokenImport(tokenCopy);
    }
  };
  const handleChangeCollateralTokenSelector = e => {
    setCollateralTokenName(e.target.value);
    let tokenCopy = { ...token };
    const t = tokenObjs.find(token => token.name === e.target.value);
    tokenCopy.CollateralToken = t.token;
    setToken(tokenCopy);
  };

  const [gasFee, setGasFee] = useState<number>(0.0001);

  const createToken = async () => {
    if (validateTokenInfo()) {
      try {
        // constructing body
        const body = { ...token }; // copy from token
        body.Creator = props.user.id;
        body.AMM = body.AMM.toUpperCase();
        body.InitialSupply = Number(body.InitialSupply);
        body.TargetSupply = Number(body.TargetSupply);
        body.TargetPrice = Number(body.TargetPrice);
        body.SpreadDividend = Number(body.SpreadDividend) / 100;
        body.Creator = props.user.id;
        body.CommunityAddress = props.community.CommunityAddress;
        body.TokenType = "PRIVI";

        body.VestingTaxation = vestingTaxation; // boolean
        if (vestingTaxation) {
          body.ImmediateAllocation = Number(body.ImmediateAllocation) / 100;
          body.VestedAllocation = Number(body.VestedAllocation) / 100;
          body.VestingPeriod = Number(body.VestingPeriod);
        }

        const [hash, signature] = await signTransaction(props.user.mnemonic, body);
        body.Hash = hash;
        body.Signature = signature;

        setIsLoading(true);
        setStatus(undefined);
        axios.post(`${URL()}/community/createCommunityToken`, body).then(async response => {
          const resp = response.data;
          if (resp.success) {
            if (photoImg && photo) await uploadImage(token.TokenSymbol);
            setIsLoading(false);
            setTimeout(() => {
              props.onRefreshInfo();
              props.onClose();
            }, 1000);
          } else {
            setStatus({
              msg: "Comunity Token Creation Failed.",
              key: Math.random(),
              variant: "error",
            });
          }
          setStatus({
            msg: "Community Token Created!",
            key: Math.random(),
            variant: "success",
          });
          setIsLoading(false);
        });
      } catch (error) {
        setStatus({
          msg: "Error when making the request.",
          key: Math.random(),
          variant: "error",
        });
        setIsLoading(false);
      }
    }
  };

  const [isLoading, setIsLoading] = useState(false);

  const importToken = async () => {
    if (validateTokenInfo()) {
      setIsLoading(true);
      // constructing body
      let body: any = { ...tokenImport }; // copy from token
      body.Creator = props.user.id;
      body.CommunityAddress = props.community.CommunityAddress;
      const chainId = await web3.eth.net.getId();
      body.EthChainId = chainId;
      console.log("import token pressed", body);

      const [hash, signature] = await signTransaction(props.user.mnemonic, body);
      body.Hash = hash;
      body.Signature = signature;

      const result = await bridgeTokenManager.registerErc20Token(
        body.TokenName,
        body.TokenSymbol,
        body.EthereumContractAddress,
        chainId,
        web3,
        props.user.ethAccount
      );

      setIsLoading(true);

      console.log("bridgeTokenManager.registeredErc20Token", result);

      const waitRes = await waitTransaction(web3, result.transactionHash, {
        interval: 1000,
        blocksToWait: 1,
      });

      if (waitRes && result) {
        axios.post(`${URL()}/community/createCommunityToken`, body).then(async response => {
          const resp = response.data;
          console.log("createCommunityToken resp", resp);
          if (resp.success) {
            if (photoImg && photo) {
              await uploadImage(tokenImport.TokenSymbol);
            }
            // register on the bridge
            axios
              .post(`${URL()}/community/setComunityBirdgeRegistered`, {
                address: body.CommunityAddress,
              })
              .then(async response => {
                const resp = response.data;
                if (resp.success) {
                  setStatus({
                    msg: "Comunity Birdge Registered. database updated",
                    key: Math.random(),
                    variant: "success",
                  });
                } else {
                  setStatus({
                    msg: "Comunity Birdge Registered Failed",
                    key: Math.random(),
                    variant: "error",
                  });
                  setIsLoading(false);
                }
              });

            setIsLoading(false);

            setTimeout(() => {
              props.onRefreshInfo();
              props.onClose();
            }, 2000);
          } else {
            setIsLoading(false);
            setStatus({
              msg: "Comunity Token Import Failed.",
              key: Math.random(),
              variant: "error",
            });
          }
          setStatus({
            msg: "Community Token Imported!",
            key: Math.random(),
            variant: "success",
          });
        });
      } else {
        console.log("failed to register on bridge");
        setStatus({
          msg: "Token Import Failed; failed to register on bridge.",
          key: Math.random(),
          variant: "error",
        });
        setIsLoading(false);
      }
    }
  };

  const validateTokenInfo = () => {
    if (createAToken) {
      if (!token.TokenName || token.TokenName === "") {
        setStatus({
          msg: "Token Name field invalid",
          key: Math.random(),
          variant: "error",
        });
        return false;
      } else if (
        !token.TokenSymbol ||
        token.TokenSymbol === "" ||
        token.TokenSymbol.length < 3 ||
        token.TokenSymbol.length > 15
      ) {
        setStatus({
          msg: "Token Symbol field invalid",
          key: Math.random(),
          variant: "error",
        });
        return false;
      } else if (!token.FundingToken || token.FundingToken === "") {
        setStatus({
          msg: "Funding Token field invalid",
          key: Math.random(),
          variant: "error",
        });
        return false;
      } else if (
        !token.SpreadDividend ||
        token.SpreadDividend === "" ||
        token.SpreadDividend < 0.1 ||
        token.SpreadDividend > 20
      ) {
        setStatus({
          msg: "Trading Spread field invalid. Value must be between 0.1% and 20%.",
          key: Math.random(),
          variant: "error",
        });
        return false;
      } else if (!token.TargetPrice || token.TargetPrice === "" || token.TargetPrice === 0) {
        setStatus({
          msg: "Target Price field invalid. Value must be greater than 0.",
          key: Math.random(),
          variant: "error",
        });
        return false;
      } else if (!token.TargetSupply || token.TargetSupply === "") {
        setStatus({
          msg: "Target Supply field invalid",
          key: Math.random(),
          variant: "error",
        });
        return false;
      } else if (
        !token.InitialSupply ||
        token.InitialSupply === "" ||
        token.InitialSupply > token.TargetSupply
      ) {
        setStatus({
          msg: "Initial Supply field invalid. Value must be between 0 and Target Supply.",
          key: Math.random(),
          variant: "error",
        });
        return false;
      } else if (!token.CollateralQuantity || token.CollateralQuantity.length <= 0) {
        setStatus({
          msg: "Collateral Quantity invalid",
          key: Math.random(),
          variant: "error",
        });
        return false;
      } else if (!token.CollateralToken || token.CollateralToken.length <= 0) {
        setStatus({
          msg: "Collateral Token invalid",
          key: Math.random(),
          variant: "error",
        });
        return false;
      } else if (!token.AMM || token.AMM.length <= 0) {
        setStatus({
          msg: "AMM value invalid",
          key: Math.random(),
          variant: "error",
        });
        return false;
      } else if (
        (vestingTaxation === true && !token.VestingPeriod) ||
        token.VestingPeriod === "" ||
        Number(token.VestingPeriod) <= 0
      ) {
        setStatus({
          msg: "Vesting period value invalid",
          key: Math.random(),
          variant: "error",
        });
        return false;
      } else if (
        (vestingTaxation === true && !token.ImmediateAllocation) ||
        token.ImmediateAllocation === "" ||
        Number(token.ImmediateAllocation) <= 0
      ) {
        setStatus({
          msg: "Immediate allocation pct value invalid",
          key: Math.random(),
          variant: "error",
        });
        return false;
      } else if (
        (vestingTaxation === true && !token.VestedAllocation) ||
        token.VestedAllocation === "" ||
        Number(token.VestedAllocation) <= 0
      ) {
        setStatus({
          msg: "Vested allocation pct value invalid",
          key: Math.random(),
          variant: "error",
        });
        return false;
      } else {
        return true;
      }
    } else {
      if (!tokenImport.TokenName || tokenImport.TokenName === "") {
        setStatus({
          msg: "Token Name field invalid",
          key: Math.random(),
          variant: "error",
        });
        return false;
      } else if (
        !tokenImport.TokenSymbol ||
        tokenImport.TokenSymbol === "" ||
        tokenImport.TokenSymbol.length < 3 ||
        tokenImport.TokenSymbol.length > 10
      ) {
        setStatus({
          msg: "Token Symbol field invalid",
          key: Math.random(),
          variant: "error",
        });
        return false;
      } else if (!tokenImport.FundingToken || tokenImport.FundingToken === "") {
        setStatus({
          msg: "Funding Token field invalid",
          key: Math.random(),
          variant: "error",
        });
        return false;
      } else if (!tokenImport.EthereumContractAddress || tokenImport.EthereumContractAddress === "") {
        setStatus({
          msg: "Smart Contract Address field invalid.",
          key: Math.random(),
          variant: "error",
        });
        return false;
      } else {
        return true;
      }
    }
  };

  // token functions
  // get token list from backend
  useEffect(() => {
    axios.get(`${URL()}/wallet/getCryptosRateAsList`).then(res => {
      const resp = res.data;
      if (resp.success) {
        let firstTokenOfTheList;
        const tokenNamesList: string[] = []; // list of tokenSymbolList
        const tokenObjList: any[] = [];
        const data = resp.data;
        data.forEach(rateObj => {
          if (!firstTokenOfTheList) firstTokenOfTheList = rateObj.token;
          tokenObjList.push({ token: rateObj.token, name: rateObj.name });
          tokenNamesList.push(rateObj.name);
        });
        setTokenObjs(tokenObjList);
        setTokenNames(tokenNamesList); // update tokenSymbolList lists
        setFundingTokenName(tokenNamesList[0]);
        setCollateralTokenName(tokenNamesList[0]);
        setFundingTokenImportName(tokenNamesList[0]);
        const newToken = { ...token };
        if (firstTokenOfTheList) {
          newToken.FundingToken = firstTokenOfTheList;
          newToken.CollateralToken = firstTokenOfTheList;
        }
        setToken(newToken);
        const newImportToken = { ...tokenImport };
        if (firstTokenOfTheList) newImportToken.FundingToken = firstTokenOfTheList;
        setTokenImport(newImportToken);
      } else {
        //dummy data, this should be erased when solved the 401 error
        const newToken = { ...token };
        newToken.FundingToken = "PRIVI";
        newToken.CollateralToken = "PRIVI";
        setToken(newToken);
        const newImportToken = { ...tokenImport };
        newImportToken.FundingToken = "PRIVI";
        setTokenImport(newImportToken);
      }
    });
  }, []);

  //photo functions

  const uploadImage = async tokenSymbol => {
    return new Promise((resolve, reject) => {
      const formData = new FormData();

      const config = {
        headers: {
          "content-type": "multipart/form-data",
        },
      };
      if (tokenSymbol && tokenSymbol !== "") {
        //change token photo
        formData.append("image", photo, tokenSymbol);
        axios
          .post(`${URL()}/wallet/changeTokenPhoto`, formData, config)
          .then(response => {
            resolve(true);
          })
          .catch(error => {
            console.log(error);
            resolve(true);
            alert("Error uploading token photo");
          });
      }
    });
  };

  const onTokenPhotoChange = (files: any) => {
    setPhoto(files[0]);
    const reader = new FileReader();
    reader.addEventListener("load", () => {
      setPhotoImg(reader.result);
      let image = new Image();

      if (reader.result !== null && (typeof reader.result === "string" || reader.result instanceof String)) {
        image.src = reader.result.toString();

        //save dimensions
        image.onload = function () {
          let height = image.height;
          let width = image.width;

          const tokenCopy = { ...token };
          tokenCopy.dimensions = { height: height, width: width };
          setToken(tokenCopy);

          return true;
        };
      }
    });
    reader.readAsDataURL(files[0]);
  };

  const fileInputTokenPhoto = e => {
    e.preventDefault();
    const files = e.target.files;
    if (files.length) {
      handleFiles(files);
    }
  };

  const dragOver = e => {
    e.preventDefault();
  };

  const dragEnter = e => {
    e.preventDefault();
  };

  const dragLeave = e => {
    e.preventDefault();
  };

  const fileDrop = e => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files.length) {
      handleFiles(files);
    }
  };

  const handleFiles = (files: any) => {
    for (let i = 0; i < files.length; i++) {
      if (validateFile(files[i])) {
        onTokenPhotoChange(files);
      } else {
        files[i]["invalid"] = true;
        // Alert invalid image
      }
    }
  };

  const validateFile = file => {
    const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/x-icon"];
    if (validTypes.indexOf(file.type) === -1) {
      return false;
    }
    return true;
  };

  const removeImage = () => {
    setPhoto(null);
    setPhotoImg(null);
  };

  //input component
  function renderInputCreateModal(p) {
    return (
      <div>
        <InputWithLabelAndTooltip
          labelName={p.name}
          tooltip={p.info}
          type={p.type}
          inputValue={p.value ? p.value : createAToken ? token[p.item] : tokenImport[p.item]}
          placeHolder={p.placeholder}
          minValue={p.min}
          onInputValueChange={e => {
            if (createAToken) {
              let tokenCopy = { ...token };
              tokenCopy[p.item] = p.type === "number" ? parseFloat(e.target.value) : e.target.value;
              setToken(tokenCopy);
            } else if (!p.value) {
              let tokenCopy = { ...tokenImport };
              tokenCopy[p.item] = e.target.value;
              setTokenImport(tokenCopy);
            }
          }}
          disabled={p.disable ? true : false} />
      </div>
    );
  }

  //selector component
  function SelectorCreateModal(props: any) {
    return (
      <div>
        <FormControl className="selectorFormControlCreatePod">
          <StyledSelect
            disableUnderline
            value={props.selectValue}
            style={{ width: props.width }}
            className="selectCreatePod"
            onChange={props.selectFunction}
          >
            {props.selectItems.map((item, i) => {
              return (
                <StyledMenuItem key={i} value={item}>
                  {item}
                </StyledMenuItem>
              );
            })}
          </StyledSelect>
        </FormControl>
      </div>
    );
  }

  useEffect(() => {
    const amm = token.AMM;
    const initialSupply = Number(token.InitialSupply);
    const targetSupply = Number(token.TargetSupply);
    const targetPrice = Number(token.TargetPrice);
    const newLine: any = { ...line };
    const xs: number[] = [];
    const ys: number[] = [];
    if (amm && initialSupply != undefined && targetSupply && targetPrice && targetSupply >= initialSupply) {
      let maxY;
      switch (amm) {
        case "Quadratic":
          maxY =
            (Math.pow(targetSupply * 1.6 - initialSupply, 2) * targetPrice) /
            Math.pow(targetSupply - initialSupply, 2);
          for (let i = 0; i < line.maxPoints; i++) {
            const x = (i * targetSupply * 1.6) / line.maxPoints;
            const y =
              x >= initialSupply
                ? (Math.pow(x - initialSupply, 2) * targetPrice) / Math.pow(targetSupply - initialSupply, 2)
                : 0;
            xs.push(x);
            ys.push(Math.min(y, maxY));
          }
          break;
        case "Linear":
          maxY = ((targetSupply * 1.6 - initialSupply) * targetPrice) / (targetSupply - initialSupply);
          for (let i = 0; i < line.maxPoints; i++) {
            const x = (i * targetSupply * 1.6) / line.maxPoints;
            const y =
              x >= initialSupply ? ((x - initialSupply) * targetPrice) / (targetSupply - initialSupply) : 0;
            xs.push(x);
            ys.push(Math.min(y, maxY));
          }
          break;
        case "Exponential":
          maxY = Math.exp(targetSupply * 1.6 - targetSupply) * targetPrice;
          for (let i = 0; i < line.maxPoints; i++) {
            const x = (i * targetSupply * 1.6) / line.maxPoints;
            const y = x >= initialSupply ? Math.exp(x - targetSupply) * targetPrice : 0; // e(x-I)*targetPrice/e(K-I)
            xs.push(x);
            ys.push(Math.min(y, maxY));
          }
          break;
        case "Sigmoid":
          maxY =
            targetPrice / (1 + Math.exp(targetSupply - initialSupply - (targetSupply * 1.6 - initialSupply)));
          for (let i = 0; i < line.maxPoints; i++) {
            const x = (i * targetSupply * 1.6) / line.maxPoints;
            const y =
              x >= initialSupply
                ? targetPrice / (1 + Math.exp(targetSupply - initialSupply - (x - initialSupply)))
                : 0;
            xs.push(x);
            ys.push(Math.min(y, maxY));
          }
          break;
      }
      for (let i = 0; i < line.maxPoints; i++) {
        const x = targetSupply * 1.6 + i * ((targetSupply * 100) / line.maxPoints);
        xs.push(x);
        ys.push(maxY);
      }
      newLine.layout.xaxis.range = [0, targetSupply * 1.6];
      newLine.layout.yaxis.range = [0, targetPrice];
    }
    newLine.data.x = xs;
    newLine.data.y = ys;
    // set targetPrice and targetSupply lines
    const maxNum = Number.MAX_VALUE / 10;
    const minNum = -Number.MAX_VALUE / 10;
    let x2s: number[] = [];
    let y2s: number[] = [];
    let x3s: number[] = [];
    let y3s: number[] = [];
    if (targetSupply) {
      x2s = Array(line.maxPoints).fill(targetSupply);
      for (let i = 0; i < line.maxPoints; i++) {
        y2s.push(minNum + i * 2 * (maxNum / line.maxPoints));
      }
    }
    if (targetPrice) {
      y3s = Array(line.maxPoints).fill(targetPrice);
      for (let i = 0; i < line.maxPoints; i++) {
        x3s.push(minNum + i * 2 * (maxNum / line.maxPoints));
      }
    }
    newLine.data3.x = x3s;
    newLine.data3.y = y3s;
    newLine.data2.x = x2s;
    newLine.data2.y = y2s;
    // set axis labels
    if (token.FundingToken) newLine.layout.yaxis.title.text = `Price (${token.FundingToken})`;
    if (token.TokenSymbol) newLine.layout.xaxis.title.text = `Supply (${token.TokenSymbol})`;
    newLine.layout.datarevision += 1;
    setLine(newLine);
  }, [token]);

  return (
    <Modal className="modalCreateModal modal centered" open={props.open} onClose={props.onClose}>
      <div className="modal-content create-community-token-modal modalCreatePodFullDiv modalCreatePadding white-inputs">
        <div className="exit" onClick={props.onClose}>
          <img src={require("assets/icons/x_darkblue.png")} alt={"x"} />
        </div>
        <div className="option-buttons community-token">
          <button
            className={createAToken ? "selected" : undefined}
            id="publicButtonCreatePod"
            onClick={() => {
              setCreateAToken(!createAToken);
            }}
          >
            Create a token
          </button>
          <button
            className={!createAToken ? "selected" : undefined}
            id="publicButtonCreatePod"
            onClick={() => {
              setCreateAToken(!createAToken);
            }}
          >
            Import a token
          </button>
        </div>
        {createAToken ? (
          <div className="create-token">
            <Grid container spacing={0} direction="row" alignItems="flex-start" justify="flex-start">
              <Grid item xs={12} md={6}>
                {photoImg ? (
                  <div className="imageCreatePodDiv">
                    <div
                      className="imageCreatePod"
                      style={{
                        backgroundImage: `url(${photoImg})`,
                        backgroundPosition: "center",
                        backgroundRepeat: "no-repeat",
                        backgroundSize: "cover",
                        cursor: "pointer",
                      }}
                      onClick={() => {
                        if (inputRef && inputRef.current) {
                          inputRef.current.click();
                        }
                      }}
                    />
                    <div className="removeImageButton cursor-pointer" onClick={() => removeImage()}>
                      <SvgIcon><CloseSolid /></SvgIcon>
                    </div>
                    <InputWithLabelAndTooltip
                      type="file"
                      hidden
                      onInputValueChange={e => fileInputTokenPhoto(e)}
                      style={{
                        display: "none",
                      }}
                      reference={inputRef} />
                  </div>
                ) : (
                  <div
                    className="dragImageHereCreatePod cursor-pointer"
                    onDragOver={dragOver}
                    onDragEnter={dragEnter}
                    onDragLeave={dragLeave}
                    onDrop={fileDrop}
                    style={{
                      cursor: "pointer",
                    }}
                    onClick={() => {
                      if (inputRef && inputRef.current) {
                        inputRef.current.click();
                      }
                    }}
                  >
                    <img className="dragImageHereIcon" src={imageIcon} alt={"camera"} />
                    <div className="dragImageHereLabel">Drag Image Here</div>
                    <InputWithLabelAndTooltip
                      type="file"
                      hidden
                      onInputValueChange={e => fileInputTokenPhoto(e)}
                      style={{
                        display: "none",
                      }}
                      reference={inputRef} />
                  </div>
                )}
              </Grid>

              <Grid item xs={12} md={6}>
                <div className="flexRowInputs">
                  {renderInputCreateModal({
                    name: "Token name",
                    placeholder: "Enter Community Token Name...",
                    type: "text",
                    item: "TokenName",
                    width: 260,
                    info: `Please name your token`,
                  })}
                  {
                    <div style={{ marginLeft: "10px" }}>
                      {renderInputCreateModal({
                        name: "Token Symbol",
                        placeholder: "Enter Token Symbol...",
                        type: "text",
                        item: "TokenSymbol",
                        width: 150,
                      })}
                    </div>
                  }
                </div>
                <div className="flexRowInputs">
                  <div>
                    <div className="flexRowInputs">
                      <div className="create-import-token-modal-header">Funding Token</div>
                      <Tooltip
                        TransitionComponent={Fade}
                        TransitionProps={{ timeout: 600 }}
                        arrow
                        className="tooltipHeaderInfo"
                        title={`The price of the community token is fixed by an AMM (basically a curve [community token supply, funding token price]). So the funding token is actually the token that you need to buy community tokens with, and that goes to the Pool of the AMM. Then, community tokens can also be bought with other tokens (apart from the funding token) by means of liquidity pools. All this works automatically, it will convert 'desired payment token' to 'funding token' then will get converted into 'community token'.`}
                      >
                        <img className="infoIconCreatePod" src={infoIcon} alt={"info"} />
                      </Tooltip>
                    </div>
                    <div className="selector-with-token">
                      {token.FundingToken && token.FundingToken.length > 0 ? (
                        <img
                          className="imgSelectorTokenAddLiquidityModal"
                          src={require(`assets/tokenImages/${token.FundingToken}.png`)}
                          alt={token.FundingToken}
                        />
                      ) : (
                        <div
                          style={{
                            width: 30,
                            height: 30,
                            borderRadius: 15,
                            backgroundColor: "656e7e",
                            margin: "0px 10px",
                          }}
                        />
                      )}
                      <SelectorCreateModal
                        width={150}
                        selectValue={fundingTokenName}
                        selectFunction={handleChangeTokenSelector}
                        selectItems={tokenNames}
                      />
                    </div>
                  </div>
                  {renderInputCreateModal({
                    name: "Trading Spread (%)",
                    placeholder: "Trading Spread value...",
                    type: "number",
                    item: "SpreadDividend",
                    info: `This is the spread that is charged for trading the community token. Basically, this amount is accumulated in the AMM which is later to be distributed between community stakers. As there is a difference between the buying and the selling price, this gap is what is kept to generate something that can be thought of as dividends to the token. Recommendation: 1 or 2%.`,
                    width: 200,
                  })}
                </div>
              </Grid>
            </Grid>
            <Grid container spacing={0} direction="row" alignItems="flex-start" justify="flex-start">
              <Grid item xs={12} md={6}>
                {renderInputCreateModal({
                  name: "Target Price",
                  placeholder: "Target Price value...",
                  type: "number",
                  item: "TargetPrice",
                  min: "0",
                  info: `This is the target price that the community token owner wants to achieve when the community reaches the targeted adoption (measured by target supply). After, the price can still rise depending on the curve, but basically this dictates the price that the token will have when the target supply is reached. Target Price recommendation: it really depends on the funding token. So for example if funding token is USDT, then the target is stable. But if the funding token is ETH or BTC, the target is measured in that token, for example 10 ETH, but the value against USD can vary on a day to day basis. So, to recommend a value depends on the funding token, which is at the discreation of the community creator`,
                  width: 400,
                })}
                {renderInputCreateModal({
                  name: "Target Supply",
                  placeholder: "Target Supply value...",
                  type: "number",
                  min: "0",
                  item: "TargetSupply",
                  info: `Target supply is the amount of released community tokens that you expect to achieve, as it pertains to the community being successfully adopted. That is, it is the target of number of tokens that the user wants to be in circulation. Ofcourse, it is not limited to this amount, after it has been reached, more tokens can be minted.`,
                  width: 400,
                })}
              </Grid>
              <Grid item xs={12} md={6}>
                {renderInputCreateModal({
                  name: "Initial Supply",
                  placeholder: "Range: 0 - Target Supply",
                  type: "number",
                  min: "0",
                  item: "InitialSupply",
                  info: `This is the initial supply that is minted by the community owner and that may be used for him/her to start distributing to its closest followers or just to make his community known. Recommended value, 5-10% of the target supply.`,
                  width: 400,
                })}
                <div className="flexRowInputs">
                  <div className="create-import-token-modal-header">Collateral options</div>
                  <Tooltip
                    TransitionComponent={Fade}
                    TransitionProps={{ timeout: 600 }}
                    arrow
                    className="tooltipHeaderInfo"
                    title={`This is collateral, deposited by the creator of the community, that may give investors, followers, and so on, more confidence in investing and following the community`}
                  >
                    <img className="infoIconCreatePod" src={infoIcon} alt={"info"} />
                  </Tooltip>
                </div>
                <div className="flexRowInputs collateral-options">
                  <InputWithLabelAndTooltip
                    overriedClasses="textFieldCreatePod"
                    type="number"
                    inputValue={token.CollateralQuantity}
                    placeHolder="0.00"
                    minValue={"0"}
                    onInputValueChange={e => {
                      let tokenCopy = { ...token };
                      tokenCopy.CollateralQuantity = parseFloat(e.target.value);
                      setToken(tokenCopy);
                    }}
                    style={{
                      width: "calc(210px - 24px)",
                    }} />
                  <div className="selector-with-token">
                    {token.CollateralToken && token.CollateralToken.length > 0 ? (
                      <img
                        className="imgSelectorTokenAddLiquidityModal"
                        src={require(`assets/tokenImages/${token.CollateralToken}.png`)}
                        alt={token.CollateralToken}
                      />
                    ) : (
                      <div
                        style={{
                          width: 30,
                          height: 30,
                          borderRadius: 15,
                          backgroundColor: "656e7e",
                          margin: "0px 10px",
                        }}
                      />
                    )}
                    <SelectorCreateModal
                      width={120}
                      selectValue={collateralTokenName}
                      selectFunction={handleChangeCollateralTokenSelector}
                      selectItems={tokenNames}
                    />
                  </div>
                </div>
              </Grid>
            </Grid>

            <Grid item xs={12} md={6}>
              <div className="flexRowInputs">
                <div className="create-import-token-modal-header">AMM Type</div>
                <Tooltip
                  TransitionComponent={Fade}
                  TransitionProps={{ timeout: 600 }}
                  arrow
                  className="tooltipHeaderInfo"
                  title={"Please select your AMM Type... "}
                >
                  <img className="infoIconCreatePod" src={infoIcon} alt={"info"} />
                </Tooltip>
              </div>
              <div className="option-buttons">
                {typeAMMs.map((typeAmm, i) => {
                  return (
                    <button
                      key={i}
                      className={token.AMM === typeAmm ? "selected" : undefined}
                      onClick={() => {
                        const newSocialToken = { ...token };
                        newSocialToken.AMM = typeAmm;
                        setToken(newSocialToken);
                      }}
                    >
                      {typeAmm}
                    </button>
                  );
                })}
              </div>
            </Grid>
            <Plot
              data={[line.data, line.data2, line.data3]}
              layout={line.layout}
              graphDiv="graph"
              className="plot"
            />

            <div className="flexRowInputs">
              <h4>Tokenomics</h4>
              <div className="option-buttons community-token">
                <button
                  className={vestingTaxation ? "selected" : undefined}
                  id="publicButtonCreatePod"
                  onClick={() => {
                    setVestingTaxation(!vestingTaxation);
                  }}
                >
                  On
                </button>
                <button
                  className={!vestingTaxation ? "selected" : undefined}
                  id="publicButtonCreatePod"
                  onClick={() => {
                    setVestingTaxation(!vestingTaxation);
                  }}
                >
                  Off
                </button>
              </div>
            </div>
            {vestingTaxation ? (
              <Grid container spacing={0} direction="row" alignItems="flex-start" justify="flex-start">
                <Grid item xs={12} md={6}>
                  {renderInputCreateModal({
                    name: "Vesting period",
                    placeholder: "Vesting period in months...",
                    type: "number",
                    item: "VestingPeriod",
                    min: "0",
                    info: ``,
                    width: 400,
                  })}
                </Grid>
                <Grid item xs={12} md={6}>
                  {renderInputCreateModal({
                    name: "Immediate Allocation (%)",
                    placeholder: "Immediate Allocation Pct",
                    type: "number",
                    item: "ImmediateAllocation",
                    info: ``,
                    width: 400,
                  })}
                  {renderInputCreateModal({
                    name: "Vested Allocation (%)",
                    placeholder: "Vested Allocation Pct",
                    type: "number",
                    item: "VestedAllocation",
                    info: ``,
                    width: 400,
                  })}
                </Grid>
              </Grid>
            ) : null}

            <LoadingWrapper loading={isLoading}>
              <button onClick={createToken} className="buttonCreatePod">
                Create Token
              </button>
            </LoadingWrapper>
          </div>
        ) : (
          <div className="import-token">
            <Grid container spacing={0} direction="row" alignItems="flex-start" justify="flex-start">
              <Grid item xs={12} md={6}>
                {photoImg ? (
                  <div className="imageCreatePodDiv">
                    <div
                      className="imageCreatePod cursor-pointer"
                      style={{
                        backgroundImage: `url(${photoImg})`,
                        backgroundPosition: "center",
                        backgroundRepeat: "no-repeat",
                        backgroundSize: "cover",
                        cursor: "pointer",
                      }}
                      onClick={() => {
                        if (inputRef && inputRef.current) {
                          inputRef.current.click();
                        }
                      }}
                    ></div>
                    <div className="removeImageButton cursor-pointer" onClick={() => removeImage()}>
                      <SvgIcon><CloseSolid /></SvgIcon>
                    </div>

                    <InputWithLabelAndTooltip
                      type="file"
                      hidden
                      onInputValueChange={e => fileInputTokenPhoto(e)}
                      style={{
                        display: "none",
                      }}
                      reference={inputRef} />
                  </div>
                ) : (
                  <div
                    className="dragImageHereCreatePod cursor-pointer"
                    onDragOver={dragOver}
                    onDragEnter={dragEnter}
                    onDragLeave={dragLeave}
                    onDrop={fileDrop}
                    style={{
                      cursor: "pointer",
                    }}
                    onClick={() => {
                      if (inputRef && inputRef.current) {
                        inputRef.current.click();
                      }
                    }}
                  >
                    <img className="dragImageHereIcon" src={imageIcon} alt={"camera"} />
                    <div className="dragImageHereLabel">Drag Image Here</div>
                    <InputWithLabelAndTooltip
                      type="file"
                      hidden
                      onInputValueChange={e => fileInputTokenPhoto(e)}
                      style={{
                        display: "none",
                      }}
                      reference={inputRef} />
                  </div>
                )}
              </Grid>
              <Grid item xs={12} md={6}>
                {!isEthWalletConnected ? <Connect /> : null}

                {renderInputCreateModal({
                  name: "Smart Contract Address",
                  placeholder: "Enter 0x Address...",
                  type: "text",
                  item: "EthereumContractAddress",
                  width: 400,
                  info: "Address of already deployed Smart Contract on Ethereum Blockchain.",
                })}
              </Grid>
            </Grid>
            <Grid container spacing={0} direction="row" alignItems="flex-end" justify="flex-start">
              <Grid item xs={12} md={6}>
                {renderInputCreateModal({
                  name: "Token name",
                  placeholder: "Enter Etherum Smart Contract...",
                  type: "text",
                  item: "TokenName",
                  width: 400,
                  disable: true,
                  value: readTokenName,
                })}

                {renderInputCreateModal({
                  name: "Token Symbol",
                  placeholder: "Enter Etherum Smart Contract...",
                  type: "text",
                  item: "TokenSymbol",
                  width: 400,
                  disable: true,
                  value: readTokenSymbol,
                })}
              </Grid>
              <Grid item xs={12} md={6}>
                {renderInputCreateModal({
                  name: "Initial Supply",
                  placeholder: "Range: 0 - Target Supply",
                  type: "number",
                  item: "InitialSupply",
                  info: `This is the initial supply that is minted by the community owner and that may be used for him/her to start distributing to its closest followers or just to make his community known. Recommended value, 5-10% of the target supply.`,
                  width: 400,
                })}
                {renderInputCreateModal({
                  name: "Frequency",
                  placeholder: "Enter Interest Frequency...",
                  type: "text",
                  item: "Frequency",
                  width: 400,
                  disable: true,
                  value: "DAILY",
                })}
              </Grid>

              <Grid item xs={12} md={6}>
                <div>
                  <div className="flexRowInputs">
                    <div className="create-import-token-modal-header">Funding Token</div>
                    <Tooltip
                      TransitionComponent={Fade}
                      TransitionProps={{ timeout: 600 }}
                      arrow
                      className="tooltipHeaderInfo"
                      title={`The Symbol of the token that is already or will be paird with on Uniswap`}
                    >
                      <img className="infoIconCreatePod" src={infoIcon} alt={"info"} />
                    </Tooltip>
                  </div>
                  <div className="selector-with-token">
                    {tokenImport.FundingToken && tokenImport.FundingToken.length > 0 ? (
                      <img
                        className="imgSelectorTokenAddLiquidityModal"
                        src={require(`assets/tokenImages/${tokenImport.FundingToken}.png`)}
                        alt={tokenImport.FundingToken}
                      />
                    ) : (
                      <div
                        style={{
                          width: 30,
                          height: 30,
                          borderRadius: 15,
                          backgroundColor: "656e7e",
                          margin: "0px 10px",
                        }}
                      />
                    )}
                    <SelectorCreateModal
                      selectValue={fundingTokenImportName}
                      selectFunction={handleChangeTokenSelector}
                      selectItems={tokenNames}
                      width={350}
                    />
                  </div>
                </div>
              </Grid>
              <Grid item xs={12} md={6}>
                <div className="disabled textFieldCreatePod">
                  <span>Estimated Gas Fee:</span>
                  <span>{`${gasFee} ${tokenImport.FundingToken}`}</span>
                </div>
              </Grid>
            </Grid>
            <LoadingWrapper loading={isLoading}>
              <button onClick={importToken} className="buttonCreatePod">
                Import Token
            </button>
            </LoadingWrapper>
          </div>
        )}
        {status && (
          <AlertMessage
            key={status.key}
            message={status.msg}
            variant={status.variant}
            onClose={() => setStatus(undefined)}
          />
        )}
      </div>
    </Modal>
  );
}, arePropsEqual);

const mapStateToProps = state => {
  return {
    user: state.user,
  };
};

export default connect(mapStateToProps)(CreateImportTokenModal);
