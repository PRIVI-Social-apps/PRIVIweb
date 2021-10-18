import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "store/reducers/Reducer";
import axios from "axios";
import URL from "shared/functions/getURL";
import User from './User'
import Card from "./Card";

const propsAreEqual = (prevProps, currProps) =>
  prevProps.project === currProps.project;

const ProjectCard = React.memo((props: any) => {
  const userSelector = useSelector((state: RootState) => state.user);

  const [upvotes, setUpvotes] = useState<number>(0);
  const [upvoted, setUpvoted] = useState<Boolean>(false);
  const [reacted, setReacted] = useState<Boolean>(false);

  const handleUpVote = () => {
    const body = {
      CollabId: props.project.CollabId,
      User: userSelector.id
    }
    axios
      .post(`${URL()}/collab/upvote`, body)
      .then((res) => {
        setUpvotes(upvotes + 1);
        setUpvoted(true);
      });
  };

  const handleReact = () => {
    const body = {
      CollabId: props.project.CollabId,
      User: userSelector.id
    }
    axios
      .post(`${URL()}/collab/react`, body)
      .then((res) => {
        setReacted(true);
      });
  };

  useEffect(() => {
    const newUpvotes = Object.keys(props.project.Upvotes ?? {}).length;
    const newVoted = props.project.Upvotes && props.project.Upvotes[userSelector.id] != undefined;
    setUpvotes(newUpvotes);
    setUpvoted(newVoted);
  }, [props.project.Upvotes, useSelector]);

  useEffect(() => {
    const newReacted = props.project.Reacts && props.project.Reacts[userSelector.id] != undefined;
    setReacted(newReacted);
  }, [props.project.Reacts, useSelector]);

  if (props.project) {
    let projectType;

    if (props.trending) projectType = "trending";
    else if (props.isMine) projectType = "mycollabs";
    else projectType = "";

    return (
      <div>
        <Card {...props} projectType={projectType} />
      </div>
    );
  } else return null;
}, propsAreEqual);

export default ProjectCard;
