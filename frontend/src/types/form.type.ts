import {
  FieldError,
  FieldValues,
  Merge,
  UseControllerProps,
  UseFormRegister,
  UseFormSetValue,
} from "react-hook-form";

import { PostRoom } from "./room.type";

export type RegisterName =
  | "title"
  | "price"
  | "is_furnished"
  | "is_pet_friendly"
  | "s3_keys"
  | "description"
  | `s3_keys.${number}`
  | "email";

export type RawInputProps = InputProps & {
  name: RegisterName;
  style?: string;
};

export type InputProps = {
  register: UseFormRegister<PostRoom>;
  error?: FieldError;
};

export type ControlledInputProps<T extends FieldValues> = UseControllerProps<T> & {
  error?: FieldError;
};

export type ImageInputProps = UseControllerProps<PostRoom> & {
  error?: Merge<FieldError, (FieldError | undefined)[]>;
  files: File[];
  handleFiles(value: File[], type: "update" | "delete"): void;
  setValue: UseFormSetValue<PostRoom>;
};

export type AddressInputProps = UseControllerProps<PostRoom> & {
  error?: FieldError;
  handleAddress(value: AddressInfoType): void;
  addressInfo: AddressInfoType;
};

export type AddressInfoType = {
  address_components: google.maps.GeocoderAddressComponent[];
  formatted_address: string;
  longitude: number;
  latitude: number;
};
