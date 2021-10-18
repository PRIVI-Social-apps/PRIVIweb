import { makeStyles } from "@material-ui/core";
import { Color } from "shared/ui-kit";

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
    background: 'linear-gradient(97.63deg, #A0D800 26.36%, #0DCC9E 80%)',
    boxShadow: '0px 15px 29px -4px rgba(21, 219, 17, 0.37)',
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
  },
  paper: {
    background: Color.White,
    boxShadow: "0px 47px 65px -11px rgba(36, 46, 60, 0.21)",
    borderRadius: 12,
    "& .MuiListItem-root.MuiMenuItem-root > svg": {
      marginRight: 12,
    }
  }
}));
