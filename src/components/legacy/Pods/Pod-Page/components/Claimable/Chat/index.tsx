import React, { useEffect, useState } from "react";
import axios from "axios";

import { makeStyles } from "@material-ui/core";
import { createStyles } from "@material-ui/styles";
import { Gradient } from "shared/ui-kit";
import { RootState } from "store/reducers/Reducer";
import { useSelector } from "react-redux";
import DistributionProposalModal from "components/legacy/Pods/Pod-Page/modals/claimable/DistributionProposal";
import MessageWidget from "shared/ui-kit/Chat/MessageWidget";
import URL from "shared/functions/getURL";
import Box from 'shared/ui-kit/Box';
import {socket} from "../../../../../../Login/Auth";

const useStyles = makeStyles(() =>
  createStyles({
    chatContent: {
      width: "100%",
      display: "flex",
      justifyContent: "space-between",
      "& > div": {
        width: "100%",
      },
    },

    artistsColumn: {
      display: "flex",
      flexDirection: "column",
      width: "calc(100% / 3) !important",
      borderLeft: "1px solid #181818",
      paddingLeft: "31px",
    },
    artistsList: {
      display: "flex",
      flexDirection: "column",
      width: "100%",
      overflowY: "auto",
      height: "calc(616px - 218px)",
      marginBottom: "26px",
      marginTop: "40px",
    },
    artistTile: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      width: "100%",
      borderBottom: "1px dashed #1717174d",
      padding: "16px 0px",
      "&:last-child": {
        borderBottom: "none",
      },
    },
    artistImage: {
      border: "2px solid #FFFFFF",
      marginRight: "14px",
      width: "48px",
      height: "48px",
      minWidth: "48px",
      borderRadius: "24px",
      backgroundRepeat: "no-repeat",
      backgroundSize: "cover",
      backgroundPosition: "center",
    },
    artistName: {
      fontSize: "14px",
      fontWeight: "bold",
      color: "#181818",
      display: "flex",
    },
    artistSlug: {
      background: Gradient.Magenta,
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
    },
    proposals: {
      marginRight: "11px",
      fontSize: "18px",
      color: "#181818",
    },

    create: {
      height: "160px",
      width: "100%",
      cursor: "pointer",
      background: "#F7F9FE",
      border: "1px dashed #727F9A",
      boxSizing: "border-box",
      borderRadius: "10px",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      fontStyle: "normal",
      fontWeight: "normal",
      fontSize: "18px",
      textAlign: "center",
      color: "#727F9A",
      "& img": {
        marginBottom: "24px",
      },
      "& span": {
        marginTop: "24px",
        fontSize: "14px",
        background: Gradient.Mint,
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
      },
    },
  })
);

export const mockArtists = [
  { id: "Px04354c7d-7c9f-4786-8e86-81e5add758ab", proposer: true, percent: 0.2, claimStatus: "VERIFIED" },
  { id: "Px05ea9c6a-1732-4168-8c4e-c7ebe5048e76", percent: 0.2, claimStatus: "Pending" },
  { id: "Px0ca8bb6a-c19f-4f77-a058-ace13c772adb", percent: 0.2, claimStatus: "pending" },
  { id: "Px0cb43345-43f0-4070-972d-a24f55fed269", percent: 0.2, claimStatus: "verified" },
  { id: "Px0ebd5b2c-3110-4bf2-b670-1e1037a66905", percent: 0.2, claimStatus: "verified" },
];

