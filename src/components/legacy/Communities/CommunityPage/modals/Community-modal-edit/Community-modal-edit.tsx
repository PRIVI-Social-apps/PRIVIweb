import React, { useEffect, useRef, useState } from "react";
import axios from "axios";

import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import Grid from "@material-ui/core/Grid";
import { makeStyles } from "@material-ui/core/styles";
import { setUpdateBasicInfo } from "store/actions/UpdateBasicInfo";
import URL from "shared/functions/getURL";
import AlertMessage from "shared/ui-kit/Alert/AlertMessage";

import "./Community-modal-edit.css";
import InputWithLabelAndTooltip from "shared/ui-kit/InputWithLabelAndTooltip";

const useStyles = makeStyles(theme => ({
  root: {
    width: "100%",
    "& > * + *": {
      marginTop: theme.spacing(2),
    },
  },
}));

const CommunityModalEdit = props => {
  const dispatch = useDispatch();
  const history = useHistory();
  const classes = useStyles();

  const [community, setCommunity] = useState<any>({});

  const inputRef: any = useRef([]);

  const [status, setStatus] = useState<any>("");

  const [editionProgress, setEditionProgress] = useState(false);

  useEffect(() => {
    if (props.community) {
      const communityCopy = { ...props.community };
      setCommunity(communityCopy);

      inputRef.current = new Array(4);
    }

    //eslint-disable react-hooks/exhaustive-deps
  }, [props.community]);

  const checkSlug = async () => {
    const acceptedChars = "^[a-zA-Z0-9\\._' ]{1,100}$";
    community.urlSlug.match(acceptedChars);

    //check special characters
    if (!community.urlSlug.match(acceptedChars)) {
      setStatus({
        msg: "Please type only letters, numbers, or special characters . and _",
        key: Math.random(),
        variant: "error",
      });
      return false;
    } else {
      if (community.urlSlug.includes(".", community.urlSlug.length - 1)) {
        setStatus({
          msg: "URL can't end with a .",
          key: Math.random(),
          variant: "error",
        });
        return false;
      } else if (community.urlSlug.includes(".", 0)) {
        setStatus({
          msg: "URL can't start with a .",
          key: Math.random(),
          variant: "error",
        });
        return false;
      } else {
        await axios
          .get(
            `${URL()}/community/checkSlugExists/${community.urlSlug}/${community.CommunityAddress}/community`
          )
          .then(response => {
            if (response.data.success) {
              if (response.data.data.urlSlugExists) {
                setStatus({
                  msg: "community with this url already exists, please choose another one",
                  key: Math.random(),
                  variant: "error",
                });
                return false;
              } else {
                setStatus(undefined);
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

  const editCommunity = () => {
    if (checkSlug()) {
      setEditionProgress(true);

      axios
        .post(`${URL()}/community/editCommunity`, community)
        .then(response => {
          if (response.data.success) {
            setStatus({
              msg: "Community Edited!",
              key: Math.random(),
              variant: "success",
            });
            setEditionProgress(false);
            setTimeout(() => {
              dispatch(setUpdateBasicInfo(true));
              history.push("/communities/" + community.urlSlug);
              props.onCloseModal();
            }, 1000);
          } else {
            setStatus({
              msg: "error when editing the community",
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
          labelName={`props.name`}
          tooltip={props.info}
          inputValue={community[props.item]}
          type={props.type}
          onInputValueChange={e => {
            let communityCopy = { ...community };
            communityCopy[props.item] = e.target.value;
            setCommunity(communityCopy);
          }}
          placeHolder={props.placeholder}
        // ref={el => (inputRef.current[props.index] = el)}
        />
      </div>
    );
  }

  if (props.community)
    return (
      <div className="modalCommunityEditFullDiv">
        <div className="modalCreatePadding">
          <div className="exit" onClick={props.onCloseModal}>
            <img src={require("assets/icons/x_darkblue.png")} alt={"x"} />
          </div>
          <div className="modalHeaderEdit">Edit Community</div>
          <Grid container spacing={3} direction="row" alignItems="flex-start" justify="flex-start">
            <Grid item xs={12} md={6}>
              {renderInputEditModal({
                name: "Community Name",
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
                name: "Community URL",
                placeholder: "Enter a custom URL",
                type: "text",
                width: 100,
                item: "urlSlug",
                index: 2,
                info: "Customize your community's URL with a custom Slug, to display in the navigation bar",
              })}
            </Grid>
            <Grid item xs={12} md={12}>
              {renderInputEditModal({
                name: "Community Twitter page",
                placeholder: "Fill in this field",
                type: "text",
                width: 100,
                item: "TwitterId",
                index: 3,
                info: false,
              })}
            </Grid>
            <Grid item xs={12} md={12}>
              <InputWithLabelAndTooltip
                labelName={`Community Description`}
                tooltip={"Write a text to describe your community."}
                inputValue={community.Description}
                onInputValueChange={e => {
                  let communityCopy = { ...community };
                  communityCopy.Description = e.target.value;
                  setCommunity(communityCopy);
                }}
                placeHolder={"Describe your community"}
                style={{ maxLength: 150 }}
              />
            </Grid>
            <Grid item xs={12} md={12} className="editProfileButtonGrid">
              {!editionProgress ? (
                <button onClick={editCommunity} className="flexDisplayCenter">
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

export default CommunityModalEdit;
