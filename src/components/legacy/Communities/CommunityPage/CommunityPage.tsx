import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";

import { Divider, Tooltip } from "@material-ui/core";
import { Dialog } from "@material-ui/core";

import General from "./components/General/General";
import Discussion from "./components/Discussion/Discussion";
import Dashboard from "./components/Dashboard/Dashboard";
import Payments from "./components/Payments/Payments";
import Projects from "./components/Projects/Projects";
import CommunityBlog from "./components/CommunityBlog/CommunityBlog";
import Jarr from "./components/Jarr/Jarr";
import AboutCommunity from "./components/AboutCommunity/AboutCommunity";
import Treasury from "./components/Treasury/Treasury";
import Acquisitions from "./components/Acquisitions/Acquisitions";
import Members from "./components/Members/Members";
import VestingTaxation from "./components/VestingTaxation/VestingTaxation";
import RulesAndLevels from "./components/RulesAndLevels/RulesAndLevels";
import CreatePostModal from "./modals/Create-Post/CreatePostModal";
import CreateBlogPostModal from "./modals/Create-Blog/CreateBlogPostModal";
import CreateBadge from "./modals/Create-Badge/Create-badge";
import PostProject from "./modals/Post-Project/Post-project";
import { useTypedSelector } from "store/reducers/Reducer";
import URL from "shared/functions/getURL";
import AlertMessage from "shared/ui-kit/Alert/AlertMessage";
import CommunityModalEdit from "./modals/Community-modal-edit/Community-modal-edit";
import CreatorsModal from "./modals/CreatorsModal/CreatorsModal";
import { setSelectDiscordRoom } from "store/actions/SelectedDiscordRoom";

import { getBlockchainNode2URL } from "shared/functions/getBlockchainURLs";
import { sumTotalViews } from "shared/functions/totalViews";
import Voting from "./components/Voting/Voting";
import { SecondaryButton, TabNavigation } from "shared/ui-kit";
import Box from "shared/ui-kit/Box";
import { Gradient } from "shared/constants/const";
import CreateCommunityTokenModal from "../modals/CreateCommunityToken";
import { LoadingWrapper } from "shared/ui-kit/Hocs/LoadingWrapper";

import "./CommunityPage.css";
import InputWithLabelAndTooltip from "shared/ui-kit/InputWithLabelAndTooltip";

const verifiedMint = require("assets/icons/verified_mint.png");
const pinkArrowIcon = require("assets/icons/pink_arrow.png");

const communityMenuDefaultOptions = [
  "General",
  "Discussion",
  "Voting",
  "Dashboard",
  "Payments",
  "Projects",
  "Community Blog",
  "Treasury",
  "Acquisitions",
  "Members",
  "Jarr",
  "Vesting and Taxation",
  "Rules and Levels",
  "About Community",
];

