import React, { useEffect, useState } from "react";
import Axios from "axios";

import { makeStyles } from "@material-ui/core/styles";
import { useHistory } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "store/reducers/Reducer";
import { VoteModal } from "../../modals/VoteModal/VoteModal";
import { FinalStepModal } from "components/legacy/Media/components/Displays/elements";
import {
  getMediaUrl,
  isVideoUrl,
  MediaAssetDimensions,
  preloadVideoAndGetDimenstions,
  preloadImageAndGetDimenstions,
} from "../../../../useMediaPreloader";
import { RANDOM_MOCK_PLAYLISTS_LENGTH } from "shared/constants/constants";
import { PrimaryButton, SecondaryButton } from "shared/ui-kit";
import URL from "shared/functions/getURL";
import { getRandomAvatarForUserIdWithMemoization } from "shared/services/user/getUserAvatar";
import { removeUndef } from "shared/helpers/fp";
import { useTokenConversion } from "shared/contexts/TokenConversionContext";
import AlertMessage from "shared/ui-kit/Alert/AlertMessage";
import { LoadingWrapper } from "shared/ui-kit/Hocs";
import Box from 'shared/ui-kit/Box';

enum MediaType {
  Video = "VIDEO_TYPE",
  LiveVideo = "LIVE_VIDEO_TYPE",
  Audio = "AUDIO_TYPE",
  LiveAudio = "LIVE_AUDIO_TYPE",
  Blog = "BLOG_TYPE",
  BlogSnap = "BLOG_SNAP_TYPE",
  DigitalArt = "DIGITAL_ART_TYPE",
}

const useStyles = makeStyles(theme => ({
  back: {
    "& span": {
      background: "linear-gradient(97.4deg, #23D0C6 14.43%, #00CC8F 85.96%)",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
      fontSize: 14,
    },
    marginBottom: 20,
    cursor: "pointer",
  },
  header: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
    marginBottom: 36,
    "& h1": {
      fontFamily: "Agrandir GrandLight",
      fontWeight: 300,
      fontSize: 64,
      margin: 0,
      zIndex: 2,
    },
  },
  content: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "28px 120px 60px",
    marginLeft: "-120px",
    background: " #F7F9FE",
    minHeight: "calc(100vh - 82px - 60px - 208px)",
    width: "calc(100% + 120px * 2)",
    flexGrow: 1,
  },
  loaderDiv: {
    width: "100%",
    display: "flex",
    alignItems: "center",
    alignContent: "center",
    justifyContent: "center",
  },
  contentRow: {
    marginBottom: 40,
    display: "flex",
    alignItems: "center",
    "& > :first-child": {
      width: "90px",
      height: "180px",
      marginRight: "60px",
    },
    "& > :last-child": {
      width: "90px",
      height: "180px",
      transform: "rotate(180deg)",
    },
  },
  mediaCard: {
    display: "flex",
    flexDirection: "column",
    cursor: "pointer",
    width: "270px",
    backgroundColor: "white",
    borderRadius: 20,
    boxShadow: "2px 2px 12px rgba(0, 0, 0, 0.1)",
    marginTop: "15px",
  },
  mediaCardSelected: {
    display: "flex",
    flexDirection: "column",
    cursor: "pointer",
    width: "270px",
    backgroundColor: "white",
    borderRadius: 20,
    marginTop: "15px",
    boxShadow: "0px 0px 10px #27E8D9",
  },
  price: {
    borderTop: "1px solid #0000000d",
    display: "flex",
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    width: "100%",
    color: "#1818180",
    fontSize: "24px",
    padding: "16px 12px",
    "& span": {
      color: "#707582",
      fontSize: "16px",
    },
  },
  cardHeader: {
    padding: 0,
    borderTopLeftRadius: "20px",
    borderTopRightRadius: "20px",
    height: "fit-content",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    border: 0,
    background: "#949bab",
    position: "relative",
    overflow: "hidden",
    marginLeft: 0,
    marginRight: 0,
    width: "100%",
  },
  aspectRatioWrapper: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    overflow: "hidden",

    "& > img": {
      width: "100%",
      height: "100%",
      objectFit: "cover",
      zIndex: 0,
    },
    "& > video": {
      width: "100%",
      height: "auto",
      objectFit: "cover",
      position: "relative",
      zIndex: 0,
    },
  },
  thumbnails: {
    width: 270,
    height: 270,
    minWidth: 270,
    borderTopLeftRadius: "20px",
    borderTopRightRadius: "20px",
    backgroundColor: "#F2F2F2",
    display: "flex",
    flexWrap: "wrap",
    "& div": {
      background: "#707582",
    },
  },
  only: {
    borderTopLeftRadius: "20px",
    borderTopRightRadius: "20px",
    height: "100%",
    width: "100%",
  },
  two: {
    width: "50%",
    height: "100%",

    "&:first-child": {
      borderTopLeftRadius: "20px",
    },
    "&:last-child": {
      borderTopRightRadius: "20px",
    },
  },
  four: {
    width: "50%",
    height: "50%",

    "&:first-child": {
      borderTopLeftRadius: "20px",
    },
    "&:nth-child(2)": {
      borderTopRightRadius: "20px",
    },
  },
  playButton: {
    width: "80px",
    height: "80px",
    minHeight: "80px",
    zIndex: 3,
  },
  userImage: {
    width: "30px",
    height: "30px",
    borderRadius: " 50%",
    border: "2px solid white",
    background: "white",
    filter: "drop-shadow(0px 2px 8px rgba(0, 0, 0, 0.12))",
    boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.25)",
    marginRight: "-8px",
    cursor: "pointer",
  },
  userCounter: {
    color: "#6b6b6b",
    fontSize: "11px",
    background: "white",
    padding: "2px",
    borderRadius: "8px",
    boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.25)",
    zIndex: 1,
  },
}));

