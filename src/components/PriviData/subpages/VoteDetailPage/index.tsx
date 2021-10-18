import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";

import Grid from '@material-ui/core/Grid';

import Box from 'shared/ui-kit/Box';
import { Avatar } from "shared/ui-kit";
import InputWithLabelAndTooltip from "shared/ui-kit/InputWithLabelAndTooltip";
import { ReactComponent as ReplyIcon } from "assets/icons/reply_one.svg";
import { ArrowIcon, ShareIcon, RectangleCheckedIcon, RectangleUncheckedIcon } from '../../components/Icons/SvgIcons';
import DiscussionHistoryCard from '../../components/Cards/DiscussionHistoryCard'
import { voteDetailSubPageStyles } from './index.styles';

// mock data
const mockData = [
  {
    name: "Kilian Schönberger",
    avatar: "assets/anonAvatars/ToyFaces_Colored_BG_001.jpg",
    content: "The supercycle thesis is the bold but vague idea that crypto is on the verge of mass adoption. Here's how it works and what it means.The supercycle thesis is the bold but vague idea that crypto is on the verge of mass adoption. Here's how it works and what it means.",
    replyDate: new Date(),
  },
  {
    name: "Kilian Schönberger",
    avatar: "assets/anonAvatars/ToyFaces_Colored_BG_001.jpg",
    content: "The supercycle thesis is the bold but vague idea that crypto is on the verge of mass adoption. Here's how it works and what it means.The supercycle thesis is the bold but vague idea that crypto is on the verge of mass adoption. Here's how it works and what it means.",
    replyDate: new Date(),
  }
];

export default function VoteDetailPage() {
  const classes = voteDetailSubPageStyles();
  const history = useHistory();

  const [replyList, setReplyList] = useState<any[]>(mockData);
  const [respondToVote, setRespondToVote] = useState("");

  return (
    <div className={classes.content}>
      <div className={classes.gradient}></div>
      <div className={classes.headerTitle}>
        <Box
          display="flex"
          flexDirection="row"
          alignItems="center"
          style={{ cursor: "pointer" }}
          onClick={() => history.goBack()}
        >
          <Box color="#AFACD7">
            <ArrowIcon />
          </Box>
          <Box color="#AFACD7" fontSize={14} fontWeight={700} fontFamily="Agrandir" ml="5px" mb="4px">
            BACK
          </Box>
        </Box>
        <div className={classes.shareSection}>
          <ShareIcon />
        </div>
      </div>
      <div className={classes.mainContent}>
        <div className={classes.mainContentHeader}>
          <Box fontSize={22} fontWeight={600} color="#E0DFF0">One of the obvious benefits of buying art is it lets you financially support.</Box>
          <Box fontSize={16} fontWeight={500} color="#ffffff" mt={2} mb={2}>At a very high level, most NFTs are part of the Ethereum blockchain. Ethereum is a cryptocurrency? At a very high level, most NFTs are part of the Ethereum blockchain. Ethereum is a cryptocurrency?</Box>
          <Box className={classes.nameSection}>
            <Box className={classes.avatarBox}>
              <Avatar size="small" url={require("assets/anonAvatars/ToyFaces_Colored_BG_001.jpg")} />
              <Box className={classes.online} />
            </Box>
            <Box ml={2}>
              <Box className={classes.name}>Julia Sariy</Box>
            </Box>
          </Box>
        </div>
        <div className={classes.mainContentQuestion}>
          <Grid container xs={12} md={12}>
            <Grid item xs={12} md={5}>
              <Box fontSize={16} fontWeight={600} color='#D188FF'>Voting Question</Box>
              <Box fontSize={18} fontWeight={600} color='#ffffff'>At a very high level, most NFTs are part of the Ethereum blockchain. Ethereum is a cryptocurrency?</Box>
            </Grid>
            <Grid item xs={12} md={7} className={classes.voteQuestionSection}>
              <div className={classes.selectedVoteQuestion}>
                <RectangleCheckedIcon />
                <Box fontSize={14} fontWeight={600} color="#ffffff" ml={2}>A lot!</Box>
              </div>
              <div className={classes.voteQuestion}>
                <RectangleUncheckedIcon />
                <Box fontSize={14} fontWeight={600} color="#ffffff" ml={2}>Not Much</Box>
              </div>
              <div className={classes.voteQuestion}>
                <RectangleUncheckedIcon />
                <Box fontSize={14} fontWeight={600} color="#ffffff" ml={2}>Not Sure</Box>
              </div>
              <div className={classes.voteBtn}>
                <Box fontSize={14} fontWeight={600} color="#ffffff">Vote</Box>
              </div>
              <Box fontSize={12} fontWeight={500} color="#ffffff" textAlign='center' mt={2}>38 Votes</Box>
            </Grid>
          </Grid>
        </div>
        <div className={classes.mainContentReplySection}>
          <Box display='flex' alignItems='center' mb={4} >
            <ReplyIcon />
            <Box fontSize={12} fontWeight={500} color="#E0DFF0" ml={1}>{replyList.length || 0} Replies</Box>
          </Box>
          {
            replyList.map(item => (
              <DiscussionHistoryCard item={item} />
            ))
          }
          <Box fontSize={14} fontWeight={600} color="#ffffff" mt="90px" mb="10px">
            Respond to vote
          </Box>
          <Grid container>
            <Grid item xs={12} md={8}>
            <InputWithLabelAndTooltip
              placeHolder="Your response"
              type="text"
              inputValue={respondToVote}
              onInputValueChange={e => setRespondToVote(e.target.value)}
              theme="dark"
              style={{
                height: 45,
                marginTop: 0,
                background: 'rgba(38, 37, 75, 0.7)',
                border: '1px solid rgba(78, 76, 132, 0.8)',
                borderRadius: 47,

              }}
            />
            </Grid>
            <Grid item xs={12} md={4} className={classes.sendBtnSection}>
              <div className={classes.sendBtn}>
                <Box fontSize={16} fontWeight={700} color="#ffffff">Send</Box>
              </div>
            </Grid>
          </Grid>
        </div>
      </div>
    </div>
  );
}
