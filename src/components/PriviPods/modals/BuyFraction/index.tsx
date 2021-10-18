import React, { useState } from "react";
import { makeStyles, Divider } from "@material-ui/core";
import InputBase from "@material-ui/core/InputBase";
import styled from "styled-components";
import Box from "shared/ui-kit/Box";
import { Avatar, Modal, PrimaryButton } from "shared/ui-kit";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { useSelector } from "react-redux";
import { getUser, getUsersInfoList } from "store/selectors";
import { getRandomAvatarForUserIdWithMemoization } from "shared/services/user/getUserAvatar";
import { capitalize } from "shared/helpers";

const useStyles = makeStyles(theme => ({
    modalContainer: {
        background: "#EAE8FA !important",
    },
    title: {
        fontWeight: 700,
        fontSize: "22px",
        fontFamily: "Agrandir",
        color: "#181818",
    },
    digitalArt: {
        fontWeight: 400,
        fontSize: "22px",
        lineHeight: "31.35px",
        fontFamily: "Agrandir",
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
    roundInputBox: {
        background: "#F7F9FE",
        border: "1px solid #707582",
        boxSizing: "border-box",
        borderRadius: "11.36px",
        width: "100%",
    },
    iconButton: {
        padding: "10px",
    },
    headerInput: {
        background: "#f7f8fa",
        border: "1px solid #99a1b3",
        borderRadius: "10px",
        height: theme.spacing(7),
        padding: "0px 19px 0px 19px",
        display: "flex",
        alignItems: "center",
        flexGrow: 1,
    },
    searchBox: {
        flex: 1,
        background: "#F7F9FE",
        paddingLeft: "20px",
        color: "#99A1B3",
        fontSize: "14px",
        lineHeight: "120%",
    },
    userName: {
        color: '#7F6FFF',
        fontSize: 14,
    },
    userItem: {
        alignItems: "center",
        marginTop: theme.spacing(1),
        marginBottom: theme.spacing(1),
    },
    goToUser: {
        flexDirection: "row",
        alignItems: "center",
    },
}));

export const UserIcon = styled.div<{ imageUrl: string }>`
  background-size: cover;
  height: 32px;
  width: 32px;
  min-width: 32px;
  min-height: 32px;
  border-radius: 50%;
  margin-right: 15px;
  background-color: #5a5a5a;
  background-image: ${({ imageUrl }) => imageUrl};
  border: 2px solid white;
  box-shadow: 0px 2px 8px rgb(0 0 0 / 50%);
`;

const BuyFraction = (props: any) => {
    const classes = useStyles();

    const userSelector = useSelector(getUser);
    const usersInfoList = useSelector(getUsersInfoList);

    const [filteredUsers, setFilteredUsers] = useState<any[]>([]);
    const [autocompleteKey, setAutocompleteKey] = useState<number>(new Date().getTime());

    const [searchValue, setSearchValue] = useState<string>("");
    const [selectedusers, setSelectedUsers] = useState<any[]>([]);

    React.useEffect(() => {
        if (usersInfoList && usersInfoList.length > 0) {
            const allUsers = usersInfoList.filter(user => user.id !== userSelector.id) ?? [];
            allUsers.forEach(user => {
                let image = "";
                if (user.anon != undefined && user.anon === true && user.anonAvatar && user.anonAvatar.length > 0) {
                    image = `${require(`assets/anonAvatars/${user.anonAvatar}`)}`;
                } else {
                    if (user.hasPhoto && user.url) {
                        image = `${user.url}?${Date.now()}`;
                    }
                }
                user.imageUrl = image;
                user.assistances = user.assistances ?? 0;
                user.rate = user.rate ?? 0;
            });
            setFilteredUsers(allUsers);
        }
    }, [usersInfoList, userSelector.id]);

    const handleUserSelect = (event, newValue) => {
        if (newValue) {
            setSearchValue(newValue);
            // reset search query
            setAutocompleteKey(new Date().getTime());
            setSelectedUsers([...selectedusers, newValue.id]);
        }
    };

    return (
        <Modal
            className={classes.modalContainer}
            isOpen={props.open}
            onClose={() => {
                props.handleClose();
            }}
            size="small"
            showCloseIcon
        >
            <Box>
                <Box>
                    <Box className={classes.title}>View All Owners</Box>
                </Box>
                <Box className={classes.digitalArt} mt={2}>
                    {props.pod?.Name || "Untitled Pod"}
                </Box>
                <Box mt={2}>
                    <Box className={classes.headerInput}>
                        <Autocomplete
                            style={{ width: "calc(100% - 17px)" }}
                            freeSolo
                            clearOnBlur
                            value={searchValue}
                            key={autocompleteKey}
                            onChange={(event: any, newValue: any | null) => {
                                handleUserSelect(event, newValue);
                            }}
                            options={["", ...filteredUsers]}
                            renderOption={(option, { selected }) => {
                                if (option)
                                    return (
                                        <React.Fragment>
                                            <div
                                                style={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                    borderBottom: "1px solid #EFF2F8",
                                                    width: "100%",
                                                    paddingBottom: "10px",
                                                    justifyContent: "space-between",
                                                }}
                                            >
                                                <div
                                                    style={{
                                                        display: "flex",
                                                        alignItems: "center",
                                                    }}
                                                >
                                                    {option !== "" ? (
                                                        <div
                                                            style={{
                                                                backgroundImage:
                                                                    typeof option !== "string" && option.imageUrl
                                                                        ? `url(${option.imageUrl})`
                                                                        : `url(${getRandomAvatarForUserIdWithMemoization(option.id)})`,
                                                                backgroundRepeat: "no-repeat",
                                                                backgroundSize: "cover",
                                                                backgroundPosition: "center",
                                                                cursor: "pointer",
                                                                border: "1.5px solid #FFFFFF",
                                                                marginRight: 14,
                                                                width: 30,
                                                                minWidth: 30,
                                                                height: 30,
                                                                backgroundColor: "#F7F9FE",
                                                                borderRadius: "50%",
                                                            }}
                                                        />
                                                    ) : null}
                                                    <div
                                                        style={{
                                                            color: "black",
                                                            fontSize: 14,
                                                            fontFamily: "Agrandir",
                                                        }}
                                                    >
                                                        {typeof option !== "string" ? (
                                                            <span>{capitalize(option.firstName) || option.urlSlug}</span>
                                                        ) : (
                                                            ""
                                                        )}
                                                    </div>
                                                </div>
                                                <div
                                                    style={{
                                                        color: "#29E8DC",
                                                        fontSize: 14,
                                                        display: "flex",
                                                        alignItems: "center",
                                                        fontFamily: "Agrandir",
                                                    }}
                                                >
                                                    <img
                                                        src={require("assets/navbarIcons/profile.png")}
                                                        alt={""}
                                                        style={{ marginLeft: 10, width: 30, height: 30 }}
                                                    />
                                                </div>
                                            </div>
                                        </React.Fragment>
                                    );
                                else return null;
                            }}
                            getOptionLabel={option =>
                                option && option !== undefined && option !== "" && typeof option !== "string"
                                    ? capitalize(option.firstName) || option.urlSlug
                                    : ""
                            }
                            renderInput={params => (
                                <InputBase
                                    ref={params.InputProps.ref}
                                    inputProps={params.inputProps}
                                    autoFocus
                                    placeholder={`Search for a specific user`}
                                    style={{ fontFamily: "Agrandir", width: "100%" }}
                                />
                            )}
                        />
                        <img src={require(`assets/icons/search.png`)} alt={""} style={{ width: 17, height: 17 }} />
                    </Box>
                </Box>
                <Box>
                    {selectedusers.map(selectedUser => {
                        const userItem = filteredUsers.find(item => item.id === selectedUser);
                        return (
                            <>
                                <Box display="flex" className={classes.userItem}>
                                    <Box>
                                        <Avatar
                                            size="small"
                                            url={
                                                userItem?.imageURL
                                                    ? `url(${userItem?.imageURL})`
                                                    : getRandomAvatarForUserIdWithMemoization(userItem.id)
                                            }
                                            alt=""
                                        />
                                    </Box>
                                    <Box flexGrow={1} ml={1}>
                                        <p className={classes.userName}>
                                            {capitalize(userItem.firstName) || userItem.urlSlug}
                                        </p>
                                    </Box>
                                    <Box display="flex" className={classes.goToUser}>
                                        <svg
                                            width="18"
                                            height="18"
                                            viewBox="0 0 18 18"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path
                                                d="M17.0625 1.04042L7.06247 11.0404M17.0625 1.04042L17.0625 7.04041M17.0625 1.04042L11.0625 1.04041M7.0625 1.04042H1.0625V17.0404H17.0625V11.0404"
                                                stroke="#727F9A"
                                                stroke-width="1.5"
                                                stroke-linecap="round"
                                                stroke-linejoin="round"
                                            />
                                        </svg>
                                    </Box>
                                </Box>
                                <Divider />
                            </>
                        );
                    })}
                </Box>
                <Box display="flex" mt={4}>
                    <PrimaryButton size="medium" onClick={() => { }} style={{ width: "100%" }}>
                        Buy Fraction
                    </PrimaryButton>
                </Box>
            </Box>
        </Modal>
    );
};
export default BuyFraction;
