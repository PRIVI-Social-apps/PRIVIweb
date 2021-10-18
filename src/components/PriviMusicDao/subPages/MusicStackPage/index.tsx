import React, { useState } from "react";
import axios from "axios";
import { useHistory } from "react-router-dom";

import { useMediaQuery, useTheme, Hidden } from "@material-ui/core";
import {
  ArrowIcon,
  GradientArrowIcon,
  ShortArrowIcon,
  GradientMobileArrowIcon,
} from "components/PriviMusicDao/components/Icons/SvgIcons";

import { Text } from "components/PriviMusicDao/components/ui-kit";
import HistoryCard from "components/PriviMusicDao/components/Cards/HistoryCard";
import UnstackModal from "components/PriviMusicDao/modals/UnstackModal";

import InputWithLabelAndTooltip from "shared/ui-kit/InputWithLabelAndTooltip";
import { TokenSelect } from "shared/ui-kit/Select/TokenSelect";
import URL from "shared/functions/getURL";
import { BlockchainTokenSelect } from "shared/ui-kit/Select/BlockchainTokenSelect";
import { BlockchainNets } from "shared/constants/constants";
import { Color, FontSize, Gradient, PrimaryButton } from "shared/ui-kit";
import Box from 'shared/ui-kit/Box'

import { musicStackPageStyles } from "./index.styles";
import { InfoIcon } from "shared/ui-kit/Icons";

