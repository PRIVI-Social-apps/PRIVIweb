import { makeStyles } from "@material-ui/core";

export const placeBidModalStyles = makeStyles(theme => ({
  title: {
    fontSize: 22
  },
  priceLabel: {
    fontSize: 18
  },
  price: {
    display: 'flex',
    alignItems: 'center',
    '& > div': {
      width: '30%'
    },
    '& > span': {
      marginLeft: 4,
      marginTop: 6
    }
  },
  priceInput: {
    width: 'calc(70% - 8px)',
    height: 46,
    marginRight: 8,
    background: '#F7F9FE',
    border: '1px solid #727F9A',
    boxSizing: 'border-box',
    borderRadius: 6,
    outline: 'none',
    padding: '0 12px'
  },
  hint: {
    fontSize: 14,
    color: '#707582',
    marginTop: 8
  },
  dividerDashed: {
    border: 'none',
    borderBottom: '1px dotted #949BAB',
    opacity: 0.2,
    margin: '16px 0'
  },
  bidStatus: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  topBid: {
    display: 'flex',
    flexDirection: 'column',
    '& span': {
      color: '#181818',
      fontSize: 22,
    }
  },
  auctionEnding: {
    display: 'flex',
    flexDirection: 'column'
  },
  auctionDateCount: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: 18,
    '& span': {
      color: "#181818",
      fontSize: 30,
    }
  },
  auctionTitle: {
    fontSize: 18,
    color: '#707582',
    width: '100%',
    paddingBottom: 8
  },
  actions: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16
  },
  primary: {
    background: '#1b1b1b',
    borderRadius: '4px !important'
  },
  secondary: {
    background: '#ffffff',
    border: '1px solid #cbcbcb !important',
    borderRadius: '4px !important'
  }
}));
