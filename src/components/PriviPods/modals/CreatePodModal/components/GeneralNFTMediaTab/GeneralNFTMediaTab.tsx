import React, { useEffect, useState } from "react";
import { Fade, TextField, Tooltip, Grid } from "@material-ui/core";

import { generalNFTMediaTabStyles } from "./GeneralNFTMediaTab.styles";
import ImageTitleDescription from "shared/ui-kit/Page-components/ImageTitleDescription";
import { BlockchainNets } from "shared/constants/constants";
import CustomSwitch from "shared/ui-kit/CustomSwitch";
import InputWithLabelAndTooltip from "shared/ui-kit/InputWithLabelAndTooltip";
import Box from 'shared/ui-kit/Box';
import { BlockchainTokenSelect } from "components/legacy/Profile/modals/CreateSocialTokenModal/components/BlockchainTokenSelect";

const infoIcon = require("assets/icons/info.svg");

const GeneralNFTMediaTab = (props: any) => {
  const classes = generalNFTMediaTabStyles();

  //hashtags
  const [hashtag, setHashtag] = useState<string>("");
  const [sharingPercent, setSharingPercent] = useState<string>("");
  const [hashtagIndex, setHashtagIndex] = useState<number>(-1);
  const [canEdit, setCanEdit] = useState<boolean>(true);

  useEffect(() => {
    if (props.canEdit !== undefined) {
      setCanEdit(props.canEdit);
    }
  }, [props.canEdit]);

  return (
    <div className={classes.generalNftMediaTab}>
      <ImageTitleDescription
        photoImg={props.photoImg}
        photoTitle="Pod Image"
        closeIconRightPx={10}
        mainElement={props.pod}
        mainSetter={props.setPod}
        setterPhoto={props.setPhoto}
        setterPhotoImg={props.setPhotoImg}
        titleTitle="Collection Name"
        title={props.pod.Name}
        setterTitle={title => {
          let podCopy = { ...props.pod };
          podCopy.Name = title;
          props.setPod(podCopy);
        }}
        titlePlaceholder="Collection title..."
        descTitle="Description"
        desc={props.pod.Description}
        setterDesc={desc => {
          let podCopy = { ...props.pod };
          podCopy.Description = desc;
          props.setPod(podCopy);
        }}
        descPlaceholder="Write a description..."
        imageSize={12}
        infoSize={6}
        canEdit={props.isCreator || props.creation}
      />
      <Box display="flex" flexDirection="column" mt={3} mb={2}>
        <Box fontSize={18} fontWeight={400} color="#000000">
          Choose Blockchain Network
        </Box>
        <BlockchainTokenSelect
          communityToken={props.pod}
          setCommunityToken={props.setPod}
          BlockchainNets={BlockchainNets}
        />
      </Box>
      <Grid
        className={classes.flexRowInputs}
        container
        direction="row"
        justify="flex-start"
        alignItems="stretch"
        style={{ marginTop: 30 }}
      >
        <Grid xs={12} md={6}>
          <div className={classes.flexRowInputs}>
            <div>Hashtags</div>
            <Tooltip
              TransitionComponent={Fade}
              TransitionProps={{ timeout: 600 }}
              arrow
              className={classes.tooltipHeaderInfo}
              title={`Please provide at least one hashtag for your community. As the Communities grow, this field will help people discover your community`}
            >
              <img src={infoIcon} alt={"info"} />
            </Tooltip>
          </div>
          <div style={{ display: "flex", alignItems: "center", marginTop: "11px" }}>
            <div className={classes.hashtagInput}>
              <TextField
                variant="outlined"
                onChange={e => setHashtag(e.target.value)}
                value={hashtag}
                placeholder="#"
                className={classes.formControlHashInputWide}
              />
              <img
                className={classes.hashtagInputImg}
                src={require("assets/icons/add_gray.png")}
                alt={"add"}
                onClick={e => {
                  if (hashtag && hashtag !== "") {
                    e.preventDefault();
                    const podCopy = { ...props.pod };
                    podCopy.Hashtags.push(hashtag.replace(/\s/g, ""));
                    props.setPod(podCopy);
                    setHashtag("");
                  }
                }}
              />
            </div>
          </div>
        </Grid>
        <Grid xs={12} md={6} style={{ paddingLeft: "16px" }}>
          <InputWithLabelAndTooltip
            labelName="Sharing percentage"
            tooltip={`Please provide sharing percentage for your community. As the Communities grow, this field will help people discover your community`}
            onInputValueChange={elem => {
              setSharingPercent(elem.target.value);
              let podCopy = { ...props.pod };
              podCopy.SharingPercent = elem.target.value;
              props.setPod(podCopy);
            }}
            type="text"
            inputValue={sharingPercent}
            placeHolder=""
            disabled={!props.isCreator && !props.creation}
          />
        </Grid>
      </Grid>
      <div className={classes.hashtagsRow} style={{ flexFlow: "wrap", marginTop: "0px" }}>
        {props.pod.Hashtags.map((hashtag, index) => (
          <div
            className={index === 0 ? classes.hashtagPillFilled : classes.hashtagPill}
            style={{ marginTop: "8px" }}
          >
            {props.pod.Hashtags && props.pod.Hashtags[index] ? props.pod.Hashtags[index] : hashtag}
          </div>
        ))}
      </div>
      <Grid
        style={{ marginTop: "20px" }}
        container
        spacing={2}
        direction="row"
        alignItems="flex-start"
        justify="flex-start"
      >
        <Grid item xs={12} md={5} style={{ borderRight: "1px solid ##0000001a" }}>
          <div className={classes.flexRowInputs}>
            <div className={classes.infoHeaderCreatePod}>Open to advertising</div>
            <Tooltip
              TransitionComponent={Fade}
              TransitionProps={{ timeout: 600 }}
              arrow
              className={classes.tooltipHeaderInfo}
              title={`When ads are viewed within the system those who view or click on the ad earn PRIVI Data Coins. Not yet operational but will be soon!`}
            >
              <img src={infoIcon} alt={"info"} />
            </Tooltip>
          </div>
          <div style={{ marginBottom: "8px" }}>
            <CustomSwitch
              checked={props.pod.OpenAdvertising}
              onChange={() => {
                if (props.isCreator || props.creation) {
                  let podCopy = { ...props.pod };
                  podCopy.OpenAdvertising = !podCopy.OpenAdvertising;
                  props.setPod(podCopy);
                }
              }}
            />
          </div>
        </Grid>
        {props.creation ? (
          <Grid item xs={12} md={5}>
            <div className={classes.flexRowInputs}>
              <div className={classes.infoHeaderCreatePod}>Open to investment</div>
              <Tooltip
                TransitionComponent={Fade}
                TransitionProps={{ timeout: 600 }}
                arrow
                className={classes.tooltipHeaderInfo}
                title={`When ads are viewed within the system those who view or click on the ad earn PRIVI Data Coins. Not yet operational but will be soon!`}
              >
                <img src={infoIcon} alt={"info"} />
              </Tooltip>
            </div>
            <div style={{ marginBottom: "8px" }}>
              <CustomSwitch
                checked={props.pod.OpenInvestment}
                onChange={() => {
                  if (props.isCreator || props.creation) {
                    let podCopy = { ...props.pod };
                    podCopy.OpenInvestment = !podCopy.OpenInvestment;
                    props.setPod(podCopy);
                  }
                }}
              />
            </div>
          </Grid>
        ) : null}
      </Grid>
    </div>
  );
};

export default GeneralNFTMediaTab;
