import React, { useEffect, useState, useRef } from "react";
import axios from "axios";

import { Box } from "@material-ui/core";

import { useCreateDAOTokenStyles } from "./index.styles";
import CreateDAOTokenGeneralTab from "./components/GeneralTab";
import CreateDAOTokenFundingTokenTab from "./components/FundingTokenTab";
import CreateDAOTokenSupplyTab from "./components/SupplyTab";
import CreateDAOTokenVestingTab from "./components/VestingTab";
import RequestAssistance from "./RequestAssistance";
import URL from "shared/functions/getURL";
import { Modal } from "shared/ui-kit";
import { useTypedSelector } from "store/reducers/Reducer";
import { buildJsxFromObject } from "shared/functions/commonFunctions";
import { SignatureRequestModal } from "shared/ui-kit/Modal/Modals";
import { ICreateCommunityToken, createCommunityToken } from "shared/services/API";
import CustomSwitch from "shared/ui-kit/CustomSwitch";
import { DAOButton } from "components/PriviDAO/components/DAOButton";
import AlertMessage from "shared/ui-kit/Alert/AlertMessage";

export default function CreateDAOTokenModal(props) {
  //REDUX
  const user = useTypedSelector(state => state.user);

  //HOOKS
  const classes = useCreateDAOTokenStyles();
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
  const handleCreateDAOToken = async () => {
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
      theme="dark"
    >
      <Box color="white" fontSize="18px">
        {openSignRequestModal && (
          <SignatureRequestModal
            theme="dark"
            open={openSignRequestModal}
            address={user.address}
            transactionFee="0.0000"
            detail={signRequestModalDetail}
            handleOk={handleCreateDAOToken}
            handleClose={() => setOpenSignRequestModal(false)}
          />
        )}
        {page === 0 ? (
          <Box display="flex" flexDirection="column" alignItems="center">
            <img src={require("assets/emojiIcons/purse.png")} alt="purse" width={50} height={42} />
            <Box mb={2} mt={2}>
              Create DAO Token
            </Box>
            <Box color="#707582" fontSize="14px" mb={2}>
              Generate a token for your DAO and see it grow!
            </Box>
            <Box>
              <DAOButton onClick={() => setPage(1)}>Get started</DAOButton>
            </Box>
          </Box>
        ) : requestAssistance ? (
          <RequestAssistance
            communityToken={communityToken}
            setCommunityToken={setCommunityToken}
            setRequestAssistance={setRequestAssistance}
            setTokenPhoto={setTokenPhoto}
            tokenList={tokenList}
            handleRefresh={props.handleRefresh}
            handleClose={props.handleClose}
            isCreator={true}
            requestAssistance={requestAssistance}
          />
        ) : (
          <div className={classes.content}>
            <Box fontSize="30px" mb={3}>{`Create DAO Token`}</Box>
            <Box display="flex" flexDirection="column" mb={3}>
              <Box mb={1} display="flex" alignItems="center">
                Request Assistance
                <img
                  src={require("assets/icons/info_white.png")}
                  alt="info"
                  width={12}
                  height={12}
                  style={{ marginLeft: "4px" }}
                />
              </Box>
              <Box mb={1} display="flex" alignItems="center">
                <CustomSwitch
                  checked={requestAssistance}
                  theme="dark"
                  onChange={() => setRequestAssistance(!requestAssistance)}
                />
                <Box fontSize="14px" ml={1}>
                  Yes/No
                </Box>
              </Box>
            </Box>
            <div className={classes.stepsBorder} />
            <div className={classes.steps}>
              {["General Info", "Funding Token", "Supply", "Vesting & Taxation"].map((tab, index) => (
                <div className={index + 1 <= page ? classes.selected : undefined} key={`tab-${index}`}>
                  <button onClick={handleNextStep}>{index + 1}</button>
                  <span>{tab}</span>
                </div>
              ))}
            </div>

            {page === 1 ? (
              <CreateDAOTokenGeneralTab
                communityToken={communityToken}
                setCommunityToken={setCommunityToken}
                setTokenPhoto={setTokenPhoto}
              />
            ) : page === 2 ? (
              <CreateDAOTokenFundingTokenTab
                communityToken={communityToken}
                setCommunityToken={setCommunityToken}
                tokenList={tokenList}
              />
            ) : page === 3 ? (
              <CreateDAOTokenSupplyTab
                communityToken={communityToken}
                setCommunityToken={setCommunityToken}
              />
            ) : (
              <CreateDAOTokenVestingTab
                communityToken={communityToken}
                setCommunityToken={setCommunityToken}
              />
            )}

            <Box display="flex" justifyContent="space-between" mt={5}>
              <DAOButton onClick={saveCommunity}>Save Progress</DAOButton>
              {page !== 4 ? (
                <DAOButton onClick={handleNextStep}>Next</DAOButton>
              ) : (
                <DAOButton onClick={handleOpenSignatureModal}>Submit Token Proposal</DAOButton>
              )}
            </Box>
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
      </Box>
    </Modal>
  );
}
