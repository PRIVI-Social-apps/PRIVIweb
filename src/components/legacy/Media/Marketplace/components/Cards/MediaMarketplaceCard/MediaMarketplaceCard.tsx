import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";
import URL from "shared/functions/getURL";
import "./MediaMarketplaceCard.css";
import { BookmarkLikeShare } from "shared/ui-kit/BookmarkLikeShare";
import { useTypedSelector } from "store/reducers/Reducer";
const arePropsEqual = (prevProps, currProps) => prevProps.media === currProps.media;

enum MediaType {
  Video = "VIDEO_TYPE",
  LiveVideo = "LIVE_VIDEO_TYPE",
  Audio = "AUDIO_TYPE",
  LiveAudio = "LIVE_AUDIO_TYPE",
  Blog = "BLOG_TYPE",
  BlogSnap = "BLOG_SNAP_TYPE",
  DigitalArt = "DIGITAL_ART_TYPE",
}

type MediaMarketplaceCardProps = {
  media: any;
  triggerPlaylists?: boolean;
  dimensions?: {
    width: number;
    height: number;
  };
};

const rainbowIcon = require("assets/icons/rainbow.png");
const explosionIcon = require("assets/icons/explosion.png");

type BidderInfo = {
  bidderAddress: string;
  date: number;
  price: number;
};

type OfferInfo = {
  CreatorAddress: string;
  Date: number;
  OfferToken: string;
  Price: number;
};

