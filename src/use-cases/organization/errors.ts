export class ErrorOrganizationAlreadyExists extends Error {
  constructor() {
    super("Organization already exists.");
    this.name = "ErrorOrganizationAlreadyExists";
  }
}
export class ErrorOrganizationCnpjAlreadyExits extends Error {
  constructor() {
    super("Organization already exists.");
    this.name = "ErrorOrganizationAlreadyExists";
  }
}

export class ErrorOrganizationNotFound extends Error {
  constructor() {
    super("Organization not found exists.");
  }
}
