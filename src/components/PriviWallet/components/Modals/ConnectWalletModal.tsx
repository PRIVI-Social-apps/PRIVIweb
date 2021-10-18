import React, { useEffect, useState } from "react";
import axios from "axios";
import { useWeb3React, UnsupportedChainIdError } from "@web3-react/core";
import { web3Accounts, web3Enable, web3FromSource } from "@polkadot/extension-dapp";
import { stringToHex } from "@polkadot/util";
import { Modal } from "shared/ui-kit";
import { WalletInfo, WALLETS } from "shared/constants/constants";
import URL from "shared/functions/getURL";
import { getWaxNFTs, getNewWaxInstance } from "shared/connectors/bridge/wax";
import { makeStyles } from "@material-ui/core";
import ConnectPriviWallet from "./ConnectPriviWallet";
import * as WalletAPIProvider from "shared/services/API/WalletAPI";
import { useAlertMessage } from "shared/hooks/useAlertMessage";

const wax = getNewWaxInstance();

export default function ConnectWalletModal(props) {
  const { walletsList, setWalletsList } = props;
  const [activeWallet, setActiveWallet] = useState<string>("");
  const classes = addWalletModalStyles();
  const { activate, account, deactivate } = useWeb3React();
  const [openConnectPriviWalletDlg, setOpenConnectPriviWalletDlg] = useState<boolean>(false);
  const { showAlertMessage } = useAlertMessage();

  useEffect(() => {
    if (account) handleWallet(account);
  }, [account, activeWallet]);

  const handleWallet = async (address: string) => {
    try {
      const userId = sessionStorage.getItem("userId");
      if (address && activeWallet) {
        handleClose();
        const res = await WalletAPIProvider.registerUserEthAccount({
          walletType: activeWallet,
          walletName: activeWallet,
          userId,
          address,
          walletStatus: true,
        });
        setWalletsList(res);
        showAlertMessage(`${activeWallet} has been connected`, { variant: "success" });
      }
    } catch (e) {
      console.log(e.message);
      showAlertMessage(e.message, { variant: "error" });
    }
  };

  const handleClose = () => {
    props.handleClose && props.handleClose();
  };

  const connectWax = async () => {
    try {
      const userAccount = await wax.login();
      const pubKeys = (wax as any).pubKeys;
      const userId = sessionStorage.getItem("userId");

      axios
        .post(`${URL()}/wallet/registerWaxWallet`, {
          walletName: userAccount,
          userId,
          pubKeys,
          address: pubKeys[0],
        })
        .then(async res => {
          if (res.data.success) {
            let walletsListCopy = [...walletsList];
            const findIndex = walletsList.findIndex(wallet => wallet.address === pubKeys[0]);
            if (findIndex < 0) {
              walletsListCopy.unshift({
                walletType: "WAX",
                name: userAccount,
                userId: userId,
                address: pubKeys[0],
                pubKeys,
                walletStatus: true,
              });
              const nfts = await getWaxNFTs(wax, userAccount as string);
              if (nfts.length > 0) {
                axios
                  .post(`${URL()}/user/storeNFTWaxTokenAddresses`, {
                    userId,
                    nfts,
                  })
                  .then(res => {
                    console.log(res);
                  });
              }
              setWalletsList(walletsListCopy);
            } else alert("The address is already exist");

            handleClose();
          }
        })
        .catch(err => {
          console.error("handleConnect registerWaxWallet failed", err);
        });
    } catch (e) {}
  };

  const onConnectWallet = async ({ type, title, connector }: WalletInfo) => {
    if (type === "privi") {
      setOpenConnectPriviWalletDlg(true);
    } else if (type === "wax") {
      connectWax();
    } else if (type === "polkadot") {
      connectPolkadot();
    } else {
      if (connector) {
        setActiveWallet(title);
        activate(connector, undefined, true).catch(error => {
          if (error instanceof UnsupportedChainIdError) {
            activate(connector);
          } else {
            console.info("Connection Error - ", error);
            showAlertMessage(error.message, { variant: "error" });
          }
        });
      }
    }
  };

  const connectPolkadot = async () => {
    try {
      const extensions = await web3Enable("Privi");
      if (extensions.length === 0) {
        return;
      }

      const allAccounts = await web3Accounts();
      if (allAccounts && allAccounts.length) {
        const account = allAccounts[0];
        const injector = await web3FromSource(account.meta.source);

        // this injector object has a signer and a signRaw method
        // to be able to sign raw bytes
        const signRaw = injector?.signer?.signRaw;

        if (!!signRaw && account && account.address) {
          // after making sure that signRaw is defined
          // we can use it to sign our message
          const address = account.address;
          const { signature } = await signRaw({
            address,
            data: stringToHex("message to sign"),
            type: "bytes",
          });
          // const { nonce, data: balance } = await api.query.system.account(addresss);

          const userId = sessionStorage.getItem("userId");
          let walletsListCopy = [...walletsList];
          const findIndex = walletsList.findIndex(wallet => wallet.address === address);
          if (findIndex < 0) {
            await WalletAPIProvider.registerPolkadotWallet({
              walletType: "Polkadot",
              walletName: "Polkadot",
              userId,
              address,
              walletStatus: true,
            });

            walletsListCopy.unshift({
              walletType: "Polkadot",
              name: "Polkadot",
              userId: userId,
              address,
              walletStatus: true,
            });
          }
          handleClose();
          setWalletsList(walletsListCopy);
          showAlertMessage(`Polkadot wallet successfully connected!`, { variant: "success" });
        }
      }
    } catch (e) {
      showAlertMessage(`Error: ${e.message}`, { variant: "error" });
    }
  };

  return (
    <Modal size="medium" isOpen={props.open} onClose={handleClose} showCloseIcon className={classes.root}>
      <div className={classes.modalContent}>
        <div className={classes.header}>
          <div className={classes.connectWallet}>Connect wallet</div>
          <div className={classes.viewMyWallet}>View my wallets</div>
        </div>

        <div className={classes.connect}>
          {WALLETS.map(walletInfo => (
            <button key={walletInfo.title} onClick={() => onConnectWallet(walletInfo)}>
              <div>
                <div className="option-title">{walletInfo.title}</div>
                <div className="option-description">{walletInfo.description}</div>
              </div>
              <div>
                <img src={walletInfo.logo} alt={walletInfo.title} style={{ width: "50px" }} />
              </div>
            </button>
          ))}
        </div>
        {openConnectPriviWalletDlg && (
          <ConnectPriviWallet
            onClose={() => {
              setOpenConnectPriviWalletDlg(false);
            }}
          />
        )}
      </div>
    </Modal>
  );
}

