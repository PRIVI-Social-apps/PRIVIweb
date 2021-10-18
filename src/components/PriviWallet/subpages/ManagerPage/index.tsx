import React, { useState, useEffect } from "react";
import { PrimaryButton, SecondaryButton } from "shared/ui-kit";
import { LoadingWrapper } from "shared/ui-kit/Hocs";
import WalletCard from "components/PriviWallet/components/Cards/WalletCard";
import * as API from "shared/services/API/WalletAPI";
import ConnectWalletModal from "components/PriviWallet/components/Modals/ConnectWalletModal";
import CreatePriviWallet from "components/PriviWallet/components/Modals/CreatePriviWallet";
import { managerPageStyles } from "./index.styles";
import Box from "shared/ui-kit/Box";

const COLUMNS_COUNT_BREAK_POINTS = {
  375: 1,
  900: 2,
  1200: 3,
};

const GUTTER = "16px";

const ManagerPage = props => {
  const classes = managerPageStyles();
  const [walletsList, setWalletsList] = useState<any>();
  const [totalBalance, setTotalBalance] = useState<number>(28034908);
  const [openAddWalletDlg, setOpenAddWalletDlg] = useState<boolean>(false);
  const [openCreatePriviWalletDlg, setOpenCreatePriviWalletDlg] = useState<boolean>(false);
  const [walletTopBoxFlag, setWalletTopBoxFlag] = useState(true);

  useEffect(() => {
    const fetchWallets = async () => {
      try {
        const wallets = await API.getUserRegisteredWallets();
        setWalletsList(wallets);
      } catch (e) {
        console.log(e.message);
      }
    };
    fetchWallets();
  }, []);

  const onClickPriviScan = () => {
    window.open("https://priviscan.io/tx/");
  };

  const handleWalletTopBoxClose = () => {
    setWalletTopBoxFlag(false);
  };

  return (
    <div className={classes.container}>
      <div className={classes.subContainer}>
        <div className={classes.flexBoxHeader}>
          <div className={classes.totalBalanceBox}>
            <Box>
              <div className={classes.headerTotalBalanceTitle}>Total Balance</div>
              <div className={classes.headerTotalBalanceValue}>${totalBalance?.toLocaleString()}</div>
            </Box>

            <Box>
              <PrimaryButton
                size="small"
                onClick={() => {
                  setOpenAddWalletDlg(true);
                }}
              >
                Connect New Wallet
              </PrimaryButton>
              <SecondaryButton size="small" onClick={onClickPriviScan}>
                Priviscan
              </SecondaryButton>
            </Box>
          </div>
          {walletTopBoxFlag && (
            <div className={`${classes.flexBox} ${classes.walletTopBox}`}>
              <img src={require("assets/icons/wallet.png")} height="100%" />
              <div className={classes.startNowSection}>
                <div className={classes.topHeaderLabel}>
                  Get your <b>Privi Wallet</b>
                </div>
                <SecondaryButton
                  size="small"
                  onClick={() => {
                    setOpenCreatePriviWalletDlg(true);
                  }}
                  style={{ height: 26, marginTop: 11 }}
                >
                  Create New
                </SecondaryButton>
              </div>
              <div className={classes.closeButton} onClick={handleWalletTopBoxClose}>
                <img src={require("assets/icons/x_darkblue.png")} className={classes.closeIcon} alt={"x"} />
              </div>
            </div>
          )}
        </div>
        <div className={classes.manageWalletSection}>
          <div className={classes.manageWalletTitle}>Manage wallets</div>

          <LoadingWrapper loading={!walletsList}>
            {walletsList &&
              walletsList.map((wallet, index) => (
                <WalletCard
                  key={index}
                  wallet={wallet}
                  walletList={walletsList}
                  setWalletsList={setWalletsList}
                  index={index}
                  onViewWallet={props.onViewWallet}
                />
              ))}
          </LoadingWrapper>
        </div>
        {openCreatePriviWalletDlg && (
          <CreatePriviWallet
            onClose={() => setOpenCreatePriviWalletDlg(false)}
            walletList={walletsList}
            setWalletList={setWalletsList}
          />
        )}
        {openAddWalletDlg && (
          <ConnectWalletModal
            open={openAddWalletDlg}
            handleClose={() => setOpenAddWalletDlg(false)}
            walletsList={walletsList}
            setWalletsList={setWalletsList}
          />
        )}
      </div>
    </div>
  );
};

export default ManagerPage;
