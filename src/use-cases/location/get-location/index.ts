import { IAddressResponse, ILocationService } from "@/services/location";
import { CoordinatesError, PostalCodeError } from "../errors";
import { LoggerType } from "@/utils/logger";

export class GetLocationUseCase {
  constructor(
    private readonly coordinatesService: ILocationService,
    private readonly logger: LoggerType,
  ) {}

  async execute({
    latitude,
    longitude,
  }: {
    latitude: number;
    longitude: number;
  }): Promise<IAddressResponse> {
    this.logger("Location").info({
      message: "Starting location lookup by coordinates",
      latitude,
      longitude,
      folder: "Get Location UseCase",
    });

    if (!latitude || !longitude) {
      this.logger("Location").error({
        message: "Invalid coordinates provided",
        latitude,
        longitude,
        folder: "Get Location UseCase",
      });
      throw new CoordinatesError();
    }

    this.logger("Location").info({
      message: "Fetching postal code from coordinates",
      latitude,
      longitude,
      folder: "Get Location UseCase",
    });

    const { postalCode } =
      await this.coordinatesService.getPostalCodeByCoordinates({
        latitude,
        longitude,
      });

    if (!postalCode) {
      this.logger("Location").error({
        message: "No postal code found for the given coordinates",
        latitude,
        longitude,
        folder: "Get Location UseCase",
      });
      throw new PostalCodeError();
    }

    this.logger("Location").info({
      message: "Postal code found, fetching address details",
      postalCode,
      folder: "Get Location UseCase",
    });

    const address = await this.coordinatesService.getAddressByPostalCode({
      postalCode,
    });

    this.logger("Location").info({
      message: "Address details retrieved successfully",
      postalCode,
      city: address.city,
      state: address.state,
      folder: "Get Location UseCase",
    });

    return address;
  }
}
