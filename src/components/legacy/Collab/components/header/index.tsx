import React from "react";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { RootState } from "store/reducers/Reducer";
import Buttons from "shared/ui-kit/Buttons/Buttons";
import styled from 'styled-components';
import {IconPrivi} from "shared/ui-kit/Icons";
import { UserAvatar } from "shared/ui-kit/UserAvatar/UserAvatar";

const Wrapper = styled.div`
	padding: 0;
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: space-between;
	height: 115px;
	max-height: 115px;
	border-bottom: 1px solid #181818;;
	font-family: Agrandir, sans-serif;
	font-weight: normal;
  h2 img {
    cursor: pointer;
    vertical-align: top;
    margin-left: 2px;
    width: 14px;
    height: 14px;
  }
  .main-info,
  .buttons,
  .buttons button {
    display: flex;
    flex-direction: row;
    align-items: center;
  }

`;

const CollabTitle = styled.h2`
 color: #000;
 svg {
    width: 100%;
    max-width: 70px;
 }
`;

const CollabButtons = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`


export const CollabHeader = () => {
  const history = useHistory();
  const user = useSelector((state: RootState) => state.user);

  const isSignedIn = () => {
    return !!sessionStorage.getItem("token");
  };

  return (
    <Wrapper className={'header'}>
      <CollabTitle>
        <IconPrivi/>
      </CollabTitle>
      <CollabButtons>
        {isSignedIn() ? (
          <UserAvatar
            user={user}
            onClick={() => {
              history.push(`/profile/${user.id}`);
            }}
          />
        ) : (
          <Buttons/>
        )}
      </CollabButtons>
    </Wrapper>
  )
}
