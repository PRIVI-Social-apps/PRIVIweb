import React from "react";
import styled from "styled-components";

import { makeStyles } from "@material-ui/core";

import { Gradient } from "shared/ui-kit";

export type GreenTextProps = React.PropsWithChildren<{
  fontSize?: string;
  pointer?: boolean;
  bold?: boolean;
}>;

export const GreenText = styled.div<GreenTextProps>`
  font-size: ${p => p.fontSize ?? "18px"};
  background: ${Gradient.Green};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-decoration: none;
  font-weight: ${p => (p.bold ? 800 : 400)};
  cursor: ${p => (p.pointer ? "cursor" : "inherit")};
`;

export const GreenTitle = styled.div`
  font-family: Monoton;
  font-style: normal;
  font-weight: normal;
  font-size: 80px;
  background: ${Gradient.Green};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

export type CardProps = React.PropsWithChildren<{
  noPadding?: boolean;
}>;

export const Card = styled.div<CardProps>`
  background: #eff2f8;
  display: flex;
  flex-direction: column;
  color: #707582;
  box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.12);
  border-radius: 16px;
  padding: ${p => (p.noPadding ? "0px" : "24px")};
`;

export const SocialPrimaryButton = styled.button`
  background: #707582;
  border: 1.5px solid #707582;
  color: white;
  font-family: Agrandir;
  font-style: normal;
  font-weight: 800;
  font-size: 16px;
  line-height: 21px;
  min-height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 106px;
  padding: 8px 16px;
  border-radius: 6px;
`;

export const SocialSecondaryButton = styled.button`
  background: #ffffff;
  border: 1.5px solid #707582;
  color: #707582;
  font-style: normal;
  font-weight: 800;
  font-size: 16px;
  line-height: 21px;
  font-family: Agrandir;
  min-height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 106px;
  padding: 8px 16px;
  border-radius: 6px;
`;

export const priviSocialPageStyles = makeStyles(theme => ({
  priviSocial: {
    height: '100vh',
    width: '100vw',
  },
  content: {
    display: 'flex',
    width: '100%',
    height: '100%',
    flexDirection: 'column',
    overflow: 'hidden',
    maxHeight: 'calc(100vh - 108px)',
    padding: '30px 120px 90px',
    background: 'rgba(255, 255, 255, 0.7)',
    overflowY: 'auto',
    '&::-webkit-scrollbar': {
      width: 10
    },
    '&::-webkit-scrollbar-thumb': {
      width: 20,
      background: 'rgba(238, 241, 244, 1)'
    },
    [theme.breakpoints.down("md")]: {
      padding: '30px 30px 90px',
    },
    [theme.breakpoints.down("sm")]: {
      padding: '30px 20px 90px',
    },
  }
}));
