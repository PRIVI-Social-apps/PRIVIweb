import React, { useState, useEffect, useRef } from "react";

import { Grid, InputBase, TextField, MenuItem } from "@material-ui/core";
import { Autocomplete } from "@material-ui/lab";

import { tresurerMemberEjectModalStyles, useAutoCompleteStyles } from "./TresurerMemberEjectModal.styles";
import { Modal, PrimaryButton, SecondaryButton, HeaderBold4 } from "shared/ui-kit";
import Box from "shared/ui-kit/Box";
import { useTypedSelector } from "store/reducers/Reducer";
import { buildJsxFromObject, handleSetStatus } from "shared/functions/commonFunctions";
import { SignatureRequestModal } from "shared/ui-kit/Modal/Modals";
import { ejectMemberProposal, ejectTreasurerProposal } from "shared/services/API";
import AlertMessage from "shared/ui-kit/Alert/AlertMessage";

const addIcon = require("assets/icons/plus.svg");
const searchIcon = require("assets/icons/search.png");
const Roles = ["Select a Role", "Treasurer", "Member"];


const TresurerMemberEjectModal = ({open, handleClose, handleRefresh, community, member}) => {
  const user = useTypedSelector(state => state.user);
  const users = useTypedSelector(state => state.usersInfoList);

  const classes = tresurerMemberEjectModalStyles();
  const autocompleteStyle = useAutoCompleteStyles();

  const [openSubmitProposalModal, setOpenSubmitProposalModal] = useState<boolean>(false);

  const [autocompleteKey, setAutocompleteKey] = useState<number>(new Date().getTime());
  const [usersList, setUsersList] = useState<string[]>([]);
  const [searchName, setSearchName] = useState<string>("");
  const [selectedRole, setSelectedRole] = useState<string>(Roles[0]);
  const [selectedUser, setSelectedUser] = useState<any>(null);

  const payloadRef = useRef<any>({});
  const [openSignRequestModal, setOpenSignRequestModal] = useState<boolean>(false);
  const [signRequestModalDetail, setSignRequestModalDetail] = useState<any>(null);
  const [status, setStatus] = useState<any>("");

  const handleOpenSubmitProposalModal = () => {
    setOpenSubmitProposalModal(true);
  };

  const handleCloseSubmitProposalModal = () => {
    setOpenSubmitProposalModal(false);
  };

  const handleOpenSignatureModal = () => {
    if (community.CommunityAddress && selectedUser && selectedRole != Roles[0]) {
      let payload;
      if (selectedRole == Roles[1]) {
        payload = {
          "CommunityId": community.CommunityAddress,
          "Addresses": [selectedUser.address],
        }
      }
      else if (selectedRole == Roles[2]) {
        payload = {
          "CommunityId": community.CommunityAddress,
          "Address": selectedUser.address,
        }
      }
      if (selectedRole == Roles[1]) payload.IsAddingTreasurers = true
      payloadRef.current = payload;
      setSignRequestModalDetail(buildJsxFromObject(payload));
      setOpenSignRequestModal(true);
    }
  }

  const handleVote = async () => {
    try {
      const payload = payloadRef.current;
      if (Object.keys(payload).length) {
        let resp;
        if (selectedRole == Roles[1]) resp = await ejectTreasurerProposal(payload, {});
        else if (selectedRole == Roles[2]) resp = await ejectMemberProposal(payload, {});
        if (resp && resp.success) {
          handleSetStatus('Eject proposal submitted', 'success', setStatus);
          setTimeout(() => {
            handleClose();
            handleRefresh();
          }, 1000);
        }
        else handleSetStatus('Eject proposal submission failed', 'error', setStatus);
      }
    }
    catch (e) {
      handleSetStatus('Eject proposal submission failed: ' + e, 'error', setStatus);
    }
  };

  useEffect(() => {
    if(member) {
      if ((member.type ?? []).includes(Roles[1])) setSelectedRole(Roles[1]);
      else if ((member.type ?? []).includes(Roles[2])) setSelectedRole(Roles[2]);
      setSelectedUser(users.find(user => user.id === member.id));
    }
  }, [member]);

  return (
    <Modal size="small" isOpen={open} onClose={handleClose} showCloseIcon>
      <SignatureRequestModal
          open={openSignRequestModal}
          address={user.address}
          transactionFee="0.0000"
          detail={signRequestModalDetail}
          handleOk={handleVote}
          handleClose={() => setOpenSignRequestModal(false)}
      />
      {!openSubmitProposalModal &&
        (<Grid container item
            xs={12} md={12}
            justify="center"
            className={classes.content}>
        <Box fontSize={35}>🖋</Box>
        <Box fontSize={18} fontWeight={400} color="#181818" mt={2} mb={2} textAlign="center">
          To expel a Treasurer of the Community, a rejection proposal is required.
        </Box>
        <Box fontSize={14} fontWeight={400} color="#707582" mb={2} textAlign="center">
          Cofunders will vote to the eject proposal.
        </Box>
        <PrimaryButton size="medium" onClick={handleOpenSubmitProposalModal}>
          Create Proposal
        </PrimaryButton>
      </Grid>)}
      {openSubmitProposalModal &&
        (<>
        <Box mt={3} mb={3}>
          <HeaderBold4>New Rejection Proposal</HeaderBold4>
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
                  disabled={!!member}
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
                  value={selectedRole}
                  disabled={!!member}
                  onChange={e => setSelectedRole(e.target.value)}
                >
                  {Roles.map((role, index) => (
                    <MenuItem value={role}
                              key={role+index}>{role}</MenuItem>
                  ))}
                </TextField>
              </Box>
            </Grid>
          </Grid>
          <Box fontSize={14} fontWeight={400} color="#F43E5F" mt={2} mb={6}>
            This user will be proposed to be removed as Community Treasurer.
          </Box>
          <Grid container item xs={12} md={12} justify="space-between">
            <SecondaryButton size="medium" onClick={handleCloseSubmitProposalModal}>
              Cancel
            </SecondaryButton>
            <PrimaryButton size="medium" onClick={handleOpenSignatureModal}>
              Submit Transfer Proposal
            </PrimaryButton>
          </Grid>
        </Grid>
        </>
        )
      }
      {status ? <AlertMessage key={status.key} message={status.msg} variant={status.variant} /> : ""}
    </Modal>
  );
};

export default TresurerMemberEjectModal;
