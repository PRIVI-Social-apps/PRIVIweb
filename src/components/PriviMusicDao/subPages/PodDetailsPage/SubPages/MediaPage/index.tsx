import React from "react";
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";

import { makeStyles } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import Box from "shared/ui-kit/Box";
import { MediaCard } from "components/PriviMusicDao/components/Cards/MediaCard";

const COLUMNS_COUNT_BREAK_POINTS = {
  375: 1,
  900: 2,
  1200: 3,
};

const GUTTER = "16px";

const useStyles = makeStyles(theme => ({
  cardsGrid: {
    display: "grid",
    gridColumnGap: "20px",
    gridRowGap: "20px",
    width: "100%",
  },
}));

export const MediaPage = ({ medias }) => {
  const classes = useStyles();

  return (
    <Box width={1} display="flex" flexGrow={1}>
      {medias && medias.length
        ? (
          <Grid className={classes.cardsGrid}>
            <ResponsiveMasonry columnsCountBreakPoints={COLUMNS_COUNT_BREAK_POINTS}>
              <Masonry gutter={GUTTER}>
                {medias &&
                  medias.map((media, index) => (
                    <Box key={index}>
                      <MediaCard media={media} />
                    </Box>
                  ))}
              </Masonry>
            </ResponsiveMasonry>
          </Grid>
        ) : (
          <p>No medias available</p>
        )}
    </Box>
  );
};
