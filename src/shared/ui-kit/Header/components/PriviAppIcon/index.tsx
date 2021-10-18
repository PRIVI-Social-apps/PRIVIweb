import {
  ClickAwayListener,
  createStyles,
  Grow,
  makeStyles,
  MenuList,
  Paper,
  Popper,
  Theme,
} from "@material-ui/core";
import React from "react";
import { StyledMenuItem } from "shared/ui-kit/Styled-components/StyledComponents";
import styled from "styled-components";
import { useHistory } from "react-router-dom";
import { useTypedSelector } from "store/reducers/Reducer";

type WrapperProps = React.PropsWithChildren<{
  isMusic: boolean;
  isArt: boolean;
  isZoo: boolean;
}>;

const Wrapper = styled.div<WrapperProps>`
  background: ${p => `${p.isArt ? "#9eacf2" : "inherit"}`};
  padding: ${p => `${p.isArt ? "38px 24.5px" : "0"}`};
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-right: ${p => `${p.isZoo ? "120px" : p.isMusic ? "35px" : p.isArt ? "0px" : "48px"}`};
  cursor: pointer;
  @media only screen and (max-width: 600px) {
    margin-right: 0px;
    img:first-child {
      width: 70px;
    }
  }
  img:first-child:not(> div img) {
    width: 120px;
  }
  > div > img {
    margin-left: 15px;
    width: 10px !important;
  }
`;

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    paper: {
      width: "209px",
      marginLeft: -148,
      marginTop: 38,
      borderRadius: 0,
      boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.12)",
      position: "inherit",
      minWidth: "209px",
      [theme.breakpoints.down('sm')]: {
        width: 106,
        minWidth: 106,
        marginLeft: -95,
        marginTop: 25
      },
    },
  })
);

const menuOptions = [
  "privi_music",
  "privi_digital_art",
  "privi_wallet",
  "privi_data",
  "privi_dao",
  "privi_pods",
  "privi_collab",
  "privi_music_dao",
  "privi_zoo",
  "privi_social",
];

export default function PriviAppIcon(props) {
  const history = useHistory();

  const user = useTypedSelector(state => state.user);

  const pathName = window.location.href;

  const [openMenu, setOpenMenu] = React.useState(false);
  const anchorMenuRef = React.useRef<HTMLImageElement>(null);

  const classes = useStyles();

  const handleToggleMenu = e => {
    e.stopPropagation();
    e.preventDefault();
    setOpenMenu(prevMenuOpen => !prevMenuOpen);
  };

  const handleCloseMenu = (event: React.MouseEvent<EventTarget>) => {
    if (anchorMenuRef.current && anchorMenuRef.current.contains(event.target as HTMLElement)) {
      return;
    }

    setOpenMenu(false);
  };

  function handleListKeyDownMenu(e: React.KeyboardEvent) {
    if (e.key === "Tab") {
      e.preventDefault();
      setOpenMenu(false);
    }
  }

  return (
    <Wrapper
      isMusic={
        (!pathName.toLowerCase().includes("privi-music-dao") && pathName.toLowerCase().includes("privi-music")) || pathName.toLowerCase().includes("new-privi-pods")
      }
      isArt={pathName.toLowerCase().includes("privi-digital-art")}
      isZoo={pathName.toLowerCase().includes("privi-zoo")}
      onClick={handleToggleMenu}
    >
      <img
        style={pathName.toLowerCase().includes("privi-social") ? { height: "40px" } : undefined}
        src={require(`assets/logos/${pathName.toLowerCase().includes("privi-music-dao")
          ? menuOptions[7]
          : pathName.toLocaleLowerCase().includes("music")
            ? menuOptions[0]
            : pathName.toLowerCase().includes("privi-digital-art")
              ? `${menuOptions[1]}1`
              : pathName.toLowerCase().includes("privi-wallet")
                ? menuOptions[2]
                : pathName.toLowerCase().includes("privi-data")
                  ? menuOptions[3]
                  : pathName.toLowerCase().includes("privi-dao")
                    ? menuOptions[4]
                    : pathName.toLowerCase().includes("privi-pods")
                      ? menuOptions[5]
                      : pathName.toLowerCase().includes("privi-collab")
                        ? menuOptions[6]
                        : pathName.toLowerCase().includes("privi-social")
                          ? menuOptions[9]
                          : menuOptions[8]
          }${props.isTransparent ? "_white" : ""}.png`)}
        alt="privi"
      />
      <div ref={anchorMenuRef}>
        {!pathName.toLowerCase().includes("privi-music-dao") &&
          <img
            src={require(`assets/icons/${props.isTransparent || pathName.toLowerCase().includes("privi-digital-art")
              ? "arrow_white_right"
              : "arrow"
              }.png`)}
            alt="arrow"
            style={{ transform: openMenu ? "rotate(270deg)" : "rotate(90deg)" }}
          />
        }
        <Popper
          open={openMenu}
          anchorEl={anchorMenuRef.current}
          transition
          disablePortal
          style={{ top: pathName.toLowerCase().includes("privi-music-dao") ? 0 : -10, zIndex: 3 }}
        >
          {({ TransitionProps, placement }) => (
            <Grow
              {...TransitionProps}
              style={{
                transformOrigin: placement === "bottom" ? "center top" : "center bottom",
                position: "inherit",
              }}
            >
              <Paper className={classes.paper}>
                <ClickAwayListener onClickAway={handleCloseMenu}>
                  <MenuList autoFocusItem={openMenu} onKeyDown={handleListKeyDownMenu}>
                    {menuOptions
                      .filter(
                        o =>
                          (pathName.toLowerCase().includes("privi-digital-art") &&
                            !o.toLowerCase().includes("privi-digital-art")) ||
                          (pathName.toLowerCase().includes("privi-music-dao") &&
                            !o.toLowerCase().includes("privi_music_dao")) ||
                          (!pathName.toLowerCase().includes("privi-digital-art") &&
                            !pathName.toLowerCase().includes("privi-music-dao") &&
                            !pathName.toLowerCase().includes(o.replace("_", "-")))
                      )
                      .map((option, index) => (
                        <StyledMenuItem
                          key={`option-${index}`}
                          onClick={e => {
                            handleCloseMenu(e);
                            history.push(
                              `/${option.includes("art")
                                ? "privi-digital-art"
                                : option.includes("pods")
                                  ? "new-privi-pods"
                                  : option.includes("music_dao")
                                    ? "privi-music-dao"
                                    : option.replace("_", "-")
                              }${option.includes("data") ? "-new" : ""}${option.includes("social") ? `/${props.id ?? user.urlSlug ?? user.id}` : ""
                              }`
                            );
                          }}
                          style={{
                            paddingTop: option.includes("music_dao") ? 10 : undefined,
                            paddingBottom: option.includes("music_dao") ? 10 : undefined,
                          }}
                        >
                          {
                            <img
                              src={require(`assets/logos/${option}.png`)}
                              alt={option}
                              height={option.includes("music_dao") ? undefined : 40}
                              width={option.includes("music_dao") ? undefined : 132}
                            />
                          }
                        </StyledMenuItem>
                      ))}
                  </MenuList>
                </ClickAwayListener>
              </Paper>
            </Grow>
          )}
        </Popper>
      </div>
    </Wrapper>
  );
}
