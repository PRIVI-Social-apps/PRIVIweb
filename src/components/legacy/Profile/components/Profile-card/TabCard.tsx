import React, { useState, useEffect } from "react";
import "./TabCard.css";

export default function TabCard(props) {
  // const [imageURL, setImageURL] = useState<string>("");
  const [cardColor, setCardColor] = useState<string>("");

  useEffect(() => {
    if (props.label) {
      if (props.label === "Social") {
        setCardColor("#9ab9c280 ");
      } else if (props.label === "FT Pods") {
        setCardColor("#aad3bf80");
      } else if (props.label === "Digital Pods") {
        setCardColor("#d0e3cc80");
      } else if (props.label === "Credit") {
        setCardColor("#ebe1b580");
      } else if (props.label === "Media") {
        setCardColor("#edcda180");
      } else if (props.label === "Work in progress") {
        setCardColor("#e7a78080");
      } else if (props.label === "Community") {
        setCardColor("F29375");
      } else if (props.label === "Social Token") {
        setCardColor("#E9D3F7");
      } else if (props.label === "Badges") {
        setCardColor("#FFE7C7");
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={`tab-card ${props.selected ? "selected" : ""}`} onClick={props.setTabsCardsValue}>
      <p>{props.label}</p>
      <span>{props.length !== null ? `${props.length ?? 0}` : ""}</span>
    </div>
  );
}
