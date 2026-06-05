import { Email } from "../value-objects/email";
import { Role } from "../value-objects/role";

export interface AdminUser {
  readonly id: string;
  readonly email: Email;
  readonly name: string;
  readonly role: Role;
  readonly permissions: string[];
}
