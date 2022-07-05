import { UserRole } from "./userRole";

export class User {
  id: string;
  createdAt: Date;
  role: UserRole;
  picture: string;
  email: string;
}
