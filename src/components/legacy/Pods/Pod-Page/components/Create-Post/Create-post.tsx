import React, { useEffect, useState } from "react";
import "./Create-post.css";
import "./modal.css";
import Post from "shared/ui-kit/Page-components/Post";
import ImageTitleDescription from "shared/ui-kit/Page-components/ImageTitleDescription";
import Grid from "@material-ui/core/Grid";
import Hashtags from "shared/ui-kit/Page-components/Hashtags";
import AuthorSchedulePost from "shared/ui-kit/Page-components/AuthorSchedulePost";
import SquareOptionsIconLabel from "shared/ui-kit/Page-components/SquareOptionsIconLabel";
import axios from "axios";
import URL from "shared/functions/getURL";
import AlertMessage from "shared/ui-kit/Alert/AlertMessage";
import { useSelector } from "react-redux";
import { RootState } from "store/reducers/Reducer";
import ComingSoon from "shared/ui-kit/Modal/Modals/ComingSoonModal";
import SchedulePost from "shared/ui-kit/Page-components/SchedulePost";
//import { CKEditor } from '@ckeditor/ckeditor5-react';
//import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import PostFullScreen from "./Post-Full-Screen";

import { Checkbox } from "@material-ui/core";
import { LoadingWrapper } from "shared/ui-kit/Hocs";
import { PrimaryButton } from "shared/ui-kit";

import SvgIcon from "@material-ui/core/SvgIcon";
import { ReactComponent as CircleRegular } from "assets/icons/circle-regular.svg";
import { ReactComponent as CheckedCircleRegular } from "assets/icons/dot-circle-regular.svg";
import { ReactComponent as StarRegular } from "assets/icons/star-regular.svg";
import { ReactComponent as StarSolid } from "assets/icons/star-solid.svg";
import { ReactComponent as VideoSolid } from "assets/icons/video-solid.svg";
const infoIcon = require("assets/icons/info.svg");
const storyIcon = require("assets/icons/story_icon.png");
const storySelectedIcon = require("assets/icons/selected_story_icon.png");
const wallIcon = require("assets/icons/wall_post.png");
const wallSelectedIcon = require("assets/icons/selected_wall_post.png");

