import React, { useState, useEffect } from "react";

import Box from "shared/ui-kit/Box";
import { Avatar } from "shared/ui-kit";
import { proposalCardStyles } from "./index.styles";
import { TimerIcon } from "../../Icons/SvgIcons";
import { BorderLinearProgress } from "../../LinearProgress";
import { useHistory } from "react-router-dom";
import { useTypedSelector } from "store/reducers/Reducer";
import { getUser, getUsersInfoList } from "store/selectors";

export default function ProposalCard({ item }) {
  const history = useHistory();
  const classes = proposalCardStyles();

  const user = useTypedSelector(getUser);
  const users = useTypedSelector(getUsersInfoList);
  const [endingTime, setEndingTime] = useState<any>();

  const getMyAnswer = () => {
    return item.votes?.find(vote => vote.userAddress === user.id);
  };

  useEffect(() => {
    const timerId = setInterval(() => {
      const now = new Date();
      let delta = Math.floor((item.endDate - now.getTime()) / 1000);
      if (delta < 0) {
        setEndingTime({
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
        });
        clearInterval(timerId);
      } else {
        let days = Math.floor(delta / 86400);
        delta -= days * 86400;

        // calculate (and subtract) whole hours
        let hours = Math.floor(delta / 3600) % 24;
        delta -= hours * 3600;

        // calculate (and subtract) whole minutes
        let minutes = Math.floor(delta / 60) % 60;
        delta -= minutes * 60;

        // what's left is seconds
        let seconds = delta % 60;
        setEndingTime({
          days,
          hours,
          minutes,
          seconds,
        });
      }
    }, 1000);

    return () => clearInterval(timerId);
  }, []);

  return (
    <div className={classes.card} onClick={() => history.push(`/privi-music-dao/governance/proposals/${item.id}`)}>
      <div className={classes.content}>
        <Box color="#2D3047" fontSize={18} fontWeight={600}>
          {item.title}
        </Box>
        <Box className={classes.nameSection}>
          <Box className={classes.avatarBox}>
            <Avatar
              size="small"
              url={
                users.find(user => user.id === item.userAddress)?.imageURL ??
                require("assets/anonAvatars/ToyFaces_Colored_BG_001.jpg")
              }
            />
            {/* <Box className={classes.online} /> */}
          </Box>
          <Box ml={2}>
            <Box className={classes.name}>
              {users.find(user => user.id === item.userAddress)?.name ||
                users.find(user => user.id === item.userAddress)?.urlSlug}
            </Box>
          </Box>
        </Box>
        <Box color="#54658F" fontSize={16} fontWeight={600}>
          He/She has asked а or a vote for
        </Box>
        <Box color="#54658F" fontSize={13} fontWeight={500} mt={2} mb={4}>
          {item.shortPreviewText}
        </Box>
        <div>
          <Box
            display="flex"
            flexDirection="row"
            justifyContent="space-between"
            paddingBottom="12px"
            borderBottom="1px solid #35385622"
          >
            <Box className={classes.name} minWidth="25%">
              Yes
            </Box>
            {item.votes && item.totalVotes && (
              <>
                <BorderLinearProgress
                  variant="determinate"
                  value={
                    Math.round(
                      ((item.votes?.filter(vote => vote.answer).length || 0) / item.totalVotes) * 100 * 100
                    ) / 100
                  }
                  style={{ width: "50%" }}
                />
                <Box className={classes.name}>
                  {Math.round(
                    ((item.votes?.filter(vote => vote.answer).length || 0) / item.totalVotes) * 100 * 100
                  ) / 100}
                  %
                </Box>
              </>
            )}
          </Box>
          <Box
            display="flex"
            flexDirection="row"
            justifyContent="space-between"
            marginTop="12px"
            paddingBottom="12px"
          >
            <Box className={classes.name} minWidth="25%">
              No
            </Box>
            {item.votes && item.totalVotes && (
              <>
                <BorderLinearProgress
                  variant="determinate"
                  value={
                    Math.round(
                      ((item.votes?.filter(vote => !vote.answer).length || 0) / item.totalVotes) * 100 * 100
                    ) / 100
                  }
                  style={{ width: "50%" }}
                />
                <Box className={classes.name}>
                  {Math.round(
                    ((item.votes?.filter(vote => !vote.answer).length || 0) / item.totalVotes) * 100 * 100
                  ) / 100}
                  %
                </Box>
              </>
            )}
          </Box>
        </div>
      </div>
      <div className={classes.footer}>
        {!getMyAnswer() ? (
          <div>
            {item.endDate > new Date().getTime() && (
              <Box display="flex" justifyContent="center">
                <button
                  style={{
                    width: 222,
                    backgroundColor: "#65CB63",
                    borderRadius: 46,
                    fontFamily: "Agrandir",
                    fontSize: 14,
                    fontWeight: 600,
                    marginTop: -48,
                    marginBottom: 16,
                  }}
                >
                  Vote
                </button>
              </Box>
            )}
            <Box display="flex" justifyContent="center">
              <Box display="flex" flexDirection="row">
                <span style={{ color: "#65CB63", fontSize: 14, fontWeight: 500 }}>
                  {item.votes?.length || 0} votes
                </span>
                <span style={{ color: "#54658F", fontSize: 14, fontWeight: 500, marginLeft: 5 }}>
                  of {item.totalVotes || 0} required
                </span>
              </Box>
            </Box>
          </div>
        ) : (
          <Box display="flex" flexDirection="column">
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Box color="#2D3047" fontSize={14} fontWeight={500} lineHeight="18px">
                You voted
              </Box>
              <Box display="flex" flexDirection="row">
                <span style={{ color: "#65CB63", fontSize: 14, fontWeight: 500 }}>
                  {item.votes?.length || 0} votes
                </span>
                <span style={{ color: "#54658F", fontSize: 14, fontWeight: 500, marginLeft: 3 }}>
                  of {item.totalVotes || 0} required
                </span>
              </Box>
            </Box>
          </Box>
        )}
        {item &&
          endingTime &&
          (item.startDate <= new Date().getTime() && item.endDate > new Date().getTime() ? (
            <Box display="flex" justifyContent="center" alignItems="center" mt={2}>
              <TimerIcon />
              <div style={{ paddingTop: 4, marginLeft: 13 }}>
                <span style={{ color: "#2D3047", fontSize: 16, fontWeight: 400, marginRight: 6 }}>
                  Time left
                </span>
                <span>
                  {endingTime.days > 0 && (
                    <span style={{ color: "#2D3047", fontSize: 16, fontWeight: 600, marginRight: 4 }}>
                      <b>{String(endingTime.days).padStart(2, "0")}</b>d
                    </span>
                  )}
                  {endingTime.hours > 0 && (
                    <span style={{ color: "#2D3047", fontSize: 16, fontWeight: 600, marginRight: 4 }}>
                      <b>{String(endingTime.hours).padStart(2, "0")}</b>h
                    </span>
                  )}
                  {endingTime.minutes > 0 && (
                    <span style={{ color: "#2D3047", fontSize: 16, fontWeight: 600, marginRight: 4 }}>
                      <b>{String(endingTime.minutes).padStart(2, "0")}</b>m
                    </span>
                  )}
                  <span style={{ color: "#2D3047", fontSize: 16, fontWeight: 600, marginRight: 4 }}>
                    <b>{String(endingTime.seconds).padStart(2, "0")}</b>s
                  </span>
                </span>
              </div>
            </Box>
          ) : (
            <Box display="flex" justifyContent="center" mt={2}>
              <span style={{ color: "#2D3047", fontSize: 14, fontWeight: 500, marginLeft: 5 }}>Ended</span>
            </Box>
          ))}
      </div>
    </div>
  );
}
