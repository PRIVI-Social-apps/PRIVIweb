import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { collabsTabStyles, useAutocompleteStyles } from "./CollabsTab.styles";
import { Autocomplete } from "@material-ui/lab";
import { InputBase } from "@material-ui/core";
import { RootState } from "store/reducers/Reducer";
import { Avatar } from "shared/ui-kit";
import Box from "shared/ui-kit/Box";
import { getRandomAvatar } from "shared/services/user/getUserAvatar";
import { getMatchingUsers, IAutocompleteUsers} from "shared/services/API";

const searchIcon = require("assets/icons/search.png");

const CollabsTab = ({pod, setPod}) => {
  const classes = collabsTabStyles();
  const user = useSelector((state: RootState) => state.user);

  const autocompleteStyle = useAutocompleteStyles();
  const [autocompleteKey, setAutocompleteKey] = useState<number>(new Date().getTime());

  const [searchValue, setSearchValue] = useState<string>(""); 
  const [autocompleteUsers, setAutocompleteUsers] = useState<IAutocompleteUsers[]>([]);

  // refresh autocomplete user list when searchValue changed
  useEffect(() => {
    if (searchValue) {
      getMatchingUsers(searchValue, ["firstName", "address"]).then(resp => {
        // console.log(resp.data);
        if (resp?.success) setAutocompleteUsers(resp.data.filter(u => u.address && u.address != user.address));
      });
    }
    else setAutocompleteUsers([]);
  }, [searchValue])

  const addAddressToSelectedList = (user) => {
    const newCollabs = [...pod.Collabs];
    newCollabs.push(user)
    setPod({...pod, Collabs: newCollabs})
  }

  return (
    <>
      <div className={classes.inputContainer}>
        <Autocomplete
          freeSolo
          key={autocompleteKey}
          classes={autocompleteStyle}
          onChange={(event: any, user: any | null) => {
            if (user && typeof user !== "string") {
              addAddressToSelectedList(user.address);
              setSearchValue("");
              setAutocompleteKey(new Date().getTime());
            }
          }}
          options={autocompleteUsers}
          renderOption={(option) => (
            <Box
              display="flex"
              alignItems="center"
              justifyContent="space-between"
              padding="14px 26px"
              width="100%"
              style={{
                borderBottom: "1px solid #00000021",
              }}
            >
              <Box display="flex" alignItems="center">
                <Avatar
                  noBorder
                  url={option.imageUrl ? option.imageUrl : getRandomAvatar()}
                  size="medium"
                />
                <Box ml="11px" fontFamily="Montserrat" color="#404658" fontSize="16px">
                  @
                  {option.urlSlug && !option.urlSlug.startsWith("Px")
                    ? option.urlSlug
                    : option?.name ?? "User name"}
                </Box>
              </Box>
              <Box
                display="flex"
                color="#65CB63"
                fontFamily="Montserrat"
                fontWeight={600}
                alignItems="center"
              >
                Invite Artist
                <div className={classes.addRound}>
                  <svg
                    width="10"
                    height="10"
                    viewBox="0 0 13 13"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M6.5 11.5V1.5M1.5 6.5L11.5 6.5"
                      stroke="white"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </Box>
            </Box>
          )}
          getOptionLabel={option =>
            option.urlSlug && option.urlSlug.startsWith("Px") ? `@${option.urlSlug}` : `@${option.name}`
          }
          renderInput={params => (
            <InputBase
              value={searchValue}
              onChange={event => {
                setSearchValue(event.target.value);
              }}
              ref={params.InputProps.ref}
              inputProps={params.inputProps}
              style={{
                width: "100%",
                fontFamily: "Montserrat",
                fontSize: "16px",
                fontWeight: 600,
                color: "#2D3047",
              }}
              autoFocus
              placeholder="Type User"
            />
          )}
        />
        <img src={searchIcon} alt={"search"} />
      </div>
      {pod.Collabs && (
        <>
          <Box
            mt="22px"
            display="flex"
            alignItems="center"
            color="#2D3047"
            fontFamily="Montserrat"
            fontSize="14px"
            mb="14px"
            justifyContent="space-between"
          >
            <div>Artist</div>
            <div>Status</div>
          </Box>
          {pod.Collabs.map((u, index) => u.address != user.address? (
            <UserTile key={`user-${index}-tile`} user={u} />
          ): null)}
        </>
      )}
      <button
        className={classes.addButton}
        onClick={() => {
          if (searchValue !== "" && !pod.Collabs.includes(searchValue)) addAddressToSelectedList({address: searchValue})
        }}
      >
        <svg width="10" height="10" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M6.5 11.5V1.5M1.5 6.5L11.5 6.5"
            stroke="#2D3047"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        Add Wallet Address
      </button>
    </>
  );
};

const UserTile = ({ user }) => {
  const classes = collabsTabStyles();

  return (
    <Box display="flex" alignItems="center" justifyContent="space-between" className={classes.userTile}>
      {user.name && user.imageUrl ? (
        <Box display="flex" alignItems="center">
          <Avatar
            noBorder
            url={typeof user !== "string" && user.imageUrl ? user.imageUrl : getRandomAvatar()}
            size="medium"
          />
          <Box ml="11px" color="#404658" fontSize="16px">
            @{user.urlSlug && !user.urlSlug.startsWith("Px") ? user.urlSlug : user.name ?? "User name"}
          </Box>
        </Box>
      ) : (
        user.address ?? ""
      )}
      <Box color="#FF8E3C" fontSize="14px">
        Invitation sent
      </Box>
    </Box>
  );
};

export default CollabsTab;
