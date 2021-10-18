import React, { useEffect, useRef, useState } from "react";
import { useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";
import axios from "axios";

import { Grid } from "@material-ui/core";

import { modifyRulesModalStyles } from "./ModifyRulesModal.styles";
import { TitleGrandLight } from "../../../index.styles";
import URL from "shared/functions/getURL";
import { setUpdateBasicInfo } from "store/actions/UpdateBasicInfo";
import AlertMessage from "shared/ui-kit/Alert/AlertMessage";
import { Color, Modal, StyledDivider } from "shared/ui-kit";
import InputWithLabelAndTooltip from "shared/ui-kit/InputWithLabelAndTooltip";
import Box from 'shared/ui-kit/Box';
import { DAOButton, DAOButtonPlain } from "components/PriviDAO/components/DAOButton";

export default function ModifyRulesModal(props) {
  const dispatch = useDispatch();
  const history = useHistory();
  const classes = modifyRulesModalStyles();

  const [community, setCommunity] = useState<any>({});
  const inputRef: any = useRef([]);
  const [status, setStatus] = React.useState<any>("");
  const [newRuleValue, setNewRuleValue] = useState<string>("");

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
            msg: "Levels edited successfully!",
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
          msg: "Error when making the request",
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
      Rule: newRuleValue,
      Value: "",
    });
    communityCopy.AdditionalRules = array;
    setCommunity(communityCopy);

    setNewRuleValue("");
  };

  if (props.community)
    return (
      <Modal
        size="medium"
        isOpen={props.open}
        onClose={props.onClose}
        showCloseIcon
        className={classes.root}
        theme="dark"
      >
        <TitleGrandLight disableUppercase mb={3}>
          Joining Rules
        </TitleGrandLight>

        <StyledDivider color={Color.White} type="solid" />

        <Box mt={3}>
          <Grid
            container
            spacing={3}
            style={{
              alignItems: "flex-end",
            }}
          >
            {community.RequiredTokens &&
              community.RequiredTokens.length > 0 &&
              community.RequiredTokens.map((token, index) => {
                return (
                  <>
                    <Grid item xs={12} sm={8}>
                      <InputWithLabelAndTooltip
                        labelName={`Rule ${index}`}
                        tooltip={""}
                        inputValue={token.token}
                        type={"text"}
                        onInputValueChange={e => {}}
                        theme="dark"
                      />
                    </Grid>

                    <Grid item xs={12} sm={4}>
                      <InputWithLabelAndTooltip
                        labelName={`Value`}
                        tooltip={""}
                        inputValue={community[`RequiredToken`]}
                        minValue="0"
                        type={"number"}
                        onInputValueChange={e => {
                          let communityCopy = { ...community };
                          let value = e.target.value;
                          // if (props.item === 'RequiredToken') {
                          //     value = community.RequiredTokens.concat([{token: , tokenValue: value}])
                          // }
                          communityCopy[`RequiredToken`] = parseInt(value);
                          setCommunity(communityCopy);
                        }}
                        placeHolder={token.tokenValue}
                        theme="dark"
                      />
                    </Grid>
                  </>
                );
              })}

            {community.AdditionalRules &&
              community.AdditionalRules.length > 0 &&
              community.AdditionalRules.map((rule, index) => {
                return (
                  <>
                    <Grid item xs={12} sm={8}>
                      <InputWithLabelAndTooltip
                        labelName={`Rule ${index + 1}`}
                        tooltip={""}
                        inputValue={rule.Rule}
                        type={"text"}
                        onInputValueChange={e => {
                          let communityCopy = { ...community };
                          communityCopy.AdditionalRules[index].Rule = e.target.value;
                          setCommunity(communityCopy);
                        }}
                        placeHolder={`Rule ${index + 1} name`}
                        theme="dark"
                      />
                    </Grid>

                    <Grid item xs={12} sm={4}>
                      {" "}
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
                        placeHolder={"Rule value"}
                        theme="dark"
                      />
                    </Grid>
                  </>
                );
              })}

            <Grid item xs={12} sm={8}>
              <InputWithLabelAndTooltip
                theme="dark"
                labelName={`Rule ${
                  community.AdditionalRules
                    ? community.AdditionalRules.length + 1
                    : 0 + community.RequiredTokens
                    ? community.RequiredTokens.length
                    : 0 + 1
                }`}
                tooltip={""}
                inputValue={newRuleValue}
                type={"text"}
                onInputValueChange={e => {
                  setNewRuleValue(e.target.value);
                }}
                placeHolder={`Write possible answer....`}
              />
            </Grid>

            <Grid item xs={12} sm={4}>
              <Box className={classes.maxWidth}>
                <DAOButtonPlain onClick={addRule}>Add rule</DAOButtonPlain>
              </Box>
            </Grid>
          </Grid>
        </Box>
        {!editionProgress && (
          <Box display="flex" justifyContent="flex-end" mt={3}>
            <DAOButton onClick={editRules}>Save Changes</DAOButton>
          </Box>
        )}
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
      </Modal>
    );
  else return null;
}
