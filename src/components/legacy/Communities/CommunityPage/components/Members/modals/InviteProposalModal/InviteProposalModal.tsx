import React, { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";

import { Fade, MenuItem, TextField, Tooltip, InputBase } from "@material-ui/core";
import { Autocomplete } from "@material-ui/lab";

import { inviteProposalModalStyles, useAutocompleteStyles } from "./InviteProposalModal.styles";
import { RootState } from "store/reducers/Reducer";
import AlertMessage from "shared/ui-kit/Alert/AlertMessage";
import { PrimaryButton, Header3, Header5, Modal } from "shared/ui-kit";
import Box from "shared/ui-kit/Box";
import { buildJsxFromObject, handleSetStatus } from "shared/functions/commonFunctions";
import { SignatureRequestModal } from "shared/ui-kit/Modal/Modals";
import { inviteMember, addTreasurerProposal, IAddTreasurerProposal } from "shared/services/API";

const Roles = ["Select a Role", "Treasurer", "Member"];
const infoIcon = require("assets/icons/info_icon.png");
const removeIcon = require("assets/icons/remove.png");
const addIcon = require("assets/icons/plus.svg");
const searchIcon = require("assets/icons/search.png");

const InviteProposalModal = ({open, handleClose, handleRefresh, community}) => {
  const classes = inviteProposalModalStyles();
  const autocompleteStyle = useAutocompleteStyles();

  const userSelector = useSelector((state: RootState) => state.user);
  const users = useSelector((state: RootState) => state.usersInfoList);

  const [autocompleteKey, setAutocompleteKey] = useState<number>(new Date().getTime());
  const [usersSelected, setUsersSelected] = useState<any[]>([]);
  const [searchName, setSearchName] = useState<string>("");
  const [role, setRole] = useState(Roles[0]);

  const payloadRef = useRef<any>({});
  const [openSignRequestModal, setOpenSignRequestModal] = useState<boolean>(false);
  const [signRequestModalDetail, setSignRequestModalDetail] = useState<any>(null);
  const [status, setStatus] = useState<any>("");

  const validate = () => {
    if (!community.CommunityAddress) {
      handleSetStatus('Community address missing', 'error', setStatus);
      return false;
    }
    else if (!usersSelected.length) {
      handleSetStatus('No user selected', 'error', setStatus);
      return false;
    }
    else if (role == Roles[0]) {
      handleSetStatus('No role selected', 'error', setStatus);
      return false;
    }
    return true;
  }

  const handleOpenSignatureModal = () => {
    if (validate()) {
      const payload: IAddTreasurerProposal = {
        "CommunityId": community.CommunityAddress,
        "Addresses": usersSelected.map(u => u.address),
        "IsAddingTreasurers": true
        };
      payloadRef.current = payload;
      setSignRequestModalDetail(buildJsxFromObject(payload));
      setOpenSignRequestModal(true);
    }
  }

  const clearAndClose = () => {
    setRole(Roles[0]);
    setUsersSelected([]);
    setTimeout(() => {
      handleRefresh();
      handleClose();
    }, 1000);
  }

  const handleSubmitTreasurer = () => {
    try {
      const payload = payloadRef.current;
      addTreasurerProposal(payload, {}).then(resp => {
        if (resp && resp.success) {
          handleSetStatus('Treasurer proposals submitted', 'success', setStatus);
          clearAndClose();
        }
        else handleSetStatus('Treasurer proposals creation failed', 'error', setStatus);
      });
    }
    catch (e) {
      handleSetStatus('Treasurer proposals creation failed: ' + e, 'error', setStatus);
    }
  }

  const handleInviteUser = () => {
    if (validate()) {
      inviteMember(userSelector.id, community.CommunityAddress, usersSelected.map(u => u.address)).then(resp => {
        if (resp && resp.success) {
          handleSetStatus('Member invitations submitted', 'success', setStatus);
          clearAndClose();
        }
        else handleSetStatus('Member invitations failed', 'error', setStatus);
      });
    }
  }

  return (
    <Modal size="medium" isOpen={open} onClose={handleClose} showCloseIcon>
      <SignatureRequestModal
        open={openSignRequestModal}
        address={userSelector.address}
        transactionFee="0.0000"
        detail={signRequestModalDetail}
        handleOk={handleSubmitTreasurer}
        handleClose={() => setOpenSignRequestModal(false)}
      />
      <Header3>Invite Proposal</Header3>
      <Box display="flex" flexDirection="row" mt={4}>
        <Header5>Search by email</Header5>
        <Tooltip
          TransitionComponent={Fade}
          TransitionProps={{ timeout: 600 }}
          arrow
          title={"Write user email"}
        >
          <img className={classes.infoImg} src={infoIcon} alt={"info"} />
        </Tooltip>
      </Box>
      <Box display="flex" flexDirection="row"
           alignItems="flex-start">
        <Box width={0.5} pr={1}>
          <div className={classes.inputContainer}>
            <Autocomplete
              clearOnBlur
              id="autocomplete-share-media"
              freeSolo
              classes={autocompleteStyle}
              key={autocompleteKey}
              disabled={usersSelected.length >= 1}
              onChange={(event: any, newValue: any | null) => {
                if (newValue) {
                  const usersCopy = [...usersSelected];
                  usersCopy.push({
                    address: newValue.address,
                    id: newValue.id,
                    name: newValue.name,
                    url: newValue.url
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
              getOptionLabel={option => option.email ?? ''}
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
          >
            {Roles.map(role => (
              <MenuItem value={role}
                        key={role}>{role}</MenuItem>
            ))}
          </TextField>
        </Box>
      </Box>
      <Box display="flex" flexDirection="row" mt={4}>
        <Header5>Users and Roles</Header5>
        <Tooltip
          TransitionComponent={Fade}
          TransitionProps={{ timeout: 600 }}
          arrow
          title={"Write privi user name"}
        >
          <img className={classes.infoImg} src={infoIcon} alt={"info"} />
        </Tooltip>
      </Box>
      <Box display="flex" flexDirection="row"
           alignItems="flex-start">
        <Box width={0.5} pr={1}>
          <div className={classes.inputContainer}>
            <Autocomplete
              clearOnBlur
              id="autocomplete-share-media"
              freeSolo
              classes={autocompleteStyle}
              key={autocompleteKey}
              disabled={usersSelected.length >= 1}
              onChange={(event: any, newValue: any | null) => {
                if (newValue) {
                  const usersCopy = [...usersSelected];
                  usersCopy.push({
                    address: newValue.address,
                    id: newValue.id,
                    name: newValue.name,
                    url: newValue.url
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
          {
            usersSelected ?
              <div>
                {
                  usersSelected.map((userSelected, index) => {
                    return(
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
                              color: "#181818",
                              fontFamily: "Agrandir",
                            }}
                          >
                            {userSelected.name}
                          </div>
                        </div>
                        <img src={removeIcon}
                             alt={"remove"}
                             style={{
                               width: "16px",
                               height: "16px" ,
                               cursor: 'pointer'
                             }}
                             onClick={() => {
                               const usersCopy = [...usersSelected];
                               usersCopy.splice(index, 1);
                               setUsersSelected(usersCopy);
                             }}/>
                      </div>
                    )
                  })
                }
              </div> : null
          }
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
              <MenuItem value={role}
                        key={role}>{role}</MenuItem>
            ))}
          </TextField>
        </Box>
      </Box>
      <Box display="flex" flexDirection="row" justifyContent="flex-end" mt={4}>
        <PrimaryButton size="medium"
                       onClick={() => {
                        if (role == Roles[1]) handleOpenSignatureModal();
                        else handleInviteUser();
                       }}>
          Confirm And Submit
        </PrimaryButton>
      </Box>
      {status ? <AlertMessage key={status.key} message={status.msg} variant={status.variant} /> : ""}
    </Modal>
  );
};

export default InviteProposalModal;
