import React, { useContext, useState } from "react";
import { useSelector } from "react-redux";
import { RootState, useTypedSelector } from "store/reducers/Reducer";
import { makeStyles } from "@material-ui/core";
import Moment from "react-moment";
import SocialTokenContext from "components/PriviSocial/subpages/SocialToken/context";
import InputWithLabelAndTooltip from "shared/ui-kit/InputWithLabelAndTooltip";
import AlertMessage from "shared/ui-kit/Alert/AlertMessage";

const useStyles = makeStyles(theme => ({
  commentWrapper: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
    marginTop: "28px",
  },

  newComment: {
    display: "flex",
    flexDirection: "column",
  },

  myInfo: {
    display: "flex",
    alignItems: "center",
    flexDirection: "row",
  },

  avatar: {
    marginRight: "16px",
    border: "1.5px solid #fff",
    borderRadius: "16px",
    width: "32px",
    height: "32px",
  },

  myInfoName: {
    color: "#181818",
    fontWeight: 700,
    fontSize: "14px",
    fontFamily: "Agrandir",
  },

  commentInputWrapper: {
    display: "flex",
    marginTop: "18px",
    marginBottom: "6px",
  },

  commentInput: {
    marginRight: "8px",
    flexGrow: 1,
    background: "#f7f9fe",
    border: "1px solid #707582",
    boxSizing: "border-box",
    borderRadius: "12px",
    fontFamily: "Agrandir",
    padding: "0PX 16px",
  },

  btnAddComment: {
    width: "124px",
    minWidth: "124px",
    height: "40px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "white",
    backgroundColor: "#181818",
    borderRadius: "10px",
    cursor: "pointer",
  },

  commentRow: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: "30px",
  },

  commentLeftWrapper: {
    display: "flex",
  },

  commentRowAvatar: {
    marginRight: "16px",
    border: "1.5px solid #fff",
    borderRadius: "16px",
    width: "32px",
    height: "32px",
  },

  commentRowInfo: {
    display: "flex",
    flexDirection: "column",
  },

  commentRowName: {
    fontSize: "14px",
    fontWeight: "bold",
    color: "#181818",
    fontFamily: "Agrandir",
  },

  commentRowComment: {
    marginTop: "8px",
    fontFamily: "Agrandir",
    fontSize: "14px",
    color: "#707582",
  },

  commentDate: {
    display: "flex",
    alignItems: "center",
    fontFamily: "Agrandir",
    fontSize: "14px",
    color: "#707582",
  },
}));

export default function PerkComments() {
  const { selectedPerk, setSelectedPerk } = useContext(SocialTokenContext);
  const usersList = useSelector((state: RootState) => state.usersInfoList);
  const user = useTypedSelector(state => state.user);
  const getUserInfo = id => usersList.find(u => u.id === id);
  const currentUser = getUserInfo(user.id);

  const classes = useStyles();

  const [perkComment, setPerkComment] = useState<string>("");
  const [errorMsg, setErrorMsg] = useState<any>();

  const comments = selectedPerk.Comments;

  const handleCloseError = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setErrorMsg(null);
  };

  const isSignedIn = () => {
    return !!sessionStorage.getItem("token");
  };

  const addComment = () => {
    if (perkComment) {
      const comment = {
        user: {
          id: currentUser?.id,
          name: `${currentUser?.name}`,
        },
        comment: perkComment,
        date: new Date(),
      };

      //TODO: CREATE FUNCTION
      /*axios
          .post(`${URL()}/socialToken/addComment/`, {
            DocId: selectedPerk.id,
            UserId: currentUser?.id,
            Comment: comment,
          })
          .then(async response => {
            let data: any = response.data;
            if (data.success) {
              setSelectedPerk(prev => ({ ...prev, Comments: [...(prev.Comments || []), comment] }));
              setPerkComment("");
            } else {
              setErrorMsg("Error making the request");
            }
          })
          .catch(err => {
            console.log(err);
            setErrorMsg("Error making the request");
          });*/
    }
  };

  const handleKeyDown = e => {
    if (e.key === "Enter") {
      addComment();
    }
  };

  return (
    <div className={classes.commentWrapper}>
      {isSignedIn() && (
        <div className={classes.newComment}>
          <div className={classes.myInfo}>
            <img className={classes.avatar} src={currentUser?.imageURL} alt="Avatar" />
            <div className={classes.myInfoName}>{currentUser?.name}</div>
          </div>
          <div className={classes.commentInputWrapper}>
            <InputWithLabelAndTooltip
              overriedClasses={classes.commentInput}
              type="text"
              inputValue={perkComment}
              placeHolder="Comment..."
              onInputValueChange={event => setPerkComment(event.target.value)}
              onKeyDown={handleKeyDown}
            />
            <div className={classes.btnAddComment} onClick={addComment}>
              Comment
            </div>
          </div>
        </div>
      )}
      {comments?.map((item, index) => {
        const commentUser = getUserInfo(item.user.id);
        return (
          <div key={`comment-${index}`} className={classes.commentRow}>
            <div className={classes.commentLeftWrapper}>
              <img className={classes.commentRowAvatar} src={commentUser?.imageURL} alt="Avatar" />
              <div className={classes.commentRowInfo}>
                <div className={classes.commentRowName}>{commentUser?.name || ""}</div>
                <div className={classes.commentRowComment}>{item.comment}</div>
              </div>
            </div>
            <div className={classes.commentDate}>
              <Moment format={"DD MMM YYYY"}>{item.date}</Moment>
            </div>
          </div>
        );
      })}

      {errorMsg && (
        <AlertMessage
          key={Math.random()}
          message={errorMsg}
          variant="error"
          onClose={handleCloseError}
        />
      )}
    </div>
  );
}