export const VotingVs = ({ collection, setCollection }) => {
  const allUsers = useSelector((state: RootState) => state.usersInfoList);
  const classes = useStyles();
  const { convertTokenToUSD } = useTokenConversion();

  const [mediasToVote, setMediasToVote] = useState<any[]>([]);
  const [selectedMedia, setSelectedMedia] = useState<any>(null);

  const [points, setPoints] = useState<number>(0);

  const [openVoteModal, setOpenVoteModal] = useState<boolean>(false);
  const [openFinalStepModal, setOpenFinalStepModal] = useState(false);

  const [errorMsg, setErrorMsg] = useState<string>("");
  const [openError, setOpenError] = useState(false);
  const [isMediaLoading, setIsMediaLoading] = useState<boolean>(false);

  const [matches, setMatches] = useState<any[]>([]);
  const [totalVote, setTotalVote] = useState(collection.TotalVotes);

  useEffect(() => {
    setTotalVote(collection.TotalVotes);
  }, [collection]);

  const handleOpenVoteModal = () => {
    setOpenVoteModal(true);
  };
  const handleCloseVoteModal = () => {
    setOpenVoteModal(false);
  };
  const handleOpenFinalStepModal = () => {
    setOpenFinalStepModal(true);
  };
  const handleCloseFinalStepModal = () => {
    setOpenFinalStepModal(false);
    handleOpenVoteModal();
  };

  useEffect(() => {
    if (allUsers && allUsers.length > 0 && collection) {
      handleShuffle();
    }
  }, [allUsers, collection]);

  const fetchRoundMatches = async () => {
    try {
      const response = await Axios.get(`${URL()}/media/getAllVotes`);
      if (!response.data.success) {
        return [];
      }
      const data = response.data.data;
      let curCollection = data.priviVotings.find(col => col.Collection === collection.Collection);
      if (!curCollection) {
        curCollection = data.ethVotings.find(col => col.Collection === collection.Collection);
      }
      if (!curCollection) {
        return [];
      }
      let matrix: any[] = [];
      let nftIds = curCollection.Items.map(item => item.id);
      for (let i = 0; i < curCollection.Items.length; i++) {
        const votes = curCollection.Items[i].votes;
        if (votes) {
          votes.forEach(vote => {
            const index = nftIds.indexOf(vote.nft);
            if (index < i) {
              return;
            }
            matrix.push([index, i, vote.win ? vote.win : 0, vote.lose ? vote.lose : 0]);
            // @Lucas's PR for NFT vote:
            // let item = [index, i, vote.win ? vote.win : 0, vote.loss ? vote.loss : 0];
            // if (!item[3]) {
            //   item = item.slice(0, 3);
            // }
            //matrix.push(item); 
          });
        }
      }
      const resp = await Axios.post(`${URL()}/media/getVoteMedias`, {
        collection: curCollection.Collection,
        nftIds,
        matrix,
      });
      if (resp.data?.matches) {
        return resp.data.matches;
      }
      return [];
    } catch (err) {
      console.log(err);
      return [];
    }
  };

  const handleShuffle = async () => {
    setSelectedMedia(null);
    try {
      let firstMedia;
      let secondMedia;
      // @Lucas's PR for NFT vote:
      // if (totalVote > collection.Items.length * 2) {
      if (totalVote) {
        let curMatches: any[] = [...matches];
        if (!curMatches.length) {
          curMatches = await fetchRoundMatches();
          if (!curMatches.length) {
            return;
          }
        }
        const match = curMatches[0];
        setMatches(curMatches.slice(1));
        firstMedia = collection.Items[match[0]].id;
        secondMedia = collection.Items[match[1]].id;
      } else {
        let len = collection.Items.length;
        let index1 = -1;
        let index2 = -1;
        while (index1 === index2) {
          index1 = Math.floor(Math.random() * len);
          index2 = Math.floor(Math.random() * len);
        }
        firstMedia = collection.Items[index1].id;
        secondMedia = collection.Items[index2].id;
        // @Lucas's PR for NFT vote:
        // setTotalVote(totalVote + 1);
        setTotalVote(1);
      }
      if (collection.Type !== "Playlist") {
        await loadMediaData(firstMedia, secondMedia, collection.Tag ?? "privi");
      } else {
        await loadPlaylistData(firstMedia, secondMedia);
        //load playlist data
      }
    } catch (err) { }
  };

  const loadMediaData = (mediaId1: string, mediaId2: string, tag: string) => {
    setIsMediaLoading(true);
    Axios.get(`${URL()}/media/getMedia/${encodeURIComponent(mediaId1)}/${tag ?? "privi"}`)
      .then(async response => {
        let data: any = response.data;
        if (data.success) {
          let m = data.data;

          let firstMedia = mediaDataSetter(m, tag);
          firstMedia.source = firstMedia.eth ? "eth" : "privi";
          if (!firstMedia.dimensions) {
            const mediaUrl = getMediaUrl(firstMedia);
            let dimensions: MediaAssetDimensions | undefined;
            if (mediaUrl) {
              try {
                dimensions = await (isVideoUrl(mediaUrl)
                  ? preloadVideoAndGetDimenstions
                  : preloadImageAndGetDimenstions)(mediaUrl);
              } catch (e) { }
            }
            firstMedia.dimensions = dimensions;
          }

          Axios.get(`${URL()}/media/getMedia/${encodeURIComponent(mediaId2)}/${tag ?? "privi"}`)
            .then(async response => {
              let data: any = response.data;
              if (data.success) {
                let m = data.data;

                let secondMedia = mediaDataSetter(m, tag);
                secondMedia.source = secondMedia.eth ? "eth" : "privi";
                if (!secondMedia.dimensions) {
                  const mediaUrl = getMediaUrl(secondMedia);
                  let dimensions: MediaAssetDimensions | undefined;

                  if (mediaUrl) {
                    try {
                      dimensions = await (isVideoUrl(mediaUrl)
                        ? preloadVideoAndGetDimenstions
                        : preloadImageAndGetDimenstions)(mediaUrl);
                    } catch (e) { }
                  }
                  secondMedia.dimensions = dimensions;
                }
                setMediasToVote([firstMedia, secondMedia]);
              } else {
                setErrorMsg("Error loading Media, please try shuffling");
                handleClickError();
              }
            })
            .catch(e => {
              console.log(e);
              setErrorMsg("Error requesting Media, please try shuffling");
              handleClickError();
            });
        } else {
          setErrorMsg("Error loading Media, please try shuffling");
          handleClickError();
        }
        setIsMediaLoading(false);
      })
      .catch(e => {
        console.log(e);
        setIsMediaLoading(false);
        setErrorMsg("Error requesting Media");
        handleClickError();
      });
  };

  const mediaDataSetter = (media, tag) => {
    let m = { ...media };

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
        m.price = `${m.ViewConditions.ViewingToken.toUpperCase()} ${m.ViewConditions.Price}${m.ViewConditions.ViewingType === "DYNAMIC" ? "/per sec" : ""
          }`;
        m.usdPrice = `($${convertTokenToUSD(
          m.ViewConditions.ViewingToken.toUpperCase(),
          m.ViewConditions.Price
        ).toFixed(6)}${m.ViewConditions.ViewingType === "STREAMING" ? "/per sec" : ""})`;
      } else if (m.PaymentType === "FIXED" && m.FundingToken) {
        m.price = `${m.FundingToken.toUpperCase() ?? ""} ${m.Price && m.Price !== 0 ? m.Price : ""}`;
        m.usdPrice = `($${convertTokenToUSD(m.FundingToken.toUpperCase(), m.Price).toFixed(6)})`;
      } else if (m.PaymentType === "DYNAMIC" && m.FundingToken) {
        m.price = `${m.FundingToken.toUpperCase() ?? ""} ${m.PricePerSecond && m.PricePerSecond !== 0 ? m.PricePerSecond + "/per sec." : ""
          }`;
        m.usdPrice = `($${convertTokenToUSD(m.FundingToken.toUpperCase(), m.PricePerSecond).toFixed(6)})`;
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

    return m;
  };

  const getRandomThumbnails = () => {
    const count = Math.max(1, Math.floor(Math.random() * 4));
    const thumbnails: Array<string> = [];

    for (let i = 0; i < count; i++) {
      thumbnails.push(Math.floor(Math.random() * RANDOM_MOCK_PLAYLISTS_LENGTH).toString());
    }
    return [...new Set(thumbnails)];
  };

  const loadPlaylistData = (firstMedia, secondMedia) => {
    setIsMediaLoading(true);
    Axios.get(`${URL()}/media/getPlaylist/${firstMedia}`)
      .then(res => {
        const resp = res.data;
        if (resp.success) {
          let playlistData = resp.data ?? {};

          let firstPlaylist = playlistDataSetter(playlistData);

          Axios.get(`${URL()}/media/getPlaylist/${secondMedia}`)
            .then(res => {
              const resp = res.data;
              if (resp.success) {
                let playlistData = resp.data;

                let secondPlaylist = playlistDataSetter(playlistData);

                setMediasToVote([firstPlaylist, secondPlaylist]);
              } else {
                setErrorMsg("Error getting Playlist, please try shuffling");
                handleClickError();
              }
            })
            .catch(e => {
              console.log(e);
              setErrorMsg("Error loading Playlist, please try shuffling");
              handleClickError();
            });
        } else {
          setErrorMsg("Error getting Playlist, please try shuffling");
          handleClickError();
        }
        setIsMediaLoading(false);
      })
      .catch(e => {
        console.log(e);
        setIsMediaLoading(false);
        setErrorMsg("Error loading Playlist, please try shuffling");
        handleClickError();
      });
  };

  const playlistDataSetter = playlist => {
    let playlistData = { ...playlist };

    const artistUser = allUsers.find(
      user => playlistData.Creator && playlistData.Creator !== "" && user.id === playlistData.Creator
    );

    if (artistUser) {
      playlistData.Artist = {
        imageURL: artistUser.imageURL ?? "",
        urlSlug: artistUser.urlSlug ?? "",
        id: artistUser.id ?? "",
      };
    } else {
      playlistData.Artist = undefined;
    }

    playlistData.price = `${playlistData.Token.toUpperCase() ?? "ETH"} ${playlistData.Price && playlistData.Price !== 0 ? playlistData.Price : "0"
      }`;
    playlistData.usdPrice = `($${convertTokenToUSD(
      playlistData.Token.toUpperCase(),
      playlistData.Price
    ).toFixed(6)})`;

    playlistData.Thumbnails = playlist.Thumbnails?.length > 0 ? playlist.Thumbnails : getRandomThumbnails();

    return playlistData;
  };

  const handleClickError = () => {
    setOpenError(true);
    setTimeout(() => {
      setOpenError(false);
    }, 4000);
  };

  const handleCloseError = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenError(false);
  };

  const handleVote = () => {
    //TODO: voting and set points
    handleOpenFinalStepModal();
    const points = 10;
    setPoints(points);

    setTimeout(() => {
      if (mediasToVote.length < 2) {
        return;
      }
      const firstMedia = mediasToVote[0];
      const secondMedia = mediasToVote[1];
      const body = {
        winMedia: selectedMedia,
        lossMedia: selectedMedia === firstMedia.id ? secondMedia.id : firstMedia.id,
        collection: collection.Collection,
        points,
      };
      Axios.post(`${URL()}/media/voteMedia`, body)
        .then(async response => {
          let data: any = response.data;
          if (data.success) {
            handleCloseFinalStepModal();
          } else {
            setErrorMsg("Error loading Vote");
            handleClickError();
            setOpenFinalStepModal(false);
          }
        })
        .catch(e => {
          console.log(e);
          setErrorMsg("Error requesting Vote");
          handleClickError();
          setOpenFinalStepModal(false);
        });
    }, 1000);
  };

  return (
    <Box height={"calc(100vh - 82px - 60px)"} maxHeight={"calc(100vh - 82px - 60px)"}>
      <Box display="flex" flexDirection="row" className={classes.back} onClick={() => setCollection(null)}>
        <span>{`< Back`}</span>
      </Box>
      <div className={classes.header}>
        <Box display="flex" flexDirection="row" alignItems="flex-end">
          <h1>
            Vote <b>NFTs</b>
          </h1>
        </Box>
      </div>

      <Box
        display="flex"
        flexDirection="row"
        justifyContent="space-between"
        width="100%"
        alignItems="center"
        marginBottom={"20px"}
      >
        <Box fontSize="22px" fontWeight="700">
          Which media is more valuable?
        </Box>
        <PrimaryButton size="medium" onClick={() => handleShuffle()}>
          Shuffle Media
        </PrimaryButton>
      </Box>

      <div className={classes.content}>
        <LoadingWrapper loading={isMediaLoading}>
          <>
            <div className={classes.contentRow}>
              <img src={require("assets/icons/big_arrow.png")} alt="right arrow" />
              {mediasToVote &&
                mediasToVote.map((media, index) => (
                  <MediaCard
                    key={media.id ?? media.MediaSymbol ?? `media-${index}`}
                    media={media}
                    selectedMedia={selectedMedia}
                    index={index}
                    setSelectedMedia={setSelectedMedia}
                    collection={collection}
                  />
                ))}
              <img src={require("assets/icons/big_arrow.png")} alt="right arrow" />
            </div>
            {mediasToVote && (
              <Box display="flex" alignItems="center" marginBottom={"20px"}>
                {selectedMedia ? (
                  <Box display="flex" alignItems="center">
                    <SecondaryButton
                      onClick={() => {
                        setSelectedMedia(null);
                      }}
                      size="medium"
                      style={{ marginBottom: 0 }}
                    >
                      Cancel
                    </SecondaryButton>
                    <PrimaryButton onClick={handleVote} size="medium">
                      Confirm
                    </PrimaryButton>
                  </Box>
                ) : (
                  <Box color="#707582" fontSize="16px" fontWeight="700">
                    Pick One Option
                  </Box>
                )}
              </Box>
            )}
          </>
        </LoadingWrapper>
      </div>
      {openError && <AlertMessage key={Math.random()} message={errorMsg} variant={"error"} />}
      <FinalStepModal isOpen={openFinalStepModal} onClose={handleCloseFinalStepModal} />
      <VoteModal
        open={openVoteModal}
        onClose={() => {
          handleCloseVoteModal();
          handleShuffle();
        }}
        points={points}
        onExploreCategories={() => {
          handleCloseVoteModal();
          setSelectedMedia(null);
          setCollection(null);
        }}
      />
    </Box>
  );
};

