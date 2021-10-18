import React, { useState, useEffect } from 'react';
import styles from './DigitalTradingTable.module.scss';
import RenderInputWithTooltip from '../RenderInputWithTooltip/RenderInputWithTooltip';
import axios from "axios";
import URL from "shared/functions/getURL";
import { timePassed } from "shared/functions/commonFunctions"
import { CustomTable, CustomTableCellInfo, CustomTableHeaderInfo } from 'shared/ui-kit/Table';

const DigitalTradingTable = (props) => {

  const [cryptoList, setCryptoList] = useState<string[]>([]);
  const tableHeaders: Array<CustomTableHeaderInfo> = [{
      headerName: "EVENT"
    }, {
      headerName: "TOKEN"
    }, {
      headerName: "PRICE"
    }, {
      headerName: "FROM"
    }, {
      headerName: "TO"
    }, {
      headerName: "DATE"
    }
  ];
  const [tableData, setTableData] = useState<Array<Array<CustomTableCellInfo>>>([]);

  useEffect(() => {
    axios.get(`${URL()}/wallet/getCryptosRateAsList`).then((res) => {
      const resp = res.data;
      if (resp.success) {
        const tokenList: string[] = [];
        const data = resp.data;
        data.forEach((rateObj) => {
          tokenList.push(rateObj.token);
        });
        setCryptoList(tokenList);
      }
    });
  }, []);

  useEffect(() => {
    let data: Array<Array<CustomTableCellInfo>> = [];
    if (props.transactions && props.transactions.length > 0) {
      data = props.transactions.map((transaction) => {
        let from = transaction.From ?? 'Unknown';;
        let to = transaction.To ?? 'Unknown';;
        if (from.length > 10) from = `${from.substr(0, 10)}...`
        if (to.length > 10) to = `${to.substr(0, 10)}...`

        return [{
          cell: transaction.Type,
        }, {
          cell: (
            transaction.Token && cryptoList.includes(transaction.Token)
            ? <img src={require(`assets/tokenImages/${transaction.Token}.png`)} alt="" />
            : <div>{transaction.Token}</div>
          )
        }, {
          cell: transaction.Amount
        }, {
          cell: from
        }, {
          cell: to
        }, {
          cell: timePassed(transaction.Date)
        }];
      });
    }

    setTableData(data);
  }, [props.transactions]);

  return (
    <div className={styles.digital_chart_table}>
      <div className={styles.digital_chart_title}>
        <RenderInputWithTooltip
          name={"Trading History"}
          info={"Trading History"}
          type={"text"}
          width={0}
          class="title"
        />
        {props.viewAll &&
          <a className={styles.view_all}>View All</a>
        }
      </div>
      <div className={styles.digital_table}>
        <CustomTable
          headers={tableHeaders}
          rows={tableData}
          placeholderText="No Transactions"
        />
      </div>
    </div>
  );
};

export default DigitalTradingTable;
