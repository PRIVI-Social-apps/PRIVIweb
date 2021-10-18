import React from "react";

import Rating from "@material-ui/lab/Rating";

import { ReactComponent as StarIcon } from "assets/icons/star-regular.svg";
import { ReactComponent as StarSolidIcon } from "assets/icons/star-solid.svg";
import Box from 'shared/ui-kit/Box';
import { suggestionCardStyles } from './index.styles';

const SuggestionCard = ({ item }) => {
  const classes = suggestionCardStyles();

  return (
    <Box className={classes.container}>
      <img src={require("assets/backgrounds/live_audio_1.png")} width="100%" />
      <Box className={`${classes.flexBox}`} mt={2} pt={2}>
        <Box className={classes.header1}>{item.name}</Box>
        <Rating
          disabled={true}
          value={4}
          icon={<StarSolidIcon style={{ width: "12px", color: "black" }} />}
          emptyIcon={<StarIcon style={{ width: "12px" }} />}
        />
      </Box>
      <Box className={classes.header2} mt={1}>
        {item.description}
      </Box>
    </Box>
  );
};

export default SuggestionCard;
