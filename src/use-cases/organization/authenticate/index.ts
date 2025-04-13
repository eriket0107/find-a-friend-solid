import { IOrganizationRepository } from "@/repositories/organization.repository";
import { LoggerType } from "@/utils/logger";
import { PasswordHandler } from "@/utils/password-pandler";
import {
  ErrorOrganizationNotFound,
  ErrorOrganizationPasswordIncorrect,
} from "../errors";
import { Organization } from "database/entities/Organization";

type AuthenticateOrganizationUseCaseRequest = {
  email: string;
  password: string;
};

type AuthenticateOrganizationUseCaseResponse = {
  organization: Partial<Organization>;
};

export class AuthenticateOrganizationUseCase {
  constructor(
    private readonly repository: IOrganizationRepository,
    private readonly logger: LoggerType,
    private readonly passwordHandler: PasswordHandler,
  ) {}

  async execute({
    email,
    password,
  }: AuthenticateOrganizationUseCaseRequest): Promise<AuthenticateOrganizationUseCaseResponse> {
    const organization = await this.repository.getByEmail(email);

    if (!organization) {
      this.logger("Organization").info({
        message: "Organization not found",
        folder: "Authenticate UseCase",
      });
      throw new ErrorOrganizationNotFound();
    }

    if (organization.password_hash) {
      const doesPasswordMatch = await this.passwordHandler.comparePassword(
        password,
        organization.password_hash,
      );

      if (!doesPasswordMatch) {
        this.logger("Organization").info({
          message: "Invalid password",
          folder: "Authenticate UseCase",
        });
        throw new ErrorOrganizationPasswordIncorrect();
      }
    } else {
      this.logger("Organization").info({
        message: "Organization has no password",
        folder: "Authenticate UseCase",
      });
      throw new ErrorOrganizationPasswordIncorrect();
    }

    delete organization.password_hash;

    return { organization };
  }
}
