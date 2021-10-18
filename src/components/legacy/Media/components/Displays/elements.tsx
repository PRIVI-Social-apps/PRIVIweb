import React, { useContext, useEffect, useState, useMemo } from "react";
import styled from "styled-components";
import Moment from "react-moment";
import axios from "axios";

import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";

import CircularProgress from "@material-ui/core/CircularProgress";
import { Divider, Grid, makeStyles, createStyles, Theme } from "@material-ui/core";
import Rating from "@material-ui/lab/Rating";

import Box from "shared/ui-kit/Box";
import { RootState, useTypedSelector } from "store/reducers/Reducer";
import styles from "./elements.module.scss";
import MainPageContext from "components/legacy/Media/context";
import { SpentPrice } from "components/legacy/Media/components/Displays/audioElements";
import AuctionDetailModal from "../../modals/AuctionDetailModal";
import { PlaceBidModal } from "components/legacy/Media/modals/PlaceBidModal/index";
import { PlaceBidDetailModal } from "components/legacy/Media/modals/PlaceBidDetailModal/index";
import BuyNFTModal from "components/legacy/Media/modals/BuyNFTModal/index";
import { ChooseWalletModal } from "shared/ui-kit/Modal/Modals/ChooseWalletModal";
import { setSelectedUser } from "store/actions/SelectedUser";
import {
  PrimaryButton,
  SecondaryButton,
  Modal,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "shared/ui-kit";
import { BookmarkLikeShare } from "shared/ui-kit/BookmarkLikeShare";
import URL from "shared/functions/getURL";
import { MediaStatus } from "shared/services/API/MediaAPI";
import { parsePrice } from "shared/helpers/utils";
import { sumTotalViews } from "shared/functions/totalViews";
import { useUserConnections } from "shared/contexts/UserConnectionsContext";
import AlertMessage from "shared/ui-kit/Alert/AlertMessage";
import { LoadingWrapper } from "shared/ui-kit/Hocs";
import InputWithLabelAndTooltip from "shared/ui-kit/InputWithLabelAndTooltip";
import { buildJsxFromObject, handleSetStatus } from "shared/functions/commonFunctions";
import { useSubstrate } from "shared/connectors/substrate";
import { ContractInstance, decodeAbiData } from "shared/connectors/substrate/functions";
import POD_AUCTION_CONTRACT from "shared/connectors/substrate/contracts/PodAuction.json";
import ERC721_CONTRACT from "shared/connectors/substrate/contracts/ERC721.json";
import {
  POD_AUCTION_CONTRACT_ADDRESS,
  ERC721_CONTRACT_ADDRESS,
  MEDIA_CONTRACT,
  ERC20_CONTRACT_ADDRESS,
} from "shared/connectors/substrate/config/test.json";
import { SignatureRequestModal } from "shared/ui-kit/Modal/Modals";
import { cancelAuction, withdrawAuction, placeBid } from "shared/services/API";
import ConfirmPayment from "components/legacy/Communities/modals/ConfirmPayment";

enum MediaType {
  Video = "VIDEO_TYPE",
  LiveVideo = "LIVE_VIDEO_TYPE",
  Audio = "AUDIO_TYPE",
  LiveAudio = "LIVE_AUDIO_TYPE",
  Blog = "BLOG_TYPE",
  BlogSnap = "BLOG_SNAP_TYPE",
  DigitalArt = "DIGITAL_ART_TYPE",
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: "100%",
      "& > * + *": {
        marginTop: theme.spacing(2),
      },
    },
  })
);

const exitIcon = require("assets/icons/cross_gray.png");

const isSignedIn = () => {
  return !!sessionStorage.getItem("token");
};

export const FinalStepModal = ({
  isOpen,
  onClose,
  theme,
}: {
  isOpen: boolean;
  onClose: () => void;
  theme?: "dark" | "light";
}) => {
  return (
    <Modal size="small" isOpen={isOpen} onClose={onClose} showCloseIcon theme={theme}>
      <div className={styles.finalStepContent}>
        <img src={require("assets/mediaIcons/pencil.svg")} alt="final step pencil" />
        <div className={styles.title}>Final Step!</div>
        <p>Your wallet will request you you to sign to authenticate the process</p>
        <CircularProgress style={{ color: theme === "dark" ? "#A306BA" : "#23D0C6" }} />
      </div>
    </Modal>
  );
};

export const WalletSignatureRequestModal = ({ isOpen, onClose, onPostProcess = () => {} }) => {
  const user = useTypedSelector(state => state.user);
  return (
    <Modal size="small" isOpen={isOpen} onClose={onClose} showCloseIcon>
      <div className={styles.SignatureRequestContent}>
        <WalletSignatureRequest
          signatureInfo={{
            accountId: user.ethAccount,
            balance: user.ethBalance,
          }}
          handleSignIn={() => {
            onClose();
            if (onPostProcess) onPostProcess();
          }}
          handleCancel={onClose}
        />
      </div>
    </Modal>
  );
};

export const WalletSignatureRequest = ({
  signatureInfo,
  handleSignIn = () => {},
  handleCancel = () => {},
}) => {
  const { accountId, balance } = signatureInfo;

  return (
    <div className={styles.signatureRequestView}>
      <h3>Signature request</h3>
      <div className={styles.body}>
        <div className={styles.logo}>
          <div className={styles.container}>
            <div className={styles.fieldName}>Account</div>
            <div className={styles.fieldInfo}>{accountId}</div>
          </div>
          <img className={styles.tokenImage} src={require(`assets/tokenImages/ETH.png`)} alt="Etherum" />
          <div className={styles.container}>
            <div className={styles.fieldName}>Balance</div>
            <div className={styles.fieldInfo}>{`${balance[0].amount} ${balance[0].symbol}`}</div>
          </div>
        </div>
        <div className={styles.title}>Your signature is begin requested</div>
        <div className={styles.description}>You are signing:</div>
        <Divider />
        <div className={styles.longDesc}>
          <p className={styles.message}>Message:</p>
          <p className={styles.messageContent}>
            To avoid digital cat burglars, sign below to authenticate with CrypoKitties.
          </p>
        </div>
        <Divider />
        <div className={styles.action}>
          <button className={styles.cancelBtn} onClick={handleCancel}>
            Cancel
          </button>
          <button className={styles.signBtn} onClick={handleSignIn}>
            Sign
          </button>
        </div>
      </div>
    </div>
  );
};

const CloseButton = ({ closePlayer }) => (
  <button type="button" onClick={closePlayer} className={styles.closeButton}>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      aria-hidden="true"
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
    </svg>
  </button>
);

