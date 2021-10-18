import React, { useState, useEffect } from "react";
import { createStyles, makeStyles, Box } from "@material-ui/core";
import { Modal } from "shared/ui-kit";
import ReviewDAOTokenTokenomicsTab from "./components/TokenomicsTab";
import RequestAssistanceChatTab from "../CreateDAOToken/RequestAssistance/components/ChatTab";
import Axios from "axios";
import URL from "shared/functions/getURL";
import { DAOButton } from "components/PriviDAO/components/DAOButton";
import AlertMessage from "shared/ui-kit/Alert/AlertMessage";

//This modal is opened when an offer to help with the assistance is accepted
//This modal can be opened both by the creator of the community token and the assistant
//-if it is opened by the creator, they will only check the fields
//-it it is opened by the assistant, they can edit the fields

export const useReviewDAOTokenStyles = makeStyles(() =>
  createStyles({
    root: {
      width: "640px !important",
      color: "white",
      fontSize: "16px",
    },
    content: {
      width: "100%",
      display: "flex",
      "& label": {
        fontStyle: "normal",
        fontWeight: "normal",
        fontSize: "18px",
        display: "flex",
        alignItems: "center",
        color: "white",
        "& img": {
          marginLeft: "4px",
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
      color: "white",
      "& *": {
        color: "white",
        fontFamily: "Agrandir",
      },
    },

    validateInput: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      marginTop: "8px",
      background: "rgba(255, 255, 255, 0.16)",
      border: "1px solid #FFFFFF",
      boxSizing: "border-box",
      color: "white",
      fontSize: "14px",
      width: "100%",
      height: "46px",
      minHeight: "46px",
      paddingRight: "8px",
      marginBottom: "16px",
      "& input": {
        width: "100%",
        border: "none",
        bakground: "transparent",
        margin: 0,
        padding: "16px",
      },
      "& .MuiInputBase-root": {
        padding: 0,
        background: "transparent",
        margin: 0,
      },
    },

    validateSelector: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      marginTop: "8px",
      background: "rgba(255, 255, 255, 0.16)",
      border: "1px solid #FFFFFF",
      boxSizing: "border-box",
      color: "white",
      fontSize: "14px",
      marginBottom: "16px",
      width: "100%",
      paddingRight: "8px",

      "& .MuiFormControl-root": {
        width: "100%",
        padding: "16px",
      },
      "& div": {
        border: "none !important",
      },
      "& .MuiSelect-selectMenu": {
        background: "transparent",
        padding: "0px !important",
        color: "white !important",
      },
    },
  })
);

export default function ReviewDAOTokenModal({ isCreator, open, handleClose, token }) {
  const classes = useReviewDAOTokenStyles();

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
    <Modal
      className={classes.root}
      size="medium"
      isOpen={open}
      onClose={handleClose}
      showCloseIcon
      theme="dark"
    >
      <Box display="flex" alignItems="center" mb={3}>
        {["Tokenomics", "Chat"].map((name, index) => (
          <Box
            color={index === menuSelection ? "white" : "#707582"}
            fontSize="30px"
            key={name}
            onClick={() => setMenuSelection(index)}
            mr={3}
            style={{ cursor: "pointer" }}
          >
            {name}
          </Box>
        ))}
      </Box>
      {menuSelection === 0 ? (
        <ReviewDAOTokenTokenomicsTab
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
        <>
          <Box display="flex" alignItems="center" justifyContent="space-between" mt={6}>
            <DAOButton onClick={handleClose}>Back</DAOButton>
            <DAOButton onClick={saveChanges}>Save as work in progress</DAOButton>
          </Box>
          {isCreator && (
            <Box mt={6} display="flex" justifyContent="flex-end">
              <DAOButton onClick={submitCommunityTokenProposal}>Submit Community Token Proposal</DAOButton>
            </Box>
          )}
        </>
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
