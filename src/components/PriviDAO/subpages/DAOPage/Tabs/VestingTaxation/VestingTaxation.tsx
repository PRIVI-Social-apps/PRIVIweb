import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { Box, Grid } from "@material-ui/core";

import { RootState } from "store/reducers/Reducer";
import URL from "shared/functions/getURL";
import { formatNumber } from "shared/functions/commonFunctions";
import { LoadingWrapper } from "shared/ui-kit/Hocs";

import { Avatar } from "shared/ui-kit";
import AirdropProposal from "./components/AirdropProposal";
import AllocationProposal from "./components/AllocationProposal";
import ProposalHistory from "./modals/ProposalHistory";
import CreateProposal from "./modals/CreateProposal";
import { getAllocationProposals, getAirdropProposals } from "shared/services/API";
import { CustomTable, CustomTableCellInfo, CustomTableHeaderInfo } from "shared/ui-kit/Table";
import {
  BackIcon,
  Card,
  HistoryIcon,
  PlusIcon,
  TitleGrandLight,
  Text,
  Badge,
  useStyles,
} from "../../index.styles";
import { DAOButton, DAOButtonDark, DAOButtonFilled } from "components/PriviDAO/components/DAOButton";
import { Variant } from "shared/constants/const";

interface AllocationInfo {
  Name: string;
  ImageURL: string;
  UID: string;
  Role: string;
  Allocation: number;
  Issued: number;
  VestingDate: number;
  VestingDateForward: string;
}

