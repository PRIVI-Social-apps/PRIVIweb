import { Fade, Grid, makeStyles, Tooltip } from "@material-ui/core";
import { Card, GreenText } from "components/PriviSocial/index.styles";
import React from "react";
import { Color, StyledDivider } from "shared/ui-kit";
import Box from "shared/ui-kit/Box";

const arePropsEqual = (prevProps, currProps) => {
  return prevProps.userProfile === currProps.userProfile && prevProps.myStats === currProps.myStats;
};

const InfoStats = React.memo(({ userProfile, myStats }: { userProfile: any; myStats: any }) => {
  return (
    <Card>
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <GreenText bold fontSize="22px">
          My stats
        </GreenText>
        <Box fontSize="14px" alignItems="center">
          <img
            src={require("assets/icons/info_gray.png")}
            alt="info"
            width="13.5px"
            height="13.5px"
            style={{ marginRight: "7.25px" }}
          />
          Hover a stat title to know more about it
        </Box>
      </Box>
      <Box mb={2} width="100%">
        <StyledDivider type="solid" color={Color.GrayInputPlaceholder} margin={2} />
      </Box>
      <Grid container wrap="wrap" spacing={4}>
        <Grid item xs={6} sm={4} md={3}>
          <StatInfo
            value={isNaN(userProfile.trustScore) ? "50%" : userProfile.trustScore * 100 + "%"}
            label={`🤝 Trust`}
            tooltipInfo={
              "A measure of financial trustworthiness, Trust Scores quantify transaction history data on individuals and Pods within the system"
            }
          />
        </Grid>
        <Grid item xs={6} sm={4} md={3}>
          <StatInfo
            value={isNaN(userProfile.endorsementScore) ? "50%" : userProfile.endorsementScore * 100 + "%"}
            label={`⚔️ Endorsement`}
            tooltipInfo={
              "A measure of financial trustworthiness, Endorsement Scores quantify the endorsements (and their trust scores) of individuals and/or Pods"
            }
          />
        </Grid>
        <Grid item xs={6} sm={4} md={3}>
          <StatInfo value={myStats ? myStats.myMediasCount : 0} label="📹 Media" tooltipInfo={"Media info"} />
        </Grid>
        <Grid item xs={6} sm={4} md={3}>
          <StatInfo
            value={userProfile.awards && userProfile.awards.length ? userProfile.awards.length : "0"}
            label="🥇 Awards"
            tooltipInfo={"Awards received in discussion, posts and other publications by other users."}
          />
        </Grid>
        <Grid item xs={6} sm={4} md={3}>
          <StatInfo
            value={myStats ? myStats.myCommunitiesCount : 0}
            label="👽 Community"
            tooltipInfo={"Community info"}
          />
        </Grid>
        <Grid item xs={6} sm={4} md={3}>
          <StatInfo
            value={userProfile.creds && userProfile.creds > 0 ? userProfile.creds : 0}
            label="💰 Creds"
            tooltipInfo={"Creds received in discussion, posts and other publications by other users."}
          />
        </Grid>
        <Grid item xs={6} sm={4} md={3}>
          <StatInfo
            value={(myStats?.myFTPodsCount ?? 0) + (myStats?.myDigitalPodsCount ?? 0) ?? 0}
            label="📈 Investments"
            tooltipInfo={"Investments info."}
          />
        </Grid>
        <Grid item xs={6} sm={4} md={3}>
          <StatInfo value={myStats?.myDigitalPodsCounts ?? 0} label="💊 Pod" tooltipInfo={"Pod info"} />
        </Grid>
      </Grid>
    </Card>
  );
}, arePropsEqual);

export default InfoStats;

const statInfoStyles = makeStyles(theme => ({
  label: {
    fontSize: 14,
    whiteSpace: 'nowrap',
  },
  value: {
    fontSize: 40,
    fontWeight: "bold",
    [theme.breakpoints.down("md")]: {
      fontSize: 20,
    },
  },
}));

const StatInfo = ({ value, label, tooltipInfo }) => {
  const classes = statInfoStyles();

  return (
    <div className="statInfo">
      <Tooltip
        TransitionComponent={Fade}
        TransitionProps={{ timeout: 600 }}
        arrow
        className="tooltip"
        title={tooltipInfo ?? ""}
      >
        <Box className={classes.label} mb={1}>
          {label}
        </Box>
      </Tooltip>
      <Box className={classes.value}>
        {value}
      </Box>
    </div>
  );
};
