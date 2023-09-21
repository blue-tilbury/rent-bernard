// TODO: change images type
export type Room = {
  title: string;
  price: number;
  city: string;
  street?: string;
  is_furnished: boolean;
  is_pet_friendly: boolean;
  images: File[];
  contact_information: ContactInformation;
  description: string;
};

type ContactInformation = {
  email: string;
};