const CreatePost = (props: any) => {
  const userSelector = useSelector((state: RootState) => state.user);

  const [post, setPost] = useState<any>({
    comments: true,
    author: userSelector.firstName,
    schedulePost: Date.now(),
    name: ` `,
    textShort: ` `,
    sharedWithOption: 0,
  });
  const [selectedFormat, setSelectedFormat] = useState<any>(1);

  const [status, setStatus] = React.useState<any>("");
  const [creationProgress, setCreationProgress] = useState(false);

  const [photo, setPhoto] = useState<any>(null);
  const [photoImg, setPhotoImg] = useState<any>(null);
  const [photos, setPhotos] = useState<any[]>([]);
  const [photosImg, setPhotosImg] = useState<any[]>([]);
  const [hasPhoto, setHasPhoto] = useState<boolean>(false);

  const [addHashtag, setAddHashtag] = useState(false);
  const [hashtag, setHashtag] = useState<string>("");
  const [hashtags, setHashtags] = useState<any[]>([]);

  const [editor, setEditor] = useState<any>(null);
  const [editorPageAble, setEditorPageable] = useState<any>(null);

  const [scheduleOn, setScheduleOn] = useState<boolean>(false);
  const [video, setVideo] = useState<any>(null);
  const [showPreview, setShowPreview] = useState<boolean>(false);
  const [videoAllowed, setVideoAllowed] = useState<boolean>(true);
  const [scheduleActivated, setScheduleActivated] = useState<boolean>(true);

  const [openComingSoonModal, setOpenComingSoonModal] = useState<boolean>(false);

  const [showFormatPicker, setFormatPicker] = useState<boolean>(false);

  const previewPost = () => {
    createPagination();
    setShowPreview(!showPreview);
  };
  const createPagination = () => {
    if (editor) {
      const pages = editor.split(
        `<div class="page-break" style="page-break-after:always;"><span style="display:none;">&nbsp;</span></div>`
      );
      setEditorPageable(pages);
      return pages;
    }
  };

  const handleOpenComingSoonModal = () => {
    setOpenComingSoonModal(true);
    setSelectedFormat(0);
  };

  const handleCloseComingSoonModal = () => {
    setOpenComingSoonModal(false);
    setSelectedFormat(1);
  };

  useEffect(() => {
    //close coming soon modal
    if (selectedFormat === 1) {
      setOpenComingSoonModal(false);
    }
  }, [selectedFormat]);

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
      if (!props.onlyEditor) {
        body.mainHashtag = hashtags.length > 0 ? hashtags[0] : "";
        body.hashtags = hashtags;
        body.schedulePost = post.schedulePost; // integer timestamp eg 1609424040000
        body.description = description ? description : "";
        body.descriptionArray = editor;
        body.author = userSelector.id;
        console.log("author, userSelector.id");
        body.selectedFormat = selectedFormat; // 0 story 1 wall post
        body.hasPhoto = hasPhoto;
      }

      body.editorPages = editorPageAble || createPagination();

      if (props.type && props.type === "Blog") {
        body.communityId = props.communityId;

        setCreationProgress(true);

        axios
          .post(`${URL()}/media/uploadBlog/${props.podId}/${props.media.MediaSymbol}`, body)
          .then(async response => {
            const resp = response.data;
            if (resp.success) {
              if (!props.onlyEditor) {
                if (hasPhoto) {
                  await uploadBlogPostImage(resp.data.id);
                }
                if (selectedFormat !== 0) {
                  await uploadBlogPostDescriptionImages(resp.data.id);
                }
                setStatus({
                  msg: "Blog post created",
                  key: Math.random(),
                  variant: "success",
                });
              } else {
                props.uploadMedia();
                setStatus({
                  msg: "Media uploaded",
                  key: Math.random(),
                  variant: "success",
                });
              }

              setTimeout(() => {
                props.handleClose();
                // props.handleRefresh();
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

  const uploadBlogPostDescriptionImages = async id => {
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
      axios
        .post(`${URL()}/community/blog/changePostDescriptionPhotos/${id}`, formData, config)
        .then(response => {
          resolve(true);
        })
        .catch(error => {
          console.log(error);

          reject(true);
        });
    });
  };

  const uploadPodWallPostImage = async id => {
    return new Promise((resolve, reject) => {
      const formData = new FormData();
      formData.append("image", photo, id);
      const config = {
        headers: {
          "content-type": "multipart/form-data",
        },
      };
      axios
        .post(`${URL()}/pod/wall/changePostPhoto`, formData, config)
        .then(response => {
          resolve(true);
        })
        .catch(error => {
          console.log(error);

          reject(true);
        });
    });
  };
  const uploadPodWallPostDescriptionImages = async id => {
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
      axios
        .post(`${URL()}/pod/wall/changePostDescriptionPhotos/${id}`, formData, config)
        .then(response => {
          resolve(true);
        })
        .catch(error => {
          console.log(error);

          reject(true);
        });
    });
  };

  const uploadPodNFTWallPostImage = async id => {
    return new Promise((resolve, reject) => {
      const formData = new FormData();
      formData.append("image", photo, id);
      const config = {
        headers: {
          "content-type": "multipart/form-data",
        },
      };
      axios
        .post(`${URL()}/pod/NFT/wall/changePostPhoto/`, formData, config)
        .then(response => {
          resolve(true);
        })
        .catch(error => {
          console.log(error);

          reject(true);
        });
    });
  };
  const uploadPodNFTWallPostDescriptionImages = async id => {
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
      axios
        .post(`${URL()}/pod/NFT/wall/changePostDescriptionPhotos/${id}`, formData, config)
        .then(response => {
          resolve(true);
        })
        .catch(error => {
          console.log(error);

          reject(true);
        });
    });
  };

  const uploadVideo = () => {
    let inputElement = document.createElement("input");
    inputElement.type = "file";
    inputElement.accept = "video/*";
    // set onchange event to call callback when user has selected file
    inputElement.addEventListener("change", fileInputMessageVideo);
    // dispatch a click event to open the file dialog

    inputElement.dispatchEvent(new MouseEvent("click"));
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
      console.log(files[i].size);
      if (files[i].size / 1024 <= 51200) {
        if (validateFileVideo(files[i])) {
          onChangeVideo(files[i]);
        } else {
          files[i]["invalid"] = true;
          console.log("No valid file");
          // Alert invalid image
          setStatus({
            msg: "Not valid format",
            key: Math.random(),
            variant: "error",
          });
        }
      } else {
        setStatus({
          msg: "File too big (< 5Mb)",
          key: Math.random(),
          variant: "error",
        });
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
  };

  return (
    <div className="modalCreatePost modalCreatePostWide modal-content">
      <div className="exit" onClick={props.handleClose}>
        <img src={require("assets/icons/x_darkblue.png")} alt={"x"} />
      </div>
      {!props.onlyEditor ? (
        <div>
          {!showPreview ? (
            <div className="titleCommunitiesModal">Create new post</div>
          ) : (
            <div className="titleCommunitiesModal">Preview</div>
          )}
          {showFormatPicker && (
            <div>
              <div className="subTitleCommunitiesModal">Select format</div>
              <div className="flexRowInputsCommunitiesModal">
                <div onClick={handleOpenComingSoonModal} className="cursor-pointer">
                  <SquareOptionsIconLabel
                    index={0}
                    selected={selectedFormat}
                    imageIcon={storyIcon}
                    imageSelectedIcon={storySelectedIcon}
                    widthIcon="62"
                    heightIcon="86"
                    label="Story"
                    setterFormat={undefined}
                  />
                </div>
                <ComingSoon
                  open={openComingSoonModal}
                  handleClose={handleCloseComingSoonModal}
                  maxHeight={"calc(85vh - 120px)"}
                  width={"100%"}
                  marginTop={350}
                  marginBottom={60}
                />
                <SquareOptionsIconLabel
                  index={1}
                  selected={selectedFormat}
                  imageIcon={wallIcon}
                  imageSelectedIcon={wallSelectedIcon}
                  widthIcon="86"
                  heightIcon="62"
                  label="Wall Post"
                  setterFormat={setSelectedFormat}
                />
              </div>
            </div>
          )}

          <div className="firstRowPost">
            <ImageTitleDescription
              photoImg={photoImg}
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
              photoTitle="Add the main image"
            />
          </div>
          <Grid
            container
            className="gridSecondRowCreatePost"
            spacing={1}
            direction="row"
            alignItems="flex-start"
            justify="flex-start"
          >
            <Grid item xs={12} md={3}>
              <div className="flexRowInputsCommunitiesModal">
                <div className="infoHeaderCommunitiesModal">
                  Video
                  <img className="infoIconCommunitiesModal" src={infoIcon} alt={"info"} />
                </div>
              </div>
              <div
                className={videoAllowed ? "addVideoButton" : "addVideoButton disabled"}
                onClick={videoAllowed ? uploadVideo : undefined}
              >
                {video ? (
                  <div className="infoHeaderCommunitiesModal">Video added</div>
                ) : (
                  <React.Fragment>
                    <div className="infoHeaderCommunitiesModal">Add video</div>
                    <SvgIcon>
                      <VideoSolid />
                    </SvgIcon>
                  </React.Fragment>
                )}
              </div>
            </Grid>
            <Grid item xs={12} md={3}>
              <Hashtags
                addHashtag={addHashtag}
                setterAddHashtag={setAddHashtag}
                hashtag={hashtag}
                setterHashtag={setHashtag}
                hashtags={hashtags}
                setterHashtags={setHashtags}
              />
            </Grid>
            <Grid item xs={12} md={2}>
              <div className="flexRowInputsCommunitiesModal">
                <div className="infoHeaderCommunitiesModal">Video</div>
                <img className="infoIconCommunitiesModal" src={infoIcon} alt={"info"} />
              </div>
              <div className="option-buttons">
                <button
                  className={videoAllowed === true ? "selected" : undefined}
                  id="commentsButtonCreatePod"
                  onClick={() => {
                    setVideoAllowed(!videoAllowed);
                  }}
                ></button>
                <button
                  className={videoAllowed === false ? "selected" : undefined}
                  id="noCommentsButtonCreatePod"
                  onClick={() => {
                    setVideoAllowed(!videoAllowed);
                  }}
                ></button>
                <div className="options-label"> Yes/No</div>
              </div>
            </Grid>
            <Grid item xs={12} md={2}>
              <div className="flexRowInputsCommunitiesModal">
                <div className="infoHeaderCommunitiesModal">Schedule Post</div>
                <img className="infoIconCommunitiesModal" src={infoIcon} alt={"info"} />
              </div>
              <div className="option-buttons">
                <button
                  className={scheduleActivated === true ? "selected" : undefined}
                  id="commentsButtonCreatePod"
                  onClick={() => {
                    setScheduleActivated(!scheduleActivated);
                  }}
                ></button>
                <button
                  className={scheduleActivated === false ? "selected" : undefined}
                  id="noCommentsButtonCreatePod"
                  onClick={() => {
                    setScheduleActivated(!scheduleActivated);
                  }}
                ></button>
                <div className="options-label"> Yes/No</div>
              </div>
            </Grid>
            <Grid item xs={12} md={2}>
              <div className="flexRowInputsCommunitiesModal">
                <div className="infoHeaderCommunitiesModal">Comments</div>
                <img className="infoIconCommunitiesModal" src={infoIcon} alt={"info"} />
              </div>
              <div className="option-buttons">
                <button
                  className={post.comments === true ? "selected" : undefined}
                  id="commentsButtonCreatePod"
                  onClick={() => {
                    let blogPostCopy = { ...post };
                    blogPostCopy.comments = true;
                    setPost(blogPostCopy);
                  }}
                ></button>
                <button
                  className={post.comments === false ? "selected" : undefined}
                  id="noCommentsButtonCreatePod"
                  onClick={() => {
                    let blogPostCopy = { ...post };
                    blogPostCopy.comments = false;
                    setPost(blogPostCopy);
                  }}
                ></button>
                <div className="options-label"> Yes/No</div>
              </div>
            </Grid>
          </Grid>

          <Grid
            container
            className="gridSecondRowCreatePost"
            spacing={2}
            direction="row"
            alignItems="flex-start"
            justify="flex-start"
          >
            <Grid item xs={12} md={6}>
              <div className="flexRowInputsCommunitiesModal">
                <div className="infoHeaderCommunitiesModal">Share with</div>
                <img className="infoIconCommunitiesModal" src={infoIcon} alt={"info"} />
              </div>
              <div className={"shareOptions"}>
                <div>
                  <Checkbox
                    checked={post.sharedWithOption === 0}
                    icon={
                      <SvgIcon>
                        <CheckedCircleRegular />
                      </SvgIcon>
                    }
                    checkedIcon={
                      <SvgIcon>
                        <CircleRegular />
                      </SvgIcon>
                    }
                    className={"shareCheckbox"}
                    onClick={() => {
                      let blogPostCopy = { ...post };
                      blogPostCopy.sharedWithOption = 0;
                      setPost(blogPostCopy);
                    }}
                  />
                  <label>Your PRIVI Wall</label>
                </div>
                <div>
                  <Checkbox
                    checked={post.sharedWithOption === 1}
                    icon={
                      <SvgIcon>
                        <StarRegular />
                      </SvgIcon>
                    }
                    checkedIcon={
                      <SvgIcon>
                        <StarSolid />
                      </SvgIcon>
                    }
                    className={"shareCheckbox"}
                    onClick={() => {
                      let blogPostCopy = { ...post };
                      blogPostCopy.sharedWithOption = 1;
                      setPost(blogPostCopy);
                    }}
                  />
                  <label>Your Superfans</label>
                </div>
              </div>
            </Grid>
            {scheduleActivated ? (
              <Grid item xs={12} md={4}>
                {props.type !== "Post" ? (
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
                ) : (
                  <SchedulePost
                    schedulePost={post.schedulePost}
                    setterSchedulePost={schedule => {
                      let blogPostCopy = { ...post };
                      blogPostCopy.schedulePost = schedule;
                      setPost(blogPostCopy);
                    }}
                    scheduleOn={scheduleOn}
                    setterScheduleOn={setScheduleOn}
                  />
                )}
              </Grid>
            ) : null}
          </Grid>
        </div>
      ) : null}

      {selectedFormat !== 0 ? <Post title="Upload Blog" setterEditor={setEditor} /> : null}

      {showPreview && (
        <PostFullScreen content={editorPageAble} onBackButtonClick={previewPost}></PostFullScreen>
      )}

      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
        }}
      >
        <LoadingWrapper loading={creationProgress}>
          <React.Fragment>
            {!showPreview ? (
              <React.Fragment>
                {!props.onlyEditor ? (
                  <PrimaryButton size="medium" style={{ marginRight: "5px" }} onClick={previewPost}>
                    Preview Post
                  </PrimaryButton>
                ) : (
                  <PrimaryButton size="medium" onClick={previewPost}>
                    Preview Blog
                  </PrimaryButton>
                )}
                {!props.onlyEditor ? (
                  <PrimaryButton size="medium" onClick={createPost}>
                    Publish Post
                  </PrimaryButton>
                ) : (
                  <PrimaryButton size="medium" onClick={createPost}>
                    Upload Media
                  </PrimaryButton>
                )}
              </React.Fragment>
            ) : null}
          </React.Fragment>
        </LoadingWrapper>
      </div>
      {status ? <AlertMessage key={status.key} message={status.msg} variant={status.variant} /> : ""}
    </div>
  );
};

export default CreatePost;
