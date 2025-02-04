import { IOrganizationRepository } from "@/repositories/organization.repository";
import { LoggerType } from "@/utils/logger";
import { Organization } from "database/entities/Organization";
import { ErrorOrganizationNotFound } from "../errors";

interface UpdateOrganizationUseCaseRequest {
  id: string;
  data: Organization;
}

interface UpdateOrganizationUseCaseResponse {
  updatedOrganization: Organization | null;
}

export class UpdateOrganizationUseCase {
  constructor(
    private readonly repository: IOrganizationRepository,
    private readonly logger: LoggerType,
  ) {}

  async execute({
    id,
    data,
  }: UpdateOrganizationUseCaseRequest): Promise<UpdateOrganizationUseCaseResponse> {
    this.logger("Organization").info({
      messege: `Start update`,
      id,
      folder: "Update UseCase",
    });

    const organizationExits = await this.repository.getById(id);

    if (!organizationExits) {
      this.logger("Organization").info({
        messege: `'Any Organization avaible upon id`,
        id,
        folder: "Update UseCase",
      });
      throw new ErrorOrganizationNotFound();
    }

    const updatedOrganization = await this.repository.update({ id, data });

    return {
      updatedOrganization,
    };
  }
}
