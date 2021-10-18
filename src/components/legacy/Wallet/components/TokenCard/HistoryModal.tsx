import React, { useState, useEffect } from 'react';
import AlertMessage from 'shared/ui-kit/Alert/AlertMessage';
import './TokenCard.css';
import { Modal } from '@material-ui/core';
import 'shared/ui-kit/Modal/Modals/Modal.css';
import './HistoryModal.css';
import URL from 'shared/functions/getURL';
import { CustomTable, CustomTableCellInfo, CustomTableHeaderInfo } from 'shared/ui-kit/Table';

export default function HisotryModal(props) {
  const [status, setStatus] = React.useState<any>('');

  const [datedList, setDatedList] = useState<any[]>([]);

  useEffect(() => {
    if (props.token.history && props.token.history.length > 0) {
      const historySorted = [...props.token.history];
      historySorted.sort((a, b) => b.date - a.date);

      const sortedList = [] as any;

      historySorted.forEach((elem) => {
        let day =
          new Date(elem.date).getDate() < 10
            ? `0${new Date(elem.date).getDate()}`
            : new Date(elem.date).getDate();
        let month =
          new Date(elem.date).getMonth() + 1 < 10
            ? `0${new Date(elem.date).getMonth() + 1}`
            : new Date(elem.date).getMonth() + 1;
        let year = new Date(elem.date).getFullYear();

        sortedList.push({
          event: elem.event,
          unit_price: elem.unit_price,
          unit_price_token: elem.unit_price_token,
          quantity: elem.quantity,
          from: elem.from,
          to: elem.to,
          date: `${day}.${month}.${year}`,
        });
      });

      setDatedList(sortedList);
    }
  }, [props.history]);

  const tableHeaders: Array<CustomTableHeaderInfo> = [{
      headerName: "EVENT"
    }, {
      headerName: "UNIT PRICE"
    }, {
      headerName: "QUANTITY"
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
    let data: Array<Array<CustomTableCellInfo>> = [];
    if (datedList && datedList.length) {
      data = datedList.map((row) => {
        return [{
          cell: row.event
        }, {
          cell: `${row.unit_price} ${row.unit_price_token}`
        }, {
          cell: row.quantity
        }, {
          cell: row.from
        }, {
          cell: row.to
        }, {
          cell: (
            <div style={{ color: 'rgba(101, 110, 126, 0.7)' }}>
              {row.date}
            </div>
          )
        }];
      });
    }

    setTableData(data);
  }, [datedList]);

  return (
    <Modal
      open={props.open}
      onClose={props.handleClose}
      aria-labelledby="simple-modal-title"
      aria-describedby="simple-modal-description"
      className="modal"
    >
      <div className="modal-content w50 history-modal">
        <div className="exit" onClick={props.handleClose}>
          <img
            src={require('assets/icons/x_darkblue.png')}
            alt={'x'}
          />
        </div>
        <div className="title">
          <div className="left">
            <div
              className="token-image"
              style={{
                backgroundImage:
                  props.token.Chain === 'PRIVI'
                    ? // privi wallet
                      props.token.Type === 'CRYPTO'
                      ? `url(${require(`assets/tokenImages/${props.token.Token}.png`)})`
                      : `url(${URL()}/wallet/getTokenPhoto/${
                          props.token.Token
                        })`
                    : // eth wallet
                      `url(${props.token.ImageUrl})`,
                backgroundRepeat: 'no-repeat',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            />
          </div>
          <div className="right">
            <p>{`${props.token.TokenName} token`}</p>
            <div className="bottom">
              <div className="elem">
                <span>Quantity</span>
                <p>{`${props.token.Balance} ${props.token.TokenName}`}</p>
              </div>
              <div className="elem">
                <span>Daily Change</span>
                <p className="change">
                  {props.token.daily_change
                    ? `+${props.token.daily_change * 100}%`
                    : 'N/A'}
                </p>
              </div>
              <div className="elem">
                <span>Token type</span>
                <p>{props.token.Type}</p>
              </div>
            </div>
          </div>
        </div>
        <div className="table">
          <CustomTable
            headers={tableHeaders}
            rows={tableData}
            placeholderText="No trading history to show"
          />
        </div>

        {status ? (
          <AlertMessage
            key={status.key}
            message={status.msg}
            variant={status.variant}
          />
        ) : (
          ''
        )}
      </div>
    </Modal>
  );
}
