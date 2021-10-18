import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";

import { makeStyles } from "@material-ui/core/styles";

import { PrimaryButton, TabNavigation } from "shared/ui-kit";
import { LoadingWrapper } from "shared/ui-kit/Hocs";
import { CustomTable, CustomTableCellInfo, CustomTableHeaderInfo } from "shared/ui-kit/Table";
import Box from 'shared/ui-kit/Box';

enum MediaType {
  Video = "VIDEO_TYPE",
  LiveVideo = "LIVE_VIDEO_TYPE",
  Audio = "AUDIO_TYPE",
  LiveAudio = "LIVE_AUDIO_TYPE",
  Blog = "BLOG_TYPE",
  BlogSnap = "BLOG_SNAP_TYPE",
  DigitalArt = "DIGITAL_ART_TYPE",
}

const useStyles = makeStyles(() => ({
  back: {
    "& span": {
      background: "linear-gradient(97.4deg, #23D0C6 14.43%, #00CC8F 85.96%)",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
      fontSize: 14,
    },
    marginBottom: 20,
    cursor: "pointer",
  },
  header: {
    marginBottom: 60,
    "& h1": {
      fontFamily: "Agrandir GrandLight",
      fontWeight: 300,
      fontSize: 64,
      margin: 0,
      zIndex: 2,
    },
    "& img": {
      marginLeft: "-25px",
      marginBottom: "-10px",
      zIndex: 1,
    },
    "& h3": {
      fontWeight: "normal",
      fontSize: 25,
      color: "#181818",
      margin: "3px 0px 0px",
      zIndex: 2,
    },
  },
  tabBox: {
    zIndex: 2,
    position: "static",
    backgroundColor: "transparent",
    boxShadow: "none",
    textTransform: "none",
    borderRadius: 0,
  },
  tabItem: {
    fontFamily: "Agrandir",
    height: "auto",
    minWidth: "90px",
    textTransform: "inherit",
    lineHeight: "32px",
    fontSize: 25,
    fontWeight: "bold",
    "&.Mui-selected": {
      "& span": {
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        background: "linear-gradient(97.4deg, #23D0C6 14.43%, #00CC8F 85.96%)",
      },
    },
    "& span": {
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
      background: "#ABB3C4",
    },
  },
  tabUnderline: {
    zIndex: 1,
    width: "100%",
    height: "3px",
    borderBottom: "3px solid #E0E4F3",
    marginTop: "-3px",
    marginBottom: 80,
  },
  typeImage: {
    width: 60,
    height: 60,
    marginRight: 10,
  },
  collectionImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 12,
  },
  borderRightContent: {
    borderRight: "1px solid #0000002f",
  },
  borderContent: {
    borderRight: "1px solid #0000002f",
    borderLeft: "1px solid #0000002f",
  },
  loaderDiv: {
    width: "100%",
    display: "flex",
    alignItems: "center",
    alignContent: "center",
    justifyContent: "center",
  },
}));

const getEthIcon = collection => {
  return require(`assets/priviIcons/${
    collection.startsWith("EthMedia") ? collection.slice(8).toLowerCase() : collection.toLowerCase()
  }_icon.png`);
};

