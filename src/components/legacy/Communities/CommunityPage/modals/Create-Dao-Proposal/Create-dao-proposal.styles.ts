import { makeStyles } from "@material-ui/core";

export const createDaoProposalModalStyles = makeStyles(() => ({
  root: {
    width: "892px !important",
  },
  modalContent: {
    padding: 30,
  },
  firstPartCreateDaoProposal: {},
  titleCommunitiesModal: {
    fontSize: 24,
    fontWeight: 800,
    color: "rgb(8, 24, 49)",
  },
  subTitleCommunitiesModal: {
    fontSize: 22,
    fontWeight: 800,
    marginTop: 8,
  },
  firstRowCreateDaoProposal: {
    marginTop: 24,
    marginBottom: 16,
  },
  secondPartCreateDaoProposal: {},
  itemRow: {
    marginBottom: 12,
  },
  flexRowInputsCommunitiesModal: {
    display: "flex",
    paddingBottom: 12,
  },
  infoHeaderCommunitiesModal: {
    fontStyle: "normal",
    fontWeight: "normal",
    fontSize: 18,
    lineHeight: "104.5%",
    color: "#181818",
    display: "flex",
    alignItems: "center",
  },
  infoIconCommunitiesModal: {
    width: 12,
    height: 12,
    marginLeft: 3,
    marginTop: -3,
  },
  createDaoProposalDetails: {
    paddingBottom: 10,
  },
  userRolesSelector: {
    width: 175,
  },
  flexCenterCenterRowInputsCommunitiesModal: {
    display: "flex",
    justifyContent: "flex-end",
    marginTop: 48,
  },
  userRoles: {
    width: 190,
  },
  selectorFormControlCreatePod: {
    width: "100%",
  },
  selectProject: {
    width: "100%",
    height: 46,
    background: "#F7F9FE",
    border: "1px solid #E0E4F3",
    borderRadius: 8,
    paddingLeft: 16,
  },
  adminsMailLabelProject: {
    marginBottom: 19,
    display: "flex",
  },
  adminsNameMailLabelProject: {
    paddingLeft: 20,
    paddingRight: 15,
    height: 40,
    borderRadius: 16,
    backgroundColor: "rgb(227, 233, 239)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
    fontSize: 14,
    color: "rgb(8, 24, 49)",
    fontWeight: 600,
  },
  mainHashtagLabelProject: {
    backgroundColor: "white",
    borderRadius: 9,
    width: 42,
    height: 18,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    color: "rgb(101, 110, 126)",
    fontSize: 10,
    fontWeight: 800,
    letterSpacing: "0.83px",
    marginRight: 10,
  },
  removePodButtonProject: {
    padding: 0,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    margin: 0,
    color: "white",
    backgroundColor: "transparent",
    marginLeft: 16,
  },
  adminsStatusLabelProject: {
    borderRadius: 16,
    height: 40,
    backgroundColor: "rgb(227, 233, 239)",
    paddingLeft: 20,
    paddingRight: 20,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontWeight: 600,
    fontSize: 14,
    color: "rgb(101, 110, 126)",
  },
  pendingStatusLabelProject: {
    backgroundColor: "rgb(100, 200, 158)",
    color: "white",
    cursor: "pointer",
  },
}));
