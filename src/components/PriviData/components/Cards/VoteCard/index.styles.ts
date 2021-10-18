import { makeStyles } from "@material-ui/core";

export const voteCardStyles = makeStyles(theme => ({
  card: {
    background: "#17172D99",
    borderRadius: 4,
    minHeight: 412,
    position: "relative",
  },
  content: {
    padding: "27px 30px 0px 30px",
  },
  footer: {
    width: "100%",
    position: "absolute",
    bottom: 0,
    backgroundColor: "#17172D",
    height: "fit-content",
    padding: "28px 30px",
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
