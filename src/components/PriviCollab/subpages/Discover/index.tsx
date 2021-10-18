import React from "react";

import { Select, MenuItem, Grid } from "@material-ui/core";

import { FontSize, PrimaryButton, Text } from "shared/ui-kit";
import FilterButtonGroup from "components/legacy/Communities/CommunityPage/components/General/components/FilterButtonGroup";
import CollabCard from "components/PriviCollab/components/CollabCard";
import PriviCollabContext from "shared/contexts/PriviCollabContext";
import Box from 'shared/ui-kit/Box';
import { useCommonStyles } from "../../index.styles";
import { discoverStyles } from './index.styles';

const FilterCategories = ['All', 'Accepted', 'Rejected'];
const OrderCategories = ['Most Liked First', 'Recent First'];

const Discover = () => {
  const commonClasses = useCommonStyles();
  const classes = discoverStyles();

  const { setOpenCreateModal } = React.useContext(PriviCollabContext);

  const [selectedFilter, setSelectedFilter] = React.useState<string>(FilterCategories[0]);
  const [selectedOrder, setSelectedOrder] = React.useState<any>(OrderCategories[0]);

  return (
    <Box position="relative">
      <img src={require("assets/collabImages/gradient.png")} alt={"gradient"} className={classes.mainImage} />
      <Box position="absolute" top={0} left={0} className={classes.content}>
        <Box mt={10} px={7} display="flex" flexDirection="row">
          <Box display="flex" flexDirection="column" width={1}>
            <Text size={FontSize.H2} bold>Engage with</Text>
            <Text size={FontSize.H2}>creators on Privi</Text>
            <Box display="flex" flexDirection="row" alignItems="center" mt={6} mb={2}>
              <Box display="flex" alignItems="center" justifyContent="center" bgcolor="white" borderRadius="100%" width={36} height={36}>
                <Text size={FontSize.L} bold>1</Text>
              </Box>
              <Box ml={2} flex={1}>
                <Text size={FontSize.L}>Submit an idea you’d want to see along  with whom you’d like the creator to be, or support other people’s requests.</Text>
              </Box>
            </Box>
            <Box display="flex" flexDirection="row" alignItems="center" mb={2}>
              <Box display="flex" alignItems="center" justifyContent="center" bgcolor="white" borderRadius="100%" width={36} height={36}>
                <Text size={FontSize.L} bold>2</Text>
              </Box>
              <Box ml={2} flex={1}>
                <Text size={FontSize.L}>Lock funds to support  collab and help make it come true.</Text>
              </Box>
            </Box>
            <Box display="flex" flexDirection="row" alignItems="center" mb={2}>
              <Box display="flex" alignItems="center" justifyContent="center" bgcolor="white" borderRadius="100%" width={36} height={36}>
                <Text size={FontSize.L} bold>3</Text>
              </Box>
              <Box ml={2} flex={1}>
                <Text size={FontSize.L}>Once the artists perform the collab they receive 90% of the funds and 10% is for those who pledged!</Text>
              </Box>
            </Box>
            <Box display="flex" flexDirection="row" alignItems="center" mb={2}>
              <Box display="flex" alignItems="center" justifyContent="center" bgcolor="white" borderRadius="100%" width={36} height={36}>
                <Text size={FontSize.L} bold>4</Text>
              </Box>
              <Box ml={2} flex={1}>
                <Text size={FontSize.L}>If the artists do not accept the collab, funds are returned to pledgers.</Text>
              </Box>
            </Box>
          </Box>
          <Box width={1} className={classes.sideImage}>
            <img src={require("assets/collabImages/logo.png")} alt={"logo"} />
          </Box>
        </Box>
        <Box mt={3} pl={12}>
          <PrimaryButton size="large" className={`${commonClasses.button} ${commonClasses.brownButton}`} onClick={() => setOpenCreateModal(true)}>Create Collab +</PrimaryButton>
        </Box>
        <Box mt={6} px={5}>
          <Box display="flex" flexDirection="row" alignItems="center">
            <img src={require("assets/collabImages/trending.png")} width={60} alt="trending" />
            <Text size={FontSize.XXL} bold>Trending Collabs</Text>
          </Box>
          <Grid
            container
            spacing={3}
            wrap="wrap"
          >
            <Grid item md={4}>
              <CollabCard type="accepted" status="completion" isTrending />
            </Grid>
            {[1, 2].map((collab, index) => (
              <Grid item md={4}>
                <CollabCard key={`collab-discover-${index}`} type="requested" isTrending />
              </Grid>
            ))}
          </Grid>
        </Box>
        <Box mt={6} px={5}>
          <Box display="flex" flexDirection="row" alignItems="center" justifyContent="space-between" flexWrap="wrap">
            <Box display="flex" flexDirection="row" alignItems="center">
              <img src={require("assets/collabImages/discover.png")} width={60} alt="trending" />
              <Text size={FontSize.XXL} bold>Discover</Text>
            </Box>
            <Box display="flex" flexDirection="row" flexWrap="wrap" className={classes.filterContainer}>
              <FilterButtonGroup
                categories={FilterCategories}
                selected={selectedFilter}
                onSelectCategory={setSelectedFilter}
              />
              <Select
                className={classes.order}
                value={selectedOrder}
                onChange={(e) => setSelectedOrder(e.target.value)}
              >
                {OrderCategories.map((order, index) => (
                  <MenuItem key={`order-${index}`} value={order}><Text size={FontSize.M}>{order}</Text></MenuItem>
                ))}
              </Select>
            </Box>
          </Box>
          <Grid
            container
            spacing={2}
            wrap="wrap"
          >
            <Grid item md={3}>
              <CollabCard type="accepted" status="completion" />
            </Grid>
            {[1, 2, 3, 4, 5, 6, 7].map((collab, index) => (
              <Grid item md={3}>
                <CollabCard key={`collab-discover-${index}`} type="requested" />
              </Grid>
            ))}
          </Grid>
        </Box>
      </Box>
    </Box>
  )
}

export default Discover;
