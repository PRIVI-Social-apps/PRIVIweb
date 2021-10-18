import React from "react";
import { Grid } from "@material-ui/core";
import { FontSize, Text } from "shared/ui-kit";
import CollabCard from "components/PriviCollab/components/CollabCard";
import FilterButtonGroup from "components/legacy/Communities/CommunityPage/components/General/components/FilterButtonGroup";
import Box from 'shared/ui-kit/Box';

const FilterCategories = ['All', 'Accepted', 'Rejected', 'Expired'];

const Requested = () => {
  const [selectedFilter, setSelectedFilter] = React.useState<string>(FilterCategories[0]);

  return (
    <Box pt={7} pl={4} pr={4} pb={5}>
      <Box display="flex" flexDirection="column">
        <Text mb={3} size={FontSize.XXL} bold>Latest Requests</Text>
        <Grid
          container
          spacing={2}
          wrap="wrap"
        >
          {[1, 2, 3, 4].map((collab, index) => (
            <Grid item md={3}>
              <CollabCard key={`collab-discover-${index}`} type="requested" />
            </Grid>
          ))}
        </Grid>
      </Box>
      <Box display="flex" flexDirection="column" mt={6}>
        <Text mb={3} size={FontSize.XXL} bold>Hot Requests</Text>
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
      <Box display="flex" flexDirection="column" mt={6}>
        <Box display="flex" flexDirection="row" alignItems="center" justifyContent="space-between" mb={3}>
          <Text size={FontSize.XXL} bold>All requests</Text>
          <FilterButtonGroup
            categories={FilterCategories}
            selected={selectedFilter}
            onSelectCategory={setSelectedFilter}
          />
        </Box>
        <Grid
          container
          spacing={2}
          wrap="wrap"
        >
          {[1, 2, 3, 4].map((collab, index) => (
            <Grid item md={3}>
              <CollabCard key={`collab-discover-${index}`} type="requested" />
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  )
}

export default Requested;
