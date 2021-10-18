import { makeStyles } from "@material-ui/core";
import React, {useEffect, useState} from "react";
import Avatar from "shared/ui-kit/Avatar";

import AvatarImage from "assets/anonAvatars/ToyFaces_Colored_BG_111.jpg";
import {useSelector} from "react-redux";
import {RootState} from "../../../../../../../store/reducers/Reducer";
import AlertMessage from "../../../../../../../shared/ui-kit/Alert/AlertMessage";
import {useUserConnections} from "../../../../../../../shared/contexts/UserConnectionsContext";

const useStyles = makeStyles(theme => ({
  container: {
    display: "flex",
    alignItems: "center",
    padding: theme.spacing(2),
    borderRadius: theme.spacing(1.5),
    boxShadow: "0px 2px 12px rgba(0, 0, 0, 0.1)",
    marginBottom: theme.spacing(2),
    justifyContent: "space-between",
  },
  userBox: {
    display: "flex",
    alignItems: "center",
  },
  foundAvatar: {
    boxShadow: "0px 2px 12px rgba(0, 0, 0, 0.1)",
  },
  title: {
    marginLeft: theme.spacing(2.5),
    fontSize: 14,
  },
  userSlug: {
    background: "linear-gradient(90deg, #ff79d1 0%, #db00ff 100%)",
    "-webkit-background-clip": "text",
    backgroundClip: "text",
    "-webkit-text-fill-color": "transparent",
  },
}));

export default function MemberItem(props) {
  const classes = useStyles();

  const users = useSelector((state: RootState) => state.usersInfoList);
  const userSelector = useSelector((state: RootState) => state.user);
  const userConnections = useUserConnections();

  const [user, setUser] = useState<any>({});

  const [isFollowing, setIsFollowing] = useState<number>(0);
  const [status, setStatus] = useState<any>("");

  useEffect(() => {
    const userFound = users.find(user => user.address === props.member.Address);
    setUser(userFound);

    if (userSelector && userConnections.followings.length > 0) {
      let findFollowing = userConnections.followings.find(follow => follow.id === userFound?.id);
      if (findFollowing) {
        setIsFollowing(findFollowing.isFollowing);
      }
    }
  }, []);

  const followUser = async (userId: string) => {
    try {
      await userConnections.followUser(userId);

      setStatus({
        msg: "Follow success",
        key: Math.random(),
        variant: "success",
      });

      setIsFollowing(1);

      if (props.header === "Followers") {
        props.refreshFollowers();
      } else if (props.header === "Followings") {
        props.refreshFollowings();
      }
    } catch (err) {
      setStatus({
        msg: "Follow failed",
        key: Math.random(),
        variant: "error",
      });
    }
  };

  const unfollowUser = async (userId: string) => {
    try {
      await userConnections.unfollowUser(userId);

      setIsFollowing(0);

      setStatus({
        msg: "Unfollow success",
        key: Math.random(),
        variant: "success",
      });

      if (props.header === "Followers") {
        props.refreshFollowers();
      } else if (props.header === "Followings") {
        props.refreshFollowings();
      }
    } catch (err) {
      setStatus({
        msg: "Unfollow failed",
        key: Math.random(),
        variant: "error",
      });
    }
  };

  return (
    <div className={classes.container}>
      <div className={classes.userBox}>
        <Avatar
          image={user && user.url ? user.url : AvatarImage}
          rounded
          variant={classes.foundAvatar}
          size={50}
        />
        <div className={classes.title}>
          <b>{user?.name}</b>
          <div className={classes.userSlug}>@{user?.urlSlug}</div>
        </div>
      </div>
      {isFollowing === 0 ? (
        <button onClick={() => followUser(user.id)}>Follow</button>
      ) : isFollowing === 1 ? (
        <button
          style={{
            backgroundColor: "grey",
          }}
          onClick={() => {}}
        >
          Requested
        </button>
      ) : isFollowing === 2 ? (
        <button onClick={() => unfollowUser(user.id)}>Following</button>
      ) : null}
      {status ? <AlertMessage key={status.key} message={status.msg} variant={status.variant} /> : ""}
    </div>
  );
}
