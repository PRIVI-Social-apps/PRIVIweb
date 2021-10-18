import React, { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";

import {
  ClickAwayListener,
  Grid,
  Grow,
  MenuItem,
  MenuList,
  Paper,
  Popper,
  useMediaQuery,
  useTheme,
  withStyles,
} from "@material-ui/core";

import { Avatar, PrimaryButton, StyledDivider, Variant } from "shared/ui-kit";
import Box from "shared/ui-kit/Box";
import { ArrowIcon } from "../../components/Icons/SvgIcons";
import { artistPageStyles } from "./index.styles";

import { ReactComponent as ShareIcon } from "assets/icons/share_filled.svg";
import { ReactComponent as PlusIcon } from "assets/icons/plus.svg";
import { ReactComponent as MinusIcon } from "assets/icons/minus.svg";
import { useShareMedia } from "shared/contexts/ShareMediaContext";
import { FruitSelect } from "shared/ui-kit/Select/FruitSelect";
import { CustomTable, CustomTableCellInfo, CustomTableHeaderInfo } from "shared/ui-kit/Table";
import SaluteModal from "components/PriviMusicDao/modals/SaluteModal";

// mock data
const mockArtistData = {
  name: "Drake",
  followers: 1450,
  fruits: [23, 34, 123],
  songs: [
    {
      name: "Nothings Into Somethings",
      album: "Jazz",
      genre: "Hip Hop",
      chain: "Privi Chain",
      fundsClaimed: "2445",
    },
    {
      name: "Nothings Into Somethings",
      album: "Jazz",
      genre: "Hip Hop",
      chain: "Privi Chain",
      fundsClaimed: "2445",
    },
    {
      name: "Nothings Into Somethings",
      album: "Jazz",
      genre: "Hip Hop",
      chain: "Privi Chain",
      fundsClaimed: "2445",
    },
    {
      name: "Nothings Into Somethings",
      album: "Jazz",
      genre: "Hip Hop",
      chain: "Privi Chain",
      fundsClaimed: "2445",
    },
    {
      name: "Nothings Into Somethings",
      album: "Jazz",
      genre: "Hip Hop",
      chain: "Privi Chain",
      fundsClaimed: "2445",
    },
    {
      name: "Nothings Into Somethings",
      album: "Jazz",
      genre: "Hip Hop",
      chain: "Privi Chain",
      fundsClaimed: "2445",
    },
  ],
  isClaimed: false,
};

const CustomMenuItem = withStyles({
  root: {
    fontSize: "14px",
    fontFamily: "Agrandir",
  },
})(MenuItem);

const tableHeaders: Array<CustomTableHeaderInfo> = [
  {
    headerName: "Song name",
  },
  {
    headerName: "Album",
    headerAlign: "center",
  },
  {
    headerName: "Genre",
    headerAlign: "center",
  },
  {
    headerName: "Chain",
    headerAlign: "center",
  },
  {
    headerName: "Funds claimed",
    headerAlign: "center",
  },
];

export default function ArtistPage() {
  const classes = artistPageStyles();
  const params: any = useParams();
  const history = useHistory();

  const [artist, setArtist] = useState<any>(mockArtistData);
  const [loadingArtists, setLoadingArtist] = useState<boolean>(false);

  const [creators, setCreators] = useState<any[]>([{ name: "tester" }]);
  const [followed, setFollowed] = React.useState<boolean>(false);

  const [openSaluteModal, setOpenSaluteModal] = useState<boolean>(false);

  const [openShareMenu, setOpenShareMenu] = React.useState<boolean>(false);
  const anchorShareMenuRef = React.useRef<HTMLDivElement>(null);

  const { shareMediaToSocial, shareMediaWithQrCode } = useShareMedia();

  const theme = useTheme();
  const tabletMatch = useMediaQuery(theme.breakpoints.down('md'));
  const mobileMatch = useMediaQuery(theme.breakpoints.down('xs'));

  useEffect(() => {
    setLoadingArtist(true);
    // call api for getting vote list
    setLoadingArtist(false);
  }, []);

  const showShareMenu = () => {
    setOpenShareMenu(true);
  };

  const handleCloseShareMenu = (event: React.MouseEvent<EventTarget>) => {
    if (anchorShareMenuRef.current && anchorShareMenuRef.current.contains(event.target as HTMLElement)) {
      return;
    }

    setOpenShareMenu(false);
  };

  function handleListKeyDownShareMenu(event: React.KeyboardEvent) {
    if (event.key === "Tab") {
      event.preventDefault();
      setOpenShareMenu(false);
    }
  }

  const handleOpenQRCodeModal = () => {
    const link = window.location.href.includes("NFT")
      ? `privi-music-dao/Artists/${params.artistId}`
      : `privi-music-dao/FT/${params.artistId}`;
    shareMediaWithQrCode(params.artistId, link);
  };

  const handleOpenShareModal = () => {
    const link = window.location.href.includes("NFT")
      ? `privi-music-dao/MediaNFT/${params.artistId}`
      : `privi-music-dao/FT/${params.artistId}`;
    shareMediaToSocial(params.artistId, "Pod", "NEW-PRIVI-PODS", link);
  };

  const handleFollow = () => { };

  const getTableData = () => {
    const tableData: Array<Array<CustomTableCellInfo>> = [];
    artist.songs.map(item => {
      const row: Array<CustomTableCellInfo> = [];
      row.push({
        cell: (
          <Box className={classes.header2} style={{ fontWeight: "bold", color: "#2D3047" }}>
            {item.name}
          </Box>
        ),
      });
      row.push({
        cell: <Box className={classes.header3}>{item.album}</Box>,
        cellAlign: "center",
      });
      row.push({
        cell: <Box className={classes.header3}>{item.genre}</Box>,
        cellAlign: "center",
      });
      row.push({
        cell: <Box className={classes.header3}>{item.chain}</Box>,
        cellAlign: "center",
      });
      row.push({
        cell: (
          <Box className={classes.header3} style={{ fontWeight: 700 }}>
            {`${item.fundsClaimed} USDp`}
          </Box>
        ),
        cellAlign: "center",
      });

      if (!artist.isClaimed) {
        row.push({
          cell: (
            <PrimaryButton size="small" onClick={() => { }} isRounded style={{ background: "#2D3047" }}>
              CLAIM
            </PrimaryButton>
          ),
          cellAlign: "center",
        });
      }

      tableData.push(row);
    });

    return tableData;
  };

  return (
    <Box className={classes.content}>
      <Box className={classes.gradient} />
      {mobileMatch ? (
        <Box zIndex={1}>
          <Box
            display="flex"
            flexDirection="row"
            alignItems="center"
            style={{ cursor: "pointer" }}
            onClick={() => history.goBack()}
            mb={3}
          >
            <Box>
              <ArrowIcon color={"#54658F"} />
            </Box>
            <Box color="#54658F" fontSize={14} fontWeight={700} fontFamily="Agrandir" ml="5px" mb="4px">
              BACK
            </Box>
          </Box>
          <Box position="relative" height={441}>
            <img
              src={require("assets/anonAvatars/ToyFaces_Colored_BG_061.jpg")}
              style={{ objectFit: "cover", borderRadius: "16px", height: "90%", position: "absolute" }}
            />
          </Box>
          <Box className={classes.header2} mt={2}>
            Artist Profile
          </Box>
          <Box className={classes.headerTitle} mt={2}>
            {artist.name}
          </Box>
          <Box mt={2.5} display="flex" flexDirection="row" justifyContent="space-between">
            <Box>
              <Box className={classes.header1}>{artist.followers}</Box>
              <Box className={classes.header3}>Followers</Box>
            </Box>
            <Box>
              <Box className={classes.header1}>{artist.songs.length}</Box>
              <Box className={classes.header3}>Songs</Box>
            </Box>
          </Box>
          <Box mt={3.5}>
            <Box className={classes.flexBox}>
              <Box className={classes.flexBox}>
                <img src={require("assets/emojiIcons/watermelon.png")} />
                <Box className={classes.header1} ml={1}>
                  {mockArtistData.fruits[0]}
                </Box>
              </Box>
              <Box className={classes.flexBox} ml={2}>
                <img src={require("assets/emojiIcons/avocado.png")} />
                <Box className={classes.header1} ml={1}>
                  {mockArtistData.fruits[1]}
                </Box>
              </Box>
              <Box className={classes.flexBox} ml={2}>
                <img src={require("assets/emojiIcons/orange.png")} />
                <Box className={classes.header1} ml={1}>
                  {mockArtistData.fruits[2]}
                </Box>
              </Box>
            </Box>
            <Box ml={2.5} className={classes.header3}>Fruits</Box>
          </Box>
          <Box mt={2} className={classes.flexBox}>
            <Box className={classes.flexBox}>
              {creators.map((creator, index) => (
                <Box
                  ml={index > 1 ? "-16px" : 0}
                  key={index}
                  onClick={() => {
                    history.push(`/profile/${creator.id}`);
                  }}
                  title={creator?.name}
                  style={{ cursor: "pointer" }}
                >
                  <Avatar
                    size="medium"
                    url={
                      creator?.imageURL
                        ? `url(${creator?.imageURL})`
                        : require("assets/anonAvatars/ToyFaces_Colored_BG_035.jpg")
                    }
                  />
                </Box>
              ))}
            </Box>
            <Box ml={2} className={classes.svgBox}>
              <div ref={anchorShareMenuRef}>
                <ShareIcon onClick={showShareMenu} />
              </div>
            </Box>
            {openShareMenu && (
              <Popper
                open={openShareMenu}
                anchorEl={anchorShareMenuRef.current}
                transition
                disablePortal={false}
                style={{ position: "inherit" }}
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
                      <ClickAwayListener onClickAway={handleCloseShareMenu}>
                        <MenuList
                          autoFocusItem={openShareMenu}
                          id="menu-list-grow"
                          onKeyDown={handleListKeyDownShareMenu}
                        >
                          <CustomMenuItem onClick={handleOpenShareModal}>
                            <img
                              src={require("assets/icons/butterfly.png")}
                              alt={"spaceship"}
                              style={{ width: 20, height: 20, marginRight: 5 }}
                            />
                            Share on social media
                          </CustomMenuItem>
                          <CustomMenuItem onClick={handleOpenQRCodeModal}>
                            <img
                              src={require("assets/icons/qrcode_small.png")}
                              alt={"spaceship"}
                              style={{ width: 20, height: 20, marginRight: 5 }}
                            />
                            Share With QR Code
                          </CustomMenuItem>
                        </MenuList>
                      </ClickAwayListener>
                    </Paper>
                  </Grow>
                )}
              </Popper>
            )}
            <Box ml={2} className={classes.whiteBox} style={{ cursor: "pointer" }}>
              <Box className={classes.svgBox}>{!followed ? <PlusIcon /> : <MinusIcon />}</Box>
              <Box ml={1} onClick={handleFollow}>
                {followed ? "Unfollow" : "Follow"}
              </Box>
            </Box>
            <Box ml={2}>
              <FruitSelect counter1={3} counter2={30} counter3={123} fruitObject={{}} members={[]} />
            </Box>
          </Box>
          <StyledDivider type="solid" mt={2}/>
          <Box mt={2}>
            {!artist.isClaimed && (
              <PrimaryButton
                size="medium"
                onClick={() => setOpenSaluteModal(true)}
                style={{ background: "#2D3047", marginTop: 16, height: 52 }}
                isRounded
              >
                <Box className={classes.flexBox} color={"white !important"}>
                  <Box className={classes.header2} color={"white !important"}>
                    Claim Profile
                  </Box>
                  <Box ml={1} className={classes.flexBox}>
                    <img src={require("assets/icons/verified_filled_gradient.png")} />
                  </Box>
                </Box>
              </PrimaryButton>
            )}
            <PrimaryButton
              size="medium"
              onClick={() => { }}
              style={{ background: "#65CB63", marginTop: 16, height: 52 }}
            >
              <Box className={classes.flexBox} color={"white !important"}>
                <Box className={classes.header2} color={"white !important"}>
                  🤑 Funds to claim
                </Box>
                <Box className={classes.header1} color={"white !important"} ml={1}>
                  pUSD 21.304
                </Box>
              </Box>
            </PrimaryButton>
            <Box className={classes.flexBox} mt={2}>
              <img src={require("assets/icons/info_gray.png")} />
              <Box className={classes.header4} ml={1} style={{ fontSize: 9 }}>
                All Artist Must Verify Their Profiles in Order to Claim Funds
              </Box>
            </Box>
          </Box>
        </Box>
      )
        : tabletMatch ? (
          <Box zIndex={1}>
            <Box
              display="flex"
              flexDirection="row"
              alignItems="center"
              style={{ cursor: "pointer" }}
              onClick={() => history.goBack()}
              mb={3}
            >
              <Box>
                <ArrowIcon color={"#54658F"} />
              </Box>
              <Box color="#54658F" fontSize={14} fontWeight={700} fontFamily="Agrandir" ml="5px" mb="4px">
                BACK
              </Box>
            </Box>
            <Grid container spacing={4}>
              <Grid item md={6}>
                <Box className={classes.header2} mt={2}>
                  Artist Profile
                </Box>
                <Box className={classes.headerTitle} mt={2}>
                  {artist.name}
                </Box>
                <Box>
                  <Box className={classes.header1}>{artist.followers}</Box>
                  <Box className={classes.header3}>Followers</Box>
                </Box>
                <Box mt={3.5}>
                  <Box className={classes.flexBox}>
                    <Box className={classes.flexBox}>
                      <img src={require("assets/emojiIcons/watermelon.png")} />
                      <Box className={classes.header1} ml={1}>
                        {mockArtistData.fruits[0]}
                      </Box>
                    </Box>
                    <Box className={classes.flexBox} ml={2}>
                      <img src={require("assets/emojiIcons/avocado.png")} />
                      <Box className={classes.header1} ml={1}>
                        {mockArtistData.fruits[1]}
                      </Box>
                    </Box>
                    <Box className={classes.flexBox} ml={2}>
                      <img src={require("assets/emojiIcons/orange.png")} />
                      <Box className={classes.header1} ml={1}>
                        {mockArtistData.fruits[2]}
                      </Box>
                    </Box>
                  </Box>
                  <Box ml={2.5} className={classes.header3}>Fruits</Box>
                </Box>
                <Box mt={2.5}>
                  <Box className={classes.header1}>{artist.songs.length}</Box>
                  <Box className={classes.header3}>Songs</Box>
                </Box>
                <Box mt={2} className={classes.flexBox}>
                  <Box className={classes.flexBox}>
                    {creators.map((creator, index) => (
                      <Box
                        ml={index > 1 ? "-16px" : 0}
                        key={index}
                        onClick={() => {
                          history.push(`/profile/${creator.id}`);
                        }}
                        title={creator?.name}
                        style={{ cursor: "pointer" }}
                      >
                        <Avatar
                          size="medium"
                          url={
                            creator?.imageURL
                              ? `url(${creator?.imageURL})`
                              : require("assets/anonAvatars/ToyFaces_Colored_BG_035.jpg")
                          }
                        />
                      </Box>
                    ))}
                  </Box>
                  <Box ml={2} className={classes.svgBox}>
                    <div ref={anchorShareMenuRef}>
                      <ShareIcon onClick={showShareMenu} />
                    </div>
                  </Box>
                  {openShareMenu && (
                    <Popper
                      open={openShareMenu}
                      anchorEl={anchorShareMenuRef.current}
                      transition
                      disablePortal={false}
                      style={{ position: "inherit" }}
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
                            <ClickAwayListener onClickAway={handleCloseShareMenu}>
                              <MenuList
                                autoFocusItem={openShareMenu}
                                id="menu-list-grow"
                                onKeyDown={handleListKeyDownShareMenu}
                              >
                                <CustomMenuItem onClick={handleOpenShareModal}>
                                  <img
                                    src={require("assets/icons/butterfly.png")}
                                    alt={"spaceship"}
                                    style={{ width: 20, height: 20, marginRight: 5 }}
                                  />
                                  Share on social media
                                </CustomMenuItem>
                                <CustomMenuItem onClick={handleOpenQRCodeModal}>
                                  <img
                                    src={require("assets/icons/qrcode_small.png")}
                                    alt={"spaceship"}
                                    style={{ width: 20, height: 20, marginRight: 5 }}
                                  />
                                  Share With QR Code
                                </CustomMenuItem>
                              </MenuList>
                            </ClickAwayListener>
                          </Paper>
                        </Grow>
                      )}
                    </Popper>
                  )}
                  <Box ml={2} className={classes.whiteBox} style={{ cursor: "pointer" }}>
                    <Box className={classes.svgBox}>{!followed ? <PlusIcon /> : <MinusIcon />}</Box>
                    <Box ml={1} onClick={handleFollow}>
                      {followed ? "Unfollow" : "Follow"}
                    </Box>
                  </Box>
                  <Box ml={2}>
                    <FruitSelect counter1={3} counter2={30} counter3={123} fruitObject={{}} members={[]} />
                  </Box>
                </Box>
              </Grid>
              <Grid item md={6} style={{ position: "relative" }}>
                <img
                  src={require("assets/anonAvatars/ToyFaces_Colored_BG_061.jpg")}
                  style={{ objectFit: "cover", borderRadius: "16px", height: "90%", position: "absolute" }}
                />
              </Grid>
            </Grid>
            <Box mt={2} className={classes.flexBox} justifyContent="space-between">
              <PrimaryButton
                size="medium"
                onClick={() => { }}
                style={{ background: "#65CB63", marginTop: 16, height: 52 }}
              >
                <Box className={classes.flexBox} color={"white !important"}>
                  <Box className={classes.header2} color={"white !important"}>
                    🤑 Funds to claim
                  </Box>
                  <Box className={classes.header1} color={"white !important"} ml={1}>
                    pUSD 21.304
                  </Box>
                </Box>
              </PrimaryButton>
              {!artist.isClaimed && (
                <PrimaryButton
                  size="medium"
                  onClick={() => setOpenSaluteModal(true)}
                  style={{ background: "#2D3047", marginTop: 16, height: 52 }}
                  isRounded
                >
                  <Box className={classes.flexBox} color={"white !important"}>
                    <Box className={classes.header2} color={"white !important"}>
                      Claim Profile
                    </Box>
                    <Box ml={1} className={classes.flexBox}>
                      <img src={require("assets/icons/verified_filled_gradient.png")} />
                    </Box>
                  </Box>
                </PrimaryButton>
              )}
            </Box>
            <Box className={classes.flexBox} mt={2}>
              <img src={require("assets/icons/info_gray.png")} />
              <Box className={classes.header4} ml={1}>
                All Artist Must Verify Their Profiles in Order to Claim Funds
              </Box>
            </Box>
          </Box>
        )
          :
          (
            <Grid container style={{ zIndex: 1, position: "relative" }} spacing={5}>
              <Grid item xs={12} sm={8}>
                <Box className={classes.flexBox} justifyContent="space-between">
                  <Box
                    display="flex"
                    flexDirection="row"
                    alignItems="center"
                    style={{ cursor: "pointer" }}
                    onClick={() => history.goBack()}
                  >
                    <Box>
                      <ArrowIcon color={"#54658F"} />
                    </Box>
                    <Box color="#54658F" fontSize={14} fontWeight={700} fontFamily="Agrandir" ml="5px" mb="4px">
                      BACK
                    </Box>
                  </Box>
                  <Box className={classes.flexBox}>
                    <Box className={classes.flexBox}>
                      {creators.map((creator, index) => (
                        <Box
                          ml={index > 1 ? "-16px" : 0}
                          key={index}
                          onClick={() => {
                            history.push(`/profile/${creator.id}`);
                          }}
                          title={creator?.name}
                          style={{ cursor: "pointer" }}
                        >
                          <Avatar
                            size="medium"
                            url={
                              creator?.imageURL
                                ? `url(${creator?.imageURL})`
                                : require("assets/anonAvatars/ToyFaces_Colored_BG_035.jpg")
                            }
                          />
                        </Box>
                      ))}
                    </Box>
                    <Box ml={2} className={classes.svgBox}>
                      <div ref={anchorShareMenuRef}>
                        <ShareIcon onClick={showShareMenu} />
                      </div>
                    </Box>
                    {openShareMenu && (
                      <Popper
                        open={openShareMenu}
                        anchorEl={anchorShareMenuRef.current}
                        transition
                        disablePortal={false}
                        style={{ position: "inherit" }}
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
                              <ClickAwayListener onClickAway={handleCloseShareMenu}>
                                <MenuList
                                  autoFocusItem={openShareMenu}
                                  id="menu-list-grow"
                                  onKeyDown={handleListKeyDownShareMenu}
                                >
                                  <CustomMenuItem onClick={handleOpenShareModal}>
                                    <img
                                      src={require("assets/icons/butterfly.png")}
                                      alt={"spaceship"}
                                      style={{ width: 20, height: 20, marginRight: 5 }}
                                    />
                                    Share on social media
                                  </CustomMenuItem>
                                  <CustomMenuItem onClick={handleOpenQRCodeModal}>
                                    <img
                                      src={require("assets/icons/qrcode_small.png")}
                                      alt={"spaceship"}
                                      style={{ width: 20, height: 20, marginRight: 5 }}
                                    />
                                    Share With QR Code
                                  </CustomMenuItem>
                                </MenuList>
                              </ClickAwayListener>
                            </Paper>
                          </Grow>
                        )}
                      </Popper>
                    )}
                    <Box ml={2} className={classes.whiteBox} style={{ cursor: "pointer" }}>
                      <Box className={classes.svgBox}>{!followed ? <PlusIcon /> : <MinusIcon />}</Box>
                      <Box ml={1} onClick={handleFollow}>
                        {followed ? "Unfollow" : "Follow"}
                      </Box>
                    </Box>
                    <Box ml={2}>
                      <FruitSelect counter1={3} counter2={30} counter3={123} fruitObject={{}} members={[]} />
                    </Box>
                  </Box>
                </Box>
                <Box className={classes.header2} mt={2}>
                  Artist Profile
                </Box>
                <Box className={classes.headerTitle} mt={2}>
                  {artist.name}
                </Box>
                <Box
                  className={classes.flexBox}
                  justifyContent="space-between"
                  mt={3}
                  borderBottom="1px solid #00000022"
                  pb={2}
                >
                  <Box>
                    <Box className={classes.header1}>{artist.followers}</Box>
                    <Box className={classes.header3}>Followers</Box>
                  </Box>
                  <Box className={classes.vert} />
                  <Box>
                    <Box className={classes.flexBox}>
                      <Box className={classes.flexBox}>
                        <img src={require("assets/emojiIcons/watermelon.png")} />
                        <Box className={classes.header1} ml={1}>
                          {mockArtistData.fruits[0]}
                        </Box>
                      </Box>
                      <Box className={classes.flexBox} ml={2}>
                        <img src={require("assets/emojiIcons/avocado.png")} />
                        <Box className={classes.header1} ml={1}>
                          {mockArtistData.fruits[1]}
                        </Box>
                      </Box>
                      <Box className={classes.flexBox} ml={2}>
                        <img src={require("assets/emojiIcons/orange.png")} />
                        <Box className={classes.header1} ml={1}>
                          {mockArtistData.fruits[2]}
                        </Box>
                      </Box>
                    </Box>
                    <Box ml={2.5} className={classes.header3}>Fruits</Box>
                  </Box>
                  <Box className={classes.vert} />
                  <Box mr={7}>
                    <Box className={classes.header1}>{artist.songs.length}</Box>
                    <Box className={classes.header3}>Songs</Box>
                  </Box>
                </Box>
                <Box className={classes.flexBox} justifyContent="space-between">
                  <PrimaryButton
                    size="medium"
                    onClick={() => { }}
                    style={{ background: "#65CB63", marginTop: 16, height: 52 }}
                  >
                    <Box className={classes.flexBox} color={"white !important"}>
                      <Box className={classes.header2} color={"white !important"}>
                        🤑 Funds to claim
                      </Box>
                      <Box className={classes.header1} color={"white !important"} ml={1}>
                        pUSD 21.304
                      </Box>
                    </Box>
                  </PrimaryButton>
                  {!artist.isClaimed && (
                    <PrimaryButton
                      size="medium"
                      onClick={() => setOpenSaluteModal(true)}
                      style={{ background: "#2D3047", marginTop: 16, height: 52 }}
                      isRounded
                    >
                      <Box className={classes.flexBox} color={"white !important"}>
                        <Box className={classes.header2} color={"white !important"}>
                          Claim Profile
                        </Box>
                        <Box ml={1} className={classes.flexBox}>
                          <img src={require("assets/icons/verified_filled_gradient.png")} />
                        </Box>
                      </Box>
                    </PrimaryButton>
                  )}
                </Box>
                <Box className={classes.flexBox} mt={2}>
                  <img src={require("assets/icons/info_gray.png")} />
                  <Box className={classes.header4} ml={1}>
                    All Artist Must Verify Their Profiles in Order to Claim Funds
                  </Box>
                </Box>
              </Grid>
              <Grid item xs={12} sm={4}>
                <img
                  src={require("assets/anonAvatars/ToyFaces_Colored_BG_061.jpg")}
                  style={{ objectFit: "cover", borderRadius: "16px", position: "absolute", height: "100%" }}
                />
              </Grid>
            </Grid>
          )
      }
      <Box mt={10}>
        <Box className={classes.headerTitle}>Claimed songs</Box>
        <Box mt={2}>
          <CustomTable
            headers={tableHeaders}
            rows={getTableData()}
            placeholderText="No transaction"
            theme="artist"
            variant={Variant.Transparent}
          />
        </Box>
      </Box>
      {openSaluteModal && (
        <SaluteModal open={openSaluteModal} handleClose={() => setOpenSaluteModal(false)} />
      )}
    </Box>
  );
}
