import React, { useState, useEffect } from "react";

import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import Grow from "@material-ui/core/Grow";
import Paper from "@material-ui/core/Paper";
import Popper from "@material-ui/core/Popper";
import MenuItem from "@material-ui/core/MenuItem";
import MenuList from "@material-ui/core/MenuList";

import Box from "shared/ui-kit/Box";
import { DownArrowIcon } from "../Icons/SvgIcons";
import { voteSortStyles } from "./index.styles";

export default function CustomPopup({ items, label = "", value, onSelect, theme = "light" }) {
  const classes = voteSortStyles();

  const [open, setOpen] = useState(false);

  const anchorRef = React.useRef<HTMLDivElement>(null);

  const handleToggle = () => {
    setOpen(prevOpen => !prevOpen);
  };

  const handleClose = (event: React.MouseEvent<EventTarget>) => {
    if (anchorRef.current && anchorRef.current.contains(event.target as HTMLElement)) {
      return;
    }

    setOpen(false);
  };

  function handleListKeyDown(event: React.KeyboardEvent) {
    if (event.key === "Tab") {
      event.preventDefault();
      setOpen(false);
    }
  }

  // return focus to the button when we transitioned from !open -> open
  const prevOpen = React.useRef(open);
  useEffect(() => {
    if (prevOpen.current === true && open === false) {
      anchorRef.current!.focus();
    }

    prevOpen.current = open;
  }, [open]);

  return (
    <div ref={anchorRef} className={classes.content} onClick={handleToggle}>
      {label && (
        <Box color={theme !== "light" ? "#ffffff" : "#2D3047"} fontSize={12} fontWeight={600} mr="10px">
          {label}
        </Box>
      )}
      <Box color={theme === "light" ? "#ffffff" : "#2D3047"} className={classes.popUpSection}>
        {value}
      </Box>
      <div>
        <DownArrowIcon color={theme === "light" ? "#ffffff" : "#2D3047"} />
        <Popper
          className={classes.popUpMenu}
          open={open}
          anchorEl={anchorRef.current}
          role={undefined}
          transition
          disablePortal
        >
          {({ TransitionProps, placement }) => (
            <Grow
              {...TransitionProps}
              style={{ transformOrigin: placement === "bottom" ? "center top" : "center bottom" }}
            >
              <Paper className={classes.popUpMenuContent}>
                <ClickAwayListener onClickAway={handleClose}>
                  <MenuList autoFocusItem={open} id="menu-list-grow" onKeyDown={handleListKeyDown}>
                    {items.map((item, index) => (
                      <MenuItem
                        onClick={e => {
                          onSelect(item);
                          handleClose(e);
                        }}
                        key={index}
                      >
                        {item}
                      </MenuItem>
                    ))}
                  </MenuList>
                </ClickAwayListener>
              </Paper>
            </Grow>
          )}
        </Popper>
      </div>
    </div>
  );
}
