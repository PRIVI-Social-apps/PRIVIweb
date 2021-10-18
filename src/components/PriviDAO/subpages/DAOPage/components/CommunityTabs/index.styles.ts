import { makeStyles } from "@material-ui/core";

export const communityTabsStyles = makeStyles(theme => ({
  tabs: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 20px',
    boxSizing: 'border-box'
  },
  tab: {
    fontWeight: 'bold',
    color: '#99a1b3',
    fontSize: 16,
    cursor: 'pointer'
  },
  active: {
    color: '#29e8dc',
    textDecoration: 'underline'
  }
}));
