import * as turf from '@turf/turf';

export const convertGeoJsonToTurf = (geojson) => {
  if (!geojson || !geojson.features) {
    throw new Error('Invalid GeoJSON object');
  }

  const isValidMultiPolygon = (feature) =>
    feature.geometry.type === 'MultiPolygon' &&
    feature.geometry.coordinates.every(polygon =>
      polygon.every(ring =>
        ring.every(coord =>
          Array.isArray(coord) && coord.length === 2 &&
          typeof coord[0] === 'number' && typeof coord[1] === 'number'
        )
      )
    );

  const validFeatures = geojson.features.filter(isValidMultiPolygon);

  if (validFeatures.length === 0) {
    throw new Error('No valid MultiPolygon features found');
  }

  const turfObjects = validFeatures.map(feature =>
    turf.multiPolygon(feature.geometry.coordinates)
  );

  return turf.featureCollection(turfObjects);
};