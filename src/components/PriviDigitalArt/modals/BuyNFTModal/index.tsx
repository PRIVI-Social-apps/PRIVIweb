import React, { useState, useRef } from "react";
import { useHistory } from "react-router-dom";

import { buyNFTModalStyles } from "./index.styles";
import { Modal, PrimaryButton, SecondaryButton } from "shared/ui-kit";
import { buildJsxFromObject, handleSetStatus } from "shared/functions/commonFunctions";
import { useTypedSelector } from "store/reducers/Reducer";
import { useTokenConversion } from "shared/contexts/TokenConversionContext";
import { SignatureRequestModal } from "shared/ui-kit/Modal/Modals";
import { buyFromOffer, IBuySellFromOffer } from "shared/services/API";

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
  const classes = buyNFTModalStyles();

  const history = useHistory();
  const user = useTypedSelector(state => state.user);
  const userBalances = useTypedSelector(state => state.userBalances);
  const { convertTokenToUSD } = useTokenConversion();

  const payloadRef = useRef<any>({});
  const [openSignRequestModal, setOpenSignRequestModal] = useState<boolean>(false);
  const [signRequestModalDetail, setSignRequestModalDetail] = useState<any>(null);

  const handleNFTPage = () => {
    history.push(`/media/sale/${media.MediaSymbol ?? media.id}`);
  };

  const handleOpenSignatureModal = () => {
    if (validate()) {
      const payload: IBuySellFromOffer = {
        ExchangeId: media.ExchangeData.Id,
        OfferId: media.ExchangeData.Id,
        Address: user.address,
        Amount: media.ExchangeData.InitialAmount,
      };
      payloadRef.current = payload;
      setSignRequestModalDetail(buildJsxFromObject(payload));
      setOpenSignRequestModal(true);
    }
  };

  const handleConfirmSign = async () => {
    try {
      const payload = payloadRef.current;
      if (Object.keys(payload).length) {
        const resp = await buyFromOffer(payload, {});
        if (resp && resp.success) {
          handleSetStatus("Purchased successfully", "success", setStatus);
          setTimeout(() => {
            handleRefresh();
            handleClose();
          }, 1000);
        } else handleSetStatus("Purchase failed", "error", setStatus);
      }
    } catch (e) {
      handleSetStatus("Purchase failed: " + e, "error", setStatus);
    }
  };

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

  return (
    <Modal size="medium" isOpen={open} onClose={handleClose} className={classes.modal} showCloseIcon={true}>
      <SignatureRequestModal
        open={openSignRequestModal}
        address={user.address}
        transactionFee="0.0000"
        detail={signRequestModalDetail}
        handleOk={handleConfirmSign}
        handleClose={() => setOpenSignRequestModal(false)}
      />
      <div className={classes.modalContent}>
        <div className={classes.content}>
          <h2>Buy NFT</h2>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <div>
              <h3>Item</h3>
              <div className={classes.nftInfo}>
                <img src={media.Type === "VIDEO_TYPE" ? media.UrlMainPhoto : media.Url} />
                <h2>{media && media.MediaName}</h2>
              </div>
            </div>
            <div>
              <h3>Price</h3>
              <div className={classes.flexCol}>
                <h5>
                  {media && media.ExchangeData && !["Sold", "Cancelled"].includes(media.ExchangeData.Status)
                    ? `${convertTokenToUSD(
                      media.ExchangeData.OfferToken,
                      media.ExchangeData.Price
                    ).toFixed()}`
                    : ""}
                </h5>
                <div>
                  {media && media.ExchangeData && !["Sold", "Cancelled"].includes(media.ExchangeData.Status)
                    ? `$${convertTokenToUSD(media.ExchangeData.OfferToken, media.ExchangeData.Price).toFixed(
                      4
                    )}`
                    : ""}
                </div>
              </div>
            </div>
          </div>
          <div className={classes.divider} />
          <p className={classes.nftDesc}>{media && media.MediaDescription}</p>
          <div className={classes.actionButtons}>
            <SecondaryButton
              size="medium"
              className={classes.secondary}
              onClick={() => {
                if (isFromExchange) handleClose();
                else handleNFTPage();
              }}
            >
              NFT Page
            </SecondaryButton>
            <div>
              <PrimaryButton size="medium" onClick={handleSwitchPlaceOffer} className={classes.primary}>
                Place a different Offer
              </PrimaryButton>
              {media &&
                media.ExchangeData &&
                media.ExchangeData.Status != "Sold" &&
                media.ExchangeData.Status != "Cancelled" ? (
                <PrimaryButton size="medium" onClick={handleOpenSignatureModal} className={classes.primary}>
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
