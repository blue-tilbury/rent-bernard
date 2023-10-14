import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

import { S3API } from "../apis/s3API";
import { Button } from "../components/Button";
import { useCreateRoom, useGetPhoto } from "../hooks/useAxios";
import {
  Description,
  Email,
  Furnished,
  Heading,
  Images,
  Location,
  PetFriendly,
  Price,
  Title,
} from "../layouts/form";
import { Room } from "../types/room.type";
import { scheme } from "../utils/zodScheme";

export const Posting = () => {
  const {
    register,
    control,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm<Room>({
    resolver: zodResolver(scheme),
  });
  const navigate = useNavigate();
  const [files, setFiles] = useState<File[]>([]);
  const { triggerPhoto } = useGetPhoto();
  const { triggerRoom } = useCreateRoom();

  const handleFiles = (selectedFiles: File[], type: "update" | "delete") => {
    switch (type) {
      case "update":
        setFiles((prev) => [...prev, ...selectedFiles]);
        break;
      case "delete":
        setFiles(selectedFiles);
        break;
    }
  };

  const submit = async (formValues: Room) => {
    formValues.s3_keys = [];

    for (const file of files) {
      const photo = await triggerPhoto();
      S3API.upload(photo.url, file);
      formValues.s3_keys.push(photo.key);
    }
    await triggerRoom(formValues);
    navigate("/thankyou");
  };

  return (
    <form className="container p-4" onSubmit={handleSubmit(submit)}>
      <div className="m-8 rounded-xl bg-white p-8">
        <Heading index={1} title="Posting Details" />
        <div className="flex flex-col gap-3 py-6">
          <Title register={register} error={errors.title} />
          <Furnished control={control} error={errors.is_furnished} name="is_furnished" />
          <PetFriendly
            control={control}
            error={errors.is_pet_friendly}
            name="is_pet_friendly"
          />
          <Price register={register} error={errors.price} />
          <Location register={register} error={errors.city} />
          <Description register={register} error={errors.description} />
          <Images
            control={control}
            error={errors.s3_keys}
            files={files}
            handleFiles={handleFiles}
            setValue={setValue}
            name="s3_keys"
          />
        </div>
      </div>

      <div className="mx-8 mb-8 rounded-xl bg-white p-8">
        <Heading index={2} title="Contact Information" />
        <div className="py-6">
          <Email register={register} error={errors.email} />
        </div>
      </div>
      <div className="pb-12 text-center">
        <Button size="lg" color="primary" type="submit">
          Submit
        </Button>
      </div>
    </form>
  );
};
