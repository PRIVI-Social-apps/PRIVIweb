import { makeStyles } from "@material-ui/core";

export const priviPodsPageStyles = makeStyles(theme => ({
  priviPods: {
    height: '100vh',
    width: '100%'
  },
  contentContainer: {
    display: 'flex',
    width: '100%',
    height: 'calc(100vh - 104px)',
    background: '#eae8fa',
  },
  mainContainer: {
    display: 'flex',
    width: '100%',
    background: '#eae8fa',
    flexDirection: 'column',
    height: '100%'
  },
  arrows: {
    display: 'flex',
    alignItems: 'center',
    position: 'absolute',
    zIndex: 2,
    top: 35,
    left: 240,
    '& button': {
      background: 'transparent',
      borderRadius: 0,
      padding: 0,
      '&:first-child': {
        marginLeft: 30,
        marginRight: 42,
        '& img': {
          transform: 'rotate(180deg)',
        }
      },
      '& img': {
        width: 8,
        height: 16
      },
      '&:disabled': {
        opacity: 0.5,
        cursor: 'not-allowed'
      },
      '&:last-child': {
        marginRight: 30
      }
    },
  }
}));
