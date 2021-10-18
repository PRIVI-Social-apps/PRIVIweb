import React, { useEffect, useState } from "react";
import "./Story.css";
import "../Communities-modals.css";
import Moment from "react-moment";

const Story = (props: any) => {
  const [actualStoryIndex, setActualStoryIndex] = useState(0);
  const [actualStory, setActualStory] = useState<any>({});
  const [stories, setStories] = useState<any>([]);

  useEffect(() => {
    //console.log('inside', props);

    const s = [] as any;
    props.stories.forEach((story, index) => {
      if (index >= props.actualStoryIndex) {
        s.push(story);
      }
    });

    setActualStory(s[0]); //first story

    setStories(s);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onAnimationIteration = (actualIndex) => {
    if (props.stories.length === actualIndex + 1) {
      props.onCloseModal();
    } else {
      setActualStory(props.stories[actualStoryIndex + 1]);
      setActualStoryIndex((actualStory) => actualStory + 1);
    }
  };

  const ProgressBar = (propsFunction: any) => {
    const firstCondition =
      propsFunction.index + 1 === propsFunction.numStories
        ? "progressBar"
        : "progressBar marginRightProgressBar";
    const secondCondition =
      propsFunction.charged > propsFunction.index ? "completedBar" : "";

    return (
      <div
        className={`${firstCondition} ${secondCondition}`}
        style={{ width: "calc(100% / " + propsFunction.numStories + ")" }}
      >
        {propsFunction.charged === propsFunction.index ? (
          <div
            className="in"
            onAnimationIteration={() =>
              onAnimationIteration(propsFunction.index)
            }
          ></div>
        ) : null}
      </div>
    );
  };

  if (actualStory)
    return (
      <div className="modalStory">
        <div
          className="storyPart"
          style={{
            backgroundImage:
              props.imageUrl && props.imageUrl.length > 0
                ? `url(${props.imageUrl})`
                : actualStory.imageURL && actualStory.imageURL.length > 0
                ? `url(${actualStory.imageURL})`
                : "none",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
          }}
          onClick={() => onAnimationIteration(actualStoryIndex)}
        >
          <div className="nameStory">
            {actualStory.name ? actualStory.name : ""}
          </div>
          <div className="rowUserDateStory">
            <div className="leftColStory">
              <div
                className="userPhotoStory"
                style={{
                  backgroundImage:
                    actualStory.userImageURL &&
                    actualStory.userImageURL.length > 0
                      ? `url(${actualStory.userImageURL})`
                      : "none",
                  backgroundRepeat: "no-repeat",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              />
              <div className="userLabelStory">
                {actualStory.userName ? actualStory.userName : ""}
              </div>
            </div>
            <div className="rightColStory">
              <Moment fromNow>
                {actualStory.date || actualStory.schedulePost || new Date()}
              </Moment>
            </div>
          </div>
        </div>
        <div className="flexProgressBar">
          {stories.map((item, i) => {
            return (
              <ProgressBar
                key={i}
                index={i}
                charged={actualStoryIndex}
                numStories={stories.length}
              />
            );
          })}
        </div>
      </div>
    );
  else return null;
};

export default Story;
