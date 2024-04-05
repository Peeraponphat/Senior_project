import express, { NextFunction, Response, Request } from "express";
import { GenPlaceDetailService, GenPlaceCommentService, nearbysearchGenService } from "../../services";
import { IGenPlaceRequest } from "../../interfaces";

const router = express.Router();

router.post(
  "/GoogleMap/textsearch",
  async (req: IGenPlaceRequest, res: Response, next: NextFunction) => {
    try {
      await GenPlaceDetailService.processFlow(req, res);
    } catch (error) {
      next(error);
    }
  }
);

router.get(
  "/GoogleMap/getPlaceDetails",
  async (req: Request, res: Response, next: NextFunction) => {
    try {

      await GenPlaceCommentService.processFlow(req, res);
    } catch (error) {
      next(error);
    }
  }
);

router.post(
  "/GoogleMap/nearbysearch",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await nearbysearchGenService.processFlow(req, res);
    } catch (error) {
      next(error);
    }
  }
);


export default router;
