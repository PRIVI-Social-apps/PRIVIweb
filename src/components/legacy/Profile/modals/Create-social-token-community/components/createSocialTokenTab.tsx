import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import Plotly from "plotly.js-basic-dist";
import createPlotlyComponent from "react-plotly.js/factory";

import { Fade, FormControl, Grid, Tooltip } from "@material-ui/core";
import Divider from "@material-ui/core/Divider";

import { useTypedSelector } from "store/reducers/Reducer";
import URL from "shared/functions/getURL";
import { StyledSelect, StyledMenuItem } from "shared/ui-kit/Styled-components/StyledComponents";
import { signTransaction } from "shared/functions/signTransaction";
import AlertMessage from "shared/ui-kit/Alert/AlertMessage";

import SvgIcon from "@material-ui/core/SvgIcon";
import { ReactComponent as CloseSolid } from "assets/icons/close-solid.svg";

import "../CreateSocialTokenCommunity.css";
import { getPriviWallet } from "shared/helpers/wallet";
import { signPayload } from "shared/services/WalletSign";
import InputWithLabelAndTooltip from "shared/ui-kit/InputWithLabelAndTooltip";

// ----------------- For the Graphs in Template ---------------------
const Plot = createPlotlyComponent(Plotly);
// Main line
const lineInitState = {
  maxPoints: 100,
  data: {
    x: [],
    y: [],
    mode: "lines",
    name: "AMM",
    line: {
      dash: "solid",
      color: "black",
    },
  },
  data2: {
    x: [],
    y: [],
    mode: "lines",
    name: "Target Supply",
    line: {
      dash: "dash",
      color: "grey",
    },
  },
  data3: {
    x: [],
    y: [],
    mode: "lines",
    name: "Target Price",
    line: {
      dash: "dash",
      color: "grey",
    },
  },
  layout: {
    autosize: false,
    height: 500,
    width: 850,
    bordercolor: "FFFFFF",
    showlegend: true,
    plot_bgcolor: "rgb(227, 233, 239)",
    datarevision: 0,
    xaxis: {
      linecolor: "rgb(100, 200, 158)",
      linewidth: 2,
      mirror: true,
      automargin: true,
      autorange: false,
      range: [0, 10],
      title: {
        text: "",
        font: {
          family: "Agrandir",
          size: 12,
          color: "rgb(0,0,0)",
        },
      },
    },
    yaxis: {
      linecolor: "rgb(100, 200, 158)",
      linewidth: 2,
      mirror: true,
      automargin: true,
      autorange: false,
      range: [0, 10],
      title: {
        text: "",
        font: {
          family: "Agrandir",
          size: 12,
          color: "rgb(0,0,0)",
        },
      },
    },
    margin: {
      l: 10,
      r: 10,
      b: 10,
      t: 10,
      pad: 0,
    },
  },
};
const typeAMMs = ["Linear", "Quadratic", "Exponential", "Sigmoid"];
// ---------------------------------------------------
const dividentFrequencyOptions = ["Daily", "Weekly", "Monthly"];

const imageIcon = require("assets/icons/image_icon.png");
const infoIcon = require("assets/icons/info_icon.png");

const arePropsEqual = (prevProps, currProps) => {
  return prevProps.tokenObjList == currProps.tokenObjList;
};

