import React, { useEffect, useState } from "react";

import { makeStyles } from "@material-ui/core";

import Box from "shared/ui-kit/Box";
import ProjectModal from "../../../modals/Project/Project";

const useStyles = makeStyles(theme => ({
  container: (props: any) => ({
    padding: theme.spacing(3),
    borderRadius: theme.spacing(2),
    boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.2)",
    marginRight: theme.spacing(2.5),
    marginBottom: theme.spacing(2.5),
    width: "100%",
    backgroundImage: `url(${props.project.url}?${Date.now()})`,
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
    backgroundPosition: "center",
    cursor: "pointer",
  }),
  topBox: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  award: {
    padding: `${theme.spacing(1)}px ${theme.spacing(1.5)}px`,
    fontSize: 14,
    fontWeight: 700,
    color: "#707582",
    backgroundColor: "white",
    border: "1px solid #707582",
    borderRadius: theme.spacing(2.5),
  },
  middle: {
    height: theme.spacing(30),
  },
  title: {
    marginBottom: theme.spacing(1),
    fontSize: 18,
    fontWeight: 400,
  },
  description: {
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    fontSize: 14,
    fontWeight: 400,
  },
  barContainer: {
    backgroundColor: "hsla(218, 11%, 45%, 0.2)",
    borderRadius: theme.spacing(0.5),
    height: theme.spacing(1),
    width: "100%",
  },
  bar: {
    background: "linear-gradient(97.4deg, #29E8DC 14.43%, #03EAA5 79.45%)",
    borderRadius: theme.spacing(0.5),
    height: "100%",
  },
}));

const ProjectCard = props => {
  const classes = useStyles(props);
  const [remainingTimePct, setRemainingTimePct] = useState<number>(0);

  const [applications, setApplications] = useState<number>(0);

  const [openProjectModal, setOpenProjectModal] = useState<boolean>(false);
  const handleOpenProjectModal = () => {
    setOpenProjectModal(true);
  };
  const handleCloseProjectModal = () => {
    setOpenProjectModal(false);
  };

  // set the correct remaining time percentage
  useEffect(() => {
    if (props.project.CreationDate && props.project.DateDue) {
      const difference =
        new Date(props.project.DateDue).getTime() - new Date(props.project.CreationDate).getTime();
      const differenceToday = new Date().getTime() - new Date(props.project.CreationDate).getTime();
      if (difference != 0) {
        setRemainingTimePct(Math.min(100, (differenceToday / difference) * 100));
      } else {
        setRemainingTimePct(100);
      }
    }
  }, []);

  // calculate the number of applications thats inside the positions
  useEffect(() => {
    if (props.project.Positions) {
      let a = 0;
      props.project.Positions.forEach(position => {
        if (position.Applications && position.Applications.length > 0) {
          a = position.Applications.length + a;
        }
      });
      setApplications(a);
    }
  }, []);

  return (
    <>
      <Box className={classes.container} onClick={handleOpenProjectModal}>
        <Box className={classes.topBox}>
          <h3>Posted projects</h3>
          <Box className={classes.award}>{`Total Budget ${props.project.Budget ? props.project.Budget : 0} ${
            props.project.Token
          }`}</Box>
        </Box>
        <Box className={classes.middle}>
          <h4 className={classes.title}>{props.project.Name ? props.project.Name : "Untitled Project"}</h4>
          <h4 className={classes.description}>
            {props.project.Description ? props.project.Description : "Untitled Project"}
          </h4>
        </Box>

        <Box>
          <Box mb={2} fontSize={14} fontWeight={400} color="#828282" display="flex" flexDirection="column">
            <div>{`${
              props.project.Positions && props.project.Positions.length > 0
                ? props.project.Positions.length
                : 0
            } position${props.project.Positions && props.project.Positions.length > 1 ? "s" : ""}`}</div>
            <div>{`${applications && applications > 0 ? applications : 0} application${
              applications > 1 ? "s" : ""
            }`}</div>
          </Box>
          <Box className={classes.barContainer}>
            <Box className={classes.bar} style={{ width: `${remainingTimePct}%` }} />
          </Box>
        </Box>
      </Box>

      {
        openProjectModal && (
          <ProjectModal open={openProjectModal} onClose={handleCloseProjectModal} project={props.project} token={props.token} />
        )
      }
    </>
  );
};

export default ProjectCard;
