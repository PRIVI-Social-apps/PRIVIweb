import React, { useEffect, useState } from "react";
import cls from "classnames";
import { makeStyles } from "@material-ui/core";
import { Avatar, Gradient, SecondaryButton } from "shared/ui-kit";
import { useTypedSelector } from "store/reducers/Reducer";
import { FruitCounters } from "components/PriviDAO/components/Cards/DAOCard";
import Box from "shared/ui-kit/Box";
import { getRandomAvatarForUserIdWithMemoization } from "shared/services/user/getUserAvatar";
import { useTokenConversion } from "shared/contexts/TokenConversionContext";
import { getMedia } from "shared/services/API";

export enum MediaType {
  Video = "VIDEO_TYPE",
  LiveVideo = "LIVE_VIDEO_TYPE",
  Audio = "AUDIO_TYPE",
  LiveAudio = "LIVE_AUDIO_TYPE",
  Blog = "BLOG_TYPE",
  BlogSnap = "BLOG_SNAP_TYPE",
  DigitalArt = "DIGITAL_ART_TYPE",
}

const useAcquistitionCardStyles = makeStyles(() => ({
  cardContainer: {
    display: "flex",
    alignItems: "center",
    flexDirection: "column",
    justifyContent: "center",
    width: "100%",
    minWidth: "193px",
    cursor: "pointer",
    "& h5": {
      fontFamily: "Agrandir GrandLight",
      fontStyle: "normal",
      fontWeight: 800,
      fontSize: "14px",
      lineHeight: "18px",
      display: "flex",
      alignItems: "center",
      textAlign: "center",
      letterSpacing: "0.04em",
      margin: "8px 0px 0px",
      color: "#ffffff",
    },
  },
  card: {
    display: "flex",
    alignItems: "center",
    flexDirection: "column",
    justifyContent: "center",
    width: "100%",
    minWIdth: "193px",
    cursor: "pointer",
    "& h5": {
      margin: "0px 0px 24px",
    },
    "& h6": {
      margin: "0px 0px 8px",
      fontStyle: "normal",
      fontWeight: 800,
      fontSize: "16px",
      lineHeight: "21px",
      textAlign: "center",
      color: "#ffffff",
    },
    "& button": {
      marginLeft: "0px !important",
      background: "#ffffff",
      borderRadius: 0,
      border: "none",
      fontWeight: 800,
      fontSize: "12px",
      height: "auto",
    },
    "& div > button:first-child": {
      marginBottom: "8px",
    },
  },
  cardCover: {
    width: "100%",
    position: "relative",
  },
  aspectRatioWrapper: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    overflow: "hidden",
    "&:last-child": {
      transition: "all 0.3s ease",
    },
  },
  image: {
    objectFit: "cover",
    width: "100%",
    height: "100%",
    marginBottom: "-8px",
    "&div": {
      background: Gradient.BlueMagenta,
    },
  },
  hidden: {
    width: 0,
    opacity: 0,
    minWIdth: 0,
  },
  content: {
    flex: 1,
    borderTop: "none",
    padding: "0px 12px",
    position: "relative",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    height: "100%",
    background: "hsl(0, 0%, 0%, 0.8)",
  },
  avatar: {
    width: "32px",
    height: "32px",
    borderRadius: "50%",
    marginBottom: "4px",
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundColor: "gray",
    "&:last-child": {
      marginRight: "0px !important",
    },
  },
}));

const AcquisitionCard = ({ data, heightFixed }) => {
  const users = useTypedSelector(state => state.usersInfoList);

  const [onHover, setOnHover] = useState<boolean>(false);

  const classes = useAcquistitionCardStyles();
  const { convertTokenToUSD } = useTokenConversion();

  const [media, setMedia] = useState<any>({});
  const [creator, setCreator] = useState<any>({});

  useEffect(() => {
    if (data.Proposal?.MediaSymbol) {
      getMedia(data?.Proposal?.MediaSymbol, "privi").then(res => {
        if (res.success) {
          let m = res.data;
          setMedia(m);
        }
      });
    }
  }, [data]);

  useEffect(() => {
    if (data.ProposalCreator && users) {
      const foundUser = users.find(u => u.address === data.ProposalCreator);
      if (foundUser) setCreator(foundUser);
    }
  }, [data.ProposalCreator, users]);

  return (
    <div
      className={classes.cardContainer}
      onMouseEnter={() => setOnHover(true)}
      onMouseLeave={() => setOnHover(false)}
    >
      <div className={classes.card}>
        <div
          className={classes.cardCover}
          onClick={() => {}}
          style={
            media?.dimensions && !heightFixed
              ? {
                  height: 0,
                  paddingBottom: `${
                    (media?.dimensions.height / media?.dimensions.width) * 100 >= 120
                      ? (media?.dimensions.height / media?.dimensions.width) * 100
                      : 120
                  }%`,
                }
              : {
                  height: "272px",
                }
          }
        >
          <div className={classes.aspectRatioWrapper}>
            {media.Url || media?.url ? (
              <img
                className={classes.image}
                src={`${media?.url ?? media?.Url}?${Date.now()}`}
                alt={media?.MediaName ?? ""}
              />
            ) : (
              <div className={classes.image} />
            )}
          </div>
          <div className={cls({ [classes.hidden]: !onHover }, classes.aspectRatioWrapper)}>
            <div className={classes.content}>
              <Box display="flex" flexDirection="column" alignItems="center" mb={2}>
                {creator && (
                  <Avatar
                    noBorder
                    size="small"
                    url={
                      creator?.imageURL ??
                      creator?.imageUrl ??
                      getRandomAvatarForUserIdWithMemoization(data.ProposalCreator)
                    }
                    alt="proposer"
                  />
                )}
              </Box>
              <Box display="flex" flexDirection="column" alignItems="center">
                <h6>
                  {media?.Type === MediaType.Video
                    ? "Video"
                    : media?.Type === MediaType.Audio
                    ? "Audio"
                    : media?.Type === MediaType.LiveAudio
                    ? "Audio Live"
                    : media?.Type === MediaType.Blog
                    ? "Blog"
                    : media?.Type === MediaType.BlogSnap
                    ? "Blog Snap"
                    : media?.Type === MediaType.DigitalArt
                    ? "Digital Art"
                    : "Video Live"}{" "}
                  Media
                </h6>
                <h6>{media?.BlockchainNetwork}</h6>
                <h6>{media?.TotalViews ?? 0} Views</h6>
                <h6>{`${data?.Proposal?.TokenSymbol ?? "PRIVI"} ${data?.Proposal?.Amount ?? 0} 
                ($${convertTokenToUSD(
                  data?.Proposal?.TokenSymbol ?? "PRIVI",
                  data?.Proposal?.Amount ?? 0
                )})`}</h6>
              </Box>

              {heightFixed && <FruitCounters counter1={2} counter2={30} counter3={137} />}
            </div>
          </div>
        </div>
      </div>
      <Box display="flex" flexDirection="column" alignItems="center">
        <h5>{media?.MediaName ?? ""}</h5>
        {!heightFixed && <FruitCounters counter1={2} counter2={30} counter3={137} />}
      </Box>
    </div>
  );
};

export default AcquisitionCard;
