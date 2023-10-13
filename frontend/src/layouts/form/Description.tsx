import { Label } from "../../components/form/Label";
import { InputProps } from "../../types/form.type";

export const Description = ({ register, error }: InputProps) => {
  return (
    <label className="flex items-baseline gap-3">
      <Label name="Description" required={true} />
      <div className="flex basis-4/6 flex-col">
        <textarea
          {...register("description")}
          className="rounded border-rent-input-gray"
        />
        {error?.message && (
          <p className="pl-1 pt-1 text-sm text-red-600">{error.message}</p>
        )}
      </div>
    </label>
  );
};
