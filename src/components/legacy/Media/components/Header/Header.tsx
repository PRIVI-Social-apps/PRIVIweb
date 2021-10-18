import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { RootState } from "store/reducers/Reducer";
import styles from "./Header.module.scss";
import { UserAvatar } from "shared/ui-kit/UserAvatar/UserAvatar";
import SignInModal from "../../../../Login/SignInModal";

export const Header: React.FunctionComponent = () => {
  const [openSignInModal, setOpenSignInModal] = useState<boolean>(false);
  const user = useSelector((state: RootState) => state.user);
  const history = useHistory();

  const isSignedIn = () => {
    return !!sessionStorage.getItem("token");
  };

  return (
    <div className={styles.root}>
      <div className={styles.title}>PRIVI</div>
      <div className={styles.buttons}>
        {isSignedIn() ? (
          <UserAvatar
            user={user}
            onClick={() => {
              history.push(`/profile/${user.id}`);
            }}
          />
        ) : (
          <button
            onClick={() => setOpenSignInModal(true)}
          >
            Sign In
          </button>
        )}
      </div>
      <SignInModal
        open={openSignInModal}
        handleClose={() => setOpenSignInModal(false)}
      />
    </div>
  );
};
