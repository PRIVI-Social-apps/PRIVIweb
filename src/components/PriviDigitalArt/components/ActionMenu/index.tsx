import React, { useState } from "react";
import { useDispatch } from "react-redux";

import { ClickAwayListener, Grow, MenuItem, MenuList, Paper, Popper, withStyles } from "@material-ui/core";

import { actionMenuStyles } from './index.styles';
import { useShareMedia } from "shared/contexts/ShareMediaContext";
import { ShareWithQRCode } from "shared/ui-kit/Modal/Modals/ShareWithQRCode";
import styled from "styled-components";
import axios from "axios";
import URL from "shared/functions/getURL";
import { useTypedSelector } from "store/reducers/Reducer";
import { setUser } from "store/actions/User";
import { gridColumnCount } from 'shared/helpers/grid';

const CustomMenuItem = withStyles({
  root: {
    fontSize: "14px",
    padding: "16px",
    fontFamily: "Agrandir",
    borderBottom: "1px solid #EBEBEB",
    display: "flex",
    alignItems: "center",
    flexDirection: "column",

    "&:last-child": {
      borderBottom: "none",
    }
  },
})(MenuItem);

type PaperProps = {
  type?: "primary" | "secondary";
};

const CustomPaper = styled(Paper)<PaperProps>`
  && {
    min-width: 200px;
    max-width: 350px;
    margin-left: ${props => (props.type === "primary" ? "-250px" : "-340px")};
    margin-top: 10px;
    border-radius: 10px;
    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
    position: inherit;
    z-index: 999;
  }
`;

export const ActionMenu = ({
  item,
  openMenu,
  anchorRef,
  handleCloseMenu,
  index = 0,
  isLeftAligned = false
}) => {
  const classes = actionMenuStyles();

  const [openQrCodeModal, setOpenQrCodeModal] = useState<boolean>(false);
  const [shareLink, setShareLink] = useState<string>('');
  const { shareMediaToSocial } = useShareMedia();
  const user = useTypedSelector(state => state.user);
  const dispatch = useDispatch();

  const getPrefixURL = () => {
    if (process.env.NODE_ENV === 'development')
      return `http://localhost:3001/#/privi-digital-art`;
    return `https://privibeta.web.app/#/privi-digital-art`;
  }

  const handleShareWithQR = () => {
    setShareLink(`${getPrefixURL()}/${item.MediaSymbol || item.id}`);
    handleCloseMenu();
    setOpenQrCodeModal(!openQrCodeModal);
  }

  const hideQRCodeModal = () => {
    setOpenQrCodeModal(false);
  }

  const handleOpenShareModal = () => {
    handleCloseMenu();
    shareMediaToSocial(item?.MediaSymbol, "Media", item.Type);
  };

  function handleListKeyDownShareMenu(e: React.KeyboardEvent) {
    if (e.key === "Tab") {
      e.preventDefault();
      handleCloseMenu();
    }
  }

  const handleUnInterested = () => {
    handleCloseMenu();
    axios
      .post(`${URL()}/user/media/uninterested/${user.id}`, { mediaId: item.MediaSymbol || item.id })
      .then(response => {
        if (response.data.success) {
          dispatch(
            setUser({
              ...user,
              uninterestedMedias: response.data.uninterestedMedias,
            })
          );
        }
      })
      .catch(error => {
        console.log(error);
      });
  }

  const handleSilence = () => {
    handleCloseMenu();
    axios
      .post(`${URL()}/user/media/silence/${user.id}`, { mediaId: item.MediaSymbol || item.id })
      .then(response => {
        if (response.data.success) {
        }
      })
      .catch(error => {
        console.log(error);
      });
  }

  return (
    <>
      <Popper
        open={openMenu}
        anchorEl={anchorRef.current}
        transition
        disablePortal
        className={classes.root}
      >
      {({ TransitionProps, placement }) => (
        <Grow
          {...TransitionProps}
          style={{
            transformOrigin: placement === "bottom" ? "center top" : "center bottom",
            position: "inherit",
          }}
        >
          <CustomPaper
            type={(!isLeftAligned && index % gridColumnCount() === 1)
              ? 'primary'
              : 'secondary'
            }>
            <ClickAwayListener onClickAway={handleCloseMenu}>
              <MenuList
                autoFocusItem={openMenu}
                id="menu-list-grow"
                onKeyDown={handleListKeyDownShareMenu}
              >
                <button className={classes.optionCloseBtn} onClick={handleCloseMenu}>
                  <img src={require("assets/icons/close.svg")} alt={"x"} />
                </button>
                {item.CreatorId !== user.id &&
                  <CustomMenuItem onClick={handleUnInterested}>
                    <span className={classes.optionRed}>I'm not interested</span>
                  </CustomMenuItem>
                }
                <CustomMenuItem>
                  <span>Copy link</span>
                </CustomMenuItem>
                <CustomMenuItem onClick={handleShareWithQR}>
                  <span>Share With QR</span>
                  <p className={classes.description}>Download your QR code and use it a simple way<br/> to give others access to this media</p>
                  <img
                    src={require("assets/icons/qrcode.svg")}
                    alt={"spaceship"}
                    className={classes.image}
                  />
                </CustomMenuItem>
                <CustomMenuItem onClick={handleOpenShareModal}>
                  <span>Share on...</span>
                </CustomMenuItem>
                <CustomMenuItem>
                  <span>Enable post notifications</span>
                </CustomMenuItem>
                {/* {item.CreatorId !== user.id &&
                  <CustomMenuItem onClick={handleSilence}>
                    <span>Silence</span>
                  </CustomMenuItem>
                } */}
                <CustomMenuItem>
                  <span>Stop following</span>
                </CustomMenuItem>
              </MenuList>
            </ClickAwayListener>
          </CustomPaper>
        </Grow>
      )}
      </Popper>
      <ShareWithQRCode
        isOpen={openQrCodeModal}
        onClose={hideQRCodeModal}
        shareLink={shareLink}
      />
    </>
  );
};
