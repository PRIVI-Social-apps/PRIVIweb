import React from "react";
import { Link } from "react-router-dom";
import { Box, makeStyles, Select, MenuItem, Slider } from "@material-ui/core";
import { Color, FontSize, HeaderBold4, Modal, PrimaryButton, SecondaryButton, StyledDivider, } from "shared/ui-kit";
import { Text } from "components/PriviMusicDao/components/ui-kit";
import { priviMusicDaoPageStyles } from "components/PriviMusicDao/index.styles";

const useStyles = makeStyles(() => ({
  hour: {
    background: Color.White,
    boxShadow: "0px 4px 13px rgba(0, 0, 0, 0.13)",
    borderRadius: 48,
    width: 80,
    height: 44,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  subTitle: {
    width: "80%",
    textAlign: "center",
  },
  shareInput: {
    width: "100%",
    paddingLeft: 20,
    paddingRight: 20,
    background: "rgba(218, 230, 229, 0.4)",
    border: "1px solid #7BCBB7",
    borderRadius: 55,
    height: 50,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    "& input": {
      background: "transparent",
      outline: "none",
      flex: 1,
      border: "none",
      fontSize: 18,
      textAlign: "end",
    }
  },
  select: {
    height: 50,
    width: "100%",
  },
  link: {
    marginLeft: 4,
    color: Color.MusicDAOGreen,
    textDecoration: "none",
  },
  slider: {
    color: Color.MusicDAOGreen
  }
}));

const AddLiquidityModal = (props) => {
  const classes = useStyles();
  const commonClasses = priviMusicDaoPageStyles();

  return (
    <Modal size="daoMedium" isOpen={props.open} onClose={props.handleClose} showCloseIcon>
      <Box px={2}>
        <Box display="flex" flexDirection="column" alignItems="center">
          <HeaderBold4 noMargin>Add Liquidity to USDT Pool</HeaderBold4>
          <Text size={FontSize.L} className={classes.subTitle} mt={1}>Borrow funds from a period of time to generate yiled.</Text>
        </Box>
        <Box display="flex" flexDirection="column" mt={4}>
          <Text size={FontSize.L} bold>Liquidity amount you want to provide</Text>
          <Box display="flex" flexDirection="row" alignItems="center" mt={1}>
            <Box className={classes.shareInput} width={1} pr={1}>
              <Box display="flex">
                <img src={require("assets/tokenImages/USDT.png")} width={37} alt="token" />
              </Box>
              <input placeholder="2000 USDT" />
            </Box>
            <Box width={1} pl={1}>
              <Select value={'2020-05-17'} className={`${commonClasses.outlineSelect} ${classes.select}`}>
                <MenuItem value={'2020-05-17'}>
                  <Box display="flex" flexDirection="row" alignItems="center">
                    <img src={require("assets/musicDAOImages/USDp.png")} alt="usdp" height={30} />
                    <Text color={Color.MusicDAOLightBlue} bold ml={2}>Privi Chain</Text>
                  </Box>
                </MenuItem>
              </Select>
            </Box>
          </Box>
          <Text mt={1}>Balance: 4544 USDT</Text>
        </Box>
        <StyledDivider type="solid" margin={3} />
        <Box display="flex" flexDirection="column">
          <Text size={FontSize.L} bold mb={1}>Set Interval Range</Text>
          <Text size={FontSize.L}>
            Your liquidity will only earn fees from consumption of music within your<br />range.
            <Link to="#" className={classes.link}>Need help picking a range?</Link>
          </Text>
          <Box display="flex" flexDirection="row" mt={3}>
            <Box width={0.5} pr={1}>
              <Box display="flex" flexDirection="column" alignItems="center" border="1px solid #D6E1DD" borderRadius={20} px={8} py={2}>
                <Text size={FontSize.L} bold>Min. Hours</Text>
                <Text size={FontSize.H3} bold>0.0</Text>
                <Box display="flex" flexDirection="row">
                  <SecondaryButton size="medium" className={commonClasses.secondaryButton}>-15 min</SecondaryButton>
                  <PrimaryButton size="medium" className={commonClasses.primaryButton}>+15 min</PrimaryButton>
                </Box>
              </Box>
            </Box>
            <Box width={0.5} pl={1}>
              <Box display="flex" flexDirection="column" alignItems="center" border="1px solid #D6E1DD" borderRadius={20} px={8} py={2}>
                <Text size={FontSize.L} bold>Max. Hours</Text>
                <Text size={FontSize.H3} bold>0.0</Text>
                <Box display="flex" flexDirection="row">
                  <SecondaryButton size="medium" className={commonClasses.secondaryButton}>-15 min</SecondaryButton>
                  <PrimaryButton size="medium" className={commonClasses.primaryButton}>+15 min</PrimaryButton>
                </Box>
              </Box>
            </Box>
          </Box>
          <Box display="flex" flexDirection="row" alignItems="center" justifyContent="space-between" mt={3}>
            <Text size={FontSize.L} bold>You can borrow funds to generate yield.<br />The  faster you repay, more funds you get.</Text>
            <svg width="23" height="23" viewBox="0 0 23 23" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="23" height="23" rx="11.5" fill="#B0E7AF" />
              <path fill-rule="evenodd" clip-rule="evenodd" d="M13.0401 6.67111C13.0401 7.34912 12.4751 7.8953 11.7515 7.8953C11.0378 7.8953 10.4629 7.34912 10.4629 6.67111C10.4629 5.98368 11.0378 5.4375 11.7515 5.4375C12.4751 5.4375 13.0401 5.98368 13.0401 6.67111ZM14.8639 15.7678C14.8639 16.1539 14.5467 16.427 14.1403 16.427H10.1059C9.69952 16.427 9.38232 16.1539 9.38232 15.7678C9.38232 15.4006 9.69952 15.1087 10.1059 15.1087H11.3351V10.7863H10.2744C9.86804 10.7863 9.55084 10.5132 9.55084 10.1271C9.55084 9.75989 9.86804 9.46796 10.2744 9.46796H12.138C12.6435 9.46796 12.9112 9.80697 12.9112 10.3155V15.1087H14.1403C14.5467 15.1087 14.8639 15.4006 14.8639 15.7678Z" fill="#2D3047" />
            </svg>
          </Box>
        </Box>
        <Box border="1px solid #D6E1DD" borderRadius={20} py={2} mt={2}>
          <Box display="flex" flexDirection="row" justifyContent="space-between" mt={1} px={3}>
            <Text size={FontSize.L} bold>Time to repay</Text>
            <Text size={FontSize.L} color={Color.MusicDAOGreen} bold>35 days</Text>
          </Box>
          <Slider
            defaultValue={30}
            aria-labelledby="discrete-slider"
            step={5}
            marks
            min={30}
            max={120}
            className={classes.slider}
          />
          <Box display="flex" flexDirection="row" justifyContent="space-between" px={3}>
            <Text size={FontSize.L} bold>30 Days</Text>
            <Text size={FontSize.L} bold>120 Days</Text>
          </Box>
          <StyledDivider type="solid" margin={2} />
          <Box display="flex" flexDirection="row" justifyContent="space-between" px={3}>
            <Box display="flex" flexDirection="column">
              <Text size={FontSize.L} bold>Collateralisation ratio</Text>
              <Text size={FontSize.H4} color={Color.MusicDAOGreen} bold>50%</Text>
            </Box>
            <Box display="flex" flexDirection="column" alignItems="flex-end">
              <Text size={FontSize.L} bold>Max borrowable amount</Text>
              <Text size={FontSize.H4} color={Color.MusicDAOGreen} bold>22445 USDT</Text>
            </Box>
          </Box>
        </Box>
        <Box mt={3}>
          <Text size={FontSize.L} bold>Amount to borrow</Text>
          <Box className={classes.shareInput} mt={2}>
            <Box display="flex">
              <img src={require("assets/tokenImages/USDT.png")} width={37} alt="token" />
            </Box>
            <input placeholder="2000 USDT" />
          </Box>
          <Box display="flex" flexDirection="column" alignItems="center" mt={3}>
            <Text size={FontSize.XL} color={Color.MusicDAOGreen} bold>EXPECTED APR</Text>
            <Text size={FontSize.H3} bold mt={1}>10%</Text>
          </Box>
        </Box>
        <Box display="flex" flexDirection="row" justifyContent="center" mt={5}>
          <PrimaryButton size="medium" className={commonClasses.primaryButton}>Connect Wallet</PrimaryButton>
        </Box>
      </Box>
    </Modal>
  )
}

export default AddLiquidityModal;