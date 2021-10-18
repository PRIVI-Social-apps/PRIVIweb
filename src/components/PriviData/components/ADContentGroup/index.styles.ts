import { makeStyles } from "@material-ui/core";

export const ADContentGroupStyles = makeStyles(theme => ({
  root: {
    width: '100%',
  },
  title: {
    fontWeight: 800,
    fontSize: 22,
    lineHeight: '130%',
    color: '#FFFFFF',
  },
  otherContent: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    columnGap: 10,
    background: 'linear-gradient(118.42deg, #EA88F2 12.03%, #A839FF 85.16%)',
    boxShadow: '0px 10px 28px rgba(0, 0, 0, 0.18)',
    borderRadius: 76,
    padding: '14px 36px',
    fontWeight: 600,
    fontSize: 12,
    lineHeight: '18px',
    color: '#FFFFFF'
  },
  ADContent: {
    width: 200,
    height: 235,
    position: 'relative',
    background: 'linear-gradient(180deg, rgba(34, 32, 82, 0.2) 38.05%, rgba(0, 0, 0, 0) 100%), rgba(23, 23, 45, 0.7)',
    borderRadius: 12,
    userSelect: 'none',
    "& .ad-category-title": {
      marginTop: 110,
      textAlign: 'center',
      textTransform: 'uppercase',
      fontWeight: 800,
      fontSize: 42,
      lineHeight: '120%',
      background: 'linear-gradient(0deg, #9D76F1 , #C3A7FF40)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      opacity: 0.1,
      letterSpacing: 4,
    },
    "& .ad-logo": {
      width: 200,
      height: 200,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'absolute',
      left: '50%',
      top: '50%',
      transform: 'translate(-50%, -60%)'
    }
  },
  ADButton: {
    marginTop: 35,
    fontWeight: 'bold',
    fontSize: 18,
    letterSpacing: 2,
    lineHeight: '130%',
    color: '#FFFFFF',
    textAlign: 'center',
    position: 'relative',
    userSelect: 'none',
    cursor: 'pointer',
    "& .ad-button-arrow": {
      position: 'absolute',
      right: 20,
      top: 3,
    }
  }
}));
