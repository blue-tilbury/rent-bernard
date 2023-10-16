import { AxiosRequestConfig } from "axios";
import useSWR from "swr";
import useSWRMutation from "swr/mutation";

import { AuthAPI } from "../apis/authAPI";
import { api } from "../apis/axiosConfig";
import { PhotoAPI } from "../apis/photoAPI";
import { RoomAPI } from "../apis/roomAPI";
import { Room } from "../types/room.type";
import { AuthParams } from "../types/user.type";

const fetcher = <T>(url: string, params: AxiosRequestConfig<T>) =>
  api.request({ url, params }).then((res) => res.data);

export const useRoom = <T>(params: AxiosRequestConfig<T>) => {
  const { data, error, isLoading } = useSWR(["/rooms", params], ([url, params]) =>
    fetcher(url, params),
  );
  return { data, isError: error, isLoading };
};

export const useCreateRoom = () => {
  const { trigger: triggerRoom } = useSWRMutation(
    "/rooms",
    async (_url: string, { arg }: { arg: Room }) => RoomAPI.create(arg),
  );
  return { triggerRoom };
};

export const useGetPhoto = () => {
  const { trigger: triggerPhoto } = useSWRMutation("/photos/upload", async () =>
    PhotoAPI.show(),
  );
  return { triggerPhoto };
};

export const useLoginUser = () => {
  const { trigger: triggerLogin } = useSWRMutation(
    "/login",
    async (_url: string, { arg }: { arg: AuthParams }) => AuthAPI.login(arg),
  );
  return { triggerLogin };
};

export const useGetUser = () => {
  const { trigger: triggerGetUser } = useSWRMutation("/login_user", async () =>
    AuthAPI.login_user(),
  );
  return { triggerGetUser };
};

export const useLogoutUser = () => {
  const { trigger: triggerLogout } = useSWRMutation("/logout", async () =>
    AuthAPI.logout(),
  );
  return { triggerLogout };
};
