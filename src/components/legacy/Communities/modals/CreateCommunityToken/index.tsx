import React, { useEffect, useState, useRef } from "react";
import axios from "axios";

import { useCreateCommunityTokenStyles } from "./index.styles";
import CreateCommunityTokenGeneralTab from "./components/GeneralTab";
import CreateCommunityTokenFundingTokenTab from "./components/FundingTokenTab";
import CreateCommunityTokenSupplyTab from "./components/SupplyTab";
import CreateCommunityTokenVestingTab from "./components/VestingTab";
import RequestAssistance from "./RequestAssistance";
import URL from "shared/functions/getURL";
import { Modal, PrimaryButton, SecondaryButton } from "shared/ui-kit";
import { useTypedSelector } from "store/reducers/Reducer";
import { buildJsxFromObject } from "shared/functions/commonFunctions";
import { SignatureRequestModal } from "shared/ui-kit/Modal/Modals";
import { ICreateCommunityToken, createCommunityToken } from "shared/services/API";
import CustomSwitch from "shared/ui-kit/CustomSwitch";
import Box from "shared/ui-kit/Box";
import AlertMessage from "shared/ui-kit/Alert/AlertMessage";

export default function CreateCommunityTokenModal(props) {
  //REDUX
  const user = useTypedSelector(state => state.user);

  //HOOKS
  const classes = useCreateCommunityTokenStyles();
  const [communityToken, setCommunityToken] = useState<any>({
    ...props.community,
    AMM: "Linear",
    InitialSupply: "",
    TargetSupply: "",
    TargetPrice: "",
    TokenName: "",
    TokenSymbol: "",
    FundingToken: `ETH`,
    Network: "PRIVI",
  });

  const [page, setPage] = useState(0);
  const [requestAssistance, setRequestAssistance] = useState(false);

  const [successMsg, setSuccessMsg] = useState<string>("");
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [openSuccess, setOpenSuccess] = useState(false);
  const [openError, setOpenError] = useState(false);

  const [tokenphoto, setTokenPhoto] = useState<any>(null);

  //general info
  const [tokenList, setTokenList] = useState<any[]>([]);

  const payloadRef = useRef<any>({});
  const [openSignRequestModal, setOpenSignRequestModal] = useState<boolean>(false);
  const [signRequestModalDetail, setSignRequestModalDetail] = useState<any>(null);

  // get token list from backend
  useEffect(() => {
    if (props.open === true) {
      axios.get(`${URL()}/wallet/getCryptosRateAsList`).then(res => {
        const resp = res.data;
        if (resp.success) {
          const tokenList: any[] = [];
          const data = resp.data;
          data.forEach(rateObj => {
            tokenList.push(rateObj.token);
          });
          setTokenList(tokenList);
        }
      });
    }
  }, [props.open]);

  const handleOpenSignatureModal = () => {
    if (validateCommunityTokeninfo() === true) {
      const now = Math.floor(Date.now() / 1000);
      const vestingTime = now + (communityToken.vestingTime * 30 || 30) * 24 * 3600;
      const payload: ICreateCommunityToken = {
        CommunityId: props.communityAddress,
        TokenName: communityToken.TokenName,
        TokenSymbol: communityToken.TokenSymbol,
        FundingToken: communityToken.FundingToken,
        Type: communityToken.AMM.toUpperCase(),
        InitialSupply: communityToken.InitialSupply,
        TargetPrice: communityToken.TargetPrice,
        TargetSupply: communityToken.TargetSupply,
        // these parameters below are missing (in testing its hardcoded)
        VestingTime: vestingTime,
        ImmediateAllocationPct: `${communityToken.ImmediateAllocationPct / 100}`,
        VestedAllocationPct: `${communityToken.VestedAllocationPct / 100}`,
        TaxationPct: `${communityToken.TaxationPct / 100}`,
      };
      payloadRef.current = payload;
      setSignRequestModalDetail(buildJsxFromObject(payload));
      setOpenSignRequestModal(true);
    }
  };

  //create community function
  const handleCreateCommunityToken = async () => {
    try {
      const payload = payloadRef.current;
      if (Object.keys(payload).length) {
        // any additional data that need to be stored goes in this object
        const additionalData = {
          dimensions: communityToken.dimensions,
          HasImage: communityToken.HasImage,
        };
        const createTokenRes = await createCommunityToken(payload, additionalData);
        if (createTokenRes.success) {
          // upload img? not sure if this works
          if (communityToken.HasImage) await uploadImage();
          setTimeout(() => {
            props.handleRefresh();
            props.handleClose();
          }, 1000);
          setSuccessMsg("Community token created!");
          handleClickSuccess();
        } else {
          setErrorMsg("Error when making the request");
          handleClickError();
        }
      }
    } catch (e) {
      setErrorMsg("Error when making the request");
      handleClickError();
    }
  };

  const validateFirstPage = () => {
    if (!(communityToken.TokenName.length >= 5)) {
      setErrorMsg("Name field invalid. Minimum 5 characters required.");
      handleClickError();
      return false;
    } else if (
      !communityToken.TokenSymbol ||
      communityToken.TokenSymbol === "" ||
      communityToken.TokenSymbol.length < 3 ||
      communityToken.TokenSymbol.length > 6
    ) {
      setErrorMsg("Token Symbol field invalid. Between 3 and 6 characters required.");
      handleClickError();
      return false;
    } else return true;
  };

  const validateThirdPage = () => {
    if (
      !communityToken.InitialSupply ||
      communityToken.InitialSupply === "" ||
      communityToken.InitialSupply > communityToken.TargetSupply ||
      communityToken.InitialSupply <= 0
    ) {
      setErrorMsg("Initial Supply field invalid. Value must be between 0 and Target Supply");
      handleClickError();
      return false;
    } else if (
      !communityToken.TargetPrice ||
      communityToken.TargetPrice <= "" ||
      communityToken.TargetPrice === 0
    ) {
      setErrorMsg("Target Price field invalid");
      handleClickError();
      return false;
    } else if (
      !communityToken.TargetSupply ||
      communityToken.TargetSupply === "" ||
      communityToken.TargetSupply <= 0
    ) {
      setErrorMsg("Target Supply field invalid");
      handleClickError();
      return false;
    } else return true;
  };

  const validateCommunityTokeninfo = () => {
    if (validateFirstPage() && validateThirdPage()) {
      return true;
    } else {
      setErrorMsg("Error when validating. Please check all the fields");
      handleClickError();

      return false;
    }
  };

  //save community function
  const saveCommunity = () => {
    if (validateCommunityTokeninfo()) {
      // constructing body
      let body = { ...communityToken }; // copy from community
      // body.MainHashtag = communityToken.Hashtags.length > 0 ? communityToken.Hashtags[0] : "";
      body.MainHashtag = "";
      body.Creator = user.id;

      // if (body.Levels.length === 1 && body.Levels.Name === "" && body.Levels.Description === "") {
      body.Levels = [];
      // }

      axios
        .post(`${URL()}/community/saveCommunity`, body)
        .then(async response => {
          const resp = response.data;
          if (resp.success) {
            setTimeout(() => {
              props.handleRefresh();
              props.handleClose();
            }, 1000);
          } else {
            setErrorMsg("Error when making the request");
            handleClickError();
          }
          setSuccessMsg("Community saved!");
          handleClickSuccess();
        })
        .catch(error => {
          console.log(error);
          setErrorMsg("Error when making the request");
          handleClickError();
        });
    }
  };

  const handleClickSuccess = () => {
    setOpenSuccess(true);
    setTimeout(() => {
      setOpenSuccess(false);
    }, 3000);
  };
  const handleClickError = () => {
    setOpenError(true);
    setTimeout(() => {
      setOpenError(false);
    }, 3000);
  };
  const handleCloseSuccess = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenSuccess(false);
  };
  const handleCloseError = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenError(false);
  };

  //photo functions
  const uploadImage = async () => {
    return new Promise((resolve, reject) => {
      const config = {
        headers: {
          "content-type": "multipart/form-data",
        },
      };
      const formTokenData = new FormData();
      formTokenData.append("image", tokenphoto, communityToken.TokenSymbol);
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
    });
  };

  const handleNextStep = () => {
    if ((page === 1 && validateFirstPage()) || page === 2 || (page === 3 && validateThirdPage())) {
      setPage(page + 1);
    }
  };

  return (
    <Modal
      className={classes.root}
      size="medium"
      isOpen={props.open}
      onClose={props.handleClose}
      showCloseIcon
    >
      <div>
        {openSignRequestModal && (
          <SignatureRequestModal
            open={openSignRequestModal}
            address={user.address}
            transactionFee="0.0000"
            detail={signRequestModalDetail}
            handleOk={handleCreateCommunityToken}
            handleClose={() => setOpenSignRequestModal(false)}
          />
        )}
        {page === 0 ? (
          <div className={classes.firstPage}>
            <h1>👛</h1>
            <h3>Create Community Token</h3>
            <div className={classes.label}>Generate a token for your Community and see it grow!</div>

            <PrimaryButton onClick={() => setPage(1)} size="medium">
              Get started
            </PrimaryButton>
          </div>
        ) : requestAssistance ? (
          <RequestAssistance
            communityToken={communityToken}
            setCommunityToken={setCommunityToken}
            setRequestAssistance={setRequestAssistance}
            setTokenPhoto={setTokenPhoto}
            tokenList={tokenList}
            handleRefresh={props.handleRefresh}
            handleClose={props.handleClose}
          />
        ) : (
          <div className={classes.content}>
            <Box display="flex" alignItems="center" marginBottom="34px" justifyContent="space-between">
              <h5 style={{ margin: 0 }}>{`Create Community Token`}</h5>
              <Box display="flex" alignItems="center" mr={2}>
                <label style={{ margin: "0px 8px 0px", display: "initial", fontSize: "12px" }}>
                  Request
                  <br /> Assistance
                </label>
                <CustomSwitch checked={false} onChange={() => setRequestAssistance(true)} />
              </Box>
            </Box>
            <div className={classes.stepsBorder} />
            <div className={classes.steps}>
              {["General", "Funding Token", "Supply", "Vesting & Taxation"].map((tab, index) => (
                <div className={index + 1 <= page ? classes.selected : undefined} key={`tab-${index}`}>
                  <button onClick={handleNextStep}>{index + 1}</button>
                  <span>{tab}</span>
                </div>
              ))}
            </div>

            {page === 1 ? (
              <CreateCommunityTokenGeneralTab
                communityToken={communityToken}
                setCommunityToken={setCommunityToken}
                setTokenPhoto={setTokenPhoto}
              />
            ) : page === 2 ? (
              <CreateCommunityTokenFundingTokenTab
                communityToken={communityToken}
                setCommunityToken={setCommunityToken}
                tokenList={tokenList}
              />
            ) : page === 3 ? (
              <CreateCommunityTokenSupplyTab
                communityToken={communityToken}
                setCommunityToken={setCommunityToken}
              />
            ) : (
              <CreateCommunityTokenVestingTab
                communityToken={communityToken}
                setCommunityToken={setCommunityToken}
              />
            )}

            <div className={classes.buttons}>
              <SecondaryButton onClick={saveCommunity} size="medium">
                Save Progress
              </SecondaryButton>
              {page !== 4 ? (
                <PrimaryButton onClick={handleNextStep} size="medium">
                  Next <img src={require("assets/icons/arrow_right_white.png")} alt="next" />
                </PrimaryButton>
              ) : (
                <PrimaryButton onClick={handleOpenSignatureModal} size="medium" style={{ width: "auto" }}>
                  Submit Token Proposal
                </PrimaryButton>
              )}
            </div>
          </div>
        )}

        {openSuccess && (
          <AlertMessage
            key={Math.random()}
            message={successMsg}
            variant="success"
            onClose={handleCloseSuccess}
          />
        )}
        {openError && (
          <AlertMessage
            key={Math.random()}
            message={errorMsg}
            variant="error"
            onClose={handleCloseError}
          />
        )}
      </div>
    </Modal>
  );
}
