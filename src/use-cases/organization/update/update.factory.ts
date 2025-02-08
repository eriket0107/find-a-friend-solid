import { OrganizationTypeOrmRepository } from "@/repositories/typerorm/organization.typerorm";
import { PasswordHandler } from "@/utils/password-pandler";
import { logger } from "@/utils/logger";
import { UpdateOrganizationUseCase } from ".";

export const makeUpdateOrganization = () => {
  const passwordHandler = new PasswordHandler();
  const organizationRepository = new OrganizationTypeOrmRepository();

  const createOrganizationUseCase = new UpdateOrganizationUseCase(
    organizationRepository,
    logger,
    passwordHandler,
  );

  return createOrganizationUseCase;
};
