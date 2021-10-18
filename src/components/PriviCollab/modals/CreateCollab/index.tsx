import React, { useState, useEffect } from "react";
import { Grid, InputBase, Select, MenuItem } from "@material-ui/core";
import { useSelector } from "react-redux";
import axios from "axios";
import { Autocomplete } from "@material-ui/lab";
import SvgIcon from "@material-ui/core/SvgIcon";

import { createCollabModalStyles } from "./index.styles";
import platforms from "./platforms";
import ideas from "./ideas";
import { getRandomAvatar, getRandomAvatarForUserIdWithMemoization } from "shared/services/user/getUserAvatar";
import AlertMessage from "shared/ui-kit/Alert/AlertMessage";
import { RootState } from "store/reducers/Reducer";
import URL from "shared/functions/getURL";
import { Color, FontSize, Modal, PrimaryButton, SecondaryButton, Text } from "shared/ui-kit";
import Box from "shared/ui-kit/Box";
import { ReactComponent as TwitterBrands } from "assets/icons/twitter-brands.svg";
import InputWithLabelAndTooltip from "shared/ui-kit/InputWithLabelAndTooltip";
import { TokenSelect } from "shared/ui-kit/Select/TokenSelect";
import { DateInput } from "shared/ui-kit/DateTimeInput";

const plusWhiteIcon = require("assets/icons/plus_white.png");

interface AutocompleteUserModel {
  fromTwitter: boolean;
  id: string;
  name: string;
  twitter: string;
  imageURL: string;
}

const arePropsEqual = (prevProps, currProps) => {
  return prevProps.open === currProps.open;
};

