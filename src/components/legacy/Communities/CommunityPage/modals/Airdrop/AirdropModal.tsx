import React, { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import classnames from "classnames";

import { createStyles, InputBase, makeStyles, Modal, Theme } from "@material-ui/core";
import { Autocomplete, Alert } from "@material-ui/lab";

import URL from "shared/functions/getURL";
import { ModalButton } from "shared/ui-kit/Buttons/ModalButton";
import Box from "shared/ui-kit/Box";
import { RootState, useTypedSelector } from "store/reducers/Reducer";
import { handleSetStatus } from "shared/functions/commonFunctions";
import styles from "./index.module.scss";

import { buildJsxFromObject } from "shared/functions/commonFunctions";
import { SignatureRequestModal } from "shared/ui-kit/Modal/Modals";
import { IAirdropCommunityToken, airdropCommunityToken } from "shared/services/API";
import InputWithLabelAndTooltip from "shared/ui-kit/InputWithLabelAndTooltip";

const exitIcon = require("assets/icons/cross_gray.png");
const airdropIcon = require("assets/icons/airdrop.svg");
const searchIcon = require("assets/icons/search.png");
const removeIcon = require("assets/icons/trash-red.svg");
const addIcon = require("assets/icons/plus.svg");

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    text: {
      flexGrow: 1,
    },
    span: {
      display: "flex",
      alignItems: "center",
    },
    userImage: {
      width: 30,
      height: 30,
      minWidth: 30,
      borderRadius: 15,
      backgroundColor: "#656e7e",
      marginRight: 10,
    },
    platformImage: {
      width: 30,
      height: 30,
      backgroundColor: "rgba(0,0,0,0)",
      marginRight: 10,
    },
    root: {
      width: "100%",
      "& > * + *": {
        marginTop: theme.spacing(2),
      },
    },
  })
);

const useAutoCompleteStyles = makeStyles({
  root: {
    width: "100%",
  },
  listbox: {
    maxHeight: 168,
  },
  option: {
    height: 52,
  },
});

type AirdropTokenslModalProps = {
  open: boolean;
  handleClose: () => void;
  handleRefresh: () => void;
  community?: any;
};

