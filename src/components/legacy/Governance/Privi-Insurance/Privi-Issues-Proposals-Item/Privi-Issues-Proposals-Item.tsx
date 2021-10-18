import React, { useState } from 'react';
import './Privi-Issues-Proposals-Item.css';
import formatDistanceToNow from 'date-fns/formatDistanceToNow';

const chatIconGrey = require('assets/icons/message_gray.png');

const PriviIssuesDiscussionsProposalsItem = (props: any) => {
  return (
    <div className="priviIssuesProposalsItem">
      <div className="firstRowIssuesProposalsItem">
        <img className="imgIssuesProposalsItem" />
        <div className="labelIssuesProposalsItem">{props.item.issue}</div>
      </div>
      <div className="secondRowIssuesProposalsItem">
        {props.item.comment && props.item.comment !== '' ? (
          <div className="commentIssuesProposalsItem">{props.item.comment}</div>
        ) : null}
        <div className="itemIssuesProposalsItem">
          <img className="iconResponsesIssuesProposalsItem" />
          <div className="labelResponsesIssuesProposalsItem">
            {props.item.item}
          </div>
        </div>
        <div className="responsesDateIssuesProposalsItem">
          <div className="labelResponsesDateIssuesProposalsItem">
            <img
              src={chatIconGrey}
              className="chatResponsesIssuesProposalsItem"
            />
            {props.item.responses.length} responses
          </div>
          <div className="labelTimeDateIssuesProposalsItem rightTextAlignIssuesProposalsItem">
            {formatDistanceToNow(props.item.date)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PriviIssuesDiscussionsProposalsItem;
