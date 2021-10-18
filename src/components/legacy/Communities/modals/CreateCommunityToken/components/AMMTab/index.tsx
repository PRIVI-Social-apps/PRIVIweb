import React, { useEffect, useState } from "react";
import { Radio, RadioGroup, FormControlLabel, Tooltip, Fade } from "@material-ui/core";
import { useCreateCommunityTokenStyles } from "../../index.styles";
import Box from "shared/ui-kit/Box";

// ----------------- For the Graphs in Template ---------------------
import Plotly from "plotly.js-basic-dist";
import createPlotlyComponent from "react-plotly.js/factory";
const Plot = createPlotlyComponent(Plotly);

const AMMOPTIONS = ["Linear", "Quadratic", "Exponential", "Sigmoid"];

// Main line
export const communityTokenLineInitState = {
  maxPoints: 100,
  data: {
    x: [],
    y: [],
    mode: "lines",
    name: "AMM",
    line: {
      dash: "solid",
      color: "#181818",
    },
  },
  data2: {
    x: [],
    y: [],
    mode: "lines",
    name: "Target Supply",
    line: {
      dash: "dash",
      color: "#BDBDBD",
    },
  },
  data3: {
    x: [],
    y: [],
    mode: "lines",
    name: "Target Price",
    line: {
      dash: "dash",
      color: "#BDBDBD",
    },
  },
  layout: {
    autosize: false,
    height: 250,
    width: 600,
    bordercolor: "#FFFFFF",
    showlegend: true,
    plot_bgcolor: "#FBFCFF",
    datarevision: 0,
    xaxis: {
      linecolor: "#BDBDBD",
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
          color: "#99A1B3",
        },
      },
    },
    yaxis: {
      linecolor: "#BDBDBD",
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
          color: "#99A1B3",
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

export default function CreateCommunityTokenAMMTab({ communityToken, setCommunityToken }) {
  const classes = useCreateCommunityTokenStyles();

  const [line, setLine] = useState<any>(communityTokenLineInitState);
  //plotly
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

  return (
    <div>
      <label>
        AMM Type
        <Tooltip
          TransitionComponent={Fade}
          TransitionProps={{ timeout: 600 }}
          arrow
          className="tooltipHeaderInfo"
          title={"Please select your AMM Type... "}
        >
          <img src={require("assets/icons/info.png")} alt="info" />
        </Tooltip>
      </label>
      <RadioGroup
        className={classes.radioGroup}
        value={communityToken.AMM}
        style={{ marginBottom: "16px" }}
        onChange={e => {
          const communityTokenCopy = { ...communityToken };
          communityTokenCopy.AMM = e.target.value;
          setCommunityToken(communityTokenCopy);
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
      <Plot
        data={[line.data, line.data2, line.data3]}
        layout={line.layout}
        graphDiv="graph"
        className="plot"
        style={{ marginBottom: "45px" }}
      />
    </div>
  );
}
