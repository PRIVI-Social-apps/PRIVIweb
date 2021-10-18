import React, { useEffect, useState } from "react";
import axios from "axios";
import cls from "classnames";

import {
  ClickAwayListener,
  Grow,
  MenuItem,
  MenuList,
  Paper,
  Popper,
  withStyles,
} from "@material-ui/core";

import { subPageStyles } from '../index.styles';
import { MasonryGrid } from "shared/ui-kit/MasonryGrid/MasonryGrid";
import { COLUMNS_COUNT_BREAK_POINTS_FOUR } from "../SearchPage";
import DigitalArtCard from "components/PriviDigitalArt/components/Cards/DigitalArtCard";
import CollectionCard from "components/PriviDigitalArt/components/Cards/CollectionCard";
import ArtistCard from "components/PriviDigitalArt/components/Cards/ArtistCard";
import { CollectionsWax } from "components/legacy/Media/components/MediaFilters/collections";
import URL from "shared/functions/getURL";
import { useTypedSelector } from "store/reducers/Reducer";
import { ARTWORK_MEDIA_TYPES } from "components/PriviDigitalArt/productUtils";
import { LoadingWrapper } from "shared/ui-kit/Hocs";
import Box from 'shared/ui-kit/Box';

const Tabs = ["Art", "Collections", "Artists", ""];
const sortOptions = ["More relevants", "Recently added", "Alphabetical order"];

