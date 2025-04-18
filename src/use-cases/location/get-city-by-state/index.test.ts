import { describe, it, expect, beforeEach, vi } from "vitest";
import { GetCityByStateUseCase } from "./index";
import { LocationService, ICitiesRequest } from "@/services/location";
import { StateError, StateNotFoundError } from "../errors";
import { LoggerType } from "@/utils/logger";

describe("GetCityByStateUseCase", () => {
  let getCityByStateUseCase: GetCityByStateUseCase;
  let mockLocationService: LocationService;
  let mockLogger: LoggerType;

  beforeEach(() => {
    mockLocationService = {
      getCitiesByState: vi.fn(),
    } as unknown as LocationService;

    mockLogger = vi.fn(() => ({
      info: vi.fn(),
      error: vi.fn(),
      warn: vi.fn(),
      debug: vi.fn(),
      fatal: vi.fn(),
      trace: vi.fn(),
      silent: vi.fn(),
      level: "info",
    }));

    getCityByStateUseCase = new GetCityByStateUseCase(
      mockLocationService,
      mockLogger,
    );
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

    expect(mockLogger).toHaveBeenCalledWith("Location");
  });

  it("should throw StateError when state is missing", async () => {
    await expect(
      getCityByStateUseCase.execute({ state: "" }),
    ).rejects.toBeInstanceOf(StateError);

    expect(mockLogger).toHaveBeenCalledWith("Location");
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

    expect(mockLogger).toHaveBeenCalledWith("Location");
  });

  it("should throw StateNotFoundError when state is not found in STATES_MAP", async () => {
    const state = "xx";

    await expect(
      getCityByStateUseCase.execute({ state }),
    ).rejects.toBeInstanceOf(StateNotFoundError);

    expect(mockLogger).toHaveBeenCalledWith("Location");
  });
});
