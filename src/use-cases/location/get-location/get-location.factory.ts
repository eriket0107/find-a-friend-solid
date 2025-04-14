import { getLocation } from "@/services/get-location";
import { GetLocationUseCase } from "./index";

export const makeGetLocationUseCase = () => {
  const getLocationService = getLocation;
  return new GetLocationUseCase(getLocationService);
};
