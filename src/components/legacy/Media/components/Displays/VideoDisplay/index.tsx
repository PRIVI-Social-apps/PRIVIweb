import React, { useContext, useEffect, useRef, useState } from "react";

import axios from "axios";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";

import { RootState } from "store/reducers/Reducer";
import { VideoPlayer } from "./VideoPlayer";
import { TypicalLayout } from "../audioElements";
import MainPageContext from "components/legacy/Media/context";
import { PayDisplayMediaModal } from "components/legacy/Media/modals/PayDisplayMediaModal/PayDisplayMediaModal";
import { SignatureRequestModal } from "shared/ui-kit/Modal/Modals";
import { convertObjectToJsx } from "shared/functions/commonFunctions";
import URL from "shared/functions/getURL";
import { signTransaction } from "shared/functions/signTransaction";
import * as API from "shared/services/API/MediaAPI";
import { openMediaForSubstrate, closeMediaForSubstrate } from "shared/services/API";
import { useSubstrate } from "shared/connectors/substrate";
import { signPayload } from "shared/services/WalletSign";
import { IAPIRequestProps } from "shared/types/Media";
import { getWalletInfo } from "shared/helpers";
import AlertMessage from "shared/ui-kit/Alert/AlertMessage";

import styles from "./index.module.scss";

