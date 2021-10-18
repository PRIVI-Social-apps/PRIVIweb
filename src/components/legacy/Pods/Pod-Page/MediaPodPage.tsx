import React, { useState, useEffect, useRef } from "react";
import { useTypedSelector } from "store/reducers/Reducer";
import "./MediaPodPage.css";
import axios from "axios";
import URL from "shared/functions/getURL";
import "shared/ui-kit/Modal/Modals/Modal.css";
import AlertMessage from "shared/ui-kit/Alert/AlertMessage";

import Discord from "shared/ui-kit/Page-components/Discord/Discord";
import Discussions from "./components/MediaPod/Discussions";
import Chat from "shared/ui-kit/Chat";
import Media from "./components/MediaPod/Media";
import Investments from "./components/MediaPod/Investments";

import { useHistory } from "react-router-dom";
import { setSelectedUser } from "store/actions/SelectedUser";
import { useDispatch } from "react-redux";

import UpdateBalance from "shared/connectors/bridge/classes/UpdateBalance";
import { sumTotalViews } from "shared/functions/totalViews";
import { PrimaryButton, TabNavigation } from "shared/ui-kit";
import { ChevronIconLeft } from "shared/ui-kit/Icons";
import InputWithLabelAndTooltip from "shared/ui-kit/InputWithLabelAndTooltip";

const priceIcon = require("assets/icons/price.png");
const investorShareIcon = require("assets/icons/inverstor_share.png");
const investorsIcon = require("assets/icons/investors.png");
const raiseFundIcon = require("assets/icons/raise_fund.png");
const marketCap = require("assets/icons/market_cap.png");
const supplyReleaseIcon = require("assets/icons/supply_release.png");

//tabs
const podsMenuOptions = ["Media", "Investments", "Jarr", "Discussions", "Chat"];
declare let window: any;

