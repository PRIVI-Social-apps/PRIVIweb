import React, { useState } from "react";
import Axios from "axios";
import DateFnsUtils from "@date-io/date-fns";

import { Tooltip, Fade } from "@material-ui/core";
import { MuiPickersUtilsProvider, KeyboardDatePicker } from "@material-ui/pickers";

import { useTypedSelector } from "store/reducers/Reducer";

import FileUpload from "shared/ui-kit/Page-components/FileUpload";
import CustomImageUploadAdapter from "shared/services/CustomImageUploadAdapter";
import QuillEditor from "shared/ui-kit/QuillEditor";
import AlertMessage from "shared/ui-kit/Alert/AlertMessage";
import { Modal, PrimaryButton, SecondaryButton } from "shared/ui-kit";
import Box from "shared/ui-kit/Box";
import InputWithLabelAndTooltip from "shared/ui-kit/InputWithLabelAndTooltip";
import URL from "shared/functions/getURL";
import { StyledWhiteSelect, StyledMenuItem } from "shared/ui-kit/Styled-components/StyledComponents";

import { newDiscussionModalStyles } from "./index.styles";

import { ReactComponent as InfoIcon } from "assets/icons/info.svg";

const AUTHORS = ["Choose Author", "Tester"];

const CreateNewDiscussionModal = (props: any) => {
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

  const onChange = editorState => {
    setEditorState(editorState);
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

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      addHashTag();
    }
  }

  const createDiscussion = async () => {
    if (validateMediaInfo()) {
      const formData = new FormData();
      formData.append("image", upload1, title);
      formData.append("creatorId", user.id);
      formData.append("content", editorState);
      formData.append("shortDescription", description);
      formData.append("releaseData", postDate.getTime().toString());
      formData.append("tags", JSON.stringify(tags));
      formData.append("title", title);

      const config = {
        headers: {
          "content-type": "multipart/form-data",
        },
      };

      await Axios.post(`${URL()}/privi-data/createDiscussion`, formData, config).then((res) => {
        if (res.data.success) {
          setStatus({
            msg: "Successfully created.",
            key: Math.random(),
            variant: "success",
          });
        }
      }).catch(error => {
        setStatus({
          msg: "Failed to create new discussion.",
          key: Math.random(),
          variant: "error",
        });
      });
    }
  }

  return (
    <Modal
      size="medium"
      isOpen={props.open}
      onClose={props.handleClose}
      showCloseIcon
      className={classes.root}
    >
      <Box className={classes.contentBox}>
        <Box className={classes.flexBox} justifyContent="center">
          <Box className={classes.title}>New Discussion</Box>
        </Box>
        <Box mt={2}>
          <Box className={classes.flexBox} justifyContent="space-between">
            <Box className={classes.header1}>Title</Box>
            <Tooltip TransitionComponent={Fade} TransitionProps={{ timeout: 600 }} arrow title={""}>
              <InfoIcon style={{ color: "white", width: "14px" }} />
            </Tooltip>
          </Box>
          <InputWithLabelAndTooltip
            placeHolder="Discussion title"
            type="text"
            inputValue={title}
            onInputValueChange={e => setTitle(e.target.value)}
            theme="dark"
            style={{ background: "rgba(38, 37, 75, 0.7)", borderRadius: "6px" }}
          />
        </Box>
        <Box mt={3}>
          <Box className={classes.flexBox} justifyContent="space-between">
            <Box className={classes.header1}>Short preview text</Box>
            <Tooltip TransitionComponent={Fade} TransitionProps={{ timeout: 600 }} arrow title={""}>
              <InfoIcon style={{ color: "white", width: "14px" }} />
            </Tooltip>
          </Box>
          <InputWithLabelAndTooltip
            placeHolder="Write short preview text..."
            type="textarea"
            inputValue={description}
            onInputValueChange={e => setDescription(e.target.value)}
            theme="dark"
            style={{ background: "rgba(38, 37, 75, 0.7)", borderRadius: "6px" }}
          />
        </Box>
        <Box mt={3}>
          <Box className={classes.flexBox} justifyContent="space-between">
            <Box className={classes.header1}>Hashtags</Box>
            <Tooltip TransitionComponent={Fade} TransitionProps={{ timeout: 600 }} arrow title={""}>
              <InfoIcon style={{ color: "white", width: "14px" }} />
            </Tooltip>
          </Box>
          <Box className={classes.hashTagBox} mt={1} style={{ background: "rgba(38, 37, 75, 0.7)" }}>
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
            theme="dark"
          />
        </Box>
        <Box width={1} mt={3}>
          <Box className={classes.flexBox} justifyContent="space-between">
            <Box className={classes.header1}>Full Text</Box>
            <Tooltip TransitionComponent={Fade} TransitionProps={{ timeout: 600 }} arrow title={""}>
              <InfoIcon style={{ color: "white", width: "14px" }} />
            </Tooltip>
          </Box>
          <Box width={1} mt={1} className={classes.editorBox}>
            <QuillEditor editorState={editorState} onChange={onChange} />
          </Box>
        </Box>
        <Box className={classes.flexBox} mt={3}>
          <Box width={1} mr={1}>
            <Box className={classes.header1}>Author</Box>
            <Box width={1} className={classes.controlBox} mt={1}>
              <StyledWhiteSelect
                disableUnderline
                value={author}
                onChange={v => {
                  setAuthor(v.target.value as string);
                }}
                required
                style={{ width: "100%", marginTop: "6px", marginBottom: "3px", color: "white" }}
              >
                {AUTHORS.map(item => {
                  return (
                    <StyledMenuItem value={item} key={item}>
                      {item}
                    </StyledMenuItem>
                  );
                })}
              </StyledWhiteSelect>
            </Box>
          </Box>
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
                  onChange={(date, value) => {
                    setPostDate(date ? new Date(date.getTime()) : new Date());
                  }}
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
        <Box width={1} display="flex" justifyContent="center" mt={4}>
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
            onClick={createDiscussion}
            isRounded
            style={{
              paddingLeft: "48px",
              paddingRight: "48px",
              marginLeft: "24px",
              background: "linear-gradient(0deg, #BA50FC, #BA50FC), #7977D1",
            }}
          >
            Create Now
          </PrimaryButton>
        </Box>
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

export default CreateNewDiscussionModal;
