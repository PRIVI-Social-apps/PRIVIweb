import { Fade, Grid, Tooltip } from "@material-ui/core";
import React from "react";
import "./MediaConditions.css";

const infoIcon = require("assets/icons/info.svg");

const MediaConditions = (props: any) => {
  if (props.media)
    return (
      <div className="modalConditions modal-content">
        <div className="exit" onClick={props.onCloseModal}>
          <img src={require("assets/icons/x_darkblue.png")} alt={"x"} />
        </div>
        <h2>Media Conditions</h2>
        <div className="mediaTermsPaymentRow">
          <h4 className="titlePayment">Payment</h4>
          <div className="option-buttons">
            <button
              className={
                props.media.Payment &&
                props.media.Payment.toUpperCase() === "FREE"
                  ? "selected"
                  : undefined
              }
            >
              Free
            </button>
            <button
              className={
                props.media.Payment &&
                props.media.Payment.toUpperCase() === "FIXED"
                  ? "selected"
                  : undefined
              }
            >
              Fixed
            </button>
            {props.media.Type &&
            (props.media.Type === "LIVE_VIDEO_TYPE" ||
              props.media.Type === "LIVE_AUDIO_TYPE" ||
              props.media.Type === "VIDEO_TYPE" ||
              props.media.Type === "AUDIO_TYPE") ? (
              <button
                className={
                  props.media.Payment &&
                  props.media.Payment.toUpperCase() === "DYNAMIC"
                    ? "selected"
                    : undefined
                }
              >
                Streaming
              </button>
            ) : null}
          </div>
        </div>
        {props.media.Payment &&
        (props.media.Payment.toUpperCase() === "FIXED" ||
          props.media.Payment.toUpperCase() === "DYNAMIC") ? (
          <Grid
            container
            spacing={2}
            direction="row"
            alignItems="flex-end"
            justify="flex-start"
          >
            <Grid item xs={12} sm={6}>
              <div>
                <div className="flexRowInputs">
                  <div className="infoHeaderCreatePod">Token</div>
                  <img
                    className="infoIconCreatePod"
                    src={infoIcon}
                    alt={"info"}
                  />
                </div>
                <div className="selector-with-token">
                  {props.media &&
                  props.media.Token &&
                  props.media.Token !== "" ? (
                    <img
                      className="imgSelectorTokenAddLiquidityModal"
                      src={require(`assets/tokenImages/${
                        props.tokenNameToSymbolMap[props.media.Token]
                          ? props.tokenNameToSymbolMap[props.media.Token] ===
                            "LINK"
                            ? "LNK"
                            : props.tokenNameToSymbolMap[props.media.Token]
                          : props.media.Token === "LINK"
                          ? "LNK"
                          : props.media.Token
                      }.png`)}
                      alt={props.media.Token}
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
                    <span>{props.media.Token}</span>
                  </div>
                </div>
              </div>
            </Grid>
            <Grid item xs={12} sm={6}>
              <div className="flexRowInputs">
                <div className="infoHeaderCreatePod">
                  {props.media.Payment &&
                  props.media.Payment.toUpperCase() === "FIXED"
                    ? "Price"
                    : "Price per second"}
                </div>
                <Tooltip
                  TransitionComponent={Fade}
                  TransitionProps={{ timeout: 600 }}
                  arrow
                  className="tooltipHeaderInfo"
                  title={
                    props.media.Payment &&
                    props.media.Payment.toUpperCase() === "FIXED"
                      ? "Price"
                      : "Price per second"
                  }
                >
                  <img
                    className="infoIconCreatePod"
                    src={infoIcon}
                    alt={"info"}
                  />
                </Tooltip>
              </div>
              {props.media.Payment &&
              props.media.Payment.toUpperCase() === "FIXED" ? (
                <p>{props.media.Price}</p>
              ) : (
                <p>{props.media.PricePerSecond}</p>
              )}
            </Grid>
          </Grid>
        ) : null}

        {(props.media.Type && props.media.Type === "LIVE_VIDEO_TYPE") ||
        props.media.Type === "LIVE_AUDIO_TYPE" ? (
          <div>
            <div className="mediaTermsPaymentRow">
              <h4 className="titlePayment">Record</h4>
              <div className="option-buttons">
                <button
                  className={
                    props.media.Record === true ? "selected" : undefined
                  }
                >
                  On
                </button>
                <button
                  className={
                    props.media.Record === false ? "selected" : undefined
                  }
                >
                  Off
                </button>
              </div>
              {props.media.Record ? (
                <div className="option-buttons" style={{ marginLeft: "px" }}>
                  <button
                    className={
                      props.media.RecordPaymentType.toUpperCase() === "FREE"
                        ? "selected"
                        : undefined
                    }
                  >
                    Free
                  </button>
                  <button
                    className={
                      props.media.RecordPaymentType.toUpperCase() === "FIXED"
                        ? "selected"
                        : undefined
                    }
                  >
                    Fixed
                  </button>
                  <button
                    className={
                      props.media.RecordPaymentType.toUpperCase() ===
                      "DYNAMIC"
                        ? "selected"
                        : undefined
                    }
                  >
                    Streaming
                  </button>
                </div>
              ) : null}
            </div>
            {props.media.Record ? (
              <Grid
                container
                spacing={2}
                direction="row"
                alignItems="flex-start"
                justify="flex-start"
              >
                <Grid item xs={12} sm={6}>
                  <div className="flexRowInputs">
                    <div className="infoHeaderCreatePod">"Record Copies"</div>
                    <Tooltip
                      TransitionComponent={Fade}
                      TransitionProps={{ timeout: 600 }}
                      arrow
                      className="tooltipHeaderInfo"
                      title={"Record Copies"}
                    >
                      <img
                        className="infoIconCreatePod"
                        src={infoIcon}
                        alt={"info"}
                      />
                    </Tooltip>
                  </div>
                  <p>{props.media.RecordCopies}</p>
                  {props.media.RecordPaymentType.toUpperCase() !== "FREE" ? (
                    <div className="flexRowInputs">
                      <div className="infoHeaderCreatePod">"Record Copies"</div>
                      <Tooltip
                        TransitionComponent={Fade}
                        TransitionProps={{ timeout: 600 }}
                        arrow
                        className="tooltipHeaderInfo"
                        title={"Record Copies"}
                      >
                        <img
                          className="infoIconCreatePod"
                          src={infoIcon}
                          alt={"info"}
                        />
                      </Tooltip>
                    </div>
                  ) : null}
                  {props.media.RecordPaymentType.toUpperCase() !== "FREE" ? (
                    <p>{props.media.RecordRoyalty}</p>
                  ) : null}
                </Grid>
                <Grid item xs={12} sm={6}>
                  {props.media.RecordPaymentType.toUpperCase() !== "FREE" ? (
                    <div>
                      <div className="flexRowInputs">
                        <div className="infoHeaderCreatePod">Record Token</div>
                        <img
                          className="infoIconCreatePod"
                          src={infoIcon}
                          alt={"info"}
                        />
                      </div>
                      <div className="selector-with-token">
                        {props.media &&
                        props.media.RecordToken &&
                        props.media.RecordToken !== "" ? (
                          <img
                            className="imgSelectorTokenAddLiquidityModal"
                            src={require(`assets/tokenImages/${
                              props.tokenNameToSymbolMap[
                                props.media.RecordToken
                              ]
                                ? props.tokenNameToSymbolMap[
                                    props.media.RecordToken
                                  ] === "LINK"
                                  ? "LNK"
                                  : props.tokenNameToSymbolMap[
                                      props.media.RecordToken
                                    ]
                                : props.media.RecordToken === "LINK"
                                ? "LNK"
                                : props.media.RecordToken
                            }.png`)}
                            alt={props.media.RecordToken}
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
                          <span>{props.media.RecordToken}</span>
                        </div>
                      </div>
                    </div>
                  ) : null}
                  {props.media.RecordPaymentType.toUpperCase() !== "FREE" ? (
                    <div className="flexRowInputs">
                      <p>
                        {props.media.RecordPaymentType.toUpperCase() === "FIXED"
                          ? "Record Price"
                          : "Record per second"}
                      </p>
                      <Tooltip
                        TransitionComponent={Fade}
                        TransitionProps={{ timeout: 600 }}
                        arrow
                        className="tooltipHeaderInfo"
                        title={
                          props.media.RecordPaymentType.toUpperCase() ===
                          "FIXED"
                            ? "Record Price"
                            : "Record per second"
                        }
                      >
                        <img
                          className="infoIconCreatePod"
                          src={infoIcon}
                          alt={"info"}
                        />
                      </Tooltip>
                    </div>
                  ) : null}
                  {props.media.RecordPaymentType.toUpperCase() === "FIXED" ? (
                    <p>{props.media.RecordPrice}</p>
                  ) : props.media.RecordPaymentType.toUpperCase() ===
                    "DYNAMIC" ? (
                    <p>{props.media.RecordPricePerSecond}</p>
                  ) : null}
                </Grid>
              </Grid>
            ) : null}
          </div>
        ) : null}
        <div className="mediaTermsPaymentRow">
          <h4 className="titlePayment">Exclusive Permissions</h4>
          <div className="option-buttons">
            <button
              className={
                props.media.ExclusivePermissions === true
                  ? "selected"
                  : undefined
              }
            >
              On
            </button>
            <button
              className={
                props.media.ExclusivePermissions === false
                  ? "selected"
                  : undefined
              }
            >
              Off
            </button>
          </div>
        </div>
      </div>
    );
  else return null;
};

export default MediaConditions;
