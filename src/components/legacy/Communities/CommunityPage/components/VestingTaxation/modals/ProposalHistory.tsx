import React, { useEffect } from "react";
import Moment from "react-moment";

import { HeaderBold4, Modal } from "shared/ui-kit";
import Box from "shared/ui-kit/Box";
import { LinkIcon, ProgressAcceptIcon, ProgressDeclineIcon, ProgressPendingIcon, useStyles } from "../VestingTaxationStyle";
import { CustomTable, CustomTableCellInfo } from "shared/ui-kit/Table";

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

const ProposalHistory = ({type, open, handleClose, airdropList, allocationList}) => {
  const classes = useStyles();

  const [history, setHistory] = React.useState<any[]>([]);

  useEffect(() => {
    if (type == 'airdrop') setHistory(airdropList);
    else if (type == 'allocation') setHistory(allocationList);
  }, [type, airdropList, allocationList])

  const [tableData, setTableData] = React.useState<Array<Array<CustomTableCellInfo>>>([]);
  const tableHeaders = [
    {
      headerName: 'Proposal',
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
      headerName: 'Status',
    },
    {
      headerName: 'Priviscan',
    },
  ];

  useEffect(() => {
    const data: Array<Array<CustomTableCellInfo>> = history.map((event, index) => [{
        cell: type,
      }, {
        cell: event.Amount.toFixed(4),
      }, {
        cell: (
          <Box className={classes.receiver} width={220}>
            {event.To}
          </Box>
        ),
      }, {
        cell: <Moment format="ddd, DD MMM">{event.ProposalEndedTime}</Moment>,
      }, {
        cell: <StatusIcon type={event.Result} />,
      }, {
        cell: <LinkIcon />,
      }]);

    setTableData(data);
  }, [history]);

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

export default ProposalHistory;
