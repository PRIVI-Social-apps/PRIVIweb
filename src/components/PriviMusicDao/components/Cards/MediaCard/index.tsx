import React from "react";

import { Grid } from "@material-ui/core";
import Popper from "@material-ui/core/Popper";
import MenuItem from "@material-ui/core/MenuItem";
import MenuList from "@material-ui/core/MenuList";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import Grow from "@material-ui/core/Grow";
import Paper from "@material-ui/core/Paper";

import { Accordion, AccordionDetails, AccordionSummary, Avatar, PrimaryButton } from "shared/ui-kit";
import Box from "shared/ui-kit/Box";
import URL from "shared/functions/getURL";
import PrintChart from "shared/ui-kit/Chart/Chart";
import { CustomTable, CustomTableCellInfo } from "shared/ui-kit/Table";
import { mediaCardStyles } from "./index.styles";
import GetFeedbackModal from "components/PriviPods/modals/GetFeedbackModal/GetFeedbackModal";
import { useTokenConversion } from "shared/contexts/TokenConversionContext";
import MediaTermsModal from "components/PriviMusicDao/modals/MediaTermsModal";

const videoPhoto = require("assets/backgrounds/video.png");
const videoLivePhoto = require("assets/backgrounds/live_video.png");
const audioPhoto = require("assets/backgrounds/audio.png");
const audioLivePhoto = require("assets/backgrounds/live_audio_1.png");
const blogPhoto = require("assets/backgrounds/blog.png");
const blogSnapPhoto = require("assets/backgrounds/blog_snap.png");
const digitalArtPhoto = require("assets/backgrounds/digital_art_2.png");

enum MediaType {
  Video = "VIDEO_TYPE",
  LiveVideo = "LIVE_VIDEO_TYPE",
  Audio = "AUDIO_TYPE",
  LiveAudio = "LIVE_AUDIO_TYPE",
  Blog = "BLOG_TYPE",
  BlogSnap = "BLOG_SNAP_TYPE",
  DigitalArt = "DIGITAL_ART_TYPE",
}

const RadialConfig = {
  config: {
    type: "doughnut",
    data: {
      datasets: [
        {
          data: [] as any,
          backgroundColor: [] as any,
          hoverOffset: 0,
          labels: [] as any,
        },
      ],
    },
    options: {
      cutoutPercentage: 80,
      animation: false,
      rotation: Math.PI / 2,
      tooltips: { enabled: false },
    },
  },
};

