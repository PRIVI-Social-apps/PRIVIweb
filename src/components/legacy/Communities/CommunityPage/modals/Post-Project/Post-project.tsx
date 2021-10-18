import React, { useEffect, useState } from "react";
import DateFnsUtils from "@date-io/date-fns";
import axios from "axios";

import Grid from "@material-ui/core/Grid";
import { KeyboardDatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import FormControl from "@material-ui/core/FormControl";
import { Divider } from "@material-ui/core";
import { useTypedSelector } from "store/reducers/Reducer";

import URL from "shared/functions/getURL";
import ImageTitleDescription from "shared/ui-kit/Page-components/ImageTitleDescription";
import { StyledSelect, StyledMenuItem } from "shared/ui-kit/Styled-components/StyledComponents";
import AlertMessage from "shared/ui-kit/Alert/AlertMessage";
import { LoadingWrapper } from "shared/ui-kit/Hocs";

import "./Post-project.css";
import "../Communities-modals.css";

import SvgIcon from "@material-ui/core/SvgIcon";
import { ReactComponent as CloseSolid } from "assets/icons/close-solid.svg";
import InputWithLabelAndTooltip from "shared/ui-kit/InputWithLabelAndTooltip";
const infoIcon = require("assets/icons/info_icon.png");
const plusWhiteIcon = require("assets/icons/plus_white.png");
const calendarIcon = require("assets/icons/calendar_icon.png");

const PostProject = (props: any) => {
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
        PositionMembers: [],
        Applications: [],
        Open: true,
      },
    ],
  });

  const user = useTypedSelector(state => state.user);
  const [photo, setPhoto] = useState<any>(null);
  const [photoImg, setPhotoImg] = useState<any>(null);

  const [status, setStatus] = useState<any>();
  const [creationProgress, setCreationProgress] = useState(false);
  const [memberSearcher, setMemberSearcher] = useState<string>("");
  const [tokens, setTokens] = useState<string[]>(["PRIVI", "BC", "DC"]);

  // get token list from backend
  useEffect(() => {
    if (props.open) {
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
  }, [props.open]);

  const addPosition = () => {
    const projectCopy = { ...project };
    projectCopy.Positions.push({
      PositionName: "",
      PositionDescription: "",
      PositionMonthlySalary: "",
      PositionSalaryToken: tokens[0],
      PositionCreationDate: new Date().getTime(),
      PositionDateDue: new Date().getTime(),
      PositionMembers: [],
    });
    setProject(projectCopy);
  };

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

  const addMember = index => {
    if (memberSearcher && memberSearcher !== "") {
      //TODO: check if email exists ???
      let projectCopy = { ...project };
      project.Positions[index].PositionMembers.push(memberSearcher);
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
    let communityId = props.community.CommunityAddress;

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
              props.onCloseModal();
              props.handleRefresh();
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
      // } else if (project.TwitterID === "") {
      //   setErrorMsg("Twitter ID field empty.");
      //   handleClickError();
      //   return false;
    } else if (project.Budget === "" || Number(project.Budget) <= 0) {
      setStatus({
        msg: `Budget field invalid.`,
        key: Math.random(),
        variant: "error",
      });
      return false;
      // } else if (project.GithubRepo === "") {
      //   setErrorMsg("Github repo field invalid.");
      //   handleClickError();
      //   return false;
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

  function renderInputsPostProject(p) {
    return (
      <div>
        <InputWithLabelAndTooltip
          labelName={p.name}
          tooltip={""}
          inputValue={p.index === undefined ? project[p.item] : project.Positions[p.index][p.item]}
          type={p.type}
          onInputValueChange={e => {
            let projectCopy = { ...project };
            if (p.index === undefined) {
              projectCopy[p.item] = e.target.value;
            } else {
              project.Positions[p.index][p.item] = e.target.value;
            }
            setProject(projectCopy);
          }}
          placeHolder={p.placeholder}
          style={{
            width: p.width ? `calc(${p.width}px - 24px)` : "calc(100% - 24px)",
          }}
        />
      </div>
    );
  }

  const AddButtonCreateModal = (props: any) => {
    return (
      <div className="createHashtagButtonProject cursor-pointer" onClick={props.function}>
        <img className="createHashtagButtonIconProject" src={plusWhiteIcon} alt={"plus"} />
      </div>
    );
  };

  const SelectorCreateModal = (props: any) => {
    return (
      <div>
        <FormControl className="selectorFormControlCreatePod">
          <StyledSelect
            disableUnderline
            value={props.selectValue}
            style={{ width: props.width }}
            className="selectProject"
            onChange={props.selectFunction}
          >
            {props.selectItems &&
              props.selectItems.map((item, i) => {
                return (
                  <StyledMenuItem key={i} value={item}>
                    {item}
                  </StyledMenuItem>
                );
              })}
          </StyledSelect>
        </FormControl>
      </div>
    );
  };

  //invitation / friend label
  const FriendLabel = props => {
    return (
      <div className="insurerRowCreatePod">
        <div className="photoInsurerRow"></div>
        <div className="nameInsurerRow">{props.user}</div>
        <div className="closeButtonInsurerRow">
          <button
            className="removePodButton"
            onClick={(e: any) => {
              e.preventDefault();
              let projectCopy = { ...project };
              projectCopy.Positions[props.positionIndex].PositionMembers.splice(props.index, 1);
              setProject(projectCopy);
            }}
          >
            <SvgIcon>
              <CloseSolid />
            </SvgIcon>
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="modalPostProject modal-content">
      <div className="exit" onClick={props.onCloseModal}>
        <img src={require("assets/icons/x_darkblue.png")} alt={"x"} />
      </div>
      <div className="titleCommunitiesModal">Create new Project</div>
      <div className="subTitleCommunitiesModal">General Project info</div>
      <div className="firstRowPost">
        <ImageTitleDescription
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
      </div>
      <div className="flexRowInputs">
        <div className="infoHeaderCreatePod">Privacy</div>
        <img className="infoIconCreatePod" src={infoIcon} alt={"info"} />
      </div>
      <div
        className="option-buttons"
        style={{
          marginBottom: "25px",
        }}
      >
        <button
          className={project.Private === false ? "selected" : undefined}
          id="publicButtonProject"
          onClick={() => {
            handleProjectPrivate(false);
          }}
        >
          Public
        </button>
        <button
          className={project.Private === true ? "selected" : undefined}
          id="privateButtonProject"
          onClick={() => {
            handleProjectPrivate(true);
          }}
        >
          Private
        </button>
      </div>
      <Grid container spacing={2} direction="row" alignItems="flex-start" justify="flex-start">
        <Grid item xs={6} md={4}>
          {renderInputsPostProject({
            name: "Twitter ID",
            placeholder: "Enter Twitter ID...",
            type: "text",
            item: "TwitterID",
          })}
        </Grid>
      </Grid>

      <div
        className="subTitleCommunitiesModal"
        style={{
          marginTop: "20px",
          marginBottom: "24px",
        }}
      >
        Project Details
      </div>
      <Grid container spacing={2} direction="row" alignItems="flex-start" justify="flex-start">
        <Grid item xs={12} md={6}>
          <div className="flexRowInputsCommunitiesModal">
            {renderInputsPostProject({
              name: "Budget",
              placeholder: "Enter Budget...",
              type: "text",
              item: "Budget",
              width: 290,
            })}
            <div className="collateralSelectorProject">
              <SelectorCreateModal
                width={130}
                selectValue={project.Token}
                selectFunction={handleChangeBudgetTokenSelector}
                selectItems={tokens}
              />
            </div>
          </div>
          {renderInputsPostProject({
            name: "Github repo",
            placeholder: "Enter github repository link...",
            type: "text",
            item: "GithubRepo",
          })}
        </Grid>
        <Grid item xs={12} md={6}>
          <div className="flexRowInputsCommunitiesModal">
            <div className="infoHeaderCommunitiesModal">Start date</div>
            <img className="infoIconCommunitiesModal" src={infoIcon} alt={"info"} />
          </div>
          <div
            className="textFieldCommunitiesModal"
            style={{
              width: "calc(100% - 24px)",
              paddingTop: "1px",
              paddingBottom: "1px",
            }}
          >
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <KeyboardDatePicker
                id="date-picker-start-date1"
                minDate={new Date()}
                format="MM.dd.yyyy"
                placeholder="Select date..."
                value={project.CreationDate}
                onChange={handleCreationDate}
                keyboardIcon={<img className="iconCalendarCreatePod" src={calendarIcon} alt={"calendar"} />}
              />
            </MuiPickersUtilsProvider>
          </div>
          <div className="flexRowInputsCommunitiesModal">
            <div className="infoHeaderCommunitiesModal">End date</div>
            <img className="infoIconCommunitiesModal" src={infoIcon} alt={"info"} />
          </div>
          <div
            className="textFieldCommunitiesModal"
            style={{
              width: "calc(100% - 24px)",
              paddingTop: "1px",
              paddingBottom: "1px",
            }}
          >
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <KeyboardDatePicker
                id="date-picker-start-date2"
                minDate={new Date()}
                format="MM.dd.yyyy"
                placeholder="Select end date..."
                value={project.DateDue}
                onChange={handleDateDue}
                keyboardIcon={<img className="iconCalendarCreatePod" src={calendarIcon} alt={"calendar"} />}
              />
            </MuiPickersUtilsProvider>
          </div>
        </Grid>
      </Grid>
      <Divider className="dividerCreatePod" />
      <div className="flexRowInputsCommunitiesModal positions">
        <div
          className="subTitleCommunitiesModal"
          style={{
            marginTop: "20px",
            marginBottom: "24px",
          }}
        >
          Project Positions
        </div>
        <button onClick={addPosition}>Add position</button>
      </div>
      {project.Positions &&
        project.Positions.map((position, index) => (
          <div key={index} className="position">
            <Grid container spacing={2} direction="row" alignItems="flex-start" justify="flex-start">
              <Grid item xs={12} md={6}>
                {renderInputsPostProject({
                  name: "Position Name",
                  placeholder: "Enter Position Name...",
                  type: "text",
                  item: "PositionName",
                  index: index,
                })}
                <div className="flexRowInputsCommunitiesModal">
                  {renderInputsPostProject({
                    name: "Monthly Salary",
                    placeholder: "Enter Salary value...",
                    type: "text",
                    item: "PositionMonthlySalary",
                    index: index,
                    width: 290,
                  })}
                  <div className="collateralSelectorProject">
                    <SelectorCreateModal
                      width={130}
                      selectValue={position.PositionSalaryToken}
                      selectFunction={handleChangePositionSalaryToken}
                      selectItems={tokens}
                    />
                  </div>
                </div>
                <div className="flexRowInputsCommunitiesModal">
                  <div className="infoHeaderCommunitiesModal">Start date</div>
                  <img className="infoIconCommunitiesModal" src={infoIcon} alt={"info"} />
                </div>
                <div
                  className="textFieldCommunitiesModal"
                  style={{
                    width: "calc(100% - 24px)",
                    paddingTop: "1px",
                    paddingBottom: "1px",
                  }}
                >
                  <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <KeyboardDatePicker
                      id="date-picker-start-date3"
                      minDate={new Date()}
                      format="MM.dd.yyyy"
                      placeholder="Select date..."
                      value={position.PositionCreationDate}
                      onChange={(e: any) => {
                        const projectCopy = { ...project };
                        projectCopy.Positions[index].PositionCreationDate = new Date(e).getTime();
                        setProject(projectCopy);
                      }}
                      keyboardIcon={
                        <img className="iconCalendarCreatePod" src={calendarIcon} alt={"calendar"} />
                      }
                    />
                  </MuiPickersUtilsProvider>
                </div>
                <div className="flexRowInputsCommunitiesModal">
                  <div className="infoHeaderCommunitiesModal">End date</div>
                  <img className="infoIconCommunitiesModal" src={infoIcon} alt={"info"} />
                </div>
                <div
                  className="textFieldCommunitiesModal"
                  style={{
                    width: "calc(100% - 24px)",
                    paddingTop: "1px",
                    paddingBottom: "1px",
                  }}
                >
                  <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <KeyboardDatePicker
                      id="date-picker-start-date4"
                      minDate={new Date()}
                      format="MM.dd.yyyy"
                      placeholder="Select date..."
                      value={position.PositionDateDue}
                      onChange={(e: any) => {
                        const projectCopy = { ...project };
                        projectCopy.Positions[index].PositionDateDue = new Date(e).getTime();
                        setProject(projectCopy);
                      }}
                      keyboardIcon={
                        <img className="iconCalendarCreatePod" src={calendarIcon} alt={"calendar"} />
                      }
                    />
                  </MuiPickersUtilsProvider>
                </div>
              </Grid>
              <Grid item xs={12} md={6}>
                <div className="flexRowInputsCommunitiesModal">
                  <div className="infoHeaderCommunitiesModal">Position Description</div>
                  <img className="infoIconCommunitiesModal" src={infoIcon} alt={"info"} />
                </div>
                <textarea
                  className="textAreaImgTitleDesc"
                  value={position.PositionDescription}
                  onChange={(e: any) => {
                    const projectCopy = { ...project };
                    projectCopy.Positions[index].PositionDescription = e.target.value;
                    setProject(projectCopy);
                  }}
                  placeholder={"Project Description"}
                />
              </Grid>
            </Grid>
            <div className="flexRowInputsCommunitiesModal">
              <div>
                <InputWithLabelAndTooltip
                  labelName={"Invite members to apply"}
                  tooltip={""}
                  inputValue={memberSearcher}
                  onInputValueChange={e => {
                    let value = e.target.value;
                    setMemberSearcher(value);
                  }}
                  placeHolder={"Add user by name"}
                  style={{
                    width: "calc(380px - 24px)",
                  }}
                />
              </div>
              <div className="collateralSelectorProject no-margin-bottom">
                <AddButtonCreateModal function={() => addMember(index)} />
              </div>
            </div>
            {position.PositionMembers &&
              position.PositionMembers.map((user, i) => (
                <FriendLabel key={i} index={i} user={user} positionIndex={index} />
              ))}
            <Divider className="dividerCreatePod" />
          </div>
        ))}
      <div
        className="flexCenterCenterRowInputsCommunitiesModal"
        style={{
          marginTop: "60px",
        }}
      >
        <LoadingWrapper loading={creationProgress}>
          <button style={{ marginBottom: "50px" }} onClick={postProject}>
            Post Project
          </button>
        </LoadingWrapper>
      </div>
      {status && (
        <AlertMessage
          key={status.key}
          message={status.msg}
          variant={status.variant}
          onClose={() => setStatus(undefined)}
        />
      )}
    </div>
  );
};

export default PostProject;