const CreateSocialTokenTab = React.memo((props: any) => {
  const loggedUser = useTypedSelector(state => state.user);
  const inputRef = useRef<any>();
  const [status, setStatus] = useState<any>("");

  //general info
  const [photo, setPhoto] = useState<any>(null);
  const [photoImg, setPhotoImg] = useState<any>(null);
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

  const [socialToken, setSocialToken] = useState<any>({
    Name: "",
    TokenSymbol: "",
    Description: "",
    TargetPrice: "",
    TargetSupply: "",
    InitialSupply: "",
    FundingToken: "PRIVI",
    TargetSpread: "",
    DividendFreq: "Daily",
    AMM: "Linear",
  });
  const [line, setLine] = useState<any>(lineInitState);

  const [fundingTokenName, setFundingTokenName] = useState<string>(tokenNameList[0]);

  // ------- Photo functions ----------
  const onPhotoChange = (files: any) => {
    setPhoto(files[0]);
    const reader = new FileReader();
    reader.addEventListener("load", () => {
      setPhotoImg(reader.result);

      let image = new Image();

      if (reader.result !== null && (typeof reader.result === "string" || reader.result instanceof String)) {
        image.src = reader.result.toString();

        //save dimensions
        image.onload = function () {
          let height = image.height;
          let width = image.width;

          const tokenCopy = { ...socialToken };
          tokenCopy.dimensions = { height: height, width: width };
          setSocialToken(tokenCopy);

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
    setPhoto(null);
    setPhotoImg(null);
  };

  // -------------------
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
      setFundingTokenName(newTokenNameList[0]);
      const newSocialToken = { ...socialToken };
      newSocialToken.FundingToken = newTokenNameSymbolMap[newTokenNameList[0]];
      setSocialToken(newSocialToken);
    }
  }, [props.tokenObjList]);

  useEffect(() => {
    const amm = socialToken.AMM;
    const initialSupply = Number(socialToken.InitialSupply);
    const targetSupply = Number(socialToken.TargetSupply);
    const targetPrice = Number(socialToken.TargetPrice);
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
    if (socialToken.FundingToken) newLine.layout.yaxis.title.text = `Price (${socialToken.FundingToken})`;
    if (socialToken.TokenSymbol) newLine.layout.xaxis.title.text = `Supply (${socialToken.TokenSymbol})`;
    newLine.layout.datarevision += 1;
    setLine(newLine);
  }, [socialToken]);

  const validateSocialTokenInfo = () => {
    if (!(socialToken.Name.length >= 5)) {
      setStatus({
        msg: "Name field invalid. Minimum 5 characters required.",
        key: Math.random(),
        variant: "error",
      });
      return false;
    } else if (!(socialToken.TokenSymbol.length >= 3)) {
      setStatus({
        msg: "Token symbol field invalid. Minimum 3 characters required.",
        key: Math.random(),
        variant: "error",
      });
      return false;
    } else if (!(socialToken.Description.length >= 20)) {
      setStatus({
        msg: "Description field invalid. Minimum 20 characters required",
        key: Math.random(),
        variant: "error",
      });
      return false;
    } else if (!socialToken.FundingToken) {
      setStatus({
        msg: "Funding Token field invalid",
        key: Math.random(),
        variant: "error",
      });
      return false;
    } else if (!socialToken.TargetSpread) {
      setStatus({
        msg: "Target Spread field invalid",
        key: Math.random(),
        variant: "error",
      });
      return false;
    } else if (Number(socialToken.TargetSpread) < 0.1 || Number(socialToken.TargetSpread) > 20) {
      setStatus({
        msg: "Target Spread must be between 0.1% - 20%",
        key: Math.random(),
        variant: "error",
      });
      return false;
    } else if (!socialToken.TargetSupply || Number(socialToken.TargetSupply) < 0) {
      setStatus({
        msg: "Target Supply field invalid. Musn't be filled and greater than 0",
        key: Math.random(),
        variant: "error",
      });
      return false;
    } else if (!socialToken.TargetSupply || Number(socialToken.TargetPrice) < 0) {
      setStatus({
        msg: "Target Price field invalid. Must be filled and greater than 0",
        key: Math.random(),
        variant: "error",
      });
      return false;
    } else if (!socialToken.InitialSupply || Number(socialToken.InitialSupply) < 0) {
      setStatus({
        msg: "Initial Supply field invalid. Must be filled and greater than 0",
        key: Math.random(),
        variant: "error",
      });
      return false;
    } else if (Number(socialToken.InitialSupply) > Number(socialToken.TargetSupply)) {
      setStatus({
        msg: "Initial Supply must be greater than 0 and smaller or equal to the Target Supply",
        key: Math.random(),
        variant: "error",
      });
      return false;
    } /* else if (!socialToken.AMM || socialToken.AMM === "") {
      setStatus({
        msg: "Price Direction is invalid. Must select one",
        key: Math.random(),
        variant: "error",
      });
      return false;
    } */ else {
      return true;
    }
  };

  const createSocialToken = async () => {
    const uploadTokenImage = async (tokenId, tokenSymbol) => {
      return new Promise((resolve, reject) => {
        const formData = new FormData();
        formData.append("image", photo, tokenId);
        const formTokenData = new FormData();
        formTokenData.append("image", photo, tokenSymbol);
        const config = {
          headers: {
            "content-type": "multipart/form-data",
          },
        };
        axios
          .post(`${URL()}/social/changeSocialTokenPhoto`, formTokenData, config)
          .then(response => {
            resolve(true);
          })
          .catch(error => {
            resolve(true);
            setStatus({
              msg: "Error uploading photo",
              key: Math.random(),
              variant: "error",
            });
          });
        //upload token symbol image
        axios
          .post(`${URL()}/wallet/changeTokenPhoto`, formTokenData, config)
          .then(response => {
            let body = { dimensions: socialToken.tokenDimensions ?? socialToken.dimensions, id: tokenSymbol };
            axios
              .post(`${URL()}/wallet/updateTokenPhotoDimensions`, body)
              .then(response => {})
              .catch(error => {
                console.log(error);

                alert("Error uploading photo");
              });
            resolve(true);
          })
          .catch(error => {
            console.log(error);
            resolve(true);
            // alert('Error uploading token photo');
          });
      });
    };

    if (validateSocialTokenInfo()) {
      const payload = {
        Creator: loggedUser.id,
        AMM: socialToken.AMM.toUpperCase(),
        SpreadDividend: Number(socialToken.TargetSpread) / 100,
        FundingToken: tokenNameToSymbolMap[fundingTokenName],
        TokenSymbol: socialToken.TokenSymbol,
        TokenName: socialToken.Name,
        DividendFreq: socialToken.DividendFreq.toUpperCase(),
        InitialSupply: Number(socialToken.InitialSupply),
        TargetSupply: Number(socialToken.TargetSupply),
        TargetPrice: Number(socialToken.TargetPrice),
      };

      const { address, privateKey } = await getPriviWallet();
      const { signature } = await signPayload("createSocialToken", address, payload, privateKey);
      const requestData = {
        Function: "createSocialToken",
        Address: address,
        Signature: signature,
        Payload: {
          AMM: socialToken.AMM.toUpperCase(),
          TradingSpread: 0.05,
          FundingToken: tokenNameToSymbolMap[fundingTokenName],
          TokenSymbol: socialToken.TokenSymbol,
          TokenName: socialToken.Name,
          InitialSupply: Number(socialToken.InitialSupply),
          TargetSupply: Number(socialToken.TargetSupply),
          TargetPrice: Number(socialToken.TargetPrice),
        },
      };
      const body = {
        Data: requestData,
        AddtionalData: {
          dimensions: socialToken.dimensions,
          HasPhoto: photo ? true : false,
        },
      };
      axios.post(`${URL()}/social/createSocialToken/v2`, body).then(async response => {
        const resp = response.data;
        if (resp.success) {
          if (photo) await uploadTokenImage(resp.data.id, socialToken.TokenSymbol);
          setTimeout(() => {
            props.handleRefresh();
            props.handleClose();
          }, 1000);
          setStatus({
            msg: "Social token Created!",
            key: Math.random(),
            variant: "success",
          });
        } else {
          setStatus({
            msg: "social token creation failed",
            key: Math.random(),
            variant: "error",
          });
        }
      });
    }
  };

  //input component
  function renderInputCreateModal(p) {
    return (
      <div>
        <InputWithLabelAndTooltip
          labelName={p.name}
          tooltip={""}
          style={{
            width: "calc(" + p.width + "px - 24px)",
          }}
          type={p.type}
          minValue="0.001"
          inputValue={socialToken[p.item]}
          onInputValueChange={elem => {
            let socialTokenCopy = { ...socialToken };
            socialTokenCopy[p.item] = elem.target.value;
            setSocialToken(socialTokenCopy);
          }}
          placeHolder={p.placeholder}
        />
      </div>
    );
  }

  return (
    <div>
      <h4>General info</h4>
      <Grid
        container
        spacing={0}
        direction="row"
        alignItems="flex-start"
        justify="flex-start"
        className="general"
      >
        <Grid item xs={12} md={6}>
          {photoImg ? (
            <div className="imageCreatePodDiv">
              <div
                className="imageCreatePod"
                style={{
                  backgroundImage: `url(${photoImg})`,
                  backgroundPosition: "center",
                  backgroundRepeat: "no-repeat",
                  backgroundSize: "cover",
                  cursor: "pointer",
                }}
              ></div>
              <div className="removeImageButton" onClick={() => removeImage()}>
                <SvgIcon>
                  <CloseSolid />
                </SvgIcon>
              </div>
            </div>
          ) : (
            <div
              className="dragImageHereCreatePod"
              onClick={() => {
                if (inputRef && inputRef.current) {
                  inputRef.current.click();
                }
              }}
              onDragOver={dragOver}
              onDragEnter={dragEnter}
              onDragLeave={dragLeave}
              onDrop={fileDrop}
            >
              <img className="dragImageHereIcon" src={imageIcon} alt={"camera"} />
              <div className="dragImageHereLabel">Drag Image Here</div>
            </div>
          )}
          <InputWithLabelAndTooltip
            hidden
            type="file"
            style={{ display: "none" }}
            onInputValueChange={fileInput}
            reference={inputRef}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <div className="flexRowInputs">
            {renderInputCreateModal({
              name: "Social Token Name",
              placeholder: "Enter Social Token name...",
              type: "text",
              width: 200,
              item: "Name",
            })}
            {renderInputCreateModal({
              name: "Token TokenSymbol",
              placeholder: "Enter Social Token TokenSymbol...",
              type: "text",
              width: 180,
              item: "TokenSymbol",
            })}
          </div>

          <div className="flexRowInputs">
            <div className="infoHeaderCreatePod">Social Token description</div>
            <img className="infoIconCreatePod" src={infoIcon} alt={"info"} />
          </div>
          <textarea
            className="textAreaCreatePod"
            value={socialToken.Description}
            onChange={elem => {
              let socialTokenCopy = { ...socialToken };
              socialTokenCopy.Description = elem.target.value;
              setSocialToken(socialTokenCopy);
            }}
            placeholder="Enter Social Token description..."
          />
        </Grid>
      </Grid>

      <Divider className="dividerCreatePod" />

      <h4>Social Token</h4>

      <Grid container spacing={0} direction="row" alignItems="flex-start" justify="flex-start">
        <Grid item xs={12} md={6}>
          <div className="flexRowInputs">
            <div>
              <div className="flexRowInputs">
                <div className="infoHeaderCreatePod">Funding Token</div>
                <img className="infoIconCreatePod" src={infoIcon} alt={"info"} />
              </div>
              <div className="selector-with-token">
                {socialToken && socialToken.FundingToken && socialToken.FundingToken.length > 0 ? (
                  <img
                    className="imgSelectorTokenAddLiquidityModal"
                    src={require(`assets/tokenImages/${socialToken.FundingToken}.png`)}
                    alt={socialToken.FundingToken}
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
                      value={fundingTokenName}
                      style={{ width: 150 }}
                      className="selectCreatePod"
                      onChange={e => {
                        const selectedName: any = e.target.value;
                        const socialTokenCopy = { ...socialToken };
                        socialTokenCopy.FundingToken = tokenNameToSymbolMap[selectedName];
                        setSocialToken(socialTokenCopy);
                        setFundingTokenName(selectedName);
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
            </div>
            {renderInputCreateModal({
              name: "Target Spread (%)",
              placeholder: "Target Spread value...",
              type: "number",
              item: "TargetSpread",
              width: 180,
            })}
          </div>
          {renderInputCreateModal({
            name: "Target Price",
            placeholder: "Target Price value...",
            type: "number",
            item: "TargetPrice",
            width: 400,
          })}
          <div>
            <FormControl className="selectorFormControlCreatePod">
              <StyledSelect
                disableUnderline
                value={socialToken.DividendFreq}
                style={{ width: 400 }}
                className="selectCreatePod"
                onChange={e => {
                  const socialTokenCopy = { ...socialToken };
                  socialTokenCopy.DividendFreq = e.target.value;
                  setSocialToken(socialTokenCopy);
                }}
              >
                {dividentFrequencyOptions.map((item, i) => {
                  return (
                    <StyledMenuItem key={i} value={item}>
                      {item}
                    </StyledMenuItem>
                  );
                })}
              </StyledSelect>
            </FormControl>
          </div>
        </Grid>
        <Grid item xs={12} md={6}>
          {renderInputCreateModal({
            name: "Target Supply",
            placeholder: "Target Supply value...",
            type: "number",
            item: "TargetSupply",
            width: 400,
          })}
          {renderInputCreateModal({
            name: "Initial Supply",
            placeholder: "Initial Supply value...",
            type: "number",
            item: "InitialSupply",
            width: 400,
          })}
        </Grid>
      </Grid>
      <Grid item xs={12} md={6}>
        <div className="flexRowInputs">
          <div className="infoHeaderCreatePod">AMM Type</div>
          <Tooltip
            TransitionComponent={Fade}
            TransitionProps={{ timeout: 600 }}
            arrow
            className="tooltipHeaderInfo"
            title={"Please select your AMM Type... "}
          >
            <img className="infoIconCreatePod" src={infoIcon} alt={"info"} />
          </Tooltip>
        </div>
        <div className="option-buttons">
          {typeAMMs.map(typeAmm => {
            return (
              <button
                className={socialToken.AMM === typeAmm ? "selected" : undefined}
                onClick={() => {
                  const newSocialToken = { ...socialToken };
                  newSocialToken.AMM = typeAmm;
                  setSocialToken(newSocialToken);
                }}
              >
                {typeAmm}
              </button>
            );
          })}
        </div>
      </Grid>

      <Plot
        data={[line.data, line.data2, line.data3]}
        layout={line.layout}
        graphDiv="graph"
        className="plot"
      />

      <div className="buttonCreatePodRow">
        <button onClick={createSocialToken} className="buttonCreatePod">
          Create Social Token
        </button>
      </div>

      {status && (
        <AlertMessage
          key={status.key}
          message={status.msg}
          variant={status.variant}
          onClose={() => setStatus(undefined)}
        />
      )}
    </div>
  );
}, arePropsEqual);

export default CreateSocialTokenTab;
