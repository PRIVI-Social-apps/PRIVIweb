import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios, { CancelTokenSource } from "axios";

import URL from "shared/functions/getURL";
import { makePoints, makeLabels } from "shared/ui-kit/Chart/Chart-Utils";
import { addUniqueIdToArray, generateUniqueId } from "shared/functions/commonFunctions";
import { getUser } from "store/selectors/user";
import { removeUndef } from "shared/helpers/fp";
import { getRandomAvatarForUserIdWithMemoization } from "shared/services/user/getUserAvatar";

import TabCard from "../Profile-card/TabCard";
import ProfilePane from "./ProfilePane";
import SocialChartConfig from "../Profile-Chart/configs/Social-Chart-Config";
import FTChartConfig from "../Profile-Chart/configs/FT-Chart-Config";

import "../../Profile.css";
import { LoadingWrapper } from "shared/ui-kit/Hocs";

const profileCardsOptions = ["Social", "FT Pods", "Digital Pods", "Credit", "Media", "Work in progress"];
const profileSubTabs = ["All", "Owned", "Curated", "Liked", "Playlist"];
let source: CancelTokenSource;
const MyProfile = ({
  allUsers,
  ownUser,
  userAddress,
  userId,
  userProfile,
  onImportModalCall,
  setStatus,
  userStats,
  setUserStats,
  setSocialToken,
}) => {
  const userSelector = useSelector(getUser);
  const [tabsCardsValue, setTabsCardsValue] = useState(0);
  const [subTabsValue, setSubTabsValue] = useState(0);

  const [mySocials, setMySocials] = useState<any[]>([]); // only Privi
  const [socialList, setSocialList] = useState<any[]>([]); // Privi + external tokens
  const [myPods, setMyPods] = useState<any[]>([]); // only Privi
  const [podList, setPodList] = useState<any[]>([]); // Privi + external tokens
  const [myPodsMedia, setMyPodsMedia] = useState<any[]>([]); // only Privi
  const [myMedia, setMyMedia] = useState<any[]>([]);
  const [myPlaylists, setMyPlaylists] = useState<any[]>([]);
  const [creditPoolsList, setCreditPoolsList] = useState<any[]>([]);
  const [myWips, setMyWips] = useState<any[]>([]);

  /* --------------- Balance History Graph --------------- */
  const [socialChart, setSocialChart] = useState<any>(SocialChartConfig);
  const [ftChart, setFtChart] = useState<any>(FTChartConfig);
  const [socialChartTokenList, setSocialChartTokenList] = useState<any[]>([]);
  const [ftChartTokenList, setFTChartTokenListList] = useState<any[]>([]);

  /* --------------- Profile Pagination --------------- */
  const [paginationLastId, setPaginationLastId] = useState<any>(null);
  const [isLastNFT, setIsLastNFT] = useState<boolean>(true);
  const [pagination, setPagination] = useState<number>(1);
  const [paginationHasMore, setPaginationHasMore] = useState<boolean>(true);
  const [paginationLastLikedMedia, setPaginationLastLikedMedia] = useState<string>("owner");
  const [isDataLoading, setIsDataLoading] = useState<boolean>(false);
  const [isTokenListLoading, setIsTokenListLoading] = useState<boolean>(false);

  useEffect(() => {
    if (userId && userAddress) {
      getAllBalanceHistoryInfo();
    }
  }, [userAddress]);

  useEffect(() => {
    if (userId) {
      getAllInfoProfile(userId);
    }
  }, [tabsCardsValue, subTabsValue]);

  // add Social and NFT from external wallet, NOT COMPLETED!
  useEffect(() => {
    const newSocialList: any[] = [...mySocials];
    const newMyPodList: any[] = [...myPods];

    const ethWallet = userSelector.ethExternalWallet;

    ethWallet.forEach(extWalletObj => {
      const tokens = extWalletObj.tokens ?? [];
      tokens.forEach((tokenObj: any) => {
        const tokenType = tokenObj.tokenType ?? "";
        let imgUrl = "none";
        if (tokenObj.isOpenSea && tokenObj.openSeaImage && tokenObj.openSeaImage.includes("http"))
          imgUrl = tokenObj.openSeaImage;
        else if (tokenObj.images && tokenObj.images.large && tokenObj.images.large.includes("http"))
          imgUrl = tokenObj.images.large;
        const token = tokenObj.tokenSymbol;
        const tokenName = tokenObj.tokenName;
        // calculate balance
        const decimalPos = Number(tokenObj.tokenDecimal) ?? 0;
        const balanceStr: string = tokenObj.balance;
        const balanceStrWithDecimal =
          balanceStr.slice(0, -decimalPos) + "." + balanceStr.slice(-decimalPos + 1);
        const balance = Number(balanceStrWithDecimal);

        switch (tokenType) {
          case "SOCIAL":
            newSocialList.push({
              Token: token,
              TokenName: tokenName,
              Balance: balance,
              Type: tokenType,
              ImageUrl: imgUrl,
              IsEthWallet: true,
              DailyChange: 0,
              _priviUniqueId: token._priviUniqueId || generateUniqueId(),
            });
            break;
          case "NFTPOD":
            newMyPodList.push({
              Token: token,
              TokenName: tokenName,
              Balance: balance,
              Type: tokenType,
              ImageUrl: imgUrl,
              IsEthWallet: true,
              DailyChange: 0,
              _priviUniqueId: token._priviUniqueId || generateUniqueId(),
            });
            break;
        }
      });

      const catalogs = extWalletObj.catalog ?? [];
      catalogs.forEach((catalog: any) => {
        newSocialList.push({
          Token: "",
          TokenName: "",
          Balance: catalog.price,
          Type: "",
          ImageUrl: catalog.mediaUrl,
          IsEthWallet: true,
          DailyChange: 0,
          _priviUniqueId: generateUniqueId(),
        });
      });
    });

    setSocialList(newSocialList);
    setPodList(newMyPodList);
  }, [userSelector.ethExternalWallet, mySocials, myPods]);

  const getAllBalanceHistoryInfo = () => {
    if (ownUser) {
      const config = {
        params: {
          userId: userId,
        },
      };
      setIsDataLoading(true);
      axios
        .get(`${URL()}/wallet/getUserTokenTypeBalanceHistory`, config)
        .then(response => {
          const resp = response.data;
          if (resp.success) {
            const data = resp.data;
            const socialHistory = data.socialHistory;
            const ftHistory = data.ftHistory;
            const nftHistory = data.nftHistory;
            const xSocial: number[] = [];
            const ySocial: number[] = [];
            const xFT: number[] = [];
            const yFT: number[] = [];
            const xNFT: number[] = [];
            const yNFT: number[] = [];
            socialHistory.forEach(point => {
              // const date = new Date(point.date);
              ySocial.push(point.price);
              // xSocial.push(formatDate(date));
              xSocial.push(point.date);
            });
            ftHistory.forEach(point => {
              // const date = new Date(point.date);
              yFT.push(point.price);
              // xFT.push(formatDate(date));
              xFT.push(point.date);
            });
            nftHistory.forEach(point => {
              // const date = new Date(point.date);
              yNFT.push(point.price);
              // xNFT.push(formatDate(date));
              xNFT.push(point.date);
            });

            const newSocialChart = { ...socialChart };
            newSocialChart.config.data.labels = makeLabels(xSocial, 10);
            newSocialChart.config.data.datasets[0].data = makePoints(xSocial, ySocial, 10);
            setSocialChart(newSocialChart);

            const newFtChart = { ...ftChart };
            newFtChart.config.data.labels = makeLabels(xFT, 10);
            newFtChart.config.data.datasets[0].data = makePoints(xFT, yFT, 10);
            setFtChart(newFtChart);
          }
          setIsDataLoading(false);
        })
        .catch(() => {
          setIsDataLoading(false);
        });
    }
  };

  const getAllInfoProfile = async (
    userId,
    mainTab = profileCardsOptions[tabsCardsValue],
    subTab = profileSubTabs[subTabsValue],
    lastId = null,
    isLastNFT = true,
    pagination = 1,
    lastLikedMedia = "owner"
  ) => {
    if (userId) {
      if (source) {
        console.log("soure.cancel");
        source.cancel();
      }
      source = axios.CancelToken.source();
      console.log("soure.success");
      const config = {
        cancelToken: source.token,
        params: {
          userId: userId,
          isVisitor: userId && userSelector.id ? userId != userSelector.id : true,
          mainTab,
          subTab,
          lastId,
          isLastNFT,
          pagination,
          lastLikedMedia,
        },
      };

      try {
        const response = await axios.get<any>(`${URL()}/user/getProfileTapsInfo`, config);
        const resp = response.data;
        if (resp.success) {
          const data = resp.data;
          setPaginationHasMore(false);
          if (mainTab === profileCardsOptions[0]) {
            // SOCIAL TOKENS (& COMMUNITY)
            const socialTokens = data.socialTokens?.data ?? [];
            if (
              socialTokens.filter(s => s.Creator && (s.Creator === userId || s.Creator === userAddress))
                .length > 0
            ) {
              setSocialToken(
                socialTokens.filter(s => s.Creator && (s.Creator === userId || s.Creator === userAddress))[0]
              );
            }
            const communities = data.communities?.data ?? [];
            // pagination
            // setPaginationHasMore(data.socialTokens?.hasMore || data.communities?.hasMore);
            // if (data.socialTokens) {
            //   setPagination(data.socialTokens.newPagination);
            // }
            // let oldMySocials;
            // if (lastId === null || pagination === 1) {
            //   oldMySocials = [];
            // } else {
            //   oldMySocials = [...mySocials];
            // }

            const newMySocials = addUniqueIdToArray([...socialTokens, ...communities]);
            setMySocials(newMySocials);
            // update counter
            if (subTab == profileSubTabs[0]) {
              setUserStats({
                ...userStats,
                mySocialTokensCount: socialTokens.length,
                myCommunitiesCount: communities.length,
              });
            }
          } else if (mainTab === profileCardsOptions[1]) {
            if (data.pods) {
              // FT PODS
              // let oldMyPods;
              // if (lastId === null) {
              //   oldMyPods = [];
              // } else {
              //   oldMyPods = [...myPods];
              // }
              // setPaginationLastId(data.pods.lastId ?? null);
              // setPaginationHasMore(data.pods.hasMore ?? false);
              // setIsLastNFT(data.pods.isLastNFT ?? true);
              const newMyPods = data.pods.data ?? [];
              setMyPods(newMyPods);
              // update counter
              if (subTab == profileSubTabs[0]) {
                setUserStats({
                  ...userStats,
                  myFTPodsCount: newMyPods.length,
                });
              }
            }
          } else if (mainTab === profileCardsOptions[2]) {
            if (data.digitalPods) {
              // MEDIA PODS
              // pagination
              // let oldMyPodsMedia;
              // if (lastId === null) {
              //   oldMyPodsMedia = [];
              // } else {
              //   oldMyPodsMedia = [...myPodsMedia];
              // }
              // setPaginationHasMore(data.digitalPods.hasMore ?? true);
              // setPaginationLastId(data.digitalPods.lastId);
              const newMyPodsMedia = data.digitalPods.data ?? [];
              setMyPodsMedia(newMyPodsMedia);
              // update counter
              if (subTab == profileSubTabs[0]) {
                setUserStats({
                  ...userStats,
                  myDigitalPodsCount: newMyPodsMedia.length,
                });
              }
            }
          } else if (mainTab === profileCardsOptions[3]) {
            if (data.myCredits) {
              //SET CREDIT POOLS
              // pagination
              // let oldCredits;
              // if (lastId === null) {
              //   oldCredits = [];
              // } else {
              //   oldCredits = [...creditPoolsList];
              // }
              // setPaginationHasMore(!!data.myCredits.data.length && data.myCredits.hasMore);
              const newMyCredits = data.myCredits.data ?? [];
              setCreditPoolsList(newMyCredits);
              // update counter
              if (subTab == profileSubTabs[0]) {
                setUserStats({
                  ...userStats,
                  myCreditPoolsCount: newMyCredits.length,
                });
              }
            }
          } else if (mainTab === profileCardsOptions[4]) {
            //PLAYLISTS
            if (subTabsValue === 4) {
              setPaginationHasMore(data.myMedias.hasMore ?? true);
              setPaginationLastId(data.myMedias.lastId);
              const playlists = [...data.myMedias.data];
              playlists.forEach((playlist, index) => {
                const Artists = [] as any;
                if (playlist.Artists && playlist.Artists.length > 0) {
                  playlist.Artists.forEach(artist => {
                    const artistUser = allUsers.find(user => user.id === artist);
                    if (artistUser) {
                      Artists.push({
                        imageURL: artistUser.imageURL ?? "",
                        id: artistUser.id ?? "",
                      });
                    } else {
                      Artists.push({
                        imageURL: getRandomAvatarForUserIdWithMemoization(artist),
                        id: artist,
                      });
                    }
                  });
                }
                playlists[index].ArtistsInfo = Artists;
              });
              const newMyPlaylist = [...myPlaylists, ...playlists];
              setMyPlaylists(newMyPlaylist);
            }
            //MEDIA
            else {
              const newMedias = data?.myMedias?.data ?? [];
              let medias = [...newMedias];
              let mMedia = [] as any;
              medias.forEach((m, index) => {
                if (m.State?.Curated) {
                  medias[index].curatedMedia = true;
                }
                if (m.State?.Owned) {
                  medias[index].ownedMedia = true;
                }
                if (m.State?.Liked) {
                  medias[index].likedMedia = true;
                }
                m.ImageUrl = m.HasPhoto
                  ? `${URL()}/media/getMediaMainPhoto/${m.MediaSymbol.replace(/\s/g, "")}`
                  : undefined;

                const artistUser = allUsers.find(
                  user =>
                    (m.Creator && m.Creator !== "" && user.id === m.Creator) ||
                    (m.CreatorId && m.CreatorId !== "" && user.id === m.CreatorId) ||
                    (m.Requester && m.Requester !== "" && user.id === m.Requester)
                );
                if (artistUser) {
                  m.Artist = {
                    name: artistUser.name ?? "",
                    imageURL: artistUser.imageURL ?? "",
                    urlSlug: artistUser.urlSlug ?? "",
                    id: artistUser.id ?? "",
                  };
                } else if (m.creator) {
                  m.randomAvatar = getRandomAvatarForUserIdWithMemoization(m.creator);
                } else {
                  m.Artist = undefined;
                }
                medias[index].eth = m.MediaSymbol !== undefined ? false : true;

                const SavedCollabs =
                  m.SavedCollabs && m.SavedCollabs.length > 0
                    ? m.SavedCollabs.map(collaborator => {
                      const collaboratorUser = allUsers.find(user => user.id === collaborator.id);
                      return collaboratorUser
                        ? {
                          ...collaborator,
                          name: collaboratorUser.name ?? "",
                          imageURL: collaboratorUser.imageURL ?? "",
                          urlSlug: collaboratorUser.urlSlug ?? "",
                          id: collaboratorUser.id ?? "",
                        }
                        : undefined;
                    }).filter(removeUndef)
                    : undefined;

                medias[index].SavedCollabs = SavedCollabs;

                if (!m.price) {
                  if (
                    m.QuickCreation &&
                    m.ViewConditions &&
                    m.ViewConditions.Price > 0 &&
                    m.ViewConditions.ViewingToken
                  ) {
                    medias[index].price = `${m.ViewConditions.ViewingToken.toUpperCase()} ${m.ViewConditions.Price
                      }${m.ViewConditions.ViewingType === "DYNAMIC" ? "/per sec" : ""}`;
                  } else if (m.PaymentType === "FIXED" && m.FundingToken) {
                    medias[index].price = `${m.FundingToken.toUpperCase() ?? ""} ${m.Price && m.Price !== 0 ? m.Price : ""
                      }`;
                  } else if (m.PaymentType === "DYNAMIC" && m.FundingToken) {
                    medias[index].price = `${m.FundingToken.toUpperCase() ?? ""} ${medias[index].PricePerSecond && m.PricePerSecond !== 0
                        ? m.PricePerSecond + "/per sec."
                        : ""
                      }`;
                  } else medias[index].price = "";
                } else {
                  if (m.price && m.price.includes("($")) {
                    //separate price from usd price
                    let price = m.price.split("(")[0];
                    let usdPrice = "(" + m.price.split("(")[1];

                    m.price = price;
                    m.usdPrice = usdPrice;
                  }
                }
                mMedia.push(m);
              });

              if (data.myMedias) {
                // pagination
                // let oldMyMedias;
                // if (lastId === null) {
                //   oldMyMedias = [];
                // } else {
                //   oldMyMedias = [...myMedia];
                // }
                // setPaginationHasMore(data.myMedias.hasMore ?? true);
                // setPaginationLastId(data.myMedias.lastId);
                // setPaginationLastLikedMedia(data.myMedias.lastLikedMedia);

                const newMyMedia = [...mMedia];
                setMyMedia(newMyMedia);
                // update counter
                if (subTab == profileSubTabs[0]) {
                  setUserStats({
                    ...userStats,
                    myMediasCount: newMyMedia.length,
                  });
                }
              }
            }
          } else {
            //WORKS IN PROGRESS
            if (data.myWIP) {
              // pagination
              // let oldMyWips;
              // if (lastId === null) {
              //   oldMyWips = [];
              // } else {
              //   oldMyWips = [...myWips];
              // }
              // setPaginationHasMore(data.myWIP.hasMore ?? true);
              // setPaginationLastId(data.myWIP.lastId);

              const newMyWips = data.myWIP.data ?? [];
              setMyWips(newMyWips);
              // update counter
              if (subTab == profileSubTabs[0]) {
                setUserStats({
                  ...userStats,
                  myWorkInProgressCount: newMyWips.length,
                });
              }
            }
          }
        }
      } catch (error) {
        if (axios.isCancel(error)) {
          console.log("Request canceled");
        } else {
          console.log("cancel error");
          setStatus({
            msg: "Error getting user info",
            key: Math.random(),
            variant: "error",
          });
        }
        // eslint-disable-next-line no-throw-literal
        throw error;
      }
    }
  };

  const resetPagination = () => {
    setSocialList([]);
    setPodList([]);
    setMyPodsMedia([]);
    setCreditPoolsList([]);
    setMyMedia([]);
    setMyWips([]);
    setMySocials([]);
    setMyPods([]);
    setMyPlaylists([]);
    setPaginationLastId(null);
    setIsLastNFT(true);
    setPagination(1);
    setPaginationHasMore(true);
    setPaginationLastLikedMedia("owner");
  };

  const handleMainTab = index => {
    setTabsCardsValue(index);
    resetPagination();
    setSubTabsValue(0);
  };

  return (
    <div className="profile-tab">
      <div className="carousel">
        {profileCardsOptions.map((value, index) => {
          if (!(index === 5 && !ownUser))
            return (
              <TabCard
                label={value}
                key={`cards-tab-${index}`}
                length={
                  !userStats
                    ? 0
                    : index === 0
                      ? userStats.mySocialTokensCount + userStats.myCommunitiesCount
                      : index === 1
                        ? userStats.myFTPodsCount
                        : index === 2
                          ? userStats.myDigitalPodsCounts
                          : index === 3
                            ? userStats.myCreditPoolsCount
                            : index === 4
                              ? userStats.myMediasCount
                              : userStats.myWorkInProgressCount
                }
                setTabsCardsValue={() => handleMainTab(index)}
                index={index}
                tabsCardValue={tabsCardsValue}
                selected={tabsCardsValue === index}
              />
            );
          return null;
        })}
      </div>
      <LoadingWrapper loading={isDataLoading || isTokenListLoading}>
        <ProfilePane
          ownUser={ownUser}
          socialChart={socialChart}
          socialChartTokenList={socialChartTokenList}
          ftChart={ftChart}
          ftChartTokenList={ftChartTokenList}
          tabsCardsValue={tabsCardsValue}
          userId={userId}
          podList={podList}
          podsMediaList={myPodsMedia}
          socialList={socialList}
          creditPoolsList={creditPoolsList}
          myMedia={myMedia}
          myPlaylists={myPlaylists}
          myWips={myWips}
          userProfile={userProfile}
          getAllInfoProfile={getAllInfoProfile}
          onImportModalCall={onImportModalCall}
          hasMore={paginationHasMore}
          lastId={paginationLastId}
          pagination={pagination}
          profileCardsOptions={profileCardsOptions}
          profileSubTabs={profileSubTabs}
          isLastNFT={isLastNFT}
          lastLikedMedia={paginationLastLikedMedia}
          resetPagination={resetPagination}
          subTabsValue={subTabsValue}
          setSubTabsValue={setSubTabsValue}
        />
      </LoadingWrapper>
    </div>
  );
};

export default MyProfile;
