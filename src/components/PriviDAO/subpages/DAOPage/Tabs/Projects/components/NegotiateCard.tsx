import React from "react";

import { Paper, Popper, MenuList, MenuItem, Grow, ClickAwayListener, makeStyles } from "@material-ui/core";
import SvgIcon from "@material-ui/core/SvgIcon";

import URL from "shared/functions/getURL";
import Box from "shared/ui-kit/Box";
import { ReactComponent as EllipsisVSolid } from "assets/icons/ellipsis-v-solid.svg";
import { DAOButton } from "components/PriviDAO/components/DAOButton";
import { Text } from "../../../index.styles";
import { Color, StyledDivider } from "shared/ui-kit";
import PlaceCounterOfferModal from "../modals/Place-Counter-Offer/Place-Counter-Offer-Modal";

const useStyles = makeStyles(theme => ({
  iconBox: {
    color: "white",
  },
  avatar: (props: any) => ({
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundImage:
      props.user?.anon === false && props.user?.url
        ? `url(${props.user?.url}?${Date.now()})`
        : props.user?.anonAvatar && props.user?.anonAvatar.length > 0
        ? `url(${require(`assets/anonAvatars/${props.user.anonAvatar}`)})`
        : `url(${require(`assets/anonAvatars/ToyFaces_Colored_BG_111.jpg`)})`,
    cursor: "pointer",
    width: theme.spacing(6),
    height: theme.spacing(6),
    borderRadius: "100%",
  }),
  articleImageBox: (props: any) => ({
    width: theme.spacing(15),
    height: theme.spacing(15),
    borderRadius: "6px",
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundImage:
      props.project?.podMediaData?.HasPhoto && props.project?.podMediaData?.MediaSymbol
        ? `url(${URL()}/media/getMediaMainPhoto/${props.project?.podMediaData?.MediaSymbol.replace(
            /\s/g,
            ""
          )})`
        : `url(${require(`assets/anonAvatars/ToyFaces_Colored_BG_111.jpg`)})`,
  }),
  maxWidth: {
    "& *": {
      width: "100%",
      margin: 0,
    },
  },
  paper: {
    marginLeft: "-150px",
    "& *": {
      fontFamily: "Agrandir",
    },
  },
}));

const NegotiateCard = ({ project, user, acceptOffer, declineOffer }) => {
  const classes = useStyles({ project, user });

  const [openPlaceCounterOffer, serOpenPlaceCounterOffer] = React.useState(false);
  const handleOpenPlaceCounterOffer = () => {
    serOpenPlaceCounterOffer(true);
  };
  const handleClosePlaceCounterOffer = () => {
    serOpenPlaceCounterOffer(false);
  };

  const [open, setOpen] = React.useState(false);
  const anchorRef = React.useRef<HTMLDivElement>(null);

  const handleToggle = () => {
    setOpen(prevOpen => !prevOpen);
  };

  const handleClose = (event: React.MouseEvent<EventTarget>) => {
    if (anchorRef.current && anchorRef.current.contains(event.target as HTMLElement)) {
      return;
    }

    setOpen(false);
  };

  function handleListKeyDown(event: React.KeyboardEvent) {
    if (event.key === "Tab") {
      event.preventDefault();
      setOpen(false);
    }
  }
  return (
    <Box color="white" fontSize="18px" width="100%" height="fit-content">
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <Text bold>Media Selling Offer</Text>
        <div
          className={classes.iconBox}
          ref={anchorRef}
          aria-controls={open ? "menu-list-grow" : undefined}
          aria-haspopup="true"
          onClick={handleToggle}
        >
          <SvgIcon>
            <EllipsisVSolid />
          </SvgIcon>
        </div>
        <Popper open={open} anchorEl={anchorRef.current} role={undefined} transition disablePortal>
          {({ TransitionProps, placement }) => (
            <Grow
              {...TransitionProps}
              style={{ transformOrigin: placement === "bottom" ? "center top" : "center bottom" }}
            >
              <Paper className={classes.paper}>
                <ClickAwayListener onClickAway={handleClose}>
                  <MenuList autoFocusItem={open} id="menu-list-grow" onKeyDown={handleListKeyDown}>
                    <MenuItem onClick={handleClose}>Discuss with DAO</MenuItem>
                    <MenuItem onClick={handleClose}>View offers in other DAOs</MenuItem>
                  </MenuList>
                </ClickAwayListener>
              </Paper>
            </Grow>
          )}
        </Popper>
      </Box>

      <Box width="100%">
        <StyledDivider color={Color.White} type="solid" margin={2} />
      </Box>

      <Box display="flex" flexDirection="column">
        <Text bold mb={2}>
          From
        </Text>
        <Box display="flex" alignItems="center">
          <Box className={classes.avatar} />
          <Box ml={1} fontFamily="Agrandir GrandLight">
            {user?.name ?? "User name"}
          </Box>
        </Box>
      </Box>

      <Box width="100%">
        <StyledDivider color={Color.White} type="solid" margin={2} />
      </Box>

      <Box display="flex" flexDirection="column">
        <Text bold mb={2}>
          Message
        </Text>
        <Box color="#A306BA" mb={2}>
          {project?.message ?? "Message"}
        </Box>
        <Box display="flex">
          <Box className={classes.articleImageBox} />
          <Box display="flex" flexDirection="column" ml={2} fontSize="14px">
            <Box fontWeight={800}>{project?.podMediaData?.Name ?? "Name"}</Box>
            <Box>{project?.podMediaData?.Description ?? "Description"}</Box>
          </Box>
        </Box>
      </Box>

      <Box width="100%">
        <StyledDivider color={Color.White} type="solid" margin={2} />
      </Box>
      <Box display="flex" flexDirection="column">
        <Text bold>Offer</Text>
        <Box mt={1}>{project.currentOffer?.offer ?? 0} %</Box>
      </Box>
      <Box display="flex" justifyContent="space-between" mb={2} mt={2}>
        <DAOButton insideCard onClick={() => declineOffer(project)}>
          <Box>Decline</Box>
        </DAOButton>
        <DAOButton insideCard onClick={() => acceptOffer(project)}>
          <Box>Accept</Box>
        </DAOButton>
      </Box>
      <Box className={classes.maxWidth}>
        <DAOButton insideCard onClick={handleOpenPlaceCounterOffer}>
          Place Counter Offer
        </DAOButton>
      </Box>
      <PlaceCounterOfferModal
        currentOffer={project.currentOffer?.offer ?? 0}
        open={openPlaceCounterOffer}
        handleClose={handleClosePlaceCounterOffer}
      />
    </Box>
  );
};

export default NegotiateCard;
