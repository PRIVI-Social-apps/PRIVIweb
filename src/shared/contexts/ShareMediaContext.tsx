import { PriviShareModal } from "components/legacy/Media/modals/ShareMediaToPriviModal";
import { ShareMediaToSocialModal } from "components/legacy/Media/modals/ShareMediaToSocialModal";
import { ShareMediaWithQRCode } from "components/legacy/Media/modals/ShareMediaWithQRCode";
import React, { createContext, useCallback, useContext, useMemo, useState } from "react";
import { PriviMedia, shareMediaToSocial } from "shared/services/API/MediaAPI";

enum MediaType {
  Video = "VIDEO_TYPE",
  LiveVideo = "LIVE_VIDEO_TYPE",
  Audio = "AUDIO_TYPE",
  LiveAudio = "LIVE_AUDIO_TYPE",
  Blog = "BLOG_TYPE",
  BlogSnap = "BLOG_SNAP_TYPE",
  DigitalArt = "DIGITAL_ART_TYPE",
}

type SocialMedia = {
  id: string,
  type: string,
  subType?: string,
};
type ShareMediaContextProviderProps = {};

type ShareMediaContextType = {
  shareMediaToSocial(id: string, type: string, subType?: string, link?: string);
  shareMediaToPrivi(media: PriviMedia);
  shareMediaWithQrCode(mediaId: string, link: string, mediaType?: MediaType);
};

const ShareMediaContext = createContext<ShareMediaContextType | null>(null);

export const ShareMediaContextProvider: React.FunctionComponent<ShareMediaContextProviderProps> = ({ children }) => {
  const [openSocialModal, showSocialModal] = useState(false);
  const [openPriviModal, showPriviModal] = useState(false);
  const [openQrCodeModal, showQrCodeModal] = useState(false);

  const [socialMedia, setSocialMedia] = useState<SocialMedia | undefined>(undefined);
  const [priviMedia, setPriviMedia] = useState<PriviMedia | undefined>(undefined);

  const [shareLink, setShareLink] = useState("");

  const shareMedia = useCallback(() => {
    if (socialMedia && socialMedia.id) {
      shareMediaToSocial(socialMedia);
    }
  }, [socialMedia]);

  const getPrefixURL = () => {
    if (process.env.NODE_ENV === 'development')
      return `http://localhost:3001/#`;
    return `https://privibeta.web.app/#/`;
  }

  const context = useMemo<ShareMediaContextType>(
    () => ({
      shareMediaToSocial(id: string, type: string = 'Media', subType?: string, link?: string) {
        if (subType === "DIGITAL_ART_TYPE") {
          setShareLink(`https://privibeta.web.app/#/privi-digital-art/${id}`);
        } else if (subType === "NEW-PRIVI-PODS") {
          setShareLink(`${getPrefixURL()}/${link}`);
        } else if (subType === 'SOCIAL_APP') {
          setShareLink(`${getPrefixURL()}/privi-social/${id}`);
        } else {
          setShareLink(`https://privibeta.web.app/#/media/${id}`);
        }
        setSocialMedia({ id, type, subType });
        showSocialModal(true);
      },
      shareMediaToPrivi(media) {
        setPriviMedia(media);
        showPriviModal(true);
      },
      shareMediaWithQrCode(mediaSymbol, link, mediaType) {
        setShareLink(`${getPrefixURL()}/${link}`);
        setSocialMedia({ id: mediaSymbol, type: 'Media', subType: mediaType });
        showQrCodeModal(true);
      },
    }),
    []
  );

  return (
    <ShareMediaContext.Provider value={context}>
      {children}
      {openSocialModal && (
        <ShareMediaToSocialModal
          shareLink={shareLink}
          open={openSocialModal}
          handleClose={() => showSocialModal(false)}
          shareMedia={shareMedia}
        />
      )}
      {openQrCodeModal && (
        <ShareMediaWithQRCode
          isOpen={openQrCodeModal}
          onClose={() => showQrCodeModal(false)}
          mediaId={socialMedia?.id}
          shareLink={shareLink}
        />
      )}
      {openPriviModal && (
        <PriviShareModal media={priviMedia} isOpen={openPriviModal} onClose={() => showPriviModal(false)} />
      )}
    </ShareMediaContext.Provider>
  );
};

export const useShareMedia = () => {
  const context = useContext(ShareMediaContext);

  if (!context) {
    throw new Error("useShareMedia hook must be used inside ShareMediaContextProvider");
  }

  return context;
};
