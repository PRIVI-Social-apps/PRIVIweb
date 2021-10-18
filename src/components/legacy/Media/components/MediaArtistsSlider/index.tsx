import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { useSelector } from "react-redux";

import ArtistCard from "../Cards/ArtistCard";
import { RootState } from "store/reducers/Reducer";
import { MediaArtistSliderProps } from "./mediaArtistSlider.type";
import { LoadingWrapper } from "shared/ui-kit/Hocs";

import styles from "./index.module.scss";

const arrow = require("assets/icons/arrow.png");

const MediaArtistsSlider = ({ title = "Creators", showSeeAll = true }: MediaArtistSliderProps) => {
  const history = useHistory();
  const users = useSelector((state: RootState) => state.usersInfoList);

  const [usersList, setUsersList] = useState<any[]>([]);

  useEffect(() => {
    if (users && users.length > 0) {
      const usersCopy = users.filter(u => u.imageURL && u.imageURL !== "");

      setUsersList(usersCopy);
    }
  }, [users]);

  return (
    <div className={styles.carousel}>
      <div className={styles.subtitle}>
        <div>
          {title}
          {showSeeAll && (
            <span
              className={styles.btnSeeAll}
              onClick={() => {
                history.push(`/creator/`);
              }}
            >
              See All
            </span>
          )}
        </div>
        <div className={styles.buttons}>
          <button
            onClick={() => {
              document.getElementsByClassName(styles.list)[0]!.scrollLeft -= 75;
            }}
          >
            <img src={arrow} alt="" />
          </button>
          <button
            onClick={() => {
              document.getElementsByClassName(styles.list)[0]!.scrollLeft += 75;
            }}
          >
            <img src={arrow} alt="" />
          </button>
        </div>
      </div>
      <div className={styles.listContainer}>
        <LoadingWrapper loading={!users || users.length === 0}>
          <div className={styles.list}>
            {usersList.map((user, index) => (
              <ArtistCard artist={user} key={user.id ?? index} />
            ))}
          </div>
        </LoadingWrapper>
        <div className={styles.filterRight} />
      </div>
    </div>
  );
};

export default MediaArtistsSlider;
