import React, { useEffect, useState, useRef } from "react";
import "./DiscussionPage.scss";
import axios from "axios";
import URL from "shared/functions/getURL";
import { useTypedSelector } from "store/reducers/Reducer";
import { TextareaAutosize } from "@material-ui/core";
import { socket } from "components/Login/Auth";
import { Modal } from "@material-ui/core";
import ReactPlayer from "react-player";
import Waveform from "shared/ui-kit/Page-components/Discord/DiscordAudioWavesurfer/Waveform";
import DiscordPhotoFullScreen from "shared/ui-kit/Page-components/Discord/DiscordPhotoFullScreen/DiscordPhotoFullScreen";
import DiscordVideoFullScreen from "shared/ui-kit/Page-components/Discord/DiscordVideoFullScreen/DiscordVideoFullScreen";
import AlertMessage from "shared/ui-kit/Alert/AlertMessage";
import { RecordingBox } from "shared/ui-kit/RecordingBox";
import Moment from "react-moment";
import { saveAs } from "file-saver";
import { LoadingWrapper } from "shared/ui-kit/Hocs";
import EmojiPane from "shared/ui-kit/EmojiPane";

import SvgIcon from "@material-ui/core/SvgIcon";
import { ReactComponent as PlaySolid } from "assets/icons/play-solid.svg";
import { ReactComponent as DownloadSolid } from "assets/icons/download-solid.svg";
import { ReactComponent as SendIcon } from "assets/icons/paper-plane-regular.svg";
import Box from "shared/ui-kit/Box";
import CreateNewVoteModal from "components/PriviMusicDao/modals/CreateNewVoteModal";

