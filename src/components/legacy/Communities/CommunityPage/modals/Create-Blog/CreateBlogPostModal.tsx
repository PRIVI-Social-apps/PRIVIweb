import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";

import Grid from "@material-ui/core/Grid";

import BlocDescription from "./BlogDescription";
import { RootState } from "store/reducers/Reducer";
import PostFullScreen from "../Create-Post/Post-Full-Screen";
import CustomSwich from "./CustomSwitch";

import ComingSoon from "shared/ui-kit/Modal/Modals/ComingSoonModal";
import SchedulePost from "shared/ui-kit/Page-components/SchedulePost";
import Post from "shared/ui-kit/Page-components/Post";
import AuthorSchedulePost from "shared/ui-kit/Page-components/AuthorSchedulePost";
import SquareOptionsIconLabel from "shared/ui-kit/Page-components/SquareOptionsIconLabel";
import URL from "shared/functions/getURL";
import AlertMessage from "shared/ui-kit/Alert/AlertMessage";
import { LoadingWrapper } from "shared/ui-kit/Hocs";
import Box from "shared/ui-kit/Box";
import { createBlogPostModalStyles } from "./CreateBlogPostModal.styles";
import { Modal, PrimaryButton, SecondaryButton } from "shared/ui-kit";
import InputWithLabelAndTooltip from "shared/ui-kit/InputWithLabelAndTooltip";

const infoIcon = require("assets/icons/info_icon.png");
const storyIcon = require("assets/icons/story_icon.png");
const storySelectedIcon = require("assets/icons/selected_story_icon.png");
const wallIcon = require("assets/icons/wall_post.png");
const wallSelectedIcon = require("assets/icons/selected_wall_post.png");
const plusWhiteIcon = require("assets/icons/plus_white.png");

