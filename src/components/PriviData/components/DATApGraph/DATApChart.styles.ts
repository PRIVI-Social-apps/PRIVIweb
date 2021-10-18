import { makeStyles } from "@material-ui/core";

export const datapChartStyles = makeStyles(theme => ({
  root: {
    marginTop: 40
  },
  datapChartContainer: {
    height: 290,
    marginTop: 40,
    position: 'relative',
    background: '#17172E',
    borderRadius: 10,
    overflow: 'hidden',
  },
  chartBanner: {
    position: 'absolute',
    background: '#383754',
    boxShadow: '2px 2px 12px rgba(0, 0, 0, 0.1)',
    borderRadius: 4,
    color: '#181818',
    top: 20,
    left: 20
  },
  content: {
    borderRadius: 10,
    padding: '8px 15px',
  },
  current: {
    color: '#FFFFFF',
    fontSize: 18,
  },
  different: {
    fontSize: 14,
    color: '#65cb63'
  }
}));
