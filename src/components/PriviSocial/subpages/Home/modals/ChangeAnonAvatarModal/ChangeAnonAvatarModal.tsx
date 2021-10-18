import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";

import { RootState } from "store/reducers/Reducer";
import { updateAnonAvatar } from "store/actions/User";
import URL from "shared/functions/getURL";
import { Modal, PrimaryButton } from "shared/ui-kit";
import { changeAnonAvatarModalStyles } from "./ChangeAnonAvatarModal.styles";

export default function ChangeAnonAvatarModal(props) {
  let user = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch();
  const classes = changeAnonAvatarModalStyles();

  const [avatars, setAvatars] = useState<string[]>([]);
  const [selectedAvatar, setSelectedAvatar] = useState<string>("");

  useEffect(() => {
    const a = [] as any[];

    const anonAvatars = require.context("assets/anonAvatars/", false, /.*\.jpg$/);
    anonAvatars.keys().forEach(key => {
      anonAvatars(key);
    });

    anonAvatars.keys().forEach(path => {
      let newPath = path.slice(2);
      a.push(newPath);
    });

    setAvatars(a);
  }, []);

  useEffect(() => {
    if (user.anonAvatar && user.anonAvatar.length > 0) {
      setSelectedAvatar(user.anonAvatar);
    }
  }, [user.anonAvatar]);

  const handleChangeAvatar = () => {
    //change avatar
    const body = {
      userId: user.id,
      anonAvatar: selectedAvatar,
    };

    axios
      .post(`${URL()}/user/changeAnonAvatar`, body)
      .then(response => {
        if (response.data.success) {
          console.log("changed anon avatar to " + selectedAvatar);

          //update redux data aswell
          dispatch(updateAnonAvatar(body.anonAvatar));
          props.onClose();
        } else {
          console.log("User change anon avatar failed");
        }
      })
      .catch(error => {
        console.log(error);
        //alert('Error handling anonymous avatar update');
      });
  };

  return (
    <Modal className={classes.root} isOpen={props.open} onClose={props.onClose} showCloseIcon size="medium">
      <div>
        <div className={classes.headerSection}>
          <h3>Simple avatars</h3>
        </div>
        <div className={classes.avatarList}>
          {avatars.map((avatar, index) => {
            if (index > 107)
              return (
                <div
                  key={avatar}
                  className={avatar === selectedAvatar ? classes.avatarSelected : classes.avatar}
                  style={{
                    backgroundImage: `url(${require(`assets/anonAvatars/${avatar}`)})`,
                    backgroundRepeat: "no-repeat",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                  onClick={() => setSelectedAvatar(avatar)}
                />
              );
          })}
        </div>
        <div className={classes.headerSection}>
          <h3>Women</h3>
        </div>
        <div className={classes.avatarList}>
          {avatars.map((avatar, index) => {
            if (index >= 0 && index < 49)
              return (
                <div
                  key={avatar}
                  className={avatar === selectedAvatar ? classes.avatarSelected : classes.avatar}
                  style={{
                    backgroundImage: `url(${require(`assets/anonAvatars/${avatar}`)})`,
                    backgroundRepeat: "no-repeat",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                  onClick={() => setSelectedAvatar(avatar)}
                />
              );
          })}
        </div>
        <div className={classes.headerSection}>
          <h3>Men</h3>
        </div>
        <div className={classes.avatarList}>
          {avatars.map((avatar, index) => {
            if (index >= 49 && index < 108)
              return (
                <div
                  key={avatar}
                  className={avatar === selectedAvatar ? classes.avatarSelected : classes.avatar}
                  style={{
                    backgroundImage: `url(${require(`assets/anonAvatars/${avatar}`)})`,
                    backgroundRepeat: "no-repeat",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                  onClick={() => setSelectedAvatar(avatar)}
                />
              );
          })}
        </div>
        <div className={classes.footerSection}>
          <PrimaryButton size="medium" onClick={handleChangeAvatar}>
            Update avatar
          </PrimaryButton>
        </div>
      </div>
    </Modal>
  );
}
