import { makeStyles } from "@material-ui/core";

export const songRowStyles = makeStyles(theme => ({
  songImage: {
    width: 48,
    height: 48,
    marginRight: 24,
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
    backgroundPosition: 'center'
  },
  row: {
    '& button': {
      background: 'transparent',
      padding: 0,
      borderRadius: 0,
      marginRight: 20
    },
    '& button:last-child': {
      marginRight: 0
    }
  },
  paper: {
    minWidth: 197,
    marginLeft: -197,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.12)',
    "& .MuiListItem-root.MuiMenuItem-root > svg": {
      marginRight: 12,
    }
  }
}));
