import React, { useState, useRef, useEffect } from "react";
import { trackPromise } from "react-promise-tracker";
import { useTypedSelector } from "store/reducers/Reducer";
import axios from "axios";
import "./CreditPoolPage.css";
import URL from "shared/functions/getURL";
import Buttons from "shared/ui-kit/Buttons/Buttons";
import { sumTotalViews } from "shared/functions/totalViews";
import BackButton from "shared/ui-kit/Buttons/BackButton";
import Graph from "shared/ui-kit/Page-components/Graph";
import WallItem from "shared/ui-kit/Page-components/WallItem";
import Voting from "shared/ui-kit/Page-components/Voting";
import TradingHistory from "shared/ui-kit/Page-components/TradingHistory";
import BorrowModal from "./components/BorrowModal";
import LoanModal from "./components/LoanModal";
import PageDiscussion from "shared/ui-kit/Forum/PageDiscussion";
import ModalNewTopic from "shared/ui-kit/Forum/ModalNewTopic";
import AlertMessage from "shared/ui-kit/Alert/AlertMessage";
import { TwitterShareButton, TwitterIcon } from "react-share";
import Discord from "shared/ui-kit/Page-components/Discord/Discord";
import { AppBar, Dialog, Modal, Tab, Tabs } from "@material-ui/core";
import CreatePostModal from "../../Communities/CommunityPage/modals/Create-Post/CreatePostModal";
import SeeAllPosts from "shared/ui-kit/Page-components/SeeAllPosts";
import ViewAllVotingModal from "shared/ui-kit/Page-components/ViewAllVotingModal";
import CreateVotingModal from "shared/ui-kit/Page-components/CreateVotingModal";
import CreditModalEdit from "./modals/Credit-modal-edit";
import InputWithLabelAndTooltip from "shared/ui-kit/InputWithLabelAndTooltip";

