import React from "react";

import { Card, GreenText } from "components/PriviSocial/index.styles";
import URL from "shared/functions/getURL";
import Box from "shared/ui-kit/Box";
import { homeStyles } from "../../index.styles";

const InfoSocialToken = React.memo(
  ({ socialToken }: { socialToken: any }) => {
    const classes = homeStyles();
    return (
      <Card>
        <div className={classes.statLine}>
          <div>
            <Box fontSize="14px" mb={1}>
              👛 Social Token
            </Box>
            <Box fontSize={"40px"} fontWeight="bold">
              <div
                className={"token-image"}
                style={{
                  backgroundImage: socialToken.HasPhoto
                    ? `url(${URL()}/social/getPhoto/${socialToken.TokenSymbol})`
                    : "none",
                }}
              />
              {socialToken.TokenSymbol ?? ""}
            </Box>
          </div>
          <div>
            <Box fontSize="14px" mb={1}>
              💰 Token Holders
            </Box>
            <Box display="flex" alignItems="center"></Box>
            <Box fontSize={"40px"} fontWeight="bold" mr={1}>
              {Object.keys(socialToken?.Holders ?? {}).length}
            </Box>
            <GreenText pointer fontSize="11px" onClick={() => {}}>
              See all
            </GreenText>
          </div>
        </div>
      </Card>
    );
  },
  (prevProps, nextProps) => prevProps.socialToken === nextProps.socialToken
);

export default InfoSocialToken;
