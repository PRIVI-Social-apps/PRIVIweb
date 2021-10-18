import React, {useEffect, useState} from "react";
import "./ThreadCard.css";
import ThreadModal from "../modals/ThreadModal";
import URL from "shared/functions/getURL";
import {useSelector} from "react-redux";
import {RootState} from "store/reducers/Reducer";
import { UserInfo } from "store/actions/UsersInfo";

export default function ThreadCard(props) {
  const users = useSelector((state: RootState) => state.usersInfoList);

  const [openThreadModal, setOpenThreadModal] = useState<boolean>(false);
  const [creatorName, setCreatorName] = useState<string>('');
  const [createdByPhoto, setCreatedByPhoto] = useState<string>('');

  const handleOpenThreadModal = () => {
    setOpenThreadModal(true);
  };

  const handleCloseThreadModal = () => {
    setOpenThreadModal(false);
  };

  useEffect(() => {
    let user : any = users.find(usr => usr.id === props.thread.createdBy);
    setCreatedByPhoto(user.url);
    setCreatorName(user.name);
  }, [props.thread]);

  return (
    <>
      <div className="thread-card" onClick={handleOpenThreadModal}>
        <div className="thread-card-left">
          <div className="avatar-container">
            <div
              className="avatar"
              style={{
                backgroundImage: `url(${createdByPhoto})`,
                backgroundRepeat: "no-repeat",
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              <span className={"online"}></span>
            </div>
          </div>
          <div className="thread-info">
            <div className="creator">{creatorName}</div>
            <div className="info">
              <span className="creator-id">@{props.thread.user.name}</span>
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path
                  d="M13.9369 6.60355C14.1321 6.40829 14.1321 6.09171 13.9369 5.89645C13.7416 5.70118 13.425 5.70118 13.2298 5.89645L13.9369 6.60355ZM7.16665 12.6667L6.8131 13.0202C7.00836 13.2155 7.32494 13.2155 7.5202 13.0202L7.16665 12.6667ZM4.77016 9.56311C4.5749 9.36785 4.25832 9.36785 4.06306 9.56312C3.86779 9.75838 3.8678 10.075 4.06306 10.2702L4.77016 9.56311ZM13.2298 5.89645L6.8131 12.3131L7.5202 13.0202L13.9369 6.60355L13.2298 5.89645ZM4.06306 10.2702L6.8131 13.0202L7.5202 12.3131L4.77016 9.56311L4.06306 10.2702ZM16.75 9C16.75 13.2802 13.2802 16.75 9 16.75V17.75C13.8325 17.75 17.75 13.8325 17.75 9H16.75ZM9 16.75C4.71979 16.75 1.25 13.2802 1.25 9H0.25C0.25 13.8325 4.16751 17.75 9 17.75V16.75ZM1.25 9C1.25 4.71979 4.71979 1.25 9 1.25V0.25C4.16751 0.25 0.25 4.16751 0.25 9H1.25ZM9 1.25C13.2802 1.25 16.75 4.71979 16.75 9H17.75C17.75 4.16751 13.8325 0.25 9 0.25V1.25Z"
                  fill="#707582"
                />
              </svg>
              <div className="level">level1</div>
            </div>
          </div>
        </div>
        <span className="thread-text">{props.thread.textShort}</span>
      </div>
      {openThreadModal && (
        <ThreadModal open={openThreadModal} onClose={handleCloseThreadModal} thread={props.thread} />
      )}
    </>
  );
}
