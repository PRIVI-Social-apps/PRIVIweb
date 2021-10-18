import React, { useState, useEffect } from "react";
import axios from "axios";

import { Box } from "@material-ui/core";

import Cards from "components/PriviSocial/components/Cards";
import { GreenTitle } from "components/PriviSocial/index.styles";
import { LoadingWrapper } from "shared/ui-kit/Hocs";
import URL from "shared/functions/getURL";
import { claimableProfileStyles } from './index.styles';

export default function ClaimableProfiles() {
  const classes = claimableProfileStyles();
  const scrollRef = React.useRef<any>();

  const [claimableProfiles, setClaimableProfiles] = useState<any[]>([]);
  const [claimableProfilesLoading, setClaimableProfilesLoading] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(false);
  const [isLastUser, setIsLastUser] = useState(true);
  const [lastId, setLastId] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = (lstId = lastId, isLast = isLastUser) => {
    setClaimableProfilesLoading(true);
    axios
      .post(`${URL()}/chat/getAllArtists`, {
        userName: "",
        lastId: lstId,
        isLastUser: isLast,
      })
      .then(response => {
        if (response.data.success) {
          const allUsers = response.data.data.users;
          setClaimableProfiles([...claimableProfiles, ...allUsers]);

          setHasMore(response.data.data.hasMore);
          setIsLastUser(response.data.data.isLastUser);
          setLastId(response.data.data.lastId);
        }
      })
      .catch(e => console.log(e))
      .finally(() => setClaimableProfilesLoading(false));
  };

  const handleScroll = React.useCallback(
    async e => {
      if (scrollRef.current) {
        const bottom = scrollRef.current.scrollHeight - scrollRef.current.scrollTop <= scrollRef.current.clientHeight + 100;
        if (bottom && hasMore && !claimableProfilesLoading) {
          loadData();
        }
      }
    }, [loadData]
  );

  return (
    <div onScroll={handleScroll} ref={scrollRef} className={classes.content}>
      <Box mb={3}>
        <GreenTitle className={classes.headerTitle}>CLAIMABLE PROFILES</GreenTitle>
      </Box>
      {
        claimableProfiles && claimableProfiles.length > 0 ? (
          <Cards cardType="Claimable Profile" cards={claimableProfiles} />
        ) : !claimableProfilesLoading && !hasMore ? (
          <Box display='flex' justifyContent='center'>No users</Box>
        ) : (
          <></>
        )
      }
      <LoadingWrapper theme="green" loading={claimableProfilesLoading || hasMore} />
    </div>
  );
}
