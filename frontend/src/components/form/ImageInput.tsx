import { RegisterType } from "../../types/register.type";

type ImageProps = RegisterType & {
  onFilesChange(files: File[]): void;
};

export const ImageInput = ({ onFilesChange, register }: ImageProps) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files;
    if (fileList) {
      const files = [...fileList];
      e.target.value = "";
      onFilesChange(files);
    }
  };
  return (
    <input
      type="file"
      accept="image/*"
      style={{ opacity: 0 }}
      multiple
      {...register("images", { onChange: handleChange })}
      className="absolute left-0 top-0 h-full w-full"
    />
  );
};
