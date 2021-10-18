import { makeStyles } from "@material-ui/core";

export const proposalCardStyles = makeStyles(theme => ({
  card: {
    background: '#17172D99',
    borderRadius: 4,
    minWidth: 348,
    height: 605,
    position: 'relative',
  },
  content: {
    padding: '27px 30px 0px 30px'
  },
  footer: {
    width: '100%',
    position: 'absolute',
    bottom: 0,
    backgroundColor: '#17172D',
    height: 'fit-content',
    padding: '28px 30px',
  },
  nameSection: {
    display: "flex",
    alignItems: "center",
    marginTop: 12,
    marginBottom: 20,
  },
  avatarBox: {
    position: "relative",
  },
  online: {
    width: theme.spacing(1),
    height: theme.spacing(1),
    background: "#57C74C",
    border: "1px solid #343268",
    borderRadius: theme.spacing(0.5),
    position: "absolute",
    top: 0,
    left: 0,
  },
  name: {
    fontSize: "14px",
    fontWeight: 600,
    color: "white",
  },
  voteBtn: {
    position: 'absolute',
    width: 222,
    backgroundColor: '#A977D1',
    borderRadius: 46,
    fontFamily: 'Agrandir',
    fontSize: 14,
    fontWeight: 600,
    bottom: 60
  }
}));
