import { makeStyles } from "@material-ui/core";

export const advertiseModalStyles = makeStyles(theme => ({
  root: {},
  title: {
    margin: '0px 0px 40px',
    fontStyle: 'normal',
    fontWeight: 'bold',
    fontSize: 22,
    lineHeight: '104.5%',
    color: '#181818',
  },
  stepsBorder: {
    borderBottom: '1.5px solid #707582',
    width: 'calc(100% - 25px)',
    marginLeft: 10,
    marginTop: 18,
    marginBottom: -18,
  },
  steps: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 22,
    '& > div': {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      width: 'calc(100% / 4)',
      color: '#707582',
      fontWeight: 'normal',
      fontSize: 14,
    },
    '& > div:first-child': {
      alignItems: 'flex-start',
    },
    '& > div:last-child': {
      alignItems: 'flex-end',
    },
    '& > div button': {
      background: '#ffffff',
      border: '1.5px solid #707582',
      boxSizing: 'border-box',
      height: 34,
      width: 34,
      borderRadius: '50%',
      padding: 0,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 12,
      color: '#707582',
      fontSize: 14,
    },
    '& > div.selected button': {
      background: 'linear-gradient(97.4deg, #23d0c6 14.43%, #00cc8f 85.96%)',
      fontWeight: 'bold',
      color: '#ffffff',
      border: 'none',
    }
  },
  content: {
    display: 'flex',
    width: '100%',
    flexDirection: 'column',
    '& label': {
      fontFamily: 'Agrandir',
      fontStyle: 'normal',
      fontWeight: 'bold',
      fontSize: 18,
      lineHeight: '104.5%',
      color: '#181818',
      marginBottom: 8,
    },
    '& textarea': {
      height: 136,
      width: '100%',
      background: '#f7f9fe',
      border: '1px solid #e0e4f3',
      boxSizing: 'border-box',
      borderRadius: 8,
      color: '#707582',
      padding: 16,
    }
  },
  select: {
    marginBottom: '34px !important',
    fontStyle: 'normal',
    fontWeight: 'normal',
    fontSize: 14,
    lineHeight: '104.5%',
    color: '#181818',
    borderColor: '#c0c6dc',
    height: 40,
    maxHeight: 40,
    '& > div > div': {
      padding: '12px 12px 10px 16px'
    }
  },
  selected: {
    fontSize: 14,
    lineHeight: '120%',
    color: '#181818',
    '& button': {
      background: 'linear-gradient(97.4deg, #23d0c6 14.43%, #00cc8f 85.96%)',
      color: 'white',
      border: 'none',
    }
  },
  inputContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 25,
    background: '#f7f9fe',
    border: '1px solid #727f9a',
    boxSizing: 'border-box',
    borderRadius: 6,
    padding: '12px 16px 10px 12px',
    height: 40,
    '& input': {
      width: '100%',
      fontFamily: 'Agrandir',
      fontSize: 14,
      color: '#abb3c4',
    },
    '& img': {
      height: 17,
      width: 17,
    }
  },
  contentTile: {
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    padding: '12px 0px',
    borderBottom: '1px solid #eff2f8',
    justifyContent: 'space-between',
    borderTop: '1px solid #eff2f8',
    margin: '25px 0px',
  },
  userTile: {
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    padding: '12px 0px',
    borderBottom: '1px solid #eff2f8',
    justifyContent: 'space-between',
    '& img': {
      width: 16,
      height: 17,
      cursor: 'pointer'
    }
  },
  userAvatar: {
    marginRight: 14,
    border: '1.5px solid #ffffff',
    width: 32,
    height: 32,
    filter: 'drop-shadow(0px 2px 8px rgba(0, 0, 0, 0.2))',
    borderRadius: '50%',
    backgroundColor: '#707582',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  },
  cost: {
    marginTop: 16,
    borderBottom: '1px solid #eff2f8',
    paddingBottom: 14,
    '& img': {
      width: 18,
      height: 18,
      marginRight: 9.5,
    },
    '& span': {
      marginLeft: 14,
      background: 'linear-gradient(97.4deg, #23d0c6 14.43%, #00cc8f 85.96%)',
      '-webkit-background-clip': 'text',
      '-webkit-text-fill-color': 'transparent',
      cursor: 'pointer',
      borderBottom: '1px solid #23d0c7b4',
    }
  },
  buttons: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 25,
  },
}));
