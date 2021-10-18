import React, { useState, useEffect, useRef } from "react";
import { Modal, PrimaryButton } from "shared/ui-kit";
import { TextField } from "@material-ui/core";
import { TokenSelect } from "shared/ui-kit/Select/TokenSelect";
import styles from "./index.module.scss";
import {formatNumber, getMediaImage, handleSetStatus, buildJsxFromObject} from "shared/functions/commonFunctions";
import URL from "shared/functions/getURL";
import axios from "axios";
import { useTypedSelector } from "store/reducers/Reducer";
import { SignatureRequestModal } from "shared/ui-kit/Modal/Modals";
import { placeBuyingOffer, IPlaceOffer, startMediaAcquisitionVoting } from "shared/services/API";
import ConfirmPayment from "components/legacy/Communities/modals/ConfirmPayment";

type PlaceBuyingOfferModalProps = {
  open: boolean;
  handleClose: () => void;
  handleRefresh: () => void;
  setStatus: React.Dispatch<any>;
  media?: any;
};

const PlaceBuyingOfferModal: React.FunctionComponent<PlaceBuyingOfferModalProps>  = ({open, handleClose, handleRefresh, setStatus, media = null}) => {
  const user = useTypedSelector(state => state.user);
  const userBalances = useTypedSelector(state => state.userBalances);
  const [price, setPrice] = useState<number>(0);
  const [selectedToken, setSelectedToken] = useState<string>('PRIVI');

  const [tokenList, setTokenList] = useState<any[]>([]);
  const [rateOfChange, setRateOfChange] = useState<any>({});

  const payloadRef = useRef<any>({});
  const [openSignRequestModal, setOpenSignRequestModal] = useState<boolean>(false);
  const [signRequestModalDetail, setSignRequestModalDetail] = useState<any>(null);
  const [openConfirmPaymentModal, setOpenConfirmPaymentModal] = useState<boolean>(false);

  useEffect(() => {
    axios.get(`${URL()}/wallet/getCryptosRateAsList`).then(res => {
      const resp = res.data;
      if (resp.success) {
        const data = resp.data;
        const newRateOfChange:any = {};
        const newTokenList:any[] = [];
        data.forEach((obj) => {
          newTokenList.push({name: obj.name, token: obj.token});
          newRateOfChange[obj.token] = obj.rate;
        })
        if (newTokenList.length > 0) setSelectedToken(newTokenList[0].token);
        setRateOfChange(newRateOfChange);
        setTokenList(newTokenList);
      }
    });
  }, []);


  const payWithCommunity = (communityId) => {
    const body = {
      ProposalCreator: user.address,
      ProposalCreatorId: user.id,
      CommunityId: communityId,
      Proposal: {
        MediaSymbol:  media?.MediaSymbol,
        Amount: price.toString(),
        TokenSymbol: selectedToken,
      },
      ProposalType: "MemberCommunityBuyOrder"
    }
    startMediaAcquisitionVoting(body).then(resp => {
      if (resp && resp.success) {
        handleSetStatus("Community media offer proposal created", "success", setStatus);
        handleRefresh();
        handleClose();
      }
      else handleSetStatus("Proposal creation failed", "error", setStatus);
    })
  }

  const handleOpenSignatureModal = () => {
    if (validate()) {
      const payload: IPlaceOffer = {
        ExchangeId: media.ExchangeData.Id,
        Address: user.address,
        Amount: media.ExchangeData.InitialAmount,
        Price: price.toString(),
        OfferToken: selectedToken
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
        const resp = await placeBuyingOffer(payload, {});
        if (resp && resp.success) {
          handleSetStatus("Offer placed successfully", "success", setStatus);
            setTimeout(() => {
              handleRefresh();
              handleClose();
            }, 1000);
        }
        else handleSetStatus("Offer placing failed", "error", setStatus);
      }
    }
    catch (e) {
      handleSetStatus("Offer placing failed: " + e, "error", setStatus);
    }
  };

  const validate = ():boolean => {
    if (!selectedToken) {
      handleSetStatus('No token selected', 'error', setStatus);
      return false;
    } 
    // COULD BE THAT THE USER CHOOSE TO PAY WITH COMMUNITY
    // else if (!userBalances[selectedToken] || userBalances[selectedToken].Balance < price) {
    //   handleSetStatus(`Inssuficient ${selectedToken} balance`, 'error', setStatus);
    //   return false;
    // } 
    else if (!media || !media.ExchangeData || !media.ExchangeData.Id || !media.ExchangeData.InitialAmount) {
      handleSetStatus(`Media exchange data error`, 'error', setStatus);
      return false;
    }
    return true;
  }

  return (
    <Modal
      size="medium"
      isOpen={open}
      onClose={handleClose}
      className={styles.modal}
      showCloseIcon={true}
    >
      <div className={styles.modalContent}>
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
        <div className={styles.content}>
          <h2>Place Buying Offer</h2>
          <div className={styles.nftInfoHeader}>
            <span>Item</span>
            <span>Price</span>
          </div>
          <div className={styles.divider} />
          <div className={styles.nftInfo}>
            <img
              src={getMediaImage(media)}
              alt="sale_img"
            />
            <h2>{media && media.MediaName}</h2>
            <div className={styles.flexCol}>
              <h5>{media && media.ExchangeData && !['Sold', 'Cancelled'].includes(media.ExchangeData.Status)? formatNumber(media.ExchangeData.Price, media.ExchangeData.OfferToken, 4) : ''}</h5>
              <span>
                {media && media.ExchangeData && !['Sold', 'Cancelled'].includes(media.ExchangeData.Status) ? formatNumber(
                      Math.floor((rateOfChange[media.ExchangeData.OfferToken] ?? 1) * media.ExchangeData.Price),
                      "$",
                      4
                    ): ''}
              </span>
            </div>
          </div>
          <div className={styles.divider} />
          <div className={styles.offerInputWrapper}>
            <span>Offer</span>
            <div className={styles.inputPrice}>
              <TextField variant="outlined" size="small" type="number" className={styles.priceInput} value={price}
                onChange={event => {
                  let str: any = event.target.value;
                  setPrice(Number(str));
                }}
              />
            </div>
            <div className={styles.tokenSelect}>
              <TokenSelect value={selectedToken} onChange={(event) => setSelectedToken(event.target.value)} tokens={tokenList}/>
              </div>
          </div>
          <div className={styles.divider} />
          <p className={styles.nftDesc}>
            {media && media.MediaDescription}
          </p>
          <div className={styles.actionButtons}>
            <PrimaryButton size="medium" onClick={() => setOpenConfirmPaymentModal(true)}>
              Place Buying Order
            </PrimaryButton>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default PlaceBuyingOfferModal;
