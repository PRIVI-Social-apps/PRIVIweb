import React from "react";

import { previewCreatedPostStyles } from "./PreviewCreatedPost.styles";
import Box from "shared/ui-kit/Box";

const PreviewPost = ({ photoImg, post, hashtags, content }) => {
  const classes = previewCreatedPostStyles();

  return (
    <div className={classes.postPreviewContainer}>
      <div className={classes.previewTitle}>Preview Post</div>
      <h2>{post.name ?? ""}</h2>
      <h3>{post.textShort ?? ""}</h3>
      {photoImg && (
        <div
          className={classes.previewImage}
          style={{
            backgroundImage: `url(${photoImg})`,
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
          }}
        />
      )}
      <div className={classes.content} dangerouslySetInnerHTML={{ __html: content ?? "" }}></div>
      <Box display="flex" marginBottom={"30px"}>
        {hashtags &&
          hashtags.length > 0 &&
          hashtags.map(hashtag => <div className={classes.hashtag}>{hashtag}</div>)}
      </Box>
    </div>
  );
};

export default PreviewPost;
