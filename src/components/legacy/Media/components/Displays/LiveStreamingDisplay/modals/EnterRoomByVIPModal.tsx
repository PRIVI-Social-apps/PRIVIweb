import React from "react";
import { Streaming, getStreamingPrice } from "shared/services/API/StreamingAPI";
import { Divider, grid, Header3, Header5, HeaderBold4, Modal, PrimaryButton } from "shared/ui-kit";
import Avatar from "shared/ui-kit/Avatar";
import styled from "styled-components";
import { getRandomAvatar } from "shared/services/user/getUserAvatar";
import { Grid } from "@material-ui/core";

type EnterRoomModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onEnterRoom: () => void;
  streaming: Streaming;
};

export const EnterRoomByVIPModal: React.FunctionComponent<EnterRoomModalProps> = ({
  isOpen,
  onClose,
  onEnterRoom,
  streaming,
}) => {
  return (
    <Modal size="small" isOpen={isOpen} onClose={onClose} showCloseIcon>
      <ModalHeader>Enter Room</ModalHeader>
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <Header5>Rewards</Header5>
          <RewardsBox style={{}}>
            {[1, 2].map(_ => (
              <Avatar image={getRandomAvatar()} rounded size={48} marginSides={2} />
            ))}
          </RewardsBox>
          <Divider />
          <Header5>Price</Header5>
          <HeaderBold4>{getStreamingPrice(streaming)}</HeaderBold4>
          <Divider />
          <PrimaryButton size="medium" onClick={onEnterRoom}>
            Enter Now
          </PrimaryButton>
        </Grid>
        <FlexGrid item xs={6}>
          <Header5>VIP access</Header5>
          <HiddenDivier />
          <DescriptionBox>
            If you have XXX amount of User Tokens, you can access this and many other User contents for free.
          </DescriptionBox>
          <HiddenDivier />
          <PrimaryButton size="medium" onClick={onEnterRoom}>
            Buy User Token
          </PrimaryButton>
        </FlexGrid>
      </Grid>
    </Modal>
  );
};

const ModalHeader = styled(Header3)`
  margin-bottom: ${grid(6)};
`;

const RewardsBox = styled("div")`
  display: flex;
  align-items: center;
`;

const DescriptionBox = styled("div")`
  text-align: start;
  flex-grow: 1;
`;

const HiddenDivier = styled(Divider)`
  opacity: 0;
`;

const FlexGrid = styled(Grid)`
  display: flex;
  flex-direction: column;
`;
