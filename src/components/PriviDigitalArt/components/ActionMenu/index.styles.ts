import { makeStyles } from "@material-ui/core";

export const actionMenuStyles = makeStyles(theme => ({
  root: {
    position: "inherit",
    zIndex: 999,
    "& .MuiList-padding": {
      paddingTop: 40,
    }
  },
  optionCloseBtn: {
    position: 'absolute',
    right: 16,
    top: 16,
    width: 24,
    height: 24,
    backgroundColor: 'transparent',
    padding: 0,
  },
  optionRed: {
    color: '#ED4956',
  },
  description: {
    color: '#A4A4A4',
    width: '100%',
    textAlign: 'center'
  },
  image: {
    width: 32,
    height: 32,
    marginRight: 5
  }
}));
