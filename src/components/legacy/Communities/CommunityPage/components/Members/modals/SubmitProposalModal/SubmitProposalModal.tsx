import React, { useState } from "react";
import { useSelector } from "react-redux";

import { Grid, InputBase, TextField, MenuItem } from "@material-ui/core";
import { Autocomplete } from "@material-ui/lab";

import { submitProposalModalStyles, useAutoCompleteStyles } from "./SubmitProposalModal.styles";
import { Modal, PrimaryButton, SecondaryButton, HeaderBold4 } from "shared/ui-kit";
import Box from "shared/ui-kit/Box";
import { RootState } from "store/reducers/Reducer";

const addIcon = require("assets/icons/plus.svg");
const searchIcon = require("assets/icons/search.png");
const Roles = ["Select a Role", "Admin", "Moderator", "Treasurer", "Member"];

const SubmitProposalModal = (props: any) => {
  const classes = submitProposalModalStyles();
  const autocompleteStyle = useAutoCompleteStyles();

  const users = useSelector((state: RootState) => state.usersInfoList);

  const [autocompleteKey, setAutocompleteKey] = useState<number>(new Date().getTime());
  const [usersList, setUsersList] = useState<string[]>([]);
  const [searchName, setSearchName] = useState<string>("");
  const [priviRole, setPriviRole] = useState(Roles[0]);
  const [selectedUser, setSelectedUser] = useState<any>(null);

  React.useEffect(() => {
    if(props.data) {
      setSearchName(props.data.name);
      setPriviRole(props.data.type[0]);
      setSelectedUser(users.find(user => user.id === props.data.id));
    }
  }, [props.data]);

  return (
    <Modal size="medium" isOpen={props.open} onClose={props.onClose} showCloseIcon className={classes.root}>
      <Box mt={3} mb={3}>
        <HeaderBold4>New {props.type === "appointment" ? "Appointment" : "Rejection"} Proposal</HeaderBold4>
      </Box>
      <Grid container xs={12} md={12}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Box fontSize={18} fontWeight={400} color="#181818">
              User
            </Box>
            <div className={classes.inputContainer}>
              <Autocomplete
                clearOnBlur
                id="autocomplete-share-media"
                freeSolo
                classes={autocompleteStyle}
                key={autocompleteKey}
                defaultValue={selectedUser}
                onChange={(event: any, newValue: any | null) => {
                  if (newValue) {
                    const usersCopy = [...usersList];
                    usersCopy.push(newValue.address);
                    setUsersList(usersCopy);
                    setSearchName(newValue.name);
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
                // getOptionSelected={option => option.address === usersList[0]}
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
          </Grid>
          <Grid item xs={12} md={6}>
            <Box fontSize={18} fontWeight={400} color="#181818">
              Role
            </Box>
            <Box>
              <TextField
                select
                variant="outlined"
                className={classes.formControlInput}
                size="small"
                placeholder="Select a Role"
                value={priviRole}
                onChange={e => setPriviRole(e.target.value)}
              >
                {Roles.map((role, index) => (
                  <MenuItem value={role}
                            key={role+index}>{role}</MenuItem>
                ))}
              </TextField>
            </Box>
          </Grid>
        </Grid>
        {props.type === "appointment" ? (
          <Box fontSize={14} fontWeight={400} color="#65CB63" mt={2} mb={6}>
            This user will be proposed to be appointed as Community Treasurer.
          </Box>
        ) : (
          <Box fontSize={14} fontWeight={400} color="#F43E5F" mt={2} mb={6}>
            This user will be proposed to be removed as Community Treasurer.
          </Box>
        )}
        <Grid container item xs={12} md={12} justify="space-between">
          <SecondaryButton size="medium" onClick={props.onClose}>
            Cancel
          </SecondaryButton>
          <PrimaryButton size="medium" onClick={() => {}}>
            Submit Transfer Proposal
          </PrimaryButton>
        </Grid>
      </Grid>
    </Modal>
  );
};

export default SubmitProposalModal;
