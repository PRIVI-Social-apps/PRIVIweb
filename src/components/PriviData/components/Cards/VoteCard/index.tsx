import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";

import Box from 'shared/ui-kit/Box';
import { voteCardStyles } from './index.styles';
import { RectangleCheckedIcon, TimerIcon, RectangleUncheckedIcon } from '../../Icons/SvgIcons';

export default function VoteCard({ item }) {
  const classes = voteCardStyles();
  const history = useHistory();

  const [endingTime, setEndingTime] = useState<any>();

  useEffect(() => {
    const timerId = setInterval(() => {
      const now = new Date();
      let delta = Math.floor(item.endTime - now.getTime() / 1000);
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

  const handleVote = () => {
    history.push(`/privi-data-new/governance/votes/${item.id}/`);
  }

  return (
    <div className={classes.card}>
      <div className={classes.content}>
        <Box color="#ffffff" fontSize={18} fontWeight={600}>{item.title}</Box>
        <Box color="#E0DFF0" fontSize={13} fontWeight={500} mt={2} mb={2}>{item.content}</Box>
        <div>
          <Box display='flex' flexDirection='row' alignItems='center' borderBottom='1px solid #353856' paddingBottom="10px">
            {
              item.isVoted && (
                <div style={{marginRight: 15}}><RectangleCheckedIcon /></div>
              )
            }
            <div>
              <span style={{color: '#ffffff', fontSize: 14, fontWeight: 600 }}>Yes</span>
            </div>
          </Box>
          <Box display='flex' flexDirection='row' alignItems='center' marginTop="12px">
            {
              item.isVoted && (
                <div style={{marginRight: 15}}><RectangleUncheckedIcon /></div>
              )
            }
            <div>
              <span style={{color: '#ffffff', fontSize: 14, fontWeight: 600 }}>No</span>
            </div>
          </Box>
        </div>
      </div>
      <div className={classes.footer}>
        {
          !item.isVoted ?
          (
            <div>
              <Box display='flex' justifyContent='center'>
                <button className={classes.voteBtn} onClick={handleVote}>Vote</button>
              </Box>
              <Box display='flex' justifyContent='center'>
                <Box display='flex' flexDirection='row'>
                  <span style={{color: '#BA50FC', fontSize: 14, fontWeight: 500}}>{item.currentNumberOfVotes} votes</span>
                  <span style={{color: '#E0DFF0', fontSize: 14, fontWeight: 500, marginLeft: 5}}>of {item.voteRequired} required</span>
                </Box>
              </Box>
            </div>
          ) : (
            <Box display='flex' flexDirection='column'>
              <Box display='flex' justifyContent='space-between' alignItems='center'>
                <Box color='#7977D1' fontSize={14} fontWeight={500} lineHeight="18px">You voted</Box>
                <Box display='flex' flexDirection='row'>
                  <span style={{color: '#BA50FC', fontSize: 14, fontWeight: 500}}>{item.currentNumberOfVotes} votes</span>
                  <span style={{color: '#E0DFF0', fontSize: 14, fontWeight: 500, marginLeft: 3}}>of {item.voteRequired} required</span>
                </Box>
              </Box>
              {
                item && endingTime &&
                new Date(item.startTime * 1000).getTime() <= new Date().getTime() &&
                new Date(item.endTime * 1000).getTime() > new Date().getTime() && (
                  <Box display='flex' justifyContent='center' alignItems='center' mt={2}>
                    <TimerIcon />
                    <div style={{paddingTop: 4, marginLeft: 13}}>
                      <span style={{ color: '#ffffff', fontSize: 16, fontWeight:400, marginRight: 6 }}>Time left</span>
                      <span>
                        {endingTime.days > 0 && (
                          <span style={{ color: '#ffffff', fontSize: 16, fontWeight:600, marginRight: 4 }}>
                            <b>{String(endingTime.days).padStart(2, "0")}</b>d
                          </span>
                        )}
                        {endingTime.hours > 0 && (
                          <span style={{ color: '#ffffff', fontSize: 16, fontWeight:600, marginRight: 4 }}>
                            <b>{String(endingTime.hours).padStart(2, "0")}</b>h
                          </span>
                        )}
                        {endingTime.minutes > 0 && (
                          <span style={{ color: '#ffffff', fontSize: 16, fontWeight:600, marginRight: 4 }}>
                            <b>{String(endingTime.minutes).padStart(2, "0")}</b>m
                          </span>
                        )}
                        <span style={{ color: '#ffffff', fontSize: 16, fontWeight:600, marginRight: 4 }}>
                          <b>{String(endingTime.seconds).padStart(2, "0")}</b>s
                        </span>
                      </span>
                    </div>
                  </Box>
                )
              }
            </Box>
          )
        }
      </div>
    </div>
  );
}

