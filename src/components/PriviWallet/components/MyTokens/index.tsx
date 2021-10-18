import React, { useState, useEffect } from "react";
import Box from "shared/ui-kit/Box";
import { makeStyles, Theme } from "@material-ui/core";
import { useTypedSelector } from "store/reducers/Reducer";
import axios from "axios";
import URL from "shared/functions/getURL";
import { MasonryGrid } from "shared/ui-kit/MasonryGrid/MasonryGrid";
import TokenCard from "./components/TokenCard";
import { Color } from "shared/ui-kit";

const columnsCountBreakPoints = { 1400: 5, 1200: 4, 900: 3, 670: 2 };

const MyTokens = () => {
  // STORE
  const userBalances = useTypedSelector(state => state.userBalances);

  const classes = useStyles();
  const [seeAll, setSeeAll] = useState<boolean>(false);
  const [tokensRateChange, setTokensRateChange] = useState<{}>({}); // difference of currentRate respect lastRate

  const [tokenBalanceList, setTokenBalanceList] = useState<any[]>([]); // balance objs in list

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    const newTokenBalanceList: any[] = [];
    Object.values(userBalances).forEach(balanceObj => {
      const tokenBalance = {
        Chain: "PRIVI",
        Token: balanceObj.Token,
        Type: balanceObj.Type,
        Balance: balanceObj.Balance,
      };
      newTokenBalanceList.push(tokenBalance);
    });
    setTokenBalanceList(newTokenBalanceList);
    const intervalId = setInterval(() => updateBalance(newTokenBalanceList), 1000);
    return () => clearInterval(intervalId);
  }, [userBalances]);

  // calculate new amount based on current time
  const updateBalance = tokenBalanceList => {
    const newTokenBalanceList: any[] = [];
    const currTimeInS = Math.floor(Date.now() / 1000);
    tokenBalanceList.forEach(tokenBalance => {
      const token = tokenBalance.Token;
      const balanceObj = userBalances[token];
      const passedSecs = currTimeInS - balanceObj.LastUpdate;
      const balance = Math.max(balanceObj.Balance + balanceObj.AmountPerSecond * passedSecs, 0);
      newTokenBalanceList.push({
        ...tokenBalance,
        Balance: balance,
      });
    });
    setTokenBalanceList(newTokenBalanceList);
  };

  const loadData = () => {
    axios
      .get(`${URL()}/wallet/getTokensRateChange`)
      .then(res => {
        const resp = res.data;
        if (resp.success) {
          setTokensRateChange(resp.data);
        }
      })
      .catch(error => {
        console.error(error);
      });
  };

  return (
    <Box mt={"60px"}>
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <div className={classes.headerbig}>My Tokens</div>
        {tokenBalanceList?.length > 8 && (
          <button
            className={classes.seeAll}
            style={seeAll ? { paddingLeft: "20px" } : {}}
            onClick={() => {
              setSeeAll(!seeAll);
            }}
          >
            {seeAll ? "Hide" : `Show All`}
            {!seeAll && (
              <svg width="14" height="11" viewBox="0 0 14 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M8.24515 10.9386C8.436 10.9386 8.60676 10.8658 8.75743 10.7201L13.4809 6.00419C13.6366 5.85854 13.7145 5.68025 13.7145 5.46931C13.7145 5.26339 13.6366 5.0851 13.4809 4.93443L8.78003 0.241071C8.69465 0.155692 8.60802 0.0941685 8.52012 0.0565011C8.43223 0.0188337 8.34058 0 8.24515 0C8.04426 0 7.87601 0.0652902 7.74041 0.195871C7.60481 0.326451 7.537 0.492188 7.537 0.69308C7.537 0.793527 7.55458 0.887695 7.58974 0.975586C7.6249 1.06348 7.67512 1.14007 7.74041 1.20536L9.34504 2.83259L11.5564 4.8545L9.87992 4.75363L1.06574 4.75363C0.854806 4.75363 0.681536 4.82017 0.545933 4.95326C0.410331 5.08636 0.342529 5.25837 0.342529 5.46931C0.342529 5.68527 0.410331 5.85979 0.545933 5.99289C0.681536 6.12598 0.854806 6.19252 1.06574 6.19252L9.87992 6.19252L11.5628 6.09264L9.34504 8.11356L7.74041 9.74079C7.67512 9.80608 7.6249 9.88267 7.58974 9.97056C7.55458 10.0585 7.537 10.1526 7.537 10.2531C7.537 10.4489 7.60481 10.6122 7.74041 10.7427C7.87601 10.8733 8.04426 10.9386 8.24515 10.9386Z"
                  fill={Color.MusicDAODark}
                />
              </svg>
            )}
          </button>
        )}
      </Box>
      <Box className="token-cards" mt={"24px"}>
        {tokenBalanceList?.length > 0 ? (
          <MasonryGrid
            data={tokenBalanceList?.filter((t, i) => (seeAll ? true : i < 8))}
            renderItem={(token, index) => (
              <TokenCard
                token={token}
                rateOfChange={tokensRateChange[token.Token] ?? 0.0}
                key={`${token.Token}-${token.Token}-${index}`}
              />
            )}
            columnsCountBreakPoints={columnsCountBreakPoints}
            gutter="20px"
          />
        ) : (
          <Box className="no-pods">No Token Balance List to Show</Box>
        )}
      </Box>
    </Box>
  );
};

export default MyTokens;

const useStyles = makeStyles((theme: Theme) => ({
  flexBox: {
    display: "flex",
    alignItems: "center",
  },
  flexBoxHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: `${theme.spacing(1)}px ${theme.spacing(1)}px`,
  },
  headerbig: {
    color: Color.MusicDAODark,
    fontSize: "22px",
    fontWeight: 800,
    lineHeight: "130%",
    fontFamily: "Agrandir Grandlight",
  },
  seeAll: {
    paddingLeft: "48px",
    paddingRight: "16px",
    paddingTop: "15px",
    paddingBottom: "14px",
    display: "flex",
    alignItems: "center",
    background: "transparent",
    border: "1px solid #4218B5",
    borderRadius: "30px",
    color: Color.MusicDAODark,
    fontSize: "14px",
    fontFamily: "Montserrat",
    fontWeight: 600,
    lineHeight: "18px",
    "& svg": {
      marginLeft: "18px",
      height: "10.85px",
    },
  },
  header2: {
    fontSize: "12px",
    fontWeight: 700,
    color: "#707582",
  },
  optionButton: {
    borderRadius: theme.spacing(2),
    border: "1px solid black",
    background: "transparent",
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    color: "black",
    padding: "0px 20px",
  },
  selected: {
    background: "black",
    color: "white",
  },
}));
