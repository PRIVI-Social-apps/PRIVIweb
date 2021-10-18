import React, { useState } from "react";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import { TabNavigation } from "shared/ui-kit";
import RequestAssistanceTokenOfferBar from "../OfferBar";

const useStyles = makeStyles(() =>
  createStyles({
    root: {
      flexGrow: 1,
    },
    appbarContainer: {
      width: "100%",
      marginBottom: "20px",

      "& .MuiAppBar-root": {
        paddingLeft: "0 !important",
      },
      "& .MuiTab-root": {
        minWidth: "auto",
        padding: "0 !important",
      },
    },
  })
);

export default function RequestAssistanceTokenOffersTab({ setRequestAssistance }) {
  const classes = useStyles();
  const tabs = ["New offers", "Ongoing negociations"];
  const [selectedTab, setSelectedTab] = useState(0);

  const onTabChange = value => {
    setSelectedTab(value);
  };

  return (
    <div className={classes.root}>
      <div className={classes.appbarContainer}>
        <TabNavigation
          tabs={tabs}
          currentTab={selectedTab}
          variant="primary"
          showBorder={false}
          theme="green"
          onTabChange={onTabChange}
        />
      </div>
      {selectedTab == 0 ? (
        <RequestAssistanceTokenOfferBar variant="primary" />
      ) : (
        <RequestAssistanceTokenOfferBar variant="secondary" />
      )}
    </div>
  );
}
