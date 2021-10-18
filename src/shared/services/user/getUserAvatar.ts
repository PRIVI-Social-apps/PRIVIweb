import { getUserPhoto } from "./getUserPhoto";

export type UserAvatarMetadata = {
  id: string;
  anon?: boolean;
  hasPhoto?: boolean;
  anonAvatar?: string;
  url?: string;
};

export const getUserAvatar = (user?: UserAvatarMetadata) => {
  if (user && user.anon === false && user.hasPhoto) {
    return getUserPhoto(user.id, user.url);
  }

  if (user && user.anonAvatar) {
    return require(`assets/anonAvatars/${user.anonAvatar}`);
  }

  return getRandomAvatar();
};

export const getRandomAvatar = (): string => {
  const randomNumber = Math.floor(Math.random() * 118 + 1);
  return require(`assets/anonAvatars/ToyFaces_Colored_BG_${randomNumber.toString().padStart(3, "0")}.jpg`);
};

const AvatarHashTable = {};

export const getRandomAvatarForUserIdWithMemoization = (userId: string) => {
  if (!AvatarHashTable[userId]) {
    AvatarHashTable[userId] = getRandomAvatar();
  }

  return AvatarHashTable[userId];
};
