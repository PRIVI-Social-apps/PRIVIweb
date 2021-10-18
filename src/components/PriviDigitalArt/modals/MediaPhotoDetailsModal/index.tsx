import React from "react";
import { Modal } from "shared/ui-kit";
import Box from 'shared/ui-kit/Box';
import { mediaPhotoDetailsModalStyles, MediaDetailModalCloseIcon } from './index.styles';

export const MediaPhotoDetailsModal = ({
  isOpen,
  onClose,
  imageURL,
}) => {

  const classes = mediaPhotoDetailsModalStyles();

  return (
    <Modal size="medium" isOpen={isOpen} onClose={onClose} showCloseIcon={false} className={classes.root}>
      <Box width="100%" height="100%" borderRadius={16}>
        <img
          src={imageURL}
          className={classes.detailImg}
          width="100%"
        />
        <div className={classes.exit} onClick={onClose}>
          <Box fontSize={14} fontWeight={800} color="#ffffff"  mr={2}>Exit Full Screen Mode</Box>
          <MediaDetailModalCloseIcon/>
        </div>
      </Box>
    </Modal>
  );
};
