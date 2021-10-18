import React from "react";
import { FundingTokenSelect } from "./FundingTokenSelect";

export default function CreateSocialTokenFundingTokenTab({ socialToken, setSocialToken, tokenList }) {
  return (
    <>
      <label>Choose Token</label>
      <FundingTokenSelect socialToken={socialToken} setSocialToken={setSocialToken} tokenList={tokenList} />
    </>
  );
}
