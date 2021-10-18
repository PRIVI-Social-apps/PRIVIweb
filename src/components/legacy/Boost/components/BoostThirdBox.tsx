import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "store/reducers/Reducer";
import RewardsGraph from "./RewardsGraph";
import "./BoostThirdBox.css";
import { trackPromise } from "react-promise-tracker";
import URL from "shared/functions/getURL";
import axios from "axios";
import RewardRow from "./RewardRow";


export default function Boost() {
    //store
    const user = useSelector((state: RootState) => state.user);
    const users = useSelector((state: RootState) => state.usersInfoList);
    const foundUser = users.find((u) => u.id == user.id);

    //hooks
    const [currPoints, setCurrPoints] = useState<number>(0);
    const [history, setHistory] = useState<any[]>([]);
    const [remainingPoints, setRemainingPoints] = useState<number>(0);

    useEffect(() => {
        if (user && user.id) {
            const config = {
                params: {
                    publicId: user.id
                }
            };
            trackPromise(
                axios.get(`${URL()}/user/pointsInfo`, config)
                    .then((res) => {
                        const resp = res.data;
                        if (resp.success) {
                            const data = resp.data;
                            setCurrPoints(data.currPoints);
                            setRemainingPoints(data.remainingPoints);

                            const newHistory: any = [...data.history];
                            newHistory.forEach((history, index) => {
                                const foundUser = users.find((u) => u.id == history.user);
                                if (foundUser) newHistory[index] = {
                                    ...history,
                                    imageURL: foundUser.imageURL,
                                    name: foundUser.name
                                }
                            });
                            setHistory(newHistory);
                        }
                    })
                    .catch((error) => {
                        console.log(error);
                    })
            );
        }
    }, [user]);

    return (
        <div className="box third-box">
            <div className="top">
                <h3>Hourly rewards</h3>
                <RewardsGraph />
                <div className="row">
                    <div className="column">
                        <span>Current points</span>
                        <h5>{currPoints}</h5>
                    </div>
                    <div className="column">
                        <span>To be in 10%</span>
                        <h5>{remainingPoints}</h5>
                    </div>
                </div>
            </div>
            <div className="bottom">
                <span>Latest rewards</span>
                {
                    history.length > 0 ?
                        history.map((reward, index) => (
                            <RewardRow reward={reward} key={index} foundUser={foundUser}></RewardRow>
                        )) :
                        <p>No data</p>
                }
            </div>
        </div>)

}
