import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";

import { Tooltip, Fade } from "@material-ui/core";

import { profileEditModalStyles } from "./index.styles";
import { setUpdateBasicInfo } from "store/actions/UpdateBasicInfo";
import { editUser } from "store/actions/User";
import { RootState } from "store/reducers/Reducer";
import URL from "shared/functions/getURL";
import { DateInput } from "shared/ui-kit/DateTimeInput";
import { AutocompleteSingleSelect } from "shared/ui-kit/Autocomplete/SingleSelect/AutocompleteSingleSelect";
import { EUROPEAN_COUNTRIES } from "shared/constants/constants";
import AlertMessage from "shared/ui-kit/Alert/AlertMessage";
import CustomSwitch from "shared/ui-kit/CustomSwitch";
import { Modal, TabNavigation } from "shared/ui-kit";
import InputWithLabelAndTooltip from "shared/ui-kit/InputWithLabelAndTooltip";
import { SocialPrimaryButton } from "components/PriviSocial/index.styles";

const infoIcon = require("assets/icons/info.svg");
const twitterIcon = require("assets/icons/socialTwitter.svg");
const facebookIcon = require("assets/icons/socialFacebook.svg");
const instagramIcon = require("assets/icons/socialInstagram.svg");
const tiktokIcon = require("assets/icons/socialTikTok.svg");

type Country = {
  id: string;
  name: string;
};

