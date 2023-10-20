import { GetRoom, PostRoom } from "../types/room.type";

export function isGetRoom(obj: GetRoom): obj is GetRoom {
  return (
    typeof obj.id === "string" &&
    typeof obj.title === "string" &&
    typeof obj.price === "number" &&
    typeof obj.city === "string" &&
    typeof obj.city === "string" &&
    (typeof obj.street === "string" || typeof obj.street === "undefined") &&
    typeof obj.is_furnished === "boolean" &&
    typeof obj.is_pet_friendly === "boolean" &&
    typeof obj.description === "string" &&
    Array.isArray(obj.image_urls) &&
    obj.image_urls.every((item) => typeof item === "string") &&
    typeof obj.email === "string" &&
    typeof obj.created_at === "string" &&
    typeof obj.updated_at === "string"
  );
}

export function isPostRoom(obj: PostRoom): obj is PostRoom {
  return (
    typeof obj.title === "string" &&
    (obj.price === null || typeof obj.price === "number") &&
    typeof obj.city === "string" &&
    (typeof obj.street === "string" || typeof obj.street === "undefined") &&
    (obj.is_furnished === null || typeof obj.is_furnished === "boolean") &&
    (obj.is_pet_friendly === null || typeof obj.is_pet_friendly === "boolean") &&
    Array.isArray(obj.s3_keys) &&
    obj.s3_keys.every((item) => typeof item === "string") &&
    typeof obj.description === "string" &&
    typeof obj.email === "string"
  );
}
