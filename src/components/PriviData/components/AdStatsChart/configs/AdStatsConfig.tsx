const AdStatsChartConfig = {
  config: {
    data: {
      labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
      datasets: [
        {
          type: "line",
          label: "$",
          data: [
            { x: "Jan", y: 1 },
            { x: "Feb", y: 10 },
            { x: "Mar", y: 20 },
            { x: "Apr", y: 15 },
            { x: "May", y: 13 },
            { x: "Jun", y: 10 },
          ],
          pointRadius: 2,
          backgroundColor: "rgba(52, 51, 96, 0.2)",
          borderColor: "rgba(52, 51, 96, 0.2)",
          pointBackgroundColor: "rgba(52, 51, 96, 0.2)",
          hoverBackgroundColor: "rgba(52, 51, 96, 0.2)",
          borderWidth: 3,
        },
      ],
    },

    options: {
      responsive: true,
      maintainAspectRatio: false,
      chartArea: {
        backgroundColor: "#17172D",
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
            display: true,
            gridLines: {
              color: "rgba(52, 51, 96, 0.2);",
              lineWidth: 50,
            },
            ticks: {
              autoSkip: true,
              fontColor: "#6B6B6B",
              fontFamily: "Agrandir",
            },
          },
        ],
        yAxes: [
          {
            display: true,
            gridLines: {
              color: "rgba(52, 50, 104, 0.74)",
            },
            ticks: {
              display: false,
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
  configurer: (config: any, ref: CanvasRenderingContext2D): object => {
    let gradient = ref.createLinearGradient(0, 0, 0, ref.canvas.clientHeight + 300);
    gradient.addColorStop(1, "#c4c4c433");
    gradient.addColorStop(0.5, "#27e8d9b0");
    config.data.datasets[0].backgroundColor = gradient;

    return config;
  },
};

export default AdStatsChartConfig;
