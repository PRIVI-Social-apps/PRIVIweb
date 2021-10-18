import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";

import { Grid, useMediaQuery } from "@material-ui/core";

import { modifyLevelsModalStyles } from './ModifyLevelsModal.styles'
import { setUpdateBasicInfo } from "store/actions/UpdateBasicInfo";
import URL from "shared/functions/getURL";
import AlertMessage from "shared/ui-kit/Alert/AlertMessage";
import { Modal, PrimaryButton } from "shared/ui-kit";
import InputWithLabelAndTooltip from "shared/ui-kit/InputWithLabelAndTooltip";

export default function ModifyLevelsModal(props) {
  const dispatch = useDispatch();
  const history = useHistory();
  const classes = modifyLevelsModalStyles();

  const [community, setCommunity] = useState<any>({});
  const inputRef: any = useRef([]);
  const [status, setStatus] = React.useState<any>("");

  const [editionProgress, setEditionProgress] = useState(false);
  const mobileMatches = useMediaQuery("(max-width:375px)");

  useEffect(() => {
    if (props.community && props.community.CommunityAddress) {
      const communityCopy = { ...props.community };
      setCommunity(communityCopy);

      inputRef.current = new Array(10);
    }

    //eslint-disable react-hooks/exhaustive-deps
  }, [props.community]);

  const editLevels = () => {
    setEditionProgress(true);
    setStatus(undefined);

    axios
      .post(`${URL()}/community/editLevels`, community)
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
        console.log(error);
        setStatus({
          msg: "Error when editing the community",
          key: Math.random(),
          variant: "error",
        });
        setEditionProgress(false);
      });
  };

  const addLevel = () => {
    let communityCopy = { ...community };
    let array: any = [];

    if (communityCopy.Levels && communityCopy.Levels.length > 0) {
      array = [...communityCopy.Levels];
    }

    array.push({
      Name: "",
      Description: "",
    });
    communityCopy.Levels = array;
    setCommunity(communityCopy);
  };

  if (props.community)
    return (
      <Modal size="medium" isOpen={props.open} onClose={props.onClose} showCloseIcon className={classes.root}>
        <div className={classes.modalContent}>
          <div>
            {/* LEVELS */}
            {!mobileMatches && (
              <div className={classes.flexRowBetween}>
                <div className={classes.levelTitle}>Community Levels</div>
                <div className={classes.createRule}>
                  <PrimaryButton size="medium" onClick={() => addLevel()}>
                    + Add Level
                  </PrimaryButton>
                </div>
              </div>
            )}
            {mobileMatches && (
              <>
                <div className={classes.mobileCommunityLevel}>Community Levels</div>
                <PrimaryButton size="medium" onClick={() => addLevel()}>
                  + Add Level
                </PrimaryButton>
              </>
            )}
            <div>
              <Grid
                container
                spacing={mobileMatches ? 0 : 2}
              >
                {community.Levels && community.Levels.length > 0
                  ? community.Levels.map((level, index) => {
                    return (
                      <>
                        <Grid item xs={12} sm={6}>
                          <InputWithLabelAndTooltip
                            labelName={`Level ${index + 1}`}
                            tooltip={""}
                            inputValue={level.Name}
                            type={"text"}
                            onInputValueChange={e => {
                              let communityCopy = { ...community };
                              communityCopy.Levels[index].Name = e.target.value;
                              setCommunity(communityCopy);
                            }}
                            placeHolder={`Level ${index + 1} name`}
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <InputWithLabelAndTooltip
                            labelName={`Description`}
                            tooltip={""}
                            inputValue={level.Description}
                            type={"text"}
                            onInputValueChange={e => {
                              let communityCopy = { ...community };
                              communityCopy.Levels.splice(index, 1);
                              setCommunity(communityCopy);
                            }}
                            placeHolder={`Level description`}
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
                <PrimaryButton size="medium" onClick={editLevels}>
                  Save Changes
                </PrimaryButton>
              </div>
            ) : null}
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
      </Modal>
    );
  else return null;
}
