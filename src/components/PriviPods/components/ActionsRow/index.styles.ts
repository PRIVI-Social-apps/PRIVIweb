import { makeStyles } from "@material-ui/core";

export const actionsRowStyles = makeStyles(theme => ({
  actions: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 48,
    '& > div:first-child button': {
      padding: 0,
      marginRight: 24,
    },
    '& button img': {
      height: 30
    },
    '& b': {
      margin: '0px 4px 0px 16px'
    },
    '& > div:last-child button': {
      marginLeft: 16,
      marginBottom: '0px !important'
    }
  },
  play: {
    background: 'linear-gradient(97.4deg, #23d0c6 14.43%, #00cc8f 85.96%)',
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.12)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 80,
    height: 80,
    borderRadius: 40,
    '& img': {
      height: 32,
      minHeight: 32
    }
  },
  likeIcon: {
    background: 'transparent',
    color: 'black'
  },
  shareIcon: {
    background: 'transparent',
    color: 'black'
  }
}));
