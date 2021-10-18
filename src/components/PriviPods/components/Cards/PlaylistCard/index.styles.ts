import { makeStyles } from "@material-ui/core";

export const playlistCardStyles = makeStyles(theme => ({
  card: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '0px 0px 16px',
    background: '#ffffff',
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.12)',
    minWidth: 175,
    height: 264,
    cursor: 'pointer'
  },
  album: {
    width: '100%',
    height: 175.46,
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    marginBottom: 16
  },
  title: {
    fontStyle: 'normal',
    fontWeight: 800,
    fontSize: 14,
    lineHeight: '104.5%',
    padding: '0px 20px',
    display: 'flex',
    alignItems: 'center',
    textAlign: 'center',
    color: '#181818'
  },
  description: {
    fontStyle: 'normal',
    fontWeight: 400,
    padding: '0px 20px',
    fontSize: 14,
    lineHeight: '120%',
    display: 'flex',
    alignItems: 'center',
    textAlign: 'center',
    color: '#707582'
  }
}));
