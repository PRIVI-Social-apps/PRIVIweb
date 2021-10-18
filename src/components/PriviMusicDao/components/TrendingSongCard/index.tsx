import React from "react";
import { Box, makeStyles } from "@material-ui/core";
import { Text } from "../ui-kit";
import { Color, FontSize, PrimaryButton, StyledDivider } from "shared/ui-kit";
import { priviMusicDaoPageStyles } from "components/PriviMusicDao/index.styles";

const useStyles = makeStyles({
  container: {
    height: "100%",
    background: Color.White,
    boxShadow: "0px 15px 16px -11px rgba(0, 0, 0, 0.02)",
    borderRadius: 20,
    padding: "18px 14px",
    overflow: "hidden",
  },
  logoImage: {
    width: "100%",
    borderRadius: 20,
  }
});

export default function TrendingSongCard({ data }) {
  const commonClasses = priviMusicDaoPageStyles();
  const classes = useStyles();

  return (
    <Box display="flex" flexDirection="column" className={classes.container}>
      <img className={classes.logoImage} src={data.image} alt="trending" />
      <Text mt={2} size={FontSize.XL}>{data.title}</Text>
      <Text size={FontSize.L} color={Color.MusicDAOLightBlue}>{data.description}</Text>
      <Box display="flex" flexDirection="row" alignItems="center" justifyContent="space-between" mt={2}>
        <PrimaryButton size="medium" className={commonClasses.primaryButton}>CLAIM</PrimaryButton>
        <img src={require("assets/musicDAOImages/trending.png")} alt="trending" />
      </Box>
    </Box>
  )
}