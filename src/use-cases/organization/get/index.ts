import { IOrganizationRepository } from "@/repositories/organization.repository";
import { LoggerType } from "@/utils/logger";
import { Organization } from "database/entities/Organization";

interface IOrganizationGetUseCaseRequest {
  id: string;
}

interface IOrganizationGetUseCaseResponse {
  organization: Organization;
}

export class OrganizationGetUseCase {
  constructor(
    private readonly organizationRepository: IOrganizationRepository,
    private readonly logger: LoggerType
  ) { }

  async execute({
    id,
  }: IOrganizationGetUseCaseRequest): Promise<IOrganizationGetUseCaseResponse> {
    this.logger("Organization").info({
      messege: `Start get with id: ${id}`,
      folder: "Get UseCase",
    });

    const organization = await this.organizationRepository.get(id);

    if (!organization) {
      this.logger("Organization").info({
        messege: `'Any Organization avaible upon id: ${id}`,
        folder: "Get UseCase",
      });
      throw new Error("Any Organization avaible.");
    }

    this.logger("Organization").info({
      messege: `Fiinish get`,
      folder: "Get UseCase",
    });

    return { organization };
  }
}
