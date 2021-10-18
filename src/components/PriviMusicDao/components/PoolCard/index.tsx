import React from "react";
import { Box, makeStyles } from "@material-ui/core";
import { Color, FontSize, PrimaryButton, StyledDivider } from "shared/ui-kit";
import { Text } from "../ui-kit";
import { priviMusicDaoPageStyles } from "components/PriviMusicDao/index.styles";

const useStyles = makeStyles(() => ({
  container: {
    background: Color.White,
    boxShadow: "0px 8px 25px -3px rgba(0, 0, 0, 0.08)",
    borderRadius: 20,
    padding: "33px 27px 19px 27px",
  }
}));

const PoolCard = ({ data, handleMore }) => {
  const classes = useStyles();
  const commonClasses = priviMusicDaoPageStyles();

  return (
    <Box className={classes.container}>
      <Box display="flex" flexDirection="row" alignItems="center" justifyContent="center" position="relative">
        <Box position="absolute" left={0}>
          <img src={require(`assets/tokenImages/${data.Token}.png`)} width="38" alt="token" />
        </Box>
        <Text size={FontSize.XL} bold mr={2}>{data.Token} Pool</Text>
      </Box>
      <Box display="flex" flexDirection="row" alignItems="center" justifyContent="space-between" mt={4}>
        <Text color={Color.MusicDAOLightBlue}>Apr</Text>
        <Text size={FontSize.XL} bold>{data.APR}%</Text>
      </Box>
      <StyledDivider type="solid" margin={1}/>
      <Box display="flex" flexDirection="row" alignItems="center" justifyContent="space-between">
        <Text color={Color.MusicDAOLightBlue}>Volume</Text>
        <Text size={FontSize.XL} bold>$ {data.Volume}%</Text>
      </Box>
      <StyledDivider type="solid" margin={1}/>
      <Box display="flex" flexDirection="row" alignItems="center" justifyContent="space-between">
        <Text color={Color.MusicDAOLightBlue}>Luquidity</Text>
        <Text size={FontSize.XL} bold>$ {data.Luquidity}%</Text>
      </Box>
      <StyledDivider type="solid" mt={1} mb={2}/>
      <Text color={Color.MusicDAOLightBlue}>Liquidity to borrow</Text>
      <img src={require("assets/musicDAOImages/graph.png")} width="100%" alt="graph"/>
      <StyledDivider type="solid" margin={1}/>
      <Box display="flex" flexDirection="row" justifyContent="center">
        <PrimaryButton size="medium" className={commonClasses.primaryButton} onClick={handleMore}>More</PrimaryButton>
      </Box>
    </Box>
  )
}

export default PoolCard;
