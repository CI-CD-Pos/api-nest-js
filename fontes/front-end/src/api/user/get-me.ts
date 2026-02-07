import { api } from "../../utils/api";

export interface User {
  id: number;
  name: string;
  email: string;
}

export async function getMe(): Promise<User> {
  const response = await api.get<User>("/auth/me");
  return response.data;
}
