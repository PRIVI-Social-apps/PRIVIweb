import React from "react";
import styles from "./CreatorSearch.module.scss";
import { useDebouncedCallback } from "use-debounce";
import { SearchWithCreate } from "shared/ui-kit/SearchWithCreate";

const CreatorSearch = ({ searchCreator }) => {
  const [searchText, setSearchText] = React.useState("");

  const [debouncedCallback] = useDebouncedCallback(value => {
    if (searchCreator && value) searchCreator(value);
  }, 500);

  return (
    <div className={styles.filters}>
      <div className={styles.row}>
        <div className={styles.search}>
          <SearchWithCreate
            searchValue={searchText}
            searchPlaceholder="Search for an artist"
            handleSearchChange={event => {
              setSearchText(event.target.value);
              debouncedCallback(event.target.value);
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default CreatorSearch;
