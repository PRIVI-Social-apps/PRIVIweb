import React, { useEffect, useState } from "react";
import { useTypedSelector } from "store/reducers/Reducer";
import IssueModal from "./modals/IssueModal";

export default function IssueItem(props) {
  //store
  const users = useTypedSelector((state) => state.usersInfoList);
  const user = useTypedSelector((state) => state.user);

  //hooks
  const [creatorInfo, setCreatorInfo] = useState<any>({
    name: "",
    imageURL: "",
  });

  const [userVoted, setUserVoted] = useState<string>("");
  const [userStacked, setUserStacked] = useState<string>("");
  const [totalVotes, setTotalVotes] = useState<number>(0);

  const [msLeft, setMsLeft] = useState<number>(0);
  const [daysPerc, setDaysPerc] = useState<number>(0);

  const [openModalVote, setOpenModalVote] = useState<boolean>(false);

  const handleOpenModalVote = () => {
    setOpenModalVote(true);
  };

  const handleCloseModalVote = () => {
    setOpenModalVote(false);
  };

  useEffect(() => {
    //set days left and % of the bar
    if (props.issue.StartingDate) {
      let time =
        new Date(props.issue.EndingDate * 1000).getTime() -
        new Date(props.issue.StartingDate * 1000).getTime();
      let timeLeft =
        new Date(props.issue.EndingDate * 1000).getTime() -
        new Date().getTime();
      setMsLeft(timeLeft > 0 ? timeLeft : 0);
      setDaysPerc(timeLeft > 0 ? timeLeft / time : 1);
    }
    //set creator
    if (props.issue && props.issue.Creator) {
      users.forEach((u) => {
        if (u.id === props.issue.Creator) {
          setCreatorInfo({ name: u.name, imageURL: u.imageURL });
          return;
        }
      });
    }
    //check if user voted
    const voteObjList: any[] = Object.values(props.issue.Voters) ?? [];
    voteObjList.forEach((vote) => {
      if (vote.UserId === user.id) {
        setUserVoted(props.issue.Answers[vote.AnswerId].Title);
        setUserStacked(vote.Staked);
      }
    });
    setTotalVotes(voteObjList.length);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.issue]);

  const timeLeft = () => {
    const s = Math.floor(msLeft / 1000);
    const m = Math.floor(s / 60);
    const h = Math.floor(m / 60);
    const d = Math.floor(h / 24);
    if (d > 0) return `${d} day${d > 1 ? "s" : ""} left`;
    else if (h > 0) return `${h} hour${h > 1 ? "s" : ""} left`;
    else if (h > 0) return `${m} minute${m > 1 ? "s" : ""} left`;
    else if (h > 0) return `${s} second${s > 1 ? "s" : ""} left`;
    return "";
  };

  return (
    <div className="issue-item">
      <div className="header">
        <h3>{props.issue.Title ? props.issue.Title : "Untitled Issue"}</h3>
        <div className="tags">
          {props.issue.Tags &&
          props.issue.Tags.length &&
          props.issue.Tags.length > 0
            ? props.issue.Tags.map((tag) => {
                return (
                  <div className="tag" key={tag}>
                    {tag}
                  </div>
                );
              })
            : null}
          {props.issue.Source ? (
            <div className="tag" key={props.issue.Source}>
              {props.issue.Source}
            </div>
          ) : null}
        </div>
      </div>
      <div className="bottom">
        <div className="user">
          <div
            className="user-image"
            style={{
              backgroundImage:
                creatorInfo.imageURL && creatorInfo.imageURL.length > 0
                  ? `url(${creatorInfo.imageURL})`
                  : "none",
              backgroundRepeat: "no-repeat",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
          <p>{creatorInfo.name ? creatorInfo.name : "unnamed user"}</p>
        </div>
        <div className="bottom-area">
          <div className="row">
            <span>{`${timeLeft()}`}</span>
            <span>{`3 applications`}</span>
          </div>
          <div className="bar">
            <div
              className="color-bar"
              style={{ width: `${daysPerc * 100}%` }}
            />
          </div>
          <div className="vote-area">
            <div className="column">
              {userVoted ? <p>{`Voted ${userVoted}`}</p> : <p>{`Not Voted`}</p>}
              {userStacked ? (
                <span>{`(stacked ${userStacked} PRIVI)`}</span>
              ) : null}
            </div>
            <div>
              <button onClick={handleOpenModalVote}>Vote on this issue</button>
              <IssueModal
                issue={props.issue}
                open={openModalVote}
                creatorInfo={creatorInfo}
                handleRefresh={props.handleRefresh}
                handleClose={handleCloseModalVote}
              />
            </div>
            <span>{`${totalVotes} votes`}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
