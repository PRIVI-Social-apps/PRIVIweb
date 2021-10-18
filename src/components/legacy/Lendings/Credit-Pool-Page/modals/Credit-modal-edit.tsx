import React, { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import axios from "axios";
import { useHistory } from "react-router-dom";

import Grid from "@material-ui/core/Grid";
import { makeStyles } from "@material-ui/core/styles";
import { Tooltip, Fade } from "@material-ui/core";

import { setUpdateBasicInfo } from "store/actions/UpdateBasicInfo";

import URL from "shared/functions/getURL";
import AlertMessage from "shared/ui-kit/Alert/AlertMessage";

import "./Credit-modal-edit.css";
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

const CreditModalEdit = props => {
  const dispatch = useDispatch();
  const history = useHistory();
  const classes = useStyles();

  const [credit, setCredit] = useState<any>({});

  const inputRef: any = useRef([]);

  const [status, setStatus] = useState<any>();

  const [editionProgress, setEditionProgress] = useState(false);

  useEffect(() => {
    if (props.credit) {
      const creditCopy = { ...props.credit };
      setCredit(creditCopy);

      inputRef.current = new Array(4);
    }

    //eslint-disable react-hooks/exhaustive-deps
  }, [props.credit]);

  const checkSlug = async () => {
    const acceptedChars = "^[a-zA-Z0-9\\._' ]{1,100}$";
    credit.urlSlug.match(acceptedChars);

    //check special characters
    if (!credit.urlSlug.match(acceptedChars)) {
      setStatus({
        msg: "Please type only letters, numbers, or special characters . and _",
        key: Math.random(),
        variant: "error",
      });
      return false;
    } else {
      if (credit.urlSlug.includes(".", credit.urlSlug.length - 1)) {
        setStatus({
          msg: "URL can't end with a .",
          key: Math.random(),
          variant: "error",
        });
        return false;
      } else if (credit.urlSlug.includes(".", 0)) {
        setStatus({
          msg: "URL can't start with a .",
          key: Math.random(),
          variant: "error",
        });
        return false;
      } else {
        await axios
          .get(`${URL()}/priviCredit/checkSlugExists/${credit.urlSlug}/${credit.CreditAddress}/credit`)
          .then(response => {
            console.log(response.data);
            if (response.data.success) {
              if (response.data.data.urlSlugExists) {
                setStatus({
                  msg: "credit with this url already exists, please choose another one",
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

  const editCredit = () => {
    if (checkSlug()) {
      setEditionProgress(true);
      axios
        .post(`${URL()}/priviCredit/editPriviCredit/`, credit)
        .then(response => {
          if (response.data.success) {
            setStatus({
              msg: "Credit Pool edited!",
              key: Math.random(),
              variant: "success",
            });
            setEditionProgress(false);
            setTimeout(() => {
              dispatch(setUpdateBasicInfo(true));
              history.push("/lendings/credit-pools/" + credit.urlSlug);
              props.onCloseModal();
            }, 1000);
          } else {
            setStatus({
              msg: "error when editing the credit pool",
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
          type={props.type}
          inputValue={credit[props.item]}
          onInputValueChange={e => {
            let creditCopy = { ...credit };
            creditCopy[props.item] = e.target.value;
            setCredit(creditCopy);
          }}
          placeHolder={props.placeholder}
        />
      </div>
    );
  }

  if (props.credit)
    return (
      <div className="modalCreditEditFullDiv">
        <div className="modalCreatePadding">
          <div className="exit" onClick={props.onCloseModal}>
            <img src={require("assets/icons/x_darkblue.png")} alt={"x"} />
          </div>
          <div className="modalHeaderEdit">Edit Credit Pool</div>
          <Grid container spacing={3} direction="row" alignItems="flex-start" justify="flex-start">
            <Grid item xs={12} md={6}>
              {renderInputEditModal({
                name: "Credit Pool Name",
                placeholder: "Fill in this field",
                type: "text",
                width: 100,
                item: "CreditName",
                index: 0,
                info: false,
              })}
            </Grid>
            <Grid item xs={12} md={6}>
              {renderInputEditModal({
                name: "Credit Pool URL",
                placeholder: "Enter a custom URL",
                type: "text",
                width: 100,
                item: "urlSlug",
                index: 2,
                info: "Customize your Credit Pool's URL with a custom Slug, to display in the navigation bar",
              })}
            </Grid>
            <Grid item xs={12} md={12}>
              <div className="flexRowInputs">
                <div className="infoHeaderEdit">Credit Pool Description</div>
                <Tooltip
                  TransitionComponent={Fade}
                  TransitionProps={{ timeout: 600 }}
                  arrow
                  className="tooltipProfileInfo"
                  title={"Write a text to describe your Credit Pool."}
                >
                  <img className="infoIconEdit" src={infoIcon} alt={"info"} />
                </Tooltip>
              </div>
              <textarea
                className="textAreaEdit"
                value={credit.Description}
                maxLength={150}
                onChange={elem => {
                  let creditCopy = { ...credit };
                  creditCopy.Description = elem.target.value;
                  setCredit(creditCopy);
                }}
                placeholder="Describe your Credit Pool"
              />
            </Grid>
            <Grid item xs={12} md={12} className="editProfileButtonGrid">
              {!editionProgress ? (
                <button onClick={editCredit} className="flexDisplayCenter">
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

export default CreditModalEdit;
