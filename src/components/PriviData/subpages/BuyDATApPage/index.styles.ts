import { makeStyles } from "@material-ui/core";

export const buyDATApPageStyles = makeStyles(theme => ({
  root: {
    width: '100%',
    minHeight: '100%',
    display: 'flex',
    justifyContent: 'center',
    background: 'linear-gradient(0deg, #222145, #222145), linear-gradient(0deg, #26254B, #26254B), #FFFFFF',
    MsOverflowStyle: 'none',
    scrollbarWidth: 'none',
    overflowY: 'auto',
    fontFamily: 'Agrandir',
    "&::-webkit-scrollbar": {
      display: 'none',
    }
  },
  mainContainer: {
    width: '100%',
    maxWidth: 1105,
    margin: '0 25px',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '65px 0',
    width: '100%',
    position: 'relative',
    "& .gradient-effect": {
      position: 'absolute',
      bottom: 130,
      right: 150,
    },
    "& .first-header-image": {
      position: 'absolute',
      right: 300,
      top: 70,
      transform: 'rotate(90deg)',
    },
    "& .second-header-image": {
      position: 'absolute',
      right: 80,
      bottom: 70,
      width: 130,
      height: 130,
    }
  },
  headerTitle: {
    fontSize: 44,
    lineHeight: '120%',
    color: '#FFFFFF',
    "& .data-logo": {
      fontWeight: 800,
      color: '#EA88F2',
    }
  },
  gradientImage: {
    width: 360,
    height: 485,
    background: 'linear-gradient(156.41deg, #FA18FF 11.7%, rgba(255, 255, 255, 0) 57.03%), radial-gradient(108.54% 138.74% at 86.8% 29.83%, rgba(238, 238, 238, 0) 0%, rgba(167, 54, 255, 0.096) 26.8%, rgba(14, 0, 255, 0.212) 73.32%, rgba(112, 0, 255, 0.384) 100%)',
    filter: 'blur(80px)',
    backdropFilter: 'blur(105px)',
    transform: 'rotate(180deg)',
    userSelect: 'none',
  },
  tradeContainer: {
    padding: 25,
    background: 'linear-gradient(118.42deg, #EA88F2 12.03%, #A839FF 85.16%)',
    boxShadow: '0px 10px 28px rgba(0, 0, 0, 0.18)',
    borderRadius: 4,
    "& > img": {
      width: 200,
      height: 200,
    },
    "& > div": {
      position: 'relative',
    },
    "& .trade-title": {
      fontWeight: 800,
      fontSize: 22,
      lineHeight: '120%',
      color: '#FFFFFF'
    },
    "& .trade-value": {
      width: 132,
      height: 56,
      padding: '0 18px',
      border: 'none',
      fontSize: 18,
      lineHeight: '120%',
      background: '#F7F9FE',
      borderRadius: 12,
      "&:focus": {
        outline: 'none',
      }
    },
    "& .user-own-value": {
      fontSize: 14,
      lineHeight: '120%',
      color: '#FFFFFF',
      opacity: 0.8,
    },
    "& .use-max": {
      textDecoration: 'underline'
    }
  },
  currencyUnit: {
    width: 142,
    height: 56,
    background: '#FFFFFF',
    borderRadius: 12,
    padding: '12px 10px',
  },
  dropdownItem: {
    display: 'flex',
    alignItems: 'center',
    columnGap: 8,
    fontWeight: 'bold',
    fontSize: 14,
    lineHeight: '105%',
    color: '#181818',
    "& > img": {
      width: 36,
      minWidth: 36,
      height: 36,
      borderRadius: '100%',
    },
  },
  dropdownContent: {
    transition: 'all 1s ease-in-out',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    padding: '12px 10px',
    borderRadius: 12,
    background: '#FFFFFF',
    zIndex: 1,
    "& > div": {
      marginBottom: 5,
    },
    "& > div:last-child": {
      marginBottom: 0,
    }
  },
  exchangeButton: {
    width: 56,
    minWidth: 56,
    height: 56,
    borderRadius: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    background: '#181818',
    cursor: 'pointer',
    boxShadow: '0px 15px 21px rgba(158, 18, 181, 0.3)',
    "& .ex-arrwo-right": {
      transform: 'rotate(180deg)'
    }
  },
  tradeButton: {
    width: 220,
    height: 56,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    background: '#181818',
    boxShadow: '0px 15px 21px rgba(158, 18, 181, 0.4)',
    borderRadius: 46,
    fontWeight: 'bold',
    fontSize: 16,
    color: '#FFFFFF',
    cursor: 'pointer'
  },
  dataInfo: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    rowGap: 18,
    "& .data-title": {
      fontWeight: 800,
      fontSize: 22,
      lineHeight: '120%',
      color: 'rgba(255, 255, 255, 0.9)'
    },
    "& .data-content": {
      padding: '22px 0',
      borderTop: '1px dashed rgba(152, 146, 217, 0.64)',
      borderBottom: '1px dashed rgba(152, 146, 217, 0.64)',
      display: 'flex',
      columnGap: 50,
    },
    "& .data-field": {
      fontSize: 18,
      lineHeight: '105%',
      color: '#92A6D9',
      "&.positive": {
        color: '#65CB63',
      },
      "&.negetive": {
        color: '#FF377F',
      }
    },
    "& .data-value": {
      fontSize: 32,
      lineHeight: '105%',
      color: 'rgba(255, 255, 255, 0.9)',
    }
  },
  dataGraphContainer: {
    width: '100%',
    background: 'linear-gradient(180deg, rgba(35, 34, 80, 0.2) 0%, rgba(0, 0, 0, 0) 100%), #17172D',
    borderRadius: 4,
    marginTop: 40,
    padding: '18px 30px',
    "& .graph-title": {
      fontWeight: 'bold',
      fontSize: 18,
      lineHeight: '105%',
      color: '#FFFFFF'
    }
  },
  graphControlButtons: {
    background: '#38375430',
    borderRadius: 77,
    padding: '4px 6px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    cursor: 'pointer',
    "& > div": {
      width: 50,
      minWidth: 50,
      height: 32,
      color: '#E1DCFF',
      fontSize: 14,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      "&.selected": {
        color: '#E1DCFF',
        fontWeight: 600,
        background: '#383754',
        borderRadius: '77px',
      }
    }
  }
}));
