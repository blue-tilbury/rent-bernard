import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";

import { PhotoAPI } from "../apis/photoAPI";
import { S3API } from "../apis/s3API";
import { Button } from "../components/Button";
import { useCreateRoom, useGetPhoto, useGetRoom, useUpdateRoom } from "../hooks/useAxios";
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
import { Converter } from "../shared/typeConverter";
import { scheme } from "../shared/zodScheme";
import { PostRoom, Room } from "../types/room.type";

export const Posting = () => {
  const params = useParams();
  const navigate = useNavigate();
  const [files, setFiles] = useState<File[]>([]);
  const { triggerPhoto } = useGetPhoto();
  const { triggerRoom } = useCreateRoom();
  const { triggerUpdateRoom } = useUpdateRoom();
  const { triggerGetRoom } = useGetRoom(params.id as string);
  const defaultVals = useMemo<PostRoom>(() => {
    return {
      title: "",
      price: null,
      city: "",
      street: "",
      is_furnished: null,
      is_pet_friendly: null,
      s3_keys: [],
      description: "",
      email: "",
    };
  }, []);
  const {
    register,
    control,
    setValue,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<PostRoom>({
    resolver: zodResolver(scheme),
    defaultValues: getDefaultVals,
  });

  async function getDefaultVals(): Promise<PostRoom | Room> {
    if (!params.id) return defaultVals;

    const room = await triggerGetRoom(params.id);

    const defaultFiles = await Promise.allSettled(
      room.image_urls.map(async (url, i) => {
        const blob = await PhotoAPI.convert(url);

        return new File([blob], `img_${i}`);
      }),
    );

    const resolvedFiles = defaultFiles
      .filter(
        (result): result is PromiseFulfilledResult<File> => result.status === "fulfilled",
      )
      .map((result) => result.value);
    setFiles(resolvedFiles);

    return Converter.GetRoomToRoom(room, resolvedFiles);
  }

  useEffect(() => {
    reset(defaultVals);
    setFiles([]);
  }, [params.id, defaultVals, reset]);

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

  const submit = async (formValues: PostRoom) => {
    const room = Converter.PostRoomToRoom(formValues);
    room.s3_keys = [];

    for (const file of files) {
      const photo = await triggerPhoto();
      S3API.upload(photo.url, file);
      room.s3_keys.push(photo.key);
    }
    if (params.id) {
      await triggerUpdateRoom({ ...room, id: params.id });
      navigate(`/ads/${params.id}`);
    } else {
      await triggerRoom(room);
      navigate("/thankyou");
    }
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
