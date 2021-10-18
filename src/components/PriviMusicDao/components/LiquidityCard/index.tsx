import React from "react"
import { Box, makeStyles } from "@material-ui/core"
import { Color, FontSize, PrimaryButton, StyledDivider } from "shared/ui-kit";
import { Text } from "../ui-kit";
import { ArrowUpIcon } from "../Icons/SvgIcons";
import { priviMusicDaoPageStyles } from "components/PriviMusicDao/index.styles";

const useStyles = makeStyles(() => ({
  container: {
    background: Color.White,
    boxShadow: "0px 46px 35px -31px rgba(29, 103, 84, 0.13)",
    borderRadius: 34,
    padding: "40px 20px 45px 20px",
  },
  hour: {
    background: Color.White,
    boxShadow: "0px 4px 13px rgba(0, 0, 0, 0.13)",
    borderRadius: 48,
    width: 80,
    height: 44,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  }
}));

export default function LiquidityCard({ data, onBuyShare }) {
  const classes = useStyles();
  const commonClasses = priviMusicDaoPageStyles();

  return (
    <Box className={classes.container}>
      <Box px={3}>
        <Box display="flex" flexDirection="row" alignItems="center" justifyContent="center" px={5}>
          <img src={require("assets/musicDAOImages/audio.png")} alt="audio" />
          <Text size={FontSize.L} color={Color.MusicDAOLightBlue} ml={1.5} mr={1.5}>From</Text>
          <div className={classes.hour}>
            <Text size={FontSize.L} bold color={Color.MusicDAODeepGreen}>0h</Text>
          </div>
          <Text size={FontSize.L} color={Color.MusicDAOLightBlue} ml={1.5} mr={1.5}>To</Text>
          <div className={classes.hour}>
            <Text size={FontSize.L} bold color={Color.MusicDAODeepGreen}>4h</Text>
          </div>
        </Box>
        <StyledDivider type="solid" margin={3} />
      </Box>
      <Box display="flex" flexDirection="row" alignItems="center" justifyContent="center">
        <img src={require("assets/musicDAOImages/product.png")} alt="product" />
        <Text size={FontSize.XL} bold color={Color.MusicDAOLightBlue}>LIQUIDITY</Text>
      </Box>
      <Box display="flex" flexDirection="row" justifyContent="center">
        <Text size={FontSize.H3} bold color={Color.MusicDAODeepBlue}>3232.456 USDp</Text>
      </Box>
      <Box display="flex" flexDirection="column" alignItems="center" bgcolor="#F2FBF6" borderRadius={12} width="100%" px={4} py={3} mt={2}>
        <Text size={FontSize.XL} bold color={Color.MusicDAOLightBlue}>SHARES AT</Text>
        <Box display="flex" flexDirection="row" alignItems="center" mt={1} mb={4}>
          <Text size={FontSize.H4} bold color={Color.MusicDAODeepGreen}>17.456 pUSD</Text>
          <Box display="flex" alignItems="center" justifyContent="center" flexDirection="row" bgcolor="rgba(0, 209, 59, 0.09)" borderRadius={15} width={48} height={20} ml={1}>
            <ArrowUpIcon />
            <Text size={FontSize.S} color={Color.MusicDAOTightGreen} ml={0.5}>-3%</Text>
          </Box>
        </Box>
        <PrimaryButton size="medium" className={commonClasses.primaryButton} onClick={onBuyShare}>Buy Shares</PrimaryButton>
      </Box>
    </Box>
  )
}