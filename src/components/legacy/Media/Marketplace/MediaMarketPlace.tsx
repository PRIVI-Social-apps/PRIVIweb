import React, { useEffect, useState } from "react";
import MediaMarketplaceFilters from "./components/MediaMarketplaceFilters";
import styled from "styled-components";
import MediaMarketplaceCard from "./components/Cards/MediaMarketplaceCard/MediaMarketplaceCard";
import { MasonryGrid } from "shared/ui-kit/MasonryGrid/MasonryGrid";
import { useSelector } from "react-redux";
import { RootState } from "store/reducers/Reducer";
import {
  // FILTER_TYPE,
  initialFilters,
  SearchMediaMarketplaceFilters,
} from "./components/MediaMarketplaceFilters/initialFilters";
import URL from "shared/functions/getURL";
import Axios from "axios";
import { CircularLoadingIndicator } from "shared/ui-kit";
import { removeUndef } from "shared/helpers/fp";
import { useTokenConversion } from "shared/contexts/TokenConversionContext";
import { usePageRefreshContext } from "shared/contexts/PageRefreshContext";

enum FILTER_TYPE {
  Auction = "AUCTION_TYPE",
  Sale = "SALE_TYPE",
  Media = "MEDIA_TYPE",
  Crypto = "CRYPTO_TYPE",
  PhysicalNFT = "PHYSICAL_NFT_TYPE",
  FT = "FT_TYPE",
}

const MediaMarketPlace = () => {
  const users = useSelector((state: RootState) => state.usersInfoList);

  const [loading, setLoading] = useState<boolean>(false);
  const [filters, setFilters] = useState<SearchMediaMarketplaceFilters>(initialFilters);
  const [data, setData] = useState<any[]>([""]);

  const { convertTokenToUSD } = useTokenConversion();
  const { requireMarketPlacePageReload, setRequireMarketPlacePageReload } = usePageRefreshContext();

  const fetchData = (forceRefreshCache?: boolean) => {
    if (users && users.length > 0) {
      setLoading(true);
      Axios.get(
        `${URL()}/media/getMarketplaceMedias`,
        forceRefreshCache
          ? {
              params: {
                forceRefreshCache: true,
              },
            }
          : undefined
      )
        .then(res => {
          const resp = res.data;
          if (resp.success) {
            const d = resp.data;

            const marketPlaceData = [] as any;

            d.forEach((media, index) => {
              d[index].ImageUrl = d.HasPhoto
                ? `${URL()}/media/getMediaMainPhoto/${d.MediaSymbol.replace(/\s/g, "")}`
                : undefined;

              const artistUser = users.find(
                user =>
                  (d.Creator && d.Creator !== "" && user.id === d.Creator) ||
                  (d.CreatorId && d.CreatorId !== "" && user.id === d.CreatorId) ||
                  (d.Requester && d.Requester !== "" && user.id === d.Requester) ||
                  (d.CreatorAddress && d.CreatorAddress !== "" && user.address === d.CreatorAddress)
              );

              d[index].Artist = artistUser
                ? {
                    name: artistUser.name ?? "",
                    imageURL: artistUser.imageURL ?? "",
                    urlSlug: artistUser.urlSlug ?? "",
                    id: artistUser.id ?? "",
                  }
                : undefined;

              d[index].SavedCollabs =
                d.SavedCollabs && d.SavedCollabs.length > 0
                  ? d.SavedCollabs.map(collaborator => {
                      const collaboratorUser = users.find(user => user.id === collaborator.id);

                      return collaboratorUser
                        ? {
                            ...collaborator,
                            name: collaboratorUser.name ?? "",
                            imageURL: collaboratorUser.imageURL ?? "",
                            urlSlug: collaboratorUser.urlSlug ?? "",
                            id: collaboratorUser.id ?? "",
                          }
                        : undefined;
                    }).filter(removeUndef)
                  : undefined;

              if (
                d.QuickCreation &&
                d.ViewConditions &&
                d.ViewConditions.Price > 0 &&
                d.ViewConditions.ViewingToken
              ) {
                d[index].usdPrice = `${convertTokenToUSD(
                  d.ViewConditions.ViewingToken.toUpperCase(),
                  d.ViewConditions.Price
                ).toFixed(6)}${d.ViewConditions.ViewingType === "STREAMING" ? "/per sec" : ""}`;
                d[index].price = `${d.ViewConditions.ViewingToken.toUpperCase()} ${d.ViewConditions.Price}${
                  d.ViewConditions.ViewingType && d.ViewConditions.ViewingType === "STREAMING"
                    ? "/per sec"
                    : ""
                }`;
              } else {
                if (d.Price > 0 && d.FundingToken) {
                  d[index].usdPrice = convertTokenToUSD(d.FundingToken.toUpperCase(), d.Price).toFixed(6);
                  d[index].price = `${d.FundingToken.toUpperCase()}${d.Price}`;
                } else if (d.PricePerSecond > 0 && d.FundingToken) {
                  d[index].usdPrice = convertTokenToUSD(
                    d.FundingToken.toUpperCase(),
                    d.PricePerSecond
                  ).toFixed(6);
                  d[index].price = `${d.FundingToken.toUpperCase()} ${d.PricePerSecond}/per sec`;
                }
              }

              marketPlaceData.push(media);
            });

            setData(marketPlaceData);
            setLoading(false);
          } else {
            setLoading(false);
          }
        })
        .catch(error => {
          console.error(error);
          setLoading(false);
        });
    }
  };

  useEffect(() => {
    fetchData();
  }, [users]);

  useEffect(() => {
    if (requireMarketPlacePageReload) {
      fetchData(true);
      setRequireMarketPlacePageReload(false);
    }
  }, [requireMarketPlacePageReload]);

  const filteredData = () => {
    let filteredData = [...data];

    // option filter
    if (filters.filterTypes.length === 1) {
      const type = filters.filterTypes[0];
      if (type === FILTER_TYPE.Auction) {
        filteredData = filteredData.filter(item => item.Auctions);
      } else if (type === FILTER_TYPE.Sale) {
        filteredData = filteredData.filter(item => item.Exchange);
      }
    }

    // search filter
    if (filters.searchValue) {
      filteredData = filteredData.filter(item =>
        item.MediaSymbol.toLowerCase().includes(filters.searchValue?.toLowerCase())
      );
    }
    return filteredData;
  };

  return (
    <>
      <MediaMarketplaceFilters filters={filters} onFiltersChange={setFilters} />
      <div
        style={{
          fontSize: "30px",
          width: "100%",
          paddingBottom: "15px",
          borderBottom: "1px solid #181818",
          marginBottom: "20px",
        }}
      >
        Featured
      </div>
      {loading ? (
        <CircularLoadingIndicator />
      ) : filteredData().length > 0 ? (
        <Container>
          <MasonryGrid
            data={filteredData()}
            renderItem={(item, index) => <MediaMarketplaceCard media={item} key={`${index}-card`} />}
          />
        </Container>
      ) : (
        <div
          style={{
            fontSize: "30px",
            textAlign: "center",
            paddingBottom: "22px",
            padding: "20px 0px 30px 0px",
            fontWeight: 500,
          }}
        >
          No Results
        </div>
      )}
    </>
  );
};

export default MediaMarketPlace;

const Container = styled.div`
  margin-right: 72px;
  padding-bottom: 20px;
`;
