import { User } from "./user.d";

interface ApiResponse {
  success: boolean;
  message: string;
}

export interface AuthResponse extends ApiResponse {
  user?: Partial<Omit<User, "password">>;
}
