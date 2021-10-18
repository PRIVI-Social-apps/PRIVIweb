import React, { useEffect } from "react";
import { Box } from "@material-ui/core";
import Moment from "react-moment";

import { Modal } from "shared/ui-kit";

import { CustomTable, CustomTableCellInfo, CustomTableHeaderInfo } from "shared/ui-kit/Table";
import {
  ProgressAcceptIcon,
  ProgressDeclineIcon,
  ProgressPendingIcon,
  useStyles,
  LinkIcon,
  TitleGrandLight,
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

const ProposalHistory = ({ type, open, handleClose, airdropList, allocationList }) => {
  const classes = useStyles();

  const [history, setHistory] = React.useState<any[]>([]);

  useEffect(() => {
    if (type == "airdrop") setHistory(airdropList);
    else if (type == "allocation") setHistory(allocationList);
  }, [type, airdropList, allocationList]);

  const [tableData, setTableData] = React.useState<Array<Array<CustomTableCellInfo>>>([]);
  const tableHeaders: CustomTableHeaderInfo[] = [
    {
      headerAlign: "center",
      headerName: "Proposal",
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
      headerName: "Status",
    },
    {
      headerAlign: "center",
      headerName: "Priviscan",
    },
  ];

  useEffect(() => {
    const data: Array<Array<CustomTableCellInfo>> = history.map((event, index) => [
      {
        cell: type,
        cellAlign: "center",
      },
      {
        cell: event.Amount.toFixed(4),
        cellAlign: "center",
      },
      {
        cell: (
          <Box className={classes.receiver} width={220}>
            {event.To}
          </Box>
        ),
        cellAlign: "center",
      },
      {
        cell: <Moment format="ddd, DD MMM">{event.ProposalEndedTime}</Moment>,
        cellAlign: "center",
      },
      {
        cell: <StatusIcon type={event.Result} />,
        cellAlign: "center",
      },
      {
        cell: <LinkIcon />,
        cellAlign: "center",
      },
    ]);

    setTableData(data);
  }, [history]);

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
          <TitleGrandLight disableUppercase fontSize="30px" mb={3}>
            Proposals History
          </TitleGrandLight>
        </Box>
        <CustomTable theme="dark" headers={tableHeaders} rows={tableData} />
      </Box>
    </Modal>
  );
};

export default ProposalHistory;
