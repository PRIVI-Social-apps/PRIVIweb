import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";

import { makeStyles, Divider } from "@material-ui/core";

import URL from "shared/functions/getURL";
import AlertMessage from "shared/ui-kit/Alert/AlertMessage";
import { signTransaction } from "shared/functions/signTransaction";
import { RootState } from "store/reducers/Reducer";
import Box from "shared/ui-kit/Box";
import { getRandomAvatarForUserIdWithMemoization } from "shared/services/user/getUserAvatar";
import { Avatar, Modal, PrimaryButton } from "shared/ui-kit";
import { TokenSelect } from "shared/ui-kit/Select/TokenSelect";
import InputWithLabelAndTooltip from "shared/ui-kit/InputWithLabelAndTooltip";

const useStyles = makeStyles(() => ({
    modalContainer: {
        backgroundColor: "#EAE8FA !important",
    },
    title: {
        fontWeight: 700,
        fontSize: "22px",
        lineHeight: "104.5%",
        fontFamily: "Agrandir",
        color: "#181818",
    },
    digitalArt: {
        fontWeight: 400,
        fontSize: "30px",
        lineHeight: "31.35px",
        fontFamily: "Agrandir",
        marginBottom: 10,
    },
    divider: {
        opacity: 0.2,
        background: "#707582",
        border: "1px solid #707582",
        transform: "rotate(90deg)",
    },
    currentPrice: {
        fontWeight: 800,
        fontSize: "18px",
        lineHeight: "104.5%",
        color: "#181818",
    },
    fractionaliseButton: {
        background: "#181818",
        color: "white",
        fontSize: "22.8px",
        height: "56px",
        fontWeight: 700,
        fontFamily: "Agrandir",
        lineHeight: "30px",
        borderRadius: "14px",
        width: "100%",
        marginTop: "40px",
        marginBottom: "40px",
        textTransform: "none",
    },
    roundInputBox: {
        background: "#F7F9FE",
        border: "1px solid #707582",
        boxSizing: "border-box",
        borderRadius: "11.36px",
        width: "100%",
    },
    contractAddress: {
        color: "#7F6FFF",
        paddingLeft: "4px",
        fontSize: 14,
    },
    tokenName: {
        fontSize: "18px",
        lineHeight: "104.5%",
        color: "#181818",
    },
    tokenImg: {
        width: "24px",
        height: "24px",
    },
    pText: {
        fontSize: 14,
        marginTop: 15,
        marginBottom: 0,
    },
    labelTitle1: {
        fontWeight: 800,
        fontSize: "18px",
        lineHeight: "18px",
        color: "#181818",
    },
    labelPrice: {
        fontWeight: 400,
        fontSize: "22px",
        lineHeight: "104.5%",
        color: "#181818",
    },
    labelTitle2: {
        fontWeight: 400,
        fontSize: "18px",
        lineHeight: "18px",
        color: "#181818",
        marginBottom: "6px",
    },
    labelDescription: {
        fontWeight: 400,
        fontSize: "14px",
        lineHeight: "16px",
        color: "#707582",
        margin: 0,
    },
}));

