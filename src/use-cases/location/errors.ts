export class LocationError extends Error {
  constructor() {
    super("Latitude and longitude are required");
  }
}
