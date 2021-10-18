import React from "react";
import { useHistory } from "react-router-dom";

import styles from "./index.module.scss";
import cls from "classnames";

const ArtistCard = ({ artist }) => {
  const history = useHistory();

  return (
    <div
      className={styles.card}
      onClick={() => {
        history.push(`/profile/${artist.id}`);
      }}
    >
      <div
        className={styles.userImage}
        style={{
          backgroundImage: artist.imageURL && artist.imageURL !== "" ? `url(${artist.imageURL})` : "none",
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      {artist.online ? <div className={styles.online} /> : null}
      <div className={styles.userName}>{`${artist.name ?? ""}`}</div>
      <div className={styles.userSlug}>{`@${artist.urlSlug ?? ""}`}</div>
      <div className={styles.tags}>
        {artist.verified && artist.verified === true ? (
          <img src={require("assets/icons/verified.png")} alt={`tick`} className={styles.tag} />
        ) : null}
        <div className={cls(styles.tag, { [styles.purple]: artist.level > 0 })}>
          {`level ${artist.level ?? 1}`}
        </div>
      </div>
    </div>
  );
};

export default ArtistCard;
