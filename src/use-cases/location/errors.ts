export class CoordinatesError extends Error {
  constructor() {
    super("Latitude and longitude are required");
  }
}

export class PostalCodeError extends Error {
  constructor() {
    super("Postal code is required");
  }
}
