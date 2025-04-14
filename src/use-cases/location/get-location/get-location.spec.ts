import { describe, it, expect, beforeEach, vi } from "vitest";
import { GetLocationUseCase } from "./index";
import { getLocation } from "@/services/get-location";
import { LocationError } from "../errors";
import { ILocation } from "@/services/get-location";

describe("GetLocationUseCase", () => {
  let getLocationUseCase: GetLocationUseCase;
  let mockGetLocation: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    mockGetLocation = vi.fn();
    getLocationUseCase = new GetLocationUseCase(
      mockGetLocation as typeof getLocation,
    );
  });

  it("should be able to get location from coordinates", async () => {
    const mockLocation: ILocation = {
      address: {
        road: "Rua Paru",
        suburb: "Centro",
        city: "São Paulo",
        municipality: "São Paulo",
        state_district: "Região Sudeste",
        state: "São Paulo",
        ISO3166_2_lvl4: "BR-SP",
        region: "Sudeste",
        postcode: "01234-567",
        country: "Brasil",
        country_code: "br",
      },
    };

    mockGetLocation.mockResolvedValueOnce(mockLocation);

    const result = await getLocationUseCase.execute({
      latitude: -23.5505,
      longitude: -46.6333,
    });

    expect(result).toEqual(mockLocation);
    expect(mockGetLocation).toHaveBeenCalledWith({
      latitude: -23.5505,
      longitude: -46.6333,
    });
  });

  it("should throw LocationError when coordinates are missing", async () => {
    await expect(
      getLocationUseCase.execute({
        latitude: 0,
        longitude: 0,
      }),
    ).rejects.toBeInstanceOf(LocationError);
  });

  it("should throw LocationError when coordinates are invalid", async () => {
    await expect(
      getLocationUseCase.execute({
        latitude: NaN,
        longitude: NaN,
      }),
    ).rejects.toBeInstanceOf(LocationError);
  });
});