export const MediaDisplayHeader = ({ type = "" }) => {
  const { selectedMedia, setSelectedMedia, setOpen } = useContext(MainPageContext);

  const history = useHistory();
  const closePlayerMedia = () => {
    setSelectedMedia(null);
    setOpen(null);
    history.push(`/media`);
  };

  return (
    <div className={styles.MediaDisplayHeader}>
      <h1
        className={styles.title}
        style={{
          marginBottom: 0,
        }}
      >
        {selectedMedia.eth ? selectedMedia.title : selectedMedia.MediaName}
      </h1>
      {isSignedIn() && (
        <BookmarkLikeShare
          hideBookmark={type === MediaType.Audio || type === MediaType.Video ? false : true}
          setSelectedMedia={setSelectedMedia}
          selectedMedia={selectedMedia}
          style={{ marginTop: "-16px" }}
        />
      )}
      <CloseButton closePlayer={closePlayerMedia} />
    </div>
  );
};

export const RateMedia = () => {
  const { selectedMedia } = useContext(MainPageContext);
  const user = useTypedSelector(state => state.user);

  const [mediaRatings, setRatings] = useState([
    {
      key: "like",
      feedback: "I like it",
      myRate: 0,
      average: 0,
    },
    {
      key: "beautiful",
      feedback: "Beautiful",
      myRate: 0,
      average: 0,
    },
    {
      key: "buy",
      feedback: "A must buy",
      myRate: 0,
      average: 0,
    },
    {
      key: "priced",
      feedback: "Over priced",
      myRate: 0,
      average: 0,
    },
    {
      key: "dontLike",
      feedback: "Don't like it",
      myRate: 0,
      average: 0,
    },
    {
      key: "innovative",
      feedback: "Innovative",
      myRate: 0,
      average: 0,
    },
  ]);

  useEffect(() => {
    if (selectedMedia) {
      if (selectedMedia.Rating) {
        handleRatings(selectedMedia.Rating);
      }
    }
  }, [selectedMedia]);

  const handleRatings = ratings => {
    let rates = [...mediaRatings];
    const count = ratings.length;

    const sumLike = ratings.reduce((prev, current) => (prev + current.like ? current.like : 0), 0);
    const sumBeautiful = ratings.reduce(
      (prev, current) => (prev + current.beautiful ? current.beautiful : 0),
      0
    );
    const sumBuy = ratings.reduce((prev, current) => (prev + current.buy ? current.buy : 0), 0);
    const sumPriced = ratings.reduce((prev, current) => (prev + current.priced ? current.priced : 0), 0);
    const sumDontLike = ratings.reduce(
      (prev, current) => (prev + current.dontLike ? current.dontLike : 0),
      0
    );
    const sumInnovative = ratings.reduce(
      (prev, current) => (prev + current.innovative ? current.innovative : 0),
      0
    );

    rates[0].average = sumLike / count;
    rates[1].average = sumBeautiful / count;
    rates[2].average = sumBuy / count;
    rates[3].average = sumPriced / count;
    rates[4].average = sumDontLike / count;
    rates[5].average = sumInnovative / count;

    // My rate
    const myRate = ratings.filter(item => item.userId === user.id)[0];
    if (myRate) {
      rates[0].myRate = myRate.like ? myRate.like : rates[0].myRate;
      rates[1].myRate = myRate.beautiful ? myRate.beautiful : rates[1].myRate;
      rates[2].myRate = myRate.buy ? myRate.buy : rates[2].myRate;
      rates[3].myRate = myRate.priced ? myRate.priced : rates[3].myRate;
      rates[4].myRate = myRate.dontLike ? myRate.dontLike : rates[4].myRate;
      rates[5].myRate = myRate.innovative ? myRate.innovative : rates[5].myRate;
    }
    setRatings([...rates]);
  };

  const rateMedia = (rating, newValue) => {
    const ratingType = rating.key;
    if (newValue >= 0) {
      axios
        .post(`${URL()}/media/rateMedia`, {
          mediaId: selectedMedia.id,
          mediaType: selectedMedia.Type,
          mediaTag: selectedMedia.tag ?? "privi",
          userId: user.id,
          ratingType,
          ratingValue: newValue,
        })
        .then(response => {
          if (response.data.ratings) {
            handleRatings(response.data.ratings);
          }
        })
        .catch(error => console.log(error));
    }
  };

  return (
    <Accordion defaultExpanded={false}>
      <AccordionSummary>⭐️ {isSignedIn() ? `Rate this media` : "Rating"}</AccordionSummary>
      <AccordionDetails>
        <Grid container className={styles.ratingWrapper}>
          {mediaRatings.map((rating, index) => (
            <Grid item={true} key={`rating - ${index}`} xs={12} md={4} lg={2}>
              <div className={styles.feedback}>
                <h4>{rating.average}</h4>
                <span>{rating.feedback}</span>
              </div>
              <Rating
                disabled={!isSignedIn()}
                name={`rating - ${index}`}
                value={isSignedIn() ? rating.myRate : rating.average}
                icon={<div className={styles.rateIcon} />}
                emptyIcon={<div className={styles.emptyRateIcon} />}
                onChange={(event, newValue) => {
                  if (isSignedIn()) {
                    rateMedia(rating, newValue);
                  }
                }}
              />
            </Grid>
          ))}
        </Grid>
      </AccordionDetails>
    </Accordion>
  );
};

