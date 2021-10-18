import React from "react";
import styled from "styled-components";
import {ChevronIconLeft} from "shared/ui-kit/Icons/chevronIconLeft";
import { useHistory } from "react-router-dom";

const Button = styled.div`
  color: #99A1B3;
  margin-top: 50px;
  margin-bottom: 30px;
  cursor: pointer;
  font-size: 15px;
  svg {
    margin-right: 5px;
  }
`;

export const BackButton: React.FC = () => {
  const history = useHistory();

  const onClick = () => {
    history.goBack();
  }

  return (
    <Button onClick={onClick}>
      <ChevronIconLeft/>
      <span>Back</span>
    </Button>
  )
}

