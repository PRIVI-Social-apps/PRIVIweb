import { makeStyles } from "@material-ui/core";

export const freeZoneIndicatorStyles = makeStyles(theme => ({
  freeZone: {
    marginLeft: 16,
    width: 40,
    height: 40,
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'rgba(255, 255, 255, 0.3)',
    color: '#ffffff',
    fontSize: 16,
    '& img': {
      marginLeft: 4,
      height: 17
    }
  }
}));
