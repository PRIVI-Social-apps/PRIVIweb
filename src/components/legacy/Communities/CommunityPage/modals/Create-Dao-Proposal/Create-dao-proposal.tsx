import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";

import FormControl from "@material-ui/core/FormControl";

import { createDaoProposalModalStyles } from "./Create-dao-proposal.styles";
import { RootState } from "store/reducers/Reducer";
import { TokenSelect } from "shared/ui-kit/Select/TokenSelect";
import URL from "shared/functions/getURL";
import { StyledSelect, StyledMenuItem } from "shared/ui-kit/Styled-components/StyledComponents";
import { DateInput } from "shared/ui-kit/DateTimeInput";
import { signTransaction } from "shared/functions/signTransaction";
import ImageTitleDescription from "shared/ui-kit/Page-components/ImageTitleDescription";
import AlertMessage from "shared/ui-kit/Alert/AlertMessage";
import { LoadingWrapper } from "shared/ui-kit/Hocs";
import { Modal, PrimaryButton } from "shared/ui-kit";
import SvgIcon from "@material-ui/core/SvgIcon";
import { ReactComponent as CloseSolid } from "assets/icons/close-solid.svg";
import InputWithLabelAndTooltip from "shared/ui-kit/InputWithLabelAndTooltip";
import Box from "shared/ui-kit/Box";

const infoIcon = require("assets/icons/info_icon.png");