const AirdropModal: React.FC<AirdropTokenslModalProps> = ({
  open,
  handleClose,
  handleRefresh,
  community,
}) => {
  const classes = useStyles();
  const users = useSelector((state: RootState) => state.usersInfoList);
  const user = useTypedSelector(state => state.user);

  const autocompleteStyle = useAutoCompleteStyles();
  const [autocompleteKey, setAutocompleteKey] = useState<number>(new Date().getTime());
  const [usersList, setUsersList] = useState<string[]>([]);
  const [searchName, setSearchName] = useState<string>("");
  const [step, setStep] = useState<number>(0);
  const [usersTKN, setUsersTKN] = useState<any>({});
  const [status, setStatus] = React.useState<any>(null);

  const [communityTokenBalance, setCommunityTokenBalance] = useState<number>(0);
  const payloadRef = useRef<any>({});
  const [openSignRequestModal, setOpenSignRequestModal] = useState<boolean>(false);
  const [signRequestModalDetail, setSignRequestModalDetail] = useState<any>(null);

  const handleCancel = () => {
    setUsersList([]);
    setStep(0);
    handleClose();
    setStatus(null);
  };

  const handleAddAmount = (e, user) => {
    const values = { ...usersTKN };
    values[user] = e.target.value;
    setUsersTKN({ ...values });
  };

  const handleKeypress = e => {
    const characterCode = e.key;
    if (characterCode === "Backspace") return;
    if (characterCode === ".") return;

    const characterNumber = Number(characterCode);
    if (characterNumber >= 0 && characterNumber <= 9) {
      if (e.currentTarget.value && e.currentTarget.value.length) {
        return;
      } else if (characterNumber === 0) {
        e.preventDefault();
      }
    } else {
      e.preventDefault();
    }
  };

  useEffect(() => {
    if (community?.CommunityAddress && community?.TokenSymbol) {
      axios
        .get(`${URL()}/wallet/balanceOf`, {
          params: { address: community.CommunityAddress, token: community.TokenSymbol },
        })
        .then(res => {
          const resp = res.data;
          if (resp?.success) setCommunityTokenBalance(resp.data);
        });
    }
  }, [community.CommunityAddress]);

  useEffect(() => {
    if (step === 0) {
      setUsersTKN({});
    }
    setStatus(null);
  }, [step]);

  const handleNext = () => {
    if (step === 0) {
      if (!community?.CommunityAddress) handleSetStatus("Wallet address is required.", "error", setStatus);
      else setStep(1);
    } else if (step === 1) {
      let isValid = true;
      Object.values(usersTKN).forEach(amount => {
        if (!amount) isValid = false;
      });
      if (isValid) {
        setStep(2);
      } else handleSetStatus("Please add airdrop token amount for all users.", "error", setStatus);
    }
  };

  const handleOpenSignatureModal = () => {
    if (validate()) {
      let addresses = {};
      let address: string = "";
      let userAmount: any = 0;
      for ([address, userAmount] of Object.entries(usersTKN)) {
        addresses[address] = userAmount.toString();
      }
      const payload: IAirdropCommunityToken = {
        CommunityId: community.CommunityAddress,
        Addresses: addresses,
      };
      payloadRef.current = payload;
      setSignRequestModalDetail(buildJsxFromObject(payload));
      setOpenSignRequestModal(true);
    }
  };

  const handleAirdrop = async () => {
    try {
      const payload = payloadRef.current;
      if (Object.keys(payload).length) {
        // any additional data that need to be stored goes in this object
        const additionalData = {};
        const airdropRes = await airdropCommunityToken(payload, additionalData);
        if (airdropRes && airdropRes.success) {
          setTimeout(() => {
            handleRefresh();
            handleClose();
          }, 1000);
        } else handleSetStatus("Error when making the request", "error", setStatus);
      }
    } catch (e) {
      handleSetStatus("Error when making the request " + e, "error", setStatus);
    }
  };

  const validate = (): boolean => {
    //  check that the community has enought token balance
    let sum = 0;
    for (let userAmount of Object.values(usersTKN)) {
      sum += Number(userAmount);
    }
    if (sum > communityTokenBalance) {
      handleSetStatus("Community doesn't have enought balance for airdrop", "error", setStatus);
      return false;
    }
    return true;
  };

  const selectUsers = (
    <>
      <img src={airdropIcon} alt={"airdrop"} />
      <h3>Airdrop Community Tokens</h3>
      <h6 className={styles.description}>Send part of your community tokens to other users of your choice</h6>
      <div className={styles.share}>
        <label>Add wallet address</label>
        <div className={classnames(styles.inputContainer, styles.disabledInput)}>
          <InputWithLabelAndTooltip
            transparent
            overriedClasses={styles.walletAddress}
            inputValue={community?.CommunityAddress}
            type={"text"}
            disabled
            placeHolder={"Wallet Address"}
          />
        </div>
      </div>
      <div className={styles.share}>
        <label>Search users by name</label>
        <div className={styles.inputContainer}>
          <Autocomplete
            clearOnBlur
            id="autocomplete-share-media"
            freeSolo
            classes={autocompleteStyle}
            key={autocompleteKey}
            onChange={(event: any, newValue: any | null) => {
              if (newValue) {
                const usersCopy = [...usersList];
                usersCopy.push(newValue.address);
                setUsersList(usersCopy);
                // reset search query
                setAutocompleteKey(new Date().getTime());
              }
            }}
            options={[...users.filter(user => !usersList.includes(user.address))]}
            renderOption={(option, { selected }) => (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "12px 20px",
                  borderBottom: "1px solid #eff2f8",
                  margin: 0,
                  width: "100%",
                }}
              >
                <div style={{ display: "flex", alignItems: "center" }}>
                  <div
                    className={classes.userImage}
                    style={{
                      backgroundImage:
                        typeof option !== "string" && option.imageURL ? `url(${option.imageURL})` : "none",
                      backgroundRepeat: "no-repeat",
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                      cursor: "pointer",
                      borderRadius: "50%",
                      width: "32px",
                      height: "32px",
                      border: "3px solid #ffffff",
                      filter: "drop-shadow(0px 2px 8px rgba(0, 0, 0, 0.12))",
                      marginRight: "12px",
                    }}
                  />
                  <div
                    style={{
                      fontStyle: "normal",
                      fontWeight: "normal",
                      fontSize: "14px",
                      color: "#181818",
                      fontFamily: "Agrandir",
                    }}
                  >
                    {option.name}
                  </div>
                </div>
                <img src={addIcon} alt={"add"} style={{ width: "16px", height: "16px" }} />
              </div>
            )}
            getOptionLabel={option => option.name}
            getOptionSelected={option => option.address === usersList[0]}
            renderInput={params => (
              <InputBase
                value={searchName}
                onChange={event => {
                  setSearchName(event.target.value);
                }}
                ref={params.InputProps.ref}
                inputProps={params.inputProps}
                style={{ width: "100%" }}
                autoFocus
                placeholder="Search users"
              />
            )}
          />
          <img src={searchIcon} alt={"search"} />
        </div>
      </div>
      {usersList.length > 0 ? (
        <div className={styles.usersDisplay}>
          {usersList.map((user, index) => {
            const userIndex = users.findIndex(u => u.address === user);
            return (
              <div key={user}>
                <div className={styles.left}>
                  <div
                    className={styles.avatar}
                    style={{
                      backgroundImage:
                        users.find(u => u.address === user) &&
                        users[userIndex].imageURL &&
                        users[userIndex].imageURL.length > 0
                          ? `url(${users[userIndex].imageURL})`
                          : "none",
                      backgroundRepeat: "no-repeat",
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                      cursor: "pointer",
                    }}
                  />
                  <div className={styles.userInfo}>
                    <span className={styles.name}>{users[userIndex].name}</span>
                    <span>{`@${users[userIndex].urlSlug}`}</span>
                  </div>
                </div>
                <span
                  onClick={() => {
                    const usersCopy = [...usersList];
                    usersCopy.splice(index, 1);
                    setUsersList(usersCopy);
                  }}
                >
                  <img src={removeIcon} alt={"remove"} />
                </span>
              </div>
            );
          })}
        </div>
      ) : null}
    </>
  );

  const addAmount = (
    <>
      <div className={styles.step2Header}>
        <h3>{step === 1 ? "Airdrop Community Tokens" : "Allocation Summary"}</h3>
        {step === 1 && (
          <>
            <h4 className={styles.description}>Allocation</h4>
            <p>
              Indicate how much of your Community Tokens you would like to distribute among selected users
            </p>
            <p>
              Current community balance: {communityTokenBalance} {community?.TokenSymbol}
            </p>
          </>
        )}
      </div>
      <div className={styles.mainContent}>
        <div className={styles.userAmount}>
          <div className={styles.title}>User</div>
          <div className={styles.title}>Amount</div>
        </div>
        {usersList.length > 0
          ? usersList.map(user => {
              const userIndex = users.findIndex(u => u.address === user);
              return (
                <div key={user} className={styles.userAmount}>
                  <div className={styles.left}>
                    <div
                      className={styles.avatar}
                      style={{
                        backgroundImage:
                          users.find(u => u.address === user) &&
                          users[userIndex].imageURL &&
                          users[userIndex].imageURL.length > 0
                            ? `url(${users[userIndex].imageURL})`
                            : "none",
                        backgroundRepeat: "no-repeat",
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        cursor: "pointer",
                      }}
                    />
                    <div className={styles.userInfo}>
                      <span className={styles.name}>{users[userIndex].name}</span>
                      <span>{`@${users[userIndex].urlSlug}`}</span>
                    </div>
                  </div>
                  <div>
                    {step === 1 ? (
                      <div className={styles.inputContainer}>
                        <InputWithLabelAndTooltip
                          transparent
                          overriedClasses={styles.inputBox}
                          onInputValueChange={e => handleAddAmount(e, user)}
                          inputValue={usersTKN[user]}
                          minValue={"0"}
                          type={"number"}
                          placeHolder={"Wallet Address"}
                          onKeyDown={handleKeypress}
                        />
                      </div>
                    ) : (
                      <div className={styles.userTKN}>
                        {usersTKN[user]} {community?.TokenSymbol ?? ""}
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          : null}
      </div>
    </>
  );

  const mainContent = () => {
    switch (step) {
      case 0:
        return selectUsers;
      case 1:
        return addAmount;
      case 2:
        return addAmount;
      default:
        break;
    }
  };

  return (
    <Modal open={open} onClose={handleCancel} className={styles.modal}>
      <div className={styles.modalContent}>
        <SignatureRequestModal
          open={openSignRequestModal}
          address={user.address}
          transactionFee="0.0000"
          detail={signRequestModalDetail}
          handleOk={handleAirdrop}
          handleClose={() => setOpenSignRequestModal(false)}
        />
        <img className={styles.exit} src={exitIcon} alt={"x"} onClick={() => handleCancel()} />
        <div className={styles.content}>
          {mainContent()}
          {usersList.length ? (
            <div className={styles.controlButtons}>
              <ModalButton className={styles.button} variant="outlined" onClick={handleCancel}>
                Cancel
              </ModalButton>
              <div>
                {step > 0 && (
                  <ModalButton className={styles.button} variant="outlined" onClick={() => setStep(step - 1)}>
                    Back
                  </ModalButton>
                )}
                {step < 2 ? (
                  <ModalButton className={styles.button} onClick={handleNext}>
                    Next
                  </ModalButton>
                ) : (
                  <ModalButton className={styles.button} onClick={handleOpenSignatureModal}>
                    {Object.keys(community?.Founders ?? {}).length > 1 ? "Create Proporsal" : "Send Airdrop"}
                  </ModalButton>
                )}
              </div>
            </div>
          ) : null}
        </div>
        <Box mt={1}>{status && <Alert severity={status.variant}>{status.msg}</Alert>}</Box>
      </div>
    </Modal>
  );
};

export default AirdropModal;
