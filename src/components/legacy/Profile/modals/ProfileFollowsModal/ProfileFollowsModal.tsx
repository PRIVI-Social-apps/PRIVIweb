import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import axios from "axios";
import Grid from "@material-ui/core/Grid";
import Modal from "@material-ui/core/Modal";

import { profileFollowsModalStyles } from "./ProfileFollowsModal.styles";
import { setSelectedUser } from "store/actions/SelectedUser";
import { RootState } from "store/reducers/Reducer";
import URL from "shared/functions/getURL";
import AlertMessage from "shared/ui-kit/Alert/AlertMessage";
import { useUserConnections } from "shared/contexts/UserConnectionsContext";

import SvgIcon from "@material-ui/core/SvgIcon";
import { ReactComponent as StarRegular } from "assets/icons/star-regular.svg";
import { ReactComponent as StarSolid } from "assets/icons/star-solid.svg";

const ProfileFollowsModal = props => {
  const userSelector = useSelector((state: RootState) => state.user);
  const users = useSelector((state: RootState) => state.usersInfoList);
  const userConnections = useUserConnections();
  const classes = profileFollowsModalStyles();
  const dispatch = useDispatch();
  const history = useHistory();

  const [usersList, setUsersList] = useState<any[]>([]);
  const [status, setStatus] = useState<any>("");

  useEffect(() => {
    if (props.list && props.list.length > 0) {
      let list = [...props.list];
      if (users && users.length > 0) {
        list.forEach((user, index) => {
          if (!user.userImageURL && !user.name) {
            list[index].userImageURL = users[users.findIndex(u => u.id === user.id.user)]?.imageURL;
          }
        });
      }

      setUsersList(list);
    }

    //eslint-disable react-hooks/exhaustive-deps
  }, [users, props.list]);

  const goToProfile = (id: any) => {
    //history.go(0);
    history.push(`/profile/${id.length > 0 && id.user === undefined ? id : id.user}`);
    dispatch(setSelectedUser(id.length > 0 && id.user === undefined ? id : id.user));
    props.onClose();
  };

  const followUser = async (item: any) => {
    try {
      await userConnections.followUser(item.id.user);

      setStatus({
        msg: "Follow success",
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
        msg: "Follow failed",
        key: Math.random(),
        variant: "error",
      });
    }
  };

  const unfollowUser = async (item: any) => {
    try {
      await userConnections.unfollowUser(item.id.user);

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

  const superFollowerUser = (item: any, superFollower: boolean) => {
    const body = {
      user: userSelector.id,
      userToSuperFollow: item.id.user,
      superFollower: superFollower,
    };
    axios.post(`${URL()}/user/connections/superFollowerUser`, body).then(res => {
      const resp = res.data;
      if (resp.success) {
        setStatus({
          msg: "SuperFollow success",
          key: Math.random(),
          variant: "success",
        });

        if (props.header === "Followers") {
          props.refreshFollowers();
        } else if (props.header === "Followings") {
          props.refreshFollowings();
        }
      } else {
        setStatus({
          msg: "SuperFollow failed",
          key: Math.random(),
          variant: "error",
        });
      }
    });
  };

  if (usersList && usersList.length > 0)
    return (
      <Modal className={classes.root} open={props.open} onClose={props.onClose}>
        <div className={classes.followModalContent}>
          <div className={classes.closeButton} onClick={props.onClose}>
            <img src={require("assets/icons/x_darkblue.png")} alt={"x"} />
          </div>

          <div className={classes.modalHeader}>{props.header}</div>
          {!usersList || usersList.length === 0 ? (
            <div>
              {props.header === "Followers" ? (
                <div className={classes.modalNoItems}>There're no followers</div>
              ) : (
                <div className={classes.modalNoItems}>You don't follow anyone</div>
              )}
            </div>
          ) : (
            <div>
              {usersList.map((item: any, index: number) => {
                return (
                  <>
                    <Grid
                      key={index}
                      container
                      className={classes.rowMyAction}
                      spacing={0}
                      direction="row"
                      alignItems="flex-start"
                      justify="center"
                    >
                      {props.ownUser && props.header === "Followers" && item.isSuperFollower ? (
                        <div
                          style={{ color: "#29e8dc", fontSize: 30, cursor: "pointer", marginTop: -25 }}
                          onClick={() => {
                            superFollowerUser(item, false);
                          }}
                        >
                          <SvgIcon>
                            <StarSolid />
                          </SvgIcon>
                        </div>
                      ) : props.ownUser && props.header === "Followers" && !item.isSuperFollower ? (
                        <div
                          style={{ color: "#727F9A", fontSize: 30, cursor: "pointer", marginTop: -25 }}
                          onClick={() => {
                            superFollowerUser(item, true);
                          }}
                        >
                          <SvgIcon>
                            <StarRegular />
                          </SvgIcon>
                        </div>
                      ) : null}
                      <Grid
                        item
                        xs={2}
                        sm={2}
                        lg={2}
                        direction="row"
                        alignItems="flex-start"
                        justify="center"
                      >
                        <Grid item xs={12} sm={12} lg={12} className={classes.gridProfilePhoto}>
                          <div
                            className={classes.profilePhotoItem}
                            onClick={() => goToProfile(item.id)}
                            style={{
                              backgroundImage:
                                item.userImageURL && item.userImageURL.length > 0
                                  ? `url(${item.userImageURL})`
                                  : "none",
                              backgroundPosition: "center",
                              backgroundRepeat: "no-repeat",
                              backgroundSize: "cover",
                            }}
                          />
                        </Grid>
                        <Grid item xs={12} lg={12} className={classes.gridItems}>
                          <div className={classes.nameItem} onClick={() => goToProfile(item.id.user)}>
                            {item.name}
                          </div>
                        </Grid>
                      </Grid>
                      <Grid
                        item
                        xs={3}
                        sm={3}
                        lg={3}
                        className={classes.gridItems}
                        style={{ marginTop: -25 }}
                      >
                        <div className={classes.infoDiv}>
                          <span>
                            {item.trustScore * 100}%{" "}
                            <span className={classes.infoDivTitle}> Trust Score</span>
                          </span>
                        </div>
                        <div className={classes.infoDiv}>
                          <span>
                            {item.endorsementScore * 100}%{" "}
                            <span className={classes.infoDivTitle}> Endors. Score</span>
                          </span>
                        </div>
                      </Grid>
                      <Grid
                        item
                        xs={3}
                        sm={3}
                        lg={3}
                        className={classes.gridItems}
                        style={{ marginTop: -25 }}
                      >
                        <div className={classes.infoDiv}>
                          <span>
                            {item.numFollowers || 0} <span className={classes.infoDivTitle}> Followers</span>
                          </span>
                        </div>
                        <div className={classes.infoDiv}>
                          <span>
                            {item.numFollowings || 0} <span className={classes.infoDivTitle}> Following</span>
                          </span>
                        </div>
                      </Grid>
                      {props.ownUser && (
                        <div>
                          {item.isFollowing === 2 ? (
                            <button
                              onClick={() => unfollowUser(item)}
                              className={classes.optionsConnectionButtonUnfollow}
                            >
                              Unfollow
                            </button>
                          ) : item.isFollowing === 1 ? (
                            <button className={classes.optionsConnectionButtonRequest}>Requested</button>
                          ) : (
                            <button
                              onClick={() => followUser(item)}
                              className={classes.optionsConnectionButton}
                              style={{ border: "none" }}
                            >
                              + &nbsp; Follow
                            </button>
                          )}
                        </div>
                      )}
                    </Grid>
                  </>
                );
              })}
            </div>
          )}
          {status ? <AlertMessage key={status.key} message={status.msg} variant={status.variant} /> : ""}
        </div>
      </Modal>
    );
  else return null;
};

export default ProfileFollowsModal;
