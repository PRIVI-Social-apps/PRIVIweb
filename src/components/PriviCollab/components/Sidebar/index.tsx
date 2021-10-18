import React, { useContext } from "react";

import styles from "shared/ui-kit/PriviAppSidebar/index.module.css";
import AppSidebar from "shared/ui-kit/PriviAppSidebar";
import { FontSize, PrimaryButton, Text } from "shared/ui-kit";
import Box from 'shared/ui-kit/Box';
import PriviCollabContext from "shared/contexts/PriviCollabContext";
import { useCommonStyles } from "../../index.styles";
import { sideBarStyles } from './index.styles'

const TABS = {
  Discover: "Discover",
  MyCollabs: "My Collabs",
  Requested: "Requested",
  Accepted: "Accepted"
};

enum OpenType {
  Discover = "Discover",
  MyCollabs = "My Collabs",
  Requested = "Requested",
  Accepted = "Accepted"
}

export default function Sidebar() {
  return <AppSidebar child={<SidebarContent />} theme="collab" />;
}

const SidebarContent = () => {
  const classes = sideBarStyles();
  const commonClasses = useCommonStyles();

  const { openTab, setOpenTab, setOpenCreateModal } = useContext(PriviCollabContext);

  return (
    <div className={styles.content}>
      <div className={styles.options}>
        <ul>
          {Object.keys(TABS).map((key, index) => (
            <li
              key={`option-${index}`}
              className={classes.menuItem}
              onClick={() => {
                setOpenTab(OpenType[key]);
              }}
            >
              {key === TABS.Discover ?
                <DiscoverIcon color={openTab === OpenType[key] ? "#4218B5" : "#A5AFC6"} />
                :
                <NavIcon color={openTab === OpenType[key] ? "#4218B5" : "#A5AFC6"} />
              }
              <Text size={FontSize.L} className={openTab === OpenType[key] ? classes.selected : undefined}>{TABS[key]}</Text>
            </li>
          ))}
        </ul>
        <Box pl={2}>
          <PrimaryButton
            size="medium"
            className={`${commonClasses.button} ${commonClasses.brownButton}`}
            onClick={() => setOpenCreateModal(true)}
          >
            Create Collab +
          </PrimaryButton>
        </Box>
      </div>
    </div>
  );
};

export const DiscoverIcon = ({ color }) => (
  <svg width="23" height="23" viewBox="0 0 23 23" fill="none">
    <path fillRule="evenodd" clipRule="evenodd" d="M11.416 22.5C17.4911 22.5 22.416 17.5751 22.416 11.5C22.416 5.42487 17.4911 0.5 11.416 0.5C5.34088 0.5 0.416016 5.42487 0.416016 11.5C0.416016 17.5751 5.34088 22.5 11.416 22.5ZM13.6628 13.0287L16.6969 7.30798C17.0904 6.61324 16.3034 5.82625 15.6087 6.21975L9.88891 9.25389C9.58767 9.41674 9.33257 9.67092 9.17064 9.97216L6.13649 15.6919C5.74299 16.3867 6.52999 17.1511 7.22473 16.7802L12.9445 13.7469C13.2457 13.5841 13.5008 13.3299 13.6628 13.0287Z" fill={color} />
  </svg>
)

export const NavIcon = ({ color }) => (
  <svg width="23" height="23" viewBox="0 0 23 23" fill="none">
    <circle cx="6.23364" cy="6.85303" r="3.95215" fill={color} />
    <circle cx="6.2334" cy="16.4219" r="3.95215" fill={color} />
    <circle cx="16.2124" cy="6.85303" r="3.95215" fill={color} />
    <path d="M12.291 12.5044H16.2258C18.399 12.5044 20.1606 14.2661 20.1606 16.4392C20.1606 18.6123 18.399 20.374 16.2258 20.374C14.0527 20.374 12.291 18.6123 12.291 16.4392V12.5044Z" fill={color} />
  </svg>
)
