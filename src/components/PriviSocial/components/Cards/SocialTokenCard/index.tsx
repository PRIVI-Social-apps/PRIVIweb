import { GreenText } from "components/PriviSocial/index.styles";
import React from "react";
import { Avatar } from "shared/ui-kit";
import Box from "shared/ui-kit/Box";
import { useTypedSelector } from "store/reducers/Reducer";
import { socialTokenCardStyles } from "./index.styles";

export default function SocialTokenCard({ item }) {
  const classes = socialTokenCardStyles();

  return (
    <div className={classes.socialTokenCard}>
      <Box display="flex" alignItems="center" mb={2}>
        <Avatar size="small" url={item?.creator?.imageURL ?? "none"} />
        <Box>
          <Box mb="4px">{item?.creator?.name ?? item?.creator?.firstName ?? "User name"}</Box>
          <GreenText>@{item?.creator?.urlSlug ?? "Username"}</GreenText>
        </Box>
      </Box>
      <Box display="flex" flexDirection="column">
        <Box className={classes.tokenImageContainer} mb={2}>
          <img src={""} />
        </Box>
        <h4>{item?.TokenName ?? "Token Name"}</h4>
        <Box mt={1}>{item?.TokenSymbol ?? "Token Symbol"}</Box>
      </Box>
    </div>
  );
}
