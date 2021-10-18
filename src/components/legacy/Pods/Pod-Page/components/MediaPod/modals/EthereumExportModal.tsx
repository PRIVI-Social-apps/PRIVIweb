import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";
import axios from "axios";

import {
  makeStyles,
  Modal,
} from "@material-ui/core";
import { RootState } from "store/reducers/Reducer";
import { CircularLoadingIndicator } from "shared/ui-kit";
import URL from "shared/functions/getURL";
import { signTransaction } from "shared/functions/signTransaction";
import StyledCheckbox from "shared/ui-kit/Checkbox";
import AlertMessage from "shared/ui-kit/Alert/AlertMessage";

import "./EthereumExportModal.css";
import InputWithLabelAndTooltip from "shared/ui-kit/InputWithLabelAndTooltip";
import { CustomTable, CustomTableCellInfo, CustomTableHeaderInfo } from "shared/ui-kit/Table";

const exitIcon = require("assets/icons/cross_gray.png");
const earthIcon = require("assets/icons/earth_icon.png");
const penIcon = require("assets/icons/pen_icon.png");

const useStyles = makeStyles(theme => ({
  root: {
    width: "100%",
    "& > * + *": {
      marginTop: theme.spacing(2),
    },
  },
}));

export default function EthereumExportModal(props: any) {
  const user = useSelector((state: RootState) => state.user);
  const users = useSelector((state: RootState) => state.usersInfoList);

  const [collabs, setCollabs] = useState<any[]>([]);

  const [address, setAddress] = useState<string>("");
  const [acceptCost, setAcceptCost] = useState<boolean>(false);
  const [loadingWallet, setLoadingWallet] = useState<boolean>(false);

  const [status, setStatus] = useState<any>("");

  const classes = useStyles();

  const userSelector = useSelector((state: RootState) => state.user);

  const tableHeaders: Array<CustomTableHeaderInfo> = [{
      headerName: "Name"
    }, {
      headerName: "Royalties"
    }, {
      headerName: "Eth Address"
    }
  ];
  const [tableData, setTableData] = useState<Array<Array<CustomTableCellInfo>>>([]);

  useEffect(() => {
    const c = props.savedCollabs ?? [];

    console.log(c);
    if (c.length > 0) {
      c.forEach((collab, index) => {
        const thisUser = users.find(u => u.id === collab.id);
        if (thisUser) {
          c[index].imageURL = thisUser.imageURL;
          c[index].address = "";
        }
      });
    } else {
      const creatorInfo: any = users.find(u => u.id === props.creator || u.address === props.creator);
      console.log(creatorInfo, props.creator);
      if (creatorInfo) {
        c.push({
          firstName: creatorInfo.name,
          id: creatorInfo.id,
          address: creatorInfo.address,
          imageURL: creatorInfo.imageURL,
          royalty: 1,
        });
      }
    }

    //here we should load aswell the filled data (in case a collaborator
    //has answered). Here I'm considering for the ethereum export there should
    //be a list wit at least an object or something with the fields:
    //-id (collaborator id)
    //-status: (pending, accepted or declined)
    //-address (collaborator's address filled by them)

    //this list will be merged with the collaborators original list in this
    //modal to display the content

    setCollabs(c);
  }, []);

  const handleSave = () => {
    let cllbs = [...collabs];
    let ownCollab = collabs.findIndex(usr => usr.id === user.id);
    cllbs[ownCollab].address = address;
    setCollabs(cllbs);
  };

  const handleExportToEthereum = async () => {
    //this should open metamask to sign the transaction; after that
    //loading wallet should go back to false and call handleClickSuccess();
    if (props.isCreator) {
      //case 1: creator initiates the progress
      //TODO: check if the user has enough balance to pay?
      setLoadingWallet(true);
    } else {
      //case 2: collaborator saves their address
      if (address.length <= 0) {
        setStatus({
          msg: "Please correctly fill in your address",
          key: Math.random(),
          variant: "error",
        });
      } else {
        //TODO: save address
        setLoadingWallet(true);
      }
    }

    //this should open metamask to sign the transaction; after that
    //loading wallet should go back to false and call handleClickSuccess();

    const sigBody = {
      podName: props.pod.TokenName,
      podSymbol: props.pod.TokenSymbol,
      mediaSymbol: props.media.MediaSymbol,
      creators: collabs.map(x => x.address),
      royalties: collabs.map(x => x.royalty),
      seller: user.address,
    };
    const [hash, signature] = await signTransaction(userSelector.mnemonic, sigBody);
    let body: any = { ...sigBody };
    body.Hash = hash;
    body.Signature = signature;

    axios
      .post(`${URL()}/pod/NFT/exportToEthereum`, body)
      .then(res => {
        const resp = res.data;
        if (resp.success) {
          setStatus({
            msg: "Succesfully requested",
            key: Math.random(),
            variant: "success",
          });
        } else {
          setStatus({
            msg: "Error when making the request",
            key: Math.random(),
            variant: "error",
          });
        }
      })
      .catch(err => {
        setStatus({
          msg: "Error when making the request",
          key: Math.random(),
          variant: "error",
        });
      });
  };

  useEffect(() => {
    let data: Array<Array<CustomTableCellInfo>> = [];
    if (collabs && collabs.length) {
      data = collabs.map((collab) => {
        return [{
          cell: (
            <div style={{ display: "flex", alignItems: "center", flexWrap: "nowrap" }}>
              <div
                className="avatar"
                style={{
                  backgroundImage:
                    collab.imageURL && collab.imageURL.length > 0
                      ? `url(${collab.imageURL})`
                      : "none",
                  backgroundRepeat: "no-repeat",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  cursor: "pointer",
                }}
              />
              @{collab.firstName}
            </div>
          )
        }, {
          cell: `${collab.royalty ? (collab.royalty * 100).toFixed(0) : "N/A"}%`
        }, {
          cell: (
            <InputWithLabelAndTooltip
              disabled={collab.id !== user.id}
              style={{
                borderColor:
                  collab.status === "Declined"
                    ? "#F43E5F"
                    : collab.id !== user.id && collab.address && collab.address != ""
                      ? "#65CB63"
                      : "#E0E4F3",
              }}
              type='text'
              onInputValueChange={e => setAddress(e.target.value)}
              inputValue={
                collab.status === "Declined" ? "Declined" : collab.id === user.id ? address : ""
              }
              placeHolder={"0x..."}
            />
          )
        }];
      });
    }

    setTableData(data);
  }, [collabs]);

  return (
    <Modal open={props.open} onClose={props.handleClose} className="modal flexModal">
      <div className="ethereum-modal modal-content">
        <img
          className="exit"
          src={exitIcon}
          alt={"close"}
          onClick={() => (!loadingWallet ? props.handleClose() : {})}
        />
        {!loadingWallet ? (
          <section>
            <img src={earthIcon} alt={"earth"} />
            <h3>{`Export to Ethereum Network`}</h3>
            <h6>You are about to move your NFT from Privi to Ethereum network.</h6>

            <div className="collabsTable">
              <CustomTable
                headers={tableHeaders}
                rows={tableData}
              />
            </div>

            {props.isCreator ? (
              <p className="warning">
                {`This action `}
                <b>has a cost of $500</b>
                {` for the creation of the bridge between networks.\n
      This charge happens only once for this media.`}
              </p>
            ) : null}
            {props.isCreator ? (
              <label>
                <StyledCheckbox
                  checked={acceptCost}
                  onChange={event => {
                    setAcceptCost(!acceptCost);
                  }}
                />
                I understand and agree with the above statement.
              </label>
            ) : null}
            <div className="buttonsFlexRow">
              <button
                onClick={handleSave}
                style={{ marginRight: "5px" }}
                className={!acceptCost ? "disabled" : undefined}
              >
                Save address
              </button>
              {props.isCreator ? (
                <button
                  onClick={handleExportToEthereum}
                  style={{ marginLeft: "5px" }}
                  className={!acceptCost ? "disabled" : undefined}
                /*disabled={props.isCreator ? !acceptCost : false}*/
                >
                  Accept and Wait
                </button>
              ) : null}
            </div>
          </section>
        ) : (
          <section>
            <img src={penIcon} alt={"pen"} />
            <h3>{`Final Step!`}</h3>
            <h6>Your wallet will request you you to sign to authenticate the process</h6>
            <LoadingIndicatorWrapper>
              <CircularLoadingIndicator />
            </LoadingIndicatorWrapper>
          </section>
        )}

        <div className={classes.root}>
          {status && (
            <AlertMessage
              key={status.key}
              message={status.msg}
              variant={status.variant}
              onClose={() => setStatus(undefined)}
            />
          )}
        </div>
      </div>
    </Modal>
  );
}

const LoadingIndicatorWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding-top: 50px;
  padding-bottom: 65px;
`;
