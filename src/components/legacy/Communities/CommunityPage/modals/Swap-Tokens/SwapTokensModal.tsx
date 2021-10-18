import React, { useEffect, useState } from "react";
import FormControl from "@material-ui/core/FormControl";
import { useTypedSelector } from "store/reducers/Reducer";
import axios from "axios";
import URL from "shared/functions/getURL";
import { Modal } from "@material-ui/core";
import AlertMessage from "shared/ui-kit/Alert/AlertMessage";
import "./SwapTokensModal.css";
import { StyledSelect, StyledMenuItem } from "shared/ui-kit/Styled-components/StyledComponents";
import { formatNumber } from "shared/functions/commonFunctions";
import { signTransaction } from "shared/functions/signTransaction";
import InputWithLabelAndTooltip from "shared/ui-kit/InputWithLabelAndTooltip";

const arrowIcon = require("assets/icons/arrow_up_white-01.png");
const infoIcon = require("assets/icons/info_icon.png");

const tokenTypeOptions = ["SOCIAL", "CRYPTO", "FTPOD", "NFTPOD"];
const tokenTypeOptionsMap = {
    SOCIAL: "Social",
    CRYPTO: "Crypto",
    FTPOD: "FT Tokens",
    NFTPOD: "NFT Tokens",
};

