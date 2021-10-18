import { makeStyles } from "@material-ui/core";

export const subpageHeaderStyles = makeStyles(theme => ({
  headerContainer: {
    width: '100%'
  },
  fixedHeader: {
    position: 'fixed',
    zIndex: 0,
    height: 104,
    width: 'calc(100% - 10px)',
    right: 10
  },
  filter: {
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'flex-end',
    padding: '0px 24px 48px'
  },
  header: {
    width: '100%',
    zIndex: 1,
    position: 'relative',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    height: 225,
    minHeight: 225,
    maxHeight: 225,
    '& label': {
      fontStyle: 'normal',
      fontWeight: 800,
      fontSize: 14,
      lineHeight: '104.5%',
      marginBottom: 16
    },
    '& div > b': {
      margin: '0px 8px'
    },
    '& div > span': {
      margin: '0px 8px'
    }
  },
  albumImage: {
    width: 240,
    height: 240,
    marginRight: 24,
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
    backgroundPosition: 'center'
  },
  avatar: {
    width: 32,
    height: 32,
    minWidth: 32,
    borderRadius: '50%',
    marginRight: 6.6,
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
    backgroundPosition: 'center'
  },
  title: {
    display: 'flex',
    alignItems: 'center',
    fontStyle: 'normal',
    fontWeight: 800,
    fontSize: 50,
    lineHeight: '104.5%',
    color: '#ffffff',
    flex: 'none',
    order: 0,
    flexGrow: 0,
    margin: '0px 0px 8px',
  },
  transparentButton: {
    backgroundColor: 'transparent',
    border: '1.5px solid white',
    color: 'white',
    backdropFilter: 'blur(10px)',
    width: 'fit-content'
  }
}));
