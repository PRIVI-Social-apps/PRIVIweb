import React, { useState } from "react";
import { Tooltip, Fade } from "@material-ui/core";
import Axios from "axios";
import DateFnsUtils from "@date-io/date-fns";
import axios from "axios";

import { Hidden } from '@material-ui/core';
import { MuiPickersUtilsProvider, KeyboardDatePicker } from "@material-ui/pickers";

import CustomImageUploadAdapter from "shared/services/CustomImageUploadAdapter";
import QuillEditor from "shared/ui-kit/QuillEditor";
import AlertMessage from "shared/ui-kit/Alert/AlertMessage";
import { Modal, PrimaryButton, SecondaryButton } from "shared/ui-kit";
import Box from "shared/ui-kit/Box";
import InputWithLabelAndTooltip from "shared/ui-kit/InputWithLabelAndTooltip";
import URL from "shared/functions/getURL";
import { ReactComponent as InfoIcon } from "assets/icons/info.svg";
import { TokenSelect } from "shared/ui-kit/Select/TokenSelect";
import { useTypedSelector } from "store/reducers/Reducer";
import { getUser } from "store/selectors";
import { newProposalModalStyles } from "./index.styles";

const CreateNewProposalModal = (props: any) => {
  const classes = newProposalModalStyles();

  const user = useTypedSelector(getUser);
  const [status, setStatus] = useState<any>("");

  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [totalVotes, setTotalVotes] = useState<number>(1);
  const [quorum, setQuorum] = useState<number>(1);
  const [hashTag, setHashTag] = useState<string>("");
  const [tags, setTags] = useState<string[]>([]);

  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date>(new Date());

  const [editorState, setEditorState] = useState("");
  const [editorPageAble, setEditorPageable] = useState<any>(null);

  const [tokens, setTokens] = useState<string[]>([]);
  const [votesTokenSelector, setVotesTokenSelector] = useState<string>("");

  // get token list from backend
  React.useEffect(() => {
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
      }
    });
  }, []);

  const onChange = editorState => {
    //console.log(editorState);
    setEditorState(editorState);
  };

  const addHashTag = () => {
    setTags(prev => {
      setHashTag("");
      return [...prev, hashTag];
    });
  };

  const validateVotesInfo = async () => {
    if (title.length <= 5) {
      setStatus({
        msg: "Title field invalid. Minimum 5 characters required.",
        key: Math.random(),
        variant: "error",
      });
      return false;
    } else if (description.length <= 5) {
      setStatus({
        msg: "Description field invalid. Minimum 5 characters required.",
        key: Math.random(),
        variant: "error",
      });
      return false;
    } else if (tags.length === 0) {
      setStatus({
        msg: "Mimimum 1 tag is required.",
        key: Math.random(),
        variant: "error",
      });
      return false;
    } else if (!totalVotes) {
      setStatus({
        msg: "totalVotes is required.",
        key: Math.random(),
        variant: "error",
      });
      return false;
    } else if (!votesTokenSelector) {
      setStatus({
        msg: "Token is required.",
        key: Math.random(),
        variant: "error",
      });
      return false;
    } else if (!quorum) {
      setStatus({
        msg: "Quorum is required.",
        key: Math.random(),
        variant: "error",
      });
      return false;
    } else if (endDate.getTime() - startDate.getTime() < 0) {
      setStatus({
        msg: "Please check end date.",
        key: Math.random(),
        variant: "error",
      });
      return false;
    }
    return true;
  };

  const createNewProposal = async () => {
    if (validateVotesInfo()) {
      const body = {
        title: title,
        shortPreviewText: description,
        hashtags: tags,
        fullText: editorState,
        TotalVotes: totalVotes,
        VotingToken: votesTokenSelector,
        QuorumRequired: quorum,
        startDate: startDate.getTime(),
        endDate: endDate.getTime(),
        creatorAddress: user.id,
        hash: "",
        signature: "",
      };
      await Axios.post(`${URL()}/musicDao/governance/proposals/addNew`, body)
        .then(res => {
          if (res.data.success) {
            if (props.postCreated)
              props.postCreated({ ...body, votes: [], created: new Date().getTime(), numbVotes: 0 });
            props.handleClose();
          }
        })
        .catch(error => {
          setStatus({
            msg: "Failed to create new discussion.",
            key: Math.random(),
            variant: "error",
          });
        });
    }
  };

  const handleCkEditrImage = loader => {
    return new CustomImageUploadAdapter(loader);
  };

  const getHashTags = () => {
    return (
      <React.Fragment>
        {tags.map((item, index) => (
          <Box className={classes.tagBox} key={index} mr={1}>
            <Box>{item}</Box>
          </Box>
        ))}
      </React.Fragment>
    );
  };

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter") {
      addHashTag();
    }
  }

  const handleChangeVotesTokenSelector = event => {
    const value = event.target.value;
    setVotesTokenSelector(value);
  };

  return (
    <Modal size="medium" isOpen={props.open} onClose={props.handleClose} showCloseIcon>
      <Box className={classes.contentBox}>
        <Box className={classes.flexBox} justifyContent="center">
          <Box className={classes.title}>New Proposal</Box>
        </Box>
        <Box mt={2}>
          <Box className={classes.flexBox} justifyContent="space-between">
            <Box className={classes.header1}>Title</Box>
            <Tooltip TransitionComponent={Fade} TransitionProps={{ timeout: 600 }} arrow title={""}>
              <InfoIcon style={{ color: "grey", width: "14px" }} />
            </Tooltip>
          </Box>
          <InputWithLabelAndTooltip
            placeHolder="Discussion title"
            type="text"
            inputValue={title}
            onInputValueChange={e => setTitle(e.target.value)}
          />
        </Box>
        <Box mt={1}>
          <Box className={classes.flexBox} justifyContent="space-between">
            <Box className={classes.header1}>Short preview text</Box>
            <Tooltip TransitionComponent={Fade} TransitionProps={{ timeout: 600 }} arrow title={""}>
              <InfoIcon style={{ color: "grey", width: "14px" }} />
            </Tooltip>
          </Box>
          <InputWithLabelAndTooltip
            placeHolder="Write short preview text..."
            type="textarea"
            inputValue={description}
            onInputValueChange={e => setDescription(e.target.value)}
          />
        </Box>
        <Box mt={1}>
          <Box className={classes.flexBox} justifyContent="space-between">
            <Box className={classes.header1}>Hashtags</Box>
            <Tooltip TransitionComponent={Fade} TransitionProps={{ timeout: 600 }} arrow title={""}>
              <InfoIcon style={{ color: "grey", width: "14px" }} />
            </Tooltip>
          </Box>
          <Box className={classes.hashTagBox} mt={1}>
            <Box className={classes.flexBox}>{getHashTags()}</Box>
            <InputWithLabelAndTooltip
              placeHolder="New tag..."
              type="text"
              inputValue={hashTag}
              onInputValueChange={e => setHashTag(e.target.value)}
              onKeyDown={handleKeyDown}
            />
          </Box>
        </Box>
        <Box width={1} mt={3}>
          <Box className={classes.flexBox} justifyContent="space-between">
            <Box className={classes.header1}>Full Text</Box>
            <Tooltip TransitionComponent={Fade} TransitionProps={{ timeout: 600 }} arrow title={""}>
              <InfoIcon style={{ color: "grey", width: "14px" }} />
            </Tooltip>
          </Box>
          <Box width={1} mt={1} style={{ background: "rgba(238, 242, 247, 0.5)" }}>
            <QuillEditor editorState={editorState} onChange={onChange} />
          </Box>
        </Box>
        <Box
          py={3}
          width={1}
          mt={3}
          style={{ borderTop: "1px solid #35385622", borderBottom: "1px solid #35385622" }}
        >
          <Box className={classes.flexBox} alignItems="flex-end !important">
            <Box width={1}>
              <Box className={classes.flexBox} justifyContent="space-between">
                <Box className={classes.header1}>Total votes</Box>
                <Tooltip TransitionComponent={Fade} TransitionProps={{ timeout: 600 }} arrow title={""}>
                  <InfoIcon style={{ color: "grey", width: "14px" }} />
                </Tooltip>
              </Box>
              <InputWithLabelAndTooltip
                placeHolder="400"
                type="number"
                inputValue={totalVotes}
                onInputValueChange={e => setTotalVotes(e.target.value)}
                style={{ marginBottom: 0 }}
              />
            </Box>
            <Box minWidth="240px" ml={2}>
              {tokens.length > 0 && (
                <TokenSelect
                  value={votesTokenSelector}
                  onChange={handleChangeVotesTokenSelector}
                  tokens={tokens}
                />
              )}
            </Box>
          </Box>
          <Box mt={2} width={1}>
            <Box className={classes.flexBox} justifyContent="space-between">
              <Box className={classes.header1}>Quorum required</Box>
              <Tooltip TransitionComponent={Fade} TransitionProps={{ timeout: 600 }} arrow title={""}>
                <InfoIcon style={{ color: "grey", width: "14px" }} />
              </Tooltip>
            </Box>
            <InputWithLabelAndTooltip
              placeHolder="400"
              type="number"
              inputValue={quorum}
              onInputValueChange={e => setQuorum(e.target.value)}
            />
          </Box>
        </Box>
        <Box className={classes.flexBox} mt={3}>
          <Box width={1} ml={1}>
            <Box className={classes.header1}>Start Date</Box>
            <Box width={1} className={classes.controlBox} mt={1}>
              <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <KeyboardDatePicker
                  disableToolbar
                  variant="inline"
                  format="MM/dd/yyyy"
                  margin="dense"
                  id="date-picker-inline"
                  value={startDate}
                  onChange={(date, _) => date && setStartDate(new Date(date.getTime()))}
                  KeyboardButtonProps={{
                    "aria-label": "change date",
                  }}
                  size="small"
                  className={classes.datepicker}
                />
              </MuiPickersUtilsProvider>
            </Box>
          </Box>
          <Hidden only='xs'>
            <Box width={1} ml={1}>
              <Box className={classes.header1}>End Date</Box>
              <Box width={1} className={classes.controlBox} mt={1}>
                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                  <KeyboardDatePicker
                    disableToolbar
                    variant="inline"
                    format="MM/dd/yyyy"
                    margin="dense"
                    id="date-picker-inline"
                    value={endDate}
                    onChange={(date, _) => date && setEndDate(new Date(date.getTime()))}
                    KeyboardButtonProps={{
                      "aria-label": "change date",
                    }}
                    size="small"
                    className={classes.datepicker}
                  />
                </MuiPickersUtilsProvider>
              </Box>
            </Box>
          </Hidden>
        </Box>
        <Hidden smUp>
          <Box className={classes.flexBox} mt={3}>
            <Box width={1} ml={1}>
              <Box className={classes.header1}>Start Date</Box>
              <Box width={1} className={classes.controlBox} mt={1}>
                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                  <KeyboardDatePicker
                    disableToolbar
                    variant="inline"
                    format="MM/dd/yyyy"
                    margin="dense"
                    id="date-picker-inline"
                    value={startDate}
                    onChange={(date, _) => date && setStartDate(new Date(date.getTime()))}
                    KeyboardButtonProps={{
                      "aria-label": "change date",
                    }}
                    size="small"
                    className={classes.datepicker}
                  />
                </MuiPickersUtilsProvider>
              </Box>
            </Box>
          </Box>
        </Hidden>
        <Box width={1} display="flex" justifyContent="center" mt={4}>
          <Hidden smUp>
            <SecondaryButton
              size="medium"
              onClick={props.handleClose}
              isRounded
              style={{ paddingLeft: "48px", paddingRight: "48px", width: "100%" }}
            >
              Cancel
            </SecondaryButton>
          </Hidden>
          <Hidden only='xs'>
            <SecondaryButton
              size="medium"
              onClick={props.handleClose}
              isRounded
              style={{ paddingLeft: "48px", paddingRight: "48px" }}
            >
              Cancel
            </SecondaryButton>
            <PrimaryButton
              size="medium"
              onClick={createNewProposal}
              isRounded
              style={{ paddingLeft: "48px", paddingRight: "48px", marginLeft: "24px" }}
            >
              Create Now
            </PrimaryButton>
          </Hidden>
        </Box>
        <Hidden smUp>
          <Box width={1} display="flex" justifyContent="center" mt={4}>
            <PrimaryButton
              size="medium"
              onClick={createNewProposal}
              isRounded
              style={{ paddingLeft: "48px", paddingRight: "48px", width: "100%" }}
            >
              Create Now
            </PrimaryButton>
          </Box>
        </Hidden>
      </Box>
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

export default CreateNewProposalModal;
