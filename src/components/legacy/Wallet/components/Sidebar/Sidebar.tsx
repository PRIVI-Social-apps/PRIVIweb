import React, { useState, useEffect } from "react";
import axios from "axios";
import { useHistory } from "react-router-dom";
import { useWeb3React } from "@web3-react/core";
import SvgIcon from "@material-ui/core/SvgIcon";
import ConnectPriviWallet from "components/PriviWallet/components/Modals/ConnectPriviWallet";
import CreatePriviWallet from "components/PriviWallet/components/Modals/CreatePriviWallet";
import ConnectWalletModal from "components/PriviWallet/components/Modals/ConnectWalletModal";
import { useTypedSelector } from "store/reducers/Reducer";
import { PrimaryButton, SecondaryButton } from "shared/ui-kit";
import URL from "shared/functions/getURL";
import { ReactComponent as StarRegular } from "assets/icons/star-regular.svg";
import { ReactComponent as StarSolid } from "assets/icons/star-solid.svg";
import { MnemonicWordsInputModal } from "shared/ui-kit/Modal/Modals";
import { generatePriviWallet, lockPriviWallet } from "shared/helpers";
import * as CRYPTO from "shared/helpers/aes-gcm";
import "./Sidebar.css";
import Box from "shared/ui-kit/Box";

