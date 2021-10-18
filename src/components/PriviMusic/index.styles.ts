import { makeStyles } from "@material-ui/core";

export const priviMusicStyles = makeStyles(theme => ({
  priviMusic: {
    height: '100vh',
    width: '100%'
  },
  contentContainer: {
    display: 'flex',
    width: '100%',
    height: '100%',
    maxHeight: 'calc(100vh - 120px - 104px)'
  },
  content: {
    display: 'flex',
    width: '100%',
    height: '100%',
    flexDirection: 'column',
    overflow: 'hidden',
    '&::-webkit-scrollbar': {
      width: 10
    },
    '&::-webkit-scrollbar-thumb': {
      width: 20,
      background: 'rgba(238, 241, 244, 1)'
    }
  },
  mainContainer: {
    display: 'flex',
    width: '100%',
    height: '100%',
    flexDirection: 'column'
  },
  arrows: {
    display: 'flex',
    alignItems: 'center',
    position: 'absolute',
    zIndex: 2,
    top: 35,
    left: 270,
    '& button': {
      background: 'transparent',
      borderRadius: 0,
      padding: 0,
    },
    '& button:first-child': {
      marginLeft: 30,
      marginRight: 42
    },
    '& button img': {
      width: 8,
      height: 16
    },
    '& button:disabled': {
      opacity: 0.5,
      cursor: 'not-allowed'
    },
    '& button:first-child img': {
      transform: 'rotate(180deg)'
    },
    '& button:last-child': {
      marginRight: 30
    }
  }
}));
