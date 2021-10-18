import React, { useState, useEffect } from "react";
import { useTypedSelector } from "store/reducers/Reducer";
import "./PodPage.css";
import "./NFTPodPage.css";
import axios from "axios";
import URL from "shared/functions/getURL";
import { sumTotalViews } from "shared/functions/totalViews";
import Buttons from "shared/ui-kit/Buttons/Buttons";
import BackButton from "shared/ui-kit/Buttons/BackButton";
import AlertMessage from "shared/ui-kit/Alert/AlertMessage";
import { Dialog } from "@material-ui/core";
import NFTGeneral from "./components/NFTGeneral";
import SecondaryMarket from "./components/SecondaryMarket";
import Leaderboard from "./components/Leaderboard";
import Insurance from "./components/Insurance";
import StakeModal from "./modals/StakeModal";
import AuditModal from "./modals/AuditModal";
import { TwitterShareButton, TwitterIcon } from "react-share";
import PodModalEdit from "./modals/Pod-modal-edit";
import FactoryERC721 from "shared/connectors/bridge/classes/FactoryERC721";
import BridgeTokenManager from "shared/connectors/bridge/classes/bridgeTokenManager";
import bridgeManagerJson from "shared/contracts/ABI_V5/BridgeManager.json";
import { waitTransaction } from "shared/connectors/bridge/classes/transactionStatus";
import { CircularProgress } from "@material-ui/core";
import {
  SupportedNetworksName as supportedNetworks,
  SupportedNetworkExplorerBaseUrl,
} from "shared/connectors/bridge/classes/supportedNetwork";
import { LoadingWrapper } from "shared/ui-kit/Hocs";
import { PrimaryButton, TabNavigation } from "shared/ui-kit";
import InputWithLabelAndTooltip from "shared/ui-kit/InputWithLabelAndTooltip";

// interface used for offers
interface Offer {
  offerId: string;
  trader: string;
  price: number;
  amount: number;
  isInsured: boolean;
  podAddress: string;
  token: string;
}

