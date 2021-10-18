import React, { useEffect, useState } from "react";
import Axios from "axios";
import InfiniteScroll from "react-infinite-scroll-component";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import axios from "axios";

import { Fade, FormControl, Grid, Modal, Tooltip } from "@material-ui/core";
import { RootState } from "store/reducers/Reducer";
import CommunityCard from "components/legacy/Communities/components/CommunityCard";
import { socket } from "../../../../../../Login/Auth";

import URL from "shared/functions/getURL";
import { StyledMenuItem, StyledSelect } from "shared/ui-kit/Styled-components/StyledComponents";
import useWindowDimensions from "shared/hooks/useWindowDimensions";
import Chat from "shared/ui-kit/Page-components/Chats/Chat/Chat";
import AlertMessage from "shared/ui-kit/Alert/AlertMessage";

import "./MediaModal.css";
import { LoadingWrapper } from "shared/ui-kit/Hocs";

import SvgIcon from "@material-ui/core/SvgIcon";
import { ReactComponent as PlaySolid } from "assets/icons/play-solid.svg";
import InputWithLabelAndTooltip from "shared/ui-kit/InputWithLabelAndTooltip";

const underConstruction: any[] = [
  require("assets/underConstruction/99-993812_3d-mnnchen-messen-hd-png-download.png"),
  require("assets/underConstruction/images.jpeg"),
];

const infoIcon = require("assets/icons/info.svg");

//TODO: create offer ? on the second tab there's:
//-offerToken (string)
//-offerAmount (number)
//-selectedCommunity (community address)
//to create an offer

//TODO: set/create chat
//NOTE: chat users should currently be updated when clicking a community card (admins are added)

