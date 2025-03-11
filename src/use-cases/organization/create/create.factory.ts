import { OrganizationTypeOrmRepository } from "@/repositories/typerorm/organization.typerorm";
import { PasswordHandler } from "@/utils/password-pandler";
import { CreateOrganizationUseCase } from ".";
import { logger } from "@/utils/logger";
import { RabbitMQ } from "@/services/rabbitmq";

export const makeCreateOrganization = () => {
  const passwordHandler = new PasswordHandler();
  const organizationRepository = new OrganizationTypeOrmRepository();
  const amqp = new RabbitMQ();
  const createOrganizationUseCase = new CreateOrganizationUseCase(
    organizationRepository,
    logger,
    passwordHandler,
    amqp,
  );

  return createOrganizationUseCase;
};
