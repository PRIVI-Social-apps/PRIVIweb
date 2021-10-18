import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import classnames from "classnames";

import { InputBase, Modal, Grid } from "@material-ui/core";
import { Autocomplete, Alert } from "@material-ui/lab";

import URL from "shared/functions/getURL";
import { ModalButton } from "shared/ui-kit/Buttons/ModalButton";
import { signTransaction } from "shared/functions/signTransaction";
import { RootState, useTypedSelector } from "store/reducers/Reducer";
import { handleSetStatus } from "shared/functions/commonFunctions";
import { airdropTokensModalStyles, useAutoCompleteStyles } from "./AirdropTokensModal.styles";
import InputWithLabelAndTooltip from "shared/ui-kit/InputWithLabelAndTooltip";
import Box from 'shared/ui-kit/Box';
import { Color } from "shared/ui-kit";

const exitIcon = require("assets/icons/cross_gray.png");
const airdropIcon = require("assets/icons/airdrop.svg");
const searchIcon = require("assets/icons/search.png");
const removeIcon = require("assets/icons/trash-red.svg");
const addIcon = require("assets/icons/plus.svg");

type AirdropTokensModalProps = {
  open: boolean;
  handleClose: () => void;
  community?: any;
  socialToken?: any;
  variant?: string;
};

