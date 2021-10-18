import React, { useState, useEffect } from "react";
import axios from "axios";
import { trackPromise } from "react-promise-tracker";
import { useDispatch } from "react-redux";

import { Modal } from "@material-ui/core";

import { useTypedSelector } from "store/reducers/Reducer";
import { setMyPodsList, setMyPodsLoading } from "store/actions/PodsManager";

import URL from "shared/functions/getURL";
import { LoadingWrapper } from "shared/ui-kit/Hocs/LoadingWrapper";

import SvgIcon from "@material-ui/core/SvgIcon";
import { ReactComponent as CloseSolid } from "assets/icons/close-solid.svg";
//import AlertMessage from "../../AlertMessage";

export default function InsurePod(props: any) {
  const dispatch = useDispatch();
  const user = useTypedSelector(state => state.user);
  //const myPodsList = useTypedSelector((state) => state.myPodsList.list);
  const myPodsLoading = useTypedSelector(state => state.myPodsLoading.bool);

  const [myPodsFullList, setMyPodsFullList] = useState<any[]>([]);

  const [selectedPod, setSelectedPod] = useState<string>("");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  //const [status, setStatusBase] = React.useState<any>('');

  useEffect(() => {
    getFTPodsInformation(user);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getFTPodsInformation = user => {
    dispatch(setMyPodsLoading(true));
    trackPromise(
      axios
        .get(`${URL()}/pod/FT/getAllPodsInfo/${user.id}`)
        .then(response => {
          if (response.data.success) {
            let data = response.data.data;

            dispatch(setMyPodsList(data.myFTPods));
            setMyPodsFullList(data.myFTPods);
            dispatch(setMyPodsLoading(false));
          }
        })
        .catch(error => {
          console.log(error);
          // alert('Error getting basic Info');
        })
    );
  };

  /*const getNFTPodsInformation = (user) => {
    dispatch(setMyPodsLoading(true));
    trackPromise(
      axios
        .get(`${URL()}/pod/NFT/getAllPodsInfo/${user.id}`)
        .then((response) => {
          if (response.data.success) {
            let data = response.data.data;

            dispatch(setMyPodsList(data.myNFTPods));
            setMyPodsFullList(data.myNFTPods);
            dispatch(setMyPodsLoading(false));
          }
        })
        .catch((error) => {
          console.log(error);
        })
    );
  };*/

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    let values = { selectedPod };
    let validatedErrors = validate(values);
    setErrors(validatedErrors);
    if (Object.keys(validatedErrors).length === 0) {
      console.log("no errors, send insurance offer request now");
      //TODO: send info to insurer (selectedPod == podId to insure)
    }
  };

  function validate(values: { [key: string]: string }): { [key: string]: string } {
    var errors: { [key: string]: string } = {};

    if (selectedPod === "") {
      errors.selectedPod = "select a valid pod";
    }

    return errors;
  }

  return (
    <Modal
      open={props.open}
      onClose={props.handleClose}
      aria-labelledby="simple-modal-title"
      aria-describedby="simple-modal-description"
      className="modal"
    >
      <div className="modal-box insure-pod-modal">
        <span className="close-button" onClick={props.handleClose}>
          <SvgIcon><CloseSolid /></SvgIcon>
        </span>
        <LoadingWrapper loading={myPodsLoading}>
          {myPodsFullList.length > 0 ? (
            <div>
              <h3>INSURE POD</h3>
              <form onSubmit={handleSubmit}>
                <div className="v">
                  <label>
                    Select a pod:
                    <select
                      name="pod"
                      value={selectedPod}
                      id="pod"
                      onChange={v => setSelectedPod(v.target.value)}
                      required
                    >
                      {myPodsFullList.map((pod: any) => {
                        return (
                          <option value={pod.id} key={pod.id}>
                            {pod.name}
                          </option>
                        );
                      })}
                    </select>
                  </label>
                  {errors.selectedPod ? <div className="error">{errors.selectedPod}</div> : null}
                </div>
                <div className={"container marginTopDown10px"}>
                  <button type="submit">APPLY</button>
                </div>
              </form>
            </div>
          ) : (
            <h2>No pods to insure</h2>
          )}
        </LoadingWrapper>
        {/*status ? (
          <AlertMessage
            key={status.key}
            message={status.msg}
            variant={status.variant}
          />
        ) : (
          ''
        )*/}
      </div>
    </Modal>
  );
} // Deposit
