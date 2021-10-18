import React, { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { Modal } from "@material-ui/core";

import PostFullScreen from "components/legacy/Pods/Pod-Page/components/Create-Post/Post-Full-Screen";
import { RootState } from "store/reducers/Reducer";
import { LiveStreamingDisplay } from "./components/Displays/LiveStreamingDisplay";
import AudioDisplay from "./components/Displays/AudioDisplay";
import BlogDisplay from "./components/Displays/BlogDisplay";
import BlogSnapDisplay, { isPayPerPage } from "./components/Displays/BlogSnapDisplay";
import DigitalArtDisplay from "./components/Displays/DigitalArtDisplay";
import EthDigitalArtDisplay from "./components/Displays/EthDigitalArtDisplay";
import VideoDisplay from "./components/Displays/VideoDisplay";
import MediaArtistsSlider from "./components/MediaArtistsSlider";
import MediaFilters from "./components/MediaFilters";
import MediaPlaylistsSlider from "./components/MediaPlaylistsSlider";
import MainPageContext from "./context";
import { useMediaPreloader } from "./useMediaPreloader";
import MediaMarketPlace from "./Marketplace/MediaMarketPlace";
import { initialFilters } from "./components/MediaFilters/initialFilters";
import BlogFullScreenDisplay from "./components/Displays/BlogFullScreenDisplay";
import MediaClaimableSongs from "./ClaimableSongs/MediaClaimableSongs";
import ArtistsDisplay from "./ClaimableSongs/components/ArtistsDisplay";
import GenresDisplay from "./ClaimableSongs/components/GenresDisplay";

import { signTransaction } from "shared/functions/signTransaction";
import URL from "shared/functions/getURL";
import { MediaSource, PaymentType, SearchMediaFilters } from "shared/services/API/MediaAPI";
import { removeUndef } from "shared/helpers/fp";
import { useAuth } from "shared/contexts/AuthContext";
import { getRandomAvatarForUserIdWithMemoization } from "shared/services/user/getUserAvatar";
import { usePageRefreshContext } from "shared/contexts/PageRefreshContext";
import { VirtualizedMasnory } from "shared/ui-kit/VirtualizedMasnory";
import { LoadingWrapper } from "shared/ui-kit/Hocs/LoadingWrapper";
import { SignatureRequestModal } from "shared/ui-kit/Modal/Modals";
import * as API from "shared/services/API/MediaAPI";
import { openMediaForSubstrate } from "shared/services/API";
import { useSubstrate } from "shared/connectors/substrate";
import { TabNavigation } from "shared/ui-kit";
import AlertMessage from "shared/ui-kit/Alert/AlertMessage";

import styles from "./index.module.scss";
import { HeaderTitle } from "shared/ui-kit/Header/components/HeaderTitle";

enum MediaType {
  Video = "VIDEO_TYPE",
  LiveVideo = "LIVE_VIDEO_TYPE",
  Audio = "AUDIO_TYPE",
  LiveAudio = "LIVE_AUDIO_TYPE",
  Blog = "BLOG_TYPE",
  BlogSnap = "BLOG_SNAP_TYPE",
  DigitalArt = "DIGITAL_ART_TYPE",
}

const capitalizeFirstLetter = string => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

const MediaPage: React.FunctionComponent = () => {
  const location: any = useLocation();
  let pathName = window.location.href;
  let idUrl = pathName.split("/")[5] ? pathName.split("/")[5] : "";
  const tag = location.state ? location.state.blockchainTag : "privi";
  const tab = location.state ? Number(location.state.tab) : 0;
  const { isSignedin } = useAuth();
  const { requireMediaPageReload, setRequireMediaPageReload } = usePageRefreshContext();
  //store
  const userSelector = useSelector((state: RootState) => state.user);
  const allUsers = useSelector((state: RootState) => state.usersInfoList);

  const scrollRef = React.useRef<any>();

  //hooks
  const { api, apiState, keyring, keyringState } = useSubstrate();

  const [mediaTabSelection, setMediaTabSelection] = useState<number>(0);

  const [open, setOpen] = useState<MediaType | null>(null);
  const history = useHistory();
  const [selectedMedia, setSelectedMedia] = useState<any>(null);
  const [mediaFullScreen, setMediaFullScreen] = useState<any>(null);
  const [isDataLoading, setIsDataLoading] = useState<boolean>(false);

  const displayRef = useRef<null | HTMLDivElement>(null);

  const [triggerPlaylists, setTriggerPlaylists] = useState<boolean>(false);
  const [triggerGetMedia, setTriggerGetMedia] = useState<boolean>(false);
  const [playlists, setPlaylists] = useState<any[]>([]);

  const [blogIsCharged, setBlogIsCharged] = useState<boolean>(false);
  const [openSignRequestModal, setOpenSignRequestModal] = useState<boolean>(false);
  const [signRequestModalDetail, setSignRequestModalDetail] = useState<any>(null);

  const [openModalPreviewPost, setOpenModalPreviewPost] = useState<boolean>(false);
  const [mediaTabs, setMediaTabs] = useState<string[]>(["Media feed", "Marketplace"]);

  // data and filters
  const [filters, setFilters] = useState<SearchMediaFilters>(initialFilters);
  const { data, hasMore, loadMore, reload } = useMediaPreloader(filters);

  const [blogStartModal, setBlogStartModal] = useState<boolean>(false);

  const [status, setStatus] = useState<any>("");

  //update playlists
  useEffect(() => {
    loadPlaylists();
  }, [triggerPlaylists]);

  useEffect(() => {
    if (requireMediaPageReload) {
      reload();
      setRequireMediaPageReload(false);
    }
  }, [requireMediaPageReload]);

  useEffect(() => {
    setTimeout(() => {
      if (displayRef && displayRef.current && open) {
        displayRef.current.scrollIntoView({ block: "start", behavior: "smooth" });
      }
      // else history.push("/media");
    }, 1000);

    if (selectedMedia && !mediaFullScreen) {
      setMediaTabSelection(0);
    }

    //   if (open === MediaType.Blog || open === MediaType.BlogSnap) {
    //     if (selectedMedia?.source === MediaSource.Privi && selectedMedia.PaymentType === PaymentType.Fixed) {
    //       handleOpenBlogModal();
    //     } else {
    //       openPreviewModal();
    //     }
    //   }

    // BlogSnap payment information initialization
    if (open === MediaType.BlogSnap) {
      if (isPayPerPage(selectedMedia)) {
        const totalPages = selectedMedia?.EditorPages?.length ?? 0;
        if (selectedMedia.paidPages === undefined)
          setSelectedMedia({ paidPages: new Array(totalPages).fill(false), ...selectedMedia });
      } else if (selectedMedia.paid === undefined) {
        setSelectedMedia({ ...selectedMedia, paid: false });
      }
    }
  }, [open, selectedMedia]);

  useEffect(() => {
    setTimeout(() => {
      if (displayRef && displayRef.current && mediaFullScreen) {
        displayRef.current.scrollIntoView({ block: "start", behavior: "smooth" });
      }
    }, 1000);
  }, [mediaFullScreen]);

  // update getMedia
  useEffect(() => {
    const loadMedia = async () => {
      setIsDataLoading(true);
      axios
        .get(`${URL()}/media/getMedia/${idUrl}/${tag}`)
        .then(async response => {
          let data: any = response.data;
          if (data.success) {
            let m = data.data;

            m.eth = tag === "privi" ? false : true;

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

            m.SavedCollabs = SavedCollabs;

            if (!m.price) {
              if (
                m.QuickCreation &&
                m.ViewConditions &&
                m.ViewConditions.Price > 0 &&
                m.ViewConditions.ViewingToken
              ) {
                m.price = `${m.ViewConditions.ViewingToken.toUpperCase()} ${m.ViewConditions.Price}${
                  m.ViewConditions.ViewingType === "DYNAMIC" ? "/per sec" : ""
                }`;
              } else if (m.PaymentType === "FIXED" && m.FundingToken) {
                m.price = `${m.FundingToken.toUpperCase() ?? ""} ${m.Price && m.Price !== 0 ? m.Price : ""}`;
              } else if (m.PaymentType === "DYNAMIC" && m.FundingToken) {
                m.price = `${m.FundingToken.toUpperCase() ?? ""} ${
                  m.PricePerSecond && m.PricePerSecond !== 0 ? m.PricePerSecond + "/per sec." : ""
                }`;
              } else m.price = "";
            } else {
              if (m.price && m.price.includes("($")) {
                //separate price from usd price
                let price = m.price.split("(")[0];
                let usdPrice = "(" + m.price.split("(")[1];

                m.price = price;
                m.usdPrice = usdPrice;
              }
            }

            setSelectedMedia(m);
            data.data.Type ? setOpen(data.data.Type) : setOpen(data.data.type);
          } else {
            setStatus({
              msg: "Error loading Media",
              key: Math.random(),
              variant: "error",
            });
            if (window.location.href.includes("/media/")) {
              history.push("/media");
            }
          }
          setIsDataLoading(false);
        })
        .catch(err => {
          setIsDataLoading(false);
          setStatus({
            msg: "Error requesting Media",
            key: Math.random(),
            variant: "error",
          });
          if (window.location.href.includes("/media/")) {
            history.push("/media");
          }
        });
    };
    if (idUrl !== "" && (!selectedMedia || !selectedMedia.id)) {
      loadMedia();
    } else {
      if (tab) {
        setMediaTabSelection(tab);
      }
    }
  }, [idUrl, pathName, triggerGetMedia]);

  useEffect(() => {
    if (isSignedin) {
      setMediaTabs(["Media feed", "Marketplace", "Claimable songs"]);
    }
  }, [isSignedin]);

  const openPreviewModal = () => {
    setOpenModalPreviewPost(true);
  };

  const handleCloseModalPreviewPost = () => {
    // TODO: refresh
    setOpenModalPreviewPost(false);
  };
  const handleOpenBlogModal = () => {
    setBlogStartModal(true);
  };
  const handleCloseBlogModal = isCharged => {
    if (!isCharged) {
      setSelectedMedia(null);
    }
    setBlogStartModal(false);
  };

  const loadPlaylists = () => {
    axios
      .get(`${URL()}/media/getPlaylists`)
      .then(async response => {
        const resp = response.data;
        if (resp.success) {
          const data = resp.data;
          setPlaylists(data);
        } else {
          setStatus({
            msg: "Error loading playlists",
            key: Math.random(),
            variant: "error",
          });
        }
      })
      .catch(error => {
        setStatus({
          msg: "Error requesting playlists",
          key: Math.random(),
          variant: "error",
        });
      });
  };

  const handleClickPay = () => {
    setOpenSignRequestModal(true);
  };

  const handleConfirmSign = async () => {
    try {
      if (selectedMedia.NftConditions && selectedMedia.NftConditions !== {}) {
        if (!selectedMedia.BlockchainNetwork || selectedMedia.BlockchainNetwork === "Privi Chain") {
          let body: any = {
            Listener: userSelector.id,
            PodAddress: selectedMedia?.source === MediaSource.Privi && selectedMedia.PodAddress,
            MediaSymbol: selectedMedia?.source === MediaSource.Privi && selectedMedia.MediaSymbol,
          };
          const [hash, signature] = await signTransaction(userSelector.mnemonic, body);
          body.Hash = hash;
          body.Signature = signature;

          axios
            .post(`${URL()}/streaming/initiateMediaStreaming`, body)
            .then(response => {
              if (response.data.success) {
                setBlogIsCharged(true);
                openPreviewModal();
              } else {
                setStatus({
                  msg: response.data.error || "Error making the request",
                  key: Math.random(),
                  variant: "error",
                });
              }
            })
            .catch(error => {
              setStatus({
                msg: "Error making the request",
                key: Math.random(),
                variant: "error",
              });
            });

          let data: any = {
            MediaSymbol: selectedMedia.MediaSymbol.replace(/\s/g, ""),
            Address: userSelector.address,
            SharingId: "",
          };
          const [hash2, signature2] = await signTransaction(userSelector.mnemonic, data);
          let body2: any = {};
          body2.Data = data;
          body2.Hash = hash2;
          body2.Signature = signature2;

          axios.post(`${URL()}/media/openNFT`, body2).then(response => {
            if (response.data.success) {
            } else {
              setStatus({
                msg: response.data.error || "Error making the request",
                key: Math.random(),
                variant: "error",
              });
            }
          });
          const response = await API.openNFT(body2);
        }
        if (selectedMedia.BlockchainNetwork === "Substrate Chain") {
          if (!api) return;

          const keyringOptions = (keyring as any).getPairs().map(account => ({
            key: account.address,
            value: account.address,
            text: account.meta.name ? account.meta.name.toUpperCase() : "",
            icon: "user",
          }));

          const accountAddress = keyringOptions.length > 0 ? keyringOptions[0].value : "";

          const accountPair =
            accountAddress && keyringState === "READY" && (keyring as any).getPair(accountAddress);

          const payload = {
            media_id: selectedMedia.BlockchainId,
          };

          openMediaForSubstrate(payload, api, accountPair).then(res => {
            if (!res.success) {
              setStatus({
                msg: "Error while opening media",
                key: Math.random(),
                variant: "error",
              });
            }
          });
        }
      }
      handleCloseBlogModal(false);
    } catch (e) {
      setStatus({
        msg: e.message,
        key: Math.random(),
        variant: "error",
      });
    }
  };

  const handleChangeTabs = value => {
    setMediaTabSelection(value);
  };

  return (
    <LoadingWrapper loading={isDataLoading}>
      <MainPageContext.Provider
        value={{
          open: open,
          setOpen: setOpen,
          selectedMedia: selectedMedia,
          setSelectedMedia: setSelectedMedia,
          mediaFullScreen: mediaFullScreen,
          setMediaFullScreen: setMediaFullScreen,
        }}
      >
        <div className={styles.container} ref={scrollRef}>
          {!mediaFullScreen ? (
            <div className={styles.mainContainer}>
              <HeaderTitle
                title="Welcome to <b><i>PRIVI</i></b>"
                subtitle="The place where you can <b>create and monetize</b> your content!"
                isMediaPage={true}
                marginBottom={86}
              />
              <div className={styles.appbarContainer}>
                <TabNavigation
                  tabs={mediaTabs}
                  currentTab={mediaTabSelection}
                  variant="secondary"
                  size="extralarge"
                  onTabChange={handleChangeTabs}
                />
              </div>
              {mediaTabSelection === 0 ? (
                <>
                  <MediaFilters
                    filters={filters}
                    onFiltersChange={setFilters}
                    triggerPlaylists={() => setTriggerPlaylists(!triggerPlaylists)}
                    triggerGetMedia={() => setTriggerGetMedia(!triggerGetMedia)}
                  />
                  {selectedMedia && !selectedMedia.tag ? (
                    <div ref={displayRef}>
                      {open === MediaType.LiveVideo || open === MediaType.LiveAudio ? (
                        <LiveStreamingDisplay
                          onClose={() => {
                            setSelectedMedia(null);
                            setOpen(null);
                            history.push("/media");
                          }}
                        />
                      ) : open === MediaType.Audio ? (
                        <AudioDisplay />
                      ) : open === MediaType.Video ? (
                        <VideoDisplay />
                      ) : open === MediaType.DigitalArt ? (
                        <DigitalArtDisplay />
                      ) : open === MediaType.Blog ? (
                        <BlogDisplay />
                      ) : open === MediaType.BlogSnap ? (
                        <BlogSnapDisplay />
                      ) : null}
                    </div>
                  ) : selectedMedia && selectedMedia.tag ? (
                    <div ref={displayRef}>
                      <EthDigitalArtDisplay />
                    </div>
                  ) : null}
                  <MediaArtistsSlider />
                  <MediaPlaylistsSlider playlists={playlists} />
                  <div
                    style={{
                      fontSize: "30px",
                      width: "100%",
                      paddingBottom: "15px",
                      borderBottom: "1px solid #181818",
                      marginBottom: "20px",
                    }}
                  >
                    Featured
                  </div>
                  {scrollRef.current && ((data && data.length) || hasMore) ? (
                    <VirtualizedMasnory
                      list={data}
                      loadMore={loadMore}
                      hasMore={hasMore}
                      triggerPlaylists={triggerGetMedia}
                      scrollElement={scrollRef.current}
                      itemRender={undefined}
                    />
                  ) : (
                    <div className={styles.noMessage}>No Results</div>
                  )}
                </>
              ) : mediaTabSelection === 1 ? (
                <MediaMarketPlace />
              ) : (
                isSignedin && <MediaClaimableSongs />
              )}
            </div>
          ) : Object.values(MediaType).includes(mediaFullScreen) ? (
            <div ref={displayRef}>
              <BlogFullScreenDisplay />
            </div>
          ) : mediaFullScreen === "Artists" ? (
            <div ref={displayRef}>
              {" "}
              <ArtistsDisplay />
            </div>
          ) : (
            <div ref={displayRef}>
              {" "}
              <GenresDisplay />
            </div>
          )}

          {status && (
            <AlertMessage
              key={status.key}
              message={status.msg}
              variant={status.variant}
              onClose={() => setStatus(undefined)}
            />
          )}

          <Modal
            className={styles.modalPreviewPost}
            open={openModalPreviewPost}
            onClose={handleCloseModalPreviewPost}
          >
            <PostFullScreen
              content={
                selectedMedia &&
                (selectedMedia.source === MediaSource.Privi ||
                  ((open === MediaType.BlogSnap || open === MediaType.Blog) &&
                    selectedMedia.source !== MediaSource.Eth)) &&
                selectedMedia.EditorPages
                  ? selectedMedia.EditorPages
                  : []
              }
              onBackButtonClick={handleCloseModalPreviewPost}
              isBlogSnap={open === MediaType.BlogSnap}
            />
          </Modal>

          {open !== MediaType.BlogSnap && open !== MediaType.Blog && (
            <Modal
              className={styles.modalBlogPayment}
              open={blogStartModal}
              onClose={() => handleCloseBlogModal(false)}
            >
              <div className={styles.modalBlogDiv}>
                {selectedMedia &&
                /*selectedMedia.source === MediaSource.Privi &&*/ selectedMedia.PaymentType ? (
                  <div>
                    <h2>{capitalizeFirstLetter(selectedMedia.PaymentType.toLowerCase())} Payment</h2>
                    {selectedMedia.PaymentType === PaymentType.Fixed ? (
                      <h4>
                        {selectedMedia.Price} {selectedMedia.FundingToken}
                      </h4>
                    ) : null}
                    <div className="flexCenterCenterRow">
                      <button onClick={handleClickPay}>Pay</button>
                      <button
                        onClick={() => {
                          handleCloseBlogModal(false);
                          setSelectedMedia(null);
                        }}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : null}
              </div>
            </Modal>
          )}
          <SignatureRequestModal
            open={openSignRequestModal}
            address={userSelector.address}
            transactionFee="0.0000"
            detail={signRequestModalDetail}
            handleOk={handleConfirmSign}
            handleClose={() => setOpenSignRequestModal(false)}
          />
        </div>
      </MainPageContext.Provider>
    </LoadingWrapper>
  );
};

export default MediaPage;
