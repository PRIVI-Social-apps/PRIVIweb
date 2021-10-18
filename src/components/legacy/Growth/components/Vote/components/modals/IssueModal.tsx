import React, { useEffect, useState } from "react";
import { Modal } from "@material-ui/core";
import { useTypedSelector } from "store/reducers/Reducer";
import {
  StyledMenuItem,
  StyledSelect,
} from "shared/ui-kit/Styled-components/StyledComponents";
import "./IssueModal.css";
import { trackPromise } from "react-promise-tracker";
import AlertMessage from "shared/ui-kit/Alert/AlertMessage";
import axios from "axios";
import URL from "shared/functions/getURL";
import { signTransaction } from "shared/functions/signTransaction";
import InputWithLabelAndTooltip from "shared/ui-kit/InputWithLabelAndTooltip";

const infoIcon = require("assets/icons/info_icon.png");

export default function IssueModal(props) {
  const user = useTypedSelector((state) => state.user);

  const [wallet, setWallet] = useState<string>("PRIVI Wallet");
  const [amount, setAmount] = useState<string>("");
  const [selectedAnswerId, setSelectedAnswerId] = useState<number>(-1);
  const [msLeft, setMsLeft] = useState<number>(0);
  const [status, setStatus] = React.useState<any>("");

  const handleVote = async () => {
    let votingType = "";
    Object.values(props.issue.Answers ?? {}).forEach((answerObj: any) => {
      if (selectedAnswerId === answerObj.AnswerId) votingType = answerObj.Title;
    });
    const body: any = {
      VoterAddress: user.id,
      VotationId: props.issue.VotationId,
      StakedAmount: Number(amount),
      VotingAnswerId: selectedAnswerId,
    };
    const [hash, signature] = await signTransaction(user.mnemonic, body);
    body.Hash = hash;
    body.Signature = signature;
    console.log(body);
    trackPromise(
      axios.post(`${URL()}/voting/votePrediction`, body).then((res) => {
        const resp = res.data;
        if (resp.success) {
          setStatus({
            msg: "voting success",
            key: Math.random(),
            variant: "success",
          });
          setTimeout(() => {
            props.handleRefresh();
            props.handleClose();
          }, 1000);
        } else {
          setStatus({
            msg: "voting failed",
            key: Math.random(),
            variant: "error",
          });
        }
      })
    );
  };

  useEffect(() => {
    if (props.issue.EndingDate) {
      let timeLeft =
        new Date(props.issue.EndingDate * 1000).getTime() -
        new Date().getTime();
      setMsLeft(timeLeft);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleWalletChange = (wallet) => {
    setWallet(wallet);
  };

  useEffect(() => {
    if (props.issue.Voters[user.id])
      setSelectedAnswerId(props.issue.Voters[user.id].AnswerId);
  }, [user, props.issue]);

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
    <Modal
      open={props.open}
      onClose={props.handleClose}
      aria-labelledby="simple-modal-title"
      aria-describedby="simple-modal-description"
      className="modal modalCreateModal"
    >
      <div className="modal-content issue-modal">
        <div className="exit" onClick={props.handleClose}>
          <img
            src={require("assets/icons/x_darkblue.png")}
            alt={"x"}
          />
        </div>
        <div className="header">
          <div className="title">
            <h3>{props.issue.Title ? props.issue.Title : "Untitled Issue"}</h3>
            <div className="select-wallet">
              <StyledSelect
                disableUnderline
                name="type"
                value={wallet}
                onChange={(event: React.ChangeEvent<{ value: unknown }>) =>
                  handleWalletChange(event.target.value as string)
                }
                required
              >
                <StyledMenuItem value="PRIVI Wallet" key={1}>
                  PRIVI Wallet
                </StyledMenuItem>
                <StyledMenuItem value="Ethereum Wallet" key={2}>
                  Ethereum Wallet
                </StyledMenuItem>
              </StyledSelect>
            </div>
          </div>
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
          </div>
        </div>
        <div className="bottom">
          <div className="user">
            <div
              className="user-image"
              style={{
                backgroundImage:
                  props.creatorInfo.imageURL &&
                    props.creatorInfo.imageURL.length > 0
                    ? `url(${props.creatorInfo.imageURL})`
                    : "none",
                backgroundRepeat: "no-repeat",
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            />
            <p>
              {props.creatorInfo.name ? props.creatorInfo.name : "unnamed user"}
            </p>
          </div>
          <div className="bottom-area">
            <h5>Proposal Description</h5>
            <p>{props.issue.Description}</p>
            <div className="vote-area">
              <h5>Vote</h5>
              <div className="vote-info">
                <div className="column">
                  <span>Total votes</span>
                  <h4>
                    {props.issue.VotingYes ?? 0 + props.issue.VotingNo ?? 0}
                  </h4>
                </div>
                <div className="column">
                  <span>Time left</span>
                  <h4>{`${timeLeft()}`}</h4>
                </div>
                <div className="column">
                  <span>Reward</span>
                  <h4>{`${props.issue.Reward
                    ? (props.issue.Reward * 100).toFixed()
                    : 0
                    }%`}</h4>
                </div>
              </div>
              <span>
                Answers
                <img
                  src={infoIcon}
                  className="infoIconAddLiquidityModal"
                  alt="info"
                />
              </span>
              <div className="answers">
                {props.issue.Answers.map((answer, index) => {
                  return (
                    <div
                      className={
                        selectedAnswerId === index
                          ? "selected answer cursor-pointer"
                          : "answer cursor-pointer"
                      }
                      onClick={() => {
                        if (!props.issue.Voters[user.id])
                          setSelectedAnswerId(index);
                      }}
                      key={`answer-${index}`}
                    >
                      <p>{answer.Title}</p>
                      <p>{answer.Description}</p>
                    </div>
                  );
                })}
              </div>
              <div className="submit-vote">
                <label>
                  <InputWithLabelAndTooltip
                    labelName="Tokens (votes)"
                    tooltip={''}
                    placeHolder={`Token quantity`}
                    onInputValueChange={(event) => {
                      setAmount(event.target.value);
                    }}
                    type="number"
                    minValue={"0"}
                  />
                </label>
                <button onClick={handleVote}>Submit Vote</button>
              </div>
            </div>
          </div>
        </div>
        {status ? (
          <AlertMessage
            key={status.key}
            message={status.msg}
            variant={status.variant}
          />
        ) : (
          ""
        )}
      </div>
    </Modal>
  );
}
