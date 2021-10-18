import React, { useEffect, useState } from "react";
import { Modal, PrimaryButton, Gradient, SecondaryButton } from "shared/ui-kit";
import axios from "axios";

import { makeStyles, Theme, createStyles } from "@material-ui/core";

import URL from "shared/functions/getURL";
import { buildJsxFromObject } from "shared/functions/commonFunctions";
import { useTypedSelector } from "store/reducers/Reducer";
import CreateSocialTokenGeneralTab from "./components/GeneralTab";
import CreateSocialTokenFundingTokenTab from "./components/FundingTokenTab";
import CreateSocialTokenSupplyTab from "./components/SupplyTab";
import RequestAssistance from "./RequestAssistance";
import { SignatureRequestModal } from "shared/ui-kit/Modal/Modals";
import CustomSwitch from "shared/ui-kit/CustomSwitch";
import { getPriviWallet } from "shared/helpers";
import { signPayload } from "shared/services/WalletSign";
import AlertMessage from "shared/ui-kit/Alert/AlertMessage";
import Box from 'shared/ui-kit/Box';

export const useCreateTokenStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: "auto !important",
      "& > svg": {},
    },
    firstPage: {
      width: "490px",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      "& > img": {
        height: "50px",
        margin: "30px 0px 22px",
      },
      "& h3": {
        fontStyle: "normal",
        fontWeight: "normal",
        fontSize: "30px",
        margin: "0px 0px 10px",
      },
      "& span": {
        fontStyle: "normal",
        fontWeight: "normal",
        fontSize: "11px",
        textAlign: "left",
        color: "#707582",
        marginTop: "15px",
        marginBottom: "42px",
        width: "394px",
        paddingRight: "100px",
      },
    },
    label: {
      fontStyle: "normal",
      fontWeight: "normal",
      fontSize: "18px",
      marginBottom: "18px",
      color: "#707582",
      marginTop: "35px",
    },
    content: {
      width: "600px",
      display: "flex",
      flexDirection: "column",
      "& h5": {
        margin: "0px 0px 16px",
        fontStyle: "normal",
        fontWeight: "bold",
        fontSize: "18px",
        color: "#181818",
      },
      "& label": {
        fontStyle: "normal",
        fontWeight: "normal",
        fontSize: "18px",
        display: "flex",
        alignItems: "center",
        color: "#181818",
        "& img": {
          marginLeft: "8px",
        },
      },
      "& .MuiOutlinedInput-root": {
        width: "100%",
        height: 40,
      },
      "& .MuiOutlinedInput-input": {
        padding: "14px",
      },
      "& .MuiFormControl-root": {
        marginTop: "8px",
        width: "100%",
        marginBottom: "20px",
      },
    },
    stepsBorder: {
      borderBottom: "1.5px solid #707582",
      width: "calc(100% - 25px)",
      marginLeft: "10px",
      marginTop: "18px",
      marginBottom: "-18px",
    },
    steps: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      width: "100%",
      marginBottom: "22px",
      "& div": {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: "calc(100% / 4)",
        color: "#707582",
        fontWeight: "normal",
        fontSize: "14px",
      },

      "& button": {
        background: "#ffffff",
        border: "1.5px solid #707582",
        boxSizing: "border-box",
        color: "#707582",
        marginBlockEnd: "12px",
        width: "34px",
        height: "34px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 0,
        borderRadius: "50%",
        fontSize: "14px",
        fontWeight: "normal",
      },

      "& div:first-child": {
        alignItems: "flex-start",

        "& button": {
          marginLeft: "10px",
        },
      },

      "& div:nth-child(2)": {
        marginRight: "8%",
      },

      "& div:last-child": {
        alignItems: "flex-end",
        "& button": {
          marginRight: "15px",
        },
        "& span": {
          marginRight: "15px",
        },
      },
    },
    selected: {
      fontSize: "14px",
      lineHeight: "120%",
      color: "#181818",

      "& button": {
        background: Gradient.Mint,
        color: "white",
        border: "none",
      },
    },
    buttons: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      width: "100%",
      marginTop: "45px",
      "& button": {
        fontSize: "16px",
        "& img": {
          width: "12px",
        },
      },
    },
    select: {
      "& > div": {
        paddingBottom: "11px",
        minWidth: "364px",
      },
    },
    hashtags: {
      display: "flex",
      alignItems: "center",
      marginTop: "-5px",
      "& div": {
        cursor: "pointer",
        marginRight: "8px",
        background: "white",
        border: "1px solid #707582",
        color: "#707582",
        fontSize: "14.5px",
        padding: "7px 12px 6px",
        borderRadius: "36px",
        "&.selected": {
          color: "white",
          borderColor: "black",
          background: "black",
        },
      },
      "& img": {
        marginLeft: "7px",
        width: "18px",
        height: "18px",
        cursor: "pointer",
      },
    },
    inputsRow: {
      display: "flex",
      alignItems: "center",
      "& div": {
        display: "flex",
        flexDirection: "column",
      },
      "& > :nth-child(2)": {
        width: "30%",
      },
      "& > :first-child": {
        marginRight: "18px",
        width: "70% !important",
      },
      "& input": {
        width: "100%",
      },
    },
    inputSelectorRow: {
      display: "flex",
      alignItems: "flex-end",
      marginBottom: "45px",
      "& > .MuiPaper-rootdiv": {
        display: "flex",
        flexDirection: "column",
      },
      "& > :nth-child(2)": {
        width: "20%",
      },
      "& > :first-child": {
        marginRight: "18px",
        width: "80% !important",
      },
      "& input": {
        width: "100%",
      },
      "& .MuiFormControl-root": {
        marginBottom: "16px",
        "& > div": {
          height: "44px",
          "& > div": {
            padding: "10px",
          },
        },
      },
    },
    add: {
      display: "flex",
      alignItems: "center",
      cursor: "pointer",
      "& img": {
        marginLeft: "10px",
        marginRight: "10px",
        width: "10px",
        height: "10px",
      },
      "& span": {
        background: Gradient.Mint,
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        fontSize: "14px",
      },
    },
    radioGroup: {
      display: "flex",
      width: "100%",
      flexDirection: "row",
      marginBottom: "45px",
      alignItems: "center",
      fontSize: 14,
      "& .Mui-checked": {
        color: "#181818",
        "& ~ .MuiFormControlLabel-label": {
          color: "#181818",
        },
      },
    },
    infoMessage: {
      margin: "-20px 0px 25px",
      display: "flex",
      alignItems: "center",
      width: "100%",
      padding: "16px 23px 17px 17px",
      fontStyle: "normal",
      fontWeight: "normal",
      fontSize: "18px",
      color: "#707582",
      borderRadius: "6px",
      border: "1px solid #E0E4F3",
      "& img": {
        marginRight: "16px",
        width: "18px",
        height: "18px",
      },
      "& p": {
        margin: 0,
      },
    },
    dragImageHereImgTitleDesc: {
      borderRadius: 7,
      cursor: "pointer",
      alignItems: "center",
      width: "100%",
      flex: 1,
      display: "flex",
      justifyContent: "center",
      border: "1px dashed #b6b6b6",
      boxSizing: "border-box",
      padding: "40px 20px",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
      backgroundSize: "contain",
      backgroundColor: "#F7F9FE",
    },
    dragImageHereLabelImgTitleDesc: {
      fontWeight: 400,
      color: "#99a1b3",
      fontSize: "18px",
      marginLeft: 18,
    },
  })
);

