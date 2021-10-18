import React, { useState } from "react";
import { useDispatch } from "react-redux";

import { ClickAwayListener, Grow, MenuItem, MenuList, Paper, Popper, withStyles } from "@material-ui/core";

import { shareMenuStyles } from './index.styles';
import { useShareMedia } from "shared/contexts/ShareMediaContext";
import { ShareWithQRCode } from "shared/ui-kit/Modal/Modals/ShareWithQRCode";
import styled from "styled-components";
import axios from "axios";
import URL from "shared/functions/getURL";
import { useTypedSelector } from "store/reducers/Reducer";
import { setUser } from "store/actions/User";
import { gridColumnCount } from 'shared/helpers/grid';
import Box from "shared/ui-kit/Box";
import { ReactComponent as QRCodeIcon } from 'assets/icons/qrcode.svg';
import { ReactComponent as InfoIcon } from 'assets/icons/info-circle.svg';

const CustomMenuItem = withStyles({
  root: {
    fontSize: "14px",
    padding: "16px 0",
    margin: '0 16px',
    fontFamily: "Agrandir",
    borderBottom: "1px solid #EBEBEB",
    minWidth: 295,
    display: 'flex',
    alignItems: 'center',
    columnGap: 8,
    lineHeight: '120%',
    color: '#181818',
    "& .share-menu-item": {
      width: '100%',
      display: 'flex',
      alignItems: 'center',
      columnGap: 8,
      padding: 5,
      borderRadius: 4,
      "& .info-icon path": {
        fill: '#A4A4A4'
      }
    },
    "& .item-text": {
      fontSize: 14,
      lineHeight: '120%',
      color: '#A4A4A4',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      display: 'block',
      textOverflow: 'ellipsis'
    },
    "&:hover": {
      background: 'transparent',
      "& .share-menu-item": {
        background: '#431AB7',
        "& > .item-text": {
          color: '#FFFFFF'
        },
        "& .info-icon path": {
          fill: '#FFFFFF'
        }
      },
    },
    "&:first-child": {
      cursor: 'default',
    },
    "&:last-child": {
      cursor: 'default',
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

export const ShareMenu = ({
  item,
  openMenu,
  anchorRef,
  handleCloseMenu,
  index = 0,
  isLeftAligned = false
}) => {
  const classes = shareMenuStyles();

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
                <CustomMenuItem>
                  <Box width="100%" display="flex" alignItems="center" justifyContent="space-between">
                    <span className={classes.title}>Share...</span>
                    <button className={classes.optionCloseBtn} onClick={handleCloseMenu}>
                      <img src={require("assets/icons/close.svg")} alt={"x"} />
                    </button>
                  </Box>
                </CustomMenuItem>
                <CustomMenuItem>
                  <div className="share-menu-item">
                    <span className={classes.emojiText}>🚀</span>
                    <span className="item-text">Share {'&'} Earn on Privi</span>
                    <InfoIcon className="info-icon"/>
                  </div>
                </CustomMenuItem>
                <CustomMenuItem onClick={handleShareWithQR}>
                  <div className="share-menu-item">
                    <QRCodeIcon className={classes.qrIcon} />
                    <span className="item-text">Share With QR Code</span>
                  </div>
                </CustomMenuItem>
                <CustomMenuItem onClick={handleOpenShareModal}>
                  <div className="share-menu-item">
                    <span className={classes.emojiText}>🦋</span>
                    <span className="item-text">Share on Social Media</span>
                  </div>
                </CustomMenuItem>
                <CustomMenuItem>
                  <span>Address</span>
                  <span className="item-text">{item.MediaSymbol || item.id}</span>
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
