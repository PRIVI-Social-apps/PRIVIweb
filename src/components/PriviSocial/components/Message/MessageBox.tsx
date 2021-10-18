import React, { useState, useEffect } from "react";
import { MessageList } from "./MessageList";
import { MessageContent } from "./MessageContent";
import { MessageProfile } from "./MessageProfile";
import axios from "axios";
import URL from "shared/functions/getURL";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "store/reducers/Reducer";
import { openMessageBox, sentMessage } from "store/actions/MessageActions";
import { getMessageBox } from "store/selectors/user";
import "./MessageBox.css";
import { setSelectedUser } from "../../../../store/actions/SelectedUser";
import { useHistory } from "react-router-dom";
import { socket } from "components/Login/Auth";

export const MessageBox = () => {
  const dispatch = useDispatch();
  const history = useHistory();

  const userSelector = useSelector((state: RootState) => state.user);
  const usersInfo = useSelector((state: RootState) => state.usersInfoList);
  const messageBoxInfo = useSelector(getMessageBox);
  const { isOpenMessageBox, userInfo, isSendMessage, message } = messageBoxInfo;

  const [users, setUsers] = useState<any[]>([]);
  const [chats, setChats] = useState<any[]>([]);
  const [showHomeChat, setShowHomeChat] = useState<number>(0);
  const [chatsUsers, setChatsUsers] = useState<any>({});
  const [chat, setChat] = useState<any>({});
  const [messages, setMessages] = useState<any[]>([]);
  const [loadingMessages, setLoadingMessages] = useState<boolean>(false);
  const [pageIndex, setPageIndex] = useState<number>(0);
  const [hasMore, setHasMore] = useState<boolean>(true);

  let pathName = window.location.href;

  useEffect(() => {
    if (
      !(
        pathName.split("/")[5] === userSelector.urlSlug ||
        pathName.split("/")[5] === userSelector.id ||
        pathName.split("/")[5] === userSelector.firstName
      )
    ) {
      history.push(`/privi-social/${userSelector.id}`);
      dispatch(setSelectedUser(userSelector.id));
    }
  }, [userSelector]);

  useEffect(() => {
    if (chat && chat.room && socket) {
      socket.on("message", message => {
        setMessages(msgs => {
          let msgsArray = [...msgs];
          msgsArray.push(message);
          return msgsArray;
        });

        /*if (endMessage && endMessage.current) {
          endMessage.current.scrollIntoView();
        }*/

        let chatObj = {
          room: chat.room,
          userId: userSelector.id,
          lastView: Date.now(),
        };

        axios
          .post(`${URL()}/chat/lastView`, chatObj)
          .then(response => {
            if (response.data.success) {
              let id;
              if (chatsUsers["userTo"].userId === userSelector.id) {
                id = chatsUsers["userTo"].userId;
              } else if (chatsUsers["userFrom"].userId === userSelector.id) {
                id = chatsUsers["userFrom"].userId;
              }

              socket.emit("numberMessages", id);
            }
          })
          .catch(error => {
            console.log(error);
          });
      });
    }
  }, [chat, socket]);

  useEffect(() => {
    //this opens message box when navigating to /privi-social/:id/messages
    if (!isOpenMessageBox) {
      if (!message && userInfo) {
        let user = usersInfo[usersInfo.findIndex(user => user.id === userInfo.id)];
        dispatch(openMessageBox(user));
      }
    }
  }, [usersInfo]);

  useEffect(() => {
    //this loads the chat when opening the messagebox through the header menu
    if (Object.keys(chat).length <= 0 || messages.length <= 0) {
      if (chats && chats.length > 0 && userInfo) {
        let openedChat = chats.find(chat => chat.users.userTo.userId === userInfo.id);
        beforeCreateChat(openedChat);
      }
    }
  }, [chats]);

  useEffect(() => {
    setPageIndex(messages.length);
  }, [messages]);

  useEffect(() => {
    if (isSendMessage === true) {
      let users = {
        userFrom: {
          userId: userSelector.id,
          userName: userSelector.firstName,
          userFoto: userSelector.anon
            ? userSelector.anonAvatar && userSelector.anonAvatar.length > 0
              ? `${require(`assets/anonAvatars/${userSelector.anonAvatar}`)}`
              : `${require(`assets/anonAvatars/ToyFaces_Colored_BG_111.jpg`)}`
            : userSelector.hasPhoto
            ? `${URL()}/user/getPhoto/${userSelector.id}`
            : "",
          userConnected: true,
          lastView: new Date(),
        },
        userTo: {
          userId: userInfo.id,
          userName: userInfo.name,
          userFoto: userInfo.anon
            ? userInfo.imageURL && userInfo.imageURL.length > 0
              ? `url(${userInfo.imageUrl})`
              : `${require(`assets/anonAvatars/ToyFaces_Colored_BG_111.jpg`)}`
            : userInfo.imageURL
            ? `${URL()}/user/getPhoto/${userInfo.id}`
            : "",
          userConnected: false,
          lastView: null,
        },
      };
      const newChats = [...chats];
      newChats.push({ users, lastMessage: message });
      setChats(newChats);
      dispatch(sentMessage());
    }
  }, [isSendMessage]);

  const beforeCreateChat = (chat: any) => {
    let differentUser: string = "";
    if (
      chat &&
      chat.users &&
      chat.users.userFrom &&
      chat.users.userFrom.userId &&
      chat.users.userFrom.userId !== userSelector.id
    ) {
      differentUser = chat.users.userFrom.userId;
    } else if (
      chat &&
      chat.users &&
      chat.users.userTo &&
      chat.users.userTo.userId &&
      chat.users.userTo.userId !== userSelector.id
    ) {
      differentUser = chat.users.userTo.userId;
    }
    console.log(
      "differentUser",
      differentUser,
      usersInfo.find(user => user.id === differentUser)
    );
    let differentUserInfo = usersInfo.find(user => user.id === differentUser);
    if (differentUserInfo) {
      createChat(differentUserInfo);
    }
  };

  const createChat = (user: any) => {
    console.log("user", user);
    let users: any = {
      userFrom: {
        userId: userSelector.id,
        userName: userSelector.firstName,
        userFoto: userSelector.anon
          ? userSelector.anonAvatar && userSelector.anonAvatar.length > 0
            ? `${require(`assets/anonAvatars/${userSelector.anonAvatar}`)}`
            : `${require(`assets/anonAvatars/ToyFaces_Colored_BG_111.jpg`)}`
          : userSelector.hasPhoto
          ? `${URL()}/user/getPhoto/${userSelector.id}`
          : "",
        userConnected: true,
        lastView: new Date(),
      },
      userTo: {
        userId: user.id,
        userName: user.name,
        userFoto: user.anon
          ? user.anonAvatar && user.anonAvatar.length > 0
            ? `${require(`assets/anonAvatars/${user.anonAvatar}`)}`
            : `${require(`assets/anonAvatars/ToyFaces_Colored_BG_111.jpg`)}`
          : user.hasPhoto
          ? `${URL()}/user/getPhoto/${user.id}`
          : "",
        userConnected: false,
        lastView: null,
      },
    };

    console.log("chatusers", users, user);
    setChatsUsers(users);
    axios
      .post(`${URL()}/chat/newChat`, { users: users })
      .then(async response => {
        if (response.data.success) {
          setChat(response.data.data);
          setShowHomeChat(1);
          setMessages([]);
          await getMessages(response.data.data, true);
          socket.emit("subscribe", users);
        }
      })
      .catch(error => {
        console.log(error);
      });
  };

  const getMessages = (chatInfo?: any, isNew?: boolean): Promise<number> => {
    return new Promise((resolve, reject) => {
      if (!isNew && (loadingMessages || !hasMore)) {
        resolve(0);
        return;
      }
      setLoadingMessages(true);
      axios
        .post(`${URL()}/chat/getMessages`, {
          room: chatInfo ? chatInfo.room : chat.room,
          pageIndex: isNew ? 0 : pageIndex,
        })
        .then(response => {
          if (response.data.success) {
            if (isNew) setMessages(response.data.data);
            else setMessages([...response.data.data, ...messages]);
            setHasMore(response.data.hasMore);
            setLoadingMessages(false);
            resolve(response.data.data.length);
          }
        })
        .catch(error => {
          setLoadingMessages(false);
          reject(error);
          console.log(error);
        });
    });
  };

  return (
    <div className="message-box">
      <div className="message-list">
        <MessageList
          createChat={cht => {
            console.log("createChat", cht);
            beforeCreateChat(cht);
          }}
          setChats={setChats}
        />
      </div>
      <div className="message-content">
        <MessageContent
          chat={chat}
          specialWidthInput={true}
          chatsUsers={chatsUsers}
          messages={messages}
          setMessages={msgs => setMessages(msgs)}
          getMessages={getMessages}
          loadingMessages={loadingMessages}
        />
      </div>
      <div className="message-profile">
        <MessageProfile />
      </div>
    </div>
  );
};