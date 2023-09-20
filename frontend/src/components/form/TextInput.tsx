import { RawInputProps } from "../../types/register.type";

export const TextInput = ({ register, name, style, error }: RawInputProps) => {
  let placeholderName = "";
  if (name === "area") {
    placeholderName = name[0].toUpperCase() + name.slice(1);
  } else if (name === "street") {
    placeholderName = name[0].toUpperCase() + name.slice(1) + " (optional)";
  }

  return (
    <div className="flex flex-col pl-3 basis-4/6">
      <input {...register(name)} className={style} placeholder={placeholderName} />
      {error?.message && (
        <p className="text-red-600 text-sm pl-1 pt-1">{error.message}</p>
      )}
    </div>
  );
};
