import * as turf from '@turf/turf';

export const convertGeoJsonToTurf = (geojson, allowedTypes) => {
  if (!geojson || !geojson.features) {
    throw new Error('Invalid GeoJSON object');
  }

  console.log('GeoJSON input:', geojson);

  const validFeatures = geojson.features.filter((feature) => {
    return allowedTypes.includes(feature.geometry.type);
  });

  console.log('Valid features:', validFeatures);

  if (validFeatures.length === 0) {
    console.log(allowedTypes)

    throw new Error(`No valid features of types: ${allowedTypes.join(', ')} found`);
  }

  return turf.featureCollection(validFeatures);
};