export const AirdropTokensModal: React.FC<AirdropTokensModalProps> = ({
  open,
  handleClose,
  community,
  socialToken,
  variant = "",
}) => {
  const classes = airdropTokensModalStyles();
  const autocompleteStyle = useAutoCompleteStyles();

  const users = useSelector((state: RootState) => state.usersInfoList);
  const user = useTypedSelector(state => state.user);
  const userBalances = useTypedSelector(state => state.userBalances);

  const [autocompleteKey, setAutocompleteKey] = useState<number>(new Date().getTime());
  const [usersList, setUsersList] = useState<string[]>([]);
  const [searchName, setSearchName] = useState<string>("");
  const [walletAddress, setWalletAddress] = useState<string>("");
  const [step, setStep] = useState<number>(0);
  const [usersTKN, setUsersTKN] = useState<any>({});
  const [status, setStatus] = React.useState<any>(null);

  useEffect(() => {
    if (open) {
      if (community) {
        setWalletAddress(community.CommunityAddress);
      } else if (socialToken) {
        setWalletAddress(socialToken.PoolAddress);
      }
    }
  }, [community, socialToken]);

  useEffect(() => {
    if (step === 0) {
      setUsersTKN({});
    }
    setStatus(null);
  }, [step]);

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

  const handleNext = () => {
    if (step === 0) {
      if (variant === "profile") {
        setStep(1);
        return;
      } else if (!walletAddress) {
        setStatus({
          msg: "Wallet address is required.",
          key: Math.random(),
          variant: "error",
        });
      } else {
        setStep(1);
      }
    } else if (step === 1) {
      let isValid = true;
      if (Object.keys(usersTKN).length === usersList.length) {
        Object.keys(usersTKN).map(key => {
          if (!usersTKN[key]) {
            isValid = false;
          }
          return true;
        });
      } else {
        isValid = false;
      }
      if (isValid) {
        setStep(2);
      } else {
        setStatus({
          msg: "Please add valid Token Values for all users.",
          key: Math.random(),
          variant: "error",
        });
      }
    }
  };

  // create requests and make transfers in parallel
  const handleSubmit = async () => {
    if (validate()) {
      const promises: any[] = [];
      for (let i = 0; i < usersList.length; i++) {
        const userAddress = usersList[i];
        const selectedUserAmount = usersTKN[userAddress];
        let body: any;
        if (community) {
          body = {
            Token: community.TokenSymbol,
            From: walletAddress,
            To: userAddress,
            Amount: Number(selectedUserAmount),
            Type: "Community Airdrop",
          };
        } else if (socialToken) {
          body = {
            Token: socialToken.TokenSymbol,
            From: user.address,
            To: userAddress,
            Amount: Number(selectedUserAmount),
            Type: "Social Token Airdrop",
          };
        }
        const [hash, signature] = await signTransaction(user.mnemonic, body);
        body.Hash = hash;
        body.Signature = signature;
        promises.push(axios.post(`${URL()}/wallet/transfer`, body));
      }
      // make calls
      if (promises.length > 0) {
        Promise.all(promises).then(responses => {
          let sentUsers = 0;
          responses.forEach(res => {
            const resp = res.data;
            if (resp.success) sentUsers++;
          });
          if (sentUsers < responses.length) {
            handleSetStatus(
              `Aidropt failed: sent to ${sentUsers} out of ${responses.length} users`,
              "error",
              setStatus
            );
          } else {
            handleSetStatus(`Aidropt sent to ${sentUsers} users`, "success", setStatus);
            setTimeout(() => {
              handleClose();
              // handleRefresh();
            }, 1000);
          }
        });
      }
    }
  };

  const validate = (): boolean => {
    // check creator has enough balance for airdrop
    if (socialToken) {
      let sum = 0;
      usersList.forEach(userAddress => (sum += usersTKN[userAddress]));
      if (!userBalances[socialToken.TokenSymbol] || userBalances[socialToken.TokenSymbol].Balance < sum) {
        handleSetStatus(`Insufficient ${socialToken.TokenSymbol} balance`, "error", setStatus);
        return false;
      }
    }
    return true;
  };

  const selectUsers = (
    <>
      <img src={airdropIcon} className={classes.logoImg} alt={"airdrop"} />
      <h3>{socialToken ? "Airdrop Your Social Token" : "Airdrop Community Tokens"}</h3>
      <div className={classes.contentDescription}>
        Send part of your {socialToken ? "Social" : "Community"} Tokens to other users of your choice
      </div>
      <div className={classes.shareSection}>
        <label>Add wallet address</label>
        <div className={classnames(classes.inputContainer, socialToken && classes.disabledInput)}>
          <InputWithLabelAndTooltip
            type='text'
            overriedClasses={classes.walletAddress}
            inputValue={walletAddress}
            onInputValueChange={e => setWalletAddress(e.target.value)}
            placeHolder="Wallet Address"
            disabled={socialToken !== undefined}
          />
        </div>
      </div>
      <div className={classes.shareSection}>
        <label>Search users by name</label>
        <div className={classes.inputContainer}>
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
                      color: Color.GrayDark,
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
        <div className={classes.usersDisplay}>
          {usersList.map((user, index) => {
            const userIndex = users.findIndex(u => u.address === user);
            return (
              <div key={user}>
                <div className={classes.leftSideSection}>
                  <div
                    className={classes.avatarSection}
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
                  <div className={classes.userInfoSection}>
                    <span className={classes.nameSection}>{users[userIndex].name}</span>
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
      <div className={classes.step2Header}>
        <h3>{step === 1 ? "Airdrop Community Tokens" : "Allocation Summary"}</h3>
        {step === 1 && (
          <>
            <div className={classes.contentDescription}>Allocation</div>
            <p>{`Indicate how much of your ${socialToken ? "Social" : "Community"
              } Tokens you would like to distribute among selected users.`}</p>
          </>
        )}
      </div>
      <div className={classes.mainContent}>
        <Grid container item xs={12} md={12} className={classes.step2UserAmount}>
          <Grid item md={8} xs={8} className={classes.step2Title}>
            User
          </Grid>
          <Grid item md={4} xs={4} className={classes.step2Title}>
            Amount
          </Grid>
        </Grid>
        {usersList.length > 0
          ? usersList.map(user => {
            const userIndex = users.findIndex(u => u.address === user);
            return (
              <div key={user} className={classes.step2UserAmount}>
                <Grid container spacing={1} item xs={12} md={12} alignItems="center">
                  <Grid item xs={1} md={1}>
                    <div
                      className={classes.avatarSection}
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
                  </Grid>
                  <Grid item xs={7} md={7}>
                    <div className={classes.userInfoSection}>
                      <span className={classes.nameSection}>{users[userIndex].name}</span>
                      <span>{`@${users[userIndex].urlSlug}`}</span>
                    </div>
                  </Grid>
                  <Grid item xs={4} md={4}>
                    {step === 1 ? (
                      <div className={classes.amountInputContainer}>
                        <InputWithLabelAndTooltip
                          type="number"
                          onKeyDown={handleKeypress}
                          inputValue={usersTKN[user]}
                          minValue={'0'}
                          onInputValueChange={e => handleAddAmount(e, user)}
                          overriedClasses={classes.tokenAmount}
                        />
                      </div>
                    ) : (
                      <div className={classes.userTKNSection}>
                        {usersTKN[user]} {community?.TokenSymbol ?? socialToken?.TokenSymbol ?? ""}
                      </div>
                    )}
                  </Grid>
                </Grid>
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
    <Modal open={open} onClose={handleCancel} className={classes.root}>
      <div className={classes.modalContent}>
        <img className={classes.exitImg} src={exitIcon} alt={"x"} onClick={() => handleCancel()} />
        <div className={classes.mainContent}>
          {mainContent()}
          {usersList.length ? (
            <div className={classes.controlButtons}>
              <ModalButton className={classes.button} variant="outlined" onClick={handleCancel}>
                Cancel
              </ModalButton>
              <div>
                {step > 0 && (
                  <ModalButton
                    className={classes.button}
                    variant="outlined"
                    onClick={() => setStep(step - 1)}
                  >
                    Back
                  </ModalButton>
                )}
                {step < 2 ? (
                  <ModalButton className={classes.button} onClick={handleNext}>
                    Next
                  </ModalButton>
                ) : (
                  <ModalButton className={classes.button} onClick={handleSubmit}>
                    Confirm and Submit
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
