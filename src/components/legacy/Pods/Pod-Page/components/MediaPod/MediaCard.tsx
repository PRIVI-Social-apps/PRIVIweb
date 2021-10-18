import "./Media.css";
import React, { useEffect, useState, useRef } from "react";
import Moment from "react-moment";
import { useHistory } from "react-router-dom";
import axios from "axios";
import { useSelector } from "react-redux";
import { Accordion, AccordionDetails, AccordionSummary, Menu, Modal } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { RootState } from "store/reducers/Reducer";
import CreatePost from "../Create-Post/Create-post";
import MediaTerms from "./modals/MediaTerms";
import FeedbackModal from "./modals/FeedbackModal";
import EthereumExportModal from "./modals/EthereumExportModal";
import ShowCommunityModal from "./modals/ShowOnCommunity";
import URL from "shared/functions/getURL";
import { PrimaryButton, SecondaryButton } from "shared/ui-kit";
import { StyledMenuItem } from "shared/ui-kit/Styled-components/StyledComponents";
import { buildJsxFromObject } from "shared/functions/commonFunctions";
import { SignatureRequestModal } from "shared/ui-kit/Modal/Modals";
import { IUploadMedia, uploadMedia, uploadMediaForSubstrate } from "shared/services/API";
import AlertMessage from "shared/ui-kit/Alert/AlertMessage";
import { useSubstrate } from "shared/connectors/substrate";
import { DropDownIcon } from "shared/ui-kit/Icons";
import { BlockchainNets } from "shared/constants/constants";

const videoIcon = require("assets/mediaIcons/small/video.png");
const videoStreamIcon = require("assets/mediaIcons/small/video_live.png");
const audioIcon = require("assets/mediaIcons/small/audio.png");
const audioStreamIcon = require("assets/mediaIcons/small/audio_live.png");
const blogIcon = require("assets/mediaIcons/small/blog.png");
const blogSnapIcon = require("assets/mediaIcons/small/blog_snap.png");
const digitalArtIcon = require("assets/mediaIcons/small/digital_art.png");

const videoPhoto = require("assets/backgrounds/video.png");
const videoLivePhoto = require("assets/backgrounds/live_video.png");
const audioPhoto = require("assets/backgrounds/audio.png");
const audioLivePhoto = require("assets/backgrounds/live_audio_1.png");
const blogPhoto = require("assets/backgrounds/blog.png");
const blogSnapPhoto = require("assets/backgrounds/blog_snap.png");
const digitalArtPhoto = require("assets/backgrounds/digital_art_2.png");

const getDefaultImage = type => {
  switch (type) {
    case "VIDEO_TYPE":
      return `url(${videoPhoto})`;
    case "LIVE_VIDEO_TYPE":
      return `url(${videoLivePhoto})`;
    case "AUDIO_TYPE":
      return `url(${audioPhoto})`;
    case "LIVE_AUDIO_TYPE":
      return `url(${audioLivePhoto})`;
    case "BLOG_TYPE":
      return `url(${blogPhoto})`;
    case "BLOG_SNAP_TYPE":
      return `url(${blogSnapPhoto})`;
    case "DIGITAL_ART_TYPE":
      return `url(${digitalArtPhoto})`;
    default:
      return "none";
  }
};

const useStyles = makeStyles(theme => ({
  root: {
    width: "100%",
    "& > * + *": {
      marginTop: theme.spacing(2),
    },
  },
}));

