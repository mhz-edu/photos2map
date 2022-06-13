import { Express } from 'express';
import { ExifData, ExifImage } from 'exif';

export const coordinatesConverter = (gpsParams: ExifData['gps']) => {
  const MINUTES_IN_DEGREE = 60;
  const SECONDS_IN_DEGREE = 3600;
  let latSign = 1;
  let lonSign = 1;
  if (!gpsParams.GPSLatitude || !gpsParams.GPSLongitude) {
    throw new Error('No GPS data');
  }
  if (gpsParams.GPSLatitudeRef === 'S') {
    latSign = -1;
  }
  if (gpsParams.GPSLongitudeRef === 'W') {
    lonSign = -1;
  }
  let [latD, latM, latS] = gpsParams.GPSLatitude!;
  let [lonD, lonM, lonS] = gpsParams.GPSLongitude!;
  const latDegree =
    latSign * (latD + latM / MINUTES_IN_DEGREE + latS / SECONDS_IN_DEGREE);
  const lonDegree =
    lonSign * (lonD + lonM / MINUTES_IN_DEGREE + lonS / SECONDS_IN_DEGREE);
  return { lat: latDegree, lon: lonDegree };
};

export const extractExifGps = (
  file: Express.Multer.File
): Promise<ExifData['gps']> => {
  return new Promise(function (resolve, reject) {
    new ExifImage(
      { image: file.buffer },
      (error: Error | null, exifData: ExifData) => {
        if (error) {
          console.log(`Error: ${error.message}`);
          reject(error);
        } else {
          console.log(exifData.gps);
          resolve(exifData.gps);
        }
      }
    );
  });
};
