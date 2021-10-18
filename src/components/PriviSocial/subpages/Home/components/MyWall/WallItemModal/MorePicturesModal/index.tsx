import React from "react";
import URL from "shared/functions/getURL";

import { makeStyles } from "@material-ui/core";
import Carousel from "react-elastic-carousel";
import { Modal } from "shared/ui-kit";

const useStyles = makeStyles(() => ({
  descriptionImageWallPost: {
    minWidth: 200,
    width: "100%",
    height: 500,
    backgroundColor: "#b1ff00",
  },
}));

export default function MorePicturesModal({ picturesArray, open, onClose }) {
  const classes = useStyles();

  return (
    <Modal isOpen={open} theme="light" size="medium" showCloseIcon onClose={onClose}>
      <Carousel isRTL={false} itemsToShow={1} pagination={true} showArrows={true}>
        {picturesArray.map((item, i) => {
          return (
            <div
              className={classes.descriptionImageWallPost}
              key={i}
              style={{
                backgroundImage: item ? `url(${URL()}/user/wall/getDescriptionPostPhoto/${item})` : "none",
                backgroundRepeat: "no-repeat",
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            ></div>
          );
        })}
      </Carousel>
    </Modal>
  );
}
