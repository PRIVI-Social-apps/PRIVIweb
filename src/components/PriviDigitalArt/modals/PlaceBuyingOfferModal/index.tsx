import React, { useState, useEffect, useRef } from "react";
import axios from "axios";

import { placeBuyingOfferModalStyles } from "./index.styles";
import { TokenSelect } from "shared/ui-kit/Select/TokenSelect";
import { Modal, PrimaryButton } from "shared/ui-kit";
import { formatNumber, handleSetStatus, buildJsxFromObject } from "shared/functions/commonFunctions";
import URL from "shared/functions/getURL";
import { useTypedSelector } from "store/reducers/Reducer";
import { SignatureRequestModal } from "shared/ui-kit/Modal/Modals";
import { placeBuyingOffer, IPlaceOffer } from "shared/services/API";
import InputWithLabelAndTooltip from "shared/ui-kit/InputWithLabelAndTooltip";
import { BlockchainTokenSelect } from "shared/ui-kit/Select/BlockchainTokenSelect";
import { BlockchainNets } from "shared/constants/constants";

type PlaceBuyingOfferModalProps = {
  open: boolean;
  handleClose: () => void;
  handleRefresh: () => void;
  setStatus: React.Dispatch<any>;
  media?: any;
};

const PlaceBuyingOfferModal: React.FunctionComponent<PlaceBuyingOfferModalProps> = ({
  open,
  handleClose,
  handleRefresh,
  setStatus,
  media = null,
}) => {
  const classes = placeBuyingOfferModalStyles();

  const user = useTypedSelector(state => state.user);
  const userBalances = useTypedSelector(state => state.userBalances);
  const [price, setPrice] = useState<number>(0);
  const [selectedToken, setSelectedToken] = useState<string>("PRIVI");
  const [tokenList, setTokenList] = useState<any[]>([]);
  const [rateOfChange, setRateOfChange] = useState<any>({});

  const payloadRef = useRef<any>({});
  const [openSignRequestModal, setOpenSignRequestModal] = useState<boolean>(false);
  const [signRequestModalDetail, setSignRequestModalDetail] = useState<any>(null);

  const [blockChain, setBlockChain] = useState<any>(BlockchainNets[0].name);

  useEffect(() => {
    axios.get(`${URL()}/wallet/getCryptosRateAsList`).then(res => {
      const resp = res.data;
      if (resp.success) {
        const data = resp.data;
        const newRateOfChange: any = {};
        const newTokenList: any[] = [];
        data.forEach(obj => {
          newTokenList.push({ name: obj.name, token: obj.token });
          newRateOfChange[obj.token] = obj.rate;
        });
        if (newTokenList.length > 0) setSelectedToken(newTokenList[0].token);
        setRateOfChange(newRateOfChange);
        setTokenList(newTokenList);
      }
    });
  }, []);

  const handleOpenSignatureModal = () => {
    if (validate()) {
      const payload: IPlaceOffer = {
        ExchangeId: media.ExchangeData.Id,
        Address: user.address,
        Amount: media.ExchangeData.InitialAmount,
        Price: price.toString(),
        OfferToken: selectedToken,
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
        const resp = await placeBuyingOffer(payload, {});
        if (resp && resp.success) {
          handleSetStatus("Offer placed successfully", "success", setStatus);
          setTimeout(() => {
            handleRefresh();
            handleClose();
          }, 1000);
        } else handleSetStatus("Offer placing failed", "error", setStatus);
      }
    } catch (e) {
      handleSetStatus("Offer placing failed: " + e, "error", setStatus);
    }
  };

  const validate = (): boolean => {
    if (!selectedToken) {
      handleSetStatus("No token selected", "error", setStatus);
      return false;
    } else if (!userBalances[selectedToken] || userBalances[selectedToken].Balance < price) {
      handleSetStatus(`Insufficient ${selectedToken} balance`, "error", setStatus);
      return false;
    } else if (!media || !media.ExchangeData || !media.ExchangeData.Id || !media.ExchangeData.InitialAmount) {
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
          <h2>Place Buying Offer</h2>
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
          </div>
          <div className={classes.divider} />
          <div className={classes.offerInputWrapper}>
            <div className={classes.borderBox} style={{ width: '100%' }}>
              <BlockchainTokenSelect
                network={blockChain}
                setNetwork={setBlockChain}
                BlockchainNets={BlockchainNets}
                isReverse
              />
            </div>
            <div className={classes.inputPrice} style={{ width: '100%', marginLeft: '24px', marginRight: '24px' }}>
              <InputWithLabelAndTooltip
                type="number"
                inputValue={price}
                placeHolder="0.00"
                onInputValueChange={e => setPrice(Number(e.target.value))}
                required
                style={{ marginTop: 0, marginBottom: 0, height: '50px', width: '100%' }}
              />
            </div>
            <div className={classes.tokenSelect} style={{ width: '100%' }}>
              <TokenSelect
                value={selectedToken}
                onChange={event => setSelectedToken(event.target.value)}
                tokens={tokenList}
              />
            </div>
          </div>
          <div className={classes.divider} />
          <p className={classes.nftDesc}>{media && media.MediaDescription}</p>
          <div className={classes.actionButtons}>
            <PrimaryButton size="medium" className={classes.primary} onClick={handleOpenSignatureModal}>
              Place Buying Order
            </PrimaryButton>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default PlaceBuyingOfferModal;
