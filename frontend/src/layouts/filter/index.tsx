import { useForm } from "react-hook-form";

import { CheckBox } from "./CheckBox";
import { PriceInput } from "./PriceInput";
import { Button } from "../../components/Button";
import { FilterType } from "../../types/filter.type";
import { zodResolver } from "@hookform/resolvers/zod";
import { filterSchema } from "../../shared/zodScheme";
import { Divider } from "@mui/material";

export type FilterProps = {
  handleFilter(newValues: FilterType): void;
  filter: FilterType;
};

export const Filter = ({ handleFilter, filter }: FilterProps) => {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FilterType>({
    resolver: zodResolver(filterSchema),
    defaultValues: {
      is_furnished: filter.is_furnished,
      is_pet_friendly: filter.is_pet_friendly,
      price_min: filter.price_min,
      price_max: filter.price_max,
    },
  });

  const submit = (formValues: FilterType) => {
    handleFilter(formValues);
  };

  return (
    <form
      onSubmit={handleSubmit(submit)}
      className="mt-14 h-fit w-56 flex-none rounded-md border bg-white px-4 py-6 text-sm mr-2"
    >
      <p className="px-1 pb-4 text-lg font-medium">Find Apartments / Housing for Rent</p>
      <Divider sx={{ mb: 2 }} />
      <div className="pb-6">
        <p className=" font-medium">Price</p>
        <div className="flex items-baseline">
          <PriceInput register={register} name="price_min" error={errors.price_min} />
          <span className="px-1 font-semibold">-</span>
          <PriceInput register={register} name="price_max" error={errors.price_max} />
        </div>
      </div>
      <CheckBox control={control} name="is_furnished" />
      <CheckBox control={control} name="is_pet_friendly" />
      <div className="pb-2 pt-6 text-center">
        <Button size="sm" color="trinary" type="submit">
          Apply
        </Button>
      </div>
    </form>
  );
};
