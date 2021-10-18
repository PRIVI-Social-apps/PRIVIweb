import React from "react";

import { Paper, Popper, MenuList, MenuItem, Grow, ClickAwayListener } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import SvgIcon from "@material-ui/core/SvgIcon";

import URL from "shared/functions/getURL";
import Box from "shared/ui-kit/Box";
import { ReactComponent as EllipsisVSolid } from "assets/icons/ellipsis-v-solid.svg";

const useStyles = makeStyles(theme => ({
  container: {
    padding: theme.spacing(3),
    borderRadius: theme.spacing(2),
    boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.2)",
    marginRight: theme.spacing(2.5),
    marginBottom: theme.spacing(2.5),
    width: "100%",
    height: "fit-content",
  },
  titleBox: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: theme.spacing(2),
  },
  title: {
    fontSize: theme.typography.h5.fontSize,
    fontWeight: theme.typography.fontWeightBold,
  },
  iconBox: {
    color: "grey",
  },
  avatarBox: {
    display: "flex",
    alignItems: "flex-start",
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
  avatar: (props: any) => ({
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundImage:
      props.project?.podMediaData?.HasPhoto && props.project?.podMediaData?.MediaSymbol
        ? `url(${URL()}/media/getMediaMainPhoto/${props.project?.podMediaData?.MediaSymbol.replace(/\s/g, "")})`
        : `url(${require(`assets/anonAvatars/ToyFaces_Colored_BG_111.jpg`)})`,
    cursor: "pointer",
    width: theme.spacing(6),
    height: theme.spacing(6),
    border: "2px solid white",
    borderRadius: "100%",
    boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.2)",
  }),
  userBox: {
    marginLeft: theme.spacing(2),
  },
  code: {
    background: `linear-gradient(90deg, #ff79d1 0%, #db00ff 100%)`,
    WebkitTextFillColor: "transparent",
    WebkitBackgroundClip: "text",
  },
  messageBox: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
  articleBox: {
    display: "flex",
    alignItems: "flext-start",
    width: "100%",
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(2),
    padding: `${theme.spacing(1)}px 0`,
    borderTop: "1px dashed grey",
    borderBottom: "1px dashed grey",
  },
  articleImageBox: {
    width: "100%",
    height: theme.spacing(18),
    borderRadius: theme.spacing(1),
    objectFit: "cover",
  },
  name: {
    fontSize: theme.typography.subtitle1.fontSize,
    fontWeight: theme.typography.fontWeightBold,
  },
  content: {
    fontSize: theme.typography.subtitle1.fontSize,
  },
  description: {
    fontSize: theme.typography.subtitle2.fontSize,
  },
  revenueBox: {
    display: "flex",
    alignItems: "center",
    padding: `${theme.spacing(2)}px 0`,
    borderTop: "2px solid grey",
    color: "grey",
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
    <Box className={classes.container}>
      <Box className={classes.titleBox}>
        <Box className={classes.title}>{project?.podMediaData?.Name}</Box>
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
              <Paper>
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
      <img src={project.article?.imageUrl} className={classes.articleImageBox} />
      <Box className={classes.avatarBox} onClick={() => { }}>
        <Box className={classes.avatar} />
        <Box className={classes.userBox}>
          <Box className={classes.name}>{user?.name}</Box>
          <Box className={classes.code}>@{user?.name}</Box>
        </Box>
      </Box>
      <Box className={classes.description}>{project?.podMediaData?.Description}</Box>
      <Box className={classes.revenueBox} mt={2}>
        <Box mr={3}>
          <Box className={classes.name}>Revenue</Box>
          <Box className={classes.name}>{project.revenue} %</Box>
        </Box>
        <Box>
          <Box className={classes.name}>Accumulated Revenue</Box>
          <Box className={classes.name}>
            {project.accumulatedRevenue?.type} {project.accumulatedRevenue?.value}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default AcceptedCard;
