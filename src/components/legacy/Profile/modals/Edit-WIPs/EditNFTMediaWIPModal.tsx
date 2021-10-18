import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";

import { RootState, useTypedSelector } from "store/reducers/Reducer";
import OffersTab from "./components/OffersTab";
import GeneralNFTMediaTab from "../../../Pods/Pod-Create-NFTMedia-Modal/components/GeneralNFTMediaTab/GeneralNFTMediaTab";
import MediaNFTMediaTab from "../../../Pods/Pod-Create-NFTMedia-Modal/components/MediaNFTMediaTab/MediaNFTMediaTab";
import AssistanceNFTMediaTab from "../../../Pods/Pod-Create-NFTMedia-Modal/components/AssistanceNFTMediaTab/AssistanceNFTMediaTab";
import TokenomicsNFTMediaTab from "../../../Pods/Pod-Create-NFTMedia-Modal/components/TokenomicsNFTMediaTab/TokenomicsNFTMediaTab";

import URL from "shared/functions/getURL";
import { updateTask } from "shared/functions/updateTask";
import { SignatureRequestModal } from "shared/ui-kit/Modal/Modals";
import * as API from "shared/services/API";
import AlertMessage from "shared/ui-kit/Alert/AlertMessage";
import { PrimaryButton, Modal } from "shared/ui-kit";

import { editNFTMediaWIPModalStyles } from "./EditNFTMediaWIPModal.styles";

