import React, { useEffect, useState } from "react";

import { Box } from "@material-ui/core";

import RequestAssistanceChatTab from "./components/ChatTab";
import CreateDAOTokenGeneralTab from "../components/GeneralTab";
import RequestAssistanceTokenTokenomicsTab from "./components/TokenomicsTab";
import { useTypedSelector } from "store/reducers/Reducer";
import URL from "shared/functions/getURL";
import axios from "axios";
import AlertMessage from "shared/ui-kit/Alert/AlertMessage";
import { DAOButton } from "components/PriviDAO/components/DAOButton";
import CustomSwitch from "shared/ui-kit/CustomSwitch";
import { requesetAssistanceModalStyles } from "./index.styles";

export default function RequestAssistance({
  communityToken,
  setCommunityToken,
  setTokenPhoto,
  setRequestAssistance,
  requestAssistance,
  tokenList,
  handleRefresh,
  handleClose,
  isCreator,
}) {
  const [menuSelection, setMenuSelection] = useState<number>(0);
  const [status, setStatus] = useState<any>();
  const [tabs, setTabs] = useState<string[]>(["General", "Tokenomics", "Chat"]);

  const user = useTypedSelector(state => state.user);
  const classes = requesetAssistanceModalStyles();

  useEffect(() => {
    if (communityToken.Offers && communityToken.Offers.length > 0) {
      if (isCreator) {
        setTabs(["General", "Tokenomics", "Chat"]);
      } else {
        setTabs(["Tokenomics", "Chat"]);
      }
    } else {
      setTabs(["General", "Tokenomics"]);
    }
  }, []);

  const validateFirstPage = () => {
    if (!(communityToken.TokenName.length >= 5)) {
      setStatus({
        msg: "Name field invalid. Minimum 5 characters required.",
        key: Math.random(),
        variant: "error",
      });
      return false;
    } else if (
      !communityToken.TokenSymbol ||
      communityToken.TokenSymbol === "" ||
      communityToken.TokenSymbol.length < 3 ||
      communityToken.TokenSymbol.length > 6
    ) {
      setStatus({
        msg: "Token Symbol field invalid. Between 3 and 6 characters required.",
        key: Math.random(),
        variant: "error",
      });
      return false;
    } else return true;
  };

  const validateSecondPage = () => {
    if (!communityToken.Offers || communityToken.Offers.length === 0) {
      setStatus({
        msg: "No assistances",
        key: Math.random(),
        variant: "error",
      });

      return false;
    }

    return true;
  };

  const validateCommunityTokeninfo = () => {
    if (validateFirstPage() && validateSecondPage()) {
      return true;
    } else {
      setStatus({
        msg: "Error when validating. Please check all the fields",
        key: Math.random(),
        variant: "error",
      });

      return false;
    }
  };

  const saveCommunity = () => {
    if (validateCommunityTokeninfo()) {
      // constructing body
      let body = { ...communityToken }; // copy from community
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
              handleRefresh();
              handleClose();
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

  return (
    <Box color="white" fontSize="18px" className={classes.content}>
      <Box display="flex" alignItems="center" mb={3}>
        {tabs.map((name, index) => (
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

      {isCreator && (
        <Box mb={3}>
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
      )}

      {menuSelection === 0 && isCreator ? (
        <CreateDAOTokenGeneralTab
          setTokenPhoto={setTokenPhoto}
          communityToken={communityToken}
          setCommunityToken={setCommunityToken}
        />
      ) : menuSelection === 1 || (menuSelection === 0 && !isCreator) ? (
        <RequestAssistanceTokenTokenomicsTab
          communityToken={communityToken}
          setCommunityToken={setCommunityToken}
          tokenList={tokenList}
          isCreator={isCreator}
          setTokenPhoto={setTokenPhoto}
        />
      ) : (
        <RequestAssistanceChatTab
          communityToken={communityToken}
          setCommunityToken={setCommunityToken}
          isCreator={true}
        />
      )}
      <Box display="flex" justifyContent="space-between" mt={5}>
        {menuSelection > 0 ? (
          <DAOButton
            onClick={() => {
              setMenuSelection(menuSelection - 1);
            }}
          >
            Back
          </DAOButton>
        ) : (
          <div />
        )}
        {menuSelection < tabs.length - 1 && (
          <DAOButton
            onClick={() => {
              setMenuSelection(menuSelection + 1);
            }}
          >
            Next
          </DAOButton>
        )}
        {menuSelection === tabs.length - 1 && (
          <DAOButton
            onClick={() => {
              saveCommunity();
            }}
          >
            Save Progress
          </DAOButton>
        )}
      </Box>
      {status ? <AlertMessage message={status.msg} variant={status.variant} /> : ""}
    </Box>
  );
}
