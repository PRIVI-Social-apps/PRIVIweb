import { makeStyles } from "@material-ui/core";

export const userCardStyles = makeStyles(theme => ({
  container: {
    width: 166,
    height: 200,
    background: '#ffffff',
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.12)',
    borderRadius: 20,
    userSelect: 'none',
    cursor: 'pointer',
  },
  avatar: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: 16,
    marginBottom: 12,
  },
  title: {
    fontSize: 14,
    color: '#181818',
    textAlign: 'center',
  },
  userName: {
    fontWeight: 800,
    fontSize: 11,
    color: '#7F6FFF',
    textAlign: 'center',
    marginTop: 4,
  },
  iconContainer: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column',
    marginTop: 5,
  },
  icon: {
    width: 24,
    height: 24,
    marginBottom: 5,
  },
  status: {
    fontSize: 14,
    color: '#707582',
  }
}));
