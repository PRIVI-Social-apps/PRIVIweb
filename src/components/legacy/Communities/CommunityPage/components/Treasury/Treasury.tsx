import React, { useEffect, useState } from "react";
import Moment from "react-moment";
import axios from "axios";

import { Grid } from "@material-ui/core";

import { Card, HistoryIcon, PlusIcon, Text, useStyles } from "./TreasuryStyle";
import AlertMessage from "../../../../../../shared/ui-kit/Alert/AlertMessage";
import TreasuryProposal from "./components/TransferProposal";
import TreasuryVoting from "./components/TreasuryVoting";
import TreasuryToken from "./components/TreasuryToken";
import ProposalHistoryModal from "./modals/ProposalHistoryModal";
import CreateTransferProposalModal from "./modals/CreateTransferProposalModal";
import VotingHistoryModal from "./modals/VotingHistoryModal";
import {
  Avatar,
  FontSize,
  Header4,
  HeaderBold5,
  IconPrimaryButton,
  IconSecondaryButton,
  PrimaryButton,
  StyledDivider,
} from "shared/ui-kit";
import Box from "shared/ui-kit/Box";
import { CustomTable, CustomTableCellInfo, CustomTableHeaderInfo } from "shared/ui-kit/Table";
import CreateVotingModal from "shared/ui-kit/Page-components/CreateVotingModal";
import { LoadingWrapper } from "shared/ui-kit/Hocs";
import URL from "shared/functions/getURL";
import { useTypedSelector } from "store/reducers/Reducer";
import { getTransferProposals } from "shared/services/API";
import {formatNumber} from "shared/functions/commonFunctions";

const Tokens = [
  { Token: "bUSD", Type: "CRYPTO", Amount: 100.12 },
  { Token: "BAL", Type: "CRYPTO", Amount: 90.52 },
  { Token: "BAT", Type: "CRYPTO", Amount: 300 },
  { Token: "ETH", Type: "CRYPTO", Amount: 234.12 },
  { Token: "LNK", Type: "CRYPTO", Amount: 167.34 },
  { Token: "PRIVI", Type: "CRYPTO", Amount: 1000 },
];

type ViewMode = "user" | "cofounder";

/** Mockup data */
const Guards = [1, 2, 3, 4, 5, 6];

