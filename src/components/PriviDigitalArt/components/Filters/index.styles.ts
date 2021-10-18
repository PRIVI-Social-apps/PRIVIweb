import { makeStyles } from "@material-ui/core";

export const filtersStyles = makeStyles(theme => ({
  filters: {
    display: 'flex',
    flexDirection: 'column',
    width: 209,
    minWidth: 209,
    maxWidth: 209,
    height: '100%',
    background: '#9eacf2',
    '& h4': {
      fontStyle: 'normal',
      fontWeight: 400,
      fontSize: 22,
      lineHeight: '104.5%',
      color: '#ffffff',
      margin: 0
    },
    '& h5': {
      fontStyle: 'normal',
      fontWeight: 800,
      fontSize: 18,
      lineHeight: '104.5%',
      margin: '0px 0px 16px',
      color: '#ffffff'
    },
    '& label': {
      color: '#ffffff',
    },
    '& label span': {
      color: '#ffffff',
    },
    '& label span div': {
      color: '#ffffff',
    },
  },
  content: {
    height: '100%',
    justifyContent: 'space-between',
    display: 'flex',
    flexDirection: 'column',
    maxHeight: 'calc(100vh - 104px)',
    padding: '24px 10px 16px',
    '& > div:first-child': {
      padding: '0px 10px',
    },
    '& > div:last-child': {
      padding: '0px 10px'
    },
    '& > div:last-child > button': {
      marginRight: '0px !important',
      marginLeft: '0px !important',
    },
    '& > div:last-child > button:first-child': {
      marginBottom: 24,
    },
    '& > div:first-child img': {
      width: 14,
      height: 14,
      cursor: 'pointer'
    },
    '&::-webkit-scrollbar': {
      width: 8,
    },
    '&::-webkit-scrollbar-thumb': {
      width: 20,
      background: 'rgba(238, 241, 244, 0.5)',
    }
  },
  options: {
    maxHeight: 'calc(100% - 100px)',
    overflowY: 'auto',
    padding: '0px 10px',
    marginBottom: 24,
  },
  divider: {
    margin: '24px 0px',
    opacity: 0.3,
    border: '0.5px solid #ffffff',
    width: '100%'
  },
  blockchainOption: {
    display: 'flex',
    alignItems: 'center',
    fontStyle: 'normal',
    fontWeight: 400,
    fontSize: 14.5,
    lineHeight: '104.5%',
    color: '#181818',
    border: '1px solid #ffffff',
    background: 'transparent',
    padding: '8.11px 10.21px',
    width: 'fit-content',
    marginBottom: 16,
    borderRadius: 36,
    cursor: 'pointer',
    '& img': {
      marginRight: 5,
      borderRadius: '50%',
      width: 20,
      height: 20
    }
  },
  blockchainSelected: {
    background: 'white',
    borderColor: 'white',
    color: 'black'
  },
  collectionItem: {
    display: 'flex',
    alignItems: 'center',
    color: 'white',
    fontStyle: 'normal',
    fontWeight: 400,
    fontSize: 14,
    lineHeight: '18px',
    maxWidth: 158,
    margin: '8px 0px',
    cursor: 'pointer',
    '& > div:first-child': {
      width: 32,
      height: 32,
      marginRight: 12,
      borderRadius: '50%',
      backgroundRepeat: 'no-repeat',
      backgroundSize: 'cover',
      backgroundPosition: 'center'
    },
    '& img': {
      width: 12,
      height: 12,
      marginLeft: 8
    }
  },
  searcher: {
    padding: '14.5px 0px 11.5px 15px',
    background: '#f7f9fe',
    border: '1px solid #e0e4f3',
    boxSizing: 'border-box',
    borderRadius: 10,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    '& input': {
      maxWidth: 100,
      width: 'fit-content',
      background: 'transparent',
      border: 'none',
      outline: 'none',
      padding: 0,
      fontFamily: 'Agrandir',
      fontStyle: 'normal',
      fontWeight: 400,
      fontSize: 18,
      lineHeight: '104.5%',
      color: '#abb3c4'
    },
    '& img': {
      width: 17,
      height: 17
    }
  },
  collectionItems: {
    display: 'flex',
    flexDirection: 'column',
    maxHeight: 152,
    overflowY: 'auto',
    marginTop: 16,
    '&::-webkit-scrollbar': {
      width: 5.25
    },
    '&::-webkit-scrollbar-track': {
      background: '#eff2f8'
    },
    '&::-webkit-scrollbar-thumb': {
      width: 5.25,
      background: '#ffffff'
    }
  }
}));