export default function MediaPodPage() {
  const user = useTypedSelector(state => state.user);
  const users = useTypedSelector(state => state.usersInfoList);

  const dispatch = useDispatch();
  const history = useHistory();

  const inputRef = useRef<any>();

  const [status, setStatus] = React.useState<any>("");
  const [pod, setPod] = useState<any>({});
  const [medias, setMedias] = useState<any[]>([]);
  const [filteredMedias, setFilteredMedias] = useState<any[]>([]);
  const [mediaSearch, setMediaSearch] = useState<string>("");
  const [creators, setCreators] = useState<any[]>([]);
  const [mediasOnCommunity, setMediasOnCommunity] = useState<any>({});

  const [marketPrice, setMarketPrice] = useState<number>(0);

  const [followed, setFollowed] = useState<boolean>(false);
  const [userCollaborator, setUserCollaborator] = useState<boolean>(false);

  const [URLPodPhoto, setURLPodPhoto] = useState<string>("");

  const [ratesMaps, setRatesMaps] = useState<any>({});

  // modal controller
  const [openModalEdit, setOpenModalEdit] = useState<boolean>(false);

  /**
   * As connecting to wallet providers done at Redux level and it has been set to user's state!
   * We start using web3 once the state variable is avaialable.
   */
  useEffect(() => {
    axios
      .get(`${URL()}/wallet/getCryptosRateAsMap`)
      .then(res => {
        const resp = res.data;
        if (resp.success) {
          setRatesMaps(resp.data);
        }
      })
      .catch(err => console.log(err));
  }, []);
  /*
  useEffect(() => {
    // Save web3 in state
    const load = async () => {
      let web3: any;
      // Ask User permission to connect to Ethereum (Metamask)
      if (window.ethereum) {
        web3 = new Web3(window.ethereum);
        await window.ethereum.request({ method: "eth_requestAccounts" }).then(newAccounts => {
          //console.log("connect metamask account", newAccounts);
          dispatch(setEthAccount(newAccounts[0], "injected"));
        });
      } else if (window.web3) {
        web3 = new Web3(window.web3.currentProvider);
      } else {
        window.console.log(
          "Non-Ethereum browser detected. Please install MetaMask extension in your browser"
        );
        return;
      }
      dispatch(setWeb3(web3));
    };
    if (!user.web3) load();
  }, [user]);
*/
  const updateBalance = new UpdateBalance();

  /**
   * Seting chain id state and once we have chain id we consult balances of the connected wallet
   */

  useEffect(() => {
    if (typeof user.web3 !== "undefined" && typeof user.ethAccount !== undefined && user.ethAccount !== "") {
      const load = async () => {
        try {
          updateBalance.updateAccount(user.web3, user.ethAccount);
        } catch (error) {
          //console.log("setChainId:", error);
        }
      };
      load();
    }
  }, [user.web3, user.ethAccount]);

  const handleOpenModalEdit = () => {
    setOpenModalEdit(true);
  };
  const handleCloseModalEdit = () => {
    setOpenModalEdit(false);
  };

  let pathName = window.location.href; // If routing changes, change to pathname
  let idUrl = pathName.split("/")[6];
  const [podId, setPodId] = useState<string>("");

  const [podMenuSelection, setPodMenuSelection] = useState<number>(0);
  const [currentPodsMenuOptions, setCurrentPodsMenuOptions] = useState<string[]>([]);
  const [loaderData, setLoaderData] = useState<boolean>(false);

  useEffect(() => {
    if (currentPodsMenuOptions[podMenuSelection] === "Chat") {
      getMediasOnCommunity();
    }
  }, [podMenuSelection]);

  // get id from url
  useEffect(() => {
    if (idUrl) {
      axios
        .get(`${URL()}/mediaPod/getIdFromSlug/${idUrl}/mediapod`)
        .then(response => {
          if (response.data.success) {
            const id = response.data.data.id;
            setPodId(id);
          } else {
            setPodId(idUrl);
            //console.log(response.data.message);
          }
        })
        .catch(error => {
          console.log(error);
          setStatus({
            msg: "Error getting pod id",
            key: Math.random(),
            variant: "error",
          });
        });
    }
  }, [idUrl]);

  useEffect(() => {
    if (pod && pod.PodAddress) {
      axios
        .get(`${URL()}/mediaPod/getBuyingPodFundingTokenAmount/?PodAddress=${pod.PodAddress}&Amount=1`)
        .then(res => {
          const resp = res.data;
          if (resp.success) {
            setMarketPrice(resp.data);
          }
        })
        .catch(err => {
          console.log("================", err);
        });
    }
  }, [pod.PodAddress]);

  const loadData = async () => {
    if (podId && podId.length > 0) {
      try {
        const response = await axios.get(`${URL()}/mediaPod/getMediaPod/${podId}`);
        const resp = response.data;
        if (resp.success) {
          const podData = resp.data.mediaPod;
          const medias = resp.data.medias;

          sumTotalViews(podData, true);
          let podCopy = { ...podData };
          let p = podCopy.Posts;

          if (users && users.length > 0 && p && typeof p[Symbol.iterator] === "function") {
            p.forEach((post, index) => {
              if (users.some(user => user.id === post.createdBy)) {
                const thisUser = users[users.findIndex(user => user.id === post.createdBy)];
                p[index].userImageURL = thisUser.imageURL;
                p[index].userName = thisUser.name;
              }
            });
            podCopy.Posts = p;
          }

          const responsePosts = await axios.get(`${URL()}/pod/wall/getPodPosts/${podId}`);
          podCopy.PostsArray = responsePosts.data.data;

          setPod(podCopy);

          setCurrentPodsMenuOptions(
            podsMenuOptions.filter(
              value =>
                value !== "Jarr" &&
                (value !== "Investments" || (value === "Investments" && podCopy.Status != "FORMATION")) &&
                (value !== "Chat" || (value === "Chat" && (podCopy.Creator === user.id || userCollaborator)))
            )
          );
          setMedias(medias);
          setFilteredMedias(medias);

          let arts: any[] = [] as any;
          let creator = users.find(userItem => userItem.id === podCopy.Creator);
          arts.push(creator);

          for (let media of medias) {
            let creator = users.find(userItem => userItem.id === media.Creator);
            if (
              arts &&
              arts.length > 0 &&
              arts.findIndex(art => art && art.id && art.id === creator) !== -1
            ) {
              arts.push(creator);
            }

            if (media && media.Collabs && media.Collabs !== {}) {
              let collabs: any[] = [];
              for (const [key, value] of Object.entries(media.Collabs)) {
                collabs.push(key);
              }

              for (let collab of collabs) {
                let usr = users.find(userItem => userItem.id === collab);
                if (usr && arts.findIndex(art => art.id === creator) !== -1) {
                  arts.push(usr);
                }
              }
            }
          }
          setCreators(arts);

          if (podData.HasPhoto && podData.HasPhoto === true) {
            setURLPodPhoto(`url(${podData.Url}?${Date.now()})`);
          }

          // check if user already followed the pod
          const followers: any[] = podData.Followers ?? [];
          if (followers) {
            let followed = false;
            followers.forEach(followerData => {
              if (followerData.id === user.id) {
                followed = true;
              }
            });
            setFollowed(followed);
          }
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  const getMediasOnCommunity = () => {
    let mediaIds: string[] = [];
    for (let media of medias) {
      mediaIds.push(media.id);
    }
    if (mediaIds && mediaIds.length > 0) {
      setLoaderData(true);

      axios
        .post(`${URL()}/mediaOnCommunity/getFromMediaArray`, { medias: mediaIds })
        .then(res => {
          const resp = res.data;
          if (resp.success) {
            setMediasOnCommunity(resp.data);
          }
          setLoaderData(false);
        })
        .catch(() => {
          setLoaderData(false);
        });
    }
  };

  // used to query from backend the needed data for this page
  useEffect(() => {
    if (podId) loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [users, podId]);

  useEffect(() => {
    if (mediaSearch != "") {
      const mediasCopy = [] as any;
      medias.forEach(media => {
        if (
          media.MediaName.toUpperCase().includes(mediaSearch.toUpperCase()) ||
          media.MediaSymbol.toUpperCase().includes(mediaSearch.toUpperCase()) ||
          media.id.toUpperCase().includes(mediaSearch.toUpperCase())
        ) {
          mediasCopy.push(media);
        }
      });

      setFilteredMedias(mediasCopy);
    } else {
      setFilteredMedias(medias);
    }
  }, [mediaSearch]);

  const handleFollow = async () => {
    const body = {
      userId: user.id,
      podId: pod.PodAddress,
      podType: "NFT",
    };
    // follow
    if (!followed) {
      axios.post(`${URL()}/pod/followPod`, body).then(res => {
        const resp = res.data;
        if (resp.success) {
          setStatus({
            msg: "follow success",
            key: Math.random(),
            variant: "success",
          });
          setFollowed(true);
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
      axios.post(`${URL()}/pod/unfollowPod`, body).then(res => {
        const resp = res.data;
        if (resp.success) {
          setStatus({
            msg: "unfollow success",
            key: Math.random(),
            variant: "success",
          });
          setFollowed(false);
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

  //Pod Photo Change
  const onChangePodPhoto = (file: any) => {
    const formData = new FormData();
    formData.append("image", file, pod.PodAddress);
    const formTokenData = new FormData();
    formTokenData.append("image", file, pod.TokenSymbol);

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
          const podCopy = { ...pod };
          podCopy.dimensions = { height: height, width: width };
          setPod(podCopy);

          return true;
        };
      }
    });
    reader.readAsDataURL(file);

    axios
      .post(`${URL()}/mediaPod/changeMediaPodPhoto`, formData, config)
      .then(response => {
        setURLPodPhoto(`url(${pod.Url}?${Date.now()})`);
        let body = { dimensions: dimensions, id: pod.PodAddress };
        axios.post(`${URL()}/mediaPod/updateMediaPodPhotoDimensions`, body).catch(error => {
          console.log(error);
        });
      })
      .catch(error => {
        console.log(error);
      });
  };

  const fileInputPodPhoto = e => {
    e.preventDefault();
    const files = e.target.files;
    if (files.length) {
      handleFiles(files);
    }
  };

  const handleFiles = (files: any) => {
    for (let i = 0; i < files.length; i++) {
      if (validateFile(files[i])) {
        onChangePodPhoto(files[i]);
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

  if (pod) {
    return (
      <div className="pod-page media-pod-page" style={{ background: "white" }}>
        <div className={"blue-header"}>
          <div className="backButton" onClick={() => history.goBack()}>
            <ChevronIconLeft />
            Back
          </div>
          <div className="pod-title">
            <div className="pod-title-header">
              <span>{pod.Name ?? "Untitled Pod"}</span>
              <PrimaryButton size="medium" onClick={handleFollow}>
                {followed ? "Unfollow" : "Follow"}
              </PrimaryButton>
            </div>
            <div className="pod-title-description">{pod.Description ?? ""}</div>
          </div>
        </div>

        <div className={"overflow-header"}>
          <div className={"creators"}>
            <h3>Creators</h3>
            <div className={"creators-display"}>
              {creators && creators.length > 0
                ? creators.map((creator, index) => (
                  <div className="creator-avatar" key={`creator-card-${index}`}>
                    <div
                      className={"user-image"}
                      onClick={() => {
                        history.push(`/profile/${creator.urlSlug}`);
                        dispatch(setSelectedUser(creator.id));
                      }}
                      style={{
                        backgroundImage:
                          creator && creator.imageURL && creator.imageURL.length > 0
                            ? `url(${creator.imageURL})`
                            : "none",
                        backgroundRepeat: "no-repeat",
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        backgroundColor: "grey",
                      }}
                    />
                    {creator?.online ? <div className={"online"} /> : null}
                  </div>
                ))
                : null}
            </div>
            <PrimaryButton size="medium" onClick={handleFollow} className={"follow-mobile-btn"}>
              {followed ? "Unfollow" : "Follow"}
            </PrimaryButton>
            <div className={"rates"}>
              <div className={"row"} style={{ alignItems: "flex-start" }}>
                <div className={"col"}>
                  <div>
                    <img src={priceIcon} alt={"info"} style={{ marginLeft: "4px", marginRight: "4px" }} />
                  </div>
                  {/* <span>👛 Price</span> */}
                  <div className={"value"}>{Number(marketPrice).toFixed(2)}</div>
                  <span>
                    ={" "}
                    {pod && marketPrice
                      ? Number((marketPrice * ratesMaps[pod.FundingToken]) / ratesMaps["ETH"]).toFixed(8)
                      : ""}{" "}
                    ETH
                  </span>
                </div>
                <div className={"col"}>
                  {/* <span>🧑‍🤝‍🧑 Investors share</span> */}
                  <div>
                    <img
                      src={investorShareIcon}
                      alt={"info"}
                      style={{ marginLeft: "4px", marginRight: "4px" }}
                    />
                  </div>
                  <div className={"value"}>{`${pod.InvestorDividend * 100 ?? 0}%`}</div>
                  <span></span>
                </div>
                <div className={"col"}>
                  {/* <span>💸 Investors</span>*/}
                  <div>
                    <img src={investorsIcon} alt={"info"} style={{ marginLeft: "4px", marginRight: "4px" }} />
                  </div>
                  <div className={"value"}>{pod.Investors ? pod.Investors.length : 0}</div>
                  <span>Total</span>
                </div>
                <div className={"col"}>
                  {/* <span>{"Share & Earn"}</span> */}
                  <div>
                    <img src={priceIcon} alt={"info"} style={{ marginLeft: "4px", marginRight: "4px" }} />
                  </div>
                  <div className={"value"}>{pod.SharingPercent ?? 0}%</div>
                  {/*<span>Total</span>*/}
                </div>
              </div>
              <div className={"row"}>
                <div className={"col"}>
                  {/* <span>💰 Raised Funds</span> */}
                  <div>
                    <img src={raiseFundIcon} alt={"info"} style={{ marginLeft: "4px", marginRight: "4px" }} />
                  </div>
                  <div className={"value"}>{pod.FundingTokenPrice || 0}</div>
                </div>
                <div className={"col"}>
                  {/* <span>📈 Market Cap</span> */}
                  <div>
                    <img src={marketCap} alt={"info"} style={{ marginLeft: "4px", marginRight: "4px" }} />
                  </div>
                  <div className={"value"}>{pod.MCAP ?? "N/A"}</div>
                </div>
                <div className={"col"}>
                  {/* <span>🏦 Supply Released</span> */}
                  <div>
                    <img
                      src={supplyReleaseIcon}
                      alt={"info"}
                      style={{ marginLeft: "4px", marginRight: "4px" }}
                    />
                  </div>
                  <div className={"value"}>{`${pod.Supply ?? "0"} ${pod.TokenSymbol ?? ""}`}</div>
                </div>
              </div>
            </div>
          </div>

          <div className={"pod-image-container"}>
            <div
              className="pod-image"
              style={{
                backgroundImage: pod.HasPhoto && URLPodPhoto.length > 0 ? URLPodPhoto : "none",
                backgroundRepeat: "no-repeat",
                backgroundSize: "cover",
                backgroundPosition: "center",
                cursor: user.id === pod.Creator ? "pointer" : "auto",
              }}
              onClick={() => {
                if (inputRef && inputRef.current) {
                  inputRef.current.click();
                }
              }}
            >
              {user.id === pod.Creator ? (
                <InputWithLabelAndTooltip
                  onInputValueChange={fileInputPodPhoto}
                  hidden
                  type="file"
                  style={{
                    display: "none",
                  }}
                  reference={inputRef}
                />
              ) : null}
            </div>
            {/*<div className={"actions"}>
              <img
                src={require("assets/icons/bookmark.svg")}
                alt="social-bookmark"
              />
              <img src={require("assets/icons/share.svg")} alt="social-share" />
              <img src={require("assets/icons/heart.svg")} alt="social-heart" />
            </div>*/}
          </div>
        </div>
        <div className="pod-data">
          <div className="appbar-filter-container">
            <div className="appbar-container">
              <TabNavigation
                tabs={currentPodsMenuOptions}
                currentTab={podMenuSelection}
                variant="secondary"
                onTabChange={setPodMenuSelection}
                padding={0}
              />
            </div>
            {/* {podMenuSelection === 0 ? (
              <div className={"searcher"}>
                <input
                  placeholder={"Search Media"}
                  value={mediaSearch}
                  onChange={e => {
                    setMediaSearch(e.target.value);
                  }}
                />
                <img src={require("assets/icons/search.png")} alt={"search"} />
              </div>
            ) : null} */}
          </div>
          <div style={{ paddingBottom: "20px" }}>
            {currentPodsMenuOptions[podMenuSelection] === "Media" ? (
              <Media pod={pod} podId={podId} medias={filteredMedias} refreshPod={loadData} />
            ) : currentPodsMenuOptions[podMenuSelection] === "Investments" ? (
              <Investments pod={pod} handleRefresh={loadData} />
            ) : currentPodsMenuOptions[podMenuSelection] === "Discussions" ? (
              userCollaborator ? (
                <Discord discordId={pod.DiscordId} sidebar={true} type={"Pod"} id={pod.id} showAll={false} />
              ) : (
                <Discussions pod={pod} podId={podId} refreshPod={loadData} />
              )
            ) : currentPodsMenuOptions[podMenuSelection] === "Chat" ? (
              <Chat
                typeChat={"Media"}
                mediasOnCommunity={mediasOnCommunity}
                refreshMediasOnCommunity={() => getMediasOnCommunity()}
                medias={medias}
                loader={loaderData}
              />
            ) : null}
          </div>
        </div>
        {status ? <AlertMessage key={status.key} message={status.msg} variant={status.variant} /> : ""}
      </div>
    );
  } else return <p>Pod not fond</p>;
}
