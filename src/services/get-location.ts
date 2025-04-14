import { env } from "@/env";
import axios from "axios";

export interface ILocation {
  address: {
    road: "Rua Paru";
    suburb: string;
    city: string;
    municipality: string;
    state_district: string;
    state: string;
    ISO3166_2_lvl4: string;
    region: string;
    postcode: string;
    country: string;
    country_code: string;
  };
}

export const getLocation = async ({
  latitude,
  longitude,
}: {
  latitude: number;
  longitude: number;
}): Promise<ILocation> => {
  const response = await axios.get(
    `${env.ADDRESS_API}/reverse?format=json&lat=${latitude}&lon=${longitude}`,
    {
      headers: {
        "User-Agent": "FindAFriend App",
      },
    },
  );

  const { address } = response.data;
  return address;
};
