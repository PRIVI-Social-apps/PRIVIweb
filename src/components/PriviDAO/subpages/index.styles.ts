import { makeStyles } from "@material-ui/core";

export const priviDAOSubPageStyles = makeStyles(theme => ({
  content: {
    width: '100%',
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    minHeight: 'calc(100vh - 104px)',
    maxHeight: 'calc(100vh - 104px)',
    position: 'relative',
    padding: '0px 80px 80px',
  },
  tickerWrapper: {
    width: '100%',
    '& > div': {
      width: '100%'
    },
    '& > div > div > div': {
      width: '280px !important',
      marginRight: 24,
    }
  },
  inputContainer: {
    alignSelf: 'center',
    padding: '24px 24px 22px 16px',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '80%',
    background: '#e4f8ff',
    borderRadius: 6,
    marginBottom: 120,
    '& input': {
      width: '100%',
      fontStyle: 'normal',
      fontWeight: 'normal',
      fontSize: 24,
      lineHeight: 31,
      color: '#181818',
      background: 'transparent',
      border: 'none',
      outline: 'none',
      padding: 0
    },
    '& img': {
      height: 34,
      width: 34
    }
  },
  title: {
    margin: '0px 48px'
  },
  cards: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: "100%",
    height: "100%",
    minHeight: "335px",
    marginBottom: 120,
    flexWrap: 'wrap',
    '& > div': {
      width: '100%',
      height: 'fit-content'
    }
  }
}));