export const MediaCard = ({ media }) => {
  const classes = mediaCardStyles();
  const { convertTokenToUSD } = useTokenConversion();
  const [stakingRadialConfig, setStakingRadialConfig] = React.useState<any>();
  const [openMediaTermsModal, setOpenMediaTermsModal] = React.useState<boolean>(false);
  const [openFeedbackModal, setOpenFeedbackModal] = React.useState<boolean>(false);
  const [open, setOpen] = React.useState<boolean>(false);
  const anchorRef = React.useRef<any>();

  React.useEffect(() => {
    const newStakingRadial = JSON.parse(JSON.stringify(RadialConfig));
    newStakingRadial.config.data.datasets[0].labels = [
      "Creator Fraction",
      "Fractions For Sale",
      "Sold Fractions",
    ];
    newStakingRadial.config.data.datasets[0].data = [50, 25, 25];
    newStakingRadial.config.data.datasets[0].backgroundColor = ["#0FCEA6", "#FF78D3", "#F9E373"];
    setStakingRadialConfig(newStakingRadial);
  }, []);

  const handleToggle = () => {
    setOpen(prevOpen => !prevOpen);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleOpenFeedback = () => {
    setOpenFeedbackModal(true);
    handleClose();
  };

  const handleCloseFeedbackModal = () => {
    setOpenFeedbackModal(false);
  };

  function handleListKeyDown(event) {
    if (event.key === "Tab") {
      event.preventDefault();
      setOpen(false);
    }
  }

  const getMenuPopper = () => {
    return (
      <Popper
        open={open}
        anchorEl={anchorRef.current}
        role={undefined}
        transition
        disablePortal
        placement="bottom-end"
      >
        {({ TransitionProps, placement }) => (
          <Grow {...TransitionProps}>
            <Paper>
              <ClickAwayListener onClickAway={handleClose}>
                <MenuList autoFocusItem={open} id="menu-list-grow" onKeyDown={handleListKeyDown}>
                  <MenuItem onClick={handleClose}>Sell On A Community</MenuItem>
                  <MenuItem onClick={handleOpenFeedback}>Get Feedback</MenuItem>
                  <MenuItem onClick={() => setOpenMediaTermsModal(true)}>Edit Terms</MenuItem>
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
    );
  };

  const getDefaultImage = type => {
    switch (type) {
      case "VIDEO_TYPE":
        return videoPhoto;
      case "LIVE_VIDEO_TYPE":
        return videoLivePhoto;
      case "AUDIO_TYPE":
        return audioPhoto;
      case "LIVE_AUDIO_TYPE":
        return audioLivePhoto;
      case "BLOG_TYPE":
        return blogPhoto;
      case "BLOG_SNAP_TYPE":
        return blogSnapPhoto;
      case "DIGITAL_ART_TYPE":
        return digitalArtPhoto;
      default:
        return "none";
    }
  };

  // console.log(media);

  return (
    <Box className={classes.container}>
      <Box className={classes.podImageContent}>
        <Box
          className={classes.podImage}
          style={{
            backgroundImage: media.HasPhoto
              ? `url(${URL()}/media/getMediaMainPhoto/${media.MediaSymbol.replace(/\s/g, "")})`
              : `url(${getDefaultImage(media.Type)})`,
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
            backgroundPosition: "center",
            overflow: "hidden",
          }}
        />
      </Box>
      <Box className={`${classes.flexBox} ${classes.avatarBox}`}>
        {[1, 2, 3].map((item, index) => (
          <Box ml={item > 1 ? "-16px" : 0} key={index} className={classes.flexBox}>
            <Avatar size="small" url={require("assets/anonAvatars/ToyFaces_Colored_BG_035.jpg")} alt="" />
          </Box>
        ))}
        <Box className={classes.moreBox}>+11</Box>
      </Box>
      <div className={classes.menuBox} ref={anchorRef} onClick={handleToggle}>
        <img src={require("assets/icons/three_dots.png")} />
      </div>
      <Box className={classes.fractionBox}>
        <Box className={classes.flexBox}>
          <Box>Fractionalised 50%</Box>
        </Box>
      </Box>
      {getMenuPopper()}
      <Box mt={30} mx={4} zIndex={1}>
        <Box className={classes.title} mt={2}>
          {media.MediaName || "Untitled Media"}
        </Box>
        <Box mt={2} className={classes.header1}>
          {media.Description || "No Description"}
        </Box>
      </Box>
      <Box mt={2} mx={4}>
        <Accordion defaultExpanded>
          <AccordionSummary>
            <Box mt={3} className={classes.flexBox} width={1}>
              <Box width={1}>
                <Box className={classes.header2}>Regular Price</Box>
                <Box className={classes.header3}>{`$${(media.PricePerSecondUSD ?? 0) * 60
                  } / per minute`}</Box>
              </Box>
              <Box width={1} ml={2}>
                <Box className={classes.header2}>NFT Price</Box>
                <Box className={classes.header3}>{`$${media.PriceUSD || 0}`}</Box>
              </Box>
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            <Box mt={1} className={classes.flexBox} justifyContent="space-between">
              <Box>
                <Box className={classes.header1}>Investor share</Box>
                <Box className={classes.header2}>
                  {media.InvestorShare ? (media.InvestorShare * 100).toFixed(0) : "0"}%
                </Box>
              </Box>
              <Box ml={2}>
                <Box className={classes.header1}>Sharing share</Box>
                <Box className={classes.header2}>
                  {media.SharingPercent ? (media.SharingPercent * 100).toFixed(0) : "0"}%
                </Box>
              </Box>
              <Box ml={2}>
                <Box className={classes.header1}>Collabs share</Box>
                <Box className={classes.header2}>
                  {1 - (media.InvestorShare || 0) - (media.SharingPercent || 0) * 100}%
                </Box>
              </Box>
              <Box ml={2}>
                <Box className={classes.header1}>Royalty</Box>
                <Box className={classes.header2}>
                  {media.Royalty ? (media.Royalty * 100).toFixed(0) : "0"}%
                </Box>
              </Box>
            </Box>
          </AccordionDetails>
        </Accordion>
      </Box>
      <Box mx={4}>
        <Accordion>
          <AccordionSummary>
            <Box className={classes.header2}>Ownership Distribution</Box>
          </AccordionSummary>
          <AccordionDetails>
            <Box mt={1} className={classes.flexBox} justifyContent="space-between">
              <Box maxWidth="150px">
                {stakingRadialConfig && <PrintChart config={stakingRadialConfig} canvasHeight={250} />}
              </Box>
              <Box ml={2} width={1}>
                {stakingRadialConfig &&
                  stakingRadialConfig.config.data.datasets[0].labels.map((item, index) => (
                    <Box
                      className={classes.flexBox}
                      mb={2}
                      style={{ borderBottom: "1px dashed grey" }}
                      justifyContent="space-between"
                      pb={1}
                      key={item + "-" + index}
                    >
                      <Box className={classes.flexBox}>
                        <Box
                          className={classes.radialLabelBox}
                          style={{
                            background: stakingRadialConfig.config.data.datasets[0].backgroundColor[index],
                          }}
                        />
                        <Box className={classes.header2} ml={2}>
                          {item}
                        </Box>
                      </Box>
                      <Box className={classes.header2} ml={2}>
                        {stakingRadialConfig.config.data.datasets[0].data[index]}%
                      </Box>
                    </Box>
                  ))}
              </Box>
            </Box>
          </AccordionDetails>
        </Accordion>
      </Box>
      <Box mt={2} className={classes.flexBox} justifyContent="flex-end" mx={4} mb={4}>
        <PrimaryButton size="small" onClick={() => setOpenMediaTermsModal(true)}>Edit Terms</PrimaryButton>
      </Box>
      {openFeedbackModal && (
        <GetFeedbackModal open={openFeedbackModal} handleClose={handleCloseFeedbackModal} />
      )}
      {openMediaTermsModal && (
        <MediaTermsModal open={openMediaTermsModal} handleClose={() => setOpenMediaTermsModal(false)} />
      )}
    </Box>
  );
};
