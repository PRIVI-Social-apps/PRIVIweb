import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";

import SvgIcon from "@material-ui/core/SvgIcon";

import { createDaoProposalModalStyles } from "./Create-dao-proposal.styles";
import { RootState } from "store/reducers/Reducer";
import { StyledSelectComponent, TokenSelect } from "shared/ui-kit/Select/TokenSelect";
import URL from "shared/functions/getURL";
import { DateInput } from "shared/ui-kit/DateTimeInput";
import { signTransaction } from "shared/functions/signTransaction";
import ImageTitleDescription from "shared/ui-kit/Page-components/ImageTitleDescription";
import AlertMessage from "shared/ui-kit/Alert/AlertMessage";
import { LoadingWrapper } from "shared/ui-kit/Hocs";
import { Modal } from "shared/ui-kit";
import { ReactComponent as CloseSolid } from "assets/icons/close-solid.svg";
import InputWithLabelAndTooltip from "shared/ui-kit/InputWithLabelAndTooltip";
import { DAOButton, DAOButtonPlain } from "components/PriviDAO/components/DAOButton";
import Box from 'shared/ui-kit/Box';

const infoIcon = require("assets/icons/info_white.png");

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

  return (
    <Modal
      size="small"
      isOpen={props.open}
      onClose={props.onClose}
      showCloseIcon
      className={classes.rootDark}
      theme={"dark"}
    >
      <Box color="white" fontSize="18px" display="flex" flexDirection="column">
        <Box fontSize="30px" mb={3}>
          Create new DAO proposal
        </Box>
        <Box mb={3}>General DAO proposal info</Box>
        <ImageTitleDescription
          theme="dark"
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
          infoSize={6}
          canEdit={true}
        />
        <Box mb={3} mt={3}>
          Details
        </Box>

        <Box display="flex" flexDirection="row" mb={1}>
          <Box display="flex" flexDirection="column" width={0.5}>
            <Box display="flex" alignItems="center">
              <Box mr={"4px"}>Votes required</Box>
              <img src={infoIcon} style={{ width: "12px", height: "12px" }} alt={"info"} />
            </Box>
            <Box display="flex" flexDirection="row" alignItems="flex-end" style={{ paddingRight: 10 }}>
              <Box width={0.5} style={{ paddingRight: 10 }}>
                <InputWithLabelAndTooltip
                  theme="dark"
                  tooltip={""}
                  inputValue={daoProposal.totalVotes}
                  minValue={0}
                  type={"number"}
                  onInputValueChange={e => {
                    let daoProposalCopy = { ...daoProposal };
                    daoProposalCopy.totalVotes = e.target.value;
                    setDaoProposal(daoProposalCopy);
                  }}
                  placeHolder={""}
                />
              </Box>
              <Box width={0.5} style={{ paddingLeft: 10 }}>
                {tokens.length > 0 && (
                  <TokenSelect
                    theme="dark"
                    value={votesTokenSelector}
                    onChange={handleChangeVotesTokenSelector}
                    tokens={tokens}
                  />
                )}
              </Box>
            </Box>
          </Box>
          <Box width={0.5} style={{ paddingLeft: 10 }}>
            <Box display="flex" alignItems="center" mb={1}>
              <Box mr={"4px"}>Start date</Box>
              <img src={infoIcon} style={{ width: "12px", height: "12px" }} alt={"info"} />
            </Box>
            <DateInput
              theme="dark"
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
        <Box display="flex" flexDirection="row" mb={1}>
          <Box width={1} style={{ paddingRight: 10 }}>
            <InputWithLabelAndTooltip
              theme="dark"
              labelName={"Quorum required"}
              tooltip={""}
              inputValue={daoProposal.quorumRequired}
              minValue={0}
              type={"number"}
              onInputValueChange={e => {
                let daoProposalCopy = { ...daoProposal };
                daoProposalCopy.quorumRequired = e.target.value;
                setDaoProposal(daoProposalCopy);
              }}
              placeHolder={"Value (%)"}
            />
          </Box>
          <Box width={1} style={{ paddingLeft: 10 }}>
            <Box display="flex" alignItems="center" mb={1}>
              <Box mr={"4px"}>End Date</Box>
              <img src={infoIcon} style={{ width: "12px", height: "12px" }} alt={"info"} />
            </Box>
            <DateInput
              theme="dark"
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
        <Box mb={3} mt={3}>
          Community Levels
        </Box>
        <Box display="flex" flexDirection="row" alignItems="flex-end" mb={1}>
          <Box width={0.15} style={{ paddingRight: 10 }}>
            <InputWithLabelAndTooltip
              theme="dark"
              labelName={"Levels"}
              tooltip={""}
              inputValue={daoProposal.level}
              minValue={0}
              type={"number"}
              onInputValueChange={e => {
                let daoProposalCopy = { ...daoProposal };
                daoProposalCopy.level = e.target.value;
                setDaoProposal(daoProposalCopy);
              }}
              placeHolder={""}
            />
          </Box>
          <Box width={0.425} style={{ paddingLeft: 10, paddingRight: 10 }}>
            <InputWithLabelAndTooltip
              theme="dark"
              tooltip={""}
              inputValue={daoProposal.levelName}
              minValue={0}
              type={"text"}
              onInputValueChange={e => {
                let daoProposalCopy = { ...daoProposal };
                daoProposalCopy.levelName = e.target.value;
                setDaoProposal(daoProposalCopy);
              }}
              placeHolder={"Level name"}
            />
          </Box>
          <Box width={0.425} style={{ paddingLeft: 10 }}>
            <InputWithLabelAndTooltip
              theme="dark"
              tooltip={""}
              inputValue={daoProposal.levelDescription}
              type={"text"}
              onInputValueChange={e => {
                let daoProposalCopy = { ...daoProposal };
                daoProposalCopy.levelDescription = e.target.value;
                setDaoProposal(daoProposalCopy);
              }}
              placeHolder={"Level Description"}
            />
          </Box>
        </Box>
        <Box display="flex" flexDirection="row" justifyContent="flex-end" className={classes.maxWidth}>
          <DAOButtonPlain>Add</DAOButtonPlain>
        </Box>
        <Box mb={3} mt={3}>
          Details
        </Box>
        <Box display="flex" flexDirection="row" alignItems="flex-end" mb={1}>
          <Box width={0.65} style={{ paddingRight: 10 }}>
            <InputWithLabelAndTooltip
              theme="dark"
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
          <Box
            width={0.35}
            style={{ paddingLeft: 10 }}
            display="flex"
            justifyContent="flex-end"
            className={classes.maxWidth}
          >
            <DAOButtonPlain onClick={addAdmin} insideCard>
              Add admin
            </DAOButtonPlain>
          </Box>
        </Box>
        {admins && admins.length !== 0 ? (
          <Box mb={1}>
            {admins.map((item, i) => {
              return <AdminsMailLabel key={i} index={i} admin={item} admins={admins} setAdmins={setAdmins} />;
            })}
          </Box>
        ) : null}
        <Box display="flex" flexDirection="row" alignItems="flex-end" mb={1}>
          <Box
            width={0.65}
            display="flex"
            flexDirection="row"
            alignItems="flex-end"
            style={{ paddingRight: 10 }}
          >
            <Box width={1} style={{ paddingRight: 10 }}>
              <InputWithLabelAndTooltip
                theme="dark"
                labelName={"User and roles"}
                tooltip={""}
                inputValue={user}
                type={"text"}
                onInputValueChange={e => {
                  setUser(e.target.value);
                }}
                placeHolder={"Add user by email"}
              />
            </Box>
            <Box width={0.5}>
              <StyledSelectComponent
                theme="dark"
                value={userRole}
                onChange={handleChangeUserRole}
                options={userRoles}
              />
            </Box>
          </Box>
          <Box
            width={0.35}
            style={{ paddingLeft: 10 }}
            display="flex"
            justifyContent="flex-end"
            className={classes.maxWidth}
          >
            <DAOButtonPlain onClick={() => addUserRole()}>Add user</DAOButtonPlain>
          </Box>
        </Box>
        {usersRoles && usersRoles.length !== 0 ? (
          <div>
            {usersRoles.map((item, i) => {
              return (
                <RoleLabel
                  key={i}
                  index={i}
                  user={item}
                  admin={admin}
                  setAdmins={setAdmins}
                  userRoles={userRoles}
                />
              );
            })}
          </div>
        ) : null}
        <Box display="flex" flexDirection="row" alignItems="flex-end">
          <Box width={0.65} style={{ paddingRight: 10 }}>
            <InputWithLabelAndTooltip
              theme="dark"
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
          <Box
            width={0.35}
            style={{ paddingLeft: 10 }}
            display="flex"
            justifyContent="flex-end"
            className={classes.maxWidth}
          >
            <DAOButtonPlain onClick={() => addMember()}>Invite</DAOButtonPlain>
          </Box>
        </Box>
        <Box display="flex" justifyContent="flex-end" mt={6}>
          <LoadingWrapper theme="dark" loading={creationProgress}>
            <DAOButton onClick={postProject}>Post DAO Proposal</DAOButton>
          </LoadingWrapper>
        </Box>
        {status && (
          <AlertMessage
            key={status.key}
            message={status.msg}
            variant={status.variant}
            onClose={() => setStatus(undefined)}
          />
        )}
      </Box>
    </Modal>
  );
};

