import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import DateFnsUtils from "@date-io/date-fns";
import { trackPromise } from "react-promise-tracker";
import { useSelector } from "react-redux";

import { Modal, Tooltip, Fade } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import { makeStyles } from "@material-ui/core/styles";
import URL from "shared/functions/getURL";
import Divider from "@material-ui/core/Divider";
import FormControl from "@material-ui/core/FormControl";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import AppBar from "@material-ui/core/AppBar";
import { KeyboardDatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import { RootState } from "store/reducers/Reducer";

import { StyledSelect, StyledMenuItem } from "shared/ui-kit/Styled-components/StyledComponents";
import { updateTask } from "shared/functions/updateTask";
import { signTransaction } from "shared/functions/signTransaction";
import AlertMessage from "shared/ui-kit/Alert/AlertMessage";

import "shared/ui-kit/Modal/Modals/Modal.css";
import "./CreateCreditModal.css";

import SvgIcon from "@material-ui/core/SvgIcon";
import { ReactComponent as CloseSolid } from "assets/icons/close-solid.svg";
import InputWithLabelAndTooltip from "shared/ui-kit/InputWithLabelAndTooltip";
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

const minDate = new Date(new Date().getTime());

const CreateCreditModal = React.memo((props: any) => {
  const classes = useStyles();

  const inputRef = useRef<any>();
  const userSelector = useSelector((state: RootState) => state.user);

  /*const selectedUpdateBasicInfo = useSelector(
    (state: RootState) => state.updateBasicInfo
  );*/

  const [credit, setCredit] = useState<any>({
    DiscordID: "",
    Name: "",
    Description: "",
    MaxAmount: "",
    InitialDeposit: "",
    Interest: "",
    MinCCR: "",
    Premium: "",
    Incentive: "",
    StartDate: Date.now(),
    DateExpiration: Date.now(),
    //    MinCCR: "",
    //    Premium: "",
    EndorsementScore: "",
    TrustScore: "",
  });

  const [disableSubmit, setDisableSubmit] = useState<boolean>(false);

  const [status, setStatus] = useState<any>();

  //General Credit Pool Info section
  const [photo, setPhoto] = useState<any>(null);
  const [photoImg, setPhotoImg] = useState<any>(null);

  //Credit Pools requirements section
  //interest
  const interestTypes = ["Monthly", "Weekly"];
  const [interestTypeSelector, setInterestTypeSelector] = useState<string>(interestTypes[0]);
  const handleChangeInterestTypeSelector = event => {
    const value = event.target.value;
    setInterestTypeSelector(value);
  };
  const interestDues = ["1th"];
  const [interestDueSelector, setinterestDueSelector] = useState<string>(interestDues[0]);
  const handleChangeinterestDueSelector = event => {
    const value = event.target.value;
    setinterestDueSelector(value);
  };

  //dates
  const handleDateExpirationChange = (elem: any) => {
    let creditCopy = { ...credit };
    creditCopy.DateExpiration = new Date(elem);
    setCredit(creditCopy);
  };
  const handleDateOfStartChange = (elem: any) => {
    let creditCopy = { ...credit };
    creditCopy.StartDate = new Date(elem);
    setCredit(creditCopy);
  };

  //token
  const [tokens, setTokens] = useState<any[]>([]);
  const [tokenNames, setTokenNames] = useState<string[]>([]);

  const [tokenName, setTokenName] = useState<string>("");
  const [token, setToken] = useState<string>("");
  const handleChangeTokenSelector = event => {
    const value = event.target.value;
    setTokenName(value);
    const t = tokens.find(token => token.name === value);
    setToken(t.token);
  };

  //advanced
  //collaterals
  const [collateral, setCollateral] = useState<string>("");
  const [collaterals, setCollaterals] = useState<string[]>([]);
  const [collateralSelector, setCollateralSelector] = useState<string>("");
  const [collateralToken, setCollateralToken] = useState<string>("");
  const handleChangeCollateralSelector = event => {
    const value = event.target.value;
    setCollateralSelector(value);
    const t = tokens.find(token => token.name === value);
    setCollateralToken(t.token);
  };
  const [collateralError, setCollateralError] = useState<string>("");

  //User management section
  const [admin, setAdmin] = useState<string>("");
  const [admins, setAdmins] = useState<any[]>([]);

  const roles = ["Role 1", "Role 2"];
  const [userName, setUserName] = useState<string>("");
  const [userRole, setUserRole] = useState<string>(roles[0]);
  const [usersRoles, setUsersRoles] = useState<any[]>([]);

  //insurers
  const [insurers, setInsurers] = useState<any[]>([]);
  const [insurerSearcher, setInsurerSearcher] = useState<string>("");
  const [tabsInsurersValue, setTabsInsurersValue] = React.useState(0);

  const handleChangeTabsInsurers = (event, newValue) => {
    setTabsInsurersValue(newValue);
  };

  //create credit pool
  const handleCreate = async () => {
    // convert collateral map to accepted collaterals (list of string)

    if (validateCredit()) {
      if (!userSelector.id) {
        console.log("userSelector.id is null");
        return;
      }

      setDisableSubmit(true);
      const body: any = {
        Parameters: {
          Creator: userSelector.id,
          CreditName: credit.Name,
          LendingToken: token,
          MaxFunds: Number(credit.MaxAmount),
          Interest: Number(credit.Interest) / 100,
          Frequency: interestTypeSelector.toUpperCase(),
          P_incentive: Number(credit.Incentive) / 100,
          P_premium: Number(credit.Premium) / 100,
          DateExpiration: Date.parse(credit.DateExpiration),
        },
        Requirements: {
          TrustScore: Number(credit.TrustScore) / 100,
          EndorsementScore: Number(credit.EndorsementScore) / 100,
          CollateralsAccepted: collaterals,
          CCR: Number(credit.MinCCR) / 100,
        },
        Initialisation: {
          InitialDeposit: Number(credit.InitialDeposit),
        },
      };

      const [hash, signature] = await signTransaction(userSelector.mnemonic, body);

      body.Description = credit.Description;
      body.DiscordId = credit.DiscordID;
      body.Admins = admins;
      body.Insurers = insurers;
      body.UserRoles = usersRoles;

      body.Initialisation.Hash = hash;
      body.Initialisation.Signature = signature;

      body.HasPhoto = !!(photoImg && photo);

      trackPromise(
        axios
          .post(`${URL()}/priviCredit/initiatePriviCredit`, body)
          .then(async response => {
            const resp = response.data;
            if (resp.success) {
              await updateTask(userSelector.id, "Create a Credit Pool");
              if (body.HasPhoto) {
                await uploadImage(resp.data);
              }
              setTimeout(() => {
                props.handleRefresh();
                props.handleClose();
              }, 1000);
            } else {
              setStatus({
                msg: "Error when making the request",
                key: Math.random(),
                variant: "error",
              });
              return;
            }
            setStatus({
              msg: "Credit Pool Created!",
              key: Math.random(),
              variant: "success",
            });
            setDisableSubmit(false);
          })
          .catch(error => {
            setStatus({
              msg: "Error when making the request",
              key: Math.random(),
              variant: "error",
            });
          })
      );
    }
  };

  const checkIfExist = (): Promise<any> => {
    return new Promise<any>((resolve, reject) => {
      try {
        trackPromise(
          axios
            .post(`${URL()}/priviCredit/checkCreditInfo`, {
              creditName: credit.Name,
            })
            .then(response => {
              const resp = response.data.data.creditExists;
              resolve(resp);
            })
            .catch(error => {
              setStatus({
                msg: "Error when making the request",
                key: Math.random(),
                variant: "error",
              });
            })
        );
      } catch (e) {
        reject(e);
      }
    });
  };

  const validateCredit = async () => {
    let check: any = await checkIfExist();

    if (!(credit.Name.length >= 5)) {
      setStatus({
        msg: "Name field invalid. Minimum 5 characters required.",
        key: Math.random(),
        variant: "error",
      });
      return false;
    } else if (check === true) {
      setStatus({
        msg: "Name field invalid. A credit pool with this name already exist.",
        key: Math.random(),
        variant: "error",
      });
      return false;
    } else if (!(credit.Description.length >= 20)) {
      setStatus({
        msg: "Description field invalid. Minimum 20 characters required",
        key: Math.random(),
        variant: "error",
      });
      return false;
      // } else if (!credit.DiscordID) {
      //   setErrorMsg('DiscordID field invalid');
      //   handleClickError();
      //   return false;
    } else if (!(credit.MaxAmount > 0)) {
      setStatus({
        msg: "Max amount must be greater than 0",
        key: Math.random(),
        variant: "error",
      });
      return false;
    } else if (!(credit.InitialDeposit > 0 && Number(credit.InitialDeposit) <= Number(credit.MaxAmount))) {
      setStatus({
        msg: "Initial Deposit must be greater than zero and smaller or equal than Max amount",
        key: Math.random(),
        variant: "error",
      });
      return false;
    } else if (!credit.Interest || credit.Interest < 0.5 || credit.Interest > 200) {
      setStatus({
        msg: "Interest field invalid should be between 0.5% and 200%",
        key: Math.random(),
        variant: "error",
      });
      return false;
    } else if (!credit.DateExpiration) {
      setStatus({
        msg: "Expiration date field invalid",
        key: Math.random(),
        variant: "error",
      });
      return false;
    } else if (!credit.StartDate) {
      setStatus({
        msg: "Start date field invalid",
        key: Math.random(),
        variant: "error",
      });
      return false;
    } else if (!(credit.MinCCR >= 0)) {
      setStatus({
        msg: "Minimum CCR field invalid",
        key: Math.random(),
        variant: "error",
      });
      return false;
    } else if (!(credit.Premium >= 1 && credit.Premium <= 80)) {
      setStatus({
        msg: "Premium field invalid should be between 1% and 80%",
        key: Math.random(),
        variant: "error",
      });
      return false;
    } else if (!(credit.Incentive >= 1 && credit.Incentive <= 40)) {
      setStatus({
        msg: "Incentive field invalid should be between 1% and 40%",
        key: Math.random(),
        variant: "error",
      });
      return false;
    } else if (credit.MinCCR > 0 && (!collaterals || collaterals.length === 0)) {
      setStatus({
        msg: "Collaterals quantity invalid",
        key: Math.random(),
        variant: "error",
      });
      return false;
    } else if (!(credit.EndorsementScore >= 0 && credit.EndorsementScore <= 100)) {
      setStatus({
        msg: "Endorsement field invalid should be between 0 and 100",
        key: Math.random(),
        variant: "error",
      });
      return false;
    } else if (!(credit.TrustScore >= 0 && credit.TrustScore <= 100)) {
      setStatus({
        msg: "Trust field invalid should be between 0 and 100",
        key: Math.random(),
        variant: "error",
      });
      return false;
    } else return true;
  };

  const uploadImage = async creditPoolId => {
    return new Promise((resolve, reject) => {
      const formData = new FormData();
      formData.append("image", photo, creditPoolId);
      const config = {
        headers: {
          "content-type": "multipart/form-data",
        },
      };
      axios
        .post(`${URL()}/priviCredit/changeCreditPoolPhoto`, formData, config)
        .then(response => {
          resolve(true);
        })
        .catch(error => {
          console.log(error);
          resolve(true);
          // alert("Error uploading photo");
        });
    });
  };
  const onChangeCreditPhoto = (files: any) => {
    setPhoto(files[0]);
    const reader = new FileReader();
    reader.addEventListener("load", () => {
      setPhotoImg(reader.result);
    });
    reader.readAsDataURL(files[0]);
  };

  //image functions
  const fileInputCreditPhoto = e => {
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
        onChangeCreditPhoto(files);
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
  const removeCreditImage = () => {
    setPhoto(null);
    setPhotoImg(null);
  };

  // token functions
  // get token list from backend
  useEffect(() => {
    if (props.open) {
      axios.get(`${URL()}/wallet/getCryptosRateAsList`).then(res => {
        const resp = res.data;
        if (resp.success) {
          const tokenList: any[] = []; // list of tokens
          const tokenNamesList: string[] = []; // list of tokens
          const tokenRatesObj: {} = {}; // tokenRates
          const data = resp.data;
          data.forEach(rateObj => {
            tokenList.push({ token: rateObj.token, name: rateObj.name });
            tokenNamesList.push(rateObj.name);
            tokenRatesObj[rateObj.token] = rateObj.rate;
          });
          setTokens(tokenList);
          setTokenNames(tokenNamesList); // update token list
          setCollateralSelector(tokenNamesList[0]); // initial (default) collateral selection
          setCollateralToken(tokenList[0].token);
          setToken(tokenList[0].token);
          setTokenName(tokenNamesList[0]);
          const newCredit = { ...credit };
          newCredit.Token = tokenList[0];
          setCredit(newCredit);
        }
      });
    }
  }, []);

  //collateral functions
  //check collateral value (before adding it to the collaterals list) > 0
  const validateCollateral = (value: string) => {
    let collateralToken = tokens.find(token => token.name === collateralSelector).token;
    let collateralError: string = "";
    if (collaterals.includes(collateralToken)) {
      collateralError = "collateral token already added";
    }
    return collateralError;
  };

  //add collateral
  const addCollateral = () => {
    //add collateral and update collaterals list
    let validatedErrors = validateCollateral(collateral);
    setCollateralError(validatedErrors);
    if (validatedErrors.length === 0) {
      const c: string[] = [...collaterals];
      c.push(collateralToken);
      setCollaterals(c);
      setCollateral("");
    }
  };

  //add admin function
  const addAdmin = () => {
    if (admin && admin !== "") {
      //TODO: check if user exists before adding it to the list
      let array = [...admins];
      array.push({
        name: admin,
        status: "Pending",
      });
      setAdmins(array);
      setAdmin("");
    }
  };

  //add user role function
  const addUserRoles = () => {
    if (userRole && userRole !== "" && userName && userName !== "") {
      //TODO: check if user exists before adding it to the list
      let array = [...usersRoles];
      array.push({
        name: userRole,
        role: userRole,
        status: "Pending",
      });
      setUsersRoles(array);
      setUserName("");
      setUserRole("");
    }
  };

  //add insurer function
  const addInsurer = () => {
    //TODO: check if user exists before adding it to the list
    if (insurerSearcher && insurerSearcher !== "") {
      let array = [...insurers];
      array.push({
        name: insurerSearcher,
        image: "none",
        //TODO: add image
      });

      setInsurers(array);
      setInsurerSearcher("");
    }
  };

  function renderInputCreateModal(p) {
    return (
      <div style={{ marginBottom: '16px', marginRight: '16px' }}>
        <InputWithLabelAndTooltip
          labelName={p.name}
          tooltip={p.info}
          style={{
            width: "calc(" + p.width + "px - 24px)",
          }}
          type={p.type}
          inputValue={credit[p.item]}
          onInputValueChange={e => {
            let creditCopy = { ...credit };
            creditCopy[p.item] = e.target.value;
            setCredit(creditCopy);
          }}
          placeHolder={p.placeholder}
        />
      </div>
    );
  }

  //selector component
  const SelectorCreateModal = (props: any) => {
    return (
      <div>
        <FormControl className="selectorFormControlCreatePod">
          <StyledSelect
            disableUnderline
            value={props.selectValue}
            style={{ width: props.width }}
            className="selectCreatePod"
            onChange={e => {
              props.selectFunction(e);
            }}
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

  //add button component
  const AddButtonCreateModal = (props: any) => {
    return (
      <div className="createHashtagButton cursor-pointer" onClick={props.function}>
        <img className="createHashtagButtonIcon" src={plusWhiteIcon} alt={"plus"} />
      </div>
    );
  };

  //user label
  const UserLabel = props => {
    return (
      <div className="adminsMailLabel">
        <div className="adminsNameMailLabel">
          {props.user.role && props.user.role.length > 0 ? (
            <div className="mainHashtagLabel">{props.user.role}</div>
          ) : null}
          {props.user.image && props.user.image.length > 0 ? (
            <div
              className="insurer-image"
              style={{
                backgroundImage: `url(${props.user.image})`,
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                backgroundSize: "cover",
              }}
            />
          ) : null}
          <div>{props.user.name}</div>
          <button
            className="removePodButton"
            onClick={(e: any) => {
              e.preventDefault();

              if (props.user.role && props.user.role.length > 0) {
                let usersCopy = [...usersRoles];
                usersCopy.splice(props.index, 1);
                setUsersRoles(usersCopy);
              } else if (props.user.image && props.user.image.length > 0) {
                let insurersCopy = [...insurers];
                insurersCopy.splice(props.index, 1);
                setInsurers(insurersCopy);
              } else {
                let adminsCopy = [...admins];
                adminsCopy.splice(props.index, 1);
                setAdmins(adminsCopy);
              }
            }}
          >
            <SvgIcon>
              <CloseSolid />
            </SvgIcon>
          </button>
        </div>
        {props.user.status === "Accepted" ? (
          <div className="adminsStatusLabel">{props.user.status}</div>
        ) : null}
        {props.user.status === "Pending" ? (
          <div className="adminsStatusLabel pendingStatusLabel">{props.user.status}, resend invite</div>
        ) : null}
      </div>
    );
  };

  return (
    <Modal
      open={props.open}
      onClose={props.handleClose}
      aria-labelledby="simple-modal-title"
      aria-describedby="simple-modal-description"
      className="modal modalCreateModal"
    >
      <div className="modal-content create-credit-modal modalCreatePodFullDiv">
        <div className="exit" onClick={props.handleClose}>
          <img src={require("assets/icons/x_darkblue.png")} alt={"x"} />
        </div>
        <div className="title">
          <h2>Create new Credit Pool</h2>
        </div>
        <h4>General Credit Pool info</h4>
        <Grid container spacing={5} direction="row" alignItems="flex-start" justify="flex-start">
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
                <div className="removeImageButton cursor-pointer" onClick={() => removeCreditImage()}>
                  <SvgIcon>
                    <CloseSolid />
                  </SvgIcon>
                </div>
                <InputWithLabelAndTooltip
                  onInputValueChange={fileInputCreditPhoto}
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
                className="dragImageHereCreatePod cursor-pointer"
                onDragOver={dragOver}
                onDragEnter={dragEnter}
                onDragLeave={dragLeave}
                onDrop={fileDrop}
                style={{
                  cursor: "pointer",
                }}
                onClick={() => {
                  let selectCreditPhoto = document.getElementById("selectImageCreditPhoto");
                  if (selectCreditPhoto) {
                    selectCreditPhoto.click();
                  }
                }}
              >
                <img className="dragImageHereIcon" src={imageIcon} alt={"camera"} />
                <div className="dragImageHereLabel">Drag Image Here</div>
                <InputWithLabelAndTooltip
                  onInputValueChange={fileInputCreditPhoto}
                  hidden
                  type="file"
                  style={{
                    display: "none",
                  }}
                  reference={inputRef}
                />
              </div>
            )}
            <div className="marginTopFieldCreatePod">
              {/* {renderInputCreateModal({
                name: 'Discord ID',
                placeholder: 'Enter Discord ID...',
                type: 'text',
                width: 400,
                item: 'DiscordID',
              })} */}
            </div>
          </Grid>
          <Grid item xs={12} md={6}>
            {renderInputCreateModal({
              name: "Credit Pool name",
              placeholder: "Enter Credit Pool name...",
              type: "text",
              item: "Name",
            })}
            <InputWithLabelAndTooltip
              labelName="Credit Pool description"
              tooltip={'Please describe your Credit Pool'}
              inputValue={credit.Description}
              onInputValueChange={e => {
                let creditCopy = { ...credit };
                creditCopy.Description = e.target.value;
                setCredit(creditCopy);
              }}
              placeHolder="Enter Credit Pool description description..."
            />
          </Grid>
        </Grid>
        <Divider className="dividerCreatePod" />
        <h4>Credit Pool requirements</h4>
        <Grid container spacing={0} direction="row" alignItems="flex-start" justify="flex-start">
          <Grid item xs={12} md={6}>
            <div>
              <div className="flexRowInputs">
                <div className="infoHeaderCreatePod">Lending Token</div>
                {/*<Tooltip
                  TransitionComponent={Fade}
                  TransitionProps={{ timeout: 600 }}
                  arrow
                  className="tooltipHeaderInfo"
                  title={``}
                >
                  <img
                    className="infoIconCreatePod"
                    src={infoIcon}
                    alt={"info"}
                  />
                </Tooltip>*/}
              </div>
              <div className="selector-with-token">
                {tokenName && tokenName.length > 0 && token && token.length > 0 ? (
                  <img
                    className="imgSelectorTokenAddLiquidityModal"
                    src={require(`assets/tokenImages/${token}.png`)}
                    alt={tokenName}
                  />
                ) : null}
                <SelectorCreateModal
                  width={350}
                  selectValue={tokenName}
                  selectFunction={handleChangeTokenSelector}
                  selectItems={tokenNames}
                />
              </div>
            </div>
            {renderInputCreateModal({
              name: "Max Amount",
              placeholder: "Max Amount value",
              type: "number",
              item: "MaxAmount",
              info: `Maximum amount that can be deposited into the Credit pool by lenders`,
            })}
            {renderInputCreateModal({
              name: "Initial Deposit",
              placeholder: "Initial Deposit value",
              type: "number",
              item: "InitialDeposit",
              info: `Initial amount to be deposited by you, the creator of this pool`,
            })}
          </Grid>
          <Grid item xs={12} md={6}>
            <div>
              <div className="flexRowInputs">
                <div className="infoHeaderCreatePod">Start date</div>
                {/*<Tooltip
                  TransitionComponent={Fade}
                  TransitionProps={{ timeout: 600 }}
                  arrow
                  className="tooltipHeaderInfo"
                  title={``}
                >
                  <img
                    className="infoIconCreatePod"
                    src={infoIcon}
                    alt={"info"}
                  />
                </Tooltip>*/}
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
                    disabled={true}
                    id="date-picker-start-date"
                    minDate={minDate}
                    format="MM.dd.yyyy"
                    placeholder="Select date..."
                    value={credit.StartDate}
                    onChange={event => {
                      handleDateOfStartChange(event);
                    }}
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
                  title={`The credit pool will consider an option for no expiration date at a later time. This debate can be discussed and voted upon in Governance`}
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
                    value={credit.DateExpiration}
                    onChange={event => {
                      handleDateExpirationChange(event);
                    }}
                    keyboardIcon={
                      <img className="iconCalendarCreatePod" src={calendarIcon} alt={"calendar"} />
                    }
                  />
                </MuiPickersUtilsProvider>
              </div>
            </div>
            {renderInputCreateModal({
              name: "Interest (%)",
              placeholder: "Interest value",
              type: "number",
              item: "Interest",
              info: `We are adding money streaming to the platform, so interests will be paid in a second by second basis (paid in real time)`,
            })}
            <div className="flexRowInputs">
              <div className="marginBottomInterestCreatePod">
                <div className="flexRowInputs">
                  <div className="infoHeaderCreatePod">Interest type</div>
                  <Tooltip
                    TransitionComponent={Fade}
                    TransitionProps={{ timeout: 600 }}
                    arrow
                    className="tooltipHeaderInfo"
                    title={`Please select if you want borrowers to be required to pay interest monthly or weekly `}
                  >
                    <img className="infoIconCreatePod" src={infoIcon} alt={"info"} />
                  </Tooltip>
                </div>
                <SelectorCreateModal
                  width={260}
                  selectValue={interestTypeSelector}
                  selectFunction={handleChangeInterestTypeSelector}
                  selectItems={interestTypes}
                />
              </div>
              <div className="smallMarginLeftCreatePod marginBottomInterestCreatePod">
                <div className="flexRowInputs">
                  <div className="infoHeaderCreatePod">Interest due</div>
                  {/*<Tooltip
                  TransitionComponent={Fade}
                  TransitionProps={{ timeout: 600 }}
                  arrow
                  className="tooltipHeaderInfo"
                  title={``}
                >
                  <img
                    className="infoIconCreatePod"
                    src={infoIcon}
                    alt={"info"}
                  />
                </Tooltip>*/}
                </div>
                <SelectorCreateModal
                  width={130}
                  selectValue={interestDueSelector}
                  selectFunction={handleChangeinterestDueSelector}
                  selectItems={interestDues}
                />
              </div>
            </div>
          </Grid>
        </Grid>
        <h4>Advanced</h4>
        <Grid container spacing={5} direction="row" alignItems="flex-start" justify="flex-start">
          <Grid item xs={12} md={6}>
            {renderInputCreateModal({
              name: "Minimum CCR (%)",
              placeholder: "Minimum CCR value",
              type: "number",
              item: "MinCCR",
              info: `CCR (Collateral Coverage Ratio) is the liquidation mechanism of PRIVI credit and loan pools. If the collateral falls below this percentage, the credit/loan is automatically liquidated. This is the minimum level a borrower needs to select in order to be able to borrow from the pool. The CCR condition is chosen by the creator of the Credit pool. It may be not required (since the system allows for credit without collateral). Obviously, the borrower should always keep the amount of collateral such that the CCR keeps above the required levels. If it falls, the credit is liquidated for the borrower, and part (or all) of the collateral is taken by the credit pool.`,
            })}
            {renderInputCreateModal({
              name: "Premium (%)",
              placeholder: "Premium value",
              type: "number",
              item: "Premium",
              info: `This is the extra amount that is charged to borrowers for those who spend PRIVI credit without collateral or a small CCR. It really depends on the amount of CCR. So if there is a 100% CCR condition, it does not make many sense to ask borrowers to additionally pay a premium on purchase. But if CCR is 20%, then it may make sense to add a 10-15% premium on purchases.`,
            })}
            {renderInputCreateModal({
              name: "Incentive (%)",
              placeholder: "Incentive value",
              type: "number",
              item: "Incentive",
              info: `When borrowers are using PRIVI Credit, the borrowers should spend a premium on each purchase (this helps reduce the collateral requirement, as we replace it by this premium %, so intuitively, credits without collateral or with small collateral keeps accumulating collateral in terms of premium). So basically, the credit pool has a premium/risk pool. At expiration, if credit is repaid, this premium pool should be divided between participants. So this incentive %, is the amount of that premium that the borrower receives as reward of repaying the credit. So borrowers have an incentive to repay credits so they receive cashback. Recomended value 5-10%.`,
            })}
          </Grid>
          <Grid item xs={12} md={6} className="no-left-padding">
            {renderInputCreateModal({
              name: "Endorsement",
              placeholder: "Endorsement Score value",
              type: "number",
              item: "EndorsementScore",
              info: `What is the minimum endorsement score that a borrower needs to have to apply for credit from this pool. The default value is 50%`,
            })}
            {renderInputCreateModal({
              name: "Trust",
              placeholder: "Trust Score value",
              type: "number",
              item: "TrustScore",
              info: `This is the minimum trust score that a borrower needs to have to apply for credit from this pool. The default value is 50%`,
            })}
            <div className="flexRowInputs">
              <div className="infoHeaderCreatePod">Collateral</div>
              <Tooltip
                TransitionComponent={Fade}
                TransitionProps={{ timeout: 600 }}
                arrow
                className="tooltipHeaderInfo"
                title={`This field automatically is not required if the borrower selected
              0% CCR. Which means that the borrower will not be depositing any
              collateral. `}
              >
                <img className="infoIconCreatePod" src={infoIcon} alt={"info"} />
              </Tooltip>
            </div>
            <div className="flexRowInputs">
              <div className="selector-with-token">
                {collateralSelector &&
                  collateralSelector.length > 0 &&
                  collateralToken &&
                  collateralToken.length > 0 ? (
                  <img
                    className="imgSelectorTokenAddLiquidityModal"
                    src={require(`assets/tokenImages/${collateralToken}.png`)}
                    alt={collateralSelector}
                  />
                ) : null}
                <SelectorCreateModal
                  width={290}
                  selectValue={collateralSelector}
                  selectFunction={handleChangeCollateralSelector}
                  selectItems={tokenNames}
                />
              </div>
              <div className="smallMarginLeftCreatePod marginTopAddTokensCreatePod">
                <AddButtonCreateModal function={() => addCollateral()} />
              </div>
            </div>
            {collateralError.length > 0 ? <div className="error">{collateralError}</div> : null}
            {collaterals.length > 0 ? (
              <div className="collaterals">
                {collaterals.map(value => {
                  //display collaterals
                  return (
                    <div key={value} className="item-card-create-pod">
                      <div className="item-item-card-create-pod">
                        <img src={require(`assets/tokenImages/${value}.png`)} alt={value} />
                      </div>
                      <div className="item-item-card-create-pod">{value}</div>
                      <div
                        className="clickable item-item-card-create-pod"
                        onClick={() => {
                          const c: string[] = [...collaterals];
                          c.splice(c.indexOf(value), 1);
                          setCollaterals(c);
                        }}
                      >
                        ✕
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : null}
          </Grid>
        </Grid>
        <div className="user-management">
          <h4>User management</h4>
          <div className="flexRowInputs">
            <div>
              <InputWithLabelAndTooltip
                labelName="Admins (email)"
                style={{
                  width: "calc(350px - 24px)",
                }}
                type="text"
                inputValue={admin}
                onInputValueChange={e =>
                  setAdmin(e.target.value)}
                placeHolder="Add user by email"
              />
            </div>
            <div className="collateralSelector">
              <AddButtonCreateModal function={() => addAdmin()} />
            </div>
          </div>
          {admins && admins.length !== 0 ? (
            <div>
              {admins.map((item, i) => {
                return <UserLabel key={`${i}-admin`} index={i} user={item} />;
              })}
            </div>
          ) : null}
          <div className="flexRowInputs">
            <div>
              <InputWithLabelAndTooltip
                labelName="User and roles"
                tooltip={'Please select which other users and roles you want to be apart of this Credit Pool'}
                style={{
                  width: "calc(350px - 24px)",
                }}
                type="text"
                inputValue={userName}
                onInputValueChange={e =>
                  setUserName(e.target.value)}
                placeHolder="Add user by email"
              />
            </div>
            <div className="collateralSelector">
              <SelectorCreateModal
                width={120}
                selectValue={userRole}
                selectFunction={elem => {
                  setUserRole(elem.target.value);
                }}
                selectItems={roles}
              />
            </div>
            <div className="collateralSelector">
              <AddButtonCreateModal function={() => addUserRoles()} />
            </div>
          </div>
          {usersRoles && usersRoles.length !== 0 ? (
            <div>
              {usersRoles.map((item, i) => {
                return <UserLabel key={`${i}-user`} index={i} user={item} />;
              })}
            </div>
          ) : null}
          <div className="flexRowInputs">
            <div>
              <InputWithLabelAndTooltip
                labelName="Insurers"
                tooltip={'At a later stage, this will be where Credit Pools can be insured by PRIVI decentralized insurance pools'}
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
                onInputValueChange={e =>
                  setInsurerSearcher(e.target.value)}
                placeHolder="Search insurer by name or email"
              />
            </div>
            <div className="collateralSelector no-margin-bottom">
              <AddButtonCreateModal function={() => addInsurer()} />
            </div>
          </div>
          <AppBar position="static" className="appBarTabsInsurers">
            <Tabs
              value={tabsInsurersValue}
              className="tabsInsurers"
              onChange={handleChangeTabsInsurers}
              TabIndicatorProps={{ style: { background: "#64c89e" } }}
            >
              <Tab label="All insurers" />
              <Tab label="New insurers" />
              <Tab label="Past insurers" />
            </Tabs>
          </AppBar>
          {insurers && insurers.length !== 0 ? (
            <div>
              {
                //TODO: filter by tabsInsurersValue
                insurers.map((item, i) => {
                  return <UserLabel key={`${i}-insurer`} index={i} user={item} />;
                })
              }
            </div>
          ) : null}
        </div>
        <button onClick={handleCreate} disabled={disableSubmit}>
          Create Credit Pool
        </button>
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
    </Modal>
  );
});

export default CreateCreditModal;
