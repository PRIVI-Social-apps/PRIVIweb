import { FormControl, Modal } from '@material-ui/core';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { getStyledTime } from 'shared/functions/getStyledTime';
import URL from 'shared/functions/getURL';
import InputWithLabelAndTooltip from 'shared/ui-kit/InputWithLabelAndTooltip';
import {
  StyledSelect,
  StyledMenuItem,
} from 'shared/ui-kit/Styled-components/StyledComponents';
import './OfferModal.css';

export default function OfferExchangeModal(props) {
  //hooks
  const [time, setTime] = useState<string>('');
  const [wallet, setWallet] = useState<string>('PRIVI Wallet');
  //token
  const [tokens, setTokens] = useState<any[]>([]);
  const [tokenNames, setTokenNames] = useState<string[]>([]);
  const [tokenName, setTokenName] = useState<string>('');
  const [token, setToken] = useState<string>('');
  const handleChangeTokenSelector = (event) => {
    const value = event.target.value;
    setTokenName(value);
    const t = tokens.find((token) => token.name === value);
    setToken(t.token);
  };
  const [quantity, setQuantity] = useState<string>('');
  const [offerElems, setOfferElems] = useState<Map<string, string>>(
    new Map([])
  );
  const [offerError, setOfferError] = useState<string>('');

  const [totalValue, setTotalValue] = useState<number>(0);
  const [offerValue, setOfferValue] = useState<number>(0);

  const [disableSubmit, setDisableSumbit] = useState<boolean>(false);

  useEffect(() => {
    //get date
    if (props.exchange.DateDue) {
      setTime(
        getStyledTime(
          new Date().getTime(),
          new Date(props.exchange.DateDue).getTime(),
          true
        )
      );
    }
    //load tokens
    loadTokens();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  //functions
  const loadTokens = () => {
    axios.get(`${URL()}/wallet/getCryptosRateAsList`).then((res) => {
      const resp = res.data;
      if (resp.success) {
        const tokenList: any[] = []; // list of tokens
        const tokenNamesList: string[] = []; // list of tokens
        const tokenRatesObj: {} = {}; // tokenRates
        const data = resp.data;
        data.forEach((rateObj) => {
          tokenList.push({ token: rateObj.token, name: rateObj.name });
          tokenNamesList.push(rateObj.name);
          tokenRatesObj[rateObj.token] = rateObj.rate;
        });
        setTokens(tokenList);
        setTokenNames(tokenNamesList); // update token list
        setToken(tokenList[0].token);
        setTokenName(tokenNamesList[0]);
      }
    });
  };

  const handleWalletChange = (wallet) => {
    setWallet(wallet);
    //TODO: change into selected wallet ? i don't know if the name is enough
  };

  //check offer value (before adding it to the offers list) > 0
  const validateOfferElem = (value: string) => {
    let errorMessage: string = '';
    if (!value) {
      errorMessage = 'please enter a valid number';
    } else if (offerElems.get(token)) {
      errorMessage = 'offer with this token already added';
    } else if (Number.parseFloat(value) <= 0) {
      errorMessage = 'offer must be greater than 0';
    }
    return errorMessage;
  };

  //add offer
  const addOfferElem = () => {
    //add offer and update offers list
    let validatedErrors = validateOfferElem(quantity);
    setOfferError(validatedErrors);
    if (validatedErrors.length === 0) {
      const newMap = new Map();
      offerElems.forEach((val, key) => {
        newMap.set(key, val);
      });
      newMap.set(token, quantity);
      setOfferElems(newMap);
      setQuantity('');
    }
  };

  const handleExchange = () => {
    setDisableSumbit(false);
    //TODO: create exchange offer
    setDisableSumbit(true);
  };

  //page components

  return (
    <Modal
      open={props.open}
      onClose={props.handleClose}
      aria-labelledby="simple-modal-title"
      aria-describedby="simple-modal-description"
      className="modal"
    >
      <div className="modal-content white-inputs w50 offer-create-modal">
        <div className="exit" onClick={props.handleClose}>
          <img
            src={require('assets/icons/x_darkblue.png')}
            alt={'x'}
          />
        </div>
        <div className="title">
          <h2>Exchange</h2>
          <div className="select-wallet">
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
        <div className="offer-data">
          <div
            className="image"
            style={{
              backgroundImage:
                props.exchange.Token && props.exchange.Token.length > 0
                  ? `url(${require(`assets/tokenImages/${props.exchange.Token}.png`)})`
                  : 'none',
              backgroundRepeat: 'no-repeat',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          />
          <div className="column">
            <span>TOKEN</span>
            <p>{props.exchange.Token}</p>
          </div>
          <div className="column">
            <span>QUANTITY</span>
            <p>{props.exchange.Quantity}</p>
          </div>
          <div className="column">
            <span>EXCHANGE MODE</span>
            <p>{props.exchange.ExchangeMode}</p>
          </div>
          <div className="column">
            <span>TIME REMAINING</span>
            <p>{time}</p>
          </div>
        </div>
        <div className="input disabled">
          <span>Total value</span>
          <span>{`${totalValue} ${wallet.split(' ')[0]}`}</span>
        </div>
        <div className="flexRowInputs">
          <div>
            <div className="flexRowInputs">
              <div className="infoHeaderCreatePod">Your Offer</div>
              <img
                className="infoIconCreatePod"
                src={require('assets/icons/info_icon.png')}
                alt={'info'}
              />
            </div>
            <div className="flexRowInputs">
              <div className="selector-with-token">
                {token && token.length > 0 ? (
                  <img
                    className="imgSelectorTokenAddLiquidityModal"
                    src={require(`assets/tokenImages/${token}.png`)}
                    alt={token}
                  />
                ) : null}
                <FormControl className="selectorFormControlCreatePod">
                  <StyledSelect
                    disableUnderline
                    value={tokenName}
                    style={{ width: 250 }}
                    className="selectCreatePod"
                    onChange={handleChangeTokenSelector}
                  >
                    {tokenNames.map((item, i) => {
                      return (
                        <StyledMenuItem key={i} value={item}>
                          {item}
                        </StyledMenuItem>
                      );
                    })}
                  </StyledSelect>
                </FormControl>
              </div>
            </div>
          </div>

          <div>
            <InputWithLabelAndTooltip
              labelName="Quantity"
              tooltip={''}
              overriedClasses="input-wrapper"
              placeHolder="0.00"
              type="number"
              minValue={"0"}
              inputValue={quantity}
              onInputValueChange={(v) => setQuantity(v.target.value)}
            />
          </div>

          <div className="smallMarginLeftCreatePod marginTopAddTokensCreatePod">
            <div className="createHashtagButton cursor-pointer" onClick={addOfferElem}>
              <img
                className="createHashtagButtonIcon"
                src={require('assets/icons/plus_white.png')}
                alt={'plus'}
              />
            </div>
          </div>
        </div>
        {offerError.length > 0 ? (
          <div className="error">{offerError}</div>
        ) : null}
        <div className="offers">
          {tokens.map((value) => {
            //display offerElems
            if (offerElems.has(value.token)) {
              return (
                <div key={value.token} className="item-card">
                  <img
                    className="imgSelectorTokenAddLiquidityModal"
                    src={require(`assets/tokenImages/${value.token}.png`)}
                    alt={value.token}
                  />
                  <span>{offerElems.get(value.token)}</span>
                  <span>{value.name}</span>
                  <div
                    className="clickable item-item-card-create-pod"
                    onClick={() => {
                      const newMap = new Map();
                      offerElems.forEach((value: string, key: string) => {
                        newMap.set(key, value);
                      });
                      newMap.delete(value.token);
                      setOfferElems(newMap);
                    }}
                  >
                    ✕
                  </div>
                </div>
              );
            } else return null;
          })}
        </div>
        <div className="footer">
          <div className=" disabled">
            <span>Your offer value</span>
            <span>{`${offerValue} ${wallet.split(' ')[0]}`}</span>
          </div>
          <button onClick={handleExchange} disabled={disableSubmit}>
            Offer exchange
          </button>
        </div>
      </div>
    </Modal>
  );
}
