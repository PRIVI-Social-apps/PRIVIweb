import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import styles from "./ThreadCard.module.css";
import ThreadModal from "../modals/ThreadModal";
import { RootState } from "store/reducers/Reducer";
import { Color, StyledDivider } from "shared/ui-kit";
import { MessageIcon } from "../../../index.styles";
import Box from "shared/ui-kit/Box";

export default function ThreadCard(props) {
  const users = useSelector((state: RootState) => state.usersInfoList);

  const [openThreadModal, setOpenThreadModal] = useState<boolean>(false);
  const [creatorName, setCreatorName] = useState<string>("");
  const [createdByPhoto, setCreatedByPhoto] = useState<string>("");
  const [responseCount, setResponseCount] = useState<number>(props.thread?.responses?.length || 0);

  const handleOpenThreadModal = () => {
    setOpenThreadModal(true);
  };

  const handleCloseThreadModal = () => {
    setOpenThreadModal(false);
  };

  useEffect(() => {
    let user: any = users.find(usr => usr.id === props.thread.createdBy);
    setCreatedByPhoto(user.url);
    setCreatorName(user.name);
  }, [props.thread]);

  return (
    <>
      <div className={styles.threadCard} onClick={handleOpenThreadModal}>
        <Box display="flex" mb={2}>
          <div
            className={styles.avatar}
            style={{
              backgroundImage: `url(${createdByPhoto})`,
            }}
          />
          <Box fontFamily="Agrandir GrandLight">{creatorName}</Box>
        </Box>

        <Box component="p" mb={2}>
          {props.thread.textShort}
        </Box>

        <Box width="100%">
          <StyledDivider color={Color.White} type="solid" />
        </Box>

        <Box display="flex" flexDirection="row" mt={2}>
          <Box mr={2}>
            <MessageIcon />
          </Box>
          <Box fontSize="14px">{responseCount} Responses</Box>
        </Box>
      </div>
      {openThreadModal && (
        <ThreadModal
          open={openThreadModal}
          onClose={handleCloseThreadModal}
          thread={props.thread}
          postResponsed={count => setResponseCount(count)}
        />
      )}
    </>
  );
}
