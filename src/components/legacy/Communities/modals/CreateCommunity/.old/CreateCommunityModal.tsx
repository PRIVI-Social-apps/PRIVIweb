import React, { useEffect, useState } from "react";
import axios from "axios";

import { Modal } from "@material-ui/core";
import { useTypedSelector } from "store/reducers/Reducer";

import URL from "shared/functions/getURL";
import AlertMessage from "shared/ui-kit/AlertMessage";
import { updateTask } from "shared/functions/updateTask";
import { signTransaction } from "shared/functions/signTransaction";
import GeneralTab from "./components/CreateCommunityGeneralTab";
import TokenomicsTab from "./components/CreateCommunityTokenomicsTab";
import AssistanceTab from "./components/CreateCommunityAssistanceTab";

import "./CreateCommunityModal.css";

export default function CreateCommunityModal(props) {
  //REDUX
  const loggedUser = useTypedSelector(state => state.user);

  //HOOKS
  const [generalOrTokenomics, setGeneralOrTokenomics] = useState<boolean>(true);
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
    CommunityToken: true,
    TokenName: "",
    TokenSymbol: "",
    FundingToken: "",
    TargetSpread: "",
    DividendFreq: "Daily",
    TargetPrice: "",
    TargetSupply: "",
    InitialSupply: "",
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
    AssistanceRequired: false,
  });

  const [status, setStatus] = useState<any>();

  //general info
  const [tokenphoto, setTokenPhoto] = useState<any>(null);
  const [tokenObjList, setTokenObjList] = useState<any[]>([]);

  const [photo, setPhoto] = useState<any>(null);
  const [photoImg, setPhotoImg] = useState<any>(null);

  //create community function
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
      body.TargetSpread = Number(body.TargetSpread) / 100;
      body.LockUpDate = 0;

      // transaction obj to sign
      const txnObj = {
        Creator: body.Creator,
        AMM: body.AMM,
        TargetSupply: body.TargetSupply,
        TargetPrice: body.TargetPrice,
        TargetSpread: body.TargetSpread,
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

      body.HasPhoto = !!photo;

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

            if (body.HasPhoto && photo) {
              await uploadImage(answerBody.communityAddress, community.TokenSymbol);
            }

            if (community.CommunityToken === true && community.TokenSymbol !== "") {
              //create the token aswell
              // constructing body
              let tokenBody = {} as any;
              tokenBody.Creator = loggedUser.id;
              tokenBody.AMM = community.AMM.toUpperCase();
              tokenBody.InitialSupply = Number(community.InitialSupply);
              tokenBody.TargetSupply = Number(community.TargetSupply);
              tokenBody.TargetPrice = Number(community.TargetPrice);
              tokenBody.SpreadDividend = Number(tokenBody.TargetSpread) / 100;
              tokenBody.CommunityAddress = resp.data.communityAddress;
              tokenBody.TokenType = "PRIVI";
              tokenBody.TokenName = community.TokenName;
              tokenBody.TokenDescription = community.TokenDescription ?? "";
              tokenBody.TokenSymbol = community.TokenSymbol;
              tokenBody.FundingToken = community.FundingToken;
              tokenBody.CollateralQuantity = 0;
              //tokenBody.CollateralOption = "Use my investments as collateral";
              tokenBody.CollateralToken = "";
              tokenBody.VestingTaxation = false;
              tokenBody.dimensions = community.tokenDimensions ?? community.dimensions;

              const [hash, signature] = await signTransaction(loggedUser.mnemonic, tokenBody);
              tokenBody.Hash = hash;
              tokenBody.Signature = signature;

              axios.post(`${URL()}/community/createCommunityToken`, tokenBody).then(async response => {
                const resp = response.data;
                if (resp.success) {
                } else {
                  console.log("failed");
                }
              });
            }

            // follow the community
            axios.post(`${URL()}/community/follow`, answerBody).then(res => {
              // const resp = res.data;
              // if (resp.success) {
              //   setStatus({
              //     msg: 'follow success',
              //     key: Math.random(),
              //     variant: 'success',
              //   });
              // } else {
              //   setStatus({
              //     msg: 'follow failed',
              //     key: Math.random(),
              //     variant: 'error',
              //   });
              // }
            });

            // join the community
            axios.post(`${URL()}/community/join`, answerBody).then(res => {
              // const resp = res.data;
              // if (resp.success) {
              //   setStatus({
              //     msg: 'Joined community successfully',
              //     key: Math.random(),
              //     variant: 'success',
              //   });
              // } else {
              //   setStatus({
              //     msg: 'Joined community failed',
              //     key: Math.random(),
              //     variant: 'error',
              //   });
              // }
            });

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
          }
          setStatus({
            msg: "Community created!",
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
    } else if (!community.CommunityAddress && check === true) {
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
    } else if (
      community.CommunityToken &&
      (!community.TokenDescription || community.TokenDescription === "")
    ) {
      setStatus({
        msg: "Token description field invalid",
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
    } else if (community.CommunityToken && (!community.TargetSpread || community.TargetSpread === "")) {
      setStatus({
        msg: "Token Target Spread field invalid",
        key: Math.random(),
        variant: "error",
      });
      return false;
    } else if (
      community.CommunityToken &&
      (!community.TargetSpread || community.TargetSpread < 0.1 || community.TargetSpread > 20)
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
    } else if (community.CommunityToken && (!community.AMM || community.AMM === "")) {
      setStatus({
        msg: "AMM field invalid",
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
    } else if (community.RuleBased && (!community.RequiredTokens || community.RequiredTokens.length <= 0)) {
      setStatus({
        msg: "Required Tokens quantity invalid",
        key: Math.random(),
        variant: "error",
      });
      return false;
    } else return true;
  };

  //save community function
  const saveCommunity = async () => {
    let validation = await validateCommunityinfo();

    if (validation === true) {
      // constructing body
      let body = { ...community }; // copy from community
      body.MainHashtag = community.Hashtags.length > 0 ? community.Hashtags[0] : "";
      body.Creator = loggedUser.id;

      body.HasPhoto = !!photo;

      if (body.Levels.length === 1 && body.Levels.Name === "" && body.Levels.Description === "") {
        body.Levels = [];
      }

      axios
        .post(`${URL()}/community/saveCommunity`, body)
        .then(async response => {
          const resp = response.data;
          if (resp.success) {
            console.log(resp);
            if (body.HasPhoto) {
              await uploadImage(resp.data.communityAddress, community.TokenSymbol);
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
            msg: "Community saved!",
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

  //photo functions
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
          resolve(true);
        })
        .catch(error => {
          console.log(error);

          resolve(true);
          alert("Error uploading photo");
        });
      if (community.CommunityToken && tokenSymbol && tokenSymbol !== "") {
        //change token photo (if creating token aswell)
        const formTokenData = new FormData();
        if (tokenphoto) {
          formTokenData.append("image", tokenphoto, tokenSymbol);
        } else {
          formTokenData.append("image", photo, tokenSymbol);
        }
        axios
          .post(`${URL()}/wallet/changeTokenPhoto`, formTokenData, config)
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

  // get token list from backend
  useEffect(() => {
    if (props.open === true) {
      axios.get(`${URL()}/wallet/getCryptosRateAsList`).then(res => {
        const resp = res.data;
        if (resp.success) {
          const tokenObjList: any[] = [];
          const data = resp.data;
          data.forEach(rateObj => {
            tokenObjList.push({ token: rateObj.token, name: rateObj.name });
          });
          setTokenObjList(tokenObjList);
        }
      });
    }
  }, [props.open]);

  //MODAL
  return (
    <Modal
      open={props.open}
      onClose={props.handleClose}
      aria-labelledby="simple-modal-title"
      aria-describedby="simple-modal-description"
      className="modal modalCreateCommunityModal"
    >
      <div
        className="modal-content create-community-modal modalCreatePadding"
        style={{ width: "892px", display: "block" }}
      >
        <div className="exit" onClick={props.handleClose}>
          <img src={require("assets/icons/x_darkblue.png")} alt={"x"} style={{ marginRight: 8 }} />
        </div>

        <div className="cards-options-container">
          <span className="cards-options-title">Create new Community</span>
          <div className="wrapper-btn-community">
            <button
              style={{ margin: "0px 8px 0 0" }}
              onClick={() => setGeneralOrTokenomics(!generalOrTokenomics)}
            >
              General
            </button>
            <button
              style={{ margin: "0px 8px 0 8px" }}
              onClick={() => setGeneralOrTokenomics(!generalOrTokenomics)}
            >
              Tokenomics
            </button>
          </div>
        </div>

        <h3 className="cards-options_sub-title">General Community Info</h3>

        {community ? (
          generalOrTokenomics === true ? (
            <GeneralTab
              community={community}
              setCommunity={setCommunity}
              setPhoto={setPhoto}
              photo={photo}
              setPhotoImg={setPhotoImg}
              photoImg={photoImg}
              tokenObjList={tokenObjList}
            />
          ) : (
            <>
              <AssistanceTab
                community={community}
                setCommunity={setCommunity}
                tokenObjList={tokenObjList}
                saveCommunity={saveCommunity}
              />
              {!community.AssistanceRequired ? (
                <TokenomicsTab
                  community={community}
                  setCommunity={setCommunity}
                  createCommunity={createCommunity}
                  setTokenPhoto={setTokenPhoto}
                  tokenObjList={tokenObjList}
                  creation={true}
                />
              ) : null}
            </>
          )
        ) : null}

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
}
