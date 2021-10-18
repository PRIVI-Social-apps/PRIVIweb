import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { HeaderBold4 } from "shared/ui-kit";
import { SearchInputBox } from "shared/ui-kit/SearchInputBox/SearchInputBox";
import { RootState } from "store/reducers/Reducer";
import axios from "axios";
import URL from "shared/functions/getURL";
import { ListItem } from "./ListItem";
import "./MessageList.css";
import { closeMessageBox, openMessageBox, openNewChatModal } from "store/actions/MessageActions";
import { useHistory } from "react-router-dom";

export const MessageList = (props: any) => {
  let pathName = window.location.href;
  let idUrl = pathName.split("/")[5] ? pathName.split("/")[5] : "" + sessionStorage.getItem("userId");

  const dispatch = useDispatch();
  const history = useHistory();

  const userSelector = useSelector((state: RootState) => state.user);
  const usersInfo = useSelector((state: RootState) => state.usersInfoList);
  const [chats, setChats] = useState<any[]>([]);
  const [keyword, setKeyword] = useState<string>("");
  const [currentChat, setCurrentChat] = useState<any>(null);

  useEffect(() => {
    if (usersInfo && usersInfo.length > 0) getChats();
  }, [usersInfo]);

  const handleOpenNewChatModal = () => {
    dispatch(openNewChatModal());
  };

  const getChats = () => {
    axios
      .post(`${URL()}/chat/getChats`, {
        userId: userSelector.id,
      })
      .then(response => {
        if (response.data.success) {
          let cs = [] as any;
          if (usersInfo && usersInfo.length > 0) {
            response.data.data.forEach((chat, index) => {
              cs.push(chat);
              if (usersInfo.some(user => user.id === chat.users.userFrom.userId)) {
                cs[index].users.userFrom.userFoto =
                  usersInfo[usersInfo.findIndex(user => user.id === chat.users.userFrom.userId)].imageURL;
                cs[index].users.userFrom.userName =
                  usersInfo[usersInfo.findIndex(user => user.id === chat.users.userFrom.userId)].name;
              }
              if (usersInfo.some(user => user.id === chat.users.userTo.userId)) {
                cs[index].users.userTo.userFoto =
                  usersInfo[usersInfo.findIndex(user => user.id === chat.users.userTo.userId)].imageURL;
                cs[index].users.userTo.userName =
                  usersInfo[usersInfo.findIndex(user => user.id === chat.users.userTo.userId)].name;
              }
            });
          }
          cs.sort((a, b) => (b.lastMessageDate ?? 0) - (a.lastMessageDate ?? 0));
          setChats(cs);
          if (props.setChats !== undefined) {
            props.setChats(cs);
          }
        }
      })
      .catch(error => {
        console.log(error);
      });
  };

  return (
    <div className="message-list-items">
      <div className="message-list-header">
        {pathName.includes("/messages") ? (
          <img
            src={require("assets/icons/arrow.png")}
            alt={"back"}
            onClick={() => {
              history.push(`/privi-social/${idUrl}`);
              dispatch(closeMessageBox());
            }}
          />
        ) : null}
        <HeaderBold4>Messages</HeaderBold4>
        <img
          src={require("assets/icons/edit_icon.svg")}
          className="edit-icon"
          onClick={handleOpenNewChatModal}
        />
      </div>
      <SearchInputBox keyword={keyword} setKeyword={setKeyword} placeholder={"Search messages"} />
      <div className="item-list">
        {chats &&
          chats
            .filter(chat => {
              if (keyword.length > 0) {
                return chat.users.userTo.userName.toLowerCase().includes(keyword.toLowerCase());
              } else return true;
            })
            .map((chat, i) => (
              <ListItem
                key={i}
                chat={chat}
                setChat={() => props.createChat(chat)}
                currentChat={currentChat}
                setCurrentChat={setCurrentChat}
              />
            ))}
      </div>
    </div>
  );
};
