import { makeStyles } from "@material-ui/core";

export const buySocialTokenModalStyles = makeStyles(() => ({
  root: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  socialModalContent: {
    backgroundColor: "#ffffff",
    padding: 40,
    width: "50%",
    borderRadius: 16,
    outline: "none",
  },
  closeButton: {
    display: "flex",
    justifyContent: "flex-end",
    cursor: "pointer",
  },
  title: {
    padding: 0,
    width: "100%",
    margin: "16px 0 36px 0",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    "& h2": {
      margin: 0,
      fontSize: 24,
    },
  },
  selectWallet: {
    borderRadius: 16,
    backgroundColor: "black",
    marginLeft: 8,
    padding: 5,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  styledWhiteTextSelect: {
    color: "white",
    paddingLeft: 5,
  },
  iconModalSwapDiv: {
    height: 40,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 100,
  },
  plusMiddleIconModalSwap: {
    borderRadius: "50%",
    width: 56,
    height: 56,
    border: "10px solid white",
  },
  footerAddLiquidityModal: {
    display: "flex",
    justifyContent: "space-between",
    textAlign: "center",
    width: "100%",
    marginTop: 30,
    marginRight: 20,
  },
  firstColFooterAddLiquidityModal: {
    width: "calc(60%)",
    paddingRight: 10,
  },
  secondColFooterAddLiquidityModal: {
    marginLeft: 10,
  },
  estimateGasFeeAddLiquidityModal: {
    height: 50,
    borderRadius: 20,
    border: "1px solid hsla(212, 25%, 60%, 0.3)",
    backgroundColor: "rgba(227, 233, 239, 0.2)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontSize: 14,
    fontWeight: 400,
    color: "rgb(101, 110, 126)",
  },
  estimateGasFeeLabelAddLiquidityModal: {
    width: "calc(50% - 20px)",
    textAlign: "left",
    paddingLeft: 20,
  },
  estimateGasFeeValueAddLiquidityModal: {
    width: "calc(50% - 20px)",
    textAlign: "right",
    paddingRight: 20,
  },
  addLiquidityButtonSubHeaderSwapMain: {
    margin: 0,
  },
  squareContainer: {
    backgroundColor: "rgb(238, 241, 244)",
    borderRadius: 15,
    height: "calc(100px)",
    width: "calc(100%)",
    paddingLeft: 20,
    paddingTop: 8,
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-start",
  },
  infoIconAddLiquidityModal: {
    height: 12,
    width: 12,
    marginBottom: 4,
    marginLeft: 4,
  },
  leftItem: {
    flexGrow: 1,
    marginRight: 10,
  },
  itemDisabled: {
    // border: "1px solid #cfcfcfd3",
  },
  itemLabel: {
    fontSize: 14,
    fontWeight: 400,
    color: "rgb(66, 73, 85)",
    marginBottom: 8,
    marginTop: 6,
  },
  imgSelectorTokenAddLiquidityModal: {
    width: 30,
    height: 30,
    marginLeft: 20,
    marginRight: 20,
  },
  balance: {
    marginTop: 12,
    fontWeight: 400,
    fontSize: 12,
    color: "rgb(66, 73, 85)",
  },
  rightItem: {
    flexGrow: 1,
  },
  rightInputWrapper: {
    // borderRadius: 16,
    // backgroundColor: "white",
    // height: 50,
    // display: "flex",
    // justifyContent: "center",
    // alignItems: "center",
    // paddingLeft: 20,
    // paddingRight: 20,
  },
  squareContainerBottom: {
    backgroundColor: "rgb(238, 241, 244)",
    borderRadius: 15,
    height: "calc(100px)",
    width: "calc(100%)",
    paddingLeft: 20,
    paddingTop: 8,
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-start",
  },
  inputWrapper: {
    padding: "5px 9px",
    borderRadius: 12,
    outline: "none",
  },
}));
