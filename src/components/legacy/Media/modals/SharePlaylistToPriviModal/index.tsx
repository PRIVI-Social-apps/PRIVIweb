import React, { useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";

import { InputBase } from "@material-ui/core";
import { Autocomplete } from "@material-ui/lab";

import { sharePlaylistToPriviModalStyles, useAutoCompleteStyles } from "./index.styles";

import { RootState } from "store/reducers/Reducer";
import URL from "shared/functions/getURL";
import AlertMessage from "shared/ui-kit/Alert/AlertMessage";
import { Modal, PrimaryButton } from "shared/ui-kit";
import InputWithLabelAndTooltip from "shared/ui-kit/InputWithLabelAndTooltip";

const spaceshipIcon = require("assets/icons/spaceship.png");
const searchIcon = require("assets/icons/search.png");
const removeIcon = require("assets/icons/remove.png");
const addIcon = require("assets/icons/add.png");

const ShareModal = (props: any) => {
  const users = useSelector((state: RootState) => state.usersInfoList);

  const classes = sharePlaylistToPriviModalStyles();
  const autocompleteStyle = useAutoCompleteStyles();

  const [searchName, setSearchName] = useState<string>("");
  const [usersList, setUsersList] = useState<string[]>([]);
  const [autocompleteKey, setAutocompleteKey] = useState<number>(new Date().getTime());
  //key changes everytime an item is added to the list so it's cleared

  const [showSignature, setShowSignature] = useState<boolean>(false);
  const [address, setAddress] = useState<string>("");
  const [message, setMessage] = useState<string>("");

  const [status, setStatus] = useState<any>("");

  const handleShareWall = () => {};

  const handleShareUsers = () => {
    const playListIdSlug = props.id.replace(/\s/g, "");

    axios
      .post(`${URL()}/media/sharePlayList/${playListIdSlug}`, {
        Users: usersList,
      })
      .then(resp => {
        const result = resp.data;
        if (result.success) {
          setUsersList([]);
          setStatus({
            msg: "Shared succesfully!",
            key: Math.random(),
            variant: "success",
          });
          props.handleClose();
        }
      })
      .catch(error => {
        console.log(error);
      });
  };

  return (
    <Modal
      size="medium"
      isOpen={props.open}
      onClose={props.handleClose}
      className={classes.root}
      showCloseIcon
    >
      <div className={classes.modalContent} onClick={e => e.stopPropagation()}>
        {!showSignature ? (
          <div className={classes.mainContent}>
            <img src={spaceshipIcon} alt={"spaceship"} />
            <h3>{`Share & Earn on Privi`}</h3>
            <h6>Earn up to 3 layers of referral tips on paid content</h6>
            <div style={{ marginTop: 10, marginBottom: 10, fontWeight: 800, fontSize: 17 }}>
              Estimated Profit: 0.1 USDT
            </div>
            <PrimaryButton size="medium" onClick={handleShareWall}>
              Share On My Wall
            </PrimaryButton>
            <div className={classes.or}>
              <div className={classes.orText}>or</div>
            </div>
            <div className={classes.share}>
              <label>Share with specific users</label>
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
                      usersCopy.push(newValue.id);
                      setUsersList(usersCopy);
                      // reset search query
                      setAutocompleteKey(new Date().getTime());
                    }
                  }}
                  options={[...users.filter(user => !usersList.includes(user.id))]}
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
                              typeof option !== "string" && option.imageURL
                                ? `url(${option.imageURL})`
                                : "none",
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
                  getOptionSelected={option => option.id === usersList[0]}
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
                      placeholder="Search users or communities"
                    />
                  )}
                />
                <img src={searchIcon} alt={"search"} />
              </div>
            </div>
            {usersList.length > 0 ? (
              <div className={classes.usersDisplay}>
                {usersList.map((user, index) => (
                  <div key={user}>
                    <div className="left">
                      <div
                        className="avatar"
                        style={{
                          backgroundImage:
                            users.find(u => u.id === user) &&
                            users[users.findIndex(u => u.id === user)].imageURL &&
                            users[users.findIndex(u => u.id === user)].imageURL.length > 0
                              ? `url(${users[users.findIndex(u => u.id === user)].imageURL})`
                              : "none",
                          backgroundRepeat: "no-repeat",
                          backgroundSize: "cover",
                          backgroundPosition: "center",
                          cursor: "pointer",
                        }}
                      />
                      {`@${users[users.findIndex(u => u.id === user)].name}`}
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
                ))}
              </div>
            ) : null}
            {usersList.length > 0 ? (
              <PrimaryButton size="medium" onClick={handleShareUsers}>
                Share
              </PrimaryButton>
            ) : null}
          </div>
        ) : (
          <div className={classes.mainContent}>
            <div className={classes.imageContainer}>
              <div className="svgContainer">
                <svg width="36" height="36">
                  <rect width="36" height="36" style={{ fill: "rgb(0,0,0)" }} />
                </svg>
              </div>
            </div>
            <h3>{`Your signature is being requested`}</h3>
            <label>
              Address
              <InputWithLabelAndTooltip
                overriedClasses=""
                required
                type={"text"}
                placeHolder={"0x...."}
                inputValue={address}
                onInputValueChange={e => {
                  setAddress(e.target.value);
                }}
              />
            </label>
            <label>
              Message
              <textarea
                required
                placeholder={"This is a message to prove that I control this address..."}
                value={message}
                onChange={e => {
                  setMessage(e.target.value);
                }}
              />
            </label>
            <PrimaryButton size="medium">Sign To Share</PrimaryButton>
          </div>
        )}
        <div className={classes.root}>
          {status && (
            <AlertMessage
              key={status.key}
              message={status.msg}
              variant={status.variant}
              onClose={() => setStatus(undefined)}
            />
          )}
        </div>
      </div>
    </Modal>
  );
};

export default ShareModal;
