import express, { Request, Response } from "express";
import bodyParser from "body-parser";
import EnvConfigs from "../config/index";
import { IStatusCode } from "../interfaces";
import { routingManager } from "../api";
import methodOverride from "method-override";
import cors from 'cors';
require('dotenv').config();
async function expressLoader(app: express.Application) {
    app.enable("trust proxy");
    app.use(methodOverride());
    app.use(bodyParser.json());
    const IP = process.env.IP;
    const corsOptions = {
        origin: ["http://"+process.env.IP+":80", "http://"+process.env.IP+":4173", "http://"+process.env.IP+":5173"],
        credentials: true, // Allow credentials like cookies
    };

    app.use(cors(corsOptions));

    app.get("/livez", function (_req: Request, res: Response) {
        return res.status(IStatusCode.SUCCESS).json({
            APP_NAME: "Web-Gen",
            PORT: EnvConfigs.port,
            ALIVE_MESSAGE: "Im pretty good C:",
        });

    });
    await routingManager(app);


}

export default expressLoader;

