import { api } from "../../utils/api";

interface LoginUser {
  email: string;
  password: string;
}
interface LoginResponse {
  token: string;
}

export async function login(data: LoginUser) {
  const response = await api.post<LoginResponse>("auth/sign-in", data);
  return response.data;
}