const VideoDisplay = () => {
  const history = useHistory();

  const userSelector = useSelector((state: RootState) => state.user);

  const { api, apiState, keyring, keyringState } = useSubstrate();

  const { open, selectedMedia, setSelectedMedia, setOpen } = useContext(MainPageContext);
  let vidRef: any = useRef();

  const [playing, setPlaying] = useState<boolean>(false);
  const [videoIsCharged, setVideoIsCharged] = useState<boolean>(false);
  const [isPaying, setIsPaying] = useState<boolean>(false);

  const [openPayDisplayModal, setOpenPayDisplayModal] = useState(false);
  const [alreadyChanged, setAlreadyChanged] = useState(false);
  const [isVipAccess, setIsVipAccess] = useState(false);

  const [errorMsg, setErrorMsg] = useState<string>("");
  const [openError, setOpenError] = useState(false);
  const [openSignRequestModal, setOpenSignRequestModal] = useState<boolean>(false);
  const [signRequestModalDetail, setSignRequestModalDetail] = useState<any>(null);

  const handleClickError = () => {
    setOpenError(true);
    setTimeout(() => {
      setOpenError(false);
    }, 4000);
  };

  const handleOpenPayDisplayModal = () => {
    setOpenPayDisplayModal(true);
  };

  const handleClosePayDisplayModal = isCharged => {
    if (!isCharged) {
      setSelectedMedia(null);
      setOpen(null);
      history.push(`/media`);
    } else {
      if (selectedMedia) {
        const media = { ...selectedMedia };

        if (!selectedMedia.AlbumImageURL || !selectedMedia.AudioURL) {
          media.VideoURL = `${selectedMedia.Url}?${Date.now()}`;
          media.AlbumImageURL = `${selectedMedia.UrlMainPhoto}?${Date.now()}`;
        }
        setSelectedMedia(media);
      }
      setVideoIsCharged(true);
      setAlreadyChanged(true);
    }
    setOpenPayDisplayModal(false);
  };

  useEffect(() => {
    if (
      selectedMedia &&
      (selectedMedia.Price > 0 ||
        selectedMedia.PricePerSecond > 0 ||
        (selectedMedia.QuickCreation && selectedMedia.ViewConditions.Price > 0)) &&
      !videoIsCharged
    ) {
      if (selectedMedia.CreatorId !== userSelector.id) {
        handleOpenPayDisplayModal();
      }
    } else {
      if (!alreadyChanged) {
        handleClosePayDisplayModal(true);
      }
    }
  }, [selectedMedia]);

  const handleStartAudio = () => {
    const txData = {
      MediaSymbol: selectedMedia.MediaSymbol.replace(/\s/g, ""),
      MediaType: selectedMedia.Type,
      Address: userSelector.address,
      SharingId: "",
    };
    const detailNode = convertObjectToJsx(txData);
    setSignRequestModalDetail(detailNode);
    setOpenSignRequestModal(true);
  };

  const handleConfirmSign = async () => {
    try {
      if (!selectedMedia.BlockchainNetwork || selectedMedia.BlockchainNetwork === "Privi Chain") {
        let body: any = {
          Listener: userSelector.id,
          PodAddress: selectedMedia.PodAddress,
          MediaSymbol: selectedMedia.MediaSymbol.replace(/\s/g, ""),
        };
        const [hash, signature] = await signTransaction(userSelector.mnemonic, body);
        body.Hash = hash;
        body.Signature = signature;

        axios
          .post(`${URL()}/streaming/initiateMediaStreaming`, body)
          .then(response => {
            if (response.data.success) {
            }
          })
          .catch(error => {
            console.log(error);
          });

        let txData: any = {
          MediaSymbol: selectedMedia.MediaSymbol.replace(/\s/g, ""),
        };

        const { privateKey } = await getWalletInfo(userSelector.mnemonic);
        const { signature: nftSignature } = await signPayload(
          "openNFT",
          userSelector.address,
          txData,
          privateKey
        );
        const openNftRequest: IAPIRequestProps = {
          Function: "openNFT",
          Address: userSelector.address,
          Signature: nftSignature,
          Payload: txData,
        };
        const response = await API.openNFT(openNftRequest);
        if (!response.success) {
          throw new Error(response.error);
        }
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
            setErrorMsg("Error while opening media");
          }
        });
      }
    } catch (e) {
      console.log(e.message);
      setErrorMsg(e.message);
      handleClickError();
    }
  };

  const endAudio = async () => {
    if (
      selectedMedia.PaymentType === "DYNAMIC" ||
      (selectedMedia.QuickCreation &&
        selectedMedia.ViewConditions &&
        selectedMedia.ViewConditions.ViewingType === "DYNAMIC")
    ) {
      if (!selectedMedia.BlockchainNetwork || selectedMedia.BlockchainNetwork === "Privi Chain") {
        let body: any = {
          Listener: userSelector.id,
          PodAddress: selectedMedia.PodAddress,
          MediaSymbol: selectedMedia.MediaSymbol.replace(/\s/g, ""),
        };
        const [hash, signature] = await signTransaction(userSelector.mnemonic, body);
        body.Hash = hash;
        body.Signature = signature;

        axios
          .post(`${URL()}/streaming/exitMediaStreaming`, body)
          .then(response => {
            if (response.data.success) {
            }
          })
          .catch(error => {
            console.log(error);
          });

        let data: any = {
          MediaSymbol: selectedMedia.MediaSymbol.replace(/\s/g, ""),
          MediaType: selectedMedia.Type,
          Address: userSelector.address,
          SharingId: "",
        };
        const [hash2, signature2] = await signTransaction(userSelector.mnemonic, data);
        let body2: any = {};
        body2.Data = data;
        body2.Hash = hash2;
        body2.Signature = signature2;

        axios
          .post(`${URL()}/media/closeNFT`, body2)
          .then(response => {
            if (response.data.success) {
            } else {
              setErrorMsg(response.data.error || "Error making the request");
              handleClickError();
            }
          })
          .catch(error => {
            console.log(error);
            setErrorMsg("Error making the request");
            handleClickError();
          });
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
          mediaId: selectedMedia.BlockchainId,
        };

        closeMediaForSubstrate(payload, api, accountPair).then(res => {
          if (!res.success) {
            setErrorMsg("Error while closing media");
          }
        });
      }
    }
  };

  const isSignedIn = () => {
    return !!sessionStorage.getItem("token");
  };

  if (selectedMedia && open)
    return (
      <TypicalLayout
        child={
          <>
            <SignatureRequestModal
              open={openSignRequestModal}
              address={userSelector.address}
              transactionFee="0.0000"
              detail={signRequestModalDetail}
              handleOk={handleConfirmSign}
              handleClose={() => setOpenSignRequestModal(false)}
            />
            {selectedMedia.VideoURL && selectedMedia.VideoURL !== "" ? (
              <VideoPlayer
                selectedMedia={selectedMedia}
                playing={playing}
                setPlaying={play => setPlaying(play)}
                setIsPaying={pay => setIsPaying(pay)}
                vidRef={vidRef}
                endAudio={() => endAudio()}
                startAudio={() => handleStartAudio()}
              />
            ) : selectedMedia.ImageUrl ? (
              <img
                src={
                  selectedMedia.ImageUrl
                    ? selectedMedia.ImageUrl
                    : new Date(selectedMedia.StartedTime).getTime() >= new Date().getTime()
                      ? `${require("assets/backgrounds/video.png")}`
                      : `${require("assets/backgrounds/video.png")}`
                }
                alt={""}
                className={styles.videoThumbnail}
              />
            ) : null}
            {isSignedIn() && (
              <PayDisplayMediaModal
                onAccept={() => {
                  handleClosePayDisplayModal(true);
                }}
                isOpen={openPayDisplayModal}
                onClose={() => {
                  handleClosePayDisplayModal(false);
                }}
                setIsVipAccess={vip => setIsVipAccess(vip)}
              />
            )}
            {openError && <AlertMessage key={Math.random()} message={errorMsg} variant={"error"} />}
          </>
        }
        playing={isPaying}
        vipAccess={isVipAccess}
      />
    );
  else return null;
};

export default VideoDisplay;