export const MediaComments = () => {
  const { selectedMedia, setSelectedMedia } = useContext(MainPageContext);
  const usersList = useSelector((state: RootState) => state.usersInfoList);
  const user = useTypedSelector(state => state.user);
  const getUserInfo = id => usersList.find(u => u.id === id);
  const currentUser = getUserInfo(user.id);

  const [mediaComment, setMediaComment] = useState<string>("");
  const [errorMsg, setErrorMsg] = useState<any>();

  const comments = selectedMedia.Comments;

  const handleCloseError = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setErrorMsg(null);
  };

  const isSignedIn = () => {
    return !!sessionStorage.getItem("token");
  };

  const addComment = () => {
    if (mediaComment) {
      const comment = {
        user: {
          id: currentUser?.id,
          name: `${currentUser?.name}`,
        },
        comment: mediaComment,
        date: new Date(),
      };

      axios
        .post(`${URL()}/streaming/addComment/`, {
          DocId: selectedMedia.id,
          MediaType: selectedMedia?.Type,
          MediaTag: selectedMedia?.tag,
          UserId: currentUser?.id,
          Comment: comment,
        })
        .then(async response => {
          let data: any = response.data;
          if (data.success) {
            setSelectedMedia(prev => ({ ...prev, Comments: [...(prev.Comments || []), comment] }));
            setMediaComment("");
          } else {
            setErrorMsg("Error making the request");
          }
        })
        .catch(err => {
          console.log(err);
          setErrorMsg("Error making the request");
        });
    }
  };

  const handleKeyDown = e => {
    if (e.key === "Enter") {
      addComment();
    }
  };

  return (
    <Accordion defaultExpanded={false}>
      <AccordionSummary>💬 Comments</AccordionSummary>
      <AccordionDetails>
        <div className={styles.commentWrapper}>
          {isSignedIn() && (
            <div className={styles.newComment}>
              <div className={styles.myInfo}>
                <img className={styles.avatar} src={currentUser?.imageURL} alt="Avatar" />
                <div className={styles.myInfoName}>{currentUser?.name}</div>
              </div>
              <div className={styles.commentInputWrapper}>
                <InputWithLabelAndTooltip
                  type="text"
                  overriedClasses={styles.commentInput}
                  inputValue={mediaComment}
                  placeHolder="Comment..."
                  onInputValueChange={event => setMediaComment(event.target.value)}
                  onKeyDown={handleKeyDown}
                />
                <PrimaryButton size="medium" onClick={addComment}>
                  Comment
                </PrimaryButton>
              </div>
            </div>
          )}
          {comments?.map((item, index) => {
            const commentUser = getUserInfo(item.user.id);
            return (
              <div key={`comment-${index}`} className={styles.commentRow}>
                <div className={styles.commentLeftWrapper}>
                  <img className={styles.commentRowAvatar} src={commentUser?.imageURL} alt="Avatar" />
                  <div className={styles.commentRowInfo}>
                    <div className={styles.commentRowName}>{commentUser?.name || ""}</div>
                    <div className={styles.commentRowComment}>{item.comment}</div>
                  </div>
                </div>
                <div className={styles.commentDate}>
                  <Moment format={"DD MMM YYYY"}>{item.date}</Moment>
                </div>
              </div>
            );
          })}
        </div>
      </AccordionDetails>
      {errorMsg && (
        <AlertMessage
          key={Math.random()}
          message={errorMsg}
          variant={"error"}
          onClose={() => setErrorMsg(undefined)}
        />
      )}
    </Accordion>
  );
};

export const LikeShareInformation = () => {
  const { selectedMedia } = useContext(MainPageContext);
  const user = useTypedSelector(state => state.user);
  const [liked, setLiked] = useState<boolean>(false);

  useEffect(() => {
    if (isSignedIn() && selectedMedia.Likes && selectedMedia.Likes.includes(user.id)) {
      setLiked(true);
    } else {
      setLiked(false);
    }
  }, [selectedMedia.Likes, user.id]);

  return (
    <Grid container className={styles.statWrapper}>
      <Grid item={true} xs={12} md={3}>
        <div style={{ fontSize: "20px", marginTop: "-10px", marginBottom: "3px" }}>👓</div>
        <div>{selectedMedia?.TotalViews || 1}</div>
      </Grid>
      <Grid item={true} xs={12} md={3}>
        {liked ? (
          <img src={require("assets/icons/like_filled.png")} alt={"heart"} />
        ) : (
          <img src={require("assets/icons/likes.png")} alt={"heart"} />
        )}
        <div>{selectedMedia?.NumLikes || 0}</div>
      </Grid>
      <Grid xs={12} md={3}>
        <img src={require("assets/icons/share.png")} />
        <div>{selectedMedia?.shareCount || 0}</div>
      </Grid>
      {selectedMedia.Type === MediaType.Audio || selectedMedia.Type === MediaType.Video ? (
        <Grid xs={12} md={3}>
          <img src={require("assets/icons/tag.png")} />
          <div>{selectedMedia?.playlists || 0}</div>
        </Grid>
      ) : null}
    </Grid>
  );
};

export const EthLikeShareInformation = () => {
  const user = useTypedSelector(state => state.user);
  const { selectedMedia } = useContext(MainPageContext);
  const [liked, setLiked] = useState<boolean>(false);

  useEffect(() => {
    if (selectedMedia.Likes && selectedMedia.Likes.includes(user.id)) {
      setLiked(true);
    } else {
      setLiked(false);
    }
  }, [selectedMedia.Likes, user.id]);
  return (
    <Grid container className={styles.statWrapper}>
      <Grid item={true} xs={12} md={3}>
        <div style={{ fontSize: "20px", marginTop: "-10px", marginBottom: "3px" }}>👓</div>
        <div>{selectedMedia?.TotalViews || 1}</div>
      </Grid>
      <Grid item={true} xs={12} md={3}>
        {liked ? (
          <img src={require("assets/icons/like_filled.png")} alt={"heart"} />
        ) : (
          <img src={require("assets/icons/likes.png")} alt={"heart"} />
        )}
        <div>{selectedMedia?.NumLikes || 0}</div>
      </Grid>
      <Grid xs={12} md={3}>
        <img src={require("assets/icons/share.png")} />
        <div>{selectedMedia?.shareCount || 0}</div>
      </Grid>
      <Grid xs={12} md={3}>
        <img src={require("assets/icons/tag.png")} />
        <div>{selectedMedia?.playlists || 0}</div>
      </Grid>
    </Grid>
  );
};

export const MediaDetails = () => {
  const usersList = useSelector((state: RootState) => state.usersInfoList);
  const { selectedMedia } = useContext(MainPageContext);

  const creator = useMemo(
    () =>
      usersList.find(usr => selectedMedia.CreatorId === usr.id) ||
      usersList.find(usr => selectedMedia.Requester === usr.id),
    [selectedMedia.CreatorId, selectedMedia.Requester, usersList]
  );

  const user = useTypedSelector(state => state.user);

  const { followUser, unfollowUser, isUserFollowed } = useUserConnections();

  return (
    <Accordion>
      <AccordionSummary>🔍 Media Details</AccordionSummary>
      <AccordionDetails>
        <div className={styles.mediaWrapper}>
          {creator && <PriviCreator creator={creator} theme="default" />}
          {isSignedIn() && creator && creator.id !== user.id && (
            <div className={styles.followSection}>
              <SecondaryButton
                size="medium"
                onClick={() => {
                  isUserFollowed(creator.id) ? unfollowUser(creator.id) : followUser(creator.id);
                }}
                style={{ flex: 1 }}
              >
                {isUserFollowed(creator.id) ? "Unfollow Artist" : "Follow Artist"}
              </SecondaryButton>
              <img src={require("assets/icons/message_darkblue.png")} alt={`tick`} />
            </div>
          )}
          <div className={styles.dashDivider} />
          <div className={styles.ownersWrapper}>
            <div className={styles.titleWrapper}>
              <div className={styles.contentTitle}>Owners</div>
              <div className={styles.btnViewCollection} onClick={() => {}}>
                View Ownership History
              </div>
            </div>
            <div className={styles.owersRow}>
              {selectedMedia.owners &&
                selectedMedia.owners.length > 0 &&
                selectedMedia.owners.map((owner, index) =>
                  index < 10 ? (
                    <img
                      src={owner.imageURL}
                      style={{
                        objectFit: "cover",
                      }}
                      alt="Avatar"
                      onError={e => {
                        const target = e.target as HTMLImageElement;
                        target.src = "https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_1280.png";
                      }}
                    />
                  ) : null
                )}
            </div>
          </div>
          <div className={styles.dashDivider} />
          <div className={styles.descWrapper}>
            <div className={styles.contentTitle}>Description</div>
            <div className={styles.contentDescription}>
              {selectedMedia.MediaDescription || "Media Description"}
            </div>
          </div>
        </div>
      </AccordionDetails>
    </Accordion>
  );
};

