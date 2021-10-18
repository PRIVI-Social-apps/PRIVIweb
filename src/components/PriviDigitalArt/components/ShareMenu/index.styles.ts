import { makeStyles } from "@material-ui/core";

export const shareMenuStyles = makeStyles(theme => ({
  root: {
    position: "inherit",
    zIndex: 999,
  },
  title: {
    fontSize: 18,
    color: '#1A1B1C'
  },
  optionCloseBtn: {
    width: 24,
    height: 24,
    backgroundColor: 'transparent',
    padding: 0,
    "& > img": {
      width: '12px !important',
    }
  },
  qrIcon: {
    width: 20,
    height: 20,
  },
  emojiText: {
    fontSize: 18,
    lineHeight: '120%'
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
