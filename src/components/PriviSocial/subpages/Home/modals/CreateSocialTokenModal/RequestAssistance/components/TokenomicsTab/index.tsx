import React from "react";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import InputWithLabelAndTooltip from "shared/ui-kit/InputWithLabelAndTooltip";
import { Grid, Tooltip, Fade } from "@material-ui/core";
import { FundingTokenSelect } from "../../../components/FundingTokenTab/FundingTokenSelect";
import { BlockchainTokenSelect } from "../../../components/BlockchainTokenSelect";
import { BlockchainNets } from "shared/constants/constants";
import CreatorTokenomicsTab from "./CreatorTokenomicsTab";
import FileUpload from "shared/ui-kit/Page-components/FileUpload";
import { AMMGraph } from "../../../components/AMMGraph";

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
  socialToken,
  setSocialToken,
  isCreator = false,
  tokenList,
  setRequestAssistance,
}) {
  const classes = useStyles();

  const [photoImg, setPhotoImg] = React.useState<any>();

  return (
    <div className={classes.root}>
      {isCreator ? (
        <CreatorTokenomicsTab
          socialToken={socialToken}
          setSocialToken={setSocialToken}
          tokenList={tokenList}
          setRequestAssistance={setRequestAssistance}
        />
      ) : (
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <InputWithLabelAndTooltip
              labelName="Name"
              type="text"
              tooltip="Enter your token name"
              inputValue={socialToken.TokenName}
              onInputValueChange={e => {
                setSocialToken({ ...socialToken, TokenName: e.target?.value });
              }}
            />
            <InputWithLabelAndTooltip
              labelName="Can you give us a Symbol for it?"
              tooltip="Choose an identifier for you token. Must be from 3 to 6 characters"
              inputValue={socialToken.TokenSymbol}
              onInputValueChange={e => {
                setSocialToken({ ...socialToken, TokenSymbol: e.target?.value });
              }}
              type="text"
            />
            <InputWithLabelAndTooltip
              labelName="Token Description"
              tooltip="Provide more details about your token"
              type="textarea"
              inputValue={socialToken.Description}
              onInputValueChange={e => {
                setSocialToken({ ...socialToken, Description: e.target?.value });
              }}
            />

            <label>
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
            <BlockchainTokenSelect
              socialToken={socialToken}
              setSocialToken={setSocialToken}
              BlockchainNets={BlockchainNets}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <label style={{ marginBottom: "10px" }}>Image</label>
            <FileUpload
              theme="green"
              photo={socialToken.photo}
              photoImg={photoImg}
              setterPhoto={p => setSocialToken({ ...socialToken, photo: p })}
              setterPhotoImg={setPhotoImg}
              mainSetter={setSocialToken}
              mainElement={socialToken}
              type="image"
              canEdit={true}
            />

            <label>Funding Token</label>
            <FundingTokenSelect
              socialToken={socialToken}
              setSocialToken={setSocialToken}
              tokenList={tokenList}
            />

            <Grid item xs={12} sm={4}>
              <InputWithLabelAndTooltip
                labelName="What would be the initial supply?"
                tooltip=""
                inputValue={socialToken.InitialSupply}
                onInputValueChange={e => {
                  setSocialToken({ ...socialToken, InitialSupply: e.target?.value });
                }}
                type="number"
              />{" "}
            </Grid>
            <Grid item xs={12} sm={4}>
              <InputWithLabelAndTooltip
                labelName="What would be the target supply?"
                tooltip=""
                inputValue={socialToken.TargetSupply}
                onInputValueChange={e => {
                  setSocialToken({ ...socialToken, TargetSupply: e.target?.value });
                }}
                type="number"
              />{" "}
            </Grid>
            <Grid item xs={12} sm={4}>
              <InputWithLabelAndTooltip
                labelName="And the target price?"
                tooltip=""
                inputValue={socialToken.TargetPrice}
                onInputValueChange={e => {
                  setSocialToken({ ...socialToken, TargetPrice: e.target?.value });
                }}
                type="number"
              />{" "}
            </Grid>
            <Grid item xs={12} sm={4}>
              <InputWithLabelAndTooltip
                labelName="Trading Spread (%)"
                tooltip=""
                inputValue={socialToken.TradingSpread}
                onInputValueChange={e => {
                  setSocialToken({ ...socialToken, TradingSpread: e.target?.value });
                }}
                type="number"
              />
            </Grid>
            <Grid item xs={12}>
              <AMMGraph socialToken={socialToken} setSocialToken={setSocialToken} />
            </Grid>
          </Grid>
        </Grid>
      )}
    </div>
  );
}