const Treasury = React.memo((props: any) => {
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
  const [estimatedBalance, setEstimatedBalance] = useState<number>(0);  // sum of the balance of the community converted in usd

  const [status, setStatus] = useState<any>("");

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
        communityAddress: props.community.CommunityAddress,
      },
    };
    setIsDataLoading(true);
    axios
      .get(`${URL()}/community/getCommunityTransactions`, config)
      .then(res => {
        const resp = res.data;
        const newTokenTransacations:any[] = [];
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
    getTransferProposals(props.community.CommunityAddress).then(resp => {
      if (resp && resp.success) {
        setTransferProposalList(resp.data);
      }
    });

    getVotings();
  };

  useEffect(() => {
    loadData();
  }, []);

  // set the view mode
  useEffect(() => {
    if (props?.community?.FoundersMap && props.community.FoundersMap[user.address]) setIsUserView(false);
    else if (props?.community?.TreasurersMap && props.community.TreasurersMap[user.address]) setIsUserView(false);
  }, [props.community.FoundersMap, props.community.TreasurersMap]);

  const tableHeaders: Array<CustomTableHeaderInfo> = [{
      headerName: "User",
    }, {
      headerName: "Type",
    }, {
      headerName: "Role",
    }, {
      headerName: "Token",
    }, {
      headerName: "Amount",
    }, {
      headerName: "Date",
    }, {
      headerName: "Time",
    }, {
      headerName: "Priviscan",
    }];
  const [tableData, setTableData] = useState<Array<Array<CustomTableCellInfo>>>([]);

  useEffect(() => {
    const data: Array<Array<CustomTableCellInfo>> = tokenTransactions.map((transaction) => {
      const foundUser = users.find(u => u.address == transaction.From || u.address == transaction.To);
      return [{
        cell: (
          <Box display="flex" flexDirection="row" alignItems="center">
            <Avatar
              size="medium"
              url={foundUser ? foundUser.imageUrl : require("assets/anonAvatars/ToyFaces_Colored_BG_035.jpg")}
            />
            <span className={classes.receiverSlug}>@{foundUser?.name}</span>
          </Box>
        )
      }, {
        cell: transaction.Type
      }, {
        cell: 'Member'
      }, {
        cell: <img src={require(`assets/tokenImages/${transaction.Token}.png`)} width={24} height={24} />
      }, {
        cell: transaction.Amount.toFixed(4)
      }, {
        cell: <Moment format="ddd, DD MMM">{transaction.Date * 1000}</Moment>
      }, {
        cell: <Moment format="h:mm A">{transaction.Date * 1000}</Moment>
      }, {
        cell: <a
          target="_blank"
          rel="noopener noreferrer"
          href={"https://priviscan.io/tx/" + transaction.Id}
        >
          Link
        </a>
      }];
    });
    setTableData(data);
  }, [tokenTransactions, users]);

  const getVotings = () => {
    axios
      .get(`${URL()}/community/treasury/getVotings/${props.community.CommunityAddress}`)
      .then(res => {
        const resp = res.data;
        if(resp.success) {
          setVotings(resp.data);
        }
      })
      .catch((e) => {
        console.log(e)
      });
  }

  return (
    <Box>
      <Grid container spacing={4}>
        <Grid item md={4} sm={12}>
          <Box display="flex" flexDirection="row" alignItems="center" justifyContent="space-between" mb={2}>
            <Header4>Transfer Proposals</Header4>
            <Box display="flex" flexDirection="row">
              <IconSecondaryButton size="medium" onClick={handleOpenProposalHistoryModal}>
                <HistoryIcon />
              </IconSecondaryButton>
              {!isUserView && (
                <IconPrimaryButton size="medium" onClick={handleOpenCreateProposalModal("cofounder")}>
                  <PlusIcon />
                </IconPrimaryButton>
              )}
            </Box>
          </Box>
          {transferProposalList.map(proposal => {
            if (!proposal.Result || proposal.Result == 'pending') {
              return (
                <Card>
                  <TreasuryProposal proposal={proposal}
                                    handleRefresh={loadData} />
                </Card>
              )
            }
          })}
        </Grid>
        <Grid item md={4} sm={12}>
          <Box display="flex" flexDirection="row" alignItems="center" justifyContent="space-between" mb={2}>
            <Header4>Voting</Header4>
            <Box display="flex" flexDirection="row">
              <IconSecondaryButton size="medium" onClick={handleOpenVotingHistoryModal}>
                <HistoryIcon />
              </IconSecondaryButton>
              <IconPrimaryButton size="medium" onClick={handleOpenCreatePollModal}>
                <PlusIcon />
              </IconPrimaryButton>
            </Box>
          </Box>
          {
            votings.map(item => {
              return(
                <Card key={item.id}>
                  <TreasuryVoting data={item}
                                  status={1}
                                  itemType={'CommunityTreasury'}
                                  itemId={props.community.CommunityAddress || ''}/>
                </Card>
              )
            })
          }
        </Grid>
        <Grid item md={4} sm={12}>
          <Box display="flex" flexDirection="row" alignItems="center" mb={2} justifyContent="space-between">
            <Header4>Payments</Header4>
            {isUserView ? ( //FIXME: Update this with real data
              <PrimaryButton size="medium" onClick={handleOpenCreateProposalModal("user")}>
                Make Payment
              </PrimaryButton>
            ) : (
              <Box height={40} />
            )}
          </Box>
          <Card>
            <Box display="flex" flexDirection="column">
              <HeaderBold5>⚖️ Estimated Balance</HeaderBold5>
              <Text size={FontSize.H3} mb={4}>
                {formatNumber(estimatedBalance, 'USD', 4)}
              </Text>
              <HeaderBold5>💰 Payments made</HeaderBold5>
              <Text size={FontSize.H3} mb={4}>
                {formatNumber(props?.community?.PaymentsMade ?? 0, 'USD', 4)}
              </Text>
              <HeaderBold5>🤑 Payments received</HeaderBold5>
              <Text size={FontSize.H3}>
                {formatNumber(props?.community?.PaymentsReceived ?? 0, 'USD', 4)}
              </Text>
            </Box>
          </Card>
          <Card>
            <Box mb={2}>
              <Header4>Treasurers</Header4>
            </Box>
            <Box maxHeight={260} overflow="scroll">
              {props?.community?.TreasurersMap ? Object.keys(props.community.TreasurersMap).map((treasurerAddress, index) => {
                const foundUser = users.find(u => u.address == treasurerAddress);
                return (
                    <Box key={`guards-${index}`}>
                      <Box display="flex" flexDirection="row" alignItems="center">
                        <Avatar size="medium" url={foundUser? foundUser.imageUrl: require("assets/anonAvatars/ToyFaces_Colored_BG_035.jpg")} />
                        <Box display="flex" flexDirection="column" ml={2}>
                          <HeaderBold5 noMargin>{foundUser?.name}</HeaderBold5>
                          <span className={classes.userSlug}>@{foundUser?.twitter}</span>
                        </Box>
                      </Box>
                      <StyledDivider type="solid" margin={1} />
                    </Box>
                  )
              }) :
              <div>No Treasurers</div>
            }
            </Box>
          </Card>
        </Grid>
      </Grid>

      <LoadingWrapper loading={isDataLoading}>
        <>
          {Tokens ? (
            <Box mt={5} mb={3}>
              <Header4>Tokens</Header4>
            </Box>
          ) : null}
          {Tokens ? (
            <Grid container spacing={3} direction="row">
              {Tokens.length > 0 ? (
                Tokens.map((balanceObj, index) => (
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
          ) : null}
        </>
      </LoadingWrapper>

      <Box mt={5} mb={3}>
        <Header4>Transactions</Header4>
      </Box>
      <Box>
        <CustomTable
          headers={tableHeaders}
          rows={tableData}
          placeholderText="No transaction"
        />
      </Box>
      <CreateVotingModal
        open={createPollModal}
        onClose={handleCloseCreatePollModal}
        onRefreshInfo={() => props.handleRefresh()}
        id={props.community.id}
        type={"CommunityTreasury"}
        item={props.community}
        title={"Create Voting"}
        requiredAnswers={true}
      />
      <ProposalHistoryModal open={openProposalHistory} handleClose={handleCloseProposalHistoryModal} proposals={transferProposalList}/>
      <CreateTransferProposalModal isUserView={openCreateProposal === "user"} open={openCreateProposal} handleClose={handleCloseCreateProposalModal} handleRefresh={loadData} communityAddress={props?.community?.CommunityAddress}/>
      <VotingHistoryModal open={openVotingHistory} onClose={handleCloseVotingHistoryModal} />

      {status ? <AlertMessage key={status.key} message={status.msg} variant={status.variant} /> : ""}
    </Box>
  );
});

export default Treasury;
