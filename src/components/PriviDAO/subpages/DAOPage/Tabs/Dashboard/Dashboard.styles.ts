import { makeStyles } from "@material-ui/core";

export const dashboardStyles = makeStyles(theme => ({
  graphContainer: {
    width: '100%',
    "& .graph-title": {
      fontWeight: 800,
      fontSize: 14,
      lineHeight: '18px',
      color: '#FFFFFF',
    },
    "& .graph-info": {
      display: 'flex',
      columnGap: 4,
      alignItems: 'center',
      fontSize: 24,
      lineHeight: '31px',
      color: '#FFFFFF',
      "&.secondary": {
        fontSize: 14,
        lineHeight: 18,
        color: '#A306BA',
      }
    },
  },
  filterDropdown: {
    background: 'rgba(255, 255, 255, 0.24)',
    boxShadow: '0px 2px 12px rgb(0 0 0 / 10%)',
    padding: '8px 16px',
    fontSize: 14,
    lineHeight: '18px',
    color: '#FFFFFF',
    "& .MuiSelect-icon path": {
      fill: '#FFFFFF'
    }
  },
  graph: {
    width: '100%',
    marginTop: 20,
    minHeight: 170,
  },
  barContainer: {
    background: 'rgba(255, 255, 255, 0.16)',
    height: 14,
    width: '100%'
  },
  bar: {
    background: 'linear-gradient(102.54deg, #00bfff -9.09%, #8d2eff 56.17%, #ff00c1 112.56%)',
    height: 14,
  }
}));
