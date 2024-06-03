import * as turf from '@turf/turf';

export const convertGeoJsonToTurf = (geojson, allowedTypes) => {
  if (!geojson || !geojson.features) {
    throw new Error('Invalid GeoJSON object');
  }

  const validFeatures = geojson.features.filter((feature) => {
    return allowedTypes.includes(feature.geometry.type);
  });

  if (validFeatures.length === 0) {
    throw new Error(`No valid features of types: ${allowedTypes.join(', ')} found`);
  }

  return turf.featureCollection(validFeatures);
};