export default function EditNFTMediaWIPModal(props) {
  const userSelector = useSelector((state: RootState) => state.user);
  const classes = editNFTMediaWIPModalStyles();

  //REDUX
  const loggedUser = useTypedSelector(state => state.user);

  //HOOKS
  const [generalAssistanceOrTokenomics, setGeneralAssistanceOrTokenomics] = useState<number>(0);
  const [NFTMedia, setNFTMedia] = useState<any>({});
  const [status, setStatus] = useState<any>("");

  const [photo, setPhoto] = useState<any>(null);
  const [photoImg, setPhotoImg] = useState<any>(null);
  const [tokenPhoto, setTokenPhoto] = useState<any>(null);
  const [tokenPhotoImg, setTokenPhotoImg] = useState<any>(null);

  const [tokenObjList, setTokenObjList] = useState<any[]>([]);

  const [offerAccepted, setOfferAccepted] = useState<boolean>(false);

  const [openSignRequestModal, setOpenSignRequestModal] = useState<boolean>(false);
  const [signRequestModalDetail, setSignRequestModalDetail] = useState<any>(null);

  const isSignedIn = () => {
    return !!sessionStorage.getItem("token");
  };

  useEffect(() => {
    if (NFTMedia && NFTMedia.id && NFTMedia.HasPhoto) {
      setPhotoImg(`${NFTMedia.Url}?${Date.now()}`);
    }
    if (NFTMedia && NFTMedia.id && NFTMedia.HasPhotoToken) {
      setTokenPhotoImg(`${NFTMedia.UrlToken}?${Date.now()}`);
    }
  }, [NFTMedia]);

  useEffect(() => {
    if (props.NFTMedia) {
      let NFTMediaCopy = { ...props.NFTMedia };
      setNFTMedia(NFTMediaCopy);

      if (NFTMediaCopy.Offers && NFTMediaCopy.Offers.length > 0) {
        let offerIndex = NFTMediaCopy.Offers.findIndex(off => off.userId === userSelector.id);
        if (NFTMediaCopy.Offers[offerIndex] && NFTMediaCopy.Offers[offerIndex].status === "accepted") {
          setOfferAccepted(true);
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.NFTMedia]);

  // get token list from backend
  useEffect(() => {
    if (props.open === true) {
      axios.get(`${URL()}/wallet/getCryptosRateAsList`).then(res => {
        const resp = res.data;
        if (resp.success) {
          const tokenObjList: any[] = [];
          const data = resp.data;
          data.forEach(rateObj => {
            tokenObjList.push({ token: rateObj.token, name: rateObj.name });
          });
          setTokenObjList(tokenObjList);
        }
      });
    }
  }, [props.open]);

  const validateNFTMediaInfoCreate = async () => {
    if (NFTMedia.Name.length <= 5) {
      setStatus({
        msg: "Name field invalid. Minimum 5 characters required.",
        key: Math.random(),
        variant: "error",
      });
      return false;
    } else if (NFTMedia.Description.length <= 20) {
      setStatus({
        msg: "Description field invalid. Minimum 20 characters required",
        key: Math.random(),
        variant: "error",
      });
      return false;
    } else if (
      NFTMedia.OpenInvestment &&
      (!NFTMedia.TokenName || NFTMedia.TokenName === "" || NFTMedia.TokenName.length < 5)
    ) {
      setStatus({
        msg: "Token Name field invalid. Minimum 5 characters required.",
        key: Math.random(),
        variant: "error",
      });
      return false;
    } else if (
      NFTMedia.OpenInvestment &&
      (!NFTMedia.TokenSymbol ||
        NFTMedia.TokenSymbol === "" ||
        NFTMedia.TokenSymbol.length < 3 ||
        NFTMedia.TokenSymbol > 6)
    ) {
      setStatus({
        msg: "Token ID field invalid. Between 3 and 6 characters required.",
        key: Math.random(),
        variant: "error",
      });
      return false;
    } else if (NFTMedia.OpenInvestment && (!NFTMedia.TokenDescription || NFTMedia.TokenDescription === "")) {
      setStatus({
        msg: "Token description field invalid",
        key: Math.random(),
        variant: "error",
      });
      return false;
    } else if (NFTMedia.OpenInvestment && (!NFTMedia.FundingToken || NFTMedia.FundingToken === "")) {
      setStatus({
        msg: "Funding Token field invalid",
        key: Math.random(),
        variant: "error",
      });
      return false;
    } else if (NFTMedia.OpenInvestment && (!NFTMedia.TradingSpread || NFTMedia.TradingSpread === "")) {
      setStatus({
        msg: "Trading Spread field invalid",
        key: Math.random(),
        variant: "error",
      });
      return false;
    } else if (
      NFTMedia.OpenInvestment &&
      (!NFTMedia.FundingPrice || NFTMedia.FundingPrice === "" || NFTMedia.FundingPrice === 0)
    ) {
      setStatus({
        msg: "Funding Price field invalid. Value must be greater than 0.",
        key: Math.random(),
        variant: "error",
      });
      return false;
    } else if (NFTMedia.OpenInvestment && (!NFTMedia.MaximumSupply || NFTMedia.MaximumSupply === "")) {
      setStatus({
        msg: "Maximum Supply field invalid",
        key: Math.random(),
        variant: "error",
      });
      return false;
    } else if (
      NFTMedia.OpenInvestment &&
      (!NFTMedia.FundingTargetSupply || NFTMedia.FundingTargetSupply === "")
    ) {
      setStatus({
        msg: "Funding Target Supply field invalid.",
        key: Math.random(),
        variant: "error",
      });
      return false;
    } else if (NFTMedia.OpenInvestment && (!NFTMedia.InvestorShare || NFTMedia.InvestorShare === "")) {
      setStatus({
        msg: "Investor Share field invalid.",
        key: Math.random(),
        variant: "error",
      });
      return false;
    } /*else if (
      NFTMedia.OpenInvestment &&
      (!NFTMedia.DateExpiration || NFTMedia.DateExpiration === "")
    ) {
      setErrorMsg("Date Expiration field invalid.");
      handleClickError();
      return false;
    } */ else if (
      NFTMedia.OpenInvestment &&
      (!NFTMedia.AMM || NFTMedia.AMM === "")
    ) {
      setStatus({
        msg: "AMM field invalid",
        key: Math.random(),
        variant: "error",
      });
      return false;
    } else if (NFTMedia.MaxPrice && (!NFTMedia.MaxPrice || NFTMedia.MaxPrice === "")) {
      setStatus({
        msg: "Maximum Price invalid",
        key: Math.random(),
        variant: "error",
      });
      return false;
    } else return true;
  };

  const handleOpenSignatureModal = () => {
    if (validateNFTMediaInfoCreate()) {
      let details: any = null;
      if (NFTMedia.OpenInvestment) {
        details = (
          <p style={{ fontSize: "14px", marginTop: "0px" }}>
            TokenName: {NFTMedia.TokenName} <br />
            TokenSymbol: {NFTMedia.TokenSymbol} <br />
            IsInvesting: {NFTMedia.OpenInvestment} <br />
            AMM: {NFTMedia.AMM.toUpperCase()} <br />
            Spread: {NFTMedia.TradingSpread / 100} <br />
            FundingTokenPrice: {+NFTMedia.FundingPrice} <br />
            FundingToken: {NFTMedia.FundingToken} <br />
            FundingDate: {Math.trunc(Date.now() / 1000 + 10)} <br />
            FundingTarget: {NFTMedia.FundingTargetSupply} <br />
            InvestorDividend: {NFTMedia.InvestorShare / 100} <br />
            MaxSupply: {+NFTMedia.MaximumSupply} <br />
            DateExpiration: {Math.trunc(NFTMedia.dateExpiration.getTime() / 1000)} <br />
          </p>
        );
      } else {
        details = (
          <p style={{ fontSize: "14px", marginTop: "0px" }}>
            Creator: {userSelector.address} <br />
          </p>
        );
      }
      setSignRequestModalDetail(details);
      setOpenSignRequestModal(true);
    }
  };

  //create NFTMedia function
  const createNFTMedia = async () => {
    let validation = await validateNFTMediaInfoCreate();
    if (validation) {
      // additional info
      const additionalData: any = {};
      additionalData.Creator = userSelector.address;
      additionalData.Name = NFTMedia.Name;
      additionalData.Description = NFTMedia.Description;
      additionalData.OpenAdvertising = NFTMedia.OpenAdvertising;
      additionalData.MainHashtag = NFTMedia.Hashtags.length > 0 ? NFTMedia.Hashtags[0] : "";
      additionalData.Hashtags = NFTMedia.Hashtags;
      additionalData.Creator = userSelector.address;
      // function payload
      let payload: any = {};
      payload.PodInfo = {
        Creator: userSelector.address,
      };
      if (NFTMedia.OpenInvestment) {
        payload.PodInfo = {
          TokenName: NFTMedia.TokenName,
          TokenSymbol: NFTMedia.TokenSymbol,
          IsInvesting: NFTMedia.OpenInvestment,
          AMM: NFTMedia.AMM.toUpperCase(),
          Spread: NFTMedia.TradingSpread / 100,
          FundingTokenPrice: +NFTMedia.FundingPrice,
          FundingToken: NFTMedia.FundingToken,
          FundingDate: Math.trunc(Date.now() / 1000 + 10),
          FundingTarget: NFTMedia.FundingTargetSupply,
          InvestorDividend: NFTMedia.InvestorShare / 100,
          MaxSupply: +NFTMedia.MaximumSupply,
          DateExpiration: Math.trunc(NFTMedia.dateExpiration / 1000),
          // Creator: userSelector.address,
          // MaxPrice: +pod.MaxPrice,
        };
      }
      payload.Medias = [];
      const medias = NFTMedia.Media.filter(m => m.Title !== "");
      if (NFTMedia && NFTMedia.Media && NFTMedia.Media.length > 0) {
        for (let media of medias) {
          let type: string = "";
          if (media.TypeFile === "Audio") {
            type = "AUDIO_TYPE";
          } else if (media.TypeFile === "Video") {
            type = "VIDEO_TYPE";
          } else if (media.TypeFile === "Blog") {
            type = "BLOG_TYPE";
          } else if (media.TypeFile === "Live Audio Streaming") {
            type = "LIVE_AUDIO_TYPE";
          } else if (media.TypeFile === "Live Video Streaming") {
            type = "LIVE_VIDEO_TYPE";
          } else if (media.TypeFile === "Blog Snaps") {
            type = "BLOG_SNAP_TYPE";
          } else if (media.TypeFile === "Digital Art") {
            type = "DIGITAL_ART_TYPE";
          }
          let dateRelease = new Date(media.ReleaseDate);
          const collabs = {};
          for (let collab of media.Collabs) {
            collabs[collab.address] = collab.share / 100;
          }
          payload.Medias.push({
            MediaName: media.Title,
            MediaSymbol: media.Symbol.replace(/\s/g, ""),
            // MediaDescription: media.Description,
            Type: type,
            ReleaseDate: Math.trunc(dateRelease.getTime() / 1000),
            Collabs: collabs,
          });
        }
      }
      const initiatePodRes = await API.initiatePod("initiatePod", payload, additionalData);
      if (initiatePodRes.success) {
        const podId = initiatePodRes.podId;
        if (photo || tokenPhoto) {
          await uploadImage(podId, NFTMedia.TokenSymbol);
        }
        await updateTask(userSelector.id, "Create a Pod");
        setTimeout(() => {
          props.refreshAllProfile();
          props.handleClose();
        }, 1000);
        setStatus({
          msg: "Pod Created!",
          key: Math.random(),
          variant: "success",
        });
      } else {
        setStatus({
          msg: "Error when making the request",
          key: Math.random(),
          variant: "error",
        });
      }
    }
  };

  //save NFTMedia function
  const saveNFTMedia = async () => {
    let validation = await validateNFTMediaInfo();

    if (validation) {
      // constructing body
      let body = { ...NFTMedia }; // copy from NFTMedia
      body.MainHashtag = NFTMedia.Hashtags.length > 0 ? NFTMedia.Hashtags[0] : "";
      body.Creator = loggedUser.id;

      body.HasPhoto = !!(photo || photoImg);

      axios
        .post(`${URL()}/pod/NFT/saveMediaPod`, body)
        .then(async response => {
          const resp = response.data;
          if (resp.success) {
            if (photo || tokenPhoto) {
              await uploadImageWIP(resp.data.nftPodId, NFTMedia.TokenSymbol);
            }
            NFTMedia.directlyUpdate = false;
            setNFTMedia(NFTMedia);
            setTimeout(() => {
              if (props.refreshItem) {
                props.refreshItem();
              }
              props.handleClose();
            }, 1000);
          } else {
            setStatus({
              msg: "Error when making the request",
              key: Math.random(),
              variant: "error",
            });
          }
          setStatus({
            msg: "NFTMedia saved!",
            key: Math.random(),
            variant: "success",
          });
        })
        .catch(error => {
          setStatus({
            msg: "Error when making the request",
            key: Math.random(),
            variant: "error",
          });
        });
    }
  };

  const validateNFTMediaInfo = async () => {
    if (NFTMedia.Name.length <= 5) {
      setStatus({
        msg: "Name field invalid. Minimum 5 characters required.",
        key: Math.random(),
        variant: "error",
      });
      return false;
    } else if (NFTMedia.Description.length <= 20) {
      setStatus({
        msg: "Description field invalid. Minimum 20 characters required",
        key: Math.random(),
        variant: "error",
      });
      return false;
    } else return true;
  };

  //photo functions
  const uploadImage = async (id, tokenSymbol) => {
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
          .post(`${URL()}/mediaPod/changeMediaPodPhoto`, formData, config)
          .then(response => {
            resolve(true);
          })
          .catch(error => {
            console.log(error);

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
            let body = { dimensions: NFTMedia.tokenDimensions ?? NFTMedia.dimensions, id: tokenSymbol };
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

  //MODAL
  return (
    <Modal size="medium" isOpen={props.open} onClose={props.handleClose} showCloseIcon>
      <div className={classes.modalContent} style={{ display: "block", width: "100%" }}>
        <SignatureRequestModal
          open={openSignRequestModal}
          address={userSelector.address}
          transactionFee="0.0000"
          detail={signRequestModalDetail}
          handleOk={createNFTMedia}
          handleClose={() => setOpenSignRequestModal(false)}
        />

        <div className={classes.cardsOptions}>
          <div className={classes.tabHeaderPodMedia}>
            <div
              onClick={() => setGeneralAssistanceOrTokenomics(0)}
              className={
                generalAssistanceOrTokenomics === 0
                  ? classes.tabHeaderPodMediaSelected
                  : classes.tabHeaderPodMediaUnselected
              }
            >
              General
            </div>
            <div className={classes.tabHeaderPodMediaLine} />
          </div>
          <div className={classes.tabHeaderPodMedia}>
            <div
              onClick={() => setGeneralAssistanceOrTokenomics(1)}
              className={
                generalAssistanceOrTokenomics === 1
                  ? classes.tabHeaderPodMediaSelected
                  : classes.tabHeaderPodMediaUnselected
              }
            >
              Media
            </div>
            <div className={classes.tabHeaderPodMediaLine} />
          </div>
          {props.isCreator ? (
            <div className={classes.tabHeaderPodMedia}>
              <div
                onClick={() => setGeneralAssistanceOrTokenomics(2)}
                className={
                  generalAssistanceOrTokenomics === 2
                    ? classes.tabHeaderPodMediaSelected
                    : classes.tabHeaderPodMediaUnselected
                }
              >
                Assistance
              </div>
              <div className={classes.tabHeaderPodMediaLine} />
            </div>
          ) : null}
          {props.isCreator || offerAccepted ? (
            <div className={classes.tabHeaderPodMedia}>
              <div
                onClick={() => setGeneralAssistanceOrTokenomics(4)}
                className={
                  generalAssistanceOrTokenomics === 4
                    ? classes.tabHeaderPodMediaSelected
                    : classes.tabHeaderPodMediaUnselected
                }
              >
                Tokenomics
              </div>
              <div className={classes.tabHeaderPodMediaLine} />
            </div>
          ) : null}
          <div className={classes.tabHeaderPodMedia}>
            <div
              onClick={() => {
                setGeneralAssistanceOrTokenomics(3);
              }}
              className={
                generalAssistanceOrTokenomics === 3
                  ? classes.tabHeaderPodMediaSelected
                  : classes.tabHeaderPodMediaUnselected
              }
            >
              Chat
            </div>
            <div className={classes.tabHeaderPodMediaLine} />
          </div>
        </div>
        {isSignedIn() ? <h2>Pod's Token</h2> : null}
        {NFTMedia ? (
          generalAssistanceOrTokenomics === 0 ? (
            <div style={{ width: "100%" }}>
              <GeneralNFTMediaTab
                pod={NFTMedia}
                setPod={nftMedia => setNFTMedia(nftMedia)}
                setPhoto={setPhoto}
                photo={photo}
                setPhotoImg={setPhotoImg}
                photoImg={photoImg}
                canEdit={props.isCreator}
                isCreator={props.isCreator}
              />
              <div className={classes.flexCenterCenterRow}>
                {isSignedIn() ? (
                  <PrimaryButton size="medium" onClick={() => setGeneralAssistanceOrTokenomics(1)}>
                    Go to Media Tab
                  </PrimaryButton>
                ) : null}
              </div>
            </div>
          ) : generalAssistanceOrTokenomics === 1 ? (
            <div style={{ width: "100%" }}>
              <MediaNFTMediaTab
                pod={NFTMedia}
                setPod={nftMedia => setNFTMedia(nftMedia)}
                handleOpenSignatureModal={handleOpenSignatureModal}
                isCreator={props.isCreator}
              />
            </div>
          ) : generalAssistanceOrTokenomics === 2 && props.isCreator ? (
            <AssistanceNFTMediaTab
              pod={NFTMedia}
              setPod={nftMedia => setNFTMedia(nftMedia)}
              tokenObjList={tokenObjList}
              savePod={saveNFTMedia}
              creation={false}
            />
          ) : generalAssistanceOrTokenomics === 3 ? (
            <>
              <OffersTab
                item={NFTMedia}
                typeItem="NFTMedia"
                setItem={nftMedia => setNFTMedia(nftMedia)}
                tokenObjList={tokenObjList}
                canEdit={props.isCreator}
                saveItem={saveNFTMedia}
                refreshItem={props.refreshNFTMedia}
                refreshAllProfile={() => props.refreshAllProfile()}
              />
            </>
          ) : generalAssistanceOrTokenomics === 4 && (props.isCreator || offerAccepted) ? (
            <TokenomicsNFTMediaTab
              pod={NFTMedia}
              setPod={nftMedia => setNFTMedia(nftMedia)}
              savePod={saveNFTMedia}
              handleOpenSignatureModal={handleOpenSignatureModal}
              isCreator={props.isCreator}
              creation={false}
              setTokenPhoto={setTokenPhoto}
              tokenPhoto={tokenPhoto}
              setTokenPhotoImg={setTokenPhotoImg}
              tokenPhotoImg={tokenPhotoImg}
              tokenObjList={tokenObjList}
            />
          ) : null
        ) : null}

        {status && (
          <AlertMessage
            key={status.key}
            message={status.msg}
            variant={status.variant}
            onClose={() => setStatus(undefined)}
          />
        )}
      </div>
    </Modal>
  );
}
