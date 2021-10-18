import React, { useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";

import Grid from "@material-ui/core/Grid";

import { createVotingModalStyles } from "./CreateVotingModal.styles";
import URL from "shared/functions/getURL";
import { Modal } from "shared/ui-kit";
import InputWithLabelAndTooltip from "shared/ui-kit/InputWithLabelAndTooltip";
import { RootState } from "store/reducers/Reducer";
import { DateInput } from "shared/ui-kit/DateTimeInput";
import { DAOButton, DAOButtonPlain } from "components/PriviDAO/components/DAOButton";
import AlertMessage from "shared/ui-kit/Alert/AlertMessage";
import Box from 'shared/ui-kit/Box';

const infoIconWhite = require("assets/icons/info_white.png");

const CreateVotingModal = (props: any) => {
  const userSelector = useSelector((state: RootState) => state.user);
  const classes = createVotingModalStyles();

  const [voting, setVoting] = useState<any>({
    startingDate: new Date().getTime(),
    endingDate: new Date().getTime(),
  });
  const [possibleAnswers, setPossibleAnswers] = useState<any[]>([""]);
  const [status, setStatus] = useState<any>("");

  const handleStartingDate = (elem: any) => {
    let votingCopy = { ...voting };
    votingCopy.startingDate = new Date(elem).getTime();
    setVoting(votingCopy);
  };

  const handleEndingDate = (elem: any) => {
    let votingCopy = { ...voting };
    votingCopy.endingDate = new Date(elem).getTime();
    setVoting(votingCopy);
  };

  const createVoting = () => {
    if (voting.startingDate && voting.endingDate && voting.startingDate < voting.endingDate) {
      if (
        voting &&
        voting.question &&
        voting.question !== "" &&
        possibleAnswers &&
        possibleAnswers.length > 0 &&
        voting.description &&
        voting.description !== ""
      ) {
        voting.possibleAnswers = [...possibleAnswers];
        voting.type = "regular";
        voting.itemType = props.type;
        voting.itemId = props.id;
        voting.creatorAddress = userSelector.id;
        voting.creatorId = userSelector.id;
        voting.userId = userSelector.id;

        axios
          .post(`${URL()}/voting/create`, voting)
          .then(res => {
            const resp = res.data;
            if (resp.success) {
              setStatus({
                msg: "Voting created",
                key: Math.random(),
                variant: "success",
              });
              setTimeout(() => {
                props.onRefreshInfo();
                props.onClose();
              }, 300);
            } else {
              setStatus({
                msg: resp.error || "Error creating Voting",
                key: Math.random(),
                variant: "error",
              });
            }
          })
          .catch(err => {
            console.log(err);
            setStatus({
              msg: "An error has occur",
              key: Math.random(),
              variant: "error",
            });
          });
      } else {
        setStatus({
          msg: "Fill in all fields",
          key: Math.random(),
          variant: "error",
        });
      }
    } else {
      setStatus({
        msg: "Ending date has to be bigger that Starting date",
        key: Math.random(),
        variant: "error",
      });
    }
  };

  return (
    <Modal
      size="medium"
      isOpen={props.open}
      onClose={props.onClose}
      showCloseIcon
      className={classes.root}
      theme={"dark"}
    >
      <Box color="white" fontSize="18px" display="flex" flexDirection="column">
        <Box fontSize="30px" mb={3}>
          {props.title}
        </Box>
        {props.type === "Community" && <Box mb={3}>General voting info</Box>}
      </Box>
      <Box mb={2}>
        <Grid container spacing={2} direction="row">
          <Grid item xs={12} sm={6}>
            <InputWithLabelAndTooltip
              labelName={"Question"}
              tooltip={""}
              inputValue={voting.question}
              type={"text"}
              onInputValueChange={e => {
                let votignCopy = { ...voting };
                votignCopy.question = e.target.value;
                setVoting(votignCopy);
              }}
              placeHolder={"Write your question"}
              theme={"dark"}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Box display="flex" alignItems="center">
              <Box mr={"4px"} fontSize="18px">Starting date</Box>
              <img src={infoIconWhite} alt={"info"} />
            </Box>
            <DateInput
              theme="dark"
              id="date-picker-starting-date"
              customStyle={{ marginTop: 8 }}
              minDate={new Date()}
              format="MM.dd.yyyy"
              placeholder="Select date..."
              value={voting.startingDate}
              onChange={(event: any) => {
                handleStartingDate(event);
              }}
            />
          </Grid>
        </Grid>
      </Box>
      <Box mb={2}>
        <Grid container spacing={2} direction="row">
          <Grid item xs={12} md={6}>
            <InputWithLabelAndTooltip
              labelName={"Description"}
              tooltip={""}
              inputValue={voting.description}
              type={"text"}
              onInputValueChange={e => {
                let votignCopy = { ...voting };
                votignCopy.description = e.target.value;
                setVoting(votignCopy);
              }}
              placeHolder={"Write your description"}
              theme={"dark"}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Box display="flex" alignItems="center">
              <Box mr={"4px"} fontSize="18px">Ending date</Box>
              <img src={infoIconWhite} alt={"info"} />
            </Box>
            <DateInput
              theme="dark"
              id="date-picker-expiration-date"
              customStyle={{ marginTop: 8 }}
              minDate={new Date()}
              format="MM.dd.yyyy"
              placeholder="Select date..."
              value={voting.endingDate}
              onChange={(event: any) => {
                handleEndingDate(event);
              }}
            />
          </Grid>
        </Grid>
      </Box>
      {possibleAnswers &&
        possibleAnswers.map((item, i) => {
          return (
            <Box mb={1}>
              <Grid key={i} container direction="row" spacing={2} alignItems="flex-end">
                <Grid item xs={12} md={8}>
                  <InputWithLabelAndTooltip
                    labelName={`Answer ${i + 1}`}
                    tooltip={""}
                    inputValue={possibleAnswers[i]}
                    type={"text"}
                    onInputValueChange={e => {
                      let possibleAnswersCopy = [...possibleAnswers];
                      possibleAnswersCopy[i] = e.target.value;
                      setPossibleAnswers(possibleAnswersCopy);
                    }}
                    placeHolder={"Write your answer"}
                    theme={"dark"}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <Box display="flex" justifyContent="flex-end">
                    <DAOButtonPlain
                      onClick={() => {
                        let answersCopy = [...possibleAnswers];

                        if (possibleAnswers[i] !== "" && possibleAnswers.length > 1) {
                          answersCopy.splice(i, 1);
                        } else if (possibleAnswers[i] === "") {
                          answersCopy.push("");
                        }

                        setPossibleAnswers(answersCopy);
                      }}
                    >
                      {possibleAnswers[i] !== "" ? "Remove" : "Add Answer"}
                    </DAOButtonPlain>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          );
        })}

      <Box display="flex" width="100%" justifyContent="flex-end" mt={6}>
        <DAOButton onClick={createVoting}>Post Voting</DAOButton>
      </Box>
      {status ? <AlertMessage key={status.key} message={status.msg} variant={status.variant} /> : ""}
    </Modal>
  );
};

export default CreateVotingModal;
