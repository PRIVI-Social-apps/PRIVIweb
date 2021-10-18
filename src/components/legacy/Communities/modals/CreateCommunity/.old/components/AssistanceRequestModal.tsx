import React, { useEffect, useState } from "react";
import DateFnsUtils from "@date-io/date-fns";

import Grid from "@material-ui/core/Grid";
import { Fade, Modal, Tooltip } from "@material-ui/core";
import FormControl from "@material-ui/core/FormControl";
import { KeyboardDatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import { StyledSelect, StyledMenuItem } from "shared/ui-kit/Styled-components/StyledComponents";
import AlertMessage from "shared/ui-kit/AlertMessage";
import InputWithLabelAndTooltip from "shared/ui-kit/InputWithLabelAndTooltip";

const infoIcon = require("assets/icons/info_icon.png");
const calendarIcon = require("assets/icons/calendar_icon.png");

export default function AssistanceRequestModal(props) {
  const [offerObj, setOfferObj] = useState<any>({
    token: "",
    amount: 0,
    paymentDate: new Date().setDate(new Date().getDate() + 1),
    userId: props.user.id,
    user: { firstName: props.user.firstName, imageUrl: props.user.imageUrl }, //extra info to display user
  });

  const [tokenName, setTokenName] = useState<string>("PRIVI");
  const [tokenNameList, setTokenNameList] = useState<string[]>([
    "Balancer",
    "Privi Coin",
    "Base Coin",
    "Data Coin",
  ]);
  const [tokenNameToSymbolMap, setTokenNameToSymbolMap] = useState<{
    [key: string]: string;
  }>({
    Balancer: "BAL",
    "Privi Coin": "PRIVI",
    "Base Coin": "BC",
    "Data Coin": "DC",
  });

  const handlePaymentDateChange = (elem: any) => {
    let offerCopy = { ...offerObj };
    offerCopy.paymentDate = new Date(elem);
    setOfferObj(offerCopy);
  };

  const [status, setStatus] = useState<any>();

  useEffect(() => {
    if (props.tokenObjList && props.tokenObjList.length > 0) {
      const newTokenNameList: string[] = [];
      const newTokenNameSymbolMap: { [key: string]: string } = {};
      props.tokenObjList.forEach(tokenObj => {
        newTokenNameList.push(tokenObj.name);
        newTokenNameSymbolMap[tokenObj.name] = tokenObj.token;
      });
      setTokenNameList(newTokenNameList);
      setTokenNameToSymbolMap(newTokenNameSymbolMap);
      setTokenName(newTokenNameList[0]);
      const offerCopy = { ...offerObj };
      offerCopy.token = newTokenNameSymbolMap[newTokenNameList[0]];
      setOfferObj(offerCopy);
    }
  }, [props.tokenObjList]);

  const validateInfo = () => {
    if (!offerObj.token || offerObj.token === "") {
      setStatus({
        msg: "Token field invalid. Please select a value.",
        key: Math.random(),
        variant: "error",
      });
      return false;
    } else if (!offerObj.amount || offerObj.amount <= 0) {
      setStatus({
        msg: "Amount field invalid. Value should be higher than 0",
        key: Math.random(),
        variant: "error",
      });
      return false;
    } else if (
      !(
        new Date(offerObj.paymentDate).getTime() ||
        new Date(offerObj.paymentDate).getTime() === 0 ||
        new Date(offerObj.paymentDate).getTime() <= new Date().getTime()
      )
    ) {
      setStatus({
        msg: "Payment date field invalid. Date should be at least a day after today",
        key: Math.random(),
        variant: "error",
      });
      return false;
    } else return true;
  };

  const handleRequest = () => {
    if (validateInfo()) {
      props.addOffer(offerObj);
      props.handleClose();
    }
  };

  return (
    <Modal
      open={props.open}
      onClose={props.handleClose}
      aria-labelledby="simple-modal-title"
      aria-describedby="simple-modal-description"
      className="modal"
    >
      <div className="modal-content w50 assistance-modal">
        <div className="exit" onClick={props.handleClose}>
          <img src={require("assets/icons/x_darkblue.png")} alt={"x"} />
        </div>
        <h4>
          Assistance Offer
          <Tooltip
            TransitionComponent={Fade}
            TransitionProps={{ timeout: 600 }}
            arrow
            className="tooltipHeaderInfo"
            title={``}
          >
            <img className="infoIconCreateCommunity" src={infoIcon} alt={"info"} />
          </Tooltip>
        </h4>
        <Grid container spacing={5} direction="row" alignItems="flex-start" justify="flex-start">
          <Grid item xs={12} md={6}>
            <div className="flexRowInputs">
              <div className="infoHeaderCreateCommunity">User</div>
            </div>
            <div className="disabled">
              <div
                className="user-image"
                style={{
                  backgroundImage: `url(${offerObj.user.imageUrl})`,
                  backgroundRepeat: "no-repeat",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  cursor: "pointer",
                }}
              />
              <p>{offerObj.user.firstName}</p>
            </div>

            <div className="flexRowInputs">
              <div className="infoHeaderCreateCommunity">Token</div>
              <img className="infoIconCreateCommunity" src={infoIcon} alt={"info"} />
            </div>
            <div className="selector-with-token">
              {offerObj.token && offerObj.token.length > 0 ? (
                <img
                  className="imgSelectorTokenAddLiquidityModal"
                  src={require(`assets/tokenImages/${offerObj.token}.png`)}
                  alt={offerObj.token}
                />
              ) : (
                <div
                  style={{
                    width: 30,
                    height: 30,
                    borderRadius: 15,
                    backgroundColor: "656e7e",
                    margin: "0px 10px",
                  }}
                />
              )}
              <div>
                <FormControl className="selectorFormControlCreatePod">
                  <StyledSelect
                    disableUnderline
                    value={tokenName}
                    className="selectCreatePod"
                    onChange={e => {
                      const selectedName: any = e.target.value;
                      const offerObjCopy = { ...offerObj };
                      offerObjCopy.token = tokenNameToSymbolMap[selectedName];
                      setOfferObj(offerObjCopy);
                      setTokenName(selectedName);
                    }}
                  >
                    {tokenNameList.map((item, i) => {
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
          </Grid>
          <Grid item xs={12} md={6}>
            <InputWithLabelAndTooltip
              labelName="Amount"
              tooltip={""}
              type="number"
              inputValue={offerObj.amount}
              placeHolder="0"
              minValue={"0.01"}
              onInputValueChange={e => {
                let offerCopy = { ...offerObj };
                offerCopy.amount = e.target.value;
                setOfferObj(offerCopy);
              }} />
            <div className="flexRowInputs">
              <div className="infoHeaderCreateCommunity">Payment date</div>
              <Tooltip
                TransitionComponent={Fade}
                TransitionProps={{ timeout: 600 }}
                arrow
                className="tooltipHeaderInfo"
                title={""}
              >
                <img className="infoIconCreateCommunity" src={infoIcon} alt={"info"} />
              </Tooltip>
            </div>
            <div
              className="textFieldCreateCommunity"
              style={{
                paddingTop: "1px",
                paddingBottom: "1px",
              }}
            >
              <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <KeyboardDatePicker
                  id="date-picker-expiration-date"
                  minDate={new Date().setDate(new Date().getDate() + 1)}
                  format="MM.dd.yyyy"
                  placeholder="Select date..."
                  value={offerObj.paymentDate}
                  onChange={handlePaymentDateChange}
                  keyboardIcon={<img className="iconCalendarCreatePod" src={calendarIcon} alt={"calendar"} />}
                />
              </MuiPickersUtilsProvider>
            </div>
          </Grid>
        </Grid>
        <button onClick={handleRequest}>Request</button>
        {status && (
          <AlertMessage
            key={status.key}
            message={status.msg}
            variant={status.variant}
            onClose={() => setStatus(undefined)}
          />
        )}
      </div>
    </Modal>
  );
}