export default function CreditPoolPage() {
  const user = useTypedSelector(state => state.user);
  const users = useTypedSelector(state => state.usersInfoList);

  const inputRef = useRef<any>();
  const [userBalances, setUserBalances] = useState<any>({});

  const [pool, setPool] = useState<any>({});

  const [status, setStatus] = React.useState<any>("");

  const [followed, setFollowed] = useState<boolean>(false);
  const [userIsBorrowerLender, setUserIsBorrowerLender] = useState<boolean>(false);
  const [trigger, setTrigger] = useState<boolean>(false); // use to trigger useEffect to query data from backend each time some operation is done
  const [URLPoolPhoto, setURLPoolPhoto] = useState<string>("");

  const [transactions, setTransactions] = useState<any[]>([]);
  const pageDiscussionRef = useRef();

  const [interestData, setInterestData] = useState<any>([]);
  const [totalInterest, setTotalInterest] = useState<Number>(0);
  const [liquidityData, setLiquidityData] = useState<any>({
    data1: [],
    data2: [],
    data3: [],
  });
  const [totalLiquidity, setTotalLiquidity] = useState<Number>(0);
  const [creditPoolMenuSelection, setCreditPoolMenuSelection] = useState<number>(0);
  const communityMenuOptions = ["General", "Jarr"];
  /* Modals*/
  const [openModalEdit, setOpenModalEdit] = useState<boolean>(false);
  const handleOpenModalEdit = () => {
    setOpenModalEdit(true);
  };

  const handleCloseModalEdit = () => {
    setOpenModalEdit(false);
  };
  const [openBorrow, setOpenBorrow] = useState<boolean>(false);

  const handleOpenBorrow = () => {
    setOpenBorrow(true);
  };

  const handleCloseBorrow = () => {
    setOpenBorrow(false);
  };

  const [openLoan, setOpenLoan] = useState<boolean>(false);

  const handleOpenLoan = () => {
    setOpenLoan(true);
  };

  const handleCloseLoan = () => {
    setOpenLoan(false);
  };

  const [openNewTopic, setOpenNewTopic] = useState<boolean>(false);

  const handleOpenNewTopic = () => {
    setOpenNewTopic(true);
  };

  const handleCloseNewTopic = () => {
    setOpenNewTopic(false);
  };

  const [createPollModal, setCreatePollModal] = useState<boolean>(false);
  const handleOpenCreatePollModal = () => {
    setCreatePollModal(true);
  };
  const handleCloseCreatePollModal = () => {
    setCreatePollModal(false);
  };

  const [viewAllVotingModal, setViewAllVotingModal] = useState<boolean>(false);
  const handleOpenViewAllVotingModal = () => {
    setViewAllVotingModal(true);
  };
  const handleCloseViewAllVotingModal = () => {
    setViewAllVotingModal(false);
  };

  let pathName = window.location.href; // If routing changes, change to pathname
  let idUrl = pathName.split("/")[6];
  const [creditId, setCreditId] = useState<string>("");

  const [openModalNewCreditPoolPost, setOpenModalCreditPoolPost] = useState<boolean>(false);
  const handleOpenModalNewCreditPoolPost = () => {
    setOpenModalCreditPoolPost(true);
  };
  const handleCloseModalNewCreditPoolPost = () => {
    setTrigger(!trigger);
    setOpenModalCreditPoolPost(false);
  };

  const [openModalViewAllPost, setOpenModalViewAllPost] = useState<boolean>(false);
  const handleOpenModalViewAllPost = () => {
    setOpenModalViewAllPost(true);
  };
  const handleCloseModalViewAllPost = () => {
    setOpenModalViewAllPost(false);
  };

  // get id from url
  useEffect(() => {
    if (idUrl) {
      axios
        .get(`${URL()}/priviCredit/getIdFromSlug/${idUrl}/credit`)
        .then(response => {
          if (response.data.success) {
            const id = response.data.data.id;
            setCreditId(id);
          } else {
            console.log(response.data.message);
          }
        })
        .catch(error => {
          console.log(error);
          setStatus({
            msg: "Error getting credit pool id",
            key: Math.random(),
            variant: "error",
          });
        });
    }
  }, [idUrl]);

  // used to query from backend the needed data for this page
  useEffect(() => {
    // get privi credit data
    if (creditId) {
      trackPromise(
        axios.get(`${URL()}/priviCredit/getPriviCredit/${creditId}`).then(res => {
          const resp = res.data;
          if (resp.success) {
            const data = resp.data;
            sumTotalViews(data);

            let poolCopy = { ...data };
            let p = poolCopy.Posts ? [...poolCopy.Posts] : [];
            if (users && users.length > 0) {
              users.forEach(user => {
                p.forEach((post, index) => {
                  if (user.id === post.createdBy) {
                    p[index].userImageURL = user.imageURL;
                    p[index].userName = user.name;
                  }
                });
              });
              poolCopy.Posts = p;
            }
            setPool(poolCopy);
            // check if user already followed the pod
            const followers: any[] = data.Followers;
            if (followers) {
              followers.forEach(followerData => {
                const id = followerData.id;
                // user already follwed
                if (id === user.id) setFollowed(true);
              });
            }
            const borrowers: any[] = data.Borrowers;
            if (borrowers) {
              borrowers.forEach(borrowerData => {
                const id = borrowerData.BorrowerAddress;
                if (id === user.id) setUserIsBorrowerLender(true);
              });
            }
            const lenders: any[] = data.Lenders;
            if (lenders) {
              lenders.forEach(lenderData => {
                const id = lenderData.LenderAddress;
                if (id === user.id) setUserIsBorrowerLender(true);
              });
            }
            if (data.DiscordAdminId === user.id) {
              setUserIsBorrowerLender(true);
            }
            if (data.HasPhoto && data.HasPhoto === true) {
              setURLPoolPhoto(`url(${data.Url}?${Date.now()})`);
            }
          }
        })
      );
      // get credit txns data
      trackPromise(
        axios
          .get(`${URL()}/priviCredit/getPriviTransactions/${creditId}`)
          .then(res => {
            const resp = res.data;
            if (resp.success) {
              const data = resp.data;
              setTransactions(data);
            }
          })
          .catch(error => {
            console.log(error);
            // alert("Error getting Credit Transaction Info");
          })
      );
      // get history
      trackPromise(
        axios
          .get(`${URL()}/priviCredit/getHistories/${creditId}`)
          .then(res => {
            const resp = res.data;
            if (resp.success) {
              const data = resp.data;
              const interestHistory: any[] = data.interestHistory;
              const depositedHistory: any[] = data.depositedHistory;
              const borrowedHistory: any[] = data.borrowedHistory;
              const availableHistory: any[] = data.availableHistory;
              // set left graph data
              const newInterestData: any[] = [];
              let newTotalInterest = 0;
              interestHistory.forEach(obj => {
                newInterestData.push({
                  x: new Date(obj.date).toString(),
                  y: obj.interest,
                });
                if (obj.interest > newTotalInterest) newTotalInterest = obj.interest;
              });
              setTotalInterest(newTotalInterest);
              setInterestData(newInterestData);
              // set right graph data
              const newDepositedData: any[] = [];
              const newBorrowedData: any[] = [];
              const newAvailableData: any[] = [];
              let newTotalAvailable = 0;
              depositedHistory.forEach(obj => {
                newDepositedData.push({
                  x: new Date(obj.date).toString(),
                  y: obj.deposited,
                });
              });
              borrowedHistory.forEach(obj => {
                newBorrowedData.push({
                  x: new Date(obj.date).toString(),
                  y: obj.borrowed,
                });
              });
              availableHistory.forEach(obj => {
                newAvailableData.push({
                  x: new Date(obj.date).toString(),
                  y: obj.available,
                });
                if (obj.available > newTotalAvailable) newTotalAvailable = obj.available;
              });
              setTotalLiquidity(newTotalAvailable);
              setLiquidityData({
                data1: newDepositedData,
                data2: newBorrowedData,
                data3: newAvailableData,
              });
            }
          })
          .catch(error => {
            console.log(error);
            // alert("Error getting Credit Histories Info");
          })
      );
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trigger, users, creditId]);

  const handleFollow = async () => {
    const body = {
      userId: user.id,
      creditId: pool.CreditAddress,
    };
    // follow
    if (!followed) {
      trackPromise(
        axios.post(`${URL()}/priviCredit/followCredit`, body).then(res => {
          const resp = res.data;
          if (resp.success) {
            setStatus({
              msg: "follow success",
              key: Math.random(),
              variant: "success",
            });
            setFollowed(true);
            setTrigger(!trigger);
          } else {
            setStatus({
              msg: "follow failed",
              key: Math.random(),
              variant: "error",
            });
          }
        })
      );
    }
    // unfollow
    else {
      trackPromise(
        axios.post(`${URL()}/priviCredit/unfollowCredit`, body).then(res => {
          const resp = res.data;
          if (resp.success) {
            setStatus({
              msg: "unfollow success",
              key: Math.random(),
              variant: "success",
            });
            setFollowed(false);
            setTrigger(!trigger);
          } else {
            setStatus({
              msg: "unfollow failed",
              key: Math.random(),
              variant: "error",
            });
          }
        })
      );
    }
  };

  const handleChat = () => {
    //TODO: Open chat
  };

  let daysToGo = pool.DateExpiration ? (pool.DateExpiration - Date.now()) / (1000 * 3600 * 24) : 0;
  daysToGo = Number(daysToGo.toFixed(0));
  if (daysToGo < 0) daysToGo = 0;

  const GeneralCreditPool = () => {
    return (
      <div>
        <div className="charts">
          <div className="charts-container">
            <div className="chart">
              <p>Interest</p>
              <span>{`Total Acumulated From Interest ${totalInterest}`}</span>
              <Graph data={interestData} />
            </div>
            <div className="chart">
              <p>Liquidity</p>
              <span>{`Total Available Liquidity ${totalLiquidity}`}</span>
              <Graph data={liquidityData} />
            </div>
          </div>
          <div className="ad-container">
            <p>Ad placement</p>
          </div>
        </div>
        <div className="wall">
          <div className="title">
            <h3>Pool Wall</h3>
            <button onClick={handleOpenModalViewAllPost} style={{ cursor: "pointer" }} className="disabled">
              View all
            </button>
            {pool.Creator === user.id ? (
              <button onClick={handleOpenModalNewCreditPoolPost}>+ Create</button>
            ) : null}
          </div>
          <div className="wall-content">
            {pool.PostsArray && pool.PostsArray.length > 0 ? (
              pool.PostsArray.map((item, index) => {
                return (
                  <WallItem
                    item={item}
                    imageUrl={`${URL()}/priviCredit/wall/getPostPhoto/${item.id}`}
                    Creator={pool.Creator}
                    key={`wall-item-${index}`}
                    type={"CreditPost"}
                    itemTypeId={pool.id}
                    admin={pool.Creator === user.id}
                    handleRefresh={() => setTrigger(!trigger)}
                    index={index}
                  />
                );
              })
            ) : (
              <div>No Posts available</div>
            )}
          </div>
        </div>
        <div className="lower-section">
          <div className="discussions">
            <div className="bodyHeaderPriviEcosystem">
              <div className="labelBodyPriviEcosystem">
                <img
                  src={require("assets/icons/message_blue.png")}
                  alt={"message bubble"}
                  className="iconLabelBodyPriviEcosystem"
                />
                Discussions
              </div>
              <div className="buttonBodyPriviEcosystem">
                <button onClick={handleOpenNewTopic}>+ Create</button>
                <Dialog
                  className="modalCreateModal"
                  open={openNewTopic}
                  onClose={handleCloseNewTopic}
                  fullWidth={true}
                  maxWidth={"md"}
                >
                  <ModalNewTopic
                    open={openNewTopic}
                    handleClose={handleCloseNewTopic}
                    postType="cp"
                    linkId={pool.CreditAddress}
                    pageDiscussionRef={pageDiscussionRef}
                    style={{ width: "920px" }}
                  />
                </Dialog>
              </div>
            </div>

            <div className="content">
              <PageDiscussion
                postType="cp"
                linkId={pool.CreditAddress}
                key={pool.CreditAddress}
                pageDiscussionRef={pageDiscussionRef}
              />
            </div>
          </div>

          <div className="voting">
            <div className="title">
              <img src={require("assets/icons/done_blue.png")} alt={"check"} />
              <h3>Voting</h3>
              {pool.VotingsArray && pool.VotingsArray.length > 0 ? (
                <button
                  onClick={handleOpenViewAllVotingModal}
                  style={{ cursor: "pointer" }}
                  className="disabled"
                >
                  View all
                </button>
              ) : null}
              <Modal
                className="modalCreateModal"
                open={viewAllVotingModal}
                onClose={handleCloseViewAllVotingModal}
              >
                <ViewAllVotingModal
                  onCloseModal={handleCloseViewAllVotingModal}
                  onRefreshInfo={() => setTrigger(!trigger)}
                  id={pool.id}
                  type={"CreditPool"}
                  votings={pool.VotingsArray}
                  title={"Voting"}
                  openVotingsLabel={"Active Voting"}
                  closeVotingsLabel={"Old Voting"}
                />
              </Modal>
              {pool && pool.Creator === user.id ? (
                <button onClick={handleOpenCreatePollModal}>New</button>
              ) : null}
              <CreateVotingModal
                open={createPollModal}
                onClose={handleCloseCreatePollModal}
                onRefreshInfo={() => setTrigger(!trigger)}
                id={pool.id}
                type={"CreditPool"}
                item={pool}
                title={"Create Voting"}
              />
            </div>
            <div className="content-voting">
              {pool.VotingsArray && pool.VotingsArray.length > 0 ? (
                pool.VotingsArray.map((item, index) => {
                  if (item.OpenVotation) {
                    if (pool.VotingsArray.length > index + 1) {
                      return (
                        <div key={`${index}-poll`} style={{ borderBottom: "1px solid #8080803d" }}>
                          <Voting
                            item={item}
                            itemType={"CreditPool"}
                            itemId={pool.id}
                            onRefreshInfo={() => setTrigger(!trigger)}
                            key={`${index}-poll`}
                          />
                        </div>
                      );
                    } else {
                      return (
                        <div key={`${index}-poll`}>
                          <Voting
                            item={item}
                            itemType={"CreditPool"}
                            itemId={pool.id}
                            onRefreshInfo={() => setTrigger(!trigger)}
                            key={`${index}-poll`}
                          />
                        </div>
                      );
                    }
                  } else return null;
                })
              ) : (
                <div className="centered-info">
                  <p>No active voting</p>
                </div>
              )}
            </div>
          </div>
          <div className="buying-history">
            <div className="title">
              <img src={require("assets/icons/stats_blue.png")} alt={"stats"} />
              <h3>Credit Pool History</h3>
            </div>
            <div className="content">
              <TradingHistory history={transactions} address={pool.CreditAddress} />
            </div>
          </div>
        </div>
      </div>
    );
  };

  const JarrCreditPool = () => {
    if (userIsBorrowerLender) {
      return (
        <div>
          <Discord
            discordId={pool.JarrId}
            sidebar={false}
            type={"Credit-Pool"}
            id={pool.id}
            showAll={false}
          />
        </div>
      );
    } else {
      return (
        <div>
          <div className="joinCommunityLabel">Invest Pod to see Pod Jarr</div>
        </div>
      );
    }
  };

  //Pod Photo Change
  const onChangePoolPhoto = (file: any) => {
    const formData = new FormData();
    formData.append("image", file, pool.CreditAddress);
    const config = {
      headers: {
        "content-type": "multipart/form-data",
      },
    };
    trackPromise(
      axios
        .post(`${URL()}/priviCredit/changeCreditPoolPhoto`, formData, config)
        .then(response => {
          if (pool.HasPhoto && pool.HasPhoto === true) {
            setURLPoolPhoto(`url(${pool.Url}?${Date.now()})`);
          }
        })
        .catch(error => {
          console.log(error);
        })
    );
  };

  const fileInputCreditPhoto = e => {
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
        onChangePoolPhoto(files[i]);
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

  return pool ? (
    <div className="credit-pool-page">
      <BackButton />
      <div className={`header`}>
        <div className="title">
          <h2>{pool.CreditName ? pool.CreditName : "Credit Pool"}</h2>
          <span>{`@${pool.urlSlug ?? pool.CreditAddress ?? idUrl}`}</span>
        </div>

        <div className="connections">
          <p>
            Followers
            <span>{pool.Followers ? `${pool.Followers.length}` : ` 0`}</span>
          </p>
          <p>
            Borrowers
            <span>{pool.Borrowers ? `${pool.Borrowers.length}` : `0`}</span>
          </p>
          <p>
            Lenders
            <span>{pool.Lenders ? `${pool.Lenders.length}` : `0`}</span>
          </p>
        </div>
        <div className="buttons">
          <TwitterShareButton
            title={
              "Check out this PRIVI Credit Pool!: " + pool.CreditName + "\n\n" + pool.Description + "\n\n"
            }
            url={window.location.href}
            hashtags={["PRIVI"]}
          >
            <TwitterIcon size={32} style={{ marginRight: 3 }} round />
          </TwitterShareButton>

          {user.id === pool.Creator ? (
            <div>
              <button onClick={handleOpenModalEdit} className="flexDisplayCenter">
                Edit Credit Pool
              </button>
              <Dialog
                className="modal"
                open={openModalEdit}
                onClose={handleCloseModalEdit}
                fullWidth={true}
                maxWidth={"md"}
              >
                <CreditModalEdit credit={pool} onCloseModal={handleCloseModalEdit} />
              </Dialog>
            </div>
          ) : null}

          <button className="chat" onClick={handleChat}>
            <img src={require("assets/icons/round_message_white.png")} alt={"message bubble"} />
            <span>Chat with pool admin</span>
          </button>
          {/* <SearchButton />
          <SettingsButton /> */}
          <Buttons />
        </div>
      </div>
      <div className="pool-data">
        <div className="main-info">
          <div
            className="pool-image"
            style={{
              backgroundImage: pool.HasPhoto && URLPoolPhoto.length > 0 ? URLPoolPhoto : "none",
              backgroundRepeat: "no-repeat",
              backgroundSize: "cover",
              backgroundPosition: "center",
              cursor: user.id === pool.Creator ? "pointer" : "auto",
            }}
            onClick={() => {
              if (inputRef && inputRef.current) {
                inputRef.current.click();
              }
            }}
          />
          {user.id === pool.Creator ? (
            <InputWithLabelAndTooltip
              onInputValueChange={fileInputCreditPhoto}
              hidden
              type="file"
              style={{
                display: "none",
              }}
              reference={inputRef}
            />
          ) : null}
          <div className="pool-info">
            <div className="top">
              <div className="perc">
                <div className="pool-detail">
                  <p>Credit cap</p>
                  <h3>{pool.MaxFunds ? `${pool.MaxFunds.toFixed(2)}` : "0"}</h3>
                </div>
                <div className="pool-detail">
                  <p>Interest</p>
                  <h3>{`${pool.Interest ? `${(pool.Interest * 100).toFixed(2)}%` : "0%"} ${pool.token ? pool.token : ""
                    }`}</h3>
                </div>
                <div className="pool-detail">
                  <p>Days to go</p>
                  <h3>{`${daysToGo}`}</h3>
                </div>
              </div>
              <div className="scores">
                <div className="pod-detail">
                  <p>Trust Score</p>
                  <span>
                    <img src={require("assets/icons/rings_green.png")} alt={`rings`} />
                    <h3>{pool.BorrowerTrustScore ? `${pool.BorrowerTrustScore * 100}%` : "50%"}</h3>
                  </span>
                </div>
                <div className="pod-detail">
                  <p>Endorsement Score</p>
                  <span>
                    <img src={require("assets/icons/maze_green.png")} alt={`maze`} />
                    <h3>
                      {pool.BorrowerEndorsementScore ? `${pool.BorrowerEndorsementScore * 100}%` : "50%"}
                    </h3>
                  </span>
                </div>
              </div>
              <div className="buttons">
                <button onClick={handleFollow}>{followed ? "Unfollow" : "Follow"}</button>
                <button className="invest" onClick={handleOpenBorrow}>
                  Borrow
                </button>
                <BorrowModal
                  open={openBorrow}
                  handleClose={handleCloseBorrow}
                  refreshPool={() => setTrigger(!trigger)}
                  pool={pool}
                  userBalances={userBalances}
                />
                <button className="invest" onClick={handleOpenLoan}>
                  Loan
                </button>
                <LoanModal
                  open={openLoan}
                  handleClose={handleCloseLoan}
                  refreshPool={() => setTrigger(!trigger)}
                  pool={pool}
                  userBalances={userBalances}
                />
              </div>
            </div>
            <div className="bottom">
              <div className="description">
                <p>{pool.Description ? pool.Description : "No pool description"}</p>
              </div>
              <div className="right">
                <div className="white-info">
                  <div>
                    <p>Borrowing requirements</p>
                    <div>
                      <span>{pool.TrustScore ? `${pool.TrustScore * 100}% Trust` : "0% Trust"}</span>
                      <span>
                        {pool.EndorsementScore
                          ? `${pool.EndorsementScore * 100}% Endorsement`
                          : "0% Endorsement"}
                      </span>
                    </div>
                  </div>
                  <div>
                    <p>Collaterals</p>
                    <div className="collaterals">
                      {pool.CollateralsAccepted && pool.CollateralsAccepted.length > 0 ? (
                        pool.CollateralsAccepted.map((collateral, index) => {
                          return (
                            <span key={`collateral-${index}`}>
                              {index > 0 ? `, ${collateral}` : collateral}
                            </span>
                          );
                        })
                      ) : (
                        <span>N/A</span>
                      )}
                    </div>
                  </div>
                </div>

                {pool.tokens && pool.tokens.length > 0 ? (
                  <div className="white-info tokens">
                    <div className="pools-container">
                      {pool.tokens.map((pool, index) => {
                        if (index < 2) {
                          return (
                            <div
                              key={pool.id ? pool.id : `pool-${index}`}
                              className="pool-image"
                              style={{
                                backgroundImage: pool.imageURL ? `url(pool.imageURL)` : "none",
                                backgroundRepeat: "no-repeat",
                                backgroundSize: "cover",
                                backgroundPosition: "center",
                              }}
                            />
                          );
                        } else return null;
                      })}
                      {pool.tokens.length > 2 ? (
                        <div className="pool-image">
                          <span>{`+ ${pool.tokens.length - 2}`}</span>
                        </div>
                      ) : null}
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </div>

        <div className="appbar-container">
          <AppBar position="static" className="appBarTabsToken">
            <Tabs
              TabIndicatorProps={{
                style: { background: "#64c89e", height: "3px" },
              }}
              value={creditPoolMenuSelection}
              className="tabsToken"
              onChange={(e, value) => setCreditPoolMenuSelection(value)}
            >
              {communityMenuOptions.map(name => {
                return <Tab label={name} key={name} />;
              })}
            </Tabs>
          </AppBar>
        </div>
        <div className="content">
          {creditPoolMenuSelection === 0 ? <GeneralCreditPool /> : <JarrCreditPool />}
        </div>

        {status ? <AlertMessage key={status.key} message={status.msg} variant={status.variant} /> : ""}
      </div>
      <CreatePostModal
        open={openModalNewCreditPoolPost}
        handleClose={handleCloseModalNewCreditPoolPost}
        creditPoolId={pool.id}
        type={"CreditPoolPost"}
      />
      <Dialog
        className="modalCreateModal"
        open={openModalViewAllPost}
        onClose={handleCloseModalViewAllPost}
        fullWidth={true}
        maxWidth={"md"}
      >
        <SeeAllPosts
          handleClose={handleCloseModalViewAllPost}
          title={"Pool Wall"}
          posts={pool.PostsArray}
          creator={pool.Creator}
          type={"CreditPost"}
          handleRefresh={() => { }}
          itemTypeId={pool.id}
        />
      </Dialog>
    </div>
  ) : (
    <div className="container">
      <h3>Credit pool not found</h3>
    </div>
  );
}
