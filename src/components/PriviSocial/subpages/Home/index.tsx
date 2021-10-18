import React, { useEffect, useState } from "react";
import axios, { CancelTokenSource } from "axios";
import { useSelector } from "react-redux";
import cls from "classnames";
import styled from "styled-components";
import InfiniteScroll from "react-infinite-scroll-component";

import { Grid } from "@material-ui/core";

import { Card, SocialPrimaryButton } from "components/PriviSocial/index.styles";
import { CircularLoadingIndicator, Header2 } from "shared/ui-kit";
import Box from "shared/ui-kit/Box";
import { getUser, getUsersInfoList } from "store/selectors";
import URL from "shared/functions/getURL";
import { getRandomAvatarForUserIdWithMemoization } from "shared/services/user/getUserAvatar";
import { removeUndef } from "shared/helpers";
import { generateUniqueId } from "shared/functions/commonFunctions";
import { makePoints, makeLabels } from "shared/ui-kit/Chart/Chart-Utils";
import CardsGrid from "./components/CardsGrid";
import MyWall from "./components/MyWall";
import InfoPane from "./components/InfoPane";
import InfoStats from "./components/InfoStats";
import InfoSocialToken from "./components/InfoSocialToken";
import PrintProfileChart from "./components/ProfileChart";
import SocialChartConfig from "./components/ProfileChart/configs/Social-Chart-Config";
import FTChartConfig from "./components/ProfileChart/configs/FT-Chart-Config";
import { homeStyles } from "./index.styles";
import ProfileEditModal from "./modals/ProfileEdit";
import { getProfileTabsInfo, getOwnSocialToken } from "shared/services/API";
import CreateSocialTokenModal from "./modals/CreateSocialTokenModal";
import { useAlertMessage } from "shared/hooks/useAlertMessage";

const profileCardsOptions = ["Social", "Crew", "Media", "Digital NFT Pods"];
const profileSubTabs = ["All", "Owned", "Curated", "Liked"];

const arePropsEqual = (prevProps, currProps) => {
  return (
    prevProps.userProfile === currProps.userProfile &&
    prevProps.userId === currProps.userId &&
    prevProps.ownUser === currProps.ownUser
  );
};

