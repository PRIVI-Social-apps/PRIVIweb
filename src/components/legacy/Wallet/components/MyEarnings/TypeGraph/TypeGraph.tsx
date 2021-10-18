import React, { useEffect, useState } from "react";
import RadialChart from "./RadialChart";
import "./TypeGraph.css";

enum MEDIA_TYPE {
  VIDEO_TYPE = "VIDEO_TYPE",
  LIVE_VIDEO_TYPE = "LIVE_VIDEO_TYPE",
  AUDIO_TYPE = "AUDIO_TYPE",
  LIVE_AUDIO_TYPE = "LIVE_AUDIO_TYPE",
  BLOG_TYPE = "BLOG_TYPE",
  BLOG_SNAP_TYPE = "BLOG_SNAP_TYPE",
  DIGITAL_ART = "DIGITAL_ART_TYPE",
}

const PrintTypeGraph = ({typesData}) => {
  const [typesList, setTypesList] = useState<any[]>([]);

  useEffect(() => {
    const tList = [] as any;
    //1. get the total of all medias
    let total = 0;
    typesData.forEach((type) => {
      total = total + type.total;
    });

    //2. sort data and
    typesData.forEach((type) => {
      if (type.total > 0)
        tList.push({
          name:
            type.type === MEDIA_TYPE.VIDEO_TYPE
              ? "Video"
              : type.type === MEDIA_TYPE.LIVE_VIDEO_TYPE
                ? "Live Video"
                : type.type === MEDIA_TYPE.AUDIO_TYPE
                  ? "Audio"
                  : type.type === MEDIA_TYPE.LIVE_AUDIO_TYPE
                    ? "Live Audio"
                    : type.type === MEDIA_TYPE.BLOG_TYPE
                      ? "Blog"
                      : type.type === MEDIA_TYPE.BLOG_SNAP_TYPE
                        ? "Blog Snap"
                        : "Digital Art",
          total: (type.total / total) * 100,
        });
    });

    //sort data
    tList.sort((a, b) => b.total - a.total);
    setTypesList(tList);
  }, [typesData]);

  return (
    <div className={"type-graph"}>
      <div className={"content"}>
        <RadialChart list={typesList} />
        <div className={"legend"}>
          {typesList.map((type, index) => (
            <div className="row" key={`type-${index}`}>
              <span>
                <div
                  className={"colorBox"}
                  style={{
                    background:
                      type.name === "Video"
                        ? "linear-gradient(180deg, #8987E7 0%, rgba(137, 135, 231, 0) 100%)"
                        : type.name === "Live Video"
                          ? "linear-gradient(180deg, #559AF4 0%, rgba(85, 154, 244, 0) 100%)"
                          : type.name === "Audio"
                            ? "linear-gradient(180deg, #FFC71B 0%, rgba(255, 199, 27, 0) 100%)"
                            : type.name === "Live Audio"
                              ? "linear-gradient(180deg, #27E8D9 0%, rgba(39, 232, 217, 0) 100%)"
                              : type.name === "Blog"
                                ? "linear-gradient(180deg, #FF79D1 0%, rgba(39, 232, 217, 0) 100%)"
                                : type.name === "Blog Snap"
                                  ? "linear-gradient(180deg, #DB00FF 0%, rgba(39, 232, 217, 0) 100%)"
                                  : "linear-gradient(180deg, #34C759 0%, rgba(39, 232, 217, 0) 100%)",
                  }}
                />
                {type.name}
              </span>
              <span>{`${type.total.toFixed(0)}%`}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PrintTypeGraph;
