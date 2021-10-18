import React, { useEffect, useState } from "react";
import { Box, Grid } from "@material-ui/core";

import URL from "shared/functions/getURL";

import { Card, Text, TitleGrandLight, useStyles } from "../../index.styles";
import { Avatar, Color, StyledDivider } from "shared/ui-kit";

const twitterIcon = require("assets/icons/socialTwitter.svg");
const facebookIcon = require("assets/icons/socialFacebook.svg");

export default function About({ community }) {
  const classes = useStyles();

  const [dateString, setDateString] = useState<string>("N/A");

  const openInNewTab = url => {
    const newWindow = window.open(url, "_blank", "noopener,noreferrer");
    if (newWindow) newWindow.opener = null;
  };

  useEffect(() => {
    if (community && community.CreationDate) {
      let date = community.CreationDate * 1000;
      let month =
        new Date(date).getMonth() < 10 ? `0${new Date(date).getMonth()}` : `${new Date(date).getMonth()}`;
      let day =
        new Date(date).getDate() < 10 ? `0${new Date(date).getDate()}` : `${new Date(date).getDate()}`;
      let year = `${new Date(date).getFullYear()}`;
      setDateString(day + "." + month + "." + year);
    }
  }, [community]);

  if (community) {
    return (
      <>
        <TitleGrandLight fontSize="30px" disableUppercase bold mb={5}>
          About this DAO
        </TitleGrandLight>
        <Box color="white" fontSize="18px">
          <Grid container spacing={2}>
            <Grid item xs={12} sm={8}>
              <Text>{community.Description ?? "No description about this community"}</Text>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Card>
                <TitleGrandLight fontSize="20px" disableUppercase bold mb={2}>
                  Details
                </TitleGrandLight>
                <StyledDivider color={Color.White} type="solid" />
                <Box mt={2} mb={2}>
                  <Grid container>
                    <Grid item xs={12} sm={6} direction="column">
                      <Text bold>Start Date</Text>
                      <Box mt={1} className={classes.receiver}>
                        {dateString}
                      </Box>
                    </Grid>
                    <Grid item xs={12} sm={6} direction="column">
                      <Text bold>Expected Duration</Text>
                      <Box mt={1} className={classes.receiver}>
                        {community.ExpectedDuration ? `${community.ExpectedDuration} weeks` : "N/A"}
                      </Box>
                    </Grid>
                  </Grid>
                </Box>
                <StyledDivider color={Color.White} type="solid" />
                <Box mt={2} mb={2}>
                  <Text bold mb={2}>
                    Owner
                  </Text>
                  <Box display="flex" alignItems="center">
                    <Avatar
                      noBorder
                      url={
                        community.creatorInfo &&
                        community.creatorInfo.imageURL &&
                        community.creatorInfo.imageURL.length > 0
                          ? `${community.creatorInfo.imageURL}`
                          : "none"
                      }
                      size="medium"
                    />
                    <Box ml={1} fontFamily="Agrandir GrandLight">
                      {community.creatorInfo && community.creatorInfo.name
                        ? community.creatorInfo.name
                        : "unnamed user"}
                    </Box>
                  </Box>
                </Box>
                {community.TokenSymbol && community.TokenSymbol !== "" && (
                  <StyledDivider color={Color.White} type="solid" />
                )}
                {community.TokenSymbol && community.TokenSymbol !== "" && (
                  <Box mt={2} mb={2}>
                    <Text bold mb={2}>
                      Token
                    </Text>
                    <Box display="flex" alignItems="center">
                      <div
                        style={{
                          width: "48px",
                          height: "48px",
                          borderRadius: "50%",
                          background: "linear-gradient(151.11deg, #4CAA30 6.74%, #59C4EB 90.8%)",
                          backgroundImage:
                            community.TokenSymbol !== ""
                              ? `url(${URL()}/wallet/getTokenPhoto/${community.TokenSymbol})`
                              : "none",
                          backgroundRepeat: "no-repeat",
                          backgroundSize: "cover",
                          backgroundPosition: "center",
                        }}
                      />
                      <Box ml={1} fontFamily="Agrandir GrandLight">
                        {community.TokenSymbol}
                      </Box>
                    </Box>
                  </Box>
                )}
                {community.TokenSymbol && community.TokenSymbol !== "" && (
                  <StyledDivider color={Color.White} type="solid" />
                )}
                {community.TokenSymbol && community.TokenSymbol !== "" && (
                  <Box mt={2} mb={2}>
                    <Grid container>
                      <Grid item xs={12} sm={4} direction="column">
                        <Text bold>Supply</Text>
                        <Box mt={1} className={classes.receiver}>
                          {community.SupplyReleased
                            ? `${
                                community.SupplyReleased > 1000000
                                  ? (community.SupplyReleased / 1000000).toFixed(1)
                                  : community.SupplyReleased > 1000
                                  ? (community.SupplyReleased / 1000).toFixed(1)
                                  : community.SupplyReleased.toFixed(1)
                              } ${
                                community.SupplyReleased > 1000000
                                  ? "M"
                                  : community.SupplyReleased > 1000
                                  ? "K"
                                  : ""
                              }`
                            : "N/A"}
                        </Box>
                      </Grid>
                      <Grid item xs={12} sm={4} direction="column">
                        <Text bold>Price</Text>
                        <Box mt={1} className={classes.receiver}>
                          {`${community.Price !== undefined ? community.Price.toFixed(2) : "N/A"} ${
                            community.FundingToken
                          }`}
                        </Box>
                      </Grid>
                      <Grid item xs={12} sm={4} direction="column">
                        <Text bold>MCAP</Text>
                        <Box mt={1} className={classes.receiver}>
                          {`${community.MCAP ? community.MCAP.toFixed(4) : "N/A"} ${community.FundingToken}`}
                        </Box>
                      </Grid>
                    </Grid>
                  </Box>
                )}
                {(community.TwitterId || community.FacebookId) && (
                  <StyledDivider color={Color.White} type="solid" />
                )}
                {(community.TwitterId || community.FacebookId) && (
                  <Box mt={2}>
                    <Text bold>Social</Text>
                    <Grid container>
                      {community.TwitterId && (
                        <Grid
                          item
                          xs={12}
                          sm={6}
                          style={{ display: "flex", alignItems: "center", cursor: "pointer" }}
                        >
                          <img style={{ width: "36px", height: "36px" }} src={twitterIcon} alt={"twitter"} />
                          <Box
                            ml={1}
                            onClick={() => {
                              openInNewTab(`https://twitter.com/${community.TwitterId}`);
                            }}
                          >
                            Twitter
                          </Box>
                        </Grid>
                      )}
                      {community.FacebookId && (
                        <Grid
                          item
                          xs={12}
                          sm={6}
                          style={{ display: "flex", alignItems: "center", cursor: "pointer" }}
                        >
                          <img
                            style={{ width: "36px", height: "36px" }}
                            src={facebookIcon}
                            alt={"facebook"}
                          />
                          <Box
                            ml={1}
                            onClick={() => {
                              openInNewTab(`https://facebook.com/${community.FacebookId}`);
                            }}
                          >
                            Facebook
                          </Box>
                        </Grid>
                      )}
                    </Grid>
                  </Box>
                )}
              </Card>
            </Grid>
          </Grid>
        </Box>
      </>
    );
  } else {
    return null;
  }
}
