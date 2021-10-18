import "./Pods.css";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Ticker from "react-ticker";
import axios from "axios";
import { useDebouncedCallback } from "use-debounce";

import { RootState, useTypedSelector } from "store/reducers/Reducer";
import { setUpdatePodCreation } from "store/actions/UpdatePodCreation";
import { setTrendingPodsList, setOtherPodsList } from "store/actions/PodsManager";
import { Dialog, Modal } from "@material-ui/core";
import PodCreateModal from "./Pod-create-modal/Pod-create-modal";
import TrendingPodCard from "./Trending-Pod-Card/TrendingPodCard";
import CreateClaimablePodModal from "./Pod-Page/modals/claimable/CreateClaimablePodModal";
import URL from "shared/functions/getURL";
import { StyledBlueSelect, StyledMenuItem } from "shared/ui-kit/Styled-components/StyledComponents";
import TutorialModal from "shared/ui-kit/Page-components/Tutorials/TutorialModal";
import { updateTutorialsSeen } from "store/actions/User";
import PodCreateNFTMediaModal from "./Pod-Create-NFTMedia-Modal/PodCreateNFTMediaModal";
import { preloadImageAndGetDimenstions } from "components/legacy/Media/useMediaPreloader";
import ClaimablePodCard from "./Pod-Claimable-Card";
import { SearchWithCreate } from "shared/ui-kit/SearchWithCreate";
import { VirtualizedMasnory } from "shared/ui-kit/VirtualizedMasnory";
import { HeaderTitle } from "shared/ui-kit/Header/components/HeaderTitle";
import { LoadingWrapper } from "shared/ui-kit/Hocs";
import { PrimaryButton, TabNavigation } from "shared/ui-kit";

const infoIcon = require("assets/icons/info.svg");

const podStateOptions = ["All", "Formation", "Investment", "Released"];
const investingOptions = ["Off", "On"];
const sortByPriceOptions = ["Descending", "Ascending"];
const podTypeOptions = ["All", "Media Pods", "Fractionalised Media"];

