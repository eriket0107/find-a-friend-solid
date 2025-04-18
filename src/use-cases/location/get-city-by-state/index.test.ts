import { describe, it, expect, beforeEach, vi } from "vitest";
import { GetCityByStateUseCase } from "./index";
import { LocationService, ICitiesRequest } from "@/services/location";
import { StateError } from "../errors";

describe("GetCityByStateUseCase", () => {
  let getCityByStateUseCase: GetCityByStateUseCase;
  let mockLocationService: LocationService;

  beforeEach(() => {
    mockLocationService = {
      getCitiesByState: vi.fn(),
    } as unknown as LocationService;

    getCityByStateUseCase = new GetCityByStateUseCase(mockLocationService);
  });

  it("should be able to get cities by state", async () => {
    const state = "sp";
    const mockCities: ICitiesRequest[] = [
      { codigo_ibge: "3550308", nome: "São Paulo" },
      { codigo_ibge: "3509502", nome: "Campinas" },
      { codigo_ibge: "3543402", nome: "Ribeirão Preto" },
    ];

    vi.mocked(mockLocationService.getCitiesByState).mockResolvedValueOnce(
      mockCities,
    );

    const result = await getCityByStateUseCase.execute({ state });

    expect(result).toEqual({
      cities: [
        { name: "São Paulo", state_code: "SP", state_name: "São Paulo" },
        { name: "Campinas", state_code: "SP", state_name: "São Paulo" },
        { name: "Ribeirão Preto", state_code: "SP", state_name: "São Paulo" },
      ],
      count: 3,
    });

    expect(mockLocationService.getCitiesByState).toHaveBeenCalledWith({
      state,
    });
  });

  it("should throw StateError when state is missing", async () => {
    await expect(
      getCityByStateUseCase.execute({ state: "" }),
    ).rejects.toBeInstanceOf(StateError);
  });

  it("should handle empty cities array", async () => {
    const state = "sp";
    const mockCities: ICitiesRequest[] = [];

    vi.mocked(mockLocationService.getCitiesByState).mockResolvedValueOnce(
      mockCities,
    );

    const result = await getCityByStateUseCase.execute({ state });

    expect(result).toEqual({
      cities: [],
      count: 0,
    });

    expect(mockLocationService.getCitiesByState).toHaveBeenCalledWith({
      state,
    });
  });

  it("should handle state not found in STATES_MAP", async () => {
    const state = "xx"; // Non-existent state code
    const mockCities: ICitiesRequest[] = [
      { codigo_ibge: "1234567", nome: "Test City" },
    ];

    vi.mocked(mockLocationService.getCitiesByState).mockResolvedValueOnce(
      mockCities,
    );

    const result = await getCityByStateUseCase.execute({ state });

    expect(result).toEqual({
      cities: [{ name: "Test City", state_code: "XX", state_name: "" }],
      count: 1,
    });

    expect(mockLocationService.getCitiesByState).toHaveBeenCalledWith({
      state,
    });
  });
});
