import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import Moment from "react-moment";
import {
  Grid,
  useMediaQuery,
  TableContainer,
  Table,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@material-ui/core";

import { memberStyles } from "./Members.styles";
import { RootState } from "store/reducers/Reducer";
import { setSelectedUser } from "store/actions/SelectedUser";
import { BackIcon } from "../VestingTaxation/VestingTaxationStyle";
import { Card, HistoryIcon, PlusIcon } from "../Treasury/TreasuryStyle";
import MembersVoting from "./components/MembersVoting";
import MembersProposal from "./components/MembersProposal";
import InviteProposalModal from "./modals/InviteProposalModal/InviteProposalModal";
import MemberEjectModal from "./modals/MemberEjectModal/MemberEjectModal";
import TresurerMemberEjectModal from "./modals/TresurerMemberEjectModal/TresurerMemberEjectModal";
import TresurerMemberAppointModal from "./modals/TresurerMemberAppointModal/TresurerMemberAppointModal";
import { LoadingWrapper } from "shared/ui-kit/Hocs";
import { Header4, IconPrimaryButton, IconSecondaryButton, PrimaryButton } from "shared/ui-kit";
import Box from "shared/ui-kit/Box";
import { SearchWithCreate } from "shared/ui-kit/SearchWithCreate";
import { getMemberProposals, getTreasurerProposals } from "shared/services/API";
import { buildJsxFromObject, handleSetStatus } from "shared/functions/commonFunctions";
import { SignatureRequestModal } from "shared/ui-kit/Modal/Modals";
import { IVoteProposal, voteTreasurerProposal, resolveJoiningRequest, voteEjectMemberProposal, getProposal, getCommunity } from "shared/services/API";
import AlertMessage from "shared/ui-kit/Alert/AlertMessage";

const removeIcon = require("assets/icons/trash-red.svg");
const checkIcon = require("assets/icons/check_green.svg");


const Members = React.memo((props:any) => {
  const classes = memberStyles();
  const history = useHistory();
  const dispatch = useDispatch();
  const users = useSelector((state: RootState) => state.usersInfoList);
  const userSelector = useSelector((state: RootState) => state.user);

  const [membersData, setMembersData] = useState<any[]>([]);
  const [filteredMembersData, setFilteredMembersData] = useState<any[]>([]);
  const [searchMember, setSearchMember] = useState<string>("");

  const [memberJoinProposals, setMemberJoinProposals] = useState<any[]>([]);
  const [allProposals, setAllProposals] = useState<any[]>([]);

  const [isFounderView, setIsFounderView] = useState<boolean>(false);
  const [loadingMembers, setLoadingMembers] = useState<boolean>(false);
  const mobileMatches = useMediaQuery("(max-width:375px)");

  const [memberEject, setMemberEject] = useState<any>(undefined);
  const [showManageRole, setShowManageRole] = useState<boolean>(false);
  const [openInviteUserModal, setOpenInviteUserModal] = useState<boolean>(false);
  const [openMemberEjectModal, setOpenMemberEjectModal] = useState<boolean>(false);
  const [openTresurerMemberEjectModal, setOpenTresurerMemberEjectModal] = useState<boolean>(false);
  const [openTresurerMemberAppointModal, setOpenTresurerMemberAppointModal] = useState<boolean>(false);

  const payloadRef = useRef<any>({});
  const [openSignRequestModal, setOpenSignRequestModal] = useState<boolean>(false);
  const [signRequestModalDetail, setSignRequestModalDetail] = useState<any>(null);
  const [status, setStatus] = React.useState<any>("");

  const handleOpenManageRoles = () => {
    setShowManageRole(true);
  };
  const handleCloseManageRoles = () => {
    setShowManageRole(false);
  };

  const handleOpenInviteUserModal = () => {
    setOpenInviteUserModal(true);
  };

  const handleCloseInviteUserModal = () => {
    setOpenInviteUserModal(false);
  };

  const handleOpenMemberEjectModal = () => {
    setOpenMemberEjectModal(true);
  };

  const handleCloseMemberEjectModal = () => {
    setOpenMemberEjectModal(false);
  };

  const handleOpenTresurerMemberEjectModal = () => {
    setOpenTresurerMemberEjectModal(true);
  };

  const handleCloseTresurerMemberEjectModal = () => {
    setOpenTresurerMemberEjectModal(false);
  };


  const handleCloseTresurerMemberAppointModal = () => {
    setOpenTresurerMemberAppointModal(false);
  };

  const handleOpenSignatureModal = (vote: boolean, proposal) => {
    if (proposal?.ProposalId && proposal?.CommunityId) {
      let payload: IVoteProposal = {
        ProposalId: proposal.ProposalId,
        CommunityId: proposal.CommunityId,
        Decision: vote,
      };
      payloadRef.current = payload;
      setSignRequestModalDetail(buildJsxFromObject(payload));
      setOpenSignRequestModal(true);
    }
    else {
      handleSetStatus("Proposal or Community Id not found", "error", setStatus);
    }
  }

  const handleVote = async () => {
    try {
      const payload = payloadRef.current;
      if (Object.keys(payload).length) {
        const resp = await resolveJoiningRequest(payload, {});
        if (resp && resp.success) {
          handleSetStatus("Member request resolved", "success", setStatus);
          props.handleRefresh();
        }
        else {
          handleSetStatus("Failed to submit resolution", "error", setStatus);
        }
      }
    }
    catch (e) {
      handleSetStatus("Unexpected error: " + e, "error", setStatus);
    }
  };

  // set filter current member according to search value
  useEffect(() => {
    let filteredMembers = [] as any;
    if (membersData) {
      if (searchMember) {
        membersData.forEach(member => {
          if (member.name.toUpperCase().includes(searchMember.toUpperCase())) {
            filteredMembers.push(member);
          }
        });
      } else {
        filteredMembers = [...membersData];
      }
    }
    setFilteredMembersData(filteredMembers);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchMember, membersData]);

  useEffect(() => {
    setCurrentMemberData();
    loadData();
  }, [props.community]);

  // load all memember proposal data
  const loadData = async () => {
    try {
      if (props.community?.CommunityAddress) {
        let newAllProposals:any[] = [];
        const resp = await getTreasurerProposals(props.community?.CommunityAddress);
        if (resp && resp.success) {
          newAllProposals = [...resp.data];
        }
        let resp2 = await getMemberProposals(props.community?.CommunityAddress);
        if (resp2 && resp2.success) {
          newAllProposals = [...newAllProposals, ...resp2.data];
          let newMemberJoiningProposals: any[] = [];
          resp2.data.forEach(p => {
            if (p?.ProposalType == 'CommunityJoiningRequest') newMemberJoiningProposals.push(p);
          });
          setMemberJoinProposals(newMemberJoiningProposals);
        }
        setAllProposals(newAllProposals);
      }
    }
    catch (e) {
      console.log(e);
    }
  };

  const setCurrentMemberData = () => {
    let allUsers: any[] = [];
    let foundersAddresses = Object.keys(props.community?.FoundersMap ?? {}) || [];
    let treasurersAddresses = Object.keys(props.community?.TreasurersMap ?? {}) || [];
    let membersAddresses = Object.keys(props.community?.MembersMap ?? {}) || [];

    for (let founder of foundersAddresses) {
      const user = users.find(user => user.address == founder);
      if (user) {
        allUsers.push({
          ...user,
          type: ['Founder']
        })
      }
    }
    for (let treasurer of treasurersAddresses) {
      const user = users.find(user => user.address == treasurer);
      const indexIsAdded = allUsers.findIndex(user => user.address === treasurer);
      if (user && indexIsAdded === -1) {
        allUsers.push({
          ...user,
          type: ['Treasurer']
        })
      } else if (indexIsAdded !== -1 && allUsers[indexIsAdded] && allUsers[indexIsAdded].type) {
        allUsers[indexIsAdded]?.type?.push('Treasurer')
      }
    }
    for (let member of membersAddresses) {
      const user = users.find(user => user.address == member);
      const indexIsAdded = allUsers.findIndex(user => user.address === member);
      if (user && indexIsAdded === -1) {
        allUsers.push({
          ...user,
          type: ['Member']
        })
      } else if (indexIsAdded !== -1 && allUsers[indexIsAdded] && allUsers[indexIsAdded].type) {
        allUsers[indexIsAdded]?.type?.push('Member')
      }
    }
    setMembersData(allUsers);
    if (props.community?.FoundersMap && props.community?.FoundersMap[userSelector.address]) setIsFounderView(true);
    else setIsFounderView(false);
  }


  const formatRoles = roles => {
    let roleText = "";
    if (roles) {
      roles.forEach(role => {
        roleText += role + ' ';
      });
    }
    return roleText;
  };


  return (
    <div className={classes.communityMembers}>
      {!showManageRole ?
      // Main View
      (
        <>
          <div className={classes.flexMembersRow}>
            <div className={classes.searchSection}>
              <SearchWithCreate
                searchValue={searchMember}
                handleSearchChange={e => setSearchMember(e.target.value)}
                searchPlaceholder={"Search Members"}
              />
              {/* <img src={require("assets/icons/search_gray.svg")} alt="search" /> */}
            </div>
            {isFounderView ? (
              <div className={classes.manageRoleBtnSection}>
                <Box fontSize={14} fontWeight={800} color="#181818">
                  Joining request management
                </Box>
                <Box className={classes.requestMemberNum}>
                  {memberJoinProposals?.length ?? 0}
                </Box>
                <PrimaryButton size="medium" onClick={handleOpenManageRoles}>
                  Manage Roles
                </PrimaryButton>
              </div>
            ) : null}
          </div>
          {/* ------ Accepted Member Table ------ */}
          <div className={classes.membersTable}>
          <LoadingWrapper loading={loadingMembers}>
            <>
              {membersData && !mobileMatches ? (
                <TableContainer className={classes.table}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell width="15%">USER NAME</TableCell>
                        {props.community?.TokenSymbol && <TableCell align="center">TOKEN PCT</TableCell>}
                        <TableCell align="center">ROLE</TableCell>
                        <TableCell align="center">LEVEL</TableCell>
                        <TableCell align="center">ACTIVITY</TableCell>
                        {isFounderView ? <TableCell align="center">MANAGEMENT</TableCell> : null}
                        <TableCell align="center">JOINING DATE</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {filteredMembersData.length > 0 ? (
                        filteredMembersData.map((row, i) => (
                          <TableRow key={i}>
                            <TableCell width="15%">
                              <Box display="flex" flexDirection="row" alignItems="center">
                                <div
                                  className={classes.userImage}
                                  onClick={() => {
                                    history.push(`/profile/${row.id}`);
                                    dispatch(setSelectedUser(row.id));
                                  }}
                                  style={{
                                    backgroundImage: `url(${row.url})`,
                                  }}
                                />
                                <Box ml={1} fontSize={14} fontWeight={400}>
                                  {row.name}
                                </Box>
                              </Box>
                            </TableCell>
                            {props.community?.TokenSymbol &&
                              <TableCell align="center">
                                {`${((row.SupplyProportion ?? 0) * 100).toFixed(2)}%`}
                              </TableCell>
                            }
                            <TableCell align="center">{formatRoles(row.type)}</TableCell>
                            <TableCell align="center">{row.level}</TableCell>
                            <TableCell align="center">{row.Activity ?? "10"}</TableCell>
                            {isFounderView ? (
                              <TableCell align="center">
                                {
                                  !row?.type.find(type => type === 'Founder') ?
                                    <Box
                                      color="#F43E5F"
                                      fontSize={14}
                                      fontWeight={400}
                                      className={classes.ejectMember}
                                      onClick={() => {
                                        handleOpenTresurerMemberEjectModal();
                                        setMemberEject(row);
                                      }}
                                    >
                                      {"Eject Member ->"}
                                    </Box> : null
                                }
                              </TableCell>
                            ) : null}
                            <TableCell align="center">
                              {!row.type.includes('Founder') && <Moment format={"DD MMM YYYY"}>{row.JoinedTime ?? Date.now()}</Moment>}
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell align="center">No members</TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              ) : (
                <></>
              )}
              {mobileMatches && filteredMembersData && <></>}
            </>
          </LoadingWrapper>
        </div>
        </>
      )
      :
      // Manage Roles View
      (
        <>
          <SignatureRequestModal
              open={openSignRequestModal}
              address={userSelector.address}
              transactionFee="0.0000"
              detail={signRequestModalDetail}
              handleOk={handleVote}
              handleClose={() => setOpenSignRequestModal(false)}
          />
          <div className={classes.flexMembersRow}>
            <Box
              className={classes.backBtn}
              display="flex"
              flexDirection="row"
              alignItems="center"
              onClick={handleCloseManageRoles}
            >
              <BackIcon />
              <Box fontSize={22} fontWeight={400} ml={2}>
                Back
              </Box>
            </Box>
            <div className={classes.manageRoleBtnSection}>
              <Box fontSize={14} fontWeight={800} color="#181818">
                Joining request management
              </Box>
              <Box className={classes.requestMemberNum}>
                {memberJoinProposals?.length ?? 0}
              </Box>
              <PrimaryButton size="medium" onClick={handleOpenInviteUserModal}>
                Invite Users
              </PrimaryButton>
            </div>
          </div>
          <Box fontSize={30} fontWeight={400} mb={4}>
            Manage Roles
          </Box>
          <Grid container spacing={3}>
            {
              userSelector?.address && props?.community?.FoundersMap[userSelector.address] ?
                <Grid item md={6} sm={12}>
                  <Box
                    display="flex"
                    flexDirection="row"
                    alignItems="center"
                    justifyContent="space-between"
                    mb={2}
                  >
                    <Header4>Proposals</Header4>
                    <Box display="flex" flexDirection="row">
                      <IconSecondaryButton size="medium" onClick={() => { }}>
                        <HistoryIcon />
                      </IconSecondaryButton>
                      <IconPrimaryButton size="medium" onClick={handleOpenInviteUserModal}>
                        <PlusIcon />
                      </IconPrimaryButton>
                    </Box>
                  </Box>
                  {
                    allProposals.map((proposal, index) => {
                      if (proposal?.Result == 'pending' && proposal?.ProposalType != 'CommunityJoiningRequest')
                        return (
                          <Card>
                            <MembersProposal proposal={proposal} handleRefresh={props.handleRefresh}/>
                          </Card>
                        )
                      else return null;
                    })
                  }
                </Grid> :
                <Grid item md={6} sm={12}
                  style={{ paddingTop: '68px' }}>
                  <Box display="flex"
                    flexDirection="row"
                    alignItems="center"
                    justifyContent="space-between"
                    style={{
                      background: '#FFFFFF',
                      boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.12)',
                      borderRadius: '16px',
                      height: '80px',
                      padding: '24px'
                    }}
                    mb={2}>
                    <Box ml={1} fontSize={14} fontWeight={700} color="#181818">
                      User Name
                    </Box>
                    <Box ml={1} fontSize={14} fontWeight={700} color="#181818">
                      <div
                        style={{
                          backgroundImage: "none",
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
                    </Box>
                    <Box ml={1} fontSize={14} fontWeight={400} color="#FF79D1">
                      @user_name
                    </Box>
                    <Box ml={1} fontSize={14} fontWeight={400} color="#FF79D1">
                      Description
                    </Box>
                  </Box>
                </Grid>
            }

            <Grid item md={6} sm={12}>
              <Box
                display="flex"
                flexDirection="row"
                alignItems="center"
                justifyContent="space-between"
                mb={2}
              >
                <Header4></Header4>
                <Box display="flex" flexDirection="row">
                  <IconSecondaryButton size="medium" onClick={() => { }}>
                    <HistoryIcon />
                  </IconSecondaryButton>
                  <IconPrimaryButton size="medium" onClick={() => { }}>
                    <PlusIcon />
                  </IconPrimaryButton>
                </Box>
              </Box>
              <Card>
                <MembersVoting data={{ status: 1, title: "Voting Proposal Title" }} />
              </Card>
              <Card>
                <MembersVoting data={{ status: 2, title: "Ended Voting Title" }} />
              </Card>
              <Card>
                <MembersVoting data={{ status: 3, title: "Voting Proposal Title" }} />
              </Card>
            </Grid>
          </Grid>
          <Box fontSize={30} fontWeight={400} mt={8} mb={5} display="flex" alignItems="center">
            Joining requests
            <Box display="flex" flexDirection="row" ml={3}>
              <IconSecondaryButton size="medium" onClick={() => { }}>
                <HistoryIcon />
              </IconSecondaryButton>
            </Box>
          </Box>
          {/*  Joining Proposal Table */}
          <div className={classes.membersTable}>
            <LoadingWrapper loading={loadingMembers}>
              <>
                {memberJoinProposals && !mobileMatches && (
                  <TableContainer className={classes.table}>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell align="center">USER NAME</TableCell>
                          <TableCell align="center">ROLE</TableCell>
                          <TableCell align="center">REQUEST DATE</TableCell>
                          <TableCell align="center">MANAGE</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {memberJoinProposals.length > 0 ? (
                          memberJoinProposals.map((row, i) => {
                            const foundUser = users.find(u => u.address === row.Address);
                            return (
                              <TableRow key={i}>
                                <TableCell align="center">
                                  <Box
                                    display="flex"
                                    flexDirection="row"
                                    alignItems="center"
                                    justifyContent="center"
                                  >
                                    <div
                                      className={classes.userImage}
                                      onClick={() => {
                                        if (foundUser) {
                                          history.push(`/profile/${foundUser.id}`);
                                          dispatch(setSelectedUser(foundUser.id));
                                        }
                                      }}
                                      style={{
                                        backgroundImage: `url(${foundUser ? foundUser.imageUrl: ''})`,
                                      }}
                                    />
                                    <Box ml={1} fontSize={14} fontWeight={400}>
                                      {foundUser?.name}
                                    </Box>
                                  </Box>
                                </TableCell>
                                <TableCell align="center">Member</TableCell>
                                <TableCell align="center">
                                  {row.ProposalCreationTime ? (
                                    <Moment format={"DD MMM YYYY"}>{row.ProposalCreationTime}</Moment>
                                  ) : (
                                    "Unknown"
                                  )}
                                </TableCell>
                                <TableCell align="center">
                                  <Box display="flex" alignItems="center" justifyContent="center">
                                    <Box display="flex" alignItems="center" mr={2} className={classes.manageBtn}>
                                      <Box
                                        fontSize={14}
                                        fontWeight={400}
                                        color="#707582"
                                        mr={1}
                                        onClick={() => handleOpenSignatureModal(true, row)}
                                      >
                                        Accept
                                      </Box>
                                      <img src={checkIcon} alt={"success"} />
                                    </Box>
                                    <Box display="flex" alignItems="center" className={classes.manageBtn}>
                                      <Box
                                        fontSize={14}
                                        fontWeight={400}
                                        color="#707582"
                                        mr={1}
                                        onClick={() => handleOpenSignatureModal(false, row)}
                                      >
                                        Decline
                                      </Box>
                                      <img src={removeIcon} alt={"remove"} />
                                    </Box>
                                  </Box>
                                </TableCell>
                              </TableRow>
                            )
                          })
                        ) : (
                          <TableRow>
                            <TableCell align="center">No members</TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </TableContainer>
                )}
              </>
            </LoadingWrapper>
          </div>
        </>
      )}
      <InviteProposalModal
        open={openInviteUserModal}
        handleClose={handleCloseInviteUserModal}
        community={props.community}
        handleRefresh={props.handleRefresh}
      />
      <MemberEjectModal open={openMemberEjectModal} onClose={handleCloseMemberEjectModal} />
      <TresurerMemberEjectModal
        open={openTresurerMemberEjectModal}
        handleClose={handleCloseTresurerMemberEjectModal}
        handleRefresh={props.handleRefresh}
        community={props.community}
        member={memberEject}
      />
      <TresurerMemberAppointModal
        open={openTresurerMemberAppointModal}
        onClose={handleCloseTresurerMemberAppointModal}
      />
      {status ? <AlertMessage key={status.key} message={status.msg} variant={status.variant} /> : ""}
    </div>
  );
});

export default Members;
