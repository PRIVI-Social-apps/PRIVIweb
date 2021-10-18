import React, { useContext, useState, useEffect } from "react";
import axios from "axios";
import { useHistory } from "react-router-dom";
import { useSelector } from "react-redux";

import { Modal } from "@material-ui/core";
import { RootState, useTypedSelector } from "store/reducers/Reducer";
import MainPageContext from "components/legacy/Media/context";
import { PayDisplayMediaModal } from "components/legacy/Media/modals/PayDisplayMediaModal/PayDisplayMediaModal";
import { TypicalLayout } from "../elements";

import URL from "shared/functions/getURL";
import { signTransaction } from "shared/functions/signTransaction";
import AlertMessage from "shared/ui-kit/Alert/AlertMessage";

import styles from "./index.module.scss";

const DigitalArtDisplay = () => {
  const history = useHistory();
  const userSelector = useSelector((state: RootState) => state.user);

  const { open, selectedMedia, setSelectedMedia, setOpen } = useContext(MainPageContext);

  const [digitalArtIsCharged, setDigitalArtIsCharged] = useState<boolean>(false);

  const [errorMsg, setErrorMsg] = useState<string>("");
  const [openError, setOpenError] = useState(false);
  const [digitalArtModalVisible, setDigitalArtModalVisible] = useState(false);

  //const [openCreatorsModal, setOpenCreatorsModal] = useState<boolean>(false);
  const user = useTypedSelector(state => state.user);

  const [openPayDisplayModal, setOpenPayDisplayModal] = useState(false);
  const [alreadyChanged, setAlreadyChanged] = useState(false);
  const [isVipAccess, setIsVipAccess] = useState(false);

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

        if (!selectedMedia.AlbumImageURL || !selectedMedia.DigitalArtURL) {
          media.DigitalArtURL = `${URL()}/media/getDigitalArt/${selectedMedia.MediaSymbol.replace(
            /\s/g,
            ""
          )}`;
          media.AlbumImageURL = `${URL()}/media/getMediaMainPhoto/${selectedMedia.MediaSymbol.replace(
            /\s/g,
            ""
          )}`;
        }
        setSelectedMedia(media);
      }
      setDigitalArtIsCharged(true);
      setAlreadyChanged(true);
    }
    setOpenPayDisplayModal(false);
  };

  const handleClickError = () => {
    setOpenError(true);
    setTimeout(() => {
      setOpenError(false);
    }, 4000);
  };

  useEffect(() => {
    console.log("entra aquiii");
  }, []);

  useEffect(() => {
    console.log(
      selectedMedia &&
      selectedMedia.Price &&
      (selectedMedia.Price > 0 ||
        selectedMedia.PricePerSecond > 0 ||
        (selectedMedia.QuickCreation && selectedMedia.ViewConditions.Price > 0)) &&
      !digitalArtIsCharged
    );
    if (
      selectedMedia &&
      selectedMedia.Price &&
      (selectedMedia.Price > 0 ||
        selectedMedia.PricePerSecond > 0 ||
        (selectedMedia.QuickCreation && selectedMedia.ViewConditions.Price > 0)) &&
      !digitalArtIsCharged
    ) {
      handleOpenPayDisplayModal();
    } else {
      if (!alreadyChanged) {
        handleClosePayDisplayModal(true);
      }
    }
  }, [selectedMedia]);

  const payDigitalArt = async () => {
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
      .post(`${URL()}/media/openNFT`, body2)
      .then(response => {
        if (response.data.success) {
          handleClosePayDisplayModal(true);
        } else {
          setErrorMsg(response.data.error || "Error making the request");
          handleClickError();

          setTimeout(() => {
            handleClosePayDisplayModal(false);
          }, 1000);
        }
      })
      .catch(error => {
        console.log(error);
        setErrorMsg("Error making the request");
        handleClickError();

        setTimeout(() => {
          handleClosePayDisplayModal(false);
        }, 1000);
      });

    //commented because it gave errors
    /*let body: any = {
      Listener: user.id,
      PodAddress: selectedMedia.PodAddress,
      MediaSymbol: selectedMedia.MediaSymbol,
    };
    const [hash, signature] = await signTransaction(user.mnemonic, body);
    body.Hash = hash;
    body.Signature = signature;

    axios
      .post(`${URL()}/streaming/initiateMediaStreaming`, body)
      .then(response => {
        if (response.data.success) {
          handleClosePayDisplayModal(true);
        } else {
          setErrorMsg(response.data.error || "Error making the request");
          handleClickError();
          //handleClosePayDisplayModal(false);
        }
      })
      .catch(error => {
        console.log(error);
        setErrorMsg("Error making the request");
        handleClickError();
        //handleClosePayDisplayModal(false);
      });*/
  };

  const isSignedIn = () => {
    return !!sessionStorage.getItem("token");
  };

  if (selectedMedia && open)
    return (
      <TypicalLayout type="digitalArt">
        {selectedMedia.DigitalArtURL && selectedMedia.DigitalArtURL !== "" ? (
          <img
            style={{ width: "100%", cursor: "pointer" }}
            onClick={() => setDigitalArtModalVisible(true)}
            className={styles.digitalArtImage}
            src={selectedMedia.DigitalArtURL}
          />
        ) : null}
        {isSignedIn() && (
          <PayDisplayMediaModal
            onAccept={() => {
              payDigitalArt();
            }}
            isOpen={openPayDisplayModal}
            onClose={() => {
              handleClosePayDisplayModal(false);
            }}
            setIsVipAccess={vip => setIsVipAccess(vip)}
          />
        )}

        {openError && <AlertMessage key={Math.random()} message={errorMsg} variant={"error"} />}

        <Modal
          open={digitalArtModalVisible}
          className={styles.digitalArtDisplayModal}
          onClose={() => setDigitalArtModalVisible(false)}
        >
          <div style={{ outline: "none" }}>
            <div
              className="exit"
              style={{
                cursor: "pointer",
                display: "flex",
                justifyContent: "flex-end",
                paddingTop: "10px",
                paddingRight: "10px",
              }}
            >
              <img
                onClick={() => setDigitalArtModalVisible(false)}
                src={require("assets/icons/cross_gray.png")}
                alt={"x"}
              />
            </div>
            <div style={{ width: "900px", maxWidth: "95vw", maxHeight: "95vh" }}>
              <img style={{ borderRadius: "20px" }} width={"100%"} src={selectedMedia.DigitalArtURL} />
            </div>
          </div>
        </Modal>

        {/*openCreatorsModal && (
          <MediaCreators
            open={openCreatorsModal}
            handleClose={() => setOpenCreatorsModal(false)}
            creators={[{}, {}, {}, {}]}
          />
        )*/}

        {/*selectedMedia && selectedMedia.DigitalArtURL && selectedMedia.DigitalArtURL !== "" && digitalArtIsCharged ? (
        <div className={styles.DigitalArtWrapper}>
          <MediaDisplayHeader />
          <Grid container direction="row" spacing={2}>
            <Grid item xs={12} md={8} direction="column">

              <RateMedia />
              <MediaComments />
            </Grid>
            <Grid item xs={12} md={4}>
              <Divider />
              <MediaDetails />
              <MediaCollection />
              <MediaCurrentPrice />
              <div
                className={styles.btnMoreDetails}
                onClick={() => {
                  setOpenCreatorsModal(true);
                }}
              >
                Create Art
              </div>
            </Grid>
          </Grid>
        </div>
              ) : null*/}
      </TypicalLayout>
    );
  else return null;
};

export default DigitalArtDisplay;
