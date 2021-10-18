import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Axios from "axios";
import { FormControl, InputBase, makeStyles, Modal } from "@material-ui/core";
import { Autocomplete } from "@material-ui/lab";
import { RootState } from "store/reducers/Reducer";

import URL from "shared/functions/getURL";
import { StyledMenuItem, StyledSelect } from "shared/ui-kit/Styled-components/StyledComponents";
import AlertMessage from "shared/ui-kit/Alert/AlertMessage";

import "./GetFeedbackModal.css";
import InputWithLabelAndTooltip from "shared/ui-kit/InputWithLabelAndTooltip";

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

const useStyles = makeStyles(theme => ({
  root: {
    width: "100%",
    "& > * + *": {
      marginTop: theme.spacing(2),
    },
  },
}));

const exitIcon = require("assets/icons/cross_gray.png");
const infoIcon = require("assets/icons/info.svg");
const spaceshipIcon = require("assets/icons/spaceship.png");
const searchIcon = require("assets/icons/search.png");
const removeIcon = require("assets/icons/remove.png");
const addIcon = require("assets/icons/add.png");

export default function GetFeedbackModal(props: any) {
  const users = useSelector((state: RootState) => state.usersInfoList);

  const classes = useStyles();
  const autocompleteStyle = useAutoCompleteStyles();

  const [modalScreen, setModalScreen] = useState<number>(0);

  const [searchName, setSearchName] = useState<string>("");
  const [usersList, setUsersList] = useState<string[]>([]);
  const [autocompleteKey, setAutocompleteKey] = useState<number>(new Date().getTime());
  //key changes everytime an item is added to the list so it's cleared

  const [message, setMessage] = useState<string>("");
  const [tip, setTip] = useState<number>(0);
  const [token, setToken] = useState<string>("");

  const [status, setStatus] = useState<any>("");

  const [tokenList, setTokenList] = useState<string[]>(["PRIVI", "BC", "pDATA", "pINS"]);

  // get token list from backend
  useEffect(() => {
    if (props.open === true && tokenList.length <= 4)
      Axios.get(`${URL()}/wallet/getCryptosRateAsMap`).then(res => {
        const resp = res.data;
        if (resp.success) {
          const data: any = resp.data;
          const newTokenList: string[] = []; // list of tokens
          let token: any = "";
          let rate: any = 0;
          for ([token, rate] of Object.entries(data)) {
            newTokenList.push(token);
          }
          setToken(newTokenList[0]);
          setTokenList(newTokenList);
        }
      });
  }, [props.open]);

  const verifyScreen = modalScreen => {
    if (modalScreen === 0) {
      if (usersList.length <= 0) {
        setStatus({
          msg: "Please select at least one user to share with",
          key: Math.random(),
          variant: "error",
        });
        return false;
      } else return true;
    } else if (modalScreen === 1) {
      if (message.length <= 0) {
        setStatus({
          msg: "Please write a message",
          key: Math.random(),
          variant: "error",
        });
        return false;
      } else if (tip <= 0) {
        setStatus({
          msg: "Please type a tip",
          key: Math.random(),
          variant: "error",
        });
        return false;
      } else if (token.length <= 0) {
        setStatus({
          msg: "Please seelct a token",
          key: Math.random(),
          variant: "error",
        });
        return false;
      } else return true;
    } else return true;
  };

  const handleSubmit = () => { };

  return (
    <Modal open={props.open} onClose={props.handleClose} className="modal flexModal">
      <div className="feedback-modal modal-content">
        <img className="exit" src={exitIcon} alt={"close"} onClick={props.handleClose} />

        {modalScreen === 0 ? (
          <section className="first">
            <img src={spaceshipIcon} alt={"spaceship"} />
            <h3>{`Share & Earn on Privi`}</h3>

            <h6>
              Gather feedback and opinions from people of your trust so you can improve your material before
              releasing it to the public.
            </h6>

            <h5>Who would you like to share it with?</h5>
            <div className={"inputContainer"}>
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
                          background: "#c4c4c4",
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
                    placeholder="Search for users"
                  />
                )}
              />
              <img src={searchIcon} alt={"search"} />
            </div>
            {usersList.length > 0 ? (
              <div className={"usersDisplay"}>
                {usersList.map((user, index) => (
                  <div key={user}>
                    <div className={"left"}>
                      <div
                        className={"avatar"}
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

            <div className="buttons">
              <button onClick={props.handleClose}>Cancel</button>
              <button onClick={() => (verifyScreen(0) ? setModalScreen(1) : {})}>Next</button>
            </div>
          </section>
        ) : modalScreen === 1 ? (
          <section>
            <h4>{`Share & Get Feedback`}</h4>

            <h5>Message</h5>
            <textarea
              value={message}
              placeholder={"Leave instructions or a simple appreciation note"}
              onChange={e => setMessage(e.target.value)}
            />

            <div className="row">
              <div>
                <h5>Tip</h5>
                <img src={infoIcon} alt="info" />
              </div>
              <div className="tip-wrapper">
                <InputWithLabelAndTooltip
                  inputValue={`${tip}`}
                  type={"number"}
                  minValue={"0.01"}
                  onInputValueChange={e => setTip(Number(e.target.value))}
                />
                <div className="selector-with-token">
                  <div
                    style={{
                      backgroundImage:
                        token && token !== "" ? `url(${require(`assets/tokenImages/${token}.png`)}` : "none",
                      backgroundRepeat: "no-repeat",
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }}
                    className="tokenImage"
                  />
                  <FormControl>
                    <StyledSelect
                      disableUnderline
                      value={token}
                      onChange={e => {
                        setToken(e.target.value as string);
                      }}
                    >
                      {tokenList.map(token => {
                        return (
                          <StyledMenuItem value={token} key={token}>
                            {token}
                          </StyledMenuItem>
                        );
                      })}
                    </StyledSelect>
                  </FormControl>
                </div>
              </div>
            </div>

            <div className="buttons">
              <button onClick={props.handleClose}>Cancel</button>
              <div>
                <button className="back" onClick={() => setModalScreen(0)}>
                  Back
                </button>
                <button onClick={() => (verifyScreen(1) ? setModalScreen(2) : {})}>Next</button>
              </div>
            </div>
          </section>
        ) : (
          <section className="last">
            <h4>{`Share & Get Feedback`}</h4>

            <h5>Sharing with</h5>
            {usersList.length > 0 ? (
              <div className={"usersDisplay"}>
                {usersList.map((user, index) => (
                  <div key={user}>
                    <div className={"left"}>
                      <div
                        className={"avatar"}
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
                  </div>
                ))}{" "}
              </div>
            ) : null}

            <div className="messageDisplay">
              <h5>Message</h5>
              <div>{message}</div>
            </div>

            <div className="tipDisplay">
              <h5>Tip</h5>
              <div>
                {token} {tip}
              </div>
            </div>

            <div className="buttons">
              <button onClick={props.handleClose}>Cancel</button>
              <div>
                <button className="back" onClick={() => setModalScreen(1)}>
                  Back
                </button>
                <button onClick={handleSubmit}>Confirm and Submit</button>
              </div>
            </div>
          </section>
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
}
