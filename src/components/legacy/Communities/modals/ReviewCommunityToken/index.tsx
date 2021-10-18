import React, { useState, useEffect } from "react";
import { createStyles, makeStyles, AppBar, Tabs, Tab } from "@material-ui/core";
import { Modal, PrimaryButton, Gradient, SecondaryButton } from "shared/ui-kit";
import cls from "classnames";
import ReviewCommunityTokenTokenomicsTab from "./components/TokenomicsTab";
import RequestAssistanceChatTab from "../CreateCommunityToken/RequestAssistance/components/ChatTab";
import Axios from "axios";
import URL from "shared/functions/getURL";
import AlertMessage from "shared/ui-kit/Alert/AlertMessage";

//This modal is opened when an offer to help with the assistance is accepted
//This modal can be opened both by the creator of the community token and the assistant
//-if it is opened by the creator, they will only check the fields
//-it it is opened by the assistant, they can edit the fields

export const useReviewCommunityTokenStyles = makeStyles(() =>
  createStyles({
    root: {
      width: "725px !important",
      "& h5": {
        margin: "0px 0px 45px",
        fontStyle: "normal",
        fontWeight: "bold",
        fontSize: "18px",
        color: "#181818",
      },
    },
    appbarContainer: {
      width: "100%",
      marginBottom: "61px",
    },
    appbar: {
      marginLeft: 0,
      backgroundColor: "transparent !important",
      boxShadow: "none !important",
      marginBottom: "-3px",
    },
    tabs: {
      marginLeft: 0,
      backgroundColor: "transparent !important",
      boxShadow: "none !important",
    },
    tab: {
      whiteSpace: "inherit",
      marginLeft: 0,
      color: "#abb3c4",
      boxShadow: "none !important",
      fontWeight: "bold",
      fontSize: "18px",
      fontFamily: "Agrandir",
      textTransform: "none",
      padding: "0px",
      minHeight: "auto !important",
      minWidth: "auto !important",
      marginRight: "38px",
    },
    selectedTab: {
      color: "transparent",
      background: Gradient.Mint,
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
    },
    buttons: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      "& button": {
        margin: "0px",
      },
    },
    content: {
      width: "680px",
      display: "flex",
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
      },
    },
    radioGroup: {
      display: "flex",
      width: "100%",
      flexDirection: "row",
      marginBottom: "45px",
      alignItems: "center",
      justifyContent: "space-between",
      "& .Mui-checked": {
        color: "#181818",
      },
    },

    validateInput: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      marginTop: "8px",
      background: "#F7F9FE",
      border: "1px solid #E0E4F3",
      boxSizing: "border-box",
      borderRadius: "6px",
      color: "#181818",
      fontSize: "14px",
      marginBottom: "16px",
      width: "100%",
      paddingRight: "8px",
      "& input": {
        width: "100%",
        border: "none",
        bakground: "transparent",
        margin: 0,
        padding: "11.5px 18px",
      },
    },

    validateSelector: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      marginTop: "8px",
      background: "white",
      border: "1px solid #C0C6DC",
      boxSizing: "border-box",
      borderRadius: "6px",
      color: "#181818",
      fontSize: "14px",
      marginBottom: "16px",
      width: "100%",
      paddingRight: "8px",

      "& .MuiFormControl-root": {
        width: "100%",
        padding: "11.5px 18px",
      },
      "& div": {
        border: "none !important",
      },
      "& .MuiSelect-selectMenu": {
        background: "transparent",
        padding: "0px !important",
        color: "#181818 !important",
      },
    },
  })
);

export default function ReviewCommunityTokenModal({ isCreator, open, handleClose, token }) {
  const classes = useReviewCommunityTokenStyles();

  const [menuSelection, setMenuSelection] = useState<number>(0);

  const [communityToken, setCommunityToken] = useState<any>();
  const [tokenList, setTokenList] = useState<string[]>([]);
  const [tokenPhoto, setTokenPhoto] = useState<any>();

  const [successMsg, setSuccessMsg] = useState<string>("");
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [openSuccess, setOpenSuccess] = useState(false);
  const [openError, setOpenError] = useState(false);

  useEffect(() => {
    if (token) {
      setCommunityToken(token);
    }
  }, [token]);

  // get token list from backend
  useEffect(() => {
    if (open === true) {
      Axios.get(`${URL()}/wallet/getCryptosRateAsList`).then(res => {
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
  }, [open]);

  const validateCommunityToken = () => {
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
    } else if (
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
    } else if (
      !communityToken.InitialPrice ||
      communityToken.InitialPrice === "" ||
      communityToken.TargetSupply <= 0 ||
      communityToken.InitialPrice > communityToken.TargetPrice
    ) {
      setErrorMsg("Initial Price field invalid. Value must be between 0 and Target Price");
      handleClickError();
      return false;
    } else return true;
  };

  const submitCommunityTokenProposal = () => {
    if (validateCommunityToken()) {
      //TODO: submit
      setSuccessMsg("Community token proposal succesfully created!");
      handleClickSuccess();
    }
  };

  const saveChanges = () => {
    //TODO: save
    setSuccessMsg("Community token changes succesfully saved!");
    handleClickSuccess();
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

  return (
    <Modal className={classes.root} size="medium" isOpen={open} onClose={handleClose} showCloseIcon>
      <div className={classes.appbarContainer}>
        <AppBar position="static" className={classes.appbar}>
          <Tabs
            TabIndicatorProps={{
              style: { background: Gradient.Mint, height: "3px" },
            }}
            value={menuSelection}
            className={classes.tabs}
            onChange={(e, value) => setMenuSelection(value)}
          >
            {["Tokenomics", "Chat"].map((name, index) => (
              <Tab
                className={cls({ [classes.selectedTab]: index === menuSelection }, classes.tab)}
                label={name}
                key={name}
              />
            ))}
          </Tabs>
        </AppBar>
      </div>
      {menuSelection === 0 ? (
        <ReviewCommunityTokenTokenomicsTab
          tokenList={tokenList}
          communityToken={communityToken}
          setCommunityToken={setCommunityToken}
          isCreator={isCreator}
          tokenPhoto={tokenPhoto}
          setTokenPhoto={setTokenPhoto}
        />
      ) : (
        <RequestAssistanceChatTab
          communityToken={communityToken}
          setCommunityToken={setCommunityToken}
          isCreator={isCreator}
        />
      )}
      {menuSelection === 0 && (
        <div className={classes.buttons}>
          <SecondaryButton size="medium" onClick={handleClose}>
            Back
          </SecondaryButton>
          <SecondaryButton size="medium" onClick={saveChanges}>
            Save as work in progress
          </SecondaryButton>
          {isCreator && (
            <PrimaryButton size="medium" onClick={submitCommunityTokenProposal}>
              Submit Community Token Proposal
            </PrimaryButton>
          )}
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
    </Modal>
  );
}
