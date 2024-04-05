import express from "express";
import EnvConfigs from "../config/";
import { IENVConfigRouteType } from "../interfaces/index";
import { GoogleMap } from "./routes/index";

async function routingManager(app: express.Application) {
  const route: IENVConfigRouteType = EnvConfigs.route;
  if (route === IENVConfigRouteType.GMAP)
    return app.use(GoogleMap);
}

export default routingManager;