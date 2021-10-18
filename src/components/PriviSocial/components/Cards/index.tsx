import React, { useEffect, useState } from "react";

import { cardsStyles } from "./index.styles";
import UseWindowDimensions from "shared/hooks/useWindowDimensions";
import { MasonryGrid } from "shared/ui-kit/MasonryGrid/MasonryGrid";
import Box from "shared/ui-kit/Box";
import ProfileCard from "./ProfileCard";
import SocialTokenCard from "./SocialTokenCard";
import SuggestedArtistCard from "./SuggestedArtistCard";
import ClaimableProfileCard from "./ClaimableProfileCard";
import PerkCard from "./PerkCard";

export default function Cards({
  cards,
  cardType,
  heightFixed,
}: {
  cards: any[];
  cardType: "Profile" | "Social Token" | "Suggested Artist" | "Perk" | "Claimable Profile";
  heightFixed?: boolean;
}) {
  const { width } = UseWindowDimensions();
  const classes = cardsStyles();

  const [filteredCards, setFilteredCards] = useState<any>([]);

  useEffect(() => {
    let indexMax = cardType === "Perk" || cardType === "Claimable Profile" ? 3 : 4;
    if (width && cards && cards.length > 0) {
      if (heightFixed) {
        Object.keys(
          cardType === "Perk" || cardType === "Claimable Profile"
            ? COLUMNS_COUNT_BREAK_POINTS_THREE
            : COLUMNS_COUNT_BREAK_POINTS_FOUR
        )
          .reverse()
          .forEach((key, i) => {
            if (width < Number(key)) {
              indexMax =
                cardType === "Perk" || cardType === "Claimable Profile"
                  ? COLUMNS_COUNT_BREAK_POINTS_THREE[key] - 1
                  : COLUMNS_COUNT_BREAK_POINTS_FOUR[key] - 1;
            }

            if (
              i + 1 ===
              Object.keys(
                cardType === "Perk" || cardType === "Claimable Profile"
                  ? COLUMNS_COUNT_BREAK_POINTS_THREE
                  : COLUMNS_COUNT_BREAK_POINTS_FOUR
              ).length
            ) {
              setFilteredCards(cards.filter((item, index) => indexMax > index));
            }
          });
      } else {
        setFilteredCards(cards);
      }
    }
  }, [width, heightFixed, cards]);

  return (
    <Box width="100%" className={classes.cards}>
      {filteredCards && filteredCards.length > 0 ? (
        <MasonryGrid
          gutter={"24px"}
          data={filteredCards}
          renderItem={(item, index) =>
            cardType === "Profile" ? (
              <ProfileCard noMargin type="Crew" heightFixed={heightFixed} item={item} key={`item-${index}`} />
            ) : cardType === "Social Token" ? (
              <SocialTokenCard item={item} key={`item-${index}`} />
            ) : cardType === "Suggested Artist" ? (
              <SuggestedArtistCard item={item} key={`item-${index}`} />
            ) : cardType === "Perk" ? (
              <PerkCard item={item} heightFixed={heightFixed} key={`item-${index}`} />
            ) : (
              <ClaimableProfileCard item={item} key={`item-${index}`} />
            )
          }
          columnsCountBreakPoints={
            cardType === "Perk" || cardType === "Claimable Profile"
              ? COLUMNS_COUNT_BREAK_POINTS_THREE
              : COLUMNS_COUNT_BREAK_POINTS_FOUR
          }
        />
      ) : null}
    </Box>
  );
}

const COLUMNS_COUNT_BREAK_POINTS_FOUR = {
  400: 1,
  750: 2,
  1100: 3,
  1440: 4,
};

const COLUMNS_COUNT_BREAK_POINTS_THREE = {
  600: 1,
  1100: 2,
  1440: 3,
};
