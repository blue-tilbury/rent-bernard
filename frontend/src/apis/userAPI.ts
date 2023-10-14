import { api } from "./axiosConfig";
import { defineCancelApiObj } from "./axiosUtils";
import { Id } from "../types/common.type";

type UserParams = {
  token: string;
};

type UserAPIType = {
  create: (data: UserParams, cancel?: boolean) => Promise<Id>;
};

export const UserAPI: UserAPIType = {
  create: async (token, cancel = false) => {
    const response = await api.request({
      url: "/users",
      method: "POST",
      data: token,
      signal: cancel ? cancelApiObj["create"].handleRequestCancel().signal : undefined,
    });

    return response.data;
  },
};

const cancelApiObj = defineCancelApiObj(UserAPI);
