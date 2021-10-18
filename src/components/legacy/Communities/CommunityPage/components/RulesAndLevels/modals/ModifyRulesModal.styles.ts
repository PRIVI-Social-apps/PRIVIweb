import { makeStyles } from "@material-ui/core";

export const modifyRulesModalStyles = makeStyles(theme => ({
  root: {
    width: "720px !important",
  },
  modalContent: {
    padding: 30
  },
  levelTitle: {
    fontSize: 22,
    fontWeight:400,
  },
  flexRowBetween: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  createButton: {
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
    width: '40%'
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
