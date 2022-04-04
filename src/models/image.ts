import pg from '../db';

class Image {
  constructor(
    public album_id: number,
    public lat: number,
    public lon: number
  ) {}

  save(): Promise<Image> {
    return pg
      .table<Image>('images')
      .insert(this)
      .returning('*')
      .then((records) => {
        return new Promise((resolve, reject) => {
          console.log(records);
          if (records.length === 1) {
            resolve(records[0]);
          }
          reject(new Error('Image create failed'));
        });
      });
  }

  static fetchAllByAlbumId(id: number): Promise<Image[]> {
    return pg.table<Image>('images').select().where('album_id', id);
  }
}

export default Image;
