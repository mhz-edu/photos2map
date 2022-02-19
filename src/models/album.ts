import pg from '../db';

class Album {
  constructor(public user_id: number, public title: string) {}

  save() {
    return pg('albums').insert(this).returning('*');
  }

  static fetchAll() {
    return pg('albums').select();
  }

  static fetchById(id: any) {
    return pg('albums').select().where({ id: id });
  }
}

export default Album;
