import React, { useEffect, useRef, useState } from "react";
import Axios from "axios";

import { daoPageHeaderStyles } from "./index.styles";
import CreatorsModal from "../../modals/CreatorsModal/CreatorsModal";
import CreateDAOTokenModal from "../../modals/CreateDAOToken";
import { communityMenuDefaultOptions } from "../..";
import URL from "shared/functions/getURL";
import { useTypedSelector } from "store/reducers/Reducer";
import { DAOButton } from "components/PriviDAO/components/DAOButton/index";
import Box from "shared/ui-kit/Box";
import JoinUpDAOModal from "components/PriviDAO/modals/JoinUpDAO";
import { ChooseWalletModal } from "shared/ui-kit/Modal/Modals/ChooseWalletModal";
import { FinalStepModal } from "components/legacy/Media/components/Displays/elements";
import { SignatureRequestModal } from "shared/ui-kit";
import { buildJsxFromObject } from "shared/functions/commonFunctions";
import { FruitSelect } from "shared/ui-kit/Select/FruitSelect";

const DAOPageHeader = ({
  dao,
  getFounders,
  joined,
  following,
  currentTab,
  isFounder,
  setStatus,
  handleTrigger,
}) => {
  const classes = daoPageHeaderStyles();
  const user = useTypedSelector(state => state.user);

  const [community, setCommunity] = useState<any>(dao || {});
  const [urlCommunityPhoto, setURLCommunityPhoto] = useState<string>("");

  const avatarRef = useRef<any>();

  const [openCreateDAOToken, setOpenCreateDAOToken] = useState<boolean>(false);
  const [openCreatorsModal, setOpenCreatorsModal] = useState<boolean>(false);
  const [openJoinUpModal, setOpenJoinUpModal] = useState<boolean>(false);
  const [openChooseWalletModal, setOpenChooseWalletModal] = useState(false);
  const [openFinalStepModal, setOpenFinalStepModal] = useState(false);
  const [openSignatureRequestModal, setOpenSignatureRequestModal] = useState(false);
  const [signRequestModalDetail, setSignRequestModalDetail] = useState<any>(null);

  const handleOpenCreateDAOToken = () => {
    setOpenCreateDAOToken(true);
  };
  const handleOpenCreatorsModal = () => {
    setOpenCreatorsModal(true);
  };
  const handleCloseCreateDAOToken = () => {
    setOpenCreateDAOToken(false);
  };
  const handleCloseCreatorsModal = () => {
    setOpenCreatorsModal(false);
  };

  const handleOpenSignatureModal = () => {
    if (community?.CommunityAddress) {
      const body = {
        StakingAddress: community.StakingAddress,
        StakingAmount: community.StakingAmount,
        StakingToken: community.StakingToken,
      };

      setSignRequestModalDetail(buildJsxFromObject(body));
      setOpenSignatureRequestModal(true);
    }
  };

  useEffect(() => {
    if (community.HasPhoto && community.Url) {
      setURLCommunityPhoto(`url(${community.Url}?${Date.now()})`);
    } else setURLCommunityPhoto("");
  }, [community]);

  //Community Photo Change
  const onChangeCommunityPhoto = (file: any) => {
    const formData = new FormData();
    formData.append("image", file, community.CommunityAddress);
    const config = {
      headers: {
        "content-type": "multipart/form-data",
      },
    };

    let dimensions = { height: 0, width: 0 };

    const reader = new FileReader();
    reader.addEventListener("load", () => {
      let image = new Image();

      if (reader.result !== null && (typeof reader.result === "string" || reader.result instanceof String)) {
        image.src = reader.result.toString();

        //save dimensions
        image.onload = function () {
          let height = image.height;
          let width = image.width;

          dimensions = { height: height, width: width };
          return true;
        };
      }
    });
    reader.readAsDataURL(file);

    Axios.post(`${URL()}/community/changeCommunityPhoto`, formData, config)
      .then(response => {
        if (response.data.success && response.data.data) {
          setURLCommunityPhoto(`url(${response.data.data}?${Date.now()})`);
        }

        let body = { dimensions: dimensions, id: community.CommunityAddress };
        Axios.post(`${URL()}/community/updateCommunityPhotoDimensions`, body)
          .then(response => { })
          .catch(error => {
            console.log(error);

            alert("Error uploading photo");
          });
      })
      .catch(error => {
        console.log(error);
      });
  };

  const fileInputCommunityPhoto = e => {
    e.preventDefault();
    const files = e.target.files;
    if (files.length) {
      handleFiles(files);
    }
  };

  const handleFiles = (files: any) => {
    for (let i = 0; i < files.length; i++) {
      if (validateFile(files[i])) {
        onChangeCommunityPhoto(files[i]);
      } else {
        files[i]["invalid"] = true;
        // Alert invalid image
      }
    }
  };

  const validateFile = file => {
    const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/x-icon"];
    if (validTypes.indexOf(file.type) === -1) {
      return false;
    }
    return true;
  };

  const getRandomAvatarNumber = () => {
    const random = Math.floor(Math.random() * 100);
    if (random < 10) {
      return `00${random}`;
    }

    return `0${random}`;
  };

  const handleJoin = () => {
    if (
      community.EntryType &&
      !community.EntryType.includes("Open") &&
      community.arrayMembersId &&
      !community.arrayMembersId.includes(user.id)
    ) {
      if (community.EntryType !== "By request") {
        setOpenJoinUpModal(true);
      } else {
        requestJoin();
      }
    } else {
      joinDAO();
    }
  };

  const requestJoin = () => {
    const body = {
      userAddress: user.id,
      communityAddress: community.CommunityAddress,
    };

    Axios.post(`${URL()}/community/requestJoin`, body).then(res => {
      const resp = res.data;
      if (resp.success) {
        setOpenJoinUpModal(true);
      } else {
      }
    });
  };

  const joinDAO = () => {
    const body = {
      userAddress: user.id,
      communityAddress: community.CommunityAddress,
    };
    // leave
    if (community.arrayMembersId && community.arrayMembersId.includes(user.id)) {
      Axios.post(`${URL()}/community/leave`, body).then(res => {
        const resp = res.data;
        if (resp.success) {
          handleTrigger();
          setOpenJoinUpModal(true);
        } else {
        }
      });
    }
    // join
    else {
      Axios.post(`${URL()}/community/join`, body).then(res => {
        const resp = res.data;
        if (resp.success) {
          handleTrigger();
          setOpenJoinUpModal(true);
        }
      });
    }
  };

  const handleFollow = () => {
    const body = {
      userAddress: user.id,
      communityAddress: community.CommunityAddress,
    };
    // follow
    if (!following) {
      Axios.post(`${URL()}/community/follow`, body).then(res => {
        const resp = res.data;
        if (resp.success) {
          setStatus({
            msg: "follow success",
            key: Math.random(),
            variant: "success",
          });
          handleTrigger();
        } else {
          setStatus({
            msg: "follow failed",
            key: Math.random(),
            variant: "error",
          });
        }
      });
    }
    // unfollow
    else {
      Axios.post(`${URL()}/community/unfollow`, body).then(res => {
        const resp = res.data;
        if (resp.success) {
          setStatus({
            msg: "unfollow success",
            key: Math.random(),
            variant: "success",
          });
          handleTrigger();
        } else {
          setStatus({
            msg: "unfollow failed",
            key: Math.random(),
            variant: "error",
          });
        }
      });
    }
  };

  const handleFruit = type => {
    const body = {
      userId: user.id,
      fruitId: type,
      communityAddress: community.CommunityAddress,
    };

    Axios.post(`${URL()}/community/fruit`, body).then(res => {
      const resp = res.data;
      if (resp.success) {
        const itemCopy = { ...community };
        itemCopy.fruits = [
          ...(itemCopy.fruits || []),
          { userId: user.id, fruitId: type, date: new Date().getTime() },
        ];

        setCommunity(itemCopy);
      }
    });
  };

  return (
    <div className={classes.wrapper}>
      <div className={classes.topInfo}>
        <Box display="flex" flexDirection="column">
          <h5 className={classes.title}>Creators</h5>
          <div className={classes.creators} onClick={handleOpenCreatorsModal}>
            {getFounders()
              .filter((_, index) => index < 4)
              .map((item, k) => (
                <img
                  key={k}
                  src={
                    item.imageURL
                      ? item.imageURL
                      : item.userData?.imageURL
                        ? item.userData.imageURL
                        : `${URL()}/assets/anonAvatars/ToyFaces_Colored_BG_${getRandomAvatarNumber()}`
                  }
                  className={classes.creatorAvatar}
                />
              ))}
            {getFounders().length > 3 && (
              <div className={classes.creatorsCounter}>
                <span>+{getFounders().length - 4}</span>
              </div>
            )}
          </div>
          <h5 className={classes.title}>Members</h5>
          <Box fontSize="32px">{community.membersIdArray ? community.membersIdArray.length : 0}</Box>
        </Box>

        <Box display="flex" flexDirection="column">
          {community.TokenSymbol && (
            <div>
              <h5 className={classes.title}>DAO Token</h5>
              <Box fontSize="32px" marginBottom="24px" style={{ wordBreak: "break-all" }}>
                {community.TokenSymbol}
              </Box>
            </div>
          )}

          <Box display="flex" alignItems="center" fontSize="14px">
            <img src={require(`assets/tokenImages/PRIVI.png`)} alt={"PRIVI"} />
            Privi Chain
          </Box>
        </Box>

        <Box
          color="white"
          display="flex"
          flexDirection="column"
          fontFamily="Agrandir GrandLight"
          fontSize="18px"
          fontWeight="800"
        >
          <Box display="flex" alignItems="center" marginBottom="18px">
            <img
              src={require("assets/emojiIcons/watermelon.png")}
              alt="watermelon"
              style={{ marginRight: "8px" }}
            />
            {"02"}
          </Box>
          <Box display="flex" alignItems="center" marginBottom="18px">
            <img
              src={require("assets/emojiIcons/avocado.png")}
              alt="avocado"
              style={{ marginRight: "8px" }}
            />
            {30}
          </Box>
          <Box display="flex" alignItems="center" marginBottom="18px">
            <img src={require("assets/emojiIcons/orange.png")} alt="orange" style={{ marginRight: "8px" }} />
            {137}
          </Box>
          <div className={classes.fruitsContainer}>
            <FruitSelect
              counter1={2}
              counter2={30}
              counter3={137}
              fruitObject={community}
              onGiveFruit={handleFruit}
              members={community.Members}
            />
          </div>
        </Box>

        <Box display="flex" flexDirection="column" fontSize="20px" fontFamily="Agrandir GrandLight">
          <h5 className={classes.title}>Joining Rules</h5>
          {(!community.EntryType || community.EntryType.includes("Open")) && (
            <h6 className={classes.subtitle}>Free to join</h6>
          )}
          {community.EntryType && community.EntryType.includes("Approval") && (
            <Box>
              <h6 className={classes.subtitle}>By request</h6>
              <p>Your request must be accepted by one of the community founders.</p>
            </Box>
          )}
          {community.EntryType && community.EntryType.includes("Stake") && (
            <Box>
              <h6 className={classes.subtitle}>Stake First</h6>
              <p>
                To be part of this dao you have to stake an amount of{" "}
                {community.RequiredTokens &&
                  community.RequiredTokens.length &&
                  community.RequiredTokens[0].token}{" "}
                {community.RequiredTokens &&
                  community.RequiredTokens.length &&
                  community.RequiredTokens[0].tokenValue}
              </p>
            </Box>
          )}
        </Box>
      </div>

      <div className={classes.imageAndButtons}>
        <div className={classes.imageContainer}>
          <div
            className={classes.daoImage}
            style={{
              backgroundImage: urlCommunityPhoto,
              backgroundRepeat: "no-repeat",
              backgroundSize: "cover",
              backgroundPosition: "center",
              cursor: user.id === community.Creator ? "pointer" : "auto",
            }}
            onClick={() => {
              if (avatarRef && avatarRef.current) {
                avatarRef.current.click();
              }
            }}
          />
          {user.id === community.Creator && (
            <input
              type="file"
              hidden
              onChange={e => fileInputCommunityPhoto(e)}
              style={{
                display: "none",
              }}
              ref={avatarRef}
            />
          )}
          <h5>{community.Name}</h5>
          <h6>Culture</h6>
        </div>
        <Box display="flex" alignItems="center">
          {currentTab !== communityMenuDefaultOptions[0] &&
            currentTab !== communityMenuDefaultOptions[1] &&
            isFounder ? (
            <DAOButton>Edit Rules</DAOButton>
          ) : (
            <DAOButton onClick={handleJoin}>{joined ? "Leave" : "Join Up"}</DAOButton>
          )}
          {currentTab !== communityMenuDefaultOptions[0] &&
            currentTab !== communityMenuDefaultOptions[1] &&
            isFounder &&
            !community.TokenSymbol ? (
            <DAOButton onClick={handleOpenCreateDAOToken}>Create Token</DAOButton>
          ) : (
            <DAOButton onClick={handleFollow}>{following ? "Unfollow" : "Follow"}</DAOButton>
          )}
        </Box>
      </div>

      <CreateDAOTokenModal
        open={openCreateDAOToken}
        handleRefresh={handleTrigger}
        handleClose={handleCloseCreateDAOToken}
        communityAddress={community.CommunityAddress}
        community={community}
      />
      <CreatorsModal open={openCreatorsModal} onClose={handleCloseCreatorsModal} users={getFounders()} />

      <JoinUpDAOModal
        open={openJoinUpModal}
        joinType={
          !community.EntryType
            ? 0
            : community.EntryType && community.EntryType.includes("Staking")
              ? 2
              : community.EntryType && community.EntryType.includes("Approval")
                ? 1
                : 0
        }
        onAccept={() => {
          setOpenJoinUpModal(false);
          if (community.EntryType && community.EntryType.includes("Staking")) {
            setOpenChooseWalletModal(true);
          }
        }}
        onClose={() => {
          setOpenJoinUpModal(false);
        }}
      />
      <ChooseWalletModal
        theme="dark"
        isOpen={openChooseWalletModal}
        onClose={() => {
          setOpenChooseWalletModal(false);
        }}
        onAccept={() => {
          setOpenChooseWalletModal(false);
          setOpenFinalStepModal(true);
          setTimeout(() => {
            setOpenFinalStepModal(false);
            handleOpenSignatureModal();
          }, 2000);
        }}
      />
      <FinalStepModal
        isOpen={openFinalStepModal}
        onClose={() => {
          setOpenFinalStepModal(false);
        }}
        theme="dark"
      />
      <SignatureRequestModal
        theme="dark"
        open={openSignatureRequestModal}
        address={user.address}
        transactionFee="0.0000"
        detail={signRequestModalDetail}
        handleOk={joinDAO}
        handleClose={() => setOpenSignatureRequestModal(false)}
      />
    </div>
  );
};

export default DAOPageHeader;
