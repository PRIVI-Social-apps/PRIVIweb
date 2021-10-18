import React from "react";
import { Box, makeStyles } from "@material-ui/core";

import { Avatar, Color, Modal, StyledDivider } from "shared/ui-kit";
import { TitleGrandLight } from "../../index.styles";

const CreatorsModal = ({ onClose, open, users }) => {
  const classes = useStyles();

  const getRandomAvatarNumber = () => {
    const random = Math.floor(Math.random() * 100);
    if (random < 10) {
      return `00${random}`;
    }

    return `0${random}`;
  };

  return (
    <Modal isOpen={open} onClose={onClose} showCloseIcon theme="dark" size="small">
      <Box className={classes.root}>
        <TitleGrandLight disableUppercase fontSize="30px" mb={4}>
          Creators
        </TitleGrandLight>
        <Box width="100%" mb={1}>
          <StyledDivider color={Color.White} type="solid" />
        </Box>

        <Box display="flex" flexDirection="column" width="100%">
          {users &&
            users.map((item, index) => (
              <Box
                key={index}
                display="flex"
                alignItems="center"
                justifyContent="space-between"
                mb={2}
                width="100%"
              >
                <Box display="flex" alignItems="center">
                  <Avatar
                    url={
                      item?.url ??
                      item?.imageURL ??
                      item?.userData?.imageURL ??
                      `assets/anonAvatars/ToyFaces_Colored_BG_${getRandomAvatarNumber()}`
                    }
                    size="medium"
                  />

                  <Box fontFamily="Agrandir GrandLight" ml={1}>
                    {item.userData?.name ?? "User name"}
                  </Box>
                </Box>

                <Box>{item.role}</Box>
              </Box>
            ))}
        </Box>
      </Box>
    </Modal>
  );
};

const useStyles = makeStyles(theme => ({
  root: {
    display: "flex",
    alignItems: "center",
    flexDirection: "column",
  },
}));

export default CreatorsModal;