export default function LikedPage() {
  const classes = subPageStyles();

  const [selectedTab, setSelectedTab] = useState<number>(0);
  const [menuItem, setMenuItem] = useState<number>(0);
  const user = useTypedSelector(state => state.user);
  const userId = React.useMemo(() => (user ? user.id : null), [user]);
  const [digitalArts, setDigitalArts] = useState<any[]>([]);
  const [artists, setArtists] = useState<any[]>([]);
  const [collections, setCollections] = useState<any[]>([...CollectionsWax]);
  const [loadingDigitalArts, setLoadingDigitalArts] = useState<boolean>(false);
  const [loadingArtists, setLoadingArtists] = useState<boolean>(false);

  const [openMenu, setOpenMenu] = React.useState(false);
  const anchorMenuRef = React.useRef<HTMLImageElement>(null);

  const getLikedUsers = React.useCallback(() => {
    if (!userId) return;
    setLoadingArtists(true);
    axios
      .get(`${URL()}/user/getLikedUsers/${userId}`)
      .then(res => {
        if (res.data.success) setArtists(res.data.data);
      })
      .catch(err => console.log(err))
      .finally(() => {
        setLoadingArtists(false);
      });
  }, [userId, setArtists, setLoadingArtists]);


  useEffect(() => {
    getLikedUsers();
  }, [getLikedUsers]);

  useEffect(() => {
    if (!userId) return;
    setLoadingDigitalArts(true);
    axios
      .post(`${URL()}/media/getLikedMediasByType`, {
        userId: userId,
        mediaTypes: ARTWORK_MEDIA_TYPES,
      })
      .then(res => {
        if (res.data.success) {
          let medias = res.data.data;
          if (user.uninterestedMedias) {
            medias = medias.filter((item) => !user.uninterestedMedias?.includes(item.MediaSymbol || item.id));
          }
          setDigitalArts(medias);
        }
      })
      .catch(err => console.log(err))
      .finally(() => {
        setLoadingDigitalArts(false);
      });
  }, [userId]);

  useEffect(() => {
    let medias = [...digitalArts];
    if (user.uninterestedMedias) {
      medias = medias.filter((item) => !user.uninterestedMedias?.includes(item.MediaSymbol || item.id));
    }
    setDigitalArts(medias);
  }, [user.uninterestedMedias]);

  const sortedLikedMedias = React.useMemo(() => {
    if (menuItem === 2) return digitalArts.sort((a, b) => a.MediaName.localeCompare(b.MediaName));
    else if (menuItem === 1) return digitalArts.sort((a, b) => b.createdAt - a.createdAt);
    return digitalArts;
  }, [digitalArts, menuItem]);

  const sortedCollections = React.useMemo(() => {
    if (menuItem === 2) return collections.sort((a, b) => a.name.localeCompare(b.name));
    return collections;
  }, [collections, menuItem]);

  const sortedArtists = React.useMemo(() => {
    if (menuItem === 2) return artists.sort((a, b) => a.firstName.localeCompare(b.firstName));
    else if (menuItem === 1) return artists;
    return artists;
  }, [artists, menuItem]);

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
    <div className={classes.page}>
      <div className={classes.content}>
        <div className={classes.headerTitle}>✨ Liked Content</div>
        <Box display="flex" marginBottom="16px">
          {Tabs.map((tab, index) =>
            index !== Tabs.length - 1 ? (
              <div
                key={`tab-${index}`}
                className={cls({ [classes.selectedTab]: index === selectedTab }, classes.tab)}
                onClick={() => {
                  setSelectedTab(index);
                }}
              >
                {tab}
              </div>
            ) : (
              <div>
                <img
                  src={require("assets/icons/filters.png")}
                  alt="sort"
                  onClick={handleToggleMenu}
                  ref={anchorMenuRef}
                  style={{ cursor: "pointer" }}
                />
                <Popper
                  open={openMenu}
                  anchorEl={anchorMenuRef.current}
                  transition
                  disablePortal
                  style={{ position: "inherit", zIndex: 3 }}
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
                          <MenuList
                            autoFocusItem={openMenu}
                            id="menu-list-grow"
                            onKeyDown={handleListKeyDownMenu}
                          >
                            {sortOptions.map((option, index) => (
                              <CustomMenuItem
                                key={`option-${index}`}
                                onClick={e => {
                                  setMenuItem(index);
                                  handleCloseMenu(e);
                                }}
                              >
                                <Box
                                  display="flex"
                                  alignItems="center"
                                  color={index === menuItem ? "#181818" : "#707582"}
                                >
                                  {option}
                                  {index === menuItem && (
                                    <img src={require("assets/icons/check_dark.png")} alt="check" />
                                  )}
                                </Box>
                              </CustomMenuItem>
                            ))}
                          </MenuList>
                        </ClickAwayListener>
                      </Paper>
                    </Grow>
                  )}
                </Popper>
              </div>
            )
          )}
        </Box>

        {selectedTab === 0 ? (
          <LoadingWrapper loading={loadingDigitalArts}>
            <div className={cls(classes.artCards)}>
              {sortedLikedMedias && sortedLikedMedias.length
              ? (
                <MasonryGrid
                  gutter={"24px"}
                  data={sortedLikedMedias}
                  renderItem={(item, index) => (
                    <DigitalArtCard heightFixed={false} item={item} key={`item-${index}`} />
                  )}
                  columnsCountBreakPoints={COLUMNS_COUNT_BREAK_POINTS_FOUR}
                />
              ) : (
                <div className={classes.empty}>No results</div>
              )}
            </div>
          </LoadingWrapper>
        ) : selectedTab === 1 ? (
          collections && collections.length > 0 ? (
            <div className={cls(classes.collectionCards)}>
              <MasonryGrid
                gutter={"24px"}
                data={sortedCollections}
                renderItem={(item, index) => (
                  <CollectionCard heightFixed={false} item={item} key={`item-${index}`} />
                )}
                columnsCountBreakPoints={COLUMNS_COUNT_BREAK_POINTS_FOUR}
              />
            </div>
          ) : (
            <div className={classes.empty}>No results</div>
          )
        ) : (
          <LoadingWrapper loading={loadingArtists}>
            <div className={cls(classes.artistCards)}>
              {sortedArtists && sortedArtists.length
              ? (
                <MasonryGrid
                  gutter={"24px"}
                  data={sortedArtists}
                  renderItem={(item, index) => (
                    <ArtistCard item={item} key={`item-${index}`} currentIndex={index} />
                  )}
                  columnsCountBreakPoints={COLUMNS_COUNT_BREAK_POINTS_FOUR}
                />
              ) : (
                <div className={classes.empty}>No results</div>
              )}
            </div>
          </LoadingWrapper>
        )}
      </div>
    </div>
  );
}

const CustomMenuItem = withStyles({
  root: {
    fontSize: "14px",
    fontFamily: "Agrandir",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    "& img": {
      width: "10px",
      height: "7px",
      marginLeft: "15px",
    },
  },
})(MenuItem);
