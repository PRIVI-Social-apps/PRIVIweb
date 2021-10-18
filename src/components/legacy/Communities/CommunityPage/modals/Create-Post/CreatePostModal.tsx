import React, { useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";

import { Fade, Tooltip } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import Modal from "@material-ui/core/Modal";

import { RootState } from "store/reducers/Reducer";
import PreviewPost from "./PreviewCreatedPost";
import StyledCheckbox from "shared/ui-kit/Checkbox";

import Post from "shared/ui-kit/Page-components/Post";
import ImageTitleDescription from "shared/ui-kit/Page-components/ImageTitleDescription";
import AuthorSchedulePost from "shared/ui-kit/Page-components/AuthorSchedulePost";
import URL from "shared/functions/getURL";
import AlertMessage from "shared/ui-kit/Alert/AlertMessage";
import SchedulePost from "shared/ui-kit/Page-components/SchedulePost";
import { LoadingWrapper } from "shared/ui-kit/Hocs";
import { PrimaryButton, SecondaryButton } from "shared/ui-kit";

import { createPostModalStyles } from "./CreatePostModal.styles";

import SvgIcon from "@material-ui/core/SvgIcon";
import { ReactComponent as CircleRegular } from "assets/icons/circle-regular.svg";
import { ReactComponent as CheckedCircleRegular } from "assets/icons/dot-circle-regular.svg";
import { ReactComponent as StarRegular } from "assets/icons/star-regular.svg";
import { ReactComponent as StarSolid } from "assets/icons/star-solid.svg";
import InputWithLabelAndTooltip from "shared/ui-kit/InputWithLabelAndTooltip";
const infoIcon = require("assets/icons/info.svg");

const CreatePostModal = (props: any) => {
  const userSelector = useSelector((state: RootState) => state.user);
  const classes = createPostModalStyles();

  const [post, setPost] = useState<any>({
    comments: true,
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

  const [hashtag, setHashtag] = useState<string>("");
  const [hashtags, setHashtags] = useState<any[]>([]);

  const [editor, setEditor] = useState<any>(null);

  const [scheduleOn, setScheduleOn] = useState<boolean>(true);
  const [video, setVideo] = useState<any>(null);
  const [showPreview, setShowPreview] = useState<boolean>(false);

  const [videoAllowed, setVideoAllowed] = useState<boolean>(true);

  const previewPost = () => {
    setShowPreview(!showPreview);
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
      body.mainHashtag = hashtags.length > 0 ? hashtags[0] : "";
      body.hashtags = hashtags;
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

      //console.log("createPost", body);

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
      } else if (props.type && props.type === "MediaPodPost") {
        body.podId = props.podId;
        setCreationProgress(true);
        axios
          .post(`${URL()}/mediaPod/wall/createPost`, body)
          .then(async response => {
            const resp = response.data;
            if (resp.success) {
              if (hasPhoto) {
                await uploadMediaPodWallPostImage(resp.data.id);
              }
              if (selectedFormat !== 0) {
                await uploadMediaPodWallPostDescriptionImages(resp.data.id);
              }
              setStatus({
                msg: "Media pod Wall Post created",
                key: Math.random(),
                variant: "success",
              });
              setTimeout(() => {
                if (props.handleRefresh) props.handleRefresh();
                props.handleClose();
              }, 1000);
              setCreationProgress(false);
            } else {
              setStatus({
                msg: resp.error,
                key: Math.random(),
                variant: "error",
              });
              setCreationProgress(false);
            }
          })
          .catch(error => {
            console.log(error);
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
              setCreationProgress(false);
            } else {
              setStatus({
                msg: resp.error,
                key: Math.random(),
                variant: "error",
              });
              setCreationProgress(false);
            }
          })
          .catch(error => {
            console.log(error);
            setStatus({
              msg: "Error when making the request",
              key: Math.random(),
              variant: "error",
            });
          });
      } else if (props.type && props.type === "CreditPoolPost") {
        body.creditPoolId = props.creditPoolId;

        setCreationProgress(false);
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

        setCreationProgress(true);
        if (!scheduleOn) {
          let blogPostCopy = { ...post };
          blogPostCopy.schedulePost = new Date();
          setPost(blogPostCopy);
        }

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
  const uploadMediaPodWallPostImage = async id => {
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

  const uploadMediaPodWallPostDescriptionImages = async id => {
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
      //console.log(files[i].size);
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
    <Modal className={classes.root} open={props.open} onClose={props.handleClose}>
      <div className={classes.postModalContent}>
        <div className={classes.closeButton} onClick={props.handleClose}>
          <img src={require("assets/icons/x_darkblue.png")} alt={"x"} />
        </div>
        {!showPreview ? (
          <div>
            <div className={classes.titleCommunitiesModal}>Create new post</div>
            <div className={classes.firstRowPost}>
              <ImageTitleDescription
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
            </div>
            <Grid
              container
              className={classes.gridSecondRowCreatePost}
              spacing={2}
              direction="row"
              alignItems="flex-start"
              justify="flex-start"
            >
              <Grid item xs={12} md={3}>
                <div className={classes.infoHeaderCommunitiesModal}>Video</div>
                <div
                  className={videoAllowed ? classes.addVideoButton : classes.addVideoButtonDisabled}
                  onClick={videoAllowed ? uploadVideo : undefined}
                  style={{
                    cursor: "pointer",
                  }}
                >
                  {video ? (
                    <div className={classes.infoHeaderCommunitiesModalInAddVideoButton}>Video added</div>
                  ) : (
                    <React.Fragment>
                      <div className={classes.infoHeaderCommunitiesModalInAddVideoButton}>Add video</div>
                      <img src={require("assets/icons/add_gray.png")} alt={"add"} />
                    </React.Fragment>
                  )}
                </div>
              </Grid>
              <Grid item xs={12} md={3}>
                <div className={classes.infoHeaderCommunitiesModal}>
                  Hashtag
                  <Tooltip
                    TransitionComponent={Fade}
                    TransitionProps={{ timeout: 600 }}
                    arrow
                    className={classes.tooltipHeaderInfo}
                    title={`You can provide hashtags to your post`}
                  >
                    <img src={infoIcon} alt={"info"} />
                  </Tooltip>
                </div>
                <div className={classes.hashtagInput}>
                  <InputWithLabelAndTooltip
                    type="text"
                    inputValue={hashtag}
                    placeHolder="#"
                    onInputValueChange={e => {
                      let value = e.target.value;
                      setHashtag(value);
                    }}
                  />
                  <img
                    src={require("assets/icons/add_gray.png")}
                    alt={"add"}
                    onClick={() => {
                      const hs = [...hashtags];

                      if (!hashtag) return;
                      hs.push(hashtag);

                      setHashtags(hs);
                      setHashtag("");
                    }}
                  />
                </div>

                <div className={classes.hashtagsRow}>
                  {hashtags.map((hashtag, index) => (
                    <div className={index === 0 ? classes.hashtagPillFilled : classes.hashtagPill}>
                      {hashtags && hashtags[index] ? hashtags[index] : hashtag}
                    </div>
                  ))}
                </div>
              </Grid>
              <Grid item xs={12} md={2}>
                <div className={classes.flexRowInputsCommunitiesModal}>
                  <div className={classes.infoHeaderCommunitiesModal}>Video</div>
                  <img className={classes.infoIconCommunitiesModal} src={infoIcon} alt={"info"} />
                </div>{" "}
                <div className={classes.optionsContainer}>
                  <div className={classes.optionButtonsSmall}>
                    <button
                      className={videoAllowed === true ? classes.optionButtonSelected : classes.optionButton}
                      id="commentsButtonCreatePost"
                      onClick={() => {
                        setVideoAllowed(!videoAllowed);
                      }}
                    ></button>
                    <button
                      className={videoAllowed === false ? classes.optionButtonSelected : classes.optionButton}
                      id="noCommentsButtonCreatePost"
                      onClick={() => {
                        setVideoAllowed(!videoAllowed);
                      }}
                    ></button>
                  </div>
                  <div className={classes.optionsLabel}> Yes/No</div>
                </div>
              </Grid>
              <Grid item xs={12} md={3}>
                <div className={classes.flexRowInputsCommunitiesModal}>
                  <div className={classes.infoHeaderCommunitiesModal}>Schedule post</div>
                  <img className={classes.infoIconCommunitiesModal} src={infoIcon} alt={"info"} />
                </div>
                <div className={classes.optionsContainer}>
                  <div className={classes.optionButtonsSmall}>
                    <button
                      className={scheduleOn === true ? classes.optionButtonSelected : classes.optionButton}
                      id="commentsButtonCreatePost"
                      onClick={() => {
                        setScheduleOn(!scheduleOn);
                      }}
                    ></button>
                    <button
                      className={scheduleOn === false ? classes.optionButtonSelected : classes.optionButton}
                      id="noCommentsButtonCreatePost"
                      onClick={() => {
                        setScheduleOn(!scheduleOn);
                      }}
                    ></button>
                  </div>
                  <div className={classes.optionsLabel}> Yes/No</div>
                </div>
              </Grid>
            </Grid>
            <Grid
              container
              className={classes.gridSecondRowCreatePost}
              spacing={2}
              direction="row"
              alignItems="flex-start"
              justify="flex-start"
            >
              {props.type === "UserPost" ? (
                <Grid item xs={12} md={6}>
                  <div className={classes.flexRowInputsCommunitiesModal}>
                    <div className={classes.infoHeaderCommunitiesModal}>Share with</div>
                    <img className={classes.infoIconCommunitiesModal} src={infoIcon} alt={"info"} />
                  </div>
                  <div className={classes.shareOptions}>
                    <div
                      onClick={() => {
                        setPost({ ...post, sharedWithOption: 0 });
                      }}
                    >
                      <StyledCheckbox
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
                      />
                      <label>Your PRIVI Wall</label>
                    </div>
                    <div
                      onClick={() => {
                        setPost({ ...post, sharedWithOption: 1 });
                      }}
                    >
                      <StyledCheckbox
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
                      />
                      <label>Your Superfans</label>
                    </div>
                  </div>
                </Grid>
              ) : (
                <Grid item xs={12} md={6}>
                  <div className={classes.flexRowInputsCommunitiesModal}>
                    <div className={classes.infoHeaderCommunitiesModal}>Settings</div>
                  </div>
                  <div className={classes.shareOptions}>
                    <div
                      onClick={() => {
                        let blogPostCopy = { ...post };
                        if (blogPostCopy.comments === undefined || blogPostCopy.comments === null) {
                          blogPostCopy.comments = true;
                        } else {
                          blogPostCopy.comments = !blogPostCopy.comments;
                        }
                        setPost(blogPostCopy);
                      }}
                    >
                      <StyledCheckbox checked={post.comments === true} />
                      <label>Allow comments</label>
                    </div>
                    <div
                      onClick={() => {
                        let blogPostCopy = { ...post };
                        if (blogPostCopy.shareOnWall === undefined || blogPostCopy.shareOnWall === null) {
                          blogPostCopy.shareOnWall = true;
                        } else {
                          blogPostCopy.shareOnWall = !blogPostCopy.shareOnWall;
                        }
                        setPost(blogPostCopy);
                      }}
                    >
                      <StyledCheckbox checked={post.sharedWithOption === true} />
                      <label>Share on PRIVI Wall</label>
                    </div>
                  </div>
                </Grid>
              )}
              <Grid item xs={12} md={6}>
                {scheduleOn ? (
                  props.type !== "UserPost" ? (
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
                      uncontrolledSchedule={true}
                      schedulePost={post.schedulePost}
                      setterSchedulePost={schedule => {
                        let blogPostCopy = { ...post };
                        blogPostCopy.schedulePost = schedule;
                        setPost(blogPostCopy);
                      }}
                      scheduleOn={true}
                      setterScheduleOn={setScheduleOn}
                    />
                  )
                ) : null}
              </Grid>
            </Grid>
            {selectedFormat !== 0 ? (
              <Post title="Post description" editor={editor} setterEditor={setEditor} />
            ) : null}
          </div>
        ) : (
          <PreviewPost photoImg={photoImg} post={post} content={editor} hashtags={hashtags} />
        )}

        <LoadingWrapper loading={creationProgress}>
          {!showPreview ? (
            <div className={classes.buttons}>
              <SecondaryButton size="medium" onClick={previewPost}>
                Preview Post
              </SecondaryButton>
              <PrimaryButton size="medium" onClick={createPost}>
                Publish Post
              </PrimaryButton>
            </div>
          ) : (
            <div className={classes.buttons} style={{ justifyContent: "space-between" }}>
              <PrimaryButton size="medium" onClick={previewPost}>
                Edit
              </PrimaryButton>
              <PrimaryButton
                size="medium"
                onClick={() => {
                  if (validatePostInfo()) {
                    createPost();
                  } else {
                    previewPost();
                  }
                }}
              >
                Publish
              </PrimaryButton>
            </div>
          )}
        </LoadingWrapper>
        {status && Object.keys(status).length > 0 ? (
          <AlertMessage key={status.key} message={status.msg} variant={status.variant} />
        ) : null}
      </div>
    </Modal>
  );
};

export default CreatePostModal;