const CreateOffer = (props: any) => {
    const classes = useStyles();

    const user = useSelector((state: RootState) => state.user);
    const users = useSelector((state: RootState) => state.usersInfoList);
    const userBalances = useSelector((state: RootState) => state.userBalances);

    const [media, setMedia] = useState<any>({
        MediaName: "",
        OwnerName: "Unknown",
        OwnerImgUrl: "none",
        TokenSymbol: "",
        Address: "Unknown",
        Ownership: 0,
    });

    const [tokenList, setTokenList] = useState<string[]>([]);
    const [selectedFraction, setSelectedFraction] = useState<number>(0.5);
    const [selectedPrice, setSelectedPrice] = useState<number>(1);
    const [selectedToken, setSelectedToken] = useState("");

    const [disabled, setDisabled] = useState<boolean>(false);
    const [status, setStatus] = useState<any>("");

    useEffect(() => {
        axios.get(`${URL()}/wallet/getCryptosRateAsList`).then(res => {
            const resp = res.data;
            if (resp.success) {
                const tokenList: string[] = []; // list of tokens
                const data = resp.data;
                data.forEach(rateObj => {
                    tokenList.push(rateObj.token);
                });
                setSelectedToken(tokenList[0]);
                setTokenList(tokenList);
            }
        });
    }, []);

    // TODO: need to be completed to also addapt pod media structure
    useEffect(() => {
        const newMedia = { ...media };
        if (props.media) {
            if (props.media.MediaName) newMedia.MediaName = props.media.MediaName;
            if (props.media.CreatorId) {
                const foundUser = users.find(user => user.id == props.media.CreatorId);
                if (foundUser) {
                    newMedia.OwnerName = foundUser.name;
                    newMedia.OwnerImgUrl = foundUser.imageURL;
                }
                if (props.media.CreatorId == user.id) newMedia.OwnerName = "You";
            }
            if (props.media.MediaSymbol) newMedia.TokenSymbol = props.media.MediaSymbol;
            if (props.media.Fractionalise && props.media.Fractionalise.PodAddress)
                newMedia.Address = props.media.Fractionalise.PodAddress;
            if (userBalances && props.media.MediaSymbol && userBalances[props.media.MediaSymbol]) {
                newMedia.Ownership = userBalances[props.media.MediaSymbol].Balance;
            }
        }
        setMedia(newMedia);
    }, [props.media, userBalances, user.id]);

    const updateStatus = (msg, variant) => {
        if (variant == "success") props.handleRefresh();
        setStatus({
            msg: msg,
            key: Math.random(),
            variant: variant,
        });
        window.setTimeout(() => {
            if (variant == "success") props.handleClose();
            setStatus("");
        }, 2000);
    };

    const handlePlaceOrder = async () => {
        if (props.isBuy) {
            const offer = {
                Amount: selectedFraction,
                Price: selectedPrice,
                Token: selectedToken,
                TokenSymbol: media.TokenSymbol,
                MediaType: media.Type,
                BAddress: user.address,
            };
            const body: any = {
                Offer: offer,
            };
            const [hash, signature] = await signTransaction(user.mnemonic, body);
            body.Hash = hash;
            body.Signature = signature;
            axios
                .post(`${URL()}/media/newBuyOrder`, body)
                .then(async response => {
                    const resp: any = response.data;
                    setDisabled(false);
                    if (resp.success) {
                        updateStatus("order placed", "success");
                    } else {
                        updateStatus("order creation failed", "error");
                    }
                })
                .catch(err => {
                    console.log(err);
                });
        } else {
            const offer = {
                Amount: selectedFraction,
                Price: selectedPrice,
                Token: selectedToken,
                TokenSymbol: media.TokenSymbol,
                MediaType: media.Type,
                SAddress: user.address,
            };
            const body: any = {
                Offer: offer,
            };
            const [hash, signature] = await signTransaction(user.mnemonic, body);
            body.Hash = hash;
            body.Signature = signature;
            axios
                .post(`${URL()}/media/newSellOrder`, body)
                .then(async response => {
                    const resp: any = response.data;
                    setDisabled(false);
                    if (resp.success) {
                        updateStatus("order placed", "success");
                    } else {
                        updateStatus("order creation failed", "error");
                    }
                })
                .catch(err => {
                    console.log(err);
                });
        }
    };

    return (
        <Modal
            className={classes.modalContainer}
            size="small"
            isOpen={props.open}
            onClose={() => props.handleClose()}
            showCloseIcon
        >
            <Box>
                <Box className={classes.title}>Create Selling Offer</Box>
                <Box className={classes.digitalArt} mt={2}>
                    {media.MediaName || "Untitled Media"}
                </Box>
                <Box display="flex" style={{ alignItems: "center" }}>
                    <Avatar
                        size="small"
                        url={
                            media.OwnerImgUrl
                                ? `url(${media.OwnerImgUrl})`
                                : getRandomAvatarForUserIdWithMemoization(media.id)
                        }
                        alt=""
                    />
                    <Box display="flex" ml={1}>
                        <p className={classes.pText}>Owned by </p>
                        <p className={classes.contractAddress}> {media.OwnerName}</p>
                    </Box>
                </Box>
                <p className={classes.pText}>Token ID: {media.TokenSymbol} </p>
                <Box display="flex">
                    <p className={classes.pText}>Contract Address: </p>
                    <p className={classes.contractAddress}>{media.Address}</p>
                </Box>
                <Divider />
                <Box display="flex">
                    <Box width={1}>
                        <Box flexDirection="row">
                            <p className={classes.labelTitle1}>Fraction Ownership</p>
                            <p className={classes.labelPrice}>{`${media.Ownership * 100}%`}</p>
                        </Box>
                    </Box>
                </Box>
                <Divider />
                <Box display="flex" p={1} style={{ alignItems: "flex-end" }}>
                    <Box width={1}>
                        <Box flexDirection="row">
                            <p className={classes.labelTitle2}>Fractions To Sell</p>
                            <p className={classes.labelDescription}>Fraction of the token expressed as %</p>
                        </Box>
                    </Box>
                    <Box width={1}>
                        <InputWithLabelAndTooltip
                            type="text"
                            inputValue={`${selectedFraction * 100}%`}
                            onInputValueChange={e => {
                                let str: any = e.target.value;
                                str = str.replaceAll("%", "");
                                let newFraction = Math.min(1, Number(str) / 100);
                                if (!props.isBuy) newFraction = Math.min(media.Ownership, newFraction);
                                setSelectedFraction(newFraction);
                            }}
                            style={{ marginBottom: 0, height: '50px' }}
                        />
                    </Box>
                </Box>
                <Box display="flex" p={1} style={{ alignItems: "flex-end" }}>
                    <Box width={1}>
                        <Box flexDirection="row">
                            <p className={classes.labelTitle2}>Fraction Price</p>
                            <p className={classes.labelDescription}>Initial price per 1% of the token</p>
                        </Box>
                    </Box>
                    <Box width={1}>
                        <Box display="flex" style={{ textAlign: "center", alignItems: "center", marginTop: "16px" }}>
                            <Box width={1} mr={1}>
                                <InputWithLabelAndTooltip
                                    type="number"
                                    inputValue={selectedPrice}
                                    onInputValueChange={e => setSelectedPrice(Number(e.target.value))}
                                    style={{ marginBottom: 0, marginTop: 0, height: '50px' }}
                                />
                            </Box>
                            <Box width={1}>
                                <TokenSelect
                                    tokens={tokenList}
                                    value={selectedToken}
                                    onChange={e => {
                                        setSelectedToken(e.target.value as string);
                                    }}
                                />
                            </Box>
                        </Box>
                    </Box>
                </Box>
                <Box display="flex" mt={4}>
                    <PrimaryButton size="medium" onClick={handlePlaceOrder} style={{ width: "100%" }}>
                        Buy Fraction
                    </PrimaryButton>
                </Box>
                {status ? <AlertMessage key={status.key} message={status.msg} variant={status.variant} /> : ""}
            </Box>
        </Modal>
    );
};

export default CreateOffer;
