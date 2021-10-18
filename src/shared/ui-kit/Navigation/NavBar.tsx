import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import ScrollToTop from "../../functions/ScrollToTop";
import Sidebar from "./Sidebar";
import Routes from "shared/routes/Routes";
import { useLogin } from "shared/hooks/useLogin";
import Header from "shared/ui-kit/Header/Header";
import ChatModal from "components/legacy/Profile/components/Message/ChatModal";
import NewChatModal from "components/legacy/Profile/components/Message/NewChatModal";
import { getMessageBox } from "store/selectors/user";
import "./NavBar.css";

const NavBar = () => {
  const isLogin = useLogin();
  const messageBoxInfo = useSelector(getMessageBox);

  const pathName = window.location.href;

  const { activeChats } = messageBoxInfo;

  const [isHideSidebar, setIsHideSidebar] = useState<boolean>(false);
  const [isHideHeader, setIsHideHeader] = useState<boolean>(false);

  useEffect(() => {
    if (
      pathName.toLowerCase().includes("privi-music") ||
      pathName.toLowerCase().includes("privi-digital-art") ||
      pathName.toLowerCase().includes("privi-data-new") ||
      pathName.toLowerCase().includes("privi-dao") ||
      pathName.toLowerCase().includes("privi-wallet") ||
      pathName.toLowerCase().includes("privi-zoo") ||
      pathName.toLowerCase().includes("new-privi-pods") ||
      pathName.toLowerCase().includes("privi-social") ||
      pathName.toLowerCase().includes("privi-collab") ||
      pathName.toLowerCase().includes("privi-music-dao") ||
      pathName.toLowerCase().includes("privi-home")
    ) {
      setIsHideSidebar(true);
      setIsHideHeader(true);
    } else {
      setIsHideHeader(false);
      setIsHideSidebar(false);
    }
  }, [pathName]);

  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        minHeight: "100vh",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
        }}
      >
        <ScrollToTop />
        <div id="app-container" className="containerClassnames">
          <div className="fullPageView">
            {isLogin && !isHideSidebar && <Sidebar />}
            <main className={isLogin && !isHideSidebar ? "fullPageView-main" : ""}>
              {!isHideHeader && <Header />}
              <div className="container-fluid">
                <Routes />
                <div className="chat-modal-container">
                  {activeChats.map(chat =>
                    chat && chat.users && chat.receipientId ? (
                      <ChatModal chat={chat} key={chat.receipientId} />
                    ) : null
                  )}
                  {messageBoxInfo.openNewChatModal && <NewChatModal />}
                </div>
              </div>
            </main>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NavBar;
