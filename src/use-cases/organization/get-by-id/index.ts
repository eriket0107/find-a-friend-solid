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
    private readonly logger: LoggerType,
  ) {}

  async execute({
    id,
  }: IGetByIdOrganizationUseCaseRequest): Promise<IGetByIdOrganizationUseCaseResponse> {
    this.logger("Organization").info({
      message: `Start get by id`,
      id,
      folder: "Get By Id UseCase",
    });

    const organization = await this.repository.getById(id);

    if (!organization) {
      this.logger("Organization").info({
        message: `'Any Organization avaible upon id`,
        id,
        folder: "Get By Id UseCase",
      });
      throw new ErrorOrganizationNotFound();
    }

    this.logger("Organization").info({
      message: `Finish get`,
      id,
      folder: "Get By Id UseCase",
    });

    return { organization };
  }
}
