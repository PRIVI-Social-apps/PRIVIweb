import React from "react";

import { Dialog, makeStyles } from "@material-ui/core";
import SvgIcon from "@material-ui/core/SvgIcon";

import URL from "shared/functions/getURL";
import { ReactComponent as CloseSolid } from "assets/icons/close-solid.svg";
import Box from "shared/ui-kit/Box";

const CreatorsModal = ({ setOpenModal, title, open, creator, others }) => {
  const classes = useStyles();

  const getRandomAvatarNumber = () => {
    const random = Math.floor(Math.random() * 100);
    if (random < 10) {
      return `00${random}`;
    }

    return `0${random}`;
  };

  return (
    <Dialog open={open} fullWidth maxWidth="xs" classes={{ root: classes.root, paper: classes.root }}>
      <Box className={classes.mainWrapper}>
        <Box className={classes.closeIconWrapper}>
          <SvgIcon className={classes.closeIcon} onClick={() => setOpenModal()}>
            <CloseSolid />
          </SvgIcon>
        </Box>
        {title && <Box className={classes.title}>{title}</Box>}
        <Box className={classes.root}>
          <Box className={classes.videoContainer}>
            <Box className={classes.rowBox}>
              {creator && (
                <img
                  src={
                    creator?.imageURL
                      ? creator.imageURL
                      : `${URL()}/assets/anonAvatars/ToyFaces_Colored_BG_${getRandomAvatarNumber()}`
                  }
                  className={classes.avatar}
                />
              )}
              <span style={{ flex: 1, textAlign: "left" }}>{creator.name}</span>
              <span
                style={{
                  width: "100px",
                  padding: "8px 12px",
                  borderRadius: "30px",
                  background: "linear-gradient(97.4deg, #23D0C6 14.43%, #00CC8F 85.96%)",
                  color: "#fff",
                }}
              >
                Admin
              </span>
            </Box>
            {others &&
              others.map((item, index) => (
                <Box key={index} className={classes.rowBox}>
                  {item.userData && (
                    <img
                      src={
                        item.userData.imageURL
                          ? item.userData.imageURL
                          : `${URL()}/assets/anonAvatars/ToyFaces_Colored_BG_${getRandomAvatarNumber()}`
                      }
                      className={classes.avatar}
                    />
                  )}
                  {item.userData && (
                    <>
                      <span style={{ flex: 1, textAlign: "left" }}>{item.userData.name}</span>
                      <span
                        style={{
                          width: "100px",
                          padding: "8px 12px",
                          borderRadius: "30px",
                          background: "linear-gradient(97.4deg, #23D0C6 14.43%, #00CC8F 85.96%)",
                          color: "#fff",
                        }}
                      >
                        {item.role}
                      </span>
                    </>
                  )}
                </Box>
              ))}
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
    color: "black",
    fontSize: 20,
  },
  mainWrapper: {
    background: "white",
    textAlign: "center",
    padding: 20,
    borderRadius: 20,
  },
  closeIconWrapper: {
    position: "absolute",
    right: 15,
    display: "flex",
    justifyContent: "flex-end",
    color: "black",
    cursor: "pointer",
  },
  closeIcon: {
    "&:hover": {
      transform: "scale(1.1)",
    },
  },
  videoContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
    position: "relative",
    marginLeft: 5,
    marginTop: 0.5,
  },
  rowBox: {
    display: "flex",
    alignItems: "center",
    width: "100%",
  },
  avatar: {
    width: theme.spacing(7),
    height: theme.spacing(7),
    margin: theme.spacing(1),
  },
}));

export default CreatorsModal;
