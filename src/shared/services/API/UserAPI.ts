import axios from "axios";
import URL from "shared/functions/getURL";

// get
export async function getProfileTabsInfo(
    userId: string,
    isVisitor: boolean,
    mainTab: string,
    subTab: string,
    lastId: string,
    isLastNFT: boolean,
    pagination: number,
    lastLikedMedia: string
): Promise<any> {
    try {
    const config = {
        params: {
            userId,
            isVisitor,
            mainTab,
            subTab,
            lastId,
            isLastNFT,
            pagination,
            lastLikedMedia,
        },
    };
    const response = await axios.get(`${URL()}/user/getProfileTapsInfo`, config);
    return response?.data;
    } catch (e) {
        console.log(e);
        throw new Error(e.message);
    }
}

export interface IAutocompleteUsers {
    name: string,
    urlSlug: string,
    address: string,
    imageUrl: string,
}

export async function getMatchingUsers(
    searchValue: string,
    properties: string[]
): Promise<any> {
    try {
        let url = `${URL()}/user/getMatchingUsers`;
        url += `?value=${searchValue}`;
        properties.forEach(prop => url += `&properties=${prop}`)
    const response = await axios.get(url);
    return response?.data;
    } catch (e) {
        console.log(e);
        throw new Error(e.message);
    }
}
