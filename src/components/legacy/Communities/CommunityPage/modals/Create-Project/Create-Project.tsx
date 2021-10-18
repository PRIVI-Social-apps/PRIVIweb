import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";

import SvgIcon from "@material-ui/core/SvgIcon";

import { RootState } from "store/reducers/Reducer";
import ImageTitleDescription from "shared/ui-kit/Page-components/ImageTitleDescription";
import URL from "shared/functions/getURL";
import { DateInput } from "shared/ui-kit/DateTimeInput";
import { TokenSelect } from "shared/ui-kit/Select/TokenSelect";
import AlertMessage from "shared/ui-kit/Alert/AlertMessage";

import "./Create-Project.css";
import "../Communities-modals.css";
import { ReactComponent as CloseSolid } from "assets/icons/close-solid.svg";
import InputWithLabelAndTooltip from "shared/ui-kit/InputWithLabelAndTooltip";
import Box from "shared/ui-kit/Box";

const infoIcon = require("assets/icons/info_icon.png");

const initialData = {
  name: "",
  description: "",
  twitterId: "",
  budget: "",
  token: "",
  githubRepo: "",
  creationDate: new Date(),
  dateDue: new Date(),
  positions: [],
};

const initialPositionData = {
  name: "",
  creationDate: new Date(),
  dateDue: new Date(),
  description: "",
  monthlySalary: "",
  salaryToken: "",
  member: "",
  members: [],
};

const InviteLabel = props => {
  return (
    <div className="adminsMailLabelProject">
      <div className="adminsNameMailLabelProject">
        <div>{props.item.name}</div>
        <button className="removePodButtonProject" onClick={props.onRemove}>
          <SvgIcon>
            <CloseSolid />
          </SvgIcon>
        </button>
      </div>
      {props.item.status === "Accepted" ? (
        <div className="adminsStatusLabelProject">{props.item.status}</div>
      ) : null}
      {props.item.status === "Pending" ? (
        <div className="adminsStatusLabelProject pendingStatusLabelProject">
          {props.item.status}, resend invite
        </div>
      ) : null}
    </div>
  );
};

