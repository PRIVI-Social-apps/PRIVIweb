import React from "react";
import clsx from "clsx";

import { ListItem, IconButton } from "@material-ui/core";

import { ChevronIconLeft } from "shared/ui-kit/Icons";
import Box from 'shared/ui-kit/Box';
import { leftMenuSidebarStyles } from './index.styles';

const LeftMenuSidebar = ({ accordions, onToggle, expanded }) => {
  const classes = leftMenuSidebarStyles();

  const handleToggle = () => {
    onToggle(true);
  };

  const handleSelect = (item, i) => {};

  const renderToggleMenu = () => (
    <Box width={1} display="flex" justifyContent="flex-end">
      <IconButton className={classes.menuBox} onClick={handleToggle}>
        {expanded ? (
          <Box>
            <ChevronIconLeft />
          </Box>
        ) : (
          <Box style={{ transform: "rotate(180deg)" }}>
            <ChevronIconLeft />
          </Box>
        )}
      </IconButton>
    </Box>
  );

  return (
    <Box>
      {renderToggleMenu()}
      {accordions.map((item, i) => {
        let isSelected = window.location.href.includes(item.url);
        const key = `listItem-${i}`;
        return (
          <ListItem
            button
            key={key}
            className={clsx(classes.listItem, {
              [classes.listItemNormal]: !isSelected,
              [classes.listItemSelected]: isSelected,
            })}
            onClick={() => handleSelect(item, i)}
          >
            <Box className={classes.menuBox} component={item.icon} />
            <Box
              component="span"
              className={clsx(classes.menuTextNormal, {
                [classes.menuText]: expanded,
                [classes.menuTextHide]: !expanded,
                [classes.menuTextSelected]: isSelected,
              })}
            >
              {item.name}   
            </Box>
          </ListItem>
        );
      })}
    </Box>
  );
};

export default LeftMenuSidebar;
