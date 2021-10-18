import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "store/reducers/Reducer";
import { makeStyles, CircularProgress } from "@material-ui/core";
import URL from "shared/functions/getURL";
import { Gradient, PrimaryButton } from "shared/ui-kit";
import cls from "classnames";
import Moment from "react-moment";
import MessageWidget from "shared/ui-kit/Chat/MessageWidget";
import Axios from "axios";
import InputWithLabelAndTooltip from "shared/ui-kit/InputWithLabelAndTooltip";
import Box from "shared/ui-kit/Box";

const useStyles = makeStyles(theme => ({
  container: {
    display: "flex",
    width: "100%",
  },
  loaderDiv: {
    width: "100%",
    display: "flex",
    alignItems: "center",
    alignContent: "center",
    justifyContent: "center",
  },
  offersBox: {
    display: "flex",
    flexDirection: "column",
    width: "245px",
    minWidth: "245px",
    padding: "0px 2px",
    overflowY: "auto",
    height: "600px",
  },
  chatBox: {
    padding: "20px 16px 18px",
    width: "100%",
    marginLeft: "13px",
    background: "white",
    boxShadow: "0px 2px 14px rgba(0, 0, 0, 0.08)",
    borderRadius: "14px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    height: "600px",
    "& > div": {
      width: "100%",
      height: "auto",
    },
  },
  cardContainer: {
    padding: theme.spacing(3),
    borderRadius: theme.spacing(2),
    boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.2)",
    marginRight: theme.spacing(2.5),
    marginBottom: theme.spacing(2.5),
    width: "100%",
    height: "fit-content",
    border: "none",
    position: "relative",
  },
  cardSelected: {
    position: "relative",
    padding: theme.spacing(3),
    borderRadius: theme.spacing(2),
    boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.2)",
    marginRight: theme.spacing(2.5),
    marginBottom: theme.spacing(2.5),
    width: "100%",
    height: "fit-content",
    border: "1px solid transparent",
  },
  status: {
    position: "absolute",
    top: 10,
    right: 10,
    color: "transparent",
    WebkitBackgroundClip: "text !important",
    WebkitTextFillColor: "transparent !important",
  },
  avatarBox: {
    display: "flex",
    alignItems: "flex-start",
    borderBottom: "2px solid grey",
    paddingBottom: theme.spacing(2),
  },
  avatar: {
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
    backgroundPosition: "center",
    cursor: "pointer",
    width: theme.spacing(6),
    height: theme.spacing(6),
    border: "2px solid white",
    borderRadius: "100%",
    boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.2)",
  },
  userBox: {
    marginLeft: theme.spacing(2),
  },
  time: {
    width: "60px",
    fontStyle: "normal",
    fontWeight: "normal",
    fontSize: "11px",
    color: "#707582",
  },
  name: {
    fontSize: "18px",
    margin: "0px 5px",
    fontWeight: 400,
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
  message: {
    fontStyle: "normal",
    fontWeight: "normal",
    fontSize: "11px",
    color: "#99A1B3",
  },
  dialog: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
    height: "auto !important",
    "& label": {
      fontStyle: "normal",
      fontWeight: "normal",
      fontSize: "14px",
      color: "#99A1B3",
      marginBottom: "12px",
    },
    "& button": {
      marginBottom: "0px !important",
      width: "fit-content",
    },
    "& input": {
      marginBottom: "18px",
      background: "#F7F9FE",
      border: "1px solid #E0E4F3",
      boxSizing: "border-box",
      color: "#181818",
      padding: "20.5px 18px 16.5px",
      borderRadius: "11.36px",
    },
  },
  dialogBox: {
    marginBottom: "40px",
    padding: "20px",
    background: "#F7F9FE",
    borderRadius: "10px",
  },
}));

