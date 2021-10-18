import { makeStyles } from "@material-ui/core";

export const positionModalStyles = makeStyles(() => ({
  root: {
    width: "calc(720px - 60px) !important",
    height: 420
  },
  modalContent: {
    padding: 30,
    '& h3': {
      fontSize: 20
    }
  },
  flexRowInputsCommunitiesModal: {
    display: "flex",
  },
  infoHeaderCommunitiesModal: {
    fontStyle: "normal",
    fontWeight: 400,
    fontSize: 18,
    lineHeight: "104.5%",
    color: "#181818",
    display: "flex",
    alignItems: "center",
  },
  infoIconCommunitiesModal: {
    verticalAlign: "top",
    marginLeft: 2,
    width: 14,
    height: 14,
    transform: "translateY(-5px)",
  },
  description: {
    fontSize: 18,
    fontWeight: 400,
    textAlign: "center",
    color: "#707582",
  },
  leftSideDescription:{
    fontSize: 18,
    fontWeight: 400,
    color: "#707582",
  },
  flexStartCenterRowInputsCommunitiesModal: {
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center'
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
  },
  applicationsHeaderProject: {
    display: 'flex',
    justifyContent: 'space-between'
  }
}));
