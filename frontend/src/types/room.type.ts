import { Id } from "./common.type";

export type Room = {
  title: string;
  price: number;
  city: string;
  street?: string;
  is_furnished: boolean;
  is_pet_friendly: boolean;
  s3_keys: string[];
  description: string;
  email: string;
};

export type PostRoom = {
  title: string;
  price: number | null;
  city: string;
  street?: string;
  is_furnished: boolean | null;
  is_pet_friendly: boolean | null;
  s3_keys: string[];
  description: string;
  email: string;
};

export type UpdateRoom = Room & Id;

export type GetRoom = {
  id: string;
  title: string;
  price: number;
  city: string;
  street?: string;
  is_furnished: boolean;
  is_pet_friendly: boolean;
  description: string;
  image_urls: string[];
  email: string;
  created_at: string;
  updated_at: string;
};

export type ListRoom = {
  rooms: ListItem[];
};

export type ListItem = {
  id: string;
  title: string;
  price: number;
  city: string;
  street?: string;
  is_furnished: boolean;
  is_pet_friendly: boolean;
  description: string;
  thumbnail_url?: string;
  is_favorite: boolean;
  email: string;
  created_at: string;
  updated_at: string;
};

export enum SortBy {
  UPDATED_AT = "updated_at",
  PRICE = "price",
}

export enum Order {
  ASC = "asc",
  DESC = "desc",
}

export type QueryParams = {
  sortBy: SortBy;
  order: Order;
};

export type UploadPhoto = {
  url: string;
  key: string;
};
