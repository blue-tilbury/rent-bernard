import { api } from "./config/axiosConfig";
import { defineCancelApiObj } from "./config/axiosUtils";
import { AuthParams, User } from "../types/user.type";

type AuthAPIType = {
  login: (token: AuthParams, cancel?: boolean) => Promise<void>;
  login_user: (cancel?: boolean) => Promise<User>;
  logout: (cancel?: boolean) => Promise<void>;
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
  login_user: async (cancel = false) => {
    const response = await api.request({
      url: "/private/login_user",
      method: "GET",
      signal: cancel
        ? cancelApiObj["login_user"].handleRequestCancel().signal
        : undefined,
    });

    return response.data;
  },
  logout: async (cancel = false) => {
    await api.request({
      url: "/logout",
      method: "POST",
      signal: cancel ? cancelApiObj["logout"].handleRequestCancel().signal : undefined,
    });
  },
};

const cancelApiObj = defineCancelApiObj(AuthAPI);
