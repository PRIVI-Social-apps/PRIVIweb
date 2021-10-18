import React, { useRef } from "react";
import "./BlogDescription.css";
import Grid from "@material-ui/core/Grid";

import SvgIcon from "@material-ui/core/SvgIcon";
import { ReactComponent as CloseSolid } from "assets/icons/close-solid.svg";
import InputWithLabelAndTooltip from "shared/ui-kit/InputWithLabelAndTooltip";
const infoIcon = require("assets/icons/info.svg");
const imageIcon = require("assets/icons/image_icon.png");
const imageIconDark = require("assets/icons/image_icon_dark.png");
const uploadIcon = require("assets/icons/upload.png");

const BlogDescription = (props: any) => {
  const inputRef: any = useRef([]);
  const photoInputRef = useRef<any>();

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

  const fileInput = e => {
    e.preventDefault();
    console.log(e);
    const files = e.target.files;
    if (files.length) {
      handleFiles(files);
    }
  };

  const handleFiles = (files: any) => {
    for (let i = 0; i < files.length; i++) {
      if (validateFile(files[i])) {
        onPhotoChange(files);
        if (props.setterHasPhoto !== undefined) {
          props.setterHasPhoto(true);
        }
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

  const onPhotoChange = (files: any) => {
    props.setterPhoto(files[0]);
    const reader = new FileReader();
    reader.addEventListener("load", () => {
      props.setterPhotoImg(reader.result);
      if (props.setterHasPhoto !== undefined) {
        props.setterHasPhoto(true);
      }
    });
    reader.readAsDataURL(files[0]);
  };

  const removeImage = () => {
    props.setterPhoto(null);
    props.setterPhotoImg(null);
    if (props.setterHasPhoto !== undefined) {
      props.setterHasPhoto(false);
    }
  };

  const uploadVideo = () => {
    let inputElement = document.createElement("input");
    inputElement.type = "file";
    inputElement.accept = "video/*";
    // set onchange event to call callback when user has selected file
    inputElement.addEventListener("change", fileInputMessageVideo);
    // dispatch a click event to open the file dialog

    inputElement.dispatchEvent(new MouseEvent("click"));
  };

  const fileInputMessageVideo = e => {
    e.preventDefault();
    const files = e.target.files;
    if (files.length) {
      handleFilesVideo(files);
    }
  };

  const handleFilesVideo = (files: any) => {
    for (let i = 0; i < files.length; i++) {
      console.log(files[i].size);
      if (files[i].size / 1024 <= 51200) {
        if (validateFileVideo(files[i])) {
          onChangeVideo(files[i]);
        } else {
          files[i]["invalid"] = true;
          console.log("No valid file");
        }
      } else {
      }
    }
  };
  const validateFileVideo = file => {
    const validTypes = ["video/mp4", "video/webm", "video/ogg", "video/quicktime"];
    if (validTypes.indexOf(file.type) === -1) {
      return false;
    }
    return true;
  };
  const onChangeVideo = (file: any) => {
    props.setterVideo(file);
  };

  return (
    <Grid
      container
      direction={props.imageSize === 12 ? "column" : "row"}
      justify="flex-start"
      alignItems="stretch"
    >
      <Grid xs={12} md={props.imageSize === 12 ? 12 : 6} style={{ padding: props.imageSize === 12 ? 0 : 10 }}>
        <div>
          <InputWithLabelAndTooltip
            labelName={props.titleTitle}
            overriedClasses="textFieldImgTitleDesc"
            tooltip={""}
            type="text"
            reference={inputRef.current[props.index]}
            inputValue={props.title || ""}
            placeHolder={props.namePlaceholder}
            onInputValueChange={e => {
              let title = e.target.value;
              props.setterTitle(title);
            }}
            disabled={!props.canEdit}
            style={{
              width: "100%",
            }}
          />
        </div>
        <div>
          <InputWithLabelAndTooltip
            labelName={props.descTitle}
            overriedClasses="textAreaImgTitleDesc"
            tooltip={""}
            inputValue={props.desc || ""}
            placeHolder={props.descPlaceholder}
            onInputValueChange={e => {
              let desc = e.target.value;
              props.setterDesc(desc);
            }}
            disabled={!props.canEdit}
          />
        </div>
        <div>
          <div className="flexRowInputsImgTitleDesc">
            <div className="infoHeaderImgTitleDesc">{props.videoTitle}</div>
            <img className="infoIconImgTitleDesc" src={infoIcon} alt={"info"} />
          </div>
          <div
            className="textFieldImgTitleDesc"
            style={{
              width: "100%",
              position: "relative",
            }}
            onClick={uploadVideo}
          >
            {props.video ? (
              <div
                className="dragImageHereIconImgTitleDesc"
                style={{
                  position: "absolute",
                  left: 10,
                  top: 10,
                }}
              >
                {props.video}
              </div>
            ) : (
              <img
                className="dragImageHereIconImgTitleDesc"
                src={uploadIcon}
                alt={"upload"}
                style={{
                  position: "absolute",
                  left: 10,
                  top: 10,
                  width: 25,
                  height: 20,
                }}
              />
            )}
          </div>
        </div>
      </Grid>
      <Grid
        xs={6}
        md={props.imageSize === 12 ? 12 : 6}
        style={{ padding: props.imageSize === 12 ? 0 : 10, display: "flex", flexDirection: "column" }}
      >
        {props.photoTitle ? (
          <div className="flexRowInputsImgTitleDesc" style={{ marginBottom: "8px" }}>
            <div className="infoHeaderImgTitleDesc">{props.photoTitle}</div>
            <img className="infoIconImgTitleDesc" src={infoIcon} alt={"info"} />
          </div>
        ) : null}
        {props.photoImg ? (
          <div className="imageSquareImgTitleDescDiv">
            <div
              className="imageSquareImgTitleDesc"
              style={{
                backgroundImage: `url(${props.photoImg})`,
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                backgroundSize: "contain",
              }}
            ></div>
            <div
              className="removeImageButtonSquareImgTitle"
              onClick={removeImage}
              style={
                props.closeIconRightPx && props.descTitle
                  ? {
                    right: props.closeIconRightPx + "px",
                    top: "10px",
                  }
                  : props.closeIconRightPx && !props.descTitle
                    ? {
                      right: props.closeIconRightPx + "px",
                    }
                    : {}
              }
            >
              <SvgIcon>
                <CloseSolid />
              </SvgIcon>
            </div>
          </div>
        ) : (
          <div
            className="imageUploaderBox"
            onClick={() => {
              if (photoInputRef && photoInputRef.current) {
                photoInputRef.current.click();
              }
            }}
            onDragOver={dragOver}
            onDragEnter={dragEnter}
            onDragLeave={dragLeave}
            onDrop={fileDrop}
            style={{
              flexDirection: props.imageSize === 12 ? "row" : "column",
              justifyContent: props.imageSize === 12 ? "flex-start" : "center",
            }}
          >
            <img
              className="dragImageHereIconImgTitleDesc"
              src={props.imageSize === 12 ? imageIconDark : imageIcon}
              alt={"camera"}
              style={{
                width: props.imageSize === 12 ? 48.67 : 40,
                height: props.imageSize === 12 ? 48 : 32,
                marginBottom: props.imageSize === 12 ? 0 : 16,
                marginRight: props.imageSize === 12 ? 30 : 0,
              }}
            />
            <div className="dragImageHereLabelImgTitleDesc">
              Drag Image Here
              {props.imageSize === 12 ? (
                <div className={"dragImageHereLabelImgTitleSubDesc"}>
                  or <span>browse media on your device</span>
                </div>
              ) : null}
            </div>
          </div>
        )}
        <InputWithLabelAndTooltip
          type="file"
          hidden
          onInputValueChange={e => fileInput(e)}
          style={{
            display: "none",
          }}
          reference={photoInputRef} />
      </Grid>
    </Grid>
  );
};

export default BlogDescription;