const CreateProject = (props: any) => {
  const user = useSelector((state: RootState) => state.user);

  const [photo, setPhoto] = useState<any>(null);
  const [photoImg, setPhotoImg] = useState<any>(null);
  const [projectData, setProjectData] = useState<any>({ ...initialData });

  const [tokens, setTokens] = useState<any[]>([]);

  const [status, setStatus] = useState<any>();

  useEffect(() => {
    axios.get(`${URL()}/wallet/getCryptosRateAsList`).then(res => {
      const resp = res.data;
      if (resp.success) {
        setTokens(resp.data.map(obj => ({ token: obj.token, name: obj.token }))); // update token list
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setProjectData({
      ...initialData,
      positions: [],
    });
  }, [props.reset]);

  const getProjectData = (key: string) => projectData[key];

  const onChangeProjectData = (key: string, value: string) => {
    setProjectData(prev => ({ ...prev, [key]: value }));
  };

  const onChangeValue = (key: string) => (value: any) => {
    onChangeProjectData(key, value);
  };

  const onChangeInputValue = (key: string) => event => {
    event.persist();
    onChangeProjectData(key, event.target.value);
  };

  const addPosition = () => {
    setProjectData(prev => ({
      ...prev,
      positions: [...prev.positions, initialPositionData],
    }));
  };

  const addMember = index => event => {
    event.persist();
    const member = getProjectData(`positions[${index}].member`);
    if (member) {
      setProjectData(prev => {
        const members = prev[`positions[${index}].members`];
        const temp = {
          ...prev,
          [`positions[${index}].members`]: [...members, { name: member, status: "Pending" }],
        };
        return { ...temp, [`positions[${index}].member`]: "" };
      });
    }
  };

  const removeMember = (index, mIndex) => event => {
    event.persist();
    setProjectData(prev => {
      const members = [...prev[`positions[${index}].members`]];
      members.splice(mIndex, 1);
      return { ...prev, [`positions[${index}].members`]: members };
    });
  };

  const validateProject = requestBody => {
    const { Private, HasPhoto, Creator, CommunityId, Positions, ...body } = requestBody;
    const invalid = Object.keys(body).find(field => !body[field]);
    return invalid;
  };

  const postProject = () => {
    const requestBody = {
      Private: false,
      HasPhoto: false,
      Creator: user.id,
      CommunityId: props.itemId,
      Name: projectData.name,
      Description: projectData.description,
      TwitterID: projectData.twitterId,
      Budget: projectData.budget,
      Token: projectData.token,
      GithubRepo: projectData.githubRepo,
      CreationDate: projectData.creationDate,
      DateDue: projectData.dateDue,
      Positions: projectData.positions.map(position => ({
        PositionName: position.name,
        PositionDescription: position.description,
        PositionMonthlySalary: position.monthlySalary,
        PositionSalaryToken: position.salaryToken,
        PositionCreationDate: position.creationDate,
        PositionDateDue: position.dateDue,
        PositionMembers: position.members,
      })),
    };

    const inValid = validateProject(requestBody);
    if (inValid) {
      setStatus({
        msg: `Please complete ${inValid}`,
        key: Math.random(),
        variant: "error",
      });
      return;
    }

    axios
      .post(`${URL()}/community/projects/createProject`, requestBody)
      .then(res => {
        const resp = res.data;
        if (resp.success) {
          setStatus({
            msg: "Project Created!",
            key: Math.random(),
            variant: "success",
          });
          props.onRefreshInfo();
          setTimeout(() => {
            props.onCloseModal();
          }, 1000);
        } else {
          if (resp.error) {
            setStatus({
              msg: resp.error,
              key: Math.random(),
              variant: "error",
            });
          } else {
            setStatus({
              msg: "Error when making the request",
              key: Math.random(),
              variant: "error",
            });
          }
        }
      })
      .catch(error => {
        setStatus({
          msg: "Error when making the request",
          key: Math.random(),
          variant: "error",
        });
      });
  };

  const renderInputProject = (props: any) => {
    return (
      <div>
        <InputWithLabelAndTooltip
          labelName={props.name}
          tooltip={""}
          inputValue={getProjectData(props.value)}
          type={props.type}
          minValue={`1`}
          onInputValueChange={e => {
            onChangeInputValue(e.target.value);
          }}
          placeHolder={props.placeholder}
        />
      </div>
    );
  };

  const renderSelectProject = (props: any) => {
    return (
      <TokenSelect
        value={getProjectData(props.value)}
        onChange={onChangeInputValue(props.value)}
        tokens={tokens}
      />
    );
  };

  return (
    <div className="modalCreateProject modal-content">
      <div className="firstPartCreateProject">
        <div className="exit" onClick={props.onCloseModal}>
          <img src={require("assets/icons/x_darkblue.png")} alt={"x"} />
        </div>
        <div className="titleCommunitiesModal">Create project</div>
        <div className="subTitleCommunitiesModal">General project info</div>
        <div className="firstRowCreateProject">
          <ImageTitleDescription
            photoImg={photoImg}
            photoTitle="Project Image"
            setterPhoto={setPhoto}
            setterPhotoImg={setPhotoImg}
            titleTitle="Project Name"
            title={getProjectData("name")}
            setterTitle={onChangeValue("name")}
            titlePlaceholder="Proposal question..."
            descTitle="Project Description"
            desc={getProjectData("description")}
            setterDesc={onChangeValue("description")}
            descPlaceholder="Project Description..."
            imageSize={6}
            infoSize={6}
            canEdit={true}
          />
        </div>
        <Box display="flex" flexDirection="row">
          <Box width={1} style={{ paddingRight: 10, marginTop: 16 }}>
            {renderInputProject({
              name: "Twitter ID",
              placeholder: "Enter Twitter ID",
              type: "text",
              value: "twitterId",
            })}
          </Box>
          <Box width={1} style={{ paddingLeft: 10 }}></Box>
        </Box>
      </div>

      <div className="secondPartCreateProject">
        <div
          className="subTitleCommunitiesModal"
          style={{
            marginTop: "20px",
            marginBottom: "24px",
          }}
        >
          Project Details
        </div>
        <Box display="flex" flexDirection="row">
          <Box width={1} style={{ paddingRight: 10 }}>
            <Box display="flex" flexDirection="row" alignItems="flex-end">
              <Box width={1} style={{ paddingRight: 10 }}>
                {renderInputProject({
                  name: "Budget",
                  placeholder: "Enter Budget...",
                  type: "number",
                  value: "budget",
                })}
              </Box>
              <Box width={1} style={{ paddingLeft: 10, marginBottom: 19 }}>
                {renderSelectProject({
                  items: tokens,
                  value: "token",
                })}
              </Box>
            </Box>
          </Box>
          <Box width={1} style={{ paddingLeft: 10 }}>
            <div className="flexRowInputsCommunitiesModal">
              <div className="infoHeaderCommunitiesModal">Start date</div>
              <img className="infoIconCommunitiesModal" src={infoIcon} alt={"info"} />
            </div>
            <DateInput
              height={46}
              customStyle={{ marginTop: 8 }}
              id="date-picker-start-date"
              minDate={new Date()}
              format="MM.dd.yyyy"
              placeholder="Select date..."
              value={getProjectData("creationDate")}
              onChange={onChangeValue("creationDate")}
            />
          </Box>
        </Box>
        <Box display="flex" flexDirection="row">
          <Box width={1} style={{ paddingRight: 10 }}>
            {renderInputProject({
              name: "Github repo",
              placeholder: "Enter github repository link...",
              type: "text",
              value: "githubRepo",
            })}
          </Box>
          <Box width={1} style={{ paddingLeft: 10 }}>
            <div className="flexRowInputsCommunitiesModal">
              <div className="infoHeaderCommunitiesModal">End date</div>
              <img className="infoIconCommunitiesModal" src={infoIcon} alt={"info"} />
            </div>
            <DateInput
              height={46}
              customStyle={{ marginTop: 8 }}
              id="date-picker-end-date"
              minDate={new Date()}
              format="MM.dd.yyyy"
              placeholder="Select date..."
              value={getProjectData("dateDue")}
              onChange={onChangeValue("dateDue")}
            />
          </Box>
        </Box>
      </div>

      <div className="thirdPartCreateProject">
        <div className="subTitleCommunitiesModal" style={{ marginTop: "20px", marginBottom: "24px" }}>
          Project Positions
          <div onClick={addPosition}>
            <img src={require("assets/icons/add.png")} />
          </div>
        </div>
        {projectData.positions.map((position, index) => (
          <div className="positions" key={`position-${index}`}>
            <Box display="flex" flexDirection="row">
              <Box width={1} style={{ paddingRight: 10 }}>
                {renderInputProject({
                  name: "Position Name",
                  placeholder: "Enter your Position Name here",
                  type: "text",
                  value: `positions[${index}].name`,
                })}
                <Box display="flex" flexDirection="row" alignItems="flex-end">
                  <Box width={0.7} style={{ paddingRight: 10 }}>
                    {renderInputProject({
                      name: "Monthly Salary",
                      placeholder: "Enter your Monthly Salary",
                      type: "number",
                      value: `positions[${index}].monthlySalary`,
                    })}
                  </Box>
                  <Box width={0.3} style={{ paddingLeft: 10, marginBottom: 19 }}>
                    {renderSelectProject({
                      items: tokens,
                      value: `positions[${index}].salaryToken`,
                    })}
                  </Box>
                </Box>
              </Box>
              <Box width={1} style={{ paddingLeft: 10 }} display="flex" flexDirection="column">
                <div className="flexRowInputsCommunitiesModal">
                  <div className="infoHeaderCommunitiesModal">Position Description</div>
                  <img className="infoIconCommunitiesModal" src={infoIcon} alt={"info"} />
                </div>
                <textarea
                  style={{ flex: 1, marginBottom: 18 }}
                  className="textAreaImgTitleDesc"
                  placeholder={"Enter your Position Description here"}
                  value={position.description}
                  onChange={onChangeInputValue(`positions[${index}].description`)}
                />
              </Box>
            </Box>
            <Box display="flex" flexDirection="row">
              <Box width={1} style={{ paddingRight: 10 }}>
                <div className="flexRowInputsCommunitiesModal">
                  <div className="infoHeaderCommunitiesModal">Start date</div>
                  <img className="infoIconCommunitiesModal" src={infoIcon} alt={"info"} />
                </div>
                <DateInput
                  height={46}
                  customStyle={{ marginTop: 8 }}
                  id="date-picker-start-date-1"
                  minDate={new Date()}
                  format="MM.dd.yyyy"
                  placeholder="Select date..."
                  value={position.creationDate}
                  onChange={onChangeValue(`positions[${index}].creationDate`)}
                />
              </Box>
              <Box width={1} style={{ paddingLeft: 10 }}>
                <div className="flexRowInputsCommunitiesModal">
                  <div className="infoHeaderCommunitiesModal">End date</div>
                  <img className="infoIconCommunitiesModal" src={infoIcon} alt={"info"} />
                </div>
                <DateInput
                  height={46}
                  customStyle={{ marginTop: 8 }}
                  id="date-picker-end-date-1"
                  minDate={new Date()}
                  format="MM.dd.yyyy"
                  placeholder="Select date..."
                  value={position.dateDue}
                  onChange={onChangeValue(`positions[${index}].dateDue`)}
                />
              </Box>
            </Box>
            <Box display="flex" flexDirection="row">
              <Box
                width={1}
                style={{ paddingRight: 10 }}
                display="flex"
                flexDirection="row"
                alignItems="flex-end"
              >
                <Box width={1}>
                  <InputWithLabelAndTooltip
                    labelName={"Invite members to apply<"}
                    tooltip={""}
                    inputValue={position.member}
                    onInputValueChange={e => {
                      onChangeInputValue(`positions[${index}].member`);
                    }}
                    placeHolder={"Add user by email"}
                  />
                </Box>
                <Box>
                  <button
                    onClick={addMember(index)}
                    style={{ width: 46, height: 46, padding: 0, marginLeft: 10 }}
                  >
                    +
                  </button>
                </Box>
              </Box>
              <Box width={1} />
            </Box>
            <Box mt={2}>
              {position.members.map((member, pIndex) => (
                <InviteLabel
                  key={`position-member-${pIndex}`}
                  item={member}
                  onRemove={removeMember(index, pIndex)}
                />
              ))}
            </Box>
          </div>
        ))}
      </div>
      <Box
        display="flex"
        flexDirection="row"
        justifyContent="flex-end"
        style={{ marginTop: 32, marginBottom: 48 }}
      >
        <button onClick={postProject}>Post Project</button>
      </Box>
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

export default CreateProject;
