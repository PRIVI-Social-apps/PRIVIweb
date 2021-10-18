import React, { useEffect, useState } from "react";
import Grid from "@material-ui/core/Grid";
import axios from "axios";
import { Fade, InputBase, Tooltip } from "@material-ui/core";
import { Autocomplete } from "@material-ui/lab";

import { assistanceNFTMediaTabStyles } from "./AssistanceNFTMediaTab.styles";
import { StyledMenuItem, StyledSelect } from "shared/ui-kit/Styled-components/StyledComponents";
import { useTypedSelector } from "store/reducers/Reducer";
import URL from "shared/functions/getURL";
import { TokenSelect } from "shared/ui-kit/Select/TokenSelect";
import { Avatar } from "shared/ui-kit";

import SvgIcon from "@material-ui/core/SvgIcon";
import CustomSwitch from "shared/ui-kit/CustomSwitch";
import InputWithLabelAndTooltip from "shared/ui-kit/InputWithLabelAndTooltip";
import { CustomTable, CustomTableCellInfo, CustomTableHeaderInfo } from "shared/ui-kit/Table";
import Box from "shared/ui-kit/Box";

const infoIcon = require("assets/icons/info_music_dao.png");

import { ReactComponent as CloseCircleSolid } from "assets/icons/times-circle-solid.svg";
import { DateInput } from "shared/ui-kit/DateTimeInput";
import { getRandomAvatar } from "shared/services/user/getUserAvatar";
import { useAutocompleteStyles } from "../CollabsTab/CollabsTab.styles";

const Levels = [1, 2, 3, 4, 5, 6];

const arePropsEqual = (prevProps, currProps) => {
  return JSON.stringify(prevProps.pod) == JSON.stringify(currProps.pod);
};

