import React, { useEffect, useState, useRef } from "react";
import cls from "classnames";
import { createStyles, makeStyles, Grid, FormControl } from "@material-ui/core";
import { Modal, PrimaryButton, Color } from "shared/ui-kit";
import { useTypedSelector } from "store/reducers/Reducer";
import { useTokenConversion } from "shared/contexts/TokenConversionContext";
import { StyledMenuItem, StyledSelect } from "shared/ui-kit/Styled-components/StyledComponents";
import Box from "shared/ui-kit/Box";
import { getBuyTokenAmount, getSellTokenAmount, IBuySellSocialToken, buySocialToken, sellSocialToken } from "shared/services/API";
import { formatNumber, buildJsxFromObject } from "shared/functions/commonFunctions";
import { SignatureRequestModal } from "shared/ui-kit/Modal/Modals";
import { useAlertMessage } from "shared/hooks/useAlertMessage";

const useStyles = makeStyles(() =>
  createStyles({
    root: {
      width: "auto !important",
    },
    content: {
      width: "610px",
      display: "flex",
      flexDirection: "column",
      "& h4": {
        fontStyle: "normal",
        fontWeight: 400,
        fontSize: "22px",
        color: Color.GrayDark,
        margin: "12px 0px 8px",
      },
      "& h5": {
        fontWeight: "normal",
        fontSize: "18px",
        color: Color.GrayDark,
        margin: "0px 0px 18px",
      },
      "& label": {
        width: "100%",
        fontStyle: "normal",
        fontWeight: "normal",
        fontSize: "18px",
        display: "flex",
        alignItems: "center",
        color: Color.GrayDark,
        marginBottom: "2px",
      },
      "& input": {
        background: "#F7F9FE",
        width: "100%",
        border: "1px solid #E0E4F3",
        boxSizing: "border-box",
        borderRadius: "11.36px",
        color: Color.GrayDark,
        padding: "20px 16px 16px",
        height: "56px",
      },
      "& span": {
        fontStyle: "normal",
        fontWeight: "normal",
        fontSize: "14px",
        lineHeight: "104.5%",
        color: "#707582",
      },
      "& .MuiOutlinedInput-notchedOutline": {
        width: "100%",
        border: "2px solid #707582",
        boxSizing: "border-box",
        borderRadius: "10px",
      },
      "& .MuiFormControl-root": {
        width: "100%",
        "& > div": {
          padding: "20px 16px 16px",
          height: "56px",
        },
      },
      "& .MuiInputBase-root.Mui-disabled": {
        color: "inherit",
        border: "2px solid #707582",
        borderRadius: "10px",
        "& .MuiSvgIcon-root": {
          display: "none",
        },
        "& .MuiOutlinedInput-notchedOutline": {
          border: "none",
        },
      },
      "& button": {
        width: "100%",
        background: Color.GrayDark,
        borderRadius: "14.25px",
        height: '56px',
        fontWeight: 700,
        fontSize: '22px'
      },
    },
    swap: {
      display: "flex",
      alignItems: "center",
      fontStyle: "normal",
      fontWeight: "normal",
      fontSize: "14px",
      lineHeight: "104.5%",
      color: Color.GrayDark,
      margin: "20px 0px 30px",
      "& button": {
        marginRight: "14px",
        height: "40px",
        width: "40px",
        padding: "0px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: "50%",
        "& img": {
          height: "16px",
          width: "10px",
        },
      },
      "& b": {
        margin: "0px 8px",
      },
    },

    info: {
      padding: "20px 0px 16px",
      display: "flex",
      width: "100%",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "50px",
      borderTop: "1px solid #1717174d",
      borderBottom: "1px solid #1717174d",
      "& span": {
        lineHeight: "120%",
        textAlign: "right",
      },
      "& h6": {
        fontStyle: "normal",
        fontWeight: "normal",
        fontSize: "14px",
        lineHeight: "104.5%",
        color: Color.GrayDark,
        margin: 0,
      },
      "& h5": {
        fontStyle: "normal",
        fontWeight: "normal",
        fontSize: "18px",
        lineHeight: "104.5%",
        textAlign: "right",
        color: Color.GrayDark,
        margin: "0px 0px 5px",
      },
    },
    infoFirst: {
      borderBottom: "0px",
      marginBottom: "0px",
      marginTop: "26px",
    },

    balance: {
      marginTop: "8px",
      fontSize: "14px",
      color: "#707582",
    },
  })
);

