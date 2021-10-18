import React, { useEffect } from "react";
import Moment from "react-moment";

import { ProgressAcceptIcon, ProgressDeclineIcon, ProgressPendingIcon, useStyles } from "../TreasuryStyle";
import { HeaderBold4, Modal } from "shared/ui-kit";
import Box from "shared/ui-kit/Box";
import { CustomTable, CustomTableCellInfo } from "shared/ui-kit/Table";

/** Mockup data */
const transactions = [
  { To: '0x6362613136653163227D31363134383736353530', Amount: 0.0000303, Token: 'DAI', Date: 1616684507, Status: 'accept' },
  { To: '0x6362613136653163227D31363134383736353530', Amount: 1.0000303, Token: 'BAL', Date: 1616622507, Status: 'decline' },
  { To: '0x6362613136653163227D31363134383736353530', Amount: 3.0000303, Token: 'USDT', Date: 1616633507, Status: 'pending' },
  { To: '0x6362613136653163227D31363134383736353530', Amount: 0.0230303, Token: 'WETH', Date: 1616621507, Status: 'decline' },
  { To: '0x6362613136653163227D31363134383736353530', Amount: 1.0300303, Token: 'USDT', Date: 1616484407, Status: 'accept' },
  { To: '0x6362613136653163227D31363134383736353530', Amount: 2.0230303, Token: 'WETH', Date: 1616684207, Status: 'pending' },
];
/** Mockup data */

const StatusIcon = ({ type, ...props }: React.PropsWithChildren<{
  type: string;
}>) => {
  if (type === 'accepted') {
    return <ProgressAcceptIcon />;
  } else if (type === 'declined') {
    return <ProgressDeclineIcon />;
  } else if (type === 'pending') {
    return <ProgressPendingIcon />;
  } else {
    return null;
  }
}

const tableHeaders = [
  {
    headerName: 'Token',
  },
  {
    headerName: 'AMOUNT',
  },
  {
    headerName: 'To',
  },
  {
    headerName: 'Date',
  },
  {
    headerName: 'ACCEPTANCE',
  },
  {
    headerName: 'STATUS',
  },
  {
    headerName: 'Priviscan',
  },
];

const ProposalHistoryModal = ({open, handleClose, proposals}) => {
  const classes = useStyles();
  const [tableData, setTableData] = React.useState<Array<Array<CustomTableCellInfo>>>([]);


  useEffect(() => {
    const newTableData:Array<Array<CustomTableCellInfo>> = [];
    if (proposals) {
      proposals.forEach(proposal => {
        newTableData.push([{
          cell: <img src={require(`assets/tokenImages/${proposal.Token}.png`)} width={24} height={24} />,
        }, {
          cell: proposal.Amount.toFixed(4),
        }, {
          cell: <Box className={classes.receiver} width={220}>{proposal.To}</Box>,
        }, {
          cell: <Moment format="ddd, DD MMM">{proposal.ProposalEndedTime}</Moment>,
        }, {
          cell: `${proposal.AcceptedVotes} of ${proposal.TotalVotes}`
        }, {
          cell: <StatusIcon type={proposal.Result} />,
        }, {
          cell: <a
          target="_blank"
          rel="noopener noreferrer"
          href={"https://priviscan.io/tx/" + proposal.TxId
        }
        >
          Link
        </a>,
        }])
      });
    }
    setTableData(newTableData);
  }, [proposals]);

  return (
    <Modal
        size="medium"
        isOpen={open}
        onClose={handleClose}
        showCloseIcon
      >
      <Box mb={5}>
        <HeaderBold4>Proposals History</HeaderBold4>
      </Box>
      <CustomTable
        headers={tableHeaders}
        rows={tableData}
      />
    </Modal>
  )
}

export default ProposalHistoryModal;
