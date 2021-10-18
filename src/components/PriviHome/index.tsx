import React, { useEffect } from 'react';
import { useWeb3React, UnsupportedChainIdError } from "@web3-react/core";
import { useAuth } from 'shared/contexts/AuthContext';
import { useAlertMessage } from 'shared/hooks/useAlertMessage';
import Box from 'shared/ui-kit/Box';
import Web3 from "web3";
import Footer from './components/Footer';
import Header from './components/Header';
import { priviHomePageStyles } from './index.styles';
import { injected } from "shared/connectors";
import * as API from "shared/services/API/WalletAuthAPI";
import { ReactComponent as FaceBookIcon } from "assets/snsIcons/facebook.svg";
import { ReactComponent as TwitterIcon } from "assets/snsIcons/twitter.svg";
import { ReactComponent as InstagramIcon } from "assets/snsIcons/instagram.svg";
import { ReactComponent as LinkedInIcon } from "assets/snsIcons/linkedin.svg";
import { ReactComponent as TiktokIcon } from "assets/snsIcons/tiktok.svg";
import { ReactComponent as MediaIcon } from "assets/snsIcons/media.svg";
import {
  handleFacebookLink,
  handleTwitterLink,
  handleInstagramLink,
  handleLinkedinLink,
  handleTiktokLink,
  handleMediumLink
} from "shared/constants/constants";
import { socket } from 'components/Login/Auth';
import axios from 'axios';
import { setUser } from 'store/actions/User';
import { setLoginBool } from 'store/actions/LoginBool';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'store/reducers/Reducer';

const PriviHome = () => {
  const classes = priviHomePageStyles();
  const { isSignedin, setSignedin } = useAuth();
  const userSelector = useSelector((state: RootState) => state.user);
  const { showAlertMessage } = useAlertMessage();
  const { activate, account, library } = useWeb3React();
  const dispatch = useDispatch();

  useEffect(() => {
    if (account) {
      if (!isSignedin) {
        const web3 = new Web3(library.provider);
        API.signUpWithMetamaskWallet(account, web3)
          .then(result => {
            if (result.success) {
              API.signInWithMetamaskWallet(account, web3, result.signature).then(res => {
                if (res.isSignedIn) {
                  setSignedin(true);
                  const data = res.userData;
                  socket.emit("add user", data.id);
                  dispatch(setUser(data));
                  sessionStorage.setItem("token", res.accessToken);
                  sessionStorage.setItem("userId", data.id);
                  sessionStorage.setItem("userSlug", data.urlSlug ?? data.id);

                  axios.defaults.headers.common["Authorization"] = "Bearer " + res.accessToken;
                  dispatch(setLoginBool(true));

                  //added this last line to refresh the page, it got stuck after loging in. If there's
                  //another way to fix that feel free to change it
                  window.location.replace("/");
                } else {
                  if (res.message) {
                    showAlertMessage(res.message, { variant: "error" });
                  } else {
                    showAlertMessage("Connect the metamask", { variant: "error" });
                  }
                }
              });
            } else {
              showAlertMessage("There was an error when creating User", { variant: "error" });
            }
          })
          .catch(err => {
            console.log("Error in SignUp.tsx -> storeUser() : ", err);
          });
      }
    }
  }, [account]);

  const handleConnectWallet = () => {
    activate(injected, undefined, true).catch(error => {
      if (error instanceof UnsupportedChainIdError) {
        activate(injected);
      } else {
        console.info("Connection Error - ", error);
        showAlertMessage(error.message, { variant: "error" });
      }
    });
  }

  return (
    <Box className={classes.container}>
      <Box className={classes.subContainer}>
        <Box className={classes.navigationContainer}>
          <Header />
          <Box display="flex" flexDirection="column">
            <Box className={classes.titleContainer} display="flex" alignItems="center" justifyContent="center">
              <h1 className={classes.title}>PRIVI</h1>
              <h1 className={classes.zooTitle}>ZOO</h1>
              <span className={classes.earlyAccess}>early access</span>
            </Box>
            {account
              ? (
                <>
                  {userSelector.verified
                  ? (
                    <Box className={classes.titleDescription}>
                      <h4>🎉 Congrats! You’ve been sufcessfully whitelisted.</h4>
                      <h3 className={classes.titleFollow}>Follow our social media for updates</h3>
                    </Box>
                  ) : (
                    <Box className={classes.titleDescription}>
                      <h4>Looks like you are alread on our whitelist. Stay tuned!</h4>
                      <h3 className={classes.titleFollow}>Follow our social media for updates</h3>
                    </Box>
                  )}

                  <Box className={classes.snsContainer}>
                    <Box className={classes.snsBox} onClick={handleFacebookLink}>
                      <FaceBookIcon />
                    </Box>
                    <Box className={classes.snsBox} onClick={handleTwitterLink}>
                      <TwitterIcon />
                    </Box>
                    <Box className={classes.snsBox} onClick={handleInstagramLink}>
                      <InstagramIcon />
                    </Box>
                    <Box className={classes.snsBox} onClick={handleLinkedinLink}>
                      <LinkedInIcon />
                    </Box>
                    <Box className={classes.snsBox} onClick={handleTiktokLink}>
                      <TiktokIcon />
                    </Box>
                    <Box className={classes.snsBox} onClick={handleMediumLink}>
                      <MediaIcon />
                    </Box>
                  </Box>
                </>
              ) : (
              <>
                <Box className={classes.titleDescription}>
                  <h2>Connect your wallet to get in to<br/> the whitelist.</h2>
                  <h3>Or to log into the platform if you already have access.</h3>
                </Box>
                <Box className={classes.btnConnectContainer}>
                  <button className={classes.btnConnect} onClick={handleConnectWallet}>CONNECT WALLET</button>
                </Box>
              </>
            )}

          </Box>
        </Box>
        <Box>
          <Footer />
        </Box>
      </Box>
    </Box>
  );
};

export default PriviHome;