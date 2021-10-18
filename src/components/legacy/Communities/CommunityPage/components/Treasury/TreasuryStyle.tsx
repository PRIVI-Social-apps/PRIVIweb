import React from "react";
import { makeStyles } from "@material-ui/core";
import styled, { css } from "styled-components";
import { Color, FontSize, Gradient, grid } from "shared/ui-kit";

export const useStyles = makeStyles(() => ({
  darkColor: {
    color: `${Color.GrayDark} !important`,
  },
  receiver: {
    display: "block",
    overflow: "hidden",
    whiteSpace: "nowrap",
    textOverflow: "ellipsis",
    background: Gradient.Mint,
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },
  sender: {
    display: "block",
    overflow: "hidden",
    whiteSpace: "nowrap",
    textOverflow: "ellipsis",
    background: Gradient.Red,
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },
  progress: {
    "& svg": {
      marginLeft: 8,
      marginRight: 16,
    },
    "& span": {
      size: 14,
      color: `${Color.GrayDark} !important`,
    },
  },
  timeCard: {
    borderRadius: 10,
    height: 48,
    background: Gradient.Mint,
    marginBottom: 16,
    paddingLeft: 16,
    paddingRight: 24,
    "& span, h4": {
      color: Color.White,
    },
    "& svg": {
      marginRight: 8,
    },
  },
  timeCardDark: {
    background: Gradient.BlueMagenta,
  },
  votedStatus: {
    opacity: 0.5,
  },
  progressTitle: {
    fontSize: 14,
    fontWeight: 700,
    color: Color.Black,
    width: 26,
  },
  progressTitleLarge: {
    fontSize: 14,
    fontWeight: 700,
    color: Color.Black,
    width: 70,
  },
  progressPercentage: {
    fontSize: 14,
    color: Color.Black,
    width: 32,
  },
  receiverSlug: {
    background: Gradient.Mint,
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    fontSize: 14,
    marginLeft: 8,
  },
  userSlug: {
    background: Gradient.Magenta,
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    fontSize: 14,
  },
  table: {
    boxShadow: "0px 2px 8px rgb(0 0 0 / 12%)",
    borderRadius: 14,
    "& .MuiTableHead-root": {
      backgroundColor: Color.GrayInputBackground,
    },
    "& .MuiTableCell-head": {
      textTransform: "uppercase",
      fontSize: 14,
      color: Color.Black,
    },
    "& .MuiTableCell-body": {
      fontSize: 14,
      color: Color.GrayDark,
    },
  },
  dateinput: {
    height: "40px !important",
    "& .MuiInputBase-root": {
      borderRadius: 6,
    },
  },
  multiRows: {
    height: "100% !important",
  },
}));

export const Card = styled.div`
  background: #ffffff;
  box-shadow: 3.79621px 3.79621px 22.7773px rgba(0, 0, 0, 0.1);
  border-radius: 16px;
  padding: 24px;
  margin-bottom: 24px;
`;

type TextProps = React.PropsWithChildren<{
  bold?: boolean;
  size?: FontSize;
  mt?: number;
  mb?: number;
  ml?: number;
  mr?: number;
}>;

export const Text = styled.span<TextProps>`
  font-size: ${p => p.size || FontSize.XL};
  color: ${p => (p.bold ? Color.Black : Color.GrayDark)};
  font-weight: ${p => (p.bold ? 800 : 400)};
  ${p =>
    p.mt &&
    css`
      margin-top: ${grid(p.mt)};
    `};
  ${p =>
    p.mb &&
    css`
      margin-bottom: ${grid(p.mb)};
    `};
  ${p =>
    p.ml &&
    css`
      margin-left: ${grid(p.ml)};
    `};
  ${p =>
    p.mr &&
    css`
      margin-right: ${grid(p.mr)};
    `};
`;

export type ProgressBarProps = React.PropsWithChildren<{
  value: number;
  theme?: "dark" | "light";
}>;

