import useSWR from "swr";
import useSWRMutation from "swr/mutation";

import { AuthAPI } from "../apis/authAPI";
import { PhotoAPI } from "../apis/photoAPI";
import { RoomAPI } from "../apis/roomAPI";
import { Room, UpdateRoom } from "../types/room.type";
import { AuthParams } from "../types/user.type";

// Room
export const useRoom = () => {
  const { data, error, isLoading } = useSWR("/rooms", RoomAPI.index);
  return { data, isError: error, isLoading };
};

export const useGetRoom = (id: string) => {
  const { trigger: triggerGetRoom } = useSWRMutation(
    `/rooms/${id}`,
    async (_url: string, { arg }: { arg: string }) => RoomAPI.show(arg),
  );
  return { triggerGetRoom };
};

export const useYourRoom = () => {
  const { data, error, isLoading } = useSWR("/private/rooms", RoomAPI.private_index);
  return { data, isError: error, isLoading };
};

export const useDeleteRoom = () => {
  const { trigger: triggerDeleteRoom } = useSWRMutation(
    `/private/rooms`,
    async (_url: string, { arg }: { arg: string }) => RoomAPI.delete(arg),
  );
  return { triggerDeleteRoom };
};

export const useCreateRoom = () => {
  const { trigger: triggerRoom } = useSWRMutation(
    "/rooms",
    async (_url: string, { arg }: { arg: Room }) => RoomAPI.create(arg),
  );
  return { triggerRoom };
};

export const useUpdateRoom = () => {
  const { trigger: triggerUpdateRoom } = useSWRMutation(
    "/rooms",
    async (_url: string, { arg }: { arg: UpdateRoom }) => RoomAPI.update(arg),
  );
  return { triggerUpdateRoom };
};

// Photo
export const useGetPhoto = () => {
  const { trigger: triggerPhoto } = useSWRMutation("/photos/upload", async () =>
    PhotoAPI.show(),
  );
  return { triggerPhoto };
};

// User
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
