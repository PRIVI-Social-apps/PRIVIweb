import React, { useState } from "react";
import "./Profile-Stories.css";
import { Modal } from "@material-ui/core";
import Story from "../../../Communities/CommunityPage/modals/Story/Story";

const ProfileStories = (props) => {
  const [openModalStory, setOpenModalStory] = useState<boolean>(false);
  const handleOpenModalStory = () => {
    setOpenModalStory(true);
  };
  const handleCloseModalStory = () => {
    setOpenModalStory(false);
  };

  return (
    <div className="profileStories">
      <img
        src={props.story.ImageURL}
        alt={props.story.Title}
        onClick={handleOpenModalStory}
      />
      <Modal
        className="modalCreateModal"
        open={openModalStory}
        onClose={handleCloseModalStory}
      >
        <Story
          onCloseModal={handleCloseModalStory}
          stories={props.stories}
          actualStoryIndex={props.currentStoryIndex}
        />
      </Modal>
    </div>
  );
};

export default ProfileStories;