const MediaCard = ({ media, index, setSelectedMedia, selectedMedia, collection }) => {
  const classes = useStyles();
  const history = useHistory();

  return (
    <Box display="flex" flexDirection="column" alignItems="center" marginRight={"60px"}>
      <Box color={"#6f748080"} fontSize={"14px"}>{`Option ${index + 1}`}</Box>
      <div
        className={media.id === selectedMedia ? classes.mediaCardSelected : classes.mediaCard}
        onClick={() => setSelectedMedia(media.id)}
      >
        <div
          className={classes.cardHeader}
          style={
            media.dimensions
              ? {
                height: 0,
                paddingBottom: `${(media.dimensions.height / media.dimensions.width) * 100}%`,
              }
              : {
                height: "200px",
              }
          }
        >
          <div className={collection.Type === "Playlist" ? classes.thumbnails : classes.aspectRatioWrapper}>
            {collection.Type === "Playlist" ? (
              media.Thumbnails ? (
                media.Thumbnails.map((thumbnail, index) =>
                  media.Thumbnails.length === 1 ||
                    (media.Thumbnails.length > 1 && media.Thumbnails.length <= 3 && index < 2) ||
                    (media.Thumbnails.length > 3 && index < 4) ? (
                    <div
                      key={index}
                      className={
                        media.Thumbnails.length === 1
                          ? classes.only
                          : media.Thumbnails.length > 1 && media.Thumbnails.length <= 3 && index < 2
                            ? classes.two
                            : media.Thumbnails.length > 3 && index < 4
                              ? classes.four
                              : undefined
                      }
                      style={{
                        backgroundImage:
                          thumbnail && thumbnail !== ""
                            ? thumbnail.includes("media/getMediaMainPhoto")
                              ? `url(${URL()}/${thumbnail})`
                              : `url(${require(`assets/mediaIcons/mockup/playlist_mock_up_${parseInt(thumbnail, 10) + 1
                                }.png`)})`
                            : "none",
                        backgroundRepeat: "no-repeat",
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                      }}
                    />
                  ) : null
                )
              ) : (
                <div className={classes.only} />
              )
            ) : !media.eth ? (
              (media.Type === MediaType.Audio ||
                media.Type === MediaType.Video ||
                media.Type === MediaType.Blog ||
                media.Type === MediaType.BlogSnap) &&
                media.HasPhoto ? (
                <img
                  src={`${URL()}/media/getMediaMainPhoto/${media.MediaSymbol.replace(/\s/g, "")}`}
                  alt={media.MediaSymbol}
                />
              ) : media.Type === MediaType.Video ? (
                <img
                  src={
                    media.ImageUrl
                      ? media.ImageUrl
                      : new Date(media.StartedTime).getTime() >= new Date().getTime()
                        ? `${require("assets/backgrounds/video.png")}`
                        : `${require("assets/backgrounds/video.png")}`
                  }
                  alt={""}
                />
              ) : media.Type === MediaType.Blog ? (
                <img
                  src={
                    media.ImageUrl
                      ? media.ImageUrl
                      : new Date(media.StartedTime).getTime() >= new Date().getTime()
                        ? `${require("assets/backgrounds/blog.png")}`
                        : `${require("assets/backgrounds/blog.png")}`
                  }
                  alt={""}
                />
              ) : media.Type === MediaType.BlogSnap ? (
                <img
                  src={
                    media.ImageUrl
                      ? media.ImageUrl
                      : new Date(media.StartedTime).getTime() >= new Date().getTime()
                        ? `${require("assets/backgrounds/blog_snap.png")}`
                        : `${require("assets/backgrounds/blog_snap.png")}`
                  }
                  alt={""}
                />
              ) : media.Type === MediaType.DigitalArt ? (
                <img
                  src={`${URL()}/media/getDigitalArt/${media.MediaSymbol.replace(/\s/g, "")}`}
                  alt={media.MediaSymbol}
                />
              ) : null
            ) : media.Url ? (
              media.Url.indexOf("mp4") === -1 ? (
                <img alt={media.MediaSymbol} src={media.Url} />
              ) : (
                <video src={media.Url} autoPlay loop muted />
              )
            ) : null}
          </div>
          {(collection.Type === "Playlist" ||
            media.Type === MediaType.Audio ||
            media.Type === MediaType.Video) && (
              <div
                className={classes.playButton}
                style={{
                  backgroundImage: `url(${require("assets/icons/playlist_play.png")})`,
                  backgroundRepeat: "no-repeat",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  marginTop:
                    collection.Type === "Playlist"
                      ? "-202px"
                      : media.dimensions
                        ? `calc(${((media.dimensions.height / media.dimensions.width) * 100) / 2}% - 40px)`
                        : 62,
                }}
              />
            )}
        </div>

        <Box display={"flex"} flexDirection="row" alignItems="center" marginTop={"-18px"} marginLeft={"15px"}>
          <div
            className={classes.userImage}
            style={{
              backgroundImage:
                !media.eth || collection.Type === "Playlist"
                  ? media.Artist && media.Artist.imageURL && media.Artist.imageURL !== ""
                    ? `url(${media.Artist.imageURL})`
                    : "none"
                  : media.randomAvatar
                    ? `url(${media.randomAvatar})`
                    : "none",
              backgroundRepeat: "no-repeat",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
            onClick={e => {
              e.preventDefault();
              e.stopPropagation();
              if (!media.eth) {
                if (media.Artist && media.Artist.id && media.Artist.id !== "") {
                  history.push(`/profile/${media.Artist.id}`);
                }
              } else if (media.owner && media.owner !== "" && media.owner !== "Error") {
                history.push(
                  `/profile/${media.owner.includes("@") ? media.owner.replace("@", "") : media.owner}?eth`
                );
              }
            }}
          />
          {media.SavedCollabs && media.SavedCollabs.length > 0
            ? media.SavedCollabs.map((collaborator, index) =>
              index < 2 ? (
                <div
                  className={classes.userImage}
                  style={{
                    backgroundImage:
                      collaborator.imageURL && collaborator.imageURL !== ""
                        ? `url(${collaborator.imageURL})`
                        : "none",
                    backgroundRepeat: "no-repeat",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                  onClick={() => {
                    if (!media.eth && collaborator.id && collaborator.id !== "") {
                      history.push(`/profile/${collaborator.id}`);
                    }
                  }}
                />
              ) : null
            )
            : null}
          {media.SavedCollabs && media.SavedCollabs.length > 2 ? (
            <div className={classes.userCounter}>+{media.SavedCollabs.length - 2}</div>
          ) : null}
        </Box>
        <Box padding="16px 12px" color="#181818" fontSize="18px" fontWeight="bold">
          {media.MediaName ?? media.title ?? media.Title ?? ""}
        </Box>
        <div className={classes.price}>
          {media.price ?? "ETH N/A"}
          <span>{media.usdPrice ?? "($ N/A)"}</span>
        </div>
      </div>
    </Box>
  );
};
