import React, { useState } from "react";
import { Grid, TextField } from "@material-ui/core";

import { createNewTopicModalStyles } from "./CreateNewTopicModal.styles";
import { Modal } from "shared/ui-kit";
import Box from 'shared/ui-kit/Box';

const CreateNewTopicModal = (props: any) => {
  const classes = createNewTopicModalStyles();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  return (
    <Modal size="medium" isOpen={props.open} onClose={props.onClose} showCloseIcon className={classes.root}>
      <div className={classes.content}>
        <div className={classes.titleVotingModal}>Create New Topic</div>
        <div className={classes.bodyCreateNewTopic}>
          <Grid container direction="column" spacing={2}>
            <Grid item>
              <Box display="flex" flexDirection="column" height="100%">
                <div className={classes.flexRowInputsCommunitiesModal}>
                  <div className={classes.infoHeaderCommunitiesModal}>Title</div>
                </div>
                <TextField
                  variant="outlined"
                  size="small"
                  placeholder={"Write your post title ..."}
                  value={title}
                  type="text"
                  name="title"
                  onChange={e => setTitle(e.target.value)}
                />
              </Box>
            </Grid>
            <Grid item style={{ marginTop: "8px" }}>
              <Box display="flex" flexDirection="column" height="100%">
                <div className={classes.flexRowInputsCommunitiesModal}>
                  <div className={classes.infoHeaderCommunitiesModal}>Description</div>
                </div>
                <TextField
                  variant="outlined"
                  size="small"
                  placeholder={"Write a description..."}
                  value={description}
                  type={"text"}
                  multiline
                  rows={5}
                  name="description"
                  onChange={e => setDescription(e.target.value)}
                />
              </Box>
            </Grid>
          </Grid>
        </div>
        <div className={classes.createButtonNewTopicDiv}>
          <button
            onClick={() => {
              props.createNewTopic(title, description);
              props.onClose();
            }}
            className={classes.createButtonNewTopic}
          >
            Publish
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default CreateNewTopicModal;
