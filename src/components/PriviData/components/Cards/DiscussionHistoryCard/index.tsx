import { Grid } from "@material-ui/core";
import React from "react";
import Moment from "react-moment";

import { Avatar } from "shared/ui-kit";
import Box from "shared/ui-kit/Box";

import { discussionHistoryCardStyles } from "./index.styles";

export default function DiscussionHistoryCard({ item }) {
    const classes = discussionHistoryCardStyles();

    return (
      <div className={classes.content}>
          <Box display='flex' justifyContent='space-between'>
              <div className={classes.flexBox}>
                  <div className={classes.avatarBox}>
                      <Avatar size="small" url={require("assets/anonAvatars/ToyFaces_Colored_BG_001.jpg")} />
                      <div className={classes.online} />
                  </div>
                  <Box ml={2}>
                      <div className={classes.title}>{item.name}</div>
                  </Box>
              </div>
              <Moment format="DD MMM, YYYY" className={classes.replyDate}>
                  {item.replyDate}
              </Moment>
          </Box>
          <Box mt={3} fontSize={14} fontWeight={500} color="#E0DFF0">
              {item.content}
          </Box>
      </div>
    );
}