const AssistanceNFTMediaTab = React.memo((props: any) => {
  const classes = assistanceNFTMediaTabStyles();
  const autocompleteStyle = useAutocompleteStyles();

  const loggedUser = useTypedSelector(state => state.user);

  const [canEdit, setCanEdit] = useState<boolean>(true);

  /* --------- request assistance params ----------- */
  const [searchValue, setSearchValue] = useState<string>("");
  const [levelSelection, setLevelSelection] = useState<number>(1);
  const [assistances, setAssistances] = useState<number>(0);
  const [rate, setRate] = useState<number>(100);
  const [users, setUsers] = useState<any[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<any[]>([]);

  const [offerToken, setOfferToken] = useState<string>("BAL");
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
    if (props.canEdit !== undefined) {
      setCanEdit(props.canEdit);
    }
  }, [props.canEdit]);

  // assistance functions
  // get users list from backend
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
              if (user.hasPhoto && user.url) {
                image = `${user.url}?${Date.now()}`;
              }
            }
            user.imageUrl = image;
            user.assistances = user.assistances ?? 0;
            user.rate = user.rate ?? 0;
          });
          setUsers(allUsers);
          setFilteredUsers(allUsers);
        }
      })
      .catch(error => {
        console.log(error);
      });
  }, [loggedUser.id]);

  useEffect(() => {
    userFilterFunctions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [levelSelection, assistances, rate]);

  useEffect(() => {
    if (props.tokenObjList && props.tokenObjList.length > 0) {
      setOfferToken(props.tokenObjList[0].token);
    }
  }, [props.tokenObjList]);

  const userFilterFunctions = () => {
    //filter by user input
    const newUsers = [] as any[];

    if (users.length > 0) {
      users.forEach((value: any, index: number) => {
        if (
          value.level >= levelSelection &&
          value.assistances >= assistances &&
          Number(value.rate * 100) <= Number(rate)
        ) {
          newUsers.push(value);
        }
      });

      if (props.pod && props.pod.Offers && props.pod.Offers.length > 0) {
        let usersFilter: any[] = newUsers.filter(user => {
          let userIsInOffers = props.pod.Offers.find(offer => offer.userId === user.id);
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

  // -------- Assistance add functions ------
  const addOffer = offerObj => {
    const podCopy = { ...props.pod };
    podCopy.Offers = podCopy.Offers ?? [];

    let findIndex = podCopy.Offers.findIndex(offer => offer.userId === offerObj.userId);

    if (findIndex === -1) {
      podCopy.Offers.push(offerObj);
      console.log("pod", podCopy);
      props.setPod(podCopy);
      console.log(
        ((props.pod && props.pod.AssistanceRequired) || !props.creation) &&
          props.pod.Offers &&
          props.pod.Offers.length > 0,
        (props.pod && props.pod.AssistanceRequired) || !props.creation,
        props.pod.Offers,
        props.pod.Offers.length > 0
      );
    } else {
      if (
        podCopy.Offers &&
        podCopy.Offers[findIndex] &&
        (!podCopy.Offers[findIndex].amount || !podCopy.Offers[findIndex].token)
      ) {
        podCopy.Offers[findIndex].amount = offerObj.amount;
        podCopy.Offers[findIndex].token = offerObj.token;
        podCopy.Offers[findIndex].status = "negotiating";
        console.log("pod", podCopy);
        props.setPod(podCopy);
      }
    }
  };

  const removeOffer = (offerObj: any) => {
    const podCopy = { ...props.pod };
    podCopy.Offers = podCopy.Offers ?? [];

    let findIndex = podCopy.Offers.findIndex(offer => offer.userId === offerObj.userId);

    if (findIndex !== -1) {
      podCopy.Offers.splice(findIndex, 1);
      podCopy.directlyUpdate = true;
      props.setPod(podCopy);
    }
  };

  const [tableHeaders, setTableHeaders] = useState<Array<CustomTableHeaderInfo>>([]);
  const [tableData, setTableData] = useState<Array<Array<CustomTableCellInfo>>>([]);

  useEffect(() => {
    const headers: Array<CustomTableHeaderInfo> = [
      {
        headerName: "People",
        headerWidth: 120,
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
      {
        headerName: "",
      },
    ];
    if (props.pod && props.pod.Offers.length > 0) {
      if (props.pod.Offers.some(o => o.status !== "accepted")) {
        headers.push({
          headerName: "",
          headerWidth: 30,
        });
      }
    }
    setTableHeaders(headers);

    let data: Array<Array<CustomTableCellInfo>> = [];
    if (props.pod && props.pod.Offers.length > 0) {
      data = props.pod.Offers.map(row => {
        const user = users[users.findIndex(u => u.id === row.userId)];
        const oneRow: Array<CustomTableCellInfo> = [
          {
            cell: (
              <div style={{ display: "flex", alignItems: "center" }}>
                <div
                  style={{
                    backgroundImage: user ? `url(${user.imageUrl})` : "none",
                    backgroundRepeat: "no-repeat",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    marginRight: 12,
                    minWidth: 32,
                    borderRadius: "50%",
                    width: 32,
                    height: 32,
                    border: "1.5px solid #FFFFFF",
                    filter: "drop-shadow(0px 2px 8px rgba(0, 0, 0, 0.2))",
                  }}
                />
                <div
                  style={{
                    width: "calc(120px - 32px - 12px)",
                    wordWrap: "break-word",
                    whiteSpace: "pre-wrap",
                  }}
                >
                  {user && user.urlSlug ? user.urlSlug : user && user.firstName ? user.firstName : ""}
                </div>
              </div>
            ),
          },
          {
            cell: user && user.rate ? (user.rate * 100).toFixed(0) : "N/A",
            cellAlign: "center",
          },
          {
            cell: user && user.assistances ? user.assistances : 0,
            cellAlign: "center",
          },
          {
            cell: user ? user.level : 1,
            cellAlign: "center",
          },
          {
            cell: row && row.status === "negotiating" && !row.amount && !row.token ? "refused" : row.status,
            cellAlign: "center",
          },
        ];
        if (row.status !== "accepted") {
          oneRow.push({
            cell: (
              <div style={{ cursor: "pointer" }} onClick={() => removeOffer(row)}>
                <SvgIcon>
                  <CloseCircleSolid />
                </SvgIcon>
              </div>
            ),
            cellAlign: "center",
          });
        }

        return oneRow;
      });
    }

    setTableData(data);
  }, [props.pod.Offers, JSON.stringify(props.pod.Offers)]);

  return (
    <div
      className={classes.createNFTPodAssistance}
      style={{
        padding: !canEdit ? "0px 30px" : 0,
        marginLeft: !canEdit ? "-30px" : 0,
      }}
    >
      {/* ---------- REQUEST ASSISTANCE SECTION ---------- */}

      {props.creation && (
        <Box display="flex" alignItems="center" justifyContent="space-between" mb="34px">
          <div className={classes.bigTitle}>
            Pod's Token <span>Assistance</span>
          </div>

          <Box color="#7F6FFF" fontSize="14px" display="flex" alignItems="center">
            Request assistance
            <Box ml="8px" mr="15px">
              <Tooltip TransitionComponent={Fade} TransitionProps={{ timeout: 600 }} arrow title={``}>
                <img src={infoIcon} alt={"info"} />
              </Tooltip>
            </Box>
            <CustomSwitch
              checked={props.pod && props.pod.AssistanceRequired}
              onChange={() => {
                let podCopy = { ...props.pod };
                podCopy.AssistanceRequired = !podCopy.AssistanceRequired;
                podCopy.RuleBased = !props.pod.AssistanceRequired;
                props.setPod(podCopy);
              }}
              disabled={!canEdit}
              theme="music dao purple"
            />
          </Box>
        </Box>
      )}

      {props.pod && props.pod.AssistanceRequired && props.creation && (
        <>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6} style={{ marginBottom: "16px" }}>
              <InputWithLabelAndTooltip
                labelName="Assistances"
                tooltip={` `}
                theme={"music dao"}
                placeHolder="1"
                type={"number"}
                minValue={"0"}
                inputValue={`${assistances}`}
                onInputValueChange={e => setAssistances(Number(e.target.value))}
              />
            </Grid>
            <Grid item xs={12} md={6} style={{ marginBottom: "16px" }}>
              <Box className={classes.label}>
                <div>Level</div>
                <Tooltip TransitionComponent={Fade} TransitionProps={{ timeout: 600 }} arrow title={``}>
                  <img src={infoIcon} alt={"info"} />
                </Tooltip>
              </Box>

              <StyledSelect
                disableUnderline
                className={classes.selector}
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
            </Grid>

            <Grid item xs={12} md={4}>
              <Box className={classes.label}>
                <div>Token</div>
                <Tooltip TransitionComponent={Fade} TransitionProps={{ timeout: 600 }} arrow title={``}>
                  <img src={infoIcon} alt={"info"} />
                </Tooltip>
              </Box>
              <Box width={1} mt={1}>
                <TokenSelect
                  theme={"music dao"}
                  value={offerToken}
                  onChange={e => setOfferToken(e.target.value)}
                  tokens={props.tokenObjList}
                />
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <InputWithLabelAndTooltip
                labelName="Total Amount"
                theme={"music dao"}
                overriedClasses={classes.textFieldCreatePod}
                type="number"
                minValue="0.01"
                inputValue={`${offerAmount}`}
                onInputValueChange={elem => {
                  setOfferAmount(Number(elem.target.value));
                }}
                placeHolder={"0"}
                disabled={!canEdit}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <Box className={classes.label}>
                <div>End Contract Date</div>
                <Tooltip TransitionComponent={Fade} TransitionProps={{ timeout: 600 }} arrow title={``}>
                  <img src={infoIcon} alt={"info"} />
                </Tooltip>
              </Box>
              <DateInput
                id="date-picker-start-date1"
                minDate={new Date().setDate(new Date().getDate() + 1)}
                format="MM.dd.yyyy"
                placeholder="Select date..."
                value={offerPaymentDate}
                onChange={handlePaymentDateChange}
              />
            </Grid>
            <Grid item xs={12} md={12} style={{ marginTop: "24px" }}>
              <div className={classes.inputContainer}>
                <Autocomplete
                  id="autocomplete-0"
                  style={{ width: "calc(100% - 17px)" }}
                  clearOnBlur
                  value={searchValue}
                  classes={autocompleteStyle}
                  key={autocompleteKey}
                  onChange={(event: any, newValue: any | null) => {
                    if (newValue && canEdit) {
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
                    console.log(option);
                    if (option) {
                      return (
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
                              url={
                                typeof option !== "string" && option.imageURL
                                  ? option.imageURL
                                  : getRandomAvatar()
                              }
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
                            color="#7F6FFF"
                            fontFamily="Montserrat"
                            fontWeight={600}
                            alignItems="center"
                          >
                            Request support
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
                    props.pod.Offers &&
                    props.pod.Offers.length > 0 &&
                    option.id === props.pod.Offers[0].userId
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
            </Grid>
          </Grid>
        </>
      )}

      {((props.pod && props.pod.AssistanceRequired) || !props.creation) &&
      props.pod.Offers &&
      props.pod.Offers.length > 0 ? (
        <div className={classes.tableWrapper}>
          <CustomTable headers={tableHeaders} rows={tableData} />
        </div>
      ) : null}
    </div>
  );
}, arePropsEqual);

export default AssistanceNFTMediaTab;
