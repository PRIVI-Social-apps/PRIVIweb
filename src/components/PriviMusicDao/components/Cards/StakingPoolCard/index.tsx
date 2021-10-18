import React from "react";

import { stakingPoolCardStyles } from "./index.styles";
import Box from "shared/ui-kit/Box";
import { Color, PrimaryButton } from "shared/ui-kit";
import PrintChart from "shared/ui-kit/Chart/Chart";
import { useHistory } from "react-router-dom";

const FreeHoursChartConfig = {
  config: {
    data: {
      labels: [] as any[],
      datasets: [
        {
          type: "bar",
          label: "",
          data: [] as any[],
          pointRadius: 0,
          backgroundColor: "#A0D801",
          borderColor: "#A0D801",
          pointBackgroundColor: "#A0D801",
          hoverBackgroundColor: "#A0D801",
          borderJoinStyle: "round",
          borderCapStyle: "round",
          borderWidth: 3,
          cubicInterpolationMode: "monotone",
          lineTension: 0.1,
        },
      ],
    },

    options: {
      responsive: true,
      maintainAspectRatio: false,
      chartArea: {
        backgroundColor: "#F7F9FECC",
      },
      elements: {
        point: {
          radius: 0,
          hitRadius: 5,
          hoverRadius: 5,
        },
      },

      legend: {
        display: false,
      },

      layout: {
        padding: {
          left: 0,
          right: 0,
          top: 0,
          bottom: 0,
        },
      },

      scales: {
        xAxes: [
          {
            offset: true,
            display: false,
            gridLines: {
              color: "#ffffff",
              lineWidth: 50,
            },
            ticks: {
              beginAtZero: true,
              fontColor: "#6B6B6B",
              fontFamily: "Agrandir",
            },
          },
        ],
        yAxes: [
          {
            display: false,
            gridLines: {
              color: "#EFF2F8",
            },
            ticks: {
              display: true,
              beginAtZero: true,
            },
          },
        ],
      },

      tooltips: {
        mode: "label",
        intersect: false,
        callbacks: {
          //This removes the tooltip title
          title: function () {},
          label: function (tooltipItem, data) {
            return `$${tooltipItem.yLabel.toFixed(4)}`;
          },
        },
        //this removes legend color
        displayColors: false,
        yPadding: 10,
        xPadding: 10,
        position: "nearest",
        caretSize: 10,
        backgroundColor: "rgba(255,255,255,0.9)",
        bodyFontSize: 15,
        bodyFontColor: "#303030",
      },

      plugins: {
        datalabels: {
          display: function (context) {
            return context.dataset.data[context.dataIndex] !== 0;
          },
        },
      },
    },
  },
};
const configurer = (config: any, ref: CanvasRenderingContext2D): object => {
  for (let index = 0; index < config.data.datasets.length; index++) {
    let gradient = ref.createLinearGradient(0, 0, 0, ref.canvas.clientHeight);
    gradient.addColorStop(1, `${config.data.datasets[index].backgroundColor}33`);
    gradient.addColorStop(0.5, `${config.data.datasets[index].backgroundColor}b0`);
    config.data.datasets[index].backgroundColor = gradient;
  }

  return config;
};

export default function StakingPoolCard({ item }) {
  const classes = stakingPoolCardStyles();
  const history = useHistory();

  const [rewardConfig, setRewardConfig] = React.useState<any>();

  React.useEffect(() => {
    const newRewardConfig = JSON.parse(JSON.stringify(FreeHoursChartConfig));
    newRewardConfig.configurer = configurer;
    newRewardConfig.config.data.labels = item.data;
    newRewardConfig.config.data.datasets[0].data = item.data;
    newRewardConfig.config.data.datasets[0].type = "line";
    newRewardConfig.config.options.scales.xAxes[0].offset = false;
    newRewardConfig.config.options.scales.yAxes[0].ticks.display = false;

    setRewardConfig(newRewardConfig);
  }, []);

  return (
    <Box className={classes.card}>
      <Box className={classes.flexBox} justifyContent="center">
        <Box className={classes.header1}>{item.token} Pool</Box>
        <img src={require(`assets/tokenImages/${item.token}.png`)} className={classes.tokenImg} />
      </Box>
      <Box
        className={classes.flexBox}
        justifyContent="space-between"
        mt={4}
        pb={2}
        borderBottom="1px solid #00000022"
      >
        <Box className={classes.header3} color="#54658F">
          Average repayment rate
        </Box>
        <Box className={classes.header2} color="#2D3047">
          {item.days} days
        </Box>
      </Box>
      <Box className={classes.header3} color="#54658F" mt={4}>
        Rapayment Rate over Time
      </Box>
      <Box mt={2} height="100px">
        {rewardConfig && <PrintChart config={rewardConfig} />}
      </Box>
      <Box className={classes.flexBox} justifyContent="center" mt={4}>
        <PrimaryButton
          size="medium"
          isRounded
          style={{ background: Color.MusicDAODark }}
          onClick={() => history.push(`/privi-music-dao/music/stack/${item.token}`)}
        >
          Stake
        </PrimaryButton>
      </Box>
    </Box>
  );
}
