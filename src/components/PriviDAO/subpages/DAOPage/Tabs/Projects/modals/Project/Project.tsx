import React, { useEffect, useState } from "react";

import { Grid } from "@material-ui/core";

import { projectModalStyles } from "./Project.styles";
import { useTypedSelector } from "store/reducers/Reducer";
import { Color, Modal, StyledDivider } from "shared/ui-kit";
import { DAOButtonDark } from "components/PriviDAO/components/DAOButton";
import Box from 'shared/ui-kit/Box';

const ProjectModal = (props: any) => {
  const classes = projectModalStyles();

  const users = useTypedSelector(state => state.usersInfoList);

  const [remainingDays, setRemainingDays] = useState<number>(0);
  const [duration, setDuration] = useState<string>("0");
  const [admins, setAdmins] = useState<any[]>([]);

  useEffect(() => {
    if (props.project.CreationDate && props.project.DateDue) {
      //set duration
      const time = props.project.DateDue - props.project.CreationDate;
      const d = Math.floor(time / (1000 * 60 * 60 * 24));
      if (d >= 14) {
        let w = 0;
        let daycount = 0;
        for (let i = 0; i < d; i++) {
          if (daycount < 7) {
            daycount++;
          } else {
            w++;
            daycount = 0;
          }
        }
        setDuration(w > 1 ? `${w} weeks` : `${w} week`);
      } else setDuration(d > 1 ? `${d} days` : `${d} day`);

      //get remaining days
      let endTime = props.project.DateDue - new Date().getTime();
      if (endTime < 0) endTime = 0;
      setRemainingDays(Math.floor(endTime / (1000 * 60 * 60 * 24)));
    }

    if (props.project.Leaders && props.project.Leaders.length > 0 && users && users.length) {
      const leaders = [] as any[];
      props.project.Leaders.forEach(admin => {
        if (users.some(u => u.id === admin)) {
          const thisUser = users[users.findIndex(u => u.id === admin)];
          leaders.push({ imageURL: thisUser.imageURL, name: thisUser.name });
        }
      });

      setAdmins(leaders);
    }
    // eslint-disable-next-line
  }, [users]);

  const openInNewTab = url => {
    const newWindow = window.open(url, "_blank", "noopener,noreferrer");
    if (newWindow) newWindow.opener = null;
  };

  return (
    <Modal
      size="medium"
      isOpen={props.open}
      onClose={props.onClose}
      showCloseIcon
      className={classes.root}
      theme="dark"
    >
      <Box fontFamily="Agrandir GrandLight" mb={3} fontSize="22px">
        {props.project.Name}
      </Box>
      <Box display="flex" mb={3} alignItems="center">
        <Box mr={2}>
          <Box fontWeight={800}>Budget</Box>
          <Box color="#D810D6" mt={"4px"}>
            {props.project.Budget
              ? `${props.project.Budget} ${props.project.Token}`
              : `N/A ${props.project.Token}`}
          </Box>
        </Box>
        <Box mr={2}>
          <Box fontWeight={800}>Remaining</Box>
          <Box color="#D810D6" mt={"4px"}>{`${remainingDays} days`}</Box>
        </Box>
        <Box mr={2}>
          <Box fontWeight={800}>Expected duration</Box>
          <Box color="#D810D6" mt={"4px"}>
            {duration}
          </Box>
        </Box>
        <DAOButtonDark
          onClick={() => {
            if (props.project.GithubRepo && props.project.GithubRepo.length > 0) {
              openInNewTab("https://github.com/" + props.project.GithubRepo);
            }
          }}
        >
          Github repo
        </DAOButtonDark>
      </Box>
      <Grid container spacing={2} direction="row" alignItems="flex-start" justify="flex-start">
        {admins && admins.length > 0 ? (
          <Grid item xs={12} md={4}>
            <Box mb={2} fontWeight={800}>
              Project Leaders
            </Box>
            {admins.map(admin => {
              return <Admin admin={admin} key={admin} />;
            })}
          </Grid>
        ) : null}
        <Grid item xs={12} md={8}>
          <Box fontWeight={800} mb={2}>
            Description
          </Box>
          <Box>{props.project.Description ? props.project.Description : "no description"}</Box>
        </Grid>
      </Grid>

      {props.project.Positions && (
        <Box mt={3}>
          <Box mb={2} fontWeight={800}>{`Project Positions (${props.project.Positions.length})`}</Box>
          {props.project.Positions.map((position, index) => (
            <Position key={`position-${index}`} position={position} />
          ))}
        </Box>
      )}
    </Modal>
  );
};

const Position = props => {
  const [openPositionModal, setOpenPositionModal] = useState<boolean>(false);
  const handleOpenPositionModal = () => {
    setOpenPositionModal(true);
  };
  const handleClosePositionModal = () => {
    setOpenPositionModal(false);
  };

  return (
    <>
      <Box onClick={handleOpenPositionModal} mb={2} width="100%" color="white" fontSize="18px">
        <Box display="flex" width="100%" justifyContent="space-between">
          <Box mr={1}>{props.position.PositionName}</Box>
          <Box mr={1}>
            {`${props.position.PositionMonthlySalary} ${props.position.PositionSalaryToken}/month
                    `}
          </Box>
          <Box mr={1}>
            {`${props.position.Applications ? props.position.Applications.length : "0"} applications`}
          </Box>
          <Box>{props.position.Open ? "Open" : "Closed"}</Box>
        </Box>
        <Box mt={1} width="100%">
          <StyledDivider color={Color.White} type="solid" />
        </Box>
      </Box>
    </>
  );
};

const Admin = props => {
  const classes = projectModalStyles();

  if (props.admin)
    return (
      <Box display="flex" mb={2} width="100%" color="white" fontSize="18px">
        <div
          className={classes.authorPhotoProject}
          style={{
            backgroundImage:
              props.admin.imageURL && props.admin.imageURL.length > 0
                ? `url(${props.admin.imageURL})`
                : "none",
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <Box fontFamily="Agrandir GrandLight">{props.admin.name}</Box>
      </Box>
    );
  else return null;
};

export default ProjectModal;
