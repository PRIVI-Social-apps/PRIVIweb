import React, { useContext, useEffect, useState } from "react";
import { useTypedSelector } from "store/reducers/Reducer";
import { Grid, makeStyles } from "@material-ui/core";
import Rating from "@material-ui/lab/Rating";
import SocialTokenContext from "components/PriviSocial/subpages/SocialToken/context";
import { Gradient } from "shared/ui-kit";

const isSignedIn = () => {
  return !!sessionStorage.getItem("token");
};

const useStyles = makeStyles(theme => ({
  ratingWrapper: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
    padding: "20px 0px",
    borderBottom: "1px dashed #1717174d",
    "& > div": {
      display: "flex",
      width: "100%",
      flexWrap: "nowrap",
    },
    "& label": {
      fontSize: "18px",
      lineHeight: "120%",
      color: "#707582",
      margin: "0px 0px 15px",
    },
    "& div": {
      "& h4": {
        color: "#181818",
        margin: 0,
        fontSize: "30px",
      },
      "& span": {
        color: "#707582",
        margin: 0,
        fontSize: "14px",
      },
    },
  },
  feedback: {
    display: "flex",
    flexDirection: "column",
    fontWeight: 400,
    fontFamily: "Agrandir",
  },
  rateIcon: {
    marginRight: "4px",
    background: Gradient.Magenta,
    width: "12px",
    height: "12px",
    borderRadius: "6px",
  },
  emptyRateIcon: {
    marginRight: "4px",
    width: "12px",
    height: "12px",
    background: "#eff2f8",
    border: "1px solid #e0e4f3",
    boxSizing: "border-box",
    borderRadius: "6px",
  },
}));

export default function PerkOpinions() {
  const { selectedPerk, setSelectedPerk } = useContext(SocialTokenContext);
  const user = useTypedSelector(state => state.user);

  const classes = useStyles();

  const [mediaRatings, setRatings] = useState([
    {
      key: "great",
      feedback: "Great Expirience",
      myRate: 0,
      average: 0,
    },
    {
      key: "must",
      feedback: "Must Do",
      myRate: 0,
      average: 0,
    },
    {
      key: "buy",
      feedback: "A must buy",
      myRate: 0,
      average: 0,
    },
    {
      key: "underpriced",
      feedback: "Underpriced",
      myRate: 0,
      average: 0,
    },
    {
      key: "overpriced",
      feedback: "Overpriced",
      myRate: 0,
      average: 0,
    },
    {
      key: "badtime",
      feedback: "Had a Bad Time",
      myRate: 0,
      average: 0,
    },
  ]);

  useEffect(() => {
    if (selectedPerk) {
      if (selectedPerk.Rating) {
        handleRatings(selectedPerk.Rating);
      }
    }
  }, [selectedPerk]);

  const handleRatings = ratings => {
    let rates = [...mediaRatings];
    const count = ratings.length;

    const sumGreat = ratings.reduce((prev, current) => (prev + current.great ? current.great : 0), 0);
    const sumMust = ratings.reduce((prev, current) => (prev + current.must ? current.must : 0), 0);
    const sumBuy = ratings.reduce((prev, current) => (prev + current.buy ? current.buy : 0), 0);
    const sumUnderpriced = ratings.reduce(
      (prev, current) => (prev + current.underpriced ? current.underpriced : 0),
      0
    );
    const sumOverpriced = ratings.reduce(
      (prev, current) => (prev + current.overpriced ? current.overpriced : 0),
      0
    );
    const sumBadTime = ratings.reduce((prev, current) => (prev + current.badtime ? current.badtime : 0), 0);

    rates[0].average = sumGreat / count;
    rates[1].average = sumMust / count;
    rates[2].average = sumBuy / count;
    rates[3].average = sumUnderpriced / count;
    rates[4].average = sumOverpriced / count;
    rates[5].average = sumBadTime / count;

    // My rate
    const myRate = ratings.filter(item => item.userId === user.id)[0];
    if (myRate) {
      rates[0].myRate = myRate.great ? myRate.great : rates[0].myRate;
      rates[1].myRate = myRate.must ? myRate.must : rates[1].myRate;
      rates[2].myRate = myRate.buy ? myRate.buy : rates[2].myRate;
      rates[3].myRate = myRate.underpriced ? myRate.underpriced : rates[3].myRate;
      rates[4].myRate = myRate.overpriced ? myRate.overpriced : rates[4].myRate;
      rates[5].myRate = myRate.badtime ? myRate.badtime : rates[5].myRate;
    }
    setRatings([...rates]);
  };

  const ratePerk = (rating, newValue) => {
    const ratingType = rating.key;
    if (newValue >= 0) {
      //TODO: create backend function
      /*axios
        .post(`${URL()}/socialToken/ratePerk`, {
          mediaId: selectedPerk.id,
          userId: user.id,
          ratingType,
          ratingValue: newValue,
        })
        .then(response => {
          if (response.data.ratings) {
            handleRatings(response.data.ratings);
          }
        })
        .catch(error => console.log(error));*/
    }
  };

  return (
    <div className={classes.ratingWrapper}>
      <label>💬 Opinions</label>
      <Grid container>
        {mediaRatings.map((rating, index) => (
          <Grid item key={`rating - ${index}`} xs={12} md={4} lg={2}>
            <div className={classes.feedback}>
              <h4>{rating.average}</h4>
              <span>{rating.feedback}</span>
            </div>
            <Rating
              disabled={!isSignedIn()}
              name={`rating - ${index}`}
              value={isSignedIn() ? rating.myRate : rating.average}
              icon={<div className={classes.rateIcon} />}
              emptyIcon={<div className={classes.emptyRateIcon} />}
              onChange={(event, newValue) => {
                if (isSignedIn()) {
                  ratePerk(rating, newValue);
                }
              }}
            />
          </Grid>
        ))}
      </Grid>
    </div>
  );
}
