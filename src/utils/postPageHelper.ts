import axios from '../api/axios';
export const getLocations = async () => {
  try {
    const response = await axios.get('/locations/');
    const locationsData = response.data;

    // Assuming the raw data is an array of objects
    const locations = locationsData.map((location) => ({
      location_id: location.id,
      location_name: location.name,
    }));

    return locations;
  } catch (error) {
    console.error('Error fetching locations:', error);
    return [];
  }
};
