import React from "react";
import { Grid } from "@material-ui/core";
import { FontSize, Text } from "shared/ui-kit";
import CollabCard from "components/PriviCollab/components/CollabCard";
import Box from 'shared/ui-kit/Box';

const Accepted = () => {
  return (
    <Box pt={7} pl={4} pr={4} pb={5}>
      <Box display="flex" flexDirection="column">
        <Text mb={3} size={FontSize.XXL} bold>Succesful collabs</Text>
        <Grid
          container
          spacing={2}
          wrap="wrap"
        >
          {[1, 2, 3, 4].map((collab, index) => (
            <Grid item md={3}>
              <CollabCard key={`collab-discover-${index}`} type="accepted" status="success" />
            </Grid>
          ))}
        </Grid>
      </Box>
      <Box display="flex" flexDirection="column" mt={6}>
        <Text mb={3} size={FontSize.XXL} bold>Failed collabs</Text>
        <Grid
          container
          spacing={2}
          wrap="wrap"
        >
          {[1, 2, 3].map((collab, index) => (
            <Grid item md={3}>
              <CollabCard key={`collab-discover-${index}`} type="accepted" status="failed" />
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  )
}

export default Accepted;