const CreateCollabModal = React.memo((props: any) => {
  const classes = createCollabModalStyles();
  const user = useSelector((state: RootState) => state.user);
  const users = useSelector((state: RootState) => state.usersInfoList);

  const [collaborators, setCollaborators] = useState<string[]>(["", ""]);
  const [idea, setIdea] = useState<string>("");
  const [platform, setPlatform] = useState<any>({
    name: "",
    website: "",
  });
  const [searchName, setSearchName] = useState<string>(""); //
  const [twitterUsers, setTwitterUsers] = useState<any[]>([]); // users fetched from twitter
  const [twitterSelectedUsers, setTwitterSelectedUsers] = useState<any[]>([]); // selected twitter users => save them in this list
  const [allUsers, setAllUsers] = useState<AutocompleteUserModel[]>([]); // privi and twitter users appended
  const [during, setDuring] = useState<number | undefined>();
  const [status, setStatus] = React.useState<any>("");
  const [step, setStep] = React.useState<number>(0);
  const [tokens, setTokens] = useState<any[]>([]);
  const [token, setToken] = useState<string>("ETH");

  // Free Idea button
  const generateRandomSample = () => {
    const randomCollaborators: string[] = [];
    const numOfCollabsToGenerate = collaborators.length - 1;
    let remindingUsers = [...users];
    for (let i = 0; i < numOfCollabsToGenerate; i++) {
      const randomCollaborator =
        remindingUsers.length >= 1
          ? remindingUsers[Math.floor(Math.random() * remindingUsers.length)].id
          : "";
      remindingUsers = remindingUsers.filter(user => user.id !== randomCollaborator);
      randomCollaborators.push(randomCollaborator);
    }
    randomCollaborators.push("");

    const randomIdea = ideas[Math.floor(Math.random() * ideas.length)];
    const randomPlatform = platforms[Math.floor(Math.random() * platforms.length)];

    setCollaborators(randomCollaborators);
    setIdea(randomIdea);
    setPlatform(randomPlatform);
    setDuring(Math.floor(Math.random() * 10));
  };

  // fetch suggested users from twitter
  useEffect(() => {
    if (searchName) {
      const config = {
        params: {
          q: searchName,
        },
      };
      axios.get(`${URL()}/collab/getTwitterUsers`, config).then(response => {
        const resp = response.data;
        if (resp.success) {
          setTwitterUsers(resp.data);
        } else {
          setTwitterUsers([]);
        }
      });
    } else {
      setTwitterUsers([]);
    }
  }, [searchName]);

  // append twitter and privi users
  useEffect(() => {
    const newAllUsers: AutocompleteUserModel[] = [];
    users.forEach(userObj => {
      newAllUsers.push({
        fromTwitter: false,
        id: userObj.id,
        name: userObj.name,
        twitter: userObj.twitter,
        imageURL: userObj.imageURL,
      });
    });
    // using map to eliminate duplicated users from twitter
    const allTwitterUsers: { [key: string]: AutocompleteUserModel } = {};
    twitterSelectedUsers.forEach(userObj => {
      allTwitterUsers[userObj.id] = userObj;
    });
    twitterUsers.forEach(userObj => {
      allTwitterUsers[userObj.username] = {
        fromTwitter: true,
        id: userObj.username,
        name: userObj.name,
        twitter: userObj.username,
        imageURL: userObj.avatar,
      };
    });
    for (const [id, userObj] of Object.entries(allTwitterUsers)) {
      newAllUsers.push(userObj);
    }
    setAllUsers(newAllUsers);
  }, [twitterUsers, twitterSelectedUsers, users]);

  useEffect(() => {
    axios.get(`${URL()}/wallet/getCryptosRateAsList`).then(res => {
      const resp = res.data;
      if (resp.success) {
        setTokens(resp.data.map(obj => ({ token: obj.token, name: obj.token }))); // update token list
        setToken(resp.data[0].token);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleNextStep = () => {
    if (
      !collaborators.some(collabId => collabId != "") ||
      idea === "" ||
      !during ||
      platform.name === "" ||
      platform.website === ""
    ) {
      setStatus({
        msg: "Please fill out all fields!",
        key: Math.random(),
        variant: "error",
      });
      return;
    }

    setStep(1);
  };

  const handleCreate = () => {
    const collabList: any[] = [];
    collaborators.forEach(collabId => {
      if (collabId) {
        const user = allUsers.find(user => user.id === collabId);
        if (user) {
          collabList.push({
            id: collabId,
            fromTwitter: user.fromTwitter,
          });
        }
      }
    });

    // if (collaborators && collaborators.length > 0) {
    //   collaborators.forEach(function (collaborator, index) {
    //     if (collaborator.length === 0) {
    //       let inputValue = (document.getElementById("autocomplete-" + index) as HTMLInputElement)?.value;
    //       copyCollaborators[index] = inputValue ? inputValue : "";
    //     }
    //   });
    // }

    const body = {
      Creator: user.id,
      Collaborators: collabList,
      Idea: idea,
      Platform: platform,
    };

    axios.post(`${URL()}/collab/createCollab`, body).then(response => {
      const resp = response.data;
      if (resp.success) {
        setStatus({
          msg: "collab created",
          key: Math.random(),
          variant: "success",
        });
        setTimeout(() => {
          props.handleClose();
          props.handleRefresh();
        }, 1000);
      } else {
        setStatus({
          msg: "collab creation failed",
          key: Math.random(),
          variant: "error",
        });
      }
    });
  };

  return (
    <Modal showCloseIcon size="medium" isOpen={props.open} onClose={props.handleClose} wrapperPadding="0px">
      <Grid container className={classes.root}>
        <Grid
          item
          xs={12}
          sm={4}
          style={{
            backgroundImage: `url(${require(`assets/backgrounds/create_collab_bg.svg`)})`,
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
            backgroundPosition: "center",
            padding: "90px 60px",
          }}
        >
          <Box display="flex" flexDirection="column">
            <Text size={FontSize.H2} color={Color.Black}>
              <b>Create</b>
              <br />a Collab
            </Text>
            <Text size={FontSize.H5} mt={3}>
              Suggest collabs between your favourite creators
            </Text>
          </Box>
          <Box display="flex" flexDirection="column" alignItems="stretch" width={"70%"} mt={3}>
            <Box display="flex" flexDirection="row" alignItems="center">
              <Box className={classes.stepRound} onClick={() => setStep(0)}>
                {step === 0 ? (
                  <>
                    <Box className={classes.stepCurrent} />
                    <Text size={FontSize.S}>1</Text>
                  </>
                ) : (
                  <Box className={classes.stepComplete}>
                    <CheckIcon />
                  </Box>
                )}
              </Box>
              <Box flex={1} height="1px" bgcolor={"#707582"} />
              <Box className={classes.stepRound}>
                {step === 1 && <Box className={classes.stepCurrent} />}
                <Text size={FontSize.S}>2</Text>
              </Box>
            </Box>
            <Box display="flex" flexDirection="row" alignItems="center" justifyContent="space-between" mt={2}>
              <Text color={Color.Black}>
                Create
                <br />
                collab
              </Text>
              <Text color={Color.Black}>
                Setup
                <br />
                pledge
              </Text>
            </Box>
          </Box>
        </Grid>
        <Grid item xs={12} sm={8} className={classes.mainContent}>
          {step === 0 ? (
            <>
              <Box className={classes.content}>
                <Box className={classes.itemContainer}>
                  <Box className={classes.label}>I want</Box>
                  <Box style={{ display: "flex", alignItems: "center", width: "100%" }}>
                    <Box className={classes.inputContainer}>
                      {collaborators[0] !== "" ? (
                        <Box
                          className={classes.userImage}
                          style={{
                            backgroundImage:
                              collaborators[0] !== "" &&
                              allUsers.find(user => user.id === collaborators[0]) &&
                              allUsers.find(user => user.id === collaborators[0])
                                ? allUsers.find(user => user.id === collaborators[0])?.imageURL
                                  ? `url(${allUsers.find(user => user.id === collaborators[0])!.imageURL})`
                                  : `url(${getRandomAvatarForUserIdWithMemoization(collaborators[0])})`
                                : `url(${getRandomAvatarForUserIdWithMemoization(collaborators[0])})`,
                            backgroundRepeat: "no-repeat",
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                            cursor: "pointer",
                          }}
                        />
                      ) : null}
                      <Autocomplete
                        id="autocomplete-0"
                        className={classes.autocomplete}
                        freeSolo
                        value={
                          collaborators[0] !== ""
                            ? allUsers.find(user => user.id === collaborators[0])
                            : collaborators[0]
                        }
                        classes={{
                          paper: classes.paper,
                        }}
                        onInputChange={(event, value) => {
                          setSearchName(value);
                        }}
                        onChange={(event: any, newValue: any | null) => {
                          if (newValue) {
                            const newCollaborators = [...collaborators];
                            newCollaborators[0] = newValue.id ?? "";
                            setCollaborators(newCollaborators);
                            // if twitter user then save it
                            const user = allUsers.find(user => user.id === newValue.id);
                            if (user && user.twitter) {
                              const newTwitterSelectedUsers = [...twitterSelectedUsers];
                              newTwitterSelectedUsers.push(user);
                              setTwitterSelectedUsers(newTwitterSelectedUsers);
                            }
                            // reset search query
                            setSearchName("");
                          }
                        }}
                        options={["", ...allUsers.filter(user => !collaborators.includes(user.id))]}
                        renderOption={(option, { selected }) => (
                          <React.Fragment>
                            {option !== "" ? (
                              <div
                                className={classes.userImage}
                                style={{
                                  backgroundImage:
                                    typeof option !== "string" && option.imageURL
                                      ? `url(${option.imageURL})`
                                      : `url(${getRandomAvatar()})`,
                                  backgroundRepeat: "no-repeat",
                                  backgroundSize: "cover",
                                  backgroundPosition: "center",
                                  cursor: "pointer",
                                }}
                              />
                            ) : null}
                            <Box className={classes.text}>
                              {typeof option !== "string" ? (
                                <span>
                                  {option.name ? `@${option.name}` : ""}
                                  {option.twitter ? (
                                    <span className={classes.span}>
                                      {` | `}
                                      {!option.fromTwitter ? (
                                        <div className={classes.twitterBox}>
                                          <SvgIcon>
                                            <TwitterBrands />
                                          </SvgIcon>
                                        </div>
                                      ) : null}
                                      {`${option.twitter}`}
                                    </span>
                                  ) : (
                                    ""
                                  )}
                                </span>
                              ) : (
                                ""
                              )}
                            </Box>
                          </React.Fragment>
                        )}
                        getOptionLabel={option =>
                          typeof option !== "string"
                            ? option.name
                              ? `@${option.name} ${option.twitter ? `| @${option.twitter}` : ""}`
                              : option.twitter
                              ? `@${option.twitter}`
                              : ""
                            : ""
                        }
                        getOptionSelected={option =>
                          typeof option !== "string" && option.id === collaborators[0]
                        }
                        renderInput={params => (
                          <InputBase
                            ref={params.InputProps.ref}
                            inputProps={params.inputProps}
                            autoFocus
                            placeholder="search users"
                          />
                        )}
                      />
                    </Box>
                    <Box
                      className={classes.createHashtagButton}
                      onClick={() => {
                        const newCollaborators = [...collaborators];
                        newCollaborators.push("");
                        setCollaborators(newCollaborators);
                      }}
                    >
                      <img src={plusWhiteIcon} alt={"plus"} />
                    </Box>
                  </Box>
                </Box>
                {collaborators.length > 1
                  ? collaborators.map((collaboratorId, index) =>
                      index !== 0 && index !== collaborators.length - 1 ? (
                        <Box className={classes.itemContainer}>
                          <Box className={classes.label}>and</Box>
                          <Box className={classes.inputContainer}>
                            {collaboratorId !== "" ? (
                              <Box
                                className={classes.userImage}
                                style={{
                                  backgroundImage:
                                    collaboratorId !== "" &&
                                    allUsers.find(user => user.id === collaboratorId) &&
                                    allUsers.find(user => user.id === collaboratorId)
                                      ? allUsers.find(user => user.id === collaboratorId)?.imageURL
                                        ? `url(${
                                            allUsers.find(user => user.id === collaboratorId)!.imageURL
                                          })`
                                        : `url(${getRandomAvatar()})`
                                      : `url(${getRandomAvatar()})`,
                                  backgroundRepeat: "no-repeat",
                                  backgroundSize: "cover",
                                  backgroundPosition: "center",
                                  cursor: "pointer",
                                }}
                              />
                            ) : null}
                            <Autocomplete
                              className={classes.autocomplete}
                              id={"autocomplete-" + index}
                              freeSolo
                              value={collaboratorId && allUsers.find(user => user.id === collaboratorId)}
                              onInputChange={(event, value) => {
                                setSearchName(value);
                              }}
                              classes={{
                                paper: classes.paper,
                              }}
                              onChange={(event: any, newValue: any | null) => {
                                if (newValue) {
                                  const newCollaborators = [...collaborators];
                                  newCollaborators[index] = newValue.id ?? "";
                                  setCollaborators(newCollaborators);
                                  // if twitter user then save it
                                  const user = allUsers.find(user => user.id === newValue.id);
                                  if (user && user.twitter) {
                                    const newTwitterSelectedUsers = [...twitterSelectedUsers];
                                    newTwitterSelectedUsers.push(user);
                                    setTwitterSelectedUsers(newTwitterSelectedUsers);
                                  }
                                  // reset search query
                                  setSearchName("");
                                }
                              }}
                              options={["", ...allUsers.filter(user => !collaborators.includes(user.id))]}
                              renderOption={(option, { selected }) => (
                                <React.Fragment>
                                  {option !== "" ? (
                                    <div
                                      className={classes.userImage}
                                      style={{
                                        backgroundImage:
                                          typeof option !== "string" && option.imageURL
                                            ? `url(${option.imageURL})`
                                            : `url(${getRandomAvatar()})`,
                                        backgroundRepeat: "no-repeat",
                                        backgroundSize: "cover",
                                        backgroundPosition: "center",
                                        cursor: "pointer",
                                      }}
                                    />
                                  ) : null}
                                  <div className={classes.text}>
                                    {typeof option !== "string" ? (
                                      <span>
                                        {option.name ? `@${option.name}` : ""}
                                        {option.twitter ? (
                                          <span className={classes.span}>
                                            {` | `}
                                            {!option.fromTwitter ? (
                                              <div className={classes.twitterBox}>
                                                <SvgIcon>
                                                  <TwitterBrands />
                                                </SvgIcon>
                                              </div>
                                            ) : null}
                                            {`${option.twitter}`}
                                          </span>
                                        ) : (
                                          ""
                                        )}
                                      </span>
                                    ) : (
                                      ""
                                    )}
                                  </div>
                                </React.Fragment>
                              )}
                              getOptionLabel={option =>
                                typeof option !== "string"
                                  ? option.name
                                    ? `@${option.name} ${option.twitter ? `| @${option.twitter}` : ""}`
                                    : option.twitter
                                    ? `@${option.twitter}`
                                    : ""
                                  : ""
                              }
                              getOptionSelected={option =>
                                typeof option !== "string" && option.id === collaboratorId
                              }
                              renderInput={params => (
                                <InputBase
                                  ref={params.InputProps.ref}
                                  inputProps={params.inputProps}
                                  autoFocus
                                  placeholder="add a user"
                                />
                              )}
                            />
                          </Box>
                        </Box>
                      ) : null
                    )
                  : null}
                <Box className={classes.itemContainer}>
                  <Box className={classes.label}>to</Box>
                  <Box className={classes.inputContainer}>
                    <InputWithLabelAndTooltip
                      transparent
                      overriedClasses={classes.input}
                      placeHolder={"collab idea"}
                      inputValue={idea}
                      required
                      onInputValueChange={elem => {
                        setIdea(elem.target.value);
                      }}
                      style={{ outline: "none", padding: "0px 10px" }}
                      type="text"
                    />
                  </Box>
                </Box>
                <Box className={classes.itemContainer}>
                  <Box className={classes.label}>on</Box>
                  <Box className={classes.inputContainer}>
                    {typeof platform !== "string" && platform.name ? (
                      <Box
                        className={classes.platformImage}
                        style={{
                          backgroundImage:
                            typeof platform !== "string" && platform.name
                              ? `url(${require(`assets/platformImages/${platform.name}.png`)})`
                              : `url(${getRandomAvatar()})`,
                          backgroundRepeat: "no-repeat",
                          backgroundSize: "cover",
                          backgroundPosition: "center",
                          cursor: "pointer",
                        }}
                      />
                    ) : null}
                    <Autocomplete
                      inputValue={platform.name}
                      className={classes.autocomplete}
                      value={platform.name !== "" ? platforms.find(p => p.name === platform.name) : platform}
                      onChange={(event: any, newValue: any | null) => {
                        if (newValue) {
                          setPlatform(newValue);
                        }
                      }}
                      classes={{
                        paper: classes.paper,
                      }}
                      options={["", ...platforms.filter(p => p.name !== platform.name)]}
                      renderOption={(option: string | any, { selected }) => (
                        <React.Fragment>
                          {option !== "" ? (
                            <div
                              className={classes.platformImage}
                              style={{
                                backgroundImage:
                                  typeof option !== "string" && option.name
                                    ? `url(${require(`assets/platformImages/${option.name}.png`)})`
                                    : `url(${getRandomAvatar()})`,
                                backgroundRepeat: "no-repeat",
                                backgroundSize: "cover",
                                backgroundPosition: "center",
                                cursor: "pointer",
                              }}
                            />
                          ) : null}
                          <div className={classes.text}>
                            {typeof option !== "string" && option.name ? (
                              <span>{`${option.name} `}</span>
                            ) : null}
                          </div>
                        </React.Fragment>
                      )}
                      getOptionLabel={option =>
                        typeof option !== "string" && option.name ? option.name : ""
                      }
                      getOptionSelected={option =>
                        typeof option !== "string" && option.name === platform.name
                      }
                      renderInput={params => (
                        <InputBase
                          ref={params.InputProps.ref}
                          inputProps={params.inputProps}
                          autoFocus
                          placeholder="add a platform"
                        />
                      )}
                    />
                  </Box>
                </Box>
                <Box className={classes.itemContainer}>
                  <Box className={classes.label}>during</Box>
                  <Box className={classes.inputContainer}>
                    <InputWithLabelAndTooltip
                      transparent
                      overriedClasses={classes.input}
                      placeHolder={"__"}
                      inputValue={during}
                      required
                      onInputValueChange={elem => {
                        setDuring(elem.target.value);
                      }}
                      style={{ outline: "none", padding: "0px 10px" }}
                      type="text"
                    />
                  </Box>
                </Box>
              </Box>
              <Box className={classes.buttons}>
                <SecondaryButton size="medium" onClick={generateRandomSample}>
                  Free idea
                </SecondaryButton>
                <PrimaryButton size="medium" onClick={handleNextStep}>
                  Create Collab +
                </PrimaryButton>
              </Box>
            </>
          ) : (
            <>
              <Box className={classes.content}>
                <Box className={classes.itemContainerVert}>
                  <Box className={classes.label}>How much would you like to contribute?</Box>
                  <Box display="flex" flexDirection="row">
                    <Box className={classes.inputContainer}>
                      <InputWithLabelAndTooltip
                        transparent
                        overriedClasses={classes.input}
                        placeHolder={"collab idea"}
                        inputValue={idea}
                        required
                        onInputValueChange={elem => {
                          setIdea(elem.target.value);
                        }}
                        style={{ outline: "none", padding: "0px 10px" }}
                        type="text"
                      />
                    </Box>
                    <TokenSelect
                      tokens={tokens}
                      value={token}
                      className={classes.tokenSelect}
                      onChange={e => {
                        setToken(e.target.value);
                      }}
                    />
                  </Box>
                  <Box display="flex" flexDirection="row" justifyContent="space-between" pl={4} mt={2}>
                    <Text>600 USD</Text>
                    <Text>
                      Available balance: <b>14,0456 ETH</b>
                    </Text>
                  </Box>
                </Box>
                <Box className={classes.itemContainerVert}>
                  <Box className={classes.label}>Choose Blockchain Network</Box>
                  <Box className={classes.inputContainer}>
                    <Select value={"substrate"} className={classes.selectNetwork}>
                      <MenuItem value={"substrate"}>
                        <Box display="flex" flexDirection="row" alignItems="center">
                          <img src={require("assets/collabImages/Substrate.png")} alt="network" />
                          <Text ml={2}>Substrate</Text>
                        </Box>
                      </MenuItem>
                    </Select>
                  </Box>
                </Box>
                <Box className={classes.itemContainerVert}>
                  <Box className={classes.label}>What should be the collab life span?</Box>
                  <Box display="flex" flexDirection="row">
                    <Box width={1} pr={1}>
                      <DateInput
                        id="date-picker-start-date"
                        minDate={new Date()}
                        format="MM.dd.yyyy"
                        placeholder="Select date..."
                        height={46}
                      />
                    </Box>
                    <Box width={1} pl={1}>
                      <DateInput
                        id="date-picker-end-date"
                        minDate={new Date()}
                        format="MM.dd.yyyy"
                        placeholder="Select date..."
                        height={46}
                      />
                    </Box>
                  </Box>
                </Box>
              </Box>
              <Box pl={6} pr={6} mt={5}>
                <PrimaryButton size="medium" onClick={handleCreate} block>
                  Submit
                </PrimaryButton>
              </Box>
            </>
          )}

          {status ? <AlertMessage key={status.key} message={status.msg} variant={status.variant} /> : ""}
        </Grid>
      </Grid>
    </Modal>
  );
}, arePropsEqual);

export default CreateCollabModal;

const CheckIcon = () => (
  <svg width="15" height="11" viewBox="0 0 15 11" fill="none">
    <path
      d="M1.93628 5.63421L5.42074 9.11823L13.2271 1.3114"
      stroke="white"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
