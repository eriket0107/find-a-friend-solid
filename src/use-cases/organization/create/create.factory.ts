import { OrganizationTypeOrmRepository } from "@/repositories/typerorm/organization.typerorm";
import { PasswordHandler } from "@/utils/password-pandler";
import { CreateOrganizationUseCase } from ".";
import { logger } from "@/utils/logger";

export const makeCreateOrganization = () => {
  const passwordHandler = new PasswordHandler();
  const organizationRepository = new OrganizationTypeOrmRepository();
  const createOrganizationUseCase = new CreateOrganizationUseCase(organizationRepository, logger, passwordHandler);

  return createOrganizationUseCase;
};