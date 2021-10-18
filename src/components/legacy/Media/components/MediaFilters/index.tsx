import React, { useEffect, useState } from "react";
import cls from "classnames";

import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  ClickAwayListener,
  createStyles,
  Grow,
  makeStyles,
  MenuItem,
  MenuList,
  Paper,
  Popper,
  Theme,
  withStyles,
  FormControl,
  RadioGroup,
  Radio,
  FormControlLabel,
  Grid,
} from "@material-ui/core";

import CreateCollectionModal from "components/legacy/Media/modals/CreateCollectionModal";
import CreateMediaModal from "components/legacy/Media/modals/CreateMediaModal";
import CreatePlaylistModal from "components/legacy/Media/modals/CreatePlaylistModal";
import { BlockchainType, MediaStatus, SearchMediaFilters } from "shared/services/API/MediaAPI";
import styles from "./index.module.scss";
import { CollectionsSelect } from "./CollectionsSelect";
import { SearchWithCreate } from "shared/ui-kit/SearchWithCreate";
import StyledCheckbox from "shared/ui-kit/Checkbox";
import { PrimaryButton, SecondaryButton } from "shared/ui-kit";
import Box from 'shared/ui-kit/Box';

const arrow = require("assets/icons/arrow.png");
const shapeIcon = require("assets/icons/shape.png");

enum MediaType {
  Video = "VIDEO_TYPE",
  LiveVideo = "LIVE_VIDEO_TYPE",
  Audio = "AUDIO_TYPE",
  LiveAudio = "LIVE_AUDIO_TYPE",
  Blog = "BLOG_TYPE",
  BlogSnap = "BLOG_SNAP_TYPE",
  DigitalArt = "DIGITAL_ART_TYPE",
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: "flex",
    },
    paper: {
      marginLeft: 40,
      width: 156,
      marginTop: 80,
      borderRadius: 10,
      boxShadow: "0px 2px 20px rgba(0, 0, 0, 0.1)",
    },
    paperMenu: {
      marginLeft: 2000,
      width: 335,
      marginTop: 40,
      borderRadius: 10,
      padding: "20px 15px",
      paddingTop: 5,
      boxShadow: "0px 2px 20px rgba(0, 0, 0, 0.1)",
    },
    filterApplySection: {
      position: "sticky",
      bottom: 0,
      width: "100%",
      height: 100,
      zIndex: 3,
      backgroundColor: "white",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    filterBtn: {
      width: "150px !important",
    },
    formControl: {
      width: "100%",
    },
    radioGroup: {
      "& label": {
        marginRight: 20,
        "& .MuiIconButton-label": {
          color: "#707582",
          "& svg": {
            color: "#707582",
          },
        },
        "& .Mui-checked": {
          "& svg": {
            color: "black !important",
          },
        },
      },
    },
    blockchainSelectedOption: {
      padding: "3px 9px !important",
      borderRadius: 36,
      cursor: "pointer",
      marginRight: 8,
      marginBottom: 8,
      backgroundColor: "black",
      "& span": {
        color: "white",
        fontSize: 14.5,
        fontWeight: 400,
      },
    },
    blockchainOption: {
      border: "1px solid #707582",
      padding: "3px 9px !important",
      borderRadius: 36,
      cursor: "pointer",
      marginRight: 8,
      marginBottom: 8,
      "& span": {
        color: "#707582",
        fontSize: 14.5,
        fontWeight: 400,
      },
    },
  })
);

const CustomMenuItem = withStyles({
  root: {
    fontSize: "18px",
    fontFamily: "Agrandir",
  },
})(MenuItem);

type MediaFiltersProps = {
  filters: SearchMediaFilters;
  onFiltersChange: (filters: SearchMediaFilters) => void;
  triggerPlaylists: () => void;
  triggerGetMedia: () => void;
};

