import { makeStyles } from "@material-ui/core";

export const dropdownStyles = makeStyles(() => ({
  root: {
    position: 'relative',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
  },
  dropdownArrow: {
    position: 'absolute',
    top: '50%',
    right: 10,
    transform: 'translate(0, -50%)',
    zIndex: 2,
    "& path": {
      stroke: '#707582',
      strokeWidth: 2,
    },
  }
}));
