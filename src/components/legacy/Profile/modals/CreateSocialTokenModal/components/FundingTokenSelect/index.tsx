import React from "react";
import { FormControl } from "@material-ui/core";
import { StyledSelect, StyledMenuItem } from "shared/ui-kit/Styled-components/StyledComponents";

export const FundingTokenSelect = ({
  communityToken,
  setCommunityToken,
  tokenList,
}) => {
  return (
    <div>
      <FormControl variant="outlined">
        <StyledSelect
          value={communityToken.FundingToken}
          onChange={v => {
            const communityTokenCopy = { ...communityToken };
            communityTokenCopy.FundingToken = v.target.value;
            setCommunityToken(communityTokenCopy);
          }}
          renderValue={() => (
            <div style={{ display: "flex", alignItems: "center" }}>
              {communityToken.FundingToken &&
                tokenList.some(token => token === communityToken?.FundingToken) && (
                  <img
                    src={require(`assets/tokenImages/${communityToken?.FundingToken}.png`)}
                    style={{ marginRight: 10, width: "24px", height: "24px" }}
                  />
                )}
              {communityToken?.FundingToken}
            </div>
          )}
        >
          {tokenList.map((item, index) => (
            <StyledMenuItem key={index} value={item}>
              {item}
            </StyledMenuItem>
          ))}
        </StyledSelect>
      </FormControl>
    </div>
  );
}