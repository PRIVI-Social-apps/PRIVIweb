import React, { useState, useEffect } from "react";
import axios from "axios";
import URL from "shared/functions/getURL";
import "./ProfileMediaCard.css";
import { RootState } from "store/reducers/Reducer";
import { useSelector } from "react-redux";
import AlertMessage from "shared/ui-kit/Alert/AlertMessage";
import Moment from "react-moment";
import ArtistModal from "components/legacy/Profile/modals/Artist-Modal/ArtistModal";
import CreateFraction from "components/legacy/Media/DigitalArt/components/Fractionalise/CreateFraction";
import { PrimaryButton } from "shared/ui-kit";

import SvgIcon from "@material-ui/core/SvgIcon";
import { ReactComponent as EyeSolid } from "assets/icons/eye-solid.svg";
import { ReactComponent as EyeSlashSolid } from "assets/icons/eye-slash-solid.svg";
import { ReactComponent as LockOpenIcon } from "assets/icons/lock-open-solid.svg";
import { ReactComponent as LockIcon } from "assets/icons/lock-solid.svg";

const underConstruction: any[] = [
  require("assets/underConstruction/99-993812_3d-mnnchen-messen-hd-png-download.png"),
  require("assets/underConstruction/images.jpeg"),
];

const ProfileMediaCard = React.memo((props: any) => {
  const users = useSelector((state: RootState) => state.usersInfoList);
  const user = useSelector((state: RootState) => state.user);

  const [requester, setRequester] = useState<any>({});

  const [item, setItem] = useState<any>({});
  const [status, setStatus] = useState<any>("");

  const [openModal, setOpenModal] = useState<boolean>(false);
  const [openArtistModal, setOpenArtistModal] = useState<boolean>(false);
  const [fractionModal, showFractionModal] = useState<boolean>(false);
  const handleOpenModal = () => {
    setOpenModal(true);
  };
  const handleOpenArtistModal = () => {
    setOpenArtistModal(true);
  };
  const handleCloseModal = () => {
    setOpenModal(false);
  };
  const handleCloseArtistModal = () => {
    setOpenArtistModal(false);
  };

  const handleLikeCard = () => {
    const itemCopy = { ...item };
    itemCopy.userAddress = user.id;
  };

  useEffect(() => {
    if (props.item && users && users.length > 0) {
      let i = {
        ...props.item,
        imageURL: "",
        ownedBy: 0,
        creators: [],
        owned: false,
        hidden: props.item.IsPrivate ?? false,
        liked:
          props.item.Likes &&
            props.item.Likes.find((likeObj) => likeObj.userId === user.id)
            ? true
            : false,
      };

      i.imageURL = props.item.ImageURL; //`` TODO: Load real image

      if (
        props.item.Artist &&
        props.item.Artist.userId &&
        users.some((user) => user.id === props.item.Artist.userId)
      ) {
        const thisUser =
          users[
          users.findIndex((user) => user.id === props.item.Artist.userId)
          ];
        i.Artist = {
          ...props.item.Artist,
          userName: thisUser.name,
          userImage: thisUser.imageURL,
          urlSlug: thisUser.urlSlug ?? thisUser.name,
        };
      }

      if (props.item && props.item.Collabs && props.item.Collabs.length > 0) {
        props.item.Collabs.forEach((creator, index) => {
          if (users.some((user) => user.id === creator.userId)) {
            const thisUser =
              users[users.findIndex((user) => user.id === creator.userId)];
            i.Collabs[index].userName = thisUser.name;
            i.Collabs[index].userImage = thisUser.imageURL;
            i.Collabs[index].urlSlug = thisUser.urlSlug ?? thisUser.name;
          }
        });
      }

      if (i.tokenData) {
        i.ownedBy = i.tokenData.Holders ? i.tokenData.Holders.length : 0;
        i.dailyChanges = i.tokenData.pctChange ?? 0;
        i.inverted = i.tokenData.price ? i.tokenData.price.toFixed(4) : 0;
      }
      if (i.tokenData && i.tokenData.Holders) {
        i.owned =
          i.tokenData.Holders.findIndex((holder) => holder === user.id) > 0
            ? true
            : false;
      } else if (i.Members) {
        i.owned =
          i.Members.findIndex((member) => member.id === user.id) > 0
            ? true
            : false;
      }

      setItem(i);
    }

    let findRequester = users.find((usr) => usr.id === user.id);
    setRequester(findRequester);
  }, [users]);

  const getUnderConstruction = () => {
    return underConstruction[getRandom(2) - 1];
  };

  const getRandom = (endNumber): number => {
    let random = Math.floor(Math.random() * endNumber) + 1;
    return random;
  };

  const handleChangePrivacy = () => {
    const itemCopy = { ...item };

    itemCopy.hidden = !item.hidden;
    setItem(itemCopy);

    axios
      .post(`${URL()}/social/editSocialToken`, itemCopy)
      .then((response) => {
        if (response.data.success) {
        } else {
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  console.log("item=", item);

  if (
    item &&
    Object.keys(item).length !== 0 &&
    item.constructor === Object &&
    (props.userProfile.id !== user.id
      ? !item.hidden
      : props.userProfile.id === user.id)
  )
    return (
      <div className="profile-media-card">
        <div className="lock">
          {item.Requester === user.id ? (
            <LockOpenIcon />
          ) : (
            <LockIcon />
          )}
        </div>
        {item.HasPhoto && item.MediaSymbol ? (
          <img
            src={`${URL()}/media/getMediaMainPhoto/${item.MediaSymbol}`}
            onClick={handleOpenModal}
            alt="card-content"
            className="card-img"
          />
        ) : (
          <img
            src={getUnderConstruction()}
            onClick={handleOpenModal}
            className="card-img"
            alt="card-content"
          />
        )}
        {/*<div className="tags">
          <div className="hashtags">
            {item.Hashtags && item.Hashtags.length > 0
              ? item.Hashtags.map((hashtag, index) =>
                  index < 2 ? (
                    <span key={hashtag}>{`${hashtag.toUpperCase()}${
                      item.Hashtags.length > 1 && index === 0 ? `,` : ""
                    }`}</span>
                  ) : null
                )
              : null}
          </div>
          <div className="row">
            <div onClick={handleLikeCard} className="cursor-pointer">
              <img style={{ height: 18, verticalAlign: "middle", marginRight: 2 }}
                   src={item.liked ? heartfull : heartempty}/>
              {item.Likes && item.Likes.length ? item.Likes.length : 0} Likes
            </div>
            <div onClick={handleOpenModal} className="cursor-pointer">
              <BiMessageRounded />
              {item.Comments && item.Comments.length ? item.Comments.length : 0}
            </div>
          </div>
        </div>*/}

        <p>{item.MediaName}</p>
        {item.MediaDescription && item.MediaDescription !== "" ? (
          <p className="desc">{item.MediaDescription}</p>
        ) : null}
        <div className="row">
          <div
            className="user"
            onClick={handleOpenArtistModal}
            style={
              {
                // justifyContent: "flex-end",
                //cursor: "pointer",
              }
            }
          >
            <div
              className="user-image"
              style={{
                backgroundImage: item.Requester && item.Requester.url ?
                  `url(${item.Requester.url}?${Date.now()})`
                  : "none",
                backgroundRepeat: "no-repeat",
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            />
            <span>
              {`${requester && requester !== {} ? requester.name : ""}`}
            </span>
          </div>
          <Moment fromNow>{item.ReleaseDate}</Moment>
        </div>
        <div className="bottom">
          <span>
            {`Owned by ${item.ownedBy !== "" ? item.ownedBy : "multiple users"
              }`}
          </span>
          <div className="row">
            <span>{item.TotalViews ? item.TotalViews : 0} Views</span>
            {props.userProfile.id === user.id ? (
              <div className="eye" onClick={handleChangePrivacy}>
                {item.hidden ? <SvgIcon><EyeSlashSolid /></SvgIcon> : <SvgIcon><EyeSolid /></SvgIcon>}
              </div>
            ) : null}
          </div>
        </div>
        <div className="fractionalise">
          <PrimaryButton size="medium" onClick={() => showFractionModal(true)}>Fractionalise</PrimaryButton>
        </div>
        <ArtistModal
          artist={item.Artist}
          open={openArtistModal}
          handleClose={handleCloseArtistModal}
          collabs={item.Collabs}
        />
        <CreateFraction open={fractionModal} handleClose={showFractionModal} media={item} />
        {status ? (
          <AlertMessage
            key={status.key}
            message={status.msg}
            variant={status.variant}
          />
        ) : null}
      </div>
    );
  else return null;
});

export default ProfileMediaCard;
