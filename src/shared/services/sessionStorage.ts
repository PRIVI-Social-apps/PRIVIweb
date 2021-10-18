enum StorageKey {
  Token = "token",
}

export const loadJwtToken = () => sessionStorage.getItem(StorageKey.Token);
