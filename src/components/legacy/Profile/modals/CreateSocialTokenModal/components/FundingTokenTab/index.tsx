import React from "react";
import { FundingTokenSelect } from "../FundingTokenSelect";

export default function CreateSocialTokenFundingTokenTab({
  communityToken,
  setCommunityToken,
  tokenList,
}) {
  return (
    <div>
      <label>Choose Token</label>
      <FundingTokenSelect
        communityToken={communityToken}
        setCommunityToken={setCommunityToken}
        tokenList={tokenList}
      />
    </div>
  );
}
