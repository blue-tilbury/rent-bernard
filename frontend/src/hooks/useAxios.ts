import axios from "axios";
import { useEffect, useState } from "react";

import { Room } from "../types/room.type";

axios.defaults.baseURL = "http://localhost:5580";

export const useAxios = (formValues: object) => {
  const [response, setResponse] = useState<Room[]>();
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);

  const fetchData = () => {
    axios
      .post("/rooms", formValues)
      .then((res) => {
        console.log("Room created:", res.data);
        setResponse(res.data);
      })
      .catch((error) => {
        setError(error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchData();
  }, []);
  return { response, error, loading };
};
