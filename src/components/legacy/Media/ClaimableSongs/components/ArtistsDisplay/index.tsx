import React, { useContext, useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core";
import { Gradient, Header3 } from "shared/ui-kit";
import { createStyles } from "@material-ui/styles";
import ArtistCard from "../Cards/ArtistCard";
import { useSelector } from "react-redux";
import { RootState } from "store/reducers/Reducer";
import MainPageContext from "components/legacy/Media/context";
import MediaClaimableSongsArtistsFilters from "../Filters/ArtistFilters";
import { MasonryGrid } from "shared/ui-kit/MasonryGrid/MasonryGrid";
import { LoadingWrapper } from "shared/ui-kit/Hocs";

const arrow = require("assets/icons/arrow.png");

const useStyles = makeStyles(() =>
  createStyles({
    artistDisplay: {
      display: "flex",
      flexDirection: "column",
      width: "100%",
    },
    back: {
      color: "white",
      fontSize: "14px",
      cursor: "pointer",
    },
    artistDisplayHeader: {
      marginLeft: "-72px",
      display: "flex",
      flexDirection: "column",
      width: "calc(100% + 72px * 2)",
      justifyContent: "space-between",
      padding: "22px 72px 26px",
      height: "487px",
      marginBottom: "54px",
      "& h5": {
        color: "white",
        fontStyle: "normal",
        fontWeight: "normal",
        fontSize: "36px",
        lineHeight: "104.5%",
        margin: 0,
        zIndex: 1,
      },
      "& h2": {
        color: "white",
        fontStyle: "normal",
        fontWeight: "800",
        fontSize: "80px",
        margin: "11px 0px 23px",
        zIndex: 1,
      },
    },
    gradient: {
      marginLeft: "-72px",
      width: "calc(100% + 2 * 72px)",
      height: "300px",
      zIndex: 0,
      marginBottom: "-26px",
      marginTop: "-274px",
      background: "linear-gradient(180deg, rgba(21, 21, 21, 0) -0%, rgba(14, 14, 14, 0.6) 100%)",
    },
    row: {
      zIndex: 1,
      display: "flex",
      alignItems: "center",
      paddingTop: "32px",
      borderTop: "1px solid #FFFFFF",
      "& div": {
        display: "flex",
        alignItems: "center",
        color: "white",
        fontStyle: "normal",
        fontWeight: "normal",
        fontSize: "18px",
        marginRight: "40px",
        "& span": {
          fontStyle: "normal",
          fontWeight: "bold",
          fontSize: "14px",
          marginRight: "6px",
        },
      },
    },
    carousel: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      width: "100%",
    },
    header: {
      width: "100%",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      paddingBottom: 18,
      borderBottom: "1px solid #181818",
      "& h3": {
        fontWeigth: 700,
      },
      "& span": {
        fontStyle: "normal",
        fontWeight: "normal",
        background: Gradient.Mint,
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        fontSize: 14,
        marginLeft: 20,
        cursor: "pointer",
      },
    },
    title: {
      display: "flex",
      alignItems: "center",
    },
    buttons: {
      "& button": {
        marginLeft: 50,
        background: "transparent",
        padding: 0,
        outline: "none",
        "& img": {
          width: 8,
          height: 16,
        },
        "&:first-child": {
          "& img": {
            transform: "rotate(180deg)",
          },
        },
      },
    },
    listContainer: {
      display: "flex",
      width: "100%",
      marginBottom: 20,
    },
    list: {
      marginTop: "30px",
      display: "flex",
      flexWrap: "nowrap",
      alignItems: "center",
      overflow: "hidden",
      padding: "20px 0px",
      scrollBehavior: "smooth",
    },
    artistsWrap: {
      width: "100%",
      "& > div": {
        width: "100%",
      },
      paddingBottom: "20px",
    },
  })
);

const genresMock = ["Rock", "Indie", "Pop"];

export default function ArtistsDisplay() {
  const users = useSelector((state: RootState) => state.usersInfoList);

  const { setMediaFullScreen } = useContext(MainPageContext);

  const classes = useStyles();
  const [artists, setArtists] = useState<any>([]);
  const [filters, setFilters] = useState<any>([]);

  const filteredData = () => {
    let filteredData = [...artists];

    //this should be filtered in backend, but there's no functions yet..
    if (filters.searchValue && filters.searchValue !== "") {
      filteredData = filteredData.filter(
        artist =>
          (artist.name && artist.name.toUpperCase().includes(filters.searchValue?.toUpperCase())) ||
          (artist.urlSlug && artist.urlSlug.toUpperCase().includes(filters.searchValue?.toUpperCase()))
      );
    }

    return filteredData;
  };

  useEffect(() => {
    if (users && users.length > 0) {
      const usersCopy = users.filter(u => u.imageURL && u.imageURL !== "");

      setArtists(usersCopy);
    }
  }, [users]);

  return (
    <div className={classes.artistDisplay}>
      <div
        className={classes.artistDisplayHeader}
        style={{
          backgroundImage: `url(https://cdn.wegow.com/media/artists/the-weeknd/the-weeknd-1585555957.8601027.2560x1440.jpg)`,
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <span
          className={classes.back}
          onClick={() => {
            setMediaFullScreen(null);
          }}
        >
          {`< Back`}
        </span>
        <div>
          <h5>Claimable Songs</h5>
          <h2>Artists</h2>
          <div className={classes.row}>
            <div>
              <span>🌟 Total:</span> {artists.length ?? 0}
            </div>
            <div>
              <span>✅ Verified:</span> {artists.filter(a => a.verified).length ?? 0}
            </div>
          </div>
          <div className={classes.gradient} />
        </div>
      </div>
      <MediaClaimableSongsArtistsFilters filters={filters} onFiltersChange={setFilters} />
      {!filters.searchValue || filters.searchValue === "" ? (
        genresMock.map((genre, index) => (
          <div className={classes.carousel} key={genre ?? `genre-${index}`}>
            <div className={classes.header}>
              <div className={classes.title}>
                <Header3 noMargin={true}>{genre}</Header3>
                <span
                  onClick={() => {
                    setMediaFullScreen(genre);
                  }}
                >
                  See all
                </span>
              </div>
              <div className={classes.buttons}>
                <button
                  onClick={() => {
                    document.getElementById(genre ?? `genre-${index}`)!.scrollLeft -= 75;
                  }}
                >
                  <img src={arrow} alt="" />
                </button>
                <button
                  onClick={() => {
                    document.getElementById(genre ?? `genre-${index}`)!.scrollLeft += 75;
                  }}
                >
                  <img src={arrow} alt="" />
                </button>
              </div>
            </div>
            <div className={classes.listContainer}>
              <LoadingWrapper loading={!artists || artists.length === 0}>
                <div className={classes.list} id={genre ?? `genre-${index}`}>
                  {artists.map((artist, index) => (
                    <ArtistCard artist={artist} key={artist.id ?? `artist-${index}`} />
                  ))}
                </div>
              </LoadingWrapper>
            </div>
          </div>
        ))
      ) : (
        <div className={classes.artistsWrap}>
          <MasonryGrid
            data={filteredData()}
            renderItem={(artist, index) => (
              <ArtistCard artist={artist} key={artist?.id ?? `artist-${index}`} />
            )}
            columnsCountBreakPoints={COLUMNS_COUNT_BREAK_POINTS}
            gutter={GUTTER}
          />
        </div>
      )}
    </div>
  );
}

const COLUMNS_COUNT_BREAK_POINTS = {
  767: 2,
  900: 3,
  1200: 4,
  1510: 5,
};
const GUTTER = "36px";
