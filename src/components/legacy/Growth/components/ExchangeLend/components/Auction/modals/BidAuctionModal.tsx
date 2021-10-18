import { Modal } from '@material-ui/core';
import React, { useEffect, useState } from 'react';

export default function BidAuctionModal(props) {
  return (
    <Modal
      open={props.open}
      onClose={props.handleClose}
      aria-labelledby="simple-modal-title"
      aria-describedby="simple-modal-description"
      className="modal modalCreateModal"
    >
      <div className="modal-content issue-modal">
        <div className="exit" onClick={props.handleClose}>
          <img
            src={require('assets/icons/x_darkblue.png')}
            alt={'x'}
          />
        </div>
      </div>
    </Modal>
  );
}
