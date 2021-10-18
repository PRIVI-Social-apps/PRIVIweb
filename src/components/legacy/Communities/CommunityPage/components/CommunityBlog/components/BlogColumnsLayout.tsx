import React from "react";
import styled from "styled-components";
import BlogItem from "./BlogItem";
import { MasonryGrid } from "shared/ui-kit/MasonryGrid/MasonryGrid";

export const BlogColumnsLayout = ({ data }) => (
  <Container>
    <MasonryGrid
      data={data}
      renderItem={(item, index) => <BlogItem item={item} key={`${index}-blog`} />}
      columnsCountBreakPoints={COLUMNS_COUNT_BREAK_POINTS}
    />
  </Container>
);

const COLUMNS_COUNT_BREAK_POINTS = {
  675: 2,
  900: 3,
  1200: 4,
  1440: 5,
};

const Container = styled.div`
  margin-bottom: 12px;
`;
