import React, { useRef, useState } from "react";
import axios from "axios";

import { Grid } from "@material-ui/core";
import SvgIcon from "@material-ui/core/SvgIcon";

import { createPlayListModalStyles } from './index.styles';
import { Modal, PrimaryButton } from "shared/ui-kit";
import { ReactComponent as CloseSolid } from "assets/icons/close-solid.svg";
import InputWithLabelAndTooltip from "shared/ui-kit/InputWithLabelAndTooltip";
import URL from "shared/functions/getURL";
import { useSelector } from "react-redux";
import { RootState } from "store/reducers/Reducer";
import AlertMessage from "shared/ui-kit/Alert/AlertMessage";

const imageIcon = require("assets/icons/image_icon_dark.png");

export default function CreatePlaylistModal({ open, handleClose }) {
  //HOOKS
  const inputRef = useRef<any>();

  const [playlist, setPlaylist] = useState<any>({
    Title: "",
    Description: "",
  });

  const [photo, setPhoto] = useState<any>(null);
  const [photoImg, setPhotoImg] = useState<any>(null);

  const [successMsg, setSuccessMsg] = useState<string>("");
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [openSuccess, setOpenSuccess] = useState(false);
  const [openError, setOpenError] = useState(false);
  const userSelector = useSelector((state: RootState) => state.user);

  const classes = createPlayListModalStyles({photoImg: photoImg});

  const handleSaveChanges = async () => {
    try {
      if (verify()) {
        if (photo) {
          let now = Date.now();
          const formData = new FormData();
          formData.append("image", photo, "" + now);
          const config = {
            headers: {
              "content-type": "multipart/form-data",
            },
          };
          let resp = await axios.post(`${URL()}/media/changePlaylistPhoto`, formData, config);
          let newPlaylist = { ...playlist };

          if (resp.data.success) {
            const url = resp.data.data;
            newPlaylist.Creator = userSelector.id;
            newPlaylist.HasPhoto = true;
            newPlaylist.ImageUrl = resp.data.data;
            newPlaylist.Private = false;
            resp = await axios.post(`${URL()}/media/createPlaylist`, newPlaylist);
            if (resp.data.success) {
              setPlaylist({ ...newPlaylist });
              setSuccessMsg("Playlist created!");
              handleClickSuccess();
              handleClose();
            }
          }
        }
      }
    } catch (err) {
      setErrorMsg(err.message);
    }
  };

  const verify = () => {
    if (!playlist.Title || playlist.Title === "") {
      setErrorMsg("Name field invalid. Please fill in the value.");
      handleClickError();
      return false;
    } else return true;
  };

  const onPhotoChange = (files: any) => {
    setPhoto(files[0]);
    const reader = new FileReader();

    reader.addEventListener("load", () => {
      setPhotoImg(reader.result);
    });
    reader.readAsDataURL(files[0]);
  };

  const handleClickSuccess = () => {
    setOpenSuccess(true);
    setTimeout(() => {
      setOpenSuccess(false);
    }, 3000);
  };

  const handleClickError = () => {
    setOpenError(true);
    setTimeout(() => {
      setOpenError(false);
    }, 3000);
  };

  const handleCloseSuccess = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenSuccess(false);
  };

  const handleCloseError = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenError(false);
  };

  const fileInput = e => {
    e.preventDefault();
    console.log(e);
    const files = e.target.files;
    if (files.length) {
      handleFiles(files);
    }
  };

  const dragOver = e => {
    e.preventDefault();
  };

  const dragEnter = e => {
    e.preventDefault();
  };

  const dragLeave = e => {
    e.preventDefault();
  };

  const fileDrop = e => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files.length) {
      handleFiles(files);
    }
  };

  const handleFiles = (files: any) => {
    for (let i = 0; i < files.length; i++) {
      if (validateFile(files[i])) {
        onPhotoChange(files);
      } else {
        files[i]["invalid"] = true;
        // Alert invalid image
      }
    }
  };

  const validateFile = file => {
    const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/x-icon"];
    if (validTypes.indexOf(file.type) === -1) {
      return false;
    }
    return true;
  };

  const removeImage = () => {
    setPhoto(null);
    setPhotoImg(null);
  };

  return (
    <Modal className={classes.root} size="medium" isOpen={open} onClose={handleClose} showCloseIcon>
      <div className={classes.content}>
        <h5>Create Playlist</h5>

        <Grid container spacing={2} direction="row" alignItems="flex-start" justify="flex-start">
          <Grid item xs={12} md={6}>
            {photoImg ? (
              <div className={classes.imageSquareImgTitleDescDiv}>
                <div className={classes.imageSquareImgTitleDesc}/>
                <div
                  className={classes.removeImageButtonSquareImgTitle}
                  onClick={removeImage}
                >
                  <SvgIcon>
                    <CloseSolid />
                  </SvgIcon>
                </div>
              </div>
            ) : (
              <div
                className={classes.dragImageHereImgTitleDesc}
                onClick={() => {
                  if (inputRef && inputRef.current) {
                    inputRef.current.click();
                  }
                }}
                onDragOver={dragOver}
                onDragEnter={dragEnter}
                onDragLeave={dragLeave}
                onDrop={fileDrop}
              >
                <img
                  className={classes.dragImageHereIconImgTitleDesc}
                  src={imageIcon}
                  alt={"camera"}
                />
                <div className={classes.dragImageHereLabelImgTitleDesc}>
                  Drag Image Here
                  <div className={classes.dragImageHereLabelImgTitleSubDesc}>
                    or <span>browse media on your device</span>
                  </div>
                </div>
              </div>
            )}
            <InputWithLabelAndTooltip
              hidden
              type="file"
              style={{ display: "none" }}
              accept="image/*"
              onInputValueChange={fileInput}
              reference={inputRef}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <label>Name</label>
            <InputWithLabelAndTooltip
              inputValue={playlist.Title}
              type="text"
              placeHolder="Playist Title..."
              onInputValueChange={e => {
                setPlaylist({
                  ...playlist,
                  Title: e.target.value,
                });
              }}
              required
            />
            <label>Description</label>
            <InputWithLabelAndTooltip
              inputValue={playlist.Description}
              placeHolder="Write an optional description..."
              onInputValueChange={e => {
                setPlaylist({
                  ...playlist,
                  Description: e.target.value,
                });
              }}
              required
            />
          </Grid>
        </Grid>

        <PrimaryButton onClick={handleSaveChanges} size="medium">
          Create Playlist
        </PrimaryButton>
      </div>

      {openSuccess && (
        <AlertMessage
          key={Math.random()}
          message={successMsg}
          variant="success"
          onClose={handleCloseSuccess}
        />
      )}
      {openError && (
        <AlertMessage
          key={Math.random()}
          message={errorMsg}
          variant="error"
          onClose={handleCloseError}
        />
      )}
    </Modal>
  );
}
