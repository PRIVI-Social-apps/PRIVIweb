import React, { useRef, useState } from "react";
import axios from "axios";

import { Divider } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import { useTypedSelector } from "store/reducers/Reducer";
import URL from "shared/functions/getURL";
import ImageTitleDescription from "shared/ui-kit/Page-components/ImageTitleDescription";
import SquareOptionsIconLabel from "shared/ui-kit/Page-components/SquareOptionsIconLabel";
import { signTransaction } from "shared/functions/signTransaction";
import AlertMessage from "shared/ui-kit/Alert/AlertMessage";
import { LoadingWrapper } from "shared/ui-kit/Hocs";

import "./Create-badge.css";
import "../Communities-modals.css";
import InputWithLabelAndTooltip from "shared/ui-kit/InputWithLabelAndTooltip";

const infoIcon = require("assets/icons/info_icon.png");
const multiplesBadgesSelectedIcon = require("assets/icons/multiples_badges_selected_icon.png");
const multiplesBadgesIcon = require("assets/icons/multiples_badges_icon.png");
const badgeIcon = require("assets/icons/badge_icon.png");
const badgeSelectedIcon = require("assets/icons/badge_selected_icon.png");

const classficationToTyepMap = {
  Rare: "rare",
  "Super Rare": "super_rare",
  Newbie: "newbie",
};

