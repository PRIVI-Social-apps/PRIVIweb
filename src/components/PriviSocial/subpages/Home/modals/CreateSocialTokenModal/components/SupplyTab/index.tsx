import React from "react";
import InputWithLabelAndTooltip from "shared/ui-kit/InputWithLabelAndTooltip";
import { AMMGraph } from "../AMMGraph";

export default function CreateSocialTokenSupplyTab({ socialToken, setSocialToken }) {
  return (
    <>
      <div>
        <InputWithLabelAndTooltip
          labelName="What would be the initial supply?"
          tooltip=""
          inputValue={socialToken.InitialSupply}
          onInputValueChange={e => {
            setSocialToken({ ...socialToken, InitialSupply: e.target?.value });
          }}
          type="number"
        />
        <InputWithLabelAndTooltip
          labelName="What would be the target supply?"
          tooltip=""
          inputValue={socialToken.TargetSupply}
          onInputValueChange={e => {
            setSocialToken({ ...socialToken, TargetSupply: e.target?.value });
          }}
          type="number"
        />
        <InputWithLabelAndTooltip
          labelName="And the target price?"
          tooltip=""
          inputValue={socialToken.TargetPrice}
          onInputValueChange={e => {
            setSocialToken({ ...socialToken, TargetPrice: e.target?.value });
          }}
          type="number"
        />
        <InputWithLabelAndTooltip
          labelName="Trading Spread (%)"
          tooltip=""
          inputValue={socialToken.TradingSpread}
          onInputValueChange={e => {
            setSocialToken({ ...socialToken, TradingSpread: e.target?.value });
          }}
          type="number"
        />
      </div>
      <AMMGraph socialToken={socialToken} setSocialToken={setSocialToken} />
    </>
  );
}
