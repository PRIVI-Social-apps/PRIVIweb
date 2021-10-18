import { Grid, IconButton, InputAdornment, SvgIcon } from "@material-ui/core";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Modal } from "shared/ui-kit";
import Box from "shared/ui-kit/Box";
import InputWithLabelAndTooltip from "shared/ui-kit/InputWithLabelAndTooltip";
import AuthorSchedulePost from "shared/ui-kit/Page-components/AuthorSchedulePost";
import ImageTitleDescription from "shared/ui-kit/Page-components/ImageTitleDescription";
import Post from "shared/ui-kit/Page-components/Post";
import { ReactComponent as PlusSolid } from "assets/icons/plus-solid.svg";
import { RootState } from "store/reducers/Reducer";
import CustomSwitchLabels from "shared/ui-kit/CustomSwitchOptions";
import { SocialPrimaryButton, SocialSecondaryButton } from "components/PriviSocial/index.styles";
import { WallPostModalContent } from "../WallItemModal";
import AlertMessage from "shared/ui-kit/Alert/AlertMessage";
import { LoadingWrapper } from "shared/ui-kit/Hocs";
import Axios from "axios";
import URL from "shared/functions/getURL";

const infoIcon = require("assets/icons/info_gray.png");
const uploadIcon = require("assets/icons/upload.png");

