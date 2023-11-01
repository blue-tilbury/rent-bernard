import { FilterRawInputProps } from "../../types/filter.type";

export const PriceInput = ({ register, name, error }: FilterRawInputProps) => {
  const placeholderText = name === "price_min" ? "Min" : "Max";

  return (
    <div className="flex flex-col">
      <div className="flex items-center">
        <span>$</span>
        <input
          type="number"
          {...register(name, { valueAsNumber: true })}
          inputMode="numeric"
          placeholder={placeholderText}
          className="h-7 w-20 rounded border-rent-input-gray text-xs"
        />
      </div>
      {error?.message && (
        <p className="pt-1 text-sm text-red-600">{error.message}</p>
      )}
    </div>
  );
};
