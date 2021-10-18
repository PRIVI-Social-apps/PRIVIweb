import React, { useState } from "react";
import cls from "classnames";

import { createCollectionModalStyles } from "./index.styles";
import { useTypedSelector } from "store/reducers/Reducer";
import AlertMessage from "shared/ui-kit/Alert/AlertMessage";
import { Modal, PrimaryButton, SecondaryButton } from "shared/ui-kit";
import InputWithLabelAndTooltip from "shared/ui-kit/InputWithLabelAndTooltip";

enum MEDIA_TYPE {
  VIDEO_TYPE = "VIDEO_TYPE",
  LIVE_VIDEO_TYPE = "LIVE_VIDEO_TYPE",
  AUDIO_TYPE = "AUDIO_TYPE",
  LIVE_AUDIO_TYPE = "LIVE_AUDIO_TYPE",
  BLOG_TYPE = "BLOG_TYPE",
  BLOG_SNAP_TYPE = "BLOG_SNAP_TYPE",
  DIGITAL_ART = "DIGITAL_ART_TYPE",
}

const CreateCollectionModal = (props: any) => {
  const classes = createCollectionModalStyles();

  //STORE
  const user = useTypedSelector(state => state.user);

  //HOOKS
  const [collection, setCollection] = useState({
    Name: "",
    Description: "",
    Type: "",
  });
  const [status, setStatus] = useState<any>("");
  const [displayAllMedias, setDisplayAllMedias] = React.useState(false);

  const handleDisplayAllMedias = () => {
    setDisplayAllMedias(true);
    const collectionCopy = { ...collection };
    collectionCopy.Type = "";
    setCollection(collectionCopy);
  };

  /*----------------- CREATE COLLECTION FUNCTION -------------------*/
  const handleCreateCollection = () => {
    const body: any = {
      Creator: user.id,
      Title: collection.Name,
      Description: collection.Description,
      Type: collection.Type,
    };

    if (validate()) {
      //create collection

      setCollection({
        Name: "",
        Description: "",
        Type: "",
      });
    }
  };

  function validate() {
    if (collection.Name === null || collection.Name === "") {
      setStatus({
        msg: "Name required",
        key: Math.random(),
        variant: "error",
      });
      return false;
    } else if (collection.Description === null || collection.Description === "") {
      setStatus({
        msg: "Description required",
        key: Math.random(),
        variant: "error",
      });
      return false;
    } else if (collection.Type === null || collection.Type === "") {
      setStatus({
        msg: "Type required",
        key: Math.random(),
        variant: "error",
      });
      return false;
    } else return true;
  }

  /*---------------- CREATE COLLECTION MODAL COMPONENT--------------*/
  return (
    <Modal
      size="medium"
      isOpen={props.open}
      onClose={props.handleClose}
      className={classes.root}
      showCloseIcon
    >
      <div className={classes.modalContent}>
        <div className={classes.mainContent}>
          <h2>Create new collection</h2>
          <div className="label">
            Collection type
            <div className={classes.mediaTypes}>
              {Object.values(MEDIA_TYPE).map((mediaType, index) =>
                (!displayAllMedias && index < 3) || displayAllMedias ? (
                  <button
                    key={mediaType}
                    className={cls(classes.mediaButton, {
                      [classes.selected]: collection.Type === mediaType,
                    })}
                    onClick={() => {
                      const collectionCopy = { ...collection };
                      if (collection.Type === mediaType) {
                        collectionCopy.Type = "";
                      } else {
                        collectionCopy.Type = mediaType;
                      }
                      setCollection(collectionCopy);
                    }}
                  >
                    {mediaType === MEDIA_TYPE.DIGITAL_ART
                      ? `Digital Art 🖼`
                      : mediaType === MEDIA_TYPE.VIDEO_TYPE
                        ? `Video 🎬`
                        : mediaType === MEDIA_TYPE.LIVE_VIDEO_TYPE
                          ? `Live Video 📹`
                          : mediaType === MEDIA_TYPE.AUDIO_TYPE
                            ? `Audio 🔈`
                            : mediaType === MEDIA_TYPE.LIVE_AUDIO_TYPE
                              ? `Live Audio 🎤`
                              : mediaType === MEDIA_TYPE.BLOG_TYPE
                                ? `Blog ✏️`
                                : `Blog snap 📓`}
                  </button>
                ) : null
              )}
              {!displayAllMedias ? (
                <button className={classes.more} onClick={handleDisplayAllMedias}>
                  <img src={require("assets/icons/three_dots.png")} alt={"more"} />
                </button>
              ) : null}
            </div>
          </div>
          <div className={classes.inputContainer}>
            <InputWithLabelAndTooltip
              labelName="Title"
              type='text'
              inputValue={collection.Name}
              onInputValueChange={e => {
                const collectionCopy = { ...collection };
                collectionCopy.Name = e.target.value;
                setCollection(collectionCopy);
              }}
              required
              placeHolder={`Enter your collection name here`}
            />
          </div>
          <div className={classes.inputContainer}>
            <InputWithLabelAndTooltip
              labelName="Description"
              inputValue={collection.Description}
              onInputValueChange={e => {
                const collectionCopy = { ...collection };
                collectionCopy.Description = e.target.value;
                setCollection(collectionCopy);
              }}
              required
              placeHolder={`Enter your collection decription here`}
            />
          </div>
          <div className={classes.buttons}>
            <SecondaryButton size="medium" onClick={props.handleClose}>
              Back
            </SecondaryButton>
            <PrimaryButton size="medium" onClick={handleCreateCollection}>
              Create
            </PrimaryButton>
          </div>
        </div>
        {status && (
          <AlertMessage
            key={status.key}
            message={status.msg}
            variant={status.variant}
            onClose={() => setStatus(undefined)}
          />
        )}
      </div>
    </Modal>
  );
};

export default CreateCollectionModal;
