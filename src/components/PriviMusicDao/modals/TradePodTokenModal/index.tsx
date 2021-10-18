import React, { useEffect, useState, useRef } from "react";
import { makeStyles } from "@material-ui/core";
import { useTypedSelector } from "store/reducers/Reducer";
import { formatNumber } from "shared/functions/commonFunctions";
import { buildJsxFromObject } from "shared/functions/commonFunctions";
import { Modal } from "shared/ui-kit";
import { SignatureRequestModal } from "shared/ui-kit/Modal/Modals";
import { musicDaoBuyPodTokens, musicDaoSellPodTokens, musicDaoInvestPod, musicDaoGetBuyingPodFundingTokenAmount, musicDaoGetSellingPodFundingTokenAmount } from "shared/services/API";
import InputWithLabelAndTooltip from "shared/ui-kit/InputWithLabelAndTooltip";
import Box from "shared/ui-kit/Box";
import { useAlertMessage } from "shared/hooks/useAlertMessage";
import { useTokenConversion } from "shared/contexts/TokenConversionContext";


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

export default function TradePodTokenModal({open, mode, setMode, pod, handleClose, handleRefresh}) {
    const classes = useStyles();
    const { showAlertMessage } = useAlertMessage();
    const { convertTokenToUSD } = useTokenConversion();
    const user = useTypedSelector(state => state.user);
    const userBalances = useTypedSelector(state => state.userBalances);

    const [disableSubmit, setDisableSubmit] = useState<boolean>(false);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    const [fundingQuantity, setFundingQuantity] = useState<number>(0);
    const [podQuantity, setPodQuantity] = useState<string>("");

    const [fee, setFee] = useState<number>(0);

    const payloadRef = useRef<any>({});
    const [openSignRequestModal, setOpenSignRequestModal] = useState<boolean>(false);
    const [signRequestModalDetail, setSignRequestModalDetail] = useState<any>(null);

    // get pod token to receive in investment each time investing amount changes
    useEffect(() => {
        if (mode && podQuantity) {
            let fundingAmount = 0;
            if (mode == "buy") {
                setDisableSubmit(true);
                musicDaoGetBuyingPodFundingTokenAmount(pod.PodAddress, Number(podQuantity)).then(resp => {
                    if (resp.success) {
                        fundingAmount = Number(resp.data.toFixed(4));
                    }
                    setDisableSubmit(false);
                }).catch((e) => {
                    showAlertMessage(e, { variant: "error" });
                    setDisableSubmit(false);
                });
            } 
            else if (mode == "sell") {
                setDisableSubmit(true);
                musicDaoGetSellingPodFundingTokenAmount(pod.PodAddress, Number(podQuantity)).then(resp => {
                    if (resp.success) {
                        fundingAmount = Number(resp.data.toFixed(4));
                    }
                    setDisableSubmit(false);
                }).catch((e) => {
                    showAlertMessage(e, { variant: "error" });
                    setDisableSubmit(false);
                });
            }
            // investing
            else fundingAmount = (Number(podQuantity) * pod.FundingTokenPrice ?? 0);
            setFundingQuantity(fundingAmount)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [podQuantity, mode]);

    const handleOpenSignatureModal = () => {
        const values = { podQuantity };
        const validatedErrors = validate(values);
        if (Object.keys(validatedErrors).length === 0) {
            let payload;
            if (mode == "invest") payload = {
                Investor: user.address,
                PodAddress: pod.PodAddress,
                Amount: Number(podQuantity)
            }
            else payload = {
                PodAddress: pod.PodAddress,
                Amount: Number(podQuantity),
            };
            if (payload) {
                payloadRef.current = payload;
                setSignRequestModalDetail(buildJsxFromObject(payload));
                setOpenSignRequestModal(true);
            }
        } else {
            setErrors(validatedErrors);
        }
    };

    const closeAndRefresh = () => {
        setTimeout(() => {
            handleClose();
            handleRefresh();
        }, 1000);
    }

    const handleBuyOrSell = async () => {
        const payload = payloadRef.current;
        if (Object.keys(payload).length) {
            if (mode === "buy") {
                setDisableSubmit(true);
                const buyResponse = await musicDaoBuyPodTokens(payload, {});
                setDisableSubmit(false);
                if (buyResponse.success) {
                    showAlertMessage(`buy success`, { variant: "success" });
                    closeAndRefresh();
                } else {
                    showAlertMessage(`buy failed`, { variant: "error" });
                }
            } 
            else if (mode == "sell") {
                setDisableSubmit(true);
                const buyResponse = await musicDaoSellPodTokens(payload, {});
                setDisableSubmit(false);
                if (buyResponse.success) {
                    showAlertMessage(`sell success`, { variant: "success" });
                    closeAndRefresh();
                } else {
                    showAlertMessage(`sell failed`, { variant: "error" });
                }
            }
            else {
                setDisableSubmit(true);
                const buyResponse = await musicDaoInvestPod(payload, {});
                setDisableSubmit(false);
                if (buyResponse.success) {
                    showAlertMessage(`invest success`, { variant: "success" });
                    closeAndRefresh();
                } else {
                    showAlertMessage(`invest failed`, { variant: "error" });
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
            userBalances[pod.FundingToken] &&
            Number(values.fundingQuantity) > userBalances[pod.FundingToken].Balance
        ) {
            errors.fundingQuantity = "insufficient fund to invest";
        }
        return errors;
    }

    const SquareInvestTop = () => {
        return (
            <Box className={classes.squareContainer}>
                <Box width={1} mr={1}>
                    <Box className={classes.squareContainerLabel}>Stablecoin</Box>
                    <Box className={classes.squareContainerInput}>
                        <img
                            src={
                                pod.FundingToken ? require(`assets/tokenImages/${pod.FundingToken}.png`) : "none"
                            }
                            alt="ETH"
                        />
                        <InputWithLabelAndTooltip
                            type="text"
                            overriedClasses={classes.imageInput}
                            inputValue={pod.FundingToken}
                            disabled
                        />
                    </Box>
                    <Box className={classes.balance}>
                        {`Available ${formatNumber(
                            userBalances[pod.FundingToken] ? userBalances[pod.FundingToken].Balance : 0,
                            pod.FundingToken,
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
                    <Box className={classes.squareContainerLabel}>Pod Token</Box>
                    <Box className={classes.squareContainerInput}>
                        <img src={require("assets/icons/ETHToken.svg")} alt="BALToken" />
                        <InputWithLabelAndTooltip
                            type="text"
                            overriedClasses={classes.imageInput}
                            inputValue={pod.TokenSymbol}
                            disabled
                        />
                    </Box>
                    <Box className={classes.balance}>
                        {`Available ${formatNumber(
                            userBalances[pod.TokenSymbol] ? userBalances[pod.TokenSymbol].Balance : 0,
                            pod.TokenSymbol,
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
            isOpen={open}
            onClose={handleClose}
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
                    {mode.charAt(0).toUpperCase() + mode.slice(1)} Media Pod Token
                </Box>
                {mode === "buy" ? <SquareInvestTop /> : <SquareInvestBottom />}
                {mode !== "invest" && <Box className={classes.swapBtnSection}>
                    <button
                        onClick={() => setMode(mode === "buy" ? "sell" : "buy")}
                        className={classes.buttonSwap}
                    >
                        <img src={require("assets/icons/arrow_white.png")} alt="_white" />
                        <img src={require("assets/icons/arrow_white.png")} alt="arrow" />
                    </button>
                    <Box className={classes.balance} color="black !important" ml={1}>
                        Swap to {mode === "buy" ? <b>sell</b> : <b>buy</b>} instead
                    </Box>
                </Box>}
                {mode === "buy" ? <SquareInvestBottom /> : <SquareInvestTop />}
                <Box className={classes.valueBox}>
                    <Box className={classes.squareContainerLabel}>Estimated fee</Box>
                    <Box textAlign="end">
                        <Box className={classes.squareContainerLabel}>{`${pod.FundingToken} ${fee}`}</Box>
                        <Box className={classes.balance}>({formatNumber(convertTokenToUSD(pod.FundingToken, fee), "USD", 4)})</Box>
                    </Box>
                </Box>
                <Box className={classes.valueBox} style={{ borderBottom: "2px solid #18181822" }}>
                    <Box className={classes.squareContainerLabel}>Total</Box>
                    <Box textAlign="end">
                        <Box className={classes.squareContainerLabel}>{`${pod.FundingToken} ${fee + Number(fundingQuantity)}`}</Box>
                        <Box className={classes.balance}>({formatNumber(convertTokenToUSD(pod.FundingToken, fee + Number(fundingQuantity)), "USD", 4)})</Box>
                    </Box>
                </Box>

                <Box className={classes.submit}>
                    <button onClick={handleOpenSignatureModal} disabled={disableSubmit}>
                        {mode === "invest" ? "Invest" : mode == "buy"? "Buy Token" : "Sell Position"}
                    </button>
                </Box>
            </Box>
        </Modal>
    );
}