export default CreateDaoProposalModal;

const AdminsMailLabel = ({ admins, setAdmins, admin, index }) => {
  const classes = createDaoProposalModalStyles();

  return (
    <Box display="flex" alignItems="center" mb={2}>
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        fontSize={"10px"}
        width={5}
        height={2}
        fontWeight={800}
        mr={"10px"}
        borderRadius={1}
        style={{ backgroundColor: " rgba(255, 255, 255, 0.16)" }}
      >
        <div>{admin.name}</div>
        <button
          className={classes.removePodButtonProject}
          onClick={(e: any) => {
            e.preventDefault();
            let adminsCopy = [...admins];
            adminsCopy.splice(index, 1);
            setAdmins(adminsCopy);
          }}
        >
          <SvgIcon>
            <CloseSolid />
          </SvgIcon>
        </button>
      </Box>
      {admin.status === "Accepted" ? <Box>{admin.status}</Box> : null}
      {admin.status === "Pending" ? <Box>{admin.status}, resend invite</Box> : null}
    </Box>
  );
};
const RoleLabel = ({ user, admin, index, userRoles, setAdmins }) => {
  const classes = createDaoProposalModalStyles();

  return (
    <Box display="flex" alignItems="center" mb={2}>
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        pl={2}
        pr={2}
        height={5}
        borderRadius={"16px"}
        mr={10}
        style={{ backgroundColor: " rgba(255, 255, 255, 0.16)" }}
      >
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          fontSize={"10px"}
          width={5}
          height={2}
          fontWeight={800}
          mr={"10px"}
          borderRadius={1}
          style={{ backgroundColor: " rgba(255, 255, 255, 0.16)" }}
        >
          {user.role}
        </Box>
        <div>{user.name}</div>
        <button
          className={classes.removePodButtonProject}
          onClick={(e: any) => {
            e.preventDefault();
            let usersCopy = [...userRoles];
            usersCopy.splice(index, 1);
            setAdmins(usersCopy);
          }}
        >
          <SvgIcon>
            <CloseSolid />
          </SvgIcon>
        </button>
      </Box>
      {user.status === "Accepted" ? <Box height={5}>{admin.status}</Box> : null}
      {user.status === "Pending" ? <Box>{user.status}, resend invite</Box> : null}
    </Box>
  );
};
