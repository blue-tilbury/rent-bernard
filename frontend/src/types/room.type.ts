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
  thumbnail_url?: string,
  email: string;
  created_at: string;
  updated_at: string;
};

export type Id = {
  id: string;
};

export type UploadPhoto = {
  url: string;
  key: string;
};
