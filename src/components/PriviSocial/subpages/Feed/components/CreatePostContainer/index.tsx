import React from 'react';
import Box from 'shared/ui-kit/Box';
import { feedStyles } from "../../index.styles";

const CreatePostContainer = ({ handleOpenCreatePostModal }) => {
  const classes = feedStyles();

  return (
    <div className={classes.createPostContainer} onClick={handleOpenCreatePostModal}>
      <div>Write your post...</div>
      <Box display="flex" alignItems="center">
        <img src={require("assets/icons/camera_gray.png")} alt="camera" />
        <img src={require("assets/icons/video_gray.png")} alt="video" />
        <div className={classes.send}>
          <img src={require("assets/icons/send_white_2.png")} alt="send" />
        </div>
      </Box>
    </div>
  );
};

export default CreatePostContainer;