import { FieldError, Merge, UseControllerProps, UseFormRegister, UseFormSetValue } from "react-hook-form";

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

export type ImageInputProps = UseControllerProps<Room> & {
  files: File[];
  handleFiles(value: File[], type: 'update' | 'delete'): void;
  error?:  Merge<FieldError, (FieldError | undefined)[]>;
  setValue: UseFormSetValue<Room>;
};

export type RegisterName =
  | "city"
  | "title"
  | "price"
  | "street"
  | "is_furnished"
  | "is_pet_friendly"
  | "s3_keys"
  | "contact_information"
  | "description"
  | `s3_keys.${number}`
  | "contact_information.email";
