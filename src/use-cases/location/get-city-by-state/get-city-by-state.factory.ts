import { LocationService } from "@/services/location";
import { GetCityByStateUseCase } from "./index";
import { logger } from "@/utils/logger";

export const makeGetCityByStateUseCase = () => {
  const locationService = new LocationService();
  return new GetCityByStateUseCase(locationService, logger);
};
