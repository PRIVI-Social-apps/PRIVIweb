import React, { useState } from "react";
import { Autocomplete } from "@material-ui/lab";
import styled from "styled-components";

import { SearchInput } from "shared/ui-kit/inputs";
import { Panel } from "../../Panel/Panel";
import { grid, Color } from "../../../constants/const";

type AutocompleteSingleSelectProps<T> = {
  selectedItem: T;
  onSelectedItemChange: (newSelectedItem: T) => void;
  allItems: T[];
  placeholder: string;
  renderOption: (item: T) => React.ReactNode;
  getOptionLabel: (item: T) => string;
  autoFocus?: boolean;
};

export const AutocompleteSingleSelect = <T extends { id: string | number }>({
  selectedItem,
  onSelectedItemChange,
  allItems,
  placeholder,
  renderOption,
  getOptionLabel,
  autoFocus,
}: AutocompleteSingleSelectProps<T>) => {
  const [autocompleteKey, setAutocompleteKey] = useState<number>(() => new Date().getTime());

  return (
    <Container>
      <Autocomplete<T, false, false, false>
        options={allItems}
        clearOnBlur
        key={autocompleteKey}
        value={selectedItem}
        PaperComponent={PaperComponent}
        onChange={(_event, item) => {
          if (item) {
            onSelectedItemChange(item);
            setAutocompleteKey(new Date().getTime());
          }
        }}
        getOptionLabel={getOptionLabel}
        renderInput={params => (
          <>
            <SearchInput
              fullWidth
              size="large"
              ref={params.InputProps.ref}
              inputProps={params.inputProps}
              autoFocus={autoFocus}
              placeholder={placeholder}
            />
          </>
        )}
        renderOption={item => (
          <Option>
            <OptionContent>{renderOption(item)}</OptionContent>
          </Option>
        )}
      />
    </Container>
  );
};

const OPTION_HEIGHT = grid(7);

const Option = styled.div`
  width: 100%;
  height: ${OPTION_HEIGHT};
  display: flex;
  border-bottom: 1px solid ${Color.GrayLight};
  font-family: Agrandir;
`;

const OptionContent = styled.div`
  flex-grow: 1;
  display: flex;
  align-items: center;
  justify-content: left;
`;

const PaperComponent = styled(Panel).attrs({ shadow: 2, borderRadius: "medium", noPadding: true })`
  margin: 0;
  font-family: inherit;

  .MuiAutocomplete-listbox {
    padding: 0;
  }

  .MuiAutocomplete-option {
    padding: 0;

    ${Option} {
      padding-left: ${grid(2)};
    }
  }
`;

const Container = styled.div``;
