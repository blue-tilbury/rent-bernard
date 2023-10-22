import { api } from "./config/axiosConfig";
import { defineCancelApiObj } from "./config/axiosUtils";

type WishlistAPIType = {
  create: (roomId: string, cancel?: boolean) => Promise<void>;
  delete: (roomId: string, cancel?: boolean) => Promise<void>;
};

export const WishlistAPI: WishlistAPIType = {
  create: async (roomId: string, cancel = false) => {
    await api.request({
      url: "/wishlists",
      method: "POST",
      data: { room_id: roomId },
      signal: cancel ? cancelApiObj["create"].handleRequestCancel().signal : undefined,
    });
  },
  delete: async (roomId: string, cancel = false) => {
    await api.request({
      url: "/wishlists",
      method: "DELETE",
      data: { room_id: roomId },
      signal: cancel ? cancelApiObj["delete"].handleRequestCancel().signal : undefined,
    });
  },
};

const cancelApiObj = defineCancelApiObj(WishlistAPI);
