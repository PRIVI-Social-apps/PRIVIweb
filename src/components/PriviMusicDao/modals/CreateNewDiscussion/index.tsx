import React, { useState } from "react";
import path from "path";
import axios from "axios";

import { Tooltip, Fade, Hidden } from "@material-ui/core";
import { MuiPickersUtilsProvider, KeyboardDatePicker } from "@material-ui/pickers";

import FileUpload from "shared/ui-kit/Page-components/FileUpload";
import CustomImageUploadAdapter from "shared/services/CustomImageUploadAdapter";
import QuillEditor from "shared/ui-kit/QuillEditor";
import AlertMessage from "shared/ui-kit/Alert/AlertMessage";
import { newDiscussionModalStyles } from "./index.styles";
import { Modal, PrimaryButton, SecondaryButton } from "shared/ui-kit";
import Box from "shared/ui-kit/Box";
import InputWithLabelAndTooltip from "shared/ui-kit/InputWithLabelAndTooltip";

import { ReactComponent as InfoIcon } from "assets/icons/info.svg";
import { StyledBlueSelect, StyledMenuItem } from "shared/ui-kit/Styled-components/StyledComponents";
import DateFnsUtils from "@date-io/date-fns";
import { useTypedSelector } from "store/reducers/Reducer";
import URL from "shared/functions/getURL";

const AUTHORS = ["Choose Author", "Tester"];

