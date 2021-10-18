import { Fade, Tooltip } from "@material-ui/core";
import React from "react";
import { BlockchainNets } from "shared/constants/constants";
import InputWithLabelAndTooltip from "shared/ui-kit/InputWithLabelAndTooltip";
import { BlockchainTokenSelect } from "../BlockchainTokenSelect";
import FileUpload from "shared/ui-kit/Page-components/FileUpload";

export default function CreateSocialTokenGeneralTab({ socialToken, setSocialToken }) {
  const [photoImg, setPhotoImg] = React.useState<any>();

  return (
    <>
      <h5>How do you want your Social Token to be called?</h5>

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
      <BlockchainTokenSelect
        socialToken={socialToken}
        setSocialToken={setSocialToken}
        BlockchainNets={BlockchainNets}
      />
    </>
  );
}
