import React, { useEffect, useState } from "react";
import axios from "axios";

import Grid from "@material-ui/core/Grid";
import { InputBase, makeStyles } from "@material-ui/core";
import { Autocomplete } from "@material-ui/lab";

import { postProjectStyles } from './Post-project.styles';
import { useTypedSelector } from "store/reducers/Reducer";
import URL from "shared/functions/getURL";
import ImageTitleDescription from "shared/ui-kit/Page-components/ImageTitleDescription";
import AlertMessage from "shared/ui-kit/Alert/AlertMessage";
import { LoadingWrapper } from "shared/ui-kit/Hocs";
import { Modal } from "shared/ui-kit";
import InputWithLabelAndTooltip from "shared/ui-kit/InputWithLabelAndTooltip";
import { DAOButton } from "components/PriviDAO/components/DAOButton";
import CustomSwitch from "shared/ui-kit/CustomSwitch";
import { TokenSelect } from "shared/ui-kit/Select/TokenSelect";
import { DateInput } from "shared/ui-kit/DateTimeInput";
import Box from 'shared/ui-kit/Box';

const infoIcon = require("assets/icons/info_white.png");
const addIcon = require("assets/icons/plus_white.png");

const PostProject = ({ open, onClose, handleRefresh, community }) => {
  const classes = postProjectStyles();
  const users = useTypedSelector(state => state.usersInfoList);
  const user = useTypedSelector(state => state.user);

  const [project, setProject] = useState<any>({
    Name: "",
    Description: "",
    Private: false,
    TwitterID: "",
    Budget: "",
    Token: "",
    GithubRepo: "",
    CreationDate: new Date().getTime(),
    DateDue: new Date().getTime(),
    Positions: [
      {
        PositionName: "",
        PositionDescription: "",
        PositionMonthlySalary: "",
        PositionSalaryToken: "",
        PositionCreationDate: new Date().getTime(),
        PositionDateDue: new Date().getTime(),
        PositionMembersInvited: [],
        PositionMembers: [],
        Applications: [],
        Open: true,
      },
    ],
  });

  const [autocompleteKey, setAutocompleteKey] = useState<number>(new Date().getTime());
  const autocompleteStyle = useAutocompleteStyles();

  const [photo, setPhoto] = useState<any>(null);
  const [photoImg, setPhotoImg] = useState<any>(null);

  const [status, setStatus] = useState<any>();
  const [creationProgress, setCreationProgress] = useState(false);
  const [memberSearcher, setMemberSearcher] = useState<string>("");
  const [tokens, setTokens] = useState<string[]>(["PRIVI", "BC", "DC"]);

  // get token list from backend
  useEffect(() => {
    if (open) {
      axios.get(`${URL()}/wallet/getCryptosRateAsList`).then(res => {
        const resp = res.data;
        if (resp.success) {
          const tokenList: string[] = []; // list of tokens
          const tokenRatesObj: {} = {}; // tokenRates
          const data = resp.data;
          data.forEach(rateObj => {
            tokenList.push(rateObj.token);
            tokenRatesObj[rateObj.token] = rateObj.rate;
          });
          setTokens(tokenList); // update token list
          const newProject = { ...project };
          newProject.Token = tokenList[0];
          newProject.Positions[0].PositionSalaryToken = tokenList[0];
          setProject(newProject);
        }
      });
    }
    // We define the size of array after receiving the data
  }, [open]);

  const handleProjectPrivate = (prvt: boolean) => {
    let projectCopy = { ...project };
    projectCopy.Private = prvt;
    setProject(projectCopy);
  };
  const handleCreationDate = (elem: any) => {
    let projectCopy = { ...project };
    projectCopy.CreationDate = new Date(elem).getTime();
    setProject(projectCopy);
  };
  const handleDateDue = (elem: any) => {
    let projectCopy = { ...project };
    projectCopy.DateDue = new Date(elem).getTime();
    setProject(projectCopy);
  };
  const handleChangeBudgetTokenSelector = event => {
    const projectCopy = { ...project };
    projectCopy.Token = event.target.value;
    setProject(projectCopy);
  };
  const handleChangePositionSalaryToken = (event, index) => {
    const projectCopy = { ...project };
    projectCopy.Positions[index].PositionSalaryToken = event.target.value;
    setProject(projectCopy);
  };

  const addMember = () => {
    if (memberSearcher && memberSearcher !== "") {
      let projectCopy = { ...project };
      project.Positions[0].PositionMembersInvited.push(memberSearcher);
      setProject(projectCopy);
    }
  };

  const uploadImage = async id => {
    return new Promise((resolve, reject) => {
      const formData = new FormData();
      formData.append("image", photo, id);
      const config = {
        headers: {
          "content-type": "multipart/form-data",
        },
      };
      axios
        .post(`${URL()}/community/projects/changeProjectPhoto`, formData, config)
        .then(response => {
          resolve(true);
        })
        .catch(error => {
          console.log(error);

          resolve(true);
        });
    });
  };

  const postProject = async () => {
    let validation = await validateProjectInfo();
    let communityId = community.CommunityAddress;

    if (validation === true) {
      const body: any = {
        Creator: user.id,
        CommunityId: communityId,
        Name: project.Name,
        Description: project.Description,
        Private: project.Private,
        TwitterID: project.TwitterID,
        Budget: project.Budget,
        Token: project.Token,
        GithubRepo: project.GithubRepo,
        CreationDate: project.CreationDate,
        DateDue: project.DateDue,
        Positions: project.Positions,
      };

      setCreationProgress(true);
      axios
        .post(`${URL()}/community/projects/createProject`, body)
        .then(async res => {
          const resp = res.data;
          if (resp.success) {
            if (photoImg && photo) await uploadImage(resp.data.id);
            setStatus({
              msg: `Project Created!`,
              key: Math.random(),
              variant: "success",
            });
            setTimeout(() => {
              onClose();
              handleRefresh();
              setCreationProgress(false);
            }, 1000);
          } else {
            setStatus({
              msg: `Error when making the request`,
              key: Math.random(),
              variant: "error",
            });
            setCreationProgress(false);
          }
        })
        .catch(error => {
          setStatus({
            msg: `Error when making the request`,
            key: Math.random(),
            variant: "error",
          });
          setCreationProgress(false);
        });
    }
  };

  const validateProjectInfo = async () => {
    let validation: boolean = true;

    if (!(project.Name.length >= 5)) {
      setStatus({
        msg: `Name field invalid. Minimum 5 characters required.`,
        key: Math.random(),
        variant: "error",
      });
      return false;
    } else if (!(project.Description.length >= 20)) {
      setStatus({
        msg: `Description field invalid. Minimum 20 characters required`,
        key: Math.random(),
        variant: "error",
      });
      return false;
    } else if (project.Budget === "" || Number(project.Budget) <= 0) {
      setStatus({
        msg: `Budget field invalid.`,
        key: Math.random(),
        variant: "error",
      });
      return false;
    } else if (project.CreationDate > project.DateDue) {
      setStatus({
        msg: "End date can't be previous to start date",
        key: Math.random(),
        variant: "error",
      });
      return false;
    } else {
      project.Positions.forEach((position, index) => {
        if (!(position.PositionName.length >= 5)) {
          setStatus({
            msg: `Position ${index + 1} name field invalid. Minimum 5 characters required.`,
            key: Math.random(),
            variant: "error",
          });
          validation = false;
        } else if (!(position.PositionDescription.length >= 20)) {
          setStatus({
            msg: `Position ${index + 1} description field invalid. Minimum 20 characters required`,
            key: Math.random(),
            variant: "error",
          });
          validation = false;
        } else if (position.PositionMonthlySalary === "" || Number(position.PositionMonthlySalary) <= 0) {
          setStatus({
            msg: `Position ${index + 1} Monthly salary field invalid.`,
            key: Math.random(),
            variant: "error",
          });
          validation = false;
        } else if (position.PositionCreationDate > position.PositionDateDue) {
          setStatus({
            msg: `Position ${index + 1} End date can't be previous to start date`,
            key: Math.random(),
            variant: "error",
          });
          validation = false;
        }
      });
    }
    return validation;
  };

  return (
    <Modal size="medium" isOpen={open} onClose={onClose} showCloseIcon className={classes.root} theme="dark">
      <Box mb={3} fontSize="30px">
        Create new Project
      </Box>
      <Box mb={3} fontSize="18px">
        General project info
      </Box>
      <ImageTitleDescription
        theme="dark"
        photoImg={photoImg}
        photoTitle="Project Image"
        setterPhoto={setPhoto}
        setterPhotoImg={setPhotoImg}
        titleTitle="Project Name"
        title={project.Name}
        setterTitle={name => {
          let projectCopy = { ...project };
          projectCopy.Name = name;
          setProject(projectCopy);
        }}
        titlePlaceholder="Project Name..."
        descTitle="Project Description"
        desc={project.Description}
        setterDesc={desc => {
          let projectCopy = { ...project };
          projectCopy.Description = desc;
          setProject(projectCopy);
        }}
        descPlaceholder="Project Description..."
        imageSize={6}
        infoSize={6}
        canEdit={true}
      />

      <Box mt={3} mb={3}>
        <Grid container direction="row" spacing={3}>
          <Grid item md={6} xs={12}>
            <InputWithLabelAndTooltip
              theme="dark"
              inputValue={project.TwitterID}
              onInputValueChange={e => {
                setProject({ ...project, TwitterID: e.target.value });
              }}
              tooltip="Enter a Twitter id related to the project"
              type="text"
              labelName={"Twitter ID"}
            />
          </Grid>
          <Grid item md={6} xs={12}>
            <Box mb={1} fontSize="18px" display="flex" alignItems="center">
              Privacity{" "}
              <img src={infoIcon} alt="info" style={{ width: "12px", height: "12px", marginLeft: "4px" }} />
            </Box>
            <Box display="flex" alignItems="center">
              <CustomSwitch checked theme="dark" onChange={() => handleProjectPrivate(false)} />
              <Box ml={1} fontSize="11px">
                Public/Private
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Box>

      <Box mb={3} fontSize="18px">
        General project info
      </Box>
      <Box mb={3}>
        <Grid container spacing={3} direction="row">
          <Grid item md={6} xs={12}>
            <Grid container spacing={3} direction="row" alignItems="flex-end">
              <Grid item md={6} xs={12}>
                <InputWithLabelAndTooltip
                  theme="dark"
                  inputValue={project.Budget}
                  onInputValueChange={e => {
                    setProject({ ...project, Budget: e.target.value });
                  }}
                  tooltip="Enter a Budget to start with"
                  type="number"
                  minValue={0.01}
                  placeHolder="Enter Budget"
                  labelName={"Budget"}
                />
              </Grid>
              <Grid item md={6} xs={12}>
                <TokenSelect
                  theme="dark"
                  value={project.Token}
                  onChange={handleChangeBudgetTokenSelector}
                  tokens={tokens}
                />
              </Grid>
            </Grid>

            <Box mt={2}>
              <InputWithLabelAndTooltip
                theme="dark"
                inputValue={project.GithubRepo}
                onInputValueChange={e => {
                  setProject({ ...project, GithubRepo: e.target.value });
                }}
                tooltip="Enter github repository link"
                type="text"
                placeHolder="Enter github repository link..."
                labelName={"Github repo"}
              />
            </Box>
          </Grid>
          <Grid item md={6} xs={12}>
            <Box mb={1} fontSize="18px" display="flex" alignItems="center">
              Start Date
              <img src={infoIcon} alt="info" style={{ width: "12px", height: "12px", marginLeft: "4px" }} />
            </Box>
            <DateInput
              minDate={new Date()}
              format="MM.dd.yyyy"
              theme="dark"
              value={project.CreationDate}
              onChange={handleCreationDate}
            />
            <Box mt={2}>
              <Box mb={1} fontSize="18px" display="flex" alignItems="center">
                End Date
                <img src={infoIcon} alt="info" style={{ width: "12px", height: "12px", marginLeft: "4px" }} />
              </Box>
              <DateInput
                minDate={new Date()}
                format="MM.dd.yyyy"
                theme="dark"
                value={project.DateDue}
                onChange={handleDateDue}
              />
            </Box>
          </Grid>
        </Grid>
      </Box>

      <Box mb={3} fontSize="18px">
        Project positions
      </Box>
      <Box mb={3}>
        <Grid container spacing={3} direction="row">
          <Grid item md={6} xs={12}>
            <InputWithLabelAndTooltip
              theme="dark"
              inputValue={project.Positions[0].PositionName}
              onInputValueChange={e => {
                let positionsCopy = [...project.Positions];
                positionsCopy[0].PositionName = e.target.value;
                setProject({ ...project, Positions: positionsCopy });
              }}
              tooltip="Enter a name for the position"
              type="text"
              placeHolder="Enter Position name"
              labelName={"Position Name"}
            />
            <Box mt={2}>
              <Box display="flex" alignItems="center">
                Monthly Salary
                <img src={infoIcon} alt="info" style={{ width: "12px", height: "12px", marginLeft: "4px" }} />
              </Box>
              <Grid container spacing={3} direction="row" alignItems="flex-end">
                <Grid item md={6} xs={12}>
                  <InputWithLabelAndTooltip
                    theme="dark"
                    inputValue={project.Positions[0].PositionMonthlySalary}
                    onInputValueChange={e => {
                      let positionsCopy = [...project.Positions];
                      positionsCopy[0].PositionMonthlySalary = e.target.value;
                      setProject({ ...project, Positions: positionsCopy });
                    }}
                    type="number"
                    minValue={0.01}
                    placeHolder="Enter Salary"
                  />
                </Grid>
                <Grid item md={6} xs={12}>
                  <TokenSelect
                    value={project.Positions[0].PositionSalaryToken}
                    onChange={e => handleChangePositionSalaryToken(e, 0)}
                    tokens={tokens}
                    theme="dark"
                  />
                </Grid>
              </Grid>
            </Box>
            <Box mt={2}>
              <Box mb={1} fontSize="18px" display="flex" alignItems="center">
                Start Date
                <img src={infoIcon} alt="info" style={{ width: "12px", height: "12px", marginLeft: "4px" }} />
              </Box>
              <DateInput
                minDate={new Date()}
                format="MM.dd.yyyy"
                theme="dark"
                value={project.Positions[0].PositionCreationDate}
                onChange={e => {
                  let positionsCopy = [...project.Positions];
                  positionsCopy[0].PositionCreationDate = e.target.value;
                  setProject({ ...project, Positions: positionsCopy });
                }}
              />
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <InputWithLabelAndTooltip
              theme="dark"
              inputValue={project.Positions[0].PositionDescription}
              onInputValueChange={e => {
                let positionsCopy = [...project.Positions];
                positionsCopy[0].PositionDescription = e.target.value;
                setProject({ ...project, Positions: positionsCopy });
              }}
              tooltip="Enter your Position Description here..."
              type="textarea"
              placeHolder="Enter your Position Description here"
              labelName={"Position Description"}
            />
            <Box mt={"10px"}>
              <Box mb={1} fontSize="18px" display="flex" alignItems="center">
                End Date
                <img src={infoIcon} alt="info" style={{ width: "12px", height: "12px", marginLeft: "4px" }} />
              </Box>
              <DateInput
                minDate={new Date()}
                format="MM.dd.yyyy"
                theme="dark"
                value={project.Positions[0].PositionDateDue}
                onChange={e => {
                  let positionsCopy = [...project.Positions];
                  positionsCopy[0].PositionDateDue = e.target.value;
                  setProject({ ...project, Positions: positionsCopy });
                }}
              />
            </Box>
          </Grid>
        </Grid>
      </Box>

      <Box mb={1} fontSize="18px" display="flex" alignItems="center">
        Invite members to apply
        <img src={infoIcon} alt="info" style={{ width: "12px", height: "12px", marginLeft: "4px" }} />
      </Box>
      <div className={classes.inputContainer}>
        <Autocomplete
          classes={autocompleteStyle}
          clearOnBlur
          freeSolo
          key={autocompleteKey}
          onChange={(event: any, newValue: any | null) => {
            if (newValue) {
              const usersCopy = [...project.Positions[0].PositionMembersInvited];
              usersCopy.push(newValue.id);
              setProject({
                ...project,
                Positions: [{ ...project.Positions[0], PositionMembersInvited: usersCopy }],
              });
              // reset search query
              setAutocompleteKey(new Date().getTime());
            }
          }}
          options={[
            ...users.filter(
              user =>
                !project.Positions[0].PositionMembersInvited.find(u => u == user.address || u === user.id)
            ),
          ]}
          renderOption={(option, { selected }) => (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "12px 20px",
                borderBottom: "1px solid #eff2f8",
                background: selected ? "rgba(255, 255, 255, 0.16)" : "#1A1B1C",
                margin: 0,
                width: "100%",
              }}
            >
              <div style={{ display: "flex", alignItems: "center" }}>
                <div
                  style={{
                    backgroundColor: "#D810D6",
                    backgroundImage:
                      typeof option !== "string" && option.imageURL ? `url(${option.imageURL})` : "none",
                    backgroundRepeat: "no-repeat",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    cursor: "pointer",
                    borderRadius: "50%",
                    width: "48px",
                    height: "48px",
                    marginRight: "8px",
                  }}
                />
                <div
                  style={{
                    fontStyle: "normal",
                    fontWeight: "normal",
                    fontSize: "14px",
                    color: "white",
                    fontFamily: "Agrandir GrandLight",
                  }}
                >
                  {option.email}
                </div>
              </div>
            </div>
          )}
          getOptionLabel={option => option.email ?? ""}
          renderInput={params => (
            <InputBase
              value={memberSearcher}
              onChange={event => {
                setMemberSearcher(event.target.value);
              }}
              ref={params.InputProps.ref}
              inputProps={params.inputProps}
              style={{ width: "100%", color: "white", fontFamily: "Agrandir", fontSize: "14px" }}
              autoFocus
              placeholder="Add user by mail"
            />
          )}
        />
        <img src={addIcon} alt={"add"} />
      </div>

      <Box mt={2}>
        {project.Positions[0].PositionMembersInvited.length > 0 &&
          project.Positions[0].PositionMembersInvited.map((user, i) => {
            const thisUser = users.find(u => u.id === user || u.address === user);
            return (
              <Box
                display="flex"
                alignItems="center"
                justifyContent="space-between"
                color="white"
                marginBottom="1px solid  rgba(255, 255, 255, 0.5)"
                pb={1}
                mb={2}
              >
                <Box display="flex" alignItems="center">
                  <div
                    className={classes.avatar}
                    style={{
                      backgroundRepeat: "no-repeat",
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                      backgroundImage: thisUser && thisUser.imageURL ? `url${thisUser.imageURL}` : "none",
                    }}
                  />
                  <Box ml={1} fontFamily="Agrandir GrandLight">
                    {thisUser?.name ?? "User name"}
                  </Box>
                </Box>

                <Box
                  color="white"
                  onClick={(e: any) => {
                    e.preventDefault();
                    let projectCopy = { ...project };
                    projectCopy.Positions[0].PositionMembersInvited.splice(0, 1);
                    setProject(projectCopy);
                  }}
                  style={{ cursor: "pointer" }}
                >
                  <img src={require("assets/icons/cross_white.png")} alt="remove" />
                </Box>
              </Box>
            );
          })}
      </Box>

      <div
        className="flexCenterCenterRowInputsCommunitiesModal"
        style={{
          marginTop: "60px",
        }}
      >
        <Box width="100" display="flex" justifyContent="flex-end">
          <LoadingWrapper loading={creationProgress} theme="dark">
            <DAOButton onClick={postProject}>Post Project</DAOButton>
          </LoadingWrapper>
        </Box>
      </div>
      {status && (
        <AlertMessage
          key={status.key}
          message={status.msg}
          variant={status.variant}
          onClose={() => setStatus(undefined)}
        />
      )}
    </Modal>
  );
};

export const useAutocompleteStyles = makeStyles(theme => ({
  root: {
    width: "100%",
  },
  listbox: {
    maxHeight: 168,
    background: "#1A1B1C",
  },
}));

export default PostProject;
