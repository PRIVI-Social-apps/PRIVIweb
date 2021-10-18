import React from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { Notification } from "shared/services/API/NotificationsAPI";
import { setSelectedUser } from "store/actions/SelectedUser";
import { TransferNotificationContent } from "./TransferNotificationContent";

type NotificationContentProps = {
  notification: Notification;
};

// TODO: Please refactor me to something shorter and configurable :""""(
export const NotificationContent: React.FunctionComponent<NotificationContentProps> = ({ notification }) => {
  const { type, typeItemId, itemId, follower, pod, comment, token, amount, onlyInformation, otherItemId } =
    notification;

  const history = useHistory();
  const dispatch = useDispatch();

  return (
    <>
      {type === 1 ? (
        <div>
          You are getting noticed! Do you want to accept{" "}
          <b
            onClick={() => {
              history.push(`/profile/${itemId}`);
              dispatch(setSelectedUser(itemId));
            }}
          >
            {follower}
          </b>{" "}
          request to follow?`
        </div>
      ) : type === 2 ? (
        <div>
          Your network is expanding!{" "}
          <b
            onClick={() => {
              history.push(`/profile/${itemId}`);
              dispatch(setSelectedUser(itemId));
            }}
          >
            {follower}
          </b>{" "}
          accepts your request to follow.
        </div>
      ) : type === 3 ? (
        <div></div>
      ) : type === 4 ? (
        <div></div>
      ) : type === 5 ? (
        <div></div>
      ) : type === 6 ? (
        <div>
          Your transfer of{" "}
          <em>
            {amount} {token}
          </em>{" "}
          to{" "}
          <b
            onClick={() => {
              history.push(`/profile/${itemId}`);
              dispatch(setSelectedUser(itemId));
            }}
          >
            {follower}
          </b>{" "}
          was successful.
        </div>
      ) : type === 7 ? (
        <div>
          You have received{" "}
          <em>
            {amount} {token}
          </em>{" "}
          from{" "}
          <b
            onClick={() => {
              history.push(`/profile/${itemId}`);
              dispatch(setSelectedUser(itemId));
            }}
          >
            {follower}
          </b>
          .
        </div>
      ) : type === 8 ? (
        <div>
          Your swap of{" "}
          <em>
            {amount} {token}
          </em>{" "}
          to <em>{otherItemId}</em> was successful!
        </div>
      ) : type === 9 ? (
        <div>
          Your withdrawal of <em>{token}</em> was successful!
        </div>
      ) : type === 10 ? (
        <div>
          Success! You just created a new <b onClick={() => history.push(`/privi-pods/FT/${itemId}`)}>pod</b>.
          Want to invite your friends?
        </div>
      ) : type === 11 ? (
        <div></div>
      ) : type === 12 ? (
        <div>
          Your investment of{" "}
          <em>
            {amount} {token} Token
          </em>{" "}
          in <b onClick={() => history.push(`/privi-pods/FT/${itemId}`)}>{pod}</b> was successful. Check the
          latest Pod activity!
        </div>
      ) : type === 13 ? (
        <div>
          You just followed <b onClick={() => history.push(`/privi-pods/FT/${itemId}`)}>{pod}</b> Pod.
        </div>
      ) : type === 14 ? (
        <div>
          You just unfollowed <b onClick={() => history.push(`/privi-pods/FT/${itemId}`)}>{pod}</b> Pod.
        </div>
      ) : type === 15 ? (
        <div>
          <b
            onClick={() => {
              history.push(`/profile/${itemId}`);
              dispatch(setSelectedUser(itemId));
            }}
          >
            {follower}
          </b>{" "}
          just invested{" "}
          <em>
            {amount} {token}
          </em>{" "}
          Token in <b onClick={() => history.push(`/privi-pods/FT/${otherItemId}`)}>{pod}</b>!
        </div>
      ) : type === 16 ? (
        <div>
          <b
            onClick={() => {
              history.push(`/profile/${itemId}`);
              dispatch(setSelectedUser(itemId));
            }}
          >
            {follower}
          </b>{" "}
          just swapped{" "}
          <em>
            {amount} {token}
          </em>{" "}
          Token from the <b onClick={() => history.push(`/privi-pods/FT/${itemId}`)}>{pod}</b>
        </div>
      ) : type === 17 ? (
        <div>
          You just swapped{" "}
          <em>
            {amount} {token}
          </em>{" "}
          Token from the <b onClick={() => history.push(`/privi-pods/FT/${itemId}`)}>{pod}</b>
        </div>
      ) : type === 18 ? (
        <div>
          <b
            onClick={() => {
              history.push(`/profile/${itemId}`);
              dispatch(setSelectedUser(itemId));
            }}
          >
            {follower}
          </b>{" "}
          just swapped <b onClick={() => history.push(`/privi-pods/FT/${itemId}`)}>{pod}</b> tokens. Check it
          out!
        </div>
      ) : type === 19 ? (
        <div>
          <b
            onClick={() => {
              history.push(`/profile/${itemId}`);
              dispatch(setSelectedUser(itemId));
            }}
          >
            {follower}
          </b>{" "}
          just swapped <em>{amount}</em> in{" "}
          <b onClick={() => history.push(`/privi-pods/FT/${itemId}`)}>{pod}</b> tokens.
        </div>
      ) : type === 20 ? (
        <div>
          <b onClick={() => history.push(`/privi-pods/FT/${itemId}`)}>{pod}</b> just received a new offer!
          Click <b onClick={() => history.push(`/privi-pods/FT/${itemId}`)}>here</b> to check it out.
        </div>
      ) : type === 21 ? (
        <div>
          <b onClick={() => history.push(`/privi-pods/FT/${itemId}`)}>{pod}</b> just received a new offer!
          Click <b onClick={() => history.push(`/privi-pods/FT/${itemId}`)}>here</b> to check it out.
        </div>
      ) : type === 22 ? (
        <div>
          <b onClick={() => history.push(`/privi-pods/FT/${itemId}`)}>{pod}</b> just added a new NFT offering.
          Click <b onClick={() => history.push(`/privi-pods/FT/${itemId}`)}>here</b> to check it out.
        </div>
      ) : type === 23 ? (
        <div>
          <b onClick={() => history.push(`/privi-pods/FT/${itemId}`)}>{pod}</b> just added a new NFT offering.
          Click <b onClick={() => history.push(`/privi-pods/FT/${itemId}`)}>here</b> to check it out.
        </div>
      ) : type === 24 ? (
        <div>
          The buy offer from{" "}
          <b
            onClick={() => {
              history.push(`/profile/${itemId}`);
              dispatch(setSelectedUser(itemId));
            }}
          >
            {follower}
          </b>{" "}
          in <b onClick={() => history.push(`/privi-pods/FT/${itemId}`)}>{pod}</b> offer was removed.
        </div>
      ) : type === 25 ? (
        <div>
          The buy offer from{" "}
          <b
            onClick={() => {
              history.push(`/profile/${itemId}`);
              dispatch(setSelectedUser(itemId));
            }}
          >
            {follower}
          </b>{" "}
          in <b onClick={() => history.push(`/privi-pods/FT/${itemId}`)}>{pod}</b> offer was removed.
        </div>
      ) : type === 26 ? (
        <div>
          The sales offer from{" "}
          <b
            onClick={() => {
              history.push(`/profile/${itemId}`);
              dispatch(setSelectedUser(itemId));
            }}
          >
            {follower}
          </b>{" "}
          in <b onClick={() => history.push(`/privi-pods/FT/${itemId}`)}>{pod}</b> offer was removed.
        </div>
      ) : type === 27 ? (
        <div>
          The sales offer from{" "}
          <b
            onClick={() => {
              history.push(`/profile/${itemId}`);
              dispatch(setSelectedUser(itemId));
            }}
          >
            {follower}
          </b>{" "}
          in <b onClick={() => history.push(`/privi-pods/FT/${itemId}`)}>{pod}</b> offer was removed.
        </div>
      ) : type === 28 ? (
        <div>
          <b
            onClick={() => {
              history.push(`/profile/${itemId}`);
              dispatch(setSelectedUser(itemId));
            }}
          >
            {follower}
          </b>{" "}
          is selling [PriviPod hyperlink]! Check it out here.
        </div>
      ) : type === 29 ? (
        <div>
          <b
            onClick={() => {
              history.push(`/profile/${itemId}`);
              dispatch(setSelectedUser(itemId));
            }}
          >
            {follower}
          </b>{" "}
          just bought <em>{pod}</em> check out their new Pod and join the conversation.
        </div>
      ) : type === 30 ? (
        <div>
          <b
            onClick={() => {
              history.push(`/profile/${itemId}`);
              dispatch(setSelectedUser(itemId));
            }}
          >
            {follower}
          </b>{" "}
          just opened a discussion in <b onClick={() => history.push(`/privi-pods/FT/${pod}`)}>your pod</b>
        </div>
      ) : type === 31 ? (
        <div>
          <b
            onClick={() => {
              history.push(`/profile/${itemId}`);
              dispatch(setSelectedUser(itemId));
            }}
          >
            {follower}
          </b>{" "}
          just commented your post in <b onClick={() => history.push(`/privi-pods/FT/${pod}`)}>your pod</b>
        </div>
      ) : type === 32 ? (
        <div>
          Your Pod is growing!{" "}
          <b
            onClick={() => {
              history.push(`/profile/${itemId}`);
              dispatch(setSelectedUser(itemId));
            }}
          >
            {follower}
          </b>{" "}
          just followed <b onClick={() => history.push(`/privi-pods/FT/${otherItemId}`)}>{pod}</b>
        </div>
      ) : type === 33 ? (
        <div>
          You successfully created{" "}
          <b onClick={() => history.push(`/lendings/credit-pools/${itemId}`)}>{token}</b>! Check it out here.
        </div>
      ) : type === 34 ? (
        <div>
          Your <em>{otherItemId}</em> has been updated.
        </div>
      ) : type === 35 ? (
        <div>
          <b
            onClick={() => {
              history.push(`/profile/${itemId}`);
              dispatch(setSelectedUser(itemId));
            }}
          >
            {follower}
          </b>{" "}
          just lent <em>{amount}</em> to{" "}
          <b onClick={() => history.push(`/lendings/credit-pools/${otherItemId}`)}>{pod}</b> PriviCredit.
        </div>
      ) : type === 36 ? (
        <div>
          <b
            onClick={() => {
              history.push(`/profile/${itemId}`);
              dispatch(setSelectedUser(itemId));
            }}
          >
            {follower}
          </b>{" "}
          just borrowed <em>{amount}</em> from{" "}
          <b onClick={() => history.push(`/lendings/credit-pools/${otherItemId}`)}>{pod}</b> PriviCredit.
        </div>
      ) : type === 37 ? (
        <div>
          You just borrowed <em>{amount}</em> from{" "}
          <b onClick={() => history.push(`/lendings/credit-pools/${otherItemId}`)}>{pod}</b> PriviCredit.
        </div>
      ) : type === 38 ? (
        <div>
          You just withdrew <em>{amount}</em> from{" "}
          <b onClick={() => history.push(`/lendings/credit-pools/${otherItemId}`)}>{pod}</b> PriviCredit.
        </div>
      ) : type === 39 ? (
        <div>
          You just lend <em>{amount}</em> from{" "}
          <b onClick={() => history.push(`/lendings/credit-pools/${otherItemId}`)}>{pod}</b> PriviCredit.
        </div>
      ) : type === 40 ? (
        <div>
          Check it out!{" "}
          <b
            onClick={() => {
              history.push(`/profile/${itemId}`);
              dispatch(setSelectedUser(itemId));
            }}
          >
            {follower}
          </b>{" "}
          just assumed risk on your [PriviCredit link]
        </div>
      ) : type === 41 ? (
        <div>
          The conversation is growing!{" "}
          <b
            onClick={() => {
              history.push(`/profile/${itemId}`);
              dispatch(setSelectedUser(itemId));
            }}
          >
            {follower}
          </b>{" "}
          opened a new discussion on <em>{otherItemId}</em>
        </div>
      ) : type === 42 ? (
        <div>
          <b
            onClick={() => {
              history.push(`/profile/${itemId}`);
              dispatch(setSelectedUser(itemId));
            }}
          >
            {follower}
          </b>{" "}
          just commented your post in <em>your Privi Credit</em>
        </div>
      ) : type === 43 ? (
        <div>
          <b
            onClick={() => {
              history.push(`/profile/${itemId}`);
              dispatch(setSelectedUser(itemId));
            }}
          >
            {follower}
          </b>{" "}
          just followed <b onClick={() => history.push(`/lendings/credit-pools/${otherItemId}`)}>{pod}</b>{" "}
          Privi Credit.
        </div>
      ) : type === 44 ? (
        <div>
          You just received interest from <em>{otherItemId}</em>!
        </div>
      ) : type === 45 ? (
        <div>
          <b
            onClick={() => {
              history.push(`/profile/${itemId}`);
              dispatch(setSelectedUser(itemId));
            }}
          >
            {follower}
          </b>{" "}
          is late on their payment to <em>{otherItemId}</em>. Send them a reminder!
        </div>
      ) : type === 46 ? (
        <div></div>
      ) : type === 47 ? (
        <div>
          You did it! Your social token <em>{token}</em> is now available!
        </div>
      ) : type === 48 ? (
        <div>
          You're on fire!{" "}
          <b
            onClick={() => {
              history.push(`/profile/${itemId}`);
              dispatch(setSelectedUser(itemId));
            }}
          >
            {follower}
          </b>{" "}
          just purchased <em>{amount}</em> of <em>{token}</em>
        </div>
      ) : type === 49 ? (
        <div>
          Your{" "}
          <em>
            {amount} {token}
          </em>{" "}
          stake was successful.
        </div>
      ) : type === 50 ? (
        <div>
          <em>{token}</em> payment is now available. Check it out here [hyperlink]
        </div>
      ) : type === 51 ? (
        <div>
          Success! You've unstaked{" "}
          <em>
            {amount} {token}
          </em>
          .
        </div>
      ) : type === 52 ? (
        <div>
          <b
            onClick={() => {
              history.push(`/profile/${itemId}`);
              dispatch(setSelectedUser(itemId));
            }}
          >
            {follower}
          </b>{" "}
          just opened an issue in <em>{token}</em>. Resolve it now [hyperlink].
        </div>
      ) : type === 53 ? (
        <div>
          <b
            onClick={() => {
              history.push(`/profile/${itemId}`);
              dispatch(setSelectedUser(itemId));
            }}
          >
            {follower}
          </b>{" "}
          started a new discussion <em>{token}</em>. Join the conversation [hyperlink]!
        </div>
      ) : type === 54 ? (
        <div></div>
      ) : type === 55 ? (
        <div>
          {/* New vote available in <em>{token}</em>. Check it out <b>here</b>! */}
          New vote available in <em>{token}</em>. Check it out!
        </div>
      ) : type === 56 ? (
        <div>
          <b
            onClick={() => {
              history.push(`/profile/${itemId}`);
              dispatch(setSelectedUser(itemId));
            }}
          >
            {follower}
          </b>{" "}
          just created a new <em>pod</em>!
        </div>
      ) : type === 57 ? (
        <div></div>
      ) : type === 58 ? (
        <div>
          <em>{pod}</em> was removed by it's owner,{" "}
          <b
            onClick={() => {
              history.push(`/profile/${itemId}`);
              dispatch(setSelectedUser(itemId));
            }}
          >
            {follower}
          </b>
          . Head to your profile to see your current Pods.
        </div>
      ) : type === 59 ? (
        <div>
          <b onClick={() => history.push(`/lendings/credit-pools/${itemId}`)}>{token} </b> Credit Pool was
          just created by <em>{follower}</em>!
        </div>
      ) : type === 60 ? (
        <div>
          <em>{pod}</em> is trending!{" "}
          <b
            onClick={() => {
              history.push(`/profile/${itemId}`);
              dispatch(setSelectedUser(itemId));
            }}
          >
            {follower}
          </b>{" "}
          just invested <em>{amount}</em>!
        </div>
      ) : type === 61 ? (
        <div>
          <b
            onClick={() => {
              history.push(`/profile/${itemId}`);
              dispatch(setSelectedUser(itemId));
            }}
          >
            {follower}
          </b>{" "}
          just liquidated <em>{pod}</em>--head to your profile to see all your current Pods.
        </div>
      ) : type === 62 ? (
        <div>
          <b
            onClick={() => {
              history.push(`/profile/${itemId}`);
              dispatch(setSelectedUser(itemId));
            }}
          >
            {follower}
          </b>{" "}
          just paid interest in <em>{pod}</em>.
        </div>
      ) : type === 63 ? (
        <div>
          <b
            onClick={() => {
              history.push(`/profile/${itemId}`);
              dispatch(setSelectedUser(itemId));
            }}
          >
            {follower}
          </b>{" "}
          borrowed <em>{amount}</em> from{" "}
          <b onClick={() => history.push(`/lendings/credit-pools/${itemId}`)}>{pod}</b>.
        </div>
      ) : type === 64 ? (
        <div>
          <b
            onClick={() => {
              history.push(`/profile/${itemId}`);
              dispatch(setSelectedUser(itemId));
            }}
          >
            {follower}
          </b>{" "}
          lent <em>{amount}</em> to{" "}
          <b onClick={() => history.push(`/lendings/credit-pools/${itemId}`)}>{pod}</b>.
        </div>
      ) : type === 65 ? (
        <div>
          <em>{otherItemId}</em> was just updated by{" "}
          <b
            onClick={() => {
              history.push(`/profile/${itemId}`);
              dispatch(setSelectedUser(itemId));
            }}
          >
            {follower}
          </b>
          . Click to see what's new!
        </div>
      ) : type === 66 ? (
        <div>
          <b
            onClick={() => {
              history.push(`/profile/${itemId}`);
              dispatch(setSelectedUser(itemId));
            }}
          >
            {follower}
          </b>{" "}
          just created a new Credit Pool! Check out{" "}
          <b onClick={() => history.push(`/lendings/credit-pools/${itemId}`)}>{token}</b>.
        </div>
      ) : type === 67 ? (
        <div>
          <b
            onClick={() => {
              history.push(`/profile/${itemId}`);
              dispatch(setSelectedUser(itemId));
            }}
          >
            {follower}
          </b>{" "}
          just created a new Liquidity Pool! Check out <em>{otherItemId}</em>.
        </div>
      ) : type === 68 ? (
        <div>
          Your network is thriving.{" "}
          <b
            onClick={() => {
              history.push(`/profile/${itemId}`);
              dispatch(setSelectedUser(itemId));
            }}
          >
            {follower}
          </b>{" "}
          just created a new Liquidity Pool! Check out <em>{otherItemId}</em>.
        </div>
      ) : type === 69 ? (
        <div>
          <em>{otherItemId}</em> is growing!{" "}
          <b
            onClick={() => {
              history.push(`/profile/${itemId}`);
              dispatch(setSelectedUser(itemId));
            }}
          >
            {follower}
          </b>{" "}
          just deposited <em>{amount}</em>!
        </div>
      ) : type === 70 ? (
        <div>
          <b
            onClick={() => {
              history.push(`/profile/${itemId}`);
              dispatch(setSelectedUser(itemId));
            }}
          >
            {follower}
          </b>{" "}
          withdrew <em>{amount}</em> from <em>{otherItemId}</em>.
        </div>
      ) : type === 71 ? (
        <div></div>
      ) : type === 72 ? (
        <div></div>
      ) : type === 73 ? (
        <div></div>
      ) : type === 74 ? (
        <div></div>
      ) : type === 75 ? (
        <div></div>
      ) : type === 76 ? (
        <div>
          <b
            onClick={() => {
              history.push(`/profile/${itemId}`);
              dispatch(setSelectedUser(itemId));
            }}
          >
            {follower}
          </b>{" "}
          just commented in your post.
        </div>
      ) : type === 77 ? (
        <div>
          <b
            onClick={() => {
              history.push(`/profile/${itemId}`);
              dispatch(setSelectedUser(itemId));
            }}
          >
            {follower}
          </b>{" "}
          liked your post.
        </div>
      ) : type === 78 ? (
        <div>
          <b
            onClick={() => {
              history.push(`/profile/${itemId}`);
              dispatch(setSelectedUser(itemId));
            }}
          >
            {follower}
          </b>{" "}
          disliked your post.
        </div>
      ) : type === 79 ? (
        <div>
          <b
            onClick={() => {
              history.push(`/profile/${itemId}`);
              dispatch(setSelectedUser(itemId));
            }}
          >
            {follower}
          </b>{" "}
          liked your comment.
        </div>
      ) : type === 80 ? (
        <div>
          <b
            onClick={() => {
              history.push(`/profile/${itemId}`);
              dispatch(setSelectedUser(itemId));
            }}
          >
            {follower}
          </b>{" "}
          disliked your comment.
        </div>
      ) : type === 81 ? (
        <div>
          <b
            onClick={() => {
              history.push(`/profile/${itemId}`);
              dispatch(setSelectedUser(itemId));
            }}
          >
            {follower}
          </b>{" "}
          reply your comment.
        </div>
      ) : type === 82 ? (
        <div>
          <b
            onClick={() => {
              history.push(`/profile/${itemId}`);
              dispatch(setSelectedUser(itemId));
            }}
          >
            {follower}
          </b>{" "}
          just commented your post in <em>your community</em>
        </div>
      ) : type === 83 ? (
        <div>
          You just followed <b onClick={() => history.push(`/lendings/credit-pools/${otherItemId}`)}>{pod}</b>{" "}
          Privi Credit.
        </div>
      ) : type === 84 ? (
        <div>
          You just unfollowed{" "}
          <b onClick={() => history.push(`/lendings/credit-pools/${otherItemId}`)}>{pod}</b> Privi Credit.
        </div>
      ) : type === 85 ? (
        <div>
          <b
            onClick={() => {
              history.push(`/profile/${itemId}`);
              dispatch(setSelectedUser(itemId));
            }}
          >
            {follower}
          </b>{" "}
          just created <b onClick={() => history.push(`/privi-pods/FT/${otherItemId}`)}>{pod}</b> Pod and want
          you to join! Click here to join pod:
        </div>
      ) : type === 86 ? (
        <div>
          <b
            onClick={() => {
              history.push(`/profile/${itemId}`);
              dispatch(setSelectedUser(itemId));
            }}
          >
            {follower}
          </b>{" "}
          created <b onClick={() => {}}>{pod}</b> Commuity and want you to join as <em>{comment}</em>.
        </div>
      ) : type === 87 ? (
        <div>
          <b
            onClick={() => {
              history.push(`/profile/${itemId}`);
              dispatch(setSelectedUser(itemId));
            }}
          >
            {follower}
          </b>{" "}
          accepts your invitation to join as a <em>{comment}</em> of <b onClick={() => {}}>{pod}</b>{" "}
          Community.
        </div>
      ) : type === 88 ? (
        <div>
          <b
            onClick={() => {
              history.push(`/profile/${itemId}`);
              dispatch(setSelectedUser(itemId));
            }}
          >
            {follower}
          </b>{" "}
          declines your invitation to join as a <em>{comment}</em> of <b onClick={() => {}}>{pod}</b>{" "}
          Community.
        </div>
      ) : type === 89 ? (
        <div>
          You have accepted the invitation to join as a <em>{comment}</em> of <b onClick={() => {}}>{pod}</b>{" "}
          Community.
        </div>
      ) : type === 90 ? (
        <div>
          You have declined the invitation to join as a <em>{comment}</em> of <b onClick={() => {}}>{pod}</b>{" "}
          Community.
        </div>
      ) : type === 91 ? (
        <div>
          You just went up to Level <em>{comment}</em>!
        </div>
      ) : type === 92 ? (
        <div>
          You just unlocked the badge <em>{comment}</em>!
        </div>
      ) : type === 93 ? (
        <div>
          Your contribution is becoming valuable.{" "}
          <b
            onClick={() => {
              history.push(`/profile/${itemId}`);
              dispatch(setSelectedUser(itemId));
            }}
          >
            {follower}
          </b>{" "}
          just sent you{" "}
          <em>
            {amount} {token}
          </em>{" "}
          as a tip!
        </div>
      ) : type === 94 ? (
        <div>
          <b
            onClick={() => {
              history.push(`/profile/${itemId}`);
              dispatch(setSelectedUser(itemId));
            }}
          >
            {follower}
          </b>{" "}
          is requesting your support for creating a new community. The assistance offer is{" "}
          <em>
            {amount} {token}
          </em>
          . Are you interested?
        </div>
      ) : type === 95 ? (
        <div>
          <b
            onClick={() => {
              history.push(`/profile/${itemId}`);
              dispatch(setSelectedUser(itemId));
            }}
          >
            {follower}
          </b>{" "}
          is requesting your support for creating a new community. The assistance offer is{" "}
          <em>
            {amount} {token}
          </em>
          . Are you interested?
        </div>
      ) : type === 96 ? (
        <div>
          <b
            onClick={() => {
              history.push(`/profile/${itemId}`);
              dispatch(setSelectedUser(itemId));
            }}
          >
            {follower}
          </b>{" "}
          has declined your offer to support you for create a new community.
        </div>
      ) : type === 97 ? (
        <div>
          <b
            onClick={() => {
              history.push(`/profile/${itemId}`);
              dispatch(setSelectedUser(itemId));
            }}
          >
            {follower}
          </b>{" "}
          has refused your offer to support you for create a new community. Do you want to make a new offer?
        </div>
      ) : type === 98 ? (
        <div>
          <b
            onClick={() => {
              history.push(`/profile/${itemId}`);
              dispatch(setSelectedUser(itemId));
            }}
          >
            {follower}
          </b>{" "}
          has accepted your offer of {amount} {token} to support you for create a new community.
        </div>
      ) : type === 99 ? (
        <div>
          <b
            onClick={() => {
              history.push(`/profile/${itemId}`);
              dispatch(setSelectedUser(itemId));
            }}
          >
            {follower}
          </b>{" "}
          is requesting your support for creating a new NFT Media Pod. The assistance offer is{" "}
          <em>
            {amount} {token}
          </em>
          . Are you interested?
        </div>
      ) : type === 100 ? (
        <div>
          <b
            onClick={() => {
              history.push(`/profile/${itemId}`);
              dispatch(setSelectedUser(itemId));
            }}
          >
            {follower}
          </b>{" "}
          is requesting your support for creating a new NFT Media Pod. The assistance offer is{" "}
          <em>
            {amount} {token}
          </em>
          . Are you interested?
        </div>
      ) : type === 101 ? (
        <div>
          <b
            onClick={() => {
              history.push(`/profile/${itemId}`);
              dispatch(setSelectedUser(itemId));
            }}
          >
            {follower}
          </b>{" "}
          has declined your offer to support you for create a new NFT Media Pod.
        </div>
      ) : type === 102 ? (
        <div>
          <b
            onClick={() => {
              history.push(`/profile/${itemId}`);
              dispatch(setSelectedUser(itemId));
            }}
          >
            {follower}
          </b>{" "}
          has refused your offer to support you for create a new NFT Media Pod. Do you want to make a new
          offer?
        </div>
      ) : type === 103 ? (
        <div>
          <b
            onClick={() => {
              history.push(`/profile/${itemId}`);
              dispatch(setSelectedUser(itemId));
            }}
          >
            {follower}
          </b>{" "}
          has accepted your offer of {amount} {token} to support you for create a new NFT Media Pod.
        </div>
      ) : type === 104 ? (
        <div>
          <b
            onClick={() => {
              history.push(`/profile/${itemId}`);
              dispatch(setSelectedUser(itemId));
            }}
          >
            {follower}
          </b>{" "}
          is requesting you to Collab in{" "}
          <b
            onClick={() => {
              history.push(`/privi-pods/MediaNFT/${token}`);
            }}
          >
            {token}
          </b>
          .
        </div>
      ) : type === 105 ? (
        <div>
          <b
            onClick={() => {
              history.push(`/profile/${itemId}`);
              dispatch(setSelectedUser(itemId));
            }}
          >
            {follower}
          </b>{" "}
          has refused your offer to Collab in{" "}
          <b
            onClick={() => {
              history.push(`/privi-pods/MediaNFT/${token}`);
            }}
          >
            {token}
          </b>
          .
        </div>
      ) : type === 106 ? (
        <div>
          <b
            onClick={() => {
              history.push(`/profile/${itemId}`);
              dispatch(setSelectedUser(itemId));
            }}
          >
            {follower}
          </b>{" "}
          has accepted your offer to Collab in{" "}
          <b
            onClick={() => {
              history.push(`/privi-pods/MediaNFT/${token}`);
            }}
          >
            {token}
          </b>
          .
        </div>
      ) : type === 107 ? (
        <div>
          <b
            onClick={() => {
              history.push(`/profile/${itemId}`);
              dispatch(setSelectedUser(itemId));
            }}
          >
            {follower}
          </b>{" "}
          has remove your Collab in{" "}
          <b
            onClick={() => {
              history.push(`/privi-pods/MediaNFT/${token}`);
            }}
          >
            {token}
          </b>
          .
        </div>
      ) : type === 108 ? (
        <div>
          <b
            onClick={() => {
              history.push(`/profile/${itemId}`);
              dispatch(setSelectedUser(itemId));
            }}
          >
            {follower}
          </b>{" "}
          liked{" "}
          <b
            onClick={() => {
              history.push(`/media/${token.replace(/\s/g, "")}`);
            }}
          >
            {token}
          </b>{" "}
          media.
        </div>
      ) : type === 109 ? (
        <div>
          <b
            onClick={() => {
              history.push(`/profile/${itemId}`);
              dispatch(setSelectedUser(itemId));
            }}
          >
            {follower}
          </b>{" "}
          shared{" "}
          <b
            onClick={() => {
              history.push(`/media/${token.replace(/\s/g, "")}`);
            }}
          >
            {token}
          </b>{" "}
          media.
        </div>
      ) : type === 110 ? (
        <div>
          <b
            onClick={() => {
              history.push(`/profile/${itemId}`);
              dispatch(setSelectedUser(itemId));
            }}
          >
            {follower}
          </b>{" "}
          has shared{" "}
          <b
            onClick={() => {
              history.push(`/media/${token.replace(/\s/g, "")}`);
            }}
          >
            {token}
          </b>{" "}
          media.
        </div>
      ) : type === 111 ? (
        <div>
          <b
            onClick={() => {
              history.push(`/profile/${itemId}`);
              dispatch(setSelectedUser(itemId));
            }}
          >
            {follower}
          </b>{" "}
          has shared{" "}
          <b
            onClick={() => {
              history.push(`/media/${token.replace(/\s/g, "")}`);
            }}
          >
            {token}
          </b>{" "}
          playlist.
        </div>
      ) : type === 112 ? (
        <div>
          Hey,{" "}
          <b
            onClick={() => {
              history.push(`/profile/${itemId}`);
              dispatch(setSelectedUser(itemId));
            }}
          >
            {follower}
          </b>
          , your shared{" "}
          <b
            onClick={() => {
              history.push(`/profile/${itemId}`);
              dispatch(setSelectedUser(itemId));
            }}
          >
            {pod}
          </b>{" "}
          NFT could be deployed to Ethereum, we need your Ethereum address.
        </div>
      ) : type === 113 ? (
        <div>
          <b
            onClick={() => {
              history.push(`/profile/${itemId}`);
              dispatch(setSelectedUser(itemId));
            }}
          >
            {follower}
          </b>{" "}
          sent you an offer to list the media <em>{pod}</em> in your community projects for <em>{amount}</em>%
          on revenue.
        </div>
      ) : type === 114 ? (
        <div>
          <b
            onClick={() => {
              history.push(`/profile/${itemId}`);
              dispatch(setSelectedUser(itemId));
            }}
          >
            {follower}
          </b>{" "}
          sent a contribution of{" "}
          <b>
            {token} {amount}
          </b>{" "}
          to the community <b>{pod}</b>
        </div>
      ) : type === 115 ? (
        <div>
          <label>Airdrop</label>
          <b
            onClick={() => {
              history.push(`/profile/${itemId}`);
              dispatch(setSelectedUser(itemId));
            }}
          >
            @{follower}
          </b>{" "}
          sent you a <b>Community Token Airdrop</b> of <b>TKN {amount}</b>.
        </div>
      ) : type === 116 ? (
        <div>
          <b
            onClick={() => {
              history.push(`/profile/${itemId}`);
              dispatch(setSelectedUser(itemId));
            }}
          >
            {follower}
          </b>{" "}
          has shared <em>{token}</em> playlist.
        </div>
      ) : type === 117 ? (
        <div>
          <b
            onClick={() => {
              history.push(`/profile/${otherItemId}`);
              dispatch(setSelectedUser(otherItemId));
            }}
          >
            {follower}
          </b>{" "}
          just started live streaming that you have in your watchlist.
        </div>
      ) : type === 118 ? (
        <div>
          <b
            onClick={() => {
              history.push(`/profile/${otherItemId}`);
              dispatch(setSelectedUser(otherItemId));
            }}
          >
            {follower}
          </b>{" "}
          has sent you a proposal to co-fund a new community: <b>{pod}</b>. You have 7 days to accept or
          decline this invitation.
        </div>
      ) : type === 119 ? (
        <div>
          We’re sorry,
          <b
            onClick={() => {
              history.push(`/profile/${itemId}`);
              dispatch(setSelectedUser(itemId));
            }}
          >
            {follower}
          </b>{" "}
          declined your co-funded community proposal Co-Funded <b>{pod}</b>.
        </div>
      ) : type === 120 ? (
        <div>
          Psst! Remember that you have a pending invitation to co-fund <b>{pod}</b>. Beware that this
          invitation expires in 1 day.
        </div>
      ) : type === 121 ? (
        <div>
          Oops! We’re sorry but time is out. Your co-funded community proposal didn’t get all the approvals on
          time.
        </div>
      ) : type === 122 ? (
        <div>
          Everyone on board! Your co-funded community proposal Co-Funded <b>{pod}</b> has been signed by all
          its founders.
        </div>
      ) : type === 123 ? (
        <div>
          <b
            onClick={() => {
              history.push(`/profile/${otherItemId}`);
              dispatch(setSelectedUser(otherItemId));
            }}
          >
            {follower}
          </b>{" "}
          has sent you a proposal to create a Community Token: <b>{pod}</b>. You have 7 days to accept or
          decline this invitation.
        </div>
      ) : type === 124 ? (
        <div>We’re sorry, your proposal has been declined.</div>
      ) : type === 125 ? (
        <div>
          Psst! Remember that you have a pending request to co-fund a Community Token. Beware that this
          invitation expires in 1 day.
        </div>
      ) : type === 126 ? (
        <div>
          Oops! We’re sorry but time is out. Your co-funded Community Token proposal didn’t get all the
          approvals on time.
        </div>
      ) : type === 127 ? (
        <div>
          Everyone on board! Your proposal for co-funded Community Token <b>{pod}</b> has been signed by all
          its founders.
        </div>
      ) : type === 128 || type === 129 ? (
        <TransferNotificationContent notification={notification} />
      ) : type === 130 ? (
        <div>
          <b
            onClick={() => {
              history.push(`/profile/${itemId}`);
              dispatch(setSelectedUser(itemId));
            }}
          >
            {follower}
          </b>
          joined {pod}.
        </div>
      ) : type === 131 ? (
        <div>
          Congratulations!{" "}
          <b
            onClick={() => {
              history.push(`/profile/${itemId}`);
              dispatch(setSelectedUser(itemId));
            }}
          >
            {follower}
          </b>{" "}
          accepted your participation in {pod}.
        </div>
      ) : type === 132 ? (
        <div>
          We’re sorry,{" "}
          <b
            onClick={() => {
              history.push(`/profile/${itemId}`);
              dispatch(setSelectedUser(itemId));
            }}
          >
            {follower}
          </b>{" "}
          declined your participation in {pod}.
        </div>
      ) : type === 133 ? (
        <div>
          <b
            onClick={() => {
              history.push(`/profile/${itemId}`);
              dispatch(setSelectedUser(itemId));
            }}
          >
            {follower}
          </b>{" "}
          wants to join {pod}.
        </div>
      ) : type === 134 ? (
        <div>
          <b
            onClick={() => {
              history.push(`/profile/${otherItemId}`);
              dispatch(setSelectedUser(otherItemId));
            }}
          >
            {follower}
          </b>{" "}
          has sent you a proposal to Add Treasurer: <b>{pod}</b>. You have 7 days to accept or decline this
          invitation.
        </div>
      ) : type === 135 ? (
        <div>We’re sorry, your proposal has been declined.</div>
      ) : type === 136 ? (
        <div>
          Psst! Remember that you have a pending request to Add Treasurer. Beware that this invitation expires
          in 1 day.
        </div>
      ) : type === 137 ? (
        <div>
          Oops! We’re sorry but time is out. Your Add Treasurer proposal didn’t get all the approvals on time.
        </div>
      ) : type === 138 ? (
        <div>
          Everyone on board! Your proposal for Add Treasurer <b>{pod}</b> has been signed by all its founders.
        </div>
      ) : type === 139 ? (
        <div>
          <b
            onClick={() => {
              history.push(`/profile/${otherItemId}`);
              dispatch(setSelectedUser(otherItemId));
            }}
          >
            {follower}
          </b>{" "}
          has sent you a proposal to Add Airdrop: <b>{pod}</b>. You have 7 days to accept or decline this
          invitation.
        </div>
      ) : type === 140 ? (
        <div>We’re sorry, your proposal has been declined.</div>
      ) : type === 141 ? (
        <div>
          Psst! Remember that you have a pending request to Add Airdrop. Beware that this invitation expires
          in 1 day.
        </div>
      ) : type === 142 ? (
        <div>
          Oops! We’re sorry but time is out. Your Add Airdrop proposal didn’t get all the approvals on time.
        </div>
      ) : type === 143 ? (
        <div>
          Everyone on board! Your proposal for Add Airdrop <b>{pod}</b> has been signed by all its founders.
        </div>
      ) : type === 144 ? (
        <div>
          <b
            onClick={() => {
              history.push(`/profile/${otherItemId}`);
              dispatch(setSelectedUser(otherItemId));
            }}
          >
            {follower}
          </b>{" "}
          has sent you a proposal to Add Allocation: <b>{pod}</b>. You have 7 days to accept or decline this
          invitation.
        </div>
      ) : type === 145 ? (
        <div>We’re sorry, your proposal has been declined.</div>
      ) : type === 146 ? (
        <div>
          Psst! Remember that you have a pending request to Add Allocation. Beware that this invitation
          expires in 1 day.
        </div>
      ) : type === 147 ? (
        <div>
          Oops! We’re sorry but time is out. Your Add Allocation proposal didn’t get all the approvals on
          time.
        </div>
      ) : type === 148 ? (
        <div>
          Everyone on board! Your proposal for Add Allocation <b>{pod}</b> has been signed by all its
          founders.
        </div>
      ) : type === 149 ? (
        <div>
          <b
            onClick={() => {
              history.push(`/profile/${otherItemId}`);
              dispatch(setSelectedUser(otherItemId));
            }}
          >
            {follower}
          </b>{" "}
          has sent you a proposal to Add Transfer: <b>{pod}</b>. You have 7 days to accept or decline this
          invitation.
        </div>
      ) : type === 150 ? (
        <div>We’re sorry, your proposal has been declined.</div>
      ) : type === 151 ? (
        <div>
          Psst! Remember that you have a pending request to Add Transfer. Beware that this invitation expires
          in 1 day.
        </div>
      ) : type === 152 ? (
        <div>
          Oops! We’re sorry but time is out. Your Add Transfer proposal didn’t get all the approvals on time.
        </div>
      ) : type === 153 ? (
        <div>
          Everyone on board! Your proposal for Add Transfer <b>{pod}</b> has been signed by all its founders.
        </div>
      ) : type === 154 ? (
        <div>
          <b
            onClick={() => {
              history.push(`/profile/${otherItemId}`);
              dispatch(setSelectedUser(otherItemId));
            }}
          >
            {follower}
          </b>{" "}
          has sent you a proposal to Add Bid: <b>{pod}</b>. You have 7 days to accept or decline this
          invitation.
        </div>
      ) : type === 155 ? (
        <div>We’re sorry, your proposal has been declined.</div>
      ) : type === 156 ? (
        <div>
          Psst! Remember that you have a pending request to Add Bid. Beware that this invitation expires in 1
          day.
        </div>
      ) : type === 157 ? (
        <div>
          Oops! We’re sorry but time is out. Your Add Bid proposal didn’t get all the approvals on time.
        </div>
      ) : type === 158 ? (
        <div>
          Everyone on board! Your proposal for Add Bid <b>{pod}</b> has been signed by all its founders.
        </div>
      ) : type === 159 ? (
        <div>
          <b
            onClick={() => {
              history.push(`/profile/${otherItemId}`);
              dispatch(setSelectedUser(otherItemId));
            }}
          >
            {follower}
          </b>{" "}
          has sent you a proposal to Add BuyOrder: <b>{pod}</b>. You have 7 days to accept or decline this
          invitation.
        </div>
      ) : type === 160 ? (
        <div>We’re sorry, your proposal has been declined.</div>
      ) : type === 161 ? (
        <div>
          Psst! Remember that you have a pending request to Add BuyOrder. Beware that this invitation expires
          in 1 day.
        </div>
      ) : type === 162 ? (
        <div>
          Oops! We’re sorry but time is out. Your Add BuyOrder proposal didn’t get all the approvals on time.
        </div>
      ) : type === 163 ? (
        <div>
          Everyone on board! Your proposal for Add BuyOrder <b>{pod}</b> has been signed by all its founders.
        </div>
      ) : type === 164 ? (
        <div>
          <b
            onClick={() => {
              history.push(`/profile/${otherItemId}`);
              dispatch(setSelectedUser(otherItemId));
            }}
          >
            {follower}
          </b>{" "}
          has sent you a proposal to Add Buying: <b>{pod}</b>. You have 7 days to accept or decline this
          invitation.
        </div>
      ) : type === 165 ? (
        <div>We’re sorry, your proposal has been declined.</div>
      ) : type === 166 ? (
        <div>
          Psst! Remember that you have a pending request to Add Buying. Beware that this invitation expires in
          1 day.
        </div>
      ) : type === 167 ? (
        <div>
          Oops! We’re sorry but time is out. Your Add Buying proposal didn’t get all the approvals on time.
        </div>
      ) : type === 168 ? (
        <div>
          Everyone on board! Your proposal for Add Buying <b>{pod}</b> has been signed by all its founders.
        </div>
      ) : type === 169 ? (
        <div>
          <b
            onClick={() => {
              history.push(`/profile/${otherItemId}`);
              dispatch(setSelectedUser(otherItemId));
            }}
          >
            {follower}
          </b>{" "}
          has sent you a proposal to Eject {follower} from <b>{pod}</b> community. You have 7 days to accept
          or decline this invitation.
        </div>
      ) : type === 170 ? (
        <div>We’re sorry, your proposal has been declined.</div>
      ) : type === 171 ? (
        <div>
          Psst! Remember that you have a pending request to Add Eject. Beware that this invitation expires in
          1 day.
        </div>
      ) : type === 172 ? (
        <div>
          Oops! We’re sorry but time is out. Your Add Eject proposal didn’t get all the approvals on time.
        </div>
      ) : type === 173 ? (
        <div>
          Everyone on board! Your proposal for Add Eject <b>{pod}</b> has been signed by all its founders.
        </div>
      ) : type === 174 ? (
        <div>
          <b
            onClick={() => {
              history.push(`/profile/${otherItemId}`);
              dispatch(setSelectedUser(otherItemId));
            }}
          >
            {follower}
          </b>{" "}
          has sent you a proposal to Add Exchange: <b>{pod}</b>. You have 7 days to accept or decline this
          invitation.
        </div>
      ) : type === 175 ? (
        <div>We’re sorry, your proposal has been declined.</div>
      ) : type === 176 ? (
        <div>
          Psst! Remember that you have a pending request to Add Exchange. Beware that this invitation expires
          in 1 day.
        </div>
      ) : type === 177 ? (
        <div>
          Oops! We’re sorry but time is out. Your Add Exchange proposal didn’t get all the approvals on time.
        </div>
      ) : type === 178 ? (
        <div>
          Everyone on board! Your proposal for Add Exchange <b>{pod}</b> has been signed by all its founders.
        </div>
      ) : type === 179 ? (
        <div>
          <b
            onClick={() => {
              history.push(`/profile/${otherItemId}`);
              dispatch(setSelectedUser(otherItemId));
            }}
          >
            {follower}
          </b>{" "}
          has requested to join: <b>{pod}</b> community. You have 7 days to accept or decline this request.
        </div>
      ) : type === 180 ? (
        <div>We’re sorry, your proposal has been declined.</div>
      ) : type === 181 ? (
        <div>
          Psst! Remember that you have a pending request to Add JoiningRequest. Beware that this invitation
          expires in 1 day.
        </div>
      ) : type === 182 ? (
        <div>
          Oops! We’re sorry but time is out. Your Add JoiningRequest proposal didn’t get all the approvals on
          time.
        </div>
      ) : type === 183 ? (
        <div>
          Everyone on board! A new member has joined <b>{pod}</b> community.
        </div>
      ) : type === 184 ? (
        <div>
          <b
            onClick={() => {
              history.push(`/profile/${otherItemId}`);
              dispatch(setSelectedUser(otherItemId));
            }}
          >
            {follower}
          </b>{" "}
          has sent you a proposal: <b>{pod}</b>. You have 7 days to accept or decline this invitation.
        </div>
      ) : type === 185 ? (
        <div>We’re sorry, your proposal has been declined.</div>
      ) : type === 186 ? (
        <div>
          Psst! Remember that you have a pending request. Beware that this invitation expires in 1 day.
        </div>
      ) : type === 187 ? (
        <div>Oops! We’re sorry but time is out. Your proposal didn’t get all the approvals on time.</div>
      ) : type === 188 ? (
        <div>
          Everyone on board! Your proposal <b>{pod}</b> has been signed by all its founders.
        </div>
      ) : type === 189 ? (
        <div>
          <b
            onClick={() => {
              history.push(`/profile/${otherItemId}`);
              dispatch(setSelectedUser(otherItemId));
            }}
          >
            {follower}
          </b>{" "}
          has sent you a proposal to eject {follower} as treasurer from <b>{pod}</b>. You have 7 days to
          accept or decline this invitation.
        </div>
      ) : type === 190 ? (
        <div>We’re sorry, your proposal has been declined.</div>
      ) : type === 191 ? (
        <div>
          Psst! Rememeber that you have a pending eject treasurer proposal. Beware that this invitation
          expires in less than 1 day.
        </div>
      ) : type === 192 ? (
        <div>Oops! We’re sorry but time is out. Your proposal didn’t get all the approvals on time.</div>
      ) : type === 193 ? (
        <div>Congratulations! Your proposal has been signed by all its funders.</div>
      ) : type === 194 ? (
        <div>
          <b
            onClick={() => {
              history.push(`/profile/${otherItemId}`);
              dispatch(setSelectedUser(otherItemId));
            }}
          >
            {follower}
          </b>{" "}
          has invited you to be a member of the community <b>{pod}</b>.
        </div>
      ) : type === 195 ? (
        <div>We’re sorry, your invitation has been declined.</div>
      ) : type === 196 ? (
        <div>
          Psst! Rememeber that you have a pending community member invitation. Beware that this invitation
          expires in less than 1 day.
        </div>
      ) : type === 197 ? (
        <div>Oops! We’re sorry but time is out. Your invitation has expired.</div>
      ) : type === 198 ? (
        <div>Congratulations! {follower} has accepted your member invitation</div>
      ) : type === 199 ? (
        <div>
          <b>{follower}</b> has proposed to place a bid of{" "}
          <b>
            {amount} {token}
          </b>{" "}
          to buy <b>{otherItemId}</b> NFT in <b>{pod}</b> community.
        </div>
      ) : type === 200 ? (
        <div>
          <b>{pod}</b> community members have proposed to place a bid of{" "}
          <b>
            {amount} {token}
          </b>{" "}
          to buy <b>{otherItemId}</b> NFT.
        </div>
      ) : type === 201 ? (
        <div>
          <b>{follower}</b> has proposed to place a buying order of{" "}
          <b>
            {amount} {token}
          </b>{" "}
          for <b>{otherItemId}</b> NFT in <b>{pod}</b> community.
        </div>
      ) : type === 202 ? (
        <div>
          <b>{pod}</b> community members have proposed to place a buying order of{" "}
          <b>
            {amount} {token}
          </b>{" "}
          for <b>{otherItemId}</b> NFT.
        </div>
      ) : type === 203 ? (
        <div>
          <b>{follower}</b> has proposed to buy <b>{otherItemId}</b> NFT with{" "}
          <b>
            {amount} {token}
          </b>{" "}
          in <b>{pod}</b> community.
        </div>
      ) : type === 204 ? (
        <div>
          <b>{pod}</b> community members have proposed to buy <b>{otherItemId}</b> NFT with{" "}
          <b>
            {amount} {token}
          </b>
          .
        </div>
      ) : null}
    </>
  );
};
