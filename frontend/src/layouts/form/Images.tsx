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
    <div className="flex">
      <Label name="Images" required={true} />
      <div className="flex flex-col basis-5/6 pl-3">
        <button className="border rounded absolute border-dashed border-rent-gray text-rent-gray text-sm py-1 px-8">
          Add Images
          <ImageInput onFilesChange={updateFiles} register={register} />
        </button>
        <ImagesPreview files={files} deleteImage={deleteImage} />
      </div>
      {error?.message && (
        <p className="text-red-600 text-sm pl-1 pt-1">{error.message}</p>
      )}
    </div>
  );
};

const ImagesPreview = ({ files, deleteImage }: ImagesPreviewProps) => {
  const imageListing = files.map((file, i) => (
    <div key={i} className="group/item relative w-40 h-40 border rounded">
      <MinusCircleIcon
        onClick={() => deleteImage(i)}
        className="invisible group-hover/item:visible h-8 w-8 absolute end-2 top-2 z-10 text-rent-light-blue"
      />
      <img
        src={URL.createObjectURL(file)}
        alt={file.name}
        className="object-contain h-40 w-40 "
      />
    </div>
  ));

  return (
    <div className="relative top-10">
      <div className="flex flex-wrap">{imageListing}</div>
    </div>
  );
};
