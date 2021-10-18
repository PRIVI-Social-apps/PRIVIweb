import { makeStyles } from "@material-ui/core";

export const AdvertiseCardStyles = makeStyles(theme => ({
  root: {
    width: 345,
    height: 450,
    background: 'rgba(23, 23, 45, 0.7)',
    borderRadius: 12,
    padding: '40px 27px',
    cursor: 'pointer'
  },
  title: {
    fontWeight: 'bold',
    fontSize: 18,
    lineHeight: '130%',
    color: '#FFFFFF',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    "& svg path": {
      opacity: 1,
    }
  },
  adImage: {
    width: '100%',
    height: 120,
    boxShadow: '0px 5.46139px 15.2919px rgba(0, 0, 0, 0.18)',
    borderRadius: 8,
    marginTop: 24,
  },
  cardInfo: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '20px 0',
    borderBottom: '1px solid #353856',
    "& .ad-title": {
      fontWeight: 500,
      fontSize: 14,
      lineHeight: '120%',
      color: '#AFACD7'
    },
    "& .ad-value": {
      fontWeight: 'bold',
      fontSize: 16,
      lineHeight: '130%',
      color: '#FFFFFF'
    },
    "& .ad-unit": {
      paddingLeft: 5,
      opacity: 0.4,
    },
    "&:last-child": {
      border: 'none'
    }
  }
}));
