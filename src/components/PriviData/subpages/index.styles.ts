import { makeStyles } from "@material-ui/core";

export const priviDataSubPageStyles = makeStyles(theme => ({
  content: {
    width: '100%',
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    minHeight: 'calc(100vh - 104px)',
    maxHeight: 'calc(100vh - 104px)',
    overflowX: 'hidden',
    position: 'relative',
    padding: '70px 64px 100px',
  },
  title: {
    fontFamily: 'Agrandir GrandLight',
    fontStyle: 'normal',
    fontWeight: 800,
    fontSize: 56,
    lineHeight: '48px',
    color: '#181818',
    marginTop: 0,
    marginBottom: 24
  },
  subtitle: {
    fontFamily: 'Agrandir',
    fontStyle: 'normal',
    fontWeight: 400,
    fontSize: 18,
    lineHeight: '104.5%',
    display: 'flex',
    alignItems: 'center',
    color: '#181818',
    marginTop: 0,
    marginBottom: 20,
    '& b': {
      marginLeft: 8
    }
  },
  title_medium: {
    fontFamily: 'Agrandir GrandLight',
    fontStyle: 'normal',
    fontWeight: 800,
    fontSize: 32,
    lineHeight: '104.5%',
    display: 'flex',
    alignItems: 'center',
    color: '#181818',
    margin: '0px 0px 38px'
  },
  infoPane: {
    width: '100%',
    borderBottom: '1px dashed hsla(0, 0%, 9%, 0.8)',
    paddingBottom: 40,
    '& h5': {
      margin: '0px 0px 12px',
      fontStyle: 'normal',
      fontWeight: 'normal',
      fontSize: 18,
      lineHeight: '104.5%',
      color: '#707582',
    },
    '& span': {
      marginTop: 6,
      fontStyle: 'normal',
      fontWeight: 400,
      fontSize: 18,
      lineHeight: '104.5%',
      color: '#707582'
    }
  },
  infoBox: {
    background: 'hsla(0, 0%, 77%, 0.2)',
    borderRadius: 20,
    display: 'flex',
    alignItems: 'center',
    height: '100%',
    padding: '24px 30px 24px 0px',
    '& img': {
      marginBottom: -50,
    },
    '& h5': {
      fontStyle: 'normal',
      fontWeight: 800,
      fontSize: 18,
      lineHeight: '104.5%',
      color: '#181818',
      margin: '0px 0px 18px'
    },
    '& p': {
      fontStyle: 'normal',
      fontWeight: 400,
      fontSize: 14,
      lineHeight: '104.5%',
      color: '#707582',
      margin: 0
    }
  },
  infoContainer: {
    '& title_small': {
      padding: '15px 0px 18px',
      borderBottom: '1px dashed hsla(0, 0%, 9%, 0.8)',
      borderTop: '1px solid hsla(0, 0%, 9%, 0.7)'
    }
  },
  graph: {
    width: '100%',
    marginTop: 50,
    background: '#ffffff',
    border: '1px solid #e0e4f3',
    boxSizing: 'border-box',
    borderRadius: 14,
    padding: '30px 26px 20px 24px'
  },
  selector: {
    background: '#ffffff',
    border: '1px solid #c0c6dc',
    boxSizing: 'border-box',
    borderRadius: 6,
    width: 158,
    height: 40,
    padding: '13px 10px 12px 16px'
  }
}));
