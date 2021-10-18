import React, { useState, useEffect, useRef } from "react";
import { useReviewDAOTokenStyles } from "../../index";
import { Box, Fade, FormControlLabel, Grid, Radio, RadioGroup, Tooltip } from "@material-ui/core";

// ----------------- For the Graphs in Template ---------------------
import Plotly from "plotly.js-basic-dist";
import createPlotlyComponent from "react-plotly.js/factory";

import SvgIcon from "@material-ui/core/SvgIcon";
import { ReactComponent as CloseSolid } from "assets/icons/close-solid.svg";
import InputWithLabelAndTooltip from "shared/ui-kit/InputWithLabelAndTooltip";
import { communityTokenLineInitState } from "../../../CreateDAOToken/components/SupplyTab";
import { ProgressAcceptIcon, ProgressDeclineIcon } from "components/PriviDAO/subpages/DAOPage/index.styles";
import { TokenSelect } from "shared/ui-kit/Select/TokenSelect";
import Axios from "axios";
import URL from "shared/functions/getURL";

const Plot = createPlotlyComponent(Plotly);

const AMMOPTIONS = ["Linear", "Quadratic", "Exponential", "Sigmoid"];

export default function ReviewDAOTokenTokenomicsTab({
  communityToken,
  setCommunityToken,
  isCreator,
  tokenList,
  setTokenPhoto,
  tokenPhoto,
}: {
  communityToken: any;
  setCommunityToken: any;
  isCreator: boolean;
  tokenList: string[];
  setTokenPhoto: any;
  tokenPhoto: any;
}) {
  const inputRef = useRef<any>();
  //general info
  const [tokenPhotoImg, setTokenPhotoImg] = useState<any>(null);
  const [line, setLine] = useState<any>(communityTokenLineInitState);

  const classes = useReviewDAOTokenStyles();

  const [tokensList, setTokenList] = useState<any[]>([]);

  useEffect(() => {
    if (!tokenList) {
      Axios.get(`${URL()}/wallet/getCryptosRateAsList`).then(res => {
        const resp = res.data;
        if (resp.success) {
          const tokenList: any[] = [];
          const data = resp.data;
          data.forEach(rateObj => {
            tokenList.push(rateObj.token);
          });
          setTokenList(tokenList);
        }
      });
    }
  }, []);

  useEffect(() => {
    if (communityToken.TokenSymbol && communityToken.dimensions) {
      //setTokenPhoto(`url(${URL()}/wallet/getTokenPhoto/${communityToken.TokenSymbol})`);
    }
  }, [communityToken]);

  useEffect(() => {
    const amm = communityToken.AMM;
    const initialSupply = Number(communityToken.InitialSupply);
    const targetSupply = Number(communityToken.TargetSupply);
    const targetPrice = Number(communityToken.TargetPrice);
    const newLine: any = { ...line };
    const xs: number[] = [];
    const ys: number[] = [];
    if (amm && initialSupply != undefined && targetSupply && targetPrice && targetSupply >= initialSupply) {
      let maxY;
      switch (amm) {
        case "Quadratic":
          maxY =
            (Math.pow(targetSupply * 1.6 - initialSupply, 2) * targetPrice) /
            Math.pow(targetSupply - initialSupply, 2);
          for (let i = 0; i < line.maxPoints; i++) {
            const x = (i * targetSupply * 1.6) / line.maxPoints;
            const y =
              x >= initialSupply
                ? (Math.pow(x - initialSupply, 2) * targetPrice) / Math.pow(targetSupply - initialSupply, 2)
                : 0;
            xs.push(x);
            ys.push(Math.min(y, maxY));
          }
          break;
        case "Linear":
          maxY = ((targetSupply * 1.6 - initialSupply) * targetPrice) / (targetSupply - initialSupply);
          for (let i = 0; i < line.maxPoints; i++) {
            const x = (i * targetSupply * 1.6) / line.maxPoints;
            const y =
              x >= initialSupply ? ((x - initialSupply) * targetPrice) / (targetSupply - initialSupply) : 0;
            xs.push(x);
            ys.push(Math.min(y, maxY));
          }
          break;
        case "Exponential":
          maxY = Math.exp(targetSupply * 1.6 - targetSupply) * targetPrice;
          for (let i = 0; i < line.maxPoints; i++) {
            const x = (i * targetSupply * 1.6) / line.maxPoints;
            const y = x >= initialSupply ? Math.exp(x - targetSupply) * targetPrice : 0; // e(x-I)*targetPrice/e(K-I)
            xs.push(x);
            ys.push(Math.min(y, maxY));
          }
          break;
        case "Sigmoid":
          maxY =
            targetPrice / (1 + Math.exp(targetSupply - initialSupply - (targetSupply * 1.6 - initialSupply)));
          for (let i = 0; i < line.maxPoints; i++) {
            const x = (i * targetSupply * 1.6) / line.maxPoints;
            const y =
              x >= initialSupply
                ? targetPrice / (1 + Math.exp(targetSupply - initialSupply - (x - initialSupply)))
                : 0;
            xs.push(x);
            ys.push(Math.min(y, maxY));
          }
          break;
      }
      for (let i = 0; i < line.maxPoints; i++) {
        const x = targetSupply * 1.6 + i * ((targetSupply * 100) / line.maxPoints);
        xs.push(x);
        ys.push(maxY);
      }
      newLine.layout.xaxis.range = [0, targetSupply * 1.6];
      newLine.layout.yaxis.range = [0, targetPrice];
    }
    newLine.data.x = xs;
    newLine.data.y = ys;
    // set targetPrice and targetSupply lines
    const maxNum = Number.MAX_VALUE / 10;
    const minNum = -Number.MAX_VALUE / 10;
    let x2s: number[] = [];
    let y2s: number[] = [];
    let x3s: number[] = [];
    let y3s: number[] = [];
    if (targetSupply) {
      x2s = Array(line.maxPoints).fill(targetSupply);
      for (let i = 0; i < line.maxPoints; i++) {
        y2s.push(minNum + i * 2 * (maxNum / line.maxPoints));
      }
    }
    if (targetPrice) {
      y3s = Array(line.maxPoints).fill(targetPrice);
      for (let i = 0; i < line.maxPoints; i++) {
        x3s.push(minNum + i * 2 * (maxNum / line.maxPoints));
      }
    }
    newLine.data3.x = x3s;
    newLine.data3.y = y3s;
    newLine.data2.x = x2s;
    newLine.data2.y = y2s;
    // set axis labels
    if (communityToken.FundingToken)
      newLine.layout.yaxis.title.text = `Price (${communityToken.FundingToken})`;
    if (communityToken.TokenSymbol)
      newLine.layout.xaxis.title.text = `Supply (${communityToken.TokenSymbol})`;
    newLine.layout.datarevision += 1;
    setLine(newLine);
  }, [communityToken]);

  // ------- Photo functions ----------
  const onPhotoChange = (files: any) => {
    setTokenPhoto(files[0]);
    const reader = new FileReader();
    reader.addEventListener("load", () => {
      setTokenPhotoImg(reader.result);

      let image = new Image();

      if (reader.result !== null && (typeof reader.result === "string" || reader.result instanceof String)) {
        image.src = reader.result.toString();

        //save dimensions
        image.onload = function () {
          let height = image.height;
          let width = image.width;

          const communityCopy = communityToken;
          communityCopy.tokenDimensions = { height: height, width: width };
          setCommunityToken(communityCopy);

          return true;
        };
      }
    });
    reader.readAsDataURL(files[0]);
  };

  const dragOver = e => {
    e.preventDefault();
  };

  const dragEnter = e => {
    e.preventDefault();
  };

  const dragLeave = e => {
    e.preventDefault();
  };

  const fileDrop = e => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files.length) {
      handleFiles(files);
    }
  };

  const fileInput = e => {
    e.preventDefault();
    console.log(e);
    const files = e.target.files;
    if (files.length) {
      handleFiles(files);
    }
  };

  const handleFiles = (files: any) => {
    for (let i = 0; i < files.length; i++) {
      if (validateFile(files[i])) {
        onPhotoChange(files);
      } else {
        files[i]["invalid"] = true;
        // Alert invalid image
      }
    }
  };

  const validateFile = file => {
    const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/x-icon"];
    if (validTypes.indexOf(file.type) === -1) {
      return false;
    }
    return true;
  };

  const removeImage = () => {
    setTokenPhoto(null);
    setTokenPhotoImg(null);
  };

  return (
    <div>
      <h5>Community Token</h5>
      <Grid container spacing={2} className={classes.content} direction="row">
        <Grid item xs={12} md={6}>
          <label>Name</label>
          {renderInputCreateModal({
            isCreator,
            item: "TokenName",
            type: "text",
            min: undefined,
            placeholder: "",
            setCommunityToken,
            communityToken,
            classes,
          })}

          <label>Symbol</label>
          {renderInputCreateModal({
            isCreator,
            item: "TokenSymbol",
            type: "text",
            min: undefined,
            placeholder: "",
            setCommunityToken,
            communityToken,
            classes,
          })}

          <label>Funding Token</label>
          {renderSelectorCreateModal({
            isCreator,
            item: "FundingToken",
            tokenList: tokenList ?? tokensList,
            setCommunityToken,
            communityToken,
            classes,
          })}

          <label>Initial Supply</label>
          {renderInputCreateModal({
            isCreator,
            item: "InitialSupply",
            type: "number",
            min: "0.01",
            placeholder: "",
            setCommunityToken,
            communityToken,
            classes,
          })}

          <label>Target Supply</label>
          {renderInputCreateModal({
            isCreator,
            item: "TargetSupply",
            type: "number",
            min: "0.01",
            placeholder: "",
            setCommunityToken,
            communityToken,
            classes,
          })}
        </Grid>

        <Grid item xs={12} md={6}>
          <label style={{ marginBottom: "8px" }}>
            Image{" "}
            {communityToken.dimensions && communityToken.dimensions !== "" && (
              <ValidatedField
                field={communityToken.PhotoValidation}
                isCreator={isCreator}
                isFlex={true}
                marginApplied={true}
                validateFieldTrue={() => {
                  if (isCreator) {
                    let communityCopy = { ...communityToken };
                    communityCopy.PhotoValidation = true;
                    setCommunityToken(communityCopy);
                  }
                }}
                validateFieldFalse={() => {
                  if (isCreator) {
                    let communityCopy = { ...communityToken };
                    communityCopy.PhotoValidation = false;
                    setCommunityToken(communityCopy);
                  }
                }}
              />
            )}
          </label>
          {tokenPhotoImg ? (
            <div
              style={{
                height: "246px",
                position: "relative",
              }}
            >
              <div
                style={{
                  backgroundImage: `url(${tokenPhotoImg})`,
                  backgroundPosition: "center",
                  backgroundRepeat: "no-repeat",
                  backgroundSize: "cover",
                  width: "100%",
                  height: "100%",
                }}
              />
              {!isCreator && !communityToken.PhotoValidation && (
                <div
                  style={{
                    cursor: !isCreator ? "pointer" : "inherit",
                    position: "absolute",
                    top: 0,
                    right: 0,
                    marginRight: "8px",
                    marginTop: "8px",
                  }}
                  onClick={() => {
                    removeImage();
                  }}
                >
                  <SvgIcon>
                    <CloseSolid />
                  </SvgIcon>
                </div>
              )}
            </div>
          ) : (
            <Box
              display="flex"
              flexDirection="column"
              width="100%"
              height={"246px"}
              alignItems="center"
              justifyContent="center"
              style={{
                cursor: "pointer",
                background: "rgba(255, 255, 255, 0.16)",
                border: "1px solid #FFFFFF",
              }}
              onClick={() => {
                let selectPhoto = document.getElementById("selectPhoto");
                if (selectPhoto && !isCreator) {
                  selectPhoto.click();
                }
              }}
              onDragOver={!isCreator && !communityToken.PhotoValidation ? dragOver : undefined}
              onDragEnter={!isCreator && !communityToken.PhotoValidation ? dragEnter : undefined}
              onDragLeave={!isCreator && !communityToken.PhotoValidation ? dragLeave : undefined}
              onDrop={!isCreator && !communityToken.PhotoValidation ? fileDrop : undefined}
            >
              <img
                className="dragImageHereIconImgTitleDesc"
                src={require("assets/icons/image_icon_white.png")}
                alt={"camera"}
                width={40}
                height={31}
                style={{ marginBottom: "16px" }}
              />
              {!isCreator && !communityToken.PhotoValidation && (
                <Box textAlign="center" color="white">
                  Drag Image Here
                  <Box fontSize={"14px"} mt={1} display="flex">
                    or{" "}
                    <Box color="#707582" ml={1}>
                      browse media on your device
                    </Box>
                  </Box>
                </Box>
              )}
            </Box>
          )}
          {!isCreator && !communityToken.PhotoValidation && (
            <input
              id="selectPhoto"
              hidden
              type="file"
              style={{ display: "none" }}
              accept="image/*"
              onChange={fileInput}
            />
          )}

          <label style={{ marginTop: "16px" }}>Initial Price</label>
          {renderInputCreateModal({
            isCreator,
            item: "InitialPrice",
            type: "number",
            min: "0.01",
            placeholder: "",
            setCommunityToken,
            communityToken,
            classes,
          })}

          <label>Target Price</label>
          {renderInputCreateModal({
            isCreator,
            item: "TargetPrice",
            type: "number",
            min: "0.01",
            placeholder: "",
            setCommunityToken,
            communityToken,
            classes,
          })}
        </Grid>
      </Grid>

      <label>
        AMM Type
        <Tooltip
          TransitionComponent={Fade}
          TransitionProps={{ timeout: 600 }}
          arrow
          title={"Please select your AMM Type... "}
        >
          <img src={require("assets/icons/info.png")} alt="info" />
        </Tooltip>
      </label>
      <Box display="flex" alignItems="center">
        <RadioGroup
          className={classes.radioGroup}
          value={communityToken.AMM}
          style={{ marginBottom: "16px" }}
          onChange={e => {
            if (!isCreator && !communityToken.AMMValidation) {
              const communityTokenCopy = { ...communityToken };
              communityTokenCopy.AMM = e.target.value;
              setCommunityToken(communityTokenCopy);
            }
          }}
        >
          {AMMOPTIONS.map((option, index) => (
            <FormControlLabel
              key={`option-${index}`}
              value={option}
              control={<Radio />}
              label={
                <Box fontFamily="Agrandir" fontSize={18} fontWeight={400} color="#181818">
                  {option}
                </Box>
              }
            />
          ))}
        </RadioGroup>
        {communityToken.AMM && communityToken.AMM !== "" && (
          <ValidatedField
            field={communityToken.AMMValidation}
            isCreator={isCreator}
            isFlex={true}
            marginApplied={true}
            validateFieldTrue={() => {
              if (isCreator) {
                let communityCopy = { ...communityToken };
                communityCopy.AMMValidation = true;
                setCommunityToken(communityCopy);
              }
            }}
            validateFieldFalse={() => {
              if (isCreator) {
                let communityCopy = { ...communityToken };
                communityCopy.AMMValidation = false;
                setCommunityToken(communityCopy);
              }
            }}
          />
        )}
      </Box>
      <Plot
        data={[line.data, line.data2, line.data3]}
        layout={line.layout}
        graphDiv="graph"
        className="plotDark"
      />
    </div>
  );
}

