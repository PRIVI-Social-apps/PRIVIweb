import { Badge, withStyles } from "@material-ui/core";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import Popper from "@material-ui/core/Popper";
import React, { forwardRef, ReactElement, useRef, useState } from "react";
import { BorderRadius, Color, Gradient, grid } from "shared/ui-kit";
import styled from "styled-components";
import { shadowDepth2 } from "shared/constants/mixins";

type ToolbarButtonWithPopperProps = {
  icon: React.ComponentType<{ isActive: boolean }>;
  tooltip: string;
  badge?: string;
  noPopup?: boolean;
  onIconClick?: () => void;
  children?: ReactElement;
  openToolbar?: boolean;
  handleOpenToolbar?: any;
  hidden?: boolean;
  theme?: "dark" | "light" | "green";
};

export const ToolbarButtonWithPopper = forwardRef<HTMLDivElement, ToolbarButtonWithPopperProps>(
  (
    {
      icon: Icon,
      tooltip,
      badge,
      noPopup,
      onIconClick,
      children,
      openToolbar,
      handleOpenToolbar,
      hidden,
      theme = "light",
    },
    ref
  ) => {
    const [isOpen, setOpen] = useState(false);
    const anchorRef = useRef<HTMLButtonElement>(null);

    return (
      <div ref={ref}>
        <ToolbarButton
          title={tooltip}
          type="button"
          onClick={() => {
            onIconClick?.();
            if (!noPopup) {
              setOpen(true);
            }

            handleOpenToolbar && handleOpenToolbar(true);
          }}
          ref={anchorRef}
        >
          {theme && theme === "green" ? (
            <StyledBadgeGreen badgeContent={badge}>
              <IconWrapper>
                <Icon isActive={isOpen} />
              </IconWrapper>
            </StyledBadgeGreen>
          ) : (
            <StyledBadge badgeContent={badge}>
              <IconWrapper>
                <Icon isActive={isOpen} />
              </IconWrapper>
            </StyledBadge>
          )}
        </ToolbarButton>
        {!noPopup && (
          <Popper
            open={openToolbar !== undefined ? openToolbar : isOpen}
            anchorEl={anchorRef.current}
            placement="bottom-end"
            style={{ zIndex: hidden ? 0 : 9999, opacity: hidden ? 0 : 1 }}
          >
            <ClickAwayListener
              onClickAway={() => {
                setOpen(false);
                handleOpenToolbar && handleOpenToolbar(false);
              }}
            >
              <PopperContainer theme={theme}>{children}</PopperContainer>
            </ClickAwayListener>
          </Popper>
        )}
      </div>
    );
  }
);

const StyledBadge = withStyles(() => ({
  badge: {
    padding: 0,
    top: "8px",
    right: "2px",
    background: Gradient.Mint,
    color: Color.White,
    fontWeight: 700,
    border: `2px solid ${Color.White}`,
  },
}))(Badge);

const StyledBadgeGreen = withStyles(() => ({
  badge: {
    padding: 0,
    top: "8px",
    right: "2px",
    background: Gradient.Green,
    color: Color.White,
    fontWeight: 700,
    border: `2px solid ${Color.White}`,
  },
}))(Badge);

const ToolbarButton = styled.button`
  background-color: transparent;
  color: black;
  height: 100%;
  width: ${grid(5)};
  padding: 0;
  margin-right: 10px;

  display: flex;
  justify-content: center;
  align-items: center;
`;

const IconWrapper = styled.div`
  height: ${grid(5)};

  display: flex;
  justify-content: center;
  align-items: center;
`;

type PopperProps = React.PropsWithChildren<{
  theme?: "dark" | "light";
}>;

const PopperContainer = styled.div<PopperProps>`
  z-index: 9999;
  margin-top: 1px;
  padding: ${grid(4)} ${grid(2)};
  width: 100%;
  max-width: ${grid(50)};
  max-height: calc(100vh - ${grid(16)});
  overflow-y: auto;
  scrollbar-width: none;

  background-color: ${p => (p.theme === "dark" ? "#1A1B1C" : Color.White)};
  border-radius: ${p =>
    p.theme === "dark"
      ? "0"
      : `0 0 ${BorderRadius.L} ${BorderRadius.L};
    ${shadowDepth2}`};
`;
