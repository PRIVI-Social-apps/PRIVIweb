import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import { makeStyles } from "@material-ui/core/styles";
import React from "react";
import { TabNavigation } from "shared/ui-kit";
import { UserInfo } from "store/actions/UsersInfo";
import { ParticipantlistItem } from "./ParticipantlistItem";

type ParticipantModalProps = {
  isOpen: boolean;
  onClose: () => void;
  streamers: UserInfo[];
  moderates: UserInfo[];
  viewers: UserInfo[];
};

export const ParticipantModal: React.FunctionComponent<ParticipantModalProps> = ({
  isOpen,
  onClose,
  streamers: participants,
  moderates,
  viewers,
}) => {
  const classes = useStyles();
  const [value, setValue] = React.useState(0);
  const tabOptions = ["Participants", "Moderators", "Viewers"];

  const handleChange = (newValue) => {
    setValue(newValue);
  };

  function tabPanel(value) {
    let datas: UserInfo[] = [];
    if (value == 0) datas = participants;
    else if (value == 1) datas = moderates;
    else if (value == 2) datas = viewers;

    return (
      <div className={classes.listContainer}>
        {datas.map(user => (
          <ParticipantlistItem key={user.id} user={user} />
        ))}
      </div>
    );
  }

  return (
    <Dialog onClose={onClose} open={isOpen} className={classes.root} maxWidth={"lg"}>
      <DialogContent>
        <TabNavigation
          tabs={tabOptions}
          currentTab={value}
          variant="primary"
          onTabChange={handleChange}
        />
        {tabPanel(value)}
      </DialogContent>
    </Dialog>
  );
};

const useStyles = makeStyles(theme => ({
  root: {
    padding: "30px",
  },
  listContainer: {},
  indicatorStyle: {
    background: "#23D0C6",
  },
  tabGroup: {
    backgroundColor: "#fff",
  },
  tabHeader: {
    color: "#23D0C6",
    fontSize: "22px",
  },
}));