export default function Sidebar(props: any) {
  //store
  const user = useTypedSelector(state => state.user);

  //hooks
  const history = useHistory();
  const [balance, setBalance] = useState<number>(0);
  const { walletsList, setWalletsList } = props;
  const [openAddWalletDlg, setOpenAddWalletDlg] = useState<boolean>(false);
  const [openCreatePWDlg, setOpenCreatePWDlg] = useState<boolean>(false);
  const [openConnectPWDlg, setOpenConnectPWDlg] = useState<boolean>(false);
  const [openVerifyPWDlg, setOpenVerifyPWDlg] = useState<boolean>(false);
  const [activateId, setActivateId] = useState<number>(0);
  const context = useWeb3React();
  const { deactivate } = context;

  const handleWalletActivation = async (newState: boolean, index: number) => {
    const newWallet = [...walletsList];
    newWallet[index].walletStatus = newState;
    setActivateId(index);
    if (newWallet[index].walletType === "Privi" && newState === false) {
      lockPriviWallet();
    }
    if (newWallet[index].walletType === "Privi" && newState === true) {
      setOpenVerifyPWDlg(true);
    } else {
      try {
        await axios
          .post(`${URL()}/wallet/toggleUserRegisteredWallet`, {
            userId: user.id,
            address: walletsList[index].address,
            newState,
          })
          .then(res => {
            if (res.data.success) {
              setWalletsList(res.data.data);
            }
          });
      } catch (err) {
        console.error("handleConnect removeUserRegisteredAccount failed", err);
      }
    }
  };
  const handleChooseMainWallet = async (index: number) => {
    if (walletsList[index].main) return;
    try {
      await axios
        .post(`${URL()}/wallet/setMainEthAccount`, {
          userId: user.id,
          address: walletsList[index].address,
        })
        .then(res => {
          if (res.data.success) {
            setWalletsList(res.data.data);
          }
        });
    } catch (err) {
      console.error("handleConnect setMainEthAccount failed", err);
    }
  };
  const handleViewWallet = index => {
    //todo: view [index] wallet from walletsList
  };

  const handleDisconnect = async (index: number) => {
    //todo: disconnect [index] wallet from walletsList
    const activeWallet = walletsList[index];
    const filteredWallet = walletsList.filter(wallet => wallet.address !== activeWallet.address);
    try {
      await axios
        .post(`${URL()}/wallet/removeUserRegisteredWallet`, {
          userId: user.id,
          address: activeWallet.address,
        })
        .then(res => {
          if (res.data.success) {
            deactivate();
            setWalletsList(filteredWallet);
          }
        });
    } catch (err) {
      console.error("handleConnect removeUserRegisteredAccount failed", err);
    }
  };

  const handleSubmitPriviWords = async (phrases: string[]) => {
    const { address, privateKey } = await generatePriviWallet(phrases);
    if (address === walletsList[activateId].address) {
      try {
        await axios
          .post(`${URL()}/wallet/toggleUserRegisteredWallet`, {
            userId: user.id,
            address: walletsList[activateId].address,
            newState: true,
          })
          .then(async res => {
            if (res.data.success) {
              setWalletsList(res.data.data);
              await CRYPTO.savePriviKey(privateKey);
            }
          });
      } catch (err) {
        console.error("handleConnect removeUserRegisteredAccount failed", err);
      }
    } else {
    }
  };

  const applyForPriviWallet = () => {
    setOpenCreatePWDlg(true);
  };
  const handleCloseCreatePriviWallet = () => {
    setOpenCreatePWDlg(false);
  };
  const handleOpenConnectPriviWallet = () => {
    setOpenConnectPWDlg(true);
  };
  const handleCloseConnectPriviWallet = () => {
    setOpenConnectPWDlg(false);
  };
  const handleOpenAddWallet = () => {
    setOpenAddWalletDlg(true);
  };
  const handleCloseAddWallet = () => {
    setOpenAddWalletDlg(false);
  };

  const handleAutomicSwap = () => {
    props.handleOpenAtomicSwap();
  };

  useEffect(() => {
    if (props.walletsList) {
      setWalletsList && setWalletsList(props.walletsList);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.walletsList]);

  return (
    <div className={props.open ? "wallet-sidebar-container" : "wallet-sidebar-container hidden"}>
      <div className={"wallet-sidebar"}>
        <div className={"title"}>
          <button onClick={props.handleClose}>
            <img src={require("assets/icons/arrow_white.png")} alt="close" />
          </button>
          <h4>Wallets Manager</h4>
        </div>
        <div className={"summary"}>
          <div>
            <h5>Total Wallets balance</h5>
            <div className={"balance"}>{balance}</div>
          </div>

          <div className={"apply"} onClick={applyForPriviWallet}>
            <div className={"wallet-image-container"}>
              <div
                className={"wallet-image"}
                style={{
                  backgroundImage: `url(${require("assets/icons/walletImage.png")})`,
                  backgroundRepeat: "no-repeat",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              />
            </div>
            Apply for a Privi Wallet
          </div>
        </div>
        <div className={"content"}>
          <section>
            <button onClick={handleOpenAddWallet}>
              <img src={require("assets/icons/add_circle.png")} alt={"add"} />
              Connect new wallet
            </button>
            <button onClick={handleAutomicSwap}>Atomic Swap</button>
            <button onClick={() => window.open("https://priviscan.io/tx")}>Priviscan</button>
            {/*TODO: Check if user is a creator (has created at least 1 media)*/}
            {user ? <button onClick={() => history.push("/wallet/my-earnings")}>My earnings</button> : null}
          </section>
          <section>
            <h5>My connected wallets</h5>
            {walletsList && walletsList.length > 0 ? (
              <div className={"wallets"}>
                {walletsList.map((wallet, index) => (
                  <div className={"wallet-tile"} key={`wallet-${index}`}>
                    <div className="left">
                      <div className={"icon"}>
                        {wallet.name && wallet.name.toUpperCase().includes("METAMASK") ? (
                          <img src={require("assets/walletImages/metamask.svg")} width={35} />
                        ) : wallet.walletType && wallet.walletType.toUpperCase().includes("WAX") ? (
                          <img src={require("assets/walletImages/waxWallet.png")} width={35} />
                        ) : wallet.walletType && wallet.walletType.toUpperCase().includes("WALLETCONNECT") ? (
                          <img src={require("assets/walletImages/wallet_connect.svg")} width={35} />
                        ) : wallet.walletType && wallet.walletType.toUpperCase().includes("POLKADOT") ? (
                          <img src={require("assets/walletImages/polkadot.svg")} width={35} />
                        ) : wallet.walletType && wallet.walletType.toUpperCase().includes("BINANCE") ? (
                          <img src={require("assets/walletImages/Binance.svg")} width={35} />
                        ) : (
                          <img src={require("assets/logos/PRIVILOGO.png")} width={35} />
                        )}
                      </div>
                      <div className={"activation"}>
                        Active
                        <div className={wallet.walletStatus ? "buttons" : "buttonInactive"}>
                          <button
                            onClick={() => handleWalletActivation(!wallet.walletStatus, index)}
                            className={wallet.walletStatus ? "selected" : undefined}
                          />
                          <button
                            onClick={() => handleWalletActivation(!wallet.walletStatus, index)}
                            className={!wallet.walletStatus ? "selected" : undefined}
                          />
                        </div>
                      </div>
                    </div>
                    <div className={"content"}>
                      <div className={"top"}>
                        <div className={"info"}>
                          <h4>{wallet && wallet.name ? wallet.name : "name"}</h4>
                          <p>{wallet && wallet.address ? wallet.address : ""}</p>
                          <p className={"main-account"} onClick={() => handleChooseMainWallet(index)}>
                            {wallet && wallet.main && (
                              <SvgIcon>
                                <StarSolid />
                              </SvgIcon>
                            )}
                            {wallet && !wallet.main && (
                              <SvgIcon>
                                <StarRegular />
                              </SvgIcon>
                            )}
                            Main Account
                          </p>
                          <div className={"balance"}>{wallet && wallet.balance ? wallet.balance : ""}</div>
                        </div>
                        <Box display="flex" flexDirection="column">
                          <PrimaryButton size="small" onClick={() => handleViewWallet(index)}>
                            View Wallet
                          </PrimaryButton>
                          {!wallet.main && (
                            <Box mt={0.5}>
                              <SecondaryButton size="small" onClick={() => handleDisconnect(index)}>
                                Disconnect
                              </SecondaryButton>
                            </Box>
                          )}
                        </Box>
                      </div>

                      <div className={"bottom"}>
                        <div className={"balance"}>
                          <span>{`$${wallet && wallet.usdBalance ? wallet.usdBalance : ""}`}</span>
                          <span>Estimated balance</span>
                        </div>

                        <div
                          className={"copy"}
                          onClick={() => {
                            navigator.clipboard.writeText(wallet && wallet.address ? wallet.address : "");
                          }}
                        >
                          <span>COPY ADDRESS</span>
                          <img src={require("assets/icons/link.png")} alt={"link"} />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <h5>No active wallets</h5>
            )}
          </section>
        </div>{" "}
        {openCreatePWDlg && (
          <CreatePriviWallet
            onClose={handleCloseCreatePriviWallet}
            walletList={walletsList}
            setWalletList={setWalletsList}
          />
        )}
        {openConnectPWDlg && (
          <ConnectPriviWallet
            onClose={handleCloseConnectPriviWallet}
            walletList={walletsList}
            setWalletList={setWalletsList}
          />
        )}
        {openVerifyPWDlg && (
          <MnemonicWordsInputModal
            open={openVerifyPWDlg}
            title="Connect Privi Wallet"
            submitBtnTxt="Connet Wallet"
            handleSubmit={handleSubmitPriviWords}
            handleClose={() => setOpenVerifyPWDlg(false)}
          />
        )}
        <ConnectWalletModal
          open={openAddWalletDlg}
          handleClose={handleCloseAddWallet}
          walletsList={walletsList}
          setWalletsList={setWalletsList}
          connectPrivi={handleOpenConnectPriviWallet}
        />
      </div>
    </div>
  );
}
