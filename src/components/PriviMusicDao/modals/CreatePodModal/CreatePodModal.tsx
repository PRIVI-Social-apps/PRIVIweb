import React, { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { RootState } from "store/reducers/Reducer";
import GeneralNFTMediaTab from "./components/GeneralNFTMediaTab/GeneralNFTMediaTab";
import AssistanceNFTMediaTab from "./components/AssistanceNFTMediaTab/AssistanceNFTMediaTab";
import TokenomicsNFTMediaTab from "./components/TokenomicsNFTMediaTab/TokenomicsNFTMediaTab";
import SongsTab from "./components/SongsTab/SongsTab";
import { getCryptosRateAsList } from "shared/services/API";
import URL from "shared/functions/getURL";
import { updateTask } from "shared/functions/updateTask";
import { buildJsxFromObject } from "shared/functions/commonFunctions";
import { SignatureRequestModal } from "shared/ui-kit/Modal/Modals";
import {
  IInitiatePodMedias,
  IInitiatePod,
  musicDAOInitiatePod,
  initiatePodForSubstrate,
} from "shared/services/API";
import { BlockchainNets } from "shared/constants/constants";
import { useSubstrate } from "shared/connectors/substrate";
import { useAlertMessage } from "shared/hooks/useAlertMessage";
import { ReactComponent as WarningIcon } from "assets/icons/warning.svg";
import { createPodModalStyles } from "./CreatePodModal.styles";
import { Modal, PrimaryButton, SecondaryButton } from "shared/ui-kit";
import CollabsTab from "./components/CollabsTab/CollabsTab";
import Box from "shared/ui-kit/Box";
import cls from "classnames";

const startDate = Math.floor(Date.now() / 1000 + 3600 * 24 * 7); // one week later
const dateExpiration = Math.floor(Date.now() / 1000 + 3600 * 24 * 180);  // half year later

const CreatePodModal = (props: any) => {
  const classes = createPodModalStyles();
  const { showAlertMessage } = useAlertMessage();
  const userSelector = useSelector((state: RootState) => state.user);

  const [tabCreateNFTMedia, setTabCreateNFTMedia] = useState<number>(0);
  const [pod, setPod] = useState<any>({
    TokenName: "",
    TokenSymbol: "",
    IsInvesting: true,
    AMM: "Quadratic",
    Spread: "",
    FundingTokenPrice: "",
    MaxPrice: "",
    FundingToken: "USDT",
    FundingDate: startDate,
    FundingTarget: "",
    InvestorDividend: "",
    MaxSupply: "",
    DateExpiration: dateExpiration,
    Medias: [],

    Collabs: [],
    AssistanceRequired: false,
    Name: "",
    Description: "",
    Hashtags: [],
    Offers: [],
    OpenAdvertising: false,
    RuleBased: false,
    Network: BlockchainNets[0].name,
  });
  const [photo, setPhoto] = useState<any>(null);
  const [photoImg, setPhotoImg] = useState<any>(null);

  const [tokenPhoto, setTokenPhoto] = useState<any>(null);
  const [tokenPhotoImg, setTokenPhotoImg] = useState<any>(null);

  const [tokenObjList, setTokenObjList] = useState<any[]>([]);

  const [acceptWarning, setAcceptWarning] = useState(false);

  const payloadRef = useRef<any>({});
  const [openSignRequestModal, setOpenSignRequestModal] = useState<boolean>(false);
  const [signRequestModalDetail, setSignRequestModalDetail] = useState<any>(null);

  const { api, apiState, keyring, keyringState } = useSubstrate();
  // default add creator as collaborator
  useEffect(() => {
    if (userSelector.address && !pod.Collabs.find(u => u.address == userSelector.address)) 
      pod.Collabs.push({
        address: userSelector.address,
        name: userSelector.firstName,
        imageUrl: userSelector.url,
        urlSlug: userSelector.urlSlug
      });
  }, [userSelector.address])

  useEffect(() => {
    if (pod && pod.id && pod.HasPhoto) {
      setPhotoImg(`${pod.Url}?${Date.now()}`);
    }
    if (pod && pod.id && pod.HasPhotoToken) {
      setTokenPhotoImg(`${pod.UrlToken}?${Date.now()}`);
    }
  }, [pod.id, pod.HasPhoto, pod.HasPhotoToken]);

  // get token list from backend
  useEffect(() => {
    if (tokenObjList.length === 0 && props.open) {
      getCryptosRateAsList().then(data => {
        const tknObjList: any[] = [];
        data.forEach(rateObj => {
          tknObjList.push({ token: rateObj.token, name: rateObj.name });
        });
        setTokenObjList(tknObjList);
      })
  
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.open]);

  const handleOpenSignatureModal = () => {
    if (validateNFTMediaInfoCreate()) {
      let podInfo: any = {};
      if (pod.IsInvesting)
        podInfo = {
          TokenName: pod.TokenName,
          TokenSymbol: pod.TokenSymbol,
          IsInvesting: pod.IsInvesting,
          AMM: pod.AMM.toUpperCase(),
          Spread: pod.Spread / 100,
          FundingTokenPrice: +pod.FundingTokenPrice,
          MaxPrice: +pod.MaxPrice,
          FundingToken: pod.FundingToken,
          FundingDate: +pod.FundingDate, 
          FundingTarget: pod.FundingTarget,
          InvestorDividend: pod.InvestorDividend / 100,
          MaxSupply: +pod.MaxSupply,
          DateExpiration: +pod.DateExpiration,
        };
      const medias: IInitiatePodMedias[] = [];
      const filteredMedias = pod.Medias.filter(m => m.Title !== "");
      for (let media of filteredMedias) {
        const type: string = "AUDIO_TYPE";  // only audio in music dao
        const collabs = {};
        pod.Collabs.forEach(user => collabs[user.address] = 1/pod.Collabs.length);
        medias.push({
          MediaName: media.Title,
          MediaSymbol: media.MediaSymbol.replace(/\s/g, ""),
          Type: type,
          ReleaseDate: 0,
          Collabs: collabs,
        });
      }
      const payload: IInitiatePod = {
        PodInfo: podInfo,
        Medias: medias,
      };
      payloadRef.current = payload;
      setSignRequestModalDetail(buildJsxFromObject(payload));
      setOpenSignRequestModal(true);
    }
  };

  const afterCreatePod = async podRes => {
    if (podRes.success) {
      const podId = podRes.data;
      if (photo || tokenPhoto) {
        await uploadImage(podId, pod.TokenSymbol);
      }
      await updateTask(userSelector.id, "Create a Pod");
      setTimeout(() => {
        props.handleRefresh();
        props.onClose();
      }, 1000);
      showAlertMessage(`Pod created!`, { variant: "success" });
    } else showAlertMessage(`Error when making the request`, { variant: "error" });
  };

  const createPod = async () => {
    try {
      const payload: any = payloadRef.current;
      if (Object.keys(payload).length) {
        // additional info
        const additionalData: any = {};
        additionalData.Creator = userSelector.address;
        additionalData.Name = pod.Name;
        additionalData.Description = pod.Description;
        additionalData.SharingPercent = pod.SharingPercent;
        additionalData.OpenAdvertising = pod.OpenAdvertising;
        additionalData.MainHashtag = pod.Hashtags.length > 0 ? pod.Hashtags[0] : "";
        additionalData.Hashtags = pod.Hashtags;
        additionalData.HasPhoto = !!(photo || photoImg);
        additionalData.dimensions = pod.dimensions;
        additionalData.blockchainNetwork = pod.Network;
        if (pod.Network === BlockchainNets[1].value) {
          // Create Media Pod on Substrate Chain
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
          // Polkadot api query test code block
          // const now = await api.query.timestamp.now();
          // const { nonce, data: balance } = await api.query.system.account(accountAddress);
          // console.log(`${now}: balance of ${balance.free} and a nonce of ${nonce}`);
          initiatePodForSubstrate(payload, additionalData, api, accountPair).then(initiatePodRes => {
            afterCreatePod(initiatePodRes);
          });
        }
        // Create Media Pod on Privi Chain
        else {
          const initiatePodRes = await musicDAOInitiatePod(payload, additionalData,);
          afterCreatePod(initiatePodRes);
        }
      } else {
        showAlertMessage(`"Payload empty`, { variant: "error" });
      }
    } catch (e) {
      showAlertMessage(e.message, { variant: "error" });
    }
  };

  const validateNFTMediaInfoCreate = () => {
    if (pod.Name.length <= 5) {
      showAlertMessage(`Name field invalid. Minimum 5 characters required`, { variant: "error" });
      return false;
    } else if (pod.Description.length <= 20) {
      showAlertMessage(`Description field invalid. Minimum 20 characters required`, { variant: "error" });
      return false;
    } else if (pod.IsInvesting && (!pod.TokenName || pod.TokenName === "" || pod.TokenName.length < 5)) {
      showAlertMessage(`Token Name field invalid. Minimum 5 characters required`, { variant: "error" });
      return false;
    } else if (
      pod.IsInvesting &&
      (!pod.TokenSymbol || pod.TokenSymbol === "" || pod.TokenSymbol.length < 3 || pod.TokenSymbol > 6)
    ) {
      showAlertMessage(`Token ID field invalid. Between 3 and 6 characters required`, { variant: "error" });
      return false;
    } else if (pod.IsInvesting && (!pod.TokenDescription || pod.TokenDescription === "")) {
      showAlertMessage(`Token description field invalid`, { variant: "error" });
      return false;
    } else if (pod.IsInvesting && (!pod.FundingToken || pod.FundingToken === "")) {
      showAlertMessage(`Funding Token field invalid`, { variant: "error" });
      return false;
    } else if (pod.IsInvesting && (!pod.Spread || pod.Spread === "")) {
      showAlertMessage(`Trading Spread field invalid`, { variant: "error" });
      return false;
    } else if (pod.IsInvesting && !pod.FundingTokenPrice) {
      showAlertMessage(`Funding Price field invalid. Value must be greater than 0`, { variant: "error" });
      return false;
    } else if (pod.IsInvesting && (!pod.MaxSupply)) {
      showAlertMessage(`Maximum Supply field invalid`, { variant: "error" });
      return false;
    } else if (pod.IsInvesting && (!pod.FundingTarget || pod.FundingTarget === "")) {
      showAlertMessage(`Funding Target Supply field invalid`, { variant: "error" });
      return false;
    } else if (pod.IsInvesting && !pod.InvestorDividend) {
      showAlertMessage(`Investor Share field invalid`, { variant: "error" });
      return false;
    } else if (pod.IsInvesting && (!pod.AMM || pod.AMM === "")) {
      showAlertMessage(`AMM field invalid`, { variant: "error" });
      return false;
    } else if (pod.MaxPrice && (!pod.MaxPrice || pod.MaxPrice === "")) {
      showAlertMessage(`Maximum Price invalid`, { variant: "error" });
      return false;
    } else return true;
  };

  const validateNFTMediaInfo = async () => {
    if (pod.Name.length <= 5) {
      showAlertMessage(`Name field invalid. Minimum 5 characters required`, { variant: "error" });
      return false;
    } else if (pod.Description.length <= 20) {
      showAlertMessage(`Description field invalid. Minimum 20 characters required`, { variant: "error" });
      return false;
    } else return true;
  };

  const savePod = async () => {
    let validation = await validateNFTMediaInfo();
    if (validation) {
      // constructing body
      let body = { ...pod }; // copy from community
      body.MainHashtag = pod.Hashtags.length > 0 ? pod.Hashtags[0] : "";
      body.Creator = userSelector.id;

      body.HasPhoto = !!(photo || photoImg);

      axios
        .post(`${URL()}/pod/NFT/saveMediaPod`, body)
        .then(async response => {
          const resp = response.data;
          if (resp.success) {
            if (photo || tokenPhoto) {
              await uploadImageWIP(resp.data.nftPodId, pod.TokenSymbol);
            }

            setTimeout(() => {
              props.handleRefresh();
              props.onClose();
            }, 1000);
          } else {
            showAlertMessage(`Error when making the request`, { variant: "error" });
          }
          showAlertMessage(`Pod saved!`, { variant: "success" });
        })
        .catch(error => {
          showAlertMessage(`Error when making the request`, { variant: "error" });
        });
    }
  };

  //photo functions
  const uploadImage = async (imageId, tokenSymbol) => {
    return new Promise((resolve, reject) => {
      const formData = new FormData();
      formData.append("image", photo, imageId);
      const config = {
        headers: {
          "content-type": "multipart/form-data",
        },
      };
      if (photo) {
        axios
          .post(`${URL()}/mediaPod/changeMediaPodPhoto`, formData, config)
          .then(response => {
            resolve(true);
          })
          .catch(error => {
            resolve(true);
            // alert("Error uploading photo");
          });
      }

      if (tokenSymbol && tokenSymbol !== "" && tokenPhoto) {
        //change token photo (if creating token aswell)
        const formTokenData = new FormData();
        if (tokenPhoto) {
          formTokenData.append("image", tokenPhoto, tokenSymbol);
        } else {
          formTokenData.append("image", photo, tokenSymbol);
        }
        axios
          .post(`${URL()}/wallet/changeTokenPhoto`, formTokenData, config)
          .then(response => {
            let body = { dimensions: pod.tokenDimensions ?? pod.dimensions, id: tokenSymbol };
            axios.post(`${URL()}/wallet/updateTokenPhotoDimensions`, body).catch(error => {
              console.log(error);

              alert("Error uploading photo");
            });
            resolve(true);
          })
          .catch(error => {
            console.log(error);
            resolve(true);
            // alert("Error uploading token photo");
          });
      }
    });
  };

  //photo functions
  const uploadImageWIP = async (id, tokenSymbol) => {
    return new Promise((resolve, reject) => {
      const config = {
        headers: {
          "content-type": "multipart/form-data",
        },
      };
      if (photo) {
        const formData = new FormData();
        formData.append("image", photo, id);
        axios
          .post(`${URL()}/pod/WIP/changePhoto`, formData, config)
          .then(response => {
            resolve(true);
          })
          .catch(error => {
            console.log(error);

            resolve(true);
            // alert("Error uploading photo");
          });
      }
      if (tokenPhoto) {
        //change token photo (if creating token aswell)
        const formTokenData = new FormData();
        formTokenData.append("image", tokenPhoto, id);
        axios
          .post(`${URL()}/pod/WIP/changePhotoToken`, formTokenData, config)
          .then(response => {
            resolve(true);
          })
          .catch(error => {
            console.log(error);
            resolve(true);
            // alert("Error uploading token photo");
          });
      }
    });
  };

  return (
    <Modal
      size={!acceptWarning ? "small" : "medium"}
      isOpen={props.open}
      onClose={props.onClose}
      showCloseIcon
      className={classes.root}
    >
      <SignatureRequestModal
        open={openSignRequestModal}
        address={userSelector.address}
        transactionFee="0.0000"
        detail={signRequestModalDetail}
        handleOk={createPod}
        handleClose={() => setOpenSignRequestModal(false)}
      />
      <div style={{ padding: "20px, 30px" }}>
        {!acceptWarning ? (
          <div className={classes.warningScreen}>
            <img src={require("assets/musicDAOImages/pod-modal-logo.png")} alt={""} />
            <h3>Create a Music Pod</h3>
            <p>
              A pod is a collection of medias that can can be fundraised and investable. In this process you
              will create the Pod’s general characteristics and plan all the media it will contain.
            </p>
            <div className={classes.warningContainer}>
              <WarningIcon />
            </div>
            <p>
              Keep in mind that this collection is a Smart Contract.
              <br />
              Once you’ve created the media planning for your collection{" "}
              <b>you wont be able to change it in the future!</b>
            </p>
            <PrimaryButton size="medium" onClick={() => setAcceptWarning(true)}>
              Continue
            </PrimaryButton>
          </div>
        ) : (
          <div className={classes.modalContent}>
            <div className={classes.cardsOptions}>
              <div
                onClick={() => setTabCreateNFTMedia(0)}
                className={cls(
                  { [classes.tabHeaderPodMediaSelected]: tabCreateNFTMedia === 0 },
                  classes.tabHeaderPodMedia
                )}
              >
                General
              </div>
              <div
                className={cls(
                  { [classes.tabHeaderPodMediaSelected]: tabCreateNFTMedia === 1 },
                  classes.tabHeaderPodMedia
                )}
                onClick={() => setTabCreateNFTMedia(1)}
              >
                Collabs
              </div>
              <div
                className={cls(
                  { [classes.tabHeaderPodMediaSelected]: tabCreateNFTMedia === 2 },
                  classes.tabHeaderPodMedia
                )}
                onClick={() => setTabCreateNFTMedia(2)}
              >
                Songs
              </div>
              <div
                className={cls(
                  { [classes.tabHeaderPodMediaSelected]: tabCreateNFTMedia === 3 },
                  classes.tabHeaderPodMedia
                )}
                onClick={() => setTabCreateNFTMedia(3)}
              >
                Tokenomics
              </div>
            </div>
            {pod && (
              <>
                <div style={{ display: tabCreateNFTMedia === 0 ? "block" : "none" }}>
                  <div className={classes.headerCreatePod}>Create Music Collection</div>
                  <GeneralNFTMediaTab
                    pod={pod}
                    setPod={nv => setPod(nv)}
                    setPhoto={nv => setPhoto(nv)}
                    photo={photo}
                    setPhotoImg={nv => setPhotoImg(nv)}
                    photoImg={photoImg}
                    creation={true}
                    isCreator={pod.Creator === userSelector.id}
                    next={() => setTabCreateNFTMedia(1)}
                  />
                </div>
                <div style={{ display: tabCreateNFTMedia === 1 ? "block" : "none" }}>
                  <div className={classes.headerCreatePod}>Select Artists to collab with</div>
                  <CollabsTab pod={pod} setPod={nv => setPod(nv)} />
                </div>
                <div style={{ display: tabCreateNFTMedia === 2 ? "block" : "none" }}>
                  <div className={classes.headerCreatePod}>Plan Music Collection</div>
                  <SongsTab
                    pod={pod}
                    setPod={nv => setPod(nv)}
                  />
                </div>
                <div style={{ display: tabCreateNFTMedia === 3 ? "block" : "none" }}>
                  <AssistanceNFTMediaTab
                    pod={pod}
                    setPod={setPod}
                    tokenObjList={tokenObjList}
                    creation={true}
                  />
                  {!pod.AssistanceRequired && (
                    <TokenomicsNFTMediaTab
                      pod={pod}
                      setPod={setPod}
                      handleOpenSignatureModal={handleOpenSignatureModal}
                      setTokenPhoto={setTokenPhoto}
                      tokenPhoto={tokenPhoto}
                      setTokenPhotoImg={setTokenPhotoImg}
                      tokenPhotoImg={tokenPhotoImg}
                      isCreator={false}
                      creation={true}
                      tokenObjList={tokenObjList}
                    />
                  )}
                </div>
                <Box display="flex" alignItems="center" className={classes.buttons}>
                  <SecondaryButton
                    onClick={() => {
                      if (tabCreateNFTMedia !== 1) {
                        setTabCreateNFTMedia(tabCreateNFTMedia - 1);
                      } else {
                        props.onClose();
                      }
                    }}
                    size="medium"
                  >
                    {tabCreateNFTMedia !== 0 ? "Back" : "Cancel"}
                  </SecondaryButton>

                  <PrimaryButton
                    onClick={() => {
                      if (tabCreateNFTMedia !== 3) {
                        setTabCreateNFTMedia(tabCreateNFTMedia + 1);
                      } else if (
                        pod.IsInvesting
                      ) {
                        handleOpenSignatureModal();
                      } else {
                        savePod();
                      }
                    }}
                    size="medium"
                  >
                    {tabCreateNFTMedia === 3?
                     pod.IsInvesting ?
                      "Create Pod": "Save Pod as Work in Progress"
                      : tabCreateNFTMedia !== 2
                      ? "Next"
                      : "Save & Continue"}
                  </PrimaryButton>
                </Box>
              </>
            )}
          </div>
        )}
      </div>
    </Modal>
  );
};

export default CreatePodModal;
