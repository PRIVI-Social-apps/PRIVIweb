import { InputBase } from "@material-ui/core";
import styled from "styled-components";
import { Color, BorderRadius, grid } from "../../constants/const";

type InputSize = "medium" | "large";

type InputProps = {
  size?: InputSize;
};

export const Input = styled(InputBase).attrs<InputProps, { size: InputSize }>(p => ({
  size: p.size || "medium",
}))`
  && {
    font-family: Agrandir;
    background-color: ${Color.GrayInputBackground};
    border-radius: ${p => BORDER_RADIUS[p.size]};
    height: ${p => HEIGHT[p.size]};
    padding: 0 ${grid(2)};

    color: ${Color.GrayDark};
    border: 1px solid ${Color.GrayInputBorder};
    transition: 100ms border-color ease;

    &.Mui-focused {
      border-color: ${Color.GrayInputBorderSelected};
    }

    &::placeholder {
      ${Color.GrayInputPlaceholder}
    }

    .MuiInputAdornment-root {
      color: ${Color.GrayInputBorderSelected};
    }

    .MuiInputAdornment-positionEnd {
      margin-right: -${grid(1)};
    }
  }
`;

const BORDER_RADIUS: { [key in InputSize]: BorderRadius } = {
  medium: BorderRadius.S,
  large: BorderRadius.M,
};

const HEIGHT: { [key in InputSize]: string } = {
  medium: grid(5),
  large: grid(7),
};
