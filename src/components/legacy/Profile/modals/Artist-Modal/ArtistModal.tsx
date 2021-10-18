import { Modal } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "store/reducers/Reducer";
import "./ArtistModal.css";
import { TabNavigation } from "shared/ui-kit";

const arrowLeft = require("assets/icons/arrow_left.png");
const arrowRight = require("assets/icons/arrow_right.png");
const instagramIcon = require("assets/snsIcons/instagram_round.png");
const facebookIcon = require("assets/snsIcons/facebook_round.png");
const twitterIcon = require("assets/snsIcons/twitter_round.png");

const artistModalOptions = ["Creator", "Collabs"];

const arePropsEqual = (prevProps, currProps) => {
  return prevProps.artist === currProps.artist && prevProps.open === currProps.open;
};

const ArtistModal = React.memo((props: any) => {
  const user = useSelector((state: RootState) => state.user);
  const users = useSelector((state: RootState) => state.usersInfoList);

  const [artistModalTabSelection, setArtistModalTabSelection] = useState<number>(0);

  const [artist, setArtist] = useState<any>({});

  useEffect(() => {
    if (props.open && props.artist) {
      const a = { ...props.artist };

      setArtist(a);
    }
  }, [props.open, props.artist]);

  /*ARTIST TAB*/
  const ArtistTab = () => {
    return (
      <div className="artist-tab">
        <div className="left">
          <div className="title">
            <p>{artist.userName ?? ""}</p>
            <p className="rainBowText">{`@${artist.urlSlug ?? ""}`}</p>
            <p>
              {artist.description ??
                `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam in eros scelerisque, scelerisque nisl sit amet, molestie erat. In a elementum ex.`}
            </p>
          </div>
          {artist.TopMedia && artist.TopMedia.length > 0 ? (
            <h4>TOP MEDIA</h4>
          ) : (
            <div className="bottom-info">
              <div className="sns">
                <a
                  className="rrssProfileLink"
                  href={`https://www.facebook.com/${artist.facebook ?? ""}`}
                  target="_blank"
                >
                  <img className="rrssImagesIcon" src={facebookIcon} alt={"facebook"} />
                </a>
                <a
                  className="rrssProfileLink"
                  href={`https://twitter.com/${artist.twitter ?? ""}`}
                  target="_blank"
                >
                  <img className="rrssImagesIcon" src={twitterIcon} alt={"twitter"} />
                </a>
                <a
                  className="rrssProfileLink"
                  href={`https://www.instagram.com/${artist.instagram ?? ""}`}
                  target="_blank"
                >
                  <img className="rrssImagesIcon" src={instagramIcon} alt={"instagram"} />
                </a>
              </div>
              <div className="artist-info">
                {`${artist.media ?? 0} MEDIA, ${artist.followers ?? 0} FOLLOWERS, ${artist.likes ?? 0} LIKES`}
              </div>
            </div>
          )}
          {artist.TopMedia && artist.TopMedia.length > 0 ? (
            <div className="carousel">
              <button
                id="slideLeft"
                className="slideLeft"
                type="button"
                onClick={() => {
                  document.getElementsByClassName("artist-top-media ")[0]!.scrollLeft -= 75;
                }}
              >
                <img className="arrowSlideLeft" src={arrowLeft} alt="" />
              </button>
              <div className="artist-top-media">
                {artist.TopMedia
                  ? artist.TopMedia.map((media, index) => (
                    <div
                      className="top-media-card"
                      key={`media-card-${index}`}
                      style={{
                        backgroundColor: "hsl(" + Math.floor(Math.random() * 361) + ",50%,75%,0.3)",
                      }}
                    >
                      <div
                        className="media-image"
                        style={{
                          backgroundImage:
                            media.ImageURL && media.ImageURL.length > 0 ? `url(${media.ImageURL})` : "none",
                          backgroundRepeat: "no-repeat",
                          backgroundSize: "cover",
                          backgroundPosition: "center",
                        }}
                      />
                      <p>{media.Name}</p>
                    </div>
                  ))
                  : null}
              </div>
              <button
                className="slideRight"
                id="slideRight"
                type="button"
                onClick={() => {
                  document.getElementsByClassName("artist-top-media ")[0]!.scrollLeft += 75;
                }}
              >
                <img className="arrowSlideRight" src={arrowRight} alt="" />
              </button>
            </div>
          ) : null}
        </div>
        <div className="right">
          <div
            className="user-image"
            style={{
              backgroundImage:
                artist.userImage && artist.userImage.length > 0 ? `url(${artist.userImage})` : "none",
              backgroundRepeat: "no-repeat",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
          {artist.TopMedia && artist.TopMedia.length > 0 ? (
            <div className="sns">
              <a
                className="rrssProfileLink"
                href={`https://www.facebook.com/${artist.facebook ?? ""}`}
                target="_blank"
              >
                <img className="rrssImagesIcon" src={facebookIcon} alt={"facebook"} />
              </a>
              <a
                className="rrssProfileLink"
                href={`https://twitter.com/${artist.twitter ?? ""}`}
                target="_blank"
              >
                <img className="rrssImagesIcon" src={twitterIcon} alt={"twitter"} />
              </a>
              <a
                className="rrssProfileLink"
                href={`https://www.instagram.com/${artist.instagram ?? ""}`}
                target="_blank"
              >
                <img className="rrssImagesIcon" src={instagramIcon} alt={"instagram"} />
              </a>
            </div>
          ) : null}
          {artist.TopMedia && artist.TopMedia.length > 0 ? (
            <div className="artist-info">
              {`${artist.media ?? 0} MEDIA, ${artist.followers ?? 0} FOLLOWERS, ${artist.likes ?? 0} LIKES`}
            </div>
          ) : null}
        </div>
      </div>
    );
  };

  /*COLLABS TAB*/
  const CollabsTab = () => {
    if (props.collabs && props.collabs.length > 0)
      return (
        <div className="collab-tab">
          <div className="carousel">
            <button
              id="slideLeft"
              className="slideLeft"
              type="button"
              onClick={() => {
                document.getElementsByClassName("collab-users")[0]!.scrollLeft -= 75;
              }}
            >
              <img className="arrowSlideLeft" src={arrowLeft} alt="" />
            </button>
            <div className="collab-users">
              {props.collabs.map((collab, index) => (
                <CollabCard collab={collab} key={`collab-card-${index}`} />
              ))}
            </div>
            <button
              className="slideRight"
              id="slideRight"
              type="button"
              onClick={() => {
                document.getElementsByClassName("collab-users")[0]!.scrollLeft += 75;
              }}
            >
              <img className="arrowSlideRight" src={arrowRight} alt="" />
            </button>
          </div>
        </div>
      );
    else return <div>No collabs yet</div>;
  };

  const CollabCard = ({ collab }) => {
    const [displayCards, setDisplayCards] = useState<boolean>(false);

    return (
      <div className="collab-card">
        <p
          className={collab.TopMedia && collab.TopMedia.length > 0 && displayCards ? "small" : ""}
          onClick={() => {
            setDisplayCards(!displayCards);
          }}
        >
          {collab.userName ?? ""}
        </p>
        <p className="rainBowText">
          {`@${collab.urlSlug ?? ""}`}
        </p>
        <div
          className={
            collab.TopMedia && collab.TopMedia.length > 0 && displayCards ? "user-image small" : "user-image"
          }
          onClick={() => {
            setDisplayCards(!displayCards);
          }}
          style={{
            backgroundImage:
              collab.userImage && collab.userImage.length > 0 ? `url(${collab.userImage})` : "none",
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
            backgroundPosition: "center",
            cursor: collab.TopMedia && collab.TopMedia.lenght > 0 ? "pointer" : "auto",
          }}
        />
        <div className="sns">
          <a
            className="rrssProfileLink"
            href={`https://www.facebook.com/${collab.facebook ?? ""}`}
            target="_blank"
          >
            <img className="rrssImagesIcon" src={facebookIcon} alt={"facebook"} />
          </a>
          <a className="rrssProfileLink" href={`https://twitter.com/${collab.twitter ?? ""}`} target="_blank">
            <img className="rrssImagesIcon" src={twitterIcon} alt={"twitter"} />
          </a>
          <a
            className="rrssProfileLink"
            href={`https://www.instagram.com/${collab.instagram ?? ""}`}
            target="_blank"
          >
            <img className="rrssImagesIcon" src={instagramIcon} alt={"instagram"} />
          </a>
        </div>
        <div className="artist-info">
          {`${collab.media ?? 0} MEDIA, ${collab.followers ?? 0} FOLLOWERS, ${collab.likes ?? 0} LIKES`}
        </div>
        {collab.TopMedia && collab.TopMedia.length > 0 ? (
          <div className={displayCards ? "carousel" : "carousel small"}>
            <button
              id="slideLeft"
              className="slideLeft"
              type="button"
              onClick={() => {
                document.getElementsByClassName(`collab-top-media ${collab.userId}`)[0]!.scrollLeft -= 75;
              }}
            >
              <img className="arrowSlideLeft" src={arrowLeft} alt="" />
            </button>
            <div className={`collab-top-media ${collab.userId}`}>
              {collab.TopMedia
                ? collab.TopMedia.map((media, index) => (
                  <div
                    className="top-media-card"
                    key={`media-card-${index}`}
                    style={{
                      backgroundColor: "hsl(" + Math.floor(Math.random() * 361) + ",50%,75%,0.3)",
                    }}
                  >
                    <div
                      className="media-image"
                      style={{
                        backgroundImage:
                          media.ImageURL && media.ImageURL.length > 0 ? `url(${media.ImageURL})` : "none",
                        backgroundRepeat: "no-repeat",
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                      }}
                    />
                    <p>{media.Name}</p>
                  </div>
                ))
                : null}
            </div>
            <button
              className="slideRight"
              id="slideRight"
              type="button"
              onClick={() => {
                document.getElementsByClassName(`collab-top-media ${collab.userId}`)[0]!.scrollLeft += 75;
              }}
            >
              <img className="arrowSlideRight" src={arrowRight} alt="" />
            </button>
          </div>
        ) : null}
      </div>
    );
  };

  if (artist && Object.keys(artist).length !== 0 && artist.constructor === Object)
    return (
      <Modal
        open={props.open}
        onClose={props.handleClose}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
        className="modal"
      >
        <div className="modal-content artist-modal">
          <div className="exit" onClick={props.handleClose}>
            <img src={require("assets/icons/x_darkblue.png")} alt={"x"} />
          </div>
          <TabNavigation
            tabs={artistModalOptions}
            currentTab={artistModalTabSelection}
            variant="primary"
            onTabChange={setArtistModalTabSelection}
          />
          {artistModalTabSelection === 0 ? <ArtistTab /> : <CollabsTab />}
        </div>
      </Modal>
    );
  else return null;
}, arePropsEqual);

export default ArtistModal;
