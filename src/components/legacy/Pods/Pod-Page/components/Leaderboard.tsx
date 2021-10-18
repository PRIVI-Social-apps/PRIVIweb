import React, { useState, useRef, useEffect } from "react";
import "./Leaderboard.css";
import URL from "shared/functions/getURL";
import axios from "axios";
import { LoadingWrapper } from "shared/ui-kit/Hocs";

/*NOTES:
I am guessing that each pod firebase doc contains a leaderbord as a list with:
  -user id
  -tokens held
from the user id will check the user doc from firebase and obtain:
  -name
  -image url
  -creds (i'm guessing it will be stored there aswell as a list)
  -badges (i'm guessing it will be stored there aswell as a list)

So if any of this fields is changed or stored differently consider it may not work.
Let me know if you need any help with the UI (marta)
*/

const sampleData = [
  {
    User: "Px04ef761d-2857-4b00-a6db-f6a8c47244af",
    TokensHeld: 1200,
  },
  {
    User: "Px2724ac32-c0eb-43f0-b2ea-49e84480d670",
    TokensHeld: 1113,
  },
  {
    User: "Px397a7c3e-76c5-453e-b27e-134642e3fd5c",
    TokensHeld: 1004,
  },
  {
    User: "Px81c9b56b-262f-437d-9ada-37fdcb5ea154",
    TokensHeld: 399,
  },
  {
    User: "bubcg8rjfrvln6ve44s0bubcg8rjfrvln6ve44sg",
    TokensHeld: 151,
  },
  {
    User: "budse1bjfrvln6ve4600budse1bjfrvln6ve460g",
    TokensHeld: 120,
  },
  {
    User: "budse1bjfrvln6ve4600budse1bjfrvln6ve460g",
    TokensHeld: 90,
  },
  {
    User: "budsjvbjfrvln6ve4630budsjvbjfrvln6ve463g",
    TokensHeld: 83,
  },
  {
    User: "budtldbjfrvln6ve4660budtldbjfrvln6ve466g",
    TokensHeld: 78,
  },
  {
    User: "budtlfbjfrvln6ve4690budtlfbjfrvln6ve469g",
    TokensHeld: 52,
  },
  {
    User: "budtlgrjfrvln6ve46c0budtlgrjfrvln6ve46cg",
    TokensHeld: 20,
  },
];

export default function Leaderboard(props) {
  const [sortedList, setSortedList] = useState<any[]>([]);
  const [expand, setExpand] = useState<boolean>(false);

  useEffect(() => {
    if (sampleData) {
      const leaderboardSorted = [...sampleData];
      leaderboardSorted.sort((a, b) => b.TokensHeld - a.TokensHeld);

      setSortedList(leaderboardSorted);
    }
    //to be changed by:
    /*if (props.pod && props.pod.Leaderboard.length > 0) {
      const leaderboardSorted = [...props.pod.Leaderboard];
      leaderboardSorted.sort((a, b) => b.TokensHeld - a.TokensHeld);

      setSortedList(leaderboardSorted);
    }*/
  }, [props.pod]);

  if (sortedList && sortedList.length > 0)
    return (
      <div className="leaderboard">
        <h3>Top profiles</h3>
        <div className="leaderboard-list">
          <div className="header">
            <p className="user">{""}</p>
            <p>CRED</p>
            <p>BADGES</p>
            <p>TOKENS HELD</p>
            <p>{""}</p>
          </div>
          <div className="body">
            {sortedList.map((row, index) =>
              expand || (!expand && index < 5) ? (
                <ListElement row={row} index={index} key={`${index}-leaderboard`} />
              ) : null
            )}
          </div>
          <div
            className="expand clickable"
            onClick={() => {
              setExpand(!expand);
            }}
          >
            {!expand ? "Expand" : "Close"}
          </div>
        </div>
      </div>
    );
  else return null;
}

const ListElement = props => {
  const [userInfo, setUserInfo] = useState<any>({
    name: "",
    imageURL: "",
    creds: 0,
    badges: "",
  });
  const [isDataLoading, setIsDataLoading] = useState<boolean>(false);

  useEffect(() => {
    if (props.row) {
      getBasicInfo(props.row.User);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getBasicInfo = userId => {
    let user = {} as any;
    setIsDataLoading(true);
    axios
      .get(`${URL()}/user/getBasicInfo/${userId}`)
      .then(response => {
        if (response.data.success) {
          let data = response.data.data;
          user.name = data.name;
          user.badges = data.badges && data.badges.length > 0 ? data.badges.length : 0;
          user.creds = data.creds ? data.creds : 0;
          if (data.hasPhoto) {
            try {
              if (user.url) {
                user.imageURL = `${user.url}?${Date.now()}`;
              }
            } catch (e) {
              console.log(e);
            }
          } else if (data.anon === true && data.anonAvatar && data.anonAvatar.length > 0) {
            user.imageURL = `${require(`assets/anonAvatars/${data.anonAvatar}.png`)}`;
          } else user.imageURL = "";
          setUserInfo(user);
        }
        setIsDataLoading(false);
      })
      .catch(error => {
        console.log(error);
        setIsDataLoading(false);
      });
  };

  const handleGiveCred = () => {
    //TODO: give Cred (user Id comes from props.row.User)
  };

  const handleGiveSalute = () => {
    //TODO: give Salute (user Id comes from props.row.User)
  };

  if (props.row) {
    return (
      <div className="row">
        <LoadingWrapper loading={isDataLoading}>
          <>
            <div className="user">
              <p>{props.index + 1}</p>
              <div
                className="user-image"
                style={{
                  backgroundImage:
                    userInfo.imageUrl && userInfo.imageUrl.length > 0 ? `url(${userInfo.imageUrl})` : "none",
                  backgroundRepeat: "no-repeat",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              />
              <p>{userInfo.name}</p>
            </div>
            <p>{`${userInfo.creds}`}</p>
            <p>{`${userInfo.badges.toLocaleString()}`}</p>
            <p>{`${props.row.TokensHeld.toLocaleString()}`}</p>
            <div className="buttons">
              <button onClick={handleGiveCred}>Give cred</button>
              <button onClick={handleGiveSalute}>Give salute</button>
            </div>
          </>
        </LoadingWrapper>
      </div>
    );
  } else return null;
};
