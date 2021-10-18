import React from "react";

import AuctionInfo from "./AuctionInfo";
import MarketActivity from "./MarketActivity";
import OwnershipHistory from "./OwnershipHistory";
import ProofAuthenticity from "./ProofAuthenticity";
import PriceHistory from "./PriceHistory";
import { Header4, Modal, TabNavigation } from "shared/ui-kit";
import Box from 'shared/ui-kit/Box';

const Tabs = [
  "Auction Info",
  "Price History",
  "Market activity",
  "Ownership History",
  "Proof of authenticity",
];

export default function DigitalArtDetailsModal({ open, handleClose, media }) {
  const [tabIndex, setTabIndex] = React.useState<number>(0);

  return (
    <Modal size="medium" isOpen={open} onClose={handleClose} showCloseIcon>
      <Box>
        <Header4>Details</Header4>
        <TabNavigation
          tabs={Tabs}
          currentTab={tabIndex}
          variant="primary"
          onTabChange={setTabIndex}
          size="small"
        />
        <Box mt={4}>
          {tabIndex === 0 && media.Auctions && <AuctionInfo media={media} />}
          {tabIndex === 1 && <PriceHistory />}
          {tabIndex === 2 && <MarketActivity />}
          {tabIndex === 3 && <OwnershipHistory media={media} />}
          {tabIndex === 4 && <ProofAuthenticity media={media} />}
        </Box>
      </Box>
    </Modal>
  );
}
