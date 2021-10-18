import { makeStyles } from "@material-ui/core";

export const voteSortStyles = makeStyles(theme => ({
  content: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    cursor: 'pointer',
    justifyContent: 'space-between'
  },
  popUpMenu: {
    zIndex: 100
  },
  popUpMenuContent: {
    width: 207,
    padding: '15px 20px',
    background: ' linear-gradient(0deg, #373658, #373658), linear-gradient(0deg, #26254B, #26254B), #FFFFFF',
    borderRadius: 12,
    '& li': {
      color: '#E0DFF0',
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
