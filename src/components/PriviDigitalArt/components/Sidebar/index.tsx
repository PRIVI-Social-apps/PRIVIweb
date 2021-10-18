import React, { useContext, useState } from "react";
import { useHistory } from "react-router-dom";

import styles from "shared/ui-kit/PriviAppSidebar/index.module.css";
import DigitalArtContext from "shared/contexts/DigitalArtContext";
import { useTypedSelector } from "store/reducers/Reducer";
import CreateMediaModal from "components/legacy/Media/modals/CreateMediaModal";
import AppSidebar from "shared/ui-kit/PriviAppSidebar";
import { SellModal } from "components/legacy/Media/Marketplace/modals/SellModal";

enum OpenType {
  Home = "HOME",
  Explore = "EXPLORE",
  Liked = "LIKED",
  Search = "SEARCH",
  Marketplace = "MARKETPLACE",
}

const TABS = {
  Home: "HOME",
  Explore: "EXPLORE",
  Liked: "LIKED CONTENT",
  Search: "SEARCH",
  Marketplace: "MARKETPLACE",
};

export default function Sidebar({ handleRefresh }) {
  return <AppSidebar child={<SidebarContent handleRefresh={handleRefresh} />} theme="art" />;
}

const SidebarContent = ({ handleRefresh }) => {
  const user = useTypedSelector(state => state.user);
  const history = useHistory();

  const { openTab, setOpenTab } = useContext(DigitalArtContext);

  const [openCreateContentModal, setOpenCreateContentModal] = useState<boolean>(false);
  const [openSellStartAuctionModal, setOpenSellStartAuctionModal] = useState<boolean>(false);

  const handleOpenCreateContentModal = () => {
    setOpenCreateContentModal(true);
  };
  const handleOpenSellStartAuctionModal = () => {
    setOpenSellStartAuctionModal(true);
  };
  const handleCloseCreateContentModal = () => {
    setOpenCreateContentModal(false);
  };
  const handleCloseSellStartAuctionModal = () => {
    setOpenSellStartAuctionModal(false);
  };

  return (
    <div className={styles.content}>
      <div className={styles.options}>
        <ul>
          {Object.keys(TABS).map((key, index) => (
            <li
              key={`option-${index}`}
              className={openTab && OpenType[key] === openTab.type ? styles.selected : undefined}
              onClick={() => {
                setOpenTab({
                  type: OpenType[key],
                  id: key === "Artist" ? user.id : undefined,
                });
                history.push("/privi-digital-art");
              }}
            >
              {TABS[key]}
            </li>
          ))}
        </ul>
        <ul>
          <li
            onClick={
              openTab && openTab.type === OpenType.Marketplace
                ? handleOpenSellStartAuctionModal
                : handleOpenCreateContentModal
            }
          >
            <img src={require("assets/icons/add_green.png")} alt="create content" />
            <span style={{ color: "#DDFF57", fontWeight: 400 }}>
              {openTab && openTab.type === OpenType.Marketplace ? "Sell Content" : "Create Content"}
            </span>
          </li>
        </ul>
      </div>

      <CreateMediaModal
        open={openCreateContentModal}
        handleClose={handleCloseCreateContentModal}
        handleRefresh={handleRefresh}
      />
      <SellModal open={openSellStartAuctionModal} onClose={handleCloseSellStartAuctionModal} />
    </div>
  );
};
