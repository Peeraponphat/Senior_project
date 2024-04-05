import { Request } from "express";

interface IBaseCustomBodyProps {
  CID: string;
}

interface IGenPlaceRequestProps {
  FetchData: {
    query: string;
    location: string;
    radius: number,
    type: string;
  };
}



type IGenPlaceRequest = Request<IGenPlaceRequestProps>;
export {
  IBaseCustomBodyProps,
  IGenPlaceRequest,
};