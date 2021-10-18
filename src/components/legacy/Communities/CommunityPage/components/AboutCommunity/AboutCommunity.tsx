import React, { useEffect, useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { Grid } from "@material-ui/core";

import IndividualBadgeModal from "./Badge-hexagon/IndividualBadgeModal";
import { setSelectedUser } from "store/actions/SelectedUser";

import URL from "shared/functions/getURL";
import TabPanel from "shared/ui-kit/Page-components/TabPanel";
import BadgeHexagon from "shared/ui-kit/Badge-hexagon/Badge-hexagon";
import { LoadingWrapper } from "shared/ui-kit/Hocs";

import startDateIcon from "assets/icons/start_date.png";
import expectedDuration from "assets/icons/expected_duration.png";
import { TabNavigation } from "shared/ui-kit";
import Box from "shared/ui-kit/Box";

import "./AboutCommunity.css";

export default function AboutCommunity(props) {
  const history = useHistory();
  const dispatch = useDispatch();

  const [communityBadges, setCommunityBadges] = useState<any[]>([]);
  const [rareBadges, setRareBadges] = useState<any[]>([]);
  const [superRareBadges, setSuperRareBadges] = useState<any[]>([]);
  const [newbieBadges, setNewbieBadges] = useState<any[]>([]);
  const [badgesLoading, setBadgesLoading] = useState<boolean>(false);
  const [tabsBadgeValue, setTabsBadgeValue] = useState(0);

  const [openBadgeModal, setOpenBadgeModal] = React.useState(false);
  const [selectedBadge, setSelectedBadge] = React.useState();

  const badgeTabs = [
    'All Badges',
    'Super rare',
    'Rare',
    'Newbie'
  ];

  useEffect(() => {
    getCommunityBadges(props.community.CommunityAddress);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    getCommunityBadges(props.community.CommunityAddress);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.community]);

  const getCommunityBadges = communityAddress => {
    setBadgesLoading(true);

    axios
      .get(`${URL()}/user/badges/getBadges/${communityAddress}`)
      .then(response => {
        const resp = response.data;
        console.log(resp);
        if (resp.success) {
          //get full badge list
          let badges = resp.data;

          //sort from newest to oldest
          // badges.sort(
          //   (a, b) => new Date(a.Date).getTime() - new Date(b.Date).getTime()
          // );

          setCommunityBadges(badges);

          //get lists by badge classification
          const rare = [] as any[];
          const superRare = [] as any[];
          const newbie = [] as any[];

          badges.forEach(badge => {
            if (badge.Type === "rare") {
              rare.push(badge);
            } else if (badge.Type === "super_rare") {
              superRare.push(badge);
            } else if (badge.Type === "newbie") {
              newbie.push(badge);
            }
          });
          setRareBadges(rare);
          setSuperRareBadges(superRare);
          setNewbieBadges(newbie);
        }
        setBadgesLoading(false);
      })
      .catch(error => {
        console.log(error);
        setBadgesLoading(false);
      });
  };

  const handleChangeTabsBadge = (newValue) => {
    setTabsBadgeValue(newValue);
  };

  const openInNewTab = url => {
    const newWindow = window.open(url, "_blank", "noopener,noreferrer");
    if (newWindow) newWindow.opener = null;
  };

  if (props.community) {
    let date = props.community.Date * 1000;
    let month =
      new Date(date).getMonth() < 10 ? `0${new Date(date).getMonth()}` : `${new Date(date).getMonth()}`;
    let day = new Date(date).getDate() < 10 ? `0${new Date(date).getDate()}` : `${new Date(date).getDate()}`;
    let year = `${new Date(date).getFullYear()}`;
    let dateString = day + "." + month + "." + year;
    return (
      <div className="about-community">
        <div className="about-community-content">
          <Grid container>
            <Grid item xs={12} sm={6}>
              <div style={{ width: "100%", marginRight: "10px" }}>
                <Box fontSize={22} fontWeight={400} mb={2}>
                  About this community
                </Box>
                <div className="description">
                  {props.community.Description
                    ? props.community.Description
                    : "No description about this community"}
                </div>
                {false && (
                  <div className="box" style={{ justifyContent: "start", background: "#eef1f4" }}>
                    <div className="badgesProfile">
                      <div className="flexDisplayStartCenter">
                        <div className="f18">
                          {`Community Badges (${communityBadges && communityBadges.length ? communityBadges.length : 0
                            })`}
                        </div>
                      </div>
                      <LoadingWrapper loading={badgesLoading}>
                        <TabNavigation
                          tabs={badgeTabs}
                          currentTab={tabsBadgeValue}
                          variant="primary"
                          onTabChange={handleChangeTabsBadge}
                        />
                      </LoadingWrapper>
                      {/*BADGES TABS*/}
                      {/* all */}
                      <TabPanel value={tabsBadgeValue} index={0} className="badgesGrid">
                        {communityBadges.map((badge, index) => {
                          return (
                            <BadgeHexagon
                              badge={badge}
                              key={`all-badges-${index}`}
                              style={{ width: "53px", height: "60px" }}
                            />
                          );
                        })}
                      </TabPanel>
                      {/*Super rare*/}
                      <TabPanel value={tabsBadgeValue} index={1} className="badgesGrid">
                        {superRareBadges.map((badge, index) => {
                          return (
                            <BadgeHexagon
                              badge={badge}
                              key={`super-rare-badges-${index}`}
                              style={{ width: "53px", height: "60px" }}
                              onClickBadge={() => {
                                setSelectedBadge(badge);
                                setOpenBadgeModal(true);
                              }}
                            />
                          );
                        })}
                      </TabPanel>
                      {/*rare*/}
                      <TabPanel value={tabsBadgeValue} index={2} className="badgesGrid">
                        {rareBadges.map((badge, index) => {
                          return (
                            <BadgeHexagon
                              badge={badge}
                              key={`rare-badges-${index}`}
                              style={{ width: "53px", height: "60px" }}
                              onClickBadge={() => {
                                setSelectedBadge(badge);
                                setOpenBadgeModal(true);
                              }}
                            />
                          );
                        })}
                      </TabPanel>
                      {/*newbie*/}
                      <TabPanel value={tabsBadgeValue} index={3} className="badgesGrid">
                        {newbieBadges.map((badge, index) => {
                          return (
                            <BadgeHexagon
                              badge={badge}
                              key={`newbie-badges-${index}`}
                              style={{ width: "53px", height: "60px" }}
                              onClickBadge={() => {
                                setSelectedBadge(badge);
                                setOpenBadgeModal(true);
                              }}
                            />
                          );
                        })}
                      </TabPanel>
                    </div>
                  </div>
                )}
              </div>
            </Grid>
            <Grid item xs={12} sm={6}>
              <div className="right">
                <div className="row">
                  <div className="element startDate">
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <img src={startDateIcon} alt="start date" />
                    </div>
                    <p>{dateString}</p>
                  </div>
                  {/* <div className="element">
                <span>Members</span>
                <p>{props.community.Members ? props.community.Members.length : "N/A"}</p>
              </div> */}
                  <div className="element expectedDate">
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <img src={expectedDuration} alt="expected duration" />
                    </div>
                    <p>
                      {props.community.ExpectedDuration ? `${props.community.ExpectedDuration} weeks` : "N/A"}
                    </p>
                  </div>
                </div>
                <div className="column">
                  <span className="span-title">Owner</span>
                  <div
                    className="user"
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      history.push(`/profile/${props.community.Creator}`);
                      dispatch(setSelectedUser(props.community.Creator));
                    }}
                  >
                    <div
                      className="user-image"
                      style={{
                        backgroundImage:
                          props.community.creatorInfo &&
                            props.community.creatorInfo.imageURL &&
                            props.community.creatorInfo.imageURL.length > 0
                            ? `url(${props.community.creatorInfo.imageURL})`
                            : "none",
                        backgroundRepeat: "no-repeat",
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                      }}
                    />
                    <Box fontSize={14} fontWeight={400} color="#181818">
                      {props.community.creatorInfo && props.community.creatorInfo.name
                        ? props.community.creatorInfo.name
                        : "unnamed user"}
                    </Box>
                  </div>
                </div>
                {props.community.TokenSymbol && props.community.TokenSymbol !== "" ? (
                  <div className="column">
                    <span className="span-title">Community token</span>
                    <div className="user">
                      <div
                        className="user-image"
                        style={{
                          backgroundImage: `url(${URL()}/wallet/getTokenPhoto/${props.community.TokenSymbol
                            })`,
                          backgroundRepeat: "no-repeat",
                          backgroundSize: "cover",
                          backgroundPosition: "center",
                        }}
                      />
                      <Box fontSize={14} fontWeight={400} color="#181818">
                        {props.community.TokenSymbol}
                      </Box>
                    </div>
                  </div>
                ) : null}
                {props.community.FundingToken ? (
                  <div className="row">
                    <div className="element">
                      <span>Supply</span>
                      <p>
                        {props.community.SupplyReleased
                          ? `${props.community.SupplyReleased > 1000000
                            ? (props.community.SupplyReleased / 1000000).toFixed(1)
                            : props.community.SupplyReleased > 1000
                              ? (props.community.SupplyReleased / 1000).toFixed(1)
                              : props.community.SupplyReleased.toFixed(1)
                          } ${props.community.SupplyReleased > 1000000
                            ? "M"
                            : props.community.SupplyReleased > 1000
                              ? "K"
                              : ""
                          }`
                          : "N/A"}
                      </p>
                    </div>
                    <div className="element">
                      <span>Price</span>
                      <p>{`${props.community.Price !== undefined ? props.community.Price.toFixed(2) : "N/A"
                        } ${props.community.FundingToken}`}</p>
                    </div>
                    <div className="element">
                      <span>MCAP</span>
                      <p>{`${props.community.MCAP ? props.community.MCAP.toFixed(4) : "N/A"} ${props.community.FundingToken
                        }`}</p>
                    </div>
                  </div>
                ) : null}
                <div className="column">
                  <span className="span-title">Social</span>
                  <div className="row" style={{ borderBottom: "none", marginBottom: 0, paddingBottom: 0 }}>
                    <div
                      className="social clickable cursor-pointer"
                      onClick={() => {
                        if (props.community.TwitterId) {
                          openInNewTab(`https://twitter.com/${props.community.TwitterId}`);
                        } else {
                          openInNewTab("https://twitter.com/");
                        }
                      }}
                    >
                      <img src={`${require(`assets/snsIcons/twitter.png`)}`} alt={"twitter"} />
                      <p style={{ color: "#181818" }}>Twitter</p>
                    </div>
                  </div>
                </div>
              </div>
            </Grid>
          </Grid>
        </div>
        {openBadgeModal && (
          <IndividualBadgeModal
            badge={selectedBadge}
            open={openBadgeModal}
            handleClose={() => setOpenBadgeModal(false)}
          />
        )}
      </div>
    );
  } else {
    return null;
  }
}
