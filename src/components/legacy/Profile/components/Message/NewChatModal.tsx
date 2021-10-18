import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";

import { makeStyles, Avatar } from "@material-ui/core";
import { SearchInputBox } from "shared/ui-kit/SearchInputBox/SearchInputBox";
import { getUsersInfoList } from "store/selectors/user";
import { getUser } from "store/selectors/user";
import { closeNewChatModal, startChat } from "store/actions/MessageActions";

const useStyles = makeStyles({
  container: {
    backgroundColor: "white",
    boxShadow: "0px 2px 12px rgba(0, 0, 0, 0.1)",
    borderRadius: "14px 14px 0px 0px",
    width: 352,
    padding: "23.5px 23.5px 5px 23.5px",
    margin: "0px 8px",
    marginTop: "auto",
    height: "fitContent",
  },
  header: {
    marginBottom: 20,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    cursor: "pointer",
  },
  closeBtn: {
    "& img": {
      cursor: "pointer",
    },
  },
  title: {
    fontSize: 18,
    lineHeight: "104.5%",
    color: "#181818",
  },
  userList: {
    height: 300,
    display: "flex",
    flexDirection: "column",
    overflowY: "scroll",
  },
  userItem: {
    display: "flex",
    marginTop: 15,
    cursor: "pointer",
    "& img": {
      width: 32,
      height: 32,
      borderRadius: "50%",
      marginRight: 10,
    },
  },
  userInfo: {
    display: "flex",
    flexDirection: "column",
    alignItems: "start",
    justifyContent: "center",
    marginLeft: "4px",
  },
  userName: {
    fontSize: 14,
    lineHeight: "104.5%",
    color: "black",
  },
  userSlug: {
    fontSize: 11,
    lineHeight: "104.5%",
    color: "#707582",
  },
  actionButtons: {
    display: "flex",
    alignItems: "center",
    "& img:first-child": {
      marginRight: 24,
      cursor: "pointer",
    },
  },
});

const NewChatModal = () => {
  const classes = useStyles();
  const userSelector = useSelector(getUser);
  const users = useSelector(getUsersInfoList);
  const [keyword, setKeyword] = useState<string>("");
  const [minimize, setMinimize] = useState<boolean>(true);
  const dispatch = useDispatch();

  if (!userSelector) return null;

  const handleClose = () => {
    dispatch(closeNewChatModal());
  };

  const handleClick = user => {
    if (!user) return;
    dispatch(
      startChat({
        chat: {
          users: {
            userFrom: {
              userId: userSelector.id,
              userName: userSelector.firstName + " " + userSelector.lastName,
            },
            userTo: {
              userId: user.id,
              userName: user.name,
            },
          },
          receipientId: user.id,
          userInfo: user,
        },
      })
    );
  };

  const handleMinimize = (e: React.MouseEvent) => {
    e.stopPropagation();
    setMinimize(!minimize);
  };

  return (
    <div className={classes.container}>
      <div className={classes.header} onClick={handleMinimize}>
        <div className={classes.title}>New Message</div>
        <div className={classes.actionButtons}>
          {minimize === true ? (
            <img src={require("assets/icons/minimize.svg")} onClick={handleMinimize} />
          ) : null}
          <img src={require("assets/icons/cross_gray.png")} onClick={handleClose} />
        </div>
      </div>
      {minimize && (
        <>
          <SearchInputBox keyword={keyword} setKeyword={setKeyword} />
          <br />
          <div className={classes.userList}>
            {users &&
              users
                .filter(user => {
                  if (user.id === userSelector.id) return false;
                  if (keyword.length > 0) return user.name.toLowerCase().includes(keyword.toLowerCase());
                  else return true;
                })
                .map((user, index) => {
                  return (
                    <div className={classes.userItem} key={index} onClick={() => handleClick(user)}>
                      <Avatar src={`${user.imageURL}`} alt={user.name} />
                      <div className={classes.userInfo}>
                        <div className={classes.userName}>{user.name}</div>
                        <div className={classes.userSlug}>@{user.urlSlug}</div>
                      </div>
                    </div>
                  );
                })}
          </div>
        </>
      )}
    </div>
  );
};

export default NewChatModal;