export default function MediaModal(props: any) {
  const user = useSelector((state: RootState) => state.user);
  const users = useSelector((state: RootState) => state.usersInfoList);

  const { width } = useWindowDimensions();

  const history = useHistory();
  const dispatch = useDispatch();

  const [mediaTab, setMediaTab] = useState<number>(0);

  /*----- COMMUNITY TAB -----*/
  const [offerTokenName, setOfferTokenName] = useState<string>("");
  const [offerToken, setOfferToken] = useState<string>("");
  const [offerAmount, setOfferAmount] = useState<number>(0);
  const [tokenObjs, setTokenObjs] = useState<any[]>([
    { token: "ETH", name: "Ethereum" },
    { token: "PRIVI", name: "Privi Coin" },
    { token: "BC", name: "Base Coin" },
    { token: "DC", name: "Data Coin" },
  ]);
  const [tokenNames, setTokenNames] = useState<string[]>([
    "Ethereum",
    "Privi Coin",
    "Base Coin",
    "Data Coin",
  ]);

  const [selectedCommunity, setSelectedCommunity] = useState<string>("");
  const [communitySearchValue, setCommunitySearchValue] = useState<string>("");
  const [communitiesFullList, setCommunitiesFullList] = useState<any[]>([]);
  const [communitiesLoading, setCommunitiesLoading] = useState<boolean>(true);
  const [filteredCommunitiesList, setFilteredCommunitiesList] = useState<any[]>([]);
  const [hasMoreInfiniteLoader, setHasMoreInfiniteLoader] = useState<boolean>(false);
  const [pagination, setPagination] = useState<number>(0);

  /*----- CHAT -----*/
  const [chats, setChats] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [chat, setChat] = useState<any>({});
  const [chatUsers, setChatUsers] = useState<any[]>([]);
  const [selectedUser, setSelectedUser] = useState<any>({});
  const [actualUserPage, setActualUserPage] = useState<number>(1);
  const [totalUserPages, setTotalUserPages] = useState<number>(1);

  const [mediaMarketing, setMediaMarketing] = useState<any[]>([]);
  const [chatUsersLoading, setChatUsersLoading] = useState<boolean>(false);

  const [status, setStatus] = useState<any>("");

  /*--------------------- LOAD DATA -------------------*/

  // get token list from backend
  useEffect(() => {
    Axios.get(`${URL()}/wallet/getCryptosRateAsList`).then(res => {
      const resp = res.data;
      if (resp.success) {
        let firstTokenOfTheList;
        const tokenNamesList: string[] = []; // list of tokenSymbolList
        const tokenObjList: any[] = [];
        const data = resp.data;
        data.forEach(rateObj => {
          if (!firstTokenOfTheList) firstTokenOfTheList = rateObj.token;
          tokenObjList.push({ token: rateObj.token, name: rateObj.name });
          tokenNamesList.push(rateObj.name);
        });
        setTokenObjs(tokenObjList);
        setTokenNames(tokenNamesList); // update tokenSymbolList lists
        setOfferToken(tokenObjList[0].token);
        setOfferTokenName(tokenNamesList[0]);
      } else {
        setOfferToken("PRIVI");
        setOfferTokenName("PRIVI");
      }
    });

    //load communities
    loadCommunities();

    //load chat users info
    if (users && users.length > 0) {
      const usersList = [] as any;
      if (props.media.Creator) {
        const mediaCreator = {
          type: "Media Creator",
          userName: users[users.findIndex(user => user.id === props.media.Creator)].name,
          userId: users[users.findIndex(user => user.id === props.media.Creator)].id,
          imageURL: users[users.findIndex(user => user.id === props.media.Creator)].imageURL,
        };
        if (usersList && !usersList.some(user => user.userId === mediaCreator.userId)) {
          usersList.push(mediaCreator);
        }
      }
      if (props.media.Requester) {
        const mediaRequester = {
          type: "Media Requester",

          userName: users[users.findIndex(user => user.id === props.media.Requester)].name,
          userId: users[users.findIndex(user => user.id === props.media.Requester)].id,
          imageURL: users[users.findIndex(user => user.id === props.media.Requester)].imageURL,
        };
        if (usersList && !usersList.some(user => user.userId === mediaRequester.userId)) {
          usersList.push(mediaRequester);
        }
      }
      if (props.media.SavedCollabs && props.media.SavedCollabs.length > 0) {
        props.media.SavedCollabs.forEach(collaborator => {
          const mediaCollaborator = {
            type: "Media Collaborator",
            userName: users[users.findIndex(user => user.id === collaborator.id)].name,
            userId: users[users.findIndex(user => user.id === collaborator.id)].id,
            imageURL: users[users.findIndex(user => user.id === collaborator.id)].imageURL,
          };
          if (usersList && !usersList.some(user => user.userId === mediaCollaborator.userId)) {
            usersList.push(mediaCollaborator);
          }
        });
      }

      setChatUsers(usersList);
      setSelectedUser(usersList[0]);
      setTotalUserPages(Math.ceil(usersList.length / 6));
    }
  }, [users]);

  //load community members to access the chat
  useEffect(() => {
    if (selectedCommunity !== "") {
      const config = {
        params: {
          communityAddress: selectedCommunity,
        },
      };
      setChatUsersLoading(true);
      Axios.get(`${URL()}/community/getMembersData`, config)
        .then(response => {
          const resp = response.data;
          if (resp.success && resp.data && resp.data.members) {
            const data = resp.data.members;

            const usersList = [...chatUsers];

            data.forEach(member => {
              if (member.Roles.includes("Admin")) {
                const CommunityAdmin = {
                  type: "Community Admin",
                  userName: users[users.findIndex(user => user.id === member.id)].name,
                  userId: users[users.findIndex(user => user.id === member.id)].id,
                  imageURL: users[users.findIndex(user => user.id === member.id)].imageURL,
                };

                if (usersList && !usersList.some(user => user.userId === CommunityAdmin.userId)) {
                  usersList.push(CommunityAdmin);
                }
              }
            });

            setChatUsers(usersList);
            setTotalUserPages(Math.ceil(usersList.length / 6));
          } else {
            console.log("Error getting members data");
          }
          setChatUsersLoading(false);
        })
        .catch(error => {
          console.log(error);
          setChatUsersLoading(false);
        });
    }
  }, [selectedCommunity]);

  useEffect(() => {
    if (mediaTab === 2) {
      getChatInfo();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mediaTab]);

  const getChatInfo = () => {
    axios
      .get(`${URL()}/media/marketingMediaCommunity/getMediaChats/${props.media.MediaSymbol}/${user.id}`)
      .then(response => {
        if (response.data.success) {
          setChats(response.data.data);
        } else {
          console.log(response.data.error);
        }
      })
      .catch(error => {
        console.log(error);
      });
  };

  const createChat = (user: any) => {
    axios
      .get(
        `${URL()}/media/marketingMediaCommunity/createMediaChats/${props.media.MediaSymbol
        }/${"communityID"}/${user.id}`
      )
      .then(async response => {
        if (response.data.success) {
          setChat(response.data.data);
          let msgs = await getMessages(response.data.data);

          socket.emit("subscribe-marketing-media-community", {
            mediaId: props.media.MediaSymbol,
            communityId: "communityID",
            userId: user.id,
          });
        }
      })
      .catch(error => {
        console.log(error);
      });
  };

  const getMessages = (chat: any): Promise<any[]> => {
    return new Promise((resolve, reject) => {
      axios
        .get(
          `${URL()}/media/marketingMediaCommunity/getMessages/${props.media.MediaSymbol}/${"communityID"}/${user.id
          }`
        )
        .then(response => {
          if (response.data.success) {
            setMessages(response.data.data);
            resolve(response.data.data);
          }
        })
        .catch(error => {
          console.log(error);
        });
    });
  };

  /*------------------ COMMUNITIES FUNCTIONS ----------------------*/
  //load communities
  const loadCommunities = () => {
    setCommunitiesLoading(true);

    Axios.get(`${URL()}/community/getCommunities/${0}/${null}`)
      .then(res => {
        const resp = res.data;
        if (resp.success) {
          const data = resp.data;

          let allCommunities = data.all ?? [];

          if (users && users.length > 0) {
            allCommunities.forEach((community, index) => {
              //load creator data
              if (users && users.some(user => user.id === community.Creator)) {
                const thisUser = users[users.findIndex(user => user.id === community.Creator)];
                allCommunities[index].userData = {
                  name: thisUser.name,
                  imageURL: thisUser.imageURL,
                };
              }

              community.Members?.forEach(member => {
                if (users.some(user => user.id === member.id)) {
                  const thisUser = users[users.findIndex(user => user.id === member.id)];
                  member.imageURL = thisUser.imageURL;
                }
              });

              //load last month users
              if (community.Members && typeof community.Members[Symbol.iterator] === "function") {
                let totalMembers = 0;
                let thisMonthMembers = 0;
                community.Members.forEach(member => {
                  totalMembers = totalMembers++;
                  if (
                    new Date(member.date).getMonth() === new Date().getMonth() &&
                    new Date(member.date).getFullYear() === new Date().getFullYear()
                  ) {
                    thisMonthMembers = thisMonthMembers++;
                  }
                });
                allCommunities[index].membersGrowth = totalMembers - thisMonthMembers;
              } else {
                allCommunities[index].membersGrowth = 0;
              }
            });
          }
          setCommunitiesFullList(allCommunities);
          setFilteredCommunitiesList(allCommunities);

          if (allCommunities && allCommunities.length < 6) {
            setHasMoreInfiniteLoader(false);
          } else {
            setHasMoreInfiniteLoader(true);
          }
        } else {
          setHasMoreInfiniteLoader(false);
        }
        setCommunitiesLoading(false);
      })
      .catch(() => {
        setCommunitiesLoading(false);
      });
  };

  //filter communitites
  useEffect(() => {
    const communityFilterfunctions = async () => {
      setCommunitiesLoading(true);

      let communities: any[] = [];
      let communitiesListToFilter: any[] = [...communitiesFullList];

      //filter by user input
      if (communitiesListToFilter.length > 0 && communitySearchValue !== "") {
        communitiesListToFilter.forEach((value: any) => {
          if (value.Hashtags && value.Hashtags.length > 0 && communitySearchValue.includes("#")) {
            value.Hashtags.forEach((hashtag: string) => {
              if (hashtag.toUpperCase().includes(communitySearchValue.slice(1).toUpperCase())) {
                communities.push(value);
              }
            });
          } else if (
            communitySearchValue.length > 0 &&
            value.Name &&
            value.Name.toUpperCase().includes(communitySearchValue.toUpperCase())
          ) {
            communities.push(value);
          } else if (communitySearchValue === "") {
            communities.push(value);
          }
        });
      }

      setFilteredCommunitiesList(communitiesListToFilter);
      setCommunitiesLoading(false);
    };

    communityFilterfunctions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [communitySearchValue]);

  const fetchDataCommunities = page => {
    let lastId = filteredCommunitiesList[filteredCommunitiesList.length - 1].CommunityAddress;
    //(lastId);
    Axios.get(`${URL()}/community/getCommunities/${page}/${lastId}`)
      .then(res => {
        const resp = res.data;
        if (resp.success) {
          const communities = resp.data.all;

          if (communities && communities.length === 0) {
            setHasMoreInfiniteLoader(false);
          } else {
            if (users && users.length > 0) {
              communities.forEach((community, index) => {
                //load creator data
                if (users && users.some(user => user.id === community.Creator) && !community.userData) {
                  const thisUser = users[users.findIndex(user => user.id === community.Creator)];
                  communities[index].userData = {
                    name: thisUser.name,
                    imageURL: thisUser.imageURL,
                  };
                }

                community.Members?.forEach(member => {
                  if (users.some(user => user.id === member.id)) {
                    const thisUser = users[users.findIndex(user => user.id === member.id)];
                    member.imageURL = thisUser.imageURL;
                  }
                });
              });
            }

            let allCommunities = communitiesFullList.concat(communities);

            setCommunitiesFullList(allCommunities);
            setFilteredCommunitiesList(allCommunities);
          }
        }
      })
      .catch(error => {
        console.log(error);
      });
  };

  const loaderGetData = () => {
    let page: number = pagination + 1;
    setPagination(page);
    fetchDataCommunities(page);
  };

  const handleCreateOffer = () => {
    let body: any = {};
    body.PodAddress = props.media.PodAddress;
    body.MediaSymbol = props.media.MediaSymbol;
    body.CommunityAddress = selectedCommunity;
    body.PaymentDate = Date.now();
    body.Token = offerToken;
    body.Amount = offerAmount;
    body.Status = "pending";

    axios.post(`${URL()}/media/marketingMediaCommunity/addOffer`, body).then(response => {
      const resp = response.data;
      if (resp.success) {
        setOfferAmount(0);
        setOfferToken(tokenObjs[0].token);
        setOfferTokenName(tokenNames[0]);
        setStatus({
          msg: "Offer done",
          key: Math.random(),
          variant: "success",
        });
      } else {
        setStatus({
          msg: resp.error || "Error making offer",
          key: Math.random(),
          variant: "error",
        });
      }
    });
  };

  const getMediaMarketingOffers = () => {
    axios
      .get(
        `${URL()}/media/marketingMediaCommunity/getMediaOffers/${props.media.PodAddress}/${props.media.MediaSymbol
        }`
      )
      .then(res => {
        const resp = res.data;
        if (resp.success) {
          setMediaMarketing(resp.data);
        }
      })
      .catch(error => {
        console.log(error);
      });
  };

  const getRandom = (endNumber): number => {
    let random = Math.floor(Math.random() * endNumber) + 1;
    return random;
  };

  const getUnderConstruction = () => {
    return underConstruction[getRandom(2) - 1];
  };

  /*------------------- COMPONENTS -----------------------*/
  const RoundUser = (propsFunction: any) => {
    return (
      <div className="sideBarUser" onClick={() => setSelectedUser(propsFunction.user)}>
        <div
          className="sideBarUserImg"
          style={{
            backgroundImage:
              propsFunction.user && propsFunction.user.imageURL && propsFunction.user.imageURL !== ""
                ? `url(${propsFunction.user.imageURL})`
                : "none",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
            borderRadius: "50%",
          }}
        />
      </div>
    );
  };

  /*------------------ MODAL COMPONENT---------------------*/
  return (
    <Modal open={props.open} onClose={props.handleClose} className="modal">
      <div className="media-modal modal-content">
        <div className="exit" onClick={props.handleClose}>
          <img src={require("assets/icons/x_darkblue.png")} alt={"x"} />
        </div>

        <div className="cards-options" style={{ display: "flex" }}>
          <button className={mediaTab === 0 ? "selected" : "unselected"} onClick={() => setMediaTab(0)}>
            General
          </button>
          {props.media && user && (user.id === props.media.Creator || user.id === props.media.Requester) ? (
            <button className={mediaTab === 1 ? "selected" : "unselected"} onClick={() => setMediaTab(1)}>
              Communities
            </button>
          ) : null}
          {props.media &&
            user &&
            (user.id === props.media.Creator ||
              user.id === props.media.Requester ||
              (props.media.SavedCollabs && props.media.SavedCollabs.some(collab => collab.id === user.id))) ? (
            <button
              className={mediaTab === 2 ? "selected" : "unselected"}
              onClick={() => {
                setMediaTab(2);
                getMediaMarketingOffers();
              }}
            >
              Chat
            </button>
          ) : null}
        </div>

        {mediaTab === 0 ? (
          /*------------ GENERAL TAB ------------*/
          <div className={"media-info"}>
            <div>
              {props.media.HasPhoto ? (
                <div
                  className="media-image"
                  style={{
                    backgroundImage: props.media.HasPhoto
                      ? `url(${URL()}/media/getMediaMainPhoto/${props.media.MediaSymbol.replace(/\s/g, "")})`
                      : "none",
                    backgroundRepeat: "no-repeat",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                />
              ) : (
                <div
                  className="media-image"
                  style={{
                    backgroundImage: `url(${getUnderConstruction()})`,
                    backgroundRepeat: "no-repeat",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                />
              )}
              <button onClick={() => history.push(`/media/${props.media.MediaSymbol}`)}>
                Open Media page
              </button>
            </div>
            <div>
              <h3>{props.media.MediaName}</h3>
              <span>@{props.media.MediaSymbol}</span>
              <p>{props.media.Description}</p>
            </div>
          </div>
        ) : mediaTab === 1 && (user.id === props.media.Creator || user.id === props.media.Requester) ? (
          /*----------- COMMUNITIES TAB -------------*/
          <div className="communities">
            <h3>Select community to make the first offer</h3>
            <div
              className="flexRowInputs"
              style={{
                justifyContent: "space-between",
                width: "100%",
                marginTop: "10px",
              }}
            >
              <div
                style={{
                  width: "30%",
                  borderRadius: "0",
                }}
                className="filters"
              >
                Filter communities
                <label>
                  <img src={require("assets/icons/search_right_blue.png")} alt={"search"} />
                  <InputWithLabelAndTooltip
                    type='text'
                    placeHolder="name, #hashtag..."
                    inputValue={communitySearchValue}
                    onInputValueChange={e => setCommunitySearchValue(e.target.value)}
                  />
                </label>
              </div>
              <div style={{ width: "30%" }}>
                <div className="flexRowInputs">
                  <div className="infoHeaderCreatePod">Funding Token</div>
                  <Tooltip
                    TransitionComponent={Fade}
                    TransitionProps={{ timeout: 600 }}
                    arrow
                    className="tooltipHeaderInfo"
                    title={`The price of the community token is fixed by an AMM (basically a curve [community token supply, funding token price]). So the funding token is actually the token that you need to buy community tokens with, and that goes to the Pool of the AMM. Then, community tokens can also be bought with other tokens (apart from the funding token) by means of liquidity pools. All this works automatically, it will convert 'desired payment token' to 'funding token' then will get converted into 'community token'.`}
                  >
                    <img className="infoIconCreatePod" src={infoIcon} alt={"info"} />
                  </Tooltip>
                </div>
                <div className="selector-with-token">
                  {offerToken && offerToken.length > 0 ? (
                    <img
                      className="imgSelectorTokenAddLiquidityModal"
                      src={require(`assets/tokenImages/${offerToken}.png`)}
                      alt={offerToken}
                    />
                  ) : (
                    <div
                      style={{
                        width: 30,
                        height: 30,
                        borderRadius: 15,
                        backgroundColor: "656e7e",
                        margin: "0px 10px",
                      }}
                    />
                  )}
                  <div style={{ width: "calc(100% - 50px)" }}>
                    <FormControl className="selectorFormControlCreatePod">
                      <StyledSelect
                        disableUnderline
                        value={offerTokenName}
                        className="selectCreatePod"
                        onChange={e => {
                          setOfferToken(e.target.value as string);
                          const t = tokenObjs.find(token => token.name === e.target.value);
                          setOfferToken(t.token);
                        }}
                      >
                        {tokenNames.map((item, i) => {
                          return (
                            <StyledMenuItem key={i} value={item}>
                              {item}
                            </StyledMenuItem>
                          );
                        })}
                      </StyledSelect>
                    </FormControl>
                  </div>
                </div>
              </div>
              <div style={{ width: "30%" }}>
                <div className="flexRowInputs">
                  <div className="infoHeaderCreatePod">Amount</div>
                  <Tooltip
                    TransitionComponent={Fade}
                    TransitionProps={{ timeout: 600 }}
                    arrow
                    className="tooltipHeaderInfo"
                    title={"Amount to make first offer"}
                  >
                    <img className="infoIconCreatePod" src={infoIcon} alt={"info"} />
                  </Tooltip>
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "flex-start",
                    alignItems: "center",
                  }}
                >
                  <InputWithLabelAndTooltip
                    overriedClasses="textFieldCreatePod"
                    type={"Number"}
                    minValue={'0.001'}
                    inputValue={`${offerAmount}`}
                    onInputValueChange={e => {
                      setOfferAmount(Number(e.target.value));
                    }}
                    placeHolder={"Input amount"}
                  />
                </div>
              </div>
            </div>
            <InfiniteScroll
              dataLength={filteredCommunitiesList.length}
              scrollableTarget="scrollableDivCommunities"
              next={loaderGetData}
              hasMore={hasMoreInfiniteLoader}
              loader={<LoadingWrapper loading />}
            >
              <div className="communities-container">
                <LoadingWrapper loading={communitiesLoading}>
                  {filteredCommunitiesList.length > 0 ? (
                    <div className="cards-grid">
                      <div className="column">
                        {filteredCommunitiesList.map((item, index) =>
                          (width >= 1200 && index < filteredCommunitiesList.length / 3) ||
                            (width < 1200 && width >= 800 && index < filteredCommunitiesList.length / 2) ||
                            width < 800 ? (
                            <CommunityCard
                              selected={item.CommunityAddress === selectedCommunity}
                              community={item}
                              key={`${index}-card`}
                              disableClick={true}
                              onClick={() => {
                                setSelectedCommunity(item.CommunityAddress);
                              }}
                            />
                          ) : null
                        )}
                      </div>
                      {width >= 800 ? (
                        <div className="column">
                          {filteredCommunitiesList.map((item, index) =>
                            (width < 1510 &&
                              width >= 1200 &&
                              index >= filteredCommunitiesList.length / 3 &&
                              index < (filteredCommunitiesList.length / 3) * 2) ||
                              (width < 1200 && width >= 800 && index > filteredCommunitiesList.length / 2) ? (
                              <CommunityCard
                                selected={item.CommunityAddress === selectedCommunity}
                                community={item}
                                key={`${index}-card`}
                                disableClick={true}
                                onClick={() => {
                                  setSelectedCommunity(item.CommunityAddress);
                                }}
                              />
                            ) : null
                          )}
                        </div>
                      ) : null}
                      {width >= 1200 ? (
                        <div className="column">
                          {filteredCommunitiesList.map((item, index) =>
                            width < 1510 &&
                              width >= 1200 &&
                              index >= (filteredCommunitiesList.length / 3) * 2 ? (
                              <CommunityCard
                                selected={item.CommunityAddress === selectedCommunity}
                                community={item}
                                key={`${index}-card`}
                                disableClick={true}
                                onClick={() => {
                                  if (item.CommunityAddress === selectedCommunity) {
                                    setSelectedCommunity("");
                                  } else setSelectedCommunity(item.CommunityAddress);
                                }}
                              />
                            ) : null
                          )}
                        </div>
                      ) : null}
                    </div>
                  ) : (
                    <div className="no-pods">No communities to show</div>
                  )}
                </LoadingWrapper>
              </div>
            </InfiniteScroll>
            <button onClick={handleCreateOffer}>Create offer</button>
          </div>
        ) : mediaTab === 2 &&
          ((props.media && user.id === props.media.Creator) ||
            user.id === props.media.Requester ||
            props.media.SavedCollabs.some(collab => collab.id === user.id)) ? (
          /*------------- CHAT TAB -------------*/
          <div className="chat">
            {chat && chat.room ? (
              <Chat
                chat={chat}
                wip={true}
                chatsUsers={chatUsers}
                mediaMarketing={true}
                messages={messages}
                mediaId={props.media.mediaId}
                communityId={"communityId"}
                getMessages={() => getMessages({})}
              />
            ) : (
              <div />
            )}
            <div className="sidebar">
              <div className="sideBarTitle">
                <img src={require("assets/icons3d/team.png")} alt={"team"} />
                Chat Users
              </div>
              <LoadingWrapper loading={chatUsersLoading}>
                <Grid
                  container
                  style={{ marginBottom: "15px" }}
                  spacing={0}
                  direction="row"
                  alignItems="flex-start"
                  justify="center"
                >
                  <Grid item xs={12} sm={5}>
                    <div className="sideBarSelectedImage">
                      <div
                        className="sideBarSelectedImageImg"
                        onClick={() => {
                          history.push(`/profile/${selectedUser.userId}`);
                          dispatch(setSelectedUser(selectedUser.userId));
                        }}
                        style={{
                          backgroundImage:
                            selectedUser && selectedUser.imageURL ? `url(${selectedUser.imageURL})` : "none",
                          backgroundPosition: "center",
                          backgroundRepeat: "no-repeat",
                          backgroundSize: "cover",
                          borderRadius: "50%",
                        }}
                      />
                    </div>
                    <div
                      className="sideBarSelectedTitle"
                      onClick={() => {
                        history.push(`/profile/${selectedUser.userId}`);
                        dispatch(setSelectedUser(selectedUser.userId));
                      }}
                    >
                      {selectedUser && selectedUser.userName ? selectedUser.userName : null}
                    </div>
                    <div className="sideBarSelectedSubtitle">
                      {selectedUser && selectedUser.type ? selectedUser.type : null}
                    </div>
                  </Grid>
                  <Grid item xs={12} sm={7}>
                    <div className="sideBarRowFlexRoundUser">
                      {chatUsers.map((user, i) => {
                        if (i >= (actualUserPage - 1) * 6 && i < actualUserPage * 6) {
                          return <RoundUser key={i} user={user} />;
                        } else return null;
                      })}
                    </div>
                    {totalUserPages !== 1 ? (
                      <div className="sideBarUsersNumPages">
                        <img
                          style={{
                            marginRight: "5px",
                            fontSize: "12px",
                            cursor: "pointer",
                          }}
                          src={require("assets/icons/caret-left-solid.svg")}
                          alt={"caret-left-solid"}
                          onClick={() => {
                            if (actualUserPage > 1) {
                              setActualUserPage(actualUserPage - 1);
                            }
                          }}
                        />
                        {actualUserPage} / {totalUserPages}
                        <div
                          style={{
                            marginLeft: "5px",
                            fontSize: "12px",
                            cursor: "pointer",
                          }}
                          onClick={() => {
                            if (actualUserPage < totalUserPages) {
                              setActualUserPage(actualUserPage + 1);
                            }
                          }}
                        >
                          <SvgIcon>
                            <PlaySolid />
                          </SvgIcon>
                        </div>
                      </div>
                    ) : null}
                  </Grid>
                </Grid>
              </LoadingWrapper>
            </div>
          </div>
        ) : null}
        {status && (
          <AlertMessage
            key={status.key}
            message={status.msg}
            variant={status.variant}
            onClose={() => setStatus(undefined)}
          />
        )}
      </div>
    </Modal>
  );
}
