import React, { useEffect, useState } from "react";
import Axios from "axios";
import URL from "shared/functions/getURL";
import { makeStyles } from "@material-ui/core";
import { useTypedSelector } from "store/reducers/Reducer";
import { VotingVs } from "./components/VotingVs";
import { VotingList } from "./components/VotingList";

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
  root: {
    width: "100%",
    maxHeight: "calc(100vh - 82px)",
    height: "calc(100vh - 82px)",
    overflowY: "auto",
    padding: "60px 120px 0px",
  },
}));

const priviVotingMock = [
  {
    Type: MediaType.Video,
    Items: [
      "testmediaforplaylist",
      "Wanttobefree-BritishSeaPower",
      "Thesedays",
      "TheseDays-Rudimetal",
      "SunriseOverTrees",
    ],
    TotalVotes: 561,
    RewardPoints: 561,
  },
  {
    Type: MediaType.Audio,
    Items: ["2002byAnneMarie", "Bensound-Cute", "Bensound-HappyRock"],
    TotalVotes: 561,
    RewardPoints: 561,
  },
  {
    Type: MediaType.DigitalArt,
    Items: ["AssortedColorWall", "Wk40Wallpaper", "TestFractionaliseMedia"],
    TotalVotes: 561,
    RewardPoints: 561,
  },
  { Type: MediaType.BlogSnap, Items: ["TestBlogSnap"], TotalVotes: 561, RewardPoints: 561 },
  { Type: MediaType.Blog, Items: ["MyTestBlogPpst", "LoremIpsum"], TotalVotes: 561, RewardPoints: 561 },
  {
    Type: "Playlist",
    Items: ["ETH1", "ETHNI", "Myfavouritesongs", "ETH11", "NewPlayLIst"],
    TotalVotes: 561,
    RewardPoints: 561,
  },
];
const ethVotingMock = [
  {
    Tag: "wax",
    Collection: "alien.worlds",
    Items: [
      "wax.atomichub.io-market-sale-9403582",
      "wax.atomichub.io-market-sale-9403590",
      "wax.atomichub.io-market-sale-9403598",
      "wax.atomichub.io-market-sale-9403608",
      "wax.atomichub.io-market-sale-9403609",
      "wax.atomichub.io-market-sale-9403610",
      "wax.atomichub.io-market-sale-9403631",
      "wax.atomichub.io-market-sale-9403650",
    ],
    TotalVotes: 561,
    RewardPoints: 561,
  },
  {
    Tag: "opensea",
    Collection: "rarible",
    Items: [
      "0x60f80121c31a0d46b5279700f9df786054aa5ee5",
      "0x60f80121c31a0d46b5279700f9df786054aa5ee5-884896",
      "0x60f80121c31a0d46b5279700f9df786054aa5ee5-888088",
      "0x60f80121c31a0d46b5279700f9df786054aa5ee5-890423",
      "0x60f80121c31a0d46b5279700f9df786054aa5ee5-893769",
      "0x60f80121c31a0d46b5279700f9df786054aa5ee5-893791",
      "0x60f80121c31a0d46b5279700f9df786054aa5ee5-893805",
      "0x60f80121c31a0d46b5279700f9df786054aa5ee5-894100",
      "0x60f80121c31a0d46b5279700f9df786054aa5ee5-894128",
      "0x60f80121c31a0d46b5279700f9df786054aa5ee5-894161",
    ],
    TotalVotes: 561,
    RewardPoints: 561,
  },
];

const VotingPage = () => {
  const classes = useStyles();
  const user = useTypedSelector(state => state.user);

  const [priviCollections, setPriviCollections] = useState<any>([]);
  const [ethCollections, setEthCollections] = useState<any>([]);
  const [selectedCollection, setSelectedCollection] = useState<any>(null);
  const [isDataLoading, setIsDataLoading] = useState<boolean>(false);

  // initialise
  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (!selectedCollection) {
      loadData();
    }
  }, [selectedCollection]);

  // TODO: load data
  const loadData = () => {
    setIsDataLoading(true);
    Axios.get(`${URL()}/media/getAllVotes`)
      .then(({ data }) => {
        if (data.success) {
          setPriviCollections(data.data.priviVotings);
          setEthCollections(data.data.ethVotings);
        }
        setIsDataLoading(false);
      })
      .catch(e => {
        console.log(e);
        setIsDataLoading(false);
      });
  };

  return (
    <div className={classes.root}>
      {selectedCollection ? (
        <VotingVs collection={selectedCollection} setCollection={setSelectedCollection} />
      ) : (
        <VotingList
          setCollection={setSelectedCollection}
          priviCollections={priviCollections}
          ethCollections={ethCollections}
        />
      )}
    </div>
  );
};

export default VotingPage;
