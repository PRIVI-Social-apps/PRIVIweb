import React, { useRef, useState } from "react";
import axios from "axios";

import { RadioGroup, Radio, withStyles, FormControlLabel } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import Modal from "@material-ui/core/Modal";

import { useTypedSelector } from "store/reducers/Reducer";
import ImageTitleDescription from "shared/ui-kit/Page-components/ImageTitleDescription";
import SquareOptionsIconLabel from "shared/ui-kit/Page-components/SquareOptionsIconLabel";
import URL from "shared/functions/getURL";
import { signTransaction } from "shared/functions/signTransaction";
import AlertMessage from "shared/ui-kit/Alert/AlertMessage";
import { LoadingWrapper } from "shared/ui-kit/Hocs";
import { createBadgeModalStyles } from "./CreateBadgeModal.styles";
import { PrimaryButton } from "shared/ui-kit";
import InputWithLabelAndTooltip from "shared/ui-kit/InputWithLabelAndTooltip";

const infoIcon = require("assets/icons/info.svg");
const multiplesBadgesSelectedIcon = require("assets/icons/multiples_badges_selected_icon.png");
const multiplesBadgesIcon = require("assets/icons/multiples_badges_icon.png");
const badgeIcon = require("assets/icons/badge_icon.png");
const badgeSelectedIcon = require("assets/icons/badge_selected_icon.png");

const classficationToTyepMap = {
  Rare: "rare",
  "Super Rare": "super_rare",
  Newbie: "newbie",
};

const BlackRadio = withStyles({
  root: {
    color: "#000000",
    "&$checked": {
      color: "#000000",
    },
  },
  checked: {},
})(props => <Radio color="default" {...props} />);

