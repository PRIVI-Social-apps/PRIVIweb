import React, { useContext, useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";
import { useSelector } from "react-redux";

import { RootState } from "store/reducers/Reducer";
import { AudioPlayer } from "./AudioPlayer";
import { TypicalLayout } from "../audioElements";
import MainPageContext from "components/legacy/Media/context";
import { PayDisplayMediaModal } from "components/legacy/Media/modals/PayDisplayMediaModal/PayDisplayMediaModal";
import { SignatureRequestModal, SignSuccessAlertModal } from "shared/ui-kit/Modal/Modals";
import URL from "shared/functions/getURL";
import { signTransaction } from "shared/functions/signTransaction";
import { convertObjectToJsx } from "shared/functions/commonFunctions";
import * as API from "shared/services/API/MediaAPI";
import { openMediaForSubstrate, closeMediaForSubstrate } from "shared/services/API";
import { useSubstrate } from "shared/connectors/substrate";
import { signPayload } from "shared/services/WalletSign";
import { IAPIRequestProps } from "shared/types/Media";
import { getWalletInfo } from "shared/helpers";
import AlertMessage from "shared/ui-kit/Alert/AlertMessage";

import styles from "./index.module.scss";

import SvgIcon from "@material-ui/core/SvgIcon";
import { ReactComponent as PlaySolid } from "assets/icons/play-solid.svg";

const AudioDisplay = () => {
  const history = useHistory();

  const userSelector = useSelector((state: RootState) => state.user);
  const { api, apiState, keyring, keyringState } = useSubstrate();

  const { open, selectedMedia, setSelectedMedia, setOpen } = useContext(MainPageContext);

  const [isPaying, setIsPaying] = useState<boolean>(false);
  const [audioIsCharged, setAudioIsCharged] = useState<boolean>(false);

  const [openPayDisplayModal, setOpenPayDisplayModal] = useState(false);
  const [alreadyChanged, setAlreadyChanged] = useState(false);
  const [isVipAccess, setIsVipAccess] = useState(false);

  const [errorMsg, setErrorMsg] = useState<string>("");
  const [openError, setOpenError] = useState(false);
  const [openSignRequestModal, setOpenSignRequestModal] = useState<boolean>(false);
  const [openSignSuccessAlertModal, setOpenSignSuccessAlertModal] = useState<boolean>(false);
  const [signRequestModalDetail, setSignRequestModalDetail] = useState<any>(null);

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

  const handleOpenPayDisplayModal = () => {
    setOpenPayDisplayModal(true);
  };

  const handleStartAudio = () => {
    const txData = {
      MediaSymbol: selectedMedia.MediaSymbol.replace(/\s/g, ""),
      Address: userSelector.address,
      SharingId: "",
    };
    const detailNode = convertObjectToJsx(txData);
    setSignRequestModalDetail(detailNode);
    setOpenSignRequestModal(true);
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
          media.AudioURL = `${selectedMedia.Url}?${Date.now()}`;
          media.AlbumImageURL = `${selectedMedia.UrlMainPhoto}?${Date.now()}`;
        }
        setSelectedMedia(media);
      }
      setAudioIsCharged(true);
      setAlreadyChanged(true);
    }
    setOpenPayDisplayModal(false);
  };

  useEffect(() => {
    if (
      selectedMedia &&
      selectedMedia.Price &&
      (selectedMedia.Price > 0 ||
        selectedMedia.PricePerSecond > 0 ||
        (selectedMedia.QuickCreation && selectedMedia.ViewConditions.Price > 0)) &&
      !audioIsCharged
    ) {
      handleOpenPayDisplayModal();
    } else {
      if (!alreadyChanged) {
        handleClosePayDisplayModal(true);
      }
    }
  }, [selectedMedia]);

  const isSignedIn = () => {
    return !!sessionStorage.getItem("token");
  };

  const handleConfirmSign = async () => {
    try {
      if (selectedMedia.NftConditions && selectedMedia.NftConditions !== {}) {
        /*if (!selectedMedia.BlockchainNetwork || selectedMedia.BlockchainNetwork === "Privi Chain") {
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
          setOpenSignSuccessAlertModal(true);
          const openNftRequest: IAPIRequestProps = {
            Function: "openNFT",
            Address: userSelector.address,
            Signature: nftSignature,
            Payload: txData,
          };
          const response = await API.openNFT({ chain: "privi", data: openNftRequest });
          if (!response.success) {
            throw new Error(response.error);
          }
        }*/
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
      }
    } catch (e) {
      console.log(e.message);
      setErrorMsg(e.message);
      handleClickError();
    }
  };

  const handleEndAudio = async () => {
    if (selectedMedia.NftConditions && selectedMedia.NftConditions !== {}) {
      /*if (selectedMedia.BlockchainNetwork === "Privi Chain") {
        if (
          selectedMedia.PaymentType === "DYNAMIC" ||
          (selectedMedia.QuickCreation &&
            selectedMedia.ViewConditions &&
            selectedMedia.ViewConditions.ViewingType === "DYNAMIC")
        ) {
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
      }*/
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
            <SignSuccessAlertModal
              title="All right!"
              subtitle="The signature process was completed <br /> successfully."
              open={openSignSuccessAlertModal}
              handleClose={() => setOpenSignSuccessAlertModal(false)}
            />
            <div
              className={styles.audioContainer}
              style={{
                backgroundImage:
                  selectedMedia.ImageUrl && selectedMedia.ImageUrl.length > 0
                    ? `url(${selectedMedia.ImageUrl})`
                    : selectedMedia.AlbumImageURL && selectedMedia.AlbumImageURL.length > 0
                    ? `url(${selectedMedia.AlbumImageURL})`
                    : "none",
                backgroundRepeat: "no-repeat",
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              <div className={styles.gradient}>
                <div className={styles.gradient}>
                  {selectedMedia.Artist ? (
                    <div className={styles.artist}>
                      <div
                        style={{
                          backgroundImage:
                            selectedMedia.Artist.imageURL && selectedMedia.Artist.imageURL.length > 0
                              ? `url(${selectedMedia.Artist.imageURL})`
                              : "none",
                          backgroundRepeat: "no-repeat",
                          backgroundSize: "cover",
                          backgroundPosition: "center",
                        }}
                      />
                      <div>{`@${selectedMedia.Artist.urlSlug ?? selectedMedia.Artist.firstName ?? ""}`}</div>
                    </div>
                  ) : (
                    <div />
                  )}
                  {selectedMedia.AudioURL && selectedMedia.AudioURL !== "" ? (
                    <AudioPlayer
                      selectedMedia={selectedMedia}
                      setIsPaying={pay => setIsPaying(pay)}
                      endAudio={handleEndAudio}
                      startAudio={handleStartAudio}
                    />
                  ) : (
                    <div
                      style={{
                        fontSize: "20px",
                        background: "white",
                        border: "5px solid white",
                        borderRadius: "50%",
                        color: "black",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <SvgIcon>
                        <PlaySolid />
                      </SvgIcon>
                    </div>
                  )}
                </div>
              </div>
            </div>

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

export default AudioDisplay;

/*const useInterval = (callback, delay) => {
  const savedCallback: any = useRef();

  // Remember the latest function.
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval.
  useEffect(() => {
    function tick() {
      savedCallback.current();
    }
    if (delay !== null) {
      let id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
};*/