const ProfileEditModal = ({ open, onCloseModal, toggleAnonymousMode, getBasicInfo }) => {
  let userSelector = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch();
  const classes = profileEditModalStyles();

  const [user, setUser] = useState<any>(userSelector ? userSelector : { country: "", dob: 0 });

  const inputRef: any = useRef([]);

  const [status, setStatus] = useState<any>("");

  const [editionProgress, setEditionProgress] = useState(false);
  const [editProfileMenuSelection, setEditProfileMenuSelection] = useState<number>(0);
  const [selectedCountry, setSelectedCountry] = useState<Country>({ id: "", name: "" });

  const editProfileMenuOptions = ["General", "Social"];

  useEffect(() => {
    if (userSelector && !editionProgress && !user.name) {
      const userCopy = { ...userSelector } as any;
      userCopy.name = userSelector.firstName + " " + userSelector.lastName;

      userCopy.userAddress = !userCopy.userAddress ? "" : userCopy.userAddress;
      userCopy.urlSlug = !userCopy.urlSlug ? "" : userCopy.urlSlug;

      setUser(userCopy);
      inputRef.current = new Array(10);
    }
    //eslint-disable react-hooks/exhaustive-deps
  }, [userSelector, editionProgress]);

  const handleDateChange = (elem: any) => {
    let date = new Date(elem).getTime();
    let userCopy = { ...user };
    userCopy.dob = date;
    setUser(userCopy);
  };

  const checkSlug = async () => {
    const acceptedChars = "^[a-zA-Z0-9\\._' ]{1,100}$";
    user.urlSlug.match(acceptedChars);

    //check special characters
    if (
      user.twitter?.includes("@") ||
      user.facebook?.includes("@") ||
      user.instagram?.includes("@") ||
      user.tiktok?.includes("@")
    ) {
      setStatus({
        msg: "You don't have to include @ in your usernames",
        key: Math.random(),
        variant: "error",
      });
      return false;
    } else if (!user.urlSlug.match(acceptedChars)) {
      setStatus({
        msg: "Please type only letters, numbers, or special characters . and _",
        key: Math.random(),
        variant: "error",
      });
    } else {
      if (user.urlSlug.includes(".", user.urlSlug.length - 1)) {
        setStatus({
          msg: "URL can't end with a .",
          key: Math.random(),
          variant: "error",
        });
        return false;
      } else if (user.urlSlug.includes(".", 0)) {
        setStatus({
          msg: "URL can't start with a .",
          key: Math.random(),
          variant: "error",
        });
        return false;
      } else {
        //check if slug exists
        await axios
          .get(`${URL()}/user/checkSlugExists/${user.urlSlug}/${user.id}/user`)
          .then(response => {
            if (response.data.success) {
              if (response.data.data.urlSlugExists) {
                setStatus({
                  msg: "user with this url already exists, please choose another one",
                  key: Math.random(),
                  variant: "error",
                });
                return false;
              } else {
                return true;
              }
            } else {
              setStatus({
                msg: "error when checking url, please try again",
                key: Math.random(),
                variant: "error",
              });
              return false;
            }
          })
          .catch(error => {
            setStatus({
              msg: "error when making the request, please try again",
              key: Math.random(),
              variant: "error",
            });
            return false;
          });
      }
    }
  };

  const editProfile = async () => {
    if (checkSlug()) {
      setEditionProgress(true);

      let nameSplit = user.name.split(" ");
      let lastNameArray = nameSplit.filter((item, i) => {
        return i !== 0;
      });
      user.firstName = nameSplit[0];
      user.lastName = "";
      for (let i = 0; i < lastNameArray.length; i++) {
        if (lastNameArray.length === i + 1) {
          user.lastName = user.lastName + lastNameArray[i];
        } else {
          user.lastName = user.lastName + lastNameArray[i] + " ";
        }
      }

      axios
        .post(`${URL()}/user/editUser`, user)
        .then(response => {
          if (response.data.success) {
            setStatus({
              msg: "User Edited!",
              key: Math.random(),
              variant: "success",
            });
            setEditionProgress(false);
            sessionStorage.setItem("urlSlug", user.urlSlug);
            dispatch(editUser(response.data.data));

            getBasicInfo(user.id, true);
            setTimeout(() => {
              onCloseModal();
              dispatch(setUpdateBasicInfo(true));
            }, 1000);
          } else {
            setStatus({
              msg: "error when checking updating profile, please try again",
              key: Math.random(),
              variant: "error",
            });
            setEditionProgress(false);
          }
        })
        .catch(error => {
          console.log(error);
          setStatus({
            msg: "Error when making the request",
            key: Math.random(),
            variant: "error",
          });
          setEditionProgress(false);
        });
    }
  };

  if (userSelector)
    return (
      <Modal className={classes.root} size="medium" isOpen={open} onClose={onCloseModal} showCloseIcon>
        <div className={classes.tabWrapper}>
          <TabNavigation
            tabs={editProfileMenuOptions}
            currentTab={editProfileMenuSelection}
            variant="primary"
            onTabChange={setEditProfileMenuSelection}
            padding={0}
            theme="green"
          />
          <div className="anon-mode">
            <CustomSwitch
              checked={userSelector.anon}
              theme="green"
              onChange={() => {
                toggleAnonymousMode(!userSelector.anon);
              }}
            />
            <div className="private-title">
              <span>Private mode</span>
              <Tooltip
                TransitionComponent={Fade}
                TransitionProps={{ timeout: 600 }}
                arrow
                className="tooltip"
                title={`While using the PRIVI network, you have the option to share your data or not. When you see an advertisement, you earn PRIVI data coins. This part of the system at this time is not functional, any ad you see is simply as an example. To learn more about PRIVI Data and how you can make money off our data, head to our Medium or ask our Community in either PRIVI Communities or Governance`}
              >
                <img className="icon" src={infoIcon} alt="info" />
              </Tooltip>
            </div>
          </div>
        </div>

        {/* SOCIAL */}
        {editProfileMenuSelection === 1 ? (
          <>
            {/* TWITTER */}
            <InputWithLabelAndTooltip
              theme="light"
              type={"text"}
              inputValue={user.twitter}
              onInputValueChange={elem => {
                let userCopy = { ...user };
                userCopy.twitter = elem.target.value;
                setUser(userCopy);
              }}
              labelName="Twitter"
              endAdornment={<img src={twitterIcon} alt="twitter" />}
              placeHolder={"Connect your Twitter account"}
              tooltip={`Connect your Twitter account to your PRIVI profile account.`}
            />

            {/* FACEBOOK */}
            <InputWithLabelAndTooltip
              theme="light"
              type={"text"}
              inputValue={user.facebook}
              onInputValueChange={elem => {
                let userCopy = { ...user };
                userCopy.facebook = elem.target.value;
                setUser(userCopy);
              }}
              labelName="Facebook"
              endAdornment={<img src={facebookIcon} alt="facebook" />}
              placeHolder={"Connect your Facebook account"}
              tooltip={`Connect your Facebook account to your PRIVI profile account.`}
            />

            {/* INSTAGRAM */}
            <InputWithLabelAndTooltip
              theme="light"
              type={"text"}
              inputValue={user.instagram}
              onInputValueChange={elem => {
                let userCopy = { ...user };
                userCopy.instagram = elem.target.value;
                setUser(userCopy);
              }}
              labelName="Instagram"
              endAdornment={<img src={instagramIcon} alt="instagram" />}
              placeHolder={"Connect your Instagram account"}
              tooltip={`Connect your Instagram account to your PRIVI profile account.`}
            />

            {/* TIKTOK */}
            <InputWithLabelAndTooltip
              theme="light"
              type={"text"}
              inputValue={user.tiktok}
              onInputValueChange={elem => {
                let userCopy = { ...user };
                userCopy.tiktok = elem.target.value;
                setUser(userCopy);
              }}
              labelName="Tiktok"
              endAdornment={<img src={tiktokIcon} alt="tiktok" />}
              placeHolder={"Connect your Tiktok account"}
              tooltip={`Connect your Tiktok account to your PRIVI profile account.`}
            />
          </>
        ) : null}

        {/* GENERAL */}
        {editProfileMenuSelection === 0 ? (
          <>
            <InputWithLabelAndTooltip
              theme="light"
              type={"text"}
              inputValue={user.name}
              onInputValueChange={elem => {
                let userCopy = { ...user };
                userCopy.name = elem.target.value;
                setUser(userCopy);
              }}
              labelName="Name"
              placeHolder={"Enter your name"}
            />
            <div>
              <div style={{ marginTop: 0, marginBottom: 8, width: "100%" }}>
                <div className={classes.infoHeaderEdit}>Country</div>
              </div>
              <AutocompleteSingleSelect
                allItems={EUROPEAN_COUNTRIES}
                selectedItem={EUROPEAN_COUNTRIES.find(item => item.name === user.country) || selectedCountry}
                onSelectedItemChange={country => {
                  setSelectedCountry(country);
                  setUser({
                    ...user,
                    country: country.name,
                  });
                }}
                placeholder="Select countries"
                getOptionLabel={country => country.name}
                renderOption={country => (
                  <>
                    <img
                      alt={`${country.name} flag`}
                      src={`https://www.countryflags.io/${country.id.toLowerCase()}/flat/24.png`}
                      style={{ marginRight: "8px" }}
                    />
                    {country.name}
                  </>
                )}
              />
            </div>
            <div style={{ marginTop: "16px", marginBottom: "16px", width: "100%" }}>
              <div className={classes.flexRowInputs}>
                <div className={classes.infoHeaderEdit}>Date of Birth</div>
                <Tooltip
                  TransitionComponent={Fade}
                  TransitionProps={{ timeout: 600 }}
                  arrow
                  title={"Enter your birthday date"}
                >
                  <img className={classes.infoIconEdit} src={infoIcon} alt={"info"} />
                </Tooltip>
              </div>
              <div style={{ marginTop: "8px" }}>
                <DateInput
                  id="date-picker-start-date"
                  maxDate={new Date(new Date().getTime() - 18 * 365 * 24 * 60 * 60 * 1000)}
                  placeholder="Select your date of birthday"
                  value={user.dob}
                  onChange={handleDateChange}
                />
              </div>
            </div>
            <InputWithLabelAndTooltip
              theme="light"
              type={"text"}
              inputValue={user.urlSlug}
              onInputValueChange={elem => {
                let userCopy = { ...user };
                userCopy.urlSlug = elem.target.value;
                setUser(userCopy);
              }}
              labelName="Profile URL"
              placeHolder={"Enter a custom profile URL"}
              tooltip={"Customize your profile's URL with a custom Slug, to display in the navigation bar"}
            />

            <InputWithLabelAndTooltip
              theme="light"
              type={"textarea"}
              inputValue={user.bio}
              onInputValueChange={elem => {
                let userCopy = { ...user };
                userCopy.bio = elem.target.value;
                setUser(userCopy);
              }}
              labelName="Bio"
              placeHolder={"Enter your bio"}
              tooltip={"Type a small bio to let everyone know about yourself"}
            />
          </>
        ) : null}

        <div className={classes.editButton}>
          <SocialPrimaryButton disabled={editionProgress} onClick={editProfile}>
            Save Changes
          </SocialPrimaryButton>
        </div>

        <div className={classes.snackBar}>
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
  else return null;
};

export default ProfileEditModal;
