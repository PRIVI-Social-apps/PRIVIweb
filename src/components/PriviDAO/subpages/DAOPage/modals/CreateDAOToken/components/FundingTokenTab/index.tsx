import React from "react";
import { TokenSelect } from "shared/ui-kit/Select/TokenSelect";

export default function CreateDAOTokenFundingTokenTab({ communityToken, setCommunityToken, tokenList }) {
  return (
    <>
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
    </>
  );
}
