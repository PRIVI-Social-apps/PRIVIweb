import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import styled from "styled-components";
import cn from "classnames";
import { useSelector } from "react-redux";

import { Modal } from "@material-ui/core";
import MainPageContext from "components/legacy/Media/context";
import { TypicalLayout } from "../elements";
import { RootState } from "store/reducers/Reducer";
import { signTransaction } from "shared/functions/signTransaction";
import URL from "shared/functions/getURL";
import AlertMessage from "shared/ui-kit/Alert/AlertMessage";

import styles from "./index.module.scss";
import { PrimaryButton, SecondaryButton } from "shared/ui-kit";

const arrow = require("assets/icons/arrow.png");
const metamask = require("assets/walletImages/metamask.svg");
const walletconnect = require("assets/walletImages/wallet_connect.svg");

const CrossSVG = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g opacity="0.4">
      <path d="M18 6L6 18" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
      <path d="M6 6L18 18" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
    </g>
  </svg>
);

const UnPaidPage = ({ content, openBuyModal, isVipAccess, pageNum }) => {
  const { selectedMedia, setSelectedMedia } = useContext(MainPageContext);

  return (
    <>
      <div className={cn(styles.SnapPage, styles.disabled)} dangerouslySetInnerHTML={{ __html: content }} />

      {isVipAccess ? (
        <PrimaryButton
          size="medium"
          className={styles.buyToUnlock}
          onClick={() => {
            if (isPayPerPage(selectedMedia)) {
              selectedMedia?.EditorPages?.forEach((page, index) => {
                setPaid(index + 1, selectedMedia, setSelectedMedia);
              });
            } else {
              setPaid(pageNum, selectedMedia, setSelectedMedia);
            }
          }}
        >
          VIP ACCESS click to unlock
        </PrimaryButton>
      ) : (
        <PrimaryButton size="medium" className={styles.buyToUnlock} onClick={openBuyModal}>
          Buy to unlock
        </PrimaryButton>
      )}
    </>
  );
};

const PaidPage = ({ content }) => (
  <div className={styles.SnapPage} dangerouslySetInnerHTML={{ __html: content }} />
);

export const isPayPerPage = media => {
  return media?.QuickCreation && media?.ViewConditions?.ViewingType === "PricePerPage";
};

const isPaidPage = (media, pageNum) =>
  isPayPerPage(media) ? (media.paidPages ? media.paidPages[pageNum - 1] : false) : media?.paid;

export const OnePage = ({ media, pageNum, openBuyModal, isVipAccess }) => {
  let content = "";
  if (media && media.EditorPages) {
    content = media?.EditorPages[pageNum - 1] ?? "";
  }
  return isPaidPage(media, pageNum) ? (
    <PaidPage content={content} />
  ) : (
    <UnPaidPage content={content} openBuyModal={openBuyModal} isVipAccess={isVipAccess} pageNum={pageNum} />
  );
};

const setPaid = (pageNum, selectedMedia, setSelectedMedia) => {
  if (isPayPerPage(selectedMedia)) {
    const totalPages = selectedMedia?.EditorPages?.length ?? 0;
    const paidPages = selectedMedia.paidPages ?? new Array(totalPages).fill(0);
    paidPages[pageNum - 1] = true;
    setSelectedMedia({ paidPages, ...selectedMedia });
  } else {
    setSelectedMedia({ ...selectedMedia, paid: true });
  }
};

export const PayModal = ({ buyModalOpen, onModalClose, onBuyClick, totalPages, totalPrice }) => {
  const [buyPageCount, setBuyPageCount] = useState<number>(Math.ceil(totalPages / 2));
  const [activeWallet, setActiveWallet] = useState<string>("");
  return (
    <Modal className={styles.buyModal} open={buyModalOpen} onClose={onModalClose}>
      <div className={styles.buyModalContent}>
        <div className={styles.spaceBetween}>
          <h1 className={styles.buyModalHeading}>Buy more pages</h1>
          <button onClick={onModalClose} style={{ background: "none" }}>
            <CrossSVG />
          </button>
        </div>
        <div className={styles.buyInfo}>
          <div className={styles.pageCount}>
            <SubTitle>How many pages?</SubTitle>
            <div>
              <button
                className={styles.upArrow}
                onClick={() => setBuyPageCount(buyPageCount - 1)}
                disabled={buyPageCount === 1}
              >
                <img src={arrow} />
              </button>
              <button className={styles.buyPageCount}>{buyPageCount}</button>
              <button
                className={styles.downArrow}
                onClick={() => setBuyPageCount(buyPageCount + 1)}
                disabled={buyPageCount === totalPages}
              >
                <img src={arrow} />
              </button>
            </div>
          </div>

          <div className={styles.totPrice}>
            <SubTitle>Total</SubTitle>
            <p className={styles.totalPrice}>{totalPrice} ETH</p>
          </div>
        </div>

        <div>
          <SubTitle>Choose your wallet</SubTitle>
          <WalletCard
            {...exampleWalletInformation[0]}
            activeWallet={activeWallet}
            setActiveWallet={setActiveWallet}
          />
          <WalletCard
            {...exampleWalletInformation[1]}
            activeWallet={activeWallet}
            setActiveWallet={setActiveWallet}
          />
          <button className={styles.buyButton} onClick={onBuyClick}>
            Buy
          </button>
        </div>
      </div>
    </Modal>
  );
};