export default function CreateWallPostModal({ open, handleClose, userId, type, handleRefresh }) {
  const userSelector = useSelector((state: RootState) => state.user);

  const [post, setPost] = useState<any>({
    comments: true,
    scheduled: true,
    author: userSelector.firstName,
    schedulePost: Date.now(),
    name: ` `,
    textShort: ` `,
  });

  const [photos, setPhotos] = useState<any[]>([]);

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
      body.descriptionArray = editor;
      body.author = userSelector.id;
      body.selectedFormat = 1; // 0 story 1 wall post
      body.hasPhoto = hasPhoto;

      // comment because there is no reason to add these code.
      // body.description = "";
      // body.descriptionArray = {};

      body.userId = userId;

      setCreationProgress(true);
      if (!post.scheduled) {
        let blogPostCopy = { ...post };
        blogPostCopy.schedulePost = new Date();
        setPost(blogPostCopy);
      }

      Axios.post(`${URL()}/user/wall/createPost`, body)
        .then(async response => {
          const resp = response.data;
          if (resp.success) {
            if (hasPhoto) {
              await uploadUserWallPostImage(resp.data.id);
            }
            if (photos.length > 0) {
              await uploadCommunityWallPostDescriptionImages(resp.data.id);
            }
            if (video) {
              await uploadUserVideo(resp.data.id);
            }
            setStatus({
              msg: "Post created",
              key: Math.random(),
              variant: "success",
            });
            setTimeout(() => {
              handleRefresh();
              handleClose();
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
  };

  const uploadCommunityWallPostDescriptionImages = async id => {
    return new Promise((resolve, reject) => {
      const formData = new FormData();
      photos.forEach((photo, i) => {
        formData.append("image", photo, "photo" + i);
      });
      const config = {
        headers: {
          "content-type": "multipart/form-data",
        },
      };
      Axios.post(`${URL()}/user/wall/changePostDescriptionPhotos/${id}`, formData, config)
        .then(response => {
          resolve(true);
        })
        .catch(error => {
          console.log(error);

          reject(true);
        });
    });
  };

  const validatePostInfo = () => {
    if (post.name.length <= 5) {
      setStatus({
        msg: "Name field invalid. Minimum 5 characters required.",
        key: Math.random(),
        variant: "error",
      });
      return false;
    } else if (post.textShort.length <= 5) {
      setStatus({
        msg: "Description field invalid. Minimum 5 characters required.",
        key: Math.random(),
        variant: "error",
      });
      return false;
    }
    else if (!hashTags || hashTags.length <= 0) {
      setStatus({
        msg: "Minimum 1 Hashtag",
        key: Math.random(),
        variant: "error",
      });
      return false;
    }

    return true;
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

  const uploadUserWallPostImage = async id => {
    return new Promise((resolve, reject) => {
      const formData = new FormData();
      formData.append("image", photo, id);
      const config = {
        headers: {
          "content-type": "multipart/form-data",
        },
      };
      Axios.post(`${URL()}/user/wall/changePostPhoto`, formData, config)
        .then(response => {
          resolve(true);
        })
        .catch(error => {
          console.log(error);

          reject(true);
        });
    });
  };

  const uploadUserVideo = async id => {
    return new Promise((resolve, reject) => {
      let now = Date.now();
      const formData = new FormData();
      formData.append("video", video, "" + now);
      const config = {
        headers: {
          "content-type": "multipart/form-data",
        },
      };
      Axios.post(`${URL()}/user/wall/addVideo/${id}`, formData, config)
        .then(response => {
          resolve(true);
        })
        .catch(error => {
          console.log(error);

          reject(true);
        });
    });
  };

  const handleFilesVideo = (files: any) => {
    for (let i = 0; i < files.length; i++) {
      console.log(files[i].size);
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
    <Modal size="medium" isOpen={open} onClose={handleClose} showCloseIcon>
      {!showPreview ? (
        <>
          <Box fontSize="30px" mb={3}>
            Create new post
          </Box>
          <Box mb={3}>
            <ImageTitleDescription
              theme="green"
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
              <Grid item xs={6} md={3}>
                <InputWithLabelAndTooltip
                  labelName="Video"
                  tooltip={`Upload a video`}
                  inputValue={video}
                  onInputValueChange={fileInputMessageVideo}
                  type="file"
                  accept={"video/*"}
                  endAdornment={
                    <InputAdornment position="end">
                      <img src={uploadIcon} alt="upload" />
                    </InputAdornment>
                  }
                />
              </Grid>
              <Grid item xs={6} md={3}>
                <>
                  <InputWithLabelAndTooltip
                    labelName="Hashtag"
                    tooltip={`Please provide at least one hashtag for your community. As the Communities grow, this field will help people discover your community`}
                    type="text"
                    inputValue={hashTag}
                    onInputValueChange={e => inputHashHandler(e)}
                    placeHolder="#"
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
                </>
              </Grid>
              <Grid item xs={6} md={3}>
                <>
                  <Box mb={1} fontSize="18px" display="flex" alignItems="center">
                    Comments
                    <img
                      src={infoIcon}
                      alt="info"
                      style={{ width: "12px", height: "12px", marginLeft: "4px" }}
                    />
                  </Box>
                  <CustomSwitchLabels
                    theme="green"
                    options={["Yes", "No"]}
                    onChange={() => {
                      let blogPostCopy = { ...post };
                      blogPostCopy.comments = !blogPostCopy.comments;
                      setPost(blogPostCopy);
                    }}
                    checked={post.comments}
                  />
                </>
              </Grid>
              <Grid item md={3} xs={5}>
                <>
                  <Box mb={1} fontSize="18px" display="flex" alignItems="center">
                    Schedule post
                    <img
                      src={infoIcon}
                      alt="info"
                      style={{ width: "12px", height: "12px", marginLeft: "4px" }}
                    />
                  </Box>
                  <CustomSwitchLabels
                    theme="green"
                    options={["On", "Off"]}
                    onChange={() => {
                      let blogPostCopy = { ...post };
                      blogPostCopy.scheduled = !blogPostCopy.scheduled;
                      setPost(blogPostCopy);
                    }}
                    checked={post.scheduled}
                  />
                </>
              </Grid>
            </Grid>
          </Box>

          <Post title="Post description" editor={editor} setterEditor={setEditor} />
          {post.scheduled && (
            <Box display="flex" alignItems="center" mb={2}>
              <AuthorSchedulePost
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

          <WallPostModalContent
            item={post}
            urlMainPhoto={photoImg}
            videoUrl={videoUrl}
            comments={post.responses}
            setComments={null}
            onlyDisplay
          />
        </>
      )}

      <Box display="flex" alignItems="center" justifyContent="flex-end" width="100%" mt={6}>
        <Box mr="16px">
          <SocialSecondaryButton
            onClick={() => {
              setShowPreview(!showPreview);
            }}
          >
            {showPreview ? "Back to editing" : "Preview post"}
          </SocialSecondaryButton>
        </Box>

        <LoadingWrapper loading={creationProgress} theme="green">
          <SocialPrimaryButton onClick={createPost}>Publish Post</SocialPrimaryButton>
        </LoadingWrapper>
      </Box>
      {status ? <AlertMessage key={status.key} message={status.msg} variant={status.variant} /> : ""}
    </Modal>
  );
}

//hashtag label
const HashtagLabel = p => {
  return (
    <Box color="rgb(0, 255, 21)" mr={2} mb={2}>
      <Box style={{ display: "flex", justifyContent: "center" }}>{p.value}</Box>
    </Box>
  );
};
