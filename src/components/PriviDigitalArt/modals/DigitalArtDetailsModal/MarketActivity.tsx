import React, { useEffect, useState } from "react";

import { useStyles } from "./index.styles";
import { Text } from "shared/ui-kit";
import { CustomTable, CustomTableCellInfo, CustomTableHeaderInfo } from "shared/ui-kit/Table";

const Info: any[] = [];

const MarketActivity = () => {
  const classes = useStyles();
  const tableHeaders: Array<CustomTableHeaderInfo> = [{
      headerName: "Event"
    }, {
      headerName: "Token"
    }, {
      headerName: "Price"
    }, {
      headerName: "From"
    }, {
      headerName: "To"
    }, {
      headerName: "Date"
    }
  ];
  const [tableData, setTableData] = useState<Array<Array<CustomTableCellInfo>>>([]);

  useEffect(() => {
    let data: Array<Array<CustomTableCellInfo>> = [];
    if (Info && Info.length) {
      data = Info.map((info) => {
        return [{
          cell: <Text>{info.Event}</Text>,
        }, {
          cell: <img src={require(`assets/tokenImages/${info.Token}.png`)} width={24} height={24} />
        }, {
          cell: info.Price
        }, {
          cell: info.From
        }, {
          cell: info.To
        }, {
          cell: info.Date
        }];
      });
    }

    setTableData(data);
  }, [Info]);

  return (
    <div className={classes.table}>
      <CustomTable
        headers={tableHeaders}
        rows={tableData}
        placeholderText="No offers"
      />
    </div>
  )
}

export default MarketActivity;