export default function MusicStackPage() {
  const classes = musicStackPageStyles();

  const history = useHistory();

  const [tokenObjs, setTokenObjs] = useState<any[]>([
    { token: "ETH", name: "Ethereum" },
    { token: "PRIVI", name: "Privi Coin" },
    { token: "BC", name: "Base Coin" },
    { token: "DC", name: "Data Coin" },
  ]);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));

  const [availableFundingBalance, setAvailableFundingBalance] = useState<number>(4544);
  const [fundingQuantity, setFundingQuantity] = useState<number>(0);
  const [fundingToken, setFundingToken] = useState<string>(tokenObjs[0].token);

  const [blockChain, setBlockChain] = useState<any>(BlockchainNets[0].name);
  const [unStackHistory, setUnStackHistory] = useState<any>();
  const [openUnstackModal, setOpenUnstackModal] = useState<boolean>(false);

  const [activeHistories, setActiveHistories] = useState([
    {
      date: Date.now(),
      tokenName: "BNB",
      endTime: new Date().getTime(),
      amount: 1324,
    },
    {
      date: Date.now(),
      tokenName: "BNB",
      endTime: new Date().getTime(),
      amount: 1324,
    },
    {
      date: Date.now(),
      tokenName: "BNB",
      endTime: new Date().getTime(),
      amount: 1324,
    },
  ]);

  React.useEffect(() => {
    axios.get(`${URL()}/wallet/getCryptosRateAsList`).then(res => {
      const resp = res.data;
      if (resp.success) {
        const tokenObjList: any[] = [];
        const data = resp.data;
        data.forEach(rateObj => {
          tokenObjList.push({ token: rateObj.token, name: rateObj.name });
        });
        setTokenObjs(tokenObjList);
      } else {
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // // used to get user funding token balance
  // const loadUserBalance = async isFunding => {
  //   const body = {
  //     userAddress: user.address,
  //     token: fundingToken,
  //   };
  //   axios.post(`${URL()}/wallet/balanceOf`, body).then(res => {
  //     const resp = res.data;
  //     if (resp.success) {
  //       setAvailableFundingBalance(resp.data.toFixed(4));
  //     }
  //   });
  // };

  const unStack = card => {
    setUnStackHistory(card);
    setOpenUnstackModal(true);
  };

  return (
    <Box className={classes.content}>
      <img src={require("assets/musicDAOImages/background.png")} className={classes.gradient} />
      <Box
        className={classes.flexBox}
        style={{ cursor: "pointer" }}
        onClick={() => history.goBack()}
        zIndex={1}
      >
        <Box color="#FFFFFF">
          <ArrowIcon />
        </Box>
        <Box color="#FFFFFF" fontSize={14} fontWeight={700} fontFamily="Agrandir" ml="5px" mb="4px">
          BACK
        </Box>
      </Box>
      <Box className={classes.whiteBox} mt={5} zIndex={1} borderBottom="1px solid #00000022" pb={2}>
        <Box className={classes.headerTitle}>Calculate your stake</Box>
        <Box className={classes.header1} mt={1}>
          Enjoy endless hours of content by staking stablecoins.
        </Box>
        <Box className={classes.stackBox} width={1} mt={3}>
          <Box mr={3} width={1}>
            <Box className={classes.header3}>I have</Box>
            <Box className={classes.flexBox} width={1}>
              <Box className={classes.borderBox} width={1}>
                <Box className={classes.flexBox}>
                  <InputWithLabelAndTooltip
                    type="text"
                    overriedClasses=""
                    style={{
                      border: "none",
                      background: "transparent",
                      margin: 0,
                      paddingLeft: 0,
                      paddingRight: 0,
                      minWidth: "48px",
                    }}
                    inputValue={fundingQuantity}
                    onInputValueChange={e => setFundingQuantity(e.target.value)}
                  />
                  <Box className={classes.header4} ml={2} style={{ whiteSpace: "nowrap" }}>
                    Use Max
                  </Box>
                </Box>
              </Box>
              <Box className={classes.borderBox} ml={isMobile ? 1 : 2}>
                <TokenSelect
                  tokens={tokenObjs}
                  value={fundingToken}
                  onChange={e => {
                    setFundingToken(e.target.value);
                  }}
                  style={{ background: "transparent", border: "none" }}
                />
              </Box>
            </Box>
            <Box className={classes.header4} ml="6px">{`Balance: ${availableFundingBalance} ${fundingToken}`}</Box>
            <Box mt={2} className={classes.borderBox} style={{ background: "transparent" }}>
              <BlockchainTokenSelect
                network={blockChain}
                setNetwork={setBlockChain}
                BlockchainNets={BlockchainNets}
              />
            </Box>
          </Box>
          <Box className={classes.arrowBox}>
            {
              isMobile ? (
                <GradientMobileArrowIcon />
              ) : (
                <GradientArrowIcon />
              )
            }
          </Box>
          <Box width={1}>
            <Box className={classes.header3}>I will get</Box>
            <Box className={classes.noBorderBox}>
              <Box className={classes.flexBox} style={{ borderBottom: "1px solid #00000022" }} pb={1}>
                <Box className={classes.colorText}>890 hrs.</Box>
                <Box className={classes.header2} ml={1}>
                  of free content
                </Box>
              </Box>
              <Box className={classes.flexBox} pt={1}>
                <Box className={classes.colorText}>120 day</Box>
                <Box className={classes.header2} ml={1}>
                  to repay
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
        <Box width={1} className={classes.flexBox} mt={4} justifyContent="center" flexDirection="column">
          <PrimaryButton
            size="medium"
            onClick={() => {}}
            style={{ background: Gradient.Green1, paddingLeft: "48px", paddingRight: "48px", width: isMobile ? "100%" : "unset" }}
            isRounded
          >
            Stake Now
          </PrimaryButton>
          <Box className={classes.header4} mt={1}>
            The current minimum staking period is 30 days.
            <InfoIcon />
          </Box>
        </Box>
      </Box>
      <Box display="flex" flexDirection="column" mt={11} zIndex={1} pb={2} borderBottom="1px solid #00000022">
        <Text size={FontSize.XXL} bold>
          Staking Details
        </Text>
        <Box display="flex" flexDirection="row" justifyContent="space-between" mt={6}>
          <Box display="flex" flexDirection="column">
            <Text className={classes.stakingValue}>
              8,5732 <span>Privi</span>
            </Text>
            <Text className={classes.stakingTitle} color={Color.MusicDAOGreen}>
              Amount staked
            </Text>
          </Box>
          <Box display="flex" flexDirection="column">
            <Text className={classes.stakingValue}>
              7,923 <span>Privi</span>
            </Text>
            <Text className={classes.stakingTitle} color={Color.MusicDAOGreen}>
              Debt repaid
            </Text>
          </Box>
          <Hidden only='xs'>
            <Box display="flex" flexDirection="column">
              <Text className={classes.stakingValue}>
                49,983 <span>hrs</span>
              </Text>
              <Text className={classes.stakingTitle} color={Color.MusicDAOGreen}>
                Free music left
              </Text>
            </Box>
            <Box display="flex" flexDirection="column">
              <Text className={classes.stakingValue}>
                12<span>h</span> 38<span>m</span> 19<span>s</span>
              </Text>
              <Text className={classes.stakingTitle} color={Color.MusicDAOGreen}>
                Time left to consume
              </Text>
            </Box>
          </Hidden>
        </Box>
        <Hidden smUp>
          <Box display="flex" flexDirection="row" justifyContent="space-between" mt={6}>
            <Box display="flex" flexDirection="column">
              <Text className={classes.stakingValue}>
                49,983 <span>hrs</span>
              </Text>
              <Text className={classes.stakingTitle} color={Color.MusicDAOGreen}>
                Free music left
              </Text>
            </Box>
            <Box display="flex" flexDirection="column">
              <Text className={classes.stakingValue}>
                12<span>h</span> 38<span>m</span> 19<span>s</span>
              </Text>
              <Text className={classes.stakingTitle} color={Color.MusicDAOGreen}>
                Time left to consume
              </Text>
            </Box>
          </Box>
        </Hidden>
      </Box>
      <Box display="flex" flexDirection="column" mt={11} zIndex={1}>
        <Text size={FontSize.XXL} bold>
          Staking history
        </Text>
        <Box className={classes.flexBox} mt={4} justifyContent="space-between">
          <div className={classes.stakingHistoryTitle}>Active</div>
          <Box
            className={classes.secondButtonBox}
            onClick={() => history.push("/privi-data-new/governance/discussions/")}
          >
            <Box className={classes.header4} color="#2D3047">
              Show All
            </Box>
            <Box style={{ transform: `rotate(90deg)` }} className={classes.flexBox} ml={3}>
              <ShortArrowIcon color="#2D3047" />
            </Box>
          </Box>
        </Box>
        <Box className={classes.flexBox} mt={2}>
          {activeHistories
            .filter((_, index) => (isMobile ? index < 1 : isTablet ? index < 2 : true))
            .map((activeItem, index) => (
              <Box key={`active-history-${index}`} ml={index > 0 ? 2 : 0} width={1}>
                <HistoryCard item={activeItem} unStack={unStack} isActiveCard={true} />
              </Box>
            ))}
        </Box>
        <Box className={classes.flexBox} mt={4} justifyContent="space-between">
          <div className={classes.stakingHistoryTitle}>Expired</div>
          <Box
            className={classes.secondButtonBox}
            onClick={() => history.push("/privi-data-new/governance/discussions/")}
          >
            <Box className={classes.header4} color="#2D3047">
              Show All
            </Box>
            <Box style={{ transform: `rotate(90deg)` }} className={classes.flexBox} ml={3}>
              <ShortArrowIcon color="#2D3047" />
            </Box>
          </Box>
        </Box>
        <Box className={classes.flexBox} mt={2}>
          {activeHistories
            .filter((_, index) => (isMobile ? index < 1 : isTablet ? index < 2 : true))
            .map((activeItem, index) => (
              <Box key={`expired-history-${index}`} ml={index > 0 ? 2 : 0} width={1}>
                <HistoryCard item={activeItem} unStack={unStack} isActiveCard={false} />
              </Box>
            ))}
        </Box>
        <Box className={classes.flexBox} mt={4} justifyContent="space-between">
          <div className={classes.stakingHistoryTitle}>Repaid</div>
          <Box
            className={classes.secondButtonBox}
            onClick={() => history.push("/privi-data-new/governance/discussions/")}
          >
            <Box className={classes.header4} color="#2D3047">
              Show All
            </Box>
            <Box style={{ transform: `rotate(90deg)` }} className={classes.flexBox} ml={3}>
              <ShortArrowIcon color="#2D3047" />
            </Box>
          </Box>
        </Box>
        <Box className={classes.flexBox} mt={2}>
          {activeHistories
            .filter((_, index) => (isMobile ? index < 1 : isTablet ? index < 2 : true))
            .map((activeItem, index) => (
              <Box key={`repaid-history-${index}`} ml={index > 0 ? 2 : 0} width={1}>
                <HistoryCard item={activeItem} unStack={unStack} isActiveCard={false} />
              </Box>
            ))}
        </Box>
      </Box>
      {openUnstackModal && (
        <UnstackModal
          open={openUnstackModal}
          handleClose={() => setOpenUnstackModal(false)}
          unStack={() => {}}
        />
      )}
    </Box>
  );
}
