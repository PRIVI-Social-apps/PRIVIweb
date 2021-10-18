import React, { useState, useEffect } from "react";
import axios from "axios";
import DateFnsUtils from "@date-io/date-fns";

import { Fade, InputBase, Tooltip } from "@material-ui/core";
import { KeyboardDatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import { Autocomplete } from "@material-ui/lab";

import { useTypedSelector } from "store/reducers/Reducer";
import { TokenSelect } from "shared/ui-kit/Select/TokenSelect";
import { StyledMenuItem, StyledSelect } from "shared/ui-kit/Styled-components/StyledComponents";
import URL from "shared/functions/getURL";
import { Gradient } from "shared/ui-kit";
import Box from "shared/ui-kit/Box";
import CustomSwitch from "shared/ui-kit/CustomSwitch";
import InputWithLabelAndTooltip from "shared/ui-kit/InputWithLabelAndTooltip";
import { CustomTable, CustomTableCellInfo, CustomTableHeaderInfo } from "shared/ui-kit/Table";

const infoIcon = require("assets/icons/info.png");
const calendarIcon = require("assets/icons/calendar_icon.png");

const useStyles = makeStyles(() =>
  createStyles({
    appbarContainer: {
      width: "100%",
      marginBottom: "20px",
    },
    appbar: {
      marginLeft: 0,
      backgroundColor: "transparent !important",
      boxShadow: "none !important",
    },
    tabs: {
      marginLeft: 0,
      backgroundColor: "transparent !important",
      boxShadow: "none !important",
    },
    tab: {
      whiteSpace: "inherit",
      marginLeft: 0,
      color: "#abb3c4",
      boxShadow: "none !important",
      fontWeight: "bold",
      fontSize: "22px",
      fontFamily: "Agrandir",
      textTransform: "none",
      padding: "0px 25px",
      minHeight: "auto !important",
      minWidth: "auto !important",
    },
    selectedTab: {
      color: "transparent",
      background: Gradient.Mint,
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
    },
    smallInput: {
      margin: "0px 16px 0px 20px !important",
      background: "#F7F8FA !important",
      border: "1px solid #99A1B3 !important",
      borderRadius: "10px !important",
      width: "70px !important",
      height: "40px !important",
      padding: "12px 20px 12px 10px !important",
      color: "#4F4F4F !important",
    },
    input: {
      margin: "8px 0px 0px 13px !important",
      marginBottom: "0px !important",
      background: "#F7F9FE !important",
      border: "1px solid #E0E4F3 !important",
      borderRadius: "10px !important",
      height: "56px !important",
      color: "#181818 !important",
      padding: "20px 18px 16px !important",
      width: "auto !important",
      "& input": {
        border: "none",
        padding: "0px !important",
        margin: "0px !important",
        background: "transparent",
        width: "auto !important",
      },
      "& .MuiFormControl-root": {
        border: "none",
        padding: "0px !important",
        background: "transparent",
        marginBottom: "0px !important",
      },
      "& .MuiInputBase-root": {
        border: "none",
        fontFamily: "Agrandir",
        fontSize: "18px",
        color: "#707582",
        padding: "0px",
        margin: "0px",
        background: "transparent",
      },
    },
    selector: {
      minWidth: "120px",
      marginTop: "8px",
      borderRadius: "10px",
      height: "56px",
      border: "1px solid #707582",
      color: "#707582",
      background: "white",
      "& MuiSelect-select": {
        border: "none",
        padding: "0px",
        margin: "0px",
        background: "transparent",
      },
      "& .MuiFormControl-root": {
        border: "none",
        padding: "0px",
        margin: "0px",
        background: "transparent",
      },
      "& .MuiInputBase-root": {
        border: "none",
        padding: "0px",
        margin: "0px",
        background: "transparent",
      },
      "& .MuiSelect-selectMenu": {
        padding: "16px",
        fontFamily: "Agrandir",
        fontSize: "18px",
        color: "#707582",
        border: "none",
        margin: "0px",
        background: "transparent",
      },
    },
    autocomplete: {
      marginTop: "58px",
      marginBottom: "33px",
      background: "#F7F9FE",
      border: "1px solid #707582",
      boxSizing: "border-box",
      borderRadius: "11.36px",
      padding: "20px 18px 16px",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      "& input": {
        border: "none",
        padding: "0px !important",
        margin: "0px  !important",
        background: "transparent",
      },
      "& .MuiFormControl-root": {
        border: "none",
        padding: "0px",
        margin: "0px",
        background: "transparent",
      },
    },
  })
);

const Levels = [1, 2, 3, 4, 5, 6];

export default function RequestAssistanceTokenTokenomicsTab({
  communityToken,
  setCommunityToken,
  setRequestAssistance,
  tokenList,
}) {
  const classes = useStyles();

  const loggedUser = useTypedSelector(state => state.user);

  const [searchValue, setSearchValue] = useState<string>("");
  const [levelSelection, setLevelSelection] = useState<number>(1);
  const [assistances, setAssistances] = useState<string>("");
  const [users, setUsers] = useState<any[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<any[]>([]);

  const [offerToken, setOfferToken] = useState<string>("");
  const [offerAmount, setOfferAmount] = useState<number>(0);
  const [offerPaymentDate, setOfferPaymentDate] = useState<number>(
    new Date().setDate(new Date().getDate() + 1)
  );

  const [autocompleteKey, setAutocompleteKey] = useState<number>(new Date().getTime());
  //key changes everytime an item is added to the list so it's cleared

  const handlePaymentDateChange = (elem: any) => {
    setOfferPaymentDate(new Date(elem).getTime());
  };

  useEffect(() => {
    axios
      .post(`${URL()}/chat/getUsers`)
      .then(response => {
        if (response.data.success) {
          //should be remove user's id from the list ?? so they don't message themselves
          const allUsers = [...response.data.data].filter(user => user.id !== loggedUser.id) ?? [];
          allUsers.forEach(user => {
            let image = "";
            if (
              user.anon !== undefined &&
              user.anon === true &&
              user.anonAvatar &&
              user.anonAvatar.length > 0
            ) {
              image = `${require(`assets/anonAvatars/${user.anonAvatar}`)}`;
            } else {
              if (user.hasPhoto) {
                image = `${URL()}/user/getPhoto/${user.id}`;
              }
            }
            user.imageUrl = image;
            user.assistances = user.assistances ?? 0;
            user.rate = user.rate ?? 0;
          });

          // sort users alphabetically
          allUsers.sort(function (a, b) {
            return ("" + a.firstName).localeCompare(b.firstName);
          });

          setUsers(allUsers);
          setFilteredUsers(allUsers);
        }
      })
      .catch(error => {
        console.log(error);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const userFilterFunctions = () => {
    //filter by user input
    const newUsers = [] as any[];
    if (users.length > 0) {
      users.forEach((value: any, index: number) => {
        if (
          ((value.level && value.level >= levelSelection) || !levelSelection || levelSelection === 0) &&
          ((value.assistances && value.assistances >= assistances) || !assistances || assistances === "")
        ) {
          if (
            searchValue &&
            searchValue.length > 0 &&
            value.firstName &&
            value.firstName.length > 0 &&
            value.firstName.toUpperCase().includes(searchValue.toUpperCase())
          ) {
            newUsers.push(value);
          } else if (
            searchValue.length > 0 &&
            value.urlSlug &&
            value.urlSlug.length > 0 &&
            value.urlSlug.toUpperCase().includes(searchValue.toUpperCase())
          ) {
            newUsers.push(value);
          } else if (
            searchValue.length > 0 &&
            !newUsers.includes(value) &&
            value.email &&
            value.email.toUpperCase().includes(searchValue.toUpperCase())
          ) {
            newUsers.push(value);
          } else if (
            searchValue.length > 0 &&
            !newUsers.includes(value) &&
            value.address &&
            value.address.toUpperCase().includes(searchValue.toUpperCase())
          ) {
            newUsers.push(value);
          } else if (searchValue === "") {
            newUsers.push(value);
          }
        }
      });

      if (communityToken && communityToken.Offers && communityToken.Offers.length > 0) {
        let usersFilter: any[] = newUsers.filter(user => {
          let userIsInOffers = communityToken.Offers.find(offer => offer.userId === user.id);
          if (!userIsInOffers || !userIsInOffers.token || !userIsInOffers.amount) {
            return user;
          }
        });

        setFilteredUsers(usersFilter);
      } else {
        setFilteredUsers(newUsers);
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }
  };

  useEffect(() => {
    userFilterFunctions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [levelSelection, assistances, searchValue]);

  useEffect(() => {
    if (tokenList && tokenList.length > 0) {
      setOfferToken(tokenList[0]);
    }
  }, [tokenList]);

  const addOffer = offerObj => {
    const communityTokenCopy = { ...communityToken };
    communityTokenCopy.Offers = communityTokenCopy.Offers ?? [];

    let findIndex = communityTokenCopy.Offers.findIndex(offer => offer.userId === offerObj.userId);

    if (findIndex === -1) {
      communityTokenCopy.Offers.push(offerObj);
      setCommunityToken(communityTokenCopy);
    } else {
      if (
        communityTokenCopy.Offers &&
        communityTokenCopy.Offers[findIndex] &&
        (!communityTokenCopy.Offers[findIndex].amount || !communityTokenCopy.Offers[findIndex].token)
      ) {
        communityTokenCopy.Offers[findIndex].amount = offerObj.amount;
        communityTokenCopy.Offers[findIndex].token = offerObj.token;
        communityTokenCopy.Offers[findIndex].status = "negotiating";
        setCommunityToken(communityTokenCopy);
      }
    }

    //TODO: send offer
  };

  const offerTableHeaders: Array<CustomTableHeaderInfo> = [
    {
      headerName: "",
      headerWidth: 30,
    },
    {
      headerName: "People",
    },
    {
      headerName: "Assistances",
    },
    {
      headerName: "Rate",
    },
    {
      headerName: "Level",
    },
    {
      headerName: "Status",
    },
  ];
  const [offerTableData, setOfferTableData] = useState<Array<Array<CustomTableCellInfo>>>([]);

  useEffect(() => {
    let tableData: Array<Array<CustomTableCellInfo>> = [];

    if (communityToken.Offers) {
      tableData = communityToken.Offers.map(row => {
        const user = users[users.findIndex(u => u.id === row.userId)];
        return [
          {
            cell: (
              <div
                className="user-image"
                style={{
                  backgroundImage:
                    user && user.imageUrl && user.imageUrl !== "" ? `url(${user.imageUrl})` : "none",
                  backgroundRepeat: "no-repeat",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  cursor: "pointer",
                }}
              />
            ),
          },
          {
            cell: (
              <span
                style={{
                  cursor: "pointer",
                  color: "#181818",
                }}
              >
                @{user ? user.urlSlug ?? user.name ?? user.firstName : ""}
              </span>
            ),
          },
          {
            cell: row.assistances ?? 0,
          },
          {
            cell: `${row.rate ? row.rate * 100 : 0}%`,
          },
          {
            cell: row.level ?? 1,
          },
          {
            cell: (
              <div
                style={{
                  background:
                    row.status && row.status.toUpperCase() === "Accepted" ? Gradient.Mint : Gradient.Magenta,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  color: "transparent",
                }}
              >
                {row.status}
              </div>
            ),
          },
        ];
      });
    }

    setOfferTableData(tableData);
  }, [communityToken?.Offers]);

  return (
    <div>
      <Box display="flex" alignItems="center" justifyContent="space-between" width="100%">
        <h5>Community Token </h5>
        <Box display="flex" alignItems="center">
          <label style={{ margin: "0px 8px 0px", display: "initial", width: "120px" }}>
            Request
            <img src={require("assets/icons/info.png")} alt="info" style={{ margin: "0px 8px 0px" }} />{" "}
            Assistance
          </label>
          <CustomSwitch checked onChange={() => setRequestAssistance(false)} />
        </Box>
      </Box>

      <Box display="flex" alignItems="center">
        <InputWithLabelAndTooltip
          overriedClasses={classes.smallInput}
          labelName={"Assistances"}
          type="number"
          minValue="0.01"
          placeHolder="0"
          inputValue={assistances}
          onInputValueChange={e => setAssistances(e.target.value)}
        />
        <label>
          Level
          <Tooltip
            TransitionComponent={Fade}
            TransitionProps={{ timeout: 600 }}
            arrow
            className="tooltipHeaderInfo"
            title={``}
          >
            <img className="infoIconCreatePod" src={infoIcon} alt={"info"} />
          </Tooltip>
        </label>
        <StyledSelect
          disableUnderline
          labelId="simple-select-label"
          id="simple-select"
          className={classes.smallInput}
          value={levelSelection}
          onChange={(event: React.ChangeEvent<{ value: unknown }>) => {
            setLevelSelection(event.target.value as number);
          }}
        >
          {Levels.map((option: number, i: number) => {
            return (
              <StyledMenuItem value={option} key={i}>
                {option}
              </StyledMenuItem>
            );
          })}
        </StyledSelect>
      </Box>

      <Box display="flex" alignItems="center" mt={2}>
        <div>
          <label>Token</label>
          <div className={classes.selector}>
            <TokenSelect
              tokens={tokenList}
              value={offerToken}
              onChange={e => {
                setOfferToken(e.target.value);
              }}
            />
          </div>
        </div>
        <div>
          <InputWithLabelAndTooltip
            overriedClasses={classes.input}
            labelName={"Total Amount"}
            type="number"
            minValue="0.01"
            placeHolder="0"
            inputValue={`${offerAmount}`}
            onInputValueChange={e => setOfferAmount(Number(e.target.value))}
          />
        </div>
        <div>
          <label>End Contract Date</label>
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <KeyboardDatePicker
              className={classes.input}
              id="date-picker-expiration-date"
              minDate={new Date().setDate(new Date().getDate() + 1)}
              format="MM.dd.yyyy"
              placeholder="Select date..."
              value={offerPaymentDate}
              onChange={handlePaymentDateChange}
              keyboardIcon={<img className="iconCalendarCreatePod" src={calendarIcon} alt={"calendar"} />}
            />
          </MuiPickersUtilsProvider>
        </div>
      </Box>

      <div className={classes.autocomplete}>
        <Autocomplete
          id="autocomplete-0"
          style={{ width: "calc(100% - 17px)" }}
          freeSolo
          clearOnBlur
          value={searchValue}
          key={autocompleteKey}
          onChange={(event: any, newValue: any | null) => {
            if (newValue) {
              setSearchValue(newValue);
              addOffer({
                token: offerToken,
                amount: offerAmount,
                paymentDate: offerPaymentDate,
                userId: newValue.id,
                status: "pending",
              });
              // reset search query
              setAutocompleteKey(new Date().getTime());
            }
          }}
          options={["", ...filteredUsers]}
          renderOption={(option, { selected }) => {
            if (option) {
              return (
                <React.Fragment>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      borderBottom: "1px solid #EFF2F8",
                      width: "100%",
                      paddingBottom: "10px",
                      justifyContent: "space-between",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      {option !== "" ? (
                        <div
                          style={{
                            backgroundImage:
                              typeof option !== "string" && option.imageUrl
                                ? `url(${option.imageUrl})`
                                : "none",
                            backgroundRepeat: "no-repeat",
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                            cursor: "pointer",
                            border: "1.5px solid #FFFFFF",
                            marginRight: 14,
                            width: 30,
                            minWidth: 30,
                            height: 30,
                            backgroundColor: "#F7F9FE",
                            borderRadius: "50%",
                          }}
                        />
                      ) : null}
                      <div
                        style={{
                          color: "black",
                          fontSize: 14,
                          fontFamily: "Agrandir",
                        }}
                      >
                        {typeof option !== "string" ? (
                          <span>
                            {option.urlSlug && !option.urlSlug.includes("Px")
                              ? `@${option.urlSlug}`
                              : option.firstName}
                          </span>
                        ) : (
                          ""
                        )}
                      </div>
                    </div>
                    <div
                      style={{
                        color: "#29E8DC",
                        fontSize: 14,
                        display: "flex",
                        alignItems: "center",
                        fontFamily: "Agrandir",
                      }}
                    >
                      Request support
                      <img src={require("assets/icons/add.png")} alt={""} style={{ marginLeft: 10 }} />
                    </div>
                  </div>
                </React.Fragment>
              );
            } else {
              return (
                <React.Fragment>
                  <div>
                    <b>No users found.</b>
                  </div>
                </React.Fragment>
              );
            }
          }}
          getOptionLabel={option =>
            option && option !== undefined && option !== "" && typeof option !== "string"
              ? option.urlSlug
                ? `@${option.urlSlug}`
                : option.firstName
                ? option.firstName
                : ""
              : ""
          }
          getOptionSelected={option =>
            option &&
            typeof option !== "string" &&
            option !== "" &&
            communityToken.Offers &&
            communityToken.Offers.length > 0 &&
            option.id === communityToken.Offers[0].userId
          }
          renderInput={params => (
            <InputBase
              ref={params.InputProps.ref}
              inputProps={params.inputProps}
              autoFocus
              placeholder={"Search specific users"}
              style={{ fontFamily: "Agrandir", width: "100%" }}
            />
          )}
        />
        <img src={require("assets/icons/search.png")} alt={""} style={{ width: 17, height: 17 }} />
      </div>

      {communityToken.Offers && communityToken.Offers.length > 0 && (
        <div>
          <CustomTable headers={offerTableHeaders} rows={offerTableData} />
        </div>
      )}
    </div>
  );
}