const CreateNewDiscussion = (props: any) => {
  const classes = newDiscussionModalStyles();
  const user = useTypedSelector(state => state.user);
  const [status, setStatus] = useState<any>("");

  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [hashTag, setHashTag] = useState<string>("");
  const [tags, setTags] = useState<string[]>([]);
  const [postDate, setPostDate] = useState<Date>(new Date());
  const [author, setAuthor] = useState<string>(AUTHORS[0]);

  const [upload1, setUpload1] = useState<any>(null);
  const [uploadImg1, setUploadImg1] = useState<any>(null);
  const [editorState, setEditorState] = useState("");
  const [editorPageAble, setEditorPageable] = useState<any>(null);

  const onChange = editorState => {
    //console.log(editorState);
    setEditorState(editorState);
  };

  //photo functions
  const uploadMedia = async (mediaSymbol, urlType, secondUpload, type) => {
    return new Promise((resolve, reject) => {
      const formData = new FormData();
      let upload: any;
      upload = upload1;
      if (!upload) resolve(false);
      formData.append(type, upload, `${mediaSymbol}${path.extname(upload.name ?? "")}`);

      const config = {
        headers: {
          "content-type": "multipart/form-data",
        },
      };

      if (upload) {
      }
    });
  };

  const dataURLtoFile = (dataurl, filename) => {
    let arr = dataurl.split(","),
      mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]),
      n = bstr.length,
      u8arr = new Uint8Array(n);

    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }

    return new File([u8arr], filename, { type: mime });
  };

  const validateMediaInfo = async () => {
    if (title.length <= 5) {
      setStatus({
        msg: "Name field invalid. Minimum 5 characters required.",
        key: Math.random(),
        variant: "error",
      });
      return false;
    } else if (!tags || tags.length <= 0) {
      /*else if (mediaData.MediaDescription.length <= 20) {
      setErrorMsg("Description field invalid. Minimum 20 characters required");
      handleClickError();
      return false;
    }*/
      setStatus({
        msg: "Minimum 1 Hashtag",
        key: Math.random(),
        variant: "error",
      });
      return false;
    } else if (!upload1) {
      setStatus({
        msg: "Media Image is required.",
        key: Math.random(),
        variant: "error",
      });
      return false;
    }
    return true;
  };

  const addHashTag = () => {
    setTags(prev => {
      setHashTag("");
      return [...prev, hashTag];
    });
  };

  const handleCkEditrImage = loader => {
    return new CustomImageUploadAdapter(loader);
  };

  const getHashTags = () => {
    return (
      <React.Fragment>
        {tags.map((item, index) => (
          <Box className={classes.tagBox} key={index} mr={1}>
            <Box>{item}</Box>
          </Box>
        ))}
      </React.Fragment>
    );
  };

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter") {
      addHashTag();
    }
  }

  const handleNewDiscussion = () => {
    axios.post(`${URL()}/musicDao/governance/discussions/addNew`, {
      title,
      shortPreviewText: description,
      hashtags: tags,
      fullText: editorState,
      author: author,
      creatorAddress: user.id,
      schedulePost: postDate,
    })
      .then(res => {
        if (res.data.success) {
          setStatus({ msg: "Poll created succesfully", variant: "success", key: Math.random(), });
          setTimeout(() => {
            props.handleClose();
          }, 1000);
        } else {
          setStatus({ msg: "Error creating Poll", variant: "error", key: Math.random(), });
        }
      })
      .catch(err => {
        console.log("===========", err);
        setStatus({ msg: "Network error", variant: "error" });
      })
  }

  return (
    <Modal size="medium" isOpen={props.open} onClose={props.handleClose} showCloseIcon>
      <Box className={classes.contentBox}>
        <Box className={classes.flexBox} justifyContent="center">
          <Box className={classes.title}>New Discussion</Box>
        </Box>
        <Box mt={2}>
          <Box className={classes.flexBox} justifyContent="space-between">
            <Box className={classes.header1}>Title</Box>
            <Tooltip TransitionComponent={Fade} TransitionProps={{ timeout: 600 }} arrow title={""}>
              <InfoIcon style={{ color: "grey", width: "14px" }} />
            </Tooltip>
          </Box>
          <InputWithLabelAndTooltip
            placeHolder="Discussion title"
            type="text"
            inputValue={title}
            onInputValueChange={e => setTitle(e.target.value)}
          />
        </Box>
        <Box mt={1}>
          <Box className={classes.flexBox} justifyContent="space-between">
            <Box className={classes.header1}>Short preview text</Box>
            <Tooltip TransitionComponent={Fade} TransitionProps={{ timeout: 600 }} arrow title={""}>
              <InfoIcon style={{ color: "grey", width: "14px" }} />
            </Tooltip>
          </Box>
          <InputWithLabelAndTooltip
            placeHolder="Write short preview text..."
            type="textarea"
            inputValue={description}
            onInputValueChange={e => setDescription(e.target.value)}
          />
        </Box>
        <Box mt={1}>
          <Box className={classes.flexBox} justifyContent="space-between">
            <Box className={classes.header1}>Hashtags</Box>
            <Tooltip TransitionComponent={Fade} TransitionProps={{ timeout: 600 }} arrow title={""}>
              <InfoIcon style={{ color: "grey", width: "14px" }} />
            </Tooltip>
          </Box>
          <Box className={classes.hashTagBox} mt={1}>
            <Box className={classes.flexBox}>{getHashTags()}</Box>
            <InputWithLabelAndTooltip
              placeHolder="New tag..."
              type="text"
              inputValue={hashTag}
              onInputValueChange={e => setHashTag(e.target.value)}
              onKeyDown={handleKeyDown}
            />
          </Box>
        </Box>
        <Box mt={3} width={1}>
          <Box className={classes.header1} mb={1}>
            Add photo
          </Box>
          <FileUpload
            photo={upload1}
            photoImg={uploadImg1}
            setterPhoto={setUpload1}
            setterPhotoImg={setUploadImg1}
            mainSetter={undefined}
            mainElement={undefined}
            type="image"
            canEdit
            isNewVersion
          />
        </Box>
        <Box width={1} mt={3}>
          <Box className={classes.flexBox} justifyContent="space-between">
            <Box className={classes.header1}>Full Text</Box>
            <Tooltip TransitionComponent={Fade} TransitionProps={{ timeout: 600 }} arrow title={""}>
              <InfoIcon style={{ color: "grey", width: "14px" }} />
            </Tooltip>
          </Box>
          <Box width={1} mt={1} style={{ background: "rgba(238, 242, 247, 0.5)" }}>
            <QuillEditor editorState={editorState} onChange={onChange} />
          </Box>
        </Box>
        <Box className={classes.flexBox} mt={3}>
          <Box width={1} mr={1}>
            <Box className={classes.header1}>Author</Box>
            <Box width={1} className={classes.controlBox} mt={1}>
              <StyledBlueSelect
                disableUnderline
                value={author}
                onChange={v => {
                  setAuthor(v.target.value as string);
                }}
                required
                style={{ width: "100%", marginTop: "6px", marginBottom: "3px" }}
              >
                {AUTHORS.map(item => {
                  return (
                    <StyledMenuItem value={item} key={item}>
                      {item}
                    </StyledMenuItem>
                  );
                })}
              </StyledBlueSelect>
            </Box>
          </Box>
          <Hidden only='xs'>
            <Box width={1} ml={1}>
              <Box className={classes.header1}>Schedule post</Box>
              <Box width={1} className={classes.controlBox} mt={1}>
                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                  <KeyboardDatePicker
                    disableToolbar
                    variant="inline"
                    format="MM/dd/yyyy"
                    margin="dense"
                    id="date-picker-inline"
                    value={postDate}
                    onChange={(e, value) => setPostDate(new Date(Number(value)))}
                    KeyboardButtonProps={{
                      "aria-label": "change date",
                    }}
                    size="small"
                    className={classes.datepicker}
                  />
                </MuiPickersUtilsProvider>
              </Box>
            </Box>
          </Hidden>
        </Box>
        <Hidden smUp>
          <Box className={classes.flexBox} mt={3}>
            <Box width={1} ml={1}>
              <Box className={classes.header1}>Schedule post</Box>
              <Box width={1} className={classes.controlBox} mt={1}>
                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                  <KeyboardDatePicker
                    disableToolbar
                    variant="inline"
                    format="MM/dd/yyyy"
                    margin="dense"
                    id="date-picker-inline"
                    value={postDate}
                    onChange={(e, value) => setPostDate(new Date(Number(value)))}
                    KeyboardButtonProps={{
                      "aria-label": "change date",
                    }}
                    size="small"
                    className={classes.datepicker}
                  />
                </MuiPickersUtilsProvider>
              </Box>
            </Box>
          </Box>
        </Hidden>
        <Box width={1} display="flex" justifyContent="center" mt={4}>
          <Hidden smUp>
            <SecondaryButton
              size="medium"
              onClick={props.handleClose}
              isRounded
              style={{ paddingLeft: "48px", paddingRight: "48px", width: "100%" }}
            >
              Cancel
            </SecondaryButton>
          </Hidden>
          <Hidden only='xs'>
            <SecondaryButton
              size="medium"
              onClick={props.handleClose}
              isRounded
              style={{ paddingLeft: "48px", paddingRight: "48px" }}
            >
              Cancel
            </SecondaryButton>
            <PrimaryButton
              size="medium"
              onClick={handleNewDiscussion}
              isRounded
              style={{ paddingLeft: "48px", paddingRight: "48px", marginLeft: "24px" }}
            >
              Create Now
            </PrimaryButton>
          </Hidden>
        </Box>
        <Hidden smUp>
          <Box width={1} display="flex" justifyContent="center" mt={4}>
            <PrimaryButton
              size="medium"
              onClick={handleNewDiscussion}
              isRounded
              style={{ paddingLeft: "48px", paddingRight: "48px", width: "100%" }}
            >
              Create Now
            </PrimaryButton>
          </Box>
        </Hidden>
      </Box>
      {status && (
        <AlertMessage
          key={status.key}
          message={status.msg}
          variant={status.variant}
          onClose={() => setStatus(undefined)}
        />
      )}
    </Modal>
  );
};

export default CreateNewDiscussion;
