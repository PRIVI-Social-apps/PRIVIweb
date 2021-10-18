import React, { useEffect, useState } from "react";
import RadialChart from "./RadialChart";
import "./MediaCardGraph.css";

const PrintMediaCardGraph = (creator, forSale, sold) => {
  const [data, setData] = useState<any[]>([{ name: "", total: 0 }]);

  useEffect(() => {
    const tList = [] as any;
    //1. get the total of all medias
    let total = creator + forSale + sold;

    tList.push(
      { name: "Creator Fraction", total: (creator / total) * 100 },
      { name: "Fractions For Sale", total: (forSale / total) * 100 },
      { name: "Sold Fractions", total: (sold / total) * 100 }
    );

    tList.sort((a, b) => b.total - a.total);

    setData(tList);
  }, [creator, forSale, sold]);

  return (
    <div className={"media-graph"}>
      <div className={"content"}>
        <RadialChart list={data} />
        <div className={"legend"}>
          {data.map((elem, index) => (
            <div className="row" key={`elem-${index}`}>
              <span>
                <div
                  className={"colorBox"}
                  style={{
                    background: elem.name.includes("Creator")
                      ? "linear-gradient(180deg, #8987E7 0%, rgba(137, 135, 231, 0) 100%)"
                      : elem.name.includes("Sale")
                      ? "linear-gradient(180deg, #FFC71B 0%, rgba(255, 199, 27, 0.2) 100%)"
                      : "linear-gradient(180deg, #27E8D9 0%, rgba(39, 232, 217, 0.2) 100%)",
                  }}
                />
                {elem.name}
              </span>
              <span>{`${elem.total.toFixed(0)}%`}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PrintMediaCardGraph;
