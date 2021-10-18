import { makeStyles } from "@material-ui/core";

export const modifyLevelsModalStyles = makeStyles(theme => ({
  root: {
    width: "720px !important",
  },
  modalContent: {
    padding: 30
  },
  levelTitle: {
    fontSize: 22,
  },
  flexRowBetween: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  createRule: {
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
    width: '40%'
  },
  mobileCommunityLevel: {
    paddingBottom: 16
  },
  bottomButton: {
    paddingTop: 30
  },
  alertMessage: {
    width: "100%",
    "& > * + *": {
      marginTop: theme.spacing(2),
    },
  }
}));
