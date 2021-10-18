import React from "react";
import { FormControl } from "@material-ui/core";

import { networkSelectStyles } from './index.styles';
import { StyledSelect, StyledMenuItem } from "shared/ui-kit/Styled-components/StyledComponents";

export const NetworkTokenSelect = ({ token, setToken, BlockchainNets, isVertical = false }) => {
  const classes = networkSelectStyles();

  return (
    <div>
      <FormControl variant="outlined" style={{ width: "100%" }}>
        {isVertical && token && BlockchainNets.find(blockChainNet => blockChainNet["name"] === token) && (
          <img
            src={require(`assets/tokenImages/${token}.png`)}
            style={{ margin: 10, width: "24px", height: "24px" }}
          />
        )}
        <StyledSelect
          className={classes.select}
          value={token}
          onChange={v => {
            setToken(v.target.value);
          }}
          renderValue={() => (
            <div style={{ display: "flex", alignItems: "center" }}>
              {!isVertical &&
                token &&
                BlockchainNets.find(blockChainNet => blockChainNet["name"] === token) && (
                  <img
                    src={require(`assets/tokenImages/${token}.png`)}
                    style={{ marginRight: 10, width: "24px", height: "24px" }}
                  />
                )}
              {token}
            </div>
          )}
        >
          {BlockchainNets.map((item, index) => (
            <StyledMenuItem key={index} value={item["name"]}>
              {item["name"]}
            </StyledMenuItem>
          ))}
        </StyledSelect>
      </FormControl>
    </div>
  );
};
