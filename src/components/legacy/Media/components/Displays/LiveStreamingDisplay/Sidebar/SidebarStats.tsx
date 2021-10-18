import { makeStyles } from "@material-ui/core/styles";
import React from "react";
import CountUp from "react-countup";
import { grid } from "shared/ui-kit";
import styled from "styled-components";

type SidebarStatsProps = {
  views: number;
  likes: number;
  shares: number;
};

export const SidebarStats: React.FunctionComponent<SidebarStatsProps> = ({ views, likes, shares }) => {
  const classes = useStyles();

  return (
    <Container>
      <div style={{ display: "flex", paddingTop: "10px;" }}>
        <div style={{ flex: 1, display: "grid" }}>
          <span role="img" aria-label="views-icon">
            👓
          </span>
          <CountUp separator="," className={classes.likeText} end={views} />
        </div>

        <div style={{ flex: 1, display: "grid" }}>
          <img
            className={classes.imageSize}
            src={require("assets/priviIcons/heart-black1.png")}
            alt={"like icon"}
          />
          <CountUp separator="," className={classes.likeText} end={likes} />
        </div>

        <div style={{ flex: 1, display: "grid" }}>
          <img
            className={classes.imageSize}
            src={require("assets/priviIcons/share-black1.png")}
            alt={"share icon"}
          />
          <CountUp separator="," className={classes.likeText} end={shares} />
        </div>
      </div>
    </Container>
  );
};

const Container = styled.div`
  margin: ${grid(3)} 0;
`;

const useStyles = makeStyles(theme => ({
  sectionContainer: {
    display: "flex",
    marginBottom: "10px",
  },
  sectionTitle: {
    margin: "0px",
    flex: 1,
    fontSize: "14px",
    color: "#707582",
    fontWeight: "bold",
  },
  sectionViewAll: {
    margin: "0px",
    fontSize: "14px",
    color: "#23D0C6",
  },
  likeText: {
    fontSize: "30px",
    color: "#181818",
    margin: "0px",
  },
  imageSize: {
    height: "25px",
  },
}));
