import { makeStyles } from "@material-ui/core";

export const genreCardStyles = makeStyles(theme => ({
  card: {
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    width: '100%',
    height: 175,
    cursor: 'pointer'
  },
  filter: {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    padding: '8px 16px',
    backgroundColor: 'rgba(0, 0, 0, 0.2)'
  },
  smallfilter: {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '8px 16px',
    backgroundColor: 'rgba(0, 0, 0, 0.2)'
  },
  name: {
    fontStyle: 'normal',
    fontWeight: 800,
    fontSize: 40,
    lineHeight: '104.5%',
    color: '#ffffff'
  },
  smallname: {
    fontStyle: 'normal',
    fontWeight: 800,
    fontSize: 22,
    lineHeight: '104.5%',
    color: '#ffffff'
  }
}));
