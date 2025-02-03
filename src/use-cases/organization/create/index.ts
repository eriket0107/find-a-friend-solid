import { IOrganizationRepository } from "@/repositories/organization.repository";
import { LoggerType } from "@/utils/logger";
import { PasswordHandler } from "@/utils/passwordHandler";
import { Organization } from "database/entities/Organization";
import { ErrorOrganizationAlreadyExists, ErrorOrganizationCnpjAlreadyExits } from "../errors";

interface IOrganizationCreateUseCaseRequest {
  data: Organization
  password: string
}

export class OrganizationCreateUseCase {
  constructor(
    private readonly organizationRepository: IOrganizationRepository,
    private readonly logger: LoggerType,
    private readonly passwordHandler: PasswordHandler
  ) { }


  async execute({ data, password }: IOrganizationCreateUseCaseRequest): Promise<Organization> {
    this.logger("OrganizationCreateUseCase").info({ message: "Check if email exists" });

    const emailExists = await this.organizationRepository.findByEmail(data.email);
    const cnpjExits = await this.organizationRepository.findByCnpj(data.cnpj);

    if (emailExists) {
      this.logger("OrganizationCreateUseCase").info({ messege: "Email already exists." });
      throw new ErrorOrganizationAlreadyExists();
    }


    if (cnpjExits) {
      this.logger("OrganizationCreateUseCase").info({ messege: "Cpnj already exists." });
      throw new ErrorOrganizationCnpjAlreadyExits();
    }

    this.logger("OrganizationCreateUseCase").info({ message: "Creating organization", data });


    const passwordHash = await this.passwordHandler.hashPassword(password, 6);

    const organization = await this.organizationRepository.create({ ...data, password_hash: passwordHash });

    this.logger("OrganizationCreateUseCase").info({ message: "Fisihing organization", data });

    return organization;
  }
}