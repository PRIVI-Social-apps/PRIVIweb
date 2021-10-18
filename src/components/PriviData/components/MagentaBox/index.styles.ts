import { makeStyles } from "@material-ui/core";

export const magentaBoxStyles = makeStyles(theme => ({
  box: {
    display: 'flex',
    alignItems: 'center',
    background: 'linear-gradient(97.4deg, #ff79d1 14.43%, #db00ff 79.45%)',
    borderRadius: 14,
    padding: '38px 16px',
    position: 'relative',
    width: '100%',
    margin: '48px 0px 50px',
    '& h5': {
      fontFamily: 'Agrandir GrandLight',
      fontStyle: 'normal',
      fontWeight: 800,
      fontSize: 22,
      lineHeight: '120%',
      display: 'flex',
      alignItems: 'flex-end',
      color: '#ffffff',
      marginTop: 0,
      marginBottom: 9,
    },
    '& p': {
      marginTop: 0,
      fontFamily: 'Agrandir GrandLight',
      fontStyle: 'normal',
      fontWeight: 'normal',
      fontSize: 22,
      lineHeight: '120%',
      color: '#ffffff',
      marginBottom: 20,
    },
    '& input': {
      background: '#f7f9fe',
      border: '2px solid #ff7ad2',
      boxSizing: 'border-box',
      borderRadius: 10,
      fontFamily: 'Agrandir',
      fontStyle: 'normal',
      fontWeight: 400,
      fontSize: 18,
      lineHeight: '120%',
      color: '#707582',
      width: '-webkit-fill-available',
      height: 52,
      padding: '18.5px 18.5px 15.5px',
      minWidth: 120,
    },
    '& div span': {
      fontStyle: 'normal',
      fontWeight: 'normal',
      fontSize: 14,
      lineHeight: '120%',
      color: '#ffffff',
      opacity: 0.8
    }
  },
  monkeyIcon: {
    marginTop: -30,
    marginLeft: 30,
    marginRight: 60,
    '& svg': {
      width: 100,
      marginBottom: -10,
    }
  },
  walletIcon: {
    marginTop: -90,
    marginRight: 20,
    '& img': {
      transform: 'rotate(-6deg)',
      marginBottom: -30,
    },
    '& svg': {
      width: 144,
      marginBottom: -2
    }
  },
  buy: {
    flexDirection: 'column',
    alignItems: 'center',
    '& > div': {
      width: '100%',
      marginBottom: 20,
    },
    '&:nth-child(3)': {
      marginTop: 0
    },
    '& > button:last-child': {
      marginLeft: 22,
      height: 56,
      marginTop: 7
    }
  },
  select: {
    background: '#ffffff',
    borderRadius: 6,
    height: 56,
    width: '-webkit-fill-available',
    minWidth: 120,
    '& > div': {
      height: '100%',
      background: 'transparent !important',
      border: 'none !important',
      fontStyle: 'normal',
      fontWeight: 800,
      fontSize: 14,
      lineHeight: '104.5%',
      color: '#181818',
    }
  },
  underline: {
    cursor: 'pointer',
    textDecorationLine: 'underline'
  },
  buttonSwap: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: '50%',
    background: '#181818',
    border: '1.5px solid #181818',
    boxSizing: 'border-box',
    boxShadow: '0px 15px 21px #9e12b5',
    margin: '5px 16px 10px',
    height: 56,
    minWidth: 56,
    width: 56,
    padding: '0px 15px',
    '& img': {
      height: 10,
    },
    '& img:last-child': {
      transform: 'rotate(180deg)'
    }
  },
  primary: {
    boxShadow: '0px 15px 21px #9e12b5'
  },
  secondary: {
    borderColor: 'white !important',
    color: 'white !important',
    background: 'transparent !important',
    filter: 'drop-shadow(0px 15px 21px #9e12b5)',
  }
}));
