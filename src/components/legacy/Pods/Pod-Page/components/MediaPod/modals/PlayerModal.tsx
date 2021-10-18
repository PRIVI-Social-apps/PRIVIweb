import React from "react";
import ReactPlayer from "react-player";

import { Dialog, makeStyles } from "@material-ui/core";
import SvgIcon from "@material-ui/core/SvgIcon";
import URL from "shared/functions/getURL";
import Box from 'shared/ui-kit/Box';
import { ReactComponent as CloseSolid } from "assets/icons/close-solid.svg";

const PlayerModal = ({ handleClose, title, open, url, type, mediaId, ...props }) => {
  const classes = useStyles();

  const getUrl = () => {
    if (type === "DIGITAL_ART_TYPE") {
      return `${URL()}/media/getDigitalArt/${mediaId}`;
    } else if (type === "AUDIO_TYPE") {
      return `${URL()}/media/getAudio/${mediaId}`;
    } else return `${URL()}/media/getVideo/${mediaId}`;
  };

  return (
    <Dialog {...props} open fullWidth maxWidth="md" classes={{ root: classes.root, paper: classes.root }}>
      <Box className={classes.mainWrapper}>
        <Box className={classes.closeIconWrapper}>
          <SvgIcon className={classes.closeIcon} onClick={() => handleClose()}>
            <CloseSolid />
          </SvgIcon>
        </Box>
        {title && <Box className={classes.title}>{title}</Box>}
        <Box className={classes.root}>
          <Box className={classes.videoContainer}>
            {type === "DIGITAL_ART_TYPE" ? (
              <img src={getUrl()} width="100%" height="100%" />
            ) : (
              <ReactPlayer
                width="100%"
                height="100%"
                url={getUrl()}
                playing
                controls
                config={{
                  file: {
                    attributes: {
                      onContextMenu: e => e.preventDefault(),
                      controlsList: "nodownload",
                      disablePictureInPicture: true,
                    },
                  },
                }}
                style={{
                  display: "flex",
                }}
              />
            )}
          </Box>
        </Box>
      </Box>
    </Dialog>
  );
};

const useStyles = makeStyles(theme => ({
  root: { backgroundColor: "transparent!important", borderRadius: 25 },
  title: {
    fontWeight: "bold",
    margin: "5px 0px",
    color: "#cecece",
    fontSize: 20,
  },
  mainWrapper: {
    background: "#292929",
    textAlign: "center",
    padding: 20,
    borderRadius: 20,
  },
  closeIconWrapper: {
    position: "absolute",
    right: 15,
    display: "flex",
    justifyContent: "flex-end",
    color: "#fff",
    cursor: "pointer",
  },
  closeIcon: {
    "&:hover": {
      transform: "scale(1.1)",
    },
  },
  videoContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
    position: "relative",
    marginLeft: 5,
    marginTop: 0.5,
  },
  loadingContainer: {
    width: "100%",
    height: "100%",
    position: "absolute",
    left: 0,
    top: 0,
  },
}));

export default PlayerModal;
