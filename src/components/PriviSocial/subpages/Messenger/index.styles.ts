import { makeStyles } from "@material-ui/core";

export const MessengerStyles = makeStyles(theme => ({
  joinCommunityLabel: {
    fontSize: 14,
    color: "#5a5a5a",
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-start",
    marginTop: 10,
  },

  discordFullPage: {
    width: "100%",
    borderRadius: 0,
    marginBottom: 0,
    height: "calc(100vh - 178px + 20px)",
  },

  container: {
    marginTop: 30,
    marginBottom: 150,
  },
}));
