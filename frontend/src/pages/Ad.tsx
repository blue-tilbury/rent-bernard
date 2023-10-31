import { ReactElement, useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { ErrorPage } from "./ErrorPage";
import { RoomAPI } from "../apis/roomAPI";
import { Spinner } from "../components/Spinner";
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
    <>
      <section className="container pb-16 pt-8">
        <h2 className="pb-4 pl-2 text-sm">{room.description}</h2>
      </section>
    </>
  );
};
