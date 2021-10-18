import { makeStyles } from "@material-ui/core";

export const createNewTopicModalStyles = makeStyles(() => ({
  root: {
    width: "620px !important",
  },
  titleVotingModal: {
    fontSize: 22,
    fontWeight: 800,
    color: "#181818",
  },
  content: {
    padding: "20px 30px",
  },
  bodyCreateNewTopic: {
    paddingLeft: 30,
    paddingRight: 30,
    paddingTop: 10,
    paddingBottom: 20,
  },
  flexRowInputsCommunitiesModal: {
    paddingBottom: 8,
  },
  infoHeaderCommunitiesModal: {
    fontSize: 18,
  },
  createButtonNewTopicDiv: {
    display: "flex",
    justifyContent: "flex-end",
    marginRight: 30,
    alignItems: "center",
  },
  createButtonNewTopic: {
    fontSize: 18,
  },
}));
