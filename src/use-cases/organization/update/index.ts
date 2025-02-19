import { IOrganizationRepository } from "@/repositories/organization.repository";
import { LoggerType } from "@/utils/logger";
import { Organization } from "database/entities/Organization";
import { ErrorOrganizationNotFound } from "../errors";
import { PasswordHandler } from "@/utils/password-pandler";

interface UpdateOrganizationUseCaseRequest {
  id: string;
  data?: Partial<Organization>;
}

interface UpdateOrganizationUseCaseResponse {
  updatedOrganization: Organization | null;
}

export class UpdateOrganizationUseCase {
  constructor(
    private readonly repository: IOrganizationRepository,
    private readonly logger: LoggerType,
    private readonly passwordHandler: PasswordHandler,
  ) { }

  async execute({
    id,
    data,
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

    if (data && Object.keys(data).length > 0) {
      await this.repository.update({ id, data });
    }

    this.logger("Organization").info({
      message: `Organization successfully updated`,
      id,
      folder: "Update UseCase",
    });

    const updatedOrganization = await this.repository.getById(id);

    return { updatedOrganization };
  }
}
