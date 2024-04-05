export enum IENVConfigRouteType {
  GMAP = "GOOGLE-MAP",
}

export interface IEnvConfigProps {
  port: number;
  route: IENVConfigRouteType;
  key:string;
}

export enum IStatusCode {
  SUCCESS = 200,
  BAD_REQUEST = 400,
  INTERNAL_SERVER_ERROR = 500,
}