import React from "react";
import { FormControl } from "@material-ui/core";
import { StyledSelect, StyledMenuItem } from "shared/ui-kit/Styled-components/StyledComponents";

export const FundingTokenSelect = ({ socialToken, setSocialToken, tokenList }) => {
  return (
    <>
      <FormControl variant="outlined">
        <StyledSelect
          value={socialToken.FundingToken}
          onChange={v => {
            const socialTokenCopy = { ...socialToken };
            socialTokenCopy.FundingToken = v.target.value;
            setSocialToken(socialTokenCopy);
          }}
          renderValue={() => (
            <div style={{ display: "flex", alignItems: "center" }}>
              {socialToken.FundingToken && tokenList.some(token => token === socialToken?.FundingToken) && (
                <img
                  src={require(`assets/tokenImages/${socialToken?.FundingToken}.png`)}
                  style={{ marginRight: 10, width: "24px", height: "24px" }}
                />
              )}
              {socialToken?.FundingToken}
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
    </>
  );
};