export default function NFTPodPage() {
  const factoryERC721 = new FactoryERC721();

  const user = useTypedSelector(state => state.user);
  const users = useTypedSelector(state => state.usersInfoList);

  const inputRef = React.useRef<any>();

  const [status, setStatus] = React.useState<any>("");
  const [pod, setPod] = useState<any>({});

  const [buyingOffers, setBuyingOffers] = useState<Offer[]>([]);
  const [sellingOffers, setSellingOffers] = useState<Offer[]>([]);
  const [marketPrice, setMarketPrice] = useState<number>(0);
  const [marketToken, setMarketToken] = useState<string>("");

  const [followed, setFollowed] = useState<boolean>(false);
  const [trigger, setTrigger] = useState<boolean>(false); // use to trigger useEffect to query data from backend each time some operation is done

  const [URLPodPhoto, setURLPodPhoto] = useState<string>("");

  // modal controller
  const [openStake, setOpenStake] = useState<boolean>(false);
  const [openAudit, setOpenAudit] = useState<boolean>(false);
  const [openModalEdit, setOpenModalEdit] = useState<boolean>(false);

  const [isDataLoading, setIsDataLoading] = useState<boolean>(false);

  const handleOpenStake = () => {
    setOpenStake(true);
  };
  const handleOpenAudit = () => {
    setOpenAudit(true);
  };

  const handleCloseStake = () => {
    setOpenStake(false);
  };
  const handleCloseAudit = () => {
    setOpenAudit(false);
  };

  let pathName = window.location.href; // If routing changes, change to pathname
  let idUrl = pathName.split("/")[6];
  const [podId, setPodId] = useState<string>("");

  //tabs
  const podsMenuOptions = ["General", "Secondary Market", "Leaderboard", "Insurance"];
  const [podMenuSelection, setPodMenuSelection] = useState<number>(0);

  // get id from url
  useEffect(() => {
    if (idUrl) {
      axios
        .get(`${URL()}/pod/getIdFromSlug/${idUrl}/nftpod`)
        .then(response => {
          if (response.data.success) {
            const id = response.data.data.id;
            setPodId(id);
          } else {
            console.log(response.data.message);
          }
        })
        .catch(error => {
          console.log(error);
          setStatus({
            msg: "Error getting pod id",
            key: Math.random(),
            variant: "error",
          });
        });
    }
  }, [idUrl]);

  const loadData = async () => {
    if (podId && podId.length > 0) {
      setIsDataLoading(true);
      axios
        .get(`${URL()}/pod/NFT/getPod/${podId}`)
        .then(response => {
          const resp = response.data;
          if (resp.success) {
            const podData = resp.data.pod;

            sumTotalViews(podData);

            let podCopy = { ...podData };
            let p = podCopy.Posts;

            if (users && users.length > 0 && p && typeof p[Symbol.iterator] === "function") {
              p.forEach((post, index) => {
                if (users.some(user => user.id === post.createdBy)) {
                  const thisUser = users[users.findIndex(user => user.id === post.createdBy)];
                  p[index].userImageURL = thisUser.imageURL;
                  p[index].userName = thisUser.name;
                }
              });
              podCopy.Posts = p;
            }

            setPod(podCopy);

            if (podData.HasPhoto && podData.HasPhoto === true && podData.Url) {
              setURLPodPhoto(`url(${podData.Url}?${Date.now()})`);
            }

            // check if user already followed the pod
            const followers: any[] = podData.Followers ?? [];
            if (followers) {
              let followed = false;
              followers.forEach(followerData => {
                if (followerData.id === user.id) {
                  followed = true;
                }
              });
              setFollowed(followed);
            }

            // buying offers
            const buyingOffersData = resp.data.buyingOffers;
            const buyOffers: Offer[] = [];
            if (buyingOffersData) {
              buyingOffersData.forEach(offer =>
                buyOffers.push({
                  offerId: offer.OrderId,
                  trader: offer.BAddress,
                  price: offer.Price,
                  amount: offer.Amount,
                  token: offer.Token,
                  podAddress: offer.PodAddress,
                  isInsured: offer.IsInsured ?? false,
                })
              );
            }
            setBuyingOffers(buyOffers);

            // selling offers
            const sellingOffersData = resp.data.sellingOffers;
            const sellOffers: Offer[] = [];
            if (sellingOffersData) {
              sellingOffersData.forEach(offer =>
                sellOffers.push({
                  offerId: offer.OrderId,
                  trader: offer.SAddress,
                  price: offer.Price,
                  amount: offer.Amount,
                  token: offer.Token,
                  podAddress: offer.PodAddress,
                  isInsured: offer.IsInsured ?? false,
                })
              );
            }

            // set market price and token
            let lowestMarketPrice = Infinity;
            let marketToken = "";
            sellOffers.forEach(offer => {
              if (offer.price < lowestMarketPrice) {
                lowestMarketPrice = offer.price;
                marketToken = offer.token;
              }
            });
            if (lowestMarketPrice !== Infinity) setMarketPrice(lowestMarketPrice);
            setMarketToken(marketToken);

            setSellingOffers(sellOffers);
          }
          setIsDataLoading(false);
        })
        .catch(error => {
          console.log(error);
          setIsDataLoading(false);
        });
    }
  };

  // used to query from backend the needed data for this page
  useEffect(() => {
    loadData();
  }, [users, trigger, podId]);

  const handleFollow = async () => {
    const body = {
      userId: user.id,
      podId: pod.PodAddress,
      podType: "NFT",
    };
    // follow
    if (!followed) {
      axios.post(`${URL()}/pod/followPod`, body).then(res => {
        const resp = res.data;
        if (resp.success) {
          setStatus({
            msg: "follow success",
            key: Math.random(),
            variant: "success",
          });
          setFollowed(true);
          loadData();
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
      axios.post(`${URL()}/pod/unfollowPod`, body).then(res => {
        const resp = res.data;
        if (resp.success) {
          setStatus({
            msg: "unfollow success",
            key: Math.random(),
            variant: "success",
          });
          setFollowed(false);
          loadData();
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

  const handleChat = () => {
    //TODO: open chat
  };

  const handleOpenModalEdit = () => {
    setOpenModalEdit(true);
  };

  const handleCloseModalEdit = () => {
    setOpenModalEdit(false);
  };

  //Pod Photo Change
  const onChangePodPhoto = (file: any) => {
    const formData = new FormData();
    formData.append("image", file, pod.PodAddress);
    const formTokenData = new FormData();
    formTokenData.append("image", file, pod.TokenSymbol);
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

          const podCopy = { ...pod };
          podCopy.dimensions = { height: height, width: width };
          setPod(podCopy);

          return true;
        };
      }
    });
    reader.readAsDataURL(file);

    axios
      .post(`${URL()}/pod/changeNFTPodPhoto`, formData, config)
      .then(response => {
        if (pod.HasPhoto && pod.Url) {
          setURLPodPhoto(`url(${pod.Url}?${Date.now()})`);

          let body = { dimensions: dimensions, id: pod.PodAddress };
          axios.post(`${URL()}/pod/updateNFTPodPhotoDimensions`, body).catch(error => {
            console.log(error);

            alert("Error uploading photo");
          });
        }
      })
      .catch(error => {
        console.log(error);
      });
    //change token photo
    axios
      .post(`${URL()}/wallet/changeTokenPhoto`, formTokenData, config)
      .then(r => {
        let body = { dimensions: dimensions, id: pod.TokenSymbol };
        axios.post(`${URL()}/wallet/updateTokenPhotoDimensions`, body).catch(error => {
          console.log(error);
        });
      })
      .catch(error => {
        console.log(error);
      });
  };

  const fileInputPodPhoto = e => {
    e.preventDefault();
    console.log(e);
    const files = e.target.files;
    if (files.length) {
      handleFiles(files);
    }
  };

  const handleFiles = (files: any) => {
    for (let i = 0; i < files.length; i++) {
      if (validateFile(files[i])) {
        onChangePodPhoto(files[i]);
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

  const [isPodDeployLoading, setPodDeployLoading] = useState<boolean>(false);
  const deployPodOnEth = async () => {
    setPodDeployLoading(true);
    try {
      const res = await factoryERC721.createPod(
        user.web3,
        user.ethAccount,
        pod.PodAddress,
        pod.TokenName,
        pod.TokenSymbol
      );
      console.log("deployPodOnEth response", res);

      const waitRes = await waitTransaction(user.web3, res.transactionHash, {
        interval: 1000,
        blocksToWait: 1,
      });

      setPodDeployLoading(false);
    } catch (e) {
      console.log("deployPodOnEth", e);
      setPodDeployLoading(false);
    }
  };

  const [podEthAddress, setPodEthAddress] = useState<string>();
  useEffect(() => {
    // console.log('web3 changed', user.web3)
    async function getDeployedPodOnEth() {
      if (
        typeof user.web3 !== "undefined" &&
        user.web3 !== null &&
        pod &&
        typeof pod.PodAddress !== "undefined"
      ) {
        const address = await factoryERC721.getDeployedPodTokenAddressOnEth(user.web3, pod.PodAddress);
        // console.log('deployed on eth address:', address)
        if (address !== "0x0000000000000000000000000000000000000000") {
          setPodEthAddress(address);
        }
      }
    }
    getDeployedPodOnEth();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, user.web3, pod, pod.PodAddress, isPodDeployLoading]);

  const bridgeTokenManager = new BridgeTokenManager();
  const [isPodRegisterLoading, setIsPodRegisterLoading] = useState<boolean>(false);

  const registerPodERC721TokenOnBridge = async () => {
    console.log("registerPodERC721TokenOnBridge", registerPodERC721TokenOnBridge);
    setIsPodRegisterLoading(true);
    try {
      const chainId = await user.web3.eth.getChainId();
      const result = await bridgeTokenManager.registerErc721Token(
        pod.TokenName,
        pod.TokenSymbol,
        typeof podEthAddress !== "undefined" ? podEthAddress : "",
        chainId,
        user.web3,
        user.ethAccount
      );
      console.log("bridgeTokenManager.registeredERC721Token", result);
      if (result) {
        const bridgeAbi: any = bridgeManagerJson.abi;
        const bridgeAddress = bridgeManagerJson.networks[String(chainId)]["address"];
        const bridgeManagerContract = new user.web3.eth.Contract(bridgeAbi, bridgeAddress);
        try {
          await bridgeManagerContract.methods
            .registerTokenERC721(pod.TokenName, pod.TokenSymbol, podEthAddress)
            .send({ from: user.ethAccount });
          setIsPodRegisterLoading(false);
        } catch (error) {
          console.log("registerPodERC721TokenOnBridge failed", error);
          setIsPodRegisterLoading(false);
        }
      } else {
        console.log("registerPodERC721TokenOnBridge failed, end of result if");
        setIsPodRegisterLoading(false);
      }
    } catch (e) {
      console.log("registerPodERC721TokenOnBridge failed", e);
      setIsPodRegisterLoading(false);
    }
  };

  const [isDeployedPodTokenRegisteredOnBridge, setIsDeployedPodTokenRegisteredOnBridge] = useState(false);
  const [currentChainId, setCrrentChainId] = useState<any>(undefined);
  useEffect(() => {
    const check = async () => {
      if (
        podEthAddress !== "" &&
        typeof user.web3 !== "undefined" &&
        user.web3 !== null &&
        pod.TokenSymbo !== ""
      ) {
        try {
          console.log("pod", pod.TokenSymbol);
          const chainId = await user.web3.eth.getChainId();
          if (chainId) {
            setCrrentChainId(chainId);
          }
          const bridgeManagerAddress = bridgeManagerJson.networks[String(chainId)]["address"];
          const beidgeManagerontract = new user.web3.eth.Contract(
            bridgeManagerJson.abi,
            bridgeManagerAddress
          );
          const registeredAddress = await beidgeManagerontract.methods
            .getErc721AddressRegistered(pod.TokenSymbol)
            .call();
          console.log("registeredAddress", registeredAddress);
          if (registeredAddress !== "0x0000000000000000000000000000000000000000") {
            setIsDeployedPodTokenRegisteredOnBridge(true);
          }
        } catch (error) {
          console.log("isDeployedPodTokenRegisteredOnBridge", error);
        }
      }
    };
    check();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [podEthAddress, user.web3, pod.TokenSymbol, isPodRegisterLoading]);

  return (
    <LoadingWrapper loading={isDataLoading}>
      <>
        {pod ? (
          <div className="pod-page">
            <BackButton />
            <div className={`header`}>
              <div className="main-info">
                <div>
                  <h2>{pod.Name ? pod.Name : ""}</h2>
                  <span>{`@${pod.urlSlug ?? pod.PodAddress ?? idUrl}`}</span>
                </div>
                {pod.Verified ? (
                  <div className="verifiedLabel">
                    <img src={require("assets/icons/done_green.png")} alt={"check"} />
                    Verified
                  </div>
                ) : null}
                {pod.State && pod.State.FundsRaised && pod.State.Debt ? (
                  <div className="coverage">
                    <img src={require("assets/icons/shield_green.png")} alt={`shield`} />
                    <span>{((pod.State.FundsRaised / pod.State.Debt) * 100).toFixed(0)}%</span>
                  </div>
                ) : null}
                {pod.Private ? (
                  <div className="private">
                    <img src={require("assets/icons/lock_gray.png")} alt={`lock`} />
                    <span>Private</span>
                  </div>
                ) : null}
              </div>
              <div className="connections">
                <p>
                  Followers
                  <span>{pod.Followers ? `${pod.Followers.length}` : ` 0`}</span>
                </p>
              </div>
              <div className="buttons">
                <TwitterShareButton
                  title={"Check out this PRIVI NFT Pod!: " + pod.Name + "\n\n" + pod.Description + "\n\n"}
                  url={window.location.href}
                  hashtags={["PRIVI"]}
                >
                  <TwitterIcon size={32} style={{ marginRight: 3 }} round />
                </TwitterShareButton>

                {user.id === pod.Creator ? (
                  <div>
                    <PrimaryButton size="medium" onClick={handleOpenModalEdit}>
                      Edit Pod
                    </PrimaryButton>
                    <Dialog
                      className="modal"
                      open={openModalEdit}
                      onClose={handleCloseModalEdit}
                      fullWidth={true}
                      maxWidth={"md"}
                    >
                      <PodModalEdit pod={pod} type={"nft"} onCloseModal={handleCloseModalEdit} />
                    </Dialog>
                  </div>
                ) : null}

                <PrimaryButton size="medium" className="chat" onClick={handleChat}>
                  <img src={require("assets/icons/round_message_white.png")} alt={"message bubble"} />
                  <span>Chat with Pod admin</span>
                </PrimaryButton>
                <Buttons />
              </div>
            </div>
            <div className="pod-data">
              <div className="main-info">
                <div
                  className="pod-image"
                  style={{
                    backgroundImage: pod.HasPhoto && URLPodPhoto.length > 0 ? URLPodPhoto : "none",
                    backgroundRepeat: "no-repeat",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    cursor: user.id === pod.Creator ? "pointer" : "auto",
                  }}
                  onClick={() => {
                    if (inputRef && inputRef.current) {
                      inputRef.current.click();
                    }
                  }}
                />
                {user.id === pod.Creator ? (
                  <InputWithLabelAndTooltip
                    onInputValueChange={fileInputPodPhoto}
                    hidden
                    type="file"
                    style={{
                      display: "none",
                    }}
                    reference={inputRef}
                  />
                ) : null}
                <div className="pod-info">
                  <div className="top">
                    <div className="pod-detail">
                      <p>Market Price</p>
                      <h2>{`${marketPrice} ${marketToken}`}</h2>
                    </div>
                    <div className="buttons">
                      {typeof podEthAddress === "undefined" && pod && pod.Creator === user.id ? (
                        <PrimaryButton
                          size="medium"
                          className={user.web3 === null ? "deploy-inactive" : "deploy"}
                          onClick={
                            user.web3 === null || isPodDeployLoading === true
                              ? () => {
                                console.log("connect wallet first");
                                setStatus({
                                  msg: "Connect wallet first",
                                  key: Math.random(),
                                  variant: "error",
                                });
                              }
                              : deployPodOnEth
                          }
                          disabled={isPodDeployLoading === true}
                        >
                          {user.web3 === null ? (
                            "Create ERC721 Token"
                          ) : isPodDeployLoading ? (
                            <div>
                              Deploying... <CircularProgress size={15} style={{ color: "white" }} />
                            </div>
                          ) : currentChainId && supportedNetworks[currentChainId] ? (
                            "Deploy On " + supportedNetworks[currentChainId]
                          ) : (
                            "UnKnown Network"
                          )}
                        </PrimaryButton>
                      ) : typeof podEthAddress !== "undefined" &&
                        user &&
                        user.web3 !== null &&
                        typeof user.web3 !== "undefined" &&
                        isDeployedPodTokenRegisteredOnBridge === false ? (
                        <PrimaryButton
                          size="medium"
                          className="invest"
                          onClick={registerPodERC721TokenOnBridge}
                        // disabled={true}
                        >
                          {isPodRegisterLoading ? (
                            <div>
                              Registering... <CircularProgress size={15} style={{ color: "white" }} />
                            </div>
                          ) : (
                            <div>Register | {factoryERC721.shortenAddres(String(podEthAddress))}</div>
                          )}
                        </PrimaryButton>
                      ) : typeof podEthAddress !== "undefined" &&
                        user &&
                        user.web3 !== null &&
                        typeof user.web3 !== "undefined" &&
                        isDeployedPodTokenRegisteredOnBridge === true ? (
                        <PrimaryButton
                          size="medium"
                          className="invest"
                          onClick={() => {
                            console.log("deploy button pressed, podEthAddress:", podEthAddress);
                            const url =
                              SupportedNetworkExplorerBaseUrl[currentChainId] + "address/" + podEthAddress;
                            window.open(url, "_blank");
                          }}
                          disabled={false}
                        >
                          {currentChainId && supportedNetworks[currentChainId]
                            ? supportedNetworks[currentChainId] +
                            " | " +
                            factoryERC721.shortenAddres(String(podEthAddress))
                            : "UnKnown Network"}
                        </PrimaryButton>
                      ) : null}
                      <button onClick={handleFollow}>{followed ? "Unfollow" : "Follow"}</button>
                    </div>
                  </div>
                  <div className="bottom">
                    <div className="description">
                      <p>{pod.Description ? pod.Description : "No pod description"}</p>
                      <div className="buttons">
                        {!pod.Verified && pod.Creator === user.id ? (
                          <button className="invest" onClick={handleOpenStake}>
                            Stake coins to verify Pod
                          </button>
                        ) : null}
                        {!pod.Verified && pod.Creator === user.id ? (
                          <StakeModal
                            open={openStake}
                            handleClose={handleCloseStake}
                            refreshPod={() => setTrigger(!trigger)}
                            podAddress={pod.PodAddress}
                            podType={"NFT"}
                          />
                        ) : null}
                        <button className="invest" onClick={handleOpenAudit}>
                          Request Pod Audit
                        </button>
                        <AuditModal
                          open={openAudit}
                          handleClose={handleCloseAudit}
                          refreshPod={loadData}
                          pod={pod}
                        />
                      </div>
                    </div>
                    {pod.InsurancePools ? (
                      <div className="pools">
                        <p>Insurance pools</p>
                        {pod.InsurancePools.length > 0 ? (
                          <div className="pools-container">
                            {pod.InsurancePools.map((pool, index) => {
                              if (index < 2) {
                                return (
                                  <div
                                    key={pool.id ? pool.id : `pool-${index}`}
                                    className="pool-image"
                                    style={{
                                      backgroundImage: pool.imageURL
                                        ? `url(${pool.imageURL})`
                                        : "url(https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQNLOdSYmnq_hstWsO5-PzRCKPUc7-A06_DbQ&usqp=CAU)",
                                      backgroundRepeat: "no-repeat",
                                      backgroundSize: "cover",
                                      backgroundPosition: "center",
                                    }}
                                  />
                                );
                              } else return null;
                            })}
                            {pod.InsurancePools.length > 2 ? (
                              <div className="pool-image">
                                <span>{`+ ${pod.InsurancePools.length - 2}`}</span>
                              </div>
                            ) : null}
                          </div>
                        ) : (
                          <p>None</p>
                        )}
                      </div>
                    ) : null}
                  </div>
                </div>
              </div>
              <div className="appbar-container">
                <TabNavigation
                  tabs={podsMenuOptions}
                  currentTab={podMenuSelection}
                  variant="secondary"
                  onTabChange={setPodMenuSelection}
                />
              </div>
              <div className="content">
                {podMenuSelection === 0 ? (
                  <NFTGeneral
                    pod={pod}
                    handleRefresh={loadData}
                    marketPrice={marketPrice}
                    buyingOffers={buyingOffers}
                    sellingOffers={sellingOffers}
                  />
                ) : podMenuSelection === 1 ? (
                  <SecondaryMarket pod={pod} handleRefresh={loadData} />
                ) : podMenuSelection === 2 ? (
                  <Leaderboard pod={pod} handleRefresh={loadData} />
                ) : (
                  <Insurance pod={pod} />
                )}
              </div>
            </div>
            {status ? <AlertMessage key={status.key} message={status.msg} variant={status.variant} /> : ""}
          </div>
        ) : (
          <div className="container">
            <h3>Pod not found</h3>
          </div>
        )}
      </>
    </LoadingWrapper>
  );
}
