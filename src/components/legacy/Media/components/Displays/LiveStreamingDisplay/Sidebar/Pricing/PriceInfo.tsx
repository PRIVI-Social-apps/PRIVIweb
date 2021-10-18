import { useStreaming } from "shared/contexts/StreamingContext";
import React from "react";
import { useTokenConversion } from "shared/contexts/TokenConversionContext";
import { getStreamingPrice } from "shared/services/API/StreamingAPI";
import { Color, grid, Header3, Header5 } from "shared/ui-kit";
import styled from "styled-components";

export const PriceInfo: React.FunctionComponent = () => {
  const { currentStreaming } = useStreaming();
  const { convertTokenToUSD } = useTokenConversion();

  return (
    <Container>
      <LargeText>{currentStreaming && getStreamingPrice(currentStreaming)}</LargeText>
      <SmallText>
        {currentStreaming &&
          `($${convertTokenToUSD(currentStreaming.priceUnit, currentStreaming.price).toLocaleString()})`}
      </SmallText>
    </Container>
  );
};

const Container = styled.div`
  margin-bottom: ${grid(2)};
`;

const LargeText = styled(Header3)`
  display: inline-block;
  margin-bottom: 0;
  margin-right: ${grid(1.5)};
`;

const SmallText = styled(Header5)`
    display: inline-block;
  color: ${Color.GrayDark};
  margin-top: ${grid(1.5)};
  margin-bottom: 0;
`;
