import React, { useEffect, useState } from "react";
import Axios from "axios";
import { useDispatch, useSelector } from "react-redux";

import URL from "shared/functions/getURL";
import { getUser } from "store/selectors";
import { socket } from "components/Login/Auth";
import { setUser } from "store/actions/User";
import { setSelectedUser } from "store/actions/SelectedUser";
import { sumTotalViews } from "shared/functions/totalViews";
import AlertMessage from "shared/ui-kit/Alert/AlertMessage";
import Header from "./components/Header";
import PriviSocialRouter from "./PriviSocialRouter";
import { priviSocialPageStyles } from "./index.styles";

export default function PriviSocial({ id }) {
  let pathName = window.location.href; // If routing changes, change to pathname
  let idUrl = pathName.split("/")[5];
  const classes = priviSocialPageStyles();

  const dispatch = useDispatch();
  const userSelector = useSelector(getUser);

  const [userProfile, setUserProfile] = useState<any>({});

  const [userId, setUserId] = React.useState<string>(id);
  const [ownUser, setOwnUser] = React.useState<boolean>(true);

  const [status, setStatus] = useState<any>("");

  const scrollRef = React.useRef<any>();

  useEffect(() => {
    let urlId;

    if (idUrl && userId !== idUrl) {
      urlId = idUrl;
      setOwnUser(
        urlId === sessionStorage.getItem("userId") ||
        urlId === userSelector?.id ||
        urlId === userSelector?.urlSlug
      );
    } else if (userId) {
      urlId = userId;
      setOwnUser(
        urlId === sessionStorage.getItem("userId") ||
        urlId === userSelector?.id ||
        urlId === userSelector?.urlSlug
      );
    }

    if (urlId && !urlId.includes("Px")) {
      Axios.get(`${URL()}/user/getIdFromSlug/${urlId}/user`)
        .then(response => {
          if (response.data.success) {
            const id = response.data.data.id;
            urlId = id;
            setUserId(urlId);
          }
        })
        .catch(error => {
          console.log(error);
        });
    } else if (urlId !== undefined) {
      setUserId(urlId);
    } else {
      setStatus({
        msg: "Error checking user id",
        key: Math.random(),
        variant: "error",
      });
    }
  }, [id, userSelector]);

  useEffect(() => {
    if (userId && userId.length > 0 && !ownUser) {
      if (socket) {
        socket.on("user_connect_status", connectStatus => {
          if (connectStatus.userId === userId) {
            let setterUser: any = { ...userProfile };
            setterUser.connected = connectStatus.connected;
            setUserProfile(setterUser);
          }
        });
      }
    }
  }, [userId, userProfile]);

  useEffect(() => {
    if (userId && userId.length > 0) {
      Axios.get(`${URL()}/user/checkIfUserExists/${userId}`)
        .then(response => {
          if (response.data.success) {
            sumTotalViews({
              userId: userId,
              ProfileAddress: true,
            });
          }
        })
        .catch(error => {
          console.log(error);
          setStatus({
            msg: "Error check if user exists",
            key: Math.random(),
            variant: "error",
          });
        });

      // BasicInfo
      getBasicInfo(userId, ownUser);
    }
  }, [userId, ownUser]);

  const setUserSelector = setterUser => {
    if (setterUser.id) {
      dispatch(setUser(setterUser));
    }
  };

  const getBasicInfo = async (userId, ownUser) => {
    if (userId) {
      try {
        const response = await Axios.get(`${URL()}/user/getBasicInfo/${userId}`);
        if (response.data.success) {
          let data = response.data.data;
          let nameSplit = data.name.split(" ");
          let lastNameArray = nameSplit.filter((_, i) => {
            return i !== 0;
          });
          let firstName = nameSplit[0];
          let lastName = "";
          for (let i = 0; i < lastNameArray.length; i++) {
            if (lastNameArray.length === i + 1) {
              lastName = lastName + lastNameArray[i];
            } else {
              lastName = lastName + lastNameArray[i] + " ";
            }
          }

          if (ownUser) {
            let setterUser: any = { ...userSelector, ...data, firstName, lastName };

            if (!setterUser.badges) {
              setterUser.badges = [];
            }
            if (!setterUser.connected) {
              setterUser.connected = false;
            }
            if (!setterUser.urlSlug) {
              setterUser.urlSlug = data.firstName ?? data.name;
            }

            setUserSelector(setterUser);
            setUserProfile(setterUser);
          } else {
            let user: any = { ...data, firstName, lastName };

            if (!user.badges) {
              user.badges = [];
            }
            if (!user.connected) {
              user.connected = false;
            }
            if (!user.urlSlug) {
              user.urlSlug = data.firstName ?? data.name;
            }

            setSelectedUser(user);
            setUserProfile(user);
          }
        }
      } catch (error) {
        setStatus({
          msg: "Error getting basic info",
          key: Math.random(),
          variant: "error",
        });
      }
    }
  };

  const toggleAnonymousMode = anonBool => {
    const body = {
      userId: userId,
      anonMode: anonBool,
    };

    Axios.post(`${URL()}/user/changeAnonMode`, body)
      .then(response => {
        if (response.data.success) {
          //update redux user aswell
          const user = { ...userSelector };
          user.anon = anonBool;
          setUserSelector(user);
          setUserProfile(user);
        } else {
          console.log("User change anon mode failed");
        }
      })
      .catch(error => {
        console.log(error);
        setStatus({
          msg: "Error handling anonymous mode update",
          key: Math.random(),
          variant: "error",
        });
      });
  };

  return (
    <div className={classes.priviSocial}>
      <Header id={userId} />
      <div className={classes.content} ref={scrollRef}>
        <PriviSocialRouter
          userId={userId}
          userProfile={userProfile}
          ownUser={ownUser}
          getBasicInfo={getBasicInfo}
          toggleAnonymousMode={toggleAnonymousMode}
          scrollRef={scrollRef}
        />
      </div>
      {status ? <AlertMessage key={status.key} message={status.msg} variant={status.variant} /> : ""}
    </div>
  );
}