export default function VestingTaxation({ community, isFounder }) {
  const classes = useStyles();

  const users = useSelector((state: RootState) => state.usersInfoList);
  const user = useSelector((state: RootState) => state.user);

  const [openProposalHistory, setOpenProposalHistory] = useState<boolean>(false);
  const [openCreateProposal, setOpenCreateProposal] = useState<boolean>(false);
  const [proposalType, setProposalType] = useState<string>("airdrop");
  const [airdropProposals, setAirdropProposals] = useState<any[]>([]);
  const [allocationProposals, setAllocationProposals] = useState<any[]>([]);

  const [showManageAllocation, setShowManageAllocation] = useState<boolean>(false);

  const allocationsRef = useRef<AllocationInfo[]>([]);
  const [allocationsData, setAllocationsData] = useState<AllocationInfo[]>([]);
  const [uidRoleMap, setUidRoleMap] = useState<any>({});
  const [isDataLoading, setIsDataLoading] = useState<boolean>(false);

  const tableHeaders: Array<CustomTableHeaderInfo> = [
    {
      headerName: "Name",
    },
    {
      headerName: "Role",
      headerAlign: "center",
    },
    {
      headerName: "Allocation",
      headerAlign: "center",
    },
    {
      headerName: "Issued",
      headerWidth: 300,
      headerAlign: "center",
    },
    {
      headerName: "Vesting Date",
      headerAlign: "center",
    },
  ];

  const [tableData, setTableData] = useState<Array<Array<CustomTableCellInfo>>>([]);
  useEffect(() => {
    const data: Array<Array<CustomTableCellInfo>> = allocationProposals.map(row => {
      const foundUser = users.find(u => u.address == row.To);
      return [
        {
          cell: (
            <Box display="flex" flexDirection="row" alignItems="center" color="white">
              <Avatar noBorder size="small" url={foundUser?.imageUrl ?? ""} />
              <Box ml={1} fontSize="16px" fontFamily="Agrandir GranLight">
                {foundUser?.name ?? ""}
              </Box>
            </Box>
          ),
        },
        {
          cell: "Member",
          cellAlign: "center",
        },
        {
          cell: formatNumber(row?.Amount ?? 0, community?.TokenSymbol ?? "", 4),
          cellAlign: "center",
        },
        {
          cell: formatNumber(row?.Issued ?? 0, community?.TokenSymbol ?? "", 8),
          cellAlign: "center",
        },
        {
          cell: row.ProposalEndedTime,
          cellAlign: "center",
        },
      ];
    });
    setTableData(data);
  }, [allocationProposals]);

  const handleOpenAirdropProposalHistoryModal = () => {
    setProposalType("airdrop");
    setOpenProposalHistory(true);
  };

  const handleOpenAllocationProposalHistoryModal = () => {
    setProposalType("allocation");
    setOpenProposalHistory(true);
  };

  const handleCloseProposalHistoryModal = () => {
    setOpenProposalHistory(false);
  };

  const handleOpenCreateAirdropProposalModal = () => {
    setProposalType("airdrop");
    setOpenCreateProposal(true);
  };

  const handleOpenCreateAllocationProposalModal = () => {
    setProposalType("allocation");
    setOpenCreateProposal(true);
  };

  const handleCloseCreateProposalModal = () => {
    setOpenCreateProposal(false);
  };

  const handleManageAllocation = () => {
    setShowManageAllocation(true);
  };

  const handleCloseAllocation = () => {
    setShowManageAllocation(false);
  };

  // get data from backend for allocation steaming
  const getAllocationData = () => {
    const config = {
      params: {
        communityAddress: community.CommunityAddress,
      },
    };
    setIsDataLoading(true);
    axios
      .get(`${URL()}/community/getCommunityAllocations`, config)
      .then(async response => {
        const resp = response.data;
        const newAllocationData: AllocationInfo[] = [];
        if (resp.success) {
          const data = resp.data;
          const sortedData = data.sort(
            (a, b) => new Date(b.DateAllocation).getTime() - new Date(a.DateAllocation).getTime()
          ); // for by allocated date
          sortedData.forEach(allocationInfo => {
            const uid = allocationInfo.UserAddress;
            let image: any = null;
            let name: string = "Unknown";
            const thisUser = users[users.findIndex(u => u.id === uid)];
            if (thisUser) {
              image = thisUser.imageURL;
              name = thisUser.name;
            }

            // Compute date string //
            let date = (allocationInfo.DateAllocation + community.VestingTime * 30 * 24 * 60 * 60) * 1000;
            let month =
              new Date(date).getMonth() < 10
                ? `0${new Date(date).getMonth()}`
                : `${new Date(date).getMonth()}`;
            let day =
              new Date(date).getDate() < 10 ? `0${new Date(date).getDate()}` : `${new Date(date).getDate()}`;
            let year = `${new Date(date).getFullYear()}`;
            let dateString = day + "." + month + "." + year;

            console.log(uidRoleMap);
            newAllocationData.push({
              Name: name,
              ImageURL: image,
              UID: uid,
              Role: uidRoleMap[uid],
              Allocation: allocationInfo.Amount,
              Issued: allocationInfo.Amount,
              VestingDate: allocationInfo.DateAllocation,
              VestingDateForward: dateString,
            });
          });
          if (JSON.stringify(allocationsRef.current) !== JSON.stringify(newAllocationData))
            allocationsRef.current = newAllocationData;
        }
        setIsDataLoading(false);
      })
      .catch(() => {
        setIsDataLoading(false);
      });
  };

  // calculate current allocation during steaming
  const refreshAllocationData = () => {
    const vestingPeriod = community.VestingTime;
    if (vestingPeriod) {
      const newAllocationsData: AllocationInfo[] = [];
      const vestingPeriodInSec = vestingPeriod * 30 * 24 * 60 * 60;
      const currTimestamp = Date.now();
      const currTimestampInSec = Math.floor(currTimestamp / 1000);
      allocationsRef.current.forEach(allocationData => {
        const newIssued = Math.min(1, (currTimestampInSec - allocationData.VestingDate) / vestingPeriodInSec);
        const newAllocationData: AllocationInfo = { ...allocationData };
        newAllocationData.Issued = newIssued;
        newAllocationsData.push(newAllocationData);
      });
      setAllocationsData(newAllocationsData);
    }
  };

  const loadData = () => {
    // get airdrop and allocation proposal data
    if (
      community.CommunityAddress &&
      community.TokenSymbol &&
      Object.keys(community.FoundersMap ?? {}).includes(user.address)
    ) {
      getAllocationProposals(community.CommunityAddress).then(resp => {
        if (resp && resp.success) {
          setAllocationProposals(resp.data);
        }
      });
      getAirdropProposals(community.CommunityAddress).then(resp => {
        if (resp && resp.success) {
          setAirdropProposals(resp.data);
        }
      });
    }
  };

  useEffect(() => {
    loadData();
  }, [community.CommunityAddress]);

  // get allocation data and set steaming
  useEffect(() => {
    if (community && community.CommunityAddress) {
      getAllocationData();
      const intervalId1 = setInterval(() => {
        getAllocationData();
      }, 5 * 60 * 1000);
      const invervalId2 = setInterval(() => {
        refreshAllocationData();
      }, 1000);
      return () => {
        clearInterval(intervalId1);
        clearInterval(invervalId2);
      };
    }
  }, [community]);

  const calculateVestingMonth = () => {
    const creationDate = community.CreationDate ?? Math.floor(Date.now() / 1000);
    const vestingTime = community.VestingTime ?? Math.floor(Date.now() / 1000);
    const secDiff = vestingTime - creationDate;
    return Math.abs(Math.floor(secDiff / (3600 * 24 * 30)));
  };

  if (community)
    return (
      <Box>
        {community && community.TokenSymbol && community.TokenSymbol !== "" ? (
          <>
            {showManageAllocation ? (
              <>
                <Box
                  className={classes.back}
                  display="flex"
                  flexDirection="row"
                  alignItems="center"
                  mb={5}
                  onClick={handleCloseAllocation}
                >
                  <BackIcon />
                  <Box fontSize="22px" ml={2} color="white">
                    Back
                  </Box>
                </Box>
                <TitleGrandLight fontSize="30px" disableUppercase bold>
                  Manage Token Distribution
                </TitleGrandLight>
                <Box mt={3}>
                  <Grid container spacing={4}>
                    <Grid item md={6} sm={12}>
                      <Box
                        display="flex"
                        flexDirection="row"
                        alignItems="center"
                        justifyContent="space-between"
                        mb={5}
                      >
                        <TitleGrandLight fontSize="22px">Airdrop Proposals</TitleGrandLight>
                        <Box display="flex" flexDirection="row">
                          <DAOButtonDark icon onClick={handleOpenAirdropProposalHistoryModal}>
                            <HistoryIcon />
                          </DAOButtonDark>
                          <DAOButtonFilled icon onClick={handleOpenCreateAirdropProposalModal}>
                            <PlusIcon />
                          </DAOButtonFilled>
                        </Box>
                      </Box>
                      <Box width="100%">
                        {airdropProposals.map(proposal => {
                          return (
                            <Card>
                              <AirdropProposal proposal={proposal} />
                            </Card>
                          );
                        })}
                      </Box>
                    </Grid>
                    <Grid item md={6} sm={12}>
                      <Box
                        display="flex"
                        flexDirection="row"
                        alignItems="center"
                        justifyContent="space-between"
                        mb={5}
                      >
                        <TitleGrandLight fontSize="22px">Allocation Proposals</TitleGrandLight>
                        <Box display="flex" flexDirection="row">
                          <DAOButtonDark icon onClick={handleOpenAllocationProposalHistoryModal}>
                            <HistoryIcon />
                          </DAOButtonDark>
                          <DAOButtonFilled icon onClick={handleOpenCreateAllocationProposalModal}>
                            <PlusIcon />
                          </DAOButtonFilled>
                        </Box>
                      </Box>
                      <Box width="100%">
                        {allocationProposals.map(proposal => {
                          return (
                            <Card>
                              <AllocationProposal proposal={proposal} />
                            </Card>
                          );
                        })}
                      </Box>
                    </Grid>
                  </Grid>
                </Box>
              </>
            ) : (
              <>
                <Box display="flex" alignItems="center" justifyContent="space-between" width="100%" mb={4}>
                  <TitleGrandLight disableUppercase bold fontSize="30px">
                    Vesting and taxation
                  </TitleGrandLight>

                  {isFounder && (
                    <Box display="flex" flexDirection="row" alignItems="center" fontSize="14px">
                      <Badge>4</Badge>
                      <Text>Proposals management</Text>
                      <Box ml={2}>
                        <DAOButton onClick={handleManageAllocation}>Manage Token Allocation</DAOButton>
                      </Box>
                    </Box>
                  )}
                </Box>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    {community.TokenSymbol && community.TokenSymbol !== "" ? (
                      <Card>
                        <Box display="flex" flexDirection="column">
                          <Box display="flex" flexDirection="row" alignItems="center">
                            <div
                              style={{
                                width: "48px",
                                height: "48px",
                                borderRadius: "50%",
                                background: "linear-gradient(151.11deg, #4CAA30 6.74%, #59C4EB 90.8%)",
                                backgroundImage:
                                  community.TokenSymbol !== ""
                                    ? `url(${URL()}/wallet/getTokenPhoto/${community.TokenSymbol})`
                                    : "none",
                                backgroundRepeat: "no-repeat",
                                backgroundSize: "cover",
                                backgroundPosition: "center",
                              }}
                            />
                            <Box display="flex" flexDirection="column" ml={1}>
                              <Text mb={0.5}>Token</Text>
                              <Box fontFamily="Agrandir GrandLight">{community.TokenSymbol}</Box>
                            </Box>
                          </Box>
                          <Box display="flex" flexDirection="row" mt={3} flexWrap="wrap">
                            <Box display="flex" flexDirection="column" minWidth="25%" mr={6}>
                              <Text mb={1}>Supply</Text>
                              <Box color="#D810D6">
                                {community.SupplyReleased
                                  ? `${
                                      community.SupplyReleased > 1000000
                                        ? (community.SupplyReleased / 1000000).toFixed(1)
                                        : community.SupplyReleased > 1000
                                        ? (community.SupplyReleased / 1000).toFixed(1)
                                        : community.SupplyReleased.toFixed(1)
                                    } ${
                                      community.SupplyReleased > 1000000
                                        ? "M"
                                        : community.SupplyReleased > 1000
                                        ? "K"
                                        : ""
                                    }`
                                  : null}
                              </Box>
                            </Box>
                            <Box display="flex" flexDirection="column" minWidth="25%" mr={6}>
                              <Text mb={1}>Price</Text>
                              <Box color="#D810D6">
                                {`${
                                  community.Price !== undefined
                                    ? `${community.Price.toFixed(4)} ${community.FundingToken}`
                                    : "N/A"
                                }`}
                              </Box>
                            </Box>
                            <Box display="flex" flexDirection="column" minWidth="25%" mr={6}>
                              <Text mb={1}>MCAP</Text>
                              <Box color="#D810D6">
                                {`${community.MCAP !== undefined ? community.MCAP.toFixed(4) : "N/A"} ${
                                  community.FundingToken
                                }`}
                              </Box>
                            </Box>
                            <Box display="flex" flexDirection="column" mt={3} minWidth="25%">
                              <Text mb={1}>Taxation</Text>
                              <Box color="#D810D6">{`${
                                community.Taxation ? community.Taxation : "0"
                              } %`}</Box>
                            </Box>
                          </Box>
                        </Box>
                      </Card>
                    ) : null}
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    {community.TokenSymbol && community.TokenSymbol !== "" ? (
                      <Card>
                        <Box mb={3}>
                          <Text mb={1}>Vesting period</Text>
                          <Box color="#D810D6">
                            {`${calculateVestingMonth()} month${calculateVestingMonth() > 1 ? "s" : ""}`}
                          </Box>
                        </Box>
                        <Box mb={3}>
                          <Text mb={1}>Immediate Allocation Pct</Text>
                          <Box color="#D810D6">
                            {`${
                              community.ImmediateAllocationPct
                                ? (community.ImmediateAllocationPct * 100).toLocaleString()
                                : "0"
                            }%`}
                          </Box>
                        </Box>
                        <Box>
                          <Text mb={1}>Vested Allocation Pct</Text>
                          <Box color="#D810D6">
                            {`${
                              community.VestedAllocationPct
                                ? (community.VestedAllocationPct * 100).toLocaleString()
                                : "0"
                            }%`}
                          </Box>
                        </Box>
                      </Card>
                    ) : null}
                  </Grid>
                </Grid>
                <Box
                  display="flex"
                  flexDirection="row"
                  alignItems="center"
                  justifyContent="space-between"
                  mb={5}
                  mt={10}
                >
                  <TitleGrandLight fontSize="30px" bold disableUppercase>
                    Token Allocation
                  </TitleGrandLight>
                </Box>
                <LoadingWrapper loading={isDataLoading}>
                  <CustomTable
                    headers={tableHeaders}
                    rows={tableData}
                    variant={Variant.Secondary}
                    theme="dark"
                    placeholderText="No data registered"
                  />
                </LoadingWrapper>
              </>
            )}
          </>
        ) : (
          <TitleGrandLight fontSize="14px">Token not created</TitleGrandLight>
        )}

        <ProposalHistory
          type={proposalType}
          open={openProposalHistory}
          handleClose={handleCloseProposalHistoryModal}
          airdropList={airdropProposals}
          allocationList={allocationProposals}
        />
        <CreateProposal
          type={proposalType}
          open={openCreateProposal}
          handleClose={handleCloseCreateProposalModal}
          handleRefresh={loadData}
          community={community}
        />
      </Box>
    );
  else return null;
}
