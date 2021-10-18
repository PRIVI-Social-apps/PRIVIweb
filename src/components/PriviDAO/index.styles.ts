import { makeStyles } from "@material-ui/core";

export const priviDAOStyles = makeStyles(theme => ({
  priviDAO: {
    height: '100vh',
    minHeight: '100vh',
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: 'black',
  },
  content: {
    display: 'flex',
    width: '100%',
    height: '100%',
    flexDirection: 'column',
    maxHeight: 'calc(100vh - 104px)',
    overflow: 'hidden',
    '&::-webkit-scrollbar': {
      width: 10,
    },
    '&::-webkit-scrollbar-thumb': {
      width: 20,
      background: 'rgba(238, 241, 244, 1)'
    },
  },
  mainContainer: {
    display: 'flex',
    width: '100%',
    height: '100%',
    maxHeight: 'calc(100vh - 104px)'
  }
}));
