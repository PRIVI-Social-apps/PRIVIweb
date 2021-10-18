import React, { useContext } from "react";
import { useSelector } from "react-redux";
import styles from "./index.module.scss";
import MainPageContext from "components/legacy/Media/context";
import { EthCreator, PriviCreator } from "../elements";
import { RootState } from "store/reducers/Reducer";
import URL from "shared/functions/getURL";
import { Divider } from "shared/ui-kit";
import Box from 'shared/ui-kit/Box';
import { BookmarkLikeShare } from "shared/ui-kit/BookmarkLikeShare";
import { BlogSnapDisplayContent } from "../BlogSnapDisplay";

enum MediaType {
  Video = "VIDEO_TYPE",
  LiveVideo = "LIVE_VIDEO_TYPE",
  Audio = "AUDIO_TYPE",
  LiveAudio = "LIVE_AUDIO_TYPE",
  Blog = "BLOG_TYPE",
  BlogSnap = "BLOG_SNAP_TYPE",
  DigitalArt = "DIGITAL_ART_TYPE",
}

const BlogFullScreenDisplay = () => {
  const usersList = useSelector((state: RootState) => state.usersInfoList);

  const { selectedMedia, setSelectedMedia, mediaFullScreen, setMediaFullScreen } = useContext(
    MainPageContext
  );

  const { EditorPages } = selectedMedia;

  const creator =
    usersList.find(usr => selectedMedia.CreatorId === usr.id) ||
    usersList.find(usr => selectedMedia.Requester === usr.id);

  return (
    <div className={styles.blogFullScreendDisplay}>
      <span onClick={() => setMediaFullScreen(null)}>{`< Back to Media`}</span>
      <h1>{selectedMedia.Title ?? selectedMedia.MediaName}</h1>
      {selectedMedia.subTitle && <h3>{selectedMedia.subTitle}</h3>}
      <Divider />
      <Box display={"flex"} justifyContent="space-between" alignItems="center" width="100%">
        {selectedMedia.eth ? (
          <EthCreator creator={selectedMedia.creator} randomAvatar={selectedMedia.randomAvatar} />
        ) : (
          <PriviCreator creator={selectedMedia.Artist ?? creator} theme="default" />
        )}

        <BookmarkLikeShare setSelectedMedia={setSelectedMedia} selectedMedia={selectedMedia} style="white" />
      </Box>
      {mediaFullScreen === MediaType.BlogSnap && <Divider />}
      {mediaFullScreen === MediaType.BlogSnap ? (
        <BlogSnapDisplayContent viewFullScreen={false} />
      ) : mediaFullScreen === MediaType.Blog ? (
        <Box display="flex" flexDirection="column">
          {selectedMedia.HasPhoto && (
            <img
              src={
                selectedMedia.ImageUrl ??
                `${URL()}/media/getMediaMainPhoto/${selectedMedia.MediaSymbol.replace(/\s/g, "")}`
              }
              alt={"blog thumbnail"}
            />
          )}
          {EditorPages && (
            <div dangerouslySetInnerHTML={{ __html: EditorPages }} className={styles.blogContent} />
          )}
        </Box>
      ) : null}
    </div>
  );
};

export default BlogFullScreenDisplay;
