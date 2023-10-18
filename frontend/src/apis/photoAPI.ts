import { api } from "./config/axiosConfig";
import { defineCancelApiObj } from "./config/axiosUtils";
import { UploadPhoto } from "../types/room.type";

type PhotoAPIType = {
  show: (cancel?: boolean) => Promise<UploadPhoto>;
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
};

const cancelApiObj = defineCancelApiObj(PhotoAPI);
