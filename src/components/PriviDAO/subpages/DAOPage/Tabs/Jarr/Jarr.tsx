import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

// import "./Jarr.css";
import { RootState } from "store/reducers/Reducer";
import Discord from "shared/ui-kit/Page-components/Discord/Discord";
import { TitleGrandLight } from "../../index.styles";

const arePropsEqual = (prevProps, currProps) => {
  return prevProps.community === currProps.community;
};

const Jarr = React.memo((props: any) => {
  const userSelector = useSelector((state: RootState) => state.user);
  const users = useSelector((state: RootState) => state.usersInfoList);

  const [userIsInCommunity, setUserIsInCommunity] = useState<boolean>(false);

  useEffect(() => {
    let isInCommunity: boolean = false;
    if (props.community) {
      if (props.community.Creator && props.community.Creator === userSelector.id) {
        isInCommunity = true;
      }

      let members: any[] = [];
      let treasurers: any[] = [];
      let founders: any[] = [];

      if (props.community.MembersMap) {
        members = Object.keys(props.community.MembersMap || {}) || [];
      }
      if (props.community.TreasurersMap) {
        treasurers = Object.keys(props.community.TreasurersMap || {}) || [];
      }
      if (props.community.FoundersMap) {
        founders = Object.keys(props.community.FoundersMap || {}) || [];
      }

      if (members && members.length > 0) {
        let indexMemberV2 = members.findIndex(address => address === userSelector.address);
        if (indexMemberV2 !== -1) {
          isInCommunity = true;
        }
      }

      if (treasurers && treasurers.length > 0) {
        let indexTreasurerV2 = treasurers.findIndex(address => address === userSelector.address);
        if (indexTreasurerV2 !== -1) {
          isInCommunity = true;
        }
      }

      if (founders && founders.length > 0) {
        let indexFounderV2 = founders.findIndex(address => address === userSelector.address);
        if (indexFounderV2 !== -1) {
          isInCommunity = true;
        }
      }

      if (props.community.Admins && props.community.Admins.length > 0) {
        let indexAdmin = props.community.Admins.findIndex(admin => admin.userId === userSelector.id);
        if (indexAdmin !== -1) {
          isInCommunity = true;
        }
      }

      if (props.community.Members && props.community.Members.length > 0) {
        let indexMember = props.community.Members.findIndex(member => member.id === userSelector.id);
        if (indexMember !== -1) {
          isInCommunity = true;
        }
      }

      if (props.community.UserRoles) {
        let userRolesKeys = Object.keys(props.community.UserRoles);
        for (let userRole of userRolesKeys) {
          if (props.community.UserRoles[userRole] && props.community.UserRoles[userRole].role) {
            let rolesArray = Object.keys(props.community.UserRoles[userRole].role);
            for (let role of rolesArray) {
              if (
                props.community.UserRoles[userRole].role[role] &&
                props.community.UserRoles[userRole].role[role] === "Accepted"
              ) {
                isInCommunity = true;
              }
            }
          }
        }
      }

      setUserIsInCommunity(isInCommunity);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {userIsInCommunity && users && users.length > 0 ? (
        <Discord
          discordId={props.community.JarrId}
          sidebar={false}
          type={"Community-Jar"}
          id={props.community.id}
          community={props.community}
          showAll={false}
          theme="dark"
        />
      ) : (
        <TitleGrandLight fontSize="14px">Join Community to see Community Jarr</TitleGrandLight>
      )}
    </>
  );
}, arePropsEqual);

export default Jarr;