export const SnapPage = ({ page, isVipAccess }) => {
  const { selectedMedia, setSelectedMedia } = useContext(MainPageContext);
  const [buyModalOpen, setBuyModalOpen] = useState<boolean>(false);
  const totalPages = selectedMedia?.EditorPages?.length ?? 0;
  const userSelector = useSelector((state: RootState) => state.user);

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

  const onBuyClick = async () => {
    setPaid(page, selectedMedia, setSelectedMedia);
    setBuyModalOpen(false);
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
  return (
    <>
      <OnePage
        media={selectedMedia}
        pageNum={page}
        openBuyModal={() => setBuyModalOpen(true)}
        isVipAccess={isVipAccess}
      />
      <PayModal
        buyModalOpen={buyModalOpen}
        onModalClose={() => setBuyModalOpen(false)}
        onBuyClick={onBuyClick}
        totalPages={totalPages}
        totalPrice={1.273}
      />
      {openError && <AlertMessage key={Math.random()} message={errorMsg} variant={"error"} />}
    </>
  );
};

export const BlogSnapDisplay = () => {
  return (
    <TypicalLayout>
      <BlogSnapDisplayContent viewFullScreen={true} />
    </TypicalLayout>
  );
};

export const BlogSnapDisplayContent = ({ viewFullScreen }) => {
  const userBalances = useSelector((state: RootState) => state.userBalances);

  const { selectedMedia, setMediaFullScreen } = useContext(MainPageContext);

  const [isVipAccess, setIsVipAccess] = useState(false);

  const [page, setPage] = useState<number>(1);
  const setMainPage = currentPage => {
    setPage(currentPage);
  };

  useEffect(() => {
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
  }, [selectedMedia.EditorPages, userBalances]);

  useEffect(() => {
    setPage(1);
  }, [selectedMedia.EditorPages]);

  const paginationDisabled = !isPayPerPage(selectedMedia) && !selectedMedia.paid;
  let totalPages: number = 0;
  if (selectedMedia && selectedMedia.EditorPages) {
    totalPages = selectedMedia?.EditorPages.length ?? 0;
  }

  return (
    <div className={styles.SnapContent}>
      {viewFullScreen && (
        <button
          className={
            isPaidPage(selectedMedia, page)
              ? styles.buttonFullscreen
              : cn(styles.buttonFullscreen, styles.disabled)
          }
          disabled={!isPaidPage(selectedMedia, page)}
          onClick={() => setMediaFullScreen(selectedMedia.Type)}
        >
          <img src={require("assets/icons/fullscreen.png")} alt="fullscreen" />
        </button>
      )}
      <div className={styles.SnapPageContainer}>
        <SnapPage page={page} isVipAccess={isVipAccess} />
      </div>
      <div className={styles.paginationButtons}>
        <button
          className={styles.prevButton}
          onClick={e => {
            setMainPage(page - 1);
          }}
          disabled={!paginationDisabled && page - 1 > 0 ? false : true}
        >
          <img src={arrow} />
        </button>
        <button className={styles.currentPage}>{page}</button>/{totalPages}
        <button
          className={styles.nextButton}
          onClick={e => {
            setMainPage(page + 1);
          }}
          disabled={paginationDisabled || page >= totalPages ? true : false}
        >
          <img src={arrow} />
        </button>
      </div>
    </div>
  );
};

let exampleWalletInformation = [
  {
    walletNumber: 1,
    walletIcon: metamask,
    walletAddress: "0x03yn3215645655f...5fns",
  },
  {
    walletNumber: 2,
    walletIcon: walletconnect,
    walletAddress: "0x03yn3215645655f...5fns",
  },
];

const WalletCard = ({ walletNumber, walletIcon, walletAddress, activeWallet, setActiveWallet }) => {
  const walletRadioValue = `wallet${walletNumber}`;
  const isActive = activeWallet === walletRadioValue;
  return (
    <div className={isActive ? cn(styles.activeWallet, styles.walletCard) : styles.walletCard}>
      <FlexBox>
        <H5>Connected with Metamask</H5>
        <SecondaryButton size="medium">Disconnect</SecondaryButton>
      </FlexBox>
      <div className={styles.radioButton}>
        <label htmlFor={walletRadioValue}>{isActive ? "Enabled" : "Disabled"}</label>
        <input
          type="radio"
          id={`wallet${walletNumber}`}
          name="wallet"
          value={`wallet${walletNumber}`}
          checked={isActive}
          onChange={e => {
            setActiveWallet(e.target.value);
          }}
        />
      </div>
      <span className={styles.walletAddress}>
        {<img src={walletIcon} />} {walletAddress}
      </span>

      <FlexBox>
        <span className={styles.actionButtons}>
          <svg width="18" height="17" viewBox="0 0 18 17" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M16.284 5.07129H6.83668C6.52348 5.07129 6.22311 5.1917 6.00165 5.40602C5.78018 5.62035 5.65576 5.91104 5.65576 6.21415V15.357C5.65576 15.6601 5.78018 15.9508 6.00165 16.1651C6.22311 16.3795 6.52348 16.4999 6.83668 16.4999H16.284C16.5972 16.4999 16.8976 16.3795 17.1191 16.1651C17.3405 15.9508 17.465 15.6601 17.465 15.357V6.21415C17.465 5.91104 17.3405 5.62035 17.1191 5.40602C16.8976 5.1917 16.5972 5.07129 16.284 5.07129ZM6.83668 15.357V6.21415H16.284V15.357H6.83668Z"
              fill="#949BAB"
            />
            <path
              d="M3.88443 10.7857H2.11305V1.64286H11.5604V3.35714C11.5604 3.5087 11.6226 3.65404 11.7333 3.7612C11.8441 3.86837 11.9943 3.92857 12.1509 3.92857C12.3075 3.92857 12.4576 3.86837 12.5684 3.7612C12.6791 3.65404 12.7413 3.5087 12.7413 3.35714V1.64286C12.7413 1.33975 12.6169 1.04906 12.3954 0.834735C12.174 0.620408 11.8736 0.5 11.5604 0.5H2.11305C1.79985 0.5 1.49948 0.620408 1.27801 0.834735C1.05655 1.04906 0.932129 1.33975 0.932129 1.64286V10.7857C0.932129 11.0888 1.05655 11.3795 1.27801 11.5938C1.49948 11.8082 1.79985 11.9286 2.11305 11.9286H3.88443C4.04103 11.9286 4.19121 11.8684 4.30195 11.7612C4.41268 11.654 4.47489 11.5087 4.47489 11.3571C4.47489 11.2056 4.41268 11.0602 4.30195 10.9531C4.19121 10.8459 4.04103 10.7857 3.88443 10.7857Z"
              fill="#949BAB"
            />
          </svg>
          Copy Address
        </span>
        <span className={styles.actionButtons}>
          <svg width="16" height="15" viewBox="0 0 16 15" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M8.60828 1.48624H13.5149L3.896 10.8027L4.61975 11.5L14.2386 2.18352V6.91058H15.2623V0.5H8.60828V1.48624Z"
              fill="#949BAB"
            />
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M8.53858 0.5H15.2623V6.97821H14.0272V2.53239L4.76924 11.5L3.896 10.6586L13.1551 1.68999H8.53858V0.5ZM8.77575 0.7285V1.46149H13.7255L4.23095 10.6582L4.76879 11.1764L14.2644 1.97865V6.74971H15.0252V0.7285H8.77575Z"
              fill="#949BAB"
            />
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M9.22769 2.5H4.33206C2.37909 2.5 0.795898 4.03216 0.795898 5.92218V11.0778C0.795898 12.9678 2.37909 14.5 4.33205 14.5H9.65941C11.6124 14.5 13.1956 12.9678 13.1956 11.0778V6.34006H12.0169V11.0778C12.0169 12.3378 10.9614 13.3593 9.65941 13.3593H4.33205C3.03008 13.3593 1.97462 12.3378 1.97462 11.0778V5.92218C1.97462 4.66217 3.03008 3.64073 4.33206 3.64073H9.22769V2.5Z"
              fill="#949BAB"
            />
          </svg>
          View on Etherscan
        </span>
        <span className={styles.actionButtons}>Your Balance</span>
        <span className={styles.actionButtons}>Transaction History</span>
      </FlexBox>
    </div>
  );
};
const SubTitle = styled.h4`
  font-size: 18px;
  font-weight: bold;
  margin: 7px 0px;
`;

const H5 = styled.h5`
  font-size: 18px;
  margin: 8px;
`;

const FlexBox = styled.div`
  display: flex;
  justify-content: space-between;
`;

export default BlogSnapDisplay;
