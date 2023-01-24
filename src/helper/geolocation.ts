import axios from "axios";
const google_secret_key = 'AIzaSyAqYgAYMn77AmEqsMimgx4fBpiq6GXpgr4';

export async function geocoding(place: string): Promise<[number, number]> {
    const google_geo = await axios(`https://maps.googleapis.com/maps/api/geocode/json?address=${place}&key=${google_secret_key}`);
    const location = google_geo.data.results[0].geometry.location;
    return [location.lng, location.lat];
}