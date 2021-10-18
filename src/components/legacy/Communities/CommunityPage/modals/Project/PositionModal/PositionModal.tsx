import React, { useEffect, useState } from "react";

import { Grid } from "@material-ui/core";

import { positionModalStyles } from './PositionModal.styles';
import { useTypedSelector } from "store/reducers/Reducer";
import { Modal } from 'shared/ui-kit';

const infoIcon = require("assets/icons/info_icon.png");

export default function PositionModal(props) {
  const classes = positionModalStyles();

  const users = useTypedSelector((state) => state.usersInfoList);
  const user = useTypedSelector((state) => state.user);

  const [remainingDays, setRemainingDays] = useState<number>(0);
  const [duration, setDuration] = useState<string>("0");
  const [applicants, setApplicants] = useState<any[]>([]);

  useEffect(() => {
    if (props.position.PositionCreationDate && props.position.PositionDateDue) {
      //set duration

      const time =
        props.position.PositionDateDue - props.position.PositionCreationDate;
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
      let endTime = props.position.PositionDateDue - new Date().getTime();
      if (endTime < 0) endTime = 0;
      setRemainingDays(Math.floor(endTime / (1000 * 60 * 60 * 24)));
    }

    if (
      props.position.Applications &&
      props.position.Applications.length > 0 &&
      users &&
      users.length
    ) {
      const newApplicants = [] as any[];
      props.position.Applications.forEach((admin) => {
        if (users.some((u) => u.id === admin)) {
          newApplicants.push(users[users.findIndex((u) => u.id === admin)]);
        }
      });

      setApplicants(newApplicants);
    }
    // eslint-disable-next-line
  }, [users]);

  const handleApply = () => {
    //TODO: APPLY
  };

  return (
    <Modal
      size="medium"
      className={classes.root}
      isOpen={props.open}
      onClose={props.onClose}
      showCloseIcon
    >
      <div className={classes.modalContent}>
        <h3>{props.position.PositionName ?? ""}</h3>
        <Grid
          container
          spacing={2}
          direction="row"
          alignItems="flex-start"
          justify="flex-start"
        >
          <Grid item xs={12} md={6}>
            <div className="column">
              <div className={classes.flexRowInputsCommunitiesModal}>
                <div className={classes.infoHeaderCommunitiesModal}>Monthly salary</div>
                <img
                  className={classes.infoIconCommunitiesModal}
                  src={infoIcon}
                  alt={"info"}
                />
              </div>
              <p className={classes.leftSideDescription}>{`${props.position.PositionMonthlySalary} ${props.position.PositionSalaryToken}/month`}</p>
            </div>
            <div className="column">
              <div className={classes.flexRowInputsCommunitiesModal}>
                <div className={classes.infoHeaderCommunitiesModal}>Remaining</div>
                <img
                  className={classes.infoIconCommunitiesModal}
                  src={infoIcon}
                  alt={"info"}
                />
              </div>
              <p className={classes.leftSideDescription}>{remainingDays}</p>
            </div>
            <div className="column">
              <div className={classes.flexRowInputsCommunitiesModal}>
                <div className={classes.infoHeaderCommunitiesModal}>
                  Expected duration
                </div>
                <img
                  className={classes.infoIconCommunitiesModal}
                  src={infoIcon}
                  alt={"info"}
                />
              </div>
              <p className={classes.leftSideDescription}>{duration}</p>
            </div>
          </Grid>
          <Grid item xs={12} md={6}>
            <div className={classes.flexRowInputsCommunitiesModal}>
              <div className={classes.infoHeaderCommunitiesModal}>
                Position description
              </div>
              <img
                className={classes.infoIconCommunitiesModal}
                src={infoIcon}
                alt={"info"}
              />
            </div>
            <p className={classes.description}>
              {props.position.PositionDescription ?? ""}
            </p>
          </Grid>
        </Grid>
        {props.position.Applications ? (
          <div className="applicationsPartProject">
            <div className="applicationsHeaderProject">
              {`Applications (${applicants.length})`}
              {applicants && !applicants.some((u) => u === user.id) ? (
                <button onClick={handleApply}>Apply</button>
              ) : null}
            </div>
            {applicants.map((application) => {
              return (
                <Application application={application} key={application} />
              );
            })}
          </div>
        ) : null}
      </div>
    </Modal>
  );
}

const Application = (props) => {
  const classes = positionModalStyles();

  if (props.application)
    return (
      <div className="whiteRowProject">
        <div
          className={classes.flexStartCenterRowInputsCommunitiesModal}
          style={{
            width: "30%",
          }}
        >
          <div
            className={classes.authorPhotoProject}
            style={{
              backgroundImage:
                props.application.imageURL &&
                props.application.imageURL.length > 0
                  ? `url(${props.application.imageURL})`
                  : "none",
              backgroundRepeat: "no-repeat",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
          <div className={classes.authorNameProject}>
            {props.application.name ?? ""}
          </div>
        </div>
        <div
          className={classes.authorNameProject}
          style={{
            width: "20%",
          }}
        >
          {`Lvl ${props.application.level ?? ""}`}
        </div>
        <div
          className={classes.authorNameProject}
          style={{
            width: "20%",
          }}
        >
          {`Cred ${props.application.creds ?? ""}`}
        </div>
        <div
          className={classes.authorNameProject}
          style={{
            width: "30%",
          }}
        >
          {`Badges ${props.application.badges ?? ""}`}
        </div>
      </div>
    );
  else return null;
};
