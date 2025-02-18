import { IPetRepository } from "@/repositories/pet.repository";
import { RabbitMQ } from "@/services/rabbitmq";
import { ErrorOrganizationNotFound } from "@/use-cases/organization/errors";
import { GetByIdOrganizationUseCase } from "@/use-cases/organization/get-by-id";
import { LoggerType } from "@/utils/logger";
import { Pet } from "database/entities/Pet";

interface ICreatePetUseCaseRequest {
  pet: Pet;
}

export class CreatePetUseCase {
  constructor(
    private readonly repository: IPetRepository,
    private readonly organization: GetByIdOrganizationUseCase,
    private readonly rabbitMQ: RabbitMQ,
    private readonly logger: LoggerType,
  ) {}

  async execute({ pet }: ICreatePetUseCaseRequest) {
    this.logger("Pet").info({
      message: `Start create pet use`,
      organizationId: pet.organization,
      folder: "Create Pet UseCase",
    });

    const { organization } = await this.organization.execute({
      id: pet.organization,
    });

    if (!organization) {
      this.logger("Pet").info({
        message: `Organization not found`,
        organizationId: pet.organization,
        folder: "Create Pet UseCase",
      });
      throw new ErrorOrganizationNotFound();
    }

    this.logger("Pet").info({
      message: `Start create pet`,
      organizationId: pet.organization,
      folder: "Create Pet UseCase",
    });

    const petCreated = await this.repository.create(pet);

    this.logger("Pet").info({
      message: `Finish create pet`,
      organizationId: petCreated.id,
      folder: "Create Pet UseCase",
      pet,
    });

    return { petCreated };
  }
}
