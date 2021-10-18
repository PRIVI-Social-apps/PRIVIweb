import React, { useRef, useState } from "react";

import { Fade, FormControl, Tooltip } from "@material-ui/core";
import SvgIcon from "@material-ui/core/SvgIcon";

import { useCreateCommunityTokenStyles } from "../../index.styles";
import { BlockchainNets } from "shared/constants/constants";
import { StyledMenuItem, StyledSelect } from "shared/ui-kit/Styled-components/StyledComponents";

import { ReactComponent as CloseSolid } from "assets/icons/close-solid.svg";
import InputWithLabelAndTooltip from "shared/ui-kit/InputWithLabelAndTooltip";

export default function CreateCommunityTokenGeneralTab({ communityToken, setCommunityToken, setTokenPhoto }) {
  const inputRef = useRef<any>();
  const [photoImg, setTokenPhotoImg] = useState<any>(null);
  const classes = useCreateCommunityTokenStyles();

  // ------- Photo functions ----------
  const onPhotoChange = (files: any) => {
    setTokenPhoto(files[0]);
    const reader = new FileReader();
    reader.addEventListener("load", () => {
      setTokenPhotoImg(reader.result);

      let image = new Image();

      if (reader.result !== null && (typeof reader.result === "string" || reader.result instanceof String)) {
        image.src = reader.result.toString();

        //save dimensions
        image.onload = function () {
          let height = image.height;
          let width = image.width;

          const communityCopy = communityToken;
          communityCopy.dimensions = { height: height, width: width };
          communityCopy.HasImage = true;
          setCommunityToken(communityCopy);

          return true;
        };
      }
    });
    reader.readAsDataURL(files[0]);
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
    setTokenPhoto(null);
    setTokenPhotoImg(null);
  };

  return (
    <div>
      <h5>How do you want your Community Token to be called?</h5>
      <InputWithLabelAndTooltip
        labelName={"Name"}
        type="text"
        inputValue={communityToken.TokenName}
        onInputValueChange={e => {
          const communityTokenCopy = { ...communityToken };
          communityTokenCopy.TokenName = e.target.value;
          setCommunityToken(communityTokenCopy);
        }}
        required
      />
      <InputWithLabelAndTooltip
        labelName="Can you give us a Symbol for it?"
        tooltip={`Choose an identifier for you token. Must be from 3 to 6 characters`}
        type="text"
        inputValue={communityToken.TokenSymbol}
        onInputValueChange={e => {
          const communityTokenCopy = { ...communityToken };
          communityTokenCopy.TokenSymbol = e.target.value;
          setCommunityToken(communityTokenCopy);
        }}
        required
      />
      <label>Image</label>
      {photoImg ? (
        <div className="imageSquareImgTitleDescDiv">
          <div
            className="imageSquareImgTitleDesc"
            style={{
              backgroundImage: `url(${photoImg})`,
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
              backgroundSize: "cover",
              cursor: "pointer",
              width: "100% !important",
              height: "100% !important",
            }}
          />

          <div
            className="removeImageButtonSquareImgTitle cursor-pointer"
            onClick={() => {
              removeImage();
            }}
          >
            <SvgIcon>
              <CloseSolid />
            </SvgIcon>
          </div>
        </div>
      ) : (
        <div
          className="dragImageHereImgTitleDesc cursor-pointer"
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
            className="dragImageHereIconImgTitleDesc"
            src={require("assets/icons/image_icon.png")}
            alt={"camera"}
          />
          <div className="dragImageHereLabelImgTitleDesc">
            Drag Image Here{" "}
            <div className={"dragImageHereLabelImgTitleSubDesc"}>
              or <span>browse media on your device</span>
            </div>
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
        reference={inputRef}
      />

      <label style={{ marginTop: "16px" }}>
        Choose Blockchain Network
        <Tooltip
          TransitionComponent={Fade}
          TransitionProps={{ timeout: 600 }}
          arrow
          title={`Choose a blockchain network`}
        >
          <img src={require("assets/icons/info.png")} alt="info" />
        </Tooltip>
      </label>
      <FormControl variant="outlined">
        <StyledSelect
          className={classes.select}
          value={communityToken.Network}
          onChange={v => {
            const communityTokenCopy = { ...communityToken };
            communityTokenCopy.Network = v.target.value;
            setCommunityToken(communityTokenCopy);
          }}
          renderValue={() => (
            <div style={{ display: "flex", alignItems: "center" }}>
              {communityToken.Network &&
                BlockchainNets.find(blockChainNet => blockChainNet["name"] === communityToken?.Network) && (
                  <img
                    src={require(`assets/tokenImages/${communityToken.Network}.png`)}
                    style={{ marginRight: 10, width: "24px", height: "24px" }}
                  />
                )}
              {communityToken.Network}
            </div>
          )}
        >
          {BlockchainNets.map((item, index) => (
            <StyledMenuItem key={index} value={item["name"]}>
              {item["name"]}
            </StyledMenuItem>
          ))}
        </StyledSelect>
      </FormControl>
    </div>
  );
}
