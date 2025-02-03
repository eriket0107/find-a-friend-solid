export class ErrorOrganizationAlreadyExists extends Error {
  constructor(email: string) {
    super(`Organization already exists ${email}`);
    this.name = "ErrorOrganizationAlreadyExists";
  }
}