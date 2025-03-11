import { PetTypeOrm } from "@/repositories/typerorm/pet.typeorm";
import { CreatePetUseCase } from ".";
import { logger } from "@/utils/logger";
import { makeGetByIdOrganization } from "@/use-cases/organization/get-by-id/get-by-id.factory";

export const makeCreatePet = () => {
  const petRepository = new PetTypeOrm();
  const getByIdOrganizationUseCase = makeGetByIdOrganization();

  const createPetUseCase = new CreatePetUseCase(
    petRepository,
    getByIdOrganizationUseCase,
    logger,
  );

  return createPetUseCase;
};
