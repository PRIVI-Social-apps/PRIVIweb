import React from "react";

import { Paper, Popper, MenuList, MenuItem, Grow, ClickAwayListener } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import SvgIcon from "@material-ui/core/SvgIcon";

import URL from "shared/functions/getURL";
import Box from "shared/ui-kit/Box";
import { ReactComponent as EllipsisVSolid } from "assets/icons/ellipsis-v-solid.svg";
import { Color, StyledDivider } from "shared/ui-kit";
import { Text } from "../../../index.styles";

const useStyles = makeStyles(theme => ({
  iconBox: {
    color: "white",
  },
  avatar: (props: any) => ({
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
    cursor: "pointer",
    width: theme.spacing(6),
    height: theme.spacing(6),
    borderRadius: "100%",
  }),
  articleImageBox: {
    width: "100%",
    height: theme.spacing(25),
    borderRadius: "6px",
    objectFit: "cover",
  },
  paper: {
    marginLeft: "-150px",
    "& *": {
      fontFamily: "Agrandir",
    },
  },
}));

const AcceptedCard = ({ project, user }) => {
  const classes = useStyles({ project, user });

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
                    <MenuItem onClick={handleClose}>Stop Selling This Media</MenuItem>
                    <MenuItem onClick={handleClose}>Contact the Artist</MenuItem>
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

      <img src={project.article?.imageUrl} className={classes.articleImageBox} />

      <Box display="flex" alignItems="center" mb={2} mt={2}>
        <Box className={classes.avatar} />
        <Box ml={1} fontFamily="Agrandir GrandLight">
          {user?.name ?? "User name"}
        </Box>
      </Box>

      <Box fontSize="14px">{project?.podMediaData?.Description ?? "Description"}</Box>

      <Box width="100%">
        <StyledDivider color={Color.White} type="solid" margin={2} />
      </Box>

      <Box display="flex" width="100%" justifyContent="space-between">
        <Box display="flex" flexDirection="column">
          <Text bold>Revenue</Text>
          <Box mt={1}>{project?.revenue ?? 0} %</Box>
        </Box>
        <Box display="flex" flexDirection="column">
          <Text bold>Accumulated Revenue</Text>
          <Box mt={1}>
            {project?.accumulatedRevenue?.type} {project.accumulatedRevenue?.value}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default AcceptedCard;
