import { makeStyles } from "@material-ui/core";

export const homePageStyles = makeStyles(theme => ({
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
    justifyContent: 'center',
    alignItems: 'center',
    rowGap: 15,
    padding: '65px 0',
    width: '100%',
  },
  headerTitle: {
    fontWeight: 400,
    fontSize: 44,
    lineHeight: '120%',
    textAlign: 'center',
    color: '#FFFFFF',
    position: 'relative',
    "& > .data-logo": {
      fontWeight: 800,
      color: '#EA88F2',
    },
    "& > .header-left-logo": {
      top: 0,
      right: 'calc(100% + 70px)',
      position: 'absolute',
    },
    "& > .header-right-logo": {
      position: 'absolute',
      left: 'calc(100% + 80px)',
      bottom: 0,
    },
    "& > .gradient-effect": {
      position: 'absolute',
      bottom: 65,
      right: 200,
    }
  },
  headerDescription: {
    fontSize: 18,
    lineHeight: '104.5%',
    textAlign: 'center',
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
  cardGroup: {
    width: '100%',
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    columnGap: 30,
    rowGap: 30,
    "& > div": {
      flex: 1,
      minWidth: 'calc(50% - 15px)',
      minHeight: 355,
      borderRadius: 12,
      padding: '116px 6% 46px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      position: 'relative',
    }
  },
  startCard: {
    background: 'linear-gradient(118.42deg, #EA88F2 12.03%, #A839FF 85.16%)',
    boxShadow: '0px 10px 28px rgba(0, 0, 0, 0.18)',
    "& .button-start-data": {
      background: '#181818',
      border: '1.5px solid #181818',
      boxShadow: '0px 15px 21px rgba(158, 18, 181, 0.4)',
    },
    "& .button-get-data": {
      border: '1px solid #FFFFFF',
      filter: 'drop-shadow(0px 15px 21px #9E12B5)',
    },
    "& > .card-logo": {
      position: 'absolute',
      top: -55,
      left: '6%',
    },
  },
  stackCard: {
    background: '#343268',
    boxShadow: '0px 10px 28px rgba(0, 0, 0, 0.18)',
    "& .button-stack-data": {
      background: '#7977D1',
      width: 200,
    },
    "& > .card-logo": {
      position: 'absolute',
      top: -35,
      left: '6%',
    }
  },
  finacingCard: {
    background: '#17172D',
    boxShadow: '0px 10px 28px rgba(0, 0, 0, 0.18)',
    overflow: 'hidden',
    "& > div": {
      position: 'relative'
    },
    "& .card-logo": {
      position: 'absolute',
      top: -80,
      left: 0,
      fontSize: 20,
      lineHeight: '130%',
      color: '#BA92D9',
    },
    "& > .gradient-effect": {
      position: 'absolute',
      bottom: 250,
      right: 425,
    }
  },
  helpCard: {
    background: '#17172D',
    boxShadow: '0px 10px 28px rgba(0, 0, 0, 0.18)',
    overflow: 'hidden',
    "& > div": {
      position: 'relative'
    },
    "& .card-logo": {
      position: 'absolute',
      top: -80,
      left: 0,
      fontSize: 20,
      lineHeight: '120%',
      color: '#92A6D9',
    },
    "& > .gradient-effect": {
      position: 'absolute',
      left: 250,
      top: 40,
    }
  },
  cardTitle: {
    fontWeight: 800,
    fontSize: 24,
    color: '#FFFFFF',
    lineHeight: '120%',
  },
  cardDescription: {
    fontSize: 18,
    lineHeight: '140%',
    display: 'flex',
    color: '#ECECF5',
    marginTop: 18,
  },
  cardButtons: {
    "& > div": {
      fontSize: 16,
      lineHeight: 21,
      color: '#FFFFFF',
      width: 170,
      height: 40,
      borderRadius: 46,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      cursor: 'pointer'
    }
  },
  helpStepGroup: {
    paddingTop: 25,
    borderTop: '1px solid #6C77A460',
    display: 'flex',
    alignItems: 'center',
    columnGap: 20,
  },
  helpStep: {
    width: 10,
    height: 10,
    borderRadius: '100%',
    border: '1.5px solid #707582',
    cursor: 'pointer',
    "&.selected": {
      background: '#B9D9FF',
      border: 'none',
    }
  },
  subTitle: {
    fontWeight: 800,
    fontSize: 22,
    lineHeight: '130%',
    color: '#FFFFFF',
  }
}));
