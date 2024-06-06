import * as turf from '@turf/turf';


//Function to turn a geojson file into a turf objet
export const convertGeoJsonToTurf = (geojson, allowedTypes) => {
  if (!geojson || !geojson.features) {
    throw new Error('Invalid GeoJSON object');
  }

  //Returns a list of the type of feature,  
  const validFeatures = geojson.features.filter((feature) => {
    return allowedTypes.includes(feature.geometry.type);
  });

  if (validFeatures.length === 0) {

    throw new Error(`No valid features of types: ${allowedTypes.join(', ')} found`);
  }

  return turf.featureCollection(validFeatures);
};