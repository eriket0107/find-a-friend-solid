import { describe, it, expect, beforeEach, vi } from "vitest";
import { GetLocationUseCase } from "./index";
import { ILocationService, IAddressResponse } from "@/services/location";
import { CoordinatesError, PostalCodeError } from "../errors";
import { LoggerType } from "@/utils/logger";

describe("GetLocationUseCase", () => {
  let getLocationUseCase: GetLocationUseCase;
  let mockLocationService: ILocationService;
  let mockLogger: LoggerType;

  beforeEach(() => {
    mockLocationService = {
      getPostalCodeByCoordinates: vi.fn(),
      getAddressByPostalCode: vi.fn(),
    };

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

    getLocationUseCase = new GetLocationUseCase(
      mockLocationService,
      mockLogger,
    );
  });

  it("should be able to get location from coordinates", async () => {
    const mockPostalCode = "01234-567";
    const mockAddress: IAddressResponse = {
      cep: mockPostalCode,
      state: "São Paulo",
      city: "São Paulo",
      neighborhood: "Centro",
      street: "Rua Paru",
    };

    vi.mocked(
      mockLocationService.getPostalCodeByCoordinates,
    ).mockResolvedValueOnce({
      postalCode: mockPostalCode,
    });
    vi.mocked(mockLocationService.getAddressByPostalCode).mockResolvedValueOnce(
      mockAddress,
    );

    const result = await getLocationUseCase.execute({
      latitude: -23.5505,
      longitude: -46.6333,
    });

    expect(result).toEqual(mockAddress);
    expect(mockLocationService.getPostalCodeByCoordinates).toHaveBeenCalledWith(
      {
        latitude: -23.5505,
        longitude: -46.6333,
      },
    );
    expect(mockLocationService.getAddressByPostalCode).toHaveBeenCalledWith({
      postalCode: mockPostalCode,
    });

    // Verify logger was called
    expect(mockLogger).toHaveBeenCalledWith("Location");
  });

  it("should throw CoordinatesError when coordinates are missing", async () => {
    await expect(
      getLocationUseCase.execute({
        latitude: 0,
        longitude: 0,
      }),
    ).rejects.toBeInstanceOf(CoordinatesError);

    // Verify logger was called
    expect(mockLogger).toHaveBeenCalledWith("Location");
  });

  it("should throw PostalCodeError when postal code is not found", async () => {
    vi.mocked(
      mockLocationService.getPostalCodeByCoordinates,
    ).mockResolvedValueOnce({
      postalCode: "",
    });

    await expect(
      getLocationUseCase.execute({
        latitude: -23.5505,
        longitude: -46.6333,
      }),
    ).rejects.toBeInstanceOf(PostalCodeError);

    // Verify logger was called
    expect(mockLogger).toHaveBeenCalledWith("Location");
  });
});
