import pg from '../db';

interface IAlbum {
  id?: number;
  title: string;
  user_id: number;
  createdAt?: Date;
  updatedAt?: Date;
  save: () => Promise<Album>;
}

class Album implements IAlbum {
  constructor(public user_id: number, public title: string) {}

  save(): Promise<Album> {
    return pg
      .table<Album>('albums')
      .insert(this)
      .returning('*')
      .then((records) => {
        return new Promise((resolve, reject) => {
          if (records.length === 1) {
            resolve(records[0]);
          }
          reject(new Error('Album create failed'));
        });
      });
  }

  static fetchAll(): Promise<Album[]> {
    return pg.table<Album>('albums').select();
  }

  static fetchAllByUserId(id: number): Promise<Album[]> {
    return pg.table<Album>('albums').select().where('user_id', id);
  }

  static fetchById(id: number): Promise<Album | undefined> {
    return pg.table<Album>('albums').select().where('id', id).first();
  }
}

export default Album;
