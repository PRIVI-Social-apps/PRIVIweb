import React from "react";

import { StyledSelect, StyledMenuItem } from "shared/ui-kit/Styled-components/StyledComponents";
import { verticalNetworkSelectStyles } from './index.styles';

export const VerticalNetworkSelect = ({ token, setToken, BlockchainNets }) => {
  const classes = verticalNetworkSelectStyles();

  return (
    <div className={classes.container}>
      {token && BlockchainNets.find(blockChainNet => blockChainNet["name"] === token.name) && (
        <img src={require(`assets/tokenImages/${token.name}.png`)} style={{ width: "38px", height: "38px" }} />
      )}
      <StyledSelect
        className={classes.select}
        value={token.value}
        onChange={v => {
          setToken(v.target.value);
        }}
        renderValue={() => <div style={{ display: "flex", alignItems: "center" }}>{token.value}</div>}
      >
        {BlockchainNets.map((item, index) => (
          <StyledMenuItem key={index} value={item}>
            {item.value}
          </StyledMenuItem>
        ))}
      </StyledSelect>
    </div>
  );
};
