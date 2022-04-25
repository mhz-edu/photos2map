import { describe, it } from 'mocha';
import { expect } from 'chai';
import coordinatesConverter from './coordinatesConverter';

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
