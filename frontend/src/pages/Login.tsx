import { CredentialResponse, GoogleLogin } from "@react-oauth/google";
import { atom, useSetAtom } from "jotai";
import jwt_decode, { JwtPayload } from "jwt-decode";
import { useNavigate } from "react-router-dom";

import Logo from "../assets/logo-no-background.png";
import { User } from "../types/user.type";

export const userAtom = atom({} as User);

// TODO: Send the raw JWT token to the back-end
export const Login = () => {
  const navigate = useNavigate();
  const setUser = useSetAtom(userAtom);

  const handleResponse = (response: CredentialResponse) => {
    if (response.credential) {
      const userObject = JSON.parse(
        JSON.stringify(jwt_decode<JwtPayload>(response.credential)),
      );
      setUser(userObject);
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
