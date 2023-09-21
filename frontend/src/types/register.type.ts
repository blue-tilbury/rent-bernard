import { FieldError, UseControllerProps, UseFormRegister } from "react-hook-form";

import { Room } from "./room.type";

export type RawInputProps = InputProps & {
  name: RegisterName;
  style?: string;
};

export type InputProps = RegisterType & {
  error?: FieldError;
};

export type RegisterType = {
  register: UseFormRegister<Room>;
};

export type ControlledInputProps = UseControllerProps<Room> & {
  error?: FieldError;
};

export type RegisterName =
  | "city"
  | "title"
  | "price"
  | "street"
  | "is_furnished"
  | "is_pet_friendly"
  | "images"
  | "contact_information"
  | "description"
  | `images.${number}`
  | "contact_information.email";
