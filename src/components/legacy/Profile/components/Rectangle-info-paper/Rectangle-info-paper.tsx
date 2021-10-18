import React from 'react';
import './Rectangle-info-paper.css';
import { Tooltip, Fade } from '@material-ui/core';
const infoIcon = require('assets/icons/info.svg');

const RectangleInfoPaper = (props: any) => {
  return (
    <div className="rectangleInfoPaper">
      <div className="labelInfoPaper">
        {props.label}
        {props.tooltipInfo ? (
          <Tooltip
            TransitionComponent={Fade}
            TransitionProps={{ timeout: 600 }}
            arrow
            className="tooltipProfileInfo"
            title={`${props.tooltipInfo}`}
          >
            <img src={infoIcon} alt={'info'} />
          </Tooltip>
        ) : null}
      </div>
      <div className="valueInfoPaper">{props.value}</div>
    </div>
  );
};

export default RectangleInfoPaper;
