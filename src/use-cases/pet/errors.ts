export class ErrorPetNotFound extends Error {
  constructor() {
    super("Pet not found.");
  }
}

export class ErrorPetNotAssociatedWithOrganization extends Error {
  constructor() {
    super("Pet not associated with organization.");
  }
}

export class ErrorPetRequiredFields extends Error {
  constructor() {
    super("Missing required fields.");
  }
}

export class ErrorPetInvalidAgeFormat extends Error {
  constructor() {
    super("Invalid age format.");
  }
}

export class ErrorPetInvalidGenderFormat extends Error {
  constructor() {
    super("Invalid gender format.");
  }
}
export class ErrorPetListCityIsRequired extends Error {
  constructor() {
    super("Organization city is required to list pets.");
  }
}