const CreateBlogPostModal = (props: any) => {
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
  const [selectedFormat, setSelectedFormat] = useState<any>(1);

  const [status, setStatus] = React.useState<any>("");
  const [creationProgress, setCreationProgress] = useState(false);

  const [photo, setPhoto] = useState<any>(null);
  const [photoImg, setPhotoImg] = useState<any>(null);
  const [photos, setPhotos] = useState<any[]>([]);
  const [photosImg, setPhotosImg] = useState<any[]>([]);
  const [hasPhoto, setHasPhoto] = useState<boolean>(false);

  const [hashTag, setHashTag] = useState<string>("");
  const [hashTags, setHashTags] = useState<any[]>([]);

  const [editor, setEditor] = useState<any>(null);
  const [editorPageAble, setEditorPageable] = useState<any>(null);

  const [scheduleOn, setScheduleOn] = useState<boolean>(false);
  const [video, setVideo] = useState<any>(null);
  const [showPreview, setShowPreview] = useState<boolean>(false);

  const [openComingSoonModal, setOpenComingSoonModal] = useState<boolean>(false);

  const [showFormatPicker, setFormatPicker] = useState<boolean>(false);

  useEffect(() => {
    //close coming soon modal
    if (selectedFormat === 1) {
      setOpenComingSoonModal(false);
    }
  }, [selectedFormat]);

  const previewPost = () => {
    createPagination();
    setShowPreview(!showPreview);
  };
  const createPagination = () => {
    if (editor) {
      setEditorPageable(
        editor.split(
          `<div class="page-break" style="page-break-after:always;"><span style="display:none;">&nbsp;</span></div>`
        )
      );
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
      body.selectedFormat = selectedFormat; // 0 story 1 wall post
      body.hasPhoto = hasPhoto;

      if (selectedFormat === 0) {
        body.description = "";
        body.descriptionArray = {};
      }

      if (props.type && props.type === "Post") {
        body.communityId = props.communityId;

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
              if (selectedFormat !== 0) {
                await uploadBlogPostDescriptionImages(resp.data.id);
              }
              setStatus({
                msg: "Blog post created",
                key: Math.random(),
                variant: "success",
              });
              setTimeout(() => {
                props.handleClose();
                if (props.handleRefresh) props.handleRefresh();
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
      } else if (props.type && props.type === "PodPost") {
        body.podId = props.podId;
        setCreationProgress(true);

        axios
          .post(`${URL()}/pod/wall/createPost`, body)
          .then(async response => {
            const resp = response.data;
            if (resp.success) {
              if (hasPhoto) {
                await uploadPodWallPostImage(resp.data.id);
              }
              if (selectedFormat !== 0) {
                await uploadPodWallPostDescriptionImages(resp.data.id);
              }
              setStatus({
                msg: "Pod Wall Post created",
                key: Math.random(),
                variant: "success",
              });
              setTimeout(() => {
                if (props.handleRefresh) props.handleRefresh();
                props.handleClose();
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
      } else if (props.type && props.type === "PodNFTPost") {
        body.podId = props.podId;

        setCreationProgress(true);
        axios
          .post(`${URL()}/pod/NFT/wall/createPost`, body)
          .then(async response => {
            const resp = response.data;
            if (resp.success) {
              if (hasPhoto) {
                await uploadPodNFTWallPostImage(resp.data.id);
              }
              if (selectedFormat !== 0) {
                await uploadPodNFTWallPostDescriptionImages(resp.data.id);
              }
              setStatus({
                msg: "Pod Wall Post created",
                key: Math.random(),
                variant: "success",
              });
              setTimeout(() => {
                if (props.handleRefresh) props.handleRefresh();
                props.handleClose();
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
      } else if (props.type && props.type === "CreditPoolPost") {
        body.creditPoolId = props.creditPoolId;

        setCreationProgress(true);
        axios
          .post(`${URL()}/priviCredit/wall/createPost`, body)
          .then(async response => {
            const resp = response.data;
            if (resp.success) {
              if (hasPhoto) {
                await uploadCreditWallPostImage(resp.data.id);
              }
              if (selectedFormat !== 0) {
                await uploadCreditWallPostDescriptionImages(resp.data.id);
              }
              setStatus({
                msg: "Privi Credit Wall Post created",
                key: Math.random(),
                variant: "success",
              });
              setTimeout(() => {
                if (props.handleRefresh) props.handleRefresh();
                props.handleClose();
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
      } else if (props.type && props.type === "CommunityPost") {
        body.communityId = props.communityId;

        setCreationProgress(true);
        axios
          .post(`${URL()}/community/wall/createPost`, body)
          .then(async response => {
            const resp = response.data;
            if (resp.success) {
              if (hasPhoto) {
                await uploadCommunityWallPostImage(resp.data.id);
              }
              if (selectedFormat !== 0) {
                await uploadCommunityWallPostDescriptionImages(resp.data.id);
              }
              setStatus({
                msg: "Community Post created",
                key: Math.random(),
                variant: "success",
              });
              setTimeout(() => {
                if (props.handleRefresh) props.handleRefresh();
                props.handleClose();
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
      } else if (props.type && props.type === "UserPost") {
        body.userId = props.userId;

        if (!scheduleOn) {
          let blogPostCopy = { ...post };
          blogPostCopy.schedulePost = new Date();
          setPost(blogPostCopy);
        }

        setCreationProgress(true);
        axios
          .post(`${URL()}/user/wall/createPost`, body)
          .then(async response => {
            const resp = response.data;
            if (resp.success) {
              if (hasPhoto) {
                await uploadUserWallPostImage(resp.data.id);
              }
              if (video) {
                await uploadUserVideo(resp.data.id);
              }
              if (selectedFormat !== 0) {
                await uploadUserWallPostDescriptionImages(resp.data.id);
              }
              setStatus({
                msg: "Post created",
                key: Math.random(),
                variant: "success",
              });
              setTimeout(() => {
                if (props.handleRefresh) props.handleRefresh();
                props.handleClose();
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

  const uploadCreditWallPostDescriptionImages = async id => {
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
        .post(`${URL()}/priviCredit/wall/changePostDescriptionPhotos/${id}`, formData, config)
        .then(response => {
          resolve(true);
        })
        .catch(error => {
          console.log(error);

          reject(true);
        });
    });
  };
  const uploadCreditWallPostImage = async id => {
    return new Promise((resolve, reject) => {
      const formData = new FormData();
      formData.append("image", photo, id);
      const config = {
        headers: {
          "content-type": "multipart/form-data",
        },
      };
      axios
        .post(`${URL()}/priviCredit/wall/changePostPhoto`, formData, config)
        .then(response => {
          resolve(true);
        })
        .catch(error => {
          console.log(error);

          reject(true);
        });
    });
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
      axios
        .post(`${URL()}/community/wall/changePostDescriptionPhotos/${id}`, formData, config)
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

  const uploadUserWallPostDescriptionImages = async id => {
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
        .post(`${URL()}/user/wall/changePostDescriptionPhotos/${id}`, formData, config)
        .then(response => {
          resolve(true);
        })
        .catch(error => {
          console.log(error);

          reject(true);
        });
    });
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
      axios
        .post(`${URL()}/user/wall/changePostPhoto`, formData, config)
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
      axios
        .post(`${URL()}/user/wall/addVideo/${id}`, formData, config)
        .then(response => {
          resolve(true);
        })
        .catch(error => {
          console.log(error);

          reject(true);
        });
    });
  };

  const onChangeHashTag = e => {
    setHashTag(e.target.value);
  };

  return (
    <Modal size="medium" className={classes.root} isOpen={props.open} onClose={props.onClose} showCloseIcon>
      <div className={classes.modalContent}>
        {!showPreview ? (
          <>
            <div className={classes.titleCommunitiesModal}>Create new post</div>
            {showFormatPicker && (
              <div>
                <div className={classes.subTitleCommunitiesModal}>Select format</div>
                <div className={classes.flexRowInputsCommunitiesModal}>
                  <div className="cursor-pointer" onClick={handleOpenComingSoonModal}>
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

            <div className={classes.firstRowPost}>
              <BlocDescription
                photo={photo}
                photoImg={photoImg}
                photoTitle="Post Image"
                setterPhoto={setPhoto}
                setterPhotoImg={setPhotoImg}
                setterHasPhoto={setHasPhoto}
                titleTitle="Post title"
                videoTitle="Video"
                title={post.name}
                setterTitle={title => {
                  let blogPostCopy = { ...post };
                  blogPostCopy.name = title;
                  setPost(blogPostCopy);
                }}
                namePlaceholder="Post title..."
                descTitle="Post text short"
                desc={post.textShort}
                setterDesc={desc => {
                  let blogPostCopy = { ...post };
                  blogPostCopy.textShort = desc;
                  setPost(blogPostCopy);
                }}
                setterVideo={video => {
                  setVideo(video);
                }}
                descPlaceholder="Post text..."
                imageSize={3}
                infoSize={9}
                canEdit={true}
                imgTitle="Add the main image"
              />
            </div>
            <Grid
              container
              className={classes.gridSecondRowCreatePost}
              direction="row"
              alignItems="flex-start"
              justify="flex-start"
            >
              {/* <Grid item xs={12} md={2}>
                <div className="flexRowInputsCommunitiesModal">
                  <div className="infoHeaderCommunitiesModal">
                    Video
                    <div
                      className="addVideoButton cursor-pointer"
                      onClick={uploadVideo}
                      style={{
                        fontSize: "20px",
                        cursor: "pointer",
                      }}
                    >
                      {video ? (
                        <div className="infoHeaderCommunitiesModal">Video added</div>
                      ) : (
                        <React.Fragment>
                          <div className="infoHeaderCommunitiesModal">Add video</div>
                          <SvgIcon><VideoSolid /></SvgIcon>
                        </React.Fragment>
                      )}
                    </div>
                  </div>
                </div>
              </Grid> */}
              <Grid item xs={12} md={6} style={{ padding: "10px" }}>
                {props.type !== "UserPost" ? (
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
              <Grid item xs={12} md={6}>
                <div style={{ padding: "10px", display: "flex" }}>
                  <div>
                    <div className={classes.flexRowInputsCommunitiesModal}>
                      <div className={classes.infoHeaderCommunitiesModal}>Comments</div>
                      <img className={classes.infoIconCommunitiesModal} src={infoIcon} alt={"info"} />
                    </div>
                    <div style={{ marginTop: "8px" }}>
                      {/* <button
                    className={post.comments === true ? "selected" : undefined}
                    id="commentsButtonCreatePod"
                    onClick={() => {
                      let blogPostCopy = { ...post };
                      blogPostCopy.comments = true;
                      setPost(blogPostCopy);
                    }}
                  >
                    Yes
                  </button>
                  <button
                    className={post.comments === false ? "selected" : undefined}
                    id="noCommentsButtonCreatePod"
                    onClick={() => {
                      let blogPostCopy = { ...post };
                      blogPostCopy.comments = false;
                      setPost(blogPostCopy);
                    }}
                  >
                    No
                  </button> */}
                      <CustomSwich
                        onChange={() => {
                          let blogPostCopy = { ...post };
                          blogPostCopy.comments = !blogPostCopy.comments;
                          setPost(blogPostCopy);
                        }}
                        checked={post.comments}
                      />
                    </div>
                  </div>
                  <div style={{ marginLeft: "20px" }}>
                    <div className={classes.flexRowInputsCommunitiesModal}>
                      <div className={classes.infoHeaderCommunitiesModal}>Scheduled post</div>
                      <img className={classes.infoIconCommunitiesModal} src={infoIcon} alt={"info"} />
                    </div>
                    <div style={{ marginTop: "8px" }}>
                      <CustomSwich
                        onChange={() => {
                          let blogPostCopy = { ...post };
                          blogPostCopy.scheduled = !blogPostCopy.scheduled;
                          setPost(blogPostCopy);
                        }}
                        checked={post.scheduled}
                      />
                    </div>
                  </div>
                </div>
                <Box width={1} fontSize="body1.fontSize" alignItems="center" style={{ padding: "10px" }}>
                  <div className={classes.flexRowInputsCommunitiesModal}>
                    <div className={classes.infoHeaderCommunitiesModal}>Hashtag</div>
                    <img className={classes.infoIconCommunitiesModal} src={infoIcon} alt={"info"} />
                  </div>
                  <Box width={1} display="flex" alignItems="center">
                    <InputWithLabelAndTooltip
                      overriedClasses="textFieldImgTitleDesc"
                      type="text"
                      inputValue={hashTag}
                      placeHolder="#"
                      onInputValueChange={onChangeHashTag}
                      style={{
                        width: "100%",
                        marginTop: "10px",
                      }}
                    />
                    <PrimaryButton
                      size="medium"
                      onClick={(e: any) => {
                        setHashTags(prev => [...prev, hashTag]);
                      }}
                      style={{
                        display: "flex",
                        marginLeft: "10px",
                        marginBottom: "10px",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <img
                        style={{ width: 14, height: 14, marginRight: 5 }}
                        src={plusWhiteIcon}
                        alt={"plus"}
                      />
                      {" ADD"}
                    </PrimaryButton>
                  </Box>
                  <Box display="flex" alignItems="center" flexWrap="wrap">
                    {hashTags.map((item, index) => (
                      <Box
                        className={classes.hashTagBox}
                        key={index}
                        style={{
                          background: "none",
                          color: "black",
                          marginTop: 8,
                        }}
                      >
                        {item}
                      </Box>
                    ))}
                  </Box>
                </Box>
              </Grid>
            </Grid>

            {selectedFormat !== 0 ? (
              <Post title="Post description" setterEditor={setEditor} editor={editor} />
            ) : null}
          </>
        ) : (
          <div className={classes.titleCommunitiesModal}>Preview</div>
        )}

        {showPreview ? (
          <PostFullScreen content={editorPageAble} onBackButtonClick={previewPost}></PostFullScreen>
        ) : (
          <div className={classes.buttonGroup}>
            <LoadingWrapper loading={creationProgress}>
              <React.Fragment>
                <Box width={1} display="flex" alignItems="center" justifyContent="flex-end">
                  <SecondaryButton size="medium" onClick={previewPost}>
                    Preview Post
                  </SecondaryButton>
                  <PrimaryButton size="medium" onClick={createPost}>
                    Publish Post
                  </PrimaryButton>
                </Box>
              </React.Fragment>
            </LoadingWrapper>
          </div>
        )}
        {status ? <AlertMessage key={status.key} message={status.msg} variant={status.variant} /> : ""}
      </div>
    </Modal>
  );
};

export default CreateBlogPostModal;
