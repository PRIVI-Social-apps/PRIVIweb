import React, { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import axios from "axios";

import Grid from "@material-ui/core/Grid";
import { makeStyles } from "@material-ui/core/styles";
import { Tooltip, Fade } from "@material-ui/core";

import { setUpdateBasicInfo } from "store/actions/UpdateBasicInfo";
import URL from "shared/functions/getURL";
import AlertMessage from "shared/ui-kit/Alert/AlertMessage";

import "./Pod-modal-edit.css";
import InputWithLabelAndTooltip from "shared/ui-kit/InputWithLabelAndTooltip";

const infoIcon = require("assets/icons/info_icon.png");

const useStyles = makeStyles(theme => ({
  root: {
    width: "100%",
    "& > * + *": {
      marginTop: theme.spacing(2),
    },
  },
}));

const PodModalEdit = props => {
  const dispatch = useDispatch();
  const history = useHistory();

  const classes = useStyles();

  const [pod, setPod] = useState<any>({});

  const inputRef: any = useRef([]);

  const [status, setStatus] = useState<any>("");

  const [editionProgress, setEditionProgress] = useState(false);

  useEffect(() => {
    if (props.pod) {
      const podCopy = { ...props.pod };
      podCopy.IsDigital = props.type === "nft" ? true : false;
      setPod(podCopy);

      inputRef.current = new Array(4);
    }

    //eslint-disable react-hooks/exhaustive-deps
  }, [props.pod]);

  const checkSlug = async () => {
    const acceptedChars = "^[a-zA-Z0-9\\._' ]{1,100}$";
    pod.urlSlug.match(acceptedChars);

    //check special characters
    if (!pod.urlSlug.match(acceptedChars)) {
      setStatus({
        msg: "Please type only letters, numbers, or special characters . and _",
        key: Math.random(),
        variant: "error",
      });
      return false;
    } else {
      if (pod.urlSlug.includes(".", pod.urlSlug.length - 1)) {
        setStatus({
          msg: "URL can't end with a .",
          key: Math.random(),
          variant: "error",
        });
        return false;
      } else if (pod.urlSlug.includes(".", 0)) {
        setStatus({
          msg: "URL can't start with a .",
          key: Math.random(),
          variant: "error",
        });
        return false;
      } else {
        //check if slug exists
        axios
          .get(
            `${URL()}/pod/checkSlugExists/${pod.urlSlug}/${pod.PodAddress}/${props.type === "nft" ? "nftpod" : "ftpod"
            }`
          )
          .then(response => {
            if (response.data.success) {
              if (response.data.data.urlSlugExists) {
                setStatus({
                  msg: "pod with this url already exists, please choose another one",
                  key: Math.random(),
                  variant: "error",
                });
                return false;
              } else {
                return true;
              }
            } else {
              setStatus({
                msg: "error when checking url, please try again",
                key: Math.random(),
                variant: "error",
              });
              return false;
            }
          })
          .catch(error => {
            setStatus({
              msg: "error when making the request, please try again",
              key: Math.random(),
              variant: "error",
            });
            return false;
          });
      }
    }
  };

  const editPod = () => {
    if (checkSlug()) {
      setEditionProgress(true);

      axios
        .post(`${URL()}/pod/editPod`, pod)
        .then(response => {
          if (response.data.success) {
            setStatus({
              msg: "Pod edited successfully!",
              key: Math.random(),
              variant: "success",
            });
            setEditionProgress(false);
            setTimeout(() => {
              let url = `/privi-pods/${props.type === "nft" ? "NFT" : "FT"}/${pod.urlSlug}`;
              history.push(url);
              dispatch(setUpdateBasicInfo(true));
              props.onCloseModal();
            }, 1000);
          } else {
            setStatus({
              msg: "error when editing the pod",
              key: Math.random(),
              variant: "error",
            });
            setEditionProgress(false);
          }
        })
        .catch(error => {
          setStatus({
            msg: "error when making the request",
            key: Math.random(),
            variant: "error",
          });
          setEditionProgress(false);
        });
    }
  };

  function renderInputEditModal(props) {
    return (
      <div key={`${props.index}-input-container`}>
        <InputWithLabelAndTooltip
          labelName={props.name}
          tooltip={props.info}
          overriedClasses="textFieldEdit"
          type={props.type}
          inputValue={pod[props.item]}
          onInputValueChange={elem => {
            let podCopy = { ...pod };
            podCopy[props.item] = elem.target.value;
            setPod(podCopy);
          }}
          placeHolder={props.placeholder}
        />
      </div>
    );
  }

  if (props.pod)
    return (
      <div className="modalPodEditFullDiv">
        <div className="modalCreatePadding">
          <div className="exit" onClick={props.onCloseModal}>
            <img src={require("assets/icons/x_darkblue.png")} alt={"x"} />
          </div>
          <div className="modalHeaderEdit">Edit Pod</div>
          <Grid container spacing={3} direction="row" alignItems="flex-start" justify="flex-start">
            <Grid item xs={12} md={6}>
              {renderInputEditModal({
                name: "Pod Name",
                placeholder: "Fill in this field",
                type: "text",
                width: 100,
                item: "Name",
                index: 0,
                info: false,
              })}
            </Grid>
            <Grid item xs={12} md={6}>
              {renderInputEditModal({
                name: "Pod URL",
                placeholder: "Enter a custom URL",
                type: "text",
                width: 100,
                item: "urlSlug",
                index: 2,
                info: "Customize your Pod's URL with a custom Slug, to display in the navigation bar",
              })}
            </Grid>
            <Grid item xs={12} md={12}>
              <div className="flexRowInputs">
                <div className="infoHeaderEdit">Pod Description</div>
                <Tooltip
                  TransitionComponent={Fade}
                  TransitionProps={{ timeout: 600 }}
                  arrow
                  className="tooltipProfileInfo"
                  title={"Write a text to describe your Pod."}
                >
                  <img className="infoIconEdit" src={infoIcon} alt={"info"} />
                </Tooltip>
              </div>
              <textarea
                className="textAreaEdit"
                value={pod.Description}
                maxLength={150}
                onChange={elem => {
                  let podCopy = { ...pod };
                  podCopy.Description = elem.target.value;
                  setPod(podCopy);
                }}
                placeholder="Describe your Pod"
              />
            </Grid>
            <Grid item xs={12} md={12} className="editProfileButtonGrid">
              {!editionProgress ? (
                <button onClick={editPod} className="flexDisplayCenter">
                  Save Changes
                </button>
              ) : null}
            </Grid>
          </Grid>
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
      </div>
    );
  else return null;
};

export default PodModalEdit;
