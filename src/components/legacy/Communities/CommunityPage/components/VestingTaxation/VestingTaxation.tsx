import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { Grid } from "@material-ui/core";

import { RootState } from "store/reducers/Reducer";
import URL from "shared/functions/getURL";
import { formatNumber } from "shared/functions/commonFunctions";
import { LoadingWrapper } from "shared/ui-kit/Hocs";
import Box from "shared/ui-kit/Box";
import {
  Avatar,
  FontSize,
  Header4,
  HeaderBold3,
  HeaderBold4,
  IconPrimaryButton,
  IconSecondaryButton,
  PrimaryButton,
} from "shared/ui-kit";
import { Badge, Card, Text, useStyles, BackIcon, PlusIcon, HistoryIcon } from "./VestingTaxationStyle";
import AirdropProposal from "./components/AirdropProposal";
import AllocationProposal from "./components/AllocationProposal";
import ProposalHistory from "./modals/ProposalHistory";
import CreateProposal from "./modals/CreateProposal";
import { getAllocationProposals, getAirdropProposals } from "shared/services/API";
import { CustomTable, CustomTableCellInfo, CustomTableHeaderInfo } from "shared/ui-kit/Table";
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

export default function VestingTaxation(props) {
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
    },
    {
      headerName: "Allocation",
    },
    {
      headerName: "Issued",
      headerWidth: 300,
    },
    {
      headerName: "Vesting Date",
    },
  ];

  const [tableData, setTableData] = useState<Array<Array<CustomTableCellInfo>>>([]);
  useEffect(() => {
    const data: Array<Array<CustomTableCellInfo>> = allocationProposals.map(row => {
      const foundUser = users.find(u => u.address == row.To);
      return [
        {
          cell: (
            <Box display="flex" flexDirection="row" alignItems="center">
              <Avatar size="small" url={foundUser?.imageUrl ?? ""} />
              <Text ml={1} size={FontSize.M}>
                @{foundUser?.name ?? ""}
              </Text>
            </Box>
          ),
        },
        {
          cell: "Member",
        },
        {
          cell: formatNumber(row?.Amount ?? 0, props.community?.TokenSymbol ?? "", 4),
        },
        {
          cell: formatNumber(row?.Issued ?? 0, props.community?.TokenSymbol ?? "", 8),
        },
        {
          cell: row.ProposalEndedTime,
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
        communityAddress: props.community.CommunityAddress,
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
            let date =
              (allocationInfo.DateAllocation + props.community.VestingTime * 30 * 24 * 60 * 60) * 1000;
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
    const vestingPeriod = props.community.VestingTime;
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
      props.community.CommunityAddress &&
      props.community.TokenSymbol &&
      Object.keys(props.community.FoundersMap ?? {}).includes(user.address)
    ) {
      getAllocationProposals(props.community.CommunityAddress).then(resp => {
        if (resp && resp.success) {
          setAllocationProposals(resp.data);
        }
      });
      getAirdropProposals(props.community.CommunityAddress).then(resp => {
        if (resp && resp.success) {
          setAirdropProposals(resp.data);
        }
      });
    }
  };

  useEffect(() => {
    loadData();
  }, [props.community.CommunityAddress]);

  // get allocation data and set steaming
  useEffect(() => {
    if (props.community && props.community.CommunityAddress) {
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
  }, [props.community]);

  const calculateVestingMonth = () => {
    const creationDate = props.community.CreationDate ?? Math.floor(Date.now() / 1000);
    const vestingTime = props.community.VestingTime ?? Math.floor(Date.now() / 1000);
    const secDiff = vestingTime - creationDate;
    return Math.abs(Math.floor(secDiff / (3600 * 24 * 30)));
  };

  if (props.community)
    return (
      <Box>
        {props.community && props.community.TokenSymbol && props.community.TokenSymbol !== "" ? (
          <>
            {showManageAllocation ? (
              <>
                <Box
                  className={classes.back}
                  display="flex"
                  flexDirection="row"
                  alignItems="center"
                  mb={3}
                  onClick={handleCloseAllocation}
                >
                  <BackIcon />
                  <Text bold size={FontSize.H4} ml={1.5}>
                    Back
                  </Text>
                </Box>
                <HeaderBold3>Manage Token Distribution</HeaderBold3>
                <Box>
                  <Grid container spacing={4}>
                    <Grid item md={6} sm={12}>
                      <Box
                        display="flex"
                        flexDirection="row"
                        alignItems="center"
                        justifyContent="space-between"
                        mb={2}
                      >
                        <Header4>Airdrop Proposals</Header4>
                        <Box display="flex" flexDirection="row">
                          <IconSecondaryButton size="medium" onClick={handleOpenAirdropProposalHistoryModal}>
                            <HistoryIcon />
                          </IconSecondaryButton>
                          <IconPrimaryButton size="medium" onClick={handleOpenCreateAirdropProposalModal}>
                            <PlusIcon />
                          </IconPrimaryButton>
                        </Box>
                      </Box>
                      {airdropProposals.map(proposal => {
                        return (
                          <Card margin>
                            <AirdropProposal proposal={proposal} />
                          </Card>
                        );
                      })}
                    </Grid>
                    <Grid item md={6} sm={12}>
                      <Box
                        display="flex"
                        flexDirection="row"
                        alignItems="center"
                        justifyContent="space-between"
                        mb={2}
                      >
                        <Header4>Allocation Proposals</Header4>
                        <Box display="flex" flexDirection="row">
                          <IconSecondaryButton
                            size="medium"
                            onClick={handleOpenAllocationProposalHistoryModal}
                          >
                            <HistoryIcon />
                          </IconSecondaryButton>
                          <IconPrimaryButton size="medium" onClick={handleOpenCreateAllocationProposalModal}>
                            <PlusIcon />
                          </IconPrimaryButton>
                        </Box>
                      </Box>
                      {allocationProposals.map(proposal => {
                        return (
                          <Card margin>
                            <AllocationProposal proposal={proposal} />
                          </Card>
                        );
                      })}
                    </Grid>
                  </Grid>
                </Box>
              </>
            ) : (
              <>
                <HeaderBold4>Vesting and taxation</HeaderBold4>
                <Grid container spacing={2} className={classes.autoHeight}>
                  <Grid item xs={12} sm={6}>
                    {props.community.TokenSymbol && props.community.TokenSymbol !== "" ? (
                      <Card>
                        <Box display="flex" flexDirection="row" alignItems="center">
                          <img
                            src={`${URL()}/wallet/getTokenPhoto/${props.community.TokenSymbol}`}
                            width={56}
                            height={56}
                          />
                          <Box display="flex" flexDirection="column" ml={1.5}>
                            <Text mb={1}>Token</Text>
                            <Text bold size={FontSize.H4}>
                              {props.community.TokenSymbol}
                            </Text>
                          </Box>
                        </Box>
                        <Box display="flex" flexDirection="row" mt={3}>
                          <Box display="flex" flexDirection="column" minWidth="25%">
                            <Text mb={1}>Supply</Text>
                            <Text bold>
                              {props.community.SupplyReleased
                                ? `${
                                    props.community.SupplyReleased > 1000000
                                      ? (props.community.SupplyReleased / 1000000).toFixed(1)
                                      : props.community.SupplyReleased > 1000
                                      ? (props.community.SupplyReleased / 1000).toFixed(1)
                                      : props.community.SupplyReleased.toFixed(1)
                                  } ${
                                    props.community.SupplyReleased > 1000000
                                      ? "M"
                                      : props.community.SupplyReleased > 1000
                                      ? "K"
                                      : ""
                                  }`
                                : null}
                            </Text>
                          </Box>
                          <Box display="flex" flexDirection="column" minWidth="25%">
                            <Text mb={1}>Price</Text>
                            <Text bold>
                              {`${
                                props.community.Price !== undefined
                                  ? `${props.community.Price.toFixed(4)} ${props.community.FundingToken}`
                                  : "N/A"
                              }`}
                            </Text>
                          </Box>
                          <Box display="flex" flexDirection="column" minWidth="25%">
                            <Text mb={1}>MCAP</Text>
                            <Text bold>
                              {`${
                                props.community.MCAP !== undefined ? props.community.MCAP.toFixed(4) : "N/A"
                              } ${props.community.FundingToken}`}
                            </Text>
                          </Box>
                        </Box>
                        <Box display="flex" flexDirection="column" mt={3}>
                          <Text mb={1}>Taxation</Text>
                          <Text bold>{`${props.community.Taxation ? props.community.Taxation : "0"} %`}</Text>
                        </Box>
                      </Card>
                    ) : null}
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    {props.community.TokenSymbol && props.community.TokenSymbol !== "" ? (
                      <Card>
                        <Box
                          display="flex"
                          flexDirection="column"
                          justifyContent="space-between"
                          height="100%"
                        >
                          <Box display="flex" flexDirection="column">
                            <Text mb={1}>Vesting period</Text>
                            <Text bold size={FontSize.H4}>
                              {`${calculateVestingMonth()} month${calculateVestingMonth() > 1 ? "s" : ""}`}
                            </Text>
                          </Box>
                          <Box display="flex" flexDirection="column">
                            <Text mb={1}>Immediate Allocation Pct</Text>
                            <Text bold size={FontSize.H4}>
                              {`${
                                props.community.ImmediateAllocationPct
                                  ? (props.community.ImmediateAllocationPct * 100).toLocaleString()
                                  : "0"
                              }%`}
                            </Text>
                          </Box>
                          <Box display="flex" flexDirection="column">
                            <Text mb={1}>Vested Allocation Pct</Text>
                            <Text bold size={FontSize.H4}>
                              {`${
                                props.community.VestedAllocationPct
                                  ? (props.community.VestedAllocationPct * 100).toLocaleString()
                                  : "0"
                              }%`}
                            </Text>
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
                  mb={3}
                >
                  <HeaderBold4>Token Allocation</HeaderBold4>
                  {props.community.TokenSymbol &&
                  Object.keys(props.community.FoundersMap ?? {}).includes(user.address) ? (
                    <Box display="flex" flexDirection="row" alignItems="center">
                      <Text bold size={FontSize.M} mr={1}>
                        Proposals management
                      </Text>
                      <Badge>4</Badge>
                      <Box ml={2}>
                        <PrimaryButton size="medium" onClick={handleManageAllocation}>
                          Manage Token Allocation
                        </PrimaryButton>
                      </Box>
                    </Box>
                  ) : null}
                </Box>
                <LoadingWrapper loading={isDataLoading}>
                  <CustomTable
                    headers={tableHeaders}
                    rows={tableData}
                    variant={Variant.Secondary}
                    placeholderText="No data registered"
                  />
                </LoadingWrapper>
              </>
            )}
          </>
        ) : (
          <div
            style={{
              width: "100%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <p>Token not created</p>
          </div>
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
          community={props.community}
        />
      </Box>
    );
  else return null;
}
