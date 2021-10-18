import React, { useEffect, useState, useRef } from "react";
import { Modal } from "shared/ui-kit";
import axios from "axios";
import URL from "shared/functions/getURL";
import { buildJsxFromObject } from "shared/functions/commonFunctions";
import { useTypedSelector } from "store/reducers/Reducer";
import CreateSocialTokenGeneralTab from "./components/GeneralTab";
import CreateSocialTokenFundingTokenTab from "./components/FundingTokenTab";
import CreateSocialTokenSupplyTab from "./components/SupplyTab";
import RequestAssistance from "./RequestAssistance";
import { SignatureRequestModal } from "shared/ui-kit/Modal/Modals";
import CustomSwitch from "shared/ui-kit/CustomSwitch";
import Box from "shared/ui-kit/Box";
import { useCreateTokenStyles } from "./index.styles";
import { SocialPrimaryButton, SocialSecondaryButton } from "components/PriviSocial/index.styles";
import { useAlertMessage } from "shared/hooks/useAlertMessage";
import {createSocialToken, ICreateSocialToken, getCryptosRateAsList} from "shared/services/API";

export default function CreateSocialTokenModal({ handleRefresh, handleClose, open }) {
  //REDUX
  const user = useTypedSelector(state => state.user);

  //HOOKS
  const classes = useCreateTokenStyles();
  const { showAlertMessage } = useAlertMessage();

  const [page, setPage] = useState(0);
  const [requestAssistance, setRequestAssistance] = useState(false);

  //general info
  const [tokenList, setTokenList] = useState<any[]>([]);

  const [socialToken, setSocialToken] = useState<any>({
    Network: "PRIVI",
  });

  const payloadRef = useRef<ICreateSocialToken>();
  const [openSignRequestModal, setOpenSignRequestModal] = useState<boolean>(false);
  const [signRequestModalDetail, setSignRequestModalDetail] = useState<any>(null);

  //photo functions
  const uploadImage = async (tokenId, tokenSymbol) => {
    return new Promise((resolve, reject) => {
      const formData = new FormData();
      formData.append("image", socialToken.photo, tokenId);
      const formTokenData = new FormData();
      formTokenData.append("image", socialToken.photo, tokenSymbol);
      const config = {
        headers: {
          "content-type": "multipart/form-data",
        },
      };
      axios
        .post(`${URL()}/social/changeSocialTokenPhoto`, formTokenData, config)
        .then(response => {
          resolve(true);
        })
        .catch(error => {
          resolve(true);
          console.log(error);
          showAlertMessage(`Error uploading photo`, { variant: "error" })
        });
      //upload token symbol image
      axios
        .post(`${URL()}/wallet/changeTokenPhoto`, formTokenData, config)
        .then(response => {
          let body = { dimensions: socialToken.tokenDimensions ?? socialToken.dimensions, id: tokenSymbol };
          axios.post(`${URL()}/wallet/updateTokenPhotoDimensions`, body).catch(error => {
            showAlertMessage(`Error uploading photo`, { variant: "error" })
          });
          resolve(true);
        })
        .catch(error => {
          showAlertMessage(`Error uploading photo`, { variant: "error" })
          resolve(true);
        });
    });
  };

  const validateSocialTokenInfo = () => {
    if (!(socialToken.TokenName.length >= 5)) {
      showAlertMessage(`Name field invalid. Minimum 5 characters required`, { variant: "error" })
      return false;
    } else if (!(socialToken.TokenSymbol.length >= 3)) {
      showAlertMessage(`Token symbol field invalid. Minimum 3 characters required`, { variant: "error" })
      return false;
    } else if (!(socialToken.Description.length >= 20)) {
      showAlertMessage(`Description field invalid. Minimum 20 characters required`, { variant: "error" })
      return false;
    } else if (!socialToken.FundingToken) {
      showAlertMessage(`Funding Token field invalid`, { variant: "error" })
      return false;
    } else if (!socialToken.TradingSpread) {
      showAlertMessage(`Trading Spread field invalid`, { variant: "error" })
      return false;
    } else if (Number(socialToken.TradingSpread) < 0.1 || Number(socialToken.TradingSpread) > 20) {
      showAlertMessage(`Trading Spread must be between 0.1% - 20%`, { variant: "error" })
      return false;
    } else if (!socialToken.TargetSupply || Number(socialToken.TargetSupply) < 0) {
      showAlertMessage(`Target Supply field invalid. Musn't be filled and greater than 0`, { variant: "error" })
      return false;
    } else if (!socialToken.TargetSupply || Number(socialToken.TargetPrice) < 0) {
      showAlertMessage(`Target Price field invalid. Must be filled and greater than 0`, { variant: "error" })
      return false;
    } else if (!socialToken.InitialSupply || Number(socialToken.InitialSupply) < 0) {
      showAlertMessage(`Initial Supply field invalid. Must be filled and greater than 0`, { variant: "error" })
      return false;
    } else if (Number(socialToken.InitialSupply) > Number(socialToken.TargetSupply)) {
      showAlertMessage(`Initial Supply must be greater than 0 and smaller or equal to the Target Supply`, { variant: "error" })
      return false;
    } else if (!socialToken.AMM || socialToken.AMM === "") {
      showAlertMessage("Price Direction is invalid. Must select one", { variant: "error" })
      return false;
    } else {
      return true;
    }
  };

  const handleOpenSignatureModal = () => {
    if (validateSocialTokenInfo()) {
      const payload: ICreateSocialToken = {
        AMM: socialToken.AMM.toUpperCase(),
        TokenName: socialToken.TokenName,
        TokenSymbol: socialToken.TokenSymbol,
        FundingToken: socialToken.FundingToken,
        InitialSupply: Number(socialToken.InitialSupply),
        TargetSupply: Number(socialToken.TargetSupply),
        TargetPrice: Number(socialToken.TargetPrice),
        TradingSpread: Number(socialToken.TradingSpread) / 100,
        TokenChain: "Privi"
      };
      payloadRef.current = payload;
      setSignRequestModalDetail(buildJsxFromObject(payload));
      setOpenSignRequestModal(true);
    }
  }

  const handleCreateSocialToken = async () => {
    const payload = payloadRef.current;
    if (payload) {
      const additionalData = {
        dimensions: socialToken.dimensions,
        HasPhoto: socialToken.photo ? true : false,
        Description: socialToken.Description || "",
      }
      const resp = await createSocialToken(payload, additionalData);
      if (resp.success) {
        const id = resp.data?.id;
        if (socialToken.photo && id) await uploadImage(resp.data.id, socialToken.TokenSymbol);
        setTimeout(() => {
          handleRefresh();
          handleClose();
        }, 1000);
        showAlertMessage(`Social token created`, { variant: "success" })
      } 
      else showAlertMessage(`Social token creation failed`, { variant: "error" })
    }
  };

  // get token list from backend
  useEffect(() => {
    if (open === true) {
      try {
        getCryptosRateAsList().then(data => {
          const tokenList: any[] = [];
          data.forEach(rateObj => {
            tokenList.push(rateObj.token);
          });
          setTokenList(tokenList);
        });
      } 
      catch (e) {
        showAlertMessage(`Failed getting token list ${e}`, { variant: "error" })
      }
    }
  }, [open]);

  return (
    <Modal
      className={classes.root}
      size="medium"
      isOpen={open}
      onClose={() => {
        handleClose();
      }}
      showCloseIcon
    >
      <div>
        {openSignRequestModal && (
          <SignatureRequestModal
            open={openSignRequestModal}
            address={user.address}
            transactionFee="0.0000"
            detail={signRequestModalDetail}
            handleOk={handleCreateSocialToken}
            handleClose={() => {
              setOpenSignRequestModal(false);
            }}
          />
        )}
        {page === 0 ? (
          <div className={classes.firstPage}>
            <img src={require("assets/emojiIcons/money_face.png")} alt="money face" />
            <h3>Create Social Token</h3>
            <div className={classes.label}>Generate you own token and see it grow!</div>

            <SocialPrimaryButton onClick={() => setPage(1)}>Get started</SocialPrimaryButton>

            <div className={classes.divider} />
            <div className={classes.dividerText}>Aready have one?</div>

            <SocialSecondaryButton>Import token</SocialSecondaryButton>
          </div>
        ) : requestAssistance ? (
          <RequestAssistance
            socialToken={socialToken}
            setSocialToken={setSocialToken}
            setRequestAssistance={setRequestAssistance}
            tokenList={tokenList}
            handleRefresh={handleRefresh}
            handleClose={() => {
              setRequestAssistance(false);
            }}
          />
        ) : (
          <div className={classes.content}>
            <Box display="flex" alignItems="center" marginBottom="34px" justifyContent="space-between">
              <h5 style={{ margin: 0 }}>{`Create Social Token`}</h5>
              <Box display="flex" alignItems="center" mr={3}>
                <label style={{ margin: "0px 8px 0px", display: "initial", fontSize: "12px" }}>
                  Request
                  <br /> Assistance
                </label>
                <CustomSwitch theme="green" checked={false} onChange={() => setRequestAssistance(true)} />
              </Box>
            </Box>
            <div className={classes.stepsBorder} />
            <div className={classes.steps}>
              {["General", "Funding Token", "Supply"].map((tab, index) => (
                <div className={index + 1 <= page ? classes.selected : undefined} key={`tab-${index}`}>
                  <button onClick={() => setPage(index + 1)}>{index + 1}</button>
                  <span>{tab}</span>
                </div>
              ))}
            </div>

            {page === 1 ? (
              <CreateSocialTokenGeneralTab socialToken={socialToken} setSocialToken={setSocialToken} />
            ) : page === 2 ? (
              <CreateSocialTokenFundingTokenTab
                socialToken={socialToken}
                setSocialToken={setSocialToken}
                tokenList={tokenList}
              />
            ) : (
              <CreateSocialTokenSupplyTab socialToken={socialToken} setSocialToken={setSocialToken} />
            )}

            <div className={classes.buttons}>
              <SocialSecondaryButton>Save Progress</SocialSecondaryButton>
              {page !== 3 ? (
                <SocialPrimaryButton
                  onClick={() => {
                    setPage(page + 1);
                  }}
                >
                  Next{" "}
                  <img
                    style={{ marginLeft: "4px" }}
                    src={require("assets/icons/arrow_right_white.png")}
                    alt="next"
                  />
                </SocialPrimaryButton>
              ) : (
                <SocialPrimaryButton onClick={handleOpenSignatureModal} style={{ width: "auto" }}>
                  Create Social Token
                </SocialPrimaryButton>
              )}
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}
