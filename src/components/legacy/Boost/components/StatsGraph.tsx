import React, { useState, useEffect } from "react";

export default function StatsGraph(props) {
  const [data, setData] = useState([{}, {}]);
  const [chartSize, setChartSize] = useState<number>(300);

  const groups = [] as any;
  const scales = [] as any;
  const numberOfScales = 4;

  useEffect(() => {
    if (props.data1.length > 0 && props.data2.length > 0) {
      let highestVal = 0;
      props.data1.forEach((data) => {
        if (data > highestVal) {
          highestVal = data;
        }
      });
      props.data2.forEach((data) => {
        if (data > highestVal) {
          highestVal = data;
        }
      });
      const d = [{}, {}];
      props.data1.forEach((data, index) => {
        if (d[0][data]) {
          d[0][`${data}-${index}`] = data / highestVal;
        } else {
          d[0][data] = data / highestVal;
        }
      });
      props.data2.forEach((data, index) => {
        if (d[1][data]) {
          d[1][`${data}-${index}`] = data / highestVal;
        } else {
          d[1][data] = data / highestVal;
        }
      });
      setData(d);
    }
    if (props.width) {
      setChartSize(props.width <= 300 ? props.width : 300);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const scale = (value) => (
    <circle
      key={`scale-${value}`}
      cx={0}
      cy={0}
      r={((value / numberOfScales) * chartSize) / 2}
      fill="transparent"
      stroke="transparent"
      strokeWidth="0.2"
    />
  );
  const polarToX = (angle, distance) =>
    Math.cos(angle - Math.PI / 2) * distance;
  const polarToY = (angle, distance) =>
    Math.sin(angle - Math.PI / 2) * distance;
  const pathDefinition = (points) => {
    if (points[0] && points[0][0]) {
      let d = "M" + points[0][0].toFixed(4) + "," + points[0][1].toFixed(4);
      for (let i = 1; i < points.length; i++) {
        d += "L" + points[i][0].toFixed(4) + "," + points[i][1].toFixed(4);
      }
      return d + "z";
    }
  };

  const shape = (columns) => (chartData, i) => {
    const data = chartData;
    return (
      <path
        key={`shape-${i}`}
        d={pathDefinition(
          columns.map((col, index) => {
            const value = data[col["key"]] ?? Object.values(chartData)[index];
            return [
              polarToX(col.angle, (value * chartSize) / 2 - 20),
              polarToY(col.angle, (value * chartSize) / 2 - 20),
            ];
          })
        )}
        strokeWidth={10}
        stroke={i === 0 ? "url(#gradientId1)" : "url(#gradientId2)"}
        fill={`transparent`}
      />
    );
  };

  const points = (points) => {
    return points
      .map((point) => point[0].toFixed(4) + "," + point[1].toFixed(4))
      .join(" ");
  };

  const axis = () => (col, i) => (
    <polyline
      key={`poly-axis-${i}`}
      points={points([
        [0, 0],
        [
          polarToX(col.angle, chartSize / 2 - 20),
          polarToY(col.angle, chartSize / 2 - 20),
        ],
      ])}
      stroke="#555"
      strokeWidth=".2"
    />
  );

  const caption = () => (col) => (
    <text
      key={`caption-of-${col.key}`}
      x={polarToX(col.angle, (chartSize / 2) * 0.95).toFixed(4)}
      y={polarToY(col.angle, (chartSize / 2) * 0.95).toFixed(4)}
      dy={10 / 2}
      fill="#081831"
      fontWeight="600"
    >
      {col.key.includes("-") ? col.key.split("-")[0] : col.key}
    </text>
  );

  for (let i = numberOfScales; i > 0; i--) {
    scales.push(scale(i));
  }

  groups.push(<g key={`scales`}>{scales}</g>);

  const middleOfChart = (chartSize / 2).toFixed(4);
  const captions = Object.keys(data[0]);
  const columns = captions.map((key, i, all) => {
    return {
      key,
      angle: (Math.PI * 2 * i) / all.length,
    };
  });

  groups.push(<g key={`group-axes`}>{columns.map(axis())}</g>);
  groups.push(<g key={`groups`}>{data.map(shape(columns))}</g>);
  groups.push(<g key={`group-captions`}>{columns.map(caption())}</g>);

  return (
    <div className="stats-graph">
      <svg style={{ height: 0 }}>
        <defs>
          <linearGradient id={"gradientId1"} x1="0%" x2="0%" y1="0%" y2="100%">
            <stop offset="0%" stopColor={"#D1996D"} stopOpacity="1" />
            <stop offset="100%" stopColor={"#DDD87C"} stopOpacity="1" />
            <stop offset="100%" stopColor={"#DE7B7B"} stopOpacity="1" />
          </linearGradient>
          <linearGradient id={"gradientId2"} x1="0%" x2="0%" y1="0%" y2="100%">
            <stop offset="0%" stopColor={"#6DD1BA"} stopOpacity="1" />
            <stop offset="100%" stopColor={"#64C89E"} stopOpacity="1" />
            <stop offset="100%" stopColor={"#7BDEDE"} stopOpacity="1" />
          </linearGradient>
        </defs>
      </svg>
      <svg
        version="1"
        xmlns="http://www.w3.org/2000/svg"
        width={chartSize}
        height={chartSize}
        viewBox={`0 0 ${chartSize} ${chartSize}`}
      >
        <g transform={`translate(${middleOfChart},${middleOfChart})`}>
          {groups}
        </g>
      </svg>
    </div>
  );
}
