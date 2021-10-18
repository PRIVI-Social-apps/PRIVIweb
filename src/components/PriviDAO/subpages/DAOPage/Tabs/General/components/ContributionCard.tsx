import React, { useEffect, useState } from "react";
import axios from "axios";

import { createStyles, makeStyles, Theme } from "@material-ui/core";

import PostCommentModal from "../modals/Post-Comment";
import { MessageIcon } from "../../../index.styles";
import URL from "shared/functions/getURL";
import { Color, StyledDivider } from "shared/ui-kit";
import Box from 'shared/ui-kit/Box';
import { Avatar } from "shared/ui-kit";


const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    contributionCard: {
      background: "rgba(255, 255, 255, 0.12)",
      boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.12)",
      display: "flex",
      flexDirection: "column",
      width: "100%",
      cursor: "pointer",
      padding: "24px",
    },
    userImage: {
      width: "48px",
      height: "48px",
      borderRadius: "50%",
      marginRight: "8px",
      backgroundColor: "#00bfff",
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
                newUser.imageURL = `${data.url}}`;
              }
            } else if (data.anonAvatar && data.anonAvatar.length > 0) {
              newUser.imageURL = require(`assets/anonAvatars/${data.anonAvatar}`);
            }

            if (data.myNFTPods) {
              const length = data.myNFTPods.length;
              const pod = data.myNFTPods[Math.floor(Math.random() * length)];
              if (pod && pod.HasPhoto && pod.HasPhoto === true) {
                setBackgroundImage(`${pod.Url}`);
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
      <Box color="white" fontSize="18px" className={classes.contributionCard} onClick={handleOpenModal}>
        <Box display="flex" alignItems="center">
          <div
            className={classes.userImage}
            style={{
              backgroundImage: user.imageURL && user.imageURL.length > 0 ? `url(${user.imageURL})` : "none",
              backgroundRepeat: "no-repeat",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
          < Box fontFamily="Agrandir GrandLight">{user.name}</Box>
        </Box>

        <Box component="p" mb={2} mt={2}>
          Thanks a lot <b>{user.name}</b> for this contribution of{" "}
          <b>
            {props.item?.token} {props.item.amount || 0}
          </b>
        </Box>

        <Box width="100%">
          <StyledDivider color={Color.White} type="solid" />
        </Box>

        <Box display="flex" flexDirection="row" px={2} mt={2}>
          <Box mr={"20px"}>
            <MessageIcon />
          </Box>
          <Box fontSize="15px">{props.item.comments?.length || 0} Responses</Box>
        </Box>
      </Box>
      {
        openModal && (
          <PostCommentModal
            open={openModal}
            onClose={handleCloseModal}
            backgroundImage={backgroundImage}
            community={props.community}
            user={user}
            contribution={props.item}
            updateCommunity={props.updateCommunity}
          />
        )
      }
    </>
  );
};

export default ContributionCard;