export const VotingList = ({ setCollection, priviCollections, ethCollections }) => {
  const history = useHistory();
  const classes = useStyles();

  const [list, setList] = useState<any>(priviCollections);
  const [selectedTab, setSelectedTab] = useState<number>(0);

  useEffect(() => {
    if (selectedTab === 0) {
      setList(priviCollections);
    } else if (selectedTab === 1) {
      setList(ethCollections.filter(item => item.Collection !== "EthMediaWax"));
    } else {
      setList(ethCollections.filter(item => item.Collection === "EthMediaWax"));
    }
  }, [selectedTab, priviCollections, ethCollections]);

  const tableHeaders: Array<CustomTableHeaderInfo> = [
    {
      headerName: selectedTab === 0 ? "MEDIA TYPE" : "COLLECTION"
    }, {
      headerName: "ITEMS",
      headerAlign: "center",
    }, {
      headerName: "VOTES",
      headerAlign: "center",
    }, {
      headerName: "REWARD POINTS"
    }, {
      headerName: ""
    }
  ];
  const [tableData, setTableData] = useState<Array<Array<CustomTableCellInfo>>>([]);

  useEffect(() => {
    let data: Array<Array<CustomTableCellInfo>> = [];
    if (list && list.length) {
      data = list.map((row) => {
        return [{
          cell: (
            !row.Tag ? (
              <Box display="flex" flexDirection="row" alignItems="center" className={classes.borderRightContent}>
                <img
                  src={require(`assets/mediaIcons/small/${
                    row.Type === MediaType.DigitalArt
                      ? `digital_art`
                      : row.Type === MediaType.Video
                      ? `video`
                      : row.Type === "Playlist"
                      ? `playlist`
                      : row.Type === MediaType.Audio
                      ? `audio`
                      : row.Type === MediaType.Blog
                      ? `blog`
                      : `blog_snap`
                  }.png`)}
                  alt={row.Type}
                  className={classes.typeImage}
                />
                {row.Type === MediaType.DigitalArt
                  ? `Digital Art`
                  : row.Type === MediaType.Video
                  ? `Video`
                  : row.Type === "Playlist"
                  ? `Playlist`
                  : row.Type === MediaType.Audio
                  ? `Audio`
                  : row.Type === MediaType.Blog
                  ? `Blog`
                  : `Blog snap`}
              </Box>
            ) : (
              <Box display="flex" flexDirection="row" alignItems="center" className={classes.borderRightContent}>
                <div
                  className={classes.collectionImage}
                  style={{
                    backgroundImage:
                      row.collectionImage && row.collectionImage.length > 0
                        ? `url(${row.collectionImage})`
                        : `url(${getEthIcon(row.Collection)})`,
                    backgroundRepeat: "no-repeat",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                />
                {row.Collection.startsWith("EthMedia") ? row.Collection.slice(8) : row.Collection}
              </Box>
            )
          )
        }, {
          cell: <Box className={classes.borderRightContent}>{row.Items ? row.Items.length : 0}</Box>,
          cellAlign: "center",
        }, {
          cell: <Box className={classes.borderRightContent}>{row.TotalVotes}</Box>,
          cellAlign: "center",
        }, {
          cell: row.RewardPoints,
        }, {
          cell: (
            <PrimaryButton
              disabled={row.Items.length < 2}
              size="medium"
              onClick={() => {
                setCollection(row);
              }}
            >
              Vote
            </PrimaryButton>
          ),
          cellAlign: "right",
        }];
      });
    }

    setTableData(data);
  }, [list]);

  return (
    <Box>
      <Box display="flex" flexDirection="row" className={classes.back} onClick={() => history.goBack()}>
        <span>{`< Back to Marketplace`}</span>
      </Box>
      <Box display="flex" flexDirection="column" className={classes.header}>
        <Box display="flex" flexDirection="row" alignItems="flex-end">
          <h1>
            Vote <b>NFTs</b>
          </h1>
          <img src={require("assets/backgrounds/thumbs.png")} alt="thumbs" />
        </Box>
        <Box display="flex" flexDirection="row">
          <h3> Share your thoughts and get rewarded!</h3>
        </Box>
      </Box>
      <LoadingWrapper loading={!priviCollections.length || !ethCollections.length}>
        <>
          <TabNavigation
            tabs={["Privi", "Ethereum", "Wax"]}
            currentTab={selectedTab}
            variant="secondary"
            onTabChange={setSelectedTab}
          />
          <Box className={classes.tabUnderline} />

          <CustomTable
            headers={tableHeaders}
            rows={tableData}
          />
        </>
      </LoadingWrapper>
    </Box>
  );
};