const MediaFilters: React.FunctionComponent<MediaFiltersProps> = ({
  filters,
  onFiltersChange,
  triggerPlaylists,
  triggerGetMedia,
}) => {
  const [searchValue, setSearchValue] = useState(filters.searchValue);
  const [mediaTypes, setMediaTypes] = useState(filters.mediaTypes);
  const [blockChains, setBlockChains] = useState(filters.blockChains);
  const [status, setStatus] = useState(filters.status);
  const [collection, setCollection] = useState(filters.collection);

  const classes = useStyles();
  const [openCreate, setOpenCreate] = useState(false);
  const anchorCreateRef = React.useRef<HTMLButtonElement>(null);

  const [openPlaylistModal, setOpenPlaylistModal] = useState<boolean>(false);
  const [openCollectionModal, setOpenCollectionModal] = useState<boolean>(false);
  const [openMediaModal, setOpenMediaModal] = useState<boolean>(false);
  const [openMenu, setOpenMenu] = useState(false);

  const isSignedIn = () => {
    return !!sessionStorage.getItem("token");
  };

  const handleToggleCreate = () => {
    setOpenCreate(prevCreateOpen => !prevCreateOpen);
  };

  const handleCloseCreate = (event: React.MouseEvent<EventTarget>) => {
    if (anchorCreateRef.current && anchorCreateRef.current.contains(event.target as HTMLElement)) {
      return;
    }

    setOpenCreate(false);
  };

  function handleListKeyDownCreate(event: React.KeyboardEvent) {
    if (event.key === "Tab") {
      event.preventDefault();
      setOpenCreate(false);
    }
  }

  // return focus to the button when we transitioned from !open -> open
  const prevCreateOpen = React.useRef(openCreate);
  useEffect(() => {
    if (prevCreateOpen.current === true && openCreate === false) {
      anchorCreateRef.current!.focus();
    }

    prevCreateOpen.current = openCreate;
  }, [openCreate]);

  const handleOpenPlaylistModal = () => {
    setOpenPlaylistModal(true);
  };
  const handleOpenCollectionModal = () => {
    setOpenCollectionModal(true);
  };
  const handleClosePlaylistModal = () => {
    setOpenPlaylistModal(false);
  };
  const handleCloseCollectionModal = () => {
    setOpenCollectionModal(false);
  };
  const handleOpenMediaModal = () => {
    setOpenMediaModal(true);
  };
  const handleCloseMediaModal = () => {
    setOpenMediaModal(false);
  };

  useEffect(() => {
    onFiltersChange({
      searchValue,
      mediaTypes,
      blockChains,
      status,
      collection,
    });
  }, [searchValue, mediaTypes]);

  const handleAddDeleteFilter = (item: string, filter: "mediaTypes" | "blockChains") => {
    let list = [] as any;
    if (filter === "mediaTypes") {
      list = [...mediaTypes];
    } else if (filter === "blockChains") {
      list = [...blockChains];
    }

    if (filter === "mediaTypes") {
      if (item === "all") {
        list = [...Object.values(MediaType)];
      } else if (list.length === Object.values(MediaType).length) {
        list = [];
      }
    }

    if (item === "eth") {
      //eth adds/deletes Zora and Opensea
      if (
        list.includes("Zora") &&
        list.includes("Opensea") &&
        list.includes("Topshot") &&
        list.includes("Foundation") &&
        list.includes("Mirror") &&
        list.includes("Sorare") &&
        list.includes("Showtime")
      ) {
        list.splice(
          list.findIndex(list => list === "Zora"),
          1
        );
        list.splice(
          list.findIndex(list => list === "Opensea"),
          1
        );
        list.splice(
          list.findIndex(list => list === "Topshot"),
          1
        );
        list.splice(
          list.findIndex(list => list === "Foundation"),
          1
        );
        list.splice(
          list.findIndex(list => list === "Mirror"),
          1
        );
        list.splice(
          list.findIndex(list => list === "Sorare"),
          1
        );
        list.splice(
          list.findIndex(list => list === "Showtime"),
          1
        );
      } else {
        if (!list.includes("Zora")) {
          list.push("Zora");
        }
        if (!list.includes("Opensea")) {
          list.push("Opensea");
        }
        if (!list.includes("Topshot")) {
          list.push("Topshot");
        }
        if (!list.includes("Foundation")) {
          list.push("Foundation");
        }
        if (!list.includes("Mirror")) {
          list.push("Mirror");
        }
        if (!list.includes("Sorare")) {
          list.push("Sorare");
        }
        if (!list.includes("Showtime")) {
          list.push("Showtime");
        }
      }
    }

    if (list.includes(item) && item !== "all") {
      list.splice(
        list.findIndex(list => list === item),
        1
      );
    } else if (item !== "all") {
      list.push(item);
    }

    if (filter === "mediaTypes") {
      if (list.length === 0) {
        list = [...Object.values(MediaType)];
      }
      setMediaTypes(list);
    } else if (filter === "blockChains") {
      setBlockChains(list);
    } else if (filter === "status") {
      setStatus(list);
    }
  };

  const MediaButton = ({ mediaType }) => {
    return (
      <button
        className={cls(styles.mediaButton, {
          [styles.selected]:
            mediaTypes.includes(mediaType) && mediaTypes.length < Object.values(MediaType).length,
        })}
        onClick={() => handleAddDeleteFilter(mediaType, "mediaTypes")}
      >
        {mediaType === MediaType.DigitalArt
          ? `Digital Art`
          : mediaType === MediaType.Video
            ? `Video`
            : mediaType === MediaType.LiveVideo
              ? `Live Video`
              : mediaType === MediaType.Audio
                ? `Audio`
                : mediaType === MediaType.LiveAudio
                  ? `Live Audio`
                  : mediaType === MediaType.Blog
                    ? `Blog`
                    : `Blog snap`}
        <img
          src={require(`assets/mediaIcons/small/${mediaType === MediaType.DigitalArt
            ? `digital_art`
            : mediaType === MediaType.Video
              ? `video`
              : mediaType === MediaType.LiveVideo
                ? `video_live`
                : mediaType === MediaType.Audio
                  ? `audio`
                  : mediaType === MediaType.LiveAudio
                    ? `audio_live`
                    : mediaType === MediaType.Blog
                      ? `blog`
                      : `blog_snap`
            }.png`)}
          alt={mediaType}
        />
      </button>
    );
  };

  const toggleStatus = e => {
    const targetStatus = e.target.value;
    setStatus(currentStatus => (currentStatus === targetStatus ? undefined : targetStatus));
  };

  const handleFilterApply = () => {
    onFiltersChange({
      searchValue,
      mediaTypes,
      blockChains,
      status,
      collection,
    });
    setOpenMenu(false);
  };

  const handleSearchChange = e => {
    setSearchValue(e.target.value);
  };

  return (
    <div className={styles.filters}>
      <div
        className={cls(styles.filterAccordions, {
          [styles.hidden]: !openMenu,
        })}
      >
        <Accordion
          defaultExpanded
          expanded
          style={{
            padding: "0px 32px",
            margin: 0,
            borderRadius: "unset",
          }}
        >
          <AccordionSummary
            style={{
              marginTop: 10,
              marginBottom: -30,
              padding: 0,
            }}
          >
            <h4>🛎 Status</h4>
          </AccordionSummary>
          <AccordionDetails style={{ paddingRight: 0, paddingLeft: 0, borderBottom: "1px solid #707582" }}>
            <FormControl className={classes.formControl}>
              <RadioGroup className={classes.radioGroup} value={status} onChange={toggleStatus}>
                <Grid container>
                  <Grid item xs={12} md={6}>
                    <FormControlLabel
                      value={MediaStatus.BuyNow}
                      control={<Radio />}
                      label={
                        <Box fontFamily="Agrandir" fontSize={18} fontWeight={400} color="#707582">
                          Buy now
                        </Box>
                      }
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <FormControlLabel
                      value={MediaStatus.OnAuction}
                      control={<Radio />}
                      label={
                        <Box fontFamily="Agrandir" fontSize={18} fontWeight={400} color="#707582">
                          On auction
                        </Box>
                      }
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <FormControlLabel
                      value={MediaStatus.New}
                      control={<Radio />}
                      label={
                        <Box fontFamily="Agrandir" fontSize={18} fontWeight={400} color="#707582">
                          New
                        </Box>
                      }
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <FormControlLabel
                      value={MediaStatus.LiveNow}
                      control={<Radio />}
                      label={
                        <Box fontFamily="Agrandir" fontSize={18} fontWeight={400} color="#707582">
                          Live now
                        </Box>
                      }
                    />
                  </Grid>
                </Grid>
              </RadioGroup>
            </FormControl>
          </AccordionDetails>
        </Accordion>

        <Accordion
          defaultExpanded
          expanded
          style={{
            padding: "0px 32px",
            margin: 0,
            borderRadius: "unset",
          }}
        >
          <AccordionSummary
            style={{
              marginBottom: -15,
              padding: 0,
            }}
          >
            <h4>🔗 Blockchain</h4>
          </AccordionSummary>
          <AccordionDetails style={{ paddingRight: 0, paddingLeft: 0, borderBottom: "1px solid #707582" }}>
            <div className={styles.blockChainItems}>
              <div
                onClick={() => {
                  handleAddDeleteFilter("PRIVI", "blockChains");
                }}
                className={styles.checkItem}
              >
                <StyledCheckbox
                  checked={blockChains.includes(BlockchainType.Privi) ? true : false}
                  name="checked"
                />
                <Box fontSize={18} fontWeight={700} color="#707582">
                  PRIVI
                </Box>
              </div>
              <Accordion
                defaultExpanded
                expanded
                style={{
                  flexDirection: "column",
                  width: "100%",
                  padding: 0,
                  boxShadow: "none",
                  alignItems: "flex-start",
                  margin: 0,
                }}
                className={styles.ethAccordion}
              >
                <AccordionSummary style={{ padding: 0 }}>
                  <div
                    onClick={() => {
                      handleAddDeleteFilter(BlockchainType.Eth, "blockChains");
                    }}
                    className={styles.checkItem}
                  >
                    <StyledCheckbox
                      checked={blockChains.includes(BlockchainType.Eth) ? true : false}
                      name="checked"
                    />
                    <Box fontSize={18} fontWeight={700} color="#707582">
                      Ethereum
                    </Box>
                  </div>
                </AccordionSummary>
                <AccordionDetails>
                  <div className={styles.ethOptions}>
                    <Box
                      className={
                        blockChains.includes(BlockchainType.Zora)
                          ? classes.blockchainSelectedOption
                          : classes.blockchainOption
                      }
                      onClick={() => handleAddDeleteFilter(BlockchainType.Zora, "blockChains")}
                    >
                      <img src={require("assets/priviIcons/zora_icon.png")} alt="zora" />
                      <span>Zora</span>
                    </Box>
                    {/* <Box
                      onClick={() => handleAddDeleteFilter(BlockchainType.Showtime, "blockChains")}
                      className={
                        blockChains.includes(BlockchainType.Showtime)
                          ? classes.blockchainSelectedOption
                          : classes.blockchainOption
                      }
                    >
                      <img src={require("assets/priviIcons/rarible_icon.png")} alt="rarible" />
                      <span>Rarible</span>
                    </Box> */}
                    <Box
                      onClick={() => handleAddDeleteFilter(BlockchainType.OpenSea, "blockChains")}
                      className={
                        blockChains.includes(BlockchainType.OpenSea)
                          ? classes.blockchainSelectedOption
                          : classes.blockchainOption
                      }
                    >
                      <img src={require("assets/priviIcons/opensea_icon.png")} alt="opensea" />
                      <span>Opensea</span>
                    </Box>
                    {mediaTypes.length === 0 || //nothing selected
                      mediaTypes.includes(MediaType.Audio) ||
                      mediaTypes.includes(MediaType.LiveAudio) ||
                      mediaTypes.includes(MediaType.Video) ||
                      mediaTypes.includes(MediaType.LiveVideo) ||
                      mediaTypes.includes(MediaType.DigitalArt) ? (
                      <Box
                        onClick={() => handleAddDeleteFilter(BlockchainType.Sorare, "blockChains")}
                        className={
                          blockChains.includes(BlockchainType.Sorare)
                            ? classes.blockchainSelectedOption
                            : classes.blockchainOption
                        }
                      >
                        <img src={require("assets/priviIcons/sorare_icon.png")} alt="sorare" />
                        <span>Sorare</span>
                      </Box>
                    ) : null}
                    {mediaTypes.length === 0 || //nothing selected
                      mediaTypes.includes(MediaType.Blog) ||
                      mediaTypes.includes(MediaType.BlogSnap) ? (
                      <Box
                        onClick={() => handleAddDeleteFilter(BlockchainType.Mirror, "blockChains")}
                        className={
                          blockChains.includes(BlockchainType.Mirror)
                            ? classes.blockchainSelectedOption
                            : classes.blockchainOption
                        }
                      >
                        <img src={require("assets/priviIcons/mirror_icon.png")} alt="mirro" />
                        <span>Mirror</span>
                      </Box>
                    ) : null}
                    <Box
                      onClick={() => handleAddDeleteFilter(BlockchainType.Foundation, "blockChains")}
                      className={
                        blockChains.includes(BlockchainType.Foundation)
                          ? classes.blockchainSelectedOption
                          : classes.blockchainOption
                      }
                    >
                      <img src={require("assets/priviIcons/foundation_icon.png")} alt="foundation" />
                      <span>Foundation</span>
                    </Box>
                    {/* {mediaTypes.length === 0 || //nothing selected
                    mediaTypes.includes(MediaType.Audio) ||
                    mediaTypes.includes(MediaType.LiveAudio) ||
                    mediaTypes.includes(MediaType.Video) ||
                    mediaTypes.includes(MediaType.LiveAudio) ||
                    mediaTypes.includes(MediaType.DigitalArt) ? (
                      <Box
                        onClick={() => handleAddDeleteFilter(BlockchainType.Topshot, "blockChains")}
                        className={
                          blockChains.includes(BlockchainType.Topshot)
                            ? classes.blockchainSelectedOption
                            : classes.blockchainOption
                        }
                      >
                        <img src={require("assets/priviIcons/top_shot_icon.png")} alt="topshot" />
                        <span>Top Shot</span>
                      </Box>
                    ) : null} */}
                    <Box
                      onClick={() => handleAddDeleteFilter(BlockchainType.Showtime, "blockChains")}
                      className={
                        blockChains.includes(BlockchainType.Showtime)
                          ? classes.blockchainSelectedOption
                          : classes.blockchainOption
                      }
                    >
                      <img src={require("assets/priviIcons/showtime_icon.png")} alt="showtime" />
                      <span>Showtime</span>
                    </Box>
                  </div>
                </AccordionDetails>
              </Accordion>
              <div
                onClick={() => {
                  handleAddDeleteFilter(BlockchainType.Wax, "blockChains");
                }}
                className={styles.checkItem}
              >
                <StyledCheckbox
                  checked={blockChains.includes(BlockchainType.Wax) ? true : false}
                  name="checked"
                />
                <Box fontSize={18} fontWeight={700} color="#707582">
                  WAX
                </Box>
              </div>
            </div>
          </AccordionDetails>
        </Accordion>

        <Accordion
          expanded
          defaultExpanded
          style={{
            padding: "0px 32px",
            margin: 0,
            borderRadius: "unset",
          }}
        >
          <AccordionSummary
            style={{
              padding: 0,
            }}
          >
            <h4>🕳 Collections</h4>
          </AccordionSummary>
          <AccordionDetails
            style={{
              flexDirection: "column",
              width: "100%",
              paddingRight: 0,
              paddingLeft: 0,
            }}
          >
            <CollectionsSelect
              selectedBlockchains={blockChains}
              selectedCollection={collection}
              onSelectedCollectionChange={setCollection}
            />
          </AccordionDetails>
        </Accordion>

        <div className={classes.filterApplySection}>
          <SecondaryButton size="medium" onClick={() => setOpenMenu(false)} className={classes.filterBtn}>
            Cancel
          </SecondaryButton>
          <PrimaryButton size="medium" onClick={handleFilterApply} className={classes.filterBtn}>
            Apply
          </PrimaryButton>
        </div>
      </div>
      <div className={styles.searchAndCreate}>
        <div className={styles.row}>
          <SearchWithCreate
            searchValue={searchValue}
            handleSearchChange={handleSearchChange}
            searchPlaceholder="Search by artist, name, tag"
          />
          {isSignedIn() && (
            <div className={styles.createMenu}>
              <PrimaryButton size="medium" ref={anchorCreateRef} onClick={handleToggleCreate}>
                Create Media
              </PrimaryButton>
              <Popper
                open={openCreate}
                anchorEl={anchorCreateRef.current}
                role={undefined}
                transition
                disablePortal
              >
                {({ TransitionProps, placement }) => (
                  <Grow
                    {...TransitionProps}
                    style={{
                      transformOrigin: placement === "bottom" ? "center top" : "center bottom",
                    }}
                  >
                    <Paper style={{ marginTop: 40 }} className={classes.paper}>
                      <ClickAwayListener onClickAway={handleCloseCreate}>
                        <MenuList
                          autoFocusItem={openCreate}
                          id="menu-list-grow"
                          onKeyDown={handleListKeyDownCreate}
                        >
                          <CustomMenuItem onClick={handleOpenPlaylistModal}>Playlist</CustomMenuItem>
                          {/* <CustomMenuItem onClick={handleCloseCreate}>Community</CustomMenuItem> */}
                          <CustomMenuItem onClick={handleOpenCollectionModal}>Collection</CustomMenuItem>
                          {/* <CustomMenuItem onClick={handleCloseCreate}>Pod</CustomMenuItem> */}
                          <CustomMenuItem onClick={handleOpenMediaModal}>Media</CustomMenuItem>
                        </MenuList>
                      </ClickAwayListener>
                    </Paper>
                  </Grow>
                )}
              </Popper>
            </div>
          )}
        </div>
      </div>
      <div className={cls(styles.row, styles.icons)}>
        <div className={styles.mediaRow}>
          Categories
          <button
            className={styles.slideLeft}
            type="button"
            onClick={() => {
              document.getElementsByClassName(styles.scrollable)[0]!.scrollLeft -= 75;
            }}
          >
            <img src={arrow} alt="" />
          </button>
          <div
            className={styles.scrollable}
            style={{
              maxWidth: isSignedIn()
                ? "calc(100vw - 72px * 2 - 80px - 430px - 100px)"
                : "calc(100vw - 72px * 2 - 430px - 100px)",
            }}
          >
            <button
              className={cls(styles.mediaButton, {
                [styles.selected]:
                  mediaTypes.includes(MediaType.DigitalArt) &&
                  mediaTypes.includes(MediaType.Video) &&
                  mediaTypes.includes(MediaType.LiveVideo) &&
                  mediaTypes.includes(MediaType.Audio) &&
                  mediaTypes.includes(MediaType.LiveAudio) &&
                  mediaTypes.includes(MediaType.Blog) &&
                  mediaTypes.includes(MediaType.BlogSnap),
              })}
              onClick={() => handleAddDeleteFilter("all", "mediaTypes")}
            >
              {`All`}
              <img src={require(`assets/mediaIcons/small/all.png`)} alt={"all"} />
            </button>
            {Object.values(MediaType).map(mediaType => (
              <MediaButton mediaType={mediaType} key={mediaType} />
            ))}
          </div>
          <button
            className={styles.slideRight}
            type="button"
            onClick={() => {
              document.getElementsByClassName(styles.scrollable)[0]!.scrollLeft += 75;
            }}
          >
            <img src={arrow} alt="" />
          </button>
        </div>
        <div className={styles.filterMenu}>
          Filters and sorting
          <div className={styles.filtersContainer}>
            <SecondaryButton size="medium" onClick={() => setOpenMenu(true)}>
              <img src={shapeIcon} alt="shape" />
              Choose Filters
            </SecondaryButton>
          </div>
        </div>
      </div>
      {isSignedIn() && openPlaylistModal && (
        <CreatePlaylistModal
          open={openPlaylistModal}
          handleClose={handleClosePlaylistModal}
          update={triggerPlaylists}
        />
      )}
      {isSignedIn() && openCollectionModal && (
        <CreateCollectionModal open={openCollectionModal} handleClose={handleCloseCollectionModal} />
      )}
      {isSignedIn() && openMediaModal && (
        <CreateMediaModal
          open={openMediaModal}
          handleClose={handleCloseMediaModal}
          updateMedia={triggerGetMedia}
        />
      )}
    </div>
  );
};

export default MediaFilters;
