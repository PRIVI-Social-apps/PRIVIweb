import React, { useState, useEffect } from "react";
import AlertMessage from "shared/ui-kit/Alert/AlertMessage";
import FormControl from "@material-ui/core/FormControl";
import Modal from "@material-ui/core/Modal";
import {
  StyledSelect,
  StyledMenuItem,
} from "shared/ui-kit/Styled-components/StyledComponents";

import URL from "shared/functions/getURL";
import { useTypedSelector } from "store/reducers/Reducer";
import axios from "axios";
import { trackPromise } from "react-promise-tracker";

import { connect } from "react-redux";

import { signTransaction } from "shared/functions/signTransaction";
import { formatNumber } from "shared/functions/commonFunctions";
import InputWithLabelAndTooltip from "shared/ui-kit/InputWithLabelAndTooltip";

const arrowIcon = require("assets/icons/arrow_up_white-01.png");
const infoIcon = require("assets/icons/info_icon.png");

const arePropsEqual = (prevProps, currProps) => {
  return (
    prevProps.tokens === currProps.tokens &&
    prevProps.tokenFrom === currProps.tokenFrom &&
    prevProps.tokenTo === currProps.tokenTo &&
    prevProps.user === currProps.user &&
    prevProps.open === currProps.open
  );
};

const SwapModal = React.memo((props: any) => {
  const userBalances = useTypedSelector((state) => state.userBalances);
  const user = useTypedSelector((state) => state.user);

  const [amountFrom, setAmountFrom] = useState<string>("");
  const [amountTo, setAmountTo] = useState<string>("");

  const [disableSubmit, setDisableSubmit] = useState<boolean>(false);
  const [filteredFromTokens, setFilteredFromTokens] = useState<string[]>([]);
  const [filteredToTokens, setFilteredToTokens] = useState<string[]>([]);

  const [wallet, setWallet] = useState<string>("PRIVI Wallet");
  const [tokenFrom, setTokenFrom] = useState<string>("PRIVI");
  const [tokenTo, setTokenTo] = useState<string>("ETH");
  const [availableFromBalance, setAvailableFromBalance] = useState<number>(0);
  const [availableToBalance, setAvailableToBalance] = useState<number>(0);

  const [rateOfChange, setRateOfChange] = useState<any>({});

  const [gasFee, setGasFee] = useState<number>(0);

  const [errors, setErrors] = useState<any>({});
  const [status, setStatus] = React.useState<any>("");

  const handleWalletChange = (wallet) => {
    setWallet(wallet);
  };

  // initial useEffect
  useEffect(() => {
    if (props.open) {
      axios.get(`${URL()}/wallet/getCryptosRateAsMap`).then((res) => {
        const resp = res.data;
        if (resp.success) {
          setRateOfChange(resp.data);
        }
      });
    }
  }, [props.open]);

  // useEffects triggered when some state changes

  useEffect(() => {
    // when tokenTo == tokenFrom then change tokenFrom to another token
    if (tokenTo === tokenFrom && props.tokens && !props.tokenFrom) {
      let filteredFromList = [...props.tokens];
      filteredFromList = filteredFromList.filter((token) => token !== tokenTo);
      setTokenFrom(filteredFromList.length > 0 ? filteredFromList[0] : "");
    }

    // update available balance corresponding to token from
    let newAvailableBalance = 0;
    if (props.poolBalances && props.poolBalances[tokenTo]) {
      newAvailableBalance = props.poolBalances[tokenTo];
    }
    setAvailableToBalance(newAvailableBalance);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tokenTo, props.poolBalances]);

  useEffect(() => {
    // when tokenTo == tokenFrom then change tokenTo to another token
    if (tokenTo === tokenFrom && props.tokens && !props.tokenFrom) {
      let filteredToList = [...props.tokens];
      filteredToList = filteredToList.filter((token) => token != tokenFrom);
      setTokenTo(filteredToList.length > 0 ? filteredToList[0] : "");
    }
    // update available balance corresponding to token from
    let newAvailableBalance = 0;
    if (userBalances && userBalances[tokenFrom]) {
      newAvailableBalance = userBalances[tokenFrom].Balance;
    }
    setAvailableFromBalance(newAvailableBalance);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tokenFrom, userBalances]);

  // get swap price
  useEffect(() => {
    if (amountFrom && tokenFrom && tokenTo) {
      setDisableSubmit(true);
      const params = {
        params: {
          TokenFrom: tokenFrom,
          TokenTo: tokenTo,
          AmountFrom: Number(amountFrom),
          Rate: Number(
            (rateOfChange[tokenFrom] ?? 1) / (rateOfChange[tokenTo] ?? 1)
          ),
        },
      };
      trackPromise(
        axios.get(`${URL()}/liquidityPool/getSwapPrice`, params).then((res) => {
          const resp = res.data;
          setDisableSubmit(false);
          if (resp.success) {
            setAmountTo(resp.data.Price.toFixed(4));
            setGasFee(resp.data.Fee.toFixed(4));
          }
        })
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [amountFrom, tokenFrom, tokenTo]);

  // initial use effect
  useEffect(() => {
    // three cases: tokenFrom + tokens / tokenFrom + tokenTo / tokens
    if (props.tokenFrom && props.tokenTo) {
      setTokenFrom(props.tokenFrom);
      setTokenTo(props.tokenTo);
    } else if (props.tokenFrom && props.tokens) {
      setTokenFrom(props.tokenFrom);
      let newFilteredToList = [...props.tokens];
      newFilteredToList = newFilteredToList.filter((token) => {
        return token !== props.tokenFrom;
      });
      setTokenTo(newFilteredToList[0]);
      setFilteredToTokens(newFilteredToList);
    } else if (props.tokens) {
      if (props.tokens.length >= 2) {
        setFilteredFromTokens(props.tokens);
        setFilteredToTokens(props.tokens);
        setTokenFrom(props.tokens[0]);
        setTokenTo(props.tokens[1]);
      }
    }
  }, [props.tokens, props.tokenFrom, props.tokenTo]);

  const handleSwap = async () => {
    let values = { amountFrom };
    let validatedErrors = validate(values);
    setErrors(validatedErrors);

    if (Object.keys(validatedErrors).length === 0) {
      const body: any = {
        TraderAddress: user.id,
        TokenFrom: tokenFrom,
        TokenTo: tokenTo,
        AmountFrom: Number(amountFrom),
        Rate: Number(
          (rateOfChange[tokenFrom] ?? 1) / (rateOfChange[tokenTo] ?? 1)
        ),
      };
      const [hash, signature] = await signTransaction(user.mnemonic, body);
      body.Hash = hash;
      body.Signature = signature;
      trackPromise(
        axios
          .post(`${URL()}/liquidityPool/swapCryptoTokens`, body)
          .then((res) => {
            const resp = res.data;
            setDisableSubmit(false);
            if (resp.success) {
              setStatus({
                msg: "swap success",
                key: Math.random(),
                variant: "success",
              });
              setTimeout(() => {
                setAmountFrom("");
                props.handleRefresh();
                props.handleClose();
              }, 1000);
            } else {
              setStatus({
                msg: "swap failed",
                key: Math.random(),
                variant: "error",
              });
            }
          })
      );
    }
  };

  function validate(values: {
    [key: string]: string;
  }): { [key: string]: string } {
    var errors: { [key: string]: string } = {};

    if (values.amount === null || !Number(values.amountFrom)) {
      errors.amountFrom = "invalid amount";
    } else if (Number(values.amountFrom) === 0) {
      errors.amountFrom = "amount cant be 0";
    } else if (Number(values.amountFrom) < 0) {
      errors.amountFrom = "amount cant be negative";
    } else if (Number(values.amountFrom) > availableFromBalance) {
      errors.amountFrom = "insufficient balance to perform this operation";
    }
    return errors;
  }

  return (
    <Modal
      open={props.open}
      onClose={props.handleClose}
      aria-labelledby="simple-modal-title"
      aria-describedby="simple-modal-description"
      className="modal"
    >
      <div className="addLiquiditySwapModal modal-content  w50">
        <div className="exit" onClick={props.handleClose}>
          <img
            src={require("assets/icons/x_darkblue.png")}
            alt={"x"}
          />
        </div>
        <div className="headerAddLiquidityModal">
          <div className="labelHeaderAddLiquidityModal">Swap tokens</div>
          <div className="balancePaperHeaderAddLiquidityModalDiv">
            <div className="balancePaperHeaderAddLiquidityModalDiv">
              <div className="balancePaperHeaderAddLiquidityModal">
                <StyledSelect
                  disableUnderline
                  name="type"
                  value={wallet}
                  onChange={(event: React.ChangeEvent<{ value: unknown }>) =>
                    handleWalletChange(event.target.value as string)
                  }
                  required
                >
                  <StyledMenuItem value="PRIVI Wallet" key={1}>
                    PRIVI Wallet
                  </StyledMenuItem>
                  <StyledMenuItem value="Ethereum Wallet" key={2}>
                    Ethereum Wallet
                  </StyledMenuItem>
                </StyledSelect>
              </div>
            </div>
          </div>
        </div>

        <div className="squareTokenQuantitySwap">
          <div className="tokenColAddLiquidityModal">
            <div className="labelTokenAddLiquidityModal">
              From
              <img
                src={infoIcon}
                className="infoIconAddLiquidityModal"
                alt="info"
              />
            </div>
            <div className="squareTokenAddLiquidityModal">
              {tokenFrom ? (
                <div
                  className="imgSelectorTokenAddLiquidityModal"
                  style={{
                    backgroundImage: tokenFrom
                      ? `url(${require(`assets/tokenImages/${tokenFrom}.png`)})`
                      : "none",
                    backgroundRepeat: "no-repeat",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                />
              ) : null}

              {props.tokenFrom ? (
                <div className="selectorTokenAddLiquidityModal">
                  {tokenFrom}
                </div>
              ) : (
                <div className="selectorTokenAddLiquidityModal">
                  <FormControl>
                    <StyledSelect
                      disableUnderline
                      value={tokenFrom}
                      className="selectTokenAddLiquidityModal"
                      onChange={(event) => {
                        const value: any = event.target.value;
                        setTokenFrom(value);
                      }}
                    >
                      {filteredFromTokens.map((item, i) => {
                        return (
                          <StyledMenuItem key={i} value={item}>
                            {item}
                          </StyledMenuItem>
                        );
                      })}
                    </StyledSelect>
                  </FormControl>
                </div>
              )}
            </div>
            {
              <div className="commentAddLiquidityModal">{`Available: ${formatNumber(
                availableFromBalance,
                tokenFrom,
                4
              )}`}</div>
            }
          </div>
          <div className="quantityColAddLiquidityModal">
            <div className="labelTokenAddLiquidityModal">
              Quantity
              <img
                src={infoIcon}
                className="infoIconAddLiquidityModal"
                alt="info"
              />
            </div>
            <div className="squareQuantityAddLiquidityModal">
              <InputWithLabelAndTooltip
                overriedClasses="inputQualityAddLiquidityModal"
                disabled={false}
                inputValue={amountFrom}
                placeHolder="Token quantity..."
                type="number"
                minValue="0"
                onInputValueChange={(elem) => {
                  setAmountFrom(elem.target.value);
                }}
                required
              />
            </div>
            {errors.amountFrom ? (
              <div className="error">{errors.amountFrom}</div>
            ) : null}
          </div>
        </div>

        <div className="iconModalSwapDiv">
          <img
            src={arrowIcon}
            className="plusMiddleIconModalSwap"
            alt="arrow"
          />
        </div>

        <div className="squareTokenQuantitySwap">
          <div className="tokenColAddLiquidityModal">
            <div className="labelTokenAddLiquidityModal">
              To
              <img
                src={infoIcon}
                className="infoIconAddLiquidityModal"
                alt="info"
              />
            </div>
            <div className="squareTokenAddLiquidityModal">
              {tokenTo ? (
                <div
                  className="imgSelectorTokenAddLiquidityModal"
                  style={{
                    backgroundImage: tokenTo
                      ? `url(${require(`assets/tokenImages/${tokenTo}.png`)})`
                      : "none",
                    backgroundRepeat: "no-repeat",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                />
              ) : null}

              {props.tokenTo ? (
                <div className="selectorTokenAddLiquidityModal">{tokenTo}</div>
              ) : (
                <div className="selectorTokenAddLiquidityModal">
                  <FormControl>
                    <StyledSelect
                      disableUnderline
                      value={tokenTo}
                      className="selectTokenAddLiquidityModal"
                      onChange={(event) => {
                        const value: any = event.target.value;
                        setTokenTo(value);
                      }}
                    >
                      {filteredToTokens.map((item, i) => {
                        return (
                          <StyledMenuItem key={i} value={item}>
                            {item}
                          </StyledMenuItem>
                        );
                      })}
                    </StyledSelect>
                  </FormControl>
                </div>
              )}
            </div>

            <div className="commentAddLiquidityModal">{`Pool Available: ${formatNumber(
              availableToBalance,
              tokenTo,
              4
            )}`}</div>
          </div>
          <div className="quantityColAddLiquidityModal">
            <div className="labelTokenAddLiquidityModal">
              Quantity
              <img
                src={infoIcon}
                className="infoIconAddLiquidityModal"
                alt="info"
              />
            </div>
            <div className="squareQuantityAddLiquidityModal">
              <InputWithLabelAndTooltip
                overriedClasses="inputQualityAddLiquidityModal"
                disabled={true}
                inputValue={amountTo}
                placeHolder="Token quantity..."
                type="number"
                minValue="0"
                onInputValueChange={(elem) => {
                  setAmountFrom(elem.target.value);
                }}
                required
              />
            </div>
          </div>
        </div>

        <div className="footerAddLiquidityModal">
          <div className="firstColFooterAddLiquidityModal">
            <div className="estimateGasFeeAddLiquidityModal">
              <div className="estimateGasFeeLabelAddLiquidityModal">
                Estimated Gas fee
              </div>
              <div className="estimateGasFeeValueAddLiquidityModal">
                {formatNumber(Number(gasFee), tokenTo, 4)}
              </div>
            </div>
          </div>
          <div className="secondColFooterAddLiquidityModal">
            <button
              className="buttonSubHeaderSwapMain addLiquidityButtonSubHeaderSwapMain"
              onClick={handleSwap}
              disabled={disableSubmit}
            >
              Swap
            </button>
          </div>
        </div>
        {status ? (
          <AlertMessage
            key={status.key}
            message={status.msg}
            variant={status.variant}
          />
        ) : null}
      </div>
    </Modal>
  );
}, arePropsEqual);

const mapStateToProps = (state) => {
  return {
    user: state.user,
    userBalances: state.userBalances,
  };
};

export default connect(mapStateToProps)(SwapModal);
