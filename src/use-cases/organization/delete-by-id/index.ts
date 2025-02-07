import { IOrganizationRepository } from "@/repositories/organization.repository";
import { LoggerType } from "@/utils/logger";
import { ErrorOrganizationNotFound } from "../errors";

interface IDeleteOrganizationByIdUseCaseRequest {
  id: string;
}

export class DeleteOrganizationByIdUseCase {
  constructor(
    private readonly repository: IOrganizationRepository,
    private readonly logger: LoggerType,
  ) {}

  async execute({ id }: IDeleteOrganizationByIdUseCaseRequest): Promise<void> {
    this.logger("Organization").info({
      message: "Check if organization exists.",
      folder: "Delete UseCase",
      id,
    });

    const organizationExists = await this.repository.getById(id);

    if (!organizationExists) {
      this.logger("Organization").info({
        message: "Organization Not found.",
        folder: "Delete UseCase",
      });
      throw new ErrorOrganizationNotFound();
    }

    this.logger("Organization").info({
      message: "Start delete.",
      folder: "Delete UseCase",
      id,
    });

    this.repository.delete(id);

    this.logger("Organization").info({
      message: "Finish delete.",
      folder: "Delete UseCase",
      id,
    });
  }
}
