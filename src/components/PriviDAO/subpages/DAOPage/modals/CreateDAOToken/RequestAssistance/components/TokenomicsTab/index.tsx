import React, { useState, useEffect, useRef } from "react";
import axios from "axios";

import { Box, Fade, Grid, InputBase, Paper, Tooltip } from "@material-ui/core";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import { Autocomplete } from "@material-ui/lab";

import { useTypedSelector } from "store/reducers/Reducer";
import { StyledSelectComponent, TokenSelect } from "shared/ui-kit/Select/TokenSelect";
import URL from "shared/functions/getURL";
import { Avatar, Gradient } from "shared/ui-kit";

import InputWithLabelAndTooltip from "shared/ui-kit/InputWithLabelAndTooltip";
import { CustomTable, CustomTableCellInfo, CustomTableHeaderInfo } from "shared/ui-kit/Table";
import { DateInput } from "shared/ui-kit/DateTimeInput";
import CreateDAOTokenSupplyTab from "../../../components/SupplyTab";
import CreateDAOTokenVestingTab from "../../../components/VestingTab";
import CreateDAOTokenGeneralTab from "../../../components/GeneralTab";
import { ProgressAcceptIcon, ProgressDeclineIcon } from "components/PriviDAO/subpages/DAOPage/index.styles";

const infoIcon = require("assets/icons/info.png");
const calendarIcon = require("assets/icons/calendar_icon.png");

const useStyles = makeStyles(() =>
  createStyles({
    autocomplete: {
      marginTop: "24px",
      marginBottom: "24px",
      background: "rgba(255, 255, 255, 0.16)",
      border: "1px solid #FFFFFF",
      boxSizing: "border-box",
      padding: "19px 16px",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      color: "white",
      "& input": {
        border: "none",
        padding: "0px !important",
        margin: "0px  !important",
        background: "transparent",
        color: "whtie",
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

const Levels = ["1", "2", "3", "4", "5", "6"];

export default function RequestAssistanceTokenTokenomicsTab({
  communityToken,
  setCommunityToken,
  tokenList,
  isCreator,
  setTokenPhoto,
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
            value.name &&
            value.name.length > 0 &&
            value.name.toUpperCase().includes(searchValue.toUpperCase())
          ) {
            newUsers.push(value);
          } else if (
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
      headerAlign: "center",
      headerName: "User name",
    },
    {
      headerAlign: "center",
      headerName: "Assistances",
    },
    {
      headerAlign: "center",
      headerName: "Rate",
    },
    {
      headerAlign: "center",
      headerName: "Level",
    },
    {
      headerAlign: "center",
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
            cellAlign: "center",
            cell: (
              <Box display="flex" alignItems="center">
                <Avatar
                  url={user && user.imageUrl && user.imageUrl !== "" ? `${user.imageUrl}` : "none"}
                  size="medium"
                />

                <Box ml={1}>{user ? user.name ?? user.firstName : ""}</Box>
              </Box>
            ),
          },
          {
            cellAlign: "center",
            cell: row.assistances ?? 0,
          },
          {
            cellAlign: "center",
            cell: `${row.rate ? row.rate * 100 : 0}%`,
          },
          {
            cellAlign: "center",
            cell: row.level ?? 1,
          },
          {
            cellAlign: "center",
            cell:
              row.status && row.status.toUpperCase().includes("ACCEPT") ? (
                <ProgressAcceptIcon />
              ) : (
                <ProgressDeclineIcon />
              ),
          },
        ];
      });
    }

    setOfferTableData(tableData);
  }, [communityToken?.Offers]);

  if (isCreator)
    return (
      <div>
        <Box display="flex" alignItems="center" justifyContent="space-between" width="100%">
          <Box mb={3} fontSize="22px">
            Community Token{" "}
          </Box>
        </Box>

        <Grid container spacing={3} style={{ marginBottom: "24px" }}>
          <Grid item xs={12} md={6}>
            <InputWithLabelAndTooltip
              theme="dark"
              labelName={"Assistances"}
              type="number"
              minValue="0.01"
              placeHolder="0"
              inputValue={assistances}
              onInputValueChange={e => setAssistances(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <>
              <Box mb={1}>
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
              </Box>
              <StyledSelectComponent
                theme="dark"
                value={levelSelection}
                onChange={(event: React.ChangeEvent<{ value: unknown }>) => {
                  setLevelSelection(event.target.value as number);
                }}
                options={Levels}
              />
            </>
          </Grid>
        </Grid>

        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <>
              <Box mb={1}>
                <label>
                  End Contract Date
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
              </Box>
              <TokenSelect
                theme="dark"
                tokens={tokenList}
                value={offerToken}
                onChange={e => {
                  setOfferToken(e.target.value);
                }}
              />
            </>
          </Grid>
          <Grid item xs={12} md={4}>
            <InputWithLabelAndTooltip
              theme="dark"
              labelName={"Total Amount"}
              type="number"
              minValue="0.01"
              placeHolder="0"
              inputValue={`${offerAmount}`}
              onInputValueChange={e => setOfferAmount(Number(e.target.value))}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <>
              <Box mb={1}>
                <label>
                  End Contract Date
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
              </Box>
              <DateInput
                theme="dark"
                id="date-picker-expiration-date"
                minDate={new Date().setDate(new Date().getDate() + 1)}
                format="MM.dd.yyyy"
                placeholder="Select date..."
                value={offerPaymentDate}
                onChange={handlePaymentDateChange}
                keyboardIcon={<img className="iconCalendarCreatePod" src={calendarIcon} alt={"calendar"} />}
              />
            </>
          </Grid>
        </Grid>

        <div className={classes.autocomplete}>
          <Autocomplete
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
                  <Box width="100%" minWidth="500px">
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
                            <span>{option.name ?? option.firstName ?? "User name"}</span>
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
                  </Box>
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
                ? option.name
                  ? option.name
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
          <img src={require("assets/icons/search_white.png")} alt={""} style={{ width: 17, height: 17 }} />
        </div>

        {communityToken.Offers && communityToken.Offers.length > 0 && (
          <div>
            <CustomTable theme="dark" headers={offerTableHeaders} rows={offerTableData} />
          </div>
        )}
      </div>
    );
  else
    return (
      <>
        <Box mb={3}>Token Details</Box>

        <Box mb={3}>
          <CreateDAOTokenGeneralTab
            setTokenPhoto={setTokenPhoto}
            communityToken={communityToken}
            setCommunityToken={setCommunityToken}
            fundingTokenSelectable
            tokenList={tokenList}
          />
        </Box>

        <Box mb={3}>
          <CreateDAOTokenSupplyTab
            communityToken={communityToken}
            setCommunityToken={setCommunityToken}
            wrapped={true}
          />
        </Box>

        <Box>
          <CreateDAOTokenVestingTab communityToken={communityToken} setCommunityToken={setCommunityToken} />
        </Box>
      </>
    );
}
