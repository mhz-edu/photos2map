const coordinatesConverter = (gpsParams: any) => {
  let latSign = 1;
  let lonSign = 1;
  if (gpsParams.GPSLatitudeRef === 'S') {
    latSign = -1;
  }
  if (gpsParams.GPSLongitudeRef === 'W') {
    lonSign = -1;
  }
  let [latD, latM, latS] = gpsParams.GPSLatitude;
  let [lonD, lonM, lonS] = gpsParams.GPSLongitude;
  const latDegree = latSign * (latD + latM / 60 + latS / 3600);
  const lonDegree = lonSign * (lonD + lonM / 60 + lonS / 3600);
  return { lat: latDegree, lon: lonDegree };
};

export default coordinatesConverter;