export default function CommunityPage() {
  const dispatch = useDispatch();

  const user = useTypedSelector(state => state.user);
  const users = useTypedSelector(state => state.usersInfoList);

  const tokenTypeMap = useRef({}); // ref to tokenTypeMap given that setInterval cant get current state of useState hook
  const avatarRef = useRef<any>();
  const communityBalancesRef = useRef({});
  const [communityBalances, setCommunityBalances] = useState<any[]>([]);

  const [community, setCommunity] = useState<any>({});
  const [communityMenuOptions, setCommunityMenuOptions] = useState<string[]>(communityMenuDefaultOptions);
  const [communityMenuSelection, setCommunityMenuSelection] = useState<string>(
    communityMenuDefaultOptions[0]
  );
  const [treasurers, setTreasurers] = useState<any[]>([]);

  const [openModalEdit, setOpenModalEdit] = useState<boolean>(false);
  const [openModalNewThread, setOpenModalNewThread] = useState<boolean>(false);
  const [openModalPostProject, setOpenModalPostProject] = useState<boolean>(false);
  const [openModalNewBlogPost, setOpenModalNewBlogPost] = useState<boolean>(false);
  const [openModalBuyTokens, setOpenModalBuyTokens] = useState<boolean>(false);
  const [openModalSellTokens, setOpenModalSellTokens] = useState<boolean>(false);
  const [openModalSendTokens, setOpenModalSendTokens] = useState<boolean>(false);
  const [openModalSwapTokens, setOpenModalSwapTokens] = useState<boolean>(false);
  const [openModalCreateBadge, setOpenModalCreateBadge] = useState<boolean>(false);
  const [openModalCreatePosts, setOpenModalCreatePosts] = useState<boolean>(false);
  const [openCreateCommunityToken, setOpenCreateCommunityToken] = useState<boolean>(false);

  const [openCreatorsModal, setOpenCreatorsModal] = useState<boolean>(false);
  const [isDataLoading, setIsDataLoading] = useState<boolean>(false);

  // const handleOpenInvest = () => {
  //   setOpenInvest(true);
  // };
  // const handleCloseInvest = () => {
  //   setOpenInvest(false);
  // };
  // const handleOpenBuySellModal = type => {
  //   setModalType(type);
  //   setOpenBuySellModal(true);
  // };
  // const handleCloseBuySellModal = () => {
  //   setOpenBuySellModal(false);
  // };
  const [followed, setFollowed] = useState<boolean>(false);
  const [status, setStatus] = React.useState<any>("");
  const [joined, setJoined] = useState<boolean>(false);
  const [urlCommunityPhoto, setURLCommunityPhoto] = useState<string>("");

  const handleOpenModalNewThread = () => {
    setOpenModalNewThread(true);
  };
  const handleOpenModalPostProject = () => {
    setOpenModalPostProject(true);
  };
  const handleOpenModalNewBlogPost = () => {
    setOpenModalNewBlogPost(true);
  };
  const handleOpenModalBuyTokens = () => {
    setOpenModalBuyTokens(!openModalBuyTokens);
  };
  const handleOpenModalSellTokens = () => {
    setOpenModalSellTokens(!openModalSellTokens);
  };
  const handleOpenModalSendTokens = () => {
    setOpenModalSendTokens(true);
  };
  const handleOpenModalSwapTokens = () => {
    setOpenModalSwapTokens(true);
  };
  const handleOpenModalCreateBadge = () => {
    setOpenModalCreateBadge(true);
  };
  const handleOpenModalCreatePosts = () => {
    setOpenModalCreatePosts(true);
  };
  const handleCloseModalNewThread = () => {
    setOpenModalNewThread(false);
  };
  const handleCloseModalPostProject = () => {
    setOpenModalPostProject(false);
  };
  const handleCloseModalNewBlogPost = () => {
    setOpenModalNewBlogPost(false);
  };
  const handleCloseModalBuyTokens = () => {
    setOpenModalBuyTokens(false);
  };
  const handleCloseModalSellTokens = () => {
    setOpenModalSellTokens(false);
  };
  const handleCloseModalSendTokens = () => {
    setOpenModalSendTokens(false);
  };
  const handleCloseModalSwapTokens = () => {
    setOpenModalSwapTokens(false);
  };
  const handleCloseModalCreateBadge = () => {
    setOpenModalCreateBadge(false);
  };
  const handleCloseModalCreatePosts = () => {
    setOpenModalCreatePosts(false);
  };

  const handleOpenCreateCommunityToken = () => {
    setOpenCreateCommunityToken(true);
  };
  const handleCloseCreateCommunityToken = () => {
    setOpenCreateCommunityToken(false);
  };

  let pathName = window.location.href; // If routing changes, change to pathname
  let idUrl = pathName.split("/")[5];
  const [communityId, setCommunityId] = useState<string>("");

  // ----------------------- BALANCE STREAMING ---------------------------

  const refreshBalance = () => {
    const newTokenBalances: any[] = [];
    const currTime = Math.floor(Date.now() / 1000);
    let token: string = "";
    let balanceObj: any = null;
    for ([token, balanceObj] of Object.entries({
      ...communityBalancesRef.current,
    })) {
      const newBalance = Math.max(
        0,
        balanceObj.InitialBalance + (currTime - balanceObj.LastUpdate) * balanceObj.AmountPerSecond
      );
      newTokenBalances.push({
        Amount: newBalance,
        Token: token,
        Type: balanceObj.Type,
      });
      // when update is needed => refetch token balance info
      if (currTime > balanceObj.NextUpdate && (communityId || community.CommunityAddress)) {
        const config = {
          params: {
            Address: communityId ?? community.CommunityAddress,
            Token: token,
          },
        };
        axios.get(`${getBlockchainNode2URL()}/api/CoinBalance/getStreamingUpdateInfo`, config).then(res => {
          const resp = res.data;
          if (resp.success) {
            const output = resp.output;
            const balanceObj = {
              Token: token,
              InitialBalance: output.Balance,
              Type: tokenTypeMap.current[token],
              ...output,
            };
            const communityBalanceCopy = { ...communityBalancesRef.current };
            communityBalanceCopy[token] = balanceObj;
            communityBalancesRef.current = communityBalanceCopy;
          }
        });
      }
    }
    setCommunityBalances(newTokenBalances);
  };

  const handleOpenModalEdit = () => {
    setOpenModalEdit(true);
  };

  const handleCloseModalEdit = () => {
    setOpenModalEdit(false);
  };

  const loadBalanceSteamingInfo = () => {
    const config = {
      params: {
        Address: communityId,
      },
    };
    // fetch community balance data
    axios
      .get(`${getBlockchainNode2URL()}/api/CoinBalance/getTokensOfAddress`, config)
      .then(res => {
        const resp = res.data;
        if (resp.success) {
          const output = resp.output;
          let type: string = "";
          let tokenArray: any = [];
          const newTokenTypeMap = {};
          for ([type, tokenArray] of Object.entries(output)) {
            tokenArray.forEach(token => {
              newTokenTypeMap[token] = type;
            });
          }
          if (JSON.stringify(newTokenTypeMap) != JSON.stringify(tokenTypeMap.current))
            tokenTypeMap.current = newTokenTypeMap;
          // call balanceOf for each token
          const tokenList = Object.keys(newTokenTypeMap);
          tokenList.forEach(token => {
            const config = {
              params: {
                Address: communityId,
                Token: token,
              },
            };
            axios
              .get(`${getBlockchainNode2URL()}/api/CoinBalance/getStreamingUpdateInfo`, config)
              .then(res => {
                const resp = res.data;
                if (resp.success) {
                  const output = resp.output;
                  const balanceObj = {
                    Token: token,
                    InitialBalance: output.Balance,
                    Type: tokenTypeMap.current[token],
                    ...output,
                  };
                  const communityBalanceCopy = {
                    ...communityBalancesRef.current,
                  };
                  communityBalanceCopy[token] = balanceObj;
                  communityBalancesRef.current = communityBalanceCopy;
                }
              });
          });
        }
      })
      .catch(error => {
        console.error(error);
      });
  };

  useEffect(() => {
    const interval = setInterval(() => {
      refreshBalance();
    }, 1000);
    return () => {
      clearInterval(interval);
    };
  }, []);

  // ---------------------------------------------------------------

  // get id from url
  useEffect(() => {
    if (idUrl) {
      axios
        .get(`${URL()}/community/getIdFromSlug/${idUrl}/community`)
        .then(response => {
          if (response.data.success) {
            const id = response.data.data.id;
            setCommunityId(id);
          }
        })
        .catch(error => {
          console.log(error);
          setStatus({
            msg: "Error getting community id",
            key: Math.random(),
            variant: "error",
          });
        });
    }
  }, [idUrl]);

  const loadData = () => {
    if (communityId && communityId.length > 0) {
      setIsDataLoading(true);
      axios
        .get(`${URL()}/community/getCommunity/${communityId}`)
        .then(async res => {
          const resp = res.data;
          if (resp.success) {
            let data = { ...resp.data };

            sumTotalViews(data);

            let treasurers: any = [];

            for (let user in data.UserRoles) {
              if (
                data.UserRoles[user] &&
                data.UserRoles[user].roles &&
                data.UserRoles[user].roles["Treasurer"] &&
                data.UserRoles[user].roles["Treasurer"] === "Accepted"
              ) {
                treasurers.push(data.UserRoles[user]);
              }
            }
            setTreasurers(treasurers);
            if (users && users.length > 0) {
              users.forEach(user => {
                if (data.Members && data.Members.length > 0) {
                  data.Members.forEach((member, index) => {
                    if (member.id === user.id) {
                      data.Members[index].userData = {
                        name: user.name,
                        imageURL: user.imageURL,
                        level: user.level,
                        followers: user.numFollowers,
                      };
                    }
                  });
                }

                if (data.TreasuryHistory && data.TreasuryHistory.length > 0) {
                  data.TreasuryHistory.forEach((history, index) => {
                    if (history.UserId === user.id) {
                      data.TreasuryHistory[index].userData = {
                        name: user.name,
                        imageURL: user.imageURL,
                      };
                    }
                  });
                }

                if (data.TreasuryGuards && data.TreasuryGuards.length > 0) {
                  data.TreasuryGuards.forEach((member, index) => {
                    if (member.id === user.id) {
                      data.TreasuryGuards[index].userData = {
                        name: user.name,
                        imageURL: user.imageURL,
                      };
                    }
                  });
                }

                if (data.Creator && data.Creator.length > 0 && data.Creator === user.id) {
                  data.creatorInfo = {
                    name: user.name,
                    imageURL: user.imageURL,
                  };
                }
              });
            }

            if (data.HasPhoto && data.HasPhoto === true) {
              setURLCommunityPhoto(`url(${data.Url}?${Date.now()})`);
            }

            if (data.EthereumContractAddress && data.EthChainId) {
              // now it only support if funding tokne on niswap is eth, if other pair is spported modification to params calls and back end needed
              const res = await axios.get(
                `${URL()}/ethereum/getUniSwapPrices?chainId=${data.EthChainId}&token0Address=${
                  data.EthereumContractAddress
                }`
              );
              if (res && res.data) {
                const prices = res.data;
                data.UniPriceInUsd = prices && prices.priceInUsd ? prices.priceInUsd : 0.0;
                data.UniPriceInFundingToken = prices && prices.priceInEth ? prices.priceInEth : 0.0;
              }
            }

            setCommunity(data);
            // check if user already followed the pod
            let newFollowed = false;
            const followers: any[] = data.Followers ?? [];
            followers.forEach(followerData => {
              const id = followerData.id;
              if (id === user.id) newFollowed = true;
            });
            setFollowed(newFollowed);
            // check if user already joined the pod
            let newJoined = false;
            const joinedUsers: any[] = data.Members ?? [];
            joinedUsers.forEach(joinedUserData => {
              const id = joinedUserData.id;
              if (id === user.id) newJoined = true;
            });
            setJoined(newJoined);
          }

          setIsDataLoading(false);
        })
        .catch(() => {
          setIsDataLoading(false);
        });
      loadBalanceSteamingInfo();
    }
  };

  useEffect(() => {
    loadData();
  }, [users, communityId]);

  const handleFollow = () => {
    const body = {
      userAddress: user.id,
      communityAddress: community.CommunityAddress,
    };
    // follow
    if (!followed) {
      axios.post(`${URL()}/community/follow`, body).then(res => {
        const resp = res.data;
        if (resp.success) {
          setStatus({
            msg: "follow success",
            key: Math.random(),
            variant: "success",
          });
          loadData();
        } else {
          setStatus({
            msg: "follow failed",
            key: Math.random(),
            variant: "error",
          });
        }
      });
    }
    // unfollow
    else {
      axios.post(`${URL()}/community/unfollow`, body).then(res => {
        const resp = res.data;
        if (resp.success) {
          setStatus({
            msg: "unfollow success",
            key: Math.random(),
            variant: "success",
          });
          loadData();
        } else {
          setStatus({
            msg: "unfollow failed",
            key: Math.random(),
            variant: "error",
          });
        }
      });
    }
  };

  //Community Photo Change
  const onChangeCommunityPhoto = (file: any) => {
    const formData = new FormData();
    formData.append("image", file, community.CommunityAddress);
    const config = {
      headers: {
        "content-type": "multipart/form-data",
      },
    };

    let dimensions = { height: 0, width: 0 };

    const reader = new FileReader();
    reader.addEventListener("load", () => {
      let image = new Image();

      if (reader.result !== null && (typeof reader.result === "string" || reader.result instanceof String)) {
        image.src = reader.result.toString();

        //save dimensions
        image.onload = function () {
          let height = image.height;
          let width = image.width;

          dimensions = { height: height, width: width };
          const communityCopy = community;
          communityCopy.dimensions = { height: height, width: width };
          setCommunity(communityCopy);

          return true;
        };
      }
    });
    reader.readAsDataURL(file);

    axios
      .post(`${URL()}/community/changeCommunityPhoto`, formData, config)
      .then(response => {
        if (response.data && response.data.data) {
          setURLCommunityPhoto(response.data.data + "?" + Date.now());
        }

        let body = { dimensions: dimensions, id: community.CommunityAddress };
        axios
          .post(`${URL()}/community/updateCommunityPhotoDimensions`, body)
          .then(response => {
            setURLCommunityPhoto(`url(${community.Url}?${Date.now()})`);
          })
          .catch(error => {
            console.log(error);

            alert("Error uploading photo");
          });
      })
      .catch(error => {
        console.log(error);
      });
  };

  const fileInputCommunityPhoto = e => {
    e.preventDefault();
    console.log(e);
    const files = e.target.files;
    if (files.length) {
      handleFiles(files);
    }
  };

  const handleFiles = (files: any) => {
    for (let i = 0; i < files.length; i++) {
      if (validateFile(files[i])) {
        onChangeCommunityPhoto(files[i]);
      } else {
        files[i]["invalid"] = true;
        // Alert invalid image
      }
    }
  };

  const validateFile = file => {
    const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/x-icon"];
    if (validTypes.indexOf(file.type) === -1) {
      return false;
    }
    return true;
  };

  const getRandomAvatarNumber = () => {
    const random = Math.floor(Math.random() * 100);
    if (random < 10) {
      return `00${random}`;
    }

    return `0${random}`;
  };

  const getCreators = () => {
    const creatorIdList: any[] = [];
    const creatorList: any[] = [];
    if (community) {
      if (community.Admins) {
        community.Admins.map(item => {
          if (community.Creator !== item.userId) {
            creatorIdList.push(item.userId);
            if (community.Members) {
              const member = community.Members.find(p => p.id === item.userId);
              if (member) {
                creatorList.push({
                  ...member,
                  role: "Admin",
                });
              }
            }
          }
        });
      }
      if (community.Moderators) {
        community.Moderators.map(item => {
          if (community.Creator !== item.userId) {
            creatorIdList.push(item.userId);
            if (community.Members) {
              const member = community.Members.filter(p => p.id === item.userId)[0];
              creatorList.push({
                ...member,
                role: "Moderator",
              });
            }
          }
        });
      }
      if (community.Treasurers) {
        community.Treasurers.map(item => {
          if (community.Creator !== item.userId) {
            creatorIdList.push(item.userId);
            if (community.Members) {
              const member = community.Members.filter(p => p.id === item.userId)[0];
              creatorList.push({
                ...member,
                role: "Tresurer",
              });
            }
          }
        });
      }

      if (community.Members && community.UserRoles) {
        community.Members.map(member => {
          if (community.Creator !== member.id) {
            Object.keys(community.UserRoles).map(key => {
              if (member.id === community.UserRoles[key].userId) {
                if (
                  community.UserRoles[key].roles &&
                  Object.keys(community.UserRoles[key].roles).length > 0
                ) {
                  if (!creatorList.some(item => item.id === member.id)) {
                    creatorList.push({
                      ...member,
                      role: Object.keys(community.UserRoles[key].roles)[0],
                    });
                  }
                }
              }
            });
          }
        });
      }

      creatorList.sort((a, b) => {
        if (a.role === "Admin") {
          return -1;
        } else if (b.role === "Admin") {
          return 1;
        }
        return 0;
      });

      return creatorList;
    }

    return [];
  };

  useEffect(() => {
    if (community) {
      if (getCreators().some(c => c.id === user.id) || community.Creator === user.id) {
        setCommunityMenuOptions(communityMenuDefaultOptions);
      } else {
        setCommunityMenuOptions(communityMenuDefaultOptions.filter(o => o !== "Voting"));
      }
    }
  }, [community]);

  const handleTabChange = value => {
    setCommunityMenuSelection(communityMenuOptions[value]);
    if (value === 1 || value === 8) {
      dispatch(setSelectDiscordRoom(null));
    }
  };

  return (
    <div className="community-page">
      <div className="content-wrapper">
        <div className={`header-wrapper`} style={{ height: 250 }}>
          <LoadingWrapper loading={isDataLoading}>
            <>
              <div className="left_panel">
                <div
                  className="community-image"
                  style={{
                    backgroundImage: community.HasPhoto && urlCommunityPhoto ? urlCommunityPhoto : "none",
                    backgroundRepeat: "no-repeat",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    cursor: user.id === community.Creator ? "pointer" : "auto",
                  }}
                  onClick={() => {
                    if (avatarRef && avatarRef.current) {
                      avatarRef.current.click();
                    }
                  }}
                />
                {user.id === community.Creator && (
                  <InputWithLabelAndTooltip
                    type="file"
                    hidden
                    onInputValueChange={e => fileInputCommunityPhoto(e)}
                    required
                    style={{
                      display: "none",
                    }}
                    reference={avatarRef}
                  />
                )}
                <div className="info" style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
                  <div style={{ marginRight: 40 }} className="community-info-content">
                    <h2>
                      {community.Name}
                      <span>(culture)</span>
                    </h2>
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <div className="communityAddress">
                        {`@${community.urlSlug ?? community.CommunityAddress ?? idUrl}`}
                      </div>
                      <img className="levelIcon" src={verifiedMint} alt={"info"} />
                      <Tooltip title="Privi Chain" classes={{ tooltip: "chainTooltip" }}>
                        <div className="communityChain">
                          <img
                            src={require(`assets/tokenImages/PRIVI.png`)}
                            alt={"PRIVI"}
                            className="communityChainIcon"
                          />
                        </div>
                      </Tooltip>
                    </div>
                  </div>
                </div>
              </div>
              <div className="right-panel">
                <div style={{ position: "relative", width: "100%" }}>
                  <div
                    className="creators-div"
                    style={{
                      display: "flex",
                      backgroundColor: "#fff",
                      justifyContent: "center",
                      marginTop: -10,
                    }}
                  >
                    <div>
                      <h2>Creators</h2>
                      <div style={{ display: "flex", alignItems: "center" }}>
                        {community.creatorInfo && (
                          <img
                            src={
                              community.creatorInfo?.imageURL
                                ? community.creatorInfo.imageURL
                                : `${URL()}/assets/anonAvatars/ToyFaces_Colored_BG_${getRandomAvatarNumber()}`
                            }
                            className={"creator_avatar"}
                          />
                        )}
                        {getCreators()
                          .filter((_, index) => index < 3)
                          .map((item, k) => (
                            <img
                              key={k}
                              src={
                                item.userData?.imageURL
                                  ? item.userData.imageURL
                                  : `${URL()}/assets/anonAvatars/ToyFaces_Colored_BG_${getRandomAvatarNumber()}`
                              }
                              className={"creator_avatar"}
                            />
                          ))}
                        {getCreators().length > 3 && (
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontSize: "12px",
                              height: "40px",
                              width: "40px",
                              marginLeft: "-8px",
                              textAlign: "center",
                              borderRadius: "20px",
                              background: Gradient.Magenta,
                            }}
                          >
                            <span>+{getCreators().length - 3}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  {community && community.creatorInfo && (
                    <div
                      style={{
                        position: "absolute",
                        bottom: "-20px",
                        right: "8px",
                        color: "#db00ff",
                        fontSize: "12px",
                        marginTop: "10px",
                        cursor: "pointer",
                      }}
                      onClick={() => {
                        setOpenCreatorsModal(true);
                      }}
                    >
                      <span className="communityAddress">
                        View All
                        <img
                          src={pinkArrowIcon}
                          alt={"info"}
                          style={{ marginLeft: "4px", marginRight: "4px" }}
                        />
                      </span>
                    </div>
                  )}
                </div>

                <div className="members-div">
                  <div>
                    <h2>🌟 Members</h2>
                    <div>{community.membersIdArray ? community.membersIdArray.length : 0}</div>
                  </div>
                </div>
                {community.TokenSymbol && (
                  <div className="members-div">
                    <div>
                      <h2>💰 Community Token</h2>
                      <h3 style={{ fontSize: 16, marginLeft: 25 }}>{community.TokenSymbol}</h3>
                    </div>
                  </div>
                )}
                <div className="joining-rules-div">
                  <div>
                    <div className="joining-rules-title" style={{ fontWeight: "bold" }}>
                      Joining rules
                    </div>
                    {(!community.EntryConditions || community.EntryConditions === "Free to join") && (
                      <Box flexDirection="row">
                        <div className="stakeFirst">👍 Free to join</div>
                      </Box>
                    )}
                    {community.EntryConditions === "By request" && (
                      <Box flexDirection="row">
                        <div className="stakeFirst">👍 By request</div>
                        <div className="stakeFirstSubTitle">
                          Your request must be accepted by one of the community founders.
                        </div>
                      </Box>
                    )}
                    {community.EntryConditions === "Stake First" && (
                      <Box flexDirection="row">
                        <div className="stakeFirst">😀 Stake First</div>
                        <div className="stakeFirstSubTitle">
                          To be part of this community you have to stake an amount of{" "}
                          <span className="stakeAmount">
                            {community.RequiredTokens &&
                              community.RequiredTokens.length &&
                              community.RequiredTokens[0].token}{" "}
                            {community.RequiredTokens &&
                              community.RequiredTokens.length &&
                              community.RequiredTokens[0].tokenValue}
                          </span>
                        </div>
                      </Box>
                    )}
                  </div>
                </div>
                <div className="buttons-header-div">
                  {!community?.TokenSymbol && (
                    <SecondaryButton
                      onClick={handleOpenCreateCommunityToken}
                      size="small"
                      ml={2}
                      style={{ width: 125 }}
                    >
                      Create Token
                    </SecondaryButton>
                  )}
                  <SecondaryButton
                    onClick={handleOpenCreateCommunityToken}
                    size="small"
                    ml={2}
                    style={{ margin: 8, width: 125 }}
                  >
                    Edit Rules
                  </SecondaryButton>
                </div>
              </div>
            </>
          </LoadingWrapper>
        </div>
        <div className="header-wrapper-mobile">
          <LoadingWrapper loading={isDataLoading}>
            <div className="mobile-header">
              <div className="community-name">
                <div
                  className="community-image"
                  style={{
                    backgroundImage:
                      community.HasPhoto && urlCommunityPhoto.length > 0 ? urlCommunityPhoto : "none",
                    backgroundRepeat: "no-repeat",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    cursor: user.id === community.Creator ? "pointer" : "auto",
                  }}
                  onClick={() => {
                    let selectedCommunityPhoto = document.getElementById("selectedCommunityPhoto");
                    if (selectedCommunityPhoto) {
                      selectedCommunityPhoto.click();
                    }
                  }}
                />
                <div className="info">
                  <div className="community-info-content">
                    <h2>
                      {community.Name}
                      <span>(culture)</span>
                    </h2>
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <div className="communityAddress">
                        {`@${community.urlSlug ?? community.CommunityAddress ?? idUrl}`}
                      </div>
                      <img
                        src={verifiedMint}
                        alt={"info"}
                        style={{ marginBottom: "4px", width: "12px", height: "12px", marginLeft: "8px" }}
                      />
                      {community.Levels &&
                        community.Levels.filter((_, index) => index < 1).map((item, index) => (
                          <div key={index} className="communityLevel">
                            {item.Name}
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
              </div>

              <Divider />

              <div>
                <div
                  className="creators-div"
                  style={{
                    display: "flex",
                    backgroundColor: "#fff",
                    justifyContent: "center",
                    marginTop: -10,
                  }}
                >
                  <div>
                    <h2>Creators</h2>
                    <div style={{ display: "flex", alignItems: "center" }}>
                      {community.creatorInfo && (
                        <img
                          src={
                            community.creatorInfo?.imageURL
                              ? community.creatorInfo.imageURL
                              : `${URL()}/assets/anonAvatars/ToyFaces_Colored_BG_${getRandomAvatarNumber()}`
                          }
                          className={"creator_avatar"}
                        />
                      )}
                      {getCreators()
                        .filter((_, index) => index < 3)
                        .map((item, k) => (
                          <img
                            key={k}
                            src={
                              item.userData?.imageURL
                                ? item.userData.imageURL
                                : `${URL()}/assets/anonAvatars/ToyFaces_Colored_BG_${getRandomAvatarNumber()}`
                            }
                            className={"creator_avatar"}
                          />
                        ))}
                      {getCreators().length > 3 && (
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "12px",
                            height: "40px",
                            width: "40px",
                            marginLeft: "-8px",
                            textAlign: "center",
                            borderRadius: "20px",
                            background: Gradient.Magenta,
                          }}
                        >
                          <span>+{getCreators().length - 3}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="members-div">
                    <div>
                      <h2>🌟 Members</h2>
                      <div>{community.membersIdArray ? community.membersIdArray.length : 0}</div>
                    </div>
                  </div>
                </div>
              </div>

              <Divider />
              <div className="joining-rules-div">
                <div>
                  <div className="joining-rules-title" style={{ fontWeight: "bold" }}>
                    Joining rules
                  </div>
                  {community.RequiredTokens &&
                    community.RequiredTokens.map((item, index) => (
                      <div key={index} style={{ display: "flex", alignItems: "center" }}>
                        <div className="buyToken">
                          <span style={{ marginRight: "8px" }}>👛</span> Buy {item.tokenValue} {item.token}{" "}
                          Tokens
                        </div>
                      </div>
                    ))}
                  {community.AdditionalRules &&
                    community.AdditionalRules.length > 0 &&
                    community.AdditionalRules.map(
                      (item, index) =>
                        item.Value && (
                          <div key={index} className="level">
                            <div className="circleNumber">{item.Value}</div>
                            <span className="buyToken">
                              {item.Rule} {item.Value}
                            </span>
                          </div>
                        )
                    )}
                </div>
              </div>
            </div>
          </LoadingWrapper>
        </div>
        <div className="page-content">
          <div className="appbar-container sticky">
            <TabNavigation
              tabs={communityMenuOptions}
              currentTab={communityMenuOptions.indexOf(communityMenuSelection)}
              variant="primary"
              onTabChange={handleTabChange}
              padding={0}
            />

            {/* {communityMenuSelection === 0 && community.Creator === user.id ? (
              <button onClick={handleOpenModalCreatePosts} className="create">
                Create posts
              </button>
            ) : null} */}
          </div>
          <div className="content">
            <LoadingWrapper loading={isDataLoading}>
              <>
                {communityMenuSelection === communityMenuDefaultOptions[0] ? (
                  <General
                    community={community}
                    handleRefresh={loadData}
                    isFounder={Object.keys(community?.FoundersMap ?? {}).includes(user.address)}
                  />
                ) : communityMenuSelection === communityMenuDefaultOptions[1] ? (
                  <Discussion community={community} />
                ) : communityMenuSelection === communityMenuDefaultOptions[2] ? (
                  <Voting
                    community={community}
                    isFounder={getCreators().some(f => f.id === user.id) || community.Creator === user.id}
                    handleRefresh={loadData}
                  />
                ) : communityMenuSelection === communityMenuDefaultOptions[3] ? (
                  <Dashboard community={community} />
                ) : communityMenuSelection === communityMenuDefaultOptions[4] ? (
                  <Payments community={community} handleRefresh={loadData} />
                ) : communityMenuSelection === communityMenuDefaultOptions[5] ? (
                  <Projects
                    community={community}
                    communityId={community.CommunityAddress}
                    handleRefresh={loadData}
                  />
                ) : communityMenuSelection === communityMenuDefaultOptions[6] ? (
                  <CommunityBlog
                    communityId={community.CommunityAddress}
                    handleOpenModalNewBlogPost={handleOpenModalNewBlogPost}
                  />
                ) : communityMenuSelection === communityMenuDefaultOptions[7] ? (
                  <Treasury
                    communityBalances={communityBalances}
                    treasuryVoting={community.TreasuryVotingsArray || undefined}
                    community={community}
                    handleRefresh={loadData}
                  />
                ) : communityMenuSelection === communityMenuDefaultOptions[8] ? (
                  <Acquisitions community={community} />
                ) : communityMenuSelection === communityMenuDefaultOptions[9] ? (
                  <Members community={community} handleRefresh={loadData} />
                ) : communityMenuSelection === communityMenuDefaultOptions[10] ? (
                  <Jarr community={community} />
                ) : communityMenuSelection === communityMenuDefaultOptions[11] ? (
                  <VestingTaxation community={community} handleRefresh={loadData} />
                ) : communityMenuSelection === communityMenuDefaultOptions[12] ? (
                  <RulesAndLevels community={community} handleRefresh={loadData} />
                ) : (
                  <AboutCommunity community={community} />
                )}
              </>
            </LoadingWrapper>
          </div>
        </div>
      </div>

      {/*modals*/}
      {openCreatorsModal && (
        <CreatorsModal
          open={openCreatorsModal}
          creator={community.creatorInfo}
          others={getCreators()}
          title="Creators"
          setOpenModal={() => setOpenCreatorsModal(false)}
        />
      )}
      <CreatePostModal
        open={openModalCreatePosts}
        handleRefresh={() => {
          loadData();
        }}
        handleClose={handleCloseModalCreatePosts}
        communityId={community.CommunityAddress}
        type={"CommunityPost"}
      />
      <CreateBlogPostModal
        open={openModalNewBlogPost}
        onClose={handleCloseModalNewBlogPost}
        communityId={community.CommunityAddress}
        type={"Post"}
        handleRefresh={() => {
          loadData();
        }}
      />
      <Dialog
        className="modalCreateModal"
        open={openModalCreateBadge}
        onClose={handleCloseModalCreateBadge}
        fullWidth={true}
        maxWidth={"md"}
      >
        <CreateBadge
          onCloseModal={handleCloseModalCreateBadge}
          handleRefresh={() => {
            loadData();
          }}
          community={community}
        />
      </Dialog>
      <Dialog
        className="modalCreateModal"
        open={openModalPostProject}
        onClose={handleCloseModalPostProject}
        fullWidth={true}
        maxWidth={"md"}
      >
        <PostProject
          open={openModalPostProject}
          onCloseModal={handleCloseModalPostProject}
          handleRefresh={loadData}
          community={community}
        />
      </Dialog>
      <Dialog
        className="modal"
        open={openModalEdit}
        onClose={handleCloseModalEdit}
        fullWidth={true}
        maxWidth={"md"}
      >
        <CommunityModalEdit community={community} onCloseModal={handleCloseModalEdit} />
      </Dialog>
      <CreateCommunityTokenModal
        open={openCreateCommunityToken}
        handleRefresh={loadData}
        handleClose={handleCloseCreateCommunityToken}
        communityAddress={community.CommunityAddress}
        community={community}
      />

      {status ? <AlertMessage message={status.msg} variant={status.variant} /> : ""}
    </div>
  );
}
