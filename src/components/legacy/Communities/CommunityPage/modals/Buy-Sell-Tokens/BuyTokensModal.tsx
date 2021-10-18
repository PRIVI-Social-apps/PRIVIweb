import React, { useEffect, useState } from "react";
import axios from "axios";

import { Dialog } from "@material-ui/core";

import { useTypedSelector } from "store/reducers/Reducer";

import URL from "shared/functions/getURL";
import { signTransaction } from "shared/functions/signTransaction";
import { TokenSelect } from "shared/ui-kit/Select/TokenSelect";
import { LoadingWrapper } from "shared/ui-kit/Hocs";

import "shared/ui-kit/Modal/Modals/Modal.css";
import { PrimaryButton } from "shared/ui-kit";
import InputWithLabelAndTooltip from "shared/ui-kit/InputWithLabelAndTooltip";

const arrowUp = require("assets/icons/arrow_up_white-01.png");
const infoIcon = require("assets/icons/info_icon.png");

export default function BuyTokensModal(props) {
  const user = useTypedSelector(state => state.user);

  const [disableSubmit, setDisableSubmit] = useState<boolean>(false);
  //set to true when we don't want the user to perform certain actions
  //to make sure the data is fully updated before doing anyting

  const [availableFundingBalance, setAvailableFundingBalance] = useState<number>(0);
  const [availableCommunityBalance, setAvailableCommunityBalance] = useState<number>(0);
  const [fundingQuantity, setFundingQuantity] = useState<number>(0);
  const [communityQuantity, setCommunityQuantity] = useState<string>("");

  const [fundingToken, setFundingToken] = useState<string>("");
  const [communityToken, setCommunityToken] = useState<string>("");

  const [tokenObjs, setTokenObjs] = useState<any[]>([
    { token: "ETH", name: "Ethereum" },
    { token: "PRIVI", name: "Privi Coin" },
    { token: "BC", name: "Base Coin" },
    { token: "DC", name: "Data Coin" },
  ]);

  const handleQuantityChange = value => {
    setCommunityQuantity(value);
  };

  const [gasFee, setGasFee] = useState<number>(0);

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [status, setStatus] = React.useState<any>("");
  const [isDataLoading, setIsDataLoading] = useState<boolean>(false);

  // used to get user funding token balance
  const loadUserBalance = async isFunding => {
    setDisableSubmit(true);
    const body = {
      userAddress: user.address,
      token: isFunding ? fundingToken : communityToken,
    };
    setIsDataLoading(true);
    axios
      .post(`${URL()}/wallet/getUserTokenBalance`, body)
      .then(res => {
        const resp = res.data;
        if (resp.success) {
          isFunding
            ? setAvailableFundingBalance(resp.data.toFixed(4))
            : setAvailableCommunityBalance(resp.data.toFixed(4));
        }
        setDisableSubmit(false);
        setIsDataLoading(false);
      })
      .catch(() => {
        setIsDataLoading(false);
      });
  };

  useEffect(() => {
    setFundingToken(props.community.FundingToken);
    axios.get(`${URL()}/wallet/getCryptosRateAsList`).then(res => {
      const resp = res.data;
      if (resp.success) {
        const tokenNamesList: string[] = []; // list of tokenSymbolList
        const tokenObjList: any[] = [];
        const data = resp.data;
        data.forEach(rateObj => {
          tokenObjList.push({ token: rateObj.token, name: rateObj.name });
          tokenNamesList.push(rateObj.name);
        });
        setTokenObjs(tokenObjList);
      } else {
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    loadUserBalance(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fundingToken]);

  useEffect(() => {
    loadUserBalance(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [communityToken]);

  useEffect(() => {
    if (tokenObjs.length > 0) {
      if (fundingToken === "") setFundingToken(tokenObjs[0].token);
    }
    if (tokenObjs.length > 0) {
      if (communityToken === "") setCommunityToken(tokenObjs[0].token);
    }
  }, [tokenObjs]);

  const resetFields = () => {
    setFundingQuantity(0);
    setCommunityQuantity("");
    setStatus("");
  };

  const handleInvest = async () => {
    let values = { communityQuantity };
    let validatedErrors = validate(values);
    setErrors(validatedErrors);

    if (Object.keys(validatedErrors).length === 0) {
      setDisableSubmit(true);
      const body: any = {
        Investor: user.id,
        CommunityAddress: props.community.CommunityAddress,
        Amount: Number(communityQuantity),
      };
      const [hash, signature] = await signTransaction(user.mnemonic, body);
      body.Hash = hash;
      body.Signature = signature;
      axios.post(`${URL()}/community/buyCommunityToken`, body).then(res => {
        const resp = res.data;
        if (resp.success) {
          setStatus({
            msg: "purchase success",
            key: Math.random(),
            variant: "success",
          });
          setDisableSubmit(false);
          setTimeout(() => {
            resetFields();
            loadUserBalance(false);
            props.handleClose();
            props.handleRefresh();
          }, 1000);
        } else {
          setStatus({
            msg: "purchase failed",
            key: Math.random(),
            variant: "error",
          });
          setDisableSubmit(false);
        }
      });
    }
  };

  // get community token to receive in investment each time investing amount changes
  useEffect(() => {
    setDisableSubmit(true);
    const body = {
      communityAddress: props.community.CommunityAddress,
      amount: Number(communityQuantity),
    };
    if (communityQuantity) {
      axios.post(`${URL()}/community/getBuyTokenAmount`, body).then(res => {
        const resp = res.data;
        let newFundingQuantity = NaN;
        if (resp.success) {
          newFundingQuantity = resp.data;
        } else {
        }
        setFundingQuantity(Number(newFundingQuantity.toFixed(4)));
        setDisableSubmit(false);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [communityQuantity]);

  function validate(values: { [key: string]: string }): { [key: string]: string } {
    var errors: { [key: string]: string } = {};

    if (values.communityQuantity === null || !Number(values.communityQuantity)) {
      errors.fundingQuantity = "invalid community token quantity";
    } else if (Number(values.communityQuantity) === 0) {
      errors.fundingQuantity = "community token quantity cant be 0";
    } else if (Number(values.communityQuantity) < 0) {
      errors.fundingQuantity = "community token quantity cant be negative";
    } else if (Number(fundingQuantity) > availableFundingBalance) {
      errors.fundingQuantity = "insufficient fund to invest";
    }
    return errors;
  }

  return (
    <Dialog
      open={props.open}
      onClose={props.handleClose}
      aria-labelledby="simple-modal-title"
      aria-describedby="simple-modal-description"
      className="modal"
      fullWidth
      maxWidth="md"
    >
      <div className="modal-content">
        <div className="exit" onClick={props.handleClose}>
          <img src={require("assets/icons/x_darkblue.png")} alt={"x"} />
        </div>
        <div className="title">
          <h2>{props.modalType === "buy" ? "Buy" : "Sell"} Token</h2>
        </div>
        <LoadingWrapper loading={isDataLoading}>
          <>
            <div
              className="square-container"
              style={{
                width: "100%",
                justifyContent: "space-between",
                background: "none",
                paddingLeft: 0,
                paddingRight: 0,
              }}
            >
              <div className="left-item w9">
                <div className="label">
                  Token
                  <img
                    src={infoIcon}
                    className="infoIconAddLiquidityModal"
                    alt={"add"}
                    style={{ opacity: "0" }}
                  />
                </div>
                <div>
                  <TokenSelect
                    tokens={tokenObjs}
                    value={fundingToken}
                    onChange={e => {
                      setFundingToken(e.target.value);
                    }}
                  />
                </div>
                <div className="balance">{`Available ${availableFundingBalance} ${fundingToken}`}</div>
              </div>

              <div className="right-item w9">
                <InputWithLabelAndTooltip
                  labelName={`Amount`}
                  tooltip={""}
                  inputValue={communityQuantity}
                  type={"text"}
                  onInputValueChange={e => {
                    handleQuantityChange(e.target.value);
                  }}
                />
                {errors.communityQuantity ? <div className="error">{errors.communityQuantity}</div> : null}
              </div>
            </div>
            <div
              style={{ display: "flex", alignItems: "center", justifyContent: "center", marginTop: "8px" }}
            >
              <PrimaryButton
                size="medium"
                onClick={() => {
                  setFundingToken(communityToken);
                  setCommunityToken(fundingToken);
                }}
                disabled={disableSubmit}
                style={{ display: "flex", flexDirection: "row", alignItems: "center" }}
              >
                SWAP TO INVEST
                <img src={arrowUp} alt={"arrow up"} style={{ width: "32px", marginLeft: "8px" }} />
              </PrimaryButton>
            </div>
            <div
              className="square-container square-container-bottom"
              style={{
                width: "100%",
                justifyContent: "space-between",
                background: "none",
                paddingLeft: 0,
                paddingRight: 0,
              }}
            >
              <div className="left-item w9">
                <div className="label">
                  Token
                  <img
                    src={infoIcon}
                    className="infoIconAddLiquidityModal"
                    alt={"add"}
                    style={{ opacity: "0" }}
                  />
                </div>
                <div>
                  <TokenSelect
                    tokens={tokenObjs}
                    value={communityToken}
                    onChange={e => {
                      setCommunityToken(e.target.value);
                    }}
                  />
                </div>
                <div className="balance">{`Available ${availableCommunityBalance} ${communityToken}`}</div>
              </div>

              <div className="right-item w9">
                <InputWithLabelAndTooltip
                  labelName={`Amount`}
                  tooltip={""}
                  inputValue={communityQuantity}
                  type={"text"}
                  style={{ borderRadius: "8px", height: "46px" }}
                />
              </div>
            </div>
            <div
              className="square-container square-container-bottom"
              style={{
                width: "100%",
                justifyContent: "space-between",
                background: "none",
                paddingLeft: 0,
                paddingRight: 0,
              }}
            >
              <div className="right-item w9" style={{ marginTop: "8px", marginRight: "8px" }}>
                <InputWithLabelAndTooltip
                  labelName={`Estimated fee`}
                  tooltip={""}
                  inputValue={`${gasFee}`}
                  type={"text"}
                  style={{ borderRadius: "8px", height: "46px" }}
                  disabled
                />
              </div>

              <div className="right-item w9"></div>
            </div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", marginTop: 30 }}>
              <PrimaryButton
                size="medium"
                onClick={handleInvest}
                disabled={disableSubmit}
              >
                {props.modalType === "buy" ? "Buy" : "Sell"} Token
              </PrimaryButton>
            </div>
          </>
        </LoadingWrapper>
      </div>
    </Dialog>
  );
}
