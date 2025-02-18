export class ErrorPetNotFound extends Error {
  constructor() {
    super("Pet not found.");
  }
}
