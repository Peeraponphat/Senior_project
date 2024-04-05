import { Response, Request } from "express";
import { IStatusCode } from "../../interfaces";
import EnvConfigs from "../../config";
import axios from "axios";
class nearbysearchGenService {
    public async processFlow(req: Request, res: Response) {
        try {
            const placeID = req.body.location;
            const apiKey = EnvConfigs.key;

            const response = await axios.get('https://maps.googleapis.com/maps/api/place/nearbysearch/json', {
                params: {
                    location: placeID,
                    radius: 4000,
                    keyword: 'restaurant',
                    type: 'restaurant',
                    key: apiKey,
                },
            });

            res.status(IStatusCode.SUCCESS).json(response.data).end();
        } catch (error) {
            console.error('Error fetching nearby places:', error);
            res.status(IStatusCode.INTERNAL_SERVER_ERROR).json({ error: 'Internal Server Error' });
        }
    }
}

export default new nearbysearchGenService();
