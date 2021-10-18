import React, { useEffect, useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";

import Paper from "@material-ui/core/Paper";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import { Slider } from "@material-ui/core";
import Button from "@material-ui/core/Button";

import { setSelectedUser } from "store/actions/SelectedUser";
import { RootState } from "store/reducers/Reducer";
import URL from "shared/functions/getURL";
import AlertMessage from "shared/ui-kit/Alert/AlertMessage";

import "./Community.css";
import { LoadingWrapper } from "shared/ui-kit/Hocs";

const useStyles = makeStyles(theme => ({
  root: {
    "& > *": {
      margin: theme.spacing(1),
      width: "100%",
    },
  },
  rootAlert: {
    width: "100%",
    "& > * + *": {
      marginTop: theme.spacing(2),
    },
  },
}));

const Community = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const history = useHistory();

  const userSelector = useSelector((state: RootState) => state.user);

  const [trustFilter, setTrustFilter] = useState<number[]>([0, 100]);
  const [endorsementFilter, setEndorsementFilter] = useState<number[]>([0, 100]);

  const [searcherUser, setSearcherUser] = useState<string>("");

  const [usersList, setUsersList]: any[] = useState<any[]>([]);

  const [chargedListBool, setChargedListBool] = useState(true);

  const [status, setStatus] = useState<any>("");

  useEffect(() => {
    getUsers();
  }, []);

  const getUsers = () => {
    setChargedListBool(true);

    let filters = {
      name: searcherUser,
      trustScore: trustFilter,
      endorsementScore: endorsementFilter,
      userId: userSelector.id,
    };
    axios
      .post(`${URL()}/user/getUserList`, filters)
      .then(response => {
        if (response.data.success) {
          setUsersList(response.data.data);
          setChargedListBool(false);
        } else {
          setStatus({
            msg: "Error when making the request",
            key: Math.random(),
            variant: "error",
          });
          setChargedListBool(false);
        }
      })
      .catch(error => {
        setStatus({
          msg: "Error when making the request",
          key: Math.random(),
          variant: "error",
        });
        setChargedListBool(false);
      });
  };

  const StyledSlider = withStyles({
    root: {
      color: "black",
    },
    valueLabel: {
      color: "grey",
    },
  })(Slider);

  const handleTrustChange = (event: any, newValue: number | number[]) => {
    setTrustFilter(newValue as number[]);
  };
  const handleEndorsementChange = (event: any, newValue: number | number[]) => {
    setEndorsementFilter(newValue as number[]);
  };

  const goToProfile = (id: string) => {
    history.go(0);
    history.push(`/profile/${id}`);
    dispatch(setSelectedUser(id));
  };

  const followUser = (item: any) => {
    let followUserObj: any = {
      userToFollow: item.id,
    };
    axios
      .post(`${URL()}/user/connections/followUser`, followUserObj)
      .then(response => {
        if (response.data.success) {
          let data = response.data.data;
          item.isFollowing = true;
          item.numFollowings = data.numFollowings;
          item.numFollowers = data.numFollowers;
          item.trustScore = data.trustScore;
          item.endorsementScore = data.endorsementScore;

          let userIndex = usersList.findIndex(usr => usr.id === userSelector.id);
          if (userIndex && userIndex !== -1) {
            usersList[userIndex].numFollowings = usersList[userIndex].numFollowings + 1;
          }

          setStatus({
            msg: "Followed user!",
            key: Math.random(),
            variant: "success",
          });
        } else {
          setStatus({
            msg: "Error when making the request",
            key: Math.random(),
            variant: "error",
          });
        }
      })
      .catch(error => {
        setStatus({
          msg: "Error when making the request",
          key: Math.random(),
          variant: "error",
        });
      });
  };

  const unfollowUser = (item: any) => {
    let followUserObj: any = {
      userToUnFollow: item.id,
    };
    axios
      .post(`${URL()}/user/connections/unFollowUser`, followUserObj)
      .then(response => {
        if (response.data.success) {
          let data = response.data.data;
          item.isFollowing = false;
          item.numFollowings = data.numFollowings;
          item.numFollowers = data.numFollowers;
          item.trustScore = data.trustScore;
          item.endorsementScore = data.endorsementScore;

          let userIndex = usersList.findIndex(usr => usr.id === userSelector.id);
          if (userIndex && userIndex !== -1) {
            usersList[userIndex].numFollowings = usersList[userIndex].numFollowings - 1;
          }

          setStatus({
            msg: "Unfollowed user!",
            key: Math.random(),
            variant: "success",
          });
        } else {
          setStatus({
            msg: "Error when making the request",
            key: Math.random(),
            variant: "error",
          });
        }
      })
      .catch(error => {
        setStatus({
          msg: "Error when making the request",
          key: Math.random(),
          variant: "error",
        });
      });
  };

  const PaperHeaderSearcher = () => {
    return (
      <Paper className="communityPaperHeader">
        <Grid container spacing={0} direction="row" alignItems="flex-start" justify="center">
          <Grid item xs={12} md={6} className="inputNameUserGridCommunity">
            <form className={classes.root}>
              <TextField
                placeholder="Search User"
                className="textFieldSearcherUser"
                value={searcherUser}
                onChange={elem => {
                  console.log(elem.target.value);
                  setSearcherUser(elem.target.value);
                }}
              />
            </form>
          </Grid>
          <Grid item xs={6} md={3} className="filtersInsideGridCommunity">
            <div className="filtersInsideDivCommunity">
              <div className="menuPodsItemDiv">
                <p className="trustScore">Trust Score</p>
                <StyledSlider
                  defaultValue={trustFilter}
                  valueLabelDisplay="auto"
                  step={1}
                  aria-labelledby="range-slider"
                  onChangeCommitted={handleTrustChange}
                />
                <p className="sliderValues">
                  <span>0%</span>
                  <span>100%</span>
                </p>
              </div>
            </div>
          </Grid>
          <Grid item xs={6} md={3} className="filtersInsideGridCommunity">
            <div className="filtersInsideDivCommunity">
              <div className="menuPodsItemDiv">
                <p className="endorsementScoreWeb">Endrosment Score</p>
                <p className="endorsementScoreMobile">Endros. Score</p>
                <StyledSlider
                  defaultValue={endorsementFilter}
                  valueLabelDisplay="auto"
                  max={100}
                  aria-labelledby="range-slider"
                  onChangeCommitted={handleEndorsementChange}
                />
                <p className="sliderValues">
                  <span>0%</span>
                  <span>100%</span>
                </p>
              </div>
            </div>
          </Grid>
          <Grid item xs={12} className="searchButtonGrid">
            <Button variant="contained" onClick={getUsers} className="searchCommunityButton">
              Search
            </Button>
          </Grid>
        </Grid>
      </Paper>
    );
  };

  return (
    <div className="communityDiv">
      <PaperHeaderSearcher />
      <LoadingWrapper loading={chargedListBool}>
        <div>
          {!usersList || usersList.length === 0 ? (
            <div className="noUsersLabelCommunity">There's no users</div>
          ) : (
            <Paper className="communityPaperList">
              <div className="listUsersCommunity">
                {usersList.map((item: any, i) => {
                  return (
                    <Grid
                      container
                      key={i}
                      className="rowMyAction"
                      spacing={0}
                      direction="row"
                      alignItems="flex-start"
                      justify="flex-start"
                    >
                      <Grid item xs={2} sm={2} lg={2} className="gridProfilePhotoCommunity">
                        {item.hasPhoto ? (
                          <div
                            className="profilePhotoItem"
                            onClick={() => goToProfile(item.id)}
                            style={{
                              backgroundImage: `url(${item.url}?${Date.now()})`,
                              backgroundPosition: "center",
                              backgroundRepeat: "no-repeat",
                              backgroundSize: "cover",
                              borderRadius: "10px",
                            }}
                          ></div>
                        ) : (
                          <div className="profilePhotoItem" onClick={() => goToProfile(item.id)}></div>
                        )}
                      </Grid>
                      <Grid item xs={2} lg={2} className="gridItems">
                        {!item.lastName || item.lastName === "" ? (
                          <div className="nameItem" onClick={() => goToProfile(item.id)}>
                            {item.firstName}
                          </div>
                        ) : (
                          <div className="nameItem" onClick={() => goToProfile(item.id)}>
                            {item.firstName + " " + item.lastName}
                          </div>
                        )}
                      </Grid>
                      <Grid item xs={3} sm={3} lg={3} className="gridItems">
                        <div className="trustScoreDiv">{item.trustScore * 100}% Trust Score</div>
                        <div className="endorsementScoreDiv">
                          {item.endorsementScore * 100}% Endors. Score
                        </div>
                      </Grid>
                      <Grid item xs={3} sm={3} lg={3} className="gridItems">
                        <div className="followersDiv">{item.numFollowers || 0} Followers</div>
                        <div className="followingDiv">{item.numFollowings || 0} Following</div>
                      </Grid>
                      {item.id === userSelector.id ? (
                        <Grid item xs={2} sm={2} lg={2} className="gridFollowButton"></Grid>
                      ) : (
                        <Grid item xs={2} sm={2} lg={2} className="gridFollowButton">
                          {item.isFollowing ? (
                            <Button
                              variant="contained"
                              onClick={() => unfollowUser(item)}
                              className="optionsConnectionButton"
                            >
                              Unfollow
                            </Button>
                          ) : (
                            <Button
                              variant="contained"
                              onClick={() => followUser(item)}
                              className="optionsConnectionButton"
                            >
                              Follow
                            </Button>
                          )}
                        </Grid>
                      )}
                    </Grid>
                  );
                })}
              </div>
            </Paper>
          )}
        </div>
      </LoadingWrapper>
      <div className={classes.rootAlert}>
        {status && (
          <AlertMessage
            key={status.key}
            message={status.msg}
            variant={status.variant}
            onClose={() => setStatus(undefined)}
          />
        )}
      </div>
    </div>
  );
};

export default Community;
