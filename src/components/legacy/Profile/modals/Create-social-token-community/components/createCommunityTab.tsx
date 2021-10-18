import React, { useState, useEffect, useRef } from "react";
import axios from "axios";

import { Fade, FormControl, Grid, Tooltip } from "@material-ui/core";
import Divider from "@material-ui/core/Divider";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Typography from "@material-ui/core/Typography";

import { useTypedSelector } from "store/reducers/Reducer";
import { StyledSelect, StyledMenuItem } from "shared/ui-kit/Styled-components/StyledComponents";
import { signTransaction } from "shared/functions/signTransaction";
import { updateTask } from "shared/functions/updateTask";
import StyledCheckbox from "shared/ui-kit/Checkbox";
import URL from "shared/functions/getURL";
import AlertMessage from "shared/ui-kit/Alert/AlertMessage";

import "../CreateSocialTokenCommunity.css";

// ---------------------------------------------------
import SvgIcon from "@material-ui/core/SvgIcon";
import { ReactComponent as CloseSolid } from "assets/icons/close-solid.svg";
import CustomSwitch from "shared/ui-kit/CustomSwitch";
import InputWithLabelAndTooltip from "shared/ui-kit/InputWithLabelAndTooltip";
const imageIcon = require("assets/icons/image_icon.png");
const infoIcon = require("assets/icons/info_icon.png");
const plusWhiteIcon = require("assets/icons/plus_white.png");
const appOptionsMailIcon = require("assets/icons/icon_email.png");
const appOptionsStoreIcon = require("assets/icons/icon_store.png");
const appOptionsTwitterIcon = require("assets/icons/icon_twitter.png");
const appOptionsFacebookIcon = require("assets/icons/icon_facebook.png");

const arePropsEqual = (prevProps, currProps) => {
  return prevProps.tokenObjList == currProps.tokenObjList;
};

