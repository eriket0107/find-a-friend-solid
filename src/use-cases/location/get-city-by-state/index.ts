import { ICitiesRequest, LocationService } from "@/services/location";
import { StateError } from "../errors";
import { STATES_MAP } from "@/constants/states";

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
  constructor(private readonly locationService: LocationService) { }

  async execute({ state }: { state: string }): Promise<ICitiesResponse> {
    if (!state) {
      throw new StateError();
    }

    const data = await this.locationService.getCitiesByState<ICitiesRequest[]>({
      state,
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
