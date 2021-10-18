import React from "react";

import { makeStyles, Accordion, AccordionDetails, AccordionSummary, Avatar } from "@material-ui/core";
import { DropDownIcon } from "shared/ui-kit/Icons";
import Box from 'shared/ui-kit/Box';

const useStyles = makeStyles(() => ({
  auctionDetailsAccordion: {
    margin: "0 !important",
    border: "none",
    boxShadow: "none !important",
  },
  auctionDetailsAccodionSummary: {
    padding: 0,
    margin: 0,
    color: "#181818",
    minHeight: 0,
    maxHeight: 58,
  },
  auctionStatusContainer: {
    width: "100%",
    display: "flex",
    justifyContent: "space-between",
  },
  auctionTitleH4: {
    margin: 0,
  },
  auctionCollectionImg: {
    width: 78,
    height: 78,
    borderRadius: 6,
  },
  accordionHistory: {
    width: "100%",
    marginLeft: 48,
  },
  ownerAvatarImg: {
    width: 32,
    height: 32,
  },
  tagType: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "4px 11px",
    border: "1px solid #99a1b3",
    borderRadius: "14px",
    fontStyle: "normal",
    fontWeight: "normal",
    fontSize: "11px",
    color: "#99a1b3",
    height: "30px",
    width: "fit-content",
  },
}));

///////////////////  SUBCOMPONENTS ///////////////////

export const Details = ({ owner, user, media }) => {
  const classes = useStyles();
  return (
    <Accordion className={classes.auctionDetailsAccordion} defaultExpanded>
      <AccordionSummary className={classes.auctionDetailsAccodionSummary} expandIcon={<DropDownIcon />}>
        <div className={classes.auctionStatusContainer}>
          <Box fontWeight={700} fontSize={18} color="#181818" className={classes.auctionTitleH4}>
            Details
          </Box>
        </div>
      </AccordionSummary>
      <AccordionDetails style={{ padding: 0 }}>
        <Box display="flex" flexDirection="column">
          <Box display="flex" flexDirection="row" alignItems="center">
            <Box mr={2}>
              <Avatar
                className={classes.ownerAvatarImg}
                alt={owner.name ?? "U"}
                src={owner.imageUrl ?? "none"}
              />
            </Box>
            <Box fontWeight={400} fontSize={14} color="#707582">
              Created by
            </Box>
            <Box ml={1} fontWeight={400} fontSize={14} color="#23D0C6">
              {owner.address && user.address
                ? owner.address === user.address
                  ? "You"
                  : owner.name
                : "Unknown"}
            </Box>
          </Box>
          <Box mt={2} fontWeight={400} fontSize={14} color="#707582">
            {media.MediaDescription}
          </Box>
          <Box mt={2}>
            <TypeTag />
          </Box>
        </Box>
      </AccordionDetails>
    </Accordion>
  );
};

export const Collection = media => {
  const classes = useStyles();

  return (
    <Accordion className={classes.auctionDetailsAccordion} defaultExpanded>
      <AccordionSummary className={classes.auctionDetailsAccodionSummary} expandIcon={<DropDownIcon />}>
        <div className={classes.auctionStatusContainer}>
          <Box fontWeight={700} fontSize={18} color="#181818" className={classes.auctionTitleH4}>
            About Collection Name
          </Box>
        </div>
      </AccordionSummary>
      <AccordionDetails style={{ padding: 0 }}>
        <Box display="flex" flexDirection="row">
          <Box mr={3}>
            <img
              src="https://homepages.cae.wisc.edu/~ece533/images/arctichare.png"
              alt="Collection"
              className={classes.auctionCollectionImg}
            />
          </Box>
          <Box>
            <Box fontWeight={400} fontSize={14} color="#707582">
              {media.content ?? "Not Available"}
            </Box>
          </Box>
        </Box>
      </AccordionDetails>
    </Accordion>
  );
};

export const ChainInfo = ({ media }) => {
  const classes = useStyles();

  return (
    <Accordion className={classes.auctionDetailsAccordion} defaultExpanded>
      <AccordionSummary className={classes.auctionDetailsAccodionSummary} expandIcon={<DropDownIcon />}>
        <div className={classes.auctionStatusContainer}>
          <Box fontWeight={700} fontSize={18} color="#181818" className={classes.auctionTitleH4}>
            Chain Info
          </Box>
        </div>
      </AccordionSummary>
      <AccordionDetails style={{ padding: 0 }}>
        <Box display="flex" flexDirection="column">
          <Box fontWeight={400} fontSize={14} color="#181818" mb={1}>
            Blockchain
          </Box>
          <TypeTag />
          <Box fontWeight={400} fontSize={14} color="#181818" mt={3}>
            Token ID
          </Box>
          <Box fontWeight={400} fontSize={14} color="#707582">
            {media.MediaSymbol}
          </Box>
          <Box fontWeight={400} fontSize={14} color="#181818" mt={3}>
            Contract Address
          </Box>
          <Box fontWeight={400} fontSize={14} color="#23D0C6">
            {(media.Auctions && media.Auctions.Address) ?? "Unknown"}
          </Box>
        </Box>
      </AccordionDetails>
    </Accordion>
  );
};

const TypeTag = () => {
  const classes = useStyles();
  return (
    <div className={classes.tagType}>
      <img src={require(`assets/tokenImages/PRIVI.png`)} alt={"PRIVI"} style={{ width: "24px" }} />
      <Box fontWeight={400} fontSize={11} color="#707582">
        PRIVI
      </Box>
    </div>
  );
};

