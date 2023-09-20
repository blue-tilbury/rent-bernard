import { RawInputProps } from "../../types/register.type";

export const NumberInput = ({ register, name, error }: RawInputProps) => {
  return (
    <div className="flex flex-col pl-3">
      <div className="flex items-center">
        <span className="px-3">$</span>
        <input
          type="number"
          {...register(name, { valueAsNumber: true })}
          className="rounded border-rent-input-gray"
        />
      </div>
      {error?.message && (
        <p className="text-red-600 text-sm pl-1 pt-1">{error.message}</p>
      )}
    </div>
  );
};
