import React, { useState, useContext, useEffect } from "react";
import cn from "classnames";
import axios from "axios";
import { useSelector } from "react-redux";

import MainPageContext from "../../../context";
import { TypicalLayout } from "../elements";
import { RootState } from "store/reducers/Reducer";
import { signTransaction } from "shared/functions/signTransaction";
import URL from "shared/functions/getURL";
import AlertMessage from "shared/ui-kit/Alert/AlertMessage";

import styles from "./index.module.scss";
import { PrimaryButton } from "shared/ui-kit";

const BlogDisplay = () => {
  const userBalances = useSelector((state: RootState) => state.userBalances);
  const userSelector = useSelector((state: RootState) => state.user);

  const { selectedMedia, setMediaFullScreen } = useContext(MainPageContext);
  const [paid, setPaid] = useState<boolean>(false);
  const [isVipAccess, setIsVipAccess] = useState(false);

  const { EditorPages } = selectedMedia;

  const [errorMsg, setErrorMsg] = useState<string>("");
  const [openError, setOpenError] = useState(false);

  const handleClickError = () => {
    setOpenError(true);
    setTimeout(() => {
      setOpenError(false);
    }, 4000);
  };

  const handleCloseError = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenError(false);
  };
  useEffect(() => {
    setPaid(false);
    setIsVipAccess(false);
    if (selectedMedia && userBalances && Object.keys(userBalances).length > 0) {
      if (selectedMedia.ExclusivePermissions) {
        const conditionList = selectedMedia.ExclusivePermissionsList ?? [];
        let newHasAccess = true;
        for (let i = 0; i < conditionList.length && newHasAccess; i++) {
          const condition = conditionList[i];
          if (condition.Token && condition.Quantity) {
            if (!userBalances[condition.Token] || userBalances[condition.Token].Balance < condition.Quantity)
              newHasAccess = false;
          }
        }

        setIsVipAccess(newHasAccess);
      }
    }
  }, [EditorPages, userBalances]);

  const openNFT = async () => {
    let data: any = {
      MediaSymbol: selectedMedia.MediaSymbol.replace(/\s/g, ""),
      MediaType: selectedMedia.Type,
      Address: userSelector.address,
      SharingId: "",
    };
    const [hash2, signature2] = await signTransaction(userSelector.mnemonic, data);
    let body2: any = {};
    body2.Data = data;
    body2.Hash = hash2;
    body2.Signature = signature2;

    axios
      .post(`${URL()}/media/openNFT`, body2)
      .then(response => {
        if (response.data.success) {
        } else {
          setErrorMsg(response.data.error || "Error making the request");
          handleClickError();
        }
      })
      .catch(error => {
        console.log(error);
        setErrorMsg("Error making the request");
        handleClickError();
      });
  };

  const BlogDisplayContent = () => (
    <div className={styles.blogMain}>
      <div
        className={paid ? styles.posR : cn(styles.posR, styles.disabled)}
        style={{ overflowY: paid ? "auto" : "hidden" }}
      >
        <button
          className={styles.buttonFullscreen}
          disabled={!paid}
          onClick={() => setMediaFullScreen(selectedMedia.Type)}
        >
          <img src={require("assets/icons/fullscreen.png")} alt="fullscreen" />
        </button>
        {selectedMedia.title && <h3 className={styles.title}>{selectedMedia.Title}</h3>}
        {selectedMedia.HasPhoto && (
          <img
            src={
              selectedMedia.ImageUrl ??
              `${URL()}/media/getMediaMainPhoto/${selectedMedia.MediaSymbol.replace(/\s/g, "")}`
            }
            alt={"blog thumbnail"}
          />
        )}
        {EditorPages && (
          <div
            dangerouslySetInnerHTML={{ __html: EditorPages }}
            className={paid ? styles.blogContent : cn(styles.blogContent, styles.disabled)}
          />
        )}

        {!paid ? (
          <>
            {isVipAccess ? (
              <PrimaryButton
                size="medium"
                className={styles.buyToUnlock}
                onClick={() => {
                  setPaid(true);
                  openNFT();
                }}
              >
                VIP ACCESS click to unlock
              </PrimaryButton>
            ) : (
              <PrimaryButton
                size="medium"
                className={styles.buyToUnlock}
                onClick={() => {
                  setPaid(true);
                  openNFT();
                }}
              >
                Buy to unlock
              </PrimaryButton>
            )}
          </>
        ) : null}
      </div>
    </div>
  );
  return (
    <TypicalLayout vipAccess={isVipAccess && paid}>
      <BlogDisplayContent />
      {openError && <AlertMessage key={Math.random()} message={errorMsg} variant={"error"} />}
    </TypicalLayout>
  );
};

export default BlogDisplay;