export default function ClaimableChat({ pod, trigger, refreshPod }) {
  const usersList = useSelector((state: RootState) => state.usersInfoList);
  const userSelector = useSelector((state: RootState) => state.user);

  const classes = useStyles();

  const [artists, setArtists] = useState<any[]>([]);

  const [loaderData, setLoaderData] = useState<boolean>(false);

  const [chat, setChat] = useState<any>({});
  const [messages, setMessages] = useState<any[]>([]);
  const [loadingMessages, setLoadingMessages] = useState<boolean>(false);
  const [pageIndex, setPageIndex] = useState<number>(0);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [infoShown, setInfoShown] = useState<boolean>(false);

  const [openDistributionProposalsModal, setOpenDistributionProposalsModal] = useState<boolean>(false);
  const handleOpenDistributionProposalsModal = () => {
    setOpenDistributionProposalsModal(true);
  };
  const handleCloseDistributionProposalsModal = () => {
    setOpenDistributionProposalsModal(false);
  };

  useEffect(() => {
    createChat();
  }, []);

  useEffect(() => {
    loadData();
  }, [usersList]);

  const loadData = () => {
    //TODO: load data
    //this will be called when updating artists from modal

    if (usersList && usersList.length > 0) {
      setLoaderData(true);

      const a = [...artists];
      a.forEach((art, index) => {
        let thisUser = usersList.find(u => u.id === art.id);
        if (thisUser) {
          a[index].name = thisUser.name;
          a[index].urlSlug = thisUser.urlSlug;
          a[index].imageURL = thisUser.imageURL;
        }
        a[index].randomAvatar = require(`assets/anonAvatars/ToyFaces_Colored_BG_${Math.floor(
          Math.random() * 118 + 1
        )
          .toString()
          .padStart(3, "0")}.jpg`);
      });

      setArtists(a);
    }
  };

  const createChat = () => {
    let body = {
      userId: userSelector.id,
      userName: userSelector.firstName,
      claimableSongsId: pod.id
    };

    axios
      .post(`${URL()}/claimableSongs/chat/createChat`, body)
      .then(async (response) => {
        if (response.data.success) {
          setChat(response.data.data);
          let msgs = await getMessages(response.data.data);

          socket.emit("subscribe-claimablePods", {
            chatId: pod.id
          });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }

  const getMessages = (chatInfo?: any, isNew?: boolean): Promise<number> => {
    return new Promise((resolve, reject) => {
      if (!isNew && (loadingMessages || !hasMore)) {
        resolve(0);
        return;
      }
      setLoadingMessages(true);
      axios
        .post(`${URL()}/claimableSongs/chat/getMessages`, {
          chatId: chatInfo ? chatInfo.chat.id : chat.chat.id,
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
    <div className={classes.chatContent}>
      <div style={{paddingRight: '30px'}}>
        <MessageWidget typeChat={"ClaimableSongs"}
                       media={{}}
                       chat={chat}
                       messages={messages}
                       setMessages={msgs => setMessages(msgs)}
                       getMessages={getMessages}
                       loadingMessages={loadingMessages} />
      </div>

      <div className={classes.artistsColumn}>
        <Box display="flex" width="100%" justifyContent="space-between" color={"#707582"} fontSize={"14px"}>
          <div>Artist</div>
          <div>Proposals</div>
        </Box>
        <div className={classes.artistsList}>
          {artists.length > 0 &&
            artists.map((artist, index) => (
              <div className={classes.artistTile} key={`artist-${index}`}>
                <Box display="flex" alignItems="center" marginRight={"15px"}>
                  <div
                    className={classes.artistImage}
                    style={{
                      backgroundImage:
                        artist.imageURL && artist.imageURL.length > 0
                          ? `url(${artist.imageURL})`
                          : artist.randomAvatar
                          ? `url(${artist.randomAvatar})`
                          : "none",
                    }}
                  />
                  <Box display="flex" flexDirection="column">
                    <div className={classes.artistName}>{artist.name ?? "Artist Name"}</div>
                    <div className={classes.artistSlug}>@{artist.slug ?? "Artist Name"}</div>
                  </Box>
                </Box>
                <div className={classes.proposals}>{artist.proposals ?? 0}</div>
              </div>
            ))}
        </div>
        <div className={classes.create} onClick={handleOpenDistributionProposalsModal}>
          <img src={require("assets/icons/crown.png")} alt="crown" />
          Create New Distribution Proposal
          <span>Let's get Started</span>
        </div>
        <DistributionProposalModal
          open={openDistributionProposalsModal}
          handleClose={handleCloseDistributionProposalsModal}
          artists={artists}
          pod={pod}
          handleUpdate={loadData}
        />
      </div>
    </div>
  );
}
