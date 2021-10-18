import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import Moment from "react-moment";

import { Grid, useMediaQuery } from "@material-ui/core";

import { memberStyles } from "./Members.styles";
import { RootState } from "store/reducers/Reducer";
import { setSelectedUser } from "store/actions/SelectedUser";
import MembersVoting from "./components/MembersVoting";
import MembersProposal from "./components/MembersProposal";
import InviteProposalModal from "./modals/InviteProposalModal/InviteProposalModal";
import MemberEjectModal from "./modals/MemberEjectModal/MemberEjectModal";
import TresurerMemberEjectModal from "./modals/TresurerMemberEjectModal/TresurerMemberEjectModal";
import TresurerMemberAppointModal from "./modals/TresurerMemberAppointModal/TresurerMemberAppointModal";
import NewProposalModal from "./modals/NewProposalModal/NewProposalModal";

import { LoadingWrapper } from "shared/ui-kit/Hocs";
import { SearchWithCreate } from "shared/ui-kit/SearchWithCreate";
import { Card, TitleGrandLight, BackIcon, HistoryIcon, PlusIcon } from "../../index.styles";
import { DAOButton, DAOButtonFilled, DAOButtonDark } from "components/PriviDAO/components/DAOButton";
import { Color, SignatureRequestModal } from "shared/ui-kit";
import { CustomTable, CustomTableCellInfo, CustomTableHeaderInfo } from "shared/ui-kit/Table";
import Box from "shared/ui-kit/Box";
import {
  getMemberProposals,
  getTreasurerProposals,
  resolveJoiningRequest,
  IVoteProposal,
} from "shared/services/API";
import { buildJsxFromObject, handleSetStatus } from "shared/functions/commonFunctions";

const removeIcon = require("assets/icons/trash-red.svg");
const checkIcon = require("assets/icons/check_green.svg");