const MediaMarketplaceCard: React.FunctionComponent<MediaMarketplaceCardProps> = React.memo(props => {
  const history = useHistory();
  const user = useTypedSelector(state => state.user);
  //hooks
  const [media, setMedia] = useState<any>({});
  const [endingTime, setEndingTime] = useState<any>();
  const [bidderInfo, setBidderInfo] = useState<BidderInfo | null>(null);
  const [offerInfo, setOfferInfo] = useState<OfferInfo | null>(null);

  useEffect(() => {
    if (props.media) {
      setMedia({ ...props.media });

      if (props.media.Auctions) {
        axios
          .get(`${URL()}/auction/getBidHistory/${props.media.MediaSymbol}`, {
            params: {
              type: props.media.Type,
            }
          })
          .then(async response => {
            const resp = response.data;
            if (resp.success) {
              const data: BidderInfo[] = resp.data;
              if (data && data.length > 0) {
                const filteredItems = data
                  .filter(item => item.bidderAddress === user.address)
                  .sort((a, b) => b.price - a.price);
                if (filteredItems.length > 0) {
                  setBidderInfo(filteredItems[0]);
                }
              }
            }
          })
          .catch(err => {
            console.log(err);
          });
        const timerId = setInterval(() => {
          const now = new Date();
          let delta = Math.floor(props.media.Auctions.EndTime - now.getTime() / 1000);
          if (delta < 0) {
            setEndingTime({
              days: 0,
              hours: 0,
              minutes: 0,
              seconds: 0,
            });
            clearInterval(timerId);
          } else {
            let days = Math.floor(delta / 86400);
            delta -= days * 86400;

            // calculate (and subtract) whole hours
            let hours = Math.floor(delta / 3600) % 24;
            delta -= hours * 3600;

            // calculate (and subtract) whole minutes
            let minutes = Math.floor(delta / 60) % 60;
            delta -= minutes * 60;

            // what's left is seconds
            let seconds = delta % 60;
            setEndingTime({
              days,
              hours,
              minutes,
              seconds,
            });
          }
        }, 1000);

        return () => clearInterval(timerId);
      } else if (props.media.Exchange && props.media.Exchange.length > 0) {
        const exchangeId = props.media.Exchange[0];
        axios
          .get(`${URL()}/exchange/getBuyingOffers/${exchangeId}`, {
            params: {
              token: props.media.mediaSymbol,
            },
          })
          .then(async response => {
            const resp = response.data;
            if (resp.success) {
              const data: OfferInfo[] = resp.data;
              if (data && data.length > 0) {
                const filteredItems = data
                  .filter(item => item.CreatorAddress === user.address)
                  .sort((a, b) => b.Price - a.Price);
                if (filteredItems.length > 0) {
                  setOfferInfo(filteredItems[0]);
                }
              }
            }
          })
          .catch(err => {
            console.log(err);
          });
      }
    }
  }, [props.media]);

  const isSignedIn = () => {
    return !!sessionStorage.getItem("token");
  };

  const displayMediaInfo = () => {
    //TODO: go to auction/sale
    if (media?.Exchange) {
      history.push(`/media/sale/${media.MediaSymbol}`);
    } else {
      history.push(`/media/auctions/${media.MediaSymbol}`);
    }
  };

  return (
    <div className="media-card media-marketplace-card">
      <div
        className="card-header cursor-pointer"
        onClick={displayMediaInfo}
        style={
          props.media.dimensions && props.media.dimensions.height
            ? {
              height: 0,
              paddingBottom: `${(props.media.dimensions.height / props.media.dimensions.width) * 100}%`,
            }
            : {
              height: 200,
            }
        }
      >
        <div className={props.media.dimensions ? "aspect-ratio-wrapper" : "wrapper"}>
          {(media.Type === MediaType.Audio ||
            media.Type === MediaType.Video ||
            media.Type === MediaType.Blog ||
            media.Type === MediaType.BlogSnap) &&
            media.HasPhoto ? (
            <img
              src={`${URL()}/media/getMediaMainPhoto/${media.MediaSymbol.replace(/\s/g, "")}`}
              alt={media.MediaSymbol}
            />
          ) : media.Type === MediaType.LiveAudio ? (
            <img
              src={
                media.ImageUrl
                  ? media.ImageUrl
                  : new Date(media.Date).getTime() >= new Date().getTime()
                    ? `${require("assets/backgrounds/audio_live_started.png")}`
                    : `${require("assets/backgrounds/audio_live.png")}`
              }
              alt={""}
            />
          ) : media.Type === MediaType.LiveVideo ? (
            <img
              src={
                media.ImageUrl
                  ? media.ImageUrl
                  : new Date(media.StartedTime).getTime() >= new Date().getTime()
                    ? `${require("assets/backgrounds/video_live_started.png")}`
                    : `${require("assets/backgrounds/video_live.png")}`
              }
              alt={""}
              className={"video-thumbnail"}
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
              className={"video-thumbnail"}
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
              className={"video-thumbnail"}
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
              className={"video-thumbnail"}
            />
          ) : media.Type === MediaType.DigitalArt ? (
            <img
              src={`${URL()}/media/getDigitalArt/${media.MediaSymbol.replace(/\s/g, "")}`}
              alt={media.MediaSymbol}
            />
          ) : null}
        </div>
      </div>

      {/*------------- CREATORS DATA -------------*/}
      <div className="content">
        <div className="artists-row">
          <div
            className="artists"
            style={{
              justifyContent: "flex-start",
              flexDirection: "row",
            }}
          >
            <div
              className="user-image"
              style={{
                backgroundImage:
                  media.Artist && media.Artist.imageURL && media.Artist.imageURL !== ""
                    ? `url(${media.Artist.imageURL})`
                    : "none",
                backgroundRepeat: "no-repeat",
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
              onClick={() => {
                if (media.Artist && media.Artist.id && media.Artist.id !== "") {
                  history.push(`/profile/${media.Artist.id}`);
                }
              }}
            />
            {media.SavedCollabs && media.SavedCollabs.length > 0
              ? media.SavedCollabs.map((collaborator, index) =>
                index < 2 ? (
                  <div
                    className="user-image"
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
                      if (collaborator.id && collaborator.id !== "") {
                        history.push(`/profile/${collaborator.id}`);
                      }
                    }}
                  />
                ) : null
              )
              : null}
            {media.SavedCollabs && media.SavedCollabs.length > 2 ? (
              <div className="user-counter">+{media.SavedCollabs.length - 2}</div>
            ) : null}
          </div>
          {/*--------------- SOCIAL ACTIONS ----------------*/}
          {isSignedIn() && (
            <BookmarkLikeShare setSelectedMedia={setMedia} selectedMedia={media} bookmarkType="playlist" />
          )}
        </div>
        {/*------- MEDIA TITLE --------*/}
        <div className={"title"} onClick={displayMediaInfo}>
          {media.MediaName ?? media.MediaSymbol ?? media.title ?? ""}
        </div>
        {/*------- TAGS: TYPE AND CHAIN --------*/}
        <div className={"tags"} onClick={displayMediaInfo}>
          {media.Type && Object.values(MediaType).includes(media.Type) ? (
            <div className={"tag"}>
              <img
                src={require(`assets/mediaIcons/small/${media.Type === MediaType.DigitalArt
                  ? `digital_art`
                  : media.Type === MediaType.Video
                    ? `video`
                    : media.Type === MediaType.LiveVideo
                      ? `video_live`
                      : media.Type === MediaType.Audio
                        ? `audio`
                        : media.Type === MediaType.LiveAudio
                          ? `audio_live`
                          : media.Type === MediaType.Blog
                            ? `blog`
                            : `blog_snap`
                  }.png`)}
                alt={media.Type}
              />
              {media.Type === MediaType.DigitalArt
                ? `Digital Art`
                : media.Type === MediaType.Video
                  ? `Video`
                  : media.Type === MediaType.LiveVideo
                    ? `Live Video`
                    : media.Type === MediaType.Audio
                      ? `Audio`
                      : media.Type === MediaType.LiveAudio
                        ? `Live Audio`
                        : media.Type === MediaType.Blog
                          ? `Blog`
                          : `Blog snap`}
            </div>
          ) : null}
          <div className={"tag chain"}>
            <img src={require(`assets/tokenImages/PRIVI.png`)} alt={"PRIVI"} />
            {"PRIVI"}
          </div>
          <div className="price-box">
            <div className="price">
              👓 Views
              <div>{media.TotalViews || 0}</div>
            </div>
          </div>
        </div>
        {/*------- FOOTER: AUCTION PRICE --------*/}
        <div className="footer" onClick={displayMediaInfo}>
          <div className="price">
            <div className="col">
              {media.Auctions && <span>{bidderInfo ? "🔥 Top Bid" : "Current Bid"}</span>}
              {!media.Auctions && <span>{offerInfo ? "🔥 Price" : "Price"}</span>}
              <span className="amount">
                {media && media.Auctions
                  ? media.Auctions.TokenSymbol
                  : media.ExchangeData
                    ? media.ExchangeData.OfferToken
                    : ""}{" "}
                {media && media.Auctions
                  ? media.Auctions.Gathered
                  : media.ExchangeData
                    ? media.ExchangeData.Price
                    : ""}
              </span>
              {bidderInfo && media.Auctions && media.Auctions.Gathered > bidderInfo.price && (
                <p className="spreadInfo">{`Spread: +${Math.floor(
                  ((media.Auctions.Gathered - bidderInfo.price) * 100) / bidderInfo.price
                )}%`}</p>
              )}
              {offerInfo && media.ExchangeData && media.ExchangeData?.Price !== offerInfo.Price && (
                <p className="spreadInfo">{`Spread: ${Math.floor(
                  ((media.ExchangeData?.Price - offerInfo.Price) * 100) / offerInfo.Price
                )}%`}</p>
              )}
            </div>
            <div className="col">
              {media.Auctions && <span>{bidderInfo ? "🤑 Your Bid" : "Discovery Price"}</span>}
              {!media.Auctions && <span>{offerInfo ? "🤑 Your Offer" : "Discovery Price"}</span>}
              {bidderInfo && media.Auctions && (
                <span className="amount">{`${media.Auctions.TokenSymbol} ${bidderInfo.price}`}</span>
              )}
              {bidderInfo && (
                <p className="placeNewBidLink" onClick={displayMediaInfo}>
                  Place New Bid
                </p>
              )}
              {offerInfo && (
                <span className="amount">{`${media.ExchangeData?.OfferToken} ${offerInfo.Price}`}</span>
              )}
              {offerInfo && (
                <p className="placeNewBidLink" onClick={displayMediaInfo}>
                  Place New Offer
                </p>
              )}
              {!bidderInfo && !offerInfo && (
                <span
                  style={{
                    color:
                      media.Auctions &&
                        ((media.Auctions.Price && media.Auctions.BidIncrement < media.Auctions.Price) ||
                          (media.Auctions.ReservePrice &&
                            media.Auctions.BidIncrement < media.Auctions.ReservePrice))
                        ? "#F43E5F"
                        : "#65CB63",
                  }}
                >
                  <img
                    src={
                      media.Auctions &&
                        ((media.Auctions.Price && media.Auctions.BidIncrement < media.Auctions.Price) ||
                          (media.Auctions.ReservePrice &&
                            media.Auctions.BidIncrement < media.Auctions.ReservePrice))
                        ? explosionIcon
                        : rainbowIcon
                    }
                    width={14}
                    alt={
                      media.Auctions &&
                        ((media.Auctions.Price && media.Auctions.BidIncrement < media.Auctions.Price) ||
                          (media.Auctions.ReservePrice &&
                            media.Auctions.BidIncrement < media.Auctions.ReservePrice))
                        ? "explosion"
                        : "rainbow"
                    }
                  />
                  {media.Auctions
                    ? media.Auctions.TokenSymbol
                    : media.NftConditions
                      ? media.NftConditions.NftToken
                      : ""}{" "}
                  {media.Auctions
                    ? media.Auctions.BidIncrement
                    : media.NftConditions
                      ? media.NftConditions.Price
                      : ""}
                </span>
              )}
            </div>
          </div>

          {media.Auctions &&
            endingTime &&
            new Date(media.Auctions.StartTime * 1000).getTime() <= new Date().getTime() &&
            new Date(media.Auctions.EndTime * 1000).getTime() > new Date().getTime() && (
              <div className="bid">
                <span>Bid Ending in:</span>
                <span>
                  {endingTime.days > 0 && (
                    <span>
                      <b>{String(endingTime.days).padStart(2, "0")}</b>d
                    </span>
                  )}
                  {endingTime.hours > 0 && (
                    <span>
                      <b>{String(endingTime.hours).padStart(2, "0")}</b>h
                    </span>
                  )}
                  {endingTime.minutes > 0 && (
                    <span>
                      <b>{String(endingTime.minutes).padStart(2, "0")}</b>m
                    </span>
                  )}
                  <span>
                    <b>{String(endingTime.seconds).padStart(2, "0")}</b>s
                  </span>
                </span>
              </div>
            )}
        </div>
      </div>
    </div>
  );
}, arePropsEqual);

export default MediaMarketplaceCard;
