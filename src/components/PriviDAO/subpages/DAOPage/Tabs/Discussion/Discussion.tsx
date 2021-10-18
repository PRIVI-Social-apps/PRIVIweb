import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";

import CreateThread from "./modals/CreateThread";
import { RootState } from "store/reducers/Reducer";
import ThreadCard from "./components/ThreadCard";

import URL from "shared/functions/getURL";
import { LoadingWrapper } from "shared/ui-kit/Hocs";

import { TitleGrandLight } from "../../index.styles";
import { DAOButton } from "components/PriviDAO/components/DAOButton";
import { MasonryGrid } from "shared/ui-kit/MasonryGrid/MasonryGrid";
import Box from 'shared/ui-kit/Box';

export default function Discussion(props) {
  let users = useSelector((state: RootState) => state.usersInfoList);

  const [threads, setThreads] = useState<any[]>([]);
  const [discussionsLoading, setDiscussionsLoading] = useState<boolean>(false);
  const [openCreatThread, setOpenCreateThread] = useState<boolean>(false);

  useEffect(() => {
    loadDiscussions();
  }, []);

  useEffect(() => {
    loadDiscussions();
  }, [props.trigger]);

  useEffect(() => {
    const t = [...threads];

    if (users && users.length > 0 && t && t.length > 0) {
      t.forEach((thread, index) => {
        if (users.some(user => user.id === thread.creator)) {
          const thisUser = users[users.findIndex(user => user.id === thread.creator)];
          t[index].user = { name: thisUser.name, imageURL: thisUser.imageURL };
        }
      });

      t.sort((a, b) => b.likes.length - b.dislikes.length - (a.likes.length - a.dislikes.length));

      setThreads(t);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [users]);

  const loadDiscussions = () => {
    setDiscussionsLoading(true);

    axios
      .get(`${URL()}/community/discussions/getDiscussions/${props.community.id}`)
      .then(res => {
        const resp = res.data;
        if (resp.success) {
          let data = [...resp.data];
          if (users && users.length > 0) {
            data.forEach((thread, index) => {
              if (users.some(user => user.id === thread.creator)) {
                const thisUser = users[users.findIndex(user => user.id === thread.creator)];
                data[index].user = {
                  name: thisUser.name,
                  imageURL: thisUser.imageURL,
                };
              }
            });

            data.sort((a, b) => b.numLikes - b.numDislikes - (a.numLikes - a.numDislikes));
          }

          setThreads(data);
        } else {
          console.log("Error getting blog posts");
        }
        setDiscussionsLoading(false);
      })
      .catch(() => {
        setDiscussionsLoading(false);
      });
  };

  return (
    <Box width="100%">
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={5}>
        <TitleGrandLight disableUppercase bold fontSize="30px">
          DAO Discusison
        </TitleGrandLight>
        <DAOButton onClick={() => setOpenCreateThread(true)}>Create new Thread</DAOButton>
      </Box>

      <LoadingWrapper theme="dark" loading={discussionsLoading}>
        {threads.length ? (
          <MasonryGrid
            gutter={"24px"}
            data={threads}
            renderItem={(item, index) => <ThreadCard key={`thread-${index}`} thread={item} />}
            columnsCountBreakPoints={{ 300: 1, 750: 2 }}
          />
        ) : (
          <Box>
            <TitleGrandLight fontSize={"14px"}>No threads available</TitleGrandLight>
          </Box>
        )}
      </LoadingWrapper>

      {openCreatThread && (
        <CreateThread
          communityId={props.community.id}
          open={openCreatThread}
          handleClose={() => setOpenCreateThread(false)}
          handleRefresh={loadDiscussions}
        />
      )}
    </Box>
  );
}
