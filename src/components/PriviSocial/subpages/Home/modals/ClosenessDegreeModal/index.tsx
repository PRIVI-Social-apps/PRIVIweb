import React, { useState, useEffect } from "react";

import { GreenSlider } from "components/PriviSocial/subpages/Feed";
import { getRandomAvatarForUserIdWithMemoization } from "shared/services/user/getUserAvatar";
import { useUserConnections } from "shared/contexts/UserConnectionsContext";
import { Avatar, Modal, PrimaryButton, SecondaryButton } from "shared/ui-kit";
import Box from "shared/ui-kit/Box";
import AlertMessage from "shared/ui-kit/Alert/AlertMessage";
import { useClosenessDegreeModalStyles } from "./index.styles";

export default function ClosenessDegreeModal({ open, handleClose, user, header, refreshFollowers, refreshFollowings }) {
  const classes = useClosenessDegreeModalStyles();
  const userConnections = useUserConnections();

  const [status, setStatus] = useState<any>("");
  const [newClosenessDegree, setNewClosenessDegree] = useState<number>(0);

  useEffect(() => {
    if (user?.closenessDegree !== 0) {
      setNewClosenessDegree(user?.closenessDegree);
    }
  }, [user?.closenessDegree])

  const handleApplyCloseness = async () => {
    try {
      await userConnections.applyClosenessDegree(user.id, header, newClosenessDegree);

      setStatus({
        msg: "Apply closeness success",
        key: Math.random(),
        variant: "success",
      });

      if (header === "Followers") {
        refreshFollowers();
      } else if (header === "Followings") {
        refreshFollowings();
      }
      handleClose();
    } catch (err) {
      setStatus({
        msg: "Apply closeness failed",
        key: Math.random(),
        variant: "error",
      });
    }
  };

  return (
    <Modal isOpen={open} onClose={handleClose} size="medium" showCloseIcon className={classes.root}>
      <h3>Degrees of closeness</h3>

      <Box display="flex" alignItems="center" mb="25px">
        <Avatar
          url={
            user?.userImageURL && user?.userImageURL.length > 0
              ? user?.userImageURL
              : user?.url && user?.url.length > 0
              ? user?.url
              : getRandomAvatarForUserIdWithMemoization(user?.id)
          }
          size="small"
        />
        <Box ml="14px">
          <Box fontSize="16px">{user?.name ?? user?.firstname ?? "User name"}</Box>
          <Box mt="4px" className={classes.urlSlug}>
            @{user?.urlSlug ?? "Username"}
          </Box>
        </Box>
      </Box>

      <GreenSlider
        min={0}
        marks
        step={0.1}
        max={3}
        value={newClosenessDegree}
        onChange={(event: any, newValue: number | number[]) => {
          setNewClosenessDegree(newValue as number);
        }}
        className={classes.slider}
        valueLabelDisplay="auto"
      />
      <Box display="flex" justifyContent="space-between" color="#707582" mt={"6px"} fontSize="11px">
        <Box>0</Box>
        <Box>3.0</Box>
      </Box>

      <Box mt={"32px"} display="flex" justifyContent="space-between" width="100%">
        <SecondaryButton size="medium" onClick={handleClose}>
          Cancel
        </SecondaryButton>
        <PrimaryButton size="medium" onClick={handleApplyCloseness}>
          Apply
        </PrimaryButton>
      </Box>
      {status ? <AlertMessage key={status.key} message={status.msg} variant={status.variant} /> : ""}
    </Modal>
  );
}
