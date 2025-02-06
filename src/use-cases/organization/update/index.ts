import { IOrganizationRepository } from "@/repositories/organization.repository";
import { LoggerType } from "@/utils/logger";
import { Organization } from "database/entities/Organization";
import {
  ErrorOrganizationNotFound,
  ErrorOrganizationPasswordIncorrect,
} from "../errors";
import { PasswordHandler } from "@/utils/password-pandler";

interface UpdateOrganizationUseCaseRequest {
  id: string;
  data: Partial<Organization>;
  password?: string;
  newPassword?: string;
}

interface UpdateOrganizationUseCaseResponse {
  updatedOrganization: Organization | null;
}

export class UpdateOrganizationUseCase {
  constructor(
    private readonly repository: IOrganizationRepository,
    private readonly logger: LoggerType,
    private readonly passwordHandler: PasswordHandler,
  ) {}

  async execute({
    id,
    data,
    password,
    newPassword,
  }: UpdateOrganizationUseCaseRequest): Promise<UpdateOrganizationUseCaseResponse> {
    this.logger("Organization").info({
      message: `Starting organization update`,
      id,
      folder: "Update UseCase",
    });

    const existingOrganization = await this.repository.getById(id);

    if (!existingOrganization) {
      this.logger("Organization").info({
        message: `No organization found for the given ID`,
        id,
        folder: "Update UseCase",
      });
      throw new ErrorOrganizationNotFound();
    }

    if (password && newPassword) {
      if (!existingOrganization.password_hash) {
        this.logger("Organization").warn({
          message: `Password update requested, but no existing password found`,
          id,
          folder: "Update UseCase",
        });
        throw new ErrorOrganizationPasswordIncorrect();
      }

      const isPasswordValid = await this.passwordHandler.comparePassword(
        password,
        existingOrganization.password_hash,
      );

      if (!isPasswordValid) {
        this.logger("Organization").info({
          message: `Incorrect password provided`,
          id,
          folder: "Update UseCase",
        });
        throw new ErrorOrganizationPasswordIncorrect();
      }

      data.password_hash = await this.passwordHandler.hashPassword(newPassword);
    }

    const updatedOrganization = await this.repository.update({ id, data });

    this.logger("Organization").info({
      message: `Organization successfully updated`,
      id,
      folder: "Update UseCase",
    });

    return { updatedOrganization };
  }
}
