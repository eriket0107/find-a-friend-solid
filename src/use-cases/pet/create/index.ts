import { IPetRepository } from "@/repositories/pet.repository";
import { ErrorOrganizationNotFound } from "@/use-cases/organization/errors";
import { GetByIdOrganizationUseCase } from "@/use-cases/organization/get-by-id";
import { LoggerType } from "@/utils/logger";
import { Pet } from "database/entities/Pet";

interface ICreatePetUseCaseRequest {
  organizationId: string;
  pet: Pet;
}

export class CreatePetUseCase {
  constructor(
    private readonly repository: IPetRepository,
    private readonly organization: GetByIdOrganizationUseCase,
    private readonly logger: LoggerType,
  ) {}

  async execute({ organizationId, pet }: ICreatePetUseCaseRequest) {
    this.logger("Pet").info({
      messege: `Start create pet use`,
      organizationId,
      folder: "Create Pet UseCase",
    });

    const organization = await this.organization.execute({
      id: organizationId,
    });

    if (!organization) {
      this.logger("Pet").info({
        messege: `Organization not found`,
        organizationId,
        folder: "Create Pet UseCase",
      });
      throw new ErrorOrganizationNotFound();
    }

    this.logger("Pet").info({
      messege: `Start create pet`,
      organizationId,
      folder: "Create Pet UseCase",
    });

    const petCreated = await this.repository.create(pet);

    this.logger("Pet").info({
      messege: `Finish create pet`,
      organizationId,
      folder: "Create Pet UseCase",
      pet,
    });

    return { petCreated };
  }
}
