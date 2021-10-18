import { makeStyles } from "@material-ui/core";

export const titleStyles = makeStyles(theme => ({
  title: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 60,
    '& img': {
      marginRight: -23,
      width: 58
    },
    '& h4': {
      fontFamily: 'Agrandir GrandLight',
      fontStyle: 'normal',
      fontWeight: 800,
      fontSize: 28,
      lineHeight: '36px',
      color: '#ffffff',
      margin: 0,
      textShadow: '0px 2px 14px rgba(0, 0, 0, 1)'
    },
    '& span': {
      background: 'linear-gradient(102.54deg, #00bfff -9.09%, #8d2eff 56.17%, #ff00c1 112.56%)',
      '-webkit-background-clip': 'text',
      '-webkit-text-fill-color': 'transparent',
      fontFamily: 'Agrandir GrandLight',
      cursor: 'pointer',
      fontStyle: 'normal',
      fontWeight: 800,
      fontSize: 14,
      lineHeight: '18px',
      display: 'flex',
      alignItems: 'center',
      textAlign: 'center',
      letterSpacing: '0.04em'
    }
  }
}));
