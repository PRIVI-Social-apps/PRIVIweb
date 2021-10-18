import React, { useEffect, useState } from "react";
import { Box } from "@material-ui/core";

import { Color, Header6, HeaderBold4, HeaderBold5, StyledDivider } from "shared/ui-kit";
import {
  useStyles,
  ProgressAcceptIcon,
  ProgressDeclineIcon,
  ProgressPendingIcon,
  SmileIcon,
  ProgressBar,
} from "../../../index.styles";
import StyledCheckbox from "shared/ui-kit/Checkbox";
import axios from "axios";
import URL from "shared/functions/getURL";
import { useSelector } from "react-redux";
import { RootState } from "store/reducers/Reducer";
import AlertMessage from "shared/ui-kit/Alert/AlertMessage";
import TimeTrack from "shared/ui-kit/TimeTrack";

export default function TreasuryVoting(props) {
  const classes = useStyles();
  const userSelector = useSelector((state: RootState) => state.user);

  const [answer, setAnswer] = useState<any>({});

  const statusProps = props.status; // 1: voted, 2: ended voting, 3: start voting
  const [status, setStatus] = useState<any>("");

  useEffect(() => {
    console.log(props.data, status);
  }, [props.data]);

  const vote = () => {
    console.log(answer);
    if (answer && (answer.index || answer.index === 0)) {
      let data: any = {
        userId: userSelector.id,
        voteIndex: answer.index,
        type: "regular",
        votationId: props.data.id,
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
    } else {
      setStatus({
        msg: "Select an answer",
        key: Math.random(),
        variant: "error",
      });
    }
  };

  return (
    <>
      <HeaderBold5>{props?.data?.Question || ""}</HeaderBold5>
      <Header6>{props?.data?.Description || ""}</Header6>
      {statusProps === 1 && (
        <>
          <Box className={classes.votedStatus} mb={2}>
            {props?.data?.PossibleAnswers.map((answr, index) => {
              return (
                <Box key={answr + "-" + index} display="flex" flexDirection="row" mb={2}>
                  <StyledCheckbox
                    theme="dark"
                    checked={answr === answer.answer}
                    onClick={() =>
                      setAnswer({
                        answer: answr,
                        index: index,
                      })
                    }
                  />
                  <Box ml={2}>
                    <span>{answr}</span>
                  </Box>
                </Box>
              );
            })}
          </Box>
          <StyledDivider type="solid" margin={2} color={Color.White} />

          {props?.data?.Answers &&
          props?.data?.Answers.findIndex(answr => answr.UserId === userSelector.id) !== -1 ? (
            <Box display="flex" flexDirection="row" alignItems="center">
              <SmileIcon />
              <Box ml={1}>
                <Box>You’ve already voted</Box>
              </Box>
            </Box>
          ) : (
            <Box display="flex" flexDirection="row" alignItems="center">
              <button onClick={() => vote()}>Vote</button>
            </Box>
          )}

          <StyledDivider type="solid" margin={2} color={Color.White} />
        </>
      )}
      {statusProps === 2 && (
        <>
          <Box display="flex" flexDirection="row" alignItems="center">
            <Box mr={1}>Yes</Box>
            <Box flex={1} position="relative">
              <ProgressBar value={75} />
            </Box>
            <Box ml={1}>75%</Box>
          </Box>
          <Box display="flex" flexDirection="row" alignItems="center" position="relative">
            <Box mr={1}>No</Box>
            <Box flex={1} position="relative">
              <ProgressBar value={25} />
            </Box>
            <Box ml={1}>25%</Box>
          </Box>
          <StyledDivider type="solid" margin={2} color={Color.White} />
        </>
      )}
      {statusProps === 3 && (
        <>
          <Box mb={2}>
            <Box display="flex" flexDirection="row" mb={2}>
              <StyledCheckbox theme="dark" onClick={() => {}} />
              <Box ml={2}>
                <span>Yes</span>
              </Box>
            </Box>
            <Box display="flex" flexDirection="row">
              <StyledCheckbox theme="dark" onClick={() => {}} />
              <Box ml={2}>
                <span>No</span>
              </Box>
            </Box>
          </Box>
          <TimeTrack theme="dark" />
        </>
      )}
      {status ? <AlertMessage key={status.key} message={status.msg} variant={status.variant} /> : ""}
    </>
  );
}
