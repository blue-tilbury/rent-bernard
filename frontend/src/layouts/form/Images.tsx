import { MinusCircleIcon } from "@heroicons/react/24/solid";
import { useState } from "react";

import { ImageInput } from "../../components/form/ImageInput";
import { Label } from "../../components/form/Label";
import { InputProps } from "../../types/register.type";

type ImagesPreviewProps = {
  files: File[];
  deleteImage(i: number): void;
};

export const Images = ({ register, error }: InputProps) => {
  const [files, setFiles] = useState<File[]>([]);

  const updateFiles = (selectedFiles: File[]) => {
    if (files.length) {
      for (const selectedFile of selectedFiles) {
        if (files.some((file) => file.size === selectedFile.size)) return;
      }
    }
    setFiles((prevFiles) => [...prevFiles, ...selectedFiles]);
  };

  const deleteImage = (i: number) => {
    const newFiles = files.filter((_, index) => index !== i);
    setFiles(newFiles);
  };

  return (
    <div className="flex gap-3">
      <Label name="Images" required={true} />
      <div className="flex basis-5/6 flex-col">
        <button className="absolute rounded border border-dashed border-rent-gray px-8 py-1 text-sm text-rent-gray">
          Add Images
          <ImageInput onFilesChange={updateFiles} register={register} />
        </button>
        <ImagesPreview files={files} deleteImage={deleteImage} />
      </div>
      {error?.message && (
        <p className="pl-1 pt-1 text-sm text-red-600">{error.message}</p>
      )}
    </div>
  );
};

const ImagesPreview = ({ files, deleteImage }: ImagesPreviewProps) => {
  const imageListing = files.map((file, i) => (
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
  ));

  return (
    <div className="relative top-10">
      <div className="flex flex-wrap">{imageListing}</div>
    </div>
  );
};
