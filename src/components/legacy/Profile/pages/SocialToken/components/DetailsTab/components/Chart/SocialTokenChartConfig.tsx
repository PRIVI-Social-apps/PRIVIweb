const SocialTokenChartConfig = {
  config: {
    type: "line",
    data: {
      labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"],
      datasets: [
        {
          label: "$",
          data: [],
          pointRadius: 2,
          backgroundColor: "#27E8D9",
          borderColor: "#27E8D9",
          pointBackgroundColor: "#27E8D9",
          hoverBackgroundColor: "#27E8D9",
          borderJoinStyle: "round",
          borderCapStyle: "round",
          borderWidth: 3,
          cubicInterpolationMode: "monotone",
        },
      ],
    },

    options: {
      responsive: true,
      maintainAspectRatio: false,
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
          left: 5,
          right: 5,
          top: 50,
          bottom: 0,
        },
      },

      scales: {
        xAxes: [
          {
            display: true,
            gridLines: {
              color: "#ffffff",
              lineWidth: 70,
            },
            ticks: {
              beginAtZero: true,
              padding: 10,
              fontColor: "#6B6B6B",
              fontFamily: "Agrandir",
            },
          },
        ],
        yAxes: [
          {
            display: true,
            gridLines: {
              color: "#EFF2F8",
            },
            ticks: {
              display: false,
              beginAtZero: true,
              //min: 1
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
        backgroundColor: "rgba(255,255,255,.9)",
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
  configurer: (config: any, ref: CanvasRenderingContext2D): object => {
    let gradient = ref.createLinearGradient(0, 0, 0, ref.canvas.clientHeight + 300);
    gradient.addColorStop(1, "#c4c4c433");
    gradient.addColorStop(0.5, "#27e8d9b0");
    config.data.datasets[0].backgroundColor = gradient;

    return config;
  },
};

export default SocialTokenChartConfig;
