import React, { useState } from "react";
import DateFnsUtils from "@date-io/date-fns";
import axios from "axios";
import { useSelector } from "react-redux";
import { Fade, Tooltip } from "@material-ui/core";
import { KeyboardDatePicker, KeyboardTimePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import Grid from "@material-ui/core/Grid";
import { RootState } from "store/reducers/Reducer";
import URL from "shared/functions/getURL";
import { SignatureRequestModal } from "shared/ui-kit/Modal/Modals";
import StyledCheckbox from "shared/ui-kit/Checkbox";
import { Color, Modal, PrimaryButton, SecondaryButton } from "shared/ui-kit";
import AlertMessage from "shared/ui-kit/Alert/AlertMessage";
import { LoadingWrapper } from "shared/ui-kit/Hocs";

import InputWithLabelAndTooltip from "shared/ui-kit/InputWithLabelAndTooltip";
import { mediaTermsModalStyles } from "./index.styles";
import Box from "shared/ui-kit/Box";
import { InfoIcon } from "shared/ui-kit/Icons";
import FileUpload from "shared/ui-kit/Page-components/FileUpload";
import { TokenSelect } from "shared/ui-kit/Select/TokenSelect";
const dateIcon = require("assets/icons/date.svg");
const timeIcon = require("assets/icons/time.svg");

const MediaTermsModal = (props: any) => {
    const userSelector = useSelector((state: RootState) => state.user);

    const [tabMediaTerms, setTabMediaTerms] = useState<number>(0);
    const [isDataLoading, setIsDataLoading] = useState<boolean>(false);

    const classes = mediaTermsModalStyles();

    const [tokens, setTokens] = useState<string[]>([]);

    const [media, setMedia] = useState<any>({
        title: "",
        description: "",
        Price: 0,
        PricePerSecond: 0,
        Record: false,
        Payment: "Free",
        RecordPaymentType: "Free",
        ReleaseDate: new Date().getTime(),
        ReleaseHour: new Date().getTime(),
        Token: "BAL",
        ExclusivePermissions: false,
        Rewards: [],
        Copies: 0,
        RecordToken: "BAL",
        RecordPrice: 0,
        RecordPricePerSecond: 0,
        RecordCopies: 0,
        RecordRoyalty: 0,
    });

    const [upload, setUpload] = useState<any>(null);
    const [uploadImg, setUploadImg] = useState<any>(null);
    const [upload1, setUpload1] = useState<any>(null);
    const [uploadImg1, setUploadImg1] = useState<any>(null);

    const [status, setStatus] = useState<any>("");

    const [photo, setPhoto] = useState<any>(null);
    const [photoImg, setPhotoImg] = useState<any>(null);

    // rewards tab
    const [rewardTokenList, setRewardTokenList] = useState<string[]>([
        "Crypto",
        "NFT Tokens",
        "FT Tokens",
        "Social",
    ]);
    const [rewardToken, setRewardTokenName] = useState<string>("");

    const [openSignRequestModal, setOpenSignRequestModal] = useState<boolean>(false);
    const [signRequestModalDetail, setSignRequestModalDetail] = useState<any>(null);

    // get token list from backend
    React.useEffect(() => {
        axios.get(`${URL()}/wallet/getCryptosRateAsList`).then(res => {
            const resp = res.data;
            if (resp.success) {
                const tokenList: string[] = []; // list of tokens
                const tokenRatesObj: {} = {}; // tokenRates
                const data = resp.data;
                data.forEach(rateObj => {
                    tokenList.push(rateObj.token);
                    tokenRatesObj[rateObj.token] = rateObj.rate;
                });
                setTokens(data); // update token list
                setMedia(prev => ({ ...prev, Token: tokenList[0] })); // initial (default) collateral selection
            }
        });
    }, []);

    const saveProgress = () => { };

    const handleOpenSignatureModal = () => { };

    const registerConditions = async () => { };

    function renderInputCreateModal(p) {
        return (
            <Box mt={2}>
                <Box className={classes.flexBox} justifyContent="space-between">
                    <Box className={classes.header1}>{p.name}</Box>
                    <Tooltip TransitionComponent={Fade} TransitionProps={{ timeout: 600 }} arrow title={""}>
                        <InfoIcon style={{ color: "#2D3047", width: "14px" }} />
                    </Tooltip>
                </Box>
                <Box className={classes.inputBox} mt={1}>
                    <Box className={classes.flexBox} justifyContent="space-between" height="50px">
                        <InputWithLabelAndTooltip
                            style={{ background: "transparent", marginTop: 0, marginBottom: 0, border: "none" }}
                            type={p.type}
                            minValue={p.min}
                            inputValue={p.value ? p.value : media[p.item]}
                            onInputValueChange={elem => {
                                let mediaCopy = { ...media };
                                mediaCopy[p.item] = elem.target.value;
                                setMedia(mediaCopy);
                            }}
                            placeHolder={p.placeholder}
                        />
                        {p.enableUSD && (
                            <Box style={{ whiteSpace: "nowrap" }} mx={2}>
                                0.04 USD
                            </Box>
                        )}
                    </Box>
                </Box>
            </Box>
        );
    }

    return (
        <>
            <Modal size="medium" isOpen={props.open} onClose={props.handleClose} showCloseIcon>
                <Box className={classes.cardOptions}>
                    <Box className={classes.buttonsMediaTerms} pl={1.5} pr={2}>
                        <Box className={classes.borderRoundBox} onClick={() => setTabMediaTerms(0)}>
                            <Box className={`${classes.mediaTermButton} ${classes.mediaTermButtonSelected}`}>1</Box>
                        </Box>
                        <Box className={classes.buttonsMediaTermsBorder} />
                        <Box className={classes.borderRoundBox} onClick={() => setTabMediaTerms(1)}>
                            <Box
                                className={`${classes.mediaTermButton} ${tabMediaTerms > 0 ? classes.mediaTermButtonSelected : ""
                                    }`}
                            >
                                2
                            </Box>
                        </Box>
                        <Box className={classes.buttonsMediaTermsBorder} />
                        <Box className={classes.borderRoundBox} onClick={() => setTabMediaTerms(2)}>
                            <Box
                                className={`${classes.mediaTermButton} ${tabMediaTerms === 2 ? classes.mediaTermButtonSelected : ""
                                    }`}
                            >
                                3
                            </Box>
                        </Box>
                    </Box>
                    <Box className={classes.flexBox} justifyContent="space-between" mt={2}>
                        <Box>General</Box>
                        <Box>Payments</Box>
                        <Box>Rewards</Box>
                    </Box>
                </Box>
                <LoadingWrapper loading={isDataLoading}>
                    <>
                        {tabMediaTerms === 0 ? (
                            <>
                                <Box mt={2}>
                                    <Box className={classes.flexBox} justifyContent="space-between">
                                        <Box className={classes.header1}>Song Images</Box>
                                        <Tooltip TransitionComponent={Fade} TransitionProps={{ timeout: 600 }} arrow title={""}>
                                            <InfoIcon style={{ color: "#2D3047", width: "14px" }} />
                                        </Tooltip>
                                    </Box>
                                    <Box width={1} className={classes.uploadBox} mt={1}>
                                        <FileUpload
                                            photo={upload}
                                            photoImg={uploadImg}
                                            setterPhoto={setUpload}
                                            setterPhotoImg={setUploadImg}
                                            mainSetter={undefined}
                                            mainElement={undefined}
                                            type="image"
                                            canEdit
                                            isEditable
                                        />
                                    </Box>
                                </Box>
                                <Box mt={2}>
                                    <Box className={classes.flexBox} justifyContent="space-between">
                                        <Box className={classes.header1}>Song Name</Box>
                                        <Tooltip TransitionComponent={Fade} TransitionProps={{ timeout: 600 }} arrow title={""}>
                                            <InfoIcon style={{ color: "#2D3047", width: "14px" }} />
                                        </Tooltip>
                                    </Box>
                                    <InputWithLabelAndTooltip
                                        placeHolder="Your name here"
                                        type="text"
                                        inputValue={media.title}
                                        onInputValueChange={e => setMedia(prev => ({ ...prev, title: e.targe.value }))}
                                        style={{ background: "#F0F5F5" }}
                                    />
                                </Box>
                                <Box mt={1}>
                                    <Box className={classes.flexBox} justifyContent="space-between">
                                        <Box className={classes.header1}>Description</Box>
                                        <Tooltip TransitionComponent={Fade} TransitionProps={{ timeout: 600 }} arrow title={""}>
                                            <InfoIcon style={{ color: "#2D3047", width: "14px" }} />
                                        </Tooltip>
                                    </Box>
                                    <InputWithLabelAndTooltip
                                        placeHolder="Write a description..."
                                        type="textarea"
                                        inputValue={media.description}
                                        onInputValueChange={e => setMedia(prev => ({ ...prev, description: e.targe.value }))}
                                        style={{ background: "#F0F5F5" }}
                                    />
                                </Box>
                                <Box mt={1}>
                                    <Box className={classes.flexBox} justifyContent="space-between" mb={1}>
                                        <Box className={classes.header1}>Song Main Image</Box>
                                        <Tooltip TransitionComponent={Fade} TransitionProps={{ timeout: 600 }} arrow title={""}>
                                            <InfoIcon style={{ color: "#2D3047", width: "14px" }} />
                                        </Tooltip>
                                    </Box>
                                    <FileUpload
                                        photo={upload1}
                                        photoImg={uploadImg1}
                                        setterPhoto={setUpload1}
                                        setterPhotoImg={setUploadImg1}
                                        mainSetter={undefined}
                                        mainElement={undefined}
                                        type="image"
                                        canEdit
                                    />
                                </Box>
                                <Box className={classes.flexBox} mt={3}>
                                    <Box width={1} ml={1}>
                                        <Box className={classes.header1}>Release Date</Box>
                                        <Box width={1} className={classes.controlBox} mt={1}>
                                            <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                                <KeyboardDatePicker
                                                    disableToolbar
                                                    variant="inline"
                                                    format="MM/dd/yyyy"
                                                    margin="dense"
                                                    id="date-picker-inline"
                                                    minDate={new Date()}
                                                    value={media.ReleaseDate}
                                                    onChange={(date, _) =>
                                                        date && setMedia(prev => ({ ...prev, ReleaseDate: new Date(date.getTime()) }))
                                                    }
                                                    KeyboardButtonProps={{
                                                        "aria-label": "change date",
                                                    }}
                                                    keyboardIcon={
                                                        <img className={classes.calendarImage} src={dateIcon} alt={"calendar"} />
                                                    }
                                                    size="small"
                                                    className={classes.datepicker}
                                                />
                                            </MuiPickersUtilsProvider>
                                        </Box>
                                    </Box>
                                    <Box width={1} ml={1}>
                                        <Box className={classes.header1}>Release Time</Box>
                                        <Box width={1} className={classes.controlBox} mt={1}>
                                            <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                                <KeyboardTimePicker
                                                    margin="dense"
                                                    id="time-picker"
                                                    value={media.ReleaseHour}
                                                    onChange={(elem: any) => {
                                                        let date = new Date(elem).getTime();
                                                        const mediaCopy = { ...media };
                                                        mediaCopy.ReleaseHour = date;
                                                        setMedia(mediaCopy);
                                                    }}
                                                    KeyboardButtonProps={{
                                                        "aria-label": "change date",
                                                    }}
                                                    size="small"
                                                    className={classes.datepicker}
                                                    keyboardIcon={
                                                        <img className={classes.calendarImage} src={timeIcon} alt={"calendar"} />
                                                    }
                                                />
                                            </MuiPickersUtilsProvider>
                                        </Box>
                                    </Box>
                                </Box>
                            </>
                        ) : tabMediaTerms === 1 ? (
                            <Box>
                                <Box className={classes.header1} mt={2}>
                                    Charging
                                </Box>
                                <Box className={classes.flexBox} mt={1}>
                                    <Box
                                        className={classes.radioBox}
                                        onClick={() => {
                                            let mediaCopy = { ...media };
                                            mediaCopy.Payment = "Free";
                                            mediaCopy.PricePerSecond = 0;
                                            mediaCopy.Price = 0;
                                            setMedia(mediaCopy);
                                        }}
                                    >
                                        <StyledCheckbox
                                            buttonType="circle"
                                            buttonColor={media.Payment === "Free" ? Color.Black : Color.GrayMedium}
                                            checked={media.Payment === "Free"}
                                        />
                                        <Box mt={0.5}>Free</Box>
                                    </Box>
                                    <Box
                                        className={classes.radioBox}
                                        ml={2}
                                        onClick={() => {
                                            let mediaCopy = { ...media };
                                            mediaCopy.Payment = "Fixed";
                                            mediaCopy.PricePerSecond = 0;
                                            setMedia(mediaCopy);
                                        }}
                                    >
                                        <StyledCheckbox
                                            buttonType="circle"
                                            buttonColor={media.Payment === "Fixed" ? Color.Black : Color.GrayMedium}
                                            checked={media.Payment === "Fixed"}
                                        />
                                        <Box mt={0.5}>Fixed</Box>
                                    </Box>
                                    {media.Type &&
                                        (media.Type === "LIVE_VIDEO_TYPE" ||
                                            media.Type === "LIVE_AUDIO_TYPE" ||
                                            media.Type === "VIDEO_TYPE" ||
                                            media.Type === "AUDIO_TYPE") && (
                                            <Box
                                                className={classes.radioBox}
                                                ml={2}
                                                onClick={() => {
                                                    let mediaCopy = { ...media };
                                                    mediaCopy.Payment = "Streaming";
                                                    mediaCopy.Price = 0;
                                                    setMedia(mediaCopy);
                                                }}
                                            >
                                                <StyledCheckbox
                                                    buttonType="circle"
                                                    buttonColor={media.Payment === "Streaming" ? Color.Black : Color.GrayMedium}
                                                    checked={media.Payment === "Streaming"}
                                                />
                                                <Box mt={0.5}>Streaming</Box>
                                            </Box>
                                        )}
                                </Box>
                                {(media.Payment === "Free" || media.Payment === "Fixed" || media.Payment === "Streaming") && (
                                    <Grid container spacing={2}>
                                        <Grid item xs={12} sm={6}>
                                            <Box mt={2}>
                                                <Box className={classes.flexBox} justifyContent="space-between">
                                                    <Box className={classes.header1}>Token</Box>
                                                    <Tooltip
                                                        TransitionComponent={Fade}
                                                        TransitionProps={{ timeout: 600 }}
                                                        arrow
                                                        title={""}
                                                    >
                                                        <InfoIcon style={{ color: "#2D3047", width: "14px" }} />
                                                    </Tooltip>
                                                </Box>
                                                {tokens.length > 0 && (
                                                    <Box className={classes.inputBox} mt={1}>
                                                        <TokenSelect
                                                            value={media.Token}
                                                            onChange={e => {
                                                                const selectedName: any = e.target.value;
                                                                let mediaCopy = { ...media };
                                                                mediaCopy.Token = selectedName;
                                                                setMedia(mediaCopy);
                                                            }}
                                                            tokens={tokens}
                                                            style={{ background: "transparent", border: "none" }}
                                                        />
                                                    </Box>
                                                )}
                                            </Box>
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            {renderInputCreateModal({
                                                name: "Price per second",
                                                placeholder: "Enter Price...",
                                                type: "text",
                                                width: 400,
                                                item: "Price",
                                                enableUSD: true,
                                            })}
                                        </Grid>
                                    </Grid>
                                )}
                                {(media.Payment === "Free" || media.Payment === "Fixed" || media.Payment === "Streaming") && (
                                    <Box>
                                        <Box className={classes.header1} mt={4}>
                                            Exclusive Access
                                        </Box>
                                        <Box className={classes.flexBox} mt={1}>
                                            <Box
                                                className={classes.radioBox}
                                                onClick={() => {
                                                    let mediaCopy = { ...media };
                                                    mediaCopy.ExclusivePermissions = true;
                                                    setMedia(mediaCopy);
                                                }}
                                            >
                                                <StyledCheckbox
                                                    buttonType="circle"
                                                    buttonColor={media.ExclusivePermissions === true ? Color.Black : Color.GrayMedium}
                                                    checked={media.ExclusivePermissions === true}
                                                />
                                                Yes
                                            </Box>
                                            <Box
                                                className={classes.radioBox}
                                                ml={2}
                                                onClick={() => {
                                                    let mediaCopy = { ...media };
                                                    mediaCopy.ExclusivePermissions = false;
                                                    setMedia(mediaCopy);
                                                }}
                                            >
                                                <StyledCheckbox
                                                    buttonType="circle"
                                                    buttonColor={media.ExclusivePermissions === false ? Color.Black : Color.GrayMedium}
                                                    checked={media.ExclusivePermissions === false}
                                                />
                                                No
                                            </Box>
                                        </Box>
                                        <Grid container spacing={2}>
                                            <Grid item xs={12} sm={6}>
                                                <Box mt={2}>
                                                    <Box className={classes.flexBox} justifyContent="space-between">
                                                        <Box className={classes.header1}>Token</Box>
                                                        <Tooltip
                                                            TransitionComponent={Fade}
                                                            TransitionProps={{ timeout: 600 }}
                                                            arrow
                                                            title={""}
                                                        >
                                                            <InfoIcon style={{ color: "#2D3047", width: "14px" }} />
                                                        </Tooltip>
                                                    </Box>
                                                    {tokens.length > 0 && (
                                                        <Box className={classes.inputBox} mt={1}>
                                                            <TokenSelect
                                                                value={media.Token}
                                                                onChange={e => {
                                                                    const selectedName: any = e.target.value;
                                                                    let mediaCopy = { ...media };
                                                                    mediaCopy.Token = selectedName;
                                                                    setMedia(mediaCopy);
                                                                }}
                                                                tokens={tokens}
                                                                style={{ background: "transparent", border: "none" }}
                                                            />
                                                        </Box>
                                                    )}
                                                </Box>
                                            </Grid>
                                            <Grid item xs={12} sm={6}>
                                                {renderInputCreateModal({
                                                    name: "Price ",
                                                    placeholder: "Enter Price...",
                                                    type: "text",
                                                    width: 400,
                                                    item: "Price",
                                                })}
                                            </Grid>
                                        </Grid>
                                    </Box>
                                )}
                            </Box>
                        ) : tabMediaTerms === 2 ? (
                            <Box>
                                <Box className={classes.header1} mt={4}>
                                    Select Token Type
                                </Box>
                                <Box className={classes.flexBox} mb={2} flexWrap="wrap">
                                    {rewardTokenList &&
                                        rewardTokenList.map((type, index) => {
                                            return (
                                                <Box
                                                    className={`${classes.tokenTypeButton} ${type === rewardToken ? classes.tokenTypeButtonSelected : ""
                                                        }`}
                                                    onClick={() => {
                                                        setRewardTokenName(type);
                                                    }}
                                                    key={type}
                                                    mr={index < rewardTokenList.length ? 2 : 0}
                                                    mt={2}
                                                >
                                                    {`${type} ${type.toUpperCase().includes("CRYPTO")
                                                        ? "💸"
                                                        : type.includes("NFT")
                                                            ? "🏆"
                                                            : type.includes("FT") || type.includes("BADGE")
                                                                ? "👘"
                                                                : "📸"
                                                        }`}
                                                </Box>
                                            );
                                        })}
                                </Box>
                                <Grid container spacing={2}>
                                    <Grid item xs={12} sm={6}>
                                        <Box mt={2}>
                                            <Box className={classes.flexBox} justifyContent="space-between">
                                                <Box className={classes.header1}>Token</Box>
                                                <Tooltip
                                                    TransitionComponent={Fade}
                                                    TransitionProps={{ timeout: 600 }}
                                                    arrow
                                                    title={""}
                                                >
                                                    <InfoIcon style={{ color: "#2D3047", width: "14px" }} />
                                                </Tooltip>
                                            </Box>
                                            {tokens.length > 0 && (
                                                <Box className={classes.inputBox} mt={1}>
                                                    <TokenSelect
                                                        value={media.Token}
                                                        onChange={e => {
                                                            const selectedName: any = e.target.value;
                                                            let mediaCopy = { ...media };
                                                            mediaCopy.Token = selectedName;
                                                            setMedia(mediaCopy);
                                                        }}
                                                        tokens={tokens}
                                                        style={{ background: "transparent", border: "none" }}
                                                    />
                                                </Box>
                                            )}
                                        </Box>
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        {renderInputCreateModal({
                                            name: "Price per second",
                                            placeholder: "Enter Price...",
                                            type: "text",
                                            width: 400,
                                            item: "Price",
                                            enableUSD: true,
                                        })}
                                    </Grid>
                                </Grid>
                            </Box>
                        ) : null}
                    </>
                </LoadingWrapper>
                <Box className={classes.footer} mt={3}>
                    <Box className={classes.footerLeft}>
                        <SecondaryButton size="medium" onClick={saveProgress} isRounded>
                            Save Progress
                        </SecondaryButton>
                        <SecondaryButton size="medium" onClick={handleOpenSignatureModal} isRounded>
                            Register Conditions
                        </SecondaryButton>
                    </Box>
                    {tabMediaTerms < 2 && (
                        <Box className={classes.footerRight}>
                            <PrimaryButton
                                size="medium"
                                onClick={() => {
                                    if (tabMediaTerms === 0) {
                                        setTabMediaTerms(1);
                                    } else if (tabMediaTerms === 1) {
                                        setTabMediaTerms(2);
                                    } else if (tabMediaTerms === 2) {
                                        setTabMediaTerms(3);
                                    }
                                }}
                                isRounded
                            >
                                Next
                            </PrimaryButton>
                        </Box>
                    )}
                </Box>

                {status && (
                    <AlertMessage
                        key={status.key}
                        message={status.msg}
                        variant={status.variant}
                        onClose={() => setStatus(undefined)}
                    />
                )}
            </Modal>
            {openSignRequestModal && (
                <SignatureRequestModal
                    open={openSignRequestModal}
                    address={userSelector.address}
                    transactionFee="0.0000"
                    detail={signRequestModalDetail}
                    handleOk={registerConditions}
                    handleClose={() => setOpenSignRequestModal(false)}
                />
            )}
        </>
    );
};

export default MediaTermsModal;
