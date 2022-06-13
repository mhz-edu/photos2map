import { describe, it, afterEach } from 'mocha';
import { expect } from 'chai';
import { spy, stub, restore } from 'sinon';
import { coordinatesConverter, extractExifGps } from './coordinatesUtils';
import { ExifData, ExifImage } from 'exif';
import { Express } from 'express';

describe('Coordinates converter', function () {
  it('should return decimal coordinates for provided gpsParams object in western hemisphere', function () {
    const epsilon = 0.000001;
    const gpsParams = {
      GPSLatitude: [38, 0, 30.9744],
      GPSLongitude: [78, 27, 11.5164],
      GPSLatitudeRef: 'N',
      GPSLongitudeRef: 'W',
    };

    expect(coordinatesConverter(gpsParams)).to.has.property('lat');
    expect(coordinatesConverter(gpsParams).lat).to.be.closeTo(
      38.008604,
      epsilon
    );
    expect(coordinatesConverter(gpsParams)).to.has.property('lon');
    expect(coordinatesConverter(gpsParams).lon).to.be.closeTo(
      -78.453199,
      epsilon
    );
  });

  it('should return decimal coordinates for provided gpsParams object in southern hemisphere', function () {
    const epsilon = 0.000001;
    const gpsParams = {
      GPSLatitude: [33, 51, 22.1724],
      GPSLongitude: [151, 12, 54.9216],
      GPSLatitudeRef: 'S',
      GPSLongitudeRef: 'E',
    };

    expect(coordinatesConverter(gpsParams)).to.has.property('lat');
    expect(coordinatesConverter(gpsParams).lat).to.be.closeTo(
      -33.856159,
      epsilon
    );
    expect(coordinatesConverter(gpsParams)).to.has.property('lon');
    expect(coordinatesConverter(gpsParams).lon).to.be.closeTo(
      151.215256,
      epsilon
    );
  });

  it('should throw an error if gpsParams has no longitude', function () {
    const gpsParams = {
      GPSLatitude: [38, 0, 30.9744],
      GPSLatitudeRef: 'N',
      GPSLongitudeRef: 'W',
    };
    expect(coordinatesConverter.bind(this, gpsParams)).to.throw('No GPS data');
  });

  it('should throw an error if gpsParams has no latitude', function () {
    const gpsParams = {
      GPSLongitude: [78, 27, 11.5164],
      GPSLatitudeRef: 'N',
      GPSLongitudeRef: 'W',
    };
    expect(coordinatesConverter.bind(this, gpsParams)).to.throw('No GPS data');
  });
});

describe('Extract Exif GPS', function () {
  afterEach(function () {
    restore();
  });

  it('should return a promise that is rejected in case of exif error', async function () {
    const exifStub = stub(ExifImage.prototype, 'loadImage').callsFake(
      (file, cb) => {
        const error = new Error('Stubbed exif error');
        return cb(error, {} as ExifData);
      }
    );

    const file = { buffer: Buffer.alloc(1) };
    const extractPromise = extractExifGps(file as Express.Multer.File);
    expect(extractPromise).to.be.a('Promise');
    try {
      await extractPromise;
    } catch (error) {
      expect(error).to.be.an('error');
      expect((error as Error).message).to.equal('Stubbed exif error');
    }
  });

  it('should return a promise that is resolved with gps coords found by exif', async function () {
    const gpsParams = {
      GPSLatitude: [33, 51, 22.1724],
      GPSLongitude: [151, 12, 54.9216],
      GPSLatitudeRef: 'S',
      GPSLongitudeRef: 'E',
    };

    const exifStub = stub(ExifImage.prototype, 'loadImage').callsFake(
      (file, cb) => {
        return cb(null, { gps: gpsParams } as ExifData);
      }
    );

    const file = { buffer: Buffer.alloc(1) };
    const extractPromise = extractExifGps(file as Express.Multer.File);
    expect(extractPromise).to.be.a('Promise');
    const result = await extractPromise;
    expect(result).to.deep.equal(gpsParams);
  });
});
