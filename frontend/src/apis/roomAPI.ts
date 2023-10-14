import { api } from "./axiosConfig";
import { defineCancelApiObj } from "./axiosUtils";
import { GetRoom, Id, ListRoom, Room } from "../types/room.type";

type RoomAPIType = {
  show: (id: string, cancel?: boolean) => Promise<GetRoom>;
  index: (username?: string, cancel?: boolean) => Promise<ListRoom>;
  update: (id: string, room: Room, cancel?: boolean) => Promise<void>;
  delete: (id: string, cancel?: boolean) => Promise<void>;
  create: (room: Room, cancel?: boolean) => Promise<Id>;
};

export const RoomAPI: RoomAPIType = {
  show: async (id: string, cancel = false) => {
    const response = await api.request({
      url: `/rooms/${id}`,
      method: "GET",
      signal: cancel ? cancelApiObj["show"].handleRequestCancel().signal : undefined,
    });

    return response.data;
  },
  index: async (username?: string, cancel = false) => {
    const response = await api.request({
      url: `/rooms?${username}`,
      method: "GET",
      signal: cancel ? cancelApiObj["index"].handleRequestCancel().signal : undefined,
    });

    return response.data;
  },
  update: async (id: string, room: Room, cancel = false) => {
    const response = await api.request({
      url: `/rooms/${id}`,
      method: "PUT",
      data: room,
      signal: cancel ? cancelApiObj["update"].handleRequestCancel().signal : undefined,
    });

    return response.data;
  },
  delete: async (id: string, cancel = false) => {
    await api.request({
      url: `/rooms/${id}`,
      method: "DELETE",
      signal: cancel ? cancelApiObj["delete"].handleRequestCancel().signal : undefined,
    });
  },
  create: async (room: Room, cancel = false) => {
    const response = await api.request({
      url: `/rooms`,
      method: "POST",
      data: room,
      signal: cancel ? cancelApiObj["create"].handleRequestCancel().signal : undefined,
    });

    return response.data;
  },
};

const cancelApiObj = defineCancelApiObj(RoomAPI);
