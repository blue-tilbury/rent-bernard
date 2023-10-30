import { AddressInfoType } from "../types/form.type";
import { GetRoom, PostRoom, Room } from "../types/room.type";

type ConverterType = {
  GetRoomToRoom: (room: GetRoom, files: File[]) => Room;
  GetRoomToPostRoom: (room: GetRoom, files: File[]) => PostRoom;
  PostRoomToRoom: (room: PostRoom, addressInfo: AddressInfoType) => Room;
};

export const Converter: ConverterType = {
  GetRoomToRoom: (room: GetRoom, files: File[]) => {
    const convertedRoom: Room = {
      title: room.title,
      price: room.price,
      formatted_address: room.formatted_address,
      address_components: room.city,
      place_id: room.place_id,
      is_furnished: room.is_furnished,
      is_pet_friendly: room.is_pet_friendly,
      s3_keys: files.map((file) => file.name),
      description: room.description,
      email: room.email,
    };

    return convertedRoom;
  },
  GetRoomToPostRoom: (room: GetRoom, files: File[]) => {
    const convertedRoom: PostRoom = {
      title: room.title,
      price: room.price,
      place_id: room.place_id,
      is_furnished: room.is_furnished,
      is_pet_friendly: room.is_pet_friendly,
      s3_keys: files.map((file) => file.name),
      description: room.description,
      email: room.email,
    };

    return convertedRoom;
  },
  PostRoomToRoom: (room: PostRoom, addressInfo: AddressInfoType) => {
    const convertedRoom: Room = {
      title: room.title,
      price: room.price !== null ? room.price : 0,
      formatted_address: addressInfo.formatted_address,
      address_components: JSON.stringify(addressInfo.address_components),
      place_id: room.place_id,
      is_furnished: room.is_furnished !== null ? room.is_furnished : false,
      is_pet_friendly: room.is_pet_friendly !== null ? room.is_pet_friendly : false,
      s3_keys: room.s3_keys,
      description: room.description,
      email: room.email,
    };

    return convertedRoom;
  },
};
