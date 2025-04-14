import { getLocation, ILocation } from "@/services/get-location";
import { LocationError } from "../errors";

export class GetLocationUseCase {
  constructor(private readonly getLocationService: typeof getLocation) { }

  async execute({
    latitude,
    longitude,
  }: {
    latitude: number;
    longitude: number;
  }): Promise<ILocation> {
    if (!latitude || !longitude) {
      throw new LocationError();
    }

    const location = await this.getLocationService({ latitude, longitude });

    return location;
  }
}
