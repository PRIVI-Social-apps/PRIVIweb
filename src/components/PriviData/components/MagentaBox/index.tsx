import React, { useContext, useEffect, useState } from "react";

import { Grid } from "@material-ui/core";

import { magentaBoxStyles } from './index.styles';
import PriviDataContext from "shared/contexts/PriviDataContext";
import { PrimaryButton, SecondaryButton } from "shared/ui-kit";
import { useTypedSelector } from "store/reducers/Reducer";
import { TokenSelect } from "shared/ui-kit/Select/TokenSelect";
import AdvertiseModal from "components/PriviData/modals/AdvertiseModal";
import InputWithLabelAndTooltip from "shared/ui-kit/InputWithLabelAndTooltip";
import Box from 'shared/ui-kit/Box';

enum OpenType {
  Home = "HOME",
  Advertise = "ADVERTISE",
  BuyDATAp = "BUY DATAP",
}

type MagentaBoxProps = {
  ownedToken?: string;
  setOwnedToken?: any;
  tradeToken?: string;
  setTradeToken?: any;
};

export default function MagentaBox({
  ownedToken,
  setOwnedToken,
  tradeToken,
  setTradeToken,
}: MagentaBoxProps) {
  const classes = magentaBoxStyles();
  const { openTab } = useContext(PriviDataContext);

  if (openTab) {
    return (
      <div className={classes.box}>
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          className={openTab === OpenType.Advertise ? classes.monkeyIcon : classes.walletIcon}
        >
          <img
            src={require(`assets/icons3d/${openTab === OpenType.Advertise ? "monkey_emoji" : "wallet"}.png`)}
            alt={openTab === OpenType.Advertise ? "monkey" : "wallet"}
          />
          {openTab === OpenType.Advertise ? (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100.63 8.07">
              <ellipse cx="50.31" cy="4.04" rx="50.31" ry="4.04" fill="#F149E4" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 144.96 12.73">
              <path
                fill="#F149E4"
                d="M145,9.81c0,1.94-19.89,3.52-44.42,3.52S56.13,11.75,56.13,9.81,76,6.29,100.54,6.29,145,7.87,145,9.81Z"
                transform="translate(0 -0.6)"
              />
              <path
                fill="#F149E4"
                d="M100.91,4.64c0,2.23-22.59,4-50.46,4S0,6.87,0,4.64,22.59.6,50.45.6,100.91,2.41,100.91,4.64Z"
                transform="translate(0 -0.6)"
              />
            </svg>
          )}
        </Box>
        {openTab === OpenType.Advertise ? (
          <AdvertiseContent />
        ) : (
          <BuyDataContent
            ownedToken={ownedToken}
            setOwnedToken={setOwnedToken}
            tradeToken={tradeToken}
            setTradeToken={setTradeToken}
          />
        )}
      </div>
    );
  } else return null;
}