const ValidatedField = (propsFunction: any) => {
  const [field, setField] = useState<any>(null);

  useEffect(() => {
    setField(propsFunction.field);
  }, [propsFunction.field]);

  return (
    <div style={{ marginLeft: "8px" }}>
      {field ? (
        <Box
          display="flex"
          alignItems="center"
          style={propsFunction.isCreator ? { cursor: "pointer" } : {}}
          onClick={() => {
            if (propsFunction.isCreator) {
              setField(false);
              propsFunction.validateFieldFalse();
            }
          }}
        >
          <ProgressAcceptIcon />
        </Box>
      ) : (
        <Box
          display="flex"
          alignItems="center"
          style={
            propsFunction.isCreator
              ? {
                  cursor: "pointer",
                }
              : {}
          }
          onClick={() => {
            if (propsFunction.isCreator) {
              setField(true);
              propsFunction.validateFieldTrue();
            }
          }}
        >
          <ProgressDeclineIcon />
        </Box>
      )}
    </div>
  );
};

//input component
function renderInputCreateModal({
  isCreator,
  item,
  type,
  min,
  placeholder,
  setCommunityToken,
  communityToken,
  classes,
}: {
  isCreator: any;
  item: string;
  type: string;
  min: string | undefined;
  placeholder: string;
  setCommunityToken: any;
  communityToken: any;
  classes: any;
}) {
  return (
    <div className={classes.validateInput}>
      <InputWithLabelAndTooltip
        transparent
        style={isCreator ? { width: "calc(" + 100 + "% - 35px)" } : { width: "calc(" + 100 + "% )" }}
        type={type}
        minValue={min}
        inputValue={communityToken[item]}
        onInputValueChange={elem => {
          if (!isCreator && !communityToken[item + "Validation"]) {
            let communityTokenCopy = { ...communityToken };
            communityTokenCopy[item] = elem.target.value;
            setCommunityToken(communityTokenCopy);
          }
        }}
        placeHolder={placeholder}
        disabled={isCreator || communityToken[item + "Validation"]}
        theme="dark"
      />
      {communityToken[item] && communityToken[item] !== "" && (
        <ValidatedField
          field={communityToken[item + "Validation"]}
          isCreator={isCreator}
          isFlex={true}
          marginApplied={true}
          validateFieldTrue={() => {
            if (isCreator) {
              let communityCopy = { ...communityToken };
              communityCopy[item + "Validation"] = true;
              setCommunityToken(communityCopy);
            }
          }}
          validateFieldFalse={() => {
            if (isCreator) {
              let communityCopy = { ...communityToken };
              communityCopy[item + "Validation"] = false;
              setCommunityToken(communityCopy);
            }
          }}
        />
      )}
    </div>
  );
}

