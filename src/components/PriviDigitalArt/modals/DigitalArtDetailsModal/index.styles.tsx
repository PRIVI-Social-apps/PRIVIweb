import React from "react";
import { makeStyles } from "@material-ui/core";
import { Color, FontSize, Gradient } from "shared/ui-kit";

export const useStyles = makeStyles(() => ({
  table: {
    marginTop: 24,
    minHeight: 400,
    "& .MuiTableCell-root": {
      fontFamily: "Agrandir"
    },
    "& .MuiTableRow-head": {
      background: Color.GrayInputBackground,
      "& .MuiTableCell-head": {
        border: "none",
        fontSize: FontSize.M,
        color: Color.GrayDark,
      }
    },
  },
  mintGradient: {
    display: "block",
    overflow: "hidden",
    whiteSpace: "nowrap",
    textOverflow: "ellipsis",
    background: Gradient.Mint,
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },
  primaryBtn: {
    background: '#1B1B1B',
    borderRadius: "4px !important"
  },
  transparentBtn: {
    background: "#FFFFFF",
    border: "1px solid #CBCBCB !important",
    borderRadius: "4px !important",
  },
}));

export const ExternalLinkIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
    <path d="M17 0.875012L6.99997 10.875M17 0.875012L17 6.87501M17 0.875012L11 0.875M7 0.875012H1V16.875H17V10.875" stroke="#727F9A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)