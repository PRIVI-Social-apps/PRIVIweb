import React from "react";
import { BorderRadius, Color, Gradient, grid, Header5, HeaderBold3 } from "shared/ui-kit";
import styled from "styled-components";

type HighlightedValue = {
  label: string;
  value: string;
};

export const HighlightedValue: React.FunctionComponent<HighlightedValue> = ({ label, value }) => (
  <HighlightedPanel>
    <Label>{label}</Label>
    <Value>{value}</Value>
  </HighlightedPanel>
);

const HighlightedPanel = styled.div`
  background: ${Gradient.Mint};
  padding: ${grid(1.5)};
  border-radius: ${BorderRadius.M};
`;

const Label = styled(Header5)`
  color: ${Color.White};
  margin-bottom: ${grid(1.5)};
`;

const Value = styled(HeaderBold3)`
  color: ${Color.White};
  margin-bottom: 0;
`;