const CreateCommunityTab = React.memo((props: any) => {
  const loggedUser = useTypedSelector(state => state.user);
  const [photo, setPhoto] = useState<any>(null);
  const [photoImg, setPhotoImg] = useState<any>(null);
  // -------------- COMMUNITY -----------------
  const [community, setCommunity] = useState<any>({
    Name: "",
    Description: "",
    Privacy: "Private",
    OpenAdvertising: false,
    PaymentsAllowed: false,
    Hashtags: [],
    MainHashtag: "",
    DiscordId: "",
    TwitterId: "",
    CommunityToken: false,
    TokenName: "",
    TokenSymbol: "",
    SpreadDividend: "",
    TargetPrice: "",
    TargetSupply: "",
    InitialSupply: "",
    CollateralQuantity: "",
    CollateralOption: "Use my investments as collateral",
    CollateralToken: "",
    AMM: "Exponential",
    RuleBased: true,
    RequiredTokens: [],
    MinimumUserLevel: "Not required",
    MinimumEndorsementScore: "Not required",
    MinimumTrustScore: "Not required",
    Levels: [{ Name: "", Description: "" }],
    BlogsEnabled: true,
    Blogs: [false, false, false, false],
    MemberDirectoriesEnabled: true,
    MemberDirectories: [false, false, false, false],
    ProjectsEnabled: true,
    Projects: [false, false, false, false],
    AppsEnabled: true,
    Apps: [false, false, false, false],
    Admins: [],
    UserRoles: {},
    InvitationUsers: [],
  });
  const [userRoleList, setUserRoleList] = useState<any[]>([]);

  const inputRef = useRef<any>();

  const [tokens, setTokens] = useState<string[]>(["BAL", "PRIVI", "BC", "DC"]);
  const [requiredToken, setRequiredToken] = useState<string>(tokens[0]);
  const [requiredTokenValue, setRequiredTokenValue] = useState<string>("");

  //general info
  const privacyOptions = ["Private", "Public", "Hidden", "Custom"];
  //hashtags
  const [addHashtag, setAddHashtag] = useState(false);
  const [hashtag, setHashtag] = useState<string>("");

  const [isMinLevelRequired, setIsMinLevelRequired] = useState<boolean>(false);
  const [isMinTrustRequired, setIsMinTrustRequired] = useState<boolean>(false);
  const [isMinEndorsementRequired, setIsMinEndorsementRequired] = useState<boolean>(false);

  //community apps
  const blogOptions = ["Blog option 1", "Blog option 2", "Blog option 3", "Blog option 4"];
  const memberDirectoryOptions = [
    "Member dir. option 1",
    "Member dir. option 2",
    "Member dir. option 3",
    "Member dir. option 4",
  ];
  const projectOptions = ["Project option 1", "Project option 2", "Project option 3", "Project option 4"];
  const appOptions = [
    { icon: appOptionsMailIcon, name: "App 1" },
    { icon: appOptionsStoreIcon, name: "App 2" },
    { icon: appOptionsTwitterIcon, name: "App 3" },
    { icon: appOptionsFacebookIcon, name: "App 4" },
  ];
  //user management //admins
  const [admin, setAdmin] = useState<string>("");
  //users
  const userRoles = ["Moderator", "Treasurer", "Ambassador", "Member"];
  const [user, setUser] = useState<string>("");
  const [userRole, setUserRole] = useState<string>(userRoles[0]);
  //invitation users /friend
  const [friendsSearcher, setFriendsSearcher] = useState<string>("");

  const [status, setStatus] = useState<any>("");

  //photo functions
  const onPhotoChange = (files: any) => {
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

          const communityCopy = community;
          communityCopy.dimensions = { height: height, width: width };
          setCommunity(communityCopy);

          return true;
        };
      }
    });
    reader.readAsDataURL(files[0]);
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

  const fileInput = e => {
    e.preventDefault();
    console.log(e);
    const files = e.target.files;
    if (files.length) {
      handleFiles(files);
    }
  };

  const handleFiles = (files: any) => {
    for (let i = 0; i < files.length; i++) {
      if (validateFile(files[i])) {
        onPhotoChange(files);
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

  ///////////////////////////////////////////////////

  // useEffects
  useEffect(() => {
    const newList: any[] = [];
    let email: string = "";
    let roleObj: any = null;
    for ([email, roleObj] of Object.entries(community.UserRoles)) {
      let role: string = "";
      let roleStatus: any = "";
      for ([role, roleStatus] of Object.entries(roleObj.roles)) {
        newList.push({
          email: email,
          role: role,
          status: roleStatus,
        });
      }
    }
    setUserRoleList(newList);
  }, [community.UserRoles]);

  useEffect(() => {
    if (props.tokenObjList && props.tokenObjList.length > 0) {
      const newTokens: string[] = [];
      props.tokenObjList.forEach(tokenObj => {
        newTokens.push(tokenObj.token);
      });
      setTokens(newTokens);
      const newCommunity = { ...community };
      newCommunity.CollateralToken = newTokens[0];
      setCommunity(newCommunity);
    }
  }, [props.tokenObjList]);

  const uploadImage = async (id, tokenSymbol) => {
    return new Promise((resolve, reject) => {
      const formData = new FormData();
      formData.append("image", photo, id);
      const config = {
        headers: {
          "content-type": "multipart/form-data",
        },
      };
      axios
        .post(`${URL()}/community/changeCommunityPhoto`, formData, config)
        .then(response => {
          let body = { dimensions: community.dimensions, id: community.CommunityAddress };
          axios
            .post(`${URL()}/community/updateCommunityPhotoDimensions`, body)
            .then(response => { })
            .catch(error => {
              console.log(error);

              alert("Error uploading photo");
            });

          resolve(true);
        })
        .catch(error => {
          console.log(error);

          resolve(true);
          // alert("Error uploading photo");
        });
      if (tokenSymbol && tokenSymbol !== "") {
        //change token photo (if creating token aswell)
        const formTokenData = new FormData();
        formTokenData.append("image", photo, tokenSymbol);
        axios
          .post(`${URL()}/wallet/changeTokenPhoto`, formTokenData, config)
          .then(response => {
            let body = { dimensions: community.tokenDimensions ?? community.dimensions, id: tokenSymbol };
            axios
              .post(`${URL()}/wallet/updateTokenPhotoDimensions`, body)
              .then(response => { })
              .catch(error => {
                console.log(error);

                alert("Error uploading photo");
              });
            resolve(true);
          })
          .catch(error => {
            console.log(error);
            resolve(true);
            // alert("Error uploading token photo");
          });
      }
    });
  };

  const handleCheckBoxMinLevel = e => {
    if (isMinLevelRequired) {
      let communityCopy = { ...community };
      communityCopy.MinimumUserLevel = "Not required";
      setCommunity(communityCopy);
    }
    setIsMinLevelRequired(!isMinLevelRequired);
  };

  const handleCheckBoxMinEndorsement = e => {
    if (isMinEndorsementRequired) {
      let communityCopy = { ...community };
      communityCopy.MinimumEndorsementScore = "Not required";
      setCommunity(communityCopy);
    }
    setIsMinEndorsementRequired(!isMinEndorsementRequired);
  };

  const handleCheckBoxMinTrust = e => {
    if (isMinTrustRequired) {
      let communityCopy = { ...community };
      communityCopy.MinimumTrustScore = "Not required";
      setCommunity(communityCopy);
    }
    setIsMinTrustRequired(!isMinTrustRequired);
  };

  const checkIfExist = (): Promise<any> => {
    return new Promise<any>((resolve, reject) => {
      try {
        axios
          .post(`${URL()}/community/checkCommunityInfo`, {
            communityName: community.Name,
          })
          .then(response => {
            const resp = response.data.data.communityExists;
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

  const validateCommunityinfo = async () => {
    let check: any = await checkIfExist();

    //remove blank levels and required tokens
    let communityCopy = { ...community };
    communityCopy.Levels.forEach((level, index) => {
      if (level.Name === "" && level.Description === "") {
        communityCopy.Levels.splice(index, 1);
      }
    });
    communityCopy.RequiredTokens.forEach((token, index) => {
      if (token.tokenValue === "") {
        communityCopy.RequiredTokens.splice(index, 1);
      }
    });
    //remove community apps if no options selected
    if (community.BlogsEnabled) {
      let enabled = false;
      community.Blogs.forEach(elem => {
        if (elem === false) {
          enabled = true;
          return;
        }
      });
      if (!enabled) {
        communityCopy.BlogsEnabled = false;
      }
    }
    if (community.MemberDirectoriesEnabled) {
      let enabled = false;
      community.MemberDirectories.forEach(elem => {
        if (elem === false) {
          enabled = true;
          return;
        }
      });
      if (!enabled) {
        communityCopy.MemberDirectoriesEnabled = false;
      }
    }
    if (community.ProjectsEnabled) {
      let enabled = false;
      community.Projects.forEach(elem => {
        if (elem === false) {
          enabled = true;
          return;
        }
      });
      if (!enabled) {
        communityCopy.ProjectsEnabled = false;
      }
    }
    if (community.AppsEnabled) {
      let enabled = false;
      community.Apps.forEach(elem => {
        if (elem === false) {
          enabled = true;
          return;
        }
      });
      if (!enabled) {
        communityCopy.AppsEnabled = false;
      }
    }

    setCommunity(communityCopy);

    if (!(community.Name.length >= 5)) {
      setStatus({
        msg: "Name field invalid. Minimum 5 characters required.",
        key: Math.random(),
        variant: "error",
      });
      return false;
    } else if (check === true) {
      setStatus({
        msg: "Name field invalid. A community with this name already exist.",
        key: Math.random(),
        variant: "error",
      });
      return false;
    } else if (!(community.Description.length >= 20)) {
      setStatus({
        msg: "Description field invalid. Minimum 20 characters required",
        key: Math.random(),
        variant: "error",
      });
      return false;
    } else if (
      community.CommunityToken &&
      (!community.TokenName || community.TokenName === "" || community.TokenName.length < 5)
    ) {
      setStatus({
        msg: "Token Name field invalid. Minimum 5 characters required.",
        key: Math.random(),
        variant: "error",
      });
      return false;
    } else if (
      community.CommunityToken &&
      (!community.TokenSymbol ||
        community.TokenSymbol === "" ||
        community.TokenSymbol.length < 3 ||
        community.TokenSymbol > 6)
    ) {
      setStatus({
        msg: "Token ID field invalid. Between 3 and 6 characters required.",
        key: Math.random(),
        variant: "error",
      });
      return false;
    } else if (community.CommunityToken && (!community.FundingToken || community.FundingToken === "")) {
      setStatus({
        msg: "Funding Token field invalid",
        key: Math.random(),
        variant: "error",
      });
      return false;
    } else if (
      community.CommunityToken &&
      (!community.SpreadDividend ||
        community.SpreadDividend === "" ||
        community.SpreadDividend < 0.1 ||
        community.SpreadDividend > 20)
    ) {
      setStatus({
        msg: "Trading Spread field invalid. Value must be between 0.1% and 20%.",
        key: Math.random(),
        variant: "error",
      });
      return false;
    } else if (
      community.CommunityToken &&
      (!community.TargetPrice || community.TargetPrice === "" || community.TargetPrice === 0)
    ) {
      setStatus({
        msg: "Target Price field invalid. Value must be greater than 0.",
        key: Math.random(),
        variant: "error",
      });
      return false;
    } else if (community.CommunityToken && (!community.TargetSupply || community.TargetSupply === "")) {
      setStatus({
        msg: "Target Supply field invalid",
        key: Math.random(),
        variant: "error",
      });
      return false;
    } else if (
      community.CommunityToken &&
      (!community.InitialSupply ||
        community.InitialSupply === "" ||
        !(community.InitialSupply < community.TargetSupply))
    ) {
      setStatus({
        msg: "Initial Supply field invalid. Value must be between 0 and Target Supply.",
        key: Math.random(),
        variant: "error",
      });
      return false;
    } else if (community.RuleBased && (!community.RequiredTokens || community.RequiredTokens.length <= 0)) {
      setStatus({
        msg: "Required Tokens quantity invalid",
        key: Math.random(),
        variant: "error",
      });
      return false;
    } else return true;
  };

  const createCommunity = async () => {
    let validation = await validateCommunityinfo();

    if (validation === true) {
      // constructing body
      let body = { ...community }; // copy from community
      body.MainHashtag = community.Hashtags.length > 0 ? community.Hashtags[0] : "";
      body.Creator = loggedUser.id;
      body.Frequency = "DAILY"; // TODO: let user pick from Daily, Weekly, Monthly
      body.AMM = body.AMM.toUpperCase();
      body.InitialSupply = Number(body.InitialSupply);
      body.TargetSupply = Number(body.TargetSupply);
      body.TargetPrice = Number(body.TargetPrice);
      body.SpreadDividend = Number(body.SpreadDividend) / 100;
      body.LockUpDate = 0;

      // transaction obj to sign
      const txnObj = {
        Creator: body.Creator,
        AMM: body.AMM,
        TargetSupply: body.TargetSupply,
        TargetPrice: body.TargetPrice,
        SpreadDividend: body.SpreadDividend,
        FundingToken: body.FundingToken,
        TokenSymbol: body.TokenSymbol,
        TokenName: body.TokenName,
        Frequency: body.Frequency,
        InitialSupply: body.InitialSupply,
        LockUpDate: body.LockUpDate,
      };

      const [hash, signature] = await signTransaction(loggedUser.mnemonic, txnObj);
      body.Hash = hash;
      body.Signature = signature;

      body.HasPhoto = !!(photoImg && photo);

      if (body.Levels.length === 1 && body.Levels.Name === "" && body.Levels.Description === "") {
        body.Levels = [];
      }

      //console.log("createCommunity", body);
      axios
        .post(`${URL()}/community/createCommunity`, body)
        .then(async response => {
          const resp = response.data;
          if (resp.success) {
            const answerBody = {
              userAddress: loggedUser.id,
              communityAddress: resp.data.communityAddress,
            };

            if (body.HasPhoto) {
              await uploadImage(answerBody.communityAddress, community.TokenSymbol);
            }

            // follow the community
            axios.post(`${URL()}/community/follow`, answerBody).then(res => { });

            // join the community
            axios.post(`${URL()}/community/join`, answerBody).then(res => { });

            await updateTask(loggedUser.id, "Create a Community");

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
            msg: "Social token Created!",
            key: Math.random(),
            variant: "success",
          });
        })
        .catch(error => {
          setStatus({
            msg: "Error when making the request",
            key: Math.random(),
            variant: "error",
          });
        });
    }
  };

  //add functions
  const addRequiredToken = () => {
    if (
      requiredToken &&
      requiredToken !== "" &&
      requiredTokenValue &&
      requiredTokenValue !== "" &&
      !community.RequiredTokens.some(t => t.token === requiredToken)
    ) {
      //TODO: check if email exists ???
      let communityCopy = { ...community };
      let array = [...communityCopy.RequiredTokens];
      array.push({
        token: requiredToken,
        tokenValue: requiredTokenValue,
      });
      communityCopy.RequiredTokens = array;
      setCommunity(communityCopy);
      setRequiredTokenValue(""); // reset field
    }
  };

  const addLevel = () => {
    let communityCopy = { ...community };
    let array = [...communityCopy.Levels];
    array.push({
      Name: "",
      Description: "",
    });
    communityCopy.Levels = array;
    setCommunity(communityCopy);
  };

  const addAdmin = () => {
    if (admin && admin !== "") {
      //TODO: check if email exists ???
      let communityCopy = { ...community };
      let array = [...communityCopy.Admins];
      array.push({
        name: admin,
        status: "Pending",
      });
      communityCopy.Admins = array;
      setCommunity(communityCopy);
      setAdmin("");
    }
  };

  // ------------------- USER ROLES ------------------------

  const addUserRole = () => {
    // here "user" is the input email
    if (user && user !== "" && userRole && userRole !== "") {
      let communityCopy = { ...community };
      let newUserRoles: any = { ...communityCopy.UserRoles };
      if (newUserRoles[user]) {
        // user already in the map
        newUserRoles[user].roles[userRole] = "Pending";
      } else {
        // user added for the first time
        const roles = {};
        roles[userRole] = "Pending";
        newUserRoles[user] = {
          roles: roles,
        };
      }
      communityCopy.UserRoles = newUserRoles;
      setCommunity(communityCopy);
      setUser(""); // reset field
    }
  };

  const deletetUserRoles = (email, role) => {
    let communityCopy = { ...community };
    let newUserRoles: any = { ...communityCopy.UserRoles };
    if (newUserRoles[email]) {
      if (newUserRoles[email].roles[role]) delete newUserRoles[email].roles[role];
      if (Object.keys(newUserRoles[email].roles).length == 0) delete newUserRoles[email];
    }
    communityCopy.UserRoles = newUserRoles;
    setCommunity(communityCopy);
  };

  const addInvitation = () => {
    if (friendsSearcher && friendsSearcher !== "") {
      //TODO: check if email exists ???
      let communityCopy = { ...community };
      let array = [...communityCopy.InvitationUsers];
      array.push(friendsSearcher);
      communityCopy.InvitationUsers = array;
      setCommunity(communityCopy);
      setFriendsSearcher(""); // reset field
    }
  };

  //input component
  function renderInputCreateModal(p) {
    return (
      <div>
        <InputWithLabelAndTooltip
          labelName={p.name}
          tooltip={p.info}
          style={{
            width: "calc(" + p.width + "px - 24px)",
          }}
          // disabled={p.disabled ? true : false}
          type={p.type}
          minValue={p.min}
          inputValue={p.value ? p.value : community[p.item]}
          onInputValueChange={elem => {
            let communityCopy = { ...community };
            communityCopy[p.item] = elem.target.value;
            setCommunity(communityCopy);
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

  //add button component
  const AddButtonCreateModal = (props: any) => {
    return (
      <div className="createHashtagButton" onClick={props.function}>
        <img className="createHashtagButtonIcon" src={plusWhiteIcon} alt={"plus"} />
      </div>
    );
  };

  //hashtag label
  const HashtagLabel = props => {
    return (
      <div className={props.main ? "hashtagLabel hashtagLabelMain" : "hashtagLabel"}>
        {props.main ? <div className="mainHashtagLabel">MAIN</div> : null}
        <div></div>
        <div>{props.value}</div>
        <button
          className="removePodButton"
          onClick={(e: any) => {
            //add collateral and update collaterals list
            e.preventDefault();
            let communityCopy = { ...community };
            let hashtagsCopy = [...communityCopy.Hashtags];
            hashtagsCopy.splice(props.index, 1);
            communityCopy.Hashtags = hashtagsCopy;
            setCommunity(communityCopy);
          }}
        >
          <SvgIcon>
            <CloseSolid />
          </SvgIcon>
        </button>
      </div>
    );
  };

  //hashtag button TODO use HashTags component
  const CreateHashtagButton = () => {
    return (
      <div>
        {addHashtag ? (
          <div className="createHashtagButtonInput">
            <InputWithLabelAndTooltip
              overriedClasses="createHashtagInput"
              onInputValueChange={elem => {
                let value = elem.target.value;
                setHashtag(value);
              }}
              type="text"
              inputValue={hashtag}
              placeHolder="hashtag..."
            />
            <button
              className="removePodButton"
              onClick={(e: any) => {
                if (hashtag && hashtag !== "") {
                  e.preventDefault();

                  let communityCopy = { ...community };
                  let hashtagsCopy = [...communityCopy.Hashtags];
                  hashtagsCopy.push("#" + hashtag);
                  setHashtag("");
                  communityCopy.Hashtags = hashtagsCopy;
                  setCommunity(communityCopy);
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

  //apps component
  const CommunityApps = props => {
    return (
      <div className="community-container">
        <div className="header">
          <b
            className={
              props.type === "Blog"
                ? !community.BlogsEnabled
                  ? "unselected"
                  : undefined
                : props.type === "Member Directory"
                  ? !community.MemberDirectoriesEnabled
                    ? "unselected"
                    : undefined
                  : props.type === "Projects"
                    ? !community.ProjectsEnabled
                      ? "unselected"
                      : undefined
                    : props.type === "Apps"
                      ? !community.AppsEnabled
                        ? "unselected"
                        : undefined
                      : undefined
            }
          >
            {props.type}
          </b>
          <div className="option-buttons">
            <button
              className={
                props.type === "Blog"
                  ? community.BlogsEnabled
                    ? "selected"
                    : undefined
                  : props.type === "Member Directory"
                    ? community.MemberDirectoriesEnabled
                      ? "selected"
                      : undefined
                    : props.type === "Projects"
                      ? community.ProjectsEnabled
                        ? "selected"
                        : undefined
                      : props.type === "Member Directory"
                        ? community.MemberDirectoriesEnabled
                          ? "selected"
                          : undefined
                        : props.type === "Projects"
                          ? community.ProjectsEnabled
                            ? "selected"
                            : undefined
                          : props.type === "Apps"
                            ? community.AppsEnabled
                              ? "selected"
                              : undefined
                            : undefined
              }
              onClick={() => {
                let communityCopy = {
                  ...community,
                };
                if (props.type === "Blog") {
                  communityCopy.BlogsEnabled = true;
                } else if (props.type === "Member Directory") {
                  communityCopy.MemberDirectoriesEnabled = true;
                } else if (props.type === "Projects") {
                  communityCopy.ProjectsEnabled = true;
                } else if (props.type === "Apps") {
                  communityCopy.AppsEnabled = true;
                }
                setCommunity(communityCopy);
              }}
            ></button>
            <button
              className={
                props.type === "Blog"
                  ? !community.BlogsEnabled
                    ? "selectedFalse"
                    : undefined
                  : props.type === "Member Directory"
                    ? !community.MemberDirectoriesEnabled
                      ? "selectedFalse"
                      : undefined
                    : props.type === "Projects"
                      ? !community.ProjectsEnabled
                        ? "selectedFalse"
                        : undefined
                      : props.type === "Apps"
                        ? !community.AppsEnabled
                          ? "selectedFalse"
                          : undefined
                        : undefined
              }
              onClick={() => {
                let communityCopy = {
                  ...community,
                };
                if (props.type === "Blog") {
                  communityCopy.BlogsEnabled = false;
                  community.Blogs.forEach((option, index) => {
                    communityCopy.Blogs[index] = false;
                  });
                } else if (props.type === "Member Directory") {
                  communityCopy.MemberDirectoriesEnabled = false;
                  community.MemberDirectories.forEach((option, index) => {
                    communityCopy.MemberDirectories[index] = false;
                  });
                } else if (props.type === "Projects") {
                  communityCopy.ProjectsEnabled = false;
                  community.Projects.forEach((option, index) => {
                    communityCopy.Projects[index] = false;
                  });
                } else if (props.type === "Apps") {
                  communityCopy.AppsEnabled = false;
                  community.Apps.forEach((option, index) => {
                    communityCopy.Apps[index] = false;
                  });
                }
                setCommunity(communityCopy);
              }}
            ></button>
          </div>
        </div>
        {props.type === "Blog"
          ? blogOptions.map((option, index) => {
            return (
              <div className="row" key={option}>
                <p style={{ margin: 0 }}>{option}</p>
                <StyledCheckbox
                  checked={community.Blogs[index]}
                  onChange={event => {
                    if (community.BlogsEnabled) {
                      let communityCopy = { ...community };
                      communityCopy.Blogs[index] = !communityCopy.Blogs[index];
                      setCommunity(communityCopy);
                    }
                  }}
                />
              </div>
            );
          })
          : props.type === "Member Directory"
            ? memberDirectoryOptions.map((option, index) => {
              return (
                <div className="row" key={option}>
                  <p style={{ margin: 0 }}>{option}</p>
                  <StyledCheckbox
                    checked={community.MemberDirectories[index]}
                    onChange={event => {
                      if (community.MemberDirectoriesEnabled) {
                        let communityCopy = { ...community };
                        communityCopy.MemberDirectories[index] = !communityCopy.MemberDirectories[index];
                        setCommunity(communityCopy);
                      }
                    }}
                  />
                </div>
              );
            })
            : props.type === "Projects"
              ? projectOptions.map((option, index) => {
                return (
                  <div className="row" key={option}>
                    <p style={{ margin: 0 }}>{option}</p>
                    <StyledCheckbox
                      checked={community.Projects[index]}
                      onChange={event => {
                        if (community.ProjectsEnabled) {
                          let communityCopy = { ...community };
                          communityCopy.Projects[index] = !communityCopy.Projects[index];
                          setCommunity(communityCopy);
                        }
                      }}
                    />
                  </div>
                );
              })
              : props.type === "Apps"
                ? appOptions.map((option, index) => {
                  return (
                    <div className="row" key={option.name}>
                      <div className="app">
                        <img src={option.icon} alt={"otpion"} />
                        <p>{option.name}</p>
                      </div>
                      <StyledCheckbox
                        checked={community.Apps[index]}
                        onChange={event => {
                          if (community.AppsEnabled) {
                            let communityCopy = { ...community };
                            communityCopy.Apps[index] = !communityCopy.Apps[index];
                            setCommunity(communityCopy);
                          }
                        }}
                      />
                    </div>
                  );
                })
                : null}
      </div>
    );
  };

  //admin label
  const AdminsMailLabel = props => {
    return (
      <div className="adminsMailLabel">
        <div className="adminsNameMailLabel">
          <div>{props.admin.name}</div>
          <button
            className="removePodButton"
            onClick={(e: any) => {
              e.preventDefault();
              let communityCopy = { ...community };
              let adminsCopy = [...communityCopy.Admins];
              adminsCopy.splice(props.index, 1);
              communityCopy.Admins = adminsCopy;
              setCommunity(communityCopy);
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

  //role user label
  const RoleLabel = props => {
    return (
      <div className="adminsMailLabel">
        <div className="adminsNameMailLabel">
          <div className="mainHashtagLabel">{props.user.role}</div>
          <div>{props.user.email}</div>
          <button
            className="removePodButton"
            onClick={(e: any) => {
              deletetUserRoles(props.user.email, props.user.role);
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

  //invitation / friend label
  const FriendLabel = props => {
    return (
      <div className="insurerRowCreatePod">
        <div className="photoInsurerRow"></div>
        <div className="nameInsurerRow">{props.user}</div>
        <div className="closeButtonInsurerRow">
          <button
            className="removePodButton"
            onClick={(e: any) => {
              e.preventDefault();
              let communityCopy = { ...community };
              let invitationUsersCopy = [...communityCopy.InvitationUsers];
              invitationUsersCopy.splice(props.index, 1);
              communityCopy.InvitationUsers = invitationUsersCopy;
              setCommunity(communityCopy);
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
    <div>
      <h4>General Community info</h4>
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
              <div className="removeImageButton" onClick={() => removeImage()}>
                <SvgIcon>
                  <CloseSolid />
                </SvgIcon>
              </div>

              <InputWithLabelAndTooltip
                onInputValueChange={fileInput}
                hidden
                type="file"
                style={{
                  display: "none",
                }}
                reference={inputRef.current}
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
                onInputValueChange={fileInput}
                hidden
                type="file"
                style={{
                  display: "none",
                }}
                reference={inputRef.current}
              />
            </div>
          )}
        </Grid>
        <Grid item xs={12} md={6}>
          {renderInputCreateModal({
            name: "Community name",
            placeholder: "Proposal question",
            type: "text",
            width: 400,
            item: "Name",
            info: `Please name your community`,
          })}

          <div className="flexRowInputs">
            <div className="infoHeaderCreatePod">Community description</div>
            <Tooltip
              TransitionComponent={Fade}
              TransitionProps={{ timeout: 600 }}
              arrow
              className="tooltipHeaderInfo"
              title={`Please tell us about your community`}
            >
              <img className="infoIconCreatePod" src={infoIcon} alt={"info"} />
            </Tooltip>
          </div>
          <textarea
            className="textAreaCreatePod"
            value={community.Description}
            onChange={elem => {
              let communityCopy = { ...community };
              communityCopy.Description = elem.target.value;
              setCommunity(communityCopy);
            }}
            placeholder="Proposal question"
          />
        </Grid>
        <Grid item xs={12} md={5}>
          <div className="flexRowInputs">
            <div className="infoHeaderCreatePod">Privacy</div>
            <Tooltip
              TransitionComponent={Fade}
              TransitionProps={{ timeout: 600 }}
              arrow
              className="tooltipHeaderInfo"
              title={`Public communities mean anyone can come follow and join, private means that users have to request permission. For now those are the only two options`}
            >
              <img className="infoIconCreatePod" src={infoIcon} alt={"info"} />
            </Tooltip>
          </div>
          <div className="option-buttons">
            {privacyOptions.map(option => {
              return (
                <button
                  key={option}
                  className={community.Privacy === option ? "selected" : undefined}
                  id="publicButtonCreatePod"
                  onClick={() => {
                    let communityCopy = { ...community };
                    communityCopy.Privacy = option;
                    setCommunity(communityCopy);
                  }}
                >
                  {option}
                </button>
              );
            })}
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
              title={`When ads are viewed within the system those who view or click on the ad earn PRIVI Data Coins. Not yet operational but will be soon!`}
            >
              <img className="infoIconCreatePod" src={infoIcon} alt={"info"} />
            </Tooltip>
          </div>
          <div className="option-buttons" id="openAdvOptions">
            <CustomSwitch
              checked={community.OpenAdvertising}
              onChange={() => {
                let communityCopy = {
                  ...community,
                };
                communityCopy.OpenAdvertising = !communityCopy.OpenAdvertising;
                setCommunity(communityCopy);
              }}
            />
          </div>
        </Grid>
        <Grid item xs={12} md={4}>
          <div className="flexRowInputs">
            <div className="infoHeaderCreatePod">Allow payments within this community</div>
            <Tooltip
              TransitionComponent={Fade}
              TransitionProps={{ timeout: 600 }}
              arrow
              className="tooltipHeaderInfo"
              title={`Your community token and other internal or external tokens can be transacted within this community, please select if you wish to make this a possibility `}
            >
              <img className="infoIconCreatePod" src={infoIcon} alt={"info"} />
            </Tooltip>
          </div>
          <div className="option-buttons" id="openAdvOptions">
            <CustomSwitch
              checked={community.PaymentsAllowed}
              onChange={() => {
                let communityCopy = {
                  ...community,
                };
                communityCopy.PaymentsAllowed = !communityCopy.PaymentsAllowed;
                setCommunity(communityCopy);
              }}
            />
          </div>
        </Grid>
      </Grid>
      <div className="flexRowInputs">
        <div className="infoHeaderCreatePod">Hashtags</div>
        <Tooltip
          TransitionComponent={Fade}
          TransitionProps={{ timeout: 600 }}
          arrow
          className="tooltipHeaderInfo"
          title={`Please provide at least one hashtag for your community. As the Communities grow, this field will help people discover your community`}
        >
          <img className="infoIconCreatePod" src={infoIcon} alt={"info"} />
        </Tooltip>
      </div>
      <div className="hashtagsRowCreatePod">
        {community.Hashtags && community.Hashtags.length ? (
          <div className="flexRowInputs">
            {community.Hashtags.map((hashtag, i) => {
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
      <div className="marginTopFieldCreatePod">
        <div className="flexRowInputs social">
          {renderInputCreateModal({
            name: "Twitter ID",
            placeholder: "Enter Twitter ID...",
            type: "text",
            width: 260,
            item: "TwitterId",
            value: loggedUser.twitter,
            info: `Please link to a Twitter page if you so choose`,
          })}
        </div>
      </div>

      <Divider className="dividerCreatePod" />

      <h4>Member Requirements</h4>
      <div className="option-buttons community-token">
        <button
          className={community.RuleBased ? "selected" : undefined}
          id="publicButtonCreatePod"
          onClick={() => {
            let communityCopy = { ...community };
            communityCopy.RuleBased = !communityCopy.RuleBased;
            setCommunity(communityCopy);
          }}
        >
          Rule based
        </button>
        <button
          className={!community.RuleBased ? "selected" : undefined}
          id="publicButtonCreatePod"
          onClick={() => {
            let communityCopy = { ...community };
            communityCopy.RuleBased = !communityCopy.RuleBased;
            setCommunity(communityCopy);
          }}
        >
          Open to everyone
        </button>
      </div>
      <Grid container spacing={0} direction="row" alignItems="flex-start" justify="flex-start">
        {community.RuleBased ? (
          <>
            <Grid item xs={12} md={6}>
              <div className="infoHeaderCreatePod">Required tokens to be investable in</div>
              <div className="required-tokens">
                {community.RequiredTokens.map((token, index) => {
                  return (
                    <div className="flexRowInputs" key={`${index}-token`}>
                      <InputWithLabelAndTooltip
                        overriedClasses="textFieldCreatePod"
                        style={{
                          width: "calc(220px - 24px)",
                        }}
                        type="number"
                        inputValue={token.tokenValue}
                        onInputValueChange={e => {
                          let communityCopy = { ...community };
                          communityCopy.RequiredTokens[index].tokenValue = e.target.value;
                          setCommunity(communityCopy);
                        }}
                        placeHolder="Token value"
                      />
                      <SelectorCreateModal
                        width={120}
                        selectValue={token.token}
                        selectFunction={e => {
                          if (!community.RequiredTokens.some(t => t.token === e.target.value)) {
                            let communityCopy = { ...community };
                            communityCopy.RequiredTokens[index].token = e.target.value;
                            setCommunity(communityCopy);
                          }
                        }}
                        selectItems={tokens}
                      />
                    </div>
                  );
                })}
                <div className="flexRowInputs">
                  <InputWithLabelAndTooltip
                    overriedClasses="textFieldCreatePod"
                    style={{
                      width: "calc(220px - 24px)",
                    }}
                    type="string"
                    inputValue={requiredTokenValue}
                    onInputValueChange={elem => {
                      setRequiredTokenValue(elem.target.value);
                    }}
                    placeHolder="Token value"
                  />
                  <SelectorCreateModal
                    width={120}
                    selectValue={requiredToken}
                    selectFunction={e => {
                      setRequiredToken(e.target.value);
                    }}
                    selectItems={tokens}
                  />
                  <AddButtonCreateModal function={() => addRequiredToken()} />
                </div>
              </div>
            </Grid>

            {/* MIN LEVEL */}
            <Grid item xs={12} md={6}>
              <div className="flexRowInputs">
                <div className="infoHeaderCreatePod">Minimum user level to join okay</div>
                <Tooltip
                  TransitionComponent={Fade}
                  TransitionProps={{ timeout: 600 }}
                  arrow
                  className="tooltipHeaderInfo"
                  title={`This pertains to the level the user has reached within the system as a whole, not the levels that you create for your own community`}
                >
                  <img className="infoIconCreatePod" src={infoIcon} alt={"info"} />
                </Tooltip>
              </div>
              <div style={{ display: "inline-flex" }}>
                <FormGroup row style={{ width: 130 }}>
                  <FormControlLabel
                    style={{ flexDirection: "row" }}
                    labelPlacement="end"
                    control={
                      <StyledCheckbox
                        checked={isMinLevelRequired}
                        onChange={handleCheckBoxMinLevel}
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
                        Required
                      </Typography>
                    }
                  />
                </FormGroup>
                <InputWithLabelAndTooltip
                  overriedClasses="textFieldCreatePod"
                  style={{
                    width: "210px",
                    marginTop: 25,
                  }}
                  type="number"
                  inputValue={community.MinimumUserLevel}
                  disabled={!isMinLevelRequired}
                  onInputValueChange={e => {
                    let communityCopy = { ...community };
                    communityCopy.MinimumUserLevel = e.target.value;
                    setCommunity(communityCopy);
                  }}
                  placeHolder={isMinLevelRequired ? "Minimum user level" : "Not required"}
                />
              </div>

              {/* MIN SCORE */}
              <div className="flexRowInputs">
                <div className="infoHeaderCreatePod">Minimum Endorsement Score to join</div>
                <Tooltip
                  TransitionComponent={Fade}
                  TransitionProps={{ timeout: 600 }}
                  arrow
                  className="tooltipHeaderInfo"
                  title={`Endorsement scores quantify the amount of endorsements a user receives from users in the network and the trust scores of those users who endorse you`}
                >
                  <img className="infoIconCreatePod" src={infoIcon} alt={"info"} />
                </Tooltip>
              </div>
              <div style={{ display: "inline-flex" }}>
                <FormGroup row style={{ width: 130 }}>
                  <FormControlLabel
                    style={{ flexDirection: "row" }}
                    labelPlacement="end"
                    control={
                      <StyledCheckbox
                        checked={isMinEndorsementRequired}
                        onChange={handleCheckBoxMinEndorsement}
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
                        Required
                      </Typography>
                    }
                  />
                </FormGroup>
                <InputWithLabelAndTooltip
                  overriedClasses="textFieldCreatePod"
                  style={{
                    width: "210px",
                    marginTop: 25,
                  }}
                  type="number"
                  inputValue={community.MinimumEndorsementScore}
                  disabled={!isMinEndorsementRequired}
                  onInputValueChange={e => {
                    let communityCopy = { ...community };
                    communityCopy.MinimumEndorsementScore = e.target.value;
                    setCommunity(communityCopy);
                  }}
                  placeHolder={isMinEndorsementRequired ? "Minimum Endorsement score" : "Not required"}
                />
              </div>

              {/* MIN TRUST */}
              <div className="flexRowInputs">
                <div className="infoHeaderCreatePod">Minimum Trust score to join</div>
                <Tooltip
                  TransitionComponent={Fade}
                  TransitionProps={{ timeout: 600 }}
                  arrow
                  className="tooltipHeaderInfo"
                  title={`Trust scores quantify the data that you create in the system, tracking transactions and so on, think of this as a "quantified self" score and a measure of financial trustworthiness`}
                >
                  <img className="infoIconCreatePod" src={infoIcon} alt={"info"} />
                </Tooltip>
              </div>
              <div style={{ display: "inline-flex" }}>
                <FormGroup row style={{ width: 130 }}>
                  <FormControlLabel
                    style={{ flexDirection: "row" }}
                    labelPlacement="end"
                    control={
                      <StyledCheckbox
                        checked={isMinTrustRequired}
                        onChange={handleCheckBoxMinTrust}
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
                        Required
                      </Typography>
                    }
                  />
                </FormGroup>
                <InputWithLabelAndTooltip
                  overriedClasses="textFieldCreatePod"
                  style={{
                    width: "210px",
                    marginTop: 25,
                  }}
                  type="number"
                  inputValue={community.MinimumTrustScore}
                  disabled={!isMinTrustRequired}
                  onInputValueChange={e => {
                    let communityCopy = { ...community };
                    communityCopy.MinimumTrustScore = e.target.value;
                    setCommunity(communityCopy);
                  }}
                  placeHolder={isMinTrustRequired ? "Minimum Trust score" : "Not required"}
                />
              </div>
            </Grid>
          </>
        ) : null}
      </Grid>

      <Divider className="dividerCreatePod" />

      <h4>Community Levels</h4>
      <div className="flexRowInputs">
        <div className="infoHeaderCreatePod">Levels</div>
        <Tooltip
          TransitionComponent={Fade}
          TransitionProps={{ timeout: 600 }}
          arrow
          className="tooltipHeaderInfo"
          title={`You can create levels within your community for which your members can acheive. This can be customized after the creation of your community`}
        >
          <img className="infoIconCreatePod" src={infoIcon} alt={"info"} />
        </Tooltip>
      </div>
      {community.Levels && community.Levels.length > 0
        ? community.Levels.map((level, index) => {
          return (
            <div className="flexRowInputs level" key={`level-${index + 1}`}>
              <div className="number">{index + 1}</div>
              <InputWithLabelAndTooltip
                overriedClasses="textFieldCreatePod"
                style={{
                  width: "calc(340px - 24px)",
                }}
                type="string"
                inputValue={community.Levels[index].Name}
                onInputValueChange={e => {
                  let communityCopy = { ...community };
                  communityCopy.Levels[index].Name = e.target.value;
                  setCommunity(communityCopy);
                }}
                placeHolder={`Level ${index + 1} name`}
              />
              <InputWithLabelAndTooltip
                overriedClasses="textFieldCreatePod"
                style={{
                  width: "calc(400px - 24px)",
                }}
                type="string"
                inputValue={community.Levels[index].Description}
                onInputValueChange={e => {
                  let communityCopy = { ...community };
                  communityCopy.Levels[index].Description = e.target.value;
                  setCommunity(communityCopy);
                }}
                placeHolder="Level description"
              />
            </div>
          );
        })
        : null}
      <AddButtonCreateModal function={() => addLevel()} />

      <Divider className="dividerCreatePod" />

      <div className="flexRowInputs">
        <div className="infoHeaderCreatePod">Community Apps</div>
        <Tooltip
          TransitionComponent={Fade}
          TransitionProps={{ timeout: 600 }}
          arrow
          className="tooltipHeaderInfo"
          title={`As PRIVI grows, the features and apps you will have available to your to customize your commuity will grow as well. For now, this is just to show you what is possible! `}
        >
          <img className="infoIconCreatePod" src={infoIcon} alt={"info"} />
        </Tooltip>
      </div>
      <div className="community-apps">
        <CommunityApps type="Blog" />
        <CommunityApps type="Member Directory" />
        <CommunityApps type="Projects" />
        <CommunityApps type="Apps" />
      </div>

      <div className="modalCreatePadding userManagementCreatePod">
        <h4>User management</h4>
        <div className="flexRowInputs">
          <div className="infoHeaderCreatePod">Admins (email)</div>
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
        <div className="flexRowInputs">
          <InputWithLabelAndTooltip
            overriedClasses="textFieldCreatePod"
            style={{
              width: "calc(350px - 24px)",
            }}
            type="string"
            inputValue={admin}
            onInputValueChange={elem => {
              setAdmin(elem.target.value);
            }}
            placeHolder="Add admin by email"
          />
          <AddButtonCreateModal function={() => addAdmin()} />
        </div>
        {community.Admins && community.Admins.length !== 0 ? (
          <div>
            {community.Admins.map((item, i) => {
              return <AdminsMailLabel key={i} index={i} admin={item} />;
            })}
          </div>
        ) : null}
        <div className="flexRowInputs">
          <div className="infoHeaderCreatePod">User and roles</div>
          <Tooltip
            TransitionComponent={Fade}
            TransitionProps={{ timeout: 600 }}
            arrow
            className="tooltipHeaderInfo"
            title={`Please invite those who you think would bring value to your community either as an admin or moderator`}
          >
            <img className="infoIconCreatePod" src={infoIcon} alt={"info"} />
          </Tooltip>
        </div>
        <div className="flexRowInputs">
          <InputWithLabelAndTooltip
            overriedClasses="textFieldCreatePod"
            style={{
              width: "calc(350px - 24px)",
            }}
            type="string"
            inputValue={user}
            onInputValueChange={e => {
              setUser(e.target.value);
            }}
            placeHolder="Add user by email"
          />
          <SelectorCreateModal
            width={120}
            selectValue={userRole}
            selectFunction={e => {
              setUserRole(e.target.value);
            }}
            selectItems={userRoles}
          />
          <AddButtonCreateModal function={() => addUserRole()} />
        </div>
        {Object.values(community.UserRoles).length > 0 ? (
          <div>
            {userRoleList.map((item, i) => {
              return <RoleLabel key={i} index={i} user={item} />;
            })}
          </div>
        ) : null}
        <div className="flexRowInputs">
          <div className="infoHeaderCreatePod">Invite friends to community</div>
          <Tooltip
            TransitionComponent={Fade}
            TransitionProps={{ timeout: 600 }}
            arrow
            className="tooltipHeaderInfo"
            title={`You can also invite friends to your community after its creation `}
          >
            <img className="infoIconCreatePod" src={infoIcon} alt={"info"} />
          </Tooltip>
        </div>
        <div className="flexRowInputs">
          <InputWithLabelAndTooltip
            overriedClasses="textFieldCreatePod"
            style={{
              width: "calc(350px - 46px)",
            }}
            type="text"
            inputValue={friendsSearcher}
            onInputValueChange={elem => {
              let value = elem.target.value;
              setFriendsSearcher(value);
            }}
            placeHolder="Add user by email"
          />
          <AddButtonCreateModal function={() => addInvitation()} />
        </div>
        {community.InvitationUsers.map((user, i) => {
          return <FriendLabel key={i} index={i} user={user} />;
        })}
      </div>

      <div className="buttonCreatePodRow">
        <button onClick={createCommunity} className="buttonCreatePod">
          Create Community
        </button>
      </div>

      {status && (
        <AlertMessage
          key={status.key}
          message={status.msg}
          variant={status.variant}
          onClose={() => setStatus(undefined)}
        />
      )}
    </div>
  );
}, arePropsEqual);

export default CreateCommunityTab;
