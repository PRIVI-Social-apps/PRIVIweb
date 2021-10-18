import React, { useState } from "react";
import { useSelector } from "react-redux";

import { Grid, InputBase, TextField, MenuItem } from "@material-ui/core";
import { Autocomplete } from "@material-ui/lab";

import { submitProposalModalStyles, useAutoCompleteStyles } from "./SubmitProposalModal.styles";
import { Modal } from "shared/ui-kit";
import { RootState } from "store/reducers/Reducer";
import { DAOButton } from "components/PriviDAO/components/DAOButton";
import Box from 'shared/ui-kit/Box';

const addIcon = require("assets/icons/plus.svg");
const searchIcon = require("assets/icons/search_white.png");
const Roles = ["Select a Role", "Admin", "Moderator", "Treasurer", "Member"];

const SubmitProposalModal = (props: any) => {
  const classes = submitProposalModalStyles();
  const autocompleteStyle = useAutoCompleteStyles();

  const users = useSelector((state: RootState) => state.usersInfoList);

  const [autocompleteKey, setAutocompleteKey] = useState<number>(new Date().getTime());
  const [usersList, setUsersList] = useState<string[]>([]);
  const [searchName, setSearchName] = useState<string>("");
  const [priviRole, setPriviRole] = useState(Roles[0]);

  return (
    <Modal
      size="medium"
      theme="dark"
      isOpen={props.open}
      onClose={props.onClose}
      showCloseIcon
      className={classes.root}
    >
      <Box mt={3} mb={3}>
        <Box fontFamily="Agrandir GrandLight" fontSize="22px">
          New {props.type === "appointment" ? "Appointment" : "Rejection"} Proposal
        </Box>
      </Box>
      <Grid container xs={12} md={12}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Box fontSize={18} fontWeight={400} color="white">
              User
            </Box>
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
                          color: "white",
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
              <img src={searchIcon} alt={"search"} style={{ marginRight: "16px" }} />
            </div>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box fontSize={18} fontWeight={400} color="white">
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
                  <MenuItem value={role} key={role + index}>
                    {role}
                  </MenuItem>
                ))}
              </TextField>
            </Box>
          </Grid>
        </Grid>
        {props.type === "appointment" ? (
          <Box fontSize={14} fontWeight={400} color="#3897F0" mt={2} mb={6}>
            This user will be proposed to be appointed as Community Treasurer.
          </Box>
        ) : (
          <Box fontSize={14} fontWeight={400} color="#D10869" mt={2} mb={6}>
            This user will be proposed to be removed as Community Treasurer.
          </Box>
        )}
        <Box mt={3}>
          <Grid container item xs={12} md={12} justify="space-between">
            <DAOButton onClick={props.onClose}>CANCEL</DAOButton>
            <DAOButton onClick={() => {}}>SUBMIT TRANSFER PROPOSAL</DAOButton>
          </Grid>
        </Box>
      </Grid>
    </Modal>
  );
};

export default SubmitProposalModal;