const CreateBadgeModal = (props: any) => {
  const user = useTypedSelector(state => state.user);
  const classes = createBadgeModalStyles();

  const inputRef: any = useRef([]);

  const [badge, setBadge] = useState<any>({
    totalSupply: 1,
  });
  const [selectedFormat, setSelectedFormat] = useState<any>(0);
  const [singleToken, setSingleToken] = useState<boolean>(true);

  const [photo, setPhoto] = useState<any>(null);
  const [photoImg, setPhotoImg] = useState<any>(null);

  const badgesClasses = ["Rare", "Super Rare", "Newbie"];
  const [selectedClass, setSelectedClass] = useState<number>(0);

  const [status, setStatus] = useState<any>("");
  const [creationProgress, setCreationProgress] = useState(false);

  const createBadge = async () => {
    badge.creator = user.id;
    badge.class = badgesClasses[selectedClass];

    if (badge.creator === undefined || badge.creator.length === 0) {
      setStatus({
        msg: "User data not available. Please reload the page",
        key: Math.random(),
        variant: "error",
      });
    } else {
      if (
        badge &&
        badge.class &&
        badge.name &&
        badge.description &&
        badge.totalSupply &&
        badge.symbol &&
        badge.royalty
      ) {
        const body: any = {
          Creator: user.id,
          Name: badge.name,
          Symbol: badge.symbol,
          Type: classficationToTyepMap[badge.class],
          TotalSupply: Number(badge.totalSupply),
          Royalty: Number(badge.royalty) / 100,
          LockUpDate: 0,
        };
        const [hash, signature] = await signTransaction(user.mnemonic, body);
        body.Hash = hash;
        body.Signature = signature;
        body.Description = badge.description;
        body.dimensions = badge.dimensions ?? undefined;

        setCreationProgress(true);
        axios
          .post(`${URL()}/user/badges/create`, body)
          .then(async res => {
            const resp = res.data;
            if (resp.success) {
              if (photoImg && photo) await uploadImage(badge.symbol);
              setStatus({
                msg: "Badge Created!",
                key: Math.random(),
                variant: "success",
              });
              setTimeout(() => {
                props.onCloseModal();
                setCreationProgress(false);
                props.handleRefresh();
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
        .post(`${URL()}/user/badges/changeBadgePhoto`, formData, config)
        .then(response => {
          resolve(true);
        })
        .catch(error => {
          console.log(error);

          resolve(true);
          // alert("Error uploading photo");
        });
      //upload token symbol image
      axios
        .post(`${URL()}/wallet/changeTokenPhoto`, formData, config)
        .then(response => {
          let body = { dimensions: badge.dimensions, id: id };
          axios.post(`${URL()}/wallet/updateTokenPhotoDimensions`, body).catch(error => {
            console.log(error);

            alert("Error uploading photo");
          });

          resolve(true);
        })
        .catch(error => {
          console.log(error);
          resolve(true);
          // alert("Error uploading token photo");
        });
    });
  };

  const onBadgeClassificationChange = (e: any) => {
    setSelectedClass(e.target.value);
  };

  return (
    <Modal open={props.open} onClose={props.onCloseModal} className={classes.root}>
      <div className={classes.badgeModalContent}>
        <div className={classes.closeButton} onClick={props.onCloseModal}>
          <img src={require("assets/icons/x_darkblue.png")} alt={"x"} />
        </div>

        <div className={classes.modalTitle}>Create new badge</div>
        <Grid container spacing={4} direction="row" alignItems="flex-start" justify="flex-start">
          <Grid item xs={12} md={12}>
            <ImageTitleDescription
              photoImg={photoImg}
              photoTitle="Badge Image"
              mainElement={badge}
              mainSetter={setBadge}
              setterPhoto={setPhoto}
              setterPhotoImg={setPhotoImg}
              titleTitle="Badge name"
              title={badge.name}
              setterTitle={title => {
                let badgeCopy = { ...badge };
                badgeCopy.name = title;
                setBadge(badgeCopy);
              }}
              titlePlaceholder="Enter badge name…"
              descTitle="Badge description"
              desc={badge.description}
              setterDesc={desc => {
                let badgeCopy = { ...badge };
                badgeCopy.description = desc;
                setBadge(badgeCopy);
              }}
              descPlaceholder="Enter your collection description here"
              imageSize={6}
              infoSize={8}
              canEdit={true}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <div className={classes.inputHeaderSection}>
              <div className={classes.infoHeaderTitle}>Copies number</div>
              <img className={classes.infoHeaderImg} src={infoIcon} alt={"info"} />
            </div>
            <InputWithLabelAndTooltip
              overriedClasses={classes.infoInputSection}
              reference={el => (inputRef.current[0] = el)}
              type="number"
              disabled={singleToken}
              inputValue={badge.totalSupply || ""}
              onInputValueChange={elem => {
                let copyBadge = { ...badge };
                copyBadge.totalSupply = elem.target.value;
                setBadge(copyBadge);
              }}
              placeHolder="Copies number"
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <div className={classes.inputHeaderSection}>
              <div className={classes.infoHeaderTitle}>Badge symbol</div>
              <img className={classes.infoHeaderImg} src={infoIcon} alt={"info"} />
            </div>
            <InputWithLabelAndTooltip
              overriedClasses={classes.infoInputSection}
              reference={el => (inputRef.current[1] = el)}
              type="text"
              inputValue={badge.symbol || ""}
              onInputValueChange={elem => {
                let copyBadge = { ...badge };
                copyBadge.symbol = elem.target.value;
                setBadge(copyBadge);
              }}
              placeHolder="Token ID..."
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <div className={classes.inputHeaderSection}>
              <div className={classes.infoHeaderTitle}>Royalty (%)</div>
              <img className={classes.infoHeaderImg} src={infoIcon} alt={"info"} />
            </div>
            <InputWithLabelAndTooltip
              overriedClasses={classes.infoInputSection}
              reference={el => (inputRef.current[2] = el)}
              type="number"
              inputValue={badge.royalty || ""}
              onInputValueChange={elem => {
                let copyBadge = { ...badge };
                copyBadge.royalty = elem.target.value;
                setBadge(copyBadge);
              }}
              placeHolder="Royalty..."
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <div className={classes.inputHeaderSection}>
              <div className={classes.infoHeaderTitle}>Badge classification</div>
              <img className={classes.infoHeaderImg} src={infoIcon} alt={"info"} />
            </div>
            <div className="row">
              <RadioGroup
                aria-label="badge"
                name="badge"
                value={selectedClass}
                onChange={onBadgeClassificationChange}
              >
                {badgesClasses.map((c, index) => {
                  return <FormControlLabel key={index} value={c} control={<BlackRadio />} label={c} />;
                })}
              </RadioGroup>
            </div>
          </Grid>
          <Grid item xs={12} md={4}>
            <div className={classes.inputHeaderSectionForBadgeType}>
              <div className={classes.infoHeaderTitle}>Badge type</div>
              <img className={classes.infoHeaderImg} src={infoIcon} alt={"info"} />
            </div>

            <div className={classes.inputHeaderSectionForBadgeType}>
              <div className={classes.badgeTypeRadio}>
                <Radio
                  checked={singleToken}
                  onChange={value => {
                    let copyBadge = { ...badge };
                    copyBadge.totalSupply = 1;
                    setBadge(copyBadge);
                    setSingleToken(true);
                    setSelectedFormat(value);
                  }}
                />
                <SquareOptionsIconLabel
                  index={0}
                  selected={selectedFormat}
                  imageIcon={badgeIcon}
                  imageSelectedIcon={badgeSelectedIcon}
                  widthIcon="35"
                  heightIcon="35"
                  label="Single"
                  setterFormat={value => {
                    let copyBadge = { ...badge };
                    copyBadge.totalSupply = 1;
                    setBadge(copyBadge);
                    setSingleToken(true);
                    setSelectedFormat(value);
                  }}
                />
              </div>
              <div className={classes.badgeTypeRadio}>
                <Radio
                  checked={!singleToken}
                  onChange={value => {
                    setSelectedFormat(value);
                    setSingleToken(false);
                  }}
                />
                <SquareOptionsIconLabel
                  index={1}
                  selected={selectedFormat}
                  imageIcon={multiplesBadgesIcon}
                  imageSelectedIcon={multiplesBadgesSelectedIcon}
                  widthIcon="115"
                  heightIcon="35"
                  label="Multiple"
                  setterFormat={value => {
                    setSelectedFormat(value);
                    setSingleToken(false);
                  }}
                />
              </div>
            </div>
          </Grid>
        </Grid>
        <div>
          <div className={classes.modalFooterSection}>
            <LoadingWrapper loading={creationProgress}>
              <PrimaryButton size="medium" onClick={createBadge}>
                Create
              </PrimaryButton>
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
      </div>
    </Modal>
  );
};

export default CreateBadgeModal;
