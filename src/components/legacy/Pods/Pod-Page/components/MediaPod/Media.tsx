import React, { useEffect, useState } from "react";
import URL from "shared/functions/getURL";
import "./Media.css";
import MediaCard from "./MediaCard";
import axios from "axios";
import { GenericGrid } from "shared/ui-kit/GenericGrid/GenericGrid";

export default function Media(props) {
  const columnsCountBreakPoints = {800 : 2};
  const [tokenNameToSymbolMap, setTokenNameToSymbolMap] = useState<{
    [key: string]: string;
  }>({
    Balancer: "BAL",
    "Privi Coin": "PRIVI",
    "Base Coin": "BC",
    "Data Coin": "DC",
  });

  // get token list from backend
  useEffect(() => {
    if (Object.keys(tokenNameToSymbolMap).length === 4) {
      axios.get(`${URL()}/wallet/getCryptosRateAsList`).then(res => {
        const resp = res.data;
        if (resp.success) {
          const tokenObjList: any[] = [];
          const data = resp.data;
          data.forEach(rateObj => {
            tokenObjList.push({ token: rateObj.token, name: rateObj.name });
          });

          const newTokenNameSymbolMap: { [key: string]: string } = {};
          tokenObjList.forEach(tokenObj => {
            newTokenNameSymbolMap[tokenObj.name] = tokenObj.token;
          });

          setTokenNameToSymbolMap(newTokenNameSymbolMap);
        }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tokenNameToSymbolMap]);

  if (props.medias && props.medias.length > 0)
    return (
      <div className="media-tab">
        <GenericGrid columnsCountBreakPoints={columnsCountBreakPoints}>
          {props.medias.map((media, index) =>
            <MediaCard
              media={media}
              refreshPod={props.refreshPod}
              key={`media-card-${index}`}
              pod={props.pod}
              podId={props.podId}
              tokenNameToSymbolMap={tokenNameToSymbolMap}
            />
          )}
        </GenericGrid>
      </div>
    );
  else return null;
}
