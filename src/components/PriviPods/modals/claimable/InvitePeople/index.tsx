import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Autocomplete } from "@material-ui/lab";
import { makeStyles, createStyles, InputBase } from "@material-ui/core";

import { RootState } from "store/reducers/Reducer";
import { Modal, PrimaryButton } from "shared/ui-kit";
import AlertMessage from "shared/ui-kit/Alert/AlertMessage";
import InputWithLabelAndTooltip from "shared/ui-kit/InputWithLabelAndTooltip";

const searchIcon = require("assets/icons/search_gray.png");
const addIcon = require("assets/icons/add.png");

const useStyles = makeStyles(() =>
  createStyles({
    modal: {
      width: "458px !important",
      padding: "30px 45px !important",
      maxHeight: "85vh !important",
      maxWidth: "85vw !important",
      alignSelf: "center",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
    },
    modalContent: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      "& img": {
        width: "50px",
        height: "50px",
        margin: "27px 0px",
      },
      "& h3": {
        margin: "0px",
        color: "#181818",
        fontWeight: "normal",
        fontSize: "30px",
        textAlign: "center",
      },
      "& h5": {
        margin: "18.5px 0px 30px",
        color: "#707582",
        fontWeight: "normal",
        fontSize: "18px",
        lineHeight: "19px",
        textAlign: "center",
      },
      "& span": {
        margin: "0px",
        fontSize: "14px",
        textAlign: "center",
        color: "#707582",
      },
      "& label": {
        alignSelf: "flex-start",
        color: "#181818",
        fontSize: "18px",
        marginBottom: "8px",
        marginTop: "17px",
      },
    },
    inputContainer: {
      display: "flex",
      alignItems: "center",
      background: "#F7F9FE",
      border: "1px solid #E0E4F3",
      boxSizing: "border-box",
      borderRadius: "6px",
      marginBottom: "27px",
      width: "100%",
      color: "#707582",
      padding: "12.5px 20px 10.5px",
      "& input": {
        padding: "0",
        fontSize: "14px",
        fontFamily: "Agrandir",
      },
      "& img": {
        margin: "0",
        width: "17px",
        height: "17px",
      },
    },
    input: {
      fontSize: "14px",
      display: "flex",
      alignItems: "center",
      background: "#F7F9FE",
      border: "1px solid #727F9A",
      boxSizing: "border-box",
      borderRadius: "6px",
      marginBottom: "27px",
      width: "100%",
      color: "#707582",
      padding: "11.5px 18px",
    },
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

export default function InvitePeopleModal(props) {
  const classes = useStyles();
  const autocompleteStyle = useAutoCompleteStyles();

  const allUsers = useSelector((state: RootState) => state.usersInfoList);
  const thisUser = useSelector((state: RootState) => state.user);

  const [searchName, setSearchName] = useState<string>("");
  const [user, setUser] = useState<string>("");
  const [email, setEmail] = useState<string>("");

  const [status, setStatus] = useState<any>("");

  function validate(): boolean {
    if ((!email || email === "") && (!user || user === "")) {
      setStatus({
        msg: "Please select a user or type an email",
        key: Math.random(),
        variant: "error",
      });
      return false;
    } else if ((!user || user === "") && (!email.includes("@") || !email.includes("."))) {
      setStatus({
        msg: "Please write a valid email",
        key: Math.random(),
        variant: "error",
      });
      return false;
    }

    return true;
  }

  const handleSendInvitation = () => {
    if (validate()) {
      setStatus({
        msg: "Invitation sent successfully",
        key: Math.random(),
        variant: "success",
      });
      //TODO: submit
    }
  };

  return (
    <Modal
      size="medium"
      isOpen={props.open}
      onClose={props.handleClose}
      className={classes.modal}
      showCloseIcon={true}
    >
      <div className={classes.modalContent}>
        <img src={require("assets/icons/community.png")} alt="mailbox" />
        <h3>Invite People To Join</h3>
        <h5>{`Share the love. 
Distribute funds with more people.`}</h5>

        <div className={classes.inputContainer}>
          <Autocomplete
            clearOnBlur
            id="autocomplete-share-media"
            freeSolo
            classes={autocompleteStyle}
            onChange={(event: any, newValue: any | null) => {
              if (newValue) {
                setUser(newValue.id);
                if (email !== "") {
                  setEmail("");
                }
              }
            }}
            options={[...allUsers.filter(u => u.id !== thisUser.id)]}
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
                    {`@${option.urlSlug && !option.urlSlug.includes("Px") ? option.urlSlug : option.name}`}
                  </div>
                </div>
                <img src={addIcon} alt={"add"} style={{ width: "16px", height: "16px" }} />
              </div>
            )}
            getOptionLabel={option =>
              `@${option.urlSlug && !option.urlSlug.includes("Px") ? option.urlSlug : option.name}`
            }
            getOptionSelected={option => option.id === user}
            renderInput={params => (
              <InputBase
                value={searchName}
                onChange={event => {
                  setSearchName(event.target.value);
                  if (searchName === "") {
                    setUser("");
                  }
                }}
                ref={params.InputProps.ref}
                inputProps={params.inputProps}
                style={{ width: "100%" }}
                autoFocus
                placeholder="Enter a username"
              />
            )}
          />
          <img src={searchIcon} alt={"search"} />
        </div>

        <span>Not a Privi Member? Send an Invitation to Sign Up</span>

        <label>Email</label>
        <InputWithLabelAndTooltip
          inputValue={email}
          type="text"
          onInputValueChange={e => {
            setEmail(e.target.value);
            if (user !== "") {
              setUser("");
            }
          }}
          placeHolder={"email@example.com"}
          overriedClasses={classes.input}
        />
        <PrimaryButton size="medium" disabled={user === "" && email === ""} onClick={handleSendInvitation}>
          Send Invitation
        </PrimaryButton>

        {status && (
          <AlertMessage
            key={status.key}
            message={status.msg}
            variant={status.variant}
            onClose={() => setStatus(undefined)}
          />
        )}
      </div>
    </Modal>
  );
}
