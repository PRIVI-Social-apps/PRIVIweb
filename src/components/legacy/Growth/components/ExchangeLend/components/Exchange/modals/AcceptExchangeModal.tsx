import { Modal } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { getStyledTime } from "shared/functions/getStyledTime";
import {
  StyledSelect,
  StyledMenuItem,
} from "shared/ui-kit/Styled-components/StyledComponents";
import { useTypedSelector } from "store/reducers/Reducer";
import "./OfferModal.css";

export default function AcceptExchangeModal(props) {
  //store
  const users = useTypedSelector((state) => state.usersInfoList);

  //hooks
  const [proposals, setProposals] = useState<any[]>([]);
  const [time, setTime] = useState<string>("");
  const [wallet, setWallet] = useState<string>("PRIVI Wallet");

  const [totalValue, setTotalValue] = useState<number>(0);

  const [disableSubmit, setDisableSumbit] = useState<boolean>(false);

  useEffect(() => {
    //get date
    if (props.exchange.DateDue) {
      setTime(
        getStyledTime(
          new Date().getTime(),
          new Date(props.exchange.DateDue).getTime(),
          true
        )
      );
    }
    if (
      users.length > 0 &&
      props.exchange.Proposals &&
      props.exchange.Proposals.length > 0
    ) {
      const newProposals = [...props.exchange.Proposals];
      users.forEach((user) => {
        newProposals.forEach((proposal) => {
          if (proposal.User === user.id) {
            proposal.User = {
              id: proposal.User,
              name: user.name,
              imageURL: user.imageURL,
            };
            return;
          }
        });
      });
      setProposals(newProposals);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleWalletChange = (wallet) => {
    setWallet(wallet);
    //TODO: change into selected wallet ? i don't know if the name is enough
  };

  return (
    <Modal
      open={props.open}
      onClose={props.handleClose}
      aria-labelledby="simple-modal-title"
      aria-describedby="simple-modal-description"
      className="modal"
    >
      <div className="modal-content white-inputs offer-create-modal w50">
        <div className="exit" onClick={props.handleClose}>
          <img
            src={require("assets/icons/x_darkblue.png")}
            alt={"x"}
          />
        </div>
        <div className="title">
          <h2>Exchange</h2>
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
        <div className="offer-data">
          <div
            className="image"
            style={{
              backgroundImage:
                props.exchange.Token && props.exchange.Token.length > 0
                  ? `url(${require(`assets/tokenImages/${props.exchange.Token}.png`)})`
                  : "none",
              backgroundRepeat: "no-repeat",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
          <div className="column">
            <span>TOKEN</span>
            <p>{props.exchange.Token}</p>
          </div>
          <div className="column">
            <span>QUANTITY</span>
            <p>{props.exchange.Quantity}</p>
          </div>
          <div className="column">
            <span>EXCHANGE MODE</span>
            <p>{props.exchange.ExchangeMode}</p>
          </div>
          <div className="column">
            <span>TIME REMAINING</span>
            <p>{time}</p>
          </div>
        </div>
        <div className="input disabled">
          <span>Total value</span>
          <span>{`${totalValue} ${wallet.split(" ")[0]}`}</span>
        </div>
        <h3>Proposals</h3>
        <div className="offers-users">
          {proposals.map((proposal, index) => {
            return (
              <ProposalItem
                key={`proposal-${index}`}
                proposal={proposal}
                setDisableSumbit={setDisableSumbit}
                disableSubmit={disableSubmit}
                voters={[]}
              />
            );
          })}
        </div>
      </div>
    </Modal>
  );
}

const ProposalItem = (props) => {
  const handleAccept = () => {
    props.setDisableSumbit(false);
    //TODO: create exchange offer
    props.setDisableSumbit(true);
  };

  return (
    <div className="offer-item">
      <div className="user">
        <div
          className="user-image"
          style={{
            backgroundImage:
              props.proposal.User.imageURL &&
                props.proposal.User.imageURL.length > 0
                ? `url(${props.proposal.User.imageURL})`
                : "none",
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <span>{props.proposal.User.name}</span>
      </div>

      <span>
        {props.proposal.OfferTokens.map((offer, index) => {
          if (index === 0) return `${offer.Quantity} ${offer.Token}`;
          else return `, ${offer.Quantity} ${offer.Token}`;
        })}
      </span>
      <span>
        {getStyledTime(
          new Date().getTime(),
          new Date(props.proposal.Date).getTime(),
          true
        )}
      </span>
      <button onClick={handleAccept} disabled={props.disableSubmit}>
        Accept
      </button>
    </div>
  );
};
