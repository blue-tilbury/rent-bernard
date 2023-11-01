import { FieldError } from "react-hook-form";
import { UseFormRegister } from "react-hook-form/dist/types/form";

export type FilterName =
  | "price_min"
  | "price_max"
  | "is_furnished"
  | "is_pet_friendly";

export type FilterType = {
  is_furnished?: boolean;
  is_pet_friendly?: boolean;
  price_min?: number;
  price_max?: number;
};

export type FilterRawInputProps = {
  register: UseFormRegister<FilterType>;
  name: FilterName;
  error?: FieldError;
};
