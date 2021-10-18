import { makeStyles } from "@material-ui/core";

export const projectModalStyles = makeStyles(() => ({
  root: {
    width: "720px !important",
  },
  modalContent: {
    padding: 30,
  },
  headerProject: {
    fontSize: 20,
    fontWeight: 700,
    color: 'rgb(8, 24, 49)',
    marginBottom: 50,
  },
  flexRowInputsCommunitiesModal: {
    display: "flex",
  },
  infoColProject: {
    width: 130
  },
  titleProject: {
    fontWeight: 500,
    fontSize: 12,
    color: 'rgb(101, 110, 126)',
    marginBottom: 3,
  },
  valueProject: {
    fontWeight: 400,
    fontSize: 16,
    color: 'rgb(8, 24, 49)',
  },
  githubButtonProject: {
    width: 200,
    height: 40,
    backgroundColor: 'white',
    border: '1px solid rgb(238, 241, 244)',
    boxShadow: '0px 3px 16px rgba(101, 112, 129, 0.1)',
    cursor: 'pointer',
    borderRadius: 20,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
    fontWeight: 400,
    fontSize: 14,
    color: 'rgb(101, 110, 126)'
  },
  githubIconProject: {
    width: 26,
    height: 'auto',
    marginRight: 8,
    marginLeft: 13
  },
  gridAuthorDescProject: {
    marginTop: 38,
    marginBottom: 30
  },
  requirementsProject: {
    border: '1px solid rgba(101, 110, 126, 0.2)',
    borderRadius: 20,
    width: 'calc(100% - 30px)',
    paddingTop: 18,
    paddingBottom: 18,
    paddingRight: 15,
    paddingLeft: 15
  },
  requirementsHeaderProject: {
    fontSize: 14,
    fontWeight: 700,
    color: 'rgb(25, 40, 63)',
    marginBottom: 20
  },
  position: {
    display: 'flex',
    backgroundColor: 'hsla(218, 11%, 45%, 0.2)',
    padding: 15,
    borderRadius: 15,
    cursor: 'pointer',
    "& .row": {
      display: 'flex',
      justifyContent: 'space-between',
      width: '100%'
  },
    "& div": {
      color: '#656e7e',
      fontSize: 14,
    }
  },
  authorPhotoProject: {
    width: 35,
    height: 35,
    backgroundColor: 'grey',
    borderRadius: '50%',
    marginRight: 7
  },
  authorNameProject: {
    fontSize: 14,
    fontWeight: 500,
    lineHeight: 24,
    color: 'rgb(8, 24, 49)'
  }
}));
