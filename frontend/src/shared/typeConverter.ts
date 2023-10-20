import { GetRoom, PostRoom, Room } from "../types/room.type";

type ConverterType = {
  GetRoomToRoom: (room: GetRoom, files: File[]) => Room;
  PostRoomToRoom: (room: PostRoom) => Room;
};

export const Converter: ConverterType = {
  GetRoomToRoom: (room: GetRoom, files: File[]) => {
    const convertedRoom: Room = {
      title: room.title,
      price: room.price,
      city: room.city,
      street: room.street,
      is_furnished: room.is_furnished,
      is_pet_friendly: room.is_pet_friendly,
      s3_keys: files.map((file) => file.name),
      description: room.description,
      email: room.email,
    };

    return convertedRoom;
  },
  PostRoomToRoom: (room: PostRoom) => {
    const convertedRoom: Room = {
      title: room.title,
      price: room.price !== null ? room.price : 0,
      city: room.city,
      street: room.street,
      is_furnished: room.is_furnished !== null ? room.is_furnished : false,
      is_pet_friendly: room.is_pet_friendly !== null ? room.is_pet_friendly : false,
      s3_keys: room.s3_keys,
      description: room.description,
      email: room.email,
    };

    return convertedRoom;
  },
};
