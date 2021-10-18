import React, { useEffect, useState } from "react";

import { makeStyles } from "@material-ui/core";

import AvatarImage from "assets/anonAvatars/ToyFaces_Colored_BG_111.jpg";
import { useSelector } from "react-redux";
import { RootState } from "store/reducers/Reducer";
import { DAOButton } from "components/PriviDAO/components/DAOButton";
import Box from "shared/ui-kit/Box";
import Avatar from "shared/ui-kit/Avatar";

const useStyles = makeStyles(theme => ({
  container: {
    display: "flex",
    alignItems: "center",
    padding: "25px 0px",
    justifyContent: "space-between",
    borderBottom: "1px solid #ffffff75",
    "& button": {
      margin: "0px !important",
    },
    "& > div:first-child > div:first-child > div": {
      border: "2px solid #FFFFFF",
    },
    "& > div:first-child  img": {
      border: "2px solid #FFFFFF",
    },
  },
}));

export default function MemberItem({ member }) {
  const classes = useStyles();

  const users = useSelector((state: RootState) => state.usersInfoList);

  const [user, setUser] = useState<any>({});

  useEffect(() => {
    let userFound = users.find(
      user => user.address === member.Address || user.wallets.find(w => w.address === member.Address)
    );

    setUser(userFound);
  }, []);

  return (
    <div className={classes.container}>
      <Box display="flex" alignItems="center">
        <Avatar image={user && user.url ? user.url : AvatarImage} rounded size={32} />
        <Box color="white" ml={2}>
          {user?.urlSlug ?? user?.name}
        </Box>
      </Box>
      {
        <DAOButton insideCard onClick={() => {}}>
          Follow
        </DAOButton>
      }
    </div>
  );
}
