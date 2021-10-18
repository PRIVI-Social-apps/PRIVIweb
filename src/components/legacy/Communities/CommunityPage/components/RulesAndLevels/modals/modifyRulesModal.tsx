import React, { useEffect, useRef, useState } from "react";
import { useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";
import axios from "axios";

import { Grid } from "@material-ui/core";

import { modifyRulesModalStyles } from './ModifyRulesModal.styles';
import URL from "shared/functions/getURL";
import { setUpdateBasicInfo } from "store/actions/UpdateBasicInfo";
import AlertMessage from "shared/ui-kit/Alert/AlertMessage";
import { Modal, PrimaryButton } from "shared/ui-kit";
import InputWithLabelAndTooltip from "shared/ui-kit/InputWithLabelAndTooltip";

const infoIcon = require("assets/icons/info_icon.png");

export default function ModifyRulesModal(props) {
  const dispatch = useDispatch();
  const history = useHistory();
  const classes = modifyRulesModalStyles();

  const [community, setCommunity] = useState<any>({});
  const inputRef: any = useRef([]);
  const [status, setStatus] = React.useState<any>("");

  const [editionProgress, setEditionProgress] = useState(false);

  useEffect(() => {
    if (props.community && props.community.CommunityAddress) {
      const communityCopy = { ...props.community };
      setCommunity(communityCopy);

      inputRef.current = new Array(10);
    }

    //eslint-disable react-hooks/exhaustive-deps
  }, [props.community]);

  const editRules = () => {
    setEditionProgress(true);
    setStatus(undefined);

    axios
      .post(`${URL()}/community/editRules`, community)
      .then(response => {
        if (response.data.success) {
          setStatus({
            msg: "Rules edited successfully!",
            key: Math.random(),
            variant: "success",
          });
          setEditionProgress(false);
          setTimeout(() => {
            dispatch(setUpdateBasicInfo(true));
            history.push("/communities/" + community.urlSlug);
            props.onClose();
            props.handleRefresh();
          }, 1000);
        } else {
          setStatus({
            msg: "Error when editing the community",
            key: Math.random(),
            variant: "error",
          });
          setEditionProgress(false);
        }
      })
      .catch(error => {
        setStatus({
          msg: "Error when editing the community",
          key: Math.random(),
          variant: "error",
        });
        setEditionProgress(false);
      });
  };

  const addRule = () => {
    let communityCopy = { ...community };
    let array: any = [];

    if (communityCopy.AdditionalRules && communityCopy.AdditionalRules.length > 0) {
      array = [...communityCopy.AdditionalRules];
    }

    array.push({
      Rule: "",
      Value: "",
    });
    communityCopy.AdditionalRules = array;
    setCommunity(communityCopy);
  };

  function renderInputEditModal(props) {
    return (
      <Grid
        container
        spacing={2}
        className="square-container"
        style={{
          width: "100%",
          height: "unset",
          justifyContent: "space-between",
          background: "none",
          paddingLeft: 0,
          paddingRight: 0,
        }}
      >
        <Grid item xs={12} sm={6}>
          <InputWithLabelAndTooltip
            labelName={`Rule ${props.index + 1}`}
            tooltip={""}
            inputValue={props.item}
            type={"text"}
            onInputValueChange={e => { }}
            disabled
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <InputWithLabelAndTooltip
            labelName={`Value`}
            tooltip={""}
            inputValue={community[props.item]}
            onInputValueChange={e => {
              let communityCopy = { ...community };
              communityCopy[props.item] = parseInt(e.target.value);
              setCommunity(communityCopy);
            }}
            placeHolder={props.placeholder}
            type={"number"}
            minValue={"0"}
          />
        </Grid>
      </Grid>
    );
  }

  if (props.community)
    return (
      <Modal size="medium" isOpen={props.open} onClose={props.onClose} showCloseIcon className={classes.root}>
        <div className={classes.modalContent}>
          {/* RULES */}
          <div className={classes.flexRowBetween}>
            <div className={classes.levelTitle}>Community Rules</div>
            <div className={classes.createButton}>
              <PrimaryButton size="medium" onClick={() => addRule()}>
                + Add Rule
              </PrimaryButton>
            </div>
          </div>
          <div>
            {renderInputEditModal({
              name: "",
              placeholder: 0,
              type: "number",
              width: 100,
              item: "MinimumEndorsementScore",
              index: 0,
              info: false,
            })}

            {renderInputEditModal({
              name: "",
              placeholder: 0,
              type: "number",
              width: 100,
              item: "MinimumTrustScore",
              index: 1,
              info: false,
            })}
            {renderInputEditModal({
              name: "",
              placeholder: 0,
              type: "number",
              width: 100,
              item: "MinimumUserLevel",
              index: 2,
              info: false,
            })}

            <Grid
              container
              spacing={2}
              style={{
                width: "100%",
                height: "unset",
                justifyContent: "space-between",
                background: "none",
                paddingLeft: 0,
                paddingRight: 0,
              }}
            >
              {community.AdditionalRules && community.AdditionalRules.length > 0
                ? community.AdditionalRules.map((rule, index) => {
                  return (
                    <>
                      <Grid item xs={12} sm={6}>
                        <InputWithLabelAndTooltip
                          labelName={`Rule ${index + 4}`}
                          tooltip={""}
                          inputValue={rule.Rule}
                          type={"text"}
                          onInputValueChange={e => {
                            let communityCopy = { ...community };
                            communityCopy.AdditionalRules[index].Rule = e.target.value;
                            setCommunity(communityCopy);
                          }}
                          placeHolder={`Rule ${index + 1} name`}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <InputWithLabelAndTooltip
                          labelName={`Value`}
                          tooltip={""}
                          inputValue={rule.Value}
                          type={"text"}
                          onInputValueChange={e => {
                            let communityCopy = { ...community };
                            communityCopy.AdditionalRules[index].Value = e.target.value;
                            setCommunity(communityCopy);
                          }}
                          placeHolder={`Rule value`}
                        />
                      </Grid>
                    </>
                  );
                })
                : null}
            </Grid>
          </div>
          {!editionProgress ? (
            <div className={classes.bottomButton}>
              <PrimaryButton size="medium" onClick={editRules}>
                Save Changes
              </PrimaryButton>
            </div>
          ) : null}
          <div className={classes.alertMessage}>
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
  else return null;
}
