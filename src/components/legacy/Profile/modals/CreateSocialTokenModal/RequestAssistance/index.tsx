import { createStyles, makeStyles, AppBar, Tabs, Tab } from "@material-ui/core";
import React, { useState } from "react";
import { Gradient, SecondaryButton, PrimaryButton, TabNavigation } from "shared/ui-kit";
import cls from "classnames";
import RequestAssistanceChatTab from "./components/ChatTab";
import CreateSocialTokenGeneralTab from "../components/GeneralTab";
import RequestAssistanceTokenTokenomicsTab from "./components/TokenomicsTab";
import { useCreateTokenStyles } from "components/legacy/Profile/modals/CreateSocialTokenModal/index";

const useStyles = makeStyles(() =>
  createStyles({
    appbarContainer: {
      width: "100%",
      marginBottom: "20px",

      "& .MuiAppBar-root": {
        paddingLeft: "0 !important",
      },
      "& .MuiTab-root": {
        minWidth: "auto",
      },
    },
  })
);

export default function RequestAssistance({
  socialToken,
  setSocialToken,
  setRequestAssistance,
  tokenList,
  handleRefresh,
  handleClose,
}) {
  const classes = useStyles();
  const classesCommunity = useCreateTokenStyles();
  const [menuSelection, setMenuSelection] = useState<number>(0);
  const [tabs, setTabs] = useState<string[]>(["General", "Tokenomics", "Chat"]);

  return (
    <div>
      <div className={classes.appbarContainer}>
        <TabNavigation
          tabs={tabs}
          currentTab={menuSelection}
          variant="primary"
          size="large"
          onTabChange={setMenuSelection}
        />
      </div>

      <div className={classesCommunity.content}>
        {menuSelection === 0 ? (
          <CreateSocialTokenGeneralTab socialToken={socialToken} setSocialToken={setSocialToken} />
        ) : menuSelection === 1 ? (
          <RequestAssistanceTokenTokenomicsTab
            communityToken={socialToken}
            setCommunityToken={setSocialToken}
            isCreator={true}
            tokenList={tokenList}
            setRequestAssistance={setRequestAssistance}
          />
        ) : (
          <RequestAssistanceChatTab
            socialToken={socialToken}
            setSocialToken={setSocialToken}
            isCreator={true}
          />
        )}
        <div className={classesCommunity.buttons}>
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
          {menuSelection === tabs.length - 1 && <PrimaryButton size="medium">Save Progress</PrimaryButton>}
        </div>
      </div>
    </div>
  );
}