export const PriviCreator = ({ creator, theme }) => {
  const dispatch = useDispatch();
  const history = useHistory();

  return (
    <div className={styles.creatorInfo}>
      <img
        src={creator.imageURL}
        style={{
          objectFit: "cover",
        }}
        alt="Avatar"
        onError={e => {
          const target = e.target as HTMLImageElement;
          target.src = "https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_1280.png";
        }}
        onClick={() => {
          history.push(`/profile/${creator.id}`);
          dispatch(setSelectedUser(creator.id));
        }}
      />
      <div className={styles.personalInfo}>
        <div className={`${styles.creatorFullName} ${theme === "green" ? styles.darkGreyColor : ""}`}>
          {creator.name}
        </div>
        <div className={styles.creatorOtherInfo}>
          <div
            className={`${styles.creatorAlias} ${theme === "green" ? styles.greenColor : ""}`}
            onClick={() => {
              history.push(`/profile/${creator.id}`);
              dispatch(setSelectedUser(creator.id));
            }}
          >
            @{creator.urlSlug}
          </div>
          {creator.verified ? (
            <img className={styles.userVerified} src={require("assets/icons/check_gray.png")} alt={`tick`} />
          ) : null}
          <div className={`${styles.userLevel} ${theme === "green" ? styles.darkGreyColor : ""}`}>{`level ${
            creator.level ?? 1
          }`}</div>
        </div>
      </div>
    </div>
  );
};

export const EthMediaDetails = () => {
  const { selectedMedia } = useContext(MainPageContext);

  return (
    <Accordion>
      <AccordionSummary>
        <h4>🔍 Media Details</h4>
      </AccordionSummary>
      <AccordionDetails>
        <div className={styles.mediaWrapper}>
          <EthCreator creator={selectedMedia.creator} randomAvatar={selectedMedia.randomAvatar} />
          {selectedMedia.creator &&
            selectedMedia.creator !== "" &&
            selectedMedia.creator !== "Error" &&
            selectedMedia.creator !== "Not available" && (
              <div className={styles.followSection}>
                <div className={styles.followArtist} onClick={() => {}}>
                  {"Follow Creator"}
                </div>
              </div>
            )}
          <div className={styles.dashDivider} />
          <div className={styles.descWrapper}>
            <div className={styles.contentTitle}>Description</div>
            <div className={styles.contentDescription}>{selectedMedia.description || ""}</div>
          </div>
        </div>
      </AccordionDetails>
    </Accordion>
  );
};

export const EthCreator = ({ creator, randomAvatar }) => {
  const history = useHistory();

  return (
    <div className={styles.creatorInfo}>
      <img
        src={randomAvatar}
        style={{
          objectFit: "cover",
        }}
        alt="Avatar"
        onError={e => {
          const target = e.target as HTMLImageElement;
          target.src = "https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_1280.png";
        }}
        onClick={() => {
          if (creator && creator !== "" && creator !== "Error" && creator !== "Not available") {
            history.push(`/profile/${creator.includes("@") ? creator.replace("@", "") : creator}?eth`);
          }
        }}
      />
      <div className={styles.personalInfo}>
        <div className={styles.creatorFullName}>
          {creator
            ? creator && creator !== "" && creator !== "Error" && creator !== "Not available"
              ? creator
              : "Unclaimed profile"
            : ""}
        </div>
        <div className={styles.creatorOtherInfo}>
          <div
            className={styles.creatorAlias}
            onClick={() => {
              if (creator && creator !== "" && creator !== "Error" && creator !== "Not available") {
                history.push(`/profile/${creator.includes("@") ? creator.replace("@", "") : creator}?eth`);
              }
            }}
          ></div>
          {/*<img className={styles.userVerified} src={require("assets/icons/check_gray.png")} alt={`tick`} />
      <div className={styles.userLevel}>{"level 1"}</div>*/}
        </div>
      </div>
    </div>
  );
};

export const MediaCollection = () => {
  const history = useHistory();
  const { selectedMedia } = useContext(MainPageContext);
  const [mediaPod, setMediaPod] = useState<any>({});
  const [URLPodPhoto, setURLPodPhoto] = useState<string>("");
  const [isMediaLoading, setIsMediaLoading] = useState<boolean>(false);

  useEffect(() => {
    if (!selectedMedia.QuickMedia && selectedMedia.PodAddress) {
      loadData(selectedMedia.PodAddress);
    } else {
      return;
    }
  }, [selectedMedia]);

  if (selectedMedia.QuickMedia) return null;

  const loadData = async podId => {
    setIsMediaLoading(true);
    axios
      .get(`${URL()}/mediaPod/getMediaPod/${podId}`)
      .then(response => {
        const resp = response.data;
        if (resp.success) {
          const podData = resp.data.mediaPod;
          setMediaPod(podData);
          if (podData.HasPhoto === true) {
            setURLPodPhoto(`${podData.Url}?${Date.now()}`);
          }
        }
        setIsMediaLoading(false);
      })
      .catch(error => {
        console.log(error);
        setIsMediaLoading(false);
      });
  };

  return (
    <Accordion defaultExpanded={false}>
      <AccordionSummary>📂 Collection</AccordionSummary>
      <AccordionDetails>
        <div className={styles.collectionWrapper}>
          <div className={styles.collectionContainer}>
            <img src={URLPodPhoto} alt="Collection" />
            <LoadingWrapper loading={isMediaLoading}>
              <div className={styles.collectionDesc}>
                <h3>{mediaPod.Name}</h3>
                <span>{mediaPod.Description}</span>
                <div
                  className={styles.btnViewCollection}
                  onClick={() => {
                    history.push(`/privi-pods/MediaNFT/${mediaPod.PodAddress}`);
                  }}
                >
                  View Collection
                </div>
              </div>
            </LoadingWrapper>
          </div>
        </div>
      </AccordionDetails>
    </Accordion>
  );
};