const BuyDataContent = ({ ownedToken, setOwnedToken, tradeToken, setTradeToken }) => {
  const classes = magentaBoxStyles();
  const userBalances = useTypedSelector(state => state.userBalances);

  const [ownedAmount, setOwnedAmount] = useState<number>(0);
  const [ownedTokens, setOwnedTokens] = useState<any[]>([]);
  const [ownedBalance, setOwnedBalance] = useState<number>(0);
  const [tradeAmount, setTradeAmount] = useState<number>(0);
  const [tradeTokens, setTradeTokens] = useState<any[]>([]);

  useEffect(() => {
    if (userBalances && Object.keys(userBalances).length > 0) {
      let tokens = [] as any;
      let tTokens = [] as any;
      Object.keys(userBalances).forEach(token => {
        if (
          userBalances[token] &&
          userBalances[token].Type === "CRYPTO" &&
          userBalances[token].Token !== "DATAp"
        ) {
          tokens.push({ token: userBalances[token].Token, balance: userBalances[token].Balance ?? 0 });
        } else if (userBalances[token] && userBalances[token].Token === "DATAp") {
          tTokens.push({ token: userBalances[token].Token, balance: userBalances[token].Balance ?? 0 });
        }
      });

      setOwnedTokens(tokens);
      if (tokens.length > 0) {
        setOwnedToken(tokens[0].token);
        setOwnedBalance(tokens[0].balance);
      }

      setTradeTokens(tTokens);
      if (tTokens.length > 0) {
        setTradeToken(tTokens[0].token);
      } else {
        setTradeTokens([{ token: "DATAp", balance: 0 }]);
      }
    }
  }, [userBalances]);

  const handleUseMax = () => {
    if (ownedBalance) {
      setOwnedAmount(ownedBalance);
    }
  };

  const handleSwap = () => {
    let ownedA = ownedAmount;
    let ownedT = ownedToken;
    let ownedTs = ownedTokens;

    if (tradeTokens && tradeTokens.length > 0 && tradeToken) {
      const thisToken = tradeTokens.find(t => t.token === tradeToken);
      if (thisToken) {
        setOwnedBalance(thisToken.balance ?? 0);
      }
    } else setOwnedBalance(0);

    setOwnedAmount(tradeAmount);
    setOwnedToken(tradeToken);
    setOwnedTokens(tradeTokens);

    setTradeAmount(ownedA);
    setTradeToken(ownedT);
    setTradeTokens(ownedTs);
  };

  const handleTrade = () => {};

  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="space-between"
      width="100%"
      className={classes.buy}
    >
      <Box display="flex" flexDirection="column">
        <h5>I Have</h5>
        <Grid container direction="row" spacing={1}>
          <Grid item xs={6}>
            <input
              value={ownedAmount}
              onChange={e => {
                setOwnedAmount(Number(e.target.value));
              }}
              type="number"
              min="0.001"
            />
          </Grid>
          <Grid item xs={6}>
            <TokenSelect
              className={classes.select}
              value={ownedToken}
              onChange={e => setOwnedToken(e.target.value)}
              disabled={ownedToken === "DATAp"}
              tokens={ownedTokens}
            />
          </Grid>
        </Grid>
        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          width="100%"
          marginTop="12px"
          color="white"
        >
          <span>{`Available: ${ownedBalance} ${ownedToken}`}</span>
          <span className={classes.underline} onClick={handleUseMax}>
            Use Max
          </span>
        </Box>
      </Box>

      <button onClick={handleSwap} className={classes.buttonSwap}>
        <img src={require("assets/icons/arrow_white.png")} alt="_white" />
        <img src={require("assets/icons/arrow_white.png")} alt="arrow" />
      </button>

      <Box display="flex" flexDirection="column" marginTop="-28px">
        <h5>I'll Get</h5>
        <Grid container direction="row" spacing={1}>
          <Grid item xs={6}>
            <input
              value={tradeAmount}
              onChange={e => {
                setTradeAmount(Number(e.target.value));
              }}
              type="number"
              min="0.001"
            />
          </Grid>
          <Grid item xs={6}>
            <TokenSelect
              className={classes.select}
              value={tradeToken}
              onChange={e => setTradeToken(e.target.value)}
              disabled={tradeToken === "DATAp"}
              tokens={tradeTokens}
            />
          </Grid>
        </Grid>
      </Box>

      <PrimaryButton className={classes.primary} size="medium" onClick={handleTrade}>
        Trade
      </PrimaryButton>
    </Box>
  );
};

const AdvertiseContent = () => {
  const classes = magentaBoxStyles();
  const { setOpenTab } = useContext(PriviDataContext);

  const [openAdvertiseModal, setOpenAdvertiseModal] = useState<boolean>(false);

  const handleOpenAdvertiseModal = () => {
    setOpenAdvertiseModal(true);
  };
  const handleCloseAdvertiseModal = () => {
    setOpenAdvertiseModal(false);
  };

  return (
    <Box>
      <h5>Promote Your Content With Anyone</h5>
      <p>
        Use <b>DATAp</b> coins to share <b>anything</b> you want with the people <b>you choose</b>.
      </p>
      <Box display="flex" alignItems="center">
        <PrimaryButton className={classes.primary} size="medium" onClick={handleOpenAdvertiseModal}>
          Start Now
        </PrimaryButton>
        <SecondaryButton
          size="medium"
          className={classes.secondary}
          onClick={() => setOpenTab(OpenType.BuyDATAp)}
        >
          Get DATAp
        </SecondaryButton>
      </Box>

      <AdvertiseModal open={openAdvertiseModal} handleClose={handleCloseAdvertiseModal} />
    </Box>
  );
};