//input component
function renderSelectorCreateModal({
  isCreator,
  item,
  tokenList,
  setCommunityToken,
  communityToken,
  classes,
}: {
  isCreator: any;
  item: string;
  tokenList: string[];
  setCommunityToken: any;
  communityToken: any;
  classes: any;
}) {
  return (
    <div className={classes.validateSelector}>
      <TokenSelect
        theme="dark"
        value={communityToken[item]}
        onChange={v => {
          if (!isCreator && !communityToken[item + "Validation"]) {
            const communityTokenCopy = { ...communityToken };
            communityTokenCopy[item] = v.target.value;
            setCommunityToken(communityTokenCopy);
          }
        }}
        disabled={isCreator || communityToken[item + "Validation"]}
        tokens={tokenList}
      />
      {communityToken[item] && communityToken[item] !== "" && (
        <ValidatedField
          field={communityToken[item + "Validation"]}
          isCreator={isCreator}
          isFlex={true}
          marginApplied={true}
          validateFieldTrue={() => {
            if (isCreator) {
              let communityCopy = { ...communityToken };
              communityCopy[item + "Validation"] = true;
              setCommunityToken(communityCopy);
            }
          }}
          validateFieldFalse={() => {
            if (isCreator) {
              let communityCopy = { ...communityToken };
              communityCopy[item + "Validation"] = false;
              setCommunityToken(communityCopy);
            }
          }}
        />
      )}
    </div>
  );
}
