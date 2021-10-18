import "./Sidebar.css";
import React, { useState } from "react";
import OpenPosition from "../modals/Open-Position/Open-positon";
import { Dialog } from "@material-ui/core";
import InputWithLabelAndTooltip from "shared/ui-kit/InputWithLabelAndTooltip";

export default function Sidebar(props) {
  const [rulesScrollable, setRulesScrollable] = useState<boolean>(false);
  const [email, setEmail] = useState<string>("");
  const [selectedPosition, setSelectedPosition] = useState<any>(null);

  const handleSubscribe = () => {
    //TODO: email subscribe
  };

  const applyTo = (position) => {
    //TODO: apply to position
    //console.log(position);
    setSelectedPosition(position);
    handleOpenModalOpenPosition();
  };

  const openInNewTab = (url) => {
    const newWindow = window.open(url, "_blank", "noopener,noreferrer");
    if (newWindow) newWindow.opener = null;
  };

  const [openModalOpenPosition, setOpenModalOpenPosition] = useState<boolean>(
    false
  );

  const handleOpenModalOpenPosition = () => {
    setOpenModalOpenPosition(true);
  };
  const handleCloseModalOpenPosition = () => {
    setOpenModalOpenPosition(false);
  };

  if (props.community)
    return (
      <div className="sidebar-content">
        {props.community.RuleBased ? (
          <div className="box">
            <div className="title">
              <p>Joining rules</p>
            </div>
            <div className="joining-rules">
              {props.community.RequiredTokens && props.community.RequiredTokens.length > 0
                ? props.community.RequiredTokens.map((token) => {
                  return (
                    <div className="rule-row" key={token.token}>
                      <div
                        className="row-image"
                        style={{
                          backgroundImage:
                            token.token && token.token.length > 0
                              ? `url(${require(`assets/tokenImages/${token.token}.png`)})`
                              : "none",
                          backgroundRepeat: "no-repeat",
                          backgroundSize: "cover",
                          backgroundPosition: "center",
                        }}
                      />
                      <p>{`Buy ${token.tokenValue} ${token.token} Tokens`}</p>
                    </div>
                  );
                })
                : null}
              {props.community.MinimumUserLevel ? (
                <div className="rule-row">
                  <div className="row-image">
                    {props.community.MinimumUserLevel}
                  </div>
                  <p>Level {props.community.MinimumUserLevel}+</p>
                </div>
              ) : null}
            </div>
          </div>
        ) : null}

        {props.community.TwitterId && props.community.TwitterId.length > 0 ?
          <div
            className="box horizontal clickable"
            onClick={() => {
              if (props.community.TwitterId && props.community.TwitterId.length > 0) {
                openInNewTab(`https://twitter.com/${props.community.TwitterId}`);
              }
              // else {
              //   openInNewTab("https://twitter.com/");
              // }
            }}
          >
            <img
              src={require(`assets/snsIcons/twitter_color.png`)}
              alt={"twitter"}
            />
            <p>Twitter</p>
          </div>
          : null}
        {props.community.RuleBased &&
          props.community.CommunityRules &&
          props.community.CommunityRules.length > 0 ? (
          <div className="box">
            <div className="title">
              <p>Community rules</p>
              <span
                className={"clickable"}
                onClick={() => setRulesScrollable(!rulesScrollable)}
              >
                View all
              </span>
            </div>
            <div className={rulesScrollable ? "rules scrollable" : "rules"}>
              {props.community.CommunityRules.map((rule, index) => {
                return (
                  <p
                    className="community-rule"
                    key={`${index + 1}. ${rule}`}
                  >{`${index + 1}. ${rule}`}</p>
                );
              })}
            </div>
          </div>
        ) : null}
        <div className="box">
          <div className="title">
            <p>Email digest</p>
          </div>
          <InputWithLabelAndTooltip
            type="text"
            inputValue={email}
            placeHolder="Your email"
            onInputValueChange={e => setEmail(e.target.value)} />
          <button onClick={handleSubscribe}>Subscribe</button>
        </div>
        {props.community.OpenPositions &&
          props.community.OpenPositions.length > 0 ? (
          <div className="box">
            <div className="title">
              <p>Positions opened</p>
            </div>
            <div className={"positions"}>
              {props.community.OpenPositions.map((position) => {
                return (
                  <div className="position" key={`${position}-position`}>
                    <p>{position}</p>
                    <b className="clickable" onClick={() => applyTo(position)}>
                      Apply
                    </b>
                  </div>
                );
              })}
            </div>
          </div>
        ) : null}
        <Dialog
          className="modalCreateModal"
          open={openModalOpenPosition}
          onClose={handleCloseModalOpenPosition}
          fullWidth={true}
          maxWidth={"md"}
        >
          <OpenPosition
            onCloseModal={handleCloseModalOpenPosition}
            position={selectedPosition}
          />
        </Dialog>
      </div>
    );
  else return null;
}