const Members = React.memo((props: any) => {
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
  const [openNewProposalModal, setOpenNewProposalModal] = useState<boolean>(false);

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

  const handleOpenTresurerMemberAppointModal = () => {
    setOpenTresurerMemberAppointModal(true);
  };

  const handleCloseTresurerMemberAppointModal = () => {
    setOpenTresurerMemberAppointModal(false);
  };

  const handleOpenNewProposalModal = () => {
    setOpenNewProposalModal(true);
  };

  const handleCloseNewProposalModal = () => {
    setOpenNewProposalModal(false);
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
    } else {
      handleSetStatus("Proposal or Community Id not found", "error", setStatus);
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

  const handleVote = async () => {
    try {
      const payload = payloadRef.current;
      if (Object.keys(payload).length) {
        const resp = await resolveJoiningRequest(payload, {});
        if (resp && resp.success) {
          handleSetStatus("Member request resolved", "success", setStatus);
          props.handleRefresh();
        } else {
          handleSetStatus("Failed to submit resolution", "error", setStatus);
        }
      }
    } catch (e) {
      handleSetStatus("Unexpected error: " + e, "error", setStatus);
    }
  };

  // load all memember proposal data
  const loadData = async () => {
    try {
      if (props.community?.CommunityAddress) {
        let newAllProposals: any[] = [];
        const resp = await getTreasurerProposals(props.community?.CommunityAddress);
        if (resp && resp.success) {
          newAllProposals = [...resp.data];
        }
        let resp2 = await getMemberProposals(props.community?.CommunityAddress);
        if (resp2 && resp2.success) {
          newAllProposals = [...newAllProposals, ...resp2.data];
          let newMemberJoiningProposals: any[] = [];
          resp2.data.forEach(p => {
            if (p?.ProposalType == "CommunityJoiningRequest") newMemberJoiningProposals.push(p);
          });
          setMemberJoinProposals(newMemberJoiningProposals);
        }
        setAllProposals(newAllProposals);
      }
    } catch (e) {
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
          type: ["Founder"],
        });
      }
    }
    for (let treasurer of treasurersAddresses) {
      const user = users.find(user => user.address == treasurer);
      const indexIsAdded = allUsers.findIndex(user => user.address === treasurer);
      if (user && indexIsAdded === -1) {
        allUsers.push({
          ...user,
          type: ["Treasurer"],
        });
      } else if (indexIsAdded !== -1 && allUsers[indexIsAdded] && allUsers[indexIsAdded].type) {
        allUsers[indexIsAdded]?.type?.push("Treasurer");
      }
    }
    for (let member of membersAddresses) {
      const user = users.find(user => user.address == member);
      const indexIsAdded = allUsers.findIndex(user => user.address === member);
      if (user && indexIsAdded === -1) {
        allUsers.push({
          ...user,
          type: ["Member"],
        });
      } else if (indexIsAdded !== -1 && allUsers[indexIsAdded] && allUsers[indexIsAdded].type) {
        allUsers[indexIsAdded]?.type?.push("Member");
      }
    }
    setMembersData(allUsers);
    if (props.community?.FoundersMap && props.community?.FoundersMap[userSelector.address])
      setIsFounderView(true);
    else setIsFounderView(false);
  };

  const formatRoles = roles => {
    let roleText = "";
    if (roles) {
      roles.forEach(role => {
        roleText += role + " ";
      });
    }
    return roleText;
  };

  const [tableHeaders, setTableHeaders] = useState<Array<CustomTableHeaderInfo>>([]);

  useEffect(() => {
    const headers: Array<CustomTableHeaderInfo> = [
      {
        headerName: "USER NAME",
        headerAlign: "center",
      },
    ];
    if (props.community?.TokenSymbol) {
      headers.push({
        headerName: "TOKEN PCT",
        headerAlign: "center",
      });
    }
    headers.push({
      headerName: "ROLE",
      headerAlign: "center",
    });
    headers.push({
      headerName: "LEVEL",
      headerAlign: "center",
    });
    headers.push({
      headerName: "ACTIVITY",
      headerAlign: "center",
    });
    if (isFounderView)
      headers.push({
        headerName: "MANAGEMENT",
        headerAlign: "center",
      });
    headers.push({
      headerName: "JOINING DATE",
      headerAlign: "center",
    });
    setTableHeaders(headers);
  }, [props.community, isFounderView]);

  const [tableData, setTableData] = useState<Array<Array<CustomTableCellInfo>>>([]);

  useEffect(() => {
    let data: Array<Array<CustomTableCellInfo>> | any[] = [];
    if (filteredMembersData && filteredMembersData.length > 0) {
      data = filteredMembersData?.map(row => {
        const oneRow: Array<CustomTableCellInfo> = [
          {
            cell: (
              <Box
                display="flex"
                flexDirection="row"
                alignItems="center"
                justifyContent="center"
                fontFamily="Agrandir GrandLight"
              >
                <div
                  className={classes.userImage}
                  onClick={() => {
                    history.push(`/profile/${row.UserId}`);
                    dispatch(setSelectedUser(row.UserId));
                  }}
                  style={{
                    backgroundImage: `url(${row.ImageUrl})`,
                  }}
                />
                <Box ml={1} fontSize={14} fontWeight={400} fontFamily="Agrandirt GrandLight">
                  {row.Name}
                </Box>
              </Box>
            ),
            cellAlign: "center",
          },
        ];

        if (props.community?.TokenSymbol)
          oneRow.push({
            cell: `${((row.SupplyProportion ?? 0) * 100).toFixed(2)}%`,
            cellAlign: "center",
          });
        oneRow.push({
          cell: formatRoles(row.type),
          cellAlign: "center",
        }),
          oneRow.push({
            cell: row.level,
            cellAlign: "center",
          });
        oneRow.push({
          cell: row.Activity ?? "10",
          cellAlign: "center",
        });
        if (isFounderView) {
          oneRow.push({
            cell: !row?.type.find(type => type === "Founder") ? (
              <Box
                color="#F43E5F"
                display="flex"
                alignItems="center"
                fontSize={14}
                fontWeight={400}
                className={classes.ejectMember}
                onClick={() => {
                  handleOpenTresurerMemberEjectModal();
                  setMemberEject(row);
                }}
              >
                {"Eject Member "}
                <img
                  src={require("assets/icons/arrow_red.png")}
                  alt=""
                  style={{ marginLeft: "7px", width: "10px" }}
                />
              </Box>
            ) : null,
            cellAlign: "center",
          });
        }
        oneRow.push({
          cell: !row.type.includes("Founder") && (
            <Moment format={"DD MMM YYYY"}>{row.JoinedTime ?? Date.now()}</Moment>
          ),
          cellAlign: "center",
        });
      });
    }

    setTableData(data);
  }, [filteredMembersData, isFounderView, props.community]);

  const [membersTableHeaders, setMembersTableHeaders] = useState<Array<CustomTableHeaderInfo>>([]);
  useEffect(() => {
    const headers: Array<CustomTableHeaderInfo> = [
      {
        headerName: "USER NAME",
        headerAlign: "center",
      },
    ];
    headers.push({ headerName: "ROLE", headerAlign: "center" });
    headers.push({ headerName: "REQUEST DATE", headerAlign: "center" });
    headers.push({ headerName: "MANAGE", headerAlign: "center" });
    setMembersTableHeaders(headers);
  }, [props.community, isFounderView]);

  const [membersTableData, setMembersTableData] = useState<Array<Array<CustomTableCellInfo>>>([]);

  useEffect(() => {
    let data: Array<Array<CustomTableCellInfo>> | any[] = [];
    if (memberJoinProposals && memberJoinProposals.length) {
      data = memberJoinProposals?.map(row => {
        const oneRow: Array<CustomTableCellInfo> = [
          {
            cell: (
              <Box
                display="flex"
                flexDirection="row"
                alignItems="center"
                justifyContent="center"
                fontFamily="Agrandir GrandLight"
              >
                <div
                  className={classes.userImage}
                  onClick={() => {
                    history.push(`/profile/${row.UserId}`);
                    dispatch(setSelectedUser(row.UserId));
                  }}
                  style={{
                    backgroundImage: `url(${row.ImageUrl})`,
                  }}
                />
                <Box ml={1} fontSize={14} fontWeight={400} fontFamily="Agrandirt GrandLight">
                  {row.Name}
                </Box>
              </Box>
            ),
            cellAlign: "center",
          },
        ];
        oneRow.push({
          cell: formatRoles(row.Role),
          cellAlign: "center",
        });
        oneRow.push({
          cell: row.ProposalCreationTime ? (
            <Moment format={"DD MMM YYYY"}>{row.ProposalCreationTime}</Moment>
          ) : (
            "Unknown"
          ),
          cellAlign: "center",
        });
        oneRow.push({
          cell: (
            <Box display="flex" alignItems="center" justifyContent="center">
              <Box display="flex" alignItems="center" mr={2} className={classes.manageBtn}>
                <Box
                  fontSize={14}
                  fontWeight={400}
                  color="#707582"
                  mr={1}
                  onClick={handleOpenTresurerMemberAppointModal}
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
                  onClick={handleOpenTresurerMemberEjectModal}
                >
                  Decline
                </Box>
                <img src={removeIcon} alt={"remove"} />
              </Box>
            </Box>
          ),
          cellAlign: "center",
        });
      });
    }

    setMembersTableData(data);
  }, [memberJoinProposals, props.community, isFounderView]);

  return (
    <div className={classes.communityMembers}>
      {!showManageRole ? (
        // Main View
        <>
          <div className={classes.flexMembersRow}>
            <div className={classes.searchSection}>
              <SearchWithCreate
                searchValue={searchMember}
                handleSearchChange={e => setSearchMember(e.target.value)}
                searchPlaceholder={"Search Members"}
                theme="dark"
              />
            </div>
            {isFounderView ? (
              <div className={classes.manageRoleBtnSection}>
                <Box className={classes.requestMemberNum}>{memberJoinProposals?.length ?? 0}</Box>
                <Box fontSize={14} fontWeight={800} color="white">
                  Joining request management
                </Box>
                <DAOButton onClick={handleOpenManageRoles}>MANAGE ROLES</DAOButton>
              </div>
            ) : null}
          </div>
          {/* ------ Accepted Member Table ------ */}
          <div className={classes.membersTable}>
            <LoadingWrapper loading={loadingMembers} theme="dark">
              {membersData && (
                <CustomTable
                  headers={tableHeaders}
                  rows={tableData}
                  placeholderText="No members"
                  theme="dark"
                />
              )}
              {mobileMatches && filteredMembersData && <></>}
            </LoadingWrapper>
          </div>
        </>
      ) : (
        // Manage Roles View
        <>
          <div className={classes.flexMembersRow}>
            <Box
              className={classes.backBtn}
              display="flex"
              flexDirection="row"
              alignItems="center"
              onClick={handleCloseManageRoles}
              color="white"
            >
              <BackIcon />
              <Box fontSize={22} fontWeight={400} ml={2}>
                Back
              </Box>
            </Box>
            <div className={classes.manageRoleBtnSection}>
              <Box className={classes.requestMemberNum}>{memberJoinProposals?.length ?? 0}</Box>
              <Box fontSize={14} fontWeight={800} color="white">
                Joining request management
              </Box>
              <DAOButton onClick={handleOpenInviteUserModal}>Invite users</DAOButton>
            </div>
          </div>
          <TitleGrandLight disableUppercase fontSize={30} bold mb={40}>
            Manage Roles
          </TitleGrandLight>
          <Grid container spacing={3}>
            {userSelector?.address && props?.community?.FoundersMap[userSelector.address] ? (
              <Grid item md={6} sm={12}>
                <Box
                  display="flex"
                  flexDirection="row"
                  alignItems="center"
                  justifyContent="space-between"
                  mb={2}
                >
                  <TitleGrandLight fontSize={22}>Proposals</TitleGrandLight>
                  <Box display="flex" flexDirection="row">
                    <DAOButtonDark icon onClick={() => {}}>
                      <HistoryIcon color={Color.White} />
                    </DAOButtonDark>
                    <DAOButtonFilled icon onClick={handleOpenNewProposalModal}>
                      <PlusIcon />
                    </DAOButtonFilled>
                  </Box>
                </Box>

                {allProposals?.map((proposal, index) => {
                  return (
                    <Card>
                      <MembersProposal data={proposal} />
                    </Card>
                  );
                })}
              </Grid>
            ) : (
              <Grid item md={6} sm={12} style={{ paddingTop: "68px" }}>
                <Box
                  display="flex"
                  flexDirection="row"
                  alignItems="center"
                  justifyContent="space-between"
                  style={{
                    background: "#FFFFFF",
                    boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.12)",
                    borderRadius: "16px",
                    height: "80px",
                    padding: "24px",
                  }}
                  mb={2}
                >
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
            )}

            <Grid item md={6} sm={12}>
              <Box
                display="flex"
                flexDirection="row"
                alignItems="center"
                justifyContent="space-between"
                mb={2}
              >
                <TitleGrandLight fontSize={22}>Voting</TitleGrandLight>
                <Box display="flex" flexDirection="row">
                  <DAOButtonDark icon onClick={() => {}}>
                    <HistoryIcon color={Color.White} />
                  </DAOButtonDark>
                  <DAOButtonFilled icon onClick={() => {}}>
                    <PlusIcon />
                  </DAOButtonFilled>
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
          <Box fontSize={30} fontWeight={400} mt={8} mb={5} display="flex" alignItems="center" color="white">
            <TitleGrandLight disableUppercase bold>
              Joining requests
            </TitleGrandLight>
            <Box display="flex" flexDirection="row" ml={3}>
              <DAOButtonDark icon onClick={() => {}}>
                <HistoryIcon color={Color.White} />
              </DAOButtonDark>
            </Box>
          </Box>
          {memberJoinProposals && (
            <CustomTable
              headers={membersTableHeaders}
              rows={membersTableData}
              placeholderText="No members"
              theme="dark"
            />
          )}
        </>
      )}
      <SignatureRequestModal
        theme="dark"
        open={openSignRequestModal}
        address={userSelector.address}
        transactionFee="0.0000"
        detail={signRequestModalDetail}
        handleOk={handleVote}
        handleClose={() => setOpenSignRequestModal(false)}
      />
      <InviteProposalModal
        open={openInviteUserModal}
        handleClose={handleCloseInviteUserModal}
        community={props.community}
        handleRefresh={loadData}
      />
      <MemberEjectModal open={openMemberEjectModal} onClose={handleCloseMemberEjectModal} />
      <TresurerMemberEjectModal
        handleRefresh={props.handleRefresh}
        community={props.community}
        member={memberEject}
        open={openTresurerMemberEjectModal}
        onClose={handleCloseTresurerMemberEjectModal}
      />
      <TresurerMemberAppointModal
        open={openTresurerMemberAppointModal}
        onClose={handleCloseTresurerMemberAppointModal}
      />
      <NewProposalModal open={openNewProposalModal} onClose={handleCloseNewProposalModal} />
    </div>
  );
});

export default Members;
