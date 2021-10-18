import React, { useEffect, useState } from "react";
import { useTypedSelector } from "store/reducers/Reducer";
import axios from "axios";
import URL from "shared/functions/getURL";
import { Dialog } from "@material-ui/core";
import AlertMessage from "shared/ui-kit/Alert/AlertMessage";
import "shared/ui-kit/Modal/Modals/Modal.css";
import { StyledSelect, StyledMenuItem } from "shared/ui-kit/Styled-components/StyledComponents";
import { signTransaction } from "shared/functions/signTransaction";
import InputWithLabelAndTooltip from "shared/ui-kit/InputWithLabelAndTooltip";

const arrowUp = require("assets/icons/arrow_up_white-01.png");
const infoIcon = require("assets/icons/info_icon.png");

export default function SellModal(props) {
  const user = useTypedSelector(state => state.user);

  const [disableSubmit, setDisableSubmit] = useState<boolean>(false);
  //set to true when we don't want the user to perform certain actions
  //to make sure the data is fully updated before doing anyting

  const [wallet, setWallet] = useState<string>("PRIVI Wallet");
  const [availableCommunityBalance, setAvailableCommunityBalance] = useState<number>(0);
  const [communityQuantity, setCommunityQuantity] = useState<string>("");
  const [fundingQuantity, sestFundingQuantity] = useState<number>(0);

  const handleQuantityChange = value => {
    setCommunityQuantity(value);
    sestFundingQuantity(value);
  };

  const [fee, setFee] = useState<number>(0);

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [status, setStatus] = React.useState<any>("");

  // used to get user community token balance
  const loadUserBalance = async () => {
    setDisableSubmit(true);
    const body = {
      userAddress: user.address,
      token: props.community.TokenSymbol,
    };
    axios.post(`${URL()}/wallet/getUserTokenBalance`, body).then(res => {
      const resp = res.data;
      if (resp.success) {
        setAvailableCommunityBalance(resp.data.toFixed(4));
      }
      setDisableSubmit(false);
    });
  };
  useEffect(() => {
    loadUserBalance();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.community]);

  // get funding token to receive in investment each time investing amount changes
  useEffect(() => {
    setDisableSubmit(true);
    const body = {
      communityAddress: props.community.CommunityAddress,
      amount: Number(communityQuantity),
    };
    if (communityQuantity) {
      axios.post(`${URL()}/community/getSellTokenAmount`, body).then(res => {
        const resp = res.data;
        let newFundingTokenQuantity = NaN;
        if (resp.success) {
          newFundingTokenQuantity = resp.data;
        }
        sestFundingQuantity(Number(newFundingTokenQuantity.toFixed(4)));
        setDisableSubmit(false);
      });
    }
    /* eslint-disable react-hooks/exhaustive-deps */
  }, [communityQuantity]);

  const handleWalletChange = wallet => {
    setWallet(wallet);
    //TODO: change into selected wallet ? i don't know if the name is enough
  };

  const resetFields = () => {
    setCommunityQuantity("");
    sestFundingQuantity(0);
    setStatus("");
  };

  const handleSell = async () => {
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
      axios.post(`${URL()}/community/sellCommunityToken`, body).then(res => {
        const resp = res.data;
        if (resp.success) {
          setStatus({
            msg: "sell success",
            key: Math.random(),
            variant: "success",
          });
          setDisableSubmit(false);
          setTimeout(() => {
            resetFields();
            loadUserBalance();
            props.handleClose();
            props.handleRefresh();
          }, 1000);
        } else {
          setStatus({
            msg: "sell failed",
            key: Math.random(),
            variant: "error",
          });
          setDisableSubmit(false);
        }
      });
    }
  };

  function validate(values: { [key: string]: string }): { [key: string]: string } {
    var errors: { [key: string]: string } = {};

    if (values.communityQuantity === null || !Number(values.communityQuantity)) {
      errors.communityQuantity = "invalid communityQuantity";
    } else if (Number(values.communityQuantity) === 0) {
      errors.communityQuantity = "communityQuantity cant be 0";
    } else if (Number(values.communityQuantity) < 0) {
      errors.communityQuantity = "communityQuantity cant be negative";
    } else if (Number(values.communityQuantity) > availableCommunityBalance) {
      errors.communityQuantity = "insufficient community tokens to sell";
    } else if (
      !props.community.InitialSupply ||
      props.community.SupplyReleased - Number(communityQuantity) < props.community.InitialSupply
    ) {
      errors.communityQuantity = `Can't sell more ${props.community.TokenSymbol} than the initial supply`;
    }
    return errors;
  }

  const SquareSellTop = () => {
    return (
      <div className="square-container">
        <div className="left-item w9">
          <div className="label">
            From
            <img src={infoIcon} className="infoIconAddLiquidityModal" alt={"info"} />
          </div>
          <div className="select-wrapper disabled">
            {props.community.HasPhoto ? (
              <img
                src={`src(${props.community.Url}?${Date.now()})`}
                alt={props.community.Name}
              />
            ) : null}
            <InputWithLabelAndTooltip
              type="text"
              inputValue={props.community.TokenSymbol} />
          </div>
          <div className="balance">{`Available ${availableCommunityBalance} ${props.community.TokenSymbol}`}</div>
        </div>

        <div className="right-item w9">
          <InputWithLabelAndTooltip
            labelName="Quantity"
            tooltip={""}
            type="number"
            inputValue={communityQuantity}
            placeHolder="Pod communityQuantity..."
            minValue={"0"}
            onInputValueChange={e => handleQuantityChange(e.target.value)} />
          {errors.communityQuantity ? <div className="error">{errors.communityQuantity}</div> : null}
        </div>
      </div>
    );
  };

  const SquareSellBottom = () => {
    return (
      <div className="square-container square-container-bottom">
        <div className="left-item w9">
          <div className="label">
            To
            <img src={infoIcon} className="infoIconAddLiquidityModal" alt={"info"} />
          </div>
          <div className="select-wrapper disabled">
            <div
              className="img"
              style={{
                backgroundImage: props.community.FundingToken
                  ? `url(${require(`assets/tokenImages/${props.community.FundingToken}.png`)})`
                  : props.community.Token
                    ? `url(${require(`assets/tokenImages/${props.community.Token}.png`)})`
                    : "none",
                backgroundRepeat: "no-repeat",
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            />
            <InputWithLabelAndTooltip
              type="text"
              inputValue={props.community.FundingToken
                ? props.community.FundingToken
                : props.community.Token
                  ? props.community.Token
                  : "Community token"}
              disabled />
          </div>
        </div>

        <div className="right-item w9">
          <InputWithLabelAndTooltip
            type="text"
            labelName="Quantity"
            tooltip={""}
            inputValue={`${isNaN(fundingQuantity) ? 0 : fundingQuantity}`}
            disabled />
        </div>
      </div>
    );
  };

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
          <h2>{`Sell ${props.community.TokenName} Tokens`}</h2>
          <div className="select-wallet">
            <StyledSelect
              disableUnderline
              name="type"
              className="styledWhiteTextSelect"
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

        <SquareSellTop />
        <div className="iconModalSwapDiv">
          <img src={arrowUp} className="plusMiddleIconModalSwap" alt={"arrow up"} />
        </div>
        <SquareSellBottom />

        <div className="footerAddLiquidityModal">
          <div className="firstColFooterAddLiquidityModal">
            <div className="estimateGasFeeAddLiquidityModal">
              <div className="estimateGasFeeLabelAddLiquidityModal">Estimated fee</div>
              <div className="estimateGasFeeValueAddLiquidityModal">{fee}</div>
            </div>
          </div>
          <div className="secondColFooterAddLiquidityModal">
            <button
              className="buttonSubHeaderSwapMain addLiquidityButtonSubHeaderSwapMain"
              onClick={handleSell}
              disabled={disableSubmit}
            >
              Sell
            </button>
          </div>
        </div>
        {status ? <AlertMessage key={status.key} message={status.msg} variant={status.variant} /> : ""}
      </div>
    </Dialog>
  );
}
