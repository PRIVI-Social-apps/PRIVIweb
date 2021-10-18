import React, { useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import cls from "classnames";

import { InputAdornment, IconButton } from "@material-ui/core";
import SvgIcon from "@material-ui/core/SvgIcon";

import { createThreadModalStyles } from "./CreateThread.styles";
import AlertMessage from "shared/ui-kit/Alert/AlertMessage";
import Post from "shared/ui-kit/Page-components/Post";
import ImageTitleDescription from "shared/ui-kit/Page-components/ImageTitleDescription";
import AuthorSchedulePost from "shared/ui-kit/Page-components/AuthorSchedulePost";
import URL from "shared/functions/getURL";
import { RootState } from "store/reducers/Reducer";
import { LoadingWrapper } from "shared/ui-kit/Hocs";
import { Modal } from "shared/ui-kit";

import { ReactComponent as PlusSolid } from "assets/icons/plus-solid.svg";
import InputWithLabelAndTooltip from "shared/ui-kit/InputWithLabelAndTooltip";
import { DAOButton } from "components/PriviDAO/components/DAOButton";
import Box from 'shared/ui-kit/Box';

export default function CreateThread(props: any) {
  const classes = createThreadModalStyles();
  const userSelector = useSelector((state: RootState) => state.user);

  const [post, setPost] = useState<any>({
    author: userSelector.firstName,
    schedulePost: Date.now(),
    name: "",
    textShort: "",
  });

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

  const createThread = () => {
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
      body.hasPhoto = hasPhoto;
      body.communityId = props.communityId;
      body.userId = userSelector.id;

      setCreationProgress(true);

      axios
        .post(`${URL()}/community/discussions/createPost`, body)
        .then(async response => {
          const resp = response.data;
          if (resp.success) {
            if (hasPhoto) {
              await uploadDiscussionImage(resp.data.id);
            }
            await uploadDiscussionDescriptionImages(resp.data.id);

            setStatus({
              msg: "Discussion created successfully",
              key: Math.random(),
              variant: "success",
            });
            setTimeout(() => {
              props.handleClose();
              props.handleRefresh();
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
          setCreationProgress(false);
          setStatus({
            msg: "Error when making the request",
            key: Math.random(),
            variant: "error",
          });
        });
    } else {
      setCreationProgress(false);
      setStatus({
        msg: "Missing information making the request",
        key: Math.random(),
        variant: "error",
      });
    }
  };

  const uploadDiscussionImage = async id => {
    return new Promise((resolve, reject) => {
      const formData = new FormData();
      formData.append("image", photo, id);
      const config = {
        headers: {
          "content-type": "multipart/form-data",
        },
      };
      axios
        .post(`${URL()}/community/discussions/changePostPhoto`, formData, config)
        .then(response => {
          resolve(true);
        })
        .catch(error => {
          console.log(error);

          reject(true);
        });
    });
  };

  const uploadDiscussionDescriptionImages = async id => {
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
        .post(`${URL()}/community/discussions/changePostDescriptionPhotos/${id}`, formData, config)
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

  const uploadThreadImage = async id => {
    return new Promise((resolve, reject) => {
      const formData = new FormData();
      formData.append("image", photo, id);
      const config = {
        headers: {
          "content-type": "multipart/form-data",
        },
      };
      //TODO: axios call
    });
  };

  const inputHashHandler = (e: any) => {
    setHashTag(e.target.value);
  };

  return (
    <Modal
      size="medium"
      isOpen={props.open}
      onClose={props.handleClose}
      showCloseIcon
      theme="dark"
      className={classes.root}
    >
      <Box fontSize="30px" mb={3}>
        Create new thread
      </Box>
      <Box mb={3}>
        <ImageTitleDescription
          photoImg={photoImg}
          photoTitle="Thread Image"
          setterPhoto={setPhoto}
          setterPhotoImg={setPhotoImg}
          setterHasPhoto={setHasPhoto}
          titleTitle="Thread title"
          title={post.name}
          setterTitle={title => {
            let postCopy = { ...post };
            postCopy.name = title;
            setPost(postCopy);
          }}
          titlePlaceholder="Thread title..."
          descTitle="Thread text short"
          desc={post.textShort}
          setterDesc={desc => {
            let postCopy = { ...post };
            postCopy.textShort = desc;
            setPost(postCopy);
          }}
          descPlaceholder="Thread text..."
          imageSize={6}
          infoSize={6}
          canEdit={true}
          theme="dark"
        />
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
      <Post title="Thread description" editor={editor} setterEditor={setEditor} theme="dark" />
      <Box display="flex" alignItems="center" mb={2}>
        <AuthorSchedulePost
          theme="dark"
          author={post.author}
          setterAuthor={author => {
            let postCopy = { ...post };
            postCopy.author = author;
            setPost(postCopy);
          }}
          authorArray={[userSelector.firstName]}
          schedulePost={post.schedulePost}
          setterSchedulePost={author => {
            let postCopy = { ...post };
            postCopy.schedulePost = author;
            setPost(postCopy);
          }}
        />
      </Box>
      <Box display="flex" justifyContent="flex-end" mt={6}>
        <LoadingWrapper theme="dark" loading={creationProgress}>
          <DAOButton onClick={createThread}>Post Thread</DAOButton>
        </LoadingWrapper>
      </Box>
      {status ? <AlertMessage key={status.key} message={status.msg} variant={status.variant} /> : ""}
    </Modal>
  );
}

//hashtag label
const HashtagLabel = p => {
  const classes = createThreadModalStyles();

  return (
    <Box className={cls({ [classes.hashtagLabelMain]: p.main }, classes.hashtagLabel)}>
      <Box style={{ display: "flex", justifyContent: "center" }}>{p.value}</Box>
    </Box>
  );
};
