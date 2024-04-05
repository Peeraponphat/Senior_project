import { IEnvConfigProps, IENVConfigRouteType} from '../interfaces/index'
require('dotenv').config();
const EnvConfigs: IEnvConfigProps = {
  route:(process.env.ROUTE as IENVConfigRouteType) || IENVConfigRouteType.GMAP,
  port: Number(process.env.PORT) || 3000,
  key:process.env.KEYG||"",
};

export default EnvConfigs;
