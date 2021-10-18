import React, { useState } from "react";
import { Box, makeStyles, Select, MenuItem } from "@material-ui/core";
import { Color, FontSize, HeaderBold4, Modal, PrimaryButton } from "shared/ui-kit";
import { Text } from "components/PriviMusicDao/components/ui-kit";
import { ArrowUpIcon } from "components/PriviMusicDao/components/Icons/SvgIcons";
import { priviMusicDaoPageStyles } from "components/PriviMusicDao/index.styles";
import InputWithLabelAndTooltip from "shared/ui-kit/InputWithLabelAndTooltip";

const useStyles = makeStyles(theme => ({
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
    fontWeigth: 600,
  },
  shareInput: {
    width: "100%",
    paddingLeft: 20,
    paddingRight: 20,
    background: "rgba(218, 230, 229, 0.4)",
    border: "1px solid #7BCBB7",
    borderRadius: 55,
    height: 50,
  },
  costInput: {
    width: "100%",
    paddingLeft: 20,
    paddingRight: 20,
    border: "1px solid #F0F5F8",
    borderRadius: 55,
    height: 50,
    fontSize: 28,
    fontWeight: 700,

    "& input": {
      textAlign: "end",
    },
  },
  shareBox: {
    display: "flex",
    alignItems: "center",
    [theme.breakpoints.down("xs")]: {
      flexDirection: "column",
    },
  },
  shareItemBox1: {
    display: "flex",
    alignItems: "flex-start",
    flexDirection: "column",
    paddingRight: theme.spacing(1),
    width: "60%",
    [theme.breakpoints.down("xs")]: {
      width: "100%",
      paddingRight: 0,
    },
  },
  shareItemBox2: {
    display: "flex",
    alignItems: "flex-end",
    flexDirection: "column",
    paddingLeft: theme.spacing(1),
    width: "40%",
    [theme.breakpoints.down("xs")]: {
      width: "100%",
      paddingLeft: 0,
    },
  },
  availableBox: {
    fontSize: "14px",
    fontWeight: 400,
    color: "#707582",
    "& span": {
      fontWeight: 800,
    },
  },
}));

const BuyShareModal = props => {
  const classes = useStyles();
  const commonClasses = priviMusicDaoPageStyles();
  const [totalCost, setTotalCost] = useState<string>("");
  const [shares, setShares] = useState<string>("");

  return (
    <Modal size="small" isOpen={props.open} onClose={props.handleClose} showCloseIcon>
      <Box>
        <Box display="flex" flexDirection="column" alignItems="center">
          <Text size={FontSize.H4} color={Color.MusicDAODark} style={{ fontWeight: 800 }}>
            Buy shares on time slot
          </Text>
          <Box display="flex" flexDirection="row" alignItems="center" mt={3} mb={3}>
            <img src={require("assets/musicDAOImages/audio.png")} alt="audio" />
            <Text
              size={FontSize.M}
              color={Color.MusicDAOLightBlue}
              ml={1.5}
              mr={1.5}
              style={{ fontWeight: 700 }}
            >
              From
            </Text>
            <div className={classes.hour}>
              <Text size={FontSize.M} color={Color.MusicDAODeepGreen} style={{ fontWeight: 700 }}>
                0h
              </Text>
            </div>
            <Text
              size={FontSize.M}
              color={Color.MusicDAOLightBlue}
              ml={1.5}
              mr={1.5}
              style={{ fontWeight: 700 }}
            >
              To
            </Text>
            <div className={classes.hour}>
              <Text size={FontSize.M} color={Color.MusicDAODeepGreen} style={{ fontWeight: 700 }}>
                4h
              </Text>
            </div>
          </Box>
          <Text size={FontSize.L} className={classes.subTitle} color={Color.MusicDAOLightBlue}>
            Users will listen from 0 to 4hours of music on Privi Platform within next 24hours{" "}
          </Text>
        </Box>
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          bgcolor="#F2FBF6"
          borderRadius={12}
          width="100%"
          px={4}
          py={3}
          mt={2}
        >
          <Text size={FontSize.XL} bold color={Color.MusicDAOLightBlue}>
            SHARES AT
          </Text>
          <Box display="flex" flexDirection="row" alignItems="center" mt={1}>
            <Text size={FontSize.H4} bold color={Color.MusicDAODeepGreen}>
              17.456 pUSD
            </Text>
            <Box
              display="flex"
              alignItems="center"
              justifyContent="center"
              flexDirection="row"
              bgcolor="rgba(0, 209, 59, 0.09)"
              borderRadius={15}
              width={48}
              height={20}
              ml={1}
            >
              <ArrowUpIcon />
              <Text size={FontSize.S} color={Color.MusicDAOTightGreen} ml={0.5}>
                -3%
              </Text>
            </Box>
          </Box>
        </Box>
        <Box className={classes.shareBox} mt={3}>
          <Box className={classes.shareItemBox1}>
            <Text
              mb={2}
              size={FontSize.L}
              style={{ fontWeight: 600, opacity: 0.9 }}
              color={Color.MusicDAODark}
            >
              How many shares?
            </Text>
            <InputWithLabelAndTooltip
              type="text"
              overriedClasses={classes.shareInput}
              inputValue={shares}
              onInputValueChange={e => setShares(e.target.value)}
            />
            <Box mt={2} display="flex" alignItems="center">
              <Box className={classes.availableBox}>
                Available balance: <span>PriviUSD</span>
              </Box>
            </Box>
          </Box>
          <Box className={classes.shareItemBox2}>
            <Text
              mb={2}
              size={FontSize.L}
              color={Color.MusicDAOGreen}
              style={{ fontWeight: 600, opacity: 0.9 }}
            >
              Total cost
            </Text>
            <InputWithLabelAndTooltip
              type="text"
              overriedClasses={classes.costInput}
              inputValue={totalCost}
              onInputValueChange={e => setTotalCost(e.target.value)}
            />
            <Box mt={2} display="flex" alignItems="center">
              <Box className={classes.availableBox}>
                Fees: <span>0.000521 USDp</span>
              </Box>
            </Box>
          </Box>
        </Box>
        <Box display="flex" flexDirection="column" mt={3}>
          <Text mb={2} size={FontSize.L} color={Color.MusicDAODark} style={{ fontWeight: 600, opacity: 0.9 }}>
            Choose Blockchain Network
          </Text>
          <Select value={"2020-05-17"} className={commonClasses.outlineSelect}>
            <MenuItem value={"2020-05-17"}>
              <Box display="flex" flexDirection="row" alignItems="center">
                <img src={require("assets/musicDAOImages/USDp.png")} alt="usdp" height={30} />
                <Text color={Color.MusicDAOLightBlue} bold ml={2}>
                  Privi Chain
                </Text>
              </Box>
            </MenuItem>
          </Select>
        </Box>
        <Box display="flex" flexDirection="row" justifyContent="center" mt={5}>
          <PrimaryButton
            size="medium"
            className={commonClasses.primaryButton}
            isRounded
            style={{ paddingLeft: "48px", paddingRight: "48px" }}
          >
            Confirm Purchase
          </PrimaryButton>
        </Box>
      </Box>
    </Modal>
  );
};

export default BuyShareModal;
