import React, { useEffect, useState } from 'react';
import {
  makeStyles,
} from '@material-ui/core/styles';
import BuyModal from './BuyModal';
import SellModal from './SellModal';
import DeleteOfferModal from './DeleteOfferModal';
import { useTypedSelector } from 'store/reducers/Reducer';
import { CustomTable, CustomTableCellInfo, CustomTableHeaderInfo } from 'shared/ui-kit/Table';

const useStyles = makeStyles({
  button: {
    padding: '10px 0px',
  },
});

const arePropsEqual = (prevProps, currProps) => {
  return (
    prevProps.offers == currProps.offers &&
    prevProps.podToken == currProps.podToken &&
    prevProps.type == currProps.type
  );
};

const Offers = React.memo((props: any) => {
  const classes = useStyles();
  const user = useTypedSelector((state) => state.user);
  //modal controller
  const [openBuyMap, setOpenBuyMap] = useState<{ [key: string]: boolean }>({});
  const [openSellMap, setOpenSellMap] = useState<{ [key: string]: boolean }>(
    {}
  );
  const [openDeleteOffer, setOpenDeleteOffer] = useState<boolean>(false);

  useEffect(() => {
    if (props.type == 'Buy') {
      const newListOpenBuy = {};
      props.offers.forEach((offer) => {
        newListOpenBuy[offer.offerId] = false;
      });
      setOpenBuyMap(newListOpenBuy);
    } else if (props.type == 'Sell') {
      const newListOpenSell = {};
      props.offers.forEach((offer) => {
        newListOpenSell[offer.offerId] = false;
      });
      setOpenSellMap(newListOpenSell);
    }
  }, [props.offers]);

  const handleOpenDeleteOffer = () => {
    setOpenDeleteOffer(true);
  };

  const handleCloseDeleteOffer = () => {
    setOpenDeleteOffer(false);
  };

  const tableHeaders: Array<CustomTableHeaderInfo> = [{
      headerName: ""
    }, {
      headerName: "TOKEN SYMBOL"
    }, {
      headerName: "PRICE"
    }, {
      headerName: "QUANTITY"
    }, {
      headerName: ""
    }
  ];
  const [tableData, setTableData] = useState<Array<Array<CustomTableCellInfo>>>([]);
  useEffect(() => {
    let data: Array<Array<CustomTableCellInfo>> = [];
    if (props.offers && props.offers.length) {
      data = props.offers.map((row) => {
        return [{
          cell: (
            row.token ? (
              <img
                src={require(`assets/tokenImages/${row.token}.png`)}
                alt={row.token}
              />
            ) : null
          )
        }, {
          cell: row.token ? row.token : 'N/A'
        }, {
          cell: row.price ? row.price : '0'
        }, {
          cell: row.amount ? row.amount : '0'
        }, {
          cell: (
            <>
              <div className="buttons">
                <button
                  onClick={() => {
                    if (props.type === 'Buy') {
                      const newOpenBuyMap = { ...openBuyMap };
                      newOpenBuyMap[row.offerId] = true;
                      setOpenBuyMap(newOpenBuyMap);
                    } else if (props.type === 'Sell') {
                      const newOpenSellMap = { ...openSellMap };
                      newOpenSellMap[row.offerId] = true;
                      setOpenSellMap(newOpenSellMap);
                    }
                  }}
                >
                  {props.type === 'Buy' ? 'Buy' : 'Sell'}
                </button>
                {row.trader === user.id ? (
                  <button className="delete" onClick={handleOpenDeleteOffer}>
                    Delete
                  </button>
                ) : null}
                <DeleteOfferModal
                  open={openDeleteOffer}
                  handleClose={handleCloseDeleteOffer}
                  handleRefresh={props.handleRefresh}
                  type={props.type}
                  offer={row}
                />
              </div>
              {props.type === 'Buy' ? (
                <BuyModal
                  open={openBuyMap[row.offerId] ?? false}
                  handleClose={() => {
                    const newOpenBuyMap = { ...openBuyMap };
                    newOpenBuyMap[row.offerId] = false;
                    setOpenBuyMap(newOpenBuyMap);
                  }}
                  offer={row}
                  podToken={props.podToken}
                  handleRefresh={props.handleRefresh}
                />
              ) : props.type === 'Sell' ? (
                <SellModal
                  open={openSellMap[row.offerId] ?? false}
                  handleClose={() => {
                    const newOpenSellMap = { ...openSellMap };
                    newOpenSellMap[row.offerId] = false;
                    setOpenSellMap(newOpenSellMap);
                  }}
                  offer={row}
                  podToken={props.podToken}
                  handleRefresh={props.handleRefresh}
                />
              ) : null}
            </>
          )
        }];
      });
    }

    setTableData(data);
  }, [props.offers, JSON.stringify(props.offers)]);

  return (
    <CustomTable
      headers={tableHeaders}
      rows={tableData}
      placeholderText="No offers to show"
    />
  );
}, arePropsEqual);

export default Offers;
