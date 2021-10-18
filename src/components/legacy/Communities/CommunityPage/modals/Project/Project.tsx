import React, { useEffect, useState } from "react";

import { Grid } from "@material-ui/core";

import {projectModalStyles} from './Project.styles';
import PositionModal from "./PositionModal/PositionModal";
import { useTypedSelector } from "store/reducers/Reducer";
import { Modal } from 'shared/ui-kit';

const github = require("assets/snsIcons/github_icon.png");

const ProjectModal = (props: any) => {
  const classes = projectModalStyles();

  const users = useTypedSelector((state) => state.usersInfoList);

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
      if(endTime < 0) endTime = 0;
      setRemainingDays(Math.floor(endTime / (1000 * 60 * 60 * 24)));
    }

    if (
      props.project.Leaders &&
      props.project.Leaders.length > 0 &&
      users &&
      users.length
    ) {
      const leaders = [] as any[];
      props.project.Leaders.forEach((admin) => {
        if (users.some((u) => u.id === admin)) {
          const thisUser = users[users.findIndex((u) => u.id === admin)];
          leaders.push({ imageURL: thisUser.imageURL, name: thisUser.name });
        }
      });

      setAdmins(leaders);
    }
    // eslint-disable-next-line
  }, [users]);

  const openInNewTab = (url) => {
    const newWindow = window.open(url, "_blank", "noopener,noreferrer");
    if (newWindow) newWindow.opener = null;
  };

  return (
    <Modal size="medium" isOpen={props.open} onClose={props.onClose} showCloseIcon className={classes.root}>
      <div className={classes.modalContent}>
        <div className={classes.headerProject}>{props.project.Name}</div>
        <div className={classes.flexRowInputsCommunitiesModal}>
          <div className={classes.infoColProject}>
            <div className={classes.titleProject}>Budget</div>
            <div className={classes.valueProject}>
              {props.project.Budget
                ? `${props.project.Budget} ${props.project.Token}`
                : `N/A ${props.project.Token}`}
            </div>
          </div>
          <div className={classes.infoColProject}>
            <div className={classes.titleProject}>Remaining</div>
            <div className={classes.valueProject}>{`${remainingDays} days`}</div>
          </div>
          <div className={classes.infoColProject}>
            <div className={classes.titleProject}>Expected duration</div>
            <div className={classes.valueProject}>{duration}</div>
          </div>
          <div
            className={classes.flexRowInputsCommunitiesModal}
            style={{
              width: "calc(100% - 390px)",
              alignItems: "center",
              justifyContent: "flex-end",
            }}
          >
            <div
              className={classes.githubButtonProject}
              onClick={() => {
                if (
                  props.project.GithubRepo &&
                  props.project.GithubRepo.length > 0
                ) {
                  openInNewTab("https://github.com/" + props.project.GithubRepo);
                }
              }}
            >
              <img src={github} className={classes.githubIconProject} alt={"github"} />
              Github repo
            </div>
          </div>
        </div>
        <Grid
          container
          className={classes.gridAuthorDescProject}
          spacing={2}
          direction="row"
          alignItems="flex-start"
          justify="flex-start"
        >
          {admins && admins.length > 0 ? (
            <Grid item xs={12} md={4}>
              <div className={classes.titleProject}>Project Leaders</div>
              {admins.map((admin) => {
                return <Admin admin={admin} key={admin} />;
              })}
            </Grid>
          ) : null}
          <Grid item xs={12} md={8}>
            <div className={classes.titleProject}>Description</div>
            <div
              className={classes.valueProject}
              style={{
                marginTop: "10px",
              }}
            >
              {props.project.Description
                ? props.project.Description
                : "no description"}
            </div>
          </Grid>
        </Grid>

        {props.project.Positions ? (
          <div className={classes.requirementsProject}>
            <div className={classes.requirementsHeaderProject}>{`Project Positions (${props.project.Positions.length})`}</div>
            {props.project.Positions.map((position, index) => (
              <Position key={`position-${index}`} position={position} />
            ))}
          </div>
        ) : null}
      </div>
    </Modal>
  );
};

const Position = (props) => {
  const classes = projectModalStyles();

  const [openPositionModal, setOpenPositionModal] = useState<boolean>(false);
  const handleOpenPositionModal = () => {
    setOpenPositionModal(true);
  };
  const handleClosePositionModal = () => {
    setOpenPositionModal(false);
  };

  return (
    <div className={classes.position} key={`position-index`}>
      <div className="row" onClick={handleOpenPositionModal}>
        <div className={classes.titleProject}>{props.position.PositionName}</div>
        <div className={classes.titleProject}>
          {`${props.position.PositionMonthlySalary} ${props.position.PositionSalaryToken}/month
                    `}
        </div>
        <div className={classes.titleProject}>
          {`${
            props.position.Applications
              ? props.position.Applications.length
              : "0"
          } applications`}
        </div>
        <div className={classes.titleProject}>
          {props.position.Open ? "Open" : "Closed"}
        </div>
      </div>
      <PositionModal
        open={openPositionModal}
        onClose={handleClosePositionModal}
        position={props.position}
      />
    </div>
  );
};

const Admin = (props) => {
  const classes = projectModalStyles();

  if (props.admin)
    return (
      <div
        className={classes.flexRowInputsCommunitiesModal}
        style={{
          alignItems: "center",
          marginTop: "7px",
        }}
      >
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
        <div className={classes.authorNameProject}>{props.admin.name}</div>
      </div>
    );
  else return null;
};

export default ProjectModal;
