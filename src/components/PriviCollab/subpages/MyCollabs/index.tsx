import React from "react";
import { Grid } from "@material-ui/core";
import { FontSize, Text } from "shared/ui-kit";
import CollabCard from "components/PriviCollab/components/CollabCard";
import Box from 'shared/ui-kit/Box';

const MyCollabs = () => {
  return (
    <Box pt={7} pl={4} pr={4} pb={5}>
      <Box display="flex" flexDirection="column">
        <Text mb={3} size={FontSize.XXL} bold>Mentioned Collabs</Text>
        <Grid
          container
          spacing={2}
          wrap="wrap"
        >
          {[1, 2].map((collab, index) => (
            <Grid item md={4}>
              <CollabCard key={`collab-discover-${index}`} type="mentioned" status="success" isTrending />
            </Grid>
          ))}
        </Grid>
      </Box>
      <Box display="flex" flexDirection="column" mt={6}>
        <Text mb={3} size={FontSize.XXL} bold>Created Collabs</Text>
        <Grid
          container
          spacing={2}
          wrap="wrap"
        >
          {[1, 2, 3].map((collab, index) => (
            <Grid item md={3}>
              <CollabCard key={`collab-discover-${index}`} type="requested" />
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  )
}

export default MyCollabs;
