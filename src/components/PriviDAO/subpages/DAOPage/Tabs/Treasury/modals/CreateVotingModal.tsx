import React, { useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";

import Grid from "@material-ui/core/Grid";

import { Modal } from "shared/ui-kit";
import InputWithLabelAndTooltip from "shared/ui-kit/InputWithLabelAndTooltip";
import { RootState } from "store/reducers/Reducer";
import { DateInput } from "shared/ui-kit/DateTimeInput";
import AlertMessage from "shared/ui-kit/Alert/AlertMessage";
import URL from "shared/functions/getURL";
import { DAOButton, DAOButtonPlain } from "components/PriviDAO/components/DAOButton";
import Box from 'shared/ui-kit/Box';
import { TitleGrandLight, useStyles } from "../../../index.styles";

const infoIcon = require("assets/icons/info_white.png");

const CreateVotingModal = (props: any) => {
  const userSelector = useSelector((state: RootState) => state.user);

  const classes = useStyles();

  const [voting, setVoting] = useState<any>({
    startingDate: new Date().getTime(),
    endingDate: new Date().getTime(),
  });
  const [possibleAnswers, setPossibleAnswers] = useState<any[]>([]);
  const [answer, setAnswer] = useState<string>("");
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
        voting.itemType = "Community";
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

  const renderInputsVoting = (p: any) => {
    return (
      <InputWithLabelAndTooltip
        labelName={p.name}
        tooltip={p.tooltip ?? ""}
        inputValue={voting[p.item]}
        minValue={`${p.min || 0}`}
        type={p.type}
        onInputValueChange={e => {
          let votignCopy = { ...voting };
          votignCopy[p.item] = e.target.value;
          setVoting(votignCopy);
        }}
        placeHolder={p.placeholder}
        theme="dark"
      />
    );
  };

  return (
    <Modal
      isOpen={props.open}
      onClose={props.onClose}
      showCloseIcon
      size="medium"
      theme="dark"
      className={classes.rootAuto}
    >
      <Box width="892px">
        <TitleGrandLight disableUppercase fontSize="30px" mb={5}>
          Create Voting
        </TitleGrandLight>

        <Grid container spacing={3} direction="row">
          <Grid item xs={12} md={6}>
            {renderInputsVoting({
              name: "Question",
              placeholder: "Write your question",
              type: "text",
              item: "question",
              index: 2,
            })}
          </Grid>
          <Grid item xs={12} md={6}>
            <Box display="flex" alignItems="center">
              <Box mr={0.5} fontSize="18px">
                Starting date
              </Box>
              <img src={infoIcon} alt={"info"} />
            </Box>
            <Box>
              <DateInput
                theme="dark"
                id="date-picker-starting-date"
                height={46}
                customStyle={{ marginTop: 8 }}
                minDate={new Date()}
                format="MM.dd.yyyy"
                placeholder="Select date..."
                value={voting.startingDate}
                onChange={(event: any) => {
                  handleStartingDate(event);
                }}
              />
            </Box>
          </Grid>

          <Grid item xs={12} md={6}>
            {renderInputsVoting({
              name: "Description",
              placeholder: "Poll description",
              type: "text",
              item: "description",
              index: 2,
            })}
          </Grid>
          <Grid item xs={12} md={6}>
            <Box display="flex" alignItems="center">
              <Box mr={0.5} fontSize="18px">
                Ending date
              </Box>
              <img src={infoIcon} alt={"info"} />
            </Box>
            <Box>
              <DateInput
                theme="dark"
                id="date-picker-expiration-date"
                height={46}
                customStyle={{ marginTop: 8 }}
                minDate={new Date()}
                format="MM.dd.yyyy"
                placeholder="Select date..."
                value={voting.endingDate}
                onChange={(event: any) => {
                  handleEndingDate(event);
                }}
              />
            </Box>
          </Grid>
        </Grid>

        <Grid container spacing={3} direction="row" style={{ alignItems: "flex-end", marginTop: "16px" }}>
          {possibleAnswers &&
            possibleAnswers.map((item, i) => {
              return (
                <React.Fragment key={i}>
                  <Grid item xs={12} md={8}>
                    <InputWithLabelAndTooltip
                      theme="dark"
                      labelName={`Answer ${i + 1}`}
                      disabled
                      type="text"
                      inputValue={item}
                    />
                  </Grid>
                  <Grid item xs={12} md={4} className={classes.maxWidth}>
                    <DAOButtonPlain
                      onClick={() => {
                        if (item && item !== "") {
                          let answersCopy = [...possibleAnswers];
                          answersCopy.splice(i, 1);
                          setPossibleAnswers(answersCopy);
                        }
                      }}
                    >
                      Remove
                    </DAOButtonPlain>
                  </Grid>
                </React.Fragment>
              );
            })}
        </Grid>

        <Grid container spacing={3} style={{ alignItems: "flex-end", marginTop: "8px" }}>
          <Grid item xs={12} md={8}>
            <InputWithLabelAndTooltip
              labelName="Answer"
              type="text"
              onInputValueChange={e => {
                setAnswer(e.target.value);
              }}
              inputValue={answer}
              placeHolder="Write possible answer"
              theme="dark"
              tooltip=""
            />
          </Grid>
          <Grid item xs={12} md={4} className={classes.maxWidth}>
            <DAOButtonPlain
              onClick={() => {
                if (answer && answer !== "") {
                  let answersCopy = [...possibleAnswers];
                  answersCopy.push(answer);
                  setAnswer("");
                  setPossibleAnswers(answersCopy);
                }
              }}
            >
              Add Answer
            </DAOButtonPlain>
          </Grid>
        </Grid>

        <Box display="flex" justifyContent="flex-end" mt={6}>
          <DAOButton onClick={() => createVoting()}>Confirm and submit</DAOButton>
        </Box>
        {status ? <AlertMessage key={status.key} message={status.msg} variant={status.variant} /> : ""}
      </Box>
    </Modal>
  );
};

export default CreateVotingModal;
