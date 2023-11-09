import { Label } from "../../components/form/Label";
import { InputProps } from "../../types/form.type";

export const Description = ({ register, error }: InputProps) => {
  return (
    <label className="flex flex-col gap-2 md:flex-row md:items-baseline md:gap-3">
      <Label name="Description" required={true} />
      <div className="flex flex-1 flex-col lg:flex-none lg:basis-2/3">
        <textarea
          {...register("description")}
          className="rounded border-rent-input-gray px-2 py-1 md:py-2"
        />
        {error?.message && (
          <p className="pl-1 pt-1 text-sm text-red-600">{error.message}</p>
        )}
      </div>
    </label>
  );
};
