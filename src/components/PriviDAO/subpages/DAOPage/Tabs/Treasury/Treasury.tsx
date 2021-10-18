import React, { useEffect, useRef, useState } from "react";
import Moment from "react-moment";
import axios from "axios";

import { Grid } from "@material-ui/core";

import { TitleGrandLight, Card, Text, HistoryIcon, PlusIcon, useStyles } from "../../index.styles";
import TreasuryProposal from "./components/TransferProposal";
import TreasuryVoting from "./components/TreasuryVoting";
import TreasuryToken from "./components/TreasuryToken";
import ProposalHistoryModal from "./modals/ProposalHistoryModal";
import CreateTransferProposalModal from "./modals/CreateTransferProposalModal";
import VotingHistoryModal from "./modals/VotingHistoryModal";
import AlertMessage from "shared/ui-kit/Alert/AlertMessage";
import { Avatar, Color, StyledDivider } from "shared/ui-kit";
import { CustomTable, CustomTableCellInfo, CustomTableHeaderInfo } from "shared/ui-kit/Table";
import CreateVotingModal from "./modals/CreateVotingModal";
import { LoadingWrapper } from "shared/ui-kit/Hocs";
import URL from "shared/functions/getURL";
import { useTypedSelector } from "store/reducers/Reducer";
import { getTransferProposals } from "shared/services/API";
import { formatNumber } from "shared/functions/commonFunctions";
import { getBlockchainNode2URL } from "shared/functions/getBlockchainURLs";
import { DAOButton, DAOButtonDark, DAOButtonFilled } from "components/PriviDAO/components/DAOButton";
import Box from 'shared/ui-kit/Box';

type ViewMode = "user" | "cofounder";

