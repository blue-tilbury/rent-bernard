import { api } from "./config/axiosConfig";
import { defineCancelApiObj } from "./config/axiosUtils";
import { UploadPhoto } from "../types/room.type";

type PhotoAPIType = {
  show: (cancel?: boolean) => Promise<UploadPhoto>;
  convert: (url: string) => Promise<Blob>;
};

export const PhotoAPI: PhotoAPIType = {
  show: async (cancel = false) => {
    const response = await api.request({
      url: "/private/photos/upload",
      method: "GET",
      signal: cancel ? cancelApiObj["show"].handleRequestCancel().signal : undefined,
    });

    return response.data;
  },
  convert: async (url: string) => {
    const response = await api.request({
      url: url,
      method: "GET",
      responseType: "blob",
      withCredentials: false,
    });

    return response.data;
  },
};

const cancelApiObj = defineCancelApiObj(PhotoAPI);
