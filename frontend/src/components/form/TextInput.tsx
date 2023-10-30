import { RawInputProps } from "../../types/form.type";

export const TextInput = ({ register, name, style, error }: RawInputProps) => {
  return (
    <div className="flex basis-4/6 flex-col">
      <input {...register(name)} className={style} />
      {error?.message && (
        <p className="pl-1 pt-1 text-sm text-red-600">{error.message}</p>
      )}
    </div>
  );
};
