import { api } from "./axiosConfig";
import { defineCancelApiObj } from "./axiosUtils";

type AuthParams = {
  token: string;
};

type AuthAPIType = {
  login: (data: AuthParams, cancel?: boolean) => Promise<void>;
};

export const AuthAPI: AuthAPIType = {
  login: async (token, cancel = false) => {
    await api.request({
      url: "/login",
      method: "POST",
      data: token,
      signal: cancel ? cancelApiObj["login"].handleRequestCancel().signal : undefined,
    });
  },
};

const cancelApiObj = defineCancelApiObj(AuthAPI);
