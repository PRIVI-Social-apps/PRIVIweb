import "./Sidebar.css";
import React, {useEffect} from "react";
import { useTypedSelector } from "store/reducers/Reducer";
import URL from "shared/functions/getURL";
import {setSelectedUser} from "store/actions/SelectedUser";
import {useHistory} from "react-router-dom";
import {useDispatch} from "react-redux";

export default function TreasurySidebar(props) {

  useEffect(() => {
    console.log(props)
  }, []);

  return (
    <div className="treasury-sidebar">
      <h4>Treasury guards</h4>
      {props.treasuryGuards && props.treasuryGuards.length > 0 ? (
        props.treasuryGuards.map((guard: string) => {
          return <TreasuryGuard guard={guard}
                                key={guard} />;
        })
      ) : (
        <p>No treasury guards</p>
      )}
      <h4>Treasury history</h4>
      {props.treasuryHistory && props.treasuryHistory.length > 0 ? (
        props.treasuryHistory.map((history, index) => {
          return <HistoryElement history={history} key={`${index}-history`} />;
        })
      ) : (
        <p>No treasury history</p>
      )}
    </div>
  );
}

const TreasuryGuard = (props) => {
  const history = useHistory();
  const dispatch = useDispatch();

  return (
    <div className="row"
         style={{cursor: 'pointer'}}
         onClick={() => {
           history.push(`/profile/${props.guard.userId}`);
           dispatch(setSelectedUser(props.guard.userId));
         }}>
      <div
        className="image"
        style={{
          backgroundImage:
            props.guard &&
            props.guard.userId && props.guard.url
              ? `url(${props.guard.url}?${Date.now()})`
              : "none",
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      <p>
        {props.guard && props.guard.name
          ? props.guard.name
          : ""}
      </p>
    </div>
  );
};

const HistoryElement = (props) => {
  const user = useTypedSelector((state) => state.user);

  if (user.id !== props.history.Id) {
    return (
      <div className="history">
        <div
          className="image"
          style={{
            backgroundImage:
              props.history.userData &&
              props.history.userData.imageURL &&
              props.history.userData.imageURL != ""
                ? `url(${props.history.userData.imageURL})`
                : "none",
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <p>{`${
          props.history.userData && props.history.userData.name
            ? props.history.userData.name
            : ""
        } ${
          props.history.Action === "buy"
            ? "bought"
            : props.history.Action === "send"
            ? "donated"
            : ""
        }
                ${props.history.Quantity} ${props.history.Token} tokens`}</p>
      </div>
    );
  } else {
    return (
      <div className="history">
        <div
          className="image"
          style={{
            backgroundImage:
              props.history.Token && props.history.Token.length > 0
                ? props.history.TokenType &&
                  props.history.TokenType === "CRYPTO"
                  ? `url(${require(`assets/tokenImages/${props.history.Token}.png`)})`
                  : `url(${URL()}/wallet/getTokenPhoto/${props.history.Token})`
                : "none",
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <p>{`${
          props.history.Action === "buy"
            ? "Bought"
            : props.history.Action === "donate"
            ? "Donated"
            : ""
        }
                ${props.history.Quantity} ${props.history.Token} tokens`}</p>
      </div>
    );
  }
};
