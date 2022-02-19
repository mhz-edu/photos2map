import pg from '../db';

class User {
  constructor(public email: string, public name: string) {}

  save() {
    return pg('users').insert(this).returning('*');
  }

  static fetchAll() {
    return pg('users').select();
  }

  static fetchById(id: any) {
    return pg('users').select().where({ id: id });
  }
}

export default User;
