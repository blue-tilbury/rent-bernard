import { MinusCircleIcon } from "@heroicons/react/24/solid";
import { UseFormSetValue } from "react-hook-form";

import { ImageInput } from "../../components/form/ImageInput";
import { Label } from "../../components/form/Label";
import { ImageInputProps } from "../../types/form.type";
import { PostRoom } from "../../types/room.type";

type ImagesPreviewProps = {
  files: File[];
  handleFiles(value: File[], type: "update" | "delete"): void;
  setValue: UseFormSetValue<PostRoom>;
};

export const Images = ({
  control,
  error,
  files,
  handleFiles,
  setValue,
}: ImageInputProps) => {
  return (
    <div className="flex flex-col items-start gap-2 pb-4 md:flex-row md:gap-3 md:pb-0">
      <Label name="Images" required={true} />
      <div className="flex basis-5/6 flex-col">
        <button className="absolute rounded border border-dashed border-rent-gray px-8 py-1 text-sm text-rent-gray">
          Add Images
          <ImageInput
            control={control}
            name="s3_keys"
            files={files}
            handleFiles={handleFiles}
          />
        </button>
        <ImagesPreview files={files} handleFiles={handleFiles} setValue={setValue} />
        {error?.message && (
          <p className="relative top-8 pl-1 pt-1 text-sm text-red-600">{error.message}</p>
        )}
      </div>
    </div>
  );
};

const ImagesPreview = ({ files, handleFiles, setValue }: ImagesPreviewProps) => {
  const deleteImage = (i: number) => {
    const filteredFiles = files.filter((_, index) => index !== i);
    handleFiles(filteredFiles, "delete");
    const fileNames = filteredFiles.map((file) => file.name);
    setValue("s3_keys", fileNames, { shouldValidate: true });
  };

  return (
    <div className="relative top-10">
      <div className="flex flex-wrap">
        {files.map((file, i) => (
          <div key={i} className="group/item relative h-40 w-40 rounded border">
            <MinusCircleIcon
              onClick={() => deleteImage(i)}
              className="invisible absolute end-2 top-2 z-10 h-8 w-8 text-rent-light-blue group-hover/item:visible"
            />
            <img
              src={URL.createObjectURL(file)}
              alt={file.name}
              className="h-40 w-40 object-contain "
            />
          </div>
        ))}
      </div>
    </div>
  );
};
