import { env } from "@/env";
import axios from "axios";

export interface ILocation {
  address: {
    road: string;
    suburb: string;
    city: string;
    state: string;
    ISO3166_2_lvl4: string;
    region: string;
    postcode: string;
    country: string;
    country_code: string;
  };
}

interface ICoordinatesResponse {
  postalCode: string;
}

export interface IAddressResponse {
  cep: string;
  state: string;
  city: string;
  neighborhood: string;
  street: string;
}

export interface ICitiesRequest {
  codigo_ibge: string;
  nome: string;
}

export interface ILocationService {
  getPostalCodeByCoordinates(params: {
    latitude: number;
    longitude: number;
  }): Promise<ICoordinatesResponse>;
  getAddressByPostalCode(params: {
    postalCode: string;
  }): Promise<IAddressResponse>;
}

export class LocationService implements ILocationService {
  private readonly coordinatesApi: string;
  private readonly addressApi: string;
  private readonly userAgent: string;

  constructor(
    coordinatesApi: string = env.COORDINATES_API || "",
    addressApi: string = env.LOCATION_API || "",
    userAgent: string = "FindAFriend App",
  ) {
    if (!coordinatesApi) {
      throw new Error("Coordinates API URL is required");
    }
    if (!addressApi) {
      throw new Error("Address API URL is required");
    }

    this.coordinatesApi = coordinatesApi;
    this.addressApi = addressApi;
    this.userAgent = userAgent;
  }

  async getPostalCodeByCoordinates({
    latitude,
    longitude,
  }: {
    latitude: number;
    longitude: number;
  }): Promise<ICoordinatesResponse> {
    const response = await axios.get(
      `${this.coordinatesApi}/reverse?format=json&lat=${latitude}&lon=${longitude}`,
      {
        headers: {
          "User-Agent": this.userAgent,
        },
      },
    );

    const { address }: ILocation = response.data;

    return {
      postalCode: address.postcode,
    };
  }

  async getAddressByPostalCode({
    postalCode,
  }: {
    postalCode: string;
  }): Promise<IAddressResponse> {
    const response = await axios.get(`${this.addressApi}/cep/v2/${postalCode}`);
    return response.data;
  }

  async getCitiesByState<T>({ state }: { state: string }): Promise<T> {
    const response = await axios.get(
      `${this.addressApi}/ibge/municipios/v1/${state}?providers=dados-abertos-br,gov,wikipedia`,
    );
    return response.data as T;
  }
}
