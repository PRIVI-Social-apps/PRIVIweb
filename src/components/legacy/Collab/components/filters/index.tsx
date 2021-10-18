import { StyledBlueSelect, StyledMenuItem } from "shared/ui-kit/Styled-components/StyledComponents";

import React, { useState } from "react";
import styled from "styled-components";
import { Box } from "@material-ui/core";
import FilterButtonGroup from "components/legacy/Communities/CommunityPage/components/General/components/FilterButtonGroup";

const Container = styled.div`
  width: 100%;
  margin-top: 100px;
  margin-bottom: 40px;
  @media screen and (max-width: 992px) {
    padding: 0 4%;
  }
`;

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  column-gap: 30px;
`;

const Cell = styled.div`
  display: flex;
  column-gap: 8px;
`;

const BoldText = styled.p`
  font-style: normal;
  font-weight: 800;
  font-size: 14px;
  line-height: 22px;
  padding: 6px 0 7px;
  position: relative;
  color: #081831;
`;

interface IProps {
  displaySelection: string;
  sortBySelection: string;
  setDisplaySelection: (value: string) => void;
  setSortBySelection: (value: string) => void;
  displayOptions: string[];
  sortByOptions: string[];
}
const FilterCategories = ['All Collabs', 'My Collabs'];

export const Filters: React.FC<IProps> = props => {
  const {
    displaySelection,
    setDisplaySelection,
    displayOptions,
    setSortBySelection,
    sortBySelection,
    sortByOptions,
  } = props;

  
  const [filter, setFilter] = useState<string>(FilterCategories[0]);

  return (
    <Container>
      <Box display="flex" flexDirection="row" alignItems="center" justifyContent="space-between">
        <Wrapper>
          <Cell>
            <BoldText>Displaying</BoldText>
            <StyledBlueSelect
              disableUnderline
              labelId="simple-select-label"
              id="simple-select"
              value={displaySelection}
              onChange={(event: React.ChangeEvent<{ value: unknown }>) => {
                setDisplaySelection(event.target.value as string);
              }}
            >
              {displayOptions.map((option: string, i: number) => {
                return (
                  <StyledMenuItem value={option} key={i}>
                    {option}
                  </StyledMenuItem>
                );
              })}
            </StyledBlueSelect>
          </Cell>
          <Cell>
            <BoldText>Sort by:</BoldText>
            <StyledBlueSelect
              disableUnderline
              labelId="simple-select-label"
              id="simple-select"
              value={sortBySelection}
              onChange={(event: React.ChangeEvent<{ value: unknown }>) => {
                setSortBySelection(event.target.value as string);
              }}
            >
              {sortByOptions.map((option: string, i: number) => {
                return (
                  <StyledMenuItem value={option} key={i}>
                    {option}
                  </StyledMenuItem>
                );
              })}
            </StyledBlueSelect>
          </Cell>
        </Wrapper >
        <FilterButtonGroup
          categories={FilterCategories}
          selected={filter}
          onSelectCategory={setFilter}
        />
      </Box>
    </Container >
  );
};
