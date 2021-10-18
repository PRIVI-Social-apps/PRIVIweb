import { makeStyles } from "@material-ui/core";

export const advertisePageStyles = makeStyles(theme => ({
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
    flexDirection: 'column',
    rowGap: 15,
    padding: '65px 0',
    width: '100%',
  },
  headerTitle: {
    fontWeight: 400,
    fontSize: 44,
    lineHeight: '120%',
    color: '#FFFFFF',
    position: 'relative',
    "& > .data-logo": {
      fontWeight: 800,
      color: '#EA88F2',
    },
    "& > .gradient-effect": {
      position: 'absolute',
      bottom: 70,
      left: 55,
    }
  },
  headerDescription: {
    fontSize: 18,
    lineHeight: '104.5%',
    color: '#FFFFFF80'
  },
  gradientImage: {
    width: 360,
    height: 485,
    background: 'linear-gradient(156.41deg, #FA18FF 11.7%, rgba(255, 255, 255, 0) 57.03%), radial-gradient(108.54% 138.74% at 86.8% 29.83%, rgba(238, 238, 238, 0) 0%, rgba(167, 54, 255, 0.096) 26.8%, rgba(14, 0, 255, 0.212) 73.32%, rgba(112, 0, 255, 0.384) 100%)',
    filter: 'blur(80px)',
    backdropFilter: 'blur(105px)',
    transform: 'rotate(180deg)',
    userSelect: 'none',

    "&.secondary": {
      background: 'linear-gradient(156.41deg, #1859FF 11.7%, rgba(255, 255, 255, 0) 57.03%), radial-gradient(108.54% 138.74% at 86.8% 29.83%, rgba(238, 238, 238, 0) 0%, rgba(206, 144, 255, 0.096) 26.8%, rgba(14, 0, 255, 0.212) 73.32%, rgba(112, 0, 255, 0.384) 100%)',
    }
  },
  finacingSection: {
    width: '100%',
    height: 248,
    padding: '35px 6%',
    background: '#17172D',
    borderRadius: 12,
    position: 'relative',
    overflow: 'hidden',
    "& > .ad-title": {
      fontSize: 20,
      lineHeight: '130%',
      color: '#92A6D9',
    },
    "& > .gradient-effect": {
      position: 'absolute',
      left: 300,
      top: 170,
    }
  },
  finacingContent: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: 40,
    "& .ad-title": {
      fontWeight: 600,
      fontSize: 20,
      lineHeight: '130%',
      textTransform: 'uppercase',
    },
    "& .ad-value": {
      fontSize: 32,
      lineHeight: '130%',
      color: '#FFFFFF',
    },
    "& .ad-unit": {
      paddingLeft: 15,
      opacity: 0.4,
    }
  }
}));
