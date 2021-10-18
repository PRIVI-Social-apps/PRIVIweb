import React, { useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";

import { Fade, MenuItem, TextField, Tooltip, InputBase } from "@material-ui/core";
import { Autocomplete } from "@material-ui/lab";

import { inviteProposalModalStyles, useAutocompleteStyles } from "./InviteProposalModal.styles";
import { RootState } from "store/reducers/Reducer";
import AlertMessage from "shared/ui-kit/Alert/AlertMessage";
import { Header5, HeaderBold5, Modal } from "shared/ui-kit";
import URL from "shared/functions/getURL";
import { DAOButton } from "components/PriviDAO/components/DAOButton";
import Box from 'shared/ui-kit/Box';

const Roles = ["Select a Role", "Treasurer", "Member"];
const infoIcon = require("assets/icons/info_white.png");
const removeIcon = require("assets/icons/remove_red.png");
const addIcon = require("assets/icons/plus.svg");
const searchIcon = require("assets/icons/search_white.png");

const InviteProposalModal = ({ open, handleClose, handleRefresh, community }) => {
  const classes = inviteProposalModalStyles();
  const autocompleteStyle = useAutocompleteStyles();

  const userSelector = useSelector((state: RootState) => state.user);
  const users = useSelector((state: RootState) => state.usersInfoList);

  const [autocompleteKey, setAutocompleteKey] = useState<number>(new Date().getTime());
  const [usersSelected, setUsersSelected] = useState<any[]>([]);
  const [searchName, setSearchName] = useState<string>("");
  const [selectedUsers, setSelectedUsers] = useState<any[]>([]);
  const [searchByEmail, setSearchByEmail] = useState("");
  const [role, setRole] = useState(Roles[0]);

  const [status, setStatus] = useState<any>("");

  const confirmMember = () => {
    if (role === "Treasurer") {
      let body: any = {
        Data: {
          Function: "addTreasurerProposal",
          Address: userSelector.address,
          Signature: "",
          Payload: {
            CommunityId: community.CommunityAddress,
            Addresses: usersSelected.map(u => u.address),
            IsAddingTreasurers: true,
          },
        },
        Caller: "PRIVI",
      };
      axios
        .post(`${URL()}/community/addTreasurerProposal/v2`, body)
        .then(res => {
          let response = res.data;
          if (response.success) {
            setUsersSelected([]);
          } else {
            console.log("error", response.error);
          }
        })
        .catch(error => {
          console.log("error", error);
        });
    } else if (role === "Member") {
      let body: any = {
        Data: {
          Function: "joiningRequest",
          Address: usersSelected[0].address,
          Signature: "",
          Payload: {
            CommunityId: community.CommunityAddress,
            ProposalId: "",
          },
        },
        Caller: "PRIVI",
      };

      axios
        .post(`${URL()}/community/joiningRequest/v2`, body)
        .then(res => {
          let response = res.data;
          if (response.success) {
            setUsersSelected([]);
          } else {
            console.log("error", response.error);
          }
        })
        .catch(error => {
          console.log("error", error);
        });
    }
  };

  return (
    <Modal size="medium" theme="dark" isOpen={open} onClose={handleClose} showCloseIcon>
      <Box fontFamily="Agrandir GrandLight" fontSize="30px" mb="40px">
        Invite Proposal
      </Box>
      <Box display="flex" flexDirection="row" mt={4}>
        <Box display="flex" alignItems="center" marginBottom="8px">
          Search by email
        </Box>
        <Tooltip
          TransitionComponent={Fade}
          TransitionProps={{ timeout: 600 }}
          arrow
          title={"Write user email"}
        >
          <img className={classes.infoImg} src={infoIcon} alt={"info"} />
        </Tooltip>
      </Box>
      <Box display="flex" flexDirection="row" alignItems="flex-start">
        <Box width={0.5} pr={1}>
          <div className={classes.inputContainer}>
            <Autocomplete
              clearOnBlur
              id="autocomplete-share-media"
              freeSolo
              classes={autocompleteStyle}
              key={autocompleteKey}
              onChange={(event: any, newValue: any | null) => {
                if (newValue) {
                  const usersCopy = [...usersSelected];
                  usersCopy.push({
                    address: newValue.address,
                    id: newValue.id,
                    name: newValue.name,
                    url: newValue.url,
                  });
                  setUsersSelected(usersCopy);
                  // reset search query
                  setAutocompleteKey(new Date().getTime());
                }
              }}
              options={[...users.filter(user => !usersSelected.find(u => u.address == user.address))]}
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
                      {option.email}
                    </div>
                  </div>
                  <img src={addIcon} alt={"add"} style={{ width: "16px", height: "16px" }} />
                </div>
              )}
              getOptionLabel={option => option.email ?? ""}
              getOptionSelected={option => option.address === usersSelected[0]}
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
                  placeholder="Write User Email"
                />
              )}
            />
            <img src={searchIcon} alt={"search"} />
          </div>
        </Box>
        <Box width={0.5} pl={1}>
          <TextField
            select
            variant="outlined"
            className={classes.formControlInput}
            size="small"
            placeholder="Select a Role"
            value={role}
            onChange={e => setRole(e.target.value)}
            disabled={role !== "Select a Role" && usersSelected && usersSelected.length > 0}
          >
            {Roles.map(role => (
              <MenuItem value={role} key={role}>
                {role}
              </MenuItem>
            ))}
          </TextField>
        </Box>
      </Box>
      <Box display="flex" flexDirection="row" mt={4}>
        <Box display="flex" alignItems="center" marginBottom="8px">
          Users and Roles
        </Box>
        <Tooltip
          TransitionComponent={Fade}
          TransitionProps={{ timeout: 600 }}
          arrow
          title={"Write privi user name"}
        >
          <img className={classes.infoImg} src={infoIcon} alt={"info"} />
        </Tooltip>
      </Box>
      <Box display="flex" flexDirection="row" alignItems="flex-start">
        <Box width={0.5} pr={1}>
          <div className={classes.inputContainer}>
            <Autocomplete
              clearOnBlur
              id="autocomplete-share-media"
              freeSolo
              classes={autocompleteStyle}
              key={autocompleteKey}
              onChange={(event: any, newValue: any | null) => {
                if (newValue) {
                  const usersCopy = [...usersSelected];
                  usersCopy.push({
                    address: newValue.address,
                    id: newValue.id,
                    name: newValue.name,
                    url: newValue.url,
                  });
                  setUsersSelected(usersCopy);
                  // reset search query
                  setAutocompleteKey(new Date().getTime());
                }
              }}
              options={[...users.filter(user => !usersSelected.find(u => u.address == user.address))]}
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
              getOptionSelected={option => option.address === usersSelected[0]}
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
                  placeholder="Search Privi User"
                />
              )}
            />
            <img src={searchIcon} alt={"search"} />
          </div>
          {usersSelected ? (
            <div>
              {usersSelected.map((userSelected, index) => {
                return (
                  <div
                    key={userSelected.id}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "12px 20px",
                      margin: 0,
                      width: "100%",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <div
                        className={classes.userImage}
                        style={{
                          backgroundImage: `url(${userSelected.url})`,
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
                        {userSelected.name}
                      </div>
                    </div>
                    <img
                      src={removeIcon}
                      alt={"remove"}
                      style={{
                        width: "16px",
                        height: "16px",
                        cursor: "pointer",
                      }}
                      onClick={() => {
                        const usersCopy = [...usersSelected];
                        usersCopy.splice(index, 1);
                        setUsersSelected(usersCopy);
                      }}
                    />
                  </div>
                );
              })}
            </div>
          ) : null}
        </Box>
        <Box width={0.5} pl={1}>
          <TextField
            select
            variant="outlined"
            className={classes.formControlInput}
            size="small"
            placeholder="Select a Role"
            value={role}
            onChange={e => setRole(e.target.value)}
            disabled={role !== "Select a Role" && usersSelected && usersSelected.length > 0}
          >
            {Roles.map(role => (
              <MenuItem value={role} key={role}>
                {role}
              </MenuItem>
            ))}
          </TextField>
        </Box>
      </Box>
      {selectedUsers.length ? (
        <Box>
          <Box marginBottom="8px">Users added</Box>
          <Box maxHeight={200} overflow="auto">
            {selectedUsers.map(user => (
              <Box display="flex" flexDirection="row" alignItems="stretch" className={classes.userItem}>
                <Box width={1} display="flex" flexDirection="row" alignItems="center">
                  <div
                    style={{
                      backgroundImage: user.Image ? `url(${user.Image})` : "none",
                      backgroundRepeat: "no-repeat",
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                      cursor: "pointer",
                      borderRadius: "50%",
                      width: "56px",
                      height: "56px",
                      border: "3px solid #ffffff",
                      filter: "drop-shadow(0px 2px 8px rgba(0, 0, 0, 0.12))",
                      marginRight: "12px",
                    }}
                  />
                  <HeaderBold5 noMargin>@{user.Name}</HeaderBold5>
                </Box>
                <Box
                  width={1}
                  display="flex"
                  flexDirection="row"
                  alignItems="center"
                  justifyContent="center"
                  className={classes.userItemCenter}
                >
                  <Header5 noMargin>{user.Role}</Header5>
                </Box>
                <Box
                  width={1}
                  display="flex"
                  flexDirection="row"
                  alignItems="center"
                  justifyContent="flex-end"
                >
                  <div
                    style={{
                      width: 12,
                      height: 12,
                      borderRadius: 100,
                      marginRight: 10,
                      backgroundColor:
                        user.Status === "Accepted"
                          ? "#65CB63"
                          : user.Status === "Pending"
                          ? "#FFD43E"
                          : "#F43E5F",
                    }}
                  />
                  <Header5 noMargin>{user.Status}</Header5>
                  <img src={removeIcon} style={{ marginLeft: 20 }} />
                </Box>
              </Box>
            ))}
          </Box>
        </Box>
      ) : null}
      <Box display="flex" flexDirection="row" justifyContent="flex-end" mt={6}>
        <DAOButton onClick={() => confirmMember()}>CONFIRM AND SUBMIT</DAOButton>
      </Box>
      {status ? <AlertMessage key={status.key} message={status.msg} variant={status.variant} /> : ""}
    </Modal>
  );
};

export default InviteProposalModal;
