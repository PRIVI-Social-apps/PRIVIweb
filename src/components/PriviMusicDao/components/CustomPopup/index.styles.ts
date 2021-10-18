import { makeStyles } from "@material-ui/core";

export const voteSortStyles = makeStyles(theme => ({
  content: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    cursor: 'pointer'
  },
  popUpSection: {
    fontSize: 12,
    fontWeight: 600,
    marginRight: 7,
    [theme.breakpoints.down("xs")]: {
      minWidth: 90,
    },
  },
  popUpMenu: {
    zIndex: 100
  },
  popUpMenuContent: {
    width: 207,
    padding: '15px 20px',
    background: 'linear-gradient(0deg, #F2FBF6, #F2FBF6), #17172D',
    boxShadow: '0px 15px 35px -31px rgba(16, 66, 53, 0.19)',
    borderRadius: 12,
    '& li': {
      color: '#2D3047',
      borderBottom: '0.5px solid #E0DFF0',
      opacity: 0.6,
      '&:hover': {
        opacity: 1
      },
      '&:last-child': {
        borderBottom: 'none'
      },
    }
  },

}));
