import { Token } from "../token";
import { User } from "../user";

export class LoginResponse {
  data: {
    token: Token;
    user: User;
  };
}
