import { makeStyles } from "@material-ui/core";

export const priviPodsSubPageStyles = makeStyles(theme => ({
  page: {
    width: '100%',
    height: '100%',
    display: 'flex',
    overflowY: 'auto',
    flexDirection: 'column',
    alignItems: 'flex-start',
    minHeight: 'calc(100vh - 120px)',
    maxHeight: 'calc(100vh - 120px)',
    position: 'relative',
    overflowX: 'hidden'
  },
  pageHeader: {
    width: '100%',
    height: '100%',
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    minHeight: 'calc(100vh - 104px)',
    maxHeight: 'calc(100vh - 104px)',
    overflowX: 'hidden',
    position: 'relative'
  },
  content: {
    width: '100%',
    padding: '48px 24px 40px',
    display: 'flex',
    flexDirection: 'column',
    height: 'fit-content'
  },
  empty: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%',
    '& h4': {
      fontStyle: 'normal',
      fontWeight: 800,
      fontSize: 30,
      lineHeight: '104.5%',
      color: '#181818',
      margin: 0,
    },
    '& h5': {
      margin: '16px 0px 24px',
      fontStyle: 'normal',
      fontWeight: 400,
      fontSize: 18,
      lineHeight: '104.5%',
      color: '#181818'
    }
  },
  table: {
    width: '100%'
  },
  title: {
    display: 'flex',
    fontStyle: 'normal',
    fontWeight: 800,
    fontSize: 18,
    lineHeight: '104.5%',
    color: '#000000',
    marginBottom: 16,
    width: '100%',
    justifyContent: 'space-between',
    '& span': {
      fontStyle: 'normal',
      fontWeight: 800,
      fontSize: 11,
      color: '#707582',
      cursor: 'pointer'
    }
  },
  cards: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: 'calc(100% + 20px)',
    marginLeft: -10,
    marginTop: -10,
    marginBottom: 38,
    flexWrap: 'wrap',
    overflow: 'hidden',
    padding: '10px 5px',
    minHeight: 280,
    '& > div': {
      width: '100%'
    }
  },
  cardsHide: {
    maxHeight: 280,
    overflow: 'hidden'
  },
  genreCards: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: 'calc(100% + 20px)',
    marginLeft: -10,
    marginTop: -10,
    marginBottom: 38,
    flexWrap: 'wrap',
    overflow: 'hidden',
    padding: '10px 5px',
    minHeight: 142,
    '& > div': {
      width: '100%'
    }
  },
  genreCardsHide: {
    maxHeight: 142,
    overflow: 'hidden'
  },
  exploreCards: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: 'calc(100% + 20px)',
    marginLeft: -10,
    marginTop: -10,
    marginBottom: 38,
    flexWrap: 'wrap',
    overflow: 'hidden',
    padding: '10px 5px',
    minHeight: 185,
    '& > div': {
      width: '100%'
    }
  },
  exploreCardsHide: {
    maxHeight: 185,
    overflow: 'hidden'
  },
  artistInfo: {
    height: 567,
    marginBottom: 48,
    width: 'calc(100% + 24px * 2)',
    marginLeft: -24,
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    '& h4': {
      fontStyle: 'normal',
      fontWeight: 800,
      fontSize: 22,
      lineHeight: '104.5%',
      color: '#ffffff',
      margin: '0px 0px 16px'
    },
    '& p': {
      fontStyle: 'normal',
      fontWeight: 800,
      fontSize: 18,
      lineHeight: '27px',
      color: '#ffffff',
      margin: 0
    }
  },
  filter: {
    width: '100%',
    height: '100%',
    padding: '0px 40px 40px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.2)'
  },
  priviPlatform: {
    width: 132,
    cursor: 'pointer',
    marginBottom: 40
  },
  tab: {
    marginRight: 24,
    fontStyle: 'normal',
    fontWeight: 400,
    fontSize: 18,
    lineHeight: '104.5%',
    color: '#707582',
    opacity: 0.5,
    cursor: 'pointer'
  },
  selectedTab: {
    color: '#181818',
    opacity: 1
  },
  paper: {
    minWidth: 163,
    marginLeft: -15,
    borderRadius: 0,
    margintop: 5,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.12)'
  },
  searcher: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 8,
    width: 591,
    border: '1px solid #181818',
    boxSizing: 'border-box',
    borderRadius: 6,
    marginBottom: 45,
    alignSelf: 'center'
  },
  section: {
    width: '100%',
    height: '100vh',
    marginBottom: 44,
    '&:last-child': {
      marginBottom: 0
    }
  }
}));
