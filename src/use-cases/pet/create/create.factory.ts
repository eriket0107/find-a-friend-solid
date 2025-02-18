import { PetTypeOrm } from "@/repositories/typerorm/pet.typeorm";
import { CreatePetUseCase } from ".";
import { logger } from "@/utils/logger";
import { makeGetByIdOrganization } from "@/use-cases/organization/get-by-id/get-by-id.factory";
import { RabbitMQ } from "@/services/rabbitmq";

export const makeCreatePet = () => {
  const petRepository = new PetTypeOrm();
  const getByIdOrganizationUseCase = makeGetByIdOrganization();
  const rabbitMQ = new RabbitMQ();

  const createPetUseCase = new CreatePetUseCase(
    petRepository,
    getByIdOrganizationUseCase,
    rabbitMQ,
    logger,
  );

  return createPetUseCase;
};
