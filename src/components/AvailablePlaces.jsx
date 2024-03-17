import { sortPlacesByDistance } from '../loc.js';
import { fetchAvailablePlaces } from '../http.js';
import { useFetch } from '../hooks/useFetch.js';

import Places from './Places.jsx';
import Error from './Error.jsx';

async function fetchSortedPlaces() {
  const places = await fetchAvailablePlaces();
  /* this is not a react feature, but standart JS feature and pattern
  used to convert  not Promise feature and API into a promisw-based */
  return new Promise((resolve) => {
    navigator.geolocation.getCurrentPosition((position) => {
      const sortedPlaces = sortPlacesByDistance(
        places,
        position.coords.latitude,
        position.coords.longitude
      );
      resolve(sortedPlaces);
    });
  });
}

export default function AvailablePlaces({ onSelectPlace }) {
  /* the previous useEffect hook and useState statements
  is now replaces with this custom useFetch hook */

  const {
    isFetching,
    error,
    fetchedData: availablePlaces
  } = useFetch(fetchSortedPlaces, []);

  if (error) {
    return <Error title='An error occurred!' message={error.message} />;
  }

  return (
    <Places
      title='Available Places'
      places={availablePlaces}
      isLoading={isFetching}
      loadingText='Fetching place data...'
      fallbackText='No places available.'
      onSelectPlace={onSelectPlace}
    />
  );
}