export default function CreateSocialTokenModal(props) {
  //REDUX
  const user = useTypedSelector(state => state.user);

  //HOOKS
  const classes = useCreateTokenStyles();

  const [page, setPage] = useState(0);
  const [requestAssistance, setRequestAssistance] = useState(false);

  //general info
  const [tokenList, setTokenList] = useState<any[]>([]);

  const [openSignRequestModal, setOpenSignRequestModal] = useState<boolean>(false);
  const [signRequestModalDetail, setSignRequestModalDetail] = useState<any>(null);
  const [socialToken, setSocialToken] = useState<any>({
    Network: 'PRIVI'
  });

  const [status, setStatus] = React.useState<any>();

  const handleOpenSignatureModal = () => {
    if (validateSocialTokenInfo()) {
      setSignRequestModalDetail(buildJsxFromObject(socialToken));
      setOpenSignRequestModal(true);
    }
  };

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
          setStatus({
            msg: "Error uploading photo",
            key: Math.random(),
            variant: "error",
          });
        });
      //upload token symbol image
      axios
        .post(`${URL()}/wallet/changeTokenPhoto`, formTokenData, config)
        .then(response => {
          let body = { dimensions: socialToken.tokenDimensions ?? socialToken.dimensions, id: tokenSymbol };
          axios.post(`${URL()}/wallet/updateTokenPhotoDimensions`, body).catch(error => {
            setStatus({
              msg: "Error uploading photo",
              key: Math.random(),
              variant: "error",
            });
          });
          resolve(true);
        })
        .catch(error => {
          setStatus({
            msg: "Error uploading photo",
            key: Math.random(),
            variant: "error",
          });
          resolve(true);
        });
    });
  };

  const validateSocialTokenInfo = () => {
    if (!(socialToken.TokenName.length >= 5)) {
      setStatus({
        msg: "Name field invalid. Minimum 5 characters required.",
        key: Math.random(),
        variant: "error",
      });
      return false;
    } else if (!(socialToken.TokenSymbol.length >= 3)) {
      setStatus({
        msg: "Token symbol field invalid. Minimum 3 characters required.",
        key: Math.random(),
        variant: "error",
      });
      return false;
    } else if (!(socialToken.Description.length >= 20)) {
      setStatus({
        msg: "Description field invalid. Minimum 20 characters required",
        key: Math.random(),
        variant: "error",
      });
      return false;
    } else if (!socialToken.FundingToken) {
      setStatus({
        msg: "Funding Token field invalid",
        key: Math.random(),
        variant: "error",
      });
      return false;
    } else if (!socialToken.TradingSpread) {
      setStatus({
        msg: "Trading Spread field invalid",
        key: Math.random(),
        variant: "error",
      });
      return false;
    } else if (Number(socialToken.TradingSpread) < 0.1 || Number(socialToken.TradingSpread) > 20) {
      setStatus({
        msg: "Trading Spread must be between 0.1% - 20%",
        key: Math.random(),
        variant: "error",
      });
      return false;
    } else if (!socialToken.TargetSupply || Number(socialToken.TargetSupply) < 0) {
      setStatus({
        msg: "Target Supply field invalid. Musn't be filled and greater than 0",
        key: Math.random(),
        variant: "error",
      });
      return false;
    } else if (!socialToken.TargetSupply || Number(socialToken.TargetPrice) < 0) {
      setStatus({
        msg: "Target Price field invalid. Must be filled and greater than 0",
        key: Math.random(),
        variant: "error",
      });
      return false;
    } else if (!socialToken.InitialSupply || Number(socialToken.InitialSupply) < 0) {
      setStatus({
        msg: "Initial Supply field invalid. Must be filled and greater than 0",
        key: Math.random(),
        variant: "error",
      });
      return false;
    } else if (Number(socialToken.InitialSupply) > Number(socialToken.TargetSupply)) {
      setStatus({
        msg: "Initial Supply must be greater than 0 and smaller or equal to the Target Supply",
        key: Math.random(),
        variant: "error",
      });
      return false;
    } else if (!socialToken.AMM || socialToken.AMM === "") {
      setStatus({
        msg: "Price Direction is invalid. Must select one",
        key: Math.random(),
        variant: "error",
      });
      return false;
    } else {
      return true;
    }
  };

  const handleCreateSocialToken = async () => {
    const payload = {
      AMM: socialToken.AMM.toUpperCase(),
      TokenName: socialToken.TokenName,
      TokenSymbol: socialToken.TokenSymbol,
      FundingToken: socialToken.FundingToken,
      InitialSupply: Number(socialToken.InitialSupply),
      TargetSupply: Number(socialToken.TargetSupply),
      TargetPrice: Number(socialToken.TargetPrice),
      TradingSpread: Number(socialToken.TradingSpread) / 100,
    };

    const { address, privateKey } = await getPriviWallet();

    const { signature } = await signPayload("createSocialToken", address, payload, privateKey);
    const requestData = {
      Function: "createSocialToken",
      Address: user.address,
      Signature: signature,
      Payload: payload,
    };
    const body = {
      Data: requestData,
      AddtionalData: {
        dimensions: socialToken.dimensions,
        HasPhoto: socialToken.photo ? true : false,
        Description: socialToken.Description || "",
      },
    };
    axios.post(`${URL()}/social/createSocialToken/v2`, body).then(async response => {
      const resp = response.data;
      if (resp.success) {
        if (socialToken.photo) await uploadImage(resp.data.id, socialToken.TokenSymbol);
        setTimeout(() => {
          props.handleRefresh();
          props.handleClose();
        }, 1000);
        setStatus({
          msg: "Social token Created!",
          key: Math.random(),
          variant: "success",
        });
      } else {
        setStatus({
          msg: "social token creation failed",
          key: Math.random(),
          variant: "error",
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

  return (
    <>
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
              handleOk={handleCreateSocialToken}
              handleClose={() => setOpenSignRequestModal(false)}
            />
          )}
          {page === 0 ? (
            <div className={classes.firstPage}>
              <img src={require("assets/emojiIcons/purse.png")} alt="purse" />
              <h3>Create Social Token</h3>
              <div className={classes.label}>Generate you own token and see it grow!</div>

              <PrimaryButton onClick={() => setPage(1)} size="medium">
                Get started
              </PrimaryButton>
            </div>
          ) : requestAssistance ? (
            <RequestAssistance
              socialToken={socialToken}
              setSocialToken={setSocialToken}
              setRequestAssistance={setRequestAssistance}
              tokenList={tokenList}
              handleRefresh={props.handleRefresh}
              handleClose={props.handleClose}
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
                  <CustomSwitch checked={false} onChange={() => setRequestAssistance(true)} />
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
                  communityToken={socialToken}
                  setCommunityToken={setSocialToken}
                  tokenList={tokenList}
                />
              ) : (
                <CreateSocialTokenSupplyTab socialToken={socialToken} setSocialToken={setSocialToken} />
              )}

              <div className={classes.buttons}>
                <SecondaryButton size="medium">Save Progress</SecondaryButton>
                {page !== 3 ? (
                  <PrimaryButton
                    onClick={() => {
                      setPage(page + 1);
                    }}
                    size="medium"
                  >
                    Next <img src={require("assets/icons/arrow_right_white.png")} alt="next" />
                  </PrimaryButton>
                ) : (
                  <PrimaryButton onClick={handleOpenSignatureModal} size="medium" style={{ width: "auto" }}>
                    Create Social Token
                  </PrimaryButton>
                )}
              </div>
            </div>
          )}
        </div>
      </Modal>
      {status && (
        <AlertMessage
          key={status.key}
          message={status.msg}
          variant={status.variant}
          onClose={() => setStatus(undefined)}
        />
      )}
    </>
  );
}
