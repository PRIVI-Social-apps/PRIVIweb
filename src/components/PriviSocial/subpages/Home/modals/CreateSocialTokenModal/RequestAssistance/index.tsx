import { createStyles, makeStyles } from "@material-ui/core";
import React, { useState } from "react";
import { TabNavigation } from "shared/ui-kit";
import RequestAssistanceChatTab from "./components/ChatTab";
import CreateSocialTokenGeneralTab from "../components/GeneralTab";
import RequestAssistanceTokenTokenomicsTab from "./components/TokenomicsTab";
import { useCreateTokenStyles } from "components/legacy/Profile/modals/CreateSocialTokenModal/index";
import { SocialPrimaryButton, SocialSecondaryButton } from "components/PriviSocial/index.styles";

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

      "& *": {
        textTransform: "capitalize",
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
    <>
      <div className={classes.appbarContainer}>
        <TabNavigation
          tabs={tabs}
          currentTab={menuSelection}
          variant="primary"
          size="large"
          onTabChange={setMenuSelection}
          theme="green"
        />
      </div>

      <div className={classesCommunity.content}>
        {menuSelection === 0 ? (
          <CreateSocialTokenGeneralTab socialToken={socialToken} setSocialToken={setSocialToken} />
        ) : menuSelection === 1 ? (
          <RequestAssistanceTokenTokenomicsTab
            socialToken={socialToken}
            setSocialToken={setSocialToken}
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
            <SocialSecondaryButton
              onClick={() => {
                setMenuSelection(menuSelection - 1);
              }}
            >
              Back
            </SocialSecondaryButton>
          ) : (
            <div />
          )}
          {menuSelection < tabs.length - 1 && (
            <SocialPrimaryButton
              onClick={() => {
                setMenuSelection(menuSelection + 1);
              }}
            >
              Next <img src={require("assets/icons/arrow_right_white.png")} alt="next" />
            </SocialPrimaryButton>
          )}
          {menuSelection === tabs.length - 1 && <SocialPrimaryButton>Save Progress</SocialPrimaryButton>}
        </div>
      </div>
    </>
  );
}
