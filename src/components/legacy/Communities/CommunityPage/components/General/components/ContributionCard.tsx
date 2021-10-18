import React, { useEffect, useState } from "react";
import axios from "axios";

import { createStyles, makeStyles, Theme } from "@material-ui/core";

import PostCommentModal from "../modals/PostCommentModal";
import URL from "shared/functions/getURL";
import { Divider, Header6 } from "shared/ui-kit";
import Box from "shared/ui-kit/Box";

const MessageIcon = () => (
  <svg width="22" height="23" viewBox="0 0 22 23" fill="none">
    <path
      d="M21.2335 1.01587H1.04663V16.0635H4.83168V22.3333L11.1401 16.0635H21.2335V1.01587Z"
      stroke="#727F9A"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    contributionCard: {
      display: "flex",
      flexDirection: "column",
      borderRadius: 14,
      width: "100%",
      boxShadow: "0px 2px 12px rgba(0, 0, 0, 0.1)",
      "& h5": {
        color: "#707582",
        marginTop: 3,
      },
      cursor: "pointer",
    },
    imageContainer: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      height: 150,
      borderTopRightRadius: 14,
      borderTopLeftRadius: 14,
      overflow: "hidden",
      background: "black",
      "& img": {
        height: "100%",
      },
    },
    userPhoto: {},
    userImage: {
      width: 40,
      height: 40,
      borderRadius: "50%",
      marginRight: 10,
      boxShadow: "-2px 7px 20px -9px rgb(148 148 148 / 66%)",
      border: "solid #fff 2px",
      marginTop: -20,
      marginLeft: 20,
    },
    messageBody: {
      paddingTop: 16,
      paddingLeft: 16,
      paddingRight: 16,
      fontSize: 14,
    },
  })
);

type UserInfo = {
  name: string;
  id: string;
  imageURL: string;
  urlSlug: string;
  isVerified: boolean;
  level: number;
};

const ContributionCard = (props: any) => {
  const classes = useStyles();
  const [backgroundImage, setBackgroundImage] = useState<string>("");
  const [user, setUser] = useState<UserInfo>({
    name: "",
    id: "",
    imageURL: "",
    urlSlug: "",
    isVerified: false,
    level: 1,
  });
  const [openModal, setOpenModal] = useState(false);

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  useEffect(() => {
    async function fetchData() {
      const userId = props.item.fromUserId;
      await axios
        .get(`${URL()}/user/getBasicInfo/${userId}`)
        .then(response => {
          if (response.data.success) {
            let data = response.data.data;
            const newUser = Object.assign({}, user);
            newUser.name = data.name;
            newUser.id = userId;
            if (data.anon != undefined && data.anon === false) {
              if (data.hasPhoto && data.url) {
                newUser.imageURL = `${data.url}?${Date.now()}`;
              }
            } else if (data.anonAvatar && data.anonAvatar.length > 0) {
              newUser.imageURL = `${`assets/anonAvatars/${data.anonAvatar}`}`;
            }

            if (data.myNFTPods) {
              const length = data.myNFTPods.length;
              const pod = data.myNFTPods[Math.floor(Math.random() * length)];
              if (pod && pod.HasPhoto && pod.HasPhoto === true) {
                setBackgroundImage(`${pod.Url}?${Date.now()}`);
              } else {
                setBackgroundImage(
                  require(`assets/communityImages/${Math.floor(Math.random() * 5 + 1)}.png`)
                );
              }
            }
            newUser.urlSlug = data.urlSlug;
            newUser.isVerified = data.verified;
            newUser.level = data.level;
            setUser(newUser);
          }
        })
        .catch(error => {
          console.log(error);
        });
    }

    if (props.item?.fromUserId) {
      fetchData();
    }
  }, [props.item]);

  return (
    <>
      <div className={classes.contributionCard} onClick={handleOpenModal}>
        <div className={classes.imageContainer}>
          <img src={backgroundImage} alt="" />
        </div>
        <div className={classes.userPhoto}>
          <div
            className={classes.userImage}
            style={{
              backgroundImage: user.imageURL && user.imageURL.length > 0 ? `url(${user.imageURL})` : "none",
              backgroundRepeat: "no-repeat",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
        </div>
        <div className={classes.messageBody}>
          Thanks a lot <b>{user.name}</b> for this contribution of{" "}
          <b>
            {props.item?.token} {props.item.amount || 0}
          </b>
        </div>
        <Divider />
        <Box display="flex" flexDirection="row" px={2} mb={1}>
          <Box mr={2}>
            <MessageIcon />
          </Box>
          <Header6 noMargin>{props.item.comments?.length || 0} Responses</Header6>
        </Box>
      </div>
      {openModal && (
        <PostCommentModal
          open={openModal}
          onClose={handleCloseModal}
          backgroundImage={backgroundImage}
          community={props.community}
          user={user}
          contribution={props.item}
          updateCommunity={props.updateCommunity}
        />
      )}
    </>
  );
};

export default ContributionCard;
