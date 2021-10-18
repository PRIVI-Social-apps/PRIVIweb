import React, {useEffect, useState} from "react";

import Rating from "@material-ui/lab/Rating";

import { Avatar } from "shared/ui-kit";

import { ReactComponent as StarIcon } from "assets/icons/star-regular.svg";
import { ReactComponent as StarSolidIcon } from "assets/icons/star-solid.svg";
import Box from 'shared/ui-kit/Box';
import { priviCardStyles } from './index.styles';

const PriviCard = ({ item, hideAvatar = false, showMark = false, customWidth = "auto" }) => {
  const classes = priviCardStyles();

  const [cardImage, setCardImage] = useState(require("assets/backgrounds/privi_art.png"));

  useEffect(() => {
    if(item.photo) {
      setCardImage(item.photo);
    }
  }, [item]);

  return (
    <Box className={classes.container}
         style={{ width: customWidth }}>
      <img src={cardImage}
           className={classes.topImg}
           style={{ objectFit: "cover" }}/>
      <Box px={2}>
        <Box className={classes.header1} mt={2}>
          {item.name}
        </Box>
        <Box className={classes.header2} mt={3}>
          {item.description}
        </Box>
        {!hideAvatar && (
          <Box className={`${classes.flexBox} ${classes.bottomBox}`} mt={2} pt={2}>
            <Box className={classes.flexBox}>
              <Avatar size="medium" url={require("assets/anonAvatars/ToyFaces_Colored_BG_035.jpg")} alt="" />
              <Box className={classes.shadowBox} ml={-1}>
                {item.count}
              </Box>
            </Box>
            <Rating
              disabled={true}
              value={4}
              icon={<StarSolidIcon style={{ width: "12px", color: "black" }} />}
              emptyIcon={<StarIcon style={{ width: "12px" }} />}
            />
          </Box>
        )}
      </Box>
      {showMark && (
        <Box
          className={classes.flexBox}
          style={{ position: "absolute", bottom: "10px", justifyContent: "center" }}
          width={1}
        >
          <Box
            style={{
              width: "40px",
              height: "10px",
              borderTop: "2px solid #18181822",
              borderBottom: "2px solid #18181822",
            }}
          />
        </Box>
      )}
    </Box>
  );
};

export default PriviCard;
