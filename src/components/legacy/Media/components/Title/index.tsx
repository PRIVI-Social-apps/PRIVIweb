import React, { useState, useEffect } from "react";
import useWindowDimensions from "shared/hooks/useWindowDimensions";
import styles from "./index.module.scss";

export default function Title() {
  let pathName = window.location.href;

  const { width } = useWindowDimensions();
  const isSignedIn = () => {
    return !!sessionStorage.getItem("token");
  };

  const [extraMargin, setExtraMargin] = useState<number>(0);

  useEffect(() => {
    if (isSignedIn()) {
      if (pathName.includes("profile")) {
        setExtraMargin(126);
      } else {
        setExtraMargin(80);
      }
    } else {
      if (pathName.includes("profile")) {
        setExtraMargin(46);
      } else {
        setExtraMargin(0);
      }
    }
  }, []);

  return (
    <div className={styles.title}>
      <h1>
        Welcome to{` `}
        <i>
          <b>PRIVI</b>
        </i>
      </h1>
      <div
        className={styles.ellipse}
        style={{
          marginLeft:
            width >= 980 + extraMargin
              ? 530
              : (width < 980 + extraMargin && width >= 753 + extraMargin) || width <= 540 + extraMargin
              ? -30
              : width < 753 + extraMargin && width > 541 + extraMargin
              ? 95
              : -30,
        }}
      />
      <h3>
        The place where you can <b>create and monetize your content</b>
      </h3>
    </div>
  );
}
