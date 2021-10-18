import React, { useEffect, useState } from "react";
import cls from "classnames";

import DAOCard from "./DAOCard";
import ThemeCard from "./ThemeCard";

import { cardsStyles } from "./index.styles";
import BlogItem from "../../subpages/DAOPage/Tabs/Blog/components/BlogItem";
import UseWindowDimensions from "shared/hooks/useWindowDimensions";
import { MasonryGrid } from "shared/ui-kit/MasonryGrid/MasonryGrid";
import AcquisitionCard from "components/PriviDAO/subpages/DAOPage/Tabs/Acquisitions/components/AcquisitionCard";
import Box from "shared/ui-kit/Box";

export default function Cards({
  cards,
  cardType,
  heightFixed,
  handleRemove,
  handleOnClick,
}: {
  cards: any[];
  cardType: "DAO" | "Theme" | "Pills" | "Blog" | "Acquisition";
  heightFixed?: boolean;
  handleRemove?: (index) => void;
  handleOnClick?: (item) => void;
}) {
  const { width } = UseWindowDimensions();
  const classes = cardsStyles();

  const [filteredCards, setFilteredCards] = useState<any>([]);

  useEffect(() => {
    let indexMax = 6;
    if (width && cards && cards.length > 0) {
      if (heightFixed || cardType === "Pills") {
        Object.keys(COLUMNS_COUNT_BREAK_POINTS_SIX)
          .reverse()
          .forEach((key, i) => {
            if (width < Number(key)) {
              indexMax = COLUMNS_COUNT_BREAK_POINTS_SIX[key] - 1;
            }

            if (i + 1 === Object.keys(COLUMNS_COUNT_BREAK_POINTS_SIX).length) {
              setFilteredCards(cards.filter((item, index) => indexMax > index));
            }
          });
      } else {
        setFilteredCards(cards);
      }
    }
  }, [width, heightFixed, cards]);

  return (
    <Box width="100%" className={cls({ [classes.pills]: cardType === "Pills" }, classes.cards)}>
      {filteredCards && filteredCards.length > 0 ? (
        cardType === "Pills" ? (
          filteredCards.map((search, index) => (
            <div
              className={classes.searchPill}
              key={`search-${index}`}
              onClick={e => {
                if (handleOnClick !== undefined) handleOnClick(search);
              }}
            >
              <span>{search}</span>
              <img
                src={require("assets/icons/cross_white.png")}
                alt="remove"
                onClick={e => {
                  e.preventDefault();
                  e.stopPropagation();
                  if (handleRemove !== undefined) handleRemove(index);
                }}
              />
            </div>
          ))
        ) : (
          <MasonryGrid
            gutter={"24px"}
            data={filteredCards}
            renderItem={(item, index) =>
              cardType === "Theme" ? (
                <ThemeCard theme={item} key={`item-${index}`} />
              ) : cardType === "DAO" ? (
                <DAOCard item={item} heightFixed={heightFixed} key={`item-${index}`} />
              ) : cardType === "Acquisition" ? (
                <AcquisitionCard data={item} heightFixed={heightFixed} key={`item-${index}`} />
              ) : (
                <BlogItem item={item} key={`item-${index}`} />
              )
            }
            columnsCountBreakPoints={COLUMNS_COUNT_BREAK_POINTS_SIX}
          />
        )
      ) : null}
    </Box>
  );
}

const COLUMNS_COUNT_BREAK_POINTS_SIX = {
  400: 1,
  650: 2,
  800: 3,
  1100: 4,
  1200: 5,
  1440: 6,
};
