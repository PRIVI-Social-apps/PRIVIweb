import React from 'react';
import classnames from 'classnames';

import { ReactComponent as VerifiedIcon } from "assets/icons/verified.svg";
import { Avatar } from "shared/ui-kit";
import { userCardStyles } from './index.styles';

const UserCard = props => {
  const classes = userCardStyles();
  const { user, className } = props;

  return (
    <div className={classnames(classes.container, className)}>
      <div className={classes.avatar}>
        <Avatar
          size="large"
          url={
            user?.url
              ? user?.url
              : require("assets/anonAvatars/ToyFaces_Colored_BG_035.jpg")
          }
          alt=""
        />
      </div>
      <div className={classes.title}>
        Sabrina Spellman
      </div>
      <div className={classes.userName}>
        @Us3rNxtb00t
      </div>
      <div className={classes.iconContainer}>
        <VerifiedIcon className={classes.icon} />
        <span className={classes.status}>
          Verified Artist
        </span>
      </div>
    </div>
  );
};

export default UserCard;
