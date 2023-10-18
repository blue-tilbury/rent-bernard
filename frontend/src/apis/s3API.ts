import { api } from "./axiosConfig";
import { defineCancelApiObj } from "./axiosUtils";

type S3APIType = {
  upload: (url: string, file: File, cancel?: boolean) => Promise<void>;
};

export const S3API: S3APIType = {
  upload: async (url: string, file: File, cancel = false) => {
    await api.request({
      url: `${url}`,
      method: "PUT",
      data: file,
      signal: cancel ? cancelApiObj["upload"].handleRequestCancel().signal : undefined,
      withCredentials: false,
    });
  },
};

const cancelApiObj = defineCancelApiObj(S3API);