export function DiscussionPage(props) {
  const users = useTypedSelector(state => state.usersInfoList);
  const user = useTypedSelector(state => state.user);
  const [topics, setTopics] = useState<Array<any>>([]);
  const [mediaBlobUrl, setMediaBlobUrl] = React.useState<any>();
  const [topicView, setTopicView] = useState<any>({});
  const [openNewTopic, setOpenNewTopic] = useState<boolean>(false);
  const [chatContent, setChatContent] = useState<string>("");
  const [messages, setMessages] = useState<any[]>([]);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [status, setStatus] = React.useState<any>("");
  const [disableSubmit, setDisableSubmit] = useState<boolean>(false);
  const [messagesLoading, setMessagesLoading] = useState<boolean>(false);
  const [selectedPhoto, setSelectedPhoto] = useState<string>("");
  const [selectedVideo, setSelectedVideo] = useState<string>("");
  const [showEmoji, setShowEmoji] = useState<boolean>(false);

  const [openModalDiscordPhotoFullScreen, setOpenModalDiscordPhotoFullScreen] = useState<boolean>(false);
  const [openModalDiscordVideoFullScreen, setOpenModalDiscordVideoFullScreen] = useState<boolean>(false);
  const [pageIndex, setPageIndex] = useState<number>(0);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [paginationLoading, setPaginationLoading] = React.useState<boolean>(false);
  const itemListRef = useRef<HTMLDivElement>(null);
  let playerVideo: any = useRef();

  useEffect(() => {
    setPageIndex(messages.length);
    if (itemListRef && itemListRef.current && !paginationLoading)
      itemListRef.current.scrollTop = itemListRef.current.scrollHeight;
    setPaginationLoading(false);
  }, [messages]);

  useEffect(() => {
    props.pageDiscussionRef.current = refreshTopics;
    loadTopics();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [users, props.discussions]);

  useEffect(() => {
    if (topicView.id) {
      setMessages([]);
      loadTopic(true);
    }
    /* eslint-disable react-hooks/exhaustive-deps */
  }, [topicView]);

  useEffect(() => {
    if (socket) {
      socket.off("message-podDiscussion");
      socket.on("message-podDiscussion", message => {
        if (message.topicId === topicView.id) {
          const userIndex = users.findIndex(user => user.id === message.from);
          if (~userIndex) message["createdByImage"] = users[userIndex].imageURL;
          addMessage(message);
        }
      });
    }
  }, [topicView.id, users]);

  const downloadFile = val => {
    saveAs(`${URL()}/podDiscussion/downloadFile/${props.podId}/${topicView.id}/${val.message}`, val.message);
  };

  const onChangeMessageFile = (file: any) => {
    let now = Date.now();
    const formData = new FormData();
    formData.append("file", file, file.name);
    const config = {
      headers: {
        "content-type": "multipart/form-data",
      },
    };

    axios
      .post(
        `${URL()}/podDiscussion/addMessageFile/${props.podId}/${topicView.id}/${user.id}`,
        formData,
        config
      )
      .then(response => {
        if (response.data && response.data.success) {
          const messageObj = {
            from: user.id,
            message: "",
            url: response.data.data.url || "",
            type: "file",
            podId: props.podId,
            topicId: topicView.id,
            noAddMessage: true,
          };
          socket.emit("add-message-podDiscussion", messageObj);
          addMessage(messageObj);
          setStatus({
            msg: "Video uploaded successfully",
            key: Math.random(),
            variant: "success",
          });
        } else {
          setStatus({
            msg: response.data.error,
            key: Math.random(),
            variant: "error",
          });
        }
      })
      .catch(error => {
        console.log(error);
        setStatus({
          msg: "Error uploading video",
          key: Math.random(),
          variant: "error",
        });
      });
  };

  const onChangeMessageVideo = (file: any) => {
    let now = Date.now();
    const formData = new FormData();
    formData.append("video", file, "" + now);
    const config = {
      headers: {
        "content-type": "multipart/form-data",
      },
    };

    axios
      .post(
        `${URL()}/podDiscussion/addMessageVideo/${props.podId}/${topicView.id}/${user.id}`,
        formData,
        config
      )
      .then(response => {
        if (response.data && response.data.success) {
          const messageObj = {
            from: user.id,
            message: "",
            url: response.data.data.url || "",
            type: "video",
            podId: props.podId,
            topicId: topicView.id,
            noAddMessage: true,
          };
          socket.emit("add-message-podDiscussion", messageObj);
          addMessage(messageObj);
          setStatus({
            msg: "Video uploaded successfully",
            key: Math.random(),
            variant: "success",
          });
        } else {
          setStatus({
            msg: response.data.error,
            key: Math.random(),
            variant: "error",
          });
        }
      })
      .catch(error => {
        console.log(error);
        setStatus({
          msg: "Error uploading video",
          key: Math.random(),
          variant: "error",
        });
      });
  };

  const handleOpenModalDiscordPhotoFullScreen = () => {
    setOpenModalDiscordPhotoFullScreen(true);
  };
  const handleCloseModalDiscordPhotoFullScreen = () => {
    setOpenModalDiscordPhotoFullScreen(false);
  };
  const handleOpenModalDiscordVideoFullScreen = () => {
    setOpenModalDiscordVideoFullScreen(true);
  };

  const handleCloseModalDiscordVideoFullScreen = () => {
    setOpenModalDiscordVideoFullScreen(false);
  };

  const validateFile = file => {
    const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/x-icon"];
    if (validTypes.indexOf(file.type) === -1) {
      return false;
    }
    return true;
  };

  const validateFileVideo = file => {
    const validTypes = ["video/mp4", "video/webm", "video/ogg", "video/quicktime"];
    if (validTypes.indexOf(file.type) === -1) {
      return false;
    }
    return true;
  };

  const validateFileAudio = file => {
    const validTypes = ["audio/mp3", "audio/ogg", "audio/wav", "audio/x-m4a", "audio/mpeg"];
    if (validTypes.indexOf(file.type) === -1) {
      return false;
    }
    return true;
  };

  const addMessage = message => {
    setMessages(messages => {
      let msgsArray = [...messages];
      msgsArray.push(message);
      return msgsArray;
    });
  };

  const onChangeMessagePhoto = (file: any) => {
    let now = Date.now();
    const formData = new FormData();
    formData.append("image", file, "" + now);
    const config = {
      headers: {
        "content-type": "multipart/form-data",
      },
    };

    axios
      .post(
        `${URL()}/podDiscussion/addMessagePhoto/${props.podId}/${topicView.id}/${user.id}`,
        formData,
        config
      )
      .then(response => {
        if (response.data && response.data.success) {
          const messageObj = {
            from: user.id,
            message: "",
            url: response.data.data.url || "",
            type: "photo",
            podId: props.podId,
            topicId: topicView.id,
            noAddMessage: true,
          };

          socket.emit("add-message-podDiscussion", messageObj);

          let messagesCopy = [...messages];
          messagesCopy.push(messageObj);
          setMessages(messagesCopy);

          setStatus({
            msg: "Photo uploaded successfully",
            key: Math.random(),
            variant: "success",
          });
        } else {
          setStatus({
            msg: response.data.error,
            key: Math.random(),
            variant: "error",
          });
        }
      })
      .catch(error => {
        console.log(error);
        setStatus({
          msg: "Error uploading photo",
          key: Math.random(),
          variant: "error",
        });
      });
  };

  const addEmoji = (e, emojiObject) => {
    let emoji = emojiObject.emoji;
    setChatContent(chatContent + emoji);
    setShowEmoji(false);
  };

  const toggleEmojiPicker = () => {
    setShowEmoji(!showEmoji);
  };

  const onChangeMessageAudio = (file: any) => {
    let now = Date.now();
    const formData = new FormData();
    formData.append("audio", file, "" + now);
    const config = {
      headers: {
        "content-type": "multipart/form-data",
      },
    };
    axios
      .post(
        `${URL()}/podDiscussion/addMessageAudio/${props.podId}/${topicView.id}/${user.id}`,
        formData,
        config
      )
      .then(response => {
        if (response.data && response.data.success) {
          const messageObj = {
            from: user.id,
            message: "",
            url: response.data.data.url || "",
            type: "audio",
            podId: props.podId,
            topicId: topicView.id,
            noAddMessage: true,
          };

          socket.emit("add-message-podDiscussion", messageObj);
          addMessage(messageObj);
          setStatus({
            msg: "Audio uploaded successfully",
            key: Math.random(),
            variant: "success",
          });
        } else {
          setStatus({
            msg: response.data.error,
            key: Math.random(),
            variant: "error",
          });
        }
      })
      .catch(error => {
        console.log(error);
        setStatus({
          msg: "Error uploading audio",
          key: Math.random(),
          variant: "error",
        });
      });
  };
  const handleFiles = (files: any) => {
    for (let i = 0; i < files.length; i++) {
      if (validateFile(files[i])) {
        onChangeMessagePhoto(files[i]);
      } else {
        files[i]["invalid"] = true;
        console.log("No valid file");
      }
    }
  };

  const handleFilesOthers = (files: any) => {
    for (let i = 0; i < files.length; i++) {
      if (files[i].size / 1024 <= 51200) {
        onChangeMessageFile(files[i]);
      } else {
        setStatus({
          msg: "File too big (< 50Mb)",
          key: Math.random(),
          variant: "error",
        });
      }
    }
  };
  const handleFilesVideo = (files: any) => {
    for (let i = 0; i < files.length; i++) {
      if (files[i].size / 1024 <= 51200) {
        if (validateFileVideo(files[i])) {
          onChangeMessageVideo(files[i]);
        } else {
          files[i]["invalid"] = true;
          console.log("No valid file");
          setStatus({
            msg: "Not valid format",
            key: Math.random(),
            variant: "error",
          });
        }
      } else {
        setStatus({
          msg: "File too big (< 50Mb)",
          key: Math.random(),
          variant: "error",
        });
      }
    }
  };

  const handleFilesAudio = (files: any) => {
    for (let i = 0; i < files.length; i++) {
      if (files[i].size / 1024 <= 4096) {
        if (validateFileAudio(files[i])) {
          onChangeMessageAudio(files[i]);
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
  const handleFilesAttachment = files => {
    for (let i = 0; i < files.length; i++) {
      if (files[i].type.startsWith("image")) handleFiles({ 0: files[i], length: 1 });
      else if (files[i].type.startsWith("audio")) handleFilesAudio({ 0: files[i], length: 1 });
      else if (files[i].type.startsWith("video")) handleFilesVideo({ 0: files[i], length: 1 });
      else handleFilesOthers({ 0: files[i], length: 1 });
    }
  };
  const fileInputMessageAttachment = e => {
    e.preventDefault();
    const files = e.target.files;
    if (files.length) {
      handleFilesAttachment(files);
    }
  };

  const uploadAttachment = () => {
    const inputElement = document.createElement("input");
    inputElement.type = "file";
    inputElement.accept = "*";
    inputElement.multiple = true;

    // set onchange event to call callback when user has selected file
    inputElement.addEventListener("change", fileInputMessageAttachment);

    // dispatch a click event to open the file dialog
    inputElement.dispatchEvent(new MouseEvent("click"));
  };

  const handleOpenNewTopic = () => {
    setOpenNewTopic(true);
  };

  const handleCloseNewTopic = () => {
    setOpenNewTopic(false);
  };

  const refreshTopics = React.useCallback(() => {
    loadTopics();
  }, []);

  const loadTopics = () => {
    if (props.discussions) {
      setTopics(props.discussions);
    }
  };

  const loadTopic = (isNew?: boolean): Promise<number> => {
    return new Promise((resolve, reject) => {
      if (!isNew && (messagesLoading || !hasMore)) {
        resolve(0);
        return;
      }
      setMessagesLoading(true);
      axios
        .get(`${URL()}/podDiscussion/getMessages/${props.podId}/${topicView.id}/${isNew ? 0 : pageIndex}`)
        .then(response => {
          if (response.data.success) {
            const newMessages = [...response.data.messages];
            for (let i = 0; i < newMessages.length; i++) {
              if (users && users.length > 0) {
                newMessages[i]["createdByImage"] =
                  users.find(user => user.id === newMessages[i].from)?.url || "";
              }
            }
            if (isNew) setMessages(newMessages);
            else setMessages([...newMessages, ...messages]);
            setHasMore(response.data.hasMore);
            setMessagesLoading(false);
            resolve(response.data.messages.length);
          }
        })
        .catch(error => {
          setMessagesLoading(false);
          reject(error);
          console.log(error);
        });
    });
  };

  const handleScroll = React.useCallback(
    async e => {
      if (e.target.scrollTop === 0 && messages.length > 0) {
        const lastMsgID = messages.length > 0 ? messages[0].created : null;
        setPaginationLoading(true);
        const count = await loadTopic();
        if (count === 0) {
          setPaginationLoading(false);
        }
        if (lastMsgID) {
          const el = document.getElementById(lastMsgID);
          const itemList = document.getElementById("messageContainer");
          if (itemListRef && itemListRef.current && el && itemList) {
            itemListRef.current.scrollTop = Math.max(
              0,
              el.getBoundingClientRect().y - itemList.getBoundingClientRect().y - 90
            );
          }
        }
      }
    },
    [loadTopic]
  );

  const onFormEnter = e => {
    if (e.keyCode === 13 && e.shiftKey === false) {
      handleSubmit(e);
    }
  };

  const sendMessage = (audioMessage?: string) => {
    if (!chatContent && !audioMessage) return;
    if (!audioMessage) {
      let values = { messageContent: chatContent };
      let validatedErrors = validate(values);
      setErrors(validatedErrors);
      if (Object.keys(validatedErrors).length === 0) {
        console.log("no errors, send create message request now");
      }
    }

    const messageObj = {
      from: user.id,
      message: chatContent ? chatContent : audioMessage,
      type: "text",
      podId: props.podId,
      topicId: topicView.id,
    };
    socket.emit("add-message-podDiscussion", messageObj);

    let messagesCopy = [...messages];
    messagesCopy.push(messageObj);
    setMessages(messagesCopy);

    setChatContent("");
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    sendMessage();
  };

  function validate(values: { [key: string]: any }): { [key: string]: any } {
    var errors: { [key: string]: string } = {};

    if (values.messageContent === null || values.messageContent === "") {
      errors.messageContent = "messageContent required";
    }

    return errors;
  }

  const onTopicSelected = val => {
    socket?.emit("subscribe-podDiscussion", { podId: props.podId, topicId: val.id, userId: user.id });
    setTopicView(val);
  };

  if (topics.length === 0)
    return (
      <Box className={"no-content-container"}>
        <Box mt={2}>No discussions yet</Box>
      </Box>
    );
  else
    return (
      <Box className="discussion-posts">
        <Box className="discussion-headers">
          {topics.map((val, index) => {
            return (
              <Box
                className={val === topicView ? "discussion-header selected" : "discussion-header"}
                key={`discussion-${index}`}
                onClick={() => {
                  onTopicSelected(val);
                }}
              >
                <Box className="title-topic">{val.title}</Box>
                {val.lastMessage && val.lastMessage !== "" ? (
                  <Box className="last-message-topic">{val.lastMessage}</Box>
                ) : null}
                {val.lastMessageDate && val.lastMessageDate !== 0 ? (
                  <Box className="last-message-date-topic">
                    Last message: &nbsp;
                    <Moment fromNow>{val.lastMessageDate}</Moment>
                  </Box>
                ) : null}
              </Box>
            );
          })}
        </Box>
        <Box className="selected-discussion">
          {Object.keys(topicView).length > 0 ? (
            <Box
              className="discussions-content"
              id="messageContainer"
              onScroll={handleScroll}
              {...({ ref: itemListRef } as any)}
            >
              <LoadingWrapper loading={messagesLoading} />
              {messages.map((val, index) => (
                <Box
                  className={val.from === user.id ? "discussion-item mine" : "discussion-item"}
                  key={index}
                  id={val.created}
                >
                  {val.from !== user.id ? (
                    <Box
                      className="avatar"
                      style={{
                        backgroundImage:
                          val.createdByImage && val.createdByImage.length > 0
                            ? `url(${val.createdByImage})`
                            : "none",
                        backgroundRepeat: "no-repeat",
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                      }}
                    />
                  ) : null}
                  {val.type === "text" ? (
                    <Box
                      className="bubble"
                      style={val.from === user.id ? { textAlign: "right" } : { textAlign: "left" }}
                    >
                      {val.message.includes("data:audio/wav;") ? (
                        <audio controls src={JSON.parse(val.message)}>
                          The “audio” tag is not supported by your browser. Click [here] to download the sound
                          file.
                        </audio>
                      ) : (
                        val.message
                      )}
                      <Box
                        className="messageDateFromNow"
                        style={val.from === user.id ? { textAlign: "right" } : { textAlign: "left" }}
                      >
                        <Moment fromNow>{val.created}</Moment>
                      </Box>
                    </Box>
                  ) : val.type === "photo" ? (
                    <Box
                      className="bubble"
                      style={val.from === user.id ? { textAlign: "right" } : { textAlign: "left" }}
                    >
                      <Box
                        className="messageInfoPhoto"
                        onClick={() => {
                          setSelectedPhoto(
                            `${URL()}/podDiscussion/getMessagePhoto/${props.podId}/${topicView.id}/${
                              val.message
                            }`
                          );
                          handleOpenModalDiscordPhotoFullScreen();
                        }}
                        style={{
                          backgroundImage: `url(${URL()}/podDiscussion/getMessagePhoto/${props.podId}/${
                            topicView.id
                          }/${val.message})`,
                          backgroundPosition: "center",
                          backgroundRepeat: "no-repeat",
                          backgroundSize: "cover",
                        }}
                      ></Box>
                      <Box
                        className="messageDateFromNow"
                        style={val.from === user.id ? { textAlign: "right" } : { textAlign: "left" }}
                      >
                        <Moment fromNow>{val.created}</Moment>
                      </Box>
                    </Box>
                  ) : val.type === "video" ? (
                    <Box
                      className="bubble"
                      style={val.from === user.id ? { textAlign: "right" } : { textAlign: "left" }}
                    >
                      <Box className="messageInfoVideo">
                        <Box className="iconVideoWrapperDiscussions">
                          <SvgIcon className="playIconVideoDiscussions">
                            <PlaySolid />
                          </SvgIcon>
                        </Box>
                        <ReactPlayer
                          onClick={() => {
                            setSelectedVideo(
                              `${URL()}/podDiscussion/getMessageVideo/${props.podId}/${topicView.id}/${
                                val.message
                              }`
                            );
                            handleOpenModalDiscordVideoFullScreen();
                          }}
                          url={`${URL()}/podDiscussion/getMessageVideo/${props.podId}/${topicView.id}/${
                            val.message
                          }`}
                          className="react-player"
                          ref={playerVideo}
                          progressInterval={200}
                        />
                      </Box>
                      <Box
                        className="messageDateFromNow"
                        style={val.from === user.id ? { textAlign: "right" } : { textAlign: "left" }}
                      >
                        <Moment fromNow>{val.created}</Moment>
                      </Box>
                    </Box>
                  ) : val.type === "audio" ? (
                    <Box
                      className="bubble"
                      style={val.from === user.id ? { textAlign: "right" } : { textAlign: "left" }}
                    >
                      <Box className="messageInfoAudio">
                        <Waveform
                          url={`${URL()}/podDiscussion/getMessageAudio/${props.podId}/${topicView.id}/${
                            val.message
                          }`}
                          mine={false}
                          showTime={false}
                          onPauseFunction={null}
                          onPlayFunction={null}
                          onReadyFunction={null}
                        />
                      </Box>
                      <Box
                        className="messageDateFromNow"
                        style={val.from === user.id ? { textAlign: "right" } : { textAlign: "left" }}
                      >
                        <Moment fromNow>{val.created}</Moment>
                      </Box>
                    </Box>
                  ) : val.type === "file" ? (
                    <Box
                      className="bubble"
                      style={val.from === user.id ? { textAlign: "right" } : { textAlign: "left" }}
                    >
                      <Box className="item-file">
                        <Box className="item-file-name">{val.message.originalname}</Box>
                        <Box onClick={() => downloadFile(val)} className="item-file-icon">
                          <SvgIcon>
                            <DownloadSolid />
                          </SvgIcon>
                        </Box>
                      </Box>
                      <Box
                        className="messageDateFromNow"
                        style={val.from === user.id ? { textAlign: "right" } : { textAlign: "left" }}
                      >
                        <Moment fromNow>{val.created}</Moment>
                      </Box>
                    </Box>
                  ) : null}
                </Box>
              ))}
            </Box>
          ) : (
            <Box className="no-comments">
              <span>🏁</span>
              <span>Select a conversation and start discussing!</span>
            </Box>
          )}
          {Object.keys(topicView).length > 0 ? (
            <Box className="inputDiscordChat">
              <form onSubmit={handleSubmit}>
                <TextareaAutosize
                  rowsMin={1}
                  required={true}
                  value={chatContent}
                  onChange={messageContent => setChatContent(messageContent.target.value)}
                  onKeyDown={onFormEnter}
                  placeholder="Type here..."
                  className="comment"
                />
                <button disabled={disableSubmit}>
                  <SendIcon style={{ width: "16px" }} />
                </button>
              </form>
            </Box>
          ) : null}
        </Box>
        {status ? <AlertMessage key={status.key} message={status.msg} variant={status.variant} /> : ""}
        {openModalDiscordPhotoFullScreen && (
          <Modal
            className="modal"
            open={openModalDiscordPhotoFullScreen}
            onClose={handleCloseModalDiscordPhotoFullScreen}
          >
            <DiscordPhotoFullScreen
              onCloseModal={handleCloseModalDiscordPhotoFullScreen}
              url={selectedPhoto}
            />
          </Modal>
        )}
        {openModalDiscordVideoFullScreen && (
          <Modal
            className="modal"
            open={openModalDiscordVideoFullScreen}
            onClose={handleCloseModalDiscordVideoFullScreen}
          >
            <DiscordVideoFullScreen
              onCloseModal={handleCloseModalDiscordVideoFullScreen}
              url={selectedVideo}
            />
          </Modal>
        )}
      </Box>
    );
}

export default DiscussionPage;
