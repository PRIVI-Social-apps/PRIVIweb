import React, { useState } from "react";
import axios from "axios";
import { ClickAwayListener, Grid, Grow, MenuItem, MenuList, Paper, Popper } from "@material-ui/core";
import { mediaDetailsModalStyles } from "./index.styles";
import {
    Avatar,
    Text,
    SecondaryButton,
    Color,
    FontSize,
    Header5,
    Modal,
    Gradient,
    PrimaryButton,
    Header3,
} from "shared/ui-kit";
import Box from "shared/ui-kit/Box";
import URL from "shared/functions/getURL";
import { useTypedSelector } from "store/reducers/Reducer";
import { getRandomAvatarForUserIdWithMemoization } from "shared/services/user/getUserAvatar";
import { FruitSelect } from "shared/ui-kit/Select/FruitSelect";
import { ShareMenu } from "components/PriviDigitalArt/components/ShareMenu";
import { useTokenConversion } from "shared/contexts/TokenConversionContext";
import { useHistory } from "react-router-dom";

const MediaDetailsModal = (props: any) => {
    const classes = mediaDetailsModalStyles();
    const history = useHistory();
    const [media, setMedia] = useState<any>(props.media);

    const usersList = useTypedSelector(state => state.usersInfoList);
    const user = useTypedSelector(state => state.user);

    const [creatorsImages, setCreatorsImages] = useState<any[]>([]);
    const [creator, setCreator] = useState<any>();
    const [isFollowing, setIsFollowing] = useState<boolean>(false);

    const [openOptionsMenu, setOpenOptionsMenu] = useState<boolean>(false);
    const anchorOptionsMenuRef = React.useRef<HTMLDivElement>(null);

    const anchorShareMenuRef = React.useRef<HTMLDivElement>(null);
    const [openShareMenu, setOpenShareMenu] = React.useState(false);

    const { convertTokenToUSD } = useTokenConversion();

    React.useEffect(() => {
        let cts = [] as any;
        const foundUser = usersList.find(
            user =>
                user.id === media.Creator ||
                user.id === media.CreatorId ||
                user.address === media.Creator ||
                user.address === media.CreatorId
        );

        if (foundUser) {
            cts.push(foundUser);
            setCreator(foundUser);
        } else {
            cts.push(getRandomAvatarForUserIdWithMemoization(media.Creator ?? media.CreatorId));
        }

        if (media.Members && media.Members.length > 0) {
            media.Members.forEach((member, index) => {
                if (index < 3) {
                    const foundUser = usersList.find(u => u.id === member.id);
                    if (foundUser) {
                        cts.push(foundUser);
                    } else {
                        cts.push(getRandomAvatarForUserIdWithMemoization(member.id));
                    }
                } else {
                    cts.push(index);
                }
            });
        }

        if (!media.Members && media.tokenData?.Holders && media.tokenData?.Holders.length > 0) {
            media.tokenData?.Holders.forEach((member, index) => {
                if (index < 3) {
                    const foundUser = usersList.find(user => user.id === member.id);
                    cts.push(foundUser);
                } else {
                    cts.push(index);
                }
            });
        }

        setCreatorsImages(cts);
    }, []);

    const handleOpenShareMenu = () => {
        setOpenShareMenu(!openShareMenu);
    };

    const handleCloseShareMenu = () => {
        setOpenShareMenu(false);
    };

    const renderCollection = () => {
        return (
            <Box display="flex" flexDirection="row" justifyContent="space-between">
                <Box display="flex" flexDirection="column">
                    <Text>Royalty</Text>
                    <Text mt={1} color={Color.Black} size={FontSize.XL}>
                        {media?.NftConditions ? media?.NftConditions.Royalty || 1 : 1}%
                    </Text>
                </Box>
                <Box display="flex" flexDirection="column">
                    <Text>Investors Share</Text>
                    <Text mt={1} color={Color.Black} size={FontSize.XL}>
                        25%
                    </Text>
                </Box>
                <Box display="flex" flexDirection="column">
                    <Text>Sharing Share</Text>
                    <Text mt={1} color={Color.Black} size={FontSize.XL}>
                        {media?.SharingPct || 5}%
                    </Text>
                </Box>
            </Box>
        );
    };

    const handleFruit = type => {
        const body = {
            userId: user.id,
            fruitId: type,
            mediaAddress: media.MediaSymbol ?? media.id,
            mediaType: media.Type,
            tag: media.tag ?? "privi",
        };

        axios.post(`${URL()}/media/fruit`, body).then(res => {
            const resp = res.data;
            if (resp.success) {
                const itemCopy = { ...media };
                itemCopy.fruits = [
                    ...(itemCopy.fruits || []),
                    { userId: user.id, fruitId: type, date: new Date().getTime() },
                ];
            }
        });
    };

    return (
        <Modal
            size="medium"
            isOpen={props.open}
            onClose={props.handleClose}
            showCloseIcon
            className={classes.content}
        >
            <Header3 noMargin>{media?.MediaName}</Header3>
            <Grid container spacing={2} style={{ marginTop: "16px", marginBottom: "16px" }}>
                <Grid item xs={12} sm={6}>
                    <img
                        src={
                            media.imageURL ??
                            media.UrlMainPhoto ??
                            media.Url ??
                            media.url ??
                            `https://source.unsplash.com/random/${Math.floor(Math.random() * 1000)}`
                        }
                        className={classes.detailImg}
                        width="100%"
                    />
                </Grid>
                <Grid
                    item
                    xs={12}
                    sm={6}
                    style={{
                        marginTop: "8px",
                        paddingTop: media?.Auctions ? 0 : 2,
                        paddingBottom: media?.Auctions ? 0 : 2,
                    }}
                >
                    <Box display="flex" flexDirection="row" alignItems="center" justifyContent="space-between">
                        <Box display="flex" flexDirection="row" alignItems="center">
                            <Avatar size="medium" url={creator?.imageUrl || creator?.anonAvatar} />
                            <Box display="flex" flexDirection="column" ml={1} mr={1.25}>
                                <Text color={Color.Black} className={classes.creatorName} style={{ marginBottom: 4 }}>
                                    {creator?.name}
                                </Text>
                                <Text className={classes.creatorName}>{`@${creator?.urlSlug}`}</Text>
                            </Box>
                            {user && media?.CreatorId !== user.id && (
                                <SecondaryButton size="small" onClick={() => { }} className={classes.followBtn}>
                                    {isFollowing ? "Unfollow" : "Follow"}
                                </SecondaryButton>
                            )}
                        </Box>
                        <Box display="flex" flexDirection="row" alignItems="center">
                            <Box mr={2} style={{ background: Gradient.Green, borderRadius: "50%" }}>
                                <FruitSelect fruitObject={media} onGiveFruit={handleFruit} />
                            </Box>
                            <Box mr={2}>
                                <img
                                    src={require(`assets/icons/bookmark.png`)}
                                    alt="Bookmark"
                                    onClick={() => { }}
                                    style={{ cursor: "pointer" }}
                                />
                            </Box>
                            <Box mb={1}>
                                <div ref={anchorOptionsMenuRef} onClick={() => { }} style={{ cursor: "pointer" }}>
                                    <img src={require(`assets/icons/more.png`)} alt="like" />
                                </div>
                            </Box>
                        </Box>
                    </Box>
                    <ShareMenu
                        openMenu={openOptionsMenu}
                        anchorRef={anchorOptionsMenuRef}
                        item={media}
                        handleCloseMenu={() => setOpenOptionsMenu(false)}
                        isLeftAligned={true}
                    />
                    <Box display="flex" alignItems="center" my={2}>
                        {creatorsImages.length > 0 && (
                            <Box display="flex" alignItems="center" mr={2}>
                                {creatorsImages.map((owner: any) => (
                                    <Avatar
                                        key={`artist-${owner.id}`}
                                        className={classes.artist}
                                        size="small"
                                        url={owner.hasPhoto ? owner.url : owner.imageUrl}
                                    />
                                ))}
                                <Text color={Color.Green} ml={2}>
                                    Ownership History
                                </Text>
                            </Box>
                        )}
                        <Text size={FontSize.XL} mr={5}>
                            💾 {media?.shareCount || 0}
                        </Text>
                        <div onClick={handleOpenShareMenu} ref={anchorShareMenuRef}>
                            <Text size={FontSize.XL} mr={5}>
                                👀 {media?.TotalViews || 0}
                            </Text>
                        </div>
                        <Popper
                            open={openShareMenu}
                            anchorEl={anchorShareMenuRef.current}
                            transition
                            disablePortal
                            style={{ position: "inherit", zIndex: 9999 }}
                        >
                            {({ TransitionProps, placement }) => (
                                <Grow
                                    {...TransitionProps}
                                    style={{
                                        transformOrigin: placement === "bottom" ? "center top" : "center bottom",
                                        position: "inherit",
                                    }}
                                >
                                    <Paper>
                                        <ClickAwayListener onClickAway={handleCloseShareMenu}>
                                            <MenuList autoFocusItem={openShareMenu} id="menu-list-grow">
                                                <MenuItem>
                                                    <img
                                                        src={require("assets/icons/spaceship.png")}
                                                        alt={"spaceship"}
                                                        style={{ width: 20, height: 20, marginRight: 5 }}
                                                    />
                                                    <b style={{ marginRight: 5 }}>{"Share & Earn"}</b> to Privi
                                                </MenuItem>
                                                <MenuItem>
                                                    <img
                                                        src={require("assets/icons/butterfly.png")}
                                                        alt={"spaceship"}
                                                        style={{ width: 20, height: 20, marginRight: 5 }}
                                                    />
                                                    Share on social media
                                                </MenuItem>
                                                <MenuItem>
                                                    <img
                                                        src={require("assets/icons/qrcode_small.png")}
                                                        alt={"spaceship"}
                                                        style={{ width: 20, height: 20, marginRight: 5 }}
                                                    />
                                                    Share With QR Code
                                                </MenuItem>
                                            </MenuList>
                                        </ClickAwayListener>
                                    </Paper>
                                </Grow>
                            )}
                        </Popper>
                    </Box>
                    <hr className={classes.divider} />
                    <Header5>Collection</Header5>
                    {renderCollection()}
                    <hr className={classes.divider} />
                    <Box display="flex" alignItems="center" mb={2} justifyContent="flex-end">
                        <img src={require("assets/logos/privi.png")} width="32px" />
                        <Box ml={2}>Privi Chain</Box>
                    </Box>
                    <Box display="flex" flexDirection="row" alignItems="center" justifyContent="flex-end">
                        <Text color={Color.Black} size={FontSize.XL}>
                            Price
                        </Text>
                        <Text color={Color.Green} size={FontSize.XXL} ml={1} mr={1}>
                            {`ETH ${media?.ExchangeData ? media?.ExchangeData.Price : media?.NftConditions.Price}`}
                        </Text>
                        <Text color={Color.Black} size={FontSize.S}>
                            {`$(${convertTokenToUSD(
                                media?.ExchangeData
                                    ? media?.ExchangeData.OfferToken
                                    : media?.NftConditions.NftToken || media?.NftConditions.FundingToken,
                                media?.ExchangeData ? media?.ExchangeData.Price : media?.NftConditions.Price
                            ).toFixed(6)})`}
                        </Text>
                    </Box>
                    <Box display="flex" flexDirection="row" alignItems="center" justifyContent="flex-end" mt={2}>
                        <PrimaryButton
                            size="medium"
                            onClick={() => {
                                props.handleClose();
                                history.push(`/privi-digital-art/${media?.MediaSymbol ?? media?.id}`);
                            }}
                            style={{ background: Gradient.Green, color: "#707582" }}
                        >
                            Go to Privi Pix APP
                        </PrimaryButton>
                    </Box>
                </Grid>
            </Grid>
        </Modal>
    );
};

export default MediaDetailsModal;
