import React from 'react';
import axios from 'axios';
import URL from 'shared/functions/getURL';
import { useTypedSelector } from 'store/reducers/Reducer';
import AlertMessage from 'shared/ui-kit/Alert/AlertMessage';
import { Modal } from '@material-ui/core';

import { signTransaction } from "shared/functions/signTransaction";

export default function DeleteOfferModal(props: any) {
  const user = useTypedSelector((state) => state.user);
  const [status, setStatus] = React.useState<any>('');

  const handleDelete = async () => {
    const body: any = {
      RequesterAddress: user.id,
      OrderId: props.offer.offerId,
      PodAddress: props.offer.podAddress,
    };
    const [hash, signature] = await signTransaction(user.mnemonic, body);
    body.Hash = hash;
    body.Signature = signature;
    // important! Sell -> its a BuyingOffer, Buy -> its a Selling offer
    if (props.type === 'Sell') {
      axios.post(`${URL()}/pod/NFT/deleteBuyOrder`, body).then((res) => {
        const resp = res.data;
        if (resp.success) {
          setStatus({
            msg: 'delete success',
            key: Math.random(),
            variant: 'success',
          });
          setTimeout(() => {
            props.handleRefresh();
            props.handleClose();
            setStatus('');
          }, 1000);
        } else {
          setStatus({
            msg: 'delete failed',
            key: Math.random(),
            variant: 'error',
          });
        }
      });
    } else if (props.type === 'Buy') {
      axios.post(`${URL()}/pod/NFT/deleteSellOrder`, body).then((res) => {
        const resp = res.data;
        if (resp.success) {
          setStatus({
            msg: 'delete success',
            key: Math.random(),
            variant: 'success',
          });
          setTimeout(() => {
            props.handleRefresh();
            props.handleClose();
            setStatus('');
          }, 1000);
        } else {
          setStatus({
            msg: 'delete failed',
            key: Math.random(),
            variant: 'error',
          });
        }
      });
    }
  };

  return (
    <Modal
      open={props.open}
      onClose={props.handleClose}
      aria-labelledby="simple-modal-title"
      aria-describedby="simple-modal-description"
      className="modal"
    >
      <div className="modal-content w50">
        <p>Are you sure you want to delete this offer?</p>

        <div className="buttons">
          <button onClick={handleDelete}>Yes</button>
          <button onClick={props.handleClose} className="cancel">
            No
          </button>
        </div>
        {status ? (
          <AlertMessage
            key={status.key}
            message={status.msg}
            variant={status.variant}
          />
        ) : (
            ''
          )}
      </div>
    </Modal>
  );
}
