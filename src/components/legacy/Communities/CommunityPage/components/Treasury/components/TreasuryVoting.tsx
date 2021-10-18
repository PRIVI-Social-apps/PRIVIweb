import React, {useEffect, useState} from "react";

import axios from "axios";

import { Header6, HeaderBold5, StyledDivider } from "shared/ui-kit";
import StyledCheckbox from "shared/ui-kit/Checkbox";
import Box from "shared/ui-kit/Box";
import TimeTrack from "./TimeTrack";
import { useStyles, SmileIcon, ProgressBar } from "../TreasuryStyle";
import URL from "../../../../../../../shared/functions/getURL";
import {useSelector} from "react-redux";
import {RootState} from "../../../../../../../store/reducers/Reducer";
import AlertMessage from "../../../../../../../shared/ui-kit/Alert/AlertMessage";

export default function TreasuryVoting(props) {
  const classes = useStyles();
  const userSelector = useSelector((state: RootState) => state.user);

  const [answer, setAnswer] = useState<any>({});

  const statusProps = props.status; // 1: voted, 2: ended voting, 3: start voting
  const [status, setStatus] = useState<any>("");

  useEffect(() => {
    console.log(props.data, status)
  }, [props.data]);

  const vote = () => {
    console.log(answer)
    if(answer && (answer.index || answer.index === 0)) {
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
  }

  return (
    <>
      <HeaderBold5>{props?.data?.Question || ''}</HeaderBold5>
      <Header6 className={classes.darkColor}>
        {props?.data?.Description || ''}
      </Header6>
      {statusProps === 1 && (
        <>
          <Box className={classes.votedStatus} mb={2}>
            {
              props?.data?.PossibleAnswers.map((answr, index) => {
                return(
                  <Box key={answr+'-'+index}
                       display="flex"
                       flexDirection="row"
                       mb={2}>
                    <StyledCheckbox
                      checked={answr === answer.answer}
                      onClick={() => setAnswer({
                        answer: answr,
                        index: index
                      })}
                    />
                    <Box ml={2}><span>{answr}</span></Box>
                  </Box>
                )
              })
            }
          </Box>
          <StyledDivider type="dashed" margin={1.5} />


          {
            props?.data?.Answers &&
            props?.data?.Answers.findIndex((answr) => answr.UserId === userSelector.id) !== -1 ?
              <Box display="flex"
                   flexDirection="row"
                   alignItems="center">
                <SmileIcon />
                <Box ml={2}>
                  <Header6 noMargin className={classes.darkColor}>
                    You’ve already voted
                  </Header6>
                </Box>
              </Box> :
              <Box display="flex"
                   flexDirection="row"
                   alignItems="center">
                <button onClick={() => vote()}>
                  Vote
                </button>
              </Box>
          }

          <StyledDivider type="dashed" margin={1.5} />
        </>
      )}
      {statusProps === 2 && (
        <>
          <Box display="flex" flexDirection="row" alignItems="center">
            <Box className={classes.progressTitle} mr={0.5}>Yes</Box>
            <Box flex={1} position="relative">
              <ProgressBar value={75} />
            </Box>
            <Box className={classes.progressPercentage} ml={0.5}>75%</Box>
          </Box>
          <Box display="flex" flexDirection="row" alignItems="center" position="relative">
            <Box className={classes.progressTitle} mr={0.5}>No</Box>
            <Box flex={1} position="relative">
              <ProgressBar value={25} />
            </Box>
            <Box className={classes.progressPercentage} ml={0.5}>25%</Box>
          </Box>
          <StyledDivider type="dashed" margin={1.5} />
        </>
      )}
      {statusProps === 3 && (
        <>
          <Box mb={2}>
            <Box display="flex" flexDirection="row" mb={2}>
              <StyledCheckbox
                onClick={() => { }}
              />
              <Box ml={2}><span>Yes</span></Box>
            </Box>
            <Box display="flex" flexDirection="row">
              <StyledCheckbox
                onClick={() => { }}
              />
              <Box ml={2}><span>No</span></Box>
            </Box>
          </Box>
          <TimeTrack />
        </>
      )}
      {/*<Box display="flex" flexDirection="row" alignItems="center">
        <FlagIcon />
        <Box ml={2}>
          <Header6 noMargin className={classes.darkColor}>4 votes of 100 required.</Header6>
        </Box>
      </Box>*/}
      {status ? (
        <AlertMessage
          key={status.key}
          message={status.msg}
          variant={status.variant}
        />
      ) : (
        ""
      )}
    </>
  )
}
