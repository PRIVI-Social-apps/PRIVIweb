import { makeStyles } from "@material-ui/core";

export const advertiseDetailPageStyles = makeStyles(theme => ({
  root: {
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    background: 'linear-gradient(0deg, #222145, #222145), linear-gradient(0deg, #26254B, #26254B), #FFFFFF',
    MsOverflowStyle: 'none',
    scrollbarWidth: 'none',
    overflowY: 'auto',
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
      bottom: 100,
      left: 150,
    }
  },
  backLink: {
    display: 'flex',
    alignItems: 'center',
    color: '#AFACD7',
    fontWeight: 'bold',
    fontSize: 14,
    columnGap: 5,
    cursor: 'pointer',
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
  audianceButton: {
    padding: '13px 58px',
    background: 'linear-gradient(0deg, #BA50FC, #BA50FC), #7977D1',
    mixBlendMode: 'normal',
    borderRadius: 48,
    fontWeight: 'bold',
    fontSize: 16,
    lineHeight: '21px',
    color: '#FFFFFF',
  },
  adContent: {
    width: '100%',
    background: 'linear-gradient(0deg, #31305D, #31305D), linear-gradient(0deg, #343268, #343268)',
    borderRadius: '4px 4px 0 0',
    marginTop: 40,
    padding: 60,
    color: '#FFFFFF',
    "& .ad-title": {
      fontWeight: 'bold',
      fontSize: 18,
      lineHeight: '130%',
      color: '#FFFFFF',
      opacity: 0.7,
    },
    "& .ad-field": {
      fontWeight: 600,
      fontSize: 18,
      lineHeight: '130%',
      textTransform: 'uppercase',
      color: '#A5A3CD',
    },
    "& .ad-value": {
      fontSize: 32,
      lineHeight: '130%',
      color: '#FFFFFF',
    },
    "& .ad-unit": {
      fontSize: 32,
      lineHeight: '130%',
      paddingLeft: 10,
      opacity: 0.4,
    },
    "& .ad-image": {
      height: 225,
      background: 'rgba(23, 23, 45, 0.5)',
      borderRadius: 12,
      padding: 30,
      fontWeight: 500,
      fontSize: 14,
      lineHeight: '150%',
      color: '#E0DFF0',
    }
  },
  adImage: {
    height: 225,
    background: 'rgba(23, 23, 45, 0.5)',
    borderRadius: 12,
  },
  adContentHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontWeight: 800,
    fontSize: 22,
    lineHeight: '130%',
    color: '#FFFFFF',
    borderBottom: '1px solid rgba(242, 242, 242, 0.2)',
    paddingBottom: 20,
    "& .collabs": {
      fontSize: 16,
      lineHeight: '130%',
    }
  },
  adInfoGroup: {
    "& > div": {
      minWidth: 325,
    }
  },
  viewerListContainer: {
    width: '100%',
    padding: '60px 90px',
    background: '#282754',
    borderRadius: '0 0 4px 4px'
  },
  viewerListTitle: {
    fontWeight: 800,
    fonSize: 22,
    lineHeight: '130%',
    color: '#FFFFFF'
  },
  viewButton: {
    padding: '5px 14px',
    fontWeight: 600,
    fontSize: 12,
    lineHeight: '18px',
    color: '#FFFFFF',
    background: 'rgba(85, 84, 125, 0.42)',
    borderRadius: 100,
    cursor: 'pointer',
    "&.selected": {
      background: 'linear-gradient(0deg, #BA50FC, #BA50FC), #7977D1',
    }
  },
  viewerItem: {
    padding: '15px 0',
    borderBottom: '1px solid rgba(242, 242, 242, 0.2)',
    "&:last-child": {
      border: 'none',
    },
    "& .viwer-image": {
      width: 30,
      height: 30,
      borderRadius: '100%',
      border: '2px solid #FFFFFF',
    },
    "& .viewer-name": {
      fontWeight: 'bold',
      fontSize: 14,
      lineHeight: '100%',
      color: '#FFFFFF',
      paddingLeft: 15,
    },
    "& .viewer-user-id": {
      fontSize: 14,
      lineHeight: '100%',
      color: '#E0DFF0',
      paddingLeft: 25,
    },
    "& .viewer-status": {
      fontSize: 16,
      lineHeight: '100%',
      color: '#E0DFF0'
    }
  }
}));
