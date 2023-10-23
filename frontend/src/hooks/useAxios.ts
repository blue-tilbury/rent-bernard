import useSWR from "swr";
import useSWRMutation from "swr/mutation";

import { AuthAPI } from "../apis/authAPI";
import { PhotoAPI } from "../apis/photoAPI";
import { RoomAPI } from "../apis/roomAPI";
import { WishlistAPI } from "../apis/wishlistAPI";
import { QueryParams, Room, UpdateRoom } from "../types/room.type";
import { AuthParams } from "../types/user.type";

// Room
export const useRoom = (queryParams: QueryParams) => {
  const { data, error, isLoading } = useSWR(
    [
      `/rooms?${new URLSearchParams(queryParams).toString()}`,
      queryParams.sortBy,
      queryParams.order,
    ],
    ([, sortBy, order]) => RoomAPI.index(sortBy, order),
  );
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

export const useWishlist = () => {
  const { data, error, isLoading, isValidating } = useSWR(
    "/private/rooms/wishlist",
    RoomAPI.wishlist,
  );
  return { data, isError: error, isLoading, isValidating };
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

export const useAddFav = () => {
  const { trigger: triggerAddFav } = useSWRMutation(
    "/wishlists",
    async (_url: string, { arg }: { arg: string }) => WishlistAPI.create(arg),
  );
  return { triggerAddFav };
};

export const useDeleteFav = () => {
  const { trigger: triggerDeleteFav } = useSWRMutation(
    "/wishlists",
    async (_url: string, { arg }: { arg: string }) => WishlistAPI.delete(arg),
  );
  return { triggerDeleteFav };
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
