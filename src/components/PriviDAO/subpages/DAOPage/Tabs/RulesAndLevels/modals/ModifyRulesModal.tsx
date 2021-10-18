import React, { useEffect, useRef, useState } from "react";
import { useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";
import axios from "axios";

import { Grid } from "@material-ui/core";

import { modifyRulesModalStyles } from "./ModifyRulesModal.styles";
import URL from "shared/functions/getURL";
import { setUpdateBasicInfo } from "store/actions/UpdateBasicInfo";
import AlertMessage from "shared/ui-kit/Alert/AlertMessage";
import { Color, Modal, StyledDivider } from "shared/ui-kit";
import InputWithLabelAndTooltip from "shared/ui-kit/InputWithLabelAndTooltip";
import { DAOButton, DAOButtonPlain } from "components/PriviDAO/components/DAOButton";
import Box from 'shared/ui-kit/Box';
import { TitleGrandLight } from "../../../index.styles";

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
      Rule: newRuleValue,
      Value: "",
    });
    communityCopy.AdditionalRules = array;
    setCommunity(communityCopy);

    setNewRuleValue("");
  };

  function renderInputEditModal(props) {
    return (
      <>
        <Grid item xs={12} sm={8}>
          <InputWithLabelAndTooltip
            labelName={`Rule ${props.index + 1}`}
            tooltip={""}
            inputValue={props.item}
            type={"text"}
            onInputValueChange={e => {}}
            disabled
            theme="dark"
          />
        </Grid>
        <Grid item xs={12} sm={4}>
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
            theme="dark"
          />
        </Grid>
      </>
    );
  }

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
          <Grid container spacing={3} style={{ alignItems: "flex-end" }}>
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

            {community.AdditionalRules &&
              community.AdditionalRules.length > 0 &&
              community.AdditionalRules.map((rule, index) => {
                return (
                  <>
                    <Grid item xs={12} sm={8}>
                      <InputWithLabelAndTooltip
                        theme="dark"
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
                    <Grid item xs={12} sm={4}>
                      <InputWithLabelAndTooltip
                        theme="dark"
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
              })}

            <Grid item xs={12} sm={8}>
              <InputWithLabelAndTooltip
                theme="dark"
                labelName={`Rule ${
                  community.AdditionalRules ? community.AdditionalRules.length + 1 : 0 + 1 + 3
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
