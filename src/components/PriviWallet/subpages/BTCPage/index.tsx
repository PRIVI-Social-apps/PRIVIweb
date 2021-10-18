import React, { useState, useEffect } from "react";

//import axios from "axios";
//import URL from "shared/functions/getURL";
import { LoadingWrapper } from "shared/ui-kit/Hocs";

import LoanCard from "components/PriviWallet/components/Cards/LoanCard";
import Box from "shared/ui-kit/Box";
import { BTCPageStyles } from "./index.styles";
import { MasonryGrid } from "shared/ui-kit/MasonryGrid/MasonryGrid";
import BTCtoPrivi from "components/PriviWallet/components/BTCtoPrivi";
import { Color } from "shared/ui-kit";

const COLUMNS_COUNT_BREAK_POINTS = {
  375: 1,
  1200: 2,
};

const GUTTER = "16px";

const BTCPage = () => {
  const classes = BTCPageStyles();

  const [loanList, setLoanList] = useState<any[]>([]);
  const [loanLoading, setLoanLoading] = useState<boolean>(false);

  useEffect(() => {
    setLoanLoading(true);
    //TODO: load loans: current function gets wallets

    //axios
    //  .get(`${URL()}/wallet/getUserRegisteredWallets`)
    //  .then(res => {
    //    if (res.data.success) {
    //      setLoanList(res.data.data);
    //    }
    //  })
    //  .catch(err => {
    //    console.error("handleConnect getUserRegisteredEthAccount failed", err);
    //  })
    // .finally(() => {
    setLoanLoading(false);
    //  });
  }, []);

  return (
    <div className={classes.content}>
      <BTCtoPrivi />
      <Box mt="55px">
        <div className={classes.header}>My Loans</div>
        <LoadingWrapper loading={loanLoading}>
          {loanList?.length > 0 ? (
            <MasonryGrid
              data={loanList}
              renderItem={(loan, index) => <LoanCard index={index} key={`loan-${index}`} loan={""} />}
              gutter={GUTTER}
              columnsCountBreakPoints={COLUMNS_COUNT_BREAK_POINTS}
            />
          ) : (
            <Box fontSize="18px" color={Color.MusicDAODark}>
              No active loans
            </Box>
          )}
        </LoadingWrapper>
      </Box>
    </div>
  );
};

export default BTCPage;