const Pods = () => {
  // STORE
  const dispatch = useDispatch();
  const user = useTypedSelector(state => state.user);
  const users = useTypedSelector(state => state.usersInfoList);

  const [podTabSelection, setPodTabSelection] = useState<number>(0);

  const otherPodsList = useTypedSelector(state => state.otherPodsList.list);
  const updatePodCreation = useSelector((state: RootState) => state.updatePodCreation);

  // HOOKS
  //const [podType, setPodType] = useState<number>(1);
  const [trigger, setTrigger] = useState<boolean>(false);

  const [disableClick, setDisableClick] = useState<boolean>(false);
  const [openModalCreatePod, setOpenModalCreatePod] = useState<boolean>(false);
  const [openModalCreateNFTMediaPod, setOpenModalCreateNFTMediaPod] = useState<boolean>(false);

  const scrollRef = React.useRef<any>();

  // pods
  const [otherPodsFullList, setOtherPodsFullList] = useState<any[]>([]);
  const [trendingList, setTrendingList] = useState<any[]>([]);
  //claimable
  const [claimablePodsFullList, setClaimablePodsFullList] = useState<any[]>([]);
  const [trendingClaimableList, setTrendingClaimableList] = useState<any[]>([]);

  // filter and sort selections
  const [podStateSelection, setPodStateSelection] = useState<string>(podStateOptions[0]);
  const [investingSelection, setInvestingSelection] = useState<string>(investingOptions[0]);
  const [sortByPriceSelection, setSortByPriceSelection] = useState<string>(sortByPriceOptions[0]);
  const [podTypeSelection, setPodTypeSelection] = useState<string>(podTypeOptions[0]); // all, media pod, fractionalized
  const [searchValue, setSearchValue] = useState<string>("");

  // pagination
  const [hasMorePods, setHasMorePods] = useState<boolean>(true);
  const [hasMoreClaimablePods, setHasMoreClaimablePods] = useState<boolean>(true);
  const [pagination, setPagination] = useState<number>(1);
  const [claimablePagination, setClaimablePagination] = useState<number>(1);
  const [lastId, setLastId] = useState<string>("null");
  const [lastClaimableId, setLastClaimableId] = useState<string>("null");

  const [isTrendingPodsLoading, setIsTrendingPodsLoading] = useState<boolean>(false);
  const [isPodsLoading, setIsPodsLoading] = useState<boolean>(false);
  const [isTrendingClaimablePodsLoading, setIsTrendingClaimablePodsLoading] = useState<boolean>(false);
  const [isClaimablePodsLoading, setIsClaimablePodsLoading] = useState<boolean>(false);

  const [openTutorialModal, setOpenTutorialModal] = useState<boolean>(true);
  const [openCreateClaimablePodModal, setOpenCreateClaimablePodModal] = useState<boolean>(false);
  const handleOpenTutorialModal = () => setOpenTutorialModal(true);
  const handleCloseTutorialModal = () => setOpenTutorialModal(false);

  const [debouncedCallback] = useDebouncedCallback(() => {
    if (podTabSelection === 0) {
      getMediaPodsInformation(1, [], null);
    } else getClaimablePods(1, [], null);
  }, 500);

  // FUNCTIONS
  useEffect(() => {
    if (user && user.tutorialsSeen && user.tutorialsSeen.pods === false) {
      handleOpenTutorialModal();
    }
    if (user && user.id && user.id.length > 0) {
      reset();
      getMediaPodsInformation(1, [], null);
      getMediaTrendingPods();
      getClaimablePods(1, [], null);
      getClaimableTrendingPods();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user.id]);

  // when filter or sort options changed
  useEffect(() => {
    setPagination(1);
    setOtherPodsFullList([]);
    setLastId("null");
    setHasMorePods(true);
    getMediaPodsInformation(1, [], null);
    /*switch (podType) {
      // Media Pod
      case 1:
        reset();
        getMediaPodsInformation(1, [], null);
        break;
    }*/
  }, [
    podStateSelection,
    investingSelection,
    sortByPriceSelection,
    podTypeSelection,
    // podType
  ]);

  useEffect(() => {
    if ((updatePodCreation && updatePodCreation.value) || trigger) {
      if (podTabSelection === 0) {
        getMediaPodsInformation(1, [], null);
        getMediaTrendingPods(true);
        /*if (podType === 1) {
          getMediaPodsInformation(1, [], null);
          getMediaTrendingPods();
        } else if (podType === 2) {
          getFTPodsInformation(user, 0, null);
          getFTTrendingPods();
        } else if (podType === 3) {
          getNFTPodsInformation(user, false, 0, null);
          getNFTTrendingPods(false);
        }*/
      } else {
        getClaimablePods(1, [], null);
        getClaimableTrendingPods(true);
      }

      dispatch(setUpdatePodCreation(false));
      setTrigger(false);
    }
  }, [updatePodCreation, trigger]);

  const reset = () => {
    setPagination(1);
    setClaimablePagination(1);
    setOtherPodsFullList([]);
    setClaimablePodsFullList([]);
    setLastId("null");
    setLastClaimableId("null");
    setHasMorePods(true);
    setHasMoreClaimablePods(true);
  };

  const getPodWithUserData = React.useCallback(
    pod => {
      //load creator data
      if (users.some(user => pod.Creator === user.id)) {
        const trendingUser = users[users.findIndex(user => pod.Creator === user.id)];
        pod.CreatorImageURL = trendingUser.imageURL;
        pod.CreatorName = trendingUser.name;
      }

      if (pod.Followers && pod.Followers[0] && users.some(user => pod.Followers[0] === user.id)) {
        const trendingFollowUser = users[users.findIndex(user => pod.Followers[0] === user.id)];
        pod.FirstFollower = {
          imageURL: trendingFollowUser.imageURL,
          name: trendingFollowUser.name,
        };
      }

      return pod;
    },
    [users]
  );

  /* const handlePodType = (newPodType: number) => {
    setPodType(newPodType);
    if (newPodType === 1) {
      getNFTPodsInformation(user, true, 0, null);
      getMediaTrendingPods();
    } else if (newPodType === 2) {
      getFTPodsInformation(user, 0, null);
      getFTTrendingPods();
    } else if (newPodType === 3) {
      getNFTPodsInformation(user, false, 0, null);
      getNFTTrendingPods(false);
    }
  };*/

  const handleOpenModalCreatePod = () => {
    setOpenModalCreatePod(true);
  };

  const handleCloseModalCreatePod = () => {
    setOpenModalCreatePod(false);
  };
  const handleOpenModalCreateNFTMediaPod = () => {
    setOpenModalCreateNFTMediaPod(true);
  };

  const handleCloseModalCreateNFTMediaPod = () => {
    setOpenModalCreateNFTMediaPod(false);
  };

  const handleRestartTutorials = () => {
    const body = {
      userId: user.id,
      tutorialsSeen: {
        communities: user.tutorialsSeen.communities,
        pods: false,
        creditPools: user.tutorialsSeen.creditPools,
      },
    };

    axios
      .post(`${URL()}/user/updateTutorialsSeen`, body)
      .then(response => {
        if (response.data.success) {
          //update redux data aswell
          dispatch(updateTutorialsSeen(body.tutorialsSeen));
        } else {
          console.log(`Restart pods tutorials failed`);
        }
      })
      .catch(error => {
        console.log(error);
        //alert('Error handling anonymous avatar update');
      });
  };

  const getFTPodsInformation = (user, page, lastId) => {
    setDisableClick(true);
    setHasMorePods(true);

    axios
      .get(`${URL()}/pod/FT/getAllPodsInfo/${page}/${lastId}`)
      .then(response => {
        if (response.data.success) {
          let data = response.data.data;

          if (data && data.length === 0) {
            setHasMorePods(false);
          } else {
            let otherFTPods: any[] = [];
            if (
              page === 0 ||
              otherPodsList.length <= 0 ||
              (otherPodsList[0] !== undefined &&
                (otherPodsList[0].IsDigital === true || otherPodsList[0].IsDigital === false))
            ) {
              otherFTPods = [...data.FTPods];
            } else {
              otherFTPods = otherPodsList.concat(data.FTPods);
            }

            if (users && users.length > 0) {
              otherFTPods.forEach((otherFTPod, index) => {
                if (users.some(user => otherFTPod.Creator === user.id)) {
                  const thisUser = users[users.findIndex(user => otherFTPod.Creator === user.id)];
                  otherFTPods[index].CreatorImageURL = thisUser.imageURL;
                  otherFTPods[index].CreatorName = thisUser.name;
                }

                if (
                  otherFTPod.Followers &&
                  otherFTPod.Followers[0] &&
                  users.some(user => otherFTPod.Followers[0] === user.id)
                ) {
                  const followerUser = users[users.findIndex(user => otherFTPod.Followers[0] === user.id)];
                  otherFTPods[index].FirstFollower = {
                    imageURL: followerUser.imageURL,
                    name: followerUser.name,
                  };
                }
              });
            }
            dispatch(setOtherPodsList(otherFTPods));
            setOtherPodsFullList(otherFTPods);

            if (otherFTPods && otherFTPods.length <= 6) {
              setHasMorePods(false);
            } else {
              setHasMorePods(true);
            }
          }
        }
        setDisableClick(false);
      })
      .catch(error => {
        console.log(error);
        setDisableClick(false);
      });
  };

  const getMediaPodsInformation = async (page, currMediaPods, lastMediaPodId) => {
    if (!isPodsLoading) {
      setDisableClick(true);
      setIsPodsLoading(true);
      const config = {
        params: {
          podStateSelection: podStateSelection,
          investingSelection: investingSelection,
          sortByPriceSelection: sortByPriceSelection,
          podTypeSelection: podTypeSelection,
          searchValue: searchValue,
        },
      };
      const response = await axios.get(`${URL()}/mediaPod/getMediaPods/${page}/${lastMediaPodId}`, config);
      const resp = response.data;
      if (resp.success) {
        const data = resp.data;
        const mediaPods = data.mediaPods ?? [];
        const hasMore = data.hasMore ?? false;
        const lastId = data.lastId ?? "null";

        for (let index = 0; index < mediaPods.length; index++) {
          const mediaPod = mediaPods[index];
          if (mediaPod.PodAddress && !mediaPod.dimensions) {
            let dimensions;
            const mediaUrl = `${mediaPod.Url}?${Date.now()}`;
            if (mediaUrl) {
              try {
                dimensions = await preloadImageAndGetDimenstions(mediaUrl);
              } catch (e) { }
            }
            mediaPods[index].dimensions = dimensions;
          }
        }
        const newMediaPods = [...currMediaPods, ...mediaPods];
        dispatch(setOtherPodsList(newMediaPods));
        setOtherPodsFullList(newMediaPods);
        setHasMorePods(hasMore);
        setLastId(lastId);
      }
      setDisableClick(false);
      setIsPodsLoading(false);
    }
  };

  const getNFTPodsInformation = (user, digital: boolean, page, lastId) => {
    setDisableClick(true);

    setHasMorePods(true);

    axios
      .get(`${URL()}/pod/NFT/getAllPodsInfo/${page}/${lastId}`)
      .then(response => {
        const resp = response.data;
        if (resp.success) {
          let data = resp.data;

          if (data && data.length === 0) {
            setHasMorePods(false);
          } else {
            let otherNFTPods: any[] = [];
            if (
              otherPodsList.length <= 0 ||
              (otherPodsList[0] !== undefined &&
                (otherPodsList[0].IsDigital === null ||
                  otherPodsList[0].IsDigital === undefined ||
                  digital !== otherPodsList[0].IsDigital))
            ) {
              otherNFTPods = [...data.NFTPods];
            } else {
              otherNFTPods = otherPodsList.concat(data.NFTPods);
            }

            otherNFTPods.sort((a, b) =>
              !b.Followers || !a.Followers ? 1 : b.Followers.length - a.Followers.length
            );

            if (users && users.length > 0) {
              otherNFTPods.forEach((otherNFTPod, index) => {
                if (otherNFTPod.Creator && users.some(user => otherNFTPod.Creator === user.id)) {
                  const otherUser = users[users.findIndex(user => otherNFTPod.Creator === user.id)];
                  otherNFTPods[index].CreatorImageURL = otherUser.imageURL;
                  otherNFTPods[index].CreatorName = otherUser.name;
                }

                if (
                  otherNFTPod.Followers &&
                  otherNFTPod.Followers[0] &&
                  users.some(user => otherNFTPod.Followers[0] === user.id)
                ) {
                  const otherFollowerUser =
                    users[users.findIndex(user => otherNFTPod.Followers[0] === user.id)];
                  otherNFTPods[index].FirstFollower = {
                    imageURL: otherFollowerUser.imageURL,
                    name: otherFollowerUser.name,
                  };
                }
              });
            }

            otherNFTPods = otherNFTPods.filter(nftPod => nftPod.IsDigital === digital);

            if (otherNFTPods && otherNFTPods.length <= 6) {
              setHasMorePods(false);
            } else {
              setHasMorePods(true);
            }

            dispatch(setOtherPodsList(otherNFTPods));
            setOtherPodsFullList(otherNFTPods);
          }
        }
        setDisableClick(false);
      })
      .catch(error => {
        console.log(error);
        setDisableClick(false);
      });
  };

  /*const getFTTrendingPods = () => {
    dispatch(setTrendingPodsLoading(true));

    axios.get(`${URL()}/pod/FT/getTrendingPods`).then(res => {
      const resp = res.data;
      if (resp.success) {
        const data = resp.data;

        let trendingFTPods = [...(data.trending || [])];

        //remove duplicates
        trendingFTPods = trendingFTPods.reduce(
          (unique, pod) => (unique.some(u => u.PodAddress === pod.PodAddress) ? unique : [...unique, pod]),
          []
        );

        if (users && users.length > 0) {
          trendingFTPods.forEach((trendingFTPod, index) => {
            if (users.some(user => trendingFTPod.Creator === user.id)) {
              const trendingUser = users[users.findIndex(user => trendingFTPod.Creator === user.id)];
              trendingFTPods[index].CreatorImageURL = trendingUser.imageURL;
              trendingFTPods[index].CreatorName = trendingUser.name;
            }

            if (
              trendingFTPod.Followers &&
              trendingFTPod.Followers[0] &&
              users.some(user => trendingFTPod.Followers[0] === user.id)
            ) {
              const trendingFollowUser =
                users[users.findIndex(user => trendingFTPod.Followers[0] === user.id)];
              trendingFTPods[index].FirstFollower = {
                imageURL: trendingFollowUser.imageURL,
                name: trendingFollowUser.name,
              };
            }
          });
        }

        dispatch(setTrendingPodsList(trendingFTPods));
        setTrendingList(trendingFTPods);

        dispatch(setTrendingPodsLoading(false));
      } else {
        console.log("error getting trending FT Pods");
      }
      setDisableClick(false);
    });
  };*/

  const getMediaTrendingPods = (forceRefreshCache?: boolean) => {
    setIsTrendingPodsLoading(true);

    axios
      .get(
        `${URL()}/mediaPod/getTrendingMediaPods`,
        forceRefreshCache
          ? {
            params: {
              forceRefreshCache: true,
            },
          }
          : undefined
      )
      .then(res => {
        const resp = res.data;
        if (resp.success) {
          const data = resp.data;

          let trendingMediaPods = [...(data.trending || [])];

          //remove duplicates
          trendingMediaPods = trendingMediaPods.reduce(
            (unique, pod) => (unique.some(u => u.PodAddress === pod.PodAddress) ? unique : [...unique, pod]),
            []
          );

          dispatch(setTrendingPodsList(trendingMediaPods));

          setTrendingList(trendingMediaPods);
        } else {
          console.log("error getting trending Media Pods");
        }
        setDisableClick(false);
        setIsTrendingPodsLoading(false);
      });
  };

  /*const getNFTTrendingPods = (digital: boolean) => {
    dispatch(setTrendingPodsLoading(true));

    axios.get(`${URL()}/pod/NFT/getTrendingPods`).then(res => {
      const resp = res.data;
      if (resp.success) {
        const data = resp.data;

        let trendingNFTPods = [...(data || [])];

        //remove duplicates
        trendingNFTPods = trendingNFTPods.reduce(
          (unique, pod) => (unique.some(u => u.PodAddress === pod.PodAddress) ? unique : [...unique, pod]),
          []
        );

        if (users && users.length > 0) {
          trendingNFTPods.forEach((trendingNFTPod, index) => {
            if (users.some(user => trendingNFTPod.Creator === user.id)) {
              const trendingUser = users[users.findIndex(user => trendingNFTPod.Creator === user.id)];
              trendingNFTPods[index].CreatorImageURL = trendingUser.imageURL;
              trendingNFTPods[index].CreatorName = trendingUser.name;
            }

            if (
              trendingNFTPod.Followers &&
              trendingNFTPod.Followers[0] &&
              users.some(user => trendingNFTPod.Followers[0] === user.id)
            ) {
              const trendingFollowUser =
                users[users.findIndex(user => trendingNFTPod.Followers[0] === user.id)];
              trendingNFTPods[index].FirstFollower = {
                imageURL: trendingFollowUser.imageURL,
                name: trendingFollowUser.name,
              };
            }
          });
        }

        let trendingNFT: any[];

        if (digital) {
          trendingNFT = trendingNFTPods.filter(pod => pod.IsDigital === true);
        } else {
          trendingNFT = trendingNFTPods.filter(pod => pod.IsDigital === false);
        }

        dispatch(setTrendingPodsList(trendingNFT));
        setTrendingList(trendingNFT);
      } else {
        console.log("error getting trending communities");
      }
      setDisableClick(false);
      dispatch(setTrendingPodsLoading(false));
    });
  };*/

  const getClaimablePods = async (page, currClaimablePods, lastClaimablePodId) => {
    if (!isClaimablePodsLoading) {
      setDisableClick(true);
      setIsClaimablePodsLoading(true);
      const config = {
        params: {
          searchValue: searchValue,
        },
      };

      const response = await axios.get(
        `${URL()}/claimableSongs/getClaimablePods/${page}/${lastClaimablePodId}`,
        config
      );
      const resp = response.data;
      if (resp.success) {
        const data = resp.data;
        const claimablePods = data.data ?? [];
        const hasMore = data.hasMore ?? false;
        const lastId = data.lastId ?? "null";

        for (let index = 0; index < claimablePods.length; index++) {
          const claimablePod = claimablePods[index];
          if (claimablePod.id && !claimablePod.dimensions) {
            /*let dimensions;
            const imageURL = `${URL()}/claimableSongs/getPhoto/${claimablePod.id}`;
            if (imageURL) {
              try {
                dimensions = await preloadImageAndGetDimenstions(imageURL);
              } catch (e) {}
            }
            claimablePods[index].dimensions = dimensions;*/
          }
        }
        const newClaimablePods = [...currClaimablePods, ...claimablePods];
        setClaimablePodsFullList(newClaimablePods);
        setHasMoreClaimablePods(hasMore);
        setLastClaimableId(lastId);
      }
      setDisableClick(false);
      setIsClaimablePodsLoading(false);
    }
  };

  const getClaimableTrendingPods = (forceRefreshCache?: boolean) => {
    setIsTrendingClaimablePodsLoading(true);

    axios
      .get(
        `${URL()}/claimableSongs/getTrendingClaimablePods`,
        forceRefreshCache
          ? {
            params: {
              forceRefreshCache: true,
            },
          }
          : undefined
      )
      .then(res => {
        const resp = res.data;
        if (resp.success) {
          const data = resp.data;

          let trendingClaimablePods = [...(data.trending || [])];

          //remove duplicates
          trendingClaimablePods = trendingClaimablePods.reduce(
            (unique, pod) => (unique.some(u => u.id === pod.id) ? unique : [...unique, pod]),
            []
          );

          setTrendingClaimableList(trendingClaimablePods);
        } else {
          console.log("error getting trending Claimable Pods");
        }
        setDisableClick(false);
        setIsTrendingClaimablePodsLoading(false);
      });
  };

  /*const loaderGetDataFTPods = () => {
    let page: number = pagination + 1;
    setPagination(page);
    let lastId = otherPodsList[otherPodsList.length - 1].id;
    getFTPodsInformation(user, page, lastId);
  };*/

  /*const loaderGetDataNFTPods = () => {
    let page: number = pagination + 1;
    setPagination(page);
    let lastId = otherPodsList[otherPodsList.length - 1].id;
    if (podType === 1) {
      getNFTPodsInformation(user, true, page, lastId);
    } else if (podType === 3) {
      getNFTPodsInformation(user, false, page, lastId);
    }
  };*/

  const handleSearchChange = e => {
    setSearchValue(e.target.value);
    debouncedCallback();
  };

  const TickerElement = ({ isTrending }) => {
    const [tickerMove, setTickerMove] = React.useState(false);

    return (
      <Ticker direction="toLeft" move={tickerMove} offset={0}>
        {({ index }) => (
          <div
            onMouseOver={() => {
              setTickerMove(false);
            }}
            onMouseLeave={() => {
              setTickerMove(true);
            }}
            className={isTrending ? "pods-cards" : "claimable-pods-cards"}
          >
            {isTrending ? (
              <TrendingPodCard
                pod={getPodWithUserData(trendingList[index % trendingList.length])}
                type={"Digital-NFT"}
                key={`${trendingList[index % trendingList.length].PodAddress}-${index}-DNFTtrending-card`}
                disableClick={disableClick}
              />
            ) : (
              <ClaimablePodCard
                trending={true}
                media={trendingClaimableList[index % trendingClaimableList.length]}
                key={`${index}-Claimable-trending-card`}
              />
            )}
            {/*podType === 1
            ? trendingList.map((pod, i) => {
                return (
                  <TrendingPodCard
                    pod={getPodWithUserData(pod)}
                    type={"Digital-NFT"}
                    key={`${pod.PodAddress}-${i}-DNFTtrending-card`}
                    disableClick={disableClick}
                  />
                );
              })
            : podType === 2
            ? trendingList.map((pod, i) => {
                return (
                  <TrendingPodCard
                    pod={pod}
                    type={"FT"}
                    key={`${pod.PodAddress}-${i}-FTtrending-card`}
                    disableClick={disableClick}
                  />
                );
              })
            : trendingList.map((pod, i) => {
                return (
                  <TrendingPodCard
                    pod={pod}
                    type={"Physical-NFT"}
                    key={`${pod.PodAddress}-${i}-PNFTtrending-card`}
                    disableClick={disableClick}
                  />
                );
              })*/}
          </div>
        )}
      </Ticker>
    );
  };

  const handleTabChange = value => {
    setPodTabSelection(value);
    setSearchValue("");
  };

  return (
    <div className="privi-pods">
      {/* {user.tutorialsSeen.pods === false && (
        <TutorialModal open={openTutorialModal} handleClose={handleCloseTutorialModal} tutorial={"pods"} />
      )} */}
      <div className="pods" id="scrollableDivPods" ref={scrollRef}>
        <HeaderTitle
          title="Pods"
          subtitle="With Pods, <b>any imaginable asset</b> can be <b>tokenized</b>"
          clickTip={handleRestartTutorials}
          marginBottom={70}
        />
        <div className="appbar-container">
          <TabNavigation
            tabs={["Media", "Claimable"]}
            currentTab={podTabSelection}
            variant="secondary"
            size="extralarge"
            onTabChange={handleTabChange}
          />
        </div>
        <div className="search-and-create">
          <SearchWithCreate
            searchValue={searchValue}
            handleSearchChange={handleSearchChange}
            searchPlaceholder="Search by artist, name, tag"
          />
          <PrimaryButton
            size="medium"
            onClick={() => {
              if (podTabSelection === 0) {
                handleOpenModalCreateNFTMediaPod();
                /*if (podType !== 1) {
                  handleOpenModalCreatePod();
                } else {
                  handleOpenModalCreateNFTMediaPod();
                }*/
              } else {
                setOpenCreateClaimablePodModal(true);
              }
            }}
          >
            {podTabSelection === 0 ? "Create Media Pod" : "Create Claimable Pod"}
          </PrimaryButton>
        </div>
        {(searchValue.length <= 0 || searchValue === "" || !searchValue) && (
          <div className="trending">
            <div className="title">
              <h3>
                🔥 Trending Pods
                <img src={infoIcon} alt="info" className="info-logo" />
              </h3>
            </div>
            {podTabSelection === 0 ? (
              <LoadingWrapper loading={isTrendingPodsLoading}>
                {trendingList.length > 0 ? (
                  <TickerElement isTrending={true} />
                ) : (
                  <div className="no-pods">No pods to show</div>
                )}
              </LoadingWrapper>
            ) : (
              <LoadingWrapper loading={isTrendingClaimablePodsLoading}>
                {trendingClaimableList.length > 0 ? (
                  <TickerElement isTrending={false} />
                ) : (
                  <div className="no-pods">No pods to show</div>
                )}
              </LoadingWrapper>
            )}
          </div>
        )}
        <div className="pod-scroll">
          <div className="all">
            <div className="title">
              <h3>
                {searchValue.length <= 0 || searchValue === "" || !searchValue ? "Discover" : "Results"}
              </h3>
              <div className="title-button">
                {searchValue && searchValue !== "" && (
                  <img
                    src={require("assets/icons/cross_gray.png")}
                    alt="close"
                    style={{ cursor: "pointer" }}
                    onClick={() => setSearchValue("")}
                  />
                )}
              </div>
            </div>

            <div className="display-filter">
              {podTabSelection === 0 && trendingList && trendingList.length > 0 && (
                <div className="filters">
                  <div className="dropdown">
                    <p>Pod State:</p>
                    <StyledBlueSelect
                      disableUnderline
                      labelId="simple-select-label"
                      id="simple-select"
                      value={podStateSelection}
                      onChange={(event: React.ChangeEvent<{ value: unknown }>) => {
                        setPodStateSelection(event.target.value as string);
                      }}
                    >
                      {podStateOptions.map((option: string, i: number) => {
                        return (
                          <StyledMenuItem value={option} key={i}>
                            {option}
                          </StyledMenuItem>
                        );
                      })}
                    </StyledBlueSelect>
                  </div>

                  <div className="dropdown">
                    <p>Investing:</p>
                    <StyledBlueSelect
                      disableUnderline
                      labelId="simple-select-label"
                      id="simple-select"
                      value={investingSelection}
                      onChange={(event: React.ChangeEvent<{ value: unknown }>) => {
                        setInvestingSelection(event.target.value as string);
                      }}
                    >
                      {investingOptions.map((option: string, i: number) => {
                        return (
                          <StyledMenuItem value={option} key={i}>
                            {option}
                          </StyledMenuItem>
                        );
                      })}
                    </StyledBlueSelect>
                  </div>

                  <div className="dropdown">
                    <p>Token Price:</p>
                    <StyledBlueSelect
                      disableUnderline
                      labelId="simple-select-label"
                      id="simple-select"
                      value={sortByPriceSelection}
                      onChange={(event: React.ChangeEvent<{ value: unknown }>) => {
                        setSortByPriceSelection(event.target.value as string);
                      }}
                    >
                      {sortByPriceOptions.map((option: string, i: number) => {
                        return (
                          <StyledMenuItem value={option} key={i}>
                            {option}
                          </StyledMenuItem>
                        );
                      })}
                    </StyledBlueSelect>
                  </div>
                </div>
              )}
              {podTabSelection === 0 && trendingList && trendingList.length > 0 && (
                <div className="filtersPodType">
                  {podTypeOptions.map((podTypeOption, index) => {
                    return (
                      <button
                        className={podTypeOption == podTypeSelection ? "selected" : "unselected"}
                        onClick={() => setPodTypeSelection(podTypeOption)}
                        key={index}
                      >
                        {podTypeOption}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
            <div className="pod-cards">
              {((podTabSelection === 0 && trendingList && trendingList.length > 0) ||
                (podTabSelection === 1 && trendingClaimableList && trendingClaimableList.length > 0)) && (
                  <VirtualizedMasnory
                    list={
                      podTabSelection === 0
                        ? otherPodsFullList.map(item => getPodWithUserData(item))
                        : claimablePodsFullList
                    }
                    loadMore={() => {
                      if (podTabSelection === 0) {
                        const newPagination = pagination + 1;
                        setPagination(newPagination);
                        getMediaPodsInformation(newPagination, otherPodsFullList, lastId);
                        /*switch (podType) {
                              case 1:
                                getMediaPodsInformation(newPagination, otherPodsFullList, lastId);
                                break;
                              case 2:
                                getFTPodsInformation(user, newPagination, lastId);
                                break;
                              case 3:
                                getNFTPodsInformation(user, false, newPagination, lastId)
                                break
                            }*/
                      } else {
                        const newPagination = claimablePagination + 1;
                        setClaimablePagination(newPagination);
                        getClaimablePods(newPagination, claimablePodsFullList, lastClaimableId);
                      }
                    }}
                    hasMore={podTabSelection === 0 ? hasMorePods : hasMoreClaimablePods}
                    scrollElement={scrollRef.current}
                    type={"pod"}
                    podType={podTabSelection}
                    disableClick={disableClick}
                    itemRender={undefined}
                  />
                )}
              {((!isClaimablePodsLoading && podTabSelection === 1 && trendingClaimableList.length === 0) ||
                (podTabSelection === 0 && !isPodsLoading && trendingList.length === 0)) && (
                  <div className="no-pods">No results</div>
                )}
            </div>
          </div>
        </div>
      </div>
      {openModalCreatePod && (
        <Dialog
          className="modalCreateModal"
          open={openModalCreatePod}
          onClose={handleCloseModalCreatePod}
          fullWidth={true}
          maxWidth={"md"}
        >
          <PodCreateModal
            onCloseModal={handleCloseModalCreatePod}
            type={
              "Digital NFT"
              //podType === 1 ? "Digital NFT" : podType === 2 ? "FT" : "Physical NFT"
            }
            refreshPods={() => setTrigger(!trigger)}
            open={openModalCreatePod}
          />
        </Dialog>
      )}
      <PodCreateNFTMediaModal
        onClose={handleCloseModalCreateNFTMediaPod}
        type={"Digital NFT"}
        handleRefresh={() => setTrigger(!trigger)}
        open={openModalCreateNFTMediaPod}
      />
      <CreateClaimablePodModal
        open={openCreateClaimablePodModal}
        handleClose={() => setOpenCreateClaimablePodModal(false)}
        handleRefresh={() => setTrigger(!trigger)}
      />
    </div>
  );
};

const COLUMNS_COUNT_BREAK_POINTS = {
  400: 1,
  767: 2,
  900: 3,
  1200: 4,
  1510: 5,
};

export default Pods;
