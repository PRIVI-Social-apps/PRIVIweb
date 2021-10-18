import React, { useEffect, useState } from "react";
import { getStyledTime } from "shared/functions/getStyledTime";
import { useTypedSelector } from "store/reducers/Reducer";
import "./Task.css";
import TaskModal from "../modals/Task/TaskModal";
import RewardBadge from "./RewardBadge";

export default function Task(props) {
  //store
  const users = useTypedSelector((state) => state.usersInfoList);

  //hooks
  const [task, setTask] = useState<any>({});
  const [ongoing, setOngoing] = useState<boolean>(false);
  const [durationWidth, setDurationWidth] = useState<number>(0);

  //modal
  const [openTaskModal, setOpenTaskModal] = useState<boolean>(false);
  const handleOpenTaskModal = () => {
    setOpenTaskModal(true);
  };
  const handleCloseTaskModal = () => {
    setOpenTaskModal(false);
  };

  //use effect
  useEffect(() => {
    //load and set task data
    if (props.task) {
      let t = { ...props.task };

      //load user images
      if (t.Users && t.Users.length > 0 && users && users.length > 0) {
        t.UsersData = [] as any;

        t.Users.forEach((taskUser) => {
          if (users.some((user) => user.id === taskUser)) {
            const thisUser =
              users[users.findIndex((user) => user.id === taskUser)];
            t.UsersData.push({
              userImageURL: thisUser.imageURL,
              userName: thisUser.name,
            });
          }
        });

        //set ongoing
        if (t.EndDate) {
          setOngoing(new Date(t.EndDate).getTime() > new Date().getTime());
          if (new Date(t.EndDate).getTime() > new Date().getTime()) {
            //set duration bar width
            setDurationWidth(
              ((new Date(t.EndDate).getTime() - new Date().getTime()) /
                (new Date(t.EndDate).getTime() -
                  new Date(t.StartDate).getTime())) *
              100
            );
          }
        } else setOngoing(false);

        setTask(t);
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.task, users]);

  if (task)
    return (
      <div className="task-container">
        <div className="task cursor-pointer" onClick={handleOpenTaskModal}>
          <div className="top">
            <div
              className={`header ${task.Info
                  ? "info"
                  : ongoing
                    ? "ongoing"
                    : task.Completed
                      ? "completed"
                      : ""
                }
                    ${task.TokenImage ? "" : "noImage"}`}
            >
              {ongoing ? (
                <div className="ongoing-sign">ONGOING</div>
              ) : task.Completed ? (
                <div className="ongoing-sign">COMPLETED</div>
              ) : null}
              <div className="points-reward">
                <img
                  src={require(`assets/icons/points_white.png`)}
                  alt="star badge"
                />
                {`${task.RewardPoints} points reward`}
              </div>
            </div>

            {!task.Info && task.TokenImage ? (
              <div
                className="image"
                style={{
                  backgroundImage: task.TokenImage
                    ? `url(${require(`assets/tokenImages/${task.TokenImage}.png`)})`
                    : "none",
                  backgroundRepeat: "no-repeat",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              />
            ) : null}

            {task.RewardBadges && task.RewardBadges.length > 0 ? (
              <div className={task.TokenImage ? "badges" : "badges noImage"}>
                <span>Badges</span>
                {task.RewardBadges.map((badge, index) => (
                  <RewardBadge badge={badge} key={index} />
                ))}
              </div>
            ) : null}
            <p>{task.Title}</p>
            <p>{task.Description}</p>
          </div>
          <div className="bottom">
            {ongoing && task.EndDate ? (
              <div className="column">
                <div className="row">
                  <img
                    src={require("assets/icons/clock_green.png")}
                    alt={"clock"}
                  />
                  <span>{getStyledTime(new Date(), task.EndDate, false)}</span>
                </div>
                <div className="bar-container">
                  <div
                    className="color-bar"
                    style={{ width: `${durationWidth}%` }}
                  />
                </div>
              </div>
            ) : null}

            {task.UsersData && task.UsersData.length > 0 ? (
              <div className="users">
                <span>
                  {task.UsersData.length > 4
                    ? `+ ${task.UsersData.length - 4} ${task.Info ? "viewed this item" : ""
                    }`
                    : null}
                </span>
                {task.UsersData.map((user, index) => {
                  if (index < 4)
                    return (
                      <div
                        className="user-image"
                        style={{
                          backgroundImage:
                            user.userImageURL.length > 0
                              ? `url(${user.userImageURL})`
                              : "none",
                          backgroundRepeat: "no-repeat",
                          backgroundSize: "cover",
                          backgroundPosition: "center",
                        }}
                        key={`user-${index}`}
                      />
                    );
                })}
              </div>
            ) : null}
          </div>
        </div>
        <TaskModal
          open={openTaskModal}
          handleClose={handleCloseTaskModal}
          task={task}
        />
      </div>
    );
  else return null;
}
