import React from "react";
import { Box, makeStyles } from "@material-ui/core";
import { Text } from "../ui-kit";
import { Color, FontSize, PrimaryButton, StyledDivider } from "shared/ui-kit";
import { priviMusicDaoPageStyles } from "components/PriviMusicDao/index.styles";
import Avatar from "shared/ui-kit/Avatar";
import { getRandomAvatar } from "shared/services/user/getUserAvatar";

const useStyles = makeStyles({
  container: {
    position: "relative",
    height: "100%",
    background: Color.White,
    boxShadow: "0px 10px 20px rgba(19, 45, 38, 0.07)",
    borderRadius: 20,
    overflow: "hidden",
  },
  logoImage: {
    width: "100%",
  },
  thumb: {
    position: "absolute",
    top: 16,
    right: 16,
  },
  avatar: {
    marginTop: -16,
    marginLeft: "16px !important",
  }
});

export default function SongCard({ data }) {
  const commonClasses = priviMusicDaoPageStyles();
  const classes = useStyles();

  return (
    <Box display="flex" flexDirection="column" className={classes.container}>
      <img className={classes.logoImage} src={data.image} alt="trending" />
      <img className={classes.thumb} src={require("assets/musicDAOImages/thumb.png")} alt="thumb" />
      <Avatar className={classes.avatar} image={getRandomAvatar()} size={32} rounded={true}/>
      <Box display="flex" flexDirection="column" padding={2}>
        <Box display="flex" flexDirection="row" alignItems="center" justifyContent="space-between">
          <Text mt={2} size={FontSize.XL}>{data.title}</Text>
          <img width="32" src={require("assets/musicDAOImages/trending.png")} alt="trending" />
        </Box>
        <Box my={2}>
          <StyledDivider type="solid" />
        </Box>
        <Box display="flex" flexDirection="row" justifyContent="space-between" mb={2}>
          <Text>Reproductions:</Text>
          <Text>34,589</Text>
        </Box>
        <PrimaryButton size="medium" className={commonClasses.primaryButton}>CLAIM</PrimaryButton>
      </Box>
    </Box>
  )
}