import MainPageContext from "components/legacy/Media/context";
import React, { useContext, useEffect, useState } from "react";
import {
  PrimaryButton,
  SecondaryButton,
  Modal,
  grid,
  Divider,
  Header3,
  Header5,
  HeaderBold4,
} from "shared/ui-kit";
import styled from "styled-components";
import { RootState } from "store/reducers/Reducer";
import { useSelector } from "react-redux";

type PayDisplayMediaModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onAccept: () => void;
  setIsVipAccess: any;
};

export const PayDisplayMediaModal: React.FunctionComponent<PayDisplayMediaModalProps> = ({
  isOpen,
  onClose,
  onAccept,
  setIsVipAccess,
}) => {
  const { selectedMedia } = useContext(MainPageContext);
  const userBalances = useSelector((state: RootState) => state.userBalances);
  const [hasAccess, setHasAccess] = useState<boolean>(true);

  useEffect(() => {
    setHasAccess(false);
    if (selectedMedia && userBalances && Object.keys(userBalances).length > 0) {
      if (selectedMedia.ExclusivePermissions) {
        const conditionList = selectedMedia.ExclusivePermissionsList ?? [];
        let newHasAccess = true;
        for (let i = 0; i < conditionList.length && newHasAccess; i++) {
          const condition = conditionList[i];
          if (condition.Token && condition.Quantity) {
            if (!userBalances[condition.Token] || userBalances[condition.Token].Balance < condition.Quantity)
              newHasAccess = false;
          }
        }

        setHasAccess(newHasAccess);
      }
    }
  }, [selectedMedia, userBalances]);

  const [exclusivePermissionInfo, setExclusivePermissionInfo] = useState("");

  useEffect(() => {
    let exclusivePermissionStr = "";
    if (selectedMedia.ExclusivePermissions) {
      const listLength = selectedMedia.ExclusivePermissionsList.length;
      switch (listLength) {
        case 0:
          break;
        case 1:
          exclusivePermissionStr = `${selectedMedia.ExclusivePermissionsList[0].Quantity} ${selectedMedia.ExclusivePermissionsList[0].Token}`;
          break;
        case 2:
          exclusivePermissionStr = `${selectedMedia.ExclusivePermissionsList[0].Quantity} ${selectedMedia.ExclusivePermissionsList[0].Token}`;
          exclusivePermissionStr += " and ";
          exclusivePermissionStr += `${selectedMedia.ExclusivePermissionsList[1].Quantity} ${selectedMedia.ExclusivePermissionsList[1].Token}`;
          break;
        default:
          for (let i = 0; i < listLength - 3; i++) {
            exclusivePermissionStr += `${selectedMedia.ExclusivePermissionsList[i].Quantity} ${selectedMedia.ExclusivePermissionsList[i].Token}, `;
          }
          exclusivePermissionStr += `${selectedMedia.ExclusivePermissionsList[listLength - 2].Quantity} ${
            selectedMedia.ExclusivePermissionsList[listLength - 2].Token
          } and `;
          exclusivePermissionStr += `${selectedMedia.ExclusivePermissionsList[listLength - 1].Quantity} ${
            selectedMedia.ExclusivePermissionsList[listLength - 1].Token
          }`;
          break;
      }

      setExclusivePermissionInfo(exclusivePermissionStr);
    }
  }, []);

  return (
    <Modal size="small" isOpen={isOpen} onClose={onClose}>
      <ModalHeader>Display Media</ModalHeader>
      <div style={{ display: "flex", width: "100%", justifyContent: "space-between" }}>
        {selectedMedia.QuickCreation && selectedMedia.ViewConditions  ? (
          <div style={{ width: "50%" }}>
            {selectedMedia.ViewConditions && selectedMedia.ViewConditions.ViewingType === "DYNAMIC" ? (
              <Header5>Price per second</Header5>
            ) : (
              <Header5>Price</Header5>
            )}
            <HeaderBold4>{selectedMedia.price}</HeaderBold4>
          </div>
        ) : null}
        {!selectedMedia.QuickCreation ? (
          <div style={{ width: "50%" }}>
            <Header5>Price</Header5>
            <HeaderBold4>{selectedMedia.price}</HeaderBold4>
          </div>
        ) : null}

        {selectedMedia.ExclusivePermissions && (
          <div style={{ width: "50%" }}>
            <Header5>VIP access</Header5>
            <p>If you have {exclusivePermissionInfo}, you can access this and many other contents for free.</p>
          </div>
        )}
      </div>
      <Divider />
      <div style={{ display: "flex", width: "100%", justifyContent: "space-between" }}>
        <SecondaryButton size="medium" onClick={onClose}>
          Cancel
        </SecondaryButton>
        {hasAccess ? (
          <PrimaryButton
            size="medium"
            onClick={() => {
              onAccept();
              setIsVipAccess(true);
            }}
          >
            Enter now
          </PrimaryButton>
        ) : (
          <PrimaryButton size="medium" onClick={onAccept}>
            {selectedMedia.Type?.toUpperCase().includes("DIGITAL") ? "Display" : "Play"}
          </PrimaryButton>
        )}
      </div>
    </Modal>
  );
};

const ModalHeader = styled(Header3)`
  margin-bottom: ${grid(6)};
`;
