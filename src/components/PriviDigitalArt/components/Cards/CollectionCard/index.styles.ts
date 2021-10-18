import { makeStyles } from "@material-ui/core";

export const collectionCardStyles = makeStyles(theme => ({
  card: {
    minWidth: 276,
    minHeight: 300,
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    width: '100%',
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    borderRadius: 16,
  },
  image: {
    width: '100%',
    borderRadius: 16,
    height: 'auto',
    minHeight: 276,
    zIndex: 1
  },
  fixed: {
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundColor: '#c4c4c4',
    height: 276,
    maxHeight: 276,
  },
  info: {
    zIndex: 2,
    height: 53,
    display: 'flex',
    alignItems: 'center',
    margin: '-26.5px 16px 0px',
    width: 'calc(100% - 2 * 16px)',
    background: '#ffffff',
    padding: '8px 16px',
    boxShadow: '1px 2px 4px rgba(176, 176, 176, 0.24)',
    borderRadius: 8,
    justifyContent: 'center'
  },
  avatar: {
    backgroundColor: '#c4c4c4',
    width: 32,
    height: 32,
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    borderRadius: '50%',
    marginRight: 8,
  },
  black: {
    fontStyle: 'normal',
    fontWeight: 400,
    fontSize: 14,
    lineHeight: '120%',
    color: '#1a1b1c',
  },
  gray: {
    fontStyle: 'normal',
    fontWeight: 400,
    fontSize: 14,
    lineHeight: '120%',
    color: '#a4a4a4'
  }
}));