export const MediaCurrentPrice = () => {
  const userBalances = useSelector((state: RootState) => state.userBalances);

  const { selectedMedia, setSelectedMedia, open } = useContext(MainPageContext);
  const [isVipAccess, setIsVipAccess] = useState<boolean>(false);

  const [usdPrice, setUsdPrice] = useState("");

  React.useEffect(() => {
    if (selectedMedia) {
      axios.get(`${URL()}/wallet/getCryptosRateAsMap`).then(res => {
        const resp = res.data;
        if (resp.success) {
          let changeRate = resp.data;

          if (
            selectedMedia.QuickCreation &&
            selectedMedia.ViewConditions &&
            selectedMedia.ViewConditions.Price > 0 &&
            selectedMedia.ViewConditions.ViewingToken
          ) {
            const rate = changeRate[selectedMedia.ViewConditions.ViewingToken.toUpperCase()] ?? 1;
            setUsdPrice(
              `${(rate * selectedMedia.ViewConditions.Price).toFixed(6)}${
                selectedMedia.ViewConditions.ViewingType === "STREAMING" ? "/per sec" : ""
              }`
            );
          } else if (!selectedMedia.QuickCreation) {
            if (selectedMedia.Price > 0 && selectedMedia.FundingToken) {
              const rate = changeRate[selectedMedia.FundingToken.toUpperCase()] ?? 1;
              setUsdPrice((rate * selectedMedia.Price).toFixed(6));
            } else if (selectedMedia.PricePerSecond > 0 && selectedMedia.FundingToken) {
              const rate = changeRate[selectedMedia.FundingToken.toUpperCase()] ?? 1;
              setUsdPrice(`${(rate * selectedMedia.PricePerSecond).toFixed(6)}/per sec`);
            }
          }
        }
      });
    }

    setIsVipAccess(false);

    if (selectedMedia && userBalances && Object.keys(userBalances).length > 0) {
      if (selectedMedia.ExclusivePermissions) {
        const conditionList = selectedMedia.ExclusivePermissionsList ?? [];
        let newHasAccess = true;
        for (let i = 0; i < conditionList.length && newHasAccess; i++) {
          const condition = conditionList[i];
          if (condition.Token && condition.Quantity) {
            if (!userBalances[condition.Token] || userBalances[condition.Token].Balance < condition.Quantity)
              newHasAccess = false;
          }
        }

        setIsVipAccess(newHasAccess);
      }
    }
  }, [selectedMedia, userBalances]);

  return (
    <Accordion defaultExpanded>
      <AccordionSummary>💰 Price</AccordionSummary>
      <AccordionDetails>
        <div className={styles.priceWrapper}>
          <div className={styles.assetPrice}>
            {selectedMedia.QuickCreation && selectedMedia.ViewConditions ? (
              <div>
                {selectedMedia.ViewConditions && selectedMedia.ViewConditions.ViewingType === "STREAMING" ? (
                  <>
                    {selectedMedia?.ViewConditions.ViewingToken || ""}
                    {selectedMedia?.ViewConditions?.Price
                      ? parsePrice(selectedMedia?.ViewConditions?.Price.toString())
                      : "0"}
                    <span style={{ fontSize: "22px" }}> / sec</span>
                  </>
                ) : (
                  `${selectedMedia?.ViewConditions.ViewingToken || ""} ${
                    selectedMedia?.ViewConditions?.Price ?? "0"
                  }`
                )}
              </div>
            ) : null}
            {!selectedMedia.QuickCreation ? (
              <>
                {`${selectedMedia?.FundingToken || ""} ${
                  selectedMedia?.Price ?? selectedMedia?.PricePerSecond ?? "0"
                }`}
                {selectedMedia.PricePerSecond && <span style={{ fontSize: "22px" }}> / sec</span>}
              </>
            ) : null}
            <span>{usdPrice ? `($${parsePrice(usdPrice)})` : ""}</span>
          </div>
          {isVipAccess ? (
            <SpentPrice>
              <span style={{ alignSelf: "center", marginTop: 12 }}>VIP ACCESS</span>
            </SpentPrice>
          ) : null}
          {selectedMedia.Type === MediaType.BlogSnap &&
          open === MediaType.BlogSnap &&
          selectedMedia?.QuickCreation &&
          selectedMedia?.ViewConditions?.ViewingType === "PricePerPage" &&
          !isVipAccess ? (
            <SpentPrice>
              <span>Spent</span>

              <span>{`${selectedMedia.paidPages?.length} pages = ${
                selectedMedia?.ViewConditions.ViewingToken || ""
              } ${selectedMedia?.ViewConditions?.Price * selectedMedia.paidPages?.length ?? "0"}`}</span>
            </SpentPrice>
          ) : null}
        </div>
      </AccordionDetails>
    </Accordion>
  );
};

export const EthMediaCurrentPrice = () => {
  const { selectedMedia } = useContext(MainPageContext);

  return (
    <Accordion defaultExpanded>
      <AccordionSummary>
        <div className={styles.mediaPriceStatusContainer}>
          🤑 Price
          <div className={styles.mediaPriceStatus}>
            {selectedMedia.status && selectedMedia.status.includes(MediaStatus.OnAuction)
              ? "Auction"
              : "Fixed price"}
          </div>
        </div>
      </AccordionSummary>
      <AccordionDetails>
        <div className={styles.priceWrapper}>
          <div className={styles.assetPrice}>
            {selectedMedia && selectedMedia.price ? parsePrice(selectedMedia.price) : "0"}
          </div>
        </div>
      </AccordionDetails>
    </Accordion>
  );
};

export const MediaNFTPrice = () => {
  const { selectedMedia } = useContext(MainPageContext);
  if (selectedMedia)
    return (
      <Accordion>
        <AccordionSummary>🤑 NFT Price</AccordionSummary>
        <AccordionDetails>
          <div className={styles.priceWrapper}>
            <div className={styles.assetPrice}>
              {`${selectedMedia.NftConditions?.NftToken ?? ""} ${
                selectedMedia.NftConditions?.Price
                  ? parsePrice(selectedMedia.NftConditions?.Price.toString())
                  : "0"
              }`}
            </div>
            <div className={styles.dashDivider} />
            <Grid container className={styles.statCategoryWrapper}>
              <Grid sm={12} md={4}>
                <div className={styles.statCategory}>Royalty</div>
                <div className={styles.statCategoryVal}>
                  {selectedMedia?.QuickCreation
                    ? selectedMedia.NftConditions?.Royalty
                    : selectedMedia?.Royalty}
                  %
                </div>
              </Grid>
              <Grid sm={12} md={4}>
                <div className={styles.statCategory}>Investor share</div>
                <div className={styles.statCategoryVal}>{selectedMedia.InvestShare || 0}%</div>
              </Grid>
              <Grid sm={12} md={4}>
                <div className={styles.statCategory}>Sharing share</div>
                <div className={styles.statCategoryVal}>{selectedMedia?.SharingPct || 0}%</div>
              </Grid>
            </Grid>
          </div>

          <Divider />
        </AccordionDetails>
      </Accordion>
    );
  else return null;
};

