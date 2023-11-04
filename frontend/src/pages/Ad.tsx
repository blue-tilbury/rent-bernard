import { ReactElement, useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { ErrorPage } from "./ErrorPage";
import { RoomAPI } from "../apis/roomAPI";
import { Spinner } from "../components/Spinner";
import {
  Contact,
  CustomChip,
  Header,
  ImageGallery,
  Map,
  UpdatedDate,
} from "../layouts/listing/detail";
import { GetRoom } from "../types/room.type";

export const Ad = (): ReactElement => {
  const params = useParams();

  const [room, setRoom] = useState<GetRoom>();
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    (async () => {
      if (params.id == null) return;

      setRoom(await RoomAPI.show(params.id));
      setLoading(false);
    })();
  }, [params.id]);

  if (loading) return <Spinner />;

  if (room == null) return <ErrorPage />;

  return (
    <section className="container flex space-x-20 pb-16 pt-8">
      <div className="flex-3">
        <Header room={room} />
        <ImageGallery image_urls={room.image_urls} title={room.title} />
        <div className="flex space-x-6 pb-10">
          <CustomChip roomPropType={room.is_furnished} name="Furnished" />
          <CustomChip roomPropType={room.is_pet_friendly} name="Pet friendly" />
        </div>
        <p className="pb-4 pl-2">{room.description}</p>
      </div>
      <div className="flex flex-2 flex-col pt-12">
        <Contact email={room.email} />
        <Map
          formatted_address={room.formatted_address}
          latitude={room.latitude}
          longitude={room.longitude}
        />
        <UpdatedDate updated_at={room.updated_at} />
      </div>
    </section>
  );
};
