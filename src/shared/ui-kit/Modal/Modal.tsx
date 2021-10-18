import MuiModal from "@material-ui/core/Modal";
import React from "react";
import styled from "styled-components";
import { BorderRadius, Color, grid } from "../../constants/const";
import { ReactComponent as CloseIcon } from "assets/icons/close.svg";

type ModalSize = "small" | "medium" | "daoMedium";

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  showCloseIcon?: boolean;
  size: ModalSize;
  className?: string;
  theme?: "dark" | "light";
  wrapperPadding?: string;
};

export const Modal: React.FunctionComponent<ModalProps> = React.memo(
  ({ isOpen, onClose, size, children, className, showCloseIcon, theme, wrapperPadding }) => (
    <MuiModal open={isOpen} onClose={onClose}>
      <ModalWrapper>
        <ModalContent theme={theme} size={size} className={className} style={{ position: "relative" }} wrapperPadding={wrapperPadding || ''}>
          {showCloseIcon && <CloseButton onClick={onClose} />}
          {children}
        </ModalContent>
      </ModalWrapper>
    </MuiModal>
  )
);

const ModalWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: ${grid(4)};
  min-height: 100vh;
  @media (max-width: 600px) {
    padding: ${grid(4)} ${grid(1)};;
  }
`;

const ModalContent = styled.div<{ size: ModalSize, wrapperPadding?: string }>`
  width: ${p => "100%"};
  max-width: ${p => MODAL_MAX_WIDTH[p.size]}px;
  border-radius: ${p => (p.theme === "dark" ? 0 : BorderRadius.XL)};
  background-color: ${p => (p.theme === "dark" ? "#1A1B1C" : Color.White)};
  overflow: auto;
  padding: ${p => p.wrapperPadding ? p.wrapperPadding : grid(4)};
  max-height: 95vh;
  color: ${p => (p.theme === "dark" ? "white" : "#181818")};
`;

const CloseButton = styled(CloseIcon)`
  position: absolute;
  cursor: pointer;
  right: ${grid(3)};
  top: ${grid(3)};
  width: 14px;
  height: 14px;
  color: ${p => (p.theme === "dark" ? Color.White : Color.GrayDark)};
`;

const MODAL_MAX_WIDTH: { [key in ModalSize]: number } = {
  small: 520,
  daoMedium: 755,
  medium: 1040,
};
