import React, { useContext, useEffect, useMemo, useState } from "react";
import cls from "classnames";

import { FormControl, FormControlLabel, Radio, RadioGroup } from "@material-ui/core";

import { filtersStyles } from "./index.styles";
import DigitalArtContext from "shared/contexts/DigitalArtContext";
import { Color, SecondaryButton } from "shared/ui-kit";
import { BlockchainType, MediaStatus } from "shared/services/API";
import StyledCheckbox from "shared/ui-kit/Checkbox";
import { getCollectionsForBlochains } from "components/legacy/Media/components/MediaFilters/CollectionsSelect";
import { SearchWithCreate } from "shared/ui-kit/SearchWithCreate";
import Box from "shared/ui-kit/Box";

export default function Filters({ filters, onFiltersChange, showStatus = true }) {
  const classes = filtersStyles();
  const { setOpenFilters } = useContext(DigitalArtContext);

  const [blockChains, setBlockChains] = useState(filters.blockChains);
  const [status, setStatus] = useState(filters.status);
  const [collection, setCollection] = useState(filters.collection);

  const [collectionSearch, setCollectionSearch] = useState<string>("");
  const [allCollections, setAllCollections] = useState(() => getCollectionsForBlochains(blockChains));

  useEffect(() => {
    setAllCollections(getCollectionsForBlochains(blockChains));
  }, [blockChains]);

  useEffect(() => {
    if (!selectedCollectionItem) {
      setCollection(undefined);
    }
  }, [setCollection]);

  const filteredCollections = allCollections.filter(collection =>
    collectionSearch ? collection.name.toUpperCase().includes(collectionSearch.toUpperCase()) : true
  );

  const selectedCollectionItem = useMemo(
    () => allCollections.find(item => item.name === collection),
    [allCollections, collection]
  );

  const handleAddDeleteFilter = (item: string, filter: "blockChains") => {
    let list = [] as any;
    if (filter === "blockChains") {
      list = [...blockChains];
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

    if (filter === "blockChains") {
      setBlockChains(list);
    } else if (filter === "status") {
      setStatus(list);
    }
  };

  const toggleStatus = e => {
    const targetStatus = e.target.value;
    setStatus(currentStatus => (currentStatus === targetStatus ? undefined : targetStatus));
  };

  const handleFilterApply = () => {
    onFiltersChange({
      ...filters,
      blockChains,
      status,
      collection,
    });
  };

  return (
    <div className={classes.filters}>
      <div className={classes.content}>
        <Box display="flex" justifyContent="space-between" alignItems="center" marginBottom="25px">
          <h4>Filters</h4>
          <img
            src={require("assets/icons/cross_white.png")}
            alt="close"
            onClick={() => {
              setOpenFilters(false);
            }}
          />
        </Box>

        <div className={classes.options}>
          {showStatus && (
            <>
              <h5>🛎 Status</h5>
              <FormControl>
                <RadioGroup value={status} onChange={toggleStatus}>
                  <FormControlLabel
                    value={MediaStatus.BuyNow}
                    control={<Radio />}
                    label={
                      <Box fontFamily="Agrandir" fontSize={14} fontWeight={400} color="white">
                        Buy now
                      </Box>
                    }
                  />
                  <FormControlLabel
                    value={MediaStatus.OnAuction}
                    control={<Radio />}
                    label={
                      <Box fontFamily="Agrandir" fontSize={14} fontWeight={400} color="white">
                        On auction
                      </Box>
                    }
                  />
                  <FormControlLabel
                    value={MediaStatus.New}
                    control={<Radio />}
                    label={
                      <Box fontFamily="Agrandir" fontSize={14} fontWeight={400} color="white">
                        New
                      </Box>
                    }
                  />
                  <FormControlLabel
                    value={MediaStatus.LiveNow}
                    control={<Radio />}
                    label={
                      <Box fontFamily="Agrandir" fontSize={14} fontWeight={400} color="white">
                        Live now
                      </Box>
                    }
                  />
                </RadioGroup>
              </FormControl>

              <div className={classes.divider} />
            </>
          )}
          <h5>🔗 Blockchain</h5>
          <Box display="flex" flexDirection="column">
            <Box
              display="flex"
              alignItems="center"
              onClick={() => {
                handleAddDeleteFilter("PRIVI", "blockChains");
              }}
              marginBottom="16px"
            >
              <StyledCheckbox
                buttonColor={Color.White}
                checked={blockChains.includes(BlockchainType.Privi) ? true : false}
                name="checked"
              />
              <Box fontSize={14} fontWeight={400} color="white">
                PRIVI
              </Box>
            </Box>

            <Box
              display="flex"
              alignItems="center"
              onClick={() => {
                handleAddDeleteFilter(BlockchainType.Eth, "blockChains");
              }}
              marginBottom="16px"
            >
              <StyledCheckbox
                buttonColor={Color.White}
                checked={blockChains.includes(BlockchainType.Eth) ? true : false}
                name="checked"
              />
              <Box fontSize={14} fontWeight={400} color="white">
                Ethereum
              </Box>
            </Box>

            <Box
              display="flex"
              alignItems="center"
              onClick={() => {
                handleAddDeleteFilter(BlockchainType.Wax, "blockChains");
              }}
              marginBottom="16px"
            >
              <StyledCheckbox
                buttonColor={Color.White}
                checked={blockChains.includes(BlockchainType.Wax) ? true : false}
                name="checked"
              />
              <Box fontSize={14} fontWeight={400} color="white">
                WAX
              </Box>
            </Box>

            <Box
              display="flex"
              alignItems="center"
              onClick={() => {
                handleAddDeleteFilter(BlockchainType.Hicetnunc, "blockChains");
              }}
              marginBottom="16px"
            >
              <StyledCheckbox
                buttonColor={Color.White}
                checked={blockChains.includes(BlockchainType.Hicetnunc) ? true : false}
                name="checked"
              />
              <Box fontSize={14} fontWeight={400} color="white">
                Hicetnunc
              </Box>
            </Box>

            <Box
              display="flex"
              alignItems="center"
              onClick={() => {
                handleAddDeleteFilter(BlockchainType.Binance, "blockChains");
              }}
            >
              <StyledCheckbox
                buttonColor={Color.White}
                checked={blockChains.includes(BlockchainType.Binance) ? true : false}
                name="checked"
              />
              <Box fontSize={14} fontWeight={400} color="white">
                Binance
              </Box>
            </Box>
          </Box>

          <div className={classes.divider} />

          <Box display="flex" flexDirection="column">
            <Box
              className={cls(
                { [classes.blockchainSelected]: blockChains.includes(BlockchainType.Zora) },
                classes.blockchainOption
              )}
              onClick={() => handleAddDeleteFilter(BlockchainType.Zora, "blockChains")}
            >
              <img src={require("assets/priviIcons/zora_icon.png")} alt="zora" />
              <span>Zora</span>
            </Box>
            <Box
              className={cls(
                { [classes.blockchainSelected]: blockChains.includes(BlockchainType.OpenSea) },
                classes.blockchainOption
              )}
              onClick={() => handleAddDeleteFilter(BlockchainType.OpenSea, "blockChains")}
            >
              <img src={require("assets/priviIcons/opensea_icon.png")} alt="opensea" />
              <span>Opensea</span>
            </Box>
            <Box
              className={cls(
                { [classes.blockchainSelected]: blockChains.includes(BlockchainType.Mirror) },
                classes.blockchainOption
              )}
              onClick={() => handleAddDeleteFilter(BlockchainType.Mirror, "blockChains")}
            >
              <img src={require("assets/priviIcons/mirror_icon.png")} alt="mirro" />
              <span>Mirror</span>
            </Box>
            <Box
              className={cls(
                { [classes.blockchainSelected]: blockChains.includes(BlockchainType.Topshot) },
                classes.blockchainOption
              )}
              onClick={() => handleAddDeleteFilter(BlockchainType.Topshot, "blockChains")}
            >
              <img src={require("assets/priviIcons/top_shot_icon.png")} alt="topshot" />
              <span>Topshot</span>
            </Box>
            <Box
              className={cls(
                { [classes.blockchainSelected]: blockChains.includes(BlockchainType.Foundation) },
                classes.blockchainOption
              )}
              onClick={() => handleAddDeleteFilter(BlockchainType.Foundation, "blockChains")}
            >
              <img src={require("assets/priviIcons/foundation_icon.png")} alt="foundation" />
              <span>Foundation</span>
            </Box>
            <Box
              className={cls(
                { [classes.blockchainSelected]: blockChains.includes(BlockchainType.Showtime) },
                classes.blockchainOption
              )}
              onClick={() => handleAddDeleteFilter(BlockchainType.Showtime, "blockChains")}
            >
              <img src={require("assets/priviIcons/showtime_icon.png")} alt="showtime" />
              <span>Showtime</span>
            </Box>
          </Box>

          <div className={classes.divider} />

          <h5>🕳 Collections</h5>

          {selectedCollectionItem && (
            <div className={classes.collectionItem}>
              <div
                style={{
                  backgroundImage:
                    selectedCollectionItem.imageURL && selectedCollectionItem.imageURL.length > 0
                      ? `url(${selectedCollectionItem.imageURL})`
                      : "none",
                }}
              />
              {selectedCollectionItem.name ?? ""}
              <img
                style={{ marginRight: "7px" }}
                src={require("assets/icons/cross_white.png")}
                alt="clear"
                onClick={() => {
                  setCollection(undefined);
                  setCollectionSearch("");
                }}
              />
            </div>
          )}
          {!selectedCollectionItem && (
            <>
              <div className={classes.searcher}>
                <SearchWithCreate
                  searchValue={collectionSearch}
                  handleSearchChange={event => setCollectionSearch(event.target.value)}
                  searchPlaceholder={"Search"}
                />
              </div>
              <div className={classes.collectionItems}>
                {filteredCollections.length > 0 ? (
                  filteredCollections.map((collection, index) => (
                    <div
                      className={classes.collectionItem}
                      key={`collection-${index}`}
                      onClick={() => setCollection(collection.name)}
                    >
                      <div
                        style={{
                          backgroundImage:
                            collection.imageURL && collection.imageURL.length > 0
                              ? `url(${require(`assets/collectionImages/${collection.imageURL}`)})`
                              : "none",
                        }}
                      />
                      {collection.name ?? ""}
                    </div>
                  ))
                ) : (
                  <div>No items</div>
                )}
              </div>
            </>
          )}
        </div>

        <Box display="flex" flexDirection="column">
          <SecondaryButton
            size="medium"
            onClick={() => {
              setOpenFilters(false);
            }}
          >
            Cancel
          </SecondaryButton>
          <SecondaryButton size="medium" onClick={handleFilterApply}>
            Apply
          </SecondaryButton>
        </Box>
      </div>
    </div>
  );
}