const SwapTokens = props => {
    const user = useTypedSelector(state => state.user);
    const [fromTokenType, setFromTokenType] = useState<string>(tokenTypeOptions[0]);
    const [toTokenType, setToTokenType] = useState<string>(tokenTypeOptions[0]);

    const [amountFrom, setAmountFrom] = useState<string>("");
    const [amountTo, setAmountTo] = useState<string>("");

    const [disableSubmit, setDisableSubmit] = useState<boolean>(false);
    const [filteredFromTokens, setFilteredFromTokens] = useState<string[]>([]);
    const [filteredToTokens, setFilteredToTokens] = useState<string[]>([]);

    const [tokenBalanceMap, setTokenBalanceMap] = useState<any>({});

    const [wallet, setWallet] = useState<string>("PRIVI Wallet");
    const [tokenFrom, setTokenFrom] = useState<string>("PRIVI");
    const [tokenTo, setTokenTo] = useState<string>("ETH");
    const [availableFromBalance, setAvailableFromBalance] = useState<number>(0);
    const [availableToBalance, setAvailableToBalance] = useState<number>(0);

    const [rateOfChange, setRateOfChange] = useState<any>({});

    const [gasFee, setGasFee] = useState<number>(0);

    const [errors, setErrors] = useState<any>({});
    const [status, setStatus] = React.useState<any>("");

    const handleWalletChange = wallet => {
        setWallet(wallet);
    };

    // initial useEffect
    useEffect(() => {
        if (props.open) {
            axios.get(`${URL()}/wallet/getCryptosRateAsMap`).then(res => {
                const resp = res.data;
                if (resp.success) {
                    setRateOfChange(resp.data);
                }
            });
            // get all the tokens of the system
        }
    }, [props.open]);

    // -------------- when token type change -------------------
    useEffect(() => {
        if (props.communityBalances) {
            const newFilteredToTokens: any[] = [];
            props.communityBalances.forEach(tokenBalance => {
                if (tokenBalance.Type == toTokenType) newFilteredToTokens.push(tokenBalance.Token);
            });
            setFilteredToTokens(newFilteredToTokens);
            setTokenTo(newFilteredToTokens.length > 0 ? newFilteredToTokens[0] : "");
        }
    }, [toTokenType]);

    useEffect(() => {
        if (props.communityBalances) {
            const newFilteredFromTokens: any[] = [];
            props.communityBalances.forEach(tokenBalance => {
                if (tokenBalance.Type == fromTokenType) newFilteredFromTokens.push(tokenBalance.Token);
            });
            setFilteredFromTokens(newFilteredFromTokens);
            setTokenFrom(newFilteredFromTokens.length > 0 ? newFilteredFromTokens[0] : "");
        }
    }, [fromTokenType]);

    // ----------------------------------------------------------

    // --------------- when from === to -------------------------
    useEffect(() => {
        // when tokenTo == tokenFrom then change tokenFrom to another token
        if (tokenTo === tokenFrom && filteredFromTokens.length > 1) {
            const filteredFromkenWithouCurrFrom = filteredFromTokens.filter(token => token != tokenTo);
            setTokenFrom(filteredFromkenWithouCurrFrom[0]);
        }
        // TODO: to be changed
        let newAvailableBalance = 0;
        if (props.poolBalances && props.poolBalances[tokenTo]) {
            newAvailableBalance = props.poolBalances[tokenTo].Amount;
        }
        setAvailableToBalance(newAvailableBalance);
    }, [tokenTo, props.poolBalances]);

    useEffect(() => {
        // when tokenTo == tokenFrom then change tokenTo to another token
        if (tokenTo === tokenFrom && filteredToTokens.length > 1) {
            const filteredTokenWithouCurrFrom = filteredToTokens.filter(token => token != tokenFrom);
            setTokenTo(filteredTokenWithouCurrFrom[0]);
        }
        // update available balance corresponding to token from
        let newAvailableBalance = 0;
        if (tokenBalanceMap[tokenFrom]) {
            newAvailableBalance = tokenBalanceMap[tokenFrom].Amount;
        }
        setAvailableFromBalance(newAvailableBalance);
    }, [tokenFrom, tokenBalanceMap]);
    // ----------------------------------------------------------

    // get swap price
    useEffect(() => {
        if (amountFrom && tokenFrom && tokenTo) {
            setDisableSubmit(true);
            const params = {
                params: {
                    TokenFrom: tokenFrom,
                    TokenTo: tokenTo,
                    AmountFrom: Number(amountFrom),
                    Rate: Number((rateOfChange[tokenFrom] ?? 1) / (rateOfChange[tokenTo] ?? 1)),
                },
            };
            axios.get(`${URL()}/liquidityPool/getSwapPrice`, params).then(res => {
                const resp = res.data;
                setDisableSubmit(false);
                if (resp.success) {
                    setAmountTo(resp.data.Price.toFixed(4));
                    setGasFee(resp.data.Fee.toFixed(4));
                }
            });
        }
    }, [amountFrom, tokenFrom, tokenTo]);

    // initial use effect
    useEffect(() => {
        if (props.communityBalances) {
            const newFromTokens: string[] = [];
            const newTokenBalanceMap: any = {};
            props.communityBalances.forEach(tokenBalance => {
                newTokenBalanceMap[tokenBalance.Token] = tokenBalance;
                if (tokenBalance.Type == fromTokenType) newFromTokens.push(tokenBalance.Token);
            });
            setTokenBalanceMap(newTokenBalanceMap);
            setFilteredFromTokens(newFromTokens);
            if (!tokenFrom || !newFromTokens.includes(tokenFrom))
                setTokenFrom(newFromTokens.length > 0 ? newFromTokens[0] : "");
        }
    }, [props.communityBalances]);

    const handleSwap = async () => {
        let values = { amountFrom };
        let validatedErrors = validate(values);
        setErrors(validatedErrors);

        if (Object.keys(validatedErrors).length === 0) {
            const body: any = {
                TraderAddress: user.id,
                TokenFrom: tokenFrom,
                TokenTo: tokenTo,
                AmountFrom: Number(amountFrom),
                Rate: Number((rateOfChange[tokenFrom] ?? 1) / (rateOfChange[tokenTo] ?? 1)),
            };
            const [hash, signature] = await signTransaction(user.mnemonic, body);
            body.Hash = hash;
            body.Signature = signature;
            axios.post(`${URL()}/liquidityPool/swapCryptoTokens`, body).then(res => {
                const resp = res.data;
                setDisableSubmit(false);
                if (resp.success) {
                    setStatus({
                        msg: "swap success",
                        key: Math.random(),
                        variant: "success",
                    });
                    setTimeout(() => {
                        setAmountFrom("");
                        props.handleRefresh();
                        props.handleClose();
                    }, 1000);
                } else {
                    setStatus({
                        msg: "swap failed",
                        key: Math.random(),
                        variant: "error",
                    });
                }
            });
        }
    };

    function validate(values: { [key: string]: string }): { [key: string]: string } {
        var errors: { [key: string]: string } = {};

        if (values.amount === null || !Number(values.amountFrom)) {
            errors.amountFrom = "invalid amount";
        } else if (Number(values.amountFrom) === 0) {
            errors.amountFrom = "amount cant be 0";
        } else if (Number(values.amountFrom) < 0) {
            errors.amountFrom = "amount cant be negative";
        } else if (Number(values.amountFrom) > availableFromBalance) {
            errors.amountFrom = "insufficient balance to perform this operation";
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
            <div className="addLiquiditySwapModal modal-content  w50">
                <div className="exit" onClick={props.handleClose}>
                    <img src={require("assets/icons/x_darkblue.png")} alt={"x"} />
                </div>
                <div className="headerAddLiquidityModal">
                    <div className="labelHeaderAddLiquidityModal">Swap tokens</div>
                    <div className="balancePaperHeaderAddLiquidityModalDiv">
                        <div className="balancePaperHeaderAddLiquidityModalDiv">
                            <div className="balancePaperHeaderAddLiquidityModal">
                                <StyledSelect
                                    disableUnderline
                                    name="type"
                                    value={wallet}
                                    onChange={(event: React.ChangeEvent<{ value: unknown }>) =>
                                        handleWalletChange(event.target.value as string)
                                    }
                                    required
                                >
                                    <StyledMenuItem value="PRIVI Wallet" key={1}>
                                        PRIVI Wallet
                  </StyledMenuItem>
                                    <StyledMenuItem value="Ethereum Wallet" key={2}>
                                        Ethereum Wallet
                  </StyledMenuItem>
                                </StyledSelect>
                            </div>
                        </div>
                    </div>
                </div>

                <label>
                    Select From Token Type
          <div className="select-tokens">
                        {tokenTypeOptions.map(type => {
                            return (
                                <button
                                    className={type !== fromTokenType ? "disabled" : ""}
                                    onClick={() => {
                                        setFromTokenType(type);
                                    }}
                                    key={type}
                                >
                                    {tokenTypeOptionsMap[type]}
                                </button>
                            );
                        })}
                    </div>
                </label>
                <div className="squareTokenQuantitySwap">
                    <div className="tokenColAddLiquidityModal">
                        <div className="labelTokenAddLiquidityModal">
                            From
              <img src={infoIcon} className="infoIconAddLiquidityModal" alt="info" />
                        </div>
                        <div className="squareTokenAddLiquidityModal">
                            {tokenFrom ? (
                                <div
                                    className="imgSelectorTokenAddLiquidityModal"
                                    style={{
                                        backgroundImage:
                                            tokenFrom && tokenBalanceMap[tokenFrom]
                                                ? tokenBalanceMap[tokenFrom].Type == "CRYPTO"
                                                    ? `url(${require(`assets/tokenImages/${tokenFrom}.png`)})`
                                                    : `url(${URL()}/wallet/getTokenPhoto/${tokenFrom})`
                                                : "none",
                                        backgroundRepeat: "no-repeat",
                                        backgroundSize: "cover",
                                        backgroundPosition: "center",
                                    }}
                                />
                            ) : null}

                            {props.tokenFrom ? (
                                <div className="selectorTokenAddLiquidityModal">{tokenFrom}</div>
                            ) : (
                                <div className="selectorTokenAddLiquidityModal">
                                    <FormControl>
                                        <StyledSelect
                                            disableUnderline
                                            value={tokenFrom}
                                            className="selectTokenAddLiquidityModal"
                                            onChange={event => {
                                                const value: any = event.target.value;
                                                setTokenFrom(value);
                                            }}
                                        >
                                            {filteredFromTokens.map((item, i) => {
                                                return (
                                                    <StyledMenuItem key={i} value={item}>
                                                        {item}
                                                    </StyledMenuItem>
                                                );
                                            })}
                                        </StyledSelect>
                                    </FormControl>
                                </div>
                            )}
                        </div>
                        {
                            <div className="commentAddLiquidityModal">{`Available: ${formatNumber(
                                availableFromBalance,
                                tokenFrom,
                                4
                            )}`}</div>
                        }
                    </div>

                    <div className="quantityColAddLiquidityModal">
                        <InputWithLabelAndTooltip
                            labelName="Quantity"
                            tooltip={""}
                            type="number"
                            inputValue={amountFrom}
                            placeHolder="Token quantity..."
                            minValue={"0"}
                            required
                            onInputValueChange={e => setAmountFrom(e.target.value)}
                        />
                        {errors.amountFrom ? <div className="error">{errors.amountFrom}</div> : null}
                    </div>
                </div>

                <div className="iconModalSwapDiv">
                    <img src={arrowIcon} className="plusMiddleIconModalSwap" alt="arrow" />
                </div>

                <label>
                    Select To Token Type
          <div className="select-tokens">
                        {tokenTypeOptions.map(type => {
                            return (
                                <button
                                    className={type !== toTokenType ? "disabled" : ""}
                                    onClick={() => {
                                        setToTokenType(type);
                                    }}
                                    key={type}
                                >
                                    {tokenTypeOptionsMap[type]}
                                </button>
                            );
                        })}
                    </div>
                </label>
                <div className="squareTokenQuantitySwap">
                    <div className="tokenColAddLiquidityModal">
                        <div className="labelTokenAddLiquidityModal">
                            To
              <img src={infoIcon} className="infoIconAddLiquidityModal" alt="info" />
                        </div>
                        <div className="squareTokenAddLiquidityModal">
                            {tokenTo ? (
                                <div
                                    className="imgSelectorTokenAddLiquidityModal"
                                    style={{
                                        backgroundImage:
                                            tokenTo && tokenBalanceMap[tokenTo]
                                                ? tokenBalanceMap[tokenTo].Type == "CRYPTO"
                                                    ? `url(${require(`assets/tokenImages/${tokenTo}.png`)})`
                                                    : `url(${URL()}/wallet/getTokenPhoto/${tokenTo})`
                                                : "none",
                                        backgroundRepeat: "no-repeat",
                                        backgroundSize: "cover",
                                        backgroundPosition: "center",
                                    }}
                                />
                            ) : null}

                            {props.tokenTo ? (
                                <div className="selectorTokenAddLiquidityModal">{tokenTo}</div>
                            ) : (
                                <div className="selectorTokenAddLiquidityModal">
                                    <FormControl>
                                        <StyledSelect
                                            disableUnderline
                                            value={tokenTo}
                                            className="selectTokenAddLiquidityModal"
                                            onChange={event => {
                                                const value: any = event.target.value;
                                                setTokenTo(value);
                                            }}
                                        >
                                            {filteredToTokens.map((item, i) => {
                                                return (
                                                    <StyledMenuItem key={i} value={item}>
                                                        {item}
                                                    </StyledMenuItem>
                                                );
                                            })}
                                        </StyledSelect>
                                    </FormControl>
                                </div>
                            )}
                        </div>

                        <div className="commentAddLiquidityModal">{`Pool Available: ${formatNumber(
                            availableToBalance,
                            tokenTo,
                            4
                        )}`}</div>
                    </div>
                    <div className="quantityColAddLiquidityModal">
                        <InputWithLabelAndTooltip
                            labelName="Quantity"
                            tooltip={""}
                            type="number"
                            inputValue={amountTo}
                            placeHolder="Token quantity..."
                            minValue={"0"}
                            required
                            onInputValueChange={e => setAmountFrom(e.target.value)}
                            disabled
                        />
                    </div>
                </div>

                <div className="footerAddLiquidityModal">
                    <div className="firstColFooterAddLiquidityModal">
                        <div className="estimateGasFeeAddLiquidityModal">
                            <div className="estimateGasFeeLabelAddLiquidityModal">Estimated Gas fee</div>
                            <div className="estimateGasFeeValueAddLiquidityModal">
                                {formatNumber(Number(gasFee), tokenTo, 4)}
                            </div>
                        </div>
                    </div>
                    <div className="secondColFooterAddLiquidityModal">
                        <button
                            className="buttonSubHeaderSwapMain addLiquidityButtonSubHeaderSwapMain"
                            onClick={handleSwap}
                            disabled={disableSubmit}
                        >
                            Swap
            </button>
                    </div>
                </div>
                {status ? <AlertMessage key={status.key} message={status.msg} variant={status.variant} /> : null}
            </div>
        </Modal>
    );
};

export default SwapTokens;
