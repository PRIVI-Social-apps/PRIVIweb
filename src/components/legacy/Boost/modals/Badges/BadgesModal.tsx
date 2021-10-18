import React, { useEffect, useState } from "react";
import { AppBar, Modal, Tabs, Tab } from "@material-ui/core";
import { useSelector } from "react-redux";
import axios from "axios";

import { RootState } from "store/reducers/Reducer";
import "./BadgesModal.css";
import BadgeRow from "./BadgesRow";
import URL from "shared/functions/getURL";

export default function BadgesModal(props) {
  //store
  const userBalances = useSelector((state: RootState) => state.userBalances);
  //hooks
  const [userBadges, setUserBadges] = useState<any>([]);
  const [allBadges, setAllBadges] = useState<any[]>([]);
  const [badgesSelection, setBadgesSelection] = useState<number>(0);
  const badgesOptions = ["My Badges", "All Badges"];

  useEffect(() => {
    if (props.open) {
      axios
        .get(`${URL()}/user/badges/getAllBadges`)
        .then(res => {
          const resp = res.data;
          if (resp.success) {
            const data = resp.data;
            setAllBadges(data);

            const newUserBadges: any = [];
            data.forEach(badge => {
              if (badge.Symbol && userBalances[badge.Symbol] && userBalances[badge.Symbol].Balance)
                newUserBadges.push(badge);
            });
            setUserBadges(newUserBadges);
          }
        })
        .catch(error => {
          console.log(error);
        });
    }
    //badge should be an object with at least something like:
    //-name: string
    //-description: string
    //-level: number
    //-type: string (rare, super rare...)
    //-owners: list with users owning this badge (uId -> string)
    //-image ?? TODO
  }, [props.open, Object.keys(userBalances).length]);

  return (
    <Modal
      open={props.open}
      onClose={props.handleClose}
      aria-labelledby="simple-modal-title"
      aria-describedby="simple-modal-description"
      className="modal"
    >
      <div className="modal-content w50 badges-modal">
        <div className="exit" onClick={props.handleClose}>
          <img src={require("assets/icons/x_darkblue.png")} alt={"x"} />
        </div>
        <span>Badges</span>
        <div className="row">
          <h2>{userBadges.length}</h2>
          <h5>{`/${allBadges.length}`}</h5>
        </div>
        <AppBar position="static" className="appbar">
          <Tabs
            TabIndicatorProps={{
              style: { background: "#64c89e", height: "3px" },
            }}
            value={badgesSelection}
            onChange={(e, value) => setBadgesSelection(value)}
          >
            {badgesOptions.map(name => {
              return <Tab label={name} key={name} />;
            })}
          </Tabs>
        </AppBar>
        <div className="badges-list">
          {badgesSelection === 0 ? (
            userBadges.length > 0 ? (
              userBadges.map((badge, index) => {
                return <BadgeRow badge={badge} key={`user-badge-${index}`} />;
              })
            ) : (
              <div>No badges to show</div>
            )
          ) : allBadges.length > 0 ? (
            allBadges.map((badge, index) => {
              return <BadgeRow badge={badge} key={`all-badges-${index}`} />;
            })
          ) : (
            <div>No badges to show</div>
          )}
        </div>
      </div>
    </Modal>
  );
}
