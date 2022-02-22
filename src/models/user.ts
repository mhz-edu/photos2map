import pg from '../db';

interface IUser {
  id?: number;
  name: string;
  email: string;
  createdAt?: Date;
  updatedAt?: Date;
  save: () => Promise<User>;
}

class User implements IUser {
  constructor(public email: string, public name: string) {}

  save(): Promise<User> {
    return pg
      .table<User>('users')
      .insert(this)
      .returning('*')
      .then((records) => {
        return new Promise((resolve, reject) => {
          if (records.length === 1) {
            resolve(records[0]);
          }
          reject(new Error('User create failed'));
        });
      });
  }

  static fetchAll(): Promise<User[]> {
    return pg.table<User>('users').select();
  }

  static fetchById(id: number): Promise<User | undefined> {
    console.log('fetching user ' + id);
    return pg.table<User>('users').where('id', id).first();
  }
}

export default User;
