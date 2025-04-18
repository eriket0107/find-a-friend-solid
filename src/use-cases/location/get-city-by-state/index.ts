import { ICitiesRequest, LocationService } from "@/services/location";
import { StateError, StateNotFoundError } from "../errors";
import { STATES_MAP } from "@/constants/states";
import { LoggerType } from "@/utils/logger";

export interface ICities {
  name: string;
  state_name: string;
  state_code: string;
}

export interface ICitiesResponse {
  cities: ICities[];
  count: number;
}

export class GetCityByStateUseCase {
  constructor(
    private readonly locationService: LocationService,
    private readonly logger: LoggerType,
  ) { }

  async execute({ state }: { state: string }): Promise<ICitiesResponse> {
    this.logger("Location").info({
      message: "Starting cities lookup by state",
      state,
      folder: "Get City By State UseCase",
    });

    if (!state) {
      this.logger("Location").error({
        message: "State is required",
        state,
        folder: "Get City By State UseCase",
      });
      throw new StateError();
    }

    if (!STATES_MAP.has(state.toUpperCase())) {
      this.logger("Location").error({
        message: "State not found in STATES_MAP",
        state,
        folder: "Get City By State UseCase",
      });
      throw new StateNotFoundError();
    }

    this.logger("Location").info({
      message: "Fetching cities from state",
      state,
      folder: "Get City By State UseCase",
    });

    const data = await this.locationService.getCitiesByState<ICitiesRequest[]>({
      state,
    });

    this.logger("Location").info({
      message: "Cities retrieved successfully",
      state,
      count: data.length,
      folder: "Get City By State UseCase",
    });

    const cities: ICities[] = [];

    for (const city of data) {
      cities.push({
        name: city.nome,
        state_code: state.toUpperCase(),
        state_name: STATES_MAP.get(state.toUpperCase()) || "",
      });
    }
    return {
      cities,
      count: cities.length,
    };
  }
}
