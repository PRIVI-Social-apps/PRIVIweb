const governanceChartConfig = token => {
  return {
    config: {
      type: "line",
      data: {
        labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"],
        datasets: [
          {
            label: token,
            data: [],
            pointRadius: 2,
            backgroundColor: "#87d99e",
            borderColor: "#87d99e",
            pointBackgroundColor: "#87d99e",
            hoverBackgroundColor: "#87d99e",
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
              display: false,
              gridLines: {
                display: false,
                drawBorder: false,
                drawOnChartArea: false,
              },
              ticks: {
                beginAtZero: true,
                //padding: 10,
                fontColor: "#606060",
                fontFamily: "Agrandir",
              },
            },
          ],
          yAxes: [
            {
              display: false,
              gridLines: {},
              ticks: {
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
              return `${tooltipItem.xLabel}: ${tooltipItem.yLabel.toFixed(4)}${token}`;
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
      let gradient = ref.createLinearGradient(0, 0, 0, ref.canvas.clientHeight + 200);
      gradient.addColorStop(0, "rgb(127,236,154)");
      gradient.addColorStop(0.4, "rgb(225,253,235)");
      config.data.datasets[0].backgroundColor = gradient;

      return config;
    },
  };
};

export default governanceChartConfig;