export const addWalletModalStyles = makeStyles(() => ({
  root: {
    width: "578px !important",
  },
  modalContent: {
    padding: "10px 20px",
  },
  header: {
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  connect: {
    width: 470,
    "& .option-title": {
      display: "flex",
      fontSize: "30px",
    },
    "& .option-description": {
      display: "flex",
      fontSize: 18,
      color: "#99A1B3",
      fontWeight: "normal",
    },
    "& > button": {
      backgroundColor: "white",
      color: "#181818",
      boxShadow: "2px 2px 12px rgba(0, 0, 0, 0.1)",
      borderRadius: "20px",
      width: "100%",
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginTop: 24,
      marginBottom: 0,
      height: 115,
      marginLeft: 0,
      marginRight: 0,
      padding: 32,
      "&:hover": {
        boxShadow: "0px 0px 10px #27E8D9",
      },
      "&:focus": {
        outline: "none",
      },
    },
  },
  connectWallet: {
    color: "#23D0C6",
    fontSize: 25,
    lineHeight: "35px",
    fontWeight: 700,
    borderBottom: "3px solid #23D0C6",
    marginRight: 15,
  },
  viewMyWallet: {
    color: "#181818",
    fontSize: 14,
    fontWeight: 400,
    padding: 12,
    backgroundColor: "#EFF2F8",
    borderRadius: 10,
    cursor: "pointer",
  },
}));
