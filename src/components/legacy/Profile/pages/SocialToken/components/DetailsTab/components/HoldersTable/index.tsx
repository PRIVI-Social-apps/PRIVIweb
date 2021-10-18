import React, { useEffect, useState } from "react";
import { Gradient } from "shared/ui-kit";
import { CustomTable, CustomTableCellInfo, CustomTableHeaderInfo } from "shared/ui-kit/Table";
import { useTypedSelector } from "store/reducers/Reducer";
import Box from 'shared/ui-kit/Box';

export default function HoldersTable({ holders }) {
  const users = useTypedSelector(state => state.usersInfoList);

  const [holdersData, setHoldersData] = useState<any[]>([]);

  useEffect(() => {
    if (holders && holders.length > 0 && users && users.length > 0) {
      const h = [...holders] as any[];

      h.sort((a, b) => b.Amount - a.Amount);

      h.filter((ho, index) => index < 5).forEach((hold, index) => {
        h[index].user = users.find(u => u.address === hold.Address);
      });

      setHoldersData(h.filter((h, index) => index < 5));
    }
  }, [holders, users]);

  const tableHeaders: Array<CustomTableHeaderInfo> = [{
      headerName: "#"
    }, {
      headerName: "USER"
    }, {
      headerName: "AMOUNT"
    }
  ];
  const [tableData, setTableData] = useState<Array<Array<CustomTableCellInfo>>>([]);

  useEffect(() => {
    let data: Array<Array<CustomTableCellInfo>> = [];
    if (holdersData && holdersData.length) {
      data = holdersData.map((holder, index) => {
        return [{
          cell: index + 1
        }, {
          cell: (
            <Box display="flex" alignItems="center">
              <div style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-end",
                marginRight: "15px"
              }}>
                <div
                  style={{
                    filter: "drop-shadow(0px 2px 8px rgba(0, 0, 0, 0.2))",
                    border: "1.5px solid #FFFFFF",
                    borderRadius: "50%",
                    width: "32px",
                    height: "32px",
                    backgroundRepeat: "no-repeat",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    backgroundImage:
                      holder.user && holder.user.imageURL && holder.user.imageURL !== ""
                        ? `url(${holder.user.imageURL})`
                        : "none",
                  }}
                />
                {holder.user && holder.user.online &&
                  <div style={{
                    background: Gradient.Mint,
                    border: "1px solid #FFFFFF",
                    width: "9.5px",
                    height: "9.5px",
                    borderRadius: "50%",
                    marginLeft: "-12px",
                    marginTop: "-12px",
                  }} />}
              </div>
              <div style={{
                background: Gradient.Magenta,
                color: "transparent",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}>
                {holder.user
                  ? holder.user.urlSlug && !holder.user.urlSlug.includes("Px")
                    ? holder.user.urlSlug
                    : holder.user.name
                  : "User"}
              </div>
            </Box>
          )
        }, {
          cell: `${Number(holder.Amount.toString()).toFixed(6)} ${holder.Token}`
        }];
      });
    }

    setTableData(data);
  }, [holdersData]);

  return (
    <CustomTable
      headers={tableHeaders}
      rows={tableData}
      placeholderText="No holders info to show"
    />
  );
}
