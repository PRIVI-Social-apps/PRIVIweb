import React, { useEffect, useState, useMemo } from "react";
import { BlockchainType } from "shared/services/API/MediaAPI";
import { SearchWithCreate } from "shared/ui-kit/SearchWithCreate";
import { CollectionsOpensea, CollectionsShowTime, CollectionsWax } from "./collections";
import styles from "./index.module.scss";

type Collection = {
  name: string;
  imageURL: string;
};

const COLLECTIONS_FOR_BLOCKCHAIN: Partial<Record<BlockchainType, Array<Collection>>> = {
  [BlockchainType.Wax]: CollectionsWax,
  [BlockchainType.OpenSea]: CollectionsOpensea,
  [BlockchainType.Showtime]: CollectionsShowTime,
};

export const getCollectionsForBlochains = (blockchains: BlockchainType[]) => {
  let allCollections: Collection[] = [];

  for (const blockchain of blockchains) {
    const collections = COLLECTIONS_FOR_BLOCKCHAIN[blockchain];

    if (collections) {
      allCollections = [...allCollections, ...collections];
    }
  }

  return allCollections;
};

type CollectionsSelectProps = {
  selectedBlockchains: BlockchainType[];
  selectedCollection: string | undefined;
  onSelectedCollectionChange: (collection: string | undefined) => void;
};

export const CollectionsSelect: React.FunctionComponent<CollectionsSelectProps> = ({
  selectedBlockchains: blockChains,
  selectedCollection,
  onSelectedCollectionChange,
}) => {
  const [collectionSearch, setCollectionSearch] = useState<string>("");
  const [allCollections, setAllCollections] = useState(() => getCollectionsForBlochains(blockChains));

  useEffect(() => {
    setAllCollections(getCollectionsForBlochains(blockChains));
  }, [blockChains]);

  const filteredCollections = allCollections.filter(collection =>
    collectionSearch ? collection.name.toUpperCase().includes(collectionSearch.toUpperCase()) : true
  );

  const selectedCollectionItem = useMemo(
    () => allCollections.find(item => item.name === selectedCollection),
    [allCollections, selectedCollection]
  );

  useEffect(() => {
    if (!selectedCollectionItem) {
      onSelectedCollectionChange(undefined);
    }
  }, [onSelectedCollectionChange, selectedCollectionItem]);

  return (
    <>
      {selectedCollectionItem && (
        <div className={styles.collectionItem}>
          <div
            style={{
              backgroundImage:
                selectedCollectionItem.imageURL && selectedCollectionItem.imageURL.length > 0
                  ? `url(${selectedCollectionItem.imageURL})`
                  : "none",
              backgroundRepeat: "no-repeat",
              backgroundSize: "cover",
              backgroundPosition: "center",
              height: "35px",
              width: "35px",
              marginRight: "10px",
              borderRadius: "18px",
            }}
          />
          <div style={{ minWidth: "200px", fontSize: 18, fontWeight: 400, color: "#707582" }}>
            {selectedCollectionItem.name ?? ""}
          </div>
          <img
            style={{ marginRight: "7px" }}
            src={require("assets/icons/cross_gray.png")}
            alt="clear"
            onClick={() => {
              onSelectedCollectionChange(undefined);
              setCollectionSearch("");
            }}
          />
        </div>
      )}
      {!selectedCollectionItem && (
        <>
          <div className={styles.searcher}>
            <SearchWithCreate
              searchPlaceholder="Search collections"
              searchValue={collectionSearch}
              handleSearchChange={e => setCollectionSearch(e.target.value)} />
          </div>
          <div className={styles.collectionItems}>
            {filteredCollections.length > 0 ? (
              filteredCollections.map((collection, index) => (
                <div
                  className={styles.collectionItem}
                  key={`collection-${index}`}
                  onClick={() => onSelectedCollectionChange(collection.name)}
                >
                  <div
                    style={{
                      backgroundImage:
                        collection.imageURL && collection.imageURL.length > 0
                          ? `url(${collection.imageURL})`
                          : "none",
                      backgroundRepeat: "no-repeat",
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                      height: "35px",
                      width: "35px",
                      marginRight: "10px",
                      borderRadius: "18px",
                    }}
                  />
                  <div style={{ minWidth: "200px", fontSize: 18, fontWeight: 400, color: "#707582" }}>
                    {collection.name ?? ""}
                  </div>
                </div>
              ))
            ) : (
              <div>No items</div>
            )}
          </div>
        </>
      )}
    </>
  );
};
