import React, { useState } from "react";
import axios from "axios";
import { useWeb3React } from "@web3-react/core";

import { SvgIcon } from "@material-ui/core";

import { walletCardStyles } from "./index.styles";
import URL from "shared/functions/getURL";
import { generatePriviWallet, lockPriviWallet } from "shared/helpers";
import CustomSwitch from "shared/ui-kit/CustomSwitch";
import { useTypedSelector } from "store/reducers/Reducer";
import { ReactComponent as StarRegular } from "assets/icons/star-regular.svg";
import { ReactComponent as StarSolid } from "assets/icons/star-solid.svg";
import { ReactComponent as CopyIcon } from "assets/icons/copy-regular.svg";
import { PrimaryButton, SecondaryButton } from "shared/ui-kit";
import Box from "shared/ui-kit/Box";
import { MnemonicWordsInputModal } from "shared/ui-kit/Modal/Modals";
import * as CRYPTO from "shared/helpers/aes-gcm";
import * as API from "shared/services/API/WalletAPI";
import { useAlertMessage } from "shared/hooks/useAlertMessage";
interface IWalletCardProps {
  wallet: any;
  setWalletsList: Function;
  index: string;
  onViewWallet: any;
  walletList: Array<any>;
}

const WalletCard: React.FC<IWalletCardProps> = props => {
  const { wallet, setWalletsList, walletList } = props;
  const user = useTypedSelector(state => state.user);
  const [openVerifyPriviWalletDlg, setOpenVerifyPriviWalletDlg] = useState<boolean>(false);
  const { deactivate } = useWeb3React();
  const { showAlertMessage } = useAlertMessage();
  const classes = walletCardStyles();

  const handleWalletActivation = async (newState: boolean) => {
    if (wallet)
      if (wallet.walletType === "Privi" && newState === false) {
        lockPriviWallet();
      }
    if (wallet.walletType === "Privi" && newState === true) {
      setOpenVerifyPriviWalletDlg(true);
    } else {
      try {
        const walletsData = await API.toggleUserRegisteredWallet({
          userId: user.id,
          address: wallet.address,
          newState,
        });
        setWalletsList(walletsData);
      } catch (err) {
        console.error("handleConnect removeUserRegisteredAccount failed", err);
      }
    }
  };

  const handleChooseMainWallet = async () => {
    if (wallet.main) return;
    try {
      await axios
        .post(`${URL()}/wallet/setMainEthAccount`, {
          userId: user.id,
          address: wallet.address,
        })
        .then(res => {
          if (res.data.success) {
            props.setWalletsList(res.data.data);
          }
        });
    } catch (err) {
      console.error("handleConnect setMainEthAccount failed", err);
    }
  };

  const handleViewWallet = () => {
    props.onViewWallet(wallet);
  };

  const handleDisconnect = async () => {
    const filteredWallets = walletList.filter(w => w.address !== wallet.address);
    try {
      await API.removeUserRegisteredWallet({
        userId: user.id,
        address: wallet.address,
      });
      deactivate();
      setWalletsList(filteredWallets);
      showAlertMessage(`${wallet.address} has been disconnected`, { variant: "success" });
    } catch (err) {
      console.error("handleConnect removeUserRegisteredAccount failed", err);
      showAlertMessage(`${wallet.address} has been disconnected`, { variant: "error" });
    }
  };

  const handleSubmitPriviWords = async (phrases: string[]) => {
    const { address, privateKey } = await generatePriviWallet(phrases);
    if (address === wallet.address) {
      try {
        const wallets = await API.toggleUserRegisteredWallet({
          userId: user.id,
          address: wallet.address,
          newState: true,
        });
        setWalletsList(wallets);
        await CRYPTO.savePriviKey(privateKey);
      } catch (err) {
        console.error("handleConnect removeUserRegisteredAccount failed", err);
      }
    } else {
    }
  };

  const handleConnectWallet = () => {};

  return (
    <div className={classes.walletTile} key={`wallet-${props.index}`}>
      <Box display="flex" alignItems="center">
        <div className={classes.icon}>
          {wallet.name && wallet.name.toUpperCase().includes("METAMASK") ? (
            <img src={require("assets/walletImages/metamask.svg")} width={35} />
          ) : wallet.walletType && wallet.walletType.toUpperCase().includes("WAX") ? (
            <img src={require("assets/walletImages/waxWallet.png")} width={35} />
          ) : wallet.walletType && wallet.walletType.toUpperCase().includes("WALLETCONNECT") ? (
            <img src={require("assets/walletImages/wallet_connect.svg")} width={35} />
          ) : wallet.walletType && wallet.walletType.toUpperCase().includes("POLKADOT") ? (
            <img src={require("assets/walletImages/polkadot.svg")} width={35} />
          ) : (
            <img src={require("assets/logos/PRIVILOGO.png")} width={35} />
          )}
        </div>

        <Box ml="24px" display="flex" flexDirection="column">
          <div className={classes.title}>{wallet && wallet.name ? wallet.name : "name"}</div>
          <Box
            display="flex"
            alignItems="center"
            color="#707582"
            fontSize="11px"
            onClick={handleChooseMainWallet}
            style={{ cursor: "pointer" }}
          >
            {wallet && wallet.main && (
              <SvgIcon style={{ width: "16px" }} htmlColor={"#FF8E3C"}>
                <StarSolid />
              </SvgIcon>
            )}
            {wallet && !wallet.main && (
              <SvgIcon style={{ width: "16px" }}>
                <StarRegular />
              </SvgIcon>
            )}
            <Box ml={"6.25px"} mt="6px">
              Main Account
            </Box>
          </Box>
        </Box>
      </Box>

      <div className={classes.divider} />

      <Box display="flex" flexDirection="column">
        <div className={classes.label}>Wallet Status:</div>

        <Box
          display="flex"
          alignItems="center"
          color="#181818"
          fontWeight={600}
          fontFamily="Montserrat"
          fontSize="14px"
        >
          <Box mr="8px">Active</Box>
          <CustomSwitch
            checked={wallet.walletStatus}
            onChange={() => handleWalletActivation(!wallet.walletStatus)}
          />
        </Box>
      </Box>

      <div className={classes.divider} />

      <Box display="flex" flexDirection="column">
        <div className={classes.label}>Estimated balance</div>
        <div className={classes.balance}>{`${wallet?.balance?.toFixed(2) ?? "0"}`}</div>
      </Box>

      <div className={classes.divider} />

      <Box display="flex" alignItems="center" mr="50px">
        <div className={classes.address}>
          {wallet?.address
            ? wallet?.address.length > 12
              ? `${wallet?.address.slice(0, 6)}...${wallet?.address.slice(
                  wallet?.address.length - 7,
                  wallet?.address.length - 1
                )}`
              : wallet?.address
            : ""}
        </div>
        <svg width="21" height="20" viewBox="0 0 21 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M16 12H17.5C18.6046 12 19.5 11.1046 19.5 10V3C19.5 1.89543 18.6046 1 17.5 1H10.5C9.39543 1 8.5 1.89543 8.5 3V4.5M3.5 19H10.5C11.6046 19 12.5 18.1046 12.5 17V10C12.5 8.89543 11.6046 8 10.5 8H3.5C2.39543 8 1.5 8.89543 1.5 10V17C1.5 18.1046 2.39543 19 3.5 19Z"
            stroke="#727F9A"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </Box>

      <Box display="flex" flexDirection="column" className={classes.buttons}>
        <PrimaryButton size="small" onClick={handleConnectWallet}>
          Connect
        </PrimaryButton>
        <SecondaryButton size="small" onClick={handleDisconnect} disabled={wallet.main}>
          Remove
        </SecondaryButton>
      </Box>

      {openVerifyPriviWalletDlg && (
        <MnemonicWordsInputModal
          open={openVerifyPriviWalletDlg}
          title="Connect Privi Wallet"
          submitBtnTxt="Connet Wallet"
          handleSubmit={handleSubmitPriviWords}
          handleClose={() => setOpenVerifyPriviWalletDlg(false)}
        />
      )}
    </div>
  );
};

export default WalletCard;
