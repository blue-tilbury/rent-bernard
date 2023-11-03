import { Id } from "./common.type";

export type Room = {
  title: string;
  price: number;
  formatted_address: string;
  address_components: string;
  place_id: string;
  is_furnished: boolean;
  is_pet_friendly: boolean;
  s3_keys: string[];
  description: string;
  email: string;
};

export type PostRoom = {
  title: string;
  price: number | null;
  place_id: string;
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
  formatted_address: string;
  city: string;
  place_id: string;
  is_furnished: boolean;
  is_pet_friendly: boolean;
  is_favorite: boolean;
  description: string;
  image_urls: string[];
  email: string;
  created_at: string;
  updated_at: string;
};

export type ListRoom = {
  count: number;
  rooms: ListItem[];
};

export type ListItem = {
  id: string;
  title: string;
  price: number;
  formatted_address: string;
  city: string;
  place_id: string;
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
  sort_by?: SortBy;
  order?: Order;
  is_furnished?: boolean;
  is_pet_friendly?: boolean;
  price_min?: number;
  price_max?: number;
  page?: number;
  per_page?: number;
};

export type UploadPhoto = {
  url: string;
  key: string;
};
