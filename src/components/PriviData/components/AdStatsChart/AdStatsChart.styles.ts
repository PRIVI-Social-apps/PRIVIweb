import { makeStyles } from "@material-ui/core";

export const adStatsChartStyles = makeStyles(theme => ({
  root: {
    marginTop: 40
  },
  datapChartContainer: {
    height: 290,
    marginTop: 40,
    position: 'relative',
    background: '#17172D',
    borderRadius: 10,
  },
  chartBanner: {
    position: 'absolute',
    color: '#181818',
    top: 20,
    left: 20
  },
  content: {
    background: '#ffffff',
    boxShadow: '2px 2px 12px rgba(0, 0, 0, 0.1)',
    borderRadius: 10,
    padding: '8px 15px',
  },
  current: {
    fontSize: 18,
  },
  different: {
    fontSize: 14,
    color: '#65cb63'
  }
}));
