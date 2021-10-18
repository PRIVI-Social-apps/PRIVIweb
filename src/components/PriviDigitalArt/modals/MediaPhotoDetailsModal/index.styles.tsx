import React from "react";
import { makeStyles } from "@material-ui/core";

export const mediaPhotoDetailsModalStyles = makeStyles(theme => ({
  root: {
    width: '910px !important',
    height: '1595px !important',
    padding: '0px !important',
    position: 'relative'
  },
  detailImg: {
    width: "100%",
    height: "100%",
    cursor: 'pointer',
  },
  exit: {
    display:"flex",
    flexDirection: "row",
    alignItems: "center",
    position: "absolute",
    top: "24px",
    right: "16px",
    cursor: 'pointer'
  }
}));

export const MediaDetailModalCloseIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M2.35019 22.9756L9.18738 16.1384V18.5627C9.18738 19.0802 9.60738 19.5002 10.1249 19.5002C10.6424 19.5002 11.0624 19.0802 11.0624 18.5627V13.8752C11.0624 13.3577 10.6424 12.9377 10.1249 12.9377H5.43738C4.91988 12.9377 4.49988 13.3577 4.49988 13.8752C4.49988 14.3927 4.91988 14.8127 5.43738 14.8127H7.86176L1.02457 21.6499C0.658477 22.016 0.658477 22.6095 1.02457 22.9756C1.34957 23.301 1.85531 23.3371 2.22048 23.084L2.35019 22.9756Z" fill="white"/>
    <path d="M13.875 11.0625H18.5625C19.08 11.0625 19.5 10.6425 19.5 10.125C19.5 9.6075 19.08 9.1875 18.5625 9.1875H16.1381L22.9753 2.35031C23.3414 1.98422 23.3414 1.39078 22.9753 1.02469C22.792 0.841406 22.5525 0.75 22.3125 0.75C22.0725 0.75 21.833 0.841406 21.6497 1.02469L14.8125 7.86188V5.4375C14.8125 4.92 14.3925 4.5 13.875 4.5C13.3575 4.5 12.9375 4.92 12.9375 5.4375V10.125C12.9375 10.6425 13.3575 11.0625 13.875 11.0625Z" fill="white"/>
  </svg>
)

