import { makeStyles } from "@material-ui/core";

export const headerStyles = makeStyles(theme => ({
  header: {
    zIndex: 2,
    // height: 84,
    // minHeight: 80,
    // maxHeight: 80,
    width: 'auto',
    display: 'flex',
    flexDirection: 'column',
    borderBottom: '1px #99a1b3 solid',
    '& .header-left': {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      flexGrow: 1
    },
    '& .header-left .header-logo': {
      display: 'none',
      width: 64,
      height: 64
    },
    '& .header-right': {
      display: 'flex',
      alignItems: 'center',
    },
    '& .header-right button': {
      minWidth: 'fit-content'
    },
    '& .header-input': {
      background: '#f7f8fa',
      border: '1px solid #99a1b3',
      borderRadius: 10,
      height: 56,
      padding: '0px 19px 0px 19px',
      display: 'flex',
      alignItems: 'center',
      width: 'auto',
      maxWidth: 400,
      flexGrow: 1
    },
    '& .header-icons': {
      flexGrow: 1,
      alignSelf: 'stretch',
      display: 'flex',
      justifyContent: 'flex-end',
      padding: '0 12px',
      [theme.breakpoints.down('sm')]: {
        padding: 0,
        paddingLeft: 12,
      },
    },
    '& .header-buttons': {
      display: 'flex',
      alignItems: 'center'
    },
    '& .header-title': {
      fontWeight: 'normal',
      fontSize: 20,
      lineHeight: 26,
      padding: 0,
      marginRight: 30
    },
    '& .header-searchbar': {
      background: '#f7f8fa',
      border: '1px solid #99a1b3',
      borderRadius: 10,
      height: 56,
      width: 400,
      padding: '0px 19px',
      display: 'flex',
      alignItems: 'center'
    },
    '& .header-button': {
      marginRight: 10,
    },
    '& .header-right .avatar-container': {
      marginLeft: 10,
      [theme.breakpoints.down('sm')]: {
        marginLeft: 0,
      },
    },
    '& .header-right .avatar-container .avatar': {
      width: 48,
      height: 48,
      borderRadius: '100%',
      position: 'relative',
      border: '2px solid #ffffff',
      boxSizing: 'content-box',
      boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.2)'
    },
    '& .header-right .avatar-container .avatar .online': {
      background: 'linear-gradient(97.4deg, #23d0c6 14.43%, #00cc8f 85.96%)',
      borderRadius: '50%',
      width: 12,
      height: 12,
      position: 'absolute',
      right: 0,
      bottom: -1,
      border: '2px solid white'
    },
    '& .header-right .avatar-container .avatar .offline': {
      color: 'gray',
      fontSize: 60,
      position: 'absolute',
      right: 0,
      bottom: -14,
      '-webkit-text-stroke-width': 2,
      '-webkit-text-stroke-color': '#ffffff',
    },
    '& .header-left .header-title': {
      display: 'none'
    },
    '& .header-input-art': {
      background: '#f9f9f9',
      border: '1px solid #eaeaea',
      borderRadius: 6,
      height: 40,
      padding: '0px 19px',
      display: 'flex',
      alignItems: 'center',
      width: 'auto',
      maxWidth: 400,
      flexGrow: 1,
    },
    // privi-app-header
    '& .privi-app-header': {
      borderBottom: 'none',
      height: 104,
      minHeight: 104,
      maxHeight: 104,
      display: 'flex',
      width: '100%',
      paddingLeft: 75,
      paddingRight: 32,
      [theme.breakpoints.down('sm')]: {
        paddingLeft: 24,
        paddingRight: 12,
      },
    },
    '& .privi-app-header.privi-data': {
      paddingLeft: 75,
      paddingRight: 32,
      backgroundColor: '#191837',
      [theme.breakpoints.down('sm')]: {
        paddingLeft: 24,
        paddingRight: 12,
      },
    },
    '& .privi-app-header.privi-dao': {
      backgroundColor: 'transparent',
    },
    '& .privi-app-header.privi-digital-art': {
      backgroundColor: 'transparent',
      paddingLeft: 0,
    },
    '& .privi-app-header.privi-digital-art .header-input': {
      paddingLeft: 24,
      marginLeft: 32
    },
    '& .privi-app-header.privi-music-dao': {
      [theme.breakpoints.down('xs')]: {
        height: 54,
        minHeight: 54,
        maxHeight: 54,
      }
    },
    '& .privi-app-header .header-input': {
      paddingLeft: 24
    },
    // transparent
    '& .transparent': {
      backgroundColor: 'transparent',
      display: 'flex',
      width: '100%',
    },
    '& .transparent *': {
      zIndex: 2
    },
    '& .transparent .header-input': {
      background: 'rgba(255, 255, 255, 0.3)',
      border: '1px solid #ffffff',
      boxSizing: 'border-box',
      color: '#ffffff',
    },
    '& .transparent .header-input ::placeholder': {
      color: '#ffffff'
    },
    '& .transparent .header-buttons button:first-child': {
      color: '#ffffff',
      border: '1.5px solid #ffffff',
      boxSizing: 'border-box',
      backdropFilter: 'blur(10px)',
      borderRadius: 6,
      backgroundColor: 'transparent'
    },
    '& .transparent .header-buttons button:last-child': {
      background: '#ffffff',
      color: '#181818',
    }
  },
  empty: {},
  header_secondary_button: {
    marginRight: 20,
  },
  appPopover: {
    padding: 24,
    background: '#ffffff',
    borderRadius: 20,
    boxShadow: '0px 24px 59px rgba(44, 50, 112, 0.19)',
    marginTop: 20,
    '& .itemBox': {
      display: 'flex',
      alignItems: 'center',
      padding: 20,
      borderRadius: 12,
      margin: 8,
      cursor: 'pointer'
    }
  },
  header_popup_arrow: {
    position: 'absolute',
    top: 21,
    left: 0,
    fontSize: 7,
    width: 20,
    height: 10,
    '&::before': {
      margin: 'auto',
      display: 'block',
      width: 0,
      height: 0,
      borderStyle: 'solid',
      borderWidth: '0 10px 10px 10px',
      borderColor: 'transparent transparent black transparent',
    }
  },
  header_popup_back: {
    borderRadius: 20,
    marginTop: 10,
    padding: '10px 20px',
    background: '#000000',
    color: '#ffffff'
  },
  header_popup_back_item: {
    cursor: 'pointer',
    textAlign: 'end',
    padding: 20,
    borderBottom: '1px solid #ffffff',
    '&:last-child': {
      borderBottom: 'none'
    }
  },
  musicApp: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    background: "#65CB63 !important",
    color: "#FFFFF !important",
    "& img": {
      marginLeft: 8,
    },
    [theme.breakpoints.down('sm')]: {
      marginLeft: 24,
      marginRight: 24,
      marginTop: 8,
    },
  },
  mobilePopup: {
    '& .avatar-container .avatar': {
      width: 34,
      height: 34,
      marginRight: 8,
      borderRadius: '100%',
      position: 'relative',
      border: '2px solid #ffffff',
      boxSizing: 'content-box',
      boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.2)'
    },
    '& .avatar-container .avatar .online': {
      background: 'linear-gradient(97.4deg, #23d0c6 14.43%, #00cc8f 85.96%)',
      borderRadius: '50%',
      width: 12,
      height: 12,
      position: 'absolute',
      right: 0,
      bottom: -1,
      border: '2px solid white'
    },
    '& .avatar-container .avatar .offline': {
      color: 'gray',
      fontSize: 60,
      position: 'absolute',
      right: 0,
      bottom: -14,
      '-webkit-text-stroke-width': 2,
      '-webkit-text-stroke-color': '#ffffff',
    },
    '& .MuiListItem-root.MuiMenuItem-root': {
      fontSize: 14,
      "& svg": {
        marginRight: 8,
      }
    }
  },
  navButton: {
    border: "1px solid #77788E",
    borderRadius: 32,
    padding: "0 16px",
    fontSize: 14,
    background: "transparent",
    color: "#77788E",
  },
  navContainer: {
    "& button": {
      marginLeft: 8,
      marginRight: 8,
    }
  }
}));
