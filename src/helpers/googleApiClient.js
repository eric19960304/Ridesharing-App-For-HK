const getDistance = async (origin, destination, GOOGLE_MAP_API_KEY) => {
    const response = await fetch(
        'https://maps.googleapis.com/maps/api/distancematrix/json?units=metric&origins='+ 
        origin.latitude + ',' + origin.longitude + '&destinations=' + destination.latitude + 
        ',' + destination.longitude + '&key=' + GOOGLE_MAP_API_KEY, 
        {method: 'GET'}
    );
    const res = await response.json();
    return [res.rows[0].elements[0].distance.value, res.rows[0].elements[0].duration.value];
};

module.exports = {
    getDistance,
};