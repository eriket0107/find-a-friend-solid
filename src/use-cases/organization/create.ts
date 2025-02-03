import { IOrganizationRepository } from "@/repositories/organization.repository";
import { LoggerFunction } from "@/utils/logger";
import { PasswordHandler } from "@/utils/passwordHandler";
import { Organization } from "database/entities/Organization";
import { ErrorOrganizationAlreadyExists } from "./create.error";

interface IOrganizationCreateUseCaseRequest {
  data: Organization
  password: string
}

export class OrganizationCreateUseCase {
  constructor(
    private readonly organizationRepository: IOrganizationRepository,
    private readonly logger: LoggerFunction,
    private readonly passwordHandler: PasswordHandler
  ) { }


  async execute({ data, password }: IOrganizationCreateUseCaseRequest): Promise<Organization> {
    this.logger("OrganizationCreateUseCase").info({ message: "Check if email exists" });

    const emailExists = await this.organizationRepository.findByEmail(data.email);

    if (emailExists) {
      this.logger("OrganizationCreateUseCase").info({ messege: "Email already exists." });
      throw new ErrorOrganizationAlreadyExists(data.email);
    }

    this.logger("OrganizationCreateUseCase").info({ message: "Creating organization", data });


    const passwordHash = await this.passwordHandler.hashPassword(password, 6);

    const organization = await this.organizationRepository.create({ ...data, password_hash: passwordHash });

    this.logger("OrganizationCreateUseCase").info({ message: "Fisihing organization", data });

    return organization;
  }
}