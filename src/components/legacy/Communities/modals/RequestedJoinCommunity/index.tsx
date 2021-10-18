import { Dialog, makeStyles } from "@material-ui/core";
import axios from "axios";
import React from "react";
import { useSelector } from "react-redux";
import { Avatar, PrimaryButton, SecondaryButton } from "shared/ui-kit";
import { getUsersInfoList } from "store/selectors";

import URL from "shared/functions/getURL";
import { LoadingWrapper } from "shared/ui-kit/Hocs";

const useStyles = makeStyles(theme => ({
  container: {
    "& .MuiDialog-paperFullWidth": {
      padding: theme.spacing(2.5),
      borderRadius: theme.spacing(2),
    },
  },
  exit: {
    display: "flex",
    alignItems: "cener",
    justifyContent: "flex-end",
    marginBottom: theme.spacing(1),
  },
  content: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
    textAlign: "center",
  },
  imgContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: theme.typography.h2.fontSize,
    marginBottom: theme.spacing(2),
  },
  userInfo: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: "4px",
  },
  userName: {
    fontSize: 14,
    lineHeight: "104.5%",
    color: "black",
  },
  slugBox: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  userSlug: {
    fontSize: 11,
    lineHeight: "104.5%",
    background: "-webkit-linear-gradient(#FF79D1 100%, #DB00FF 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },
  fullDetailButton: {
    background: "-webkit-linear-gradient(#23D0C6 100%, #00CC8F 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    marginBottom: theme.spacing(2),
    cursor: "pointer",
  },
  title: {
    marginBottom: theme.spacing(1),
    fontSize: theme.typography.h4.fontSize,
  },
  description: {
    marginBottom: theme.spacing(2),
    textAlign: "center",
    color: "grey",
  },
  buttonsBox: {
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-around",
  },
  verifiedBox: {
    marginLeft: theme.spacing(0.5),
    width: theme.spacing(2.5),
    height: theme.spacing(2.5),
  },
  levelBox: {
    marginLeft: theme.spacing(0.5),
    padding: "4px 10px",
    borderRadius: theme.spacing(2),
    border: "1px solid grey",
    fontSize: 14,
  },
}));

const RequestedJoinCommunityModal = ({ open, userId, CommunityAddress, onCloseDialog }) => {
  const classes = useStyles();
  const users = useSelector(getUsersInfoList);

  const [user, setUser] = React.useState<any>();

  React.useEffect(() => {
    if (users && users.length > 0) {
      setUser(users.find(item => item.id === userId));
    }
  }, [users]);

  const onAccept = () => {
    const body = {
      userAddress: userId,
      communityAddress: CommunityAddress,
      accepted: true,
    };

    axios.post(`${URL()}/community/join`, body).then(res => {
      const resp = res.data;
      if (resp.success) {
        onCloseDialog();
      } else {
      }
    });
  };

  return (
    <Dialog open={open} maxWidth={"sm"} fullWidth className={classes.container}>
      <div className={classes.exit} onClick={onCloseDialog}>
        <img src={require("assets/icons/x_darkblue.png")} alt={"x"} />
      </div>
      <div className={classes.content}>
        <div className={classes.imgContainer}>
          <Avatar size="medium" url={`${user?.imageURL}`} />
        </div>
        <div className={classes.userInfo}>
          <div className={classes.userName}>{user?.name}</div>
          <div className={classes.slugBox}>
            <div className={classes.userSlug}>@{user?.urlSlug}</div>
            {user?.verified && user?.verified === true ? (
              <img src={require("assets/icons/verified.png")} alt={`tick`} className={classes.verifiedBox} />
            ) : null}
            <div className={classes.levelBox}>{`level ${user?.level ?? 1}`}</div>
          </div>
        </div>
        <div className={classes.description}></div>
        <div className={classes.fullDetailButton}>View Full Profile</div>
        <div className={classes.buttonsBox}>
          <SecondaryButton size="medium" onClick={onCloseDialog}>
            Decline
          </SecondaryButton>
          <PrimaryButton size="medium" onClick={onAccept}>
            Accept
          </PrimaryButton>
        </div>
      </div>
    </Dialog>
  );
};

export default RequestedJoinCommunityModal;
