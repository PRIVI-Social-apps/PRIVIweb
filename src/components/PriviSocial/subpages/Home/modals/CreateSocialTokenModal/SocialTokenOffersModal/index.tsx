import { createStyles, makeStyles } from "@material-ui/core";
import React, { useState } from "react";
import { TabNavigation } from "shared/ui-kit";
import RequestAssistanceChatTab from "../RequestAssistance/components/ChatTab";
import RequestAssistanceTokenOffersTab from "../RequestAssistance/components/OffersTab";
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

export default function SocialTokenOffersModal({
  socialToken,
  setSocialToken,
  setTokenPhoto,
  setRequestAssistance,
  tokenList,
  handleRefresh,
  handleClose,
}) {
  const classes = useStyles();
  const classesCommunity = useCreateTokenStyles();
  const [menuSelection, setMenuSelection] = useState<number>(0);
  const [status, setStatus] = useState<any>();
  const [tabs, setTabs] = useState<string[]>(["Offers", "Chat"]);

  return (
    <>
      <div className={classes.appbarContainer}>
        <TabNavigation
          tabs={tabs}
          currentTab={menuSelection}
          variant="primary"
          size="large"
          theme="green"
          onTabChange={setMenuSelection}
        />
      </div>

      <div className={classesCommunity.content}>
        {menuSelection === 0 ? (
          <RequestAssistanceTokenOffersTab setRequestAssistance={setRequestAssistance} />
        ) : (
          <RequestAssistanceChatTab
            socialToken={socialToken}
            setSocialToken={setSocialToken}
            isCreator={true}
          />
        )}
      </div>
    </>
  );
}
