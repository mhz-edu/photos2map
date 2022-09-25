import { BinaryLike, scrypt } from 'crypto';

const KEY_LENGTH = 64;
const SALT = process.env.SALT || 'testsalt';

export const hashPassword = (password: String): Promise<string> => {
  return new Promise((resolve, reject) => {
    scrypt(password as BinaryLike, SALT, KEY_LENGTH, (err, data) => {
      if (err) {
        return reject(err);
      } else {
        return resolve(data.toString('hex'));
      }
    });
  });
};
