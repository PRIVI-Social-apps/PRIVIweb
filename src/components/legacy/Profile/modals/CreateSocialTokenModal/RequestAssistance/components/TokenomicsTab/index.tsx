import React from "react";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import InputWithLabelAndTooltip from "shared/ui-kit/InputWithLabelAndTooltip";
import { Grid, Tooltip, Fade } from "@material-ui/core";
import { FundingTokenSelect } from "../../../components/FundingTokenSelect";
import { BlockchainTokenSelect } from "../../../components/BlockchainTokenSelect";
import { BlockchainNets } from "shared/constants/constants";
import { AMMGraph } from "../../../components/AMMGraph";
import CreatorTokenomicsTab from "./CreatorTokenomicsTab";

const useStyles = makeStyles(() =>
  createStyles({
    root: {
      flexGrow: 1,
    },
    dragImageHereImgTitleDesc: {
      borderRadius: 7,
      cursor: "pointer",
      alignItems: "center",
      width: "100%",
      flex: 1,
      display: "flex",
      justifyContent: "center",
      border: "1px dashed #b6b6b6",
      boxSizing: "border-box",
      padding: "92px 20px",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
      backgroundSize: "contain",
      backgroundColor: "#F7F9FE",
      marginTop: 8,
      marginBottom: 16,
    },
    dragImageHereLabelImgTitleDesc: {
      fontWeight: 400,
      color: "#99a1b3",
      fontSize: "18px",
      marginLeft: 18,
    },
  })
);

export default function RequestAssistanceTokenTokenomicsTab({
  communityToken,
  setCommunityToken,
  isCreator = false,
  tokenList,
  setRequestAssistance,
}) {
  const classes = useStyles();

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

  return (
    <div className={classes.root}>
      {isCreator ? (
        <CreatorTokenomicsTab
          communityToken={communityToken}
          setCommunityToken={setCommunityToken}
          tokenList={tokenList}
          setRequestAssistance={setRequestAssistance}
        />
      ) : (
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <InputWithLabelAndTooltip labelName="Name" tooltip="Enter your token name" />
            <InputWithLabelAndTooltip labelName="Symbol" tooltip="Enter token symbol" />
            <InputWithLabelAndTooltip
              labelName="Description"
              tooltip="Provide more details about your token"
              type="textarea"
            />
            <label>Choose Blockchain Network</label>
            <BlockchainTokenSelect
              communityToken={communityToken}
              setCommunityToken={setCommunityToken}
              BlockchainNets={BlockchainNets}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <label>
              Image
              <Tooltip
                TransitionComponent={Fade}
                TransitionProps={{ timeout: 600 }}
                arrow
                title="Upload your token image"
              >
                <img src={require("assets/icons/info.png")} alt="info" />
              </Tooltip>
            </label>
            <div
              className={classes.dragImageHereImgTitleDesc}
              onClick={() => {
                let selectPhoto = document.getElementById("selectPhotoSocialToken");
                if (selectPhoto) {
                  selectPhoto.click();
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
              <div className={classes.dragImageHereLabelImgTitleDesc}>
                Drag Image Here{" "}
                <div className={"dragImageHereLabelImgTitleSubDesc"}>
                  or <span>browse media on your device</span>
                </div>
              </div>
            </div>

            <label>Funding Token</label>
            <FundingTokenSelect
              communityToken={communityToken}
              setCommunityToken={setCommunityToken}
              tokenList={tokenList}
            />

            <InputWithLabelAndTooltip labelName="Trading Spread (%)" tooltip="Trading Spread (%)" />
          </Grid>
          <Grid item xs={12} sm={4}>
            <InputWithLabelAndTooltip labelName="Initial Supply" tooltip="Initial Supply" type="number" />
          </Grid>
          <Grid item xs={12} sm={4}>
            <InputWithLabelAndTooltip labelName="Target Supply" tooltip="Target Supply" type="number" />
          </Grid>
          <Grid item xs={12} sm={4}>
            <InputWithLabelAndTooltip labelName="Target Price" tooltip="Target Price" type="number" />
          </Grid>
          <Grid item xs={12}>
            <AMMGraph communityToken={communityToken} setCommunityToken={setCommunityToken} />
          </Grid>
        </Grid>
      )}
    </div>
  );
}
