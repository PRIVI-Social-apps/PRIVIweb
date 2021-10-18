import { Fade, Tooltip } from '@material-ui/core';
import React from 'react';
import "./RenderInputWithTooltip.css";

const RenderInputWithTooltip = (props) => {
  const infoIcon = require("assets/icons/info.svg");

  return (
    <div
      className={props.class}
      style={
        props.width === -1
          ? {
            width: "100%",
          }
          : {}
      }
    >
      <div className="flexRowInputs">
        <div className="infoHeaderCreatePod">{props.name}</div>
        {props.info && props.info.length > 0 ? (
          <Tooltip
            TransitionComponent={Fade}
            TransitionProps={{ timeout: 600 }}
            arrow
            className="tooltipHeaderInfo"
            title={props.info}
          >
            <img className="infoIconCreatePod" src={infoIcon} alt={"info"} />
          </Tooltip>
        ) : null}
      </div>
    </div>
  );
};

export default RenderInputWithTooltip;