import React, { useState, useEffect, useRef } from "react";
import { Modal, PrimaryButton, SecondaryButton } from "shared/ui-kit";
import styles from "./index.module.scss";
import { buildJsxFromObject, formatNumber, getMediaImage, handleSetStatus } from "shared/functions/commonFunctions";
import URL from "shared/functions/getURL";
import axios from "axios";
import { useTypedSelector } from "store/reducers/Reducer";
import { useHistory } from "react-router-dom";
import { SignatureRequestModal } from "shared/ui-kit/Modal/Modals";
import { buyFromOffer, IBuySellFromOffer, startMediaAcquisitionVoting } from "shared/services/API";
import ConfirmPayment from "components/legacy/Communities/modals/ConfirmPayment";

type BuyNFTModalProps = {
  open: boolean;
  handleClose: () => void;
  handleRefresh: () => void;
  handleSwitchPlaceOffer: () => void;
  setStatus: React.Dispatch<any>;
  media?: any;
  isFromExchange?: boolean;
};

const BuyNFTModal: React.FunctionComponent<BuyNFTModalProps> = ({
  open,
  handleClose,
  handleRefresh,
  handleSwitchPlaceOffer,
  setStatus,
  media,
  isFromExchange = false,
}) => {
  const history = useHistory();
  const user = useTypedSelector(state => state.user);
  const userBalances = useTypedSelector(state => state.userBalances);
  const [rateOfChange, setRateOfChange] = useState<any>({});

  const payloadRef = useRef<any>({});
  const [openSignRequestModal, setOpenSignRequestModal] = useState<boolean>(false);
  const [signRequestModalDetail, setSignRequestModalDetail] = useState<any>(null);
  const [openConfirmPaymentModal, setOpenConfirmPaymentModal] = useState<boolean>(false);

  const handleNFTPage = () => {
    history.push(`/media/sale/${media.MediaSymbol}`);
  };

  const handleOpenSignatureModal = () => {
    if (validate()) {
      const payload: IBuySellFromOffer = {
        ExchangeId: media.ExchangeData.Id,
        OfferId: media.ExchangeData.Id,
        Address: user.address,
        Amount: media.ExchangeData.InitialAmount,
      }
      payloadRef.current = payload;
      setSignRequestModalDetail(buildJsxFromObject(payload));
      setOpenSignRequestModal(true);
    }
  }

  const handleConfirmSign = async () => {
    try {
      const payload = payloadRef.current;
      if (Object.keys(payload).length) {
        const resp = await buyFromOffer(payload, {});
        if (resp && resp.success) {
          handleSetStatus("Community media offer proposal created", "success", setStatus);
          handleRefresh();
          handleClose();
        }
        else handleSetStatus("Proposal creation failed", "error", setStatus);
      }
    }
    catch (e) {
      handleSetStatus("Purchase failed: " + e, "error", setStatus);
    }
  };

  const payWithCommunity = (communityId) => {
    const body = {
      ProposalCreator: user.address,
      ProposalCreatorId: user.id,
      CommunityId: communityId,
      Proposal: {
        MediaSymbol: media?.MediaSymbol,
        Amount: media.ExchangeData.Price,
        TokenSymbol: media.ExchangeData.OfferToken,
      },
      ProposalType: "MemberCommunityBuying"
    }
    startMediaAcquisitionVoting(body).then(resp => {
      if (resp && resp.success) {
        handleSetStatus("Offer placed successfully", "success", setStatus);
        handleRefresh();
        handleClose();
      }
      else handleSetStatus("Offer placing failed", "error", setStatus);
    })
  }


  const validate = () => {
    if (
      !media ||
      !media.ExchangeData ||
      !media.ExchangeData.Id ||
      !media.ExchangeData.InitialAmount ||
      !media.ExchangeData.OfferToken ||
      !media.ExchangeData.Price
    ) {
      handleSetStatus(`Media exchange data error`, "error", setStatus);
      return false;
    } else if (
      !userBalances[media.ExchangeData.OfferToken] ||
      userBalances[media.ExchangeData.OfferToken].Balance < media.ExchangeData.Price
    ) {
      handleSetStatus(`Media exchange data error`, "error", setStatus);
      return false;
    }
    return true;
  };

  useEffect(() => {
    // get rate of change
    axios.get(`${URL()}/wallet/getCryptosRateAsMap`).then(res => {
      const resp = res.data;
      if (resp.success) {
        setRateOfChange(resp.data);
      }
    });
  }, []);

  return (
    <Modal size="medium" isOpen={open} onClose={handleClose} className={styles.modal} showCloseIcon={true}>
      <SignatureRequestModal
        open={openSignRequestModal}
        address={user.address}
        transactionFee="0.0000"
        detail={signRequestModalDetail}
        handleOk={handleConfirmSign}
        handleClose={() => setOpenSignRequestModal(false)}
      />
      <ConfirmPayment
        open={openConfirmPaymentModal}
        handleClose={() => setOpenConfirmPaymentModal(false)}
        payWithOwnWallet={handleOpenSignatureModal}
        payWithCommunity={payWithCommunity}
      />
      <div className={styles.modalContent}>
        <div className={styles.content}>
          <h2>Buy NFT</h2>
          <div className={styles.nftInfo}>
            <img src={getMediaImage(media)} alt="sale_img" />
            <h2>{media && media.MediaName}</h2>
            <div className={styles.flexCol}>
              <h5>
                {media && media.ExchangeData && !["Sold", "Cancelled"].includes(media.ExchangeData.Status)
                  ? formatNumber(media.ExchangeData.Price, media.ExchangeData.OfferToken, 4)
                  : ""}
              </h5>
              <span>
                {media && media.ExchangeData && !["Sold", "Cancelled"].includes(media.ExchangeData.Status)
                  ? formatNumber(
                    Math.floor(
                      (rateOfChange[media.ExchangeData.OfferToken] ?? 1) * media.ExchangeData.Price
                    ),
                    "$",
                    4
                  )
                  : ""}
              </span>
            </div>
          </div>
          <div className={styles.divider} />
          <p className={styles.nftDesc}>{media && media.MediaDescription}</p>
          <div className={styles.actionButtons}>
            <SecondaryButton
              size="medium"
              onClick={() => {
                if (isFromExchange) handleClose();
                else handleNFTPage();
              }}
            >
              NFT Page
            </SecondaryButton>
            <div>
              <PrimaryButton size="medium" onClick={handleSwitchPlaceOffer}>
                Place a different Offer
              </PrimaryButton>
              {media && media.ExchangeData &&
                media.ExchangeData.Status != "Sold" &&
                media.ExchangeData.Status != "Cancelled" ? (
                <PrimaryButton size="medium" onClick={() => setOpenConfirmPaymentModal(true)}>
                  Buy
                </PrimaryButton>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default BuyNFTModal;
