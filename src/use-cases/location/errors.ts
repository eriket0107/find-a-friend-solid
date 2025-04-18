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

export class StateError extends Error {
  constructor() {
    super("State is required");
  }
}

export class StateNotFoundError extends Error {
  constructor() {
    super("State not found");
  }
}