const CreateBadge = (props: any) => {
  const user = useTypedSelector(state => state.user);
  const inputRef: any = useRef([]);

  const [badge, setBadge] = useState<any>({
    totalSupply: 1,
  });
  const [selectedFormat, setSelectedFormat] = useState<any>(0);
  const [singleToken, setSingleToken] = useState<boolean>(true);

  const [photo, setPhoto] = useState<any>(null);
  const [photoImg, setPhotoImg] = useState<any>(null);

  const [status, setStatus] = useState<any>();
  const [creationProgress, setCreationProgress] = useState(false);

  const badgesClasses = ["Rare", "Super Rare", "Newbie"];
  const [selectedClass, setSelectedClass] = useState<number>(-1);

  const createBadge = async () => {
    badge.creator = props.community.CommunityAddress;
    badge.class = badgesClasses[selectedClass];

    if (badge.creator === undefined || badge.creator.length === 0) {
      setStatus({
        msg: "Community data not available. Please reload the page",
        key: Math.random(),
        variant: "error",
      });
    } else {
      if (
        badge &&
        badge.name &&
        badge.class &&
        badge.description &&
        badge.totalSupply &&
        badge.symbol &&
        badge.royalty
      ) {
        const body: any = {
          Creator: props.community.CommunityAddress,
          Name: badge.name,
          Symbol: badge.symbol,
          Type: classficationToTyepMap[badge.class],
          TotalSupply: Number(badge.totalSupply),
          Royalty: Number(badge.royalty) / 100,
          LockUpDate: 0,
          dimensions: badge.dimensions ?? undefined,
        };
        const [hash, signature] = await signTransaction(user.mnemonic, body);
        body.Hash = hash;
        body.Signature = signature;
        body.Description = badge.description;

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
                props.handleRefresh();
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
        setCreationProgress(false);
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
        .post(`${URL()}/community/badges/changeBadgePhoto`, formData, config)
        .then(response => {
          resolve(true);
        })
        .catch(error => {
          console.log(error);

          resolve(true);
          alert("Error uploading photo");
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
          alert("Error uploading token photo");
        });
    });
  };

  return (
    <div className="modalCreateBadge modal-content">
      <div className="exit" onClick={props.onCloseModal}>
        <img src={require("assets/icons/x_darkblue.png")} alt={"x"} />
      </div>
      <div className="partCreateBadge">
        <div className="titleCommunitiesModal">Create new Badge</div>
        <div
          className="subTitleCommunitiesModal"
          style={{
            marginBottom: "29px",
          }}
        >
          General info
        </div>
        <ImageTitleDescription
          photoImg={photoImg}
          photoTitle="Badge Image"
          setterPhoto={setPhoto}
          mainSetter={setBadge}
          mainElement={badge}
          setterPhotoImg={setPhotoImg}
          titleTitle="Badge name"
          title={badge.name}
          setterTitle={title => {
            let badgeCopy = { ...badge };
            badgeCopy.name = title;
            setBadge(badgeCopy);
          }}
          titlePlaceholder="Enter Badge name…"
          descTitle="Badge description"
          desc={badge.description}
          setterDesc={desc => {
            let badgeCopy = { ...badge };
            badgeCopy.description = desc;
            setBadge(badgeCopy);
          }}
          descPlaceholder="Enter Badge description…"
          imageSize={4}
          infoSize={8}
          canEdit={true}
        />

        <div
          className="flexRowInputsCommunitiesModal"
          style={{
            marginTop: "19px",
            marginBottom: "11px",
          }}
        >
          <div className="infoHeaderCommunitiesModal">Badge type</div>
          <img className="infoIconCommunitiesModal" src={infoIcon} alt={"info"} />
        </div>
        <div
          className="flexRowInputsCommunitiesModal"
          style={{
            marginBottom: "22px",
          }}
        >
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
      <Divider />
      <div className="partCreateBadge">
        <div
          className="subTitleCommunitiesModal"
          style={{
            marginTop: "0",
            marginBottom: "30px",
          }}
        >
          Community Token
        </div>
        <Grid container spacing={2} direction="row" alignItems="flex-start" justify="flex-start">
          <Grid item xs={7} md={4}>
            <InputWithLabelAndTooltip
              labelName={`Number of copies`}
              tooltip={""}
              type={"number"}
              disabled={singleToken}
              inputValue={badge.totalSupply || ""}
              onInputValueChange={e => {
                let copyBadge = { ...badge };
                copyBadge.totalSupply = e.target.value;
                setBadge(copyBadge);
              }}
              style={{
                width: "calc(" + 100 + "% - 24px)",
              }}
              placeHolder={"Number Copies"}
            />
          </Grid>
          <Grid item xs={5} md={3}>
            <InputWithLabelAndTooltip
              labelName={`Token ID`}
              tooltip={""}
              type={"text"}
              inputValue={badge.symbol || ""}
              onInputValueChange={e => {
                let copyBadge = { ...badge };
                copyBadge.symbol = e.target.value;
                setBadge(copyBadge);
              }}
              style={{
                width: "calc(" + 100 + "% - 24px)",
              }}
              placeHolder={"Token ID"}
            />
          </Grid>
          <Grid item xs={12} md={5}>
            <InputWithLabelAndTooltip
              labelName={`Royalties`}
              tooltip={""}
              type={"number"}
              inputValue={badge.royalty || ""}
              onInputValueChange={e => {
                let copyBadge = { ...badge };
                copyBadge.royalty = e.target.value;
                setBadge(copyBadge);
              }}
              style={{
                width: "calc(" + 100 + "% - 24px)",
              }}
              placeHolder={"Royalty"}
            />
          </Grid>
        </Grid>
        <div className="flexRowInputsCommunitiesModal">
          <div className="infoHeaderCommunitiesModal">Badge classification</div>
          <img className="infoIconCommunitiesModal" src={infoIcon} alt={"info"} />
        </div>
        <div className="row">
          {badgesClasses.map((c, index) => {
            return (
              <div
                key={c}
                className={
                  selectedClass === index
                    ? "badge-class selected cursor-pointer"
                    : "badge-class cursor-pointer"
                }
                onClick={() => {
                  setSelectedClass(index);
                  let badgeCopy = { ...badge };
                  badgeCopy.class = c;
                  setBadge(badgeCopy);
                }}
              >
                {c}
              </div>
            );
          })}
        </div>
        <div
          className="flexCenterCenterRowInputsCommunitiesModal"
          style={{
            marginTop: "50px",
            marginBottom: "50px",
          }}
        >
          <LoadingWrapper loading={creationProgress}>
            <button onClick={createBadge}>Create Badge</button>
          </LoadingWrapper>
        </div>
        {status && <AlertMessage key={status.key} message={status.msg} variant={status.variant} />}
      </div>
    </div>
  );
};

export default CreateBadge;