export default function RequestAssistanceChatTab({ communityToken, setCommunityToken, isCreator }) {
  const classes = useStyles();
  const usersInfo = useSelector((state: RootState) => state.usersInfoList);

  const [offers, setChats] = useState<any>([]);
  const [chatSelected, setChatSelected] = useState<any>();
  const [messages, setMessages] = useState<any>();
  const [loadingMessages, setLoadingMessages] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(true);

  const [isDataLoading, setIsDataLoading] = useState<boolean>(false);

  useEffect(() => {
    getChats();
  }, [communityToken.CommunityAddress]);

  const getChats = () => {
    setIsDataLoading(true);
    const c = [] as any;
    if (communityToken.Offers && communityToken.Offers.length > 0) {
      communityToken.Offers.filter(item => item.status && item.status.toUpperCase() !== "DECLINED").forEach(
        offer => {
          //TODO: get chat
          c.push({
            ...offer,
            user:
              {
                ...usersInfo.find(u => offer.userId && u.id === offer.userId),
                userFoto: usersInfo.find(u => offer.userId && u.id === offer.userId)?.imageURL ?? "",
              } ?? undefined,
            chat: { lastMessage: "ajshdkjdhjak", lastMessageDate: new Date().getTime() + 20000 },
          });
        }
      );
      setChats(c);
      setIsDataLoading(false);
    }
    setIsDataLoading(false);
  };

  const getMessages = (chatInfo?: any, isNew?: boolean): Promise<number> => {
    return new Promise((resolve, reject) => {
      if (!isNew && (loadingMessages || !hasMore)) {
        resolve(0);
        return;
      }
      setLoadingMessages(true);
      Axios
        //TODO: create backend function
        .post(`${URL()}/communityToken/chat/getMessages`, {
          chatId: chatInfo ? chatInfo.chat.id : chatSelected.chat.id,
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
    <div className={classes.container}>
      <div className={classes.offersBox}>
        {!isDataLoading && isCreator ? (
          offers && offers.length > 0 ? (
            offers.map((item, index) => (
              <NegotiateCard
                isCreator={isCreator}
                item={item}
                key={index}
                chatSelected={chatSelected}
                setChatSelected={setChatSelected}
                getMessages={getMessages}
              />
            ))
          ) : (
            <p>No active offers</p>
          )
        ) : (
          <div className={classes.loaderDiv}>
            <CircularProgress style={{ color: "#27e8d9" }} />
          </div>
        )}
      </div>
      {chatSelected && (
        <div className={classes.chatBox}>
          {chatSelected.status && chatSelected.status.toUpperCase() !== "ACCEPTED" && (
            <OfferDialog isCreator={isCreator} newOffer={chatSelected} />
          )}
          <MessageWidget
            typeChat={"ClaimableSongs"}
            media={{}}
            chat={chatSelected}
            messages={messages}
            setMessages={msgs => setMessages(msgs)}
            getMessages={getMessages}
            loadingMessages={loadingMessages}
          />
        </div>
      )}
    </div>
  );
}

const NegotiateCard = ({ isCreator, item, chatSelected, setChatSelected, getMessages }) => {
  const classes = useStyles();

  const selectChat = async item => {
    setChatSelected(item);
    await getMessages(item);
  };
  return (
    <div
      className={cls(classes.cardContainer, { [classes.cardSelected]: chatSelected === item })}
      onClick={() => selectChat(item)}
      style={{
        borderColor: item.status && item.status.toUpperCase() === "ACCEPTED" ? "#29E8DC" : "#FF79D1",
      }}
    >
      {isCreator && item.status && (
        <span
          className={classes.status}
          style={{
            background:
              item.status && item.status.toUpperCase() === "ACCEPTED" ? Gradient.Mint : Gradient.Magenta,
          }}
        >
          {item.status.toUpperCase()}
        </span>
      )}
      <Box display="flex" alignItems="center" width="100%">
        <Box
          className={classes.avatar}
          style={{
            backgroundImage:
              item.user && item.user.anon === false
                ? `url(${URL()}/user/getPhoto/${item.user.id})`
                : item.user && item.user.anonAvatar && item.user && item.user.anonAvatar.length > 0
                  ? `url(${require(`assets/anonAvatars/${item.user.anonAvatar}`)})`
                  : `url(${require(`assets/anonAvatars/ToyFaces_Colored_BG_111.jpg`)})`,
          }}
        />
        <Box className={classes.userBox}>
          <Box className={classes.time}>
            {item.chat && item.chat.lastMessage && (
              <Moment toNow>{new Date(item.chat.lastMessageDate)}</Moment>
            )}
          </Box>
          <Box className={classes.name}>
            {item.user ? item.user.name ?? item.user.firstName ?? item.user.urlSlug : "User name"}
          </Box>
          <Box className={classes.message}>
            {item.chat && item.chat.lastMessage ? item.chat.lastMessage : ""}
          </Box>
        </Box>
      </Box>
    </div>
  );
};

const OfferDialog = ({ isCreator, newOffer }) => {
  const usersInfo = useSelector((state: RootState) => state.usersInfoList);

  const classes = useStyles();

  const thisUser = usersInfo.find(u => newOffer.userId && u.id === newOffer.userId);
  const [newAmount, setNewAmount] = useState<number>(0);

  const handleAcceptOffer = () => {
    //TODO -> STATUS FROM PENDING TO ACCEPTED
  };
  const handleNegotiateOffer = () => {
    //TODO -> STATUS FROM PENDING TO PENDING NEGOTIATION
  };
  const handleDeclineOffer = () => {
    //TODO -> STATUS FROM PENDING TO DECLINED
  };
  const handleAcceptNegotiation = () => {
    //TODO -> STATUS FROM PENDING NEGOTIATION TO NEGOTIATION
  };
  const handleDeclineNegotiation = () => {
    //TODO -> STATUS FROM PENDING NEGOTIATION TO DECLINED
  };
  const updateOffer = () => {
    //TODO -> add newAmount field
  };

  return (
    <div className={classes.dialog}>
      <div className={classes.dialogBox}>
        {isCreator && newOffer.status && newOffer.status.toUpperCase() === "PENDING" ? (
          <label>{`${thisUser ? thisUser.name : "User"}  just sent you a new offer of ${newOffer.token ?? ""
            } ${newOffer.amount ?? "N/A"}`}</label>
        ) : newOffer.status && newOffer.status.toUpperCase().includes("NEGOTIATION") ? (
          <label>{`${thisUser ? thisUser.name : "User"
            } wants to negotiate the offer. Are you willing to?`}</label>
        ) : null}

        {isCreator && newOffer.status && newOffer.status.toUpperCase() === "PENDING" ? (
          <Box display="flex" alignItems="center" marginTop="12px" justifyContent="space-between">
            <PrimaryButton size="medium" onClick={handleAcceptOffer}>
              Accept
            </PrimaryButton>
            <PrimaryButton size="medium" onClick={handleNegotiateOffer}>
              Negotiate
            </PrimaryButton>
            <PrimaryButton size="medium" onClick={handleDeclineOffer}>
              Decline
            </PrimaryButton>
          </Box>
        ) : newOffer.status && newOffer.status.toUpperCase().includes("NEGOTIATION") ? (
          <Box display="flex" alignItems="center" marginTop="12px">
            <PrimaryButton
              size="medium"
              onClick={handleAcceptNegotiation}
              disabled={newOffer.status && newOffer.status.toUpperCase() === "NEGOTIATION"}
            >
              Accept
            </PrimaryButton>
            <PrimaryButton
              size="medium"
              onClick={handleDeclineNegotiation}
              disabled={newOffer.status && newOffer.status.toUpperCase() === "NEGOTIATION"}
            >
              Decline
            </PrimaryButton>
          </Box>
        ) : null}
      </div>
      {isCreator && newOffer.status && newOffer.status.toUpperCase() === "NEGOTIATION" && (
        <Box display="flex" flexDirection="column">
          <InputWithLabelAndTooltip
            labelName={"Great! Set your new offer below"}
            required
            inputValue={`${newAmount}`}
            minValue="0.001"
            type="number"
            onInputValueChange={e => setNewAmount(Number(e.target.value))}
            disabled={newOffer.newAmount}
          />
          <PrimaryButton size="medium" onClick={updateOffer} disabled={newOffer.newAmount}>
            Send
          </PrimaryButton>
        </Box>
      )}
    </div>
  );
};
