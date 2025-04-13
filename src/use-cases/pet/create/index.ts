import { IPetRepository } from "@/repositories/pet.repository";
import { ErrorOrganizationNotFound } from "@/use-cases/organization/errors";
import { GetByIdOrganizationUseCase } from "@/use-cases/organization/get-by-id";
import { LoggerType } from "@/utils/logger";
import { Pet } from "database/entities/Pet";
import {
  ErrorPetInvalidAgeFormat,
  ErrorPetInvalidGenderFormat,
  ErrorPetRequiredFields,
} from "../errors";

interface CreatePetUseCasePet extends Omit<Pet, "organization"> {
  organizationId: string;
}

interface ICreatePetUseCaseRequest {
  pet: CreatePetUseCasePet;
}

export class CreatePetUseCase {
  constructor(
    private readonly repository: IPetRepository,
    private readonly organization: GetByIdOrganizationUseCase,
    private readonly logger: LoggerType,
  ) {}

  async execute({ pet }: ICreatePetUseCaseRequest) {
    this.logger("Pet").info({
      message: `Start create pet use`,
      organizationId: pet.organizationId,
      folder: "Create Pet UseCase",
    });

    if (
      !pet.name ||
      !pet.breed ||
      !pet.gender ||
      !pet.description ||
      !pet.traits
    ) {
      throw new ErrorPetRequiredFields();
    }

    if (parseInt(pet.age) < 0) {
      throw new ErrorPetInvalidAgeFormat();
    }

    if (!["M", "F"].includes(pet.gender)) {
      throw new ErrorPetInvalidGenderFormat();
    }

    const { organization } = await this.organization.execute({
      id: pet.organizationId,
    });

    if (!organization) {
      this.logger("Pet").info({
        message: `Organization not found`,
        organizationId: pet.organizationId,
        folder: "Create Pet UseCase",
      });
      throw new ErrorOrganizationNotFound();
    }

    this.logger("Pet").info({
      message: `Start create pet`,
      organizationId: pet.organizationId,
      folder: "Create Pet UseCase",
    });

    const body: Pet = {
      ...pet,
      organization,
    };

    this.logger("Pet").info({
      message: `Body`,
      body,
      folder: "Create Pet UseCase",
    });

    const petCreated = await this.repository.create(body);

    this.logger("Pet").info({
      message: `Finish create pet`,
      organizationId: petCreated.id,
      folder: "Create Pet UseCase",
      pet,
    });

    return { petCreated };
  }
}
