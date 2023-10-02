import { RawInputProps } from "../../types/register.type";

export const NumberInput = ({ register, name, error }: RawInputProps) => {
  return (
    <div className="flex flex-col">
      <div className="flex items-center">
        <span className="px-3">$</span>
        <input
          type="number"
          {...register(name, { valueAsNumber: true })}
          className="rounded border-rent-input-gray"
        />
      </div>
      {error?.message && (
        <p className="pl-1 pt-1 text-sm text-red-600">{error.message}</p>
      )}
    </div>
  );
};
