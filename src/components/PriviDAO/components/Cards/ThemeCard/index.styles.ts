import { makeStyles } from "@material-ui/core";

export const themeCardStyles = makeStyles(theme => ({
  card: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'column',
    width: '100%',
    '& .image': {
      width: '100%',
      paddingTop: '100%',
      backgroundRepeat: 'no-repeat',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    },
    '& h5': {
      fontFamily: 'Agrandir GrandLight',
      fontStyle: 'normal',
      fontWeight: 800,
      fontSize: 14,
      lineHeight: '18px',
      display: 'flex',
      alignItems: 'center',
      textAlign: 'center',
      letterSpacing: '0.04em',
      color: '#ffffff',
      margin: '16px 0px 0px',
    }
  },
}));