const Treasury = ({ community, treasuryVoting, handleRefresh, trigger }) => {
  const classes = useStyles();

  const user = useTypedSelector(state => state.user);
  const users = useTypedSelector(state => state.usersInfoList);

  const [tokenTransactions, setTokenTransactions] = useState<any[]>([]);
  const [votings, setVotings] = useState<any[]>([]);
  const [createPollModal, setCreatePollModal] = useState<boolean>(false);

  const [isDataLoading, setIsDataLoading] = useState<boolean>(false);

  const [openProposalHistory, setOpenProposalHistory] = useState<boolean>(false);
  const [openCreateProposal, setOpenCreateProposal] = useState<ViewMode | null>();
  const [openVotingHistory, setOpenVotingHistory] = useState<boolean>(false);
  const [isUserView, setIsUserView] = useState<boolean>(true);

  const [transferProposalList, setTransferProposalList] = useState<any[]>([]);
  const [estimatedBalance, setEstimatedBalance] = useState<number>(0); // sum of the balance of the community converted in usd

  const [status, setStatus] = useState<any>("");

  const tokenTypeMap = useRef({}); // ref to tokenTypeMap given that setInterval cant get current state of useState hook
  const communityBalancesRef = useRef({});

  const [communityBalances, setCommunityBalances] = useState<any[]>([]);

  const handleOpenCreatePollModal = () => {
    setCreatePollModal(true);
  };

  const handleCloseCreatePollModal = () => {
    setCreatePollModal(false);
  };

  const handleOpenProposalHistoryModal = () => {
    setOpenProposalHistory(true);
  };

  const handleCloseProposalHistoryModal = () => {
    setOpenProposalHistory(false);
  };

  const handleOpenCreateProposalModal = (type: ViewMode) => () => {
    setOpenCreateProposal(type);
  };

  const handleCloseCreateProposalModal = () => {
    setOpenCreateProposal(null);
  };

  const handleOpenVotingHistoryModal = () => {
    setOpenVotingHistory(true);
  };

  const handleCloseVotingHistoryModal = () => {
    setOpenVotingHistory(false);
  };

  const loadData = () => {
    // get community txns
    const config = {
      params: {
        communityAddress: community.CommunityAddress,
      },
    };
    setIsDataLoading(true);
    axios
      .get(`${URL()}/community/getCommunityTransactions`, config)
      .then(res => {
        const resp = res.data;
        const newTokenTransacations: any[] = [];
        if (resp.success) {
          const communityTransactions: any[] = resp.data;
          communityTransactions.forEach(txnObj => {
            newTokenTransacations.push(txnObj);
          });
        }
        setTokenTransactions(newTokenTransacations);
        setIsDataLoading(false);
      })
      .catch(() => {
        setTokenTransactions([]);
        setIsDataLoading(false);
      });

    // get transfer proposals
    getTransferProposals(community.CommunityAddress).then(resp => {
      if (resp && resp.success) {
        setTransferProposalList(resp.data);
      }
    });

    getVotings();
  };

  useEffect(() => {
    loadData();
    loadBalanceSteamingInfo();
  }, []);

  // set the view mode
  useEffect(() => {
    if (community?.FoundersMap && community.FoundersMap[user.address]) setIsUserView(false);
    else if (community?.TreasurersMap && community.TreasurersMap[user.address]) setIsUserView(false);
  }, [community.FoundersMap, community.TreasurersMap]);

  const tableHeaders: Array<CustomTableHeaderInfo> = [
    { headerAlign: "center", headerName: "User" },
    { headerAlign: "center", headerName: "Type" },
    { headerAlign: "center", headerName: "Role" },
    { headerAlign: "center", headerName: "Token" },
    { headerAlign: "center", headerName: "Amount" },
    { headerAlign: "center", headerName: "Date" },
    { headerAlign: "center", headerName: "Time" },
    { headerAlign: "center", headerName: "Priviscan" },
  ];
  const [tableData, setTableData] = useState<Array<Array<CustomTableCellInfo>>>([]);

  useEffect(() => {
    const data: Array<Array<CustomTableCellInfo>> = tokenTransactions.map(transaction => {
      const foundUser = users.find(u => u.address == transaction.From || u.address == transaction.To);
      return [
        {
          cellAlign: "center",
          cell: (
            <Box display="flex" flexDirection="row" alignItems="center" color="white">
              <Avatar
                noBorder
                size="medium"
                url={
                  foundUser ? foundUser.imageUrl : require("assets/anonAvatars/ToyFaces_Colored_BG_035.jpg")
                }
              />
              <Box fontSize="16px" fontFamily="Agrandir GrandLight" ml={2}>
                {foundUser?.name}
              </Box>
            </Box>
          ),
        },
        { cellAlign: "center", cell: transaction.Type },
        { cellAlign: "center", cell: "Member" },
        {
          cellAlign: "center",
          cell: <img src={require(`assets/tokenImages/${transaction.Token}.png`)} width={24} height={24} />,
        },
        { cellAlign: "center", cell: transaction.Amount.toFixed(4) },
        { cellAlign: "center", cell: <Moment format="ddd, DD MMM">{transaction.Date * 1000}</Moment> },
        { cellAlign: "center", cell: <Moment format="h:mm A">{transaction.Date * 1000}</Moment> },
        {
          cellAlign: "center",
          cell: (
            <a target="_blank" rel="noopener noreferrer" href={"https://priviscan.io/tx/" + transaction.Id}>
              Link
            </a>
          ),
        },
      ];
    });
    setTableData(data);
  }, [tokenTransactions, users]);

  const getVotings = () => {
    axios
      .get(`${URL()}/community/treasury/getVotings/${community.CommunityAddress}`)
      .then(res => {
        const resp = res.data;
        if (resp.success) {
          setVotings(resp.data);
        }
      })
      .catch(e => {
        console.log(e);
      });
  };

  const loadBalanceSteamingInfo = () => {
    const config = {
      params: {
        Address: community.CommunityAddress,
      },
    };
    // fetch community balance data
    axios
      .get(`${getBlockchainNode2URL()}/api/CoinBalance/getTokensOfAddress`, config)
      .then(res => {
        const resp = res.data;
        if (resp.success) {
          const output = resp.output;
          let type: string = "";
          let tokenArray: any = [];
          const newTokenTypeMap = {};
          for ([type, tokenArray] of Object.entries(output)) {
            tokenArray.forEach(token => {
              newTokenTypeMap[token] = type;
            });
          }
          if (JSON.stringify(newTokenTypeMap) != JSON.stringify(tokenTypeMap.current))
            tokenTypeMap.current = newTokenTypeMap;
          // call balanceOf for each token
          const tokenList = Object.keys(newTokenTypeMap);
          tokenList.forEach(token => {
            const config = {
              params: {
                Address: community.CommunityAddress,
                Token: token,
              },
            };
            axios
              .get(`${getBlockchainNode2URL()}/api/CoinBalance/getStreamingUpdateInfo`, config)
              .then(res => {
                const resp = res.data;
                if (resp.success) {
                  const output = resp.output;
                  const balanceObj = {
                    Token: token,
                    InitialBalance: output.Balance,
                    Type: tokenTypeMap.current[token],
                    ...output,
                  };
                  const communityBalanceCopy = {
                    ...communityBalancesRef.current,
                  };
                  communityBalanceCopy[token] = balanceObj;
                  communityBalancesRef.current = communityBalanceCopy;
                }
              });
          });
        }
      })
      .catch(error => {
        console.error(error);
      });
  };

  const refreshBalance = () => {
    const newTokenBalances: any[] = [];
    const currTime = Math.floor(Date.now() / 1000);
    let token: string = "";
    let balanceObj: any = null;
    for ([token, balanceObj] of Object.entries({
      ...communityBalancesRef.current,
    })) {
      const newBalance = Math.max(
        0,
        balanceObj.InitialBalance + (currTime - balanceObj.LastUpdate) * balanceObj.AmountPerSecond
      );
      newTokenBalances.push({
        Amount: newBalance,
        Token: token,
        Type: balanceObj.Type,
      });
      // when update is needed => refetch token balance info
      if (currTime > balanceObj.NextUpdate && community.CommunityAddress) {
        const config = {
          params: {
            Address: community.CommunityAddress,
            Token: token,
          },
        };
        axios.get(`${getBlockchainNode2URL()}/api/CoinBalance/getStreamingUpdateInfo`, config).then(res => {
          const resp = res.data;
          if (resp.success) {
            const output = resp.output;
            const balanceObj = {
              Token: token,
              InitialBalance: output.Balance,
              Type: tokenTypeMap.current[token],
              ...output,
            };
            const communityBalanceCopy = { ...communityBalancesRef.current };
            communityBalanceCopy[token] = balanceObj;
            communityBalancesRef.current = communityBalanceCopy;
          }
        });
      }
    }
    setCommunityBalances(newTokenBalances);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      refreshBalance();
    }, 1000);
    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <Box>
      <Grid container spacing={4}>
        <Grid item md={4} sm={12}>
          <Box display="flex" flexDirection="row" alignItems="center" justifyContent="space-between" mb={5}>
            <TitleGrandLight>Transfer Proposals</TitleGrandLight>
            <Box display="flex" flexDirection="row">
              <DAOButtonDark icon onClick={handleOpenProposalHistoryModal}>
                <HistoryIcon />
              </DAOButtonDark>
              {!isUserView && (
                <DAOButtonFilled icon onClick={handleOpenCreateProposalModal("cofounder")}>
                  <PlusIcon />
                </DAOButtonFilled>
              )}
            </Box>
          </Box>
          {transferProposalList.map(proposal => {
            if (!proposal.Result || proposal.Result == "pending") {
              return (
                <Card>
                  <TreasuryProposal proposal={proposal} handleRefresh={loadData} />
                </Card>
              );
            }
          })}
        </Grid>
        <Grid item md={4} sm={12}>
          <Box display="flex" flexDirection="row" alignItems="center" justifyContent="space-between" mb={5}>
            <TitleGrandLight>Voting</TitleGrandLight>
            <Box display="flex" flexDirection="row">
              <DAOButtonDark icon onClick={handleOpenVotingHistoryModal}>
                <HistoryIcon />
              </DAOButtonDark>
              <DAOButtonFilled icon onClick={handleOpenCreatePollModal}>
                <PlusIcon />
              </DAOButtonFilled>
            </Box>
          </Box>
          {votings.map(item => {
            return (
              <Card key={item.id}>
                <TreasuryVoting
                  data={item}
                  status={1}
                  itemType={"CommunityTreasury"}
                  itemId={community.CommunityAddress || ""}
                />
              </Card>
            );
          })}
        </Grid>
        <Grid item md={4} sm={12}>
          <Box display="flex" flexDirection="row" alignItems="center" mb={5} justifyContent="space-between">
            <TitleGrandLight>Payments</TitleGrandLight>
            {isUserView ? ( //FIXME: Update this with real data
              <DAOButton onClick={handleOpenCreateProposalModal("user")}>Make Payment</DAOButton>
            ) : (
              <Box height={40} />
            )}
          </Box>
          <Card>
            <Box display="flex" flexDirection="column">
              <Box display="flex" flexDirection="column" mb={2}>
                <TitleGrandLight disableUppercase mb={2} fontSize="20px">
                  ⚖️ Estimated Balance
                </TitleGrandLight>
                <Text className={classes.receiver} mb={2}>
                  {formatNumber(estimatedBalance, "USD", 4)}
                </Text>
                <Box width="100%">
                  <StyledDivider type="solid" color={Color.White} />
                </Box>
              </Box>
              <Box display="flex" flexDirection="column" mb={2}>
                <TitleGrandLight disableUppercase mb={2} fontSize="20px">
                  💰 Payments made
                </TitleGrandLight>
                <Text className={classes.receiver} mb={2}>
                  {formatNumber(community?.PaymentsMade ?? 0, "USD", 4)}
                </Text>
                <Box width="100%">
                  <StyledDivider type="solid" color={Color.White} />
                </Box>
              </Box>
              <Box display="flex" flexDirection="column">
                <TitleGrandLight disableUppercase mb={2} fontSize="20px">
                  🤑 Payments received
                </TitleGrandLight>
                <Text className={classes.receiver}>
                  {formatNumber(community?.PaymentsReceived ?? 0, "USD", 2)}
                </Text>
              </Box>
            </Box>
          </Card>
          <Card>
            <Box mb={2}>
              <TitleGrandLight mb={2} disableUppercase fontSize="20px">
                Treasurers
              </TitleGrandLight>
              <StyledDivider type="solid" color={Color.White} />
            </Box>
            <Box maxHeight={346} overflow="scroll">
              {community?.TreasurersMap ? (
                Object.keys(community.TreasurersMap).map((treasurerAddress, index) => {
                  const foundUser = users.find(u => u.address == treasurerAddress);
                  return (
                    <Box key={`guards-${index}`}>
                      <Box display="flex" flexDirection="row" alignItems="center" mt={2}>
                        <Avatar
                          noBorder
                          size="medium"
                          url={
                            foundUser
                              ? foundUser.imageUrl
                              : require("assets/anonAvatars/ToyFaces_Colored_BG_035.jpg")
                          }
                        />
                        <Box display="flex" flexDirection="column" ml={2}>
                          <TitleGrandLight disableUppercase mb={2} fontSize="16px">
                            {foundUser?.name}
                          </TitleGrandLight>
                        </Box>
                      </Box>
                      <StyledDivider type="solid" color={Color.White} />
                    </Box>
                  );
                })
              ) : (
                <TitleGrandLight fontSize="14px">No Treasurers</TitleGrandLight>
              )}
            </Box>
          </Card>
        </Grid>
      </Grid>

      <LoadingWrapper loading={isDataLoading}>
        <>
          {communityBalances && (
            <Box mt={5} mb={5}>
              <TitleGrandLight bold fontSize="30px" disableUppercase>
                Tokens
              </TitleGrandLight>
            </Box>
          )}
          {communityBalances && (
            <Grid container spacing={3} direction="row">
              {communityBalances && communityBalances.length > 0 ? (
                communityBalances.map((balanceObj, index) => (
                  <Grid item md={3} sm={6} key={index}>
                    <TreasuryToken
                      balanceObj={balanceObj}
                      transactions={tokenTransactions[balanceObj.Token] ?? []}
                      key={`token-${index}`}
                    />
                  </Grid>
                ))
              ) : (
                <Grid item>
                  <p>No active tokens</p>
                </Grid>
              )}
            </Grid>
          )}
        </>
      </LoadingWrapper>

      <Box mt={5} mb={5}>
        <TitleGrandLight bold fontSize="30px" disableUppercase>
          Transactions
        </TitleGrandLight>
      </Box>
      <Box>
        <CustomTable theme="dark" headers={tableHeaders} rows={tableData} placeholderText="No transaction" />
      </Box>
      <CreateVotingModal
        open={createPollModal}
        onClose={handleCloseCreatePollModal}
        onRefreshInfo={() => handleRefresh()}
        id={community.id}
        type={"CommunityTreasury"}
        item={community}
        title={"Create Voting"}
        requiredAnswers={true}
      />
      <ProposalHistoryModal
        open={openProposalHistory}
        handleClose={handleCloseProposalHistoryModal}
        proposals={transferProposalList}
      />
      <CreateTransferProposalModal
        isUserView={openCreateProposal === "user"}
        open={openCreateProposal}
        handleClose={handleCloseCreateProposalModal}
        handleRefresh={loadData}
        communityAddress={community?.CommunityAddress}
      />
      <VotingHistoryModal open={openVotingHistory} onClose={handleCloseVotingHistoryModal} />

      {status ? <AlertMessage key={status.key} message={status.msg} variant={status.variant} /> : ""}
    </Box>
  );
};

export default Treasury;
