import React from "react";
import { Dialog, makeStyles } from "@material-ui/core";
import SvgIcon from "@material-ui/core/SvgIcon";

import Box from 'shared/ui-kit/Box';
import { ReactComponent as CloseSolid } from "assets/icons/close-solid.svg";
import { ReactComponent as CommentRegular } from "assets/icons/comment-regular.svg";

const MediaCreators = ({ handleClose, open, creators }) => {
  const classes = useStyles();

  return (
    <Dialog open={open} fullWidth maxWidth="sm" classes={{ root: classes.root, paper: classes.root }}>
      <Box className={classes.mainWrapper}>
        <Box className={classes.titleBox}>
          <Box class={classes.title}>Media Creators</Box>
          <SvgIcon className={classes.closeIcon} onClick={() => handleClose()}>
            <CloseSolid />
          </SvgIcon>
        </Box>
        <Box mt={1} py={1}>
          {creators &&
            creators.map((item, index) => (
              <Box className={classes.itemBox} key={index}>
                <Box className={classes.avatarContainer}>
                  <img
                    className={classes.avatar}
                    src={item.url ? `url(${item.url}?${Date.now()})` : ""}
                    alt="AV"
                  />
                  <Box className={classes.avatarInfo}>
                    <Box className={classes.creatorName}>{item.userName || "Test User"}</Box>
                    <Box className={classes.creatorTag}>{item.urlAddress || "Test User"}</Box>
                  </Box>
                </Box>
                <Box className={classes.buttonBox}>
                  <Box className={classes.followBtn}>
                    <Box>Follow</Box>
                  </Box>
                  <Box className={classes.messageBtn}>
                    <Box mt={1}>
                      <SvgIcon>
                        <CommentRegular />
                      </SvgIcon>
                    </Box>
                  </Box>
                </Box>
              </Box>
            ))}
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
    color: "#black",
    fontSize: 20,
  },
  mainWrapper: {
    background: "#fff",
    textAlign: "center",
    padding: 20,
    borderRadius: 20,
  },
  titleBox: {
    display: "flex",
    justifyContent: "space-between",
    color: "black",
  },
  closeIcon: {
    cursor: "pointer",
    "&:hover": {
      transform: "scale(1.1)",
    },
  },
  itemBox: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottom: "1px solid #ccc",
    paddingBottom: theme.spacing(1),
    marginTop: theme.spacing(2),
  },
  avatarContainer: {
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  avatar: {
    width: "40px",
    height: "40px",
    borderRadius: "20px",
    boxShadow: "0px 2px 8px #ccc",
  },
  avatarInfo: {
    marginLeft: "8px",
  },
  creatorName: {
    fontSize: "14px",
    fontWeight: "bold",
  },
  creatorTag: {
    fontSize: "10px",
    background: `linear-gradient(90deg, #ff79d1 0%, #db00ff 100%)`,
    backgroundClip: "text",
    color: "transparent",
    textAlign: "start",
  },
  buttonBox: {
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "center",
    height: theme.spacing(4.5),
  },
  followBtn: {
    padding: `${theme.spacing(0.5)}px ${theme.spacing(2)}px`,
    color: "black",
    border: "1px solid #888",
    borderRadius: theme.spacing(1),
    marginRight: theme.spacing(2),
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
  },
  messageBtn: {
    padding: `${theme.spacing(0.5)}px ${theme.spacing(1)}px`,
    color: "#888",
    border: "1px solid #888",
    borderRadius: theme.spacing(1),
    height: "100%",
    width: "45px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
  },
}));

export default MediaCreators;
