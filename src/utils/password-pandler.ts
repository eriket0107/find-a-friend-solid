import { compare, hash } from "bcryptjs";

export class PasswordHandler {
  async hashPassword(password: string, salt: number): Promise<string> {
    return await hash(password, salt);
  }

  async comparePassword(
    password: string,
    passwordToCompare: string,
  ): Promise<boolean> {
    return await compare(password, passwordToCompare);
  }
}
