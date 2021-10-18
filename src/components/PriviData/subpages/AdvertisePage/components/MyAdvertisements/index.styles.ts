import { makeStyles } from "@material-ui/core";

export const MyAdvertisementsStyles = makeStyles(theme => ({
  root: {
    width: '100%',
  },
  title: {
    fontWeight: 800,
    fontSize: 22,
    lineHeight: '130%',
    color: '#FFFFFF',
  },
  otherContent: {
    width: 165,
    height: 40,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    columnGap: 10,
    border: '1px solid #7977D1',
    borderRadius: 29,
    fontWeight: 600,
    fontSize: 12,
    lineHeight: '18px',
    color: '#FFFFFF',
    position: 'relative',
    cursor: 'pointer',
    "& .logo": {
      position: 'absolute',
      right: 15,
      top: '50%',
      transform: 'translate(0, -50%)',
    }
  },
}));
