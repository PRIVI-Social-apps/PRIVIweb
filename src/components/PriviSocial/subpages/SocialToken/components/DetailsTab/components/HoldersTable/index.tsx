import React, { useEffect, useState } from "react";
import { Gradient } from "shared/ui-kit";
import { CustomTable, CustomTableCellInfo, CustomTableHeaderInfo } from "shared/ui-kit/Table";
import { useTypedSelector } from "store/reducers/Reducer";
import Box from "shared/ui-kit/Box";

export default function HoldersTable({ socialToken }) {
  const users = useTypedSelector(state => state.usersInfoList);

  const [holdersData, setHoldersData] = useState<any[]>([]);
  const [tableData, setTableData] = useState<Array<Array<CustomTableCellInfo>>>([]);


  // useEffect(() => {
  //   if (holders && holders.length > 0 && users && users.length > 0) {
  //     const h = [...holders] as any[];

  //     h.sort((a, b) => b.Amount - a.Amount);

  //     h.filter((ho, index) => index < 5).forEach((hold, index) => {
  //       h[index].user = users.find(u => u.address === hold.Address);
  //     });

  //     setHoldersData(h.filter((h, index) => index < 5));
  //   }
  // }, [holders, users]);

  const tableHeaders: Array<CustomTableHeaderInfo> = [
    {
      headerName: "#",
    },
    {
      headerName: "USER",
    },
    {
      headerName: "AMOUNT",
    },
  ];

  useEffect(() => {
    let data: Array<Array<CustomTableCellInfo>> = [];
    if (socialToken.Holders) {
      let holder:string;
      let amount:any;
      let index = 0;
      for ([holder, amount] of Object.entries(socialToken.Holders)) {
        const foundUser = users.find(u => u.address == holder);
        if (foundUser) {
          index++;
          data.push(
            [
              {
                cell: <span style={{ color: "#00FF15", fontSize: "16px" }}>{index}</span>,
              },
              {
                cell: (
                  <Box display="flex" alignItems="center">
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "flex-end",
                        marginRight: "15px",
                      }}
                    >
                      <div
                        style={{
                          filter: "drop-shadow(0px 2px 8px rgba(0, 0, 0, 0.2))",
                          borderRadius: "50%",
                          width: "32px",
                          height: "32px",
                          backgroundRepeat: "no-repeat",
                          backgroundSize: "cover",
                          backgroundPosition: "center",
                          backgroundImage:
                          foundUser.imageURL
                              ? `url(${foundUser.imageURL})`
                              : "none",
                        }}
                      />
                      <div
                        style={{
                          background: Gradient.Green,
                          border: "1px solid #FFFFFF",
                          width: "9.5px",
                          height: "9.5px",
                          borderRadius: "50%",
                          marginLeft: "-12px",
                          marginTop: "-12px",
                        }}
                      />
                    </div>
                    <div
                      style={{
                        background: Gradient.Green,
                        color: "transparent",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                      }}
                    >
                      {foundUser.urlSlug && !foundUser.urlSlug.includes("Px")
                        ? foundUser.urlSlug
                        : foundUser.name}
                    </div>
                  </Box>
                ),
              },
              {
                cell: `${amount.toFixed(6)} ${socialToken.TokenSymbol}`,
              },
            ]
          )
        }
      }
    }
    setTableData(data);
  }, [socialToken.Holders, users]);

  return (
    <CustomTable
      headers={tableHeaders}
      rows={tableData}
      placeholderText="No holders info to show"
      theme="green"
    />
  );
}
