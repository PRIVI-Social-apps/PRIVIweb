import React from "react";
import InfiniteScroll from "react-infinite-scroll-component";

import { CircularLoadingIndicator, SecondaryButton } from "shared/ui-kit";
import { UserInfo } from "store/actions/UsersInfo";
import CreatorCard from "../CreatorCard/CreatorCard";
import styled from "styled-components";
import styles from "./index.module.scss";
import { GenericGrid } from "shared/ui-kit/GenericGrid/GenericGrid";

type CreatorExploreProps = {
  data: UserInfo[];
  loadMore: () => void;
  error: boolean;
  hasMore: boolean;
  scrollableContainerId: string;
  isDataLoading: boolean;
};

const columnsCountBreakPoints = { 1400: 4, 1000: 3, 650: 2 };

export const CreatorExplore: React.FunctionComponent<CreatorExploreProps> = ({
  data,
  loadMore,
  error,
  hasMore,
  scrollableContainerId,
  isDataLoading,
}) => (
  <div style={{ paddingBottom: 100 }}>
    <div className={styles.subtitle} style={{ marginBottom: "20px", fontSize: 30 }}>
      Explore
    </div>
    {isDataLoading && data.length === 0 && (
      <LoadingIndicatorWrapper>
        <CircularLoadingIndicator />
      </LoadingIndicatorWrapper>
    )}
    <InfiniteScroll
      hasChildren={data.length > 0}
      dataLength={data.length}
      scrollableTarget={scrollableContainerId}
      next={loadMore}
      hasMore={hasMore}
      loader={
        isDataLoading && (
          <LoadingIndicatorWrapper>
            <CircularLoadingIndicator />
          </LoadingIndicatorWrapper>
        )
      }
    >
      <GenericGrid columnsCountBreakPoints={columnsCountBreakPoints}>
        {error ? (
          <div className="error-message-container">
            <p>Sorry! There was an issue retrieving artist data</p>
            <SecondaryButton size="medium" onClick={loadMore}>Try again</SecondaryButton>
          </div>
        ) : (
          <>
            {data.map((item, index) => (
              <CreatorCard data={item} key={index} />
            ))}
          </>
        )}
      </GenericGrid>
    </InfiniteScroll>
  </div>
);

const LoadingIndicatorWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding-top: 20px;
`;

export default CreatorExplore;
