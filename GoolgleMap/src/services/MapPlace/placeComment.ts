import { Response, Request } from "express";
import { IStatusCode } from "../../interfaces";
import EnvConfigs from "../../config";
import axios from "axios";
class GenPlaceCommentService {
    public async processFlow(req: Request, res: Response) {
        try {
            const placeId = req.query.placeId;
            const apiUrl = `https://maps.googleapis.com/maps/api/place/details/json?fields=review&place_id=${placeId}&key=${EnvConfigs.key}`;
            const response = await axios.get(apiUrl);

            const { data } = response;

            if (data.result && data.result.reviews) {
                const reviews = data.result.reviews;
                res.status(IStatusCode.SUCCESS).json(reviews);
            } else {
                res.status(IStatusCode.BAD_REQUEST).json({ error: 'No reviews found for the given place ID' });
            }
        } catch (error) {
            console.error('Error fetching reviews:', error);
            res.status(IStatusCode.INTERNAL_SERVER_ERROR).json({ error: 'Internal Server Error' });
        }
    }
}
export default new GenPlaceCommentService();