import React from "react";
import { makeStyles } from "@material-ui/core";
import { Color } from "shared/ui-kit";

export const digitalArtModalStyles = makeStyles(theme => ({
  root: {
    overflow: "visible",
  },
  page: {
    width: "100%",
    height: "100%",
    overflowY: "auto",
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    minHeight: "calc(100vh - 104px)",
    maxHeight: "calc(100vh - 104px)",
    overflowX: "hidden",
    position: "relative",
  },
  content: {
    width: "100%",
    padding: `${theme.spacing(0)}px ${theme.spacing(5)}px ${theme.spacing(5)}px ${theme.spacing(5)}px`,
  },
  detailImg: {
    maxHeight: 448,
    borderRadius: 16,
    cursor: 'pointer',
    objectFit: "cover",
  },
  artist: {
    "& + &": {
      marginLeft: -12,
    },
  },
  rateIcon: {
    marginRight: 4,
    background: Color.Yellow,
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  emptyRateIcon: {
    marginRight: 4,
    width: 12,
    height: 12,
    background: Color.GrayLight,
    border: `1px solid ${Color.GrayLight}`,
    borderRadius: 6,
    boxSizing: "border-box",
  },
  message: {
    height: 64,
    borderRadius: 8,
    backgroundColor: Color.GrayInputBackground,
    "& input": {
      flex: 1,
      border: "none",
      background: "transparent",
      marginLeft: 10,
      marginRight: 10,
    },
    paddingLeft: 8,
    paddingRight: 8,
  },
  accordion: {
    boxShadow: "none",
    "&::before": {
      backgroundColor: "transparent",
    },
    "& .MuiAccordionSummary-root": {
      minHeight: "unset",
      padding: 0,
      "& .MuiAccordionSummary-content": {
        margin: 0,
      },
      "& .MuiAccordionSummary-expandIcon": {
        margin: 0,
        padding: 0,
      },
    },
    "& .MuiAccordionDetails-root": {
      marginTop: 20,
      padding: 0,
      display: "block",
    },
  },
  paper: {},
  creatorName: {
    maxWidth: 124,
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    lineHeight: 1.2,
  },
  followBtn: {
    border: "0.7px solid #CBCBCB !important",
    borderRadius: "4px !important",
    width: "90px !important",
  },
  primaryBtn: {
    background: "#1B1B1B",
    borderRadius: "4px !important",
  },
  transparentBtn: {
    background: "#FFFFFF",
    border: "1px solid #CBCBCB !important",
    borderRadius: "4px !important",
  },
  divider: {
    border: "1px solid #EBEBEB",
    margin: "24px 0px",
  },
  link: {
    cursor: "pointer",
    color: "#999999",
    "&:hover": {
      textDecoration: "underline",
    },
  },
  commentUername: {
    fontSize: 14,
    lineHeight: "120%",
    color: "#181818",
  },
  commentDescription: {
    fontSize: 14,
    lineHeight: '120%',
    color: '#707582',
  },
  graphBox: {
    position: "relative",
  },
  whiteBox: {
    background: "white",
    borderRadius: theme.spacing(1),
    padding: theme.spacing(2),
    position: "absolute",
    top: theme.spacing(1),
    left: theme.spacing(3),
    boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.12)",
  },
  header1: {
    fontSize: "25px",
    fontWeight: 600,
    color: "#2D3047",
  },
  header2: {
    fontSize: "14px",
    color: "#2D3047",
  },
}))


