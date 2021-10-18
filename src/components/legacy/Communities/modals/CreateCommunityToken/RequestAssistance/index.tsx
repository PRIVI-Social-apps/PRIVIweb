import React, { useEffect, useState } from "react";

import { AppBar, Tabs, Tab } from "@material-ui/core";
import { Gradient, SecondaryButton, PrimaryButton } from "shared/ui-kit";
import cls from "classnames";

import { requesetAssistanceModalStyles } from "./index.styles";
import RequestAssistanceChatTab from "./components/ChatTab";
import CreateCommunityTokenGeneralTab from "../components/GeneralTab";
import RequestAssistanceTokenTokenomicsTab from "./components/TokenomicsTab";
import { useTypedSelector } from "store/reducers/Reducer";
import URL from "shared/functions/getURL";
import axios from "axios";
import AlertMessage from "shared/ui-kit/Alert/AlertMessage";

export default function RequestAssistance({
  communityToken,
  setCommunityToken,
  setTokenPhoto,
  setRequestAssistance,
  tokenList,
  handleRefresh,
  handleClose,
}) {
  const classes = requesetAssistanceModalStyles();
  const [menuSelection, setMenuSelection] = useState<number>(0);
  const [status, setStatus] = useState<any>();
  const [tabs, setTabs] = useState<string[]>(["General", "Tokenomics", "Chat"]);

  const user = useTypedSelector(state => state.user);

  useEffect(() => {
    if (communityToken.Offers && communityToken.Offers.length > 0) {
      setTabs(["General", "Tokenomics", "Chat"]);
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
    <div>
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
            {tabs.map((name, index) => (
              <Tab
                className={cls({ [classes.selectedTab]: index === menuSelection }, classes.tab)}
                label={name}
                key={name}
              />
            ))}
          </Tabs>
        </AppBar>
      </div>

      <div className={classes.content}>
        {menuSelection === 0 ? (
          <CreateCommunityTokenGeneralTab
            setTokenPhoto={setTokenPhoto}
            communityToken={communityToken}
            setCommunityToken={setCommunityToken}
          />
        ) : menuSelection === 1 ? (
          <RequestAssistanceTokenTokenomicsTab
            communityToken={communityToken}
            setCommunityToken={setCommunityToken}
            setRequestAssistance={setRequestAssistance}
            tokenList={tokenList}
          />
        ) : (
          <RequestAssistanceChatTab
            communityToken={communityToken}
            setCommunityToken={setCommunityToken}
            isCreator={true}
          />
        )}
        <div className={classes.buttons}>
          {menuSelection > 0 ? (
            <SecondaryButton
              onClick={() => {
                setMenuSelection(menuSelection - 1);
              }}
              size="medium"
            >
              Back
            </SecondaryButton>
          ) : (
            <div />
          )}
          {menuSelection < tabs.length - 1 && (
            <PrimaryButton
              onClick={() => {
                setMenuSelection(menuSelection + 1);
              }}
              size="medium"
            >
              Next <img src={require("assets/icons/arrow_right_white.png")} alt="next" />
            </PrimaryButton>
          )}
          {menuSelection === tabs.length - 1 && (
            <PrimaryButton
              onClick={() => {
                saveCommunity();
              }}
              size="medium"
            >
              Save Progress
            </PrimaryButton>
          )}
        </div>
      </div>
      {status ? <AlertMessage message={status.msg} variant={status.variant} /> : ""}
    </div>
  );
}
