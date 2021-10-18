import { makeStyles } from "@material-ui/core/styles";
import { useUserConnections } from "shared/contexts/UserConnectionsContext";
import React from "react";
import { Avatar, SecondaryButton } from "shared/ui-kit";
import { UserInfo } from "store/actions/UsersInfo";

type ParticipantItemProps = {
  user: UserInfo;
};

export const ParticipantlistItem: React.FunctionComponent<ParticipantItemProps> = ({ user }) => {
  const { followUser, unfollowUser, isUserFollowed, chatWithUser } = useUserConnections();

  const classes = useStyles();

  return (
    <div>
      <div className={classes.root}>
        <Avatar url={user.imageURL} size="medium" />
        <div className={classes.nameContainer}>
          <p className={classes.nameText}>{user.name}</p>
          <p className={classes.tagText}>@{user.name.replace(/\s/g, "").toLowerCase()}</p>
        </div>
        {isUserFollowed(user.id) ? (
          <SecondaryButton
            size="medium"
            onClick={() => {
              unfollowUser(user.id);
            }}
          >
            Unfollow
          </SecondaryButton>
        ) : (
          <SecondaryButton
            size="medium"
            onClick={() => {
              followUser(user.id);
            }}
          >
            Follow
          </SecondaryButton>
        )}

        <div
          className={classes.buttonIcon}
          onClick={() => {
            chatWithUser(user);
          }}
        >
          <img className={classes.iconButton} src={require("assets/priviIcons/message.png")} alt={"list"} />
        </div>
      </div>
      <div className={classes.divider}></div>
    </div>
  );
};

const useStyles = makeStyles(theme => ({
  root: {
    display: "flex",
    paddingBottom: "8px",
    paddingTop: "8px",
    alignItems: "center",
  },
  nameContainer: {
    flex: 1,
    display: "block",
    marginLeft: "8px",
  },
  nameText: {
    margin: "0px;",
    fontSize: "14px",
    fontWeight: "bold",
    lineHeight: "24px",
    color: "#181818",
  },
  tagText: {
    margin: "0px;",
    fontSize: "14px",
    lineHeight: "24px",
    color: "#FF79D1",
  },
  buttonText: {
    margin: "0px;",
    fontSize: "16px",
    fontWeight: "bold",
    lineHeight: "30px",
    color: "#151414",
  },
  button: {
    height: "40px",
    border: "1.5px solid #707582",
    borderRadius: "10px",
    paddingLeft: "15px",
    paddingRight: "15px",
    paddingTop: "5px",
    paddingBottom: "5px",
  },
  buttonIcon: {
    height: "40px",
    marginLeft: "3px",
    border: "1.5px solid #707582",
    borderRadius: "10px",
    paddingLeft: "10px",
    paddingRight: "10px",
    paddingTop: "12px",
    paddingBottom: "5px",
    textAlign: "center",
    alignItems: "center",
  },
  iconButton: {
    height: "16px",
  },
  divider: {
    width: "100%",
    border: "1px solid #707582",
    opacity: "0.3",
    marginBottom: "10px",
  },
}));
