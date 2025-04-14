import { LocationService } from "@/services/location";
import { GetLocationUseCase } from "./index";
import { logger } from "@/utils/logger";

export const makeGetLocationUseCase = () => {
  const coordinatesService = new LocationService();
  return new GetLocationUseCase(coordinatesService, logger);
};
