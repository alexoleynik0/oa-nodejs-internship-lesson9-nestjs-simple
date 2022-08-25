import { compareSync, hashSync } from 'bcrypt';

const ROUNDS_FOR_SALT = 6;

export class PasswordHelper {
  static getPasswordHash = (password: string): string => {
    return hashSync(password, ROUNDS_FOR_SALT);
  };

  static isPasswordCorrect = (
    password: string,
    passwordHash: string,
  ): boolean => {
    return compareSync(password, passwordHash);
  };
}
