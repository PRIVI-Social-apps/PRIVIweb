import React, { useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import cls from "classnames";

import { IconButton, InputAdornment, SvgIcon } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";

import { RootState } from "store/reducers/Reducer";
import CustomSwitch from "shared/ui-kit/CustomSwitch";

import Post from "shared/ui-kit/Page-components/Post";
import AuthorSchedulePost from "shared/ui-kit/Page-components/AuthorSchedulePost";
import URL from "shared/functions/getURL";
import AlertMessage from "shared/ui-kit/Alert/AlertMessage";
import { LoadingWrapper } from "shared/ui-kit/Hocs";

import { createBlogPostModalStyles } from "./CreateBlogPostModal.styles";
import { Modal } from "shared/ui-kit";
import InputWithLabelAndTooltip from "shared/ui-kit/InputWithLabelAndTooltip";
import ImageTitleDescription from "shared/ui-kit/Page-components/ImageTitleDescription";
import { ReactComponent as PlusSolid } from "assets/icons/plus-solid.svg";
import { createThreadModalStyles } from "../../../Discussion/modals/CreateThread.styles";

import { DAOButton } from "components/PriviDAO/components/DAOButton";
import { BlogPostModalContent } from "../Blog-Post/BlogPostModal";
import Box from "shared/ui-kit/Box";

const infoIcon = require("assets/icons/info_white.png");
const uploadIcon = require("assets/icons/upload_white.png");

const CreateBlogPostModal = ({
  open,
  onClose,
  handleRefresh,
  type,
  communityId,
}: {
  open: boolean;
  onClose: () => void | any;
  handleRefresh: () => void | any;
  type: "Post" | "CommunityPost";
  communityId: string;
}) => {
  const classes = createBlogPostModalStyles();
  const userSelector = useSelector((state: RootState) => state.user);

  const [post, setPost] = useState<any>({
    comments: true,
    scheduled: true,
    author: userSelector.firstName,
    schedulePost: Date.now(),
    name: ` `,
    textShort: ` `,
  });

  const [status, setStatus] = React.useState<any>("");
  const [creationProgress, setCreationProgress] = useState(false);

  const [photo, setPhoto] = useState<any>(null);
  const [photoImg, setPhotoImg] = useState<any>(null);
  const [hasPhoto, setHasPhoto] = useState<boolean>(false);

  const [hashTag, setHashTag] = useState<string>("");
  const [hashTags, setHashTags] = useState<any[]>([]);

  const [editor, setEditor] = useState<any>(null);

  const [video, setVideo] = useState<any>(null);
  const [videoUrl, setVideoUrl] = useState<any>(null);

  const [showPreview, setShowPreview] = useState<boolean>(false);

  const createPost = () => {
    let description = "";
    let descriptionArray: Array<string> = [];
    if (editor && editor.blocks) {
      for (let i = 0; i < editor.blocks.length; i++) {
        description = description + editor.blocks[i].text + "<br />\n";
        descriptionArray.push(editor.blocks[i].text);
      }
    }

    if (validatePostInfo()) {
      let body = { ...post };
      body.mainHashtag = hashTags.length > 0 ? hashTags[0] : "";
      body.hashtags = hashTags;
      body.schedulePost = post.schedulePost; // integer timestamp eg 1609424040000
      body.description = description ? description : "";
      body.descriptionArray = editor ?? {};
      body.author = userSelector.id;
      body.selectedFormat = 1; // 0 story 1 wall post
      body.hasPhoto = hasPhoto;

      if (type && type === "Post") {
        body.communityId = communityId;

        setCreationProgress(true);

        axios
          .post(`${URL()}/community/blog/createPost`, body)
          .then(async response => {
            const resp = response.data;
            if (resp.success) {
              if (hasPhoto) {
                await uploadBlogPostImage(resp.data.id);
              }
              if (video) {
                await uploadBlogVideo(resp.data.id);
              }
              setStatus({
                msg: "Blog post created",
                key: Math.random(),
                variant: "success",
              });
              setTimeout(() => {
                onClose();
                handleRefresh();
                setCreationProgress(false);
              }, 1000);
            } else {
              setCreationProgress(false);
              setStatus({
                msg: resp.error,
                key: Math.random(),
                variant: "error",
              });
            }
          })
          .catch(error => {
            console.log(error);
            setCreationProgress(false);
            setStatus({
              msg: "Error when making the request",
              key: Math.random(),
              variant: "error",
            });
          });
      } else if (type && type === "CommunityPost") {
        body.communityId = communityId;

        setCreationProgress(true);
        axios
          .post(`${URL()}/community/wall/createPost`, body)
          .then(async response => {
            const resp = response.data;
            if (resp.success) {
              if (hasPhoto) {
                await uploadCommunityWallPostImage(resp.data.id);
              }
              setStatus({
                msg: "Community Post created",
                key: Math.random(),
                variant: "success",
              });
              setTimeout(() => {
                handleRefresh();
                onClose();
              }, 1000);
            } else {
              setStatus({
                msg: resp.error,
                key: Math.random(),
                variant: "error",
              });
            }
            setCreationProgress(false);
          })
          .catch(error => {
            console.log(error);

            setStatus({
              msg: "Error when making the request",
              key: Math.random(),
              variant: "error",
            });
            setCreationProgress(false);
          });
      }
    }
  };

  const validatePostInfo = () => {
    if (post.schedulePost) {
      return true;
    } else {
      setStatus({
        msg: "Fill in all fields",
        key: Math.random(),
        variant: "error",
      });
      return false;
    }
  };

  const uploadBlogVideo = async id => {
    return new Promise((resolve, reject) => {
      const formData = new FormData();
      formData.append("video", video, id);
      const config = {
        headers: {
          "content-type": "multipart/form-data",
        },
      };
      axios
        .post(`${URL()}/community/blog/addVideo/${id}`, formData, config)
        .then(response => {
          resolve({ success: true, path: response.data.path });
        })
        .catch(error => {
          console.log(error);
          reject({ success: false });
        });
    });
  };

  const uploadBlogPostImage = async id => {
    return new Promise((resolve, reject) => {
      const formData = new FormData();
      formData.append("image", photo, id);
      const config = {
        headers: {
          "content-type": "multipart/form-data",
        },
      };
      axios
        .post(`${URL()}/community/blog/changePostPhoto`, formData, config)
        .then(response => {
          resolve(true);
        })
        .catch(error => {
          console.log(error);

          reject(true);
        });
    });
  };

  const uploadCommunityWallPostImage = async id => {
    return new Promise((resolve, reject) => {
      const formData = new FormData();
      formData.append("image", photo, id);
      const config = {
        headers: {
          "content-type": "multipart/form-data",
        },
      };
      axios
        .post(`${URL()}/community/wall/changePostPhoto`, formData, config)
        .then(response => {
          resolve(true);
        })
        .catch(error => {
          console.log(error);

          reject(true);
        });
    });
  };

  const inputHashHandler = (e: any) => {
    setHashTag(e.target.value);
  };

  const fileInputMessageVideo = e => {
    e.preventDefault();
    const files = e.target.files;
    if (files.length) {
      handleFilesVideo(files);
    }
  };

  const handleFilesVideo = (files: any) => {
    for (let i = 0; i < files.length; i++) {
      if (files[i].size / 1024 <= 51200) {
        if (validateFileVideo(files[i])) {
          onChangeVideo(files[i]);
        } else {
          files[i]["invalid"] = true;
          console.log("No valid file");
        }
      } else {
      }
    }
  };
  const validateFileVideo = file => {
    const validTypes = ["video/mp4", "video/webm", "video/ogg", "video/quicktime"];
    if (validTypes.indexOf(file.type) === -1) {
      return false;
    }
    return true;
  };
  const onChangeVideo = (file: any) => {
    setVideo(file);

    const reader = new FileReader();

    reader.addEventListener("load", () => {
      setVideoUrl(reader.result);
    });
  };

  return (
    <Modal size="medium" className={classes.root} isOpen={open} onClose={onClose} showCloseIcon theme="dark">
      {!showPreview ? (
        <>
          <Box fontSize="30px" mb={3}>
            Create new post
          </Box>
          <Box mb={3}>
            <ImageTitleDescription
              theme="dark"
              photoImg={photoImg}
              photoTitle="Post Image"
              setterPhoto={setPhoto}
              setterPhotoImg={setPhotoImg}
              setterHasPhoto={setHasPhoto}
              titleTitle="Post title"
              title={post.name}
              setterTitle={title => {
                let blogPostCopy = { ...post };
                blogPostCopy.name = title;
                setPost(blogPostCopy);
              }}
              titlePlaceholder="Post title..."
              descTitle="Post text short"
              desc={post.textShort}
              setterDesc={desc => {
                let blogPostCopy = { ...post };
                blogPostCopy.textShort = desc;
                setPost(blogPostCopy);
              }}
              descPlaceholder="Post text..."
              imageSize={3}
              infoSize={9}
              canEdit={true}
            />
          </Box>
          <Box mb={3}>
            <Grid container direction="row" spacing={3}>
              <Grid xs={12} md={6} style={{ padding: "16px" }}>
                <InputWithLabelAndTooltip
                  labelName="Video"
                  tooltip={`Upload a video`}
                  inputValue={video}
                  onInputValueChange={fileInputMessageVideo}
                  theme="dark"
                  type="file"
                  accept={"video/*"}
                  endAdornment={
                    <InputAdornment position="end">
                      <img src={uploadIcon} alt="upload" />
                    </InputAdornment>
                  }
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Grid container spacing={3}>
                  <Grid item md={6} xs={12}>
                    <Box mb={1} fontSize="18px" display="flex" alignItems="center">
                      Comments
                      <img
                        src={infoIcon}
                        alt="info"
                        style={{ width: "12px", height: "12px", marginLeft: "4px" }}
                      />
                    </Box>
                    <Box display="flex" alignItems="center">
                      <CustomSwitch
                        theme="dark"
                        onChange={() => {
                          let blogPostCopy = { ...post };
                          blogPostCopy.comments = !blogPostCopy.comments;
                          setPost(blogPostCopy);
                        }}
                        checked={post.comments}
                      />
                      <Box ml={1} fontSize="11px">
                        Yes/No
                      </Box>
                    </Box>
                  </Grid>
                  <Grid item md={6} xs={12}>
                    <Box mb={1} fontSize="18px" display="flex" alignItems="center">
                      Schedule post
                      <img
                        src={infoIcon}
                        alt="info"
                        style={{ width: "12px", height: "12px", marginLeft: "4px" }}
                      />
                    </Box>
                    <Box display="flex" alignItems="center">
                      <CustomSwitch
                        theme="dark"
                        onChange={() => {
                          let blogPostCopy = { ...post };
                          blogPostCopy.scheduled = !blogPostCopy.scheduled;
                          setPost(blogPostCopy);
                        }}
                        checked={post.scheduled}
                      />
                      <Box ml={1} fontSize="11px">
                        On/off
                      </Box>
                    </Box>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Box>
          <Box mb={3} width="100%">
            <InputWithLabelAndTooltip
              labelName="Hashtag"
              tooltip={`Please provide at least one hashtag for your community. As the Communities grow, this field will help people discover your community`}
              type="text"
              inputValue={hashTag}
              onInputValueChange={e => inputHashHandler(e)}
              placeHolder="#"
              theme="dark"
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="add"
                    onClick={e => {
                      if (hashTag && hashTag !== "") {
                        e.preventDefault();
                        setHashTags([...hashTags, "#" + hashTag]);
                        setHashTag("");
                      }
                    }}
                  >
                    <SvgIcon>
                      <PlusSolid />
                    </SvgIcon>
                  </IconButton>
                </InputAdornment>
              }
            />

            <Box display="flex" alignItems="center" mt={1}>
              {hashTags ? (
                hashTags.length > 0 &&
                hashTags.map((hashtag, i) => {
                  if (i === 0) {
                    return <HashtagLabel key={i} value={hashtag} index={i} main={true} />;
                  } else {
                    return <HashtagLabel key={i} value={hashtag} index={i} main={false} />;
                  }
                })
              ) : (
                <></>
              )}
            </Box>
          </Box>

          <Post title="Post description" editor={editor} setterEditor={setEditor} theme="dark" />
          {post.scheduled && (
            <Box display="flex" alignItems="center" mb={2}>
              <AuthorSchedulePost
                theme="dark"
                author={post.author}
                setterAuthor={author => {
                  let blogPostCopy = { ...post };
                  blogPostCopy.author = author;
                  setPost(blogPostCopy);
                }}
                authorArray={[userSelector.firstName]}
                schedulePost={post.schedulePost}
                setterSchedulePost={author => {
                  let blogPostCopy = { ...post };
                  blogPostCopy.schedulePost = author;
                  setPost(blogPostCopy);
                }}
              />
            </Box>
          )}
        </>
      ) : (
        <>
          <Box fontSize="30px" mb={3}>
            Preview post
          </Box>

          <BlogPostModalContent
            creator={userSelector}
            post={post}
            urlMainPhoto={photoImg}
            videoUrl={videoUrl}
            onlyPreview
          />
        </>
      )}

      <Box display="flex" alignItems="center" justifyContent="space-between" width="100%" mt={6}>
        <DAOButton
          onClick={() => {
            setShowPreview(!showPreview);
          }}
        >
          {showPreview ? "Back to editing" : "Preview post"}
        </DAOButton>

        <LoadingWrapper loading={creationProgress}>
          <DAOButton onClick={createPost}>Publish Post</DAOButton>
        </LoadingWrapper>
      </Box>
      {status ? <AlertMessage key={status.key} message={status.msg} variant={status.variant} /> : ""}
    </Modal>
  );
};

export default CreateBlogPostModal;

//hashtag label
const HashtagLabel = p => {
  const classes = createThreadModalStyles();

  return (
    <Box className={cls({ [classes.hashtagLabelMain]: p.main }, classes.hashtagLabel)}>
      <Box style={{ display: "flex", justifyContent: "center" }}>{p.value}</Box>
    </Box>
  );
};
