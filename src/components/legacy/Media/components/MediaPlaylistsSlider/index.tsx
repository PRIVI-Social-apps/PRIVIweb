import React from "react";
import PlaylistCard from "../Cards/PlaylistCard";

import { LoadingWrapper } from "shared/ui-kit/Hocs";

import styles from "./index.module.scss";

const arrow = require("assets/icons/arrow.png");

const MediaPlaylistsSlider = ({ playlists }) => {
  return (
    <div className={styles.carousel}>
      <div className={styles.subtitle}>
        Playlists
        <div className={styles.buttons}>
          <button
            onClick={() => {
              document.getElementsByClassName(styles.list)[0]!.scrollLeft -= 200;
            }}
          >
            <img src={arrow} alt="" />
          </button>
          <button
            onClick={() => {
              document.getElementsByClassName(styles.list)[0]!.scrollLeft += 200;
            }}
          >
            <img src={arrow} alt="" />
          </button>
        </div>
      </div>
      <div className={styles.listContainer}>
        <LoadingWrapper loading={!playlists || playlists.length === 0}>
          <div className={styles.list}>
            {playlists.map((playlist, index) => (
              <PlaylistCard playlist={playlist} key={`playlist-${index}`} />
            ))}
          </div>
        </LoadingWrapper>
        <div className={styles.filterRight} />
      </div>
    </div>
  );
};

export default MediaPlaylistsSlider;
