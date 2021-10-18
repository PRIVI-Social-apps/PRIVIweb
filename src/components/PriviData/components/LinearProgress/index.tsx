import { createStyles, withStyles, Theme } from '@material-ui/core/styles';
import LinearProgress from '@material-ui/core/LinearProgress';

export const BorderLinearProgress = withStyles((theme: Theme) =>
  createStyles({
    root: {
      height: 10,
      borderRadius: 5,
    },
    colorPrimary: {
      backgroundColor: 'transparent',
    },
    bar: {
      borderRadius: 32,
      backgroundColor: '#7977D1',
    },
  }),
)(LinearProgress);
