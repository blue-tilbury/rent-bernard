import { RawInputProps } from "../../types/form.type";

export const TextInput = ({ register, name, style, error }: RawInputProps) => {
  return (
    <div className="flex flex-1 flex-col lg:flex-none lg:basis-2/3">
      <input {...register(name)} className={style} />
      {error?.message && (
        <p className="pl-1 pt-1 text-sm text-red-600">{error.message}</p>
      )}
    </div>
  );
};
