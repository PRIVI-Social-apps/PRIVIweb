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
    selectMusicDao: {
      background: "linear-gradient(0deg, #FFFFFF, #FFFFFF)",
      border: "1px solid #DEE7DA",
      boxSizing: "border-box",
      boxShadow: "0px 8px 8px -4px rgba(86, 123, 103, 0.15)",
      borderRadius: "45px",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      "& *": {
        color: "#181818",
        fontSize: "16px",
        "& img": {},
      },
    },
  })
);

export const BlockchainTokenSelect = ({ communityToken, setCommunityToken, BlockchainNets, theme = "" }) => {
  const classes = useStyles();

  return (
    <div>
      <FormControl variant="outlined" style={{ width: "100%" }}>
        <StyledSelect
          className={theme === "music dao" ? classes.selectMusicDao : classes.select}
          value={communityToken.Network}
          onChange={v => {
            const communityTokenCopy = { ...communityToken };
            communityTokenCopy.Network = v.target.value;
            setCommunityToken(communityTokenCopy);
          }}
          renderValue={() => (
            <div style={{ display: "flex", alignItems: "center" }}>
              {communityToken.Network &&
                BlockchainNets.find(blockChainNet => blockChainNet["name"] === communityToken?.Network) && (
                  <img
                    src={require(`assets/tokenImages/${communityToken.Network}.png`)}
                    style={{ marginRight: 10, width: "24px", height: "24px" }}
                  />
                )}
              {communityToken.Network}
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
