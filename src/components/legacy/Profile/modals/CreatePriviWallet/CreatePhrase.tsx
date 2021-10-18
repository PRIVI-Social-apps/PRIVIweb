import React from "react";
import styles from "./index.module.scss";

import { ReactComponent as DangerIcon } from "assets/icons/exclamation-triangle-solid.svg";
import { ReactComponent as RandomIcon } from "assets/icons/random-solid.svg";

const CreatePhrase = ({
  onBack,
  onNext,
  phrases,
  onGenerate,
  onClose,
}: {
  onBack: () => void;
  onNext: () => void;
  phrases: string[];
  onGenerate: () => void;
  onClose: () => void;
}) => {

  return (
    <>
      <div className={styles.phrase}>
        <span className={styles.closeBtn} onClick={onClose}> close</span>
        <div className={styles.main}>
          <h1>Create new wallet</h1>
          <h3>Your Mnemonic Phrase</h3>
          <div className={styles.seed}>
            {phrases.map((phrase, idx) => (
              <span className={styles.word} key={`${phrase}${idx}`}>{`${idx + 1
                }. ${phrase}`}</span>
            ))}
          </div>
          <button type="button" className={styles.random} onClick={onGenerate}>
            <RandomIcon />
          Random
        </button>
          <button type="button" onClick={onNext}>
            I Wrote Down My Mnemonic Phrase
        </button>
          <button type="button" className={styles.goBack} onClick={onBack}>
            Go back
        </button>
          <div className={styles.danger}>
            <DangerIcon />
            <div className={styles.comment}>
              <b>DO NOT FORGET</b>
            Save your mnemonic phrase.
            <br />
            You will need this to access your wallet.
          </div>
          </div>
        </div>
        <div className={styles.other}>
          <i className={styles.image}></i>
          <span>ART CREDIT</span>
          <i>@Us3rNextboot</i>
        </div>
      </div >
    </>
  );
};

export default CreatePhrase;
