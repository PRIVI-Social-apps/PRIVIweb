import React, { useEffect, useState } from "react";
import { useTypedSelector } from "store/reducers/Reducer";
import { Modal } from "@material-ui/core";
import AlertMessage from "shared/ui-kit/Alert/AlertMessage";
import "shared/ui-kit/Modal/Modals/Modal.css";
import "./AuditModal.css";

export const sampleData = [
  {
    User: "Px04ef761d-2857-4b00-a6db-f6a8c47244af",
    Claims: 23,
    Perc: 0.67,
    Price: 11,
  },
  {
    User: "Px2724ac32-c0eb-43f0-b2ea-49e84480d670",
    Claims: 11,
    Perc: 0.85,
    Price: 13,
  },
  {
    User: "Px397a7c3e-76c5-453e-b27e-134642e3fd5c",
    Claims: 45,
    Perc: 0.82,
    Price: 15,
  },
];

export default function AuditModal(props) {
  const users = useTypedSelector((state) => state.usersInfoList);

  const [disableSubmit, setDisableSubmit] = useState<boolean>(true);
  //set to true when we don't want the user to perform certain actions
  //to make sure the data is fully updated before doing anyting

  const [balance, setBalance] = useState<number>(0);
  const [underwriters, setUnderwriters] = useState<any[]>([]);
  const [selectedUnderwriter, setSelectedUnderwriter] = useState<string>("");
  const [status, setStatus] = React.useState<any>("");

  useEffect(() => {
    //TODO: correctly load underwriters and users

    const underwritersList = [...sampleData] as any;
    if (users && users.length > 0) {
      underwritersList.forEach((underwriter, index) => {
        if (users.some((user) => user.id === underwriter.User)) {
          underwritersList[index].userInfo =
            users[users.findIndex((user) => user.id === underwriter.User)];
        }
      });
    }

    setUnderwriters(underwritersList);
  }, [users]);

  // used to get user funding token balance
  useEffect(() => {
    setDisableSubmit(true);
    //TODO: get PRIVI balance

    /* eslint-disable react-hooks/exhaustive-deps */
  }, [props.pod]);

  const handleAudit = () => {
    if (selectedUnderwriter.length > 0) {
      //TODO: audit
      props.refreshPod();
    }
  };

  const ListElement = (props) => {
    if (props.row) {
      return (
        <div
          className={
            props.row.User === selectedUnderwriter
              ? "row selected clickable"
              : "row clickable"
          }
          onClick={() => {
            setSelectedUnderwriter(props.row.User);
            if (!disableSubmit) setDisableSubmit(true);
          }}
        >
          <div className="user">
            <div className="circle">
              <div
                className={
                  props.row.User === selectedUnderwriter ? "filled" : ""
                }
              />
            </div>
            <div
              className="user-image"
              style={{
                backgroundImage:
                  props.row.userInfo &&
                  props.row.userInfo.imageURL &&
                  props.row.userInfo.imageURL.length > 0
                    ? `url(${props.row.userInfo.imageURL})`
                    : "none",
                backgroundRepeat: "no-repeat",
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            />
            <p>
              {props.row.userInfo && props.row.userInfo.name
                ? props.row.userInfo.name
                : ""}
            </p>
          </div>
          <p>{`${props.row.Claims} claims`}</p>
          <p>{`${(props.row.Perc * 100).toFixed(0)}`}</p>
          <p>{`${props.row.Price} PRIVI`}</p>
        </div>
      );
    } else return null;
  };

  return (
    <Modal
      open={props.open}
      onClose={props.handleClose}
      aria-labelledby="simple-modal-title"
      aria-describedby="simple-modal-description"
      className="modal"
    >
      <div className="modal-content w50 audit-modal">
        <div className="exit" onClick={props.handleClose}>
          <img
            src={require("assets/icons/x_darkblue.png")}
            alt={"x"}
          />
        </div>
        <div className="title">
          <h2>Request Pod Audit</h2>
          <div className="select-wallet">
            <div className="balance">
              <p>
                <span>Balance</span>
                <span>{`${balance} PRIVI`}</span>
              </p>
            </div>
          </div>
        </div>
        <h3>Principal Underwriter list</h3>
        <div className="underwriters-list">
          <div className="header">
            <p></p>
            <p>APPROVED</p>
            <p>%</p>
            <p>PRICE</p>
          </div>
          <div className="body">
            {underwriters.map((underwriter, i) => {
              return (
                <ListElement
                  key={i}
                  index={underwriter.User}
                  row={underwriter}
                />
              );
            })}
          </div>
        </div>
        <button onClick={handleAudit} disabled={disableSubmit}>
          Send request for Pod Audit
        </button>
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
