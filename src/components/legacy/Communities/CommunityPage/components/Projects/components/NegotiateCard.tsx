import React from "react";

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
    borderBottom: "2px solid grey",
    paddingBottom: theme.spacing(2),
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
    overflow: "hidden",
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
  articleImageBox: (props: any) => ({
    width: theme.spacing(12),
    height: theme.spacing(12),
    borderRadius: theme.spacing(1),
    marginTop: theme.spacing(2),
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundImage:
      props.project?.podMediaData?.HasPhoto && props.project?.podMediaData?.MediaSymbol
        ? `url(${URL()}/media/getMediaMainPhoto/${props.project?.podMediaData?.MediaSymbol.replace(/\s/g, "")})`
        : `url(${require(`assets/anonAvatars/ToyFaces_Colored_BG_111.jpg`)})`,
  }),
  name: {
    fontSize: theme.typography.subtitle1.fontSize,
    fontWeight: theme.typography.fontWeightBold,
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
  content: {
    fontSize: theme.typography.subtitle1.fontSize,
  },
  description: {
    fontSize: theme.typography.subtitle2.fontSize,
  },
  buttonBox: {
    cursor: "pointer",
    border: "1px solid black",
    borderRadius: theme.spacing(1),
    padding: `${theme.spacing(1)}px 0`,
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  buttonBoxBlack: {
    cursor: "pointer",
    border: "1px solid black",
    borderRadius: theme.spacing(1),
    width: "100%",
    backgroundColor: "black",
    padding: `${theme.spacing(1)}px 0`,
    color: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
}));

const NegotiateCard = ({ project, user, acceptOffer, declineOffer }) => {
  const classes = useStyles({ project, user });

  return (
    <Box className={classes.container}>
      <Box className={classes.titleBox}>
        <Box className={classes.title}>Media Selling Offer</Box>
        <Box className={classes.iconBox}>
          <SvgIcon>
            <EllipsisVSolid />
          </SvgIcon>
        </Box>
      </Box>
      <Box className={classes.name} mb={1}>
        From
      </Box>
      <Box className={classes.avatarBox} onClick={() => { }}>
        <Box className={classes.avatar} />
        <Box className={classes.userBox}>
          <Box className={classes.name}>{user?.name}</Box>
          <Box className={classes.code}>@{user?.name}</Box>
        </Box>
      </Box>
      <Box className={classes.messageBox}>
        <Box className={classes.name}>Message</Box>
        <Box className={classes.description}>{project.message}</Box>
      </Box>
      <Box className={classes.articleBox}>
        <Box className={classes.articleImageBox} />
        <Box className={classes.messageBox} ml={2}>
          <Box className={classes.name}>{project?.podMediaData?.Name}</Box>
          <Box className={classes.description}>{project?.podMediaData?.Description}</Box>
        </Box>
      </Box>
      <Box className={classes.titleBox} style={{ borderBottom: "1px solid grey" }} pb={2}>
        <Box className={classes.name} style={{ color: "grey" }}>
          Offer
        </Box>
        <Box className={classes.name} fontSize="h6.fontSize" style={{ color: "grey" }}>
          {project.currentOffer?.offer || 0} %
        </Box>
      </Box>
      <Box className={classes.titleBox} mt={2}>
        <Box className={classes.buttonBox} mr={1} onClick={() => declineOffer(project)}>
          <Box>Decline</Box>
        </Box>
        <Box className={classes.buttonBox} ml={1} onClick={() => acceptOffer(project)}>
          <Box>Accept</Box>
        </Box>
      </Box>
      <Box className={classes.buttonBoxBlack} mt={2}>
        Place Counter Offer
      </Box>
    </Box>
  );
};

export default NegotiateCard;
