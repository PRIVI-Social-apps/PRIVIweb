import React from "react";
import { Tooltip, Fade } from "@material-ui/core";
const infoIcon = require("assets/icons/info_green.png");

const RectangleInfoPaper = (props: any) => {
  return (
    <div className="rectangleInfoPaper">
      <div className="labelInfoPaper" style={{ marginTop: 0 }}>
        {props.label}
        {props.tooltipInfo ? (
          <Tooltip TransitionComponent={Fade}
                   TransitionProps={{ timeout: 600 }}
                   arrow
                   className="tooltipProfileInfo"
                   title={`${props.tooltipInfo}`}>
            <img src={infoIcon} alt={"info"} />
          </Tooltip>
        ) : null}
      </div>
      <div className="firstRowInfoPaper" style={{ padding: 0 }}>
        <div className="valueInfoPaper"
             style={{
               width: "100%",
               textAlign: "center",
               marginTop: 10,
               fontSize: 20,
               marginLeft: 0,
               height: '24px'
             }}>
          {props.value}
        </div>
      </div>
    </div>
  );
};

export default RectangleInfoPaper;
