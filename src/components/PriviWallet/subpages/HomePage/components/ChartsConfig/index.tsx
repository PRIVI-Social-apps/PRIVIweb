export const MediaEarningsConfig = {
  config: {
    data: {
      labels: [] as any[],
      datasets: [
        {
          type: "line",
          label: "",
          data: [] as any[],
          pointRadius: 0,
          backgroundColor: "#6E6CE4",
          borderColor: "#6E6CE4",
          pointBackgroundColor: "#6E6CE4",
          hoverBackgroundColor: "#6E6CE4",
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
        backgroundColor: "#FFFFFFF",
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
          top: 50,
          bottom: 0,
        },
      },

      scales: {
        xAxes: [
          {
            offset: true,
            display: true,
            gridLines: {
              color: "#ffffff",
              lineWidth: 50,
            },
            ticks: {
              display: true,
              beginAtZero: false,
              fontColor: "#707582",
              fontFamily: "Agrandir",
              fontSize: 12,
            },
          },
        ],
        yAxes: [
          {
            position: "right",
            display: true,
            gridLines: {
              color: "#EFF2F8",
            },
            ticks: {
              display: true,
              beginAtZero: false,
              fontColor: "#707582",
              fontFamily: "Agrandir",
              fontSize: 11,
              callback: function (value, index, values) {
                return value + "%";
              },
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
            return `${tooltipItem.yLabel}: ${data.datasets[0].data[tooltipItem.index]}%`;
          },
        },
        //this removes legend color
        displayColors: false,
        yPadding: 10,
        xPadding: 10,
        position: "nearest",
        caretSize: 10,
        bodyFontSize: 12,
        color: "white",
        titleFontFamily: "Montserrat",
        bodyFontFamily: "Montserrat",
      },
    },
  },
};

export const AssetsConfig = {
  config: {
    type: "doughnut",
    data: {
      datasets: [
        {
          data: [34, 34, 15.5, 12.5],
          backgroundColor: ["#7472EF", "#FFC61B", "#6833FE", "#FE83D5"],
          borderWidth: 0,
          hoverOffset: 0,
        },
      ],
      labels: ["CRYPTO", "FT", "NFT", "Social"],
    },
    options: {
      cutoutPercentage: 50,
      rotation: Math.PI / 2,

      tooltips: {
        callbacks: {
          //This removes the tooltip title
          title: function (tooltipItem, data) {},
          label: function (tooltipItem, data) {
            return `${data.datasets[0].data[tooltipItem.index]}%`;
          },
        },
        displayColors: false,
        usePointStyle: true,
        enabled: true,
        color: "white",
        titleFontFamily: "Montserrat",
        bodyFontFamily: "Montserrat",
        fontWeight: 800,
        fontSize: 14,
      },

      legend: {
        position: "bottom",
        labels: {
          usePointStyle: true,
          boxWidth: 11.8,
          boxHeight: 11.8,
          fontFamily: "Agrandir",
          fontSize: 14,
        },
      },

      hover: { mode: null },
    },
  },
};
