import {
  ErrorOrganizationNotFound,
  ErrorOrganizationPasswordIncorrect,
} from "../errors";
import { LoggerType } from "@/utils/logger";
import { PasswordHandler } from "@/utils/password-pandler";
import { Organization } from "database/entities/Organization";
import { IOrganizationRepository } from "@/repositories/organization.repository";

interface ChangePasswordOrganizationUseCaseRequest {
  id: string;
  password: string;
  newPassword: string;
}

interface ChangePasswordOrganizationUseCaseResponse {
  updatedPassword: Organization | null;
}

export class ChangePasswordOrganizationUseCase {
  constructor(
    private readonly repository: IOrganizationRepository,
    private readonly logger: LoggerType,
    private readonly passwordHandler: PasswordHandler,
  ) {}

  async execute({
    id,
    password,
    newPassword,
  }: ChangePasswordOrganizationUseCaseRequest): Promise<ChangePasswordOrganizationUseCaseResponse> {
    const existingOrganization = await this.repository.getById(id);

    if (!existingOrganization) {
      this.logger("Organization").warn({
        message: "Organization not found.",
        id,
        folder: "Change Password UseCase",
      });
      throw new ErrorOrganizationNotFound();
    }

    if (!password || !newPassword) {
      throw new ErrorOrganizationPasswordIncorrect();
    }

    if (!existingOrganization.password_hash) {
      this.logger("Organization").warn({
        message: "Error changing password",
        id,
        folder: "Change Password UseCase",
      });
      throw new ErrorOrganizationPasswordIncorrect();
    }

    const isPasswordValid = await this.passwordHandler.comparePassword(
      password,
      existingOrganization.password_hash,
    );

    if (!isPasswordValid) {
      this.logger("Organization").info({
        message: "Incorrect password provided",
        id,
        folder: "Change Password UseCase",
      });
      throw new ErrorOrganizationPasswordIncorrect();
    }

    const newPasswordHash =
      await this.passwordHandler.hashPassword(newPassword);
    const updatedPassword =
      (await this.repository.update({
        id,
        data: { password_hash: newPasswordHash },
      })) || null;

    return { updatedPassword };
  }
}
