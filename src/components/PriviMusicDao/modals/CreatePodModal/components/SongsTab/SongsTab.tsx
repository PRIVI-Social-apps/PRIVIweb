import React from "react";
import { Box, Select, MenuItem, Tooltip, Fade } from "@material-ui/core";
import SvgIcon from "@material-ui/core/SvgIcon";

import { songsTabStyles } from "./SongsTab.styles";
import { FontSize, PrimaryButton, SecondaryButton, StyledDivider } from "shared/ui-kit";
import { AddIcon, EditIcon, RemoveIcon } from "components/PriviMusicDao/components/Icons/SvgIcons";
import { Text } from "components/PriviMusicDao/components/ui-kit";
import { imageTitleDescriptionStyles } from "shared/ui-kit/Page-components/ImageTitleDescription.styles";
import { ReactComponent as CloseSolid } from "assets/icons/close-solid.svg";
import FileUpload from "shared/ui-kit/Page-components/FileUpload";

const infoIcon = require("assets/icons/info.svg");
const imageIcon = require("assets/icons/image_icon.png");

const imageSize = 12;

const SongsTab = ({pod, setPod}) => {
  const classes = songsTabStyles();
  const imageUploadClasses = imageTitleDescriptionStyles();

  const [editable, setEditable] = React.useState<boolean>(false);
  const [photo, setPhoto] = React.useState<any>(null);
  const [photoImg, setPhotoImg] = React.useState<any>(null);
  const [songTitle, setSongTitle] = React.useState<string>("");
  const [songGenre, setSongGenre] = React.useState<any>("pop");
  const [songSymbol, setSongSymbol] = React.useState<string>("");

  const handleAdd = () => {
    const medias = [...pod.Medias];
    medias.push({
      Title: songTitle,
      Genre: songGenre,
      MediaSymbol: songSymbol,
      Photo: photo,
      PhotoImg: photoImg,
    });
    setPod({...pod, Medias: medias});
    setEditable(false);
    setSongTitle("");
    setSongGenre("pop");
    setSongSymbol("");
    setPhoto(null);
    setPhotoImg(null);
  };

  const handleEdit = song => {
    setEditable(true);
    setSongTitle(song.Title);
    setSongGenre(song.Genre);
    setSongSymbol(song.MediaSymbol);
    setPhoto(song.Photo);
    setPhotoImg(song.PhotoImg);
  };

  const handleRemove = song => {
    let medias = [...pod.Medias];
    medias = medias.filter(item => item.MediaSymbol !== song.MediaSymbol);
    setPod({...pod, Medias: medias});
  };

  return (
    <Box>
      <Box mb={2}>
        {pod.Medias.map((song, index) => (
          <Box key={`song-card-${index}`} className={classes.card}>
            <Box display="flex" flexDirection="row" alignItems="center">
              <img width={154} height={107} src={song.PhotoImg} alt="cardimage" />
              <Box display="flex" flexDirection="column" ml={3}>
                <Text size={FontSize.L} bold mb={2}>
                  {song.Title}
                </Text>
                <Text>
                  {song.Genre} | {song.MediaSymbol}
                </Text>
              </Box>
            </Box>
            <Box display="flex" flexDirection="row" justifyContent="flex-end">
              <SecondaryButton
                size="small"
                className={classes.removeButton}
                onClick={() => handleRemove(song)}
              >
                <RemoveIcon />
                Remove
              </SecondaryButton>
              <PrimaryButton size="small" className={classes.editButton} onClick={() => handleEdit(song)}>
                <EditIcon />
                Edit
              </PrimaryButton>
            </Box>
          </Box>
        ))}
      </Box>
      <PrimaryButton size="medium" className={classes.button} onClick={handleAdd}>
        <AddIcon />
        Add Song
      </PrimaryButton>
      <StyledDivider type="solid" margin={3} />
      <div className={classes.title}>Add Song</div>

      <Box className={classes.label} mb={1}>
        <div>Pod Image</div>
        <Tooltip TransitionComponent={Fade} TransitionProps={{ timeout: 600 }} arrow title={""}>
          <img src={require("assets/icons/info_music_dao.png")} alt="info" />
        </Tooltip>
      </Box>
      <FileUpload
        photo={photo}
        photoImg={photoImg}
        setterPhoto={setPhoto}
        setterPhotoImg={setPhotoImg}
        mainSetter={undefined}
        mainElement={undefined}
        type="image"
        canEdit
        theme="music dao"
        extra={true}
      />

      <Box className={classes.label} mb={1} mt="24px">
        <div>Song Title</div>
        <Tooltip TransitionComponent={Fade} TransitionProps={{ timeout: 600 }} arrow title={""}>
          <img src={require("assets/icons/info_music_dao.png")} alt="info" />
        </Tooltip>
      </Box>
      <input
        className={classes.input}
        placeholder="A title for your song"
        value={songTitle}
        onChange={e => setSongTitle(e.target.value)}
      />
      <Box display="flex" flexDirection="row" alignItems="center" justifyContent="space-between" my={2}>
        <Box width={"50%"} pr={1}>
          <Box className={classes.label} mb={1}>
            <div>Genre</div>
            <Tooltip TransitionComponent={Fade} TransitionProps={{ timeout: 600 }} arrow title={""}>
              <img src={require("assets/icons/info_music_dao.png")} alt="info" />
            </Tooltip>
          </Box>
          <Select className={classes.input} value={songGenre} onChange={e => setSongGenre(e.target.value)}>
            <MenuItem value="pop">Pop Music</MenuItem>
          </Select>
        </Box>
        <Box width={"50%"} pl={1}>
          <Box className={classes.label} mb={1}>
            <div>Song Symbol</div>
            <Tooltip TransitionComponent={Fade} TransitionProps={{ timeout: 600 }} arrow title={""}>
              <img src={require("assets/icons/info_music_dao.png")} alt="info" />
            </Tooltip>
          </Box>
          <input
            className={classes.input}
            placeholder="An identifier to your song"
            value={songSymbol}
            onChange={e => setSongSymbol(e.target.value)}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default SongsTab;
