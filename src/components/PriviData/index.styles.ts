import { makeStyles } from "@material-ui/core";

export const priviDataStyles = makeStyles(theme => ({
  priviData: {
    height: '100vh',
    width: '100%',
    display: 'flex',
    flexDirection: 'column'
  },
  mainContainer: {
    display: 'flex',
    width: '100%',
    height: '100%',
    maxHeight: 'calc(100vh - 104px)',
  },
  content: {
    display: 'flex',
    width: '100%',
    height: '100%',
    flexDirection: 'column',
    maxHeight: 'calc(100vh - 104px)',
    overflow: 'hidden',
    '& ::-webkit-scrollbar': {
      width: 10,
    },
    '& ::-webkit-scrollbar-thumb': {
      width: 20,
      background: 'rgba(238, 241, 244, 1)'
    }
  }
}));
