import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { Theme, makeStyles, createStyles } from "@material-ui/core";

import { FlagIcon, ProgressBar, SmileIcon, TitleGrandLight } from "../../../index.styles";
import { RootState } from "store/reducers/Reducer";
import URL from "shared/functions/getURL";
import AlertMessage from "shared/ui-kit/Alert/AlertMessage";
import { Color, StyledDivider } from "shared/ui-kit";
import { DAOButton } from "components/PriviDAO/components/DAOButton";
import TimeTrack from "shared/ui-kit/TimeTrack";
import StyledCheckbox from "shared/ui-kit/Checkbox";
import Box from "shared/ui-kit/Box";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    content: {
      color: Color.White,
      fontSize: "18px",
      "& button": {
        margin: "0px !important",
      },
    },
    tag: {
      fontSize: "14px",
      marginBottom: "16px",
      padding: "8px 16px",
      background: "rgba(255, 255, 255, 0.16)",
      borderRadius: "16px",
      width: "fit-content",
    },
  })
);

export default function PollItem(props) {
  const userSelector = useSelector((state: RootState) => state.user);
  const classes = useStyles();

  const [selectedIndex, setSelectedIndex] = useState<number>(-1);
  const [alreadyVoted, setAlreadyVoted] = useState<boolean>(false);
  const [status, setStatus] = useState<any>("");
  const [finished, setFinished] = useState<boolean>(false);

  const [votes, setVotes] = useState<any>([]);

  //check if the user has previously voted
  useEffect(() => {
    if (props.item.EndingDate && new Date(props.item.EndingDate).getTime() < new Date().getTime()) {
      setFinished(true);
    }

    let votesList = [] as any;

    if (props.item.PossibleAnswers) {
      props.item.PossibleAnswers.forEach(option => {
        votesList.push(0);
      });
    }

    if (props.item.Answers) {
      props.item.Answers.forEach(vote => {
        if (vote.VoteIndex !== undefined) {
          votesList[vote.VoteIndex] = votesList[vote.VoteIndex] + 1;
        }

        if (vote.UserId === userSelector.id) {
          setSelectedIndex(vote.VoteIndex);
          setAlreadyVoted(true);
        }
      });
    }

    setVotes(votesList);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.item, props.item?.EndingDate, props.item?.Answers, props.item?.PossibleAnswers]);

  const addVote = () => {
    let data: any = {
      userId: userSelector.id,
      voteIndex: selectedIndex,
      type: "regular",
      votationId: props.item.id,
      itemType: props.itemType,
      itemId: props.itemId,
    };
    axios
      .post(`${URL()}/voting/vote`, data)
      .then(res => {
        const resp = res.data;
        if (resp.success) {
          setStatus({
            msg: "Vote made",
            key: Math.random(),
            variant: "success",
          });
          setTimeout(() => {
            props.onRefreshInfo();
            setStatus("");
          }, 1000);
        } else {
          console.log(resp.error);
          setStatus({
            msg: resp.error,
            key: Math.random(),
            variant: "error",
          });
        }
      })
      .catch(err => {
        console.log("Error voting:", err);
        setStatus({
          msg: "Error voting",
          key: Math.random(),
          variant: "error",
        });
      });
  };

  if (props.item)
    return (
      <div className={classes.content}>
        {props.item.cofoundersOnly && <div className={classes.tag}>🔒 Co-Founders Only</div>}
        <TitleGrandLight disableUppercase fontSize={"20px"} mb={2}>
          {props.item.Question ?? "No Question"}
        </TitleGrandLight>
        <StyledDivider type="solid" color={Color.White} />
        <Box component={"p"} mb={2}>
          {props.item.Description}
        </Box>

        <Box mb={2}>
          {finished ? (
            votes.length > 0 &&
            props.item.Answers.length > 0 &&
            props.item.PossibleAnswers.length > 0 &&
            props.item.PossibleAnswers.map((answer, index) => (
              <Box display="flex" flexDirection="row" alignItems="center" mb={1}>
                <Box mr={"16px"}>{answer}</Box>
                <Box flex={1} position="relative">
                  <ProgressBar theme="dark" value={(votes[index] / props.item.Answers.length) * 100} />
                </Box>
                <Box ml={"16px"}>{`${(votes[index] / props.item.Answers.length) * 100}%`}</Box>
              </Box>
            ))
          ) : props.item.PossibleAnswers.length > 0 ? (
            props.item.PossibleAnswers.map((answer, index) => {
              return (
                <Box display="flex" flexDirection="row" mb={2}>
                  <StyledCheckbox
                    theme="dark"
                    checked={index === selectedIndex ? true : false}
                    onChange={event => {
                      if (event.target.checked) {
                        setSelectedIndex(index);
                      }
                    }}
                  />
                  <Box ml={2}>
                    <span>{answer}</span>
                  </Box>
                </Box>
              );
            })
          ) : (
            <TitleGrandLight disableUppercase fontSize={"14px"}>
              No answers to choose
            </TitleGrandLight>
          )}

          <Box mt={3}>
            {!finished && !alreadyVoted && <DAOButton insideCard onClick={addVote}>{`Vote`}</DAOButton>}
          </Box>
        </Box>

        {!finished && props.item.EndingDate && (
          <TimeTrack marginBottom="16px" theme="dark" endTime={new Date(props.item.EndingDate)} />
        )}

        <StyledDivider type="solid" color={Color.White} />
        {!finished && alreadyVoted && (
          <Box display="flex" alignItems="center" mt={2}>
            <SmileIcon />
            <Box ml={"12px"}>You've already voted</Box>
          </Box>
        )}
        <Box display="flex" alignItems="center" mb={2} mt={2}>
          <FlagIcon />
          <Box ml={"12px"}>
            <b>{props.item.NumVotes ?? 0}</b> of <b>{props.item.NumVotesRequired ?? "N/A"}</b> required.
          </Box>
        </Box>
        {status ? <AlertMessage message={status.msg} variant={status.variant} /> : ""}
      </div>
    );
  else return null;
}
