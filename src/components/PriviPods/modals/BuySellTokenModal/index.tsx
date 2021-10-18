import React, { useEffect, useState, useRef } from "react";
import axios from "axios";

import { makeStyles } from "@material-ui/core";
import { useTypedSelector } from "store/reducers/Reducer";

import URL from "shared/functions/getURL";
import AlertMessage from "shared/ui-kit/Alert/AlertMessage";
import { formatNumber } from "shared/functions/commonFunctions";
import { buildJsxFromObject, handleSetStatus } from "shared/functions/commonFunctions";
import { Modal } from "shared/ui-kit";
import { SignatureRequestModal } from "shared/ui-kit/Modal/Modals";
import { IBuySellPodTokens, buyPodTokens, sellPodTokens } from "shared/services/API";
import { LoadingWrapper } from "shared/ui-kit/Hocs";
import InputWithLabelAndTooltip from "shared/ui-kit/InputWithLabelAndTooltip";
import Box from "shared/ui-kit/Box";

const useStyles = makeStyles(() => ({
    root: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#EAE8FA !important",
    },
    modalContent: {
        padding: "10px 20px",
        width: "100%",
    },
    title: {
        fontWeight: 800,
        fontSize: 22,
        color: "#181818",
        marginBottom: 8,
    },
    swapBtnSection: {
        display: "flex",
        alignItems: "center",
        marginTop: "8px",
        marginBottom: "8px",
    },
    swapButton: {
        width: "100%",
        fontSize: 16,
        margin: "16px 0px",
        height: 50,
        "& img": {
            width: 14,
            height: 14,
            marginLeft: 4,
        },
    },
    squareContainer: {
        padding: "20px 0",
        display: "flex",
        alignItems: "flex-start",
    },
    squareContainerLabel: {
        fontSize: 18,
        color: "#181818",
    },
    squareContainerInput: {
        padding: "6px 18px",
        border: "1px solid #ABB3C4",
        borderRadius: "6px",
        display: "flex",
        marginTop: "8px",
        alignItems: "center",
        "& img": {
            width: "25px",
            height: "25px",
        },
    },
    imageInput: {
        paddingLeft: 25,
    },
    balance: {
        marginTop: 8,
        fontSize: 14,
        color: "#707582",
    },
    error: {
        color: "red",
    },
    submit: {
        display: "flex",
        marginTop: 24,
        "& button": {
            width: "100%",
            padding: "9px 45px",
            fontSize: 16,
            height: 50,
        },
    },
    valueBox: {
        padding: "16px 0px",
        borderTop: "2px solid #18181822",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        width: "100%",
    },
    buttonSwap: {
        display: "flex",
        flexDirection: 'column',
        alignItems: "center",
        justifyContent: "space-between",
        borderRadius: "50%",
        background: "#181818",
        border: "1.5px solid #181818",
        boxSizing: "border-box",
        margin: "5px 16px 0px",
        height: "56px",
        minWidth: "56px",
        width: "56px",
        padding: "15px 0px",

        "& img": {
            height: "10px",
            "&:first-child": {
                transform: "rotate(90deg)",
            },
            "&:last-child": {
                transform: "rotate(-90deg)",
            },
        },
    },
}));

