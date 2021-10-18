import React, { useState, useRef } from "react";
import { Modal } from "@material-ui/core";
import AlertMessage from "shared/ui-kit/Alert/AlertMessage";
import "shared/ui-kit/Modal/Modals/Modal.css";
import "./CreateTokenModal.css";
import Grid from "@material-ui/core/Grid";
import Divider from "@material-ui/core/Divider";
import FormControl from "@material-ui/core/FormControl";
import {
  StyledSelect,
  StyledMenuItem,
} from "shared/ui-kit/Styled-components/StyledComponents";

import SvgIcon from "@material-ui/core/SvgIcon";
import { ReactComponent as CloseSolid } from "assets/icons/close-solid.svg";
import InputWithLabelAndTooltip from "shared/ui-kit/InputWithLabelAndTooltip";
const imageIcon = require("assets/icons/image_icon.png");
const infoIcon = require("assets/icons/info_icon.png");
const plusWhiteIcon = require("assets/icons/plus_white.png");

export default function CreateTokenModal(props) {
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [status, setStatus] = React.useState<any>("");

  const [disableSubmit, setDisableSubmit] = useState<boolean>(false);

  const inputRef: any = useRef([]);
  const [fund, setFund] = useState<any>({
    Private: false,
    Name: "",
    DiscordID: "",
    Token: "",
    "Token ID": "",
    Interest: "",
  });

  //General Fund Info section
  const [photo, setImage] = useState<any>(null);
  const [photoImg, setImageImg] = useState<any>(null);
  const [openToInvest, setOpenToInvest] = useState<any>(true);
  const handleOpenToInvest = (type: boolean) => {
    setOpenToInvest(type);
  };

  //Fund Token section
  const interestTypes = ["Fixed", "Type 2"];
  const [interestTypeSelector, setInterestTypeSelector] = useState<string>(
    interestTypes[0]
  );
  const handleChangeInterestTypeSelector = (event) => {
    const value = event.target.value;
    setInterestTypeSelector(value);
  };
  const interestRates = ["4%", "5%", "6%"];
  const [interestRateSelector, setInterestRateSelector] = useState<string>(
    interestRates[0]
  );
  const handleChangeInterestRateSelector = (event) => {
    const value = event.target.value;
    setInterestRateSelector(value);
  };

  //Fund management section
  const [token, setToken] = useState<any>({});
  const [tokens, setTokens] = useState<any[]>([]);

  const roles = ["Admin", "Moderator"];
  const [userRole, setUserRole] = useState<any>({ role: roles[0] });
  const [usersRoles, setUsersRoles] = useState<any[]>([]);

  const handleRoleChange = (event) => {
    let copyUserRole = { ...userRole };
    copyUserRole.role = event.target.value;
    setUserRole(copyUserRole);
  };

  //create token
  const handleCreate = () => {
    let values = {};
    let validatedErrors = validate(values);
    setErrors(validatedErrors);

    if (Object.keys(validatedErrors).length === 0) {
      setDisableSubmit(true);

      //TODO: Create
      setDisableSubmit(false);
    }
  };

  function validate(values: {
    [key: string]: string;
  }): { [key: string]: string } {
    var errors: { [key: string]: string } = {};

    return errors;
  }

  //image functions
  const onImageChange = (files: any) => {
    setImage(files[0]);
    const reader = new FileReader();
    reader.addEventListener("load", () => {
      setImageImg(reader.result);
    });
    reader.readAsDataURL(files[0]);
  };

  const dragOver = (e) => {
    e.preventDefault();
  };

  const dragEnter = (e) => {
    e.preventDefault();
  };

  const dragLeave = (e) => {
    e.preventDefault();
  };

  const fileDrop = (e) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files.length) {
      handleFiles(files);
    }
  };

  const handleFiles = (files: any) => {
    for (let i = 0; i < files.length; i++) {
      if (validateFile(files[i])) {
        onImageChange(files);
      } else {
        files[i]["invalid"] = true;
        // Alert invalid image
      }
    }
  };
  const validateFile = (file) => {
    const validTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/gif",
      "image/x-icon",
    ];
    if (validTypes.indexOf(file.type) === -1) {
      return false;
    }
    return true;
  };

  const removeImage = () => {
    setImage(null);
    setImageImg(null);
  };

  //add token functions
  const addToken = () => {
    if (token.name && token.name !== "") {
      //TODO: check required path
      let array = [...tokens];
      array.push({
        name: token.name,
        status: "Pending",
      });
      setTokens(array);
      setToken({});
    }
  };

  //add user role function
  const addUserRoles = () => {
    if (
      userRole.name &&
      userRole.name !== "" &&
      userRole.role &&
      userRole.role !== ""
    ) {
      let array = [...usersRoles];
      array.push({
        name: userRole.name,
        role: userRole.role,
        status: "Pending",
      });
      setUsersRoles(array);
      setUserRole({});
    }
  };

  function renderInputCreateModal(p) {
    return (
      <div key={`${p.index}-input-container`}>
        <InputWithLabelAndTooltip
          labelName={p.name}
          tooltip={''}
          style={{
            width: "calc(" + p.width + "px - 24px)",
          }}
          type={p.type}
          inputValue={fund[p.item]}
          onInputValueChange={(e) => {
            let fundCopy = { ...fund };
            fundCopy[p.item] = e.target.value;
            setFund(fundCopy);
          }}
          placeHolder={p.placeholder}
        />
      </div>
    );
  }

  //selector component
  const SelectorCreateModal = (props: any) => {
    return (
      <div>
        <FormControl className="selectorFormControlCreatePod">
          <StyledSelect
            disableUnderline
            value={props.selectValue}
            style={{ width: props.width }}
            className="selectCreatePod"
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

  //add button component
  const AddButtonCreateModal = (props: any) => {
    return (
      <div className="createHashtagButton" onClick={props.function}>
        <img
          className="createHashtagButtonIcon"
          src={plusWhiteIcon}
          alt={"plus"}
        />
      </div>
    );
  };

  //token label component
  const TokenLabel = (props) => {
    return (
      <div className="adminsMailLabel">
        <div className="adminsNameMailLabel tokenLabel">
          <div>
            <img
              src={require(`assets/tokenImages/${props.token.name}.png`)}
              alt={props.token.name}
            />
            <span>{props.token.name}</span>
          </div>
          <div>{props.token.value}</div>
          <button
            className="removePodButton"
            onClick={(e: any) => {
              //add collateral and update collaterals list
              e.preventDefault();
              let tokensCopy = [...tokens];
              tokensCopy.splice(props.index, 1);
              setTokens(tokensCopy);
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

  //user label
  const UserLabel = (props) => {
    return (
      <div className="adminsMailLabel">
        <div className="adminsNameMailLabel">
          <div className="mainHashtagLabel">{props.user.role}</div>
          <div>{props.user.name}</div>
          <button
            className="removePodButton"
            onClick={(e: any) => {
              e.preventDefault();
              let usersCopy = [...usersRoles];
              usersCopy.splice(props.index, 1);
              setUsersRoles(usersCopy);
            }}
          >
            <SvgIcon>
              <CloseSolid />
            </SvgIcon>
          </button>
        </div>
        {props.user.status === "Accepted" ? (
          <div className="adminsStatusLabel">{props.user.status}</div>
        ) : null}
        {props.user.status === "Pending" ? (
          <div className="adminsStatusLabel pendingStatusLabel">
            {props.user.status}, resend invite
          </div>
        ) : null}
      </div>
    );
  };

  return (
    <Modal
      open={props.open}
      onClose={props.handleClose}
      aria-labelledby="simple-modal-title"
      aria-describedby="simple-modal-description"
      className="modal modalCreateModal"
    >
      <div className="modal-content create-token-modal modalCreatePodFullDiv">
        <div className="exit" onClick={props.handleClose}>
          <img
            src={require("assets/icons/x_darkblue.png")}
            alt={"x"}
          />
        </div>
        <div className="title">
          <h2>Create new Fund</h2>
        </div>
        <div className="general-info">
          <h4>General Fund info</h4>
          <Grid
            container
            spacing={5}
            direction="row"
            alignItems="flex-start"
            justify="flex-start"
          >
            <Grid item xs={12} md={4}>
              {photoImg ? (
                <div className="imageCreatePodDiv">
                  <div
                    className="imageCreatePod"
                    style={{
                      backgroundImage: `url(${photoImg})`,
                      backgroundPosition: "center",
                      backgroundRepeat: "no-repeat",
                      backgroundSize: "cover",
                    }}
                  ></div>
                  <div
                    className="removeImageButton"
                    onClick={() => removeImage()}
                  >
                    <SvgIcon>
                      <CloseSolid />
                    </SvgIcon>
                  </div>
                </div>
              ) : (
                <div
                  className="dragImageHereCreatePod"
                  onDragOver={dragOver}
                  onDragEnter={dragEnter}
                  onDragLeave={dragLeave}
                  onDrop={fileDrop}
                >
                  <img
                    className="dragImageHereIcon"
                    src={imageIcon}
                    alt={"camera"}
                  />
                  <div className="dragImageHereLabel">Drag Image Here</div>
                </div>
              )}
            </Grid>
            <Grid item xs={12} md={5}>
              {renderInputCreateModal({
                name: "Fund name",
                placeholder: "Enter Fund name...",
                type: "text",
                item: "Name",
                index: 0,
              })}
              <InputWithLabelAndTooltip
                labelName="Fund description"
                tooltip={''}
                inputValue={fund.Description}
                onInputValueChange={(e) => {
                  let fundCopy = { ...fund };
                  fundCopy.Description = e.target.value;
                  setFund(fundCopy);
                }}
                placeHolder="Enter Fund description..."
              />
              <div className="marginTopFieldCreatePod">
                {renderInputCreateModal({
                  name: "Discord ID",
                  placeholder: "Enter Discord ID...",
                  type: "text",
                  item: "DiscordID",
                  index: 1,
                })}
              </div>
            </Grid>
            <Grid item xs={12} md={3}>
              <div className="flexRowInputs">
                <div className="infoHeaderCreatePod">Open to investing</div>
                <img
                  className="infoIconCreatePod"
                  src={infoIcon}
                  alt={"info"}
                />
              </div>
              <div className="option-buttons" id="openAdvOptions">
                <button
                  className={openToInvest === true ? "selected" : undefined}
                  id="openAdvTrueButtonCreatePod"
                  onClick={() => {
                    handleOpenToInvest(true);
                  }}
                ></button>
                <button
                  className={
                    openToInvest === false ? "selectedFalse" : undefined
                  }
                  id="openAdvFalseButtonCreatePod"
                  onClick={() => {
                    handleOpenToInvest(false);
                  }}
                ></button>
              </div>
            </Grid>
          </Grid>
        </div>
        <Divider className="dividerCreatePod" />
        <div className="fund-token">
          <h4>Fund Token</h4>
          <Grid
            container
            spacing={0}
            direction="row"
            alignItems="flex-start"
            justify="flex-start"
          >
            <Grid item xs={12} md={6}>
              <div className="flexRowInputs">
                {renderInputCreateModal({
                  name: "Pod Token name",
                  placeholder: "Enter Token...",
                  type: "text",
                  item: "Token",
                  width: 260,
                  index: 2,
                })}

                <div style={{ marginLeft: "10px" }}>
                  {renderInputCreateModal({
                    name: "Token ID",
                    placeholder: "Token ID...",
                    type: "text",
                    item: "Token ID",
                    width: 130,
                    index: 3,
                  })}
                </div>
              </div>
            </Grid>
            <Grid item xs={12} md={6}>
              {renderInputCreateModal({
                name: "Interest",
                placeholder: "Enter Interest value...",
                type: "number",
                item: "Interest",
                width: 400,
                index: 4,
              })}

              <div className="flexRowInputs">
                <div className="marginBottomInterestCreatePod">
                  <div className="flexRowInputs">
                    <div className="infoHeaderCreatePod">Interest type</div>
                    <img
                      className="infoIconCreatePod"
                      src={infoIcon}
                      alt={"info"}
                    />
                  </div>
                  <SelectorCreateModal
                    width={260}
                    selectValue={interestTypeSelector}
                    selectFunction={handleChangeInterestTypeSelector}
                    selectItems={interestTypes}
                  />
                </div>
                <div className="smallMarginLeftCreatePod marginBottomInterestCreatePod">
                  <div className="flexRowInputs">
                    <div className="infoHeaderCreatePod">Interest rate</div>
                    <img
                      className="infoIconCreatePod"
                      src={infoIcon}
                      alt={"info"}
                    />
                  </div>
                  <SelectorCreateModal
                    width={130}
                    selectValue={interestRateSelector}
                    selectFunction={handleChangeInterestRateSelector}
                    selectItems={interestRates}
                  />
                </div>
              </div>
            </Grid>
          </Grid>
        </div>
        <Divider className="dividerCreatePod" />
        <div className="fund-management">
          <h4>Fund management</h4>
          <div className="flexRowInputs">
            <div>
              <InputWithLabelAndTooltip
                labelName="Add tokens"
                tooltip={''}
                style={{
                  width: "calc(350px - 24px)",
                }}
                type="text"
                inputValue={token.name}
                onInputValueChange={(e) => {
                  let copyToken = { ...token };
                  copyToken.name = e.target.value;
                  setToken(copyToken);
                }}
                placeHolder="Add token"
              />
            </div>
            <div className="collateralSelector">
              <AddButtonCreateModal function={() => addToken()} />
            </div>
          </div>
          {tokens && tokens.length !== 0 ? (
            <div>
              {tokens.map((item, i) => {
                return <TokenLabel key={i} index={i} token={item} />;
              })}
            </div>
          ) : null}
          <Divider className="dividerCreatePod" />
          <div className="flexRowInputs">
            <div>
              <InputWithLabelAndTooltip
                labelName="User and roles"
                tooltip={''}
                style={{
                  width: "calc(350px - 24px)",
                }}
                type="text"
                inputValue={userRole.name}
                onInputValueChange={(e) => {
                  let copyUserRole = { ...userRole };
                  copyUserRole.name = e.target.value;
                  setUserRole(copyUserRole);
                }}
                placeHolder="Add user by email"
              />
            </div>
            <div className="collateralSelector">
              <SelectorCreateModal
                width={120}
                selectValue={""}
                selectFunction={handleRoleChange}
                selectItems={roles}
              />
            </div>
            <div className="collateralSelector">
              <AddButtonCreateModal function={() => addUserRoles()} />
            </div>
          </div>
          {usersRoles && usersRoles.length !== 0 ? (
            <div>
              {usersRoles.map((item, i) => {
                return <UserLabel key={i} index={i} user={item} />;
              })}
            </div>
          ) : null}
        </div>
        <button onClick={handleCreate} disabled={disableSubmit}>
          Create Fund
        </button>
        {status ? (
          <AlertMessage
            key={status.key}
            message={status.msg}
            variant={status.variant}
          />
        ) : (
          ""
        )}
      </div>
    </Modal>
  );
}
