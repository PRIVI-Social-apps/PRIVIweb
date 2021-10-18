import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import DateFnsUtils from "@date-io/date-fns";
import axios from "axios";

import Grid from "@material-ui/core/Grid";
import { makeStyles } from "@material-ui/core/styles";
import { Fade, Tooltip } from "@material-ui/core";
import Divider from "@material-ui/core/Divider";
import Typography from "@material-ui/core/Typography";
import FormControl from "@material-ui/core/FormControl";
import { KeyboardDatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";

import { RootState } from "store/reducers/Reducer";
import { setUpdatePodCreation } from "store/actions/UpdatePodCreation";
import AMMGraph from "./AMMGraph";
import URL from "shared/functions/getURL";
import { StyledSelect, StyledMenuItem } from "shared/ui-kit/Styled-components/StyledComponents";
import { updateTask } from "shared/functions/updateTask";
import { signTransaction } from "shared/functions/signTransaction";
import { TokenSelect } from "shared/ui-kit/Select/TokenSelect";
import StyledCheckbox from "shared/ui-kit/Checkbox";
import AlertMessage from "shared/ui-kit/Alert/AlertMessage";

import "./Pod-create-modal.css";
import { LoadingWrapper } from "shared/ui-kit/Hocs";
import { TabNavigation } from "shared/ui-kit";

import SvgIcon from "@material-ui/core/SvgIcon";
import { ReactComponent as CloseSolid } from "assets/icons/close-solid.svg";
import CustomSwitch from "shared/ui-kit/CustomSwitch";
import InputWithLabelAndTooltip from "shared/ui-kit/InputWithLabelAndTooltip";

// ----------------- For the Graphs in FT ---------------------
//import Plotly from "plotly.js-basic-dist";
//import createPlotlyComponent from "react-plotly.js/factory";
//const Plot = createPlotlyComponent(Plotly);
// Main line
const lineInitState = {
  maxPoints: 100,
  data: {
    x: [],
    y: [],
    line: {
      dash: "solid",
      color: "green",
    },
  },
  data2: {
    x: [],
    y: [],
    line: {
      dash: "dash",
      color: "grey",
    },
  },
  data3: {
    x: [],
    y: [],
    line: {
      dash: "dash",
      color: "grey",
    },
  },
  layout: {
    autosize: false,
    height: 250,
    width: 850,
    bordercolor: "FFFFFF",
    plot_bgcolor: "rgb(227, 233, 239)",
    datarevision: 0,
    xaxis: {
      linecolor: "rgb(100, 200, 158)",
      linewidth: 2,
      mirror: true,
      automargin: true,
      title: false,
    },
    yaxis: {
      linecolor: "rgb(100, 200, 158)",
      linewidth: 2,
      mirror: true,
      automargin: true,
      title: false,
    },
    margin: {
      l: 20,
      r: 20,
      b: 10,
      t: 10,
      pad: 0,
    },
  },
};

// ---------------------------------------------------

const imageIcon = require("assets/icons/image_icon.png");
const searchIcon = require("assets/icons/search_right_blue.png");
const infoIcon = require("assets/icons/info_icon.png");
const calendarIcon = require("assets/icons/calendar_icon.png");
const plusWhiteIcon = require("assets/icons/plus_white.png");

const useStyles = makeStyles(theme => ({
  root: {
    width: "100%",
    "& > * + *": {
      marginTop: theme.spacing(2),
    },
  },
}));

const arePropsEqual = (prevProps, currProps) => {
  return prevProps.open === currProps.open && prevProps.type === currProps.type;
};

const minDate = new Date();
const startDate = new Date();
const dateExpiration = new Date();
dateExpiration.setDate(startDate.getDate() + 1);

const PodCreateModal = React.memo((props: any) => {
  const dispatch = useDispatch();
  const classes = useStyles();
  const userSelector = useSelector((state: RootState) => state.user);

  const [line, setLine] = useState<any>(lineInitState);

  const [status, setStatus] = useState<any>("");

  const [creationProgress, setCreationProgress] = useState(false);

  const [pod, setPod] = useState<any>({
    Private: false,
    Name: "",
    Description: "",
    DiscordID: "",
    TokenName: "",
    TokenSymbol: "",
    Principal: "",
    Supply: "",
    P_liquidation: "",
    Royalty: "",
    Interest: "",
    TargetSpread: "",
    ExchangeSpread: "",
    StartDate: startDate,
    DateExpiration: dateExpiration,
  });
  const inputRef = useRef<any>();
  const [type, setType] = useState<any>(props.type);
  const [openToAdvertising, setOpenToAdvertising] = useState<any>(true);
  const [publicPrivatePod, setPublicPrivatePod] = useState<boolean>(false);

  const [photo, setPhoto] = useState<any>(null);
  const [photoImg, setPhotoImg] = useState<any>(null);

  const [tokens, setTokens] = useState<string[]>(["PRIVI", "BC", "DC"]);
  const [collateralToken, setCollateralToken] = useState<string>(tokens[0]);
  const [collateral, setCollateral] = useState<string>("");
  const [collaterals, setCollaterals] = useState<Map<string, string>>(new Map([]));
  const [requiredTokenToInvestValue, setRequiredTokenToInvestValue] = useState<string>("");
  const [requiredTokensToInvest, setRequiredTokensToInvest] = useState<Map<string, string>>(new Map([]));

  const [collateralError, setCollateralError] = useState<string>("");
  const [requiredTokensError, setRequiredTokensError] = useState<string>("");
  const [errorMsg, setErrorMsg] = useState<string>("");

  const [addHashtag, setAddHashtag] = useState(false);
  const [hashtag, setHashtag] = useState<string>("");
  const [hashtags, setHashtags] = useState<any[]>([]);
  const [checkbox, setCheckbox] = React.useState({
    checked: false,
  });

  const [requiredTokenToInvestToken, setRequiredTokenToInvestToken] = useState<string>(tokens[0]);
  const [principalTokenSelector, setPrincipalTokenSelector] = useState<string>("");
  const [frequency, setFrequency] = useState<string>("Daily");
  const [interestDueSelector, setInterestDueSelector] = useState<string>("1th");

  //advanced
  const amms = ["Quadratic", "Linear", "Exponential", "Sigmoid"];
  const [ammType, setAmmType] = useState<string>(amms[0]);
  //admins
  const [admin, setAdmin] = useState<string>("");
  const [admins, setAdmins] = useState<any[]>([]);
  //users
  const [user, setUser] = useState<string>("");
  const userRoles = ["Admin", "Moderator"];
  const [userRole, setUserRole] = useState<string>(userRoles[0]);
  const [usersRoles, setUsersRoles] = useState<any[]>([]);
  const handleChangeUserRole = event => {
    const value = event.target.value;
    setUserRole(value);
  };
  //insurers
  const [insurerSearcher, setInsurerSearcher] = useState<string>("");
  const [insurers, setInsurers] = useState<string[]>([]);
  const [tabsInsurersValue, setTabsInsurersValue] = React.useState(0);
  const handleChangeTabsInsurers = newValue => {
    setTabsInsurersValue(newValue);
  };
  const insurersTab = ["All insurers", "New insurers", "Past insurers"];

  useEffect(() => {
    if (pod.TargetSpread && pod.ExchangeSpread) {
      const targetSpead: number = Number(pod.TargetSpread) / 100;
      const exchangeSpread: number = Number(pod.ExchangeSpread) / 100;
      const xs: number[] = [];
      const ys: number[] = [];
      switch (ammType) {
        case "Quadratic":
          for (let x = 0; x < line.maxPoints; x++) {
            const y = targetSpead * x + exchangeSpread;
            xs.push(x);
            ys.push(y);
          }
          break;
        case "Linear":
          for (let x = 0; x < line.maxPoints; x++) {
            const y = targetSpead * x + exchangeSpread;
            xs.push(x);
            ys.push(y);
          }
          break;
        case "Exponential":
          for (let x = 0; x < line.maxPoints; x++) {
            const y = targetSpead * x + exchangeSpread;
            xs.push(x);
            ys.push(y);
          }
          break;
        case "Sigmoid":
          for (let x = 0; x < line.maxPoints; x++) {
            const y = targetSpead * x + exchangeSpread;
            xs.push(x);
            ys.push(y);
          }
          break;
      }
      const x2s = Array(line.maxPoints).fill(Number(pod.TargetSpread));
      const y2s = Array.from(Array(line.maxPoints).keys());
      const x3s = Array.from(Array(line.maxPoints).keys());
      const y3s = Array(line.maxPoints).fill(Number(pod.ExchangeSpread));

      const newLine: any = { ...line };
      newLine.data.x = xs;
      newLine.data.y = ys;
      newLine.data2.x = x2s;
      newLine.data2.y = y2s;
      newLine.data3.x = x3s;
      newLine.data3.y = y3s;
      newLine.layout.datarevision += 1;
      setLine(newLine);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pod.TargetSpread, pod.ExchangeSpread]);

  // get token list from backend
  useEffect(() => {
    if (props.open) {
      axios.get(`${URL()}/wallet/getCryptosRateAsList`).then(res => {
        const resp = res.data;
        if (resp.success) {
          const tokenList = resp.data.map(obj => ({ token: obj.token, name: obj.token })); // update token list
          setTokens(tokenList); // update token list
          setCollateralToken(tokenList[0].token); // initial (default) collateral selection
          setRequiredTokenToInvestToken(tokenList[0].token); // initial (default) collateral selection
          setPrincipalTokenSelector(tokenList[0].token); // initial (default) collateral selection
          const newPod = { ...pod };
          newPod.Token = tokenList[0];
          setPod(newPod);
        }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleOpenToAdvertising = (type: boolean) => {
    setOpenToAdvertising(type);
  };

  const handlePodPrivate = (prvt: boolean) => {
    let podCopy = { ...pod };
    podCopy.Private = prvt;
    setPublicPrivatePod(prvt);
    setPod(podCopy);
  };

  const handleChangeCollateralSelector = event => {
    const value = event.target.value;
    setCollateralToken(value);
  };

  const handleChangeRequiredTokenToInvestToken = event => {
    const value = event.target.value;
    setRequiredTokenToInvestToken(value);
  };

  const handleChangePrincipalTokenSelector = event => {
    const value = event.target.value;
    setPrincipalTokenSelector(value);
  };

  const handleChangeFrequency = event => {
    const value = event.target.value;
    setFrequency(value);
  };

  const handleChangeInterestDueSelector = event => {
    const value = event.target.value;
    setInterestDueSelector(value);
  };

  const handleExpirationDateChange = (elem: any) => {
    let podCopy = { ...pod };
    podCopy.DateExpiration = new Date(elem);
    // TODO: check if inverted dates and change accordingly
    //if (podCopy.DateExpiration.getTime() <= podCopy.StartDate.getTime())
    //podCopy.StartDate.setDate(podCopy.DateExpiration.getDate() - 1)
    setPod(podCopy);
  };

  const handleDateOfStartChange = (elem: any) => {
    let podCopy = { ...pod };
    podCopy.StartDate = new Date(elem);
    // TODO: check if inverted dates and change accordingly
    //if (podCopy.StartDate.getTime() >= podCopy.DateExpiration.getTime())
    //podCopy.DateExpiration.setDate(podCopy.StartDate.getDate() + 1)
    setPod(podCopy);
  };

  const handleChangeCheckboxExpiration = (event: any) => {
    setCheckbox({ ...checkbox, [event.target.name]: event.target.checked });
    let expirationDateInput = document.getElementById("date-picker-expiration-date") as any;
    let expirationDateIcon = document.getElementsByClassName("iconCalendarCreatePod")[1] as any;

    if (event.target.checked) {
      let podCopy = { ...pod };
      expirationDateInput.disabled = true;
      podCopy.DateExpiration = null;
      expirationDateInput.placeholder = "";
      expirationDateIcon.style.opacity = 0;
      setPod(podCopy);
    } else {
      let podCopy = { ...pod };
      expirationDateInput.disabled = false;
      expirationDateInput.placeholder = "Select date...";
      expirationDateIcon.style.opacity = 1;
      podCopy.DateExpiration = new Date();
      podCopy.DateExpiration.setDate(podCopy.StartDate.getDate() + 1);
      setPod(podCopy);
    }
  };

  const checkIfExist = (): Promise<any> => {
    return new Promise<any>((resolve, reject) => {
      try {
        axios
          .post(`${URL()}/pod/FT/checkPodInfo`, { podName: pod.Name })
          .then(response => {
            const resp = response.data.data.podExists;
            resolve(resp);
          })
          .catch(error => {
            setStatus({
              msg: "Error when making the request",
              key: Math.random(),
              variant: "error",
            });
          });
      } catch (e) {
        reject(e);
      }
    });
  };

  const validatePodInfo = async () => {
    let check: any = await checkIfExist();

    if (!(pod.Name.length >= 4)) {
      setStatus({
        msg: "Name field invalid. Minimum 4 characters required.",
        key: Math.random(),
        variant: "error",
      });
      return false;
    } else if (check === true) {
      setStatus({
        msg: "Name field invalid. A pod with this name already exist.",
        key: Math.random(),
        variant: "error",
      });
      return false;
    } /*else if (!(pod.Description.length >= 20)) {
      setErrorMsg("Description field invalid. Minimum 20 characters required");
      handleClickError();
      return false;
    }*/ else if (!hashtags || hashtags.length === 0) {
      setStatus({
        msg: "Minimum one Hashtags",
        key: Math.random(),
        variant: "error",
      });
      return false;
    } else if (!(pod.TokenName.length >= 5)) {
      setStatus({
        msg: "Token name field must have at least 5 characters",
        key: Math.random(),
        variant: "error",
      });
      return false;
    } else if (!(pod.TokenSymbol.length >= 3)) {
      setStatus({
        msg: "Token ID must have at least 3 characters",
        key: Math.random(),
        variant: "error",
      });
      return false;
    } else if (!type.includes("NFT") && !(pod.Principal > 0)) {
      setStatus({
        msg: "Principal field must be greater than 0",
        key: Math.random(),
        variant: "error",
      });
      return false;
    } else if (!type.includes("NFT") && (!collaterals || collaterals.size === 0)) {
      setStatus({
        msg: "Select at least one token as collateral",
        key: Math.random(),
        variant: "error",
      });
      return false;
    } else if (!pod.DateExpiration && !checkbox.checked) {
      setStatus({
        msg: "Expiration date field invalid",
        key: Math.random(),
        variant: "error",
      });
      return false;
    } else if (!pod.StartDate) {
      setStatus({
        msg: "Start date field invalid",
        key: Math.random(),
        variant: "error",
      });
      return false;
    } else if (!type.includes("NFT") && (!pod.Interest || pod.Interest < 0.1 || pod.Interest > 300)) {
      setStatus({
        msg: "Interest field must be between 0.1% - 300%)",
        key: Math.random(),
        variant: "error",
      });
      return false;
    } else if (type.includes("NFT") && !pod.Supply) {
      setStatus({
        msg: "Total supply field invalid",
        key: Math.random(),
        variant: "error",
      });
      return false;
    } else if (!type.includes("NFT") && (!pod.P_liquidation || pod.P_liquidation < 30)) {
      setStatus({
        msg: "Liquidation CCR field invalid. Must be at least 30%",
        key: Math.random(),
        variant: "error",
      });
      return false;
      /*
    } else if (type.includes("Digital NFT") && !pod.Royalty) {
      setErrorMsg("Royalty field invalid");
      handleClickError();
      return false;
    */
    } else if (!type.includes("NFT") && !(pod.TargetSpread >= 40 && pod.TargetSpread <= 95)) {
      setStatus({
        msg: "Target Spread field invalid",
        key: Math.random(),
        variant: "error",
      });
      return false;
    } else if (!type.includes("NFT") && !(pod.ExchangeSpread >= 0.1 && pod.ExchangeSpread <= 15)) {
      setStatus({
        msg: "Exchange Spread field invalid",
        key: Math.random(),
        variant: "error",
      });
      return false;
    } else return true;
  };
  const createFTPod = async () => {
    if (validatePodInfo()) {
      let RateChangeBody = {};
      RateChangeBody[0] = principalTokenSelector;
      let counter = 1;
      for (let entry of collaterals.entries()) {
        RateChangeBody[counter] = entry[0];
      }
      let collateralBody = {};
      for (let entry of collaterals.entries()) {
        collateralBody[entry[0]] = parseFloat(entry[1]);
      }
      const sigBody: any = {
        PodInfo: {
          Creator: userSelector.id,
          AMM: ammType.toUpperCase(),
          SpreadTarget: parseFloat(pod.TargetSpread) / 100 ?? 0,
          SpreadExchange: parseFloat(pod.ExchangeSpread) / 100 ?? 0,
          TokenSymbol: pod.TokenSymbol,
          TokenName: pod.TokenName,
          FundingToken: principalTokenSelector,
          Principal: parseFloat(pod.Principal) ?? 0,
          DateExpiration: pod.DateExpiration,
          Frequency: frequency.toUpperCase(),
          Interest: parseFloat(pod.Interest) / 100 ?? 0,
          LiquidationCCR: parseFloat(pod.P_liquidation) / 100 ?? 0,
          Collaterals: collateralBody,
        },
        RateChange: RateChangeBody,
      };
      const [hash, signature] = await signTransaction(userSelector.mnemonic, sigBody);
      let body = { ...sigBody };
      body.Hash = hash;
      body.Signature = signature;
      // start --- i am not sure these are needed ---
      const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
      if (!pod.StartDate) pod.StartDate = Date.now();
      if (!pod.DateExpiration) pod.DateExpiration = Date.now();
      const firstDate: number = pod.StartDate;
      const secondDate: number = pod.DateExpiration;
      const diffDays = Math.round(Math.abs((firstDate - secondDate) / oneDay));
      // end --- i am not sure these are needed ---
      // db objects
      body.Name = pod.Name;
      body.Description = pod.Description;
      body.MainHashtag = hashtags.length > 0 ? hashtags[0] : "";
      body.Hashtags = hashtags;
      body.Private = publicPrivatePod;
      body.HasPhoto = !!(photoImg && photo); // what is this ??
      body.DiscordID = pod.DiscordID;
      body.Admins = admins;
      body.RequiredTokens = principalTokenSelector;
      body.Advertising = openToAdvertising;
      body.InterestDue = interestDueSelector; // for now its always '1st'
      body.dimensions = pod.dimensions;
      console.log("createFTPod body", body);
      setCreationProgress(true);
      axios
        .post(`${URL()}/pod/FT/initiatePod`, body)
        .then(async response => {
          const resp = response.data;
          if (resp.success) {
            await updateTask(userSelector.id, "Create a Pod"); // update task
            await sendInvitations(resp.data, true); // send invitations
            setStatus({
              msg: "Pod Created!",
              key: Math.random(),
              variant: "success",
            });
            dispatch(setUpdatePodCreation(true));
            if (body.HasPhoto) {
              await uploadImage(resp.data, pod.TokenSymbol);
            }
            props.refreshPods();
            // close creatinon modal in 1000ms after pod created
            setTimeout(() => {
              props.onCloseModal();
              setCreationProgress(false);
            }, 1000);
          } else {
            setStatus({
              msg: "Error when making the request",
              key: Math.random(),
              variant: "error",
            });
            setCreationProgress(false);
          }
        })
        .catch(error => {
          setStatus({
            msg: "Error when making the request",
            key: Math.random(),
            variant: "error",
          });
          setCreationProgress(false);
        });
    }
  };
  const createNFTPod = async () => {
    if (validatePodInfo()) {
      const body: any = {
        Creator: userSelector.id,
        TokenSymbol: pod.TokenSymbol,
        TokenName: pod.TokenName,
        Supply: Number(pod.Supply),
        Royalty: pod.Rolyalty,
        DateExpiration: pod.DateExpiration,
      };
      const [hash, signature] = await signTransaction(userSelector.mnemonic, body);
      body.Hash = hash;
      body.Signature = signature;
      body.Name = pod.Name;
      body.Description = pod.Description;
      body.Hashtags = hashtags;
      body.MainHashtag = hashtags.length > 0 ? hashtags[0] : "";
      body.Private = publicPrivatePod;
      body.HasPhoto = !!(photoImg && photo);
      body.Advertising = openToAdvertising;
      body.IsDigital = type === "Digital NFT";
      body.Admins = admins;
      body.RequiredTokens = principalTokenSelector;
      body.Advertising = openToAdvertising;
      setCreationProgress(true);
      axios
        .post(`${URL()}/pod/NFT/initiatePod`, body)
        .then(async response => {
          const resp = response.data;
          const podAddress = resp.data;
          if (resp.success) {
            await sendInvitations(podAddress, true); // send invitations
            setStatus({
              msg: "Pod Created!",
              key: Math.random(),
              variant: "success",
            });
            dispatch(setUpdatePodCreation(true));
            if (pod.HasPhoto) {
              await uploadImage(podAddress, pod.TokenSymbol);
            }
            props.refreshPods();
            setTimeout(() => {
              props.onCloseModal();
              setCreationProgress(false);
            }, 1000);
          } else {
            setStatus({
              msg: "Error when making the request",
              key: Math.random(),
              variant: "error",
            });
            setCreationProgress(false);
          }
        })
        .catch(error => {
          setStatus({
            msg: "Error when making the request",
            key: Math.random(),
            variant: "error",
          });
          setCreationProgress(false);
        });
    }
  };

  // send the role invitations to the users email
  const sendInvitations = async (podId, isPodFt) => {
    return new Promise((resolve, reject) => {
      const invitationList: any[] = [];
      usersRoles.forEach(obj => {
        invitationList.push({
          adminId: userSelector.id,
          isPodFT: isPodFt,
          podId: podId,
          invitedUser: obj.name,
          role: obj.role,
        });
      });
      const body = {
        invitationList: invitationList,
      };
      axios
        .post(`${URL()}/pod/inviteRole`, body)
        .then(response => {
          if (response.data.success) console.log("invitation sent");
          else console.log("error at sending invitation");
          resolve(true);
        })
        .catch(error => {
          console.log(error);
          resolve(true);
          alert("Error sending invitations");
        });
    });
  };
  const uploadImage = async (podId, podTokenSymbol) => {
    return new Promise((resolve, reject) => {
      const formData = new FormData();
      formData.append("image", photo, podId);
      const formTokenData = new FormData();
      formTokenData.append("image", photo, podTokenSymbol);
      const config = {
        headers: {
          "content-type": "multipart/form-data",
        },
      };
      if (!type.includes("NFT")) {
        axios
          .post(`${URL()}/pod/changeFTPodPhoto`, formData, config)
          .then(response => {
            resolve(true);
          })
          .catch(error => {
            console.log(error);
            resolve(true);
            alert("Error uploading photo");
          });
      } else {
        axios
          .post(`${URL()}/pod/changeNFTPodPhoto`, formData, config)
          .then(response => {
            resolve(true);
          })
          .catch(error => {
            console.log(error);
            resolve(true);
            alert("Error uploading photo");
          });
      }
      //upload token symbol image
      axios
        .post(`${URL()}/wallet/changeTokenPhoto`, formTokenData, config)
        .then(response => {
          let body = { dimensions: pod.tokenDimensions ?? pod.dimensions, id: podTokenSymbol };
          axios.post(`${URL()}/wallet/updateTokenPhotoDimensions`, body).catch(error => {
            console.log(error);

            alert("Error uploading photo");
          });
          resolve(true);
        })
        .catch(error => {
          console.log(error);
          resolve(true);
          alert("Error uploading token photo");
        });
    });
  };
  const onChangePodPhoto = (files: any) => {
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

          const podCopy = { ...pod };
          podCopy.dimensions = { height: height, width: width };
          setPod(podCopy);

          return true;
        };
      }
    });
    reader.readAsDataURL(files[0]);
  };
  //check collateral value (before adding it to the collaterals list) > 0
  const validateCollateral = (value: string) => {
    let collateralError: string = "";
    if (!value) {
      collateralError = "Please enter a valid number";
    } else if (collaterals.get(collateralToken)) {
      collateralError = "Collateral with this token already added";
    } else if (Number.parseFloat(value) <= 0) {
      collateralError = "Collateral must be greater than 0";
    }
    return collateralError;
  };
  //check required tokens (before adding it to the required tokens to invest list) > 0
  const validateRequiredToken = (value: string) => {
    let requiredTokensError: string = "";
    if (!value) {
      requiredTokensError = "Please enter a valid number";
    } else if (requiredTokensToInvest.get(requiredTokenToInvestToken)) {
      requiredTokensError = "Token already added";
    } else if (Number.parseFloat(value) <= 0) {
      requiredTokensError = "Value must be greater than 0";
    }
    return requiredTokensError;
  };
  /*
  // check offer to add ok that is > 0
  const validateOffer = (offerAmount: string, offerPrice: string) => {
    let offerError: string = "";
    const offerAmountNum: number = Number(offerAmount);
    const offerPriceNum: number = Number(offerPrice);
    if (!offerAmountNum || offerAmountNum < 0)
      offerError = "amount must be a valid and positive number";
    else if (!offerPriceNum || offerPriceNum < 0)
      offerError = "price must be a valid and positive number";
    return offerError;
  };*/
  const addCollateral = () => {
    //add collateral and update collaterals list
    // e.preventDefault();
    let validatedErrors = validateCollateral(collateral);
    setCollateralError(validatedErrors);
    if (validatedErrors.length === 0) {
      const c = new Map();
      collaterals.forEach((val, key) => {
        c.set(key, val);
      });
      c.set(collateralToken, collateral);
      setCollaterals(c);
      setCollateral("");
    }
  };
  const addRequiredTokensToInvest = () => {
    // e.preventDefault();
    let validatedErrors = validateRequiredToken(requiredTokenToInvestValue);
    setRequiredTokensError(validatedErrors);
    if (validatedErrors.length === 0) {
      const c = new Map();
      requiredTokensToInvest.forEach((value, key) => {
        c.set(key, value);
      });
      c.set(requiredTokenToInvestToken, requiredTokenToInvestValue);
      setRequiredTokensToInvest(c);
      setRequiredTokenToInvestValue("");
    }
  };
  const addAdmin = () => {
    if (admin && admin !== "") {
      //TODO: check if email exists ???
      let array = [...admins];
      array.push({
        name: admin,
        status: "Pending",
      });
      setAdmins(array);
      setAdmin("");
    }
  };
  const addUserRole = () => {
    if (user && user !== "" && userRole && userRole !== "") {
      //TODO: check if email exists ???
      let array = [...usersRoles];
      array.push({
        name: user,
        role: userRole,
        status: "Pending",
      });
      setUsersRoles(array);
      setUser(""); // reset field
    }
  };
  const addInsurer = () => {
    if (insurerSearcher && insurerSearcher !== "") {
      //TODO: check if email exists ???
      let array = [...insurers];
      array.push(insurerSearcher);
      setInsurers(array);
      setInsurerSearcher(""); // reset field
    }
  };
  const fileInputPodPhoto = e => {
    e.preventDefault();
    console.log(e);
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
        onChangePodPhoto(files);
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
  const removePodImage = () => {
    setPhoto(null);
    setPhotoImg(null);
  };
  function renderInputCreateModal(p) {
    return (
      <div>
        <InputWithLabelAndTooltip
          labelName={p.name}
          tooltip={p.info}
          style={{
            width: "calc(" + p.width + "px - 24px)",
          }}
          type={p.type}
          minValue={p.min}
          inputValue={pod[p.item]}
          onInputValueChange={elem => {
            let podCopy = { ...pod };
            podCopy[p.item] = elem.target.value;
            setPod(podCopy);
          }}
          placeHolder={p.placeholder}
        />
      </div>
    );
  }
  const SelectorCreateModal = (props: any) => {
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
  };
  const AddButtonCreateModal = (props: any) => {
    return (
      <div className="createHashtagButton" onClick={props.function}>
        <img className="createHashtagButtonIcon" src={plusWhiteIcon} alt={"plus"} />
      </div>
    );
  };
  const HashtagLabel = props => {
    return (
      <div className={props.main ? "hashtagLabel hashtagLabelMain" : "hashtagLabel"}>
        {/* {props.main ? <div className="mainHashtagLabel">MAIN</div> : null} */}
        {/* <div></div> */}
        <div>{props.value}</div>
        {/* <button
          className="removePodButton"
          onClick={(e: any) => {
            //add collateral and update collaterals list
            e.preventDefault();
            let hashtagsCopy = [...hashtags];
            hashtagsCopy.splice(props.index, 1);
            setHashtags(hashtagsCopy);
          }}
        >
          <SvgIcon><CloseSolid /></SvgIcon>
        </button> */}
      </div>
    );
  };
  const CreateHashtagButton = () => {
    return (
      <div>
        {addHashtag ? (
          <div className="createHashtagButtonInput">
            <InputWithLabelAndTooltip
              type="text"
              overriedClasses="createHashtagInput"
              onInputValueChange={elem => {
                const value = elem.target.value.replace(/\s/g, "");
                setHashtag(value);
              }}
              inputValue={hashtag}
              placeHolder="hashtag..."
            />
            <button
              className="removePodButton"
              onClick={(e: any) => {
                if (hashtag && hashtag !== "") {
                  e.preventDefault();
                  let hashtagsArray = [...hashtags];
                  hashtagsArray.push("#" + hashtag);
                  setHashtags(hashtagsArray);
                  setHashtag("");
                  setAddHashtag(false);
                }
              }}
            >
              <img className="createHashtagButtonIcon" src={plusWhiteIcon} alt={"plus"} />
            </button>
          </div>
        ) : (
          <AddButtonCreateModal function={() => setAddHashtag(true)} />
        )}
      </div>
    );
  };
  const AdminsMailLabel = props => {
    return (
      <div className="adminsMailLabel">
        <div className="adminsNameMailLabel">
          <div>{props.admin.name}</div>
          <button
            className="removePodButton"
            onClick={(e: any) => {
              e.preventDefault();
              let adminsCopy = [...admins];
              adminsCopy.splice(props.index, 1);
              setAdmins(adminsCopy);
            }}
          >
            <SvgIcon>
              <CloseSolid />
            </SvgIcon>
          </button>
        </div>
        {props.admin.status === "Accepted" ? (
          <div className="adminsStatusLabel">{props.admin.status}</div>
        ) : null}
        {props.admin.status === "Pending" ? (
          <div className="adminsStatusLabel pendingStatusLabel">{props.admin.status}, resend invite</div>
        ) : null}
      </div>
    );
  };
  const RoleLabel = props => {
    return (
      <div className="adminsMailLabel">
        <div className="adminsNameMailLabel">
          <div className="mainHashtagLabel">{props.user.role}</div>
          <div>{props.user.name}</div>
          <button
            className="removePodButton"
            onClick={(e: any) => {
              e.preventDefault();
              let usersCopy = [...userRoles];
              usersCopy.splice(props.index, 1);
              setAdmins(usersCopy);
            }}
          >
            <SvgIcon>
              <CloseSolid />
            </SvgIcon>
          </button>
        </div>
        {props.user.status === "Accepted" ? (
          <div className="adminsStatusLabel">{props.admin.status}</div>
        ) : null}
        {props.user.status === "Pending" ? (
          <div className="adminsStatusLabel pendingStatusLabel">{props.user.status}, resend invite</div>
        ) : null}
      </div>
    );
  };
  const InsurerLabel = props => {
    return (
      <div className="insurerRowCreatePod">
        <div className="photoInsurerRow"></div>
        <div className="nameInsurerRow">{props.insurer}</div>
        <div className="closeButtonInsurerRow">
          <button
            className="removePodButton"
            onClick={(e: any) => {
              e.preventDefault();
              let insurersCopy = [...insurers];
              insurersCopy.splice(props.index, 1);
              setInsurers(insurersCopy);
            }}
          >
            <SvgIcon>
              <CloseSolid />
            </SvgIcon>
          </button>
        </div>
      </div>
    );
  };
  return (
    <div className="modalCreatePodFullDiv">
      <div className="modalCreatePadding">
        <div className="exit" onClick={props.onCloseModal}>
          <img src={require("assets/icons/x_darkblue.png")} alt={"x"} />
        </div>
        <div className="modalHeaderCreatePod">Create Pod</div>
        <div className="modalSubHeaderCreatePod">General Pod info</div>
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
                <div className="removeImageButton" onClick={() => removePodImage()}>
                  <SvgIcon>
                    <CloseSolid />
                  </SvgIcon>
                </div>

                <InputWithLabelAndTooltip
                  onInputValueChange={fileInputPodPhoto}
                  hidden
                  type="file"
                  style={{
                    display: "none",
                  }}
                  reference={inputRef}
                />
              </div>
            ) : (
              <div
                className="dragImageHereCreatePod"
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
                  onInputValueChange={fileInputPodPhoto}
                  hidden
                  type="file"
                  style={{
                    display: "none",
                  }}
                  reference={inputRef}
                />
              </div>
            )}
          </Grid>
          <Grid item xs={12} md={6}>
            {renderInputCreateModal({
              name: "Pod name",
              placeholder: "Enter Pod name...",
              type: "text",
              width: 400,
              item: "Name",
              index: 0,
              info: "Please name your Pod ",
            })}
            <div className="flexRowInputs">
              <div className="infoHeaderCreatePod">Pod description</div>
              <Tooltip
                TransitionComponent={Fade}
                TransitionProps={{ timeout: 600 }}
                arrow
                className="tooltipHeaderInfo"
                title={"Tell the network about your Pod "}
              >
                <img className="infoIconCreatePod" src={infoIcon} alt={"info"} />
              </Tooltip>
            </div>
            <textarea
              className="textAreaCreatePod"
              value={pod.Description}
              onChange={elem => {
                let podCopy = { ...pod };
                podCopy.Description = elem.target.value;
                setPod(podCopy);
              }}
              placeholder="Enter Pod description..."
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <div className="flexRowInputs">
              <div className="infoHeaderCreatePod">Privacy</div>
              <Tooltip
                TransitionComponent={Fade}
                TransitionProps={{ timeout: 600 }}
                arrow
                className="tooltipHeaderInfo"
                title={
                  "Please select if you want your Pod to be viewable to the network or viewed only amongst those who are invited. This can be edited after Pod creation. "
                }
              >
                <img className="infoIconCreatePod" src={infoIcon} alt={"info"} />
              </Tooltip>
            </div>
            <div className="option-buttons">
              <button
                className={pod.Private === false ? "selected" : undefined}
                id="publicButtonCreatePod"
                onClick={() => {
                  handlePodPrivate(false);
                }}
              >
                Public
              </button>
              <button
                className={pod.Private === true ? "selected" : undefined}
                id="privateButtonCreatePod"
                onClick={() => {
                  handlePodPrivate(true);
                }}
              >
                Private
              </button>
            </div>
          </Grid>
          <Grid item xs={12} md={5}>
            <div className="flexRowInputs">
              <div className="infoHeaderCreatePod">Pod type</div>
              <Tooltip
                TransitionComponent={Fade}
                TransitionProps={{ timeout: 600 }}
                arrow
                className="tooltipHeaderInfo"
                title={
                  "Please select if you want your Pod to generate Fungible Tokens, Physical Non-Fungible Tokens, or Digital Non-Fungible Tokens. To learn more about what these are, head to the Growth section read the Tutorial on Pods "
                }
              >
                <img className="infoIconCreatePod" src={infoIcon} alt={"info"} />
              </Tooltip>
            </div>
            <div className="option-buttons" id="podTypeOptions">
              <button
                className={type === "FT" ? "selected" : undefined}
                id="FTButtonCreatePod"
                onClick={() => {
                  setType("FT");
                }}
              >
                FT
              </button>
              <button
                className={type === "Physical NFT" ? "selected" : undefined}
                id="PNFTButtonCreatePod"
                onClick={() => {
                  setType("Physical NFT");
                }}
              >
                Physical NFT
              </button>
              <button
                className={type === "Digital NFT" ? "selected" : undefined}
                id="DNFTButtonCreatePod"
                onClick={() => {
                  setType("Digital NFT");
                }}
              >
                Digital NFT
              </button>
            </div>
          </Grid>
          <Grid item xs={12} md={3}>
            <div className="flexRowInputs">
              <div className="infoHeaderCreatePod">Open to advertising</div>
              <Tooltip
                TransitionComponent={Fade}
                TransitionProps={{ timeout: 600 }}
                arrow
                className="tooltipHeaderInfo"
                title={
                  "Businesses or peers can advertise in your Pod, every time any user engages with the ad, PRIVI Data Coins will be sent to that user from the advertiser "
                }
              >
                <img className="infoIconCreatePod" src={infoIcon} alt={"info"} />
              </Tooltip>
            </div>
            <div className="option-buttons" id="openAdvOptions">
              <CustomSwitch
                checked={openToAdvertising}
                onChange={() => {
                  handleOpenToAdvertising(true);
                }}
              />
            </div>
          </Grid>
        </Grid>
        <div className="marginTopFieldCreatePod">
          <div className="flexRowInputs">
            <div className="infoHeaderCreatePod">Hashtags</div>
            <Tooltip
              TransitionComponent={Fade}
              TransitionProps={{ timeout: 600 }}
              arrow
              className="tooltipHeaderInfo"
              title={"At least one hashtag is required  "}
            >
              <img className="infoIconCreatePod" src={infoIcon} alt={"info"} />
            </Tooltip>
          </div>
          <div className="hashtagsRowCreatePod">
            {hashtags && hashtags.length ? (
              <div className="flexRowInputs">
                {hashtags.map((hashtag, i) => {
                  if (i === 0) {
                    return <HashtagLabel key={i} value={hashtag} index={i} main={true} />;
                  } else {
                    return <HashtagLabel key={i} value={hashtag} index={i} main={false} />;
                  }
                })}
              </div>
            ) : null}
            <CreateHashtagButton />
          </div>
        </div>
        {/* <div className="marginTopFieldCreatePod">
          {renderInputCreateModal({
            name: 'Discord ID',
            placeholder: 'Enter Discord ID...',
            type: 'text',
            width: 260,
            item: 'DiscordID',
            index: 1,
          })}
        </div> */}
        <Divider className="dividerCreatePod" />
        <div className="modalSubHeaderCreatePod">Pod Token</div>
        <Grid container spacing={0} direction="row" alignItems="flex-start" justify="flex-start">
          <Grid item xs={12} md={6}>
            <div className="flexRowInputs">
              {renderInputCreateModal({
                name: "Pod Token name",
                placeholder: "Enter Token...",
                type: "text",
                item: "TokenName",
                width: 260,
                index: 2,
                info: "Please name your Pod token. Right now this is unchangeable, however in Governance and the Pod itself it can be brought to discussion and a vote. ",
              })}
              <div style={{ marginLeft: "10px" }}>
                {renderInputCreateModal({
                  name: "Token ID",
                  placeholder: "Token ID...",
                  type: "text",
                  item: "TokenSymbol",
                  width: 120,
                  index: 3,
                  info: "Please give your Pod Token a ticker symbol. Remember, with Pods, you are generating Pod Tokens against your contract that you outline here. For example if you want to raise 10 ETH. And your Pod attracts 10 investors who each deposit 1 ETH, they are given the commensurate value they deposited in Pod Tokens. ",
                })}
              </div>
            </div>
            {!type.includes("NFT") ? (
              <div className="flexRowInputs">
                {renderInputCreateModal({
                  name: "Principal",
                  placeholder: "0.00",
                  type: "text",
                  item: "Principal",
                  width: 260,
                  index: 5,
                  info: "Total amount to be requested from investors as well as the total amount (plus interest) to be paid back to investors. This is changeable until an investment takes place. Base Coin is an internal stablecoin and it equals $1 USD.",
                })}
                <div className="collateralSelector">
                  <TokenSelect
                    value={principalTokenSelector}
                    onChange={handleChangePrincipalTokenSelector}
                    tokens={tokens}
                  />
                </div>
              </div>
            ) : (
              renderInputCreateModal({
                name: "Total Supply",
                placeholder: "Total Supply value...",
                type: "text",
                item: "Supply",
                width: 400,
                index: 5,
                info: "Total number of copies of a physical/digital asset of the underlying pod. As NFT pods are based on something indivisible, let’s say for example you create a Pod for tickets for a concert, the total supply would be the number of tickets of the concert available. Then, the model of pricing is an order book. ",
              })
            )}
            {!type.includes("NFT") ? (
              <div>
                <div className="flexRowInputs">
                  <div>
                    <InputWithLabelAndTooltip
                      labelName="Collateral"
                      tooltip="This is the amount you wish to deposit and lock in the currency of your choosing. As a general rule of thumb, the more collateral you deposit, the higher likelihood that investors will want to buy your Pod Tokens. This amount is automatically taken from your wallet, and you can add/withdraw from it at any time after Pod creation"
                      style={{
                        width: "calc(220px - 24px)",
                      }}
                      type="number"
                      inputValue={collateral}
                      onInputValueChange={elem => {
                        let value = elem.target.value;
                        setCollateral(value);
                      }}
                      placeHolder="0.00"
                    />
                  </div>
                  <div className="collateralSelector">
                    <TokenSelect
                      value={collateralToken}
                      onChange={handleChangeCollateralSelector}
                      tokens={tokens}
                    />
                  </div>
                  <div className="collateralSelector">
                    <AddButtonCreateModal function={() => addCollateral()} />
                  </div>
                </div>
                {collateralError.length > 0 ? <div className="error">{collateralError}</div> : null}
              </div>
            ) : null}
            {!type.includes("NFT") ? (
              <div className="collaterals">
                {tokens.map(value => {
                  //display collaterals
                  if (collaterals.has(value)) {
                    return (
                      <div key={value} className="item-card-create-pod">
                        <div className="item-item-card-create-pod">{collaterals.get(value)}</div>
                        <div className="item-item-card-create-pod">{value}</div>
                        <div
                          className="clickable item-item-card-create-pod"
                          onClick={() => {
                            const c = new Map();
                            collaterals.forEach((value: string, key: string) => {
                              c.set(key, value);
                            });
                            c.delete(value);
                            setCollaterals(c);
                          }}
                        >
                          ✕
                        </div>
                      </div>
                    );
                  } else return null;
                })}
              </div>
            ) : null}
            {!type.includes("NFT")
              ? renderInputCreateModal({
                name: "Liquidation CCR (%)",
                placeholder: "0.00%",
                type: "number",
                item: "P_liquidation",
                width: 400,
                index: 9,
                info: "Collateral Coverage Ratio.This is the required threshold of collateral that needs to be held. For example if you deposit 10 ETH as collateral, and set your CCR to 50%, this means that if your collateral falls below 5 ETH the Pod will be liquidated. This can be edited after Pod creation but not after the first investor buys Pod tokens. ",
              })
              : type.includes("Digital NFT")
                ? renderInputCreateModal({
                  name: "Royalty",
                  placeholder: "0.00",
                  type: "text",
                  item: "Royalty",
                  width: 400,
                  index: 9,
                  info: `This is a sort of interest payment on NFTs owned. Let's say for example the Pod creator of a Digital NFT Pod that is selling NFTs on a video they created. They can tell owners of the Pod tokens that every x months they will pay royalties commensurate to the amount of tokens owned. `,
                })
                : null}
          </Grid>
          <Grid item xs={12} md={6}>
            <div>
              <div className="flexRowInputs">
                <div className="infoHeaderCreatePod">Date of start</div>
                <Tooltip
                  TransitionComponent={Fade}
                  TransitionProps={{ timeout: 600 }}
                  arrow
                  className="tooltipHeaderInfo"
                  title={
                    "This is the date you want your Pod Tokens to be available to investors. This can be changed after Pod creation "
                  }
                >
                  <img className="infoIconCreatePod" src={infoIcon} alt={"info"} />
                </Tooltip>
              </div>
              <div
                className="textFieldCreatePod"
                style={{
                  width: "calc(400px - 24px)",
                  paddingTop: "1px",
                  paddingBottom: "1px",
                }}
              >
                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                  <KeyboardDatePicker
                    id="date-picker-start-date"
                    minDate={minDate}
                    format="MM.dd.yyyy"
                    placeholder="Select date..."
                    value={pod.StartDate}
                    onChange={handleDateOfStartChange}
                    keyboardIcon={
                      <img className="iconCalendarCreatePod" src={calendarIcon} alt={"calendar"} />
                    }
                  />
                </MuiPickersUtilsProvider>
              </div>
            </div>
            <div>
              <div className="flexRowInputs">
                <div className="infoHeaderCreatePod">Expiration date</div>
                <Tooltip
                  TransitionComponent={Fade}
                  TransitionProps={{ timeout: 600 }}
                  arrow
                  className="tooltipHeaderInfo"
                  title={
                    "This is the date that your Pod Tokens are set to expire, to put another way, this is the date you expect to pay back the principle plus interest. At which point, the Pod tokens will be burned. As of now, this is not editable after Pod creation. However in certain instances extensions would be in order from Pod creator to investors, but this is an item that would have to be decided and voted upon in Governance "
                  }
                >
                  <img className="infoIconCreatePod" src={infoIcon} alt={"info"} />
                </Tooltip>
              </div>
              <div
                className="textFieldCreatePod"
                style={{
                  width: "calc(400px - 24px)",
                  paddingTop: "1px",
                  paddingBottom: "1px",
                }}
              >
                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                  <KeyboardDatePicker
                    id="date-picker-expiration-date"
                    minDate={minDate}
                    format="MM.dd.yyyy"
                    placeholder="Select date..."
                    value={pod.DateExpiration}
                    onChange={handleExpirationDateChange}
                    keyboardIcon={
                      <img className="iconCalendarCreatePod" src={calendarIcon} alt={"calendar"} />
                    }
                  />
                </MuiPickersUtilsProvider>
              </div>
            </div>
            <div>
              <FormGroup row style={{ marginBottom: 20, marginTop: -5 }}>
                <FormControlLabel
                  control={
                    <StyledCheckbox
                      checked={checkbox.checked}
                      onChange={handleChangeCheckboxExpiration}
                      name="checked"
                    />
                  }
                  label={
                    <Typography
                      variant="h6"
                      style={{
                        color: "rgb(101, 110, 126)",
                        fontSize: 14,
                        fontWeight: 400,
                      }}
                    >
                      No expiration date
                    </Typography>
                  }
                />
              </FormGroup>
            </div>
            {!type.includes("NFT")
              ? renderInputCreateModal({
                name: "Interest (%)",
                placeholder: "Between 0.1% - 300%",
                type: "number",
                min: 0,
                item: "Interest",
                width: 400,
                index: 10,
                info: `This is the amount of interest you will pay back per interval as highlighted in Interest Type. The percent will always be interest on the Principle left to pay back at that given interval. For example if you are paying .25% per interval, and you still owe 250 USDT, your interest payment will be 0.625 USDT. You can pay back your principle at any time. Some guidance: Your Pod investors receive this payment of interest on time intervals. Missing some payments may negatively impact the Pod token price, leading to depreciation, leading to investors selling your Pod tokens. Also missing payments will have an impact on trust scores, and will have a negative effect for both Pod creator and the Pod. So paying interest on time, may increase the credibility and trust of the Pod creator and Pod itself, and thus attract more investors. Also, this may have a good impact for future pods or interactions with other financial features, leading to an overall improvement in your t/e scores. `,
              })
              : null}
            {!type.includes("NFT") ? (
              <div className="flexRowInputs">
                <div className="marginBottomInterestCreatePod">
                  <div className="flexRowInputs">
                    <div className="infoHeaderCreatePod">Interest type</div>
                    <Tooltip
                      TransitionComponent={Fade}
                      TransitionProps={{ timeout: 600 }}
                      arrow
                      className="tooltipHeaderInfo"
                      title={
                        "Please select the frequency in how you want to pay back your investors. This amount is deducted automatically, if this is not paid it is accumulated into debt and must be repaid ASAP."
                      }
                    >
                      <img className="infoIconCreatePod" src={infoIcon} alt={"info"} />
                    </Tooltip>
                  </div>
                  <SelectorCreateModal
                    width={260}
                    selectValue={frequency}
                    selectFunction={handleChangeFrequency}
                    selectItems={["Daily", "Weekly", "Monthly"]}
                  />
                </div>
                <div className="smallMarginLeftCreatePod marginBottomInterestCreatePod">
                  <div className="flexRowInputs">
                    <div className="infoHeaderCreatePod">Interest due</div>
                    <img className="infoIconCreatePod" src={infoIcon} alt={"info"} />
                  </div>
                  <SelectorCreateModal
                    width={130}
                    selectValue={interestDueSelector}
                    selectFunction={handleChangeInterestDueSelector}
                    selectItems={["1th"]}
                  />
                </div>
              </div>
            ) : null}
            {!type.includes("NFT") ? (
              <div className="flexRowInputs">
                <div className="infoHeaderCreatePod">Required tokens to be investable in</div>
                <Tooltip
                  TransitionComponent={Fade}
                  TransitionProps={{ timeout: 600 }}
                  arrow
                  className="tooltipHeaderInfo"
                  title={
                    "This corresponds to the minimum number of tokens that the Pod creator requires to be held by Pod investors. This cannot be edited after some investment takes place. For example: I require my investors to at least hold .5 ETH to be able to invest in the Pod. Otherwise, the Pod investor cannot invest."
                  }
                >
                  <img className="infoIconCreatePod" src={infoIcon} alt={"info"} />
                </Tooltip>
              </div>
            ) : null}
            {!type.includes("NFT") ? (
              <div>
                <div className="flexRowInputs">
                  <div>
                    <InputWithLabelAndTooltip
                      style={{
                        width: "calc(220px - 24px)",
                      }}
                      type="number"
                      inputValue={requiredTokenToInvestValue}
                      onInputValueChange={elem => {
                        let value = elem.target.value;
                        setRequiredTokenToInvestValue(value);
                      }}
                      placeHolder="0.00"
                    />
                  </div>
                  <div className="smallMarginLeftCreatePod">
                    <TokenSelect
                      value={requiredTokenToInvestToken}
                      onChange={handleChangeRequiredTokenToInvestToken}
                      tokens={tokens}
                    />
                  </div>
                  <div className="smallMarginLeftCreatePod marginTopAddTokensCreatePod">
                    <AddButtonCreateModal function={() => addRequiredTokensToInvest()} />
                  </div>
                </div>
                {requiredTokensError.length > 0 ? <div className="error">{requiredTokensError}</div> : null}
              </div>
            ) : null}
            {!type.includes("NFT") ? (
              <div className="collaterals">
                {tokens.map(value => {
                  //display required tokens
                  if (requiredTokensToInvest.has(value)) {
                    return (
                      <div key={value} className="item-card-create-pod">
                        <div className="item-item-card-create-pod">{requiredTokensToInvest.get(value)}</div>
                        <div className="item-item-card-create-pod">{value}</div>
                        <div
                          className="clickable item-item-card-create-pod"
                          onClick={() => {
                            const c = new Map();
                            requiredTokensToInvest.forEach((value: string, key: string) => {
                              c.set(key, value);
                            });
                            c.delete(value);
                            setRequiredTokensToInvest(c);
                          }}
                        >
                          ✕
                        </div>
                      </div>
                    );
                  } else return null;
                })}
              </div>
            ) : null}
          </Grid>
        </Grid>
        {!type.includes("NFT") ? (
          <div>
            <div className="modalSubHeaderCreatePod">Advanced</div>
            <Grid
              container
              spacing={0}
              direction="row"
              alignItems="flex-start"
              justify="flex-start"
              className="advanced"
            >
              <Grid item xs={12} md={4}>
                <div className="flexRowInputs">
                  <div className="infoHeaderCreatePod">AMM</div>
                  <Tooltip
                    TransitionComponent={Fade}
                    TransitionProps={{ timeout: 600 }}
                    arrow
                    className="tooltipHeaderInfo"
                    title={`This is a kind of "economic policy" for Pod tokens. An AMM (or Automated Market Maker) is different than common exchanges as the prices are completely deterministic and fixed by the AMM curves. On exchanges, the price is fixed by offer and demand, leaving room for manipulation. AMM provides a deterministic valuation of the Pod tokens. Buying and selling prices are determined by an AMM only, giving Pods it's decentralized nature. `}
                  >
                    <img className="infoIconCreatePod" src={infoIcon} alt={"info"} />
                  </Tooltip>
                </div>
                <div className="AMMSelector">
                  <SelectorCreateModal
                    width={270}
                    selectValue={ammType}
                    selectFunction={event => setAmmType(event.target.value)}
                    selectItems={amms}
                  />
                </div>
              </Grid>
              <Grid item xs={12} md={4}>
                {renderInputCreateModal({
                  name: "Target Spread (%)",
                  placeholder: "Between 40% - 95%",
                  type: "number",
                  item: "TargetSpread",
                  width: 270,
                  index: 11,
                  info: `A "Spread" is a fee that the AMM of the Pod takes (this is like the spread that a common market maker would take in centralized finance, but here the fee is fixed and deterministic). So in this case, a target spread corresponds to the period where the Pod is in the process of being funded and has yet to reach it's target principle. So, this target spread is applied until this principal is reached (it may not be reached). The spread accumulated is what the Pod creator gets. Recommended value 70%-90%. For example, target Principle 1000 USDT, at 80% target spread, now say someone invests 100 USDT, then 80 USDT goes to the pod Creator and 20 USDT goes to the AMM, (the AMM should contain funds if someone sells).`,
                })}
              </Grid>
              <Grid item xs={12} md={4}>
                {renderInputCreateModal({
                  name: "Exchange Spread (%)",
                  placeholder: "Between 0.1% - 15%",
                  type: "number",
                  item: "ExchangeSpread",
                  width: 270,
                  index: 12,
                  info: `This is the spread of the AMM between the buying and selling curve. Imagine that the buying curve is a bit above the selling curve. So when trading occurs, this spread is taken and accumulated in an "Exchange Pool". At liquiditation of the pod, the exchange fees are divided between pod investors. This corresponds when the target principal has been reached. Then, the Pod creator does not have rights to the funds taken from fees as he already reached his principal. So here a much smaller spread should be applied (1%-10%), it is similar to a fee for trading (speculating). The fees accumulate in the AMM and are given to Pod token holders at liquidation (being default scenario or full principle repayment)`,
                })}
              </Grid>
            </Grid>
            <div className="AMMGraph">
              <AMMGraph type={ammType} />
              {/* <Plot
                data={[line.data, line.data2, line.data3]}
                layout={line.layout}
                graphDiv="graph"
                className="plot"
              /> */}
            </div>
          </div>
        ) : null}
        <div className="modalCreatePadding userManagementCreatePod">
          <div className="modalSubHeaderCreatePod" style={{ marginTop: "20px" }}>
            User management
          </div>
          <div className="flexRowInputs">
            <div>
              <InputWithLabelAndTooltip
                labelName="Admins (email)"
                style={{
                  width: "calc(350px - 24px)",
                }}
                type="text"
                inputValue={admin}
                onInputValueChange={elem => {
                  setAdmin(elem.target.value);
                }}
                placeHolder="Add admin by email"
              />
            </div>
            <div className="collateralSelector">
              <AddButtonCreateModal function={() => addAdmin()} />
            </div>
          </div>
          {admins && admins.length !== 0 ? (
            <div>
              {admins.map((item, i) => {
                return <AdminsMailLabel key={i} index={i} admin={item} />;
              })}
            </div>
          ) : null}
          <div className="flexRowInputs">
            <div>
              <InputWithLabelAndTooltip
                labelName="User and roles"
                tooltip={"This can be edited at a later date"}
                style={{
                  width: "calc(350px - 24px)",
                }}
                type="text"
                inputValue={user}
                onInputValueChange={elem => {
                  setUser(elem.target.value);
                }}
                placeHolder="Add user by email"
              />
            </div>
            <div className="collateralSelector">
              <SelectorCreateModal
                width={120}
                selectValue={userRole}
                selectFunction={handleChangeUserRole}
                selectItems={userRoles}
              />
            </div>
            <div className="collateralSelector">
              <AddButtonCreateModal function={() => addUserRole()} />
            </div>
          </div>
          {usersRoles && usersRoles.length !== 0 ? (
            <div>
              {usersRoles.map((item, i) => {
                return <RoleLabel key={i} index={i} user={item} />;
              })}
            </div>
          ) : null}
          <div className="flexRowInputs">
            <div>
              <InputWithLabelAndTooltip
                labelName="Insurers"
                tooltip={
                  "Pods that are insured are more likely to be invested in by the network. You can either apply to decentralized insurance pools, or in some cases, specifically if your Trust and Endorsement scores are high, Insurance Pools will ask to insure your Pod. You can send a request now or you can do so at a later date. "
                }
                style={{
                  width: "calc(350px - 46px)",
                  backgroundImage: "url(" + searchIcon + ")",
                  backgroundRepeat: "no-repeat",
                  backgroundSize: "20px 20px",
                  backgroundPosition: "12px 15px",
                  paddingLeft: "42px",
                }}
                type="text"
                inputValue={insurerSearcher}
                onInputValueChange={elem => {
                  let value = elem.target.value;
                  setInsurerSearcher(value);
                }}
                placeHolder="Search insurer by name or email"
              />
            </div>
            <div className="collateralSelector no-margin-bottom">
              <AddButtonCreateModal function={() => addInsurer()} />
            </div>
          </div>
          <TabNavigation
            tabs={insurersTab}
            currentTab={tabsInsurersValue}
            variant="primary"
            onTabChange={handleChangeTabsInsurers}
          />
          <div className="insurersCreatePod">
            {insurers.map((insurer, i) => {
              return <InsurerLabel key={i} index={i} insurer={insurer} />;
            })}
          </div>
        </div>
        <div>
          <div className="buttonCreatePodRow">
            <LoadingWrapper loading={creationProgress}>
              <button
                onClick={() => (!type.includes("NFT") ? createFTPod() : createNFTPod())}
                className="buttonCreatePod"
              >
                Create Pod
              </button>
            </LoadingWrapper>
          </div>
          <div className={classes.root}>
            {status && (
              <AlertMessage
                key={status.key}
                message={status.msg}
                variant={status.variant}
                onClose={() => setStatus(undefined)}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}, arePropsEqual);

export default PodCreateModal;
