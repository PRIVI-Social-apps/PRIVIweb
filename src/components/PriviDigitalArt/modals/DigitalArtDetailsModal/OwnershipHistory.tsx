import React from "react";
import Moment from "react-moment";

import { ExternalLinkIcon } from "./index.styles";
import { Avatar, Color, StyledDivider, Text } from "shared/ui-kit";
import { useTypedSelector } from "store/reducers/Reducer";
import Box from 'shared/ui-kit/Box';

const OwnershipHistory = ({ media }) => {
  const allUsers = useTypedSelector(state => state.usersInfoList);
  const histories = React.useMemo(() => {
    if (!media || !media.Auctions || !media.BidHistory || media.BidHistory.length === 0) return [];
    return media.BidHistory.map((history: any) => ({
      user: allUsers.find(user => user.address === history.bidderAddress),
      price: history.price,
      date: history.date,
    })).filter(history => history && history.user);
  }, [allUsers, media]);

  return (
    <div style={{ minHeight: 400 }}>
      {histories.map((history, index) => (
        <Box key={`owner-history-${index}`}>
          <StyledDivider type="solid" margin={2} />
          <Box display="flex" flexDirection="row" alignItems="center" justifyContent="space-between">
            <Box display="flex" flexDirection="row" alignItems="center">
              <Avatar size="medium" url={history.user.url} />
              <Box ml={2} display="flex" flexDirection="column">
                <Box display="flex" flexDirection="row">
                  <Text color={Color.Black}>Bid placed by</Text>
                  <Text ml={1}>{`@${history.user.twitter || ''}`}</Text>
                </Box>
                <Box display="flex" flexDirection="row">
                  <Text color={Color.Black}>{`${history.price} ${media.Auctions.TokenSymbol}`}</Text>
                  <Text ml={1}>
                    <Moment fromNow>{history.date}</Moment>
                  </Text>
                </Box>
              </Box>
            </Box>
            <ExternalLinkIcon />
          </Box>
        </Box>
      ))}
    </div>
  );
};

export default OwnershipHistory;