export default function BuySellModal({ open, handleClose, handleRefresh, socialToken, isBuy }) {
  // STORE
  const user = useTypedSelector(state => state.user);
  const userBalances = useTypedSelector(state => state.userBalances);

  // HOOKS
  const { showAlertMessage } = useAlertMessage();
  const { convertTokenToUSD } = useTokenConversion();
  const classes = useStyles();

  const [isBuyOrSell, setIsBuyOrSell] = useState<boolean>(true);
  const [fundingTokenAmount, setFundingTokenAmount] = useState<string>("");
  const [socialTokenAmount, setSocialTokenAmount] = useState<string>("");

  const payloadRef = useRef<any>(null);
  const [openSignRequestModal, setOpenSignRequestModal] = useState<boolean>(false);
  const [signRequestModalDetail, setSignRequestModalDetail] = useState<any>(null);

  const [fee, setFee] = useState<number>(0);

  useEffect(() => {
    setIsBuyOrSell(isBuy);
  }, [isBuy])

  useEffect(() => {
    if (Number(socialTokenAmount) > 0) {
      if (isBuyOrSell) getBuyTokenAmount(socialToken.PoolAddress, socialTokenAmount).then(resp => {
        if (resp?.success) setFundingTokenAmount(resp.data);
      });
      else getSellTokenAmount(socialToken.PoolAddress, socialTokenAmount).then(resp => {
        if (resp?.success) setFundingTokenAmount(resp.data);
      });
    }
    else setFundingTokenAmount("0");
  }, [socialTokenAmount]);

  const handleReset = () => {
    setFundingTokenAmount("");
    setSocialTokenAmount("");
  }

  // TODO: check that the user has enought balance 
  const validate = () => {
    return true;
  }

  const handleOpenSignatureModal = () => {
    if (validate()) {
      const payload: IBuySellSocialToken = {
          "Investor": user.address,
          "PoolAddress": socialToken.PoolAddress,
          "Amount": Number(socialTokenAmount)
        }
      payloadRef.current = payload;
      setSignRequestModalDetail(buildJsxFromObject(payload));
      setOpenSignRequestModal(true);
    }
  }

  const handleBuySell = () => {
    const payload = payloadRef.current;
    if (payload) {
      if (isBuyOrSell) {
        buySocialToken(payload, {}).then(resp => {
          if (resp?.success) {
            showAlertMessage(`Social token successfully bought`, { variant: "success" });
            handleReset();
            handleRefresh();
            handleClose();
          } 
          else showAlertMessage(`Social token purchase failed`, { variant: "error" });
        });
      }
      else {
        sellSocialToken(payload, {}).then(resp => {
          if (resp?.success) {
            showAlertMessage(`Social token successfully sold`, { variant: "success" });
            handleReset();
            handleRefresh();
            handleClose();
          } 
          else showAlertMessage(`Social token selling failed`, { variant: "error" });
        });
      }
    }
  }

  if (open && socialToken)
    return (
      <Modal className={classes.root} size="medium" isOpen={open} showCloseIcon onClose={() => {
        handleReset();
        handleClose();
        }}>
         <SignatureRequestModal
          open={openSignRequestModal}
          address={user.address}
          transactionFee="0.0000"
          detail={signRequestModalDetail}
          handleOk={handleBuySell}
          handleClose={() => setOpenSignRequestModal(false)}
      />
        <div className={classes.content}>
          <h4>{`${isBuyOrSell ? "Buy" : "Sell"} ${socialToken.TokenSymbol}`}</h4>
          {isBuyOrSell ? (
            <FundingTokenRow
              fundingToken={socialToken?.FundingToken ?? ''}
              fundingTokenAmount={fundingTokenAmount}
              setFundingTokenAmount={setFundingTokenAmount}
              fundingTokenBalance={userBalances && userBalances[socialToken?.FundingToken ?? ''] ? userBalances[socialToken?.FundingToken].Balance : 0 }
              disabled={true}
            />
          ) : (
            <SocialTokenRow
              socialToken={socialToken}
              socialTokenAmount={socialTokenAmount}
              setSocialTokenAmount={setSocialTokenAmount}
              socialTokenBalance={userBalances && userBalances[socialToken?.TokenSymbol ?? ''] ? userBalances[socialToken?.TokenSymbol].Balance : 0 }
              disabled={false}
            />
          )}
          <div className={classes.swap} onClick={() => {
            handleReset();
            setIsBuyOrSell(!isBuyOrSell)}}>
            <button>
              <img src={require("assets/icons/swap_white.png")} alt="swap" />
            </button>
            Swap to <b>{isBuyOrSell ? "sell" : "buy"}</b> instead
          </div>
          {!isBuyOrSell ? (
            <FundingTokenRow
              fundingToken={socialToken?.FundingToken ?? ''}
              fundingTokenAmount={fundingTokenAmount}
              setFundingTokenAmount={setFundingTokenAmount}
              fundingTokenBalance={userBalances && userBalances[socialToken?.FundingToken ?? ''] ? userBalances[socialToken?.FundingToken].Balance : 0 }
              disabled={true}
            />
          ) : (
            <SocialTokenRow
              socialToken={socialToken}
              socialTokenAmount={socialTokenAmount}
              setSocialTokenAmount={setSocialTokenAmount}
              socialTokenBalance={userBalances && userBalances[socialToken?.TokenSymbol ?? ''] ? userBalances[socialToken?.TokenSymbol].Balance : 0 }
              disabled={false}
            />
          )}

          <div className={cls(classes.info, classes.infoFirst)}>
            <h6>Estimated fee</h6>
            <Box display="flex" flexDirection="column" alignItems="flex-end">
              <h5>{`${formatNumber(fee, socialToken.FundingToken, 6)}`}</h5>
              <span>{formatNumber(convertTokenToUSD(socialToken.FundingToken, fee), "USD", 2)} </span>
            </Box>
          </div>
          <div className={classes.info}>
            <h6>Total</h6>
            <Box display="flex" flexDirection="column" alignItems="flex-end">
              <h5>{`${formatNumber(fee + Number(fundingTokenAmount), socialToken.FundingToken, 6)}`}</h5>
              <span>{formatNumber(convertTokenToUSD(socialToken.FundingToken, fee + Number(fundingTokenAmount)), "USD", 2)} </span>
            </Box>
          </div>
          <PrimaryButton onClick={handleOpenSignatureModal} size="medium">
            {isBuyOrSell ? "Buy to Invest" : "Sell Position"}
          </PrimaryButton>
        </div>
      </Modal>
    );
  else return null;
}

