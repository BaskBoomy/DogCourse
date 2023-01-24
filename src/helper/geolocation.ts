import axios from "axios";

export async function geocoding(place: string): Promise<[number, number]> {
    const google_geo = await axios(`https://maps.googleapis.com/maps/api/geocode/json?address=${place}&key=${process.env.GOOGLE_SECRET_KEY}`);
    const location = google_geo.data.results[0].geometry.location;
    return [location.lng, location.lat];
}