const CreateDaoProposalModal = (props: any) => {
  const classes = createDaoProposalModalStyles();
  const userSelector = useSelector((state: RootState) => state.user);

  const [daoProposal, setDaoProposal] = useState<any>({
    startingDate: Date.now(),
    endingDate: Date.now(),
    discordID: "",
    twitterID: "",
    totalVotes: "",
    quorumRequired: "",
    type: "staking",
  });
  const [photo, setPhoto] = useState<any>(null);
  const [photoImg, setPhotoImg] = useState<any>(null);
  const inputRef: any = useRef([]);

  const [admin, setAdmin] = useState<string>("");
  const [admins, setAdmins] = useState<any[]>([]);
  //users
  const [user, setUser] = useState<string>("");
  const userRoles = ["Admin", "Moderator"];
  const [userRole, setUserRole] = useState<string>(userRoles[0]);
  const [usersRoles, setUsersRoles] = useState<any[]>([]);

  //insurers
  const [memberSearcher, setMemberSearcher] = useState<string>("");
  const [members, setMembers] = useState<string[]>([]);

  const [votesTokenSelector, setVotesTokenSelector] = useState<string>("");
  const [tokens, setTokens] = useState<string[]>([]);

  const [status, setStatus] = useState<any>();
  const [creationProgress, setCreationProgress] = useState(false);

  // get token list from backend
  useEffect(() => {
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
        setTokens(data); // update token list
        setVotesTokenSelector(tokenList[0]); // initial (default) collateral selection
        const daoProposalCopy = { ...daoProposal };
        daoProposalCopy.Project = tokenList[0];
        setDaoProposal(daoProposalCopy);
      }
    });
    // We define the size of array after receiving the data

    inputRef.current = new Array(10); // is it just 10?

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChangeUserRole = event => {
    const value = event.target.value;
    setUserRole(value);
  };

  const handleChangeVotesTokenSelector = event => {
    const value = event.target.value;
    setVotesTokenSelector(value);
  };

  const addAdmin = () => {
    if (admin && admin !== "") {
      //TODO: check if email exists ???
      let array = [...admins];
      array.push({
        name: admin,
        status: "Pending",
      });
      setAdmins(array);
      setAdmin("");
    }
  };
  const addMember = () => {
    if (memberSearcher && memberSearcher !== "") {
      //TODO: check if email exists ???
      let array = [...members];
      array.push(memberSearcher);
      setMembers(array);
      setMemberSearcher(""); // reset field
    }
  };

  const handleDateDeadLine = (elem: any) => {
    let daoProposalCopy = { ...daoProposal };
    daoProposalCopy.startingDate = new Date(elem).getTime();
    setDaoProposal(daoProposalCopy);
  };
  const handleDateDuration = (elem: any) => {
    let daoProposalCopy = { ...daoProposal };
    daoProposalCopy.endingDate = new Date(elem).getTime();
    setDaoProposal(daoProposalCopy);
  };

  const postProject = async () => {
    daoProposal.creatorAddress = userSelector.id;
    daoProposal.votationAddress = props.item.VotationAddress;
    daoProposal.votingToken = votesTokenSelector;
    daoProposal.itemType = props.itemType;
    daoProposal.itemId = props.itemId;
    daoProposal.userId = userSelector.id;
    daoProposal.votationToken = props.item.TokenSymbol;

    let body = {
      CreatorAddress: daoProposal.creatorAddress,
      VotationId: userSelector.votationId,
      VotingToken: votesTokenSelector,
      QuorumRequired: daoProposal.quorumRequired / 100,
      TotalVotes: daoProposal.totalVotes,
      StartingDate: daoProposal.startingDate,
      EndingDate: daoProposal.endingDate,
    };

    const [hash, signature] = await signTransaction(userSelector.mnemonic, body);

    daoProposal.hash = hash;
    daoProposal.signature = signature;

    daoProposal.VotingToken = body.VotingToken;

    if (
      daoProposal &&
      daoProposal.question &&
      daoProposal.description &&
      daoProposal.totalVotes &&
      daoProposal.startingDate &&
      daoProposal.endingDate &&
      daoProposal.quorumRequired &&
      photoImg &&
      photo
    ) {
      setCreationProgress(true);
      setStatus(undefined);
      axios
        .post(`${URL()}/voting/create`, daoProposal)
        .then(async res => {
          const resp = res.data;
          if (resp.success) {
            await uploadImage(resp.data.VotationId);
            setStatus({
              msg: "DAO Proposal Created!",
              key: Math.random(),
              variant: "success",
            });
            props.onRefreshInfo();

            setTimeout(() => {
              props.onCloseModal();
              setCreationProgress(false);
            }, 1000);
          } else {
            setStatus({
              msg: "Error when making the request",
              key: Math.random(),
              variant: "error",
            });
            setCreationProgress(false);
          }
        })
        .catch(error => {
          setStatus({
            msg: "Error when making the request",
            key: Math.random(),
            variant: "error",
          });
          setCreationProgress(false);
        });
    } else {
      setStatus({
        msg: "Complete all fields",
        key: Math.random(),
        variant: "error",
      });
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
        .post(`${URL()}/voting/changeVotingPhoto`, formData, config)
        .then(response => {
          resolve(true);
        })
        .catch(error => {
          console.log(error);

          resolve(true);
          alert("Error uploading photo");
        });
    });
  };

  function renderInputsPostProject(p) {
    return (
      <div>
        <InputWithLabelAndTooltip
          labelName={p.name}
          tooltip={""}
          inputValue={daoProposal[p.item]}
          minValue={`${p.min || 0}`}
          type={p.type}
          onInputValueChange={e => {
            let daoProposalCopy = { ...daoProposal };
            daoProposalCopy[p.item] = e.target.value;
            setDaoProposal(daoProposalCopy);
          }}
          placeHolder={p.placeholder}
        />
      </div>
    );
  }

  const AdminsMailLabel = props => {
    return (
      <div className={classes.adminsMailLabelProject}>
        <div className={classes.adminsNameMailLabelProject}>
          <div>{props.admin.name}</div>
          <button
            className={classes.removePodButtonProject}
            onClick={(e: any) => {
              e.preventDefault();
              let adminsCopy = [...admins];
              adminsCopy.splice(props.index, 1);
              setAdmins(adminsCopy);
            }}
          >
            <SvgIcon>
              <CloseSolid />
            </SvgIcon>
          </button>
        </div>
        {props.admin.status === "Accepted" ? (
          <div className={classes.adminsStatusLabelProject}>{props.admin.status}</div>
        ) : null}
        {props.admin.status === "Pending" ? (
          <div className={classes.pendingStatusLabelProject}>{props.admin.status}, resend invite</div>
        ) : null}
      </div>
    );
  };
  const RoleLabel = props => {
    return (
      <div className={classes.adminsMailLabelProject}>
        <div className={classes.adminsNameMailLabelProject}>
          <div className={classes.mainHashtagLabelProject}>{props.user.role}</div>
          <div>{props.user.name}</div>
          <button
            className={classes.removePodButtonProject}
            onClick={(e: any) => {
              e.preventDefault();
              let usersCopy = [...userRoles];
              usersCopy.splice(props.index, 1);
              setAdmins(usersCopy);
            }}
          >
            <SvgIcon>
              <CloseSolid />
            </SvgIcon>
          </button>
        </div>
        {props.user.status === "Accepted" ? (
          <div className={classes.adminsStatusLabelProject}>{props.admin.status}</div>
        ) : null}
        {props.user.status === "Pending" ? (
          <div className={classes.pendingStatusLabelProject}>{props.user.status}, resend invite</div>
        ) : null}
      </div>
    );
  };

  const addUserRole = () => {
    if (user && user !== "" && userRole && userRole !== "") {
      //TODO: check if email exists ???
      let array = [...usersRoles];
      array.push({
        name: user,
        role: userRole,
        status: "Pending",
      });
      setUsersRoles(array);
      setUser(""); // reset field
    }
  };

  const SelectorCreateModal = (props: any) => {
    return (
      <div>
        <FormControl className={classes.selectorFormControlCreatePod}>
          <StyledSelect
            disableUnderline
            value={props.selectValue}
            style={{ width: props.width }}
            className={classes.selectProject}
            onChange={props.selectFunction}
          >
            {props.selectItems.map((item, i) => {
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

  return (
    <Modal size="medium" isOpen={props.open} onClose={props.onClose} showCloseIcon className={classes.root}>
      <div className={classes.modalContent}>
        <div className={classes.firstPartCreateDaoProposal}>
          <div className={classes.titleCommunitiesModal}>Create new DAO proposal</div>
          <div className={classes.subTitleCommunitiesModal}>General DAO proposal info</div>
          <div className={classes.firstRowCreateDaoProposal}>
            <ImageTitleDescription
              photoImg={photoImg}
              photoTitle="Proposal Image"
              setterPhoto={setPhoto}
              setterPhotoImg={setPhotoImg}
              titleTitle="Proposal question"
              title={daoProposal.question}
              setterTitle={name => {
                let daoProposalCopy = { ...daoProposal };
                daoProposalCopy.question = name;
                setDaoProposal(daoProposalCopy);
              }}
              titlePlaceholder="Proposal question..."
              descTitle="Proposal description"
              desc={daoProposal.description}
              setterDesc={desc => {
                let daoProposalCopy = { ...daoProposal };
                daoProposalCopy.description = desc;
                setDaoProposal(daoProposalCopy);
              }}
              descPlaceholder="Proposal description..."
              imageSize={6}
              canEdit={true}
            />
          </div>
        </div>
        <div className={classes.secondPartCreateDaoProposal}>
          <div className={classes.subTitleCommunitiesModal}>Details</div>
          <Box className={classes.itemRow} display="flex" flexDirection="row">
            <Box
              width={1}
              display="flex"
              flexDirection="row"
              alignItems="flex-end"
              style={{ paddingRight: 10 }}
            >
              <Box width={1} style={{ paddingRight: 10 }}>
                {renderInputsPostProject({
                  name: "Votes required",
                  placeholder: "#",
                  type: "number",
                  item: "totalVotes",
                  index: 2,
                })}
              </Box>
              <Box width={1} style={{ paddingLeft: 10 }}>
                {tokens.length > 0 && (
                  <TokenSelect
                    value={votesTokenSelector}
                    onChange={handleChangeVotesTokenSelector}
                    tokens={tokens}
                  />
                )}
              </Box>
            </Box>
            <Box width={1} style={{ paddingLeft: 10 }}>
              <div className={classes.flexRowInputsCommunitiesModal}>
                <div className={classes.infoHeaderCommunitiesModal}>Start date</div>
                <img className={classes.infoIconCommunitiesModal} src={infoIcon} alt={"info"} />
              </div>
              <DateInput
                id="date-picker-start-date"
                minDate={new Date()}
                format="MM.dd.yyyy"
                placeholder="Select date..."
                height={46}
                value={daoProposal.startingDate}
                onChange={handleDateDeadLine}
              />
            </Box>
          </Box>
          <Box className={classes.itemRow} display="flex" flexDirection="row">
            <Box width={1} style={{ paddingRight: 10 }}>
              {renderInputsPostProject({
                name: "Quorum required",
                placeholder: "Value (%)",
                type: "number",
                item: "quorumRequired",
                index: 3,
              })}
            </Box>
            <Box width={1} style={{ paddingLeft: 10 }}>
              <div className={classes.flexRowInputsCommunitiesModal}>
                <div className={classes.infoHeaderCommunitiesModal}>End date</div>
                <img className={classes.infoIconCommunitiesModal} src={infoIcon} alt={"info"} />
              </div>
              <DateInput
                id="date-picker-start-date"
                minDate={new Date()}
                format="MM.dd.yyyy"
                placeholder="Select date..."
                value={daoProposal.endingDate}
                height={46}
                onChange={handleDateDuration}
              />
            </Box>
          </Box>
        </div>
        <div className={classes.secondPartCreateDaoProposal}>
          <div className={classes.subTitleCommunitiesModal}>Community Levels</div>
          <Box className={classes.itemRow} display="flex" flexDirection="row" alignItems="flex-end">
            <Box width={0.1} style={{ paddingRight: 10 }}>
              {renderInputsPostProject({
                name: "Levels",
                placeholder: "1",
                type: "number",
                item: "level",
                index: 2,
                min: 0,
              })}
            </Box>
            <Box width={0.45} style={{ paddingLeft: 10, paddingRight: 10 }}>
              {renderInputsPostProject({
                name: "Level Name",
                placeholder: "Level Name",
                type: "text",
                item: "levelName",
                index: 2,
              })}
            </Box>
            <Box width={0.45} style={{ paddingLeft: 10 }}>
              {renderInputsPostProject({
                name: "Level Description",
                placeholder: "Level Description",
                type: "text",
                item: "levelDescription",
                index: 2,
              })}
            </Box>
          </Box>
          <Box className={classes.itemRow} display="flex" flexDirection="row" justifyContent="flex-end">
            <PrimaryButton size="medium">+ Add</PrimaryButton>
          </Box>
        </div>
        <div className={classes.createDaoProposalDetails}>
          <div className={classes.subTitleCommunitiesModal}>Details</div>
          <Box className={classes.itemRow} display="flex" flexDirection="row" alignItems="flex-end">
            <Box width={1} style={{ paddingRight: 10 }}>
              <InputWithLabelAndTooltip
                labelName={"Admins (email)"}
                tooltip={""}
                inputValue={admin}
                type={"text"}
                onInputValueChange={e => {
                  setAdmin(e.target.value);
                }}
                placeHolder={"Add admin by email"}
              />
            </Box>
            <Box width={1} style={{ paddingLeft: 10 }}>
              <PrimaryButton size="medium" onClick={() => addAdmin()}>
                + Admin
              </PrimaryButton>
            </Box>
          </Box>
          {admins && admins.length !== 0 ? (
            <div>
              {admins.map((item, i) => {
                return <AdminsMailLabel key={i} index={i} admin={item} />;
              })}
            </div>
          ) : null}
          <Box className={classes.itemRow} display="flex" flexDirection="row" alignItems="flex-end">
            <Box
              width={1}
              display="flex"
              flexDirection="row"
              alignItems="flex-end"
              style={{ paddingRight: 10 }}
            >
              <Box width={1} style={{ paddingRight: 10 }}>
                <div className={classes.userRoles}>
                  <InputWithLabelAndTooltip
                    labelName={"User and roles"}
                    tooltip={""}
                    inputValue={user}
                    type={"text"}
                    onInputValueChange={e => {
                      setUser(e.target.value);
                    }}
                    placeHolder={"Add user by email"}
                  />
                </div>
              </Box>
              <Box width={1}>
                <div className={classes.userRolesSelector}>
                  <SelectorCreateModal
                    selectValue={userRole}
                    selectFunction={handleChangeUserRole}
                    selectItems={userRoles}
                  />
                </div>
              </Box>
            </Box>
            <Box width={1} style={{ paddingLeft: 10 }}>
              <PrimaryButton size="medium" onClick={() => addUserRole()}>
                + User
              </PrimaryButton>
            </Box>
          </Box>
          {usersRoles && usersRoles.length !== 0 ? (
            <div>
              {usersRoles.map((item, i) => {
                return <RoleLabel key={i} index={i} user={item} />;
              })}
            </div>
          ) : null}
          <Box className={classes.itemRow} display="flex" flexDirection="row" alignItems="flex-end">
            <Box width={1} style={{ paddingRight: 10 }}>
              <InputWithLabelAndTooltip
                labelName={"Invite members to apply"}
                tooltip={""}
                inputValue={memberSearcher}
                type={"text"}
                onInputValueChange={e => {
                  setMemberSearcher(e.target.value);
                }}
                placeHolder={"Add user by email"}
              />
            </Box>
            <Box width={1} style={{ paddingLeft: 10 }}>
              <PrimaryButton size="medium" onClick={() => addMember()}>
                + Invite
              </PrimaryButton>
            </Box>
          </Box>
          <LoadingWrapper loading={creationProgress}>
            <div className={classes.flexCenterCenterRowInputsCommunitiesModal}>
              <PrimaryButton size="medium" onClick={postProject}>
                Post DAO Proposal
              </PrimaryButton>
            </div>
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
    </Modal>
  );
};

export default CreateDaoProposalModal;
