import React, { useRef, useState } from "react";

import { Fade, Grid, Tooltip, Box } from "@material-ui/core";
import SvgIcon from "@material-ui/core/SvgIcon";

import { BlockchainNets } from "shared/constants/constants";

import { ReactComponent as CloseSolid } from "assets/icons/close-solid.svg";
import InputWithLabelAndTooltip from "shared/ui-kit/InputWithLabelAndTooltip";
import { TokenSelect } from "shared/ui-kit/Select/TokenSelect";

export default function CreateDAOTokenGeneralTab({
  communityToken,
  setCommunityToken,
  setTokenPhoto,
  fundingTokenSelectable,
  tokenList,
}: {
  communityToken: any;
  setCommunityToken: any;
  setTokenPhoto: any;
  fundingTokenSelectable?: boolean;
  tokenList?: any;
}) {
  const [photoImg, setTokenPhotoImg] = useState<any>(null);

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
    <Box color="white" fontSize="18px">
      <Box mb={3}>How do you want your Community Token to be called?</Box>
      <Grid container spacing={3} direction="row">
        <Grid item xs={12} md={6}>
          <>
            <Box mb={2}>
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
                theme="dark"
              />
            </Box>

            <InputWithLabelAndTooltip
              labelName={fundingTokenSelectable && tokenList ? "Symbol" : "Can you give us a Symbol?"}
              tooltip={`Choose an identifier for you token. Must be from 3 to 6 characters`}
              type="text"
              inputValue={communityToken.TokenSymbol}
              onInputValueChange={e => {
                const communityTokenCopy = { ...communityToken };
                communityTokenCopy.TokenSymbol = e.target.value;
                setCommunityToken(communityTokenCopy);
              }}
              required
              theme="dark"
            />

            {fundingTokenSelectable && tokenList && (
              <Box mt={2}>
                <Box mt={2} mb={1}>
                  <label>
                    Funding Token
                    <Tooltip
                      TransitionComponent={Fade}
                      TransitionProps={{ timeout: 600 }}
                      arrow
                      title={`Choose a Funding Token`}
                    >
                      <img src={require("assets/icons/info_white.png")} alt="info" />
                    </Tooltip>
                  </label>
                </Box>
                <TokenSelect
                  value={communityToken.FundingToken}
                  onChange={v => {
                    const communityTokenCopy = { ...communityToken };
                    communityTokenCopy.FundingToken = v.target.value;
                    setCommunityToken(communityTokenCopy);
                  }}
                  tokens={tokenList}
                  theme="dark"
                />
              </Box>
            )}
          </>
        </Grid>
        <Grid item xs={12} md={6}>
          <>
            <Box mb={1}>Image</Box>
            {photoImg ? (
              <div
                style={{
                  height: fundingTokenSelectable && tokenList ? "264px" : "162px",
                  position: "relative",
                }}
              >
                <div
                  style={{
                    backgroundImage: `url(${photoImg})`,
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                    backgroundSize: "cover",
                    width: "100%",
                    height: "100%",
                  }}
                />

                <div
                  style={{
                    cursor: "pointer",
                    position: "absolute",
                    top: 0,
                    right: 0,
                    marginRight: "8px",
                    marginTop: "8px",
                  }}
                  onClick={() => {
                    removeImage();
                  }}
                  color="white"
                >
                  <SvgIcon>
                    <CloseSolid />
                  </SvgIcon>
                </div>
              </div>
            ) : (
              <Box
                display="flex"
                flexDirection="column"
                width="100%"
                height={fundingTokenSelectable && tokenList ? "264px" : "162px"}
                alignItems="center"
                justifyContent="center"
                onClick={() => {
                  let selectPhoto = document.getElementById("selectPhoto");
                  if (selectPhoto) {
                    selectPhoto.click();
                  }
                }}
                onDragOver={dragOver}
                onDragEnter={dragEnter}
                onDragLeave={dragLeave}
                onDrop={fileDrop}
                style={{
                  cursor: "pointer",
                  background: "rgba(255, 255, 255, 0.16)",
                  border: "1px solid #FFFFFF",
                }}
              >
                <img
                  src={require("assets/icons/image_icon_white.png")}
                  alt={"camera"}
                  width={40}
                  height={31}
                  style={{ marginBottom: "16px" }}
                />
                <Box textAlign="center">
                  Drag Image Here
                  <Box fontSize={"14px"} mt={1} display="flex">
                    or{" "}
                    <Box color="#707582" ml={1}>
                      browse media on your device
                    </Box>
                  </Box>
                </Box>
              </Box>
            )}
            <input
              id="selectPhoto"
              hidden
              type="file"
              style={{ display: "none" }}
              accept="image/*"
              onChange={fileInput}
            />
          </>
        </Grid>
      </Grid>

      <Box mt={2} mb={1}>
        <label>
          Choose Blockchain Network
          <Tooltip
            TransitionComponent={Fade}
            TransitionProps={{ timeout: 600 }}
            arrow
            title={`Choose a blockchain network`}
          >
            <img src={require("assets/icons/info_white.png")} alt="info" />
          </Tooltip>
        </label>
      </Box>

      <TokenSelect
        networks
        tokens={BlockchainNets}
        theme="dark"
        value={communityToken.Network}
        onChange={v => {
          const communityTokenCopy = { ...communityToken };
          communityTokenCopy.Network = v.target.value;
          setCommunityToken(communityTokenCopy);
        }}
      />
    </Box>
  );
}
