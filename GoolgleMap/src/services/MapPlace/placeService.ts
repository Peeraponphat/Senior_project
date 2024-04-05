import { Response } from "express";
import { IGenPlaceRequest } from "../../interfaces";
import { IStatusCode } from "../../interfaces";
import { Mapmodel } from "../../models";

class GenPlaceDetailService {
    public async processFlow(req: IGenPlaceRequest, res: Response) {
        try {
            const query: string = req.body.FetchData.query;
            const location: string = req.body.FetchData.location;
            const radius: number = req.body.FetchData.radius;
            const type: string = req.body.FetchData.type;
            const ResponseG = await Mapmodel.fetchData(query, location, radius, type);
            
            return res.status(IStatusCode.SUCCESS).json(ResponseG).end();
        } catch (error) {
            throw error;
        }
    }
}
export default new GenPlaceDetailService();