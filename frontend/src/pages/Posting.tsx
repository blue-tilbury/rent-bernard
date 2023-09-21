import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

import { Button } from "../components/Button";
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
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<Room>({
    resolver: zodResolver(scheme),
  });

  const handleSave = (formValues: object) => {
    console.log(formValues);
    navigate("/thankyou");
  };

  return (
    <form className="container p-4" onSubmit={handleSubmit(handleSave)}>
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
          <Location register={register} error={errors.area} />
          <Description register={register} error={errors.description} />
          <Images register={register} error={errors.images?.[0]} />
        </div>
      </div>

      <div className="mx-8 mb-8 rounded-xl bg-white p-8">
        <Heading index={2} title="Contact Information" />
        <div className="py-6">
          <Email register={register} error={errors.contact_information?.email} />
        </div>
        <div className="pb-12 text-center">
          <Button name="Submit" type="submit" />
        </div>
      </div>
    </form>
  );
};