const Home = React.memo(
  ({
    userProfile,
    userId,
    ownUser,
    getBasicInfo,
    toggleAnonymousMode,
  }: {
    userProfile: any;
    userId: string;
    ownUser: boolean;
    getBasicInfo: any;
    toggleAnonymousMode: any;
  }) => {
    const classes = homeStyles();

    // STORE
    const userSelector = useSelector(getUser);
    const users = useSelector(getUsersInfoList);

    // HOOKS
    const { showAlertMessage } = useAlertMessage();

    // TABS
    const [myBadges, setMyBadges] = useState<any[]>([]);
    const [myStats, setMyStats] = useState<any>(null);
    const [mySocialToken, setMySocialToken] = useState<any>(null);
    const [tabsCardsValue, setTabsCardsValue] = useState<number>(0);
    const [subTabsValue, setSubTabsValue] = useState<number>(0);

    // PROFILE USER
    const [profileUserId, setProfileUserId] = useState<string>("");
    /* --------------- Balance History Graph --------------- */
    const [socialChart, setSocialChart] = useState<any>(SocialChartConfig);
    const [ftChart, setFtChart] = useState<any>(FTChartConfig);

    const [mySocials, setMySocials] = useState<any[]>([]); // only Privi
    const [socialList, setSocialList] = useState<any[]>([]); // Privi + external tokens
    const [myCommunities, setMyCommunities] = useState<any[]>([]);
    const [myPodsMedia, setMyPodsMedia] = useState<any[]>([]); // only Privi
    const [podList, setPodList] = useState<any[]>([]); // Privi + external tokens
    const [myMedia, setMyMedia] = useState<any[]>([]);
    const [myPlaylists, setMyPlaylists] = useState<any[]>([]);

    const [paginationLastId, setPaginationLastId] = useState<any>(null);
    const [isLastNFT, setIsLastNFT] = useState<boolean>(true);
    const [pagination, setPagination] = useState<number>(1);
    const [paginationHasMore, setPaginationHasMore] = useState<boolean>(true);
    const [paginationLastLikedMedia, setPaginationLastLikedMedia] = useState<string>("owner");
    const [isDataLoading, setIsDataLoading] = useState<boolean>(false);

    //wall (ownUser only)
    const [displayWall, setDisplayWall] = useState<boolean>(false);

    //modals
    const [openEditProfileModal, setOpenEditProfileModal] = useState<boolean>(false);
    const [openCreateSocialTokenModal, setOpenCreateSocialTokenModal] = useState<boolean>(false);

    const handleOpenEditProfileModal = () => {
      setOpenEditProfileModal(true);
    };
    const handleOpenCreateSocialTokenModal = () => {
      if (mySocialToken) showAlertMessage(`You already have a Social Token created`, { variant: "error" });
      else setOpenCreateSocialTokenModal(true);
    };
    const handleCloseEditProfileModal = () => {
      setOpenEditProfileModal(false);
    };
    const handleCloseCreateSocialTokenModal = () => {
      setOpenCreateSocialTokenModal(false);
    };

    useEffect(() => {
      if (users && users.length > 0) {
        let url = window.location.href.split("/");
        const usrSlug = url[url.length - 1] === "" ? url[url.length - 2] : url[url.length - 1];
        const id = users.find(u => u.urlSlug === usrSlug)?.id || usrSlug;
        setProfileUserId(id);
      }
    }, [window.location.href, users]);

    useEffect(() => {
      if (profileUserId) {
        getmyStats();
        getAllInfoProfile();
        getAllBalanceHistoryInfo();
        // get user created social token
        getOwnSocialToken(userId).then(resp => {
          if (resp?.success) setMySocialToken(resp.data);
        });
      }
    }, [profileUserId]);

    const getmyStats = () => {
      setIsDataLoading(true);
      axios
        .get(`${URL()}/user/getUserCounters/${profileUserId}`)
        .then(response => {
          const resp = response.data;

          if (resp.success) {
            const { badges, ...others } = resp.data;
            setMyBadges(badges);
            setMyStats({ ...myStats, ...others });
          } else showAlertMessage(`Error getting user stats`, { variant: "error" });
          setIsDataLoading(false);
        })
        .catch(_ => {
          showAlertMessage(`Error getting user stats`, { variant: "error" });
          setIsDataLoading(false);
        });
    };

    const ProfileChart = () => {
      if (tabsCardsValue === 0) {
        return PrintProfileChart(socialChart);
      } else if (tabsCardsValue === 3) {
        return PrintProfileChart(ftChart);
      }
      return null;
    };

    const getAllBalanceHistoryInfo = () => {
      if (ownUser) {
        const config = {
          params: {
            userId: profileUserId,
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
      lastId = "",
      isLastNFT = true,
      pagination = 1,
      lastLikedMedia = "owner"
    ) => {
      if (userId && profileUserId) {
        try {
          setIsDataLoading(true);
          const resp = await getProfileTabsInfo(
            profileUserId,
            !profileUserId || profileUserId != userSelector.id,
            profileCardsOptions[tabsCardsValue],
            profileSubTabs[subTabsValue],
            lastId,
            isLastNFT,
            pagination,
            lastLikedMedia
          );
          setIsDataLoading(false);
          if (resp.success) {
            setPaginationHasMore(false);
            const data = resp.data;
            switch (tabsCardsValue) {
              case 0:
                // SOCIAL TOKENS
                const socialTokens = data.socialTokens?.data ?? [];
                setMySocials(socialTokens);
                break;
              case 1:
                const communities = data.communities?.data ?? [];
                setMyCommunities(communities);
                break;
              case 2:
                //MEDIA + PLAYLISTS
                if (subTabsValue === 4) {
                  setPaginationHasMore(data.myMedias.hasMore ?? true);
                  setPaginationLastId(data.myMedias.lastId);
                  const playlists = [...data.myMedias.data];
                  playlists.forEach((playlist, index) => {
                    const Artists = [] as any;
                    if (playlist.Artists && playlist.Artists.length > 0) {
                      playlist.Artists.forEach(artist => {
                        const artistUser = users.find(user => user.id === artist);
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

                    const artistUser = users.find(
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
                          const collaboratorUser = users.find(user => user.id === collaborator.id);
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
                    const newMyMedia = [...mMedia];
                    setMyMedia(newMyMedia);
                  }
                }
                break;
              case 3:
                // DIGITAL PODS
                if (data.digitalPods) {
                  const newMyPodsMedia = data.digitalPods.data ?? [];
                  setMyPodsMedia(newMyPodsMedia);
                }
            }
          }
        } catch (error) {
          showAlertMessage(`Error getting user stats`, { variant: "error" });
        }
      }
    };

    const dataInfo = () => {
      if (tabsCardsValue === 0) {
        return {
          title: "My Social Tokens",
          data: socialList,
        };
      } else if (tabsCardsValue === 1) {
        return {
          title: "My Crews",
          data: myCommunities,
        };
      } else if (tabsCardsValue === 2) {
        if (subTabsValue === 4) {
          return {
            title: "My Playlist",
            data: myPlaylists,
          };
        } else {
          return {
            title: "My Media",
            data: myMedia,
          };
        }
      } else {
        return {
          title: "My Media Pods",
          data: myPodsMedia,
        };
      }
    };

    // add Social and NFT from external wallet, NOT COMPLETED!
    useEffect(() => {
      const newSocialList: any[] = [...mySocials];
      const newMyPodList: any[] = [...myPodsMedia];

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
    }, [userSelector.ethExternalWallet, mySocials, myPodsMedia]);

    useEffect(() => {
      if (userId) {
        getAllInfoProfile();
      }
    }, [tabsCardsValue, subTabsValue]);

    const loadMore = () => {
      getAllInfoProfile(paginationLastId, isLastNFT, pagination, paginationLastLikedMedia);
    };

    const resetPagination = () => {
      setSocialList([]);
      setPodList([]);
      setMyPodsMedia([]);
      setMyMedia([]);
      setMyCommunities([]);
      setMySocials([]);
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
      <div className={classes.home}>
        <Grid container>
          <Grid item>
            <Header2Bold noMargin style={{ marginBottom: "16px", marginRight: "16px" }}>
              My Profile
            </Header2Bold>
          </Grid>
          <Grid item>
            <Box display="flex" mb={2}>
              {ownUser && (
                <SocialPrimaryButton onClick={handleOpenEditProfileModal} style={{ marginRight: "16px" }}>
                  Edit Profile
                </SocialPrimaryButton>
              )}
              {ownUser && (
                <SocialPrimaryButton onClick={handleOpenCreateSocialTokenModal}>
                  Create Social Token
                </SocialPrimaryButton>
              )}
            </Box>
          </Grid>
        </Grid>
        <Grid container spacing={5}>
          <Grid item xs={12} md={6}>
            <InfoPane
              userProfile={userProfile}
              ownUser={ownUser}
              userId={userId}
              setStatus={() => { }}
              myBadges={myBadges}
              getUserStats={getmyStats}
            />
          </Grid>
          <Grid container item xs={12} md={6} spacing={3}>
            {mySocialToken && (
              <Grid item xs={12} sm={6} md={12}>
                <Box>
                  <InfoSocialToken socialToken={mySocialToken} />
                </Box>
              </Grid>
            )}
            <Grid item xs={12} sm={mySocialToken ? 6 : 12} md={12}>
              <InfoStats userProfile={userProfile} myStats={myStats} />
            </Grid>
          </Grid>
        </Grid>

        <Box mb={"30px"}>
          {(ownUser && !displayWall) || !ownUser ? (
            <>
              <Box mb={6} mt={7}>
                <Grid container>
                  <Grid item xs={12} sm={8}>
                    <Box display="flex" alignItems="center">
                      {profileCardsOptions.map((value, index) => (
                        <div
                          className={cls(
                            { [classes.tabCardSelected]: tabsCardsValue === index },
                            classes.tabCard
                          )}
                          key={`cards-tab-${index}`}
                          onClick={() => handleMainTab(index)}
                        >
                          <Box mb={"4px"}>{value}</Box>
                          <Box fontSize="20px" fontWeight={800}>
                            {!myStats
                              ? 0
                              : index === 0
                                ? myStats.mySocialTokensCount
                                : index === 1
                                  ? myStats.myCommunitiesCount
                                  : index === 2
                                    ? myStats.myMediasCount
                                    : myStats.myDigitalPodsCounts}
                          </Box>
                        </div>
                      ))}
                    </Box>
                  </Grid>
                  {ownUser && (
                    <Grid item xs={12} sm={4}>
                      <Box display="flex" alignItems="center" justifyContent="flex-end">
                        <SocialPrimaryButton onClick={() => setDisplayWall(true)}>
                          Go to Wall
                        </SocialPrimaryButton>
                      </Box>
                    </Grid>
                  )}
                </Grid>
              </Box>
              {tabsCardsValue === 0 ||
                (tabsCardsValue === 3 && (
                  <Card>
                    <Box fontSize="22px" fontWeight={800} mb={"-10px"}>
                      {profileCardsOptions[tabsCardsValue]}
                    </Box>
                    <ProfileChart />
                  </Card>
                ))}

              <Box display="flex" alignItems="center" mt={"48px"} mb={"42px"}>
                {profileSubTabs.map((option, index) => (
                  <div
                    className={cls({ [classes.subTabSelected]: subTabsValue === index }, classes.subTab)}
                    key={`cards-tab-${index}`}
                    onClick={() => setSubTabsValue(index)}
                  >
                    {option}
                  </div>
                ))}
                {tabsCardsValue === 2 && (
                  <div
                    className={cls({ [classes.subTabSelected]: subTabsValue === 4 }, classes.subTab)}
                    key={`cards-tab-${4}`}
                    onClick={() => setSubTabsValue(4)}
                  >
                    {"Playlists"}
                  </div>
                )}
              </Box>

              <InfiniteScroll
                style={{ overflowX: "hidden" }}
                hasChildren={dataInfo().data.length > 0}
                dataLength={dataInfo().data.length}
                scrollableTarget="profile-infite-scroll"
                next={loadMore}
                hasMore={paginationHasMore}
                loader={
                  isDataLoading && (
                    <LoadingIndicatorWrapper>
                      <CircularLoadingIndicator theme="green" />
                    </LoadingIndicatorWrapper>
                  )
                }
              >
                <CardsGrid
                  list={dataInfo().data}
                  type={
                    profileCardsOptions[tabsCardsValue].includes("Pod")
                      ? "Media Pod"
                      : profileCardsOptions[tabsCardsValue].includes("Crew")
                        ? "Crew"
                        : profileCardsOptions[tabsCardsValue].includes("Social")
                          ? "Social"
                          : "Media"
                  }
                  ownUser={ownUser}
                  hasMore={paginationHasMore}
                />
              </InfiniteScroll>
            </>
          ) : (
            <>
              <MyWall handleBack={() => setDisplayWall(false)} userId={userId} userProfile={userProfile} />
            </>
          )}
        </Box>
        {ownUser && (
          <ProfileEditModal
            getBasicInfo={getBasicInfo}
            open={openEditProfileModal}
            toggleAnonymousMode={toggleAnonymousMode}
            onCloseModal={handleCloseEditProfileModal}
          />
        )}
        {ownUser && (
          <CreateSocialTokenModal
            handleRefresh={() => getAllInfoProfile()}
            open={openCreateSocialTokenModal}
            handleClose={handleCloseCreateSocialTokenModal}
          />
        )}
      </div>
    );
  },
  arePropsEqual
);

export default Home;

const LoadingIndicatorWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding-top: 20px;
  padding-bottom: 50px;
`;

const Header2Bold = styled(Header2)`
  font-weight: 800;
`;
