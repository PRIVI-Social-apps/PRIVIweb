import { makeStyles } from "@material-ui/core";

export const headerStyles = makeStyles(theme => ({
  header: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    margin: '64px 0px',
    width: '100%',
    textAlign: 'center',
    '& h1': {
      margin: 0,
      fontFamily: 'Agrandir GrandLight',
      fontStyle: 'normal',
      fontWeight: 800,
      fontSize: 64,
      lineHeight: '83px',
      background: 'linear-gradient(94.24deg, #00bfff 1.46%, #8d2eff 57.51%, #ff00c1 105.94%)',
      '-webkit-background-clip': 'text',
      '-webkit-text-fill-color': 'transparent'
    },
    '& h2': {
      width: 600,
      color: 'white',
      margin: 0,
      fontFamily: 'Agrandir GrandLight',
      fontStyle: 'normal',
      fontWeight: 800,
      fontSize: '40px',
      lineHeight: '52px',
    },
    '& h5': {
      marginTop: 8,
      fontStyle: 'normal',
      fontWeight: 'normal',
      fontSize: 18,
      lineHeight: '24px',
      textAlign: 'center',
      letterSpacing: '0.04em',
      color: '#707582',
      marginBottom: 24,
    }
  }
}));
