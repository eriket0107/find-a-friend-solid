import { OrganizationTypeOrmRepository } from "@/repositories/typerorm/organization.typerorm";
import { logger } from "@/utils/logger";
import { ChangePasswordOrganizationUseCase } from ".";
import { PasswordHandler } from "@/utils/password-pandler";

export const makeChangePasswordOrganization = () => {
  const organizationRepository = new OrganizationTypeOrmRepository();
  const passwordHandler = new PasswordHandler();
  const changePasswordOrganizationUseCase =
    new ChangePasswordOrganizationUseCase(
      organizationRepository,
      logger,
      passwordHandler,
    );

  return changePasswordOrganizationUseCase;
};
