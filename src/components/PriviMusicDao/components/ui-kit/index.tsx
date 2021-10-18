import styled from "styled-components";
import { Color, Text as StyledText, TextProps } from "shared/ui-kit";

export const Text = styled(StyledText)<TextProps>`
  color: ${p => p.color || Color.MusicDAODark};
`;