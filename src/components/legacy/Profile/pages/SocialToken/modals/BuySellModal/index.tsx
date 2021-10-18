import React, { useEffect, useState } from "react";
import cls from "classnames";
import Axios from "axios";

import { createStyles, makeStyles, Grid, FormControl } from "@material-ui/core";

import { Modal, PrimaryButton } from "shared/ui-kit";
import { useTypedSelector } from "store/reducers/Reducer";
import URL from "shared/functions/getURL";
import { useTokenConversion } from "shared/contexts/TokenConversionContext";
import { StyledMenuItem, StyledSelect } from "shared/ui-kit/Styled-components/StyledComponents";
import AlertMessage from "shared/ui-kit/Alert/AlertMessage";
import InputWithLabelAndTooltip from "shared/ui-kit/InputWithLabelAndTooltip";
import Box from 'shared/ui-kit/Box';

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
        color: "#181818",
        margin: "12px 0px 8px",
      },
      "& h5": {
        fontStyle: "normal",
        fontWeight: "normal",
        fontSize: "18px",
        color: "#181818",
        margin: "0px 0px 18px",
      },
      "& label": {
        width: "100%",
        fontStyle: "normal",
        fontWeight: "normal",
        fontSize: "18px",
        display: "flex",
        alignItems: "center",
        color: "#181818",
        marginBottom: "2px",
      },
      "& input": {
        background: "#F7F9FE",
        width: "100%",
        border: "1px solid #E0E4F3",
        boxSizing: "border-box",
        borderRadius: "11.36px",
        color: "#181818",
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
      /*"& .MuiOutlinedInput-notchedOutline": {
        width: "100%",
        border: "2px solid #707582",
        boxSizing: "border-box",
        borderRadius: "10px",
      },*/
      "& button": {
        width: "100%",
      },
    },
    swap: {
      display: "flex",
      alignItems: "center",
      fontStyle: "normal",
      fontWeight: "normal",
      fontSize: "14px",
      lineHeight: "104.5%",
      color: "#181818",
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
        color: "#181818",
        margin: 0,
      },
      "& h5": {
        fontStyle: "normal",
        fontWeight: "normal",
        fontSize: "18px",
        lineHeight: "104.5%",
        textAlign: "right",
        color: "#181818",
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

export default function BuySellModal({ open, handleClose, socialToken, buyOrSell }) {
  //const user = useTypedSelector(state => state.user);
  const userBalances = useTypedSelector(state => state.userBalances);

  //HOOKS
  const { convertTokenToUSD } = useTokenConversion();
  const classes = useStyles();

  const [status, setStatus] = useState<any>();

  const [isbuyOrSell, setIsBuyOrSell] = useState<boolean>(buyOrSell);
  const [stableCoin, setStableCoin] = useState<string>("");
  const [stableCoinAmount, setStableCoinAmount] = useState<string>("");
  const [socialTokenAmount, setSocialTokenAmount] = useState<string>("");
  const [tokensList, setTokensList] = useState<string[]>([]);
  const [stableCoinBalance, setStableCoinBalance] = useState<number>(0);
  const [socialTokenBalance, setSocialTokenBalance] = useState<number>(0);

  const [fee, setFee] = useState<number>(0);

  useEffect(() => {
    if (open && (!tokensList || tokensList.length === 0)) {
      Axios.get(`${URL()}/wallet/getCryptosRateAsList`).then(res => {
        const resp = res.data;
        if (resp.success) {
          const tokenNamesList: string[] = [];
          const data = resp.data;
          data.forEach(rateObj => {
            tokenNamesList.push(rateObj.token);
          });
          setTokensList(tokenNamesList);
          setStableCoin(tokenNamesList[0]);
        }
      });
    }

    if (socialToken && socialToken.TokenSymbol) {
      const config = {
        params: {
          poolAddress: socialToken.PoolAddress,
          amount: stableCoinAmount,
        },
      };
      Axios.get(`${URL()}/social/getSocialTokenAmount`, config)
        .then(res => {
          const resp = res.data;
          if (resp.success) {
            setSocialTokenAmount(resp.data);
          }
        })
        .catch(error => {
          console.error(error);
        });
    }
  }, [open]);

  useEffect(() => {
    //TODO: update fee
    setFee(1);
    if (Object.keys(userBalances).includes(stableCoin) && userBalances[stableCoin].Balance) {
      setStableCoinBalance(userBalances[stableCoin].Balance);
    } else {
      setStableCoinBalance(0);
    }
  }, [stableCoinAmount, stableCoin]);

  useEffect(() => {
    const h = [...socialToken.HoldersInfo] as any[];

    h.sort((a, b) => b.Amount - a.Amount);
    if (h.length > 0) {
      setSocialTokenBalance(Number(h[0].Amount));
    }
  }, [socialToken]);

  const handleBuy = () => {
    //TODO: buy
    setStatus({
      msg: "Social token bought!",
      key: Math.random(),
      variant: "success",
    });
    handleClose();
  };

  const handleSell = () => {
    //TODO: sell
    setStatus({
      msg: "Social token sold!",
      key: Math.random(),
      variant: "success",
    });
    handleClose();
  };

  if (open && socialToken)
    return (
      <Modal className={classes.root} size="medium" isOpen={open} onClose={handleClose} showCloseIcon>
        <div className={classes.content}>
          <h4>{`${isbuyOrSell ? "Buy" : "Sell"} ${socialToken.TokenSymbol}`}</h4>
          {isbuyOrSell ? (
            <StableCoinRow
              stableCoin={stableCoin}
              setStableCoin={setStableCoin}
              stableCoinAmount={stableCoinAmount}
              setStableCoinAmount={setStableCoinAmount}
              tokensList={tokensList}
              stableCoinBalance={stableCoinBalance}
            />
          ) : (
            <SocialTokenRow
              socialToken={socialToken}
              socialTokenAmount={socialTokenAmount}
              setSocialTokenAmount={setSocialTokenAmount}
              socialTokenBalance={socialTokenBalance}
            />
          )}
          <div className={classes.swap} onClick={() => setIsBuyOrSell(!isbuyOrSell)}>
            <button>
              <img src={require("assets/icons/swap_white.png")} alt="swap" />
            </button>
            Swap to <b>{isbuyOrSell ? "sell" : "buy"}</b> instead
          </div>
          {!isbuyOrSell ? (
            <StableCoinRow
              stableCoin={stableCoin}
              setStableCoin={setStableCoin}
              stableCoinAmount={stableCoinAmount}
              setStableCoinAmount={setStableCoinAmount}
              tokensList={tokensList}
              stableCoinBalance={stableCoinBalance}
            />
          ) : (
            <SocialTokenRow
              socialToken={socialToken}
              socialTokenAmount={socialTokenAmount}
              setSocialTokenAmount={setSocialTokenAmount}
              socialTokenBalance={socialTokenBalance}
            />
          )}

          <div className={cls(classes.info, classes.infoFirst)}>
            <h6>Estimated fee</h6>
            <Box display="flex" flexDirection="column" alignItems="flex-end">
              <h5>{`${stableCoin} ${fee}`}</h5>
              <span>(${stableCoin && fee ? convertTokenToUSD(stableCoin, fee) : "N/A"})</span>
            </Box>
          </div>
          <div className={classes.info}>
            <h6>Total</h6>
            <Box display="flex" flexDirection="column" alignItems="flex-end">
              <h5>{`${stableCoin} ${fee + Number(stableCoinAmount) * Number(socialTokenAmount)}`}</h5>
              <span>
                ($
                {stableCoin && fee && stableCoinAmount && socialTokenAmount
                  ? convertTokenToUSD(stableCoin, fee + Number(stableCoinAmount) * Number(socialTokenAmount))
                  : "N/A"}
                )
              </span>
            </Box>
          </div>
          <PrimaryButton onClick={isbuyOrSell ? handleBuy : handleSell} size="medium">
            {isbuyOrSell ? "Buy to Invest" : "Sell Position"}
          </PrimaryButton>
        </div>
        {status && <AlertMessage key={status.key} message={status.msg} variant={status.variant} />}
      </Modal>
    );
  else return null;
}

const StableCoinRow = ({
  stableCoin,
  setStableCoin,
  stableCoinAmount,
  setStableCoinAmount,
  tokensList,
  stableCoinBalance,
}: {
  stableCoin: string;
  setStableCoin: any;
  stableCoinAmount: string;
  setStableCoinAmount: any;
  tokensList: string[];
  stableCoinBalance: number;
}) => {
  const classes = useStyles();
  return (
    <Grid container spacing={2} direction="row">
      <Grid item xs={12} md={6}>
        <label>Trading Token</label>
        <FormControl variant="outlined">
          <StyledSelect
            value={stableCoin}
            onChange={v => {
              setStableCoin(v.target.value);
            }}
            renderValue={() => (
              <div style={{ display: "flex", alignItems: "center" }}>
                {stableCoin && tokensList.some(token => token === stableCoin) && (
                  <img
                    src={require(`assets/tokenImages/${stableCoin}.png`)}
                    style={{ marginRight: 10, width: "24px", height: "24px" }}
                  />
                )}
                {stableCoin}
              </div>
            )}
          >
            {tokensList.map((item, index) => (
              <StyledMenuItem key={index} value={item}>
                {item}
              </StyledMenuItem>
            ))}
          </StyledSelect>
        </FormControl>
        <div className={classes.balance}>{`Avaliable ${stableCoinBalance}`}</div>
      </Grid>
      <Grid item xs={12} md={6}>
        <InputWithLabelAndTooltip
          labelName="Amount"
          required
          type="number"
          inputValue={stableCoinAmount}
          onInputValueChange={e => {
            setStableCoinAmount(e.target.value);
          }}
          minValue="0.01"
          maxValue={stableCoinBalance}
          style={{ marginTop: '0' }}
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
}: {
  socialToken: any;
  socialTokenAmount: string;
  setSocialTokenAmount: any;
  socialTokenBalance: number;
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
            onChange={() => { }}
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
        <InputWithLabelAndTooltip
          labelName="Amount"
          required
          type="number"
          inputValue={socialTokenAmount}
          onInputValueChange={e => {
            setSocialTokenAmount(e.target.value);
          }}
          minValue="0.01"
          maxValue={socialTokenBalance}
          style={{ marginTop: '0' }}
        />
      </Grid>
    </Grid>
  );
};
