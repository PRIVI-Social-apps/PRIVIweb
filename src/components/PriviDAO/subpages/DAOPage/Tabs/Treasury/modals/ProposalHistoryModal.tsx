import React, { useEffect } from "react";
import Moment from "react-moment";

import { Modal } from "shared/ui-kit";
import { CustomTable, CustomTableCellInfo, CustomTableHeaderInfo } from "shared/ui-kit/Table";
import Box from 'shared/ui-kit/Box';
import {
  TitleGrandLight,
  ProgressAcceptIcon,
  ProgressDeclineIcon,
  ProgressPendingIcon,
  useStyles,
} from "../../../index.styles";

const StatusIcon = ({
  type,
  ...props
}: React.PropsWithChildren<{
  type: string;
}>) => {
  if (type === "accepted") {
    return <ProgressAcceptIcon />;
  } else if (type === "declined") {
    return <ProgressDeclineIcon />;
  } else if (type === "pending") {
    return <ProgressPendingIcon />;
  } else {
    return null;
  }
};

const tableHeaders: Array<CustomTableHeaderInfo> = [
  {
    headerAlign: "center",
    headerName: "Token",
  },
  {
    headerAlign: "center",
    headerName: "AMOUNT",
  },
  {
    headerAlign: "center",
    headerName: "To",
  },
  {
    headerAlign: "center",
    headerName: "Date",
  },
  {
    headerAlign: "center",
    headerName: "ACCEPTANCE",
  },
  {
    headerAlign: "center",
    headerName: "STATUS",
  },
  {
    headerAlign: "center",
    headerName: "Priviscan",
  },
];

const ProposalHistoryModal = ({ open, handleClose, proposals }) => {
  const classes = useStyles();
  const [tableData, setTableData] = React.useState<Array<Array<CustomTableCellInfo>>>([]);

  useEffect(() => {
    const newTableData: Array<Array<CustomTableCellInfo>> = [];
    if (proposals) {
      proposals.forEach(proposal => {
        newTableData.push([
          {
            cellAlign: "center",
            cell: <img src={require(`assets/tokenImages/${proposal.Token}.png`)} width={24} height={24} />,
          },
          {
            cellAlign: "center",
            cell: proposal.Amount.toFixed(4),
          },
          {
            cellAlign: "center",
            cell: (
              <Box className={classes.receiver} width={220}>
                {proposal.To}
              </Box>
            ),
          },
          {
            cellAlign: "center",
            cell: <Moment format="ddd, DD MMM">{proposal.ProposalEndedTime}</Moment>,
          },
          {
            cellAlign: "center",
            cell: `${proposal.AcceptedVotes} of ${proposal.TotalVotes}`,
          },
          {
            cellAlign: "center",
            cell: <StatusIcon type={proposal.Result} />,
          },
          {
            cellAlign: "center",
            cell: (
              <a target="_blank" rel="noopener noreferrer" href={"https://priviscan.io/tx/" + proposal.TxId}>
                Link
              </a>
            ),
          },
        ]);
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
      theme="dark"
      className={classes.rootAuto}
    >
      <Box width="1330px">
        <Box mb={3}>
          <TitleGrandLight disableUppercase fontSize="30px">
            Proposals History
          </TitleGrandLight>
        </Box>
        <CustomTable theme="dark" headers={tableHeaders} rows={tableData} />
      </Box>
    </Modal>
  );
};

export default ProposalHistoryModal;