const MediaCard = ({ media, refreshPod, pod, podId, tokenNameToSymbolMap }) => {
  const classes = useStyles();
  const history = useHistory();

  const userSelector = useSelector((state: RootState) => state.user);
  const users = useSelector((state: RootState) => state.usersInfoList);

  const [status, setStatus] = useState<any>("");
  const [artists, setArtists] = useState<any[]>([]);
  const { api, apiState, keyring, keyringState } = useSubstrate();

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const [openBlogModal, setOpenBlogModal] = useState<boolean>(false);
  const [openFeedbackModal, setOpenFeedbackModal] = useState<boolean>(false);
  const [openTermsModal, setOpenTermsModal] = useState<boolean>(false);
  const [openEthereumModal, setOpenEthereumModal] = useState<boolean>(false);
  const [openCommunityModal, setOpenCommunityModal] = useState<boolean>(false);

  const payloadRef = useRef<any>({});
  const [openSignRequestModal, setOpenSignRequestModal] = useState<boolean>(false);
  const [signRequestModalDetail, setSignRequestModalDetail] = useState<any>(null);

  const handleClickMenu = (event: React.MouseEvent<HTMLImageElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleOpenBlogModal = () => {
    if (!media.notificationsCollabsExportEthereum) {
      axios
        .post(`${URL()}/media/notifications/exportToEthereum`, {
          podId: podId,
          mediaId: media.MediaSymbol,
        })
        .then(async response => { })
        .catch(error => {
          setStatus({
            msg: "Error when making the request",
            key: Math.random(),
            variant: "error",
          });
        });
    }
    setOpenBlogModal(true);
  };

  const handleOpenFeedbackModal = () => {
    setOpenFeedbackModal(true);
  };

  const handleOpenTermsModal = () => {
    setOpenTermsModal(true);
  };

  const handleOpenEthereumModal = () => {
    setOpenEthereumModal(true);
  };

  const handleOpenCommunityModal = () => {
    setOpenCommunityModal(true);
  };

  const handleCloseBlogModal = () => {
    refreshPod();
    setOpenBlogModal(false);
  };
  const handleCloseFeedbackModal = () => {
    setOpenFeedbackModal(false);
  };
  const handleCloseTermsModal = () => {
    refreshPod();
    setOpenTermsModal(false);
  };
  const handleCloseEthereumModal = () => {
    setOpenEthereumModal(false);
  };
  const handleCloseCommunityModal = () => {
    setOpenCommunityModal(false);
  };

  useEffect(() => {
    //console.log("media", media);
    if (media.Type === "DIGITAL_ART_TYPE") {
      media.ImageURL = `${URL()}/mediaPod/uploadMedia`;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [media.IsUploaded]);

  useEffect(() => {
    if (media && media.Collabs && media.Collabs !== {}) {
      let arts: any[] = [];
      let collabs: any[] = [];
      for (const [key, value] of Object.entries(media.Collabs)) {
        collabs.push(key);
      }

      for (let collab of collabs) {
        let usr = users.find(userItem => userItem.name.replace(/\s+$/, "") === collab);
        if (usr) {
          arts.push(usr);
        }
      }

      setArtists(arts);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [media.Collabs]);

  const handleOpenSignatureModal = () => {
    if (pod.PodAddress && media.MediaSymbol) {
      const payload: IUploadMedia = {
        PodAddress: pod.PodAddress,
        MediaSymbol: media.MediaSymbol,
      };
      payloadRef.current = payload;
      setSignRequestModalDetail(buildJsxFromObject(payload));
      setOpenSignRequestModal(true);
    } else {
      setStatus({
        msg: "Missing Pod or Media",
        key: Math.random(),
        variant: "error",
      });
    }
  };

  const afterUploadMedia = async (uploadMediaRes) => {
    if (uploadMediaRes.success) {
      setStatus({
        msg: "Request success",
        key: Math.random(),
        variant: "success",
      });
      refreshPod();
    } else {
      setStatus({
        msg: uploadMediaRes.error ? uploadMediaRes.error : "Error when making the request",
        key: Math.random(),
        variant: "error",
      });
    }
  }
  const hanldeUploadMedia = async () => {
    try {
      const payload = payloadRef.current;
      if (Object.keys(payload).length) {
        const additionalData: Object = {
          IsRegistered: media.IsRegistered,
          Requester: userSelector.address
        }

        if (pod.BlockchainNetwork === BlockchainNets[1].value) {
          // Upload Media on Substrate Chain
          if (!api) return;

          const keyringOptions = (keyring as any).getPairs().map(account => ({
            key: account.address,
            value: account.address,
            text: account.meta.name.toUpperCase(),
            icon: "user",
          }));
          const accountAddress = keyringOptions.length > 0 ? keyringOptions[0].value : "";
          const accountPair =
            accountAddress && keyringState === "READY" && (keyring as any).getPair(accountAddress);

          uploadMediaForSubstrate(payload, additionalData, api, accountPair).then(uploadMediaRes => {
            afterUploadMedia(uploadMediaRes);
          })
        } else {
          // Upload Media on Privi Chain
          const uploadMediaRes = await uploadMedia("uploadMedia", payload, additionalData, userSelector.mnemonic);
          afterUploadMedia(uploadMediaRes);
        }
      }
    } catch (e) {
      setStatus({
        msg: "Unexpected error: " + e,
        key: Math.random(),
        variant: "error",
      });
    }
  };

  const uploadPicture = () => {
    let inputElement = document.createElement("input");
    inputElement.type = "file";
    inputElement.accept = "image/*";

    // set onchange event to call callback when user has selected file
    inputElement.addEventListener("change", fileInputPhoto);

    // dispatch a click event to open the file dialog
    inputElement.dispatchEvent(new MouseEvent("click"));
  };

  const uploadAudio = () => {
    let inputElement = document.createElement("input");
    inputElement.type = "file";
    inputElement.accept = "audio/*";

    // set onchange event to call callback when user has selected file
    inputElement.addEventListener("change", fileInputAudio);

    // dispatch a click event to open the file dialog
    inputElement.dispatchEvent(new MouseEvent("click"));
  };

  const uploadVideo = () => {
    let inputElement = document.createElement("input");
    inputElement.type = "file";
    inputElement.accept = "video/*";

    // set onchange event to call callback when user has selected file
    inputElement.addEventListener("change", fileInputVideo);

    // dispatch a click event to open the file dialog
    inputElement.dispatchEvent(new MouseEvent("click"));
  };

  const fileInputPhoto = e => {
    e.preventDefault();
    const files = e.target.files;
    if (files.length) {
      handleFiles(files);
    }
  };
  const fileInputVideo = e => {
    e.preventDefault();
    const files = e.target.files;
    if (files.length) {
      handleFilesVideo(files);
    }
  };
  const fileInputAudio = e => {
    e.preventDefault();
    const files = e.target.files;
    if (files.length) {
      handleFilesAudio(files);
    }
  };

  const handleFiles = (files: any) => {
    for (let i = 0; i < files.length; i++) {
      if (validateFile(files[i])) {
        onChangePhoto(files[i]);
      } else {
        files[i]["invalid"] = true;
        console.log("No valid file");
        // Alert invalid image
      }
    }
  };

  const handleFilesVideo = (files: any) => {
    for (let i = 0; i < files.length; i++) {
      //console.log(files[i].size);
      if (files[i].size / 1024 <= 102400) {
        if (validateFileVideo(files[i])) {
          onChangeVideo(files[i]);
        } else {
          files[i]["invalid"] = true;
          setStatus({
            msg: "No valid format",
            key: Math.random(),
            variant: "error",
          });
        }
      } else {
        setStatus({
          msg: "File too big (< 25Mb)",
          key: Math.random(),
          variant: "error",
        });
      }
    }
  };

  const handleFilesAudio = (files: any) => {
    for (let i = 0; i < files.length; i++) {
      if (files[i].size / 1024 <= 256000) {
        if (validateFileAudio(files[i])) {
          onChangeAudio(files[i]);
          setStatus({
            msg: "Request success",
            key: Math.random(),
            variant: "success",
          });
        } else {
          files[i]["invalid"] = true;
          //console.log("No valid file");
          // Alert invalid image
          setStatus({
            msg: "No valid format",
            key: Math.random(),
            variant: "error",
          });
        }
      } else {
        setStatus({
          msg: "File too big (< 250Mb)",
          key: Math.random(),
          variant: "error",
        });
      }
    }
  };

  const onChangePhoto = (file: any) => {
    let now = Date.now();
    const formData = new FormData();
    formData.append("file", file, "" + now);
    const config = {
      headers: {
        "content-type": "multipart/form-data",
      },
    };
    axios
      .post(`${URL()}/media/uploadDigitalArt/${podId}/${media.id}`, formData, config)
      .then(response => {
        console.log(response);
        if (response.data && response.data.success) {
          handleOpenSignatureModal();
        } else {
          setStatus({
            msg: response.data.error,
            key: Math.random(),
            variant: "error",
          });
        }
      })
      .catch(error => {
        setStatus({
          msg: "Error uploading photo",
          key: Math.random(),
          variant: "error",
        });
      });
  };

  const onChangeAudio = (file: any) => {
    let now = Date.now();
    const formData = new FormData();
    formData.append("audio", file, "" + now);
    const config = {
      headers: {
        "content-type": "multipart/form-data",
      },
    };
    axios
      .post(`${URL()}/media/uploadAudio/${podId}/${media.id}`, formData, config)
      .then(response => {
        if (response.data && response.data.success) {
          handleOpenSignatureModal();
        } else {
          setStatus({
            msg: response.data.error,
            key: Math.random(),
            variant: "error",
          });
        }
      })
      .catch(error => {
        setStatus({
          msg: "Error uploading audio",
          key: Math.random(),
          variant: "error",
        });
      });
  };

  const onChangeVideo = (file: any) => {
    let now = Date.now();
    const formData = new FormData();
    formData.append("video", file, "" + now);
    const config = {
      headers: {
        "content-type": "multipart/form-data",
      },
    };
    axios
      .post(`${URL()}/media/uploadVideo/${podId}/${media.id}`, formData, config)
      .then(response => {
        if (response.data && response.data.success) {
          handleOpenSignatureModal();
        } else {
          //console.log(response.data);
          setStatus({
            msg: response.data.error,
            key: Math.random(),
            variant: "error",
          });
        }
      })
      .catch(error => {
        setStatus({
          msg: "Error uploading video",
          key: Math.random(),
          variant: "error",
        });
      });
  };

  const validateFile = file => {
    const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/x-icon"];
    if (validTypes.indexOf(file.type) === -1) {
      return false;
    }
    return true;
  };

  const validateFileVideo = file => {
    const validTypes = ["video/mp4", "video/webm", "video/ogg", "video/quicktime"];
    if (validTypes.indexOf(file.type) === -1) {
      return false;
    }
    return true;
  };

  const validateFileAudio = file => {
    //console.log(file);
    const validTypes = ["audio/mp3", "audio/ogg", "audio/wav", "audio/x-m4a", "audio/mpeg"];
    if (validTypes.indexOf(file.type) === -1) {
      return false;
    }
    return true;
  };

  const goToMedia = () => {
    if (new Date().getTime() > new Date(media.ReleaseDate).getTime()) {
      history.push(`/media/${media.MediaSymbol.replace(/\s/g, "")}`);
    }
  };

  const handleCreateAuction = event => {
    event.preventDefault();
    event.stopPropagation();
    handleCloseMenu();
  };

  const handleSellNFT = event => {
    event.preventDefault();
    event.stopPropagation();
    handleCloseMenu();
  };

  return (
    <div className="pod-media-card">
      <SignatureRequestModal
        open={openSignRequestModal}
        address={userSelector.address}
        transactionFee="0.0000"
        detail={signRequestModalDetail}
        handleOk={hanldeUploadMedia}
        handleClose={() => setOpenSignRequestModal(false)}
      />
      <div className="top-items">
        <section>
          <div
            onClick={goToMedia}
            className="media-image"
            style={{
              backgroundImage: media.HasPhoto
                ? `url(${URL()}/media/getMediaMainPhoto/${media.MediaSymbol.replace(/\s/g, "")})`
                : getDefaultImage(media.Type),
              backgroundRepeat: "no-repeat",
              backgroundSize: "cover",
              backgroundPosition: "center",
              cursor:
                media && media.IsRegistered && media.ReleaseDate && new Date(media.ReleaseDate).getTime()
                  ? "pointer"
                  : "inherit",
            }}
          />
          <div className="type">
            <img
              src={
                media.Type === "VIDEO_TYPE"
                  ? videoIcon
                  : media.Type === "LIVE_VIDEO_TYPE"
                    ? videoStreamIcon
                    : media.Type === "AUDIO_TYPE"
                      ? audioIcon
                      : media.Type === "LIVE_AUDIO_TYPE"
                        ? audioStreamIcon
                        : media.Type === "BLOG_TYPE"
                          ? blogIcon
                          : media.Type === "BLOG_SNAP_TYPE"
                            ? blogSnapIcon
                            : digitalArtIcon
              }
              alt=""
            />
            {media.Type === "VIDEO_TYPE"
              ? "Video"
              : media.Type === "LIVE_VIDEO_TYPE"
                ? "Live Video"
                : media.Type === "AUDIO_TYPE"
                  ? "Audio"
                  : media.Type === "LIVE_AUDIO_TYPE"
                    ? "Live Audio"
                    : media.Type === "BLOG_TYPE"
                      ? "Blog"
                      : media.Type === "BLOG_SNAP_TYPE"
                        ? "Blog Snap"
                        : "Digital Art"}
          </div>
        </section>

        <section>
          {(pod.Creator === userSelector.id || pod.Creator === userSelector.address) &&
            media.IsUploaded &&
            media.IsRegistered &&
            new Date().getTime() > new Date(media.ReleaseDate).getTime() ? (
            <img
              className="menuIcon"
              onClick={handleClickMenu}
              src={require("assets/icons/three_dots.png")}
              alt="menu"
            />
          ) : null}

          {(pod.Creator === userSelector.id || pod.Creator === userSelector.address) &&
            media.IsUploaded &&
            media.IsRegistered &&
            new Date().getTime() > new Date(media.ReleaseDate).getTime() ? (
            <Menu
              anchorOrigin={{
                vertical: "top",
                horizontal: "center",
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              style={{ marginTop: 35 }}
              anchorEl={anchorEl}
              keepMounted
              open={Boolean(anchorEl)}
              onClose={handleCloseMenu}
            >
              <StyledMenuItem onClick={handleCreateAuction}>Create Auction</StyledMenuItem>
              <StyledMenuItem onClick={handleSellNFT}>Sell NFT by fixed price</StyledMenuItem>
            </Menu>
          ) : null}

          {media.IsRegistered && new Date().getTime() < new Date(media.ReleaseDate).getTime() ? (
            <div className={"date"}>
              Release Date: <Moment format={"MM.DD.YYYY"}>{media.ReleaseDate}</Moment>
            </div>
          ) : null}
          <div className="artists">
            {artists.map((artist, index) =>
              index < 3 ? (
                <div
                  className="artist-image"
                  style={{
                    backgroundImage:
                      artist.imageURL && artist.imageURL !== "" ? `url(${artist.imageURL})` : "none",
                    backgroundRepeat: "no-repeat",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                />
              ) : null
            )}
            {artists.length > 3 ? <div className="artist-counter">+{artists.length - 3}</div> : null}
          </div>
          <div className="title" onClick={goToMedia}>
            <h3 style={{ cursor: "pointer" }}>{media.MediaName ?? ""}</h3>
            <p>{media.MediaDescription ?? ""}</p>
          </div>
        </section>
      </div>

      <Accordion defaultExpanded={false} className="accordion">
        <AccordionSummary
          expandIcon={<DropDownIcon />}
          aria-controls="panel1c-content"
          id="panel1c-header"
          className="accordion-summary"
        >
          <div className="row">
            <div className="title">
              💰 Regular Price
              <img src={require("assets/icons/info.svg")} alt="info" />
            </div>
            <div className="title">
              NFT Price
              <img src={require("assets/icons/info.svg")} alt="info" />
            </div>
          </div>
        </AccordionSummary>
        <AccordionDetails className={"accordion-details"}>
          <div className="row">
            <div className="row">
              {`${media.FundingToken ?? "ETH"} ${media.PricePerSecond ?? "0"}/per second`}
              <span>{`($${media.PricePerSecondUSD ?? "0"})`}</span>
            </div>
            <div className="row">
              {`${media.FundingToken ?? "ETH"} ${media.Price ?? "0"}`}
              <span>{`($${media.PriceUSD ?? "0"})`}</span>
            </div>
          </div>

          <div className="row">
            <div className="col">
              Investor share
              <span>{media.InvestorShare ? (media.InvestorShare * 100).toFixed(0) : "0"}%</span>
            </div>
            <div className="col">
              Sharing share
              <span>{media.SharingPercent ? (media.SharingPercent * 100).toFixed(0) : "0"}%</span>
            </div>
            <div className="col">
              Collabs share
              <span>{1 - (media.InvestorShare || 0) - (media.SharingPercent || 0) * 100}%</span>
            </div>
            <div className="col">
              Royalty
              <span>{media.Royalty ? (media.Royalty * 100).toFixed(0) : "0"}%</span>
            </div>
          </div>
        </AccordionDetails>
      </Accordion>

      {media.IsRegistered && media.IsUploaded && (
        <Accordion defaultExpanded={false} className="accordion">
          <AccordionSummary
            expandIcon={<DropDownIcon />}
            aria-controls="panel1c-content"
            id="panel1c-header"
            className="accordion-summary"
          >
            <div className="title">
              <div className="row">
                <div className="title">Viewer Rewards</div>
                <div className="title">Exclusive access requirements</div>
              </div>
            </div>
          </AccordionSummary>
          <AccordionDetails className={"accordion-details"}>
            <div className="row rewards">
              <div className="row">
                <div className="col">
                  <div className="row row-header">
                    <div className="col">🤑 Pod Tokens</div>
                    <div className="col">💎 Badges</div>
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col">
                  <div className="row row-header">
                    <div className="col">🤑 Pod Tokens</div>
                    <div className="col">💎 Badges</div>
                  </div>
                  {media.ExclusivePermissions &&
                    media.ExclusivePermissionsList?.length > 0 &&
                    media.ExclusivePermissionsList.map(data => (
                      <div className="row row-item" style={{ margin: "8px 0" }}>
                        <div className="col">{data.Quantity}</div>
                        <div className="col">
                          <img
                            src={require(`assets/tokenImages/${data.Token}.png`)}
                            alt={data.Token}
                            width={24}
                            height={24}
                          />
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </AccordionDetails>
        </Accordion>
      )}

      {/*<Accordion defaultExpanded={false} className="accordion">
        <AccordionSummary
          expandIcon={<DropDownIcon />}
          aria-controls="panel1c-content"
          id="panel1c-header"
          className="accordion-summary"
        >
          <div className="title">
            📈 Ownership Distribution
            <img src={require("assets/icons/info.svg")} alt="info" />
          </div>
        </AccordionSummary>
        <AccordionDetails className={"accordion-details"}>{PrintMediaCardGraph(5, 2.5, 2.5)}</AccordionDetails>
      </Accordion>*/}

      <div className="bottom-items wrapFlexRow">
        {pod.Creator === userSelector.id || pod.Creator === userSelector.address ? (
          !media.IsUploaded ||
            (media.IsUploaded && new Date().getTime() < new Date(media.ReleaseDate).getTime()) ? (
            !media.IsRegistered ? (
              <SecondaryButton
                size="medium"
                onClick={() => {
                  handleOpenTermsModal();
                }}
              >
                Edit Terms
              </SecondaryButton>
            ) : (
              <div className={"terms"}>
                <img src={require("assets/icons/check_gray_round.png")} alt={"edit"} />
                Terms edited
              </div>
            )
          ) : (
            <SecondaryButton onClick={handleOpenEthereumModal} size="medium" style={{ marginRight: 8 }}>
              Export to Ethereum network
            </SecondaryButton>
          )
        ) : null}

        {pod.Creator === userSelector.id || pod.Creator === userSelector.address ? (
          !media.IsUploaded && media.IsRegistered ? (
            media.Type === "VIDEO_TYPE" ||
              media.Type === "AUDIO_TYPE" ||
              media.Type === "DIGITAL_ART_TYPE" ? (
              <PrimaryButton
                size="medium"
                onClick={() => {
                  if (media.Type === "VIDEO_TYPE") {
                    uploadVideo();
                  } else if (media.Type === "AUDIO_TYPE") {
                    uploadAudio();
                  } else if (media.Type === "DIGITAL_ART_TYPE") {
                    uploadPicture();
                  }
                }}
              >
                Upload Media
              </PrimaryButton>
            ) : media.Type === "BLOG_TYPE" || media.Type === "BLOG_SNAP_TYPE" ? (
              <PrimaryButton size="medium" onClick={handleOpenBlogModal}>
                Upload Blog
              </PrimaryButton>
            ) : null
          ) : media.IsRegistered && media.IsUploaded ? (
            new Date().getTime() < new Date(media.ReleaseDate).getTime() ? (
              <PrimaryButton size="medium" onClick={handleOpenFeedbackModal}>
                {`Share & Get Feedback`}
              </PrimaryButton>
            ) : (
              <PrimaryButton size="medium" onClick={handleOpenCommunityModal}>
                {` Show on a Community`}
              </PrimaryButton>
            )
          ) : null
        ) : null}
      </div>
      <Modal
        className="modal"
        open={openTermsModal}
        onClose={handleCloseTermsModal}
        style={{ display: "flex", alignItems: "center", justifyContent: "center" }}
      >
        <MediaTerms
          onCloseModal={handleCloseTermsModal}
          media={media}
          refreshPod={refreshPod}
          mediaId={media.id}
          mediaPod={podId}
          podAddress={pod.PodAddress}
          creator={pod.Creator}
          network={pod.BlockchainNetwork}
          isUploaded={
            media.Type === "VIDEO_TYPE" || media.Type === "AUDIO_TYPE" || media.Type === "DIGITAL_ART_TYPE"
              ? media.IsUploaded
              : true
          }
          tokenNameToSymbolMap={tokenNameToSymbolMap}
        />
      </Modal>
      <Modal className="modalCreateModal" open={openBlogModal} onClose={handleCloseBlogModal}>
        <CreatePost
          handleClose={handleCloseBlogModal}
          media={media}
          podId={podId}
          type={"Blog"}
          onlyEditor={true}
          uploadMedia={() => handleOpenSignatureModal()}
        />
      </Modal>
      <FeedbackModal open={openFeedbackModal} handleClose={handleCloseFeedbackModal} />
      <EthereumExportModal
        open={openEthereumModal}
        media={media}
        pod={pod}
        handleClose={handleCloseEthereumModal}
        isCreator={pod.Creator === userSelector.id || pod.Creator === userSelector.address}
        savedCollabs={media.SavedCollabs}
        creator={pod.Creator}
      />
      <ShowCommunityModal
        open={openCommunityModal}
        // open={true}
        handleClose={handleCloseCommunityModal}
        mediaId={media.id}
        mediaType={media.Type}
        podId={podId}
      />
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
    </div>
  );
};

export default MediaCard;
