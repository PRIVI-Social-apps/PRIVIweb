import React from "react";
import styled from "styled-components";
import { makeStyles, createStyles, Theme } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import {formatNumber} from "shared/functions/commonFunctions";

const Title = styled.h3`
  font-size: 22px;
  font-weight: 400;
  margin: 0;
`;
const Description = styled.p`
  margin: 8px 0px 40px 0px;
  font-size: 14px;
  font-weight: 400;
  color: #99a1b3;
`;
const GridItem = styled(Grid)`
  text-align: center;
`;

const Statistic = styled.div`
  display: flex;
  flex-direction: column;
  text-align: left;
  padding-top: 20px;
`;

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    p: {
      fontSize: "18px",
      margin: "0",
    },
    span: {
      fontSize: "14px",
      color: "#707582",
      margin: "4px 0",
      padding: "0px",
    },
    chain: {
      background: 'linear-gradient(97.4deg, #ff79d1 14.43%, #db00ff 79.45%)',
      boxShadow: '0px 2px 8px rgb(0 0 0 / 12%)',
      borderRadius: '36px',
      fontSize: '14px',
      color: '#ffffff',
      padding: '7px 14px'
    }
  })
);
const About = (props: any) => {
  const classes = useStyles();
  const { socialToken, community } = props;
  const title = socialToken ? "Social Token" : community ? "Community" : "";
  const description = socialToken?.Description || community?.Description;
  const formattedDescription = description.slice(0, 700);
  const dotted = description.length > 700 ? "..." : null;
  return (
    <div className={props.className}>
      <Title>About this {title}</Title>
      <Description>
        {formattedDescription}
        {dotted}
      </Description>
      {socialToken && (
        <Grid container spacing={3}>
          <GridItem item xs={12} sm={4}>
            <Statistic>
              <span className={classes.span}>Supply released</span>
              <p className={classes.p}>{socialToken.SupplyReleased}</p>
            </Statistic>
          </GridItem>
          <GridItem item xs={12} sm={4}>
            <Statistic>
              <span className={classes.span}>Price</span>
              <p className={classes.p}>{formatNumber(socialToken.Price, socialToken.FundingToken, 4)}</p>
            </Statistic>
          </GridItem>
          <GridItem item xs={12} sm={4}>
            <Statistic>
              <span className={classes.span}>Chain</span>
              <p className={classes.p}>
                {socialToken.chain
                  ? socialToken.chain
                  : <span className={classes.chain}>Privi</span>
                }
              </p>
            </Statistic>
          </GridItem>
        </Grid>
      )}
    </div>
  );
};

export default styled(About)`
  margin: 50px 0;
`;
