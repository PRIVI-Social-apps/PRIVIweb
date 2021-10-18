
import { makeStyles } from "@material-ui/core";

export const postProjectStyles = makeStyles(theme => ({
  root: {
    width: '640px !important',
    '& textarea': {
      height: 156,
      minHeight: 156,
    }
  },
  inputContainer: {
    border: '1px solid #ffffff',
    boxSizing: 'border-box',
    borderRadius: 0,
    fontStyle: 'normal',
    fontWeight: 400,
    fontSize: 14,
    lineHeight: '120%',
    color: 'white',
    padding: '18.5px 18px',
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    height: 56,
    justifyContent: 'space-between',
    background: 'rgba(255, 255, 255, 0.16)',
    '& > input': {
      padding: 0,
      fontFamily: 'Agrandir',
      width: 300,
      color: 'white',
    },
    '& > img': {
      width: 10,
      height: 10
    }
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: '50%',
    backgroundColor: '#d810d6'
  }
}));
