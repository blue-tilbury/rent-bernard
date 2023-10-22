import { api } from "./config/axiosConfig";
import { defineCancelApiObj } from "./config/axiosUtils";
import { Id } from "../types/common.type";
import { GetRoom, ListRoom, Room, UpdateRoom } from "../types/room.type";

type RoomAPIType = {
  show: (id: string) => Promise<GetRoom>;
  index: () => Promise<ListRoom>;
  update: (room: UpdateRoom, cancel?: boolean) => Promise<void>;
  delete: (id: string, cancel?: boolean) => Promise<void>;
  create: (room: Room, cancel?: boolean) => Promise<Id>;
  private_index: () => Promise<ListRoom>;
  wishlist: () => Promise<ListRoom>;
};

export const RoomAPI: RoomAPIType = {
  show: async (id: string) => {
    const response = await api.request({
      url: `/rooms/${id}`,
      method: "GET",
    });

    return response.data;
  },
  index: async () => {
    const response = await api.request({
      url: "/rooms",
      method: "GET",
    });

    return response.data;
  },
  update: async (room: UpdateRoom, cancel = false) => {
    const response = await api.request({
      url: `/private/rooms/${room.id}`,
      method: "PUT",
      data: room,
      signal: cancel ? cancelApiObj["update"].handleRequestCancel().signal : undefined,
    });

    return response.data;
  },
  delete: async (id: string, cancel = false) => {
    await api.request({
      url: `/private/rooms/${id}`,
      method: "DELETE",
      signal: cancel ? cancelApiObj["delete"].handleRequestCancel().signal : undefined,
    });
  },
  create: async (room: Room, cancel = false) => {
    const response = await api.request({
      url: `/private/rooms`,
      method: "POST",
      data: room,
      signal: cancel ? cancelApiObj["create"].handleRequestCancel().signal : undefined,
    });

    return response.data;
  },
  private_index: async () => {
    const response = await api.request({
      url: "/private/rooms/",
      method: "GET",
    });

    return response.data;
  },
  wishlist: async () => {
    const response = await api.request({
      url: "/private/rooms/wishlist",
      method: "GET",
    });

    return response.data;
  },
};

const cancelApiObj = defineCancelApiObj(RoomAPI);
