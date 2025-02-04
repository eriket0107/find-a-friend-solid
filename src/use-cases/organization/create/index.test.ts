import { beforeEach, describe, expect, it, vi } from "vitest";
import { CreateOrganizationUseCase } from ".";
import { PasswordHandler } from "@/utils/passwordHandler";
import { LoggerType } from "@/utils/logger";
import { OrganizationInMemoryRepository } from "@/repositories/in-memory/organization.in-memory";
import { Organization } from "database/entities/Organization";
import { ErrorOrganizationAlreadyExists, ErrorOrganizationCnpjAlreadyExits } from "../errors";

let sut: CreateOrganizationUseCase;
let organizationInMemoryRepository: OrganizationInMemoryRepository;
let passwordHandler: PasswordHandler;

const logger: LoggerType = vi.fn((level: string = 'info') => ({
  level,
  debug: vi.fn(),
  error: vi.fn(),
  fatal: vi.fn(),
  info: vi.fn(),
  warn: vi.fn(),
  trace: vi.fn(),
  silent: vi.fn(),
}));

describe("Organization Creation Use Case", () => {
  beforeEach(() => {
    organizationInMemoryRepository = new OrganizationInMemoryRepository();
    passwordHandler = new PasswordHandler();
    sut = new CreateOrganizationUseCase(
      organizationInMemoryRepository,
      logger,
      passwordHandler
    );
  });

  it("shoul be able to create an organization", async () => {
    const data: Organization = {
      name: "Teste Org",
      email: "org@gmail.com",
      cnpj: 46367217000135,
      whatsapp: 21999999999,
      street: "Av Alfredo Balthazar da silveira",
      city: "Rio de Janeiro",
      state: "Rio de Janeiro",
      cep: 22790710,
      country: "BRA",
    };

    const { organization } = await sut.execute({
      data,
      password: "123456",
    });

    expect(organization.name).toBe("Teste Org");
    expect(organization.password_hash).not.toBe("123456");
  });

  it("shoul not be able to create an organization with duplicated email", async () => {
    const data: Organization = {
      name: "Teste Org",
      email: "org@gmail.com",
      cnpj: 46367217000135,
      whatsapp: 21999999999,
      street: "Av Alfredo Balthazar da silveira",
      city: "Rio de Janeiro",
      state: "Rio de Janeiro",
      cep: 22790710,
      country: "BRA",
    };

    await sut.execute({
      data,
      password: "123456",
    });

    await expect(sut.execute({
      data,
      password: "123456",
    })
    ).rejects.toBeInstanceOf(ErrorOrganizationAlreadyExists);

  });

  it("shoul not be able to create an organization with duplicated cnpj", async () => {
    const data: Organization = {
      name: "Teste Org",
      email: "org@gmail.com",
      cnpj: 46367217000135,
      whatsapp: 21999999999,
      street: "Av Alfredo Balthazar da silveira",
      city: "Rio de Janeiro",
      state: "Rio de Janeiro",
      cep: 22790710,
      country: "BRA",
    };

    await sut.execute({
      data,
      password: "123456",
    });


    await expect(sut.execute({
      data: {
        ...data,
        email: "org1@gmail.com",
      },
      password: "123456",
    })
    ).rejects.toBeInstanceOf(ErrorOrganizationCnpjAlreadyExits);

  });
});
