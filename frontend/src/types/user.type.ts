export type User = {
  id: string;
  name: string;
  email: string;
  picture: string;
  created_at: string;
  updated_at: string;
};

export type AuthParams = {
  token: string;
};
