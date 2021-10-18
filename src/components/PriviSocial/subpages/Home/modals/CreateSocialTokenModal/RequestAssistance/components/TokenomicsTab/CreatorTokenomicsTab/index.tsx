import React, { useState, useEffect } from "react";
import DateFnsUtils from "@date-io/date-fns";
import axios from "axios";

import { Autocomplete } from "@material-ui/lab";
import { Fade, InputBase, Tooltip } from "@material-ui/core";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import { KeyboardDatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";

import { StyledMenuItem, StyledSelect } from "shared/ui-kit/Styled-components/StyledComponents";
import { useTypedSelector } from "store/reducers/Reducer";
import { TokenSelect } from "shared/ui-kit/Select/TokenSelect";
import URL from "shared/functions/getURL";
import { Gradient } from "shared/ui-kit";
import CustomSwitch from "shared/ui-kit/CustomSwitch";
import InputWithLabelAndTooltip from "shared/ui-kit/InputWithLabelAndTooltip";
import { CustomTable, CustomTableCellInfo, CustomTableHeaderInfo } from "shared/ui-kit/Table";
import Box from "shared/ui-kit/Box";

const infoIcon = require("assets/icons/info.png");
const calendarIcon = require("assets/icons/calendar_icon.png");

const useStyles = makeStyles(theme =>
  createStyles({
    root: {
      "& .MuiBox-root label": {
        fontSize: 14,
      },
    },
    smallInput: {
      color: "#181818",
      width: "70px",
      border: "1px solid #E0E4F3",
      height: "46px",
      padding: "11.5px 18px",
      fontSize: "14px",
      background: "#F7F9FE",
      boxSizing: "border-box",
      fontFamily: "Agrandir",
      marginTop: theme.spacing(1),
      marginBottom: theme.spacing(2),
      marginLeft: "16px",
      marginRight: "20px",
      borderRadius: "6px",
      outline: "none",
      "& input": {
        border: "none",
        background: "transparent",
        margin: 0,
        padding: 0,
      },
      "& *": {
        color: "#181818",
        fontFamily: "Agrandir",
      },
    },
    calendarPick: {
      margin: "8px 0px 0px 13px !important",
      marginBottom: "0px !important",
      background: "#F7F9FE !important",
      border: "1px solid #E0E4F3 !important",
      borderRadius: "10px !important",
      height: "56px !important",
      color: "#181818 !important",
      padding: "14px 14px 16px !important",
      width: "auto !important",

      "& .MuiInput-underline:before": {
        borderBottom: "none",
      },
      "& input": {
        border: "none !important",
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
    input: {
      marginLeft: "13px",
      color: "#181818",
      width: "auto",
      border: "1px solid #E0E4F3",
      height: "56px",
      padding: "11.5px 18px",
      fontSize: "14px",
      background: "#F7F9FE",
      boxSizing: "border-box",
      fontFamily: "Agrandir",
      marginTop: theme.spacing(1),
      borderRadius: "6px",
      outline: "none",
      "& input": {
        border: "none",
        background: "transparent",
        margin: 0,
        padding: 0,
      },
      "& *": {
        color: "#181818",
        fontFamily: "Agrandir",
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
      height: "56px",
      "& input": {
        border: "none !important",
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
    title: {
      marginBottom: 40,
    },
    assistance: {
      marginBottom: 30,
    },
    token: {
      marginBottom: 50,
    },
    tokenLabel: {
      marginLeft: 13,
    },
  })
);

const Levels = [1, 2, 3, 4, 5, 6];

export default function CreatorTokenomicsTab({
  socialToken,
  setSocialToken,
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

      if (socialToken && socialToken.Offers && socialToken.Offers.length > 0) {
        let usersFilter: any[] = newUsers.filter(user => {
          let userIsInOffers = socialToken.Offers.find(offer => offer.userId === user.id);
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
    const socialTokenCopy = { ...socialToken };
    socialTokenCopy.Offers = socialTokenCopy.Offers ?? [];

    let findIndex = socialTokenCopy.Offers.findIndex(offer => offer.userId === offerObj.userId);

    if (findIndex === -1) {
      socialTokenCopy.Offers.push(offerObj);
      setSocialToken(socialTokenCopy);
    } else {
      if (
        socialTokenCopy.Offers &&
        socialTokenCopy.Offers[findIndex] &&
        (!socialTokenCopy.Offers[findIndex].amount || !socialTokenCopy.Offers[findIndex].token)
      ) {
        socialTokenCopy.Offers[findIndex].amount = offerObj.amount;
        socialTokenCopy.Offers[findIndex].token = offerObj.token;
        socialTokenCopy.Offers[findIndex].status = "negotiating";
        setSocialToken(socialTokenCopy);
      }
    }

    //TODO: send offer
  };

  const offerTableHeaders: Array<CustomTableHeaderInfo> = [
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

    if (socialToken.Offers) {
      tableData = socialToken.Offers.map(row => {
        const user = users[users.findIndex(u => u.id === row.userId)];
        return [
          {
            cell: (
              <div style={{ display: "flex", alignItems: "center" }}>
                <div
                  className="user-image"
                  style={{
                    backgroundImage:
                      user && user.imageUrl && user.imageUrl !== "" ? `url(${user.imageUrl})` : "none",
                    backgroundRepeat: "no-repeat",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    cursor: "pointer",
                    marginRight: 10,
                    border: "1.5px solid #FFFFFF",
                    height: 32,
                    width: 32,
                    borderRadius: "50%",
                  }}
                />
                <span
                  style={{
                    cursor: "pointer",
                    color: "#181818",
                  }}
                >
                  @{user ? user.urlSlug ?? user.name ?? user.firstName : ""}
                </span>
              </div>
            ),
            cellAlign: "center",
          },
          {
            cell: row.assistances ?? 0,
            cellAlign: "center",
          },
          {
            cell: `${row.rate ? row.rate * 100 : 0}%`,
            cellAlign: "center",
          },
          {
            cell: row.level ?? 1,
            cellAlign: "center",
          },
          {
            cell: (
              <div
                style={{
                  background: row.status.toLowerCase().includes("pending")
                    ? Gradient.Magenta
                    : Gradient.Green,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  color: "transparent",
                }}
              >
                {row.status}
              </div>
            ),
            cellAlign: "center",
          },
        ];
      });
    }

    setOfferTableData(tableData);
  }, [socialToken?.Offers]);

  return (
    <div className={classes.root}>
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        width="100%"
        className={classes.title}
      >
        <h5>Social Token </h5>
        <Box display="flex" alignItems="center">
          <label style={{ margin: "0px 8px 0px", display: "initial", width: "100px" }}>
            Request
            <img src={require("assets/icons/info.png")} alt="info" style={{ margin: "0px 8px 0px" }} />{" "}
            Assistance
          </label>
          <CustomSwitch theme="green" checked onChange={() => setRequestAssistance(false)} />
        </Box>
      </Box>

      <Box display="flex" alignItems="center" className={classes.assistance}>
        <label>
          Assistances
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
        <InputWithLabelAndTooltip
          theme="light"
          overriedClasses={classes.smallInput}
          placeHolder="0"
          inputValue={assistances}
          minValue="00.01"
          type="number"
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

      <Box display="flex" alignItems="center" className={classes.token}>
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
            theme="light"
            overriedClasses={classes.input}
            type="number"
            minValue="0.01"
            labelName="Total Amount"
            inputValue={offerAmount}
            onInputValueChange={elem => {
              setOfferAmount(Number(elem.target.value));
            }}
            placeHolder={"0"}
          />
        </div>

        <div>
          <label className={classes.tokenLabel}>End Contract Date</label>
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <KeyboardDatePicker
              className={classes.calendarPick}
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
            socialToken.Offers &&
            socialToken.Offers.length > 0 &&
            option.id === socialToken.Offers[0].userId
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

      {socialToken.Offers && socialToken.Offers.length > 0 && (
        <div>
          <CustomTable theme="light" headers={offerTableHeaders} rows={offerTableData} />
        </div>
      )}
    </div>
  );
}
