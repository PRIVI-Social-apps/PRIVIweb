import React, { useEffect, useState, useRef } from "react";

import classnames from "classnames";
import { Typography, Avatar } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { handleSetStatus, buildJsxFromObject } from "shared/functions/commonFunctions";
import { useTypedSelector } from "store/reducers/Reducer";
import { CustomTable, CustomTableCellInfo, CustomTableHeaderInfo } from "shared/ui-kit/Table";
import Box from 'shared/ui-kit/Box';
import { SignatureRequestModal } from "shared/ui-kit/Modal/Modals";
import { sellFromOffer, IBuySellFromOffer } from "shared/services/API";

const useStyles = makeStyles(() => ({
  offerBorder: {
    borderBottom: "1px solid #18181810",
  },
  ownerAvatarImg: {
    width: 32,
    height: 32,
  },
  tokenImg: {
    width: 24,
    height: 24,
  },
  username: {
    background: "-webkit-linear-gradient(#23D0C6 100%, #00CC8F 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    fontSize: 14,
  },
  link: {
    cursor: "pointer",
  },
  tableWrapper: {
    marginTop: 16,
    marginBottom: 20,
  }
}));

export const SaleOfferTable = ({isOwner, offerList, media, setStatus, handleRefresh}) => {
  const user = useTypedSelector(state => state.user);
  const classes = useStyles();
  const [tableData, setTableData] = useState<Array<Array<CustomTableCellInfo>>>([]);

  const payloadRef = useRef<any>({});
  const [openSignRequestModal, setOpenSignRequestModal] = useState<boolean>(false);
  const [signRequestModalDetail, setSignRequestModalDetail] = useState<any>(null);

  const handleOpenSignatureModal = (offerId) => {
    const payload: IBuySellFromOffer = {
      ExchangeId: media.ExchangeData.Id,
      OfferId: offerId,
      Address: user.address,
      Amount: media.ExchangeData.InitialAmount
    }
    payloadRef.current = payload;
    setSignRequestModalDetail(buildJsxFromObject(payload));
    setOpenSignRequestModal(true);
  }

  const handleConfirmSign = async () => {
    try {
      const payload = payloadRef.current;
      if (Object.keys(payload).length) {
        const resp = await sellFromOffer(payload, {});
        if (resp && resp.success) {
          handleSetStatus('Sold successfully', 'success', setStatus);

            setTimeout(() => {
              handleRefresh();
            }, 1000);
        }
        else handleSetStatus('Sell failed', 'error', setStatus);
      }
    }
    catch (e) {
      handleSetStatus('Sell failed: ' + e, 'error', setStatus);
    }
  };

  const [tableHeaders, setTableHeaders] = useState<Array<CustomTableHeaderInfo>>([]);
  useEffect(() => {
    const headers: Array<CustomTableHeaderInfo> = [
      {
        headerName: "FROM"
      }, {
        headerName: "TOKEN",
        headerAlign: "center",
      }, {
        headerName: "SYMBOL",
        headerAlign: "center",
      }, {
        headerName: "PRICE",
        headerAlign: "center",
      }
    ];
    if (isOwner) {
      headers.push({
        headerName: ""
      });
    }

    setTableHeaders(headers);
  }, [isOwner]);

  useEffect(() => {
    let data: Array<Array<CustomTableCellInfo>> = [];
    if (offerList && offerList.length) {
      data = offerList.map((item) => {
        const row: Array<CustomTableCellInfo> = [{
          cell: (
            <Box display="flex" alignItems="center" gridColumnGap={9}>
              <Avatar className={classes.ownerAvatarImg} alt={item.name} src={item.imageUrl} />
              <Typography className={classes.username}>@{item.twitter != '' ? item.twitter: item.name}</Typography>
            </Box>
          )
        }, {
          cell: (
            <Box display="flex" justifyContent="center">
              <Avatar className={classes.tokenImg} alt={item.OfferToken} src={item.OfferToken ? require(`assets/tokenImages/${item.OfferToken}.png`):'none'} />
            </Box>
          ),
          cellAlign: "center",
        }, {
          cell: item.OfferToken,
          cellAlign: "center",
        }, {
          cell: item.Price,
          cellAlign: "center",
        }];
        if (isOwner) {
          row.push({
            cell: (
              (media.ExchangeData && media.ExchangeData.Status != 'Sold' && media.ExchangeData.Status != 'Cancelled')
              ? <Typography className={classnames(classes.link, classes.username)} onClick={() => handleOpenSignatureModal(item.Id)}>Sell</Typography>
              : <></>
            ),
            cellAlign: "center"
          });
        }
        return row;
      });
    }
    setTableData(data);
  }, [offerList, isOwner])

  return (
    <Box mt={4}>
       <SignatureRequestModal
          open={openSignRequestModal}
          address={user.address}
          transactionFee="0.0000"
          detail={signRequestModalDetail}
          handleOk={handleConfirmSign}
          handleClose={() => setOpenSignRequestModal(false)}
        />
      <Box fontWeight={700} fontSize={18} color="#181818">
        Offers
      </Box>
      <div className={classes.tableWrapper}>
        <CustomTable
          headers={tableHeaders}
          rows={tableData}
          placeholderText="No offers"
        />
      </div>
    </Box>
  );
};
