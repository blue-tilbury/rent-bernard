import { atomWithStorage } from "jotai/utils";

import { User } from "../types/user.type";

export const userAtom = atomWithStorage("user", {} as User);

export const loggedIn = (user: User): boolean => {
  return Object.keys(user).length > 0;
};
