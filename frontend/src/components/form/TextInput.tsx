import { RawInputProps } from "../../types/form.type";

export const TextInput = ({ register, name, style, error }: RawInputProps) => {
  let placeholderName = "";
  if (name === "city") {
    placeholderName = name[0].toUpperCase() + name.slice(1);
  } else if (name === "street") {
    placeholderName = name[0].toUpperCase() + name.slice(1) + " (optional)";
  }

  return (
    <div className="flex basis-4/6 flex-col">
      <input {...register(name)} className={style} placeholder={placeholderName} />
      {error?.message && (
        <p className="pl-1 pt-1 text-sm text-red-600">{error.message}</p>
      )}
    </div>
  );
};
