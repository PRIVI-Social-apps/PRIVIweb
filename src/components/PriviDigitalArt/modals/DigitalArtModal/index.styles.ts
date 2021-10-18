import { makeStyles } from "@material-ui/core";
import { Color } from "shared/ui-kit";

export const digitalArtModalStyles = makeStyles(() => ({
  root: {
    overflow: "visible",
  },
  detailImg: {
    width: 448,
    height: 448,
    borderRadius: 16,
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
    paddingLeft: 16,
    paddingRight: 16,
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
}));