export const MediaAuctionstatus = () => {
  const { selectedMedia } = useContext(MainPageContext);
  const { Auctions } = selectedMedia;

  const [rates, setRates] = useState<any>({});
  const [endTime, setEndTime] = useState<any>({});

  useEffect(() => {
    axios.get(`${URL()}/wallet/getCryptosRateAsMap`).then(res => {
      const resp = res.data;
      if (resp.success) {
        setRates(resp.data);
      }
    });

    const timerId = setInterval(() => {
      const now = new Date();
      let delta = Math.floor(Auctions.EndTime - now.getTime() / 1000);
      if (delta < 0) {
        setEndTime({
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
        setEndTime({
          days,
          hours,
          minutes,
          seconds,
        });
      }
    }, 1000);

    return () => clearInterval(timerId);
  }, [selectedMedia.id]);

  if (selectedMedia)
    return (
      <Accordion defaultExpanded>
        <AccordionSummary>🔥 Top bid</AccordionSummary>
        <AccordionDetails>
          <div className={styles.auctionWrapper}>
            <Box display="flex" flexDirection="row" alignItems="flex-end">
              <h3 className={styles.tokenPrice}>{Auctions.TokenSymbol + " " + Auctions.Gathered}</h3>
              <h5 className={styles.usdPrice}>
                ($
                {Number(parseFloat((rates[Auctions.TokenSymbol] * Auctions.Gathered).toFixed(8)).toString())})
              </h5>
            </Box>
            <div className={styles.auctionCard}>
              <h5>Auction Ending In</h5>
              <Box display="flex" flexDirection="row">
                <Box width={1} marginRight={1}>
                  <h3>{String(endTime.days).padStart(2, "0")}</h3>
                  <h6>Days</h6>
                </Box>
                <Box width={1} marginRight={1}>
                  <h3>{String(endTime.hours).padStart(2, "0")}</h3>
                  <h6>Hours</h6>
                </Box>
                <Box width={1} marginRight={1}>
                  <h3>{String(endTime.minutes).padStart(2, "0")}</h3>
                  <h6>Minutes</h6>
                </Box>
                <Box width={1} marginRight={1}>
                  <h3>{String(endTime.seconds).padStart(2, "0")}</h3>
                  <h6>Seconds</h6>
                </Box>
              </Box>
            </div>
            <Box display="flex" flexDirection="row" alignItems="center">
              <img src={require(`assets/tokenImages/${Auctions.TokenSymbol}.png`)} />
              <span>
                Bidding token is <b>{Auctions.TokenSymbol}</b>
              </span>
            </Box>
            <div className={styles.dashDivider} />
            <Grid container className={styles.statCategoryWrapper}>
              <Grid sm={12} md={4}>
                <div className={styles.statCategory}>Royalty</div>
                <div className={styles.statCategoryVal}>
                  {selectedMedia?.QuickCreation
                    ? selectedMedia.NftConditions?.Royalty
                    : selectedMedia?.Royalty}
                  %
                </div>
              </Grid>
              <Grid sm={12} md={4}>
                <div className={styles.statCategory}>Investor share</div>
                <div className={styles.statCategoryVal}>{selectedMedia.InvestShare || 0}%</div>
              </Grid>
              <Grid sm={12} md={4}>
                <div className={styles.statCategory}>Sharing share</div>
                <div className={styles.statCategoryVal}>{selectedMedia?.SharingPct || 0}%</div>
              </Grid>
            </Grid>
          </div>
          <Divider />
        </AccordionDetails>
      </Accordion>
    );
  else return null;
};

export const MediaActionButtons = ({ showMoreDetailsButton, onPlaceBid, onMoreDetails, onBuyNFT }) => {
  const { selectedMedia } = useContext(MainPageContext);
  const user = useTypedSelector(state => state.user);

  return (
    <>
      {isSignedIn() && selectedMedia.NftConditions && selectedMedia.Exchange && (
        <PrimaryButton size="medium" style={{ width: "100%" }} onClick={onBuyNFT}>
          Buy NFT
        </PrimaryButton>
      )}
      {isSignedIn() && selectedMedia.Auctions && selectedMedia.Auctions.Owner !== user.address && (
        <div className={styles.btnPlaceBid} onClick={onPlaceBid}>
          Place A Bid
        </div>
      )}
      {showMoreDetailsButton ? (
        <SecondaryButton size="medium" style={{ width: "100%", marginLeft: 0 }} onClick={onMoreDetails}>
          View More Details
        </SecondaryButton>
      ) : null}
    </>
  );
};

export const EthMediaActionButtons = ({ onPlaceBid, onMoreDetails }) => {
  const { selectedMedia } = useContext(MainPageContext);

  const openSourcePage = (link: any) => {
    window.open(link);
  };
  return (
    <>
      <div className={styles.tagType}>
        <img
          src={require(`assets/tokenImages/${
            !selectedMedia.eth
              ? "PRIVI"
              : selectedMedia.tag && selectedMedia.tag.toUpperCase().includes("WAX")
              ? "WAX"
              : "ETH"
          }.png`)}
          alt={
            !selectedMedia.eth
              ? "PRIVI"
              : selectedMedia.tag && selectedMedia.tag.toUpperCase().includes("WAX")
              ? "WAX"
              : "ETH"
          }
        />
        {!selectedMedia.eth
          ? "PRIVI"
          : selectedMedia.tag && selectedMedia.tag.toUpperCase().includes("WAX")
          ? "WAX"
          : `Ethereum: ${selectedMedia.tag}`}
      </div>
      <PrimaryButton
        size="medium"
        style={{ width: "100%" }}
        onClick={() => openSourcePage(selectedMedia.link)}
      >
        View in Source Page
      </PrimaryButton>
    </>
  );
};

export const TypicalLayout = props => {
  const user = useTypedSelector(state => state.user);
  const userBalances = useTypedSelector(state => state.userBalances);
  const { selectedMedia, setSelectedMedia } = useContext(MainPageContext);

  const [openPlaceBidModal, setOpenPlaceBidModal] = useState(false);
  const [openAuctionDetailModal, setOpenAuctionDetailModal] = useState(false);
  const [openPlaceBidDetailModal, setOpenPlaceBidDetailModal] = useState(false);
  const [openChooseWalletModal, setOpenChooseWalletModal] = useState(false);
  const [openFinalStepModal, setOpenFinalStepModal] = useState(false);
  const [openWalletSignatureRequestModal, setOpenWalletSignatureRequestModal] = useState(false);
  const [openBuyNFTModal, setOpenBuyNFTModal] = useState(false);
  const classes = useStyles();

  const [status, setStatus] = useState<any>(""); // show status of the operation
  const { api, apiState, keyring, keyringState } = useSubstrate();
  const payloadRef = React.useRef<any>({});
  const functionRef = React.useRef<string>("");
  const priceRef = React.useRef<number>(0);
  const [openSignRequestModal, setOpenSignRequestModal] = useState<boolean>(false);
  const [signRequestModalDetail, setSignRequestModalDetail] = useState<any>(null);
  const [openConfirmPaymentModal, setOpenConfirmPaymentModal] = useState<boolean>(false);
  React.useEffect(() => {
    sumTotalViews(selectedMedia);
  }, []);

  const payWithOwnWallet = async () => {
    setOpenConfirmPaymentModal(false);
    const price = priceRef.current;
    const token = selectedMedia.Auctions.TokenSymbol;
    if (selectedMedia.BlockchainNetwork === "Substrate Chain") {
      if (!api) return;
      const podAuctionContract = ContractInstance(
        api,
        JSON.stringify(POD_AUCTION_CONTRACT),
        POD_AUCTION_CONTRACT_ADDRESS
      );

      const keyringOptions = (keyring as any).getPairs().map(account => ({
        key: account.address,
        value: account.address,
        text: account.meta.name.toUpperCase(),
        icon: "user",
      }));
      const accountAddress = keyringOptions.length > 0 ? keyringOptions[0].value : "";
      const accountPair =
        accountAddress && keyringState === "READY" && (keyring as any).getPair(accountAddress);
      const value = 0;
      const gasLimit = 3000 * 10000000;
      const input = {
        token_address: ERC20_CONTRACT_ADDRESS,
        owner: selectedMedia.Auctions.Owner,
        address: accountPair.address,
        amount: price,
      };
      await (await podAuctionContract).tx
        .placeBid({ value, gasLimit }, input)
        .signAndSend(accountPair, result => {
          if (result.status.isInBlock) {
            console.log("in a block");
          } else if (result.status.isError) {
            setStatus({
              msg: "Error when making the request",
              key: Math.random(),
              variant: "error",
            });
          } else if (result.status.isFinalized) {
            console.log("finalized");
            result.events
              .filter(({ event }) => api?.events.system.ExtrinsicSuccess.is(event))
              .forEach(({ event }) => {
                const [dispatchInfo] = event.data;
                console.log(dispatchInfo.toHuman());
              });

            const events = result.events
              .filter(({ event }) => api?.events.contracts.ContractEmitted.is(event))
              .forEach(
                async ({
                  event: {
                    data: [, data],
                  },
                }) => {
                  const { args } = decodeAbiData(api, JSON.stringify(POD_AUCTION_CONTRACT), data);
                  let blockchainRes: any = args[0].toHuman();
                  console.log("ContractEmitted: state => ", blockchainRes);
                }
              );
            if (events && events.length) {
              setStatus({
                msg: "Error when making the request",
                key: Math.random(),
                variant: "error",
              });
            } else {
              const body: any = {
                Data: {
                  MediaSymbol: selectedMedia.MediaSymbol,
                  MediaType: selectedMedia.Type,
                  TokenSymbol: token,
                  Owner: selectedMedia.Auctions.Owner,
                  Address: accountPair,
                  Amount: price,
                  Chain: "substrate",
                },
              };
              // To be fixed: create separate function in BE for substrate
              axios
                .post(`${URL()}/auction/placeBid`, body)
                .then(async response => {
                  const resp: any = response.data;
                  if (resp.success) {
                    setTimeout(() => {
                      setOpenPlaceBidModal(false);
                    }, 1000);
                    handleSetStatus("Bid completed", "success", setStatus);
                    axios
                      .get(`${URL()}/media/getMedia/${selectedMedia.id}/privi`, {
                        params: { mediaType: selectedMedia.Type },
                      })
                      .then(res => {
                        if (res.data.success) {
                          const data = res.data.data;
                          const newSelectedMedia = {
                            ...selectedMedia,
                            Auctions: {
                              ...data.Auctions,
                              Gathered: price,
                            },
                            BidHistory: [...data.BidHistory],
                          };
                          setSelectedMedia(newSelectedMedia);
                          setTimeout(() => {
                            setOpenPlaceBidModal(false);
                          }, 1000);
                        }
                      })
                      .catch(err => {
                        console.log(err);
                      });
                  } else {
                    handleSetStatus("Bid failed", "error", setStatus);
                  }
                })
                .catch(err => {
                  console.log(err);
                });
            }
          }
        });
    } else handleOpenSignatureModal("placeBid", price);
  };

  const handlePlaceBid = async (price: number, topBidPrice: number | "N/A") => {
    if (!selectedMedia.Auctions) {
      handleSetStatus("Failed to Place a Bid", "error", setStatus);
      return;
    }
    const token = selectedMedia.Auctions.TokenSymbol;
    const lowestBid = Math.max(
      selectedMedia?.Auctions?.Gathered ?? 0 + selectedMedia?.Auctions?.BidIncrement ?? 0,
      selectedMedia?.Auctions?.ReservePrice ?? 0
    );
    if (!userBalances[token] || userBalances[token].Balance < price) {
      handleSetStatus(`Insufficient ${token} balance`, "error", setStatus);
      return;
    } else if (price <= lowestBid) {
      handleSetStatus(`Bid have to be greater than ${lowestBid} ${token}`, "error", setStatus);
      return;
    }

    priceRef.current = price;
    setOpenConfirmPaymentModal(true);
  };

  const handleOpenSignatureModal = (operation, price?) => {
    let payload;
    if (operation == "cancelAuction") {
      payload = {
        MediaSymbol: selectedMedia?.Auctions?.MediaSymbol,
        TokenSymbol: selectedMedia?.Auctions?.TokenSymbol,
        Owner: selectedMedia?.Auctions?.Owner,
      };
    } else if (operation == "placeBid") {
      payload = {
        MediaSymbol: selectedMedia?.Auctions?.MediaSymbol,
        TokenSymbol: selectedMedia?.Auctions?.TokenSymbol,
        Owner: selectedMedia?.Auctions?.Owner,
        Address: user.address,
        Amount: price.toString(),
      };
    }
    if (payload) {
      functionRef.current = operation;
      payloadRef.current = payload;
      setSignRequestModalDetail(buildJsxFromObject(payload));
      setOpenSignRequestModal(true);
    }
  };

  const handleConfirmSign = async () => {
    const payload = payloadRef.current;
    if (Object.keys(payload).length) {
      if (functionRef.current == "cancelAuction") {
        cancelAuction(payload, { MediaType: selectedMedia.Type })
          .then(resp => {
            if (resp.success) {
              handleSetStatus("Auction cancelled successfully", "success", setStatus);
            } else handleSetStatus("Auction cancelation failed", "error", setStatus);
          })
          .catch(error => {
            handleSetStatus("Auction creation failed: " + error, "error", setStatus);
          });
      } else if (functionRef.current == "placeBid") {
        placeBid(payload, { MediaType: selectedMedia.Type })
          .then(resp => {
            if (resp.success) {
              handleSetStatus("Bid placed successfully", "success", setStatus);
              setTimeout(() => {
                setOpenPlaceBidModal(false);
              }, 1000);
            } else handleSetStatus("Bid failed", "error", setStatus);
          })
          .catch(error => {
            handleSetStatus("Bid failed: " + error, "error", setStatus);
          });
      }
    }
  };

  return (
    <MediaContentWrapper>
      <MediaDisplayHeader type={props.type || ""} />
      <Grid container direction="row" spacing={2}>
        <Grid item xs={12} md={8}>
          {props.child ?? props.children}
          <RateMedia />
          <MediaComments />
        </Grid>
        <Grid item xs={12} md={4}>
          {selectedMedia &&
          selectedMedia.price &&
          selectedMedia.price !== 0 &&
          selectedMedia.price !== "" &&
          selectedMedia.price !== "0" &&
          selectedMedia.price !== "Not available" &&
          selectedMedia.price !== "Not Available" &&
          ((selectedMedia.QuickCreation && selectedMedia.ViewConditions) || !selectedMedia.QuickCreation) ? (
            <>
              <Divider />
              {!selectedMedia.eth ? <MediaCurrentPrice /> : <EthMediaCurrentPrice />}
            </>
          ) : (
            <></>
          )}
          {props.vipAccess ? (
            <>
              <Divider />
              <SpentPrice
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <span>VIP ACCESS</span>
              </SpentPrice>
            </>
          ) : (
            <></>
          )}

          <Divider />
          {isSignedIn() ? !selectedMedia.eth ? <LikeShareInformation /> : <EthLikeShareInformation /> : null}
          {props.secondChild ?? null}
          {!selectedMedia.eth ? <MediaDetails /> : <EthMediaDetails />}
          {selectedMedia.QuickCreation && selectedMedia.collection && selectedMedia.collection.length > 0 ? (
            <MediaCollection />
          ) : null}
          {!selectedMedia.eth &&
            selectedMedia.NftConditions &&
            selectedMedia.NftConditions?.Price &&
            !selectedMedia.Auctions &&
            selectedMedia.Exchange && <MediaNFTPrice />}
          {selectedMedia.Auctions && !selectedMedia.eth && <MediaAuctionstatus />}
          <Divider />
          {!selectedMedia.eth ? (
            <MediaActionButtons
              showMoreDetailsButton={!!selectedMedia.Auctions || !!selectedMedia.Exchange}
              onMoreDetails={() => {
                if (selectedMedia.Auctions) {
                  setOpenPlaceBidDetailModal(true);
                } else {
                  //TODO: display details modal for media
                }
              }}
              onPlaceBid={() => {
                setOpenPlaceBidModal(true);
              }}
              onBuyNFT={() => {
                setOpenBuyNFTModal(true);
              }}
            />
          ) : (
            <EthMediaActionButtons
              onMoreDetails={() => {
                if (selectedMedia.Auctions) {
                  if (selectedMedia.Auctions.Owner === user.address) {
                    setOpenAuctionDetailModal(true);
                  } else {
                    setOpenPlaceBidDetailModal(true);
                  }
                } else {
                  //TODO: display details modal for media
                }
              }}
              onPlaceBid={() => {
                setOpenPlaceBidModal(true);
              }}
            />
          )}
          {isSignedIn() && selectedMedia.Auctions && openPlaceBidModal && (
            <PlaceBidModal
              isOpen={openPlaceBidModal}
              onClose={() => {
                setOpenPlaceBidModal(false);
              }}
              placeBid={handlePlaceBid}
              viewDetails={() => {
                setOpenPlaceBidModal(false);
                setOpenPlaceBidDetailModal(true);
              }}
            />
          )}
          {isSignedIn() && (
            <ChooseWalletModal
              isOpen={openChooseWalletModal}
              onClose={() => {
                setOpenChooseWalletModal(false);
              }}
              onAccept={() => {
                setOpenChooseWalletModal(false);
                setOpenFinalStepModal(true);
                setTimeout(() => {
                  setOpenFinalStepModal(false);
                  setOpenWalletSignatureRequestModal(true);
                }, 2000);
              }}
            />
          )}
          {isSignedIn() && openFinalStepModal && (
            <FinalStepModal
              isOpen={openFinalStepModal}
              onClose={() => {
                setOpenFinalStepModal(false);
              }}
            />
          )}
          {isSignedIn() && openWalletSignatureRequestModal && (
            <WalletSignatureRequestModal
              isOpen={openWalletSignatureRequestModal}
              onClose={() => {
                setOpenWalletSignatureRequestModal(false);
              }}
            />
          )}
          {isSignedIn() && selectedMedia.Auctions && openPlaceBidDetailModal && (
            <PlaceBidDetailModal
              isOpen={openPlaceBidDetailModal}
              onClose={() => {
                setOpenPlaceBidDetailModal(false);
              }}
              makeOffer={() => {
                setOpenPlaceBidDetailModal(false);
                setOpenPlaceBidModal(true);
              }}
            />
          )}
          {isSignedIn() && openBuyNFTModal && (
            // TODO: add handleRefresh and handleSwitchPlaceOffer
            <BuyNFTModal
              open={openBuyNFTModal}
              handleClose={() => {
                setOpenBuyNFTModal(false);
              }}
              handleRefresh={() => {}}
              handleSwitchPlaceOffer={() => {}}
              setStatus={setStatus}
              media={selectedMedia}
            />
          )}
        </Grid>
      </Grid>
      {isSignedIn() && selectedMedia.Auctions && openAuctionDetailModal && (
        <AuctionDetailModal
          open={openAuctionDetailModal}
          handleClose={() => {
            setOpenAuctionDetailModal(false);
          }}
        />
      )}
      {isSignedIn() && (
        <SignatureRequestModal
          open={openSignRequestModal}
          address={user.address}
          transactionFee="0.0000"
          detail={signRequestModalDetail}
          handleOk={handleConfirmSign}
          handleClose={() => setOpenSignRequestModal(false)}
        />
      )}
      {isSignedIn() && (
        <ConfirmPayment
          open={openConfirmPaymentModal}
          handleClose={() => setOpenConfirmPaymentModal(false)}
          payWithOwnWallet={payWithOwnWallet}
          payWithCommunity={() => {}}
        />
      )}
      <div className={classes.root}>
        {status && (
          <AlertMessage
            key={status.key}
            message={status.msg}
            variant={status.variant}
            onClose={() => setStatus(undefined)}
          />
        )}
      </div>
    </MediaContentWrapper>
  );
};

export const MediaContentWrapper = styled.div`
  margin-top: 72px;
  margin-right: 72px;
`;

export const NoCollectionDiv = styled.div`
  padding: 20px;
  font-size: 18px;
  border-top: 1px solid #99a1b3;
  color: #707582 !important;
`;

const CloseIcon = styled.img`
  position: relative;
  top: 0;
  right: calc(-100% + 14px);
`;
