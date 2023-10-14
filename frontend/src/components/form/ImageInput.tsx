import { UseControllerProps, useController } from "react-hook-form";

import { RegisterName } from "../../types/form.type";
import { Room } from "../../types/room.type";

type ImageProps = UseControllerProps<Room> & {
  name: RegisterName;
  files: File[];
  handleFiles(value: File[], type: "update" | "delete"): void;
};

export const ImageInput = ({ control, name, files, handleFiles }: ImageProps) => {
  const { field } = useController({ control, name });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files;
    if (!fileList) return;

    const selectedFiles = [...fileList];
    e.target.value = "";
    if (files.length) {
      for (const selectedFile of selectedFiles) {
        if (files.some((file) => file.size === selectedFile.size)) return;
      }
    }
    handleFiles(selectedFiles, "update");
    const fileNames = [...files, ...selectedFiles].map((file) => file.name);
    return fileNames;
  };

  return (
    <input
      type="file"
      accept="image/*"
      style={{ opacity: 0 }}
      multiple
      {...field}
      value=""
      onChange={(e) => field.onChange(handleChange(e))}
      className="absolute left-0 top-0 h-full w-full"
    />
  );
};
