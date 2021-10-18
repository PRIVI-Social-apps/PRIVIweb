import React, { useContext, useState } from "react";
import { Modal } from "@material-ui/core";
import MainPageContext from "components/legacy/Media/context";
import { TypicalLayout } from "../elements";

import styles from "./index.module.scss";

const EthDigitalArtDisplay = () => {
  const { open, selectedMedia } = useContext(MainPageContext);

  const [digitalArtModalVisible, setDigitalArtModalVisible] = useState(false);

  if (selectedMedia && open)
    return (
      <TypicalLayout type="digitalArt">
        {selectedMedia.url && selectedMedia.url !== "" ? (
          <div className={styles.digitalArtImageContainer}>
            {selectedMedia.url.indexOf("mp4") === -1 ? (
              <img
                onClick={() => setDigitalArtModalVisible(true)}
                className={styles.digitalArtImage}
                src={selectedMedia.url}
              />
            ) : (
              <video
                onClick={() => setDigitalArtModalVisible(true)}
                src={selectedMedia.url}
                className={styles.digitalArtImage}
                autoPlay
                loop
                muted
              />
            )}
          </div>
        ) : null}

        <Modal
          open={digitalArtModalVisible}
          className={styles.digitalArtDisplayModal}
          onClose={() => setDigitalArtModalVisible(false)}
        >
          <div>
            <div className={styles.modalExitContainer}>
              <img
                onClick={() => setDigitalArtModalVisible(false)}
                src={require("assets/icons/cross_gray.png")}
                alt={"x"}
              />
            </div>
            <div className={styles.modalImageContainer}>
              {selectedMedia.url.indexOf("mp4") === -1 ? (
                <img src={selectedMedia.url} className={styles.modalImage} />
              ) : (
                <video src={selectedMedia.url} className={styles.modalImage} autoPlay loop muted />
              )}
            </div>
          </div>
        </Modal>
      </TypicalLayout>
    );
  else return null;
};

export default EthDigitalArtDisplay;
