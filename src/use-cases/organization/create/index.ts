import { IOrganizationRepository } from "@/repositories/organization.repository";
import { LoggerType } from "@/utils/logger";
import { PasswordHandler } from "@/utils/password-pandler";
import { Organization } from "database/entities/Organization";
import {
  ErrorOrganizationAlreadyExists,
  ErrorOrganizationCnpjAlreadyExits,
} from "../errors";

interface ICreateOrganizationUseCaseRequest {
  data: Organization;
  password: string;
}

interface ICreateOrganizationUseCaseResponse {
  organization: Organization;
}

export class CreateOrganizationUseCase {
  constructor(
    private readonly repository: IOrganizationRepository,
    private readonly logger: LoggerType,
    private readonly passwordHandler: PasswordHandler
  ) { }

  async execute({
    data,
    password,
  }: ICreateOrganizationUseCaseRequest): Promise<ICreateOrganizationUseCaseResponse> {
    this.logger("Organization").info({
      message: "Check if email exists",
      folder: "Create UseCase",
    });

    const emailExists = await this.repository.getByEmail(
      data.email
    );
    const cnpjExits = await this.repository.getByCnpj(data.cnpj);

    if (emailExists) {
      this.logger("Organization").info({
        messege: "Email already exists.",
        folder: "Create UseCase",
      });
      throw new ErrorOrganizationAlreadyExists();
    }

    if (cnpjExits) {
      this.logger("Organization").info({
        messege: "Cpnj already exists.",
        folder: "Create UseCase",
      });
      throw new ErrorOrganizationCnpjAlreadyExits();
    }

    this.logger("Organization").info({
      message: "Creating organization",
      folder: "Create UseCase",
      data,
    });

    const passwordHash = await this.passwordHandler.hashPassword(password, 6);

    const organization = await this.repository.create({
      ...data,
      password_hash: passwordHash,
    });

    this.logger("Organization").info({
      message: "Fisihing organization",
      folder: "Create UseCase",
      data,
    });

    return { organization };
  }
}
