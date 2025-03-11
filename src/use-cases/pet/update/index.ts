import { IOrganizationRepository } from "@/repositories/organization.repository";
import { IPetRepository } from "@/repositories/pet.repository";
import { ErrorOrganizationNotFound } from "@/use-cases/organization/errors";
import { LoggerType } from "@/utils/logger";
import { Pet } from "database/entities/Pet";
import {
  ErrorPetNotAssociatedWithOrganization,
  ErrorPetNotFound,
} from "../errors";

interface UpdatePetUseCaseRequest {
  id: string;
  data: Partial<Pet>;
}

interface UpdatePetUseCaseResponse {
  pet: Pet;
}

export class UpdatePetUseCase {
  constructor(
    private readonly petRepository: IPetRepository,
    private readonly organizationRepository: IOrganizationRepository,
    private readonly logger: LoggerType,
  ) {}

  async execute({
    id,
    data,
  }: UpdatePetUseCaseRequest): Promise<UpdatePetUseCaseResponse> {
    this.logger("Pet").info({
      message: `Start update pet`,
      id,
      organizationId: data.organization,
      data,
      folder: "Update Pet UseCase",
    });

    const petToCheck = await this.petRepository.getById(id);
    if (!petToCheck) {
      throw new ErrorPetNotFound();
    }

    this.logger("Pet").debug({
      message: "Pet found with organization ID",
      petId: id,
      organizationId: petToCheck.organization,
      folder: "Update Pet UseCase",
    });

    if (!petToCheck.organization.id) {
      this.logger("Pet").info({
        message: `This pet is not associated with an organization`,
        id,
        folder: "Update Pet UseCase",
      });
      throw new ErrorPetNotAssociatedWithOrganization();
    }
    const organization = await this.organizationRepository.getById(
      petToCheck.organization.id,
    );

    if (!organization) {
      this.logger("Pet").info({
        message: `Organization not found`,
        id,
      });

      throw new ErrorOrganizationNotFound();
    }

    const pet = await this.petRepository.update({ id, data });

    if (!pet) {
      this.logger("Pet").info({
        message: `Pet not found`,
        id,
        folder: "Update Pet UseCase",
      });
      throw new ErrorPetNotFound();
    }

    return { pet };
  }
}
