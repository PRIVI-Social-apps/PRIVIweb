import React, { useRef, useState } from "react";
import axios from "axios";

import { RadioGroup, Radio, withStyles, FormControlLabel } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";

import { useTypedSelector } from "store/reducers/Reducer";
import ImageTitleDescription from "shared/ui-kit/Page-components/ImageTitleDescription";
import SquareOptionsIconLabel from "shared/ui-kit/Page-components/SquareOptionsIconLabel";
import URL from "shared/functions/getURL";
import { signTransaction } from "shared/functions/signTransaction";
import AlertMessage from "shared/ui-kit/Alert/AlertMessage";
import { LoadingWrapper } from "shared/ui-kit/Hocs";
import { createBadgeModalStyles } from "./index.styles";
import { Modal } from "shared/ui-kit";
import InputWithLabelAndTooltip from "shared/ui-kit/InputWithLabelAndTooltip";
import { SocialPrimaryButton } from "components/PriviSocial/index.styles";
import Box from "shared/ui-kit/Box";

const infoIcon = require("assets/icons/info.svg");

const classficationToTyepMap = {
  Rare: "rare",
  "Super Rare": "super_rare",
  Newbie: "newbie",
};

const CreateBadgeModal = ({ open, onCloseModal, handleRefresh }) => {
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
                onCloseModal();
                setCreationProgress(false);
                handleRefresh();
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
    <Modal size="medium" showCloseIcon isOpen={open} onClose={onCloseModal} className={classes.root}>
      <div className={classes.modalTitle}>Create new badge</div>
      <Grid container spacing={4} direction="row" alignItems="flex-start" justify="flex-start">
        <Grid item xs={12} md={12}>
          <ImageTitleDescription
            theme="green"
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
          <InputWithLabelAndTooltip
            theme="light"
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
            tooltip="Number of copies to sell"
            labelName="Copies number"
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <InputWithLabelAndTooltip
            theme="light"
            reference={el => (inputRef.current[1] = el)}
            type="text"
            inputValue={badge.symbol || ""}
            onInputValueChange={elem => {
              let copyBadge = { ...badge };
              copyBadge.symbol = elem.target.value;
              setBadge(copyBadge);
            }}
            placeHolder="Badge ID..."
            tooltip="An identifier to your badge"
            labelName="Badge Symbol"
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <InputWithLabelAndTooltip
            theme="light"
            reference={el => (inputRef.current[2] = el)}
            type="number"
            inputValue={badge.royalty || ""}
            onInputValueChange={elem => {
              let copyBadge = { ...badge };
              copyBadge.royalty = elem.target.value;
              setBadge(copyBadge);
            }}
            placeHolder="Royalty..."
            labelName={"Royalty (%)"}
            tooltip="Royalty percentage"
            minValue="0"
            maxValue="100"
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <Box display="flex" mb="7px">
            Badge classification
            <img className={classes.infoHeaderImg} src={infoIcon} alt={"info"} />
          </Box>
          <div className="row">
            <RadioGroup
              aria-label="badge"
              name="badge"
              value={selectedClass}
              onChange={onBadgeClassificationChange}
            >
              {badgesClasses.map((c, index) => {
                return (
                  <FormControlLabel
                    key={index}
                    value={c}
                    className={classes.radioContent}
                    control={<Radio className={classes.radio} />}
                    label={c}
                  />
                );
              })}
            </RadioGroup>
          </div>
        </Grid>
        <Grid item xs={12} md={4}>
          <Box display="flex" mb="7px">
            Badge type
            <img className={classes.infoHeaderImg} src={infoIcon} alt={"info"} />
          </Box>

          <Box display="flex" alignItems="center">
            <Radio
              checked={singleToken}
              onChange={value => {
                let copyBadge = { ...badge };
                copyBadge.totalSupply = 1;
                setBadge(copyBadge);
                setSingleToken(true);
                setSelectedFormat(value);
              }}
              className={classes.radio}
            />
            <SquareOptionsIconLabel
              index={0}
              selected={0}
              theme="green"
              label="Single"
              setterFormat={value => {
                let copyBadge = { ...badge };
                copyBadge.totalSupply = 1;
                setBadge(copyBadge);
                setSingleToken(true);
                setSelectedFormat(value);
              }}
            />
          </Box>
          <Box display="flex" alignItems="center">
            <Radio
              checked={!singleToken}
              onChange={value => {
                setSelectedFormat(value);
                setSingleToken(false);
              }}
              className={classes.radio}
            />
            <SquareOptionsIconLabel
              index={1}
              selected={1}
              theme="green"
              label="Multiple"
              setterFormat={value => {
                setSelectedFormat(value);
                setSingleToken(false);
              }}
            />
          </Box>
        </Grid>
      </Grid>

      <Box display="flex" justifyContent="flex-end">
        <LoadingWrapper theme="green" loading={creationProgress}>
          <SocialPrimaryButton onClick={createBadge}>Create</SocialPrimaryButton>
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
    </Modal>
  );
};

export default CreateBadgeModal;
