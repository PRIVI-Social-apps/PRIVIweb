import { makeStyles } from "@material-ui/core";

export const voteDetailSubPageStyles = makeStyles(theme => ({
  content: {
    backgroundColor: "#26254B",
    width: "100%",
    display: "flex",
    flexDirection: "column",
    padding: "60px 168px 150px 168px",
    overflowY: "auto",
    overflowX: "hidden",
    position: "relative",
  },
  gradient: {
    position: "absolute",
    width: 363,
    height: 485,
    left: 521,
    top: -240,
    transform: "rotate(44deg)",
    filter: "blur(120px)",
    background:
      "linear-gradient(156.41deg, #FA18FF 11.7%, rgba(255, 255, 255, 0) 57.03%), radial-gradient(108.54% 138.74% at 86.8% 29.83%, rgba(238, 238, 238, 0) 0%, rgba(167, 54, 255, 0.096) 26.8%, rgba(14, 0, 255, 0.212) 73.32%, rgba(112, 0, 255, 0.384) 100%)",
  },
  headerTitle: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    alignItem: "center",
    marginBottom: 48,
  },
  shareSection: {
    cursor: 'pointer'
  },
  mainContent: {
    backgroundColor: '#31305c',
    borderRadius: 4
  },
  nameSection: {
    display: "flex",
    alignItems: "center",
    marginTop: 12,
    marginBottom: 20,
  },
  avatarBox: {
    position: "relative",
    cursor: 'pointer'
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
  mainContentHeader: {
    padding: '65px 75px 50px 75px',
    borderBottom: '1px solid #61658A',
  },
  mainContentQuestion: {
    padding: '50px 75px 40px 75px',
    borderBottom: '1px solid #61658A',
  },
  voteQuestionSection: {
    paddingTop: 12,
    paddingLeft: 15,
  },
  selectedVoteQuestion: {
    display: 'flex',
    alignItems: 'center',
    borderRadius: 33,
    padding: '9px 15px',
    border: '1px solid #D188FF',
    backgroundColor: '#3d3b66',
    marginBottom: 16,
    cursor: 'pointer'
  },
  voteQuestion: {
    display: 'flex',
    alignItems: 'center',
    borderRadius: 33,
    padding: '9px 15px',
    backgroundColor: '#3d3b66',
    marginBottom: 16,
    cursor: 'pointer'
  },
  voteBtn: {
    display: 'flex',
    justifyContent: 'center',
    background: '#2FB17A',
    borderRadius: 15,
    padding: 12,
    marginTop: 32,
    cursor: 'pointer'
  },
  mainContentReplySection: {
    padding: '36px 75px 100px 75px',
  },
  sendBtnSection: {
    paddingLeft: 15
  },
  sendBtn: {
    display: 'flex',
    justifyContent: 'center',
    background: '#BA50FC',
    borderRadius: 48,
    padding: 12,
    cursor: 'pointer'
  },
  inputForResponse: {
    height: 45,
    background: 'rgba(38, 37, 75, 0.7)',
    border: '1px solid rgba(78, 76, 132, 0.8)',
    borderRadius: 47,
  }
}));
