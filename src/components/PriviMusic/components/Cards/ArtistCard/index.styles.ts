import { makeStyles } from "@material-ui/core";

export const artistCardStyles = makeStyles(theme => ({
  card: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '12px 20px 16px',
    background: '#ffffff',
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.12)',
    minWidth: 175,
    height: 264,
    cursor: 'pointer'
  },
  avatar: {
    width: 115,
    height: 115,
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    marginBottom: 12,
    borderRadius: '50%'
  },
  name: {
    fontStyle: 'normal',
    fontWeight: 800,
    fontSize: 14,
    lineHeight: '104.5%',
    display: 'flex',
    alignItems: 'center',
    textAlign: 'center',
    marginBottom: 8,
    color: '#181818'
  },
  followers: {
    fontStyle: 'normal',
    fontWeight: 400,
    fontSize: 14,
    lineHeight: '120%',
    display: 'flex',
    alignItems: 'center',
    textAlign: 'center',
    color: '#707582',
    marginBottom: 8,
  }
}));
