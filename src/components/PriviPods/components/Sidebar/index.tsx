import React from "react";
import { useHistory } from "react-router-dom";

import AppSidebar from "shared/ui-kit/PriviAppSidebar";

import styles from "shared/ui-kit/PriviAppSidebar/index.module.css";
import { styles as useStyles } from "./index.styles";
import CreatePodModal from "components/PriviPods/modals/CreatePodModal/CreatePodModal";
import CreateClaimablePodModal from "components/PriviPods/modals/claimable/CreateClaimablePodModal";

const TABS = {
  Home: { name: "Home", url: "" },
  MyPods: { name: "My Pods", url: "my-pods" },
  Following: { name: "Following", url: "following" },
  MediaPod: { name: "Media Pods", url: "media-pods" },
  ClaimMusic: { name: "Claim Music", url: "claim-music" },
  ClaimVideo: { name: "Claim Video", url: "claim-video" },
  Fractions: { name: "Fractions", url: "fractions" },
};

export default function Sidebar() {
  return <AppSidebar child={<SidebarContent />} theme="music" />;
}

const SidebarContent = () => {
  const classes = useStyles();
  const history = useHistory();

  const [openCreateModal, setOpenCreateModal] = React.useState<boolean>(false);
  const [openCreateClaimableSongModal, setOpenCreateClaimableSongModal] = React.useState<boolean>(false);

  const getActiveIndex = () => {
    let result = 0;
    Object.values(TABS).map((value, index) => {
      if (value.url && window.location.href.includes(value.url)) {
        result = index;
      }
    });

    return result;
  };

  return (
    <div className={styles.content}>
      <div className={styles.options}>
        <ul className={classes.options}>
          {Object.keys(TABS).map((key, index) => (
            <li
              key={`option-${index}`}
              className={index === getActiveIndex() ? styles.selected : undefined}
              onClick={() => {
                history.push(`/new-privi-pods/${TABS[key].url}`);
              }}
            >
              {TABS[key].name}
            </li>
          ))}
        </ul>
        <ul>
          <li className={classes.createPod} onClick={() => setOpenCreateModal(true)}>
            <img src={require("assets/icons/plus-small.svg")} className={classes.createImg} alt="plus" />
            <span className={classes.createText}>Create Pod</span>
          </li>
          <li className={classes.createPod} onClick={() => setOpenCreateClaimableSongModal(true)}>
            <img src={require("assets/icons/plus-small.svg")} className={classes.createImg} alt="plus" />
            <span className={classes.createText}>Create Claimable Song</span>
          </li>
        </ul>
      </div>

      <a>Download Privi Music App</a>
      {openCreateModal && (
        <CreatePodModal
          onClose={() => setOpenCreateModal(false)}
          type={"Digital NFT"}
          handleRefresh={() => {}}
          open={openCreateModal}
        />
      )}
      {openCreateClaimableSongModal && (
        <CreateClaimablePodModal
          open={openCreateClaimableSongModal}
          handleClose={() => setOpenCreateClaimableSongModal(false)}
        />
      )}
    </div>
  );
};
