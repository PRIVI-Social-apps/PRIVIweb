import React, { useEffect, useState } from 'react';

import styles from './DigitalTable.module.scss';
import RenderInputWithTooltip from '../RenderInputWithTooltip/RenderInputWithTooltip';
import URL from "shared/functions/getURL";
import axios from "axios";
import AlertMessage from "shared/ui-kit/Alert/AlertMessage";
import { signTransaction } from "shared/functions/signTransaction";
import { useSelector } from "react-redux";
import { RootState } from "store/reducers/Reducer";
import { CustomTable, CustomTableCellInfo, CustomTableHeaderInfo } from 'shared/ui-kit/Table';

/*
props.isBuy = true => Buying Offers => Perform buy operation
props.isBuy = false => Selling Offers => Perform sell operation
*/

const DigitalChartTable = (props: any) => {

  const user = useSelector((state: RootState) => state.user);
  const [disabled, setDisabled] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false); // for some king of confimation
  const [status, setStatus] = useState<any>("");
  const tableHeaders: Array<CustomTableHeaderInfo> = [{
      headerName: "TOKEN"
    }, {
      headerName: "SYMBOL"
    }, {
      headerName: "PRICE"
    }, {
      headerName: "AMOUNT"
    }, {
      headerName: ""
    }, {
      headerName: ""
    }
  ];
  const [tableData, setTableData] = useState<Array<Array<CustomTableCellInfo>>>([]);

  const handleOpen = () => {
    setOpen(true);
  }
  const handleClose = () => {
    setOpen(false);
  }

  const updateStatus = (msg, variant) => {
    setStatus({
      msg: msg,
      key: Math.random(),
      variant: variant,
    });
    setInterval(() => {
      setStatus('');
    }, 2000);
  }

  const handleClickOrder = async (offer) => {
    if (props.isBuy) {  // call sell
      const body: any = {
        TokenSymbol: props.media.MediaSymbol,
        BAddress: offer.BAddress,
        OrderId: offer.OrderId,
        Amount: offer.Amount,
        SellerAddress: user.address
      };
      const [hash, signature] = await signTransaction(user.mnemonic, body);
      body.Hash = hash;
      body.Signature = signature;
      axios
        .post(`${URL()}/media/sellFraction`, body)
        .then(async response => {
          const resp: any = response.data;
          setDisabled(false);
          if (resp.success) {
            props.handleRefresh();
            updateStatus('sell success', 'success');
          } else {
            updateStatus('sell failed', 'error');
          }
        })
        .catch(err => {
          console.log(err);
        });
    } else {
      const body: any = {
        TokenSymbol: offer.TokenSymbol,
        SAddress: offer.SAddress,
        OrderId: offer.OrderId,
        Amount: offer.Amount,
        BuyerAddress: user.address,
      };
      const [hash, signature] = await signTransaction(user.mnemonic, body);
      body.Hash = hash;
      body.Signature = signature;
      axios
        .post(`${URL()}/media/buyFraction`, body)
        .then(async response => {
          const resp: any = response.data;
          setDisabled(false);
          console.log(resp);
          if (resp.success) {
            props.handleRefresh();
            updateStatus('buy success', 'success');
          } else {
            updateStatus('buy failed', 'error');
          }
        })
        .catch(err => {
          console.log(err);
        });
    }
  }

  const handleDeleteOrder = async (offer) => {
    if (props.isBuy) {  // call sell
      const body: any = {
        OrderId: offer.OrderId,
        RequesterAddress: user.address,
        TokenSymbol: offer.TokenSymbol
      };
      const [hash, signature] = await signTransaction(user.mnemonic, body);
      body.Hash = hash;
      body.Signature = signature;
      axios
        .post(`${URL()}/media/deleteBuyOrder`, body)
        .then(async response => {
          const resp: any = response.data;
          setDisabled(false);
          if (resp.success) {
            props.handleRefresh();
            updateStatus('cancel success', 'success');
          } else {
            updateStatus('cancel failed', 'error');
          }
        })
        .catch(err => {
          console.log(err);
        });
    } else {
      const body: any = {
        OrderId: offer.OrderId,
        RequesterAddress: user.address,
        TokenSymbol: offer.TokenSymbol
      };
      const [hash, signature] = await signTransaction(user.mnemonic, body);
      body.Hash = hash;
      body.Signature = signature;
      axios
        .post(`${URL()}/media/deleteSellOrder`, body)
        .then(async response => {
          const resp: any = response.data;
          setDisabled(false);
          if (resp.success) {
            props.handleRefresh();
            updateStatus('cancel success', 'success');
          } else {
            updateStatus('cancel failed', 'error');
          }
        })
        .catch(err => {
          console.log(err);
        });
    }
  }

  useEffect(() => {
    let data: Array<Array<CustomTableCellInfo>> = [];
    if (props.offers && props.offers.length) {
      data = props.offers.map((offer) => {
        return [{
          cell: <img src={require(`assets/tokenImages/${offer.Token}.png`)} alt="" />
        }, {
          cell: offer.Token
        }, {
          cell: offer.Price
        }, {
          cell: offer.Amount
        }, {
          cell: (
            user.address == offer.SAddress || user.address == offer.BAddress ?
              <a className={styles.action_btn} onClick={() => {
                if (!disabled) {
                  setDisabled(true);
                  handleDeleteOrder(offer);
                }
              }}>
                Cancel
            </a> : null
          )
        }, {
          cell: (
            <a className={styles.action_btn} onClick={() => {
              if (!disabled) {
                setDisabled(true);
                handleClickOrder(offer);
              }
            }}>
              {props.isBuy ? "Sell" : "Buy"}
            </a>
          )
        }];
      });
    }

    setTableData(data);
  }, [props.offers]);

  return (
    <div className={styles.digital_chart_table}>
      <div className={styles.digital_chart_title}>
        <RenderInputWithTooltip
          name={props.isBuy ? "Buying Offers" : "Selling Offers"}
          info={props.isBuy ? "Buying Offers" : "Selling Offers"}
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
          placeholderText="No offers"
        />
      </div>
      {status ? <AlertMessage key={status.key} message={status.msg} variant={status.variant} /> : ""}
    </div>
  );
};

export default DigitalChartTable;
