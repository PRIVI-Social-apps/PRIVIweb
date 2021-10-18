import React from "react";
import { makeStyles } from "@material-ui/core";
import { Color, FontSize } from "shared/ui-kit";
import Box, { BoxProps } from "shared/ui-kit/Box";

const useStyles = makeStyles(() => ({
  normal: {
    padding: "8px 12px",
    borderRadius: 36,
    border: `1px solid ${Color.GrayDark}`,
    backgroundColor: Color.White,
    color: Color.GrayDark,
    fontSize: FontSize.M,
    minWidth: 50,
    "& + &": {
      marginLeft: 12,
    }
  },
  selected: {
    border: `1px solid ${Color.Black}`,
    backgroundColor: Color.Black,
    color: Color.White
  }
}));

interface FilterButtonGroupProps extends BoxProps {
  categories: string[],
  selected: string,
  onSelectCategory: (category: string) => void,
}

const FilterButtonGroup = ({ categories, selected, onSelectCategory, ...props }: FilterButtonGroupProps) => {
  const classes = useStyles();

  const handleSelect = (current: string) => () => {
    onSelectCategory(current);
  }

  return (
    <Box display="flex" flexDirection="row" {...props}>
      {categories.map((category, index) => (
        <button
          className={`${classes.normal} ${selected === category && classes.selected}`}
          key={`category-button-${index}`}
          onClick={handleSelect(category)}
        >
          {category}
        </button>
      ))}
    </Box>
  )
}

export default FilterButtonGroup;
