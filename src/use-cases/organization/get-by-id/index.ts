import { IOrganizationRepository } from "@/repositories/organization.repository";
import { LoggerType } from "@/utils/logger";
import { Organization } from "database/entities/Organization";
import { ErrorOrganizationNotFound } from "../errors";

interface IGetByIdOrganizationUseCaseRequest {
  id: string;
}

interface IGetByIdOrganizationUseCaseResponse {
  organization: Organization;
}

export class GetByIdOrganizationUseCase {
  constructor(
    private readonly repository: IOrganizationRepository,
    private readonly logger: LoggerType
  ) { }

  async execute({
    id,
  }: IGetByIdOrganizationUseCaseRequest): Promise<IGetByIdOrganizationUseCaseResponse> {
    this.logger("Organization").info({
      messege: `Start get with id: ${id}`,
      folder: "Get UseCase",
    });

    const organization = await this.repository.getById(id);

    if (!organization) {
      this.logger("Organization").info({
        messege: `'Any Organization avaible upon id: ${id}`,
        folder: "Get UseCase",
      });
      throw new ErrorOrganizationNotFound();
    }

    this.logger("Organization").info({
      messege: `Fiinish get`,
      folder: "Get UseCase",
    });

    return { organization };
  }
}
