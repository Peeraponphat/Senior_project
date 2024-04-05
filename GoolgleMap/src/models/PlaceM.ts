import axios from "axios";
import EnvConfigs from "../config";

class Mapmodel {
    async fetchData(query: string, location: string, radius: number, type: string) {
        try {
            const response = await axios.get('https://maps.googleapis.com/maps/api/place/textsearch/json', {
                params: {
                    query: query,
                    location: location,
                    radius: radius,
                    type: type,
                    key: EnvConfigs.key,
                },
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching data:', error);
            throw error;
        }
    }
}
export default new Mapmodel();