export const ProgressBar = styled.div<ProgressBarProps>`
  width: ${p => `${p.value}%`};
  height: 14px;
  background: ${p => (p.theme === "dark" ? Gradient.BlueMagenta : Gradient.Mint)};
  flex: 1;
`;

type IconProps = React.PropsWithChildren<{
  color?: Color;
}>;

export const HistoryIcon = ({ color, ...props }: IconProps) => (
  <svg width="20" height="21" viewBox="0 0 20 21" fill="none">
    <path
      d="M9.82422 5.5V10.5L12.8242 13.5M18.8242 10.5C18.8242 15.4706 14.7948 19.5 9.82422 19.5C4.85366 19.5 0.824219 15.4706 0.824219 10.5C0.824219 5.52944 4.85366 1.5 9.82422 1.5C14.7948 1.5 18.8242 5.52944 18.8242 10.5Z"
      stroke={color || Color.Black}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const PlusIcon = () => (
  <svg width="18" height="19" viewBox="0 0 18 19" fill="none">
    <path
      d="M8.82422 1.5V17.5M0.824219 9.5L16.8242 9.5"
      stroke="white"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const ProgressAcceptIcon = () => (
  <svg width="21" height="21" viewBox="0 0 21 21" fill="none">
    <path
      d="M16.4331 8.0393C16.7309 7.75145 16.739 7.27664 16.4512 6.9788C16.1633 6.68095 15.6885 6.67285 15.3907 6.9607L16.4331 8.0393ZM8.66882 14.5L8.14761 15.0393C8.4383 15.3203 8.89934 15.3203 9.19002 15.0393L8.66882 14.5ZM6.08581 10.9607C5.78796 10.6728 5.31316 10.6809 5.0253 10.9788C4.73745 11.2766 4.74556 11.7515 5.04341 12.0393L6.08581 10.9607ZM15.3907 6.9607L8.14761 13.9607L9.19002 15.0393L16.4331 8.0393L15.3907 6.9607ZM5.04341 12.0393L8.14761 15.0393L9.19002 13.9607L6.08581 10.9607L5.04341 12.0393ZM19.3008 10.5C19.3008 15.0324 15.4916 18.75 10.7383 18.75V20.25C16.2713 20.25 20.8008 15.9087 20.8008 10.5H19.3008ZM10.7383 18.75C5.98501 18.75 2.17578 15.0324 2.17578 10.5H0.675781C0.675781 15.9087 5.20525 20.25 10.7383 20.25V18.75ZM2.17578 10.5C2.17578 5.96757 5.98501 2.25 10.7383 2.25V0.75C5.20525 0.75 0.675781 5.0913 0.675781 10.5H2.17578ZM10.7383 2.25C15.4916 2.25 19.3008 5.96757 19.3008 10.5H20.8008C20.8008 5.0913 16.2713 0.75 10.7383 0.75V2.25Z"
      fill="#65CB63"
    />
  </svg>
);

export const ProgressDeclineIcon = () => (
  <svg width="21" height="21" viewBox="0 0 21 21" fill="none">
    <path
      d="M13.7855 8.0393C14.0833 7.75145 14.0914 7.27664 13.8036 6.9788C13.5157 6.68095 13.0409 6.67285 12.7431 6.9607L13.7855 8.0393ZM6.53473 12.9607C6.23688 13.2485 6.22878 13.7233 6.51663 14.0212C6.80448 14.319 7.27929 14.3271 7.57714 14.0393L6.53473 12.9607ZM7.57726 6.9607C7.27941 6.67285 6.80461 6.68095 6.51676 6.9788C6.2289 7.27664 6.23701 7.75145 6.53485 8.0393L7.57726 6.9607ZM12.7432 14.0393C13.041 14.3271 13.5158 14.319 13.8037 14.0212C14.0915 13.7233 14.0834 13.2485 13.7856 12.9607L12.7432 14.0393ZM12.7431 6.9607L6.53473 12.9607L7.57714 14.0393L13.7855 8.0393L12.7431 6.9607ZM6.53485 8.0393L12.7432 14.0393L13.7856 12.9607L7.57726 6.9607L6.53485 8.0393ZM18.7227 10.5C18.7227 15.0324 14.9134 18.75 10.1602 18.75V20.25C15.6932 20.25 20.2227 15.9087 20.2227 10.5H18.7227ZM10.1602 18.75C5.40688 18.75 1.59766 15.0324 1.59766 10.5H0.0976562C0.0976562 15.9087 4.62713 20.25 10.1602 20.25V18.75ZM1.59766 10.5C1.59766 5.96757 5.40688 2.25 10.1602 2.25V0.75C4.62713 0.75 0.0976562 5.0913 0.0976562 10.5H1.59766ZM10.1602 2.25C14.9134 2.25 18.7227 5.96757 18.7227 10.5H20.2227C20.2227 5.0913 15.6932 0.75 10.1602 0.75V2.25Z"
      fill="#F43E5F"
    />
  </svg>
);

export const ProgressPendingIcon = () => (
  <svg width="21" height="21" viewBox="0 0 21 21" fill="none">
    <path
      d="M10.168 5.5V10.5L13.2721 13.5M19.4805 10.5C19.4805 15.4706 15.3111 19.5 10.168 19.5C5.02482 19.5 0.855469 15.4706 0.855469 10.5C0.855469 5.52944 5.02482 1.5 10.168 1.5C15.3111 1.5 19.4805 5.52944 19.4805 10.5Z"
      stroke="#727F9A"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const SmileIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <path
      d="M6.21484 12.0879C6.21484 12.0879 7.71484 14.0879 10.2148 14.0879C12.7148 14.0879 14.2148 12.0879 14.2148 12.0879M7.21484 7.08789H7.22484M13.2148 7.08789H13.2248M19.2148 10.0879C19.2148 15.0585 15.1854 19.0879 10.2148 19.0879C5.24428 19.0879 1.21484 15.0585 1.21484 10.0879C1.21484 5.11733 5.24428 1.08789 10.2148 1.08789C15.1854 1.08789 19.2148 5.11733 19.2148 10.0879Z"
      stroke="#707582"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const FlagIcon = () => (
  <svg width="17" height="20" viewBox="0 0 17 20" fill="none">
    <path
      d="M1.21484 1.20508L1.53201 0.525441C1.29973 0.417042 1.02817 0.434781 0.811962 0.572475C0.595755 0.71017 0.464844 0.948748 0.464844 1.20508L1.21484 1.20508ZM0.464844 19.2051C0.464844 19.6193 0.80063 19.9551 1.21484 19.9551C1.62906 19.9551 1.96484 19.6193 1.96484 19.2051H0.464844ZM1.21484 15.2051H0.464844C0.464844 15.4614 0.595755 15.7 0.811962 15.8377C1.02817 15.9754 1.29973 15.9931 1.53201 15.8847L1.21484 15.2051ZM16.2148 8.20508L16.532 8.88472C16.7961 8.76149 16.9648 8.49647 16.9648 8.20508C16.9648 7.91368 16.7961 7.64867 16.532 7.52544L16.2148 8.20508ZM0.464844 1.20508V19.2051H1.96484V1.20508H0.464844ZM1.53201 15.8847L16.532 8.88472L15.8977 7.52544L0.89768 14.5254L1.53201 15.8847ZM16.532 7.52544L1.53201 0.525441L0.89768 1.88472L15.8977 8.88472L16.532 7.52544ZM1.96484 15.2051V1.20508H0.464844V15.2051H1.96484Z"
      fill="#707582"
    />
  </svg>
);

export const LinkIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
    <path
      d="M16.8242 0.79884L6.82418 10.7988M16.8242 0.79884L16.8243 6.79884M16.8242 0.79884L10.8242 0.798828M6.82422 0.79884H0.824219V16.7988H16.8242V10.7988"
      stroke="#727F9A"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const InfoIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <circle cx="7" cy="7" r="6" stroke="#081831" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
