import express from "express";
import  EnvConfigs  from "./config/index";
import { expressLoader } from "./loaders";


async function StartServer() {
  const app = express();

  await expressLoader(app);
   app
    .listen(EnvConfigs.port, () => {
      console.log(`Server started, listening on port ${EnvConfigs.port}`);
    })
    .on("error", (error) => {
      console.log(`Server error ${error}`);
      process.exit(1);
    });
}

StartServer();