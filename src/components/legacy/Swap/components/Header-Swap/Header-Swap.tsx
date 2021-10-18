import React from 'react';
import { useHistory } from "react-router-dom";
import { useTypedSelector } from "store/reducers/Reducer";
import './Header-Swap.css';

import Buttons from 'shared/ui-kit/Buttons/Buttons';
import { UserAvatar } from "shared/ui-kit/UserAvatar/UserAvatar";

const HeaderSwap = (props: any) => {
  const user = useTypedSelector((state) => state.user);
  const history = useHistory();
  const isSignedIn = () => {
    return !!sessionStorage.getItem("token");
  };
  return (
    <div className="headerPriviSwap">
      <div className="headerLabelPriviSwap">{props.title}</div>
      <div className="headerOptionsPriviSwap">
        {isSignedIn() ? (
          <UserAvatar
            user={user}
            onClick={() => {
              history.push(`/profile/${user.id}`);
            }}
          />
        ) : (
          <Buttons />
        )}
      </div>
    </div>
  );
};

export default HeaderSwap;
