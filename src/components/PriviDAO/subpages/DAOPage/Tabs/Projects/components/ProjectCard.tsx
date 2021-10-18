import React, { useEffect, useState } from "react";

import { makeStyles } from "@material-ui/core";

import ProjectModal from "../modals/Project/Project";
import { Color, StyledDivider } from "shared/ui-kit";
import Box from 'shared/ui-kit/Box';

const useStyles = makeStyles(theme => ({
  root: {
    cursor: "pointer",
  },
  budget: {
    width: "fit-content",
    background: "rgba(255, 255, 255, 0.16)",
    color: "#FFFFFF",
    fontSize: "14px",
    borderRadius: "16px",
    padding: "8px 16px",
  },
  barContainer: {
    backgroundColor: "background: rgba(255, 255, 255, 0.16)",
    height: "14px",
    width: "100%",
  },
  bar: {
    background: "linear-gradient(102.54deg, #00BFFF -9.09%, #8D2EFF 56.17%, #FF00C1 112.56%)",
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
      <Box
        width="100%"
        onClick={handleOpenProjectModal}
        color="white"
        fontSize="18px"
        className={classes.root}
      >
        <Box className={classes.budget}>
          {`Total Budget ${props.project.Budget ? props.project.Budget : 0} ${props.project.Token}`}
        </Box>
        <Box mt={2} mb={2} fontWeight={800}>
          {props.project.Name ? props.project.Name : "Posted Project"}
        </Box>
        <Box mb={2}>{props.project.Description ? props.project.Description : "Untitled Project"}</Box>

        <Box width="100%">
          <StyledDivider color={Color.White} type="solid" />
        </Box>

        <Box display="flex" flexDirection="column" mb={1} mt={2}>
          <Box>{`${
            props.project.Positions && props.project.Positions.length > 0 ? props.project.Positions.length : 0
          } position${props.project.Positions && props.project.Positions.length > 1 ? "s" : ""}`}</Box>
          <Box>{`${applications && applications > 0 ? applications : 0} application${
            applications > 1 ? "s" : ""
          }`}</Box>
        </Box>

        <Box className={classes.barContainer}>
          <Box className={classes.bar} style={{ width: `${remainingTimePct}%` }} />
        </Box>
      </Box>

      {openProjectModal && (
        <ProjectModal
          open={openProjectModal}
          onClose={handleCloseProjectModal}
          project={props.project}
          token={props.token}
        />
      )}
    </>
  );
};

export default ProjectCard;
