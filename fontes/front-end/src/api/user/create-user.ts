import type { SignUpSchema } from "../../schemas/auth";
import { api } from "../../utils/api";

export interface CreateUserResponse {
  id: number;
  name: string;
  email: string;
}

export async function createUser(
  data: SignUpSchema
): Promise<CreateUserResponse> {
  const response = await api.post<CreateUserResponse>("/auth/sign-up", data);
  return response.data;
}
