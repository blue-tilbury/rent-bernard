import { Label } from "../../components/form/Label";
import { InputProps } from "../../types/register.type";

export const Description = ({ register, error }: InputProps) => {
  return (
    <label className="flex items-baseline">
      <Label name="Description" required={true} />
      <div className="flex flex-col basis-4/6">
        <textarea
          {...register("description")}
          className="ml-3 rounded border-rent-input-gray"
        />
        {error?.message && (
          <p className="text-red-600 text-sm pl-4 pt-1">{error.message}</p>
        )}
      </div>
    </label>
  );
};
