import { makeStyles } from "@material-ui/core";

export const artistCardStyles = makeStyles(theme => ({
  card: {
    borderRadius: 16,
    minWidth: 276,
    height: 368,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.12)',
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-end',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    '& button': {
      border: '1.5px solid #ffffff',
      fontStyle: 'normal',
      fontWeight: 800,
      fontSize: 14,
    }
  },
  filter: {
    width: '100%',
    height: 120,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-end',
    background: 'linear-gradient(180deg, rgba(24, 24, 24, 0) 0%, #181818 100%)',
    borderRadius: '0px 0px 16px 16px',
    padding: 16,
    color: 'white',
    fontSize: 14,
    fontWeight: 400
  },
  follow: {
    background: 'white',
    color: '#181818',
  },
  unfollow: {
    background: 'transparent',
    color: 'white'
  }
}));