const FundingTokenRow = ({
  fundingToken,
  fundingTokenAmount,
  setFundingTokenAmount,
  fundingTokenBalance,
  disabled,
}: {
  fundingToken: string;
  fundingTokenAmount: string;
  setFundingTokenAmount: any;
  fundingTokenBalance: number;
  disabled: boolean;
}) => {
  const classes = useStyles();
  return (
    <Grid container spacing={2} direction="row">
      <Grid item xs={12} md={6}>
        <label>Trading Token</label>
        <FormControl variant="outlined">
          <StyledSelect
            value={fundingToken}
            renderValue={() => (
              <div style={{ display: "flex", alignItems: "center" }}>
                <img
                  src={require(`assets/tokenImages/${fundingToken}.png`)}
                  style={{ marginRight: 10, width: "24px", height: "24px" }}
                />
                {fundingToken}
              </div>
            )}
          >
            {[fundingToken].map((item, index) => (
              <StyledMenuItem key={index} value={item}>
                {item}
              </StyledMenuItem>
            ))}
          </StyledSelect>
        </FormControl>
        <div className={classes.balance}>{`Avaliable ${fundingTokenBalance}`}</div>
      </Grid>
      <Grid item xs={12} md={6}>
        <label>Amount</label>
        <input
          type="number"
          required
          value={Number(fundingTokenAmount).toFixed(6)}
          onChange={e => setFundingTokenAmount(e.target.value)}
          min="0.01"
          max={fundingTokenBalance}
          disabled={disabled}
        />
      </Grid>
    </Grid>
  );
};

const SocialTokenRow = ({
  socialToken,
  socialTokenAmount,
  setSocialTokenAmount,
  socialTokenBalance,
  disabled
}: {
  socialToken: any;
  socialTokenAmount: string;
  setSocialTokenAmount: any;
  socialTokenBalance: number;
  disabled: boolean;
}) => {
  const classes = useStyles();
  return (
    <Grid container spacing={2} direction="row">
      <Grid item xs={12} md={6}>
        <label>Social Token</label>
        <FormControl variant="outlined">
          <StyledSelect
            disabled
            value={socialToken.TokenSymbol}
            renderValue={() => (
              <div style={{ display: "flex", alignItems: "center" }}>
                {socialToken.imageURL && socialToken.imageURL != "" && (
                  <img
                    src={socialToken.imageURL}
                    style={{ marginRight: 10, width: "24px", height: "24px" }}
                  />
                )}
                {socialToken.TokenSymbol}
              </div>
            )}
          >
            {[socialToken.TokenSymbol].map((item, index) => (
              <StyledMenuItem key={index} value={item}>
                {item}
              </StyledMenuItem>
            ))}
          </StyledSelect>
        </FormControl>
        <div className={classes.balance}>{`Avaliable ${socialTokenBalance}`}</div>
      </Grid>
      <Grid item xs={12} md={6}>
        <label>Amount</label>
        <input
          type="number"
          required
          value={socialTokenAmount}
          onChange={e => setSocialTokenAmount(e.target.value)}
          min="0.01"
          max={socialTokenBalance}
          disabled={disabled}
        />        
      </Grid>
    </Grid>
  );
};
