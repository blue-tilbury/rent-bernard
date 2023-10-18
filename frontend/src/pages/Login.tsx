import { CredentialResponse, GoogleLogin } from "@react-oauth/google";
import { useSetAtom } from "jotai";
import { useNavigate } from "react-router-dom";

import Logo from "../assets/logo-no-background.png";
import { useGetUser, useLoginUser } from "../hooks/useAxios";
import { userAtom } from "../utils/globalStateConfig";

export const Login = () => {
  const setUser = useSetAtom(userAtom);
  const { triggerLogin } = useLoginUser();
  const { triggerGetUser } = useGetUser();
  const navigate = useNavigate();

  const handleResponse = async (response: CredentialResponse) => {
    if (response.credential) {
      await triggerLogin({ token: response.credential });
      const user = await triggerGetUser();
      setUser(user);
      navigate("/");
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-cover bg-center">
      <div className="flex flex-col items-center rounded-md border p-12 shadow-md">
        <h2 className="pb-2 text-2xl font-bold">Welcome</h2>
        <img src={Logo} className="w-40 pb-12" />
        <GoogleLogin
          onSuccess={(res) => handleResponse(res)}
          onError={() => console.log("Login Failed")}
        />
      </div>
    </div>
  );
};