export default function BuySellTokenModal(props) {
    const classes = useStyles();

    const user = useTypedSelector(state => state.user);
    const userBalances = useTypedSelector(state => state.userBalances);

    const [disableSubmit, setDisableSubmit] = useState<boolean>(false);
    //set to true when we don't want the user to perform certain actions
    //to make sure the data is fully updated before doing anyting

    const [fundingQuantity, setFundingQuantity] = useState<number>(0);
    const [podQuantity, setPodQuantity] = useState<string>("");

    const [fee, setFee] = useState<number>(0);

    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [status, setStatus] = useState<any>("");
    const [isDataLoading, setIsDataLoading] = useState<boolean>(false);

    const payloadRef = useRef<any>({});
    const [openSignRequestModal, setOpenSignRequestModal] = useState<boolean>(false);
    const [signRequestModalDetail, setSignRequestModalDetail] = useState<any>(null);

    const [modalType, setModalType] = React.useState<string>(props.buyMode ? "buy" : "sell");

    // get pod token to receive in investment each time investing amount changes
    useEffect(() => {
        if (modalType && podQuantity) {
            if (modalType == "buy") {
                setDisableSubmit(true);
                const config = {
                    params: {
                        PodAddress: props.pod.PodAddress,
                        Amount: Number(podQuantity),
                    },
                };
                setIsDataLoading(true);
                axios
                    .get(`${URL()}/mediaPod/getBuyingPodFundingTokenAmount`, config)
                    .then(res => {
                        const resp = res.data;
                        let newFundintTokenAmount: number = 0;
                        if (resp.success) {
                            newFundintTokenAmount = resp.data;
                        }
                        setFundingQuantity(Number(newFundintTokenAmount.toFixed(4)));
                        setDisableSubmit(false);
                        setIsDataLoading(false);
                    })
                    .catch(() => {
                        setIsDataLoading(false);
                    });
            } else {
                setDisableSubmit(true);
                const config = {
                    params: {
                        PodAddress: props.pod.PodAddress,
                        Amount: Number(podQuantity),
                    },
                };
                setIsDataLoading(true);
                axios
                    .get(`${URL()}/mediaPod/getSellingPodFundingTokenAmount`, config)
                    .then(res => {
                        const resp = res.data;
                        let newFundintTokenAmount: number = 0;
                        if (resp.success) {
                            newFundintTokenAmount = resp.data;
                        }
                        setFundingQuantity(Number(newFundintTokenAmount.toFixed(4)));
                        setDisableSubmit(false);
                        setIsDataLoading(false);
                    })
                    .catch(() => {
                        setIsDataLoading(false);
                    });
            }
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [podQuantity, modalType]);

    const handleOpenSignatureModal = () => {
        const values = { podQuantity };
        const validatedErrors = validate(values);
        if (Object.keys(validatedErrors).length === 0) {
            const payload: IBuySellPodTokens = {
                PodAddress: props.pod.PodAddress,
                Amount: Number(podQuantity),
            };
            payloadRef.current = payload;
            setSignRequestModalDetail(buildJsxFromObject(payload));
            setOpenSignRequestModal(true);
        } else {
            setErrors(validatedErrors);
        }
    };

    const handleBuyOrSell = async () => {
        const payload = payloadRef.current;
        if (Object.keys(payload).length) {
            if (modalType === "buy") {
                setDisableSubmit(true);
                const buyResponse = await buyPodTokens("buyPodTokens", payload, {}, user.mnemonic);
                setDisableSubmit(false);
                if (buyResponse.success) {
                    handleSetStatus("buy success", "success", setStatus);
                    setTimeout(() => {
                        props.handleClose();
                        props.handleRefresh();
                        setStatus("");
                    }, 1000);
                } else {
                    handleSetStatus("buy failed", "error", setStatus);
                }
            } else {
                setDisableSubmit(true);
                const buyResponse = await sellPodTokens("sellPodTokens", payload, {}, user.mnemonic);
                setDisableSubmit(false);
                if (buyResponse.success) {
                    handleSetStatus("sell success", "success", setStatus);
                    setTimeout(() => {
                        props.handleClose();
                        props.handleRefresh();
                        setStatus("");
                    }, 1000);
                } else {
                    handleSetStatus("sell failed", "error", setStatus);
                }
            }
        }
    };

    function validate(values: { [key: string]: string }): { [key: string]: string } {
        var errors: { [key: string]: string } = {};

        if (values.podQuantity === null || !Number(values.podQuantity)) {
            errors.podQuantity = "invalid podQuantity";
        } else if (Number(values.podQuantity) === 0) {
            errors.podQuantity = "podQuantity cant be 0";
        } else if (Number(values.podQuantity) < 0) {
            errors.podQuantity = "podQuantity cant be negative";
        } else if (
            userBalances[props.pod.FundingToken] &&
            Number(values.fundingQuantity) > userBalances[props.pod.FundingToken].Balance
        ) {
            errors.fundingQuantity = "insufficient fund to invest";
        }
        return errors;
    }

    const SquareInvestTop = () => {
        return (
            <Box className={classes.squareContainer}>
                <Box width={1} mr={1}>
                    <Box className={classes.squareContainerLabel}>Pod Token</Box>
                    <Box className={classes.squareContainerInput}>
                        <img
                            src={
                                props.pod.FundingToken ? require(`assets/tokenImages/${props.pod.FundingToken}.png`) : "none"
                            }
                            alt="ETH"
                        />
                        <InputWithLabelAndTooltip
                            type="text"
                            overriedClasses={classes.imageInput}
                            inputValue={props.pod.FundingToken}
                            disabled
                        />
                    </Box>
                    <Box className={classes.balance}>
                        {`Available ${formatNumber(
                            userBalances[props.pod.FundingToken] ? userBalances[props.pod.FundingToken].Balance : 0,
                            props.pod.FundingToken,
                            4
                        )}`}
                    </Box>
                </Box>
                <Box width={1} ml={1}>
                    <Box className={classes.squareContainerLabel}>Amount</Box>
                    <InputWithLabelAndTooltip
                        overriedClasses=""
                        type="text"
                        inputValue={`${fundingQuantity}`}
                        disabled
                    />
                    {errors.fundingQuantity ? <Box className="error">{errors.fundingQuantity}</Box> : null}
                </Box>
            </Box>
        );
    };

    const SquareInvestBottom = () => {
        return (
            <Box className={classes.squareContainer}>
                <Box width={1} mr={1}>
                    <Box className={classes.squareContainerLabel}>Stablecoin</Box>
                    <Box className={classes.squareContainerInput}>
                        <img src={require("assets/icons/ETHToken.svg")} alt="BALToken" />
                        <InputWithLabelAndTooltip
                            type="text"
                            overriedClasses={classes.imageInput}
                            inputValue={props.pod.TokenSymbol}
                            disabled
                        />
                    </Box>
                    <Box className={classes.balance}>
                        {`Available ${formatNumber(
                            userBalances[props.pod.TokenSymbol] ? userBalances[props.pod.TokenSymbol].Balance : 0,
                            props.pod.TokenSymbol,
                            4
                        )}`}
                    </Box>
                </Box>
                <Box width={1} ml={1}>
                    <Box className={classes.squareContainerLabel}>Amount</Box>
                    <InputWithLabelAndTooltip
                        overriedClasses=""
                        type="number"
                        inputValue={podQuantity}
                        onInputValueChange={v => {
                            setPodQuantity(v.target.value);
                        }}
                    />
                    {errors.podQuantity ? <Box className={classes.error}>{errors.podQuantity}</Box> : null}
                </Box>
            </Box>
        );
    };

    return (
        <Modal
            size="medium"
            isOpen={props.open}
            onClose={props.handleClose}
            className={classes.root}
            showCloseIcon
        >
            <Box className={classes.modalContent}>
                <SignatureRequestModal
                    open={openSignRequestModal}
                    address={user.address}
                    transactionFee="0.0000"
                    detail={signRequestModalDetail}
                    handleOk={handleBuyOrSell}
                    handleClose={() => setOpenSignRequestModal(false)}
                />
                <Box className={classes.title}>
                    {modalType === "buy" ? "Buy Media Pod Token" : "Sell Media Pod Token"}
                </Box>
                <LoadingWrapper loading={isDataLoading}>
                    {modalType === "buy" ? <SquareInvestTop /> : <SquareInvestBottom />}
                </LoadingWrapper>
                <Box className={classes.swapBtnSection}>
                    <button
                        onClick={() => {
                            const type = modalType === "buy" ? "sell" : "buy";
                            setModalType(type);
                        }}
                        className={classes.buttonSwap}
                    >
                        <img src={require("assets/icons/arrow_white.png")} alt="_white" />
                        <img src={require("assets/icons/arrow_white.png")} alt="arrow" />
                    </button>
                    <Box className={classes.balance} color="black !important" ml={1}>
                        Swap to {modalType === "buy" ? <b>sell</b> : <b>buy</b>} instead
                    </Box>
                </Box>
                <LoadingWrapper loading={isDataLoading}>
                    {modalType === "buy" ? <SquareInvestBottom /> : <SquareInvestTop />}
                </LoadingWrapper>

                <Box className={classes.valueBox}>
                    <Box className={classes.squareContainerLabel}>Estimated fee</Box>
                    <Box textAlign="end">
                        <Box className={classes.squareContainerLabel}>{`USDT ${fee}`}</Box>
                        <Box className={classes.balance}>($2.62)</Box>
                    </Box>
                </Box>
                <Box className={classes.valueBox} style={{ borderBottom: "2px solid #18181822" }}>
                    <Box className={classes.squareContainerLabel}>Total</Box>
                    <Box textAlign="end">
                        <Box className={classes.squareContainerLabel}>{`USDT ${fee}`}</Box>
                        <Box className={classes.balance}>($68.20)</Box>
                    </Box>
                </Box>

                <Box className={classes.submit}>
                    <button onClick={handleOpenSignatureModal} disabled={disableSubmit}>
                        {modalType === "buy" ? "Buy to Invest" : "Sell Position"}
                    </button>
                </Box>
                {status ? <AlertMessage key={status.key} message={status.msg} variant={status.variant} /> : ""}
            </Box>
        </Modal>
    );
}
