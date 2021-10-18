import React from "react";
import { createStyles, FormControl, makeStyles } from "@material-ui/core";
import { StyledSelect, StyledMenuItem } from "shared/ui-kit/Styled-components/StyledComponents";

const useStyles = makeStyles(() =>
  createStyles({
    select: {
      "& > div": {
        paddingBottom: "11px",
        minWidth: "364px",
      },
    },
  })
);

export const BlockchainTokenSelect = ({ socialToken, setSocialToken, BlockchainNets }) => {
  const classes = useStyles();

  return (
    <>
      <FormControl variant="outlined" style={{ width: "100%" }}>
        <StyledSelect
          className={classes.select}
          value={socialToken.Network}
          onChange={v => {
            const socialTokenCopy = { ...socialToken };
            socialTokenCopy.Network = v.target.value;
            setSocialToken(socialTokenCopy);
          }}
          renderValue={() => (
            <div style={{ display: "flex", alignItems: "center" }}>
              {socialToken.Network &&
                BlockchainNets.find(blockChainNet => blockChainNet["name"] === socialToken?.Network) && (
                  <img
                    src={require(`assets/tokenImages/${socialToken.Network}.png`)}
                    style={{ marginRight: 10, width: "24px", height: "24px" }}
                  />
                )}
              {socialToken.Network}
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
    </>
  );
};
