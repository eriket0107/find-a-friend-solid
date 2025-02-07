// Should update partial fields without affecting other organization data.

import { beforeEach, describe, vi, it, expect } from "vitest";
import { UpdateOrganizationUseCase } from ".";
import { LoggerType } from "@/utils/logger";
import { PasswordHandler } from "@/utils/password-pandler";
import { OrganizationInMemoryRepository } from "@/repositories/in-memory/organization.in-memory";
import { Organization } from "database/entities/Organization";
import { ErrorOrganizationNotFound } from "../errors";

let sut: UpdateOrganizationUseCase;
let logger: LoggerType;
let passwordHandler: PasswordHandler;
let repository: OrganizationInMemoryRepository;

describe("Update Organization Use Case", () => {
  beforeEach(() => {
    logger = vi.fn((level: string = "info") => ({
      level,
      info: vi.fn(),
      warn: vi.fn(),
      error: vi.fn(),
      fatal: vi.fn(),
      debug: vi.fn(),
      trace: vi.fn(),
      silent: vi.fn(),
    }));
    passwordHandler = new PasswordHandler();
    repository = new OrganizationInMemoryRepository();

    sut = new UpdateOrganizationUseCase(repository, logger, passwordHandler);
  });

  it("should update organization successfully when valid data is provided", async () => {
    const organization: Organization = {
      id: "1",
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

    repository.create(organization);

    const organizationToUpdate: Organization = {
      name: "Tech Innovators Ltd.",
      email: "contact@techinnovators.com",
      cnpj: 12345678000190,
      whatsapp: 21988888888,
      street: "Rua das Palmeiras, 123",
      city: "São Paulo",
      state: "São Paulo",
      cep: 12345678,
      country: "BRA",
    };

    const { updatedOrganization } = await sut.execute({
      id: "1",
      data: organizationToUpdate,
    });

    expect(updatedOrganization?.name).toBe("Tech Innovators Ltd.");
    expect(updatedOrganization?.email).toBe("contact@techinnovators.com");
    expect(updatedOrganization?.cnpj).toBe(12345678000190);
    expect(updatedOrganization?.whatsapp).toBe(21988888888);
    expect(updatedOrganization?.street).toBe("Rua das Palmeiras, 123");
    expect(updatedOrganization?.city).toBe("São Paulo");
    expect(updatedOrganization?.state).toBe("São Paulo");
    expect(updatedOrganization?.cep).toBe(12345678);
    expect(updatedOrganization?.country).toBe("BRA");
  });

  it("should throw an error if the organization does not exist", async () => {
    await expect(
      sut.execute({
        id: "1",
        data: {},
      }),
    ).rejects.toBeInstanceOf(ErrorOrganizationNotFound);
  });

  it("Should update partial fields without affecting other organization data.", async () => {
    const organization: Organization = {
      id: "1",
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

    repository.create(organization);
    const organizationToUpdate: Partial<Organization> = {
      email: "teste@gmail.com",
      whatsapp: 21999999998,
      street: "Teste",
    };

    const { updatedOrganization } = await sut.execute({
      id: "1",
      data: organizationToUpdate,
    });

    expect(updatedOrganization?.email).toBe("teste@gmail.com");
    expect(updatedOrganization?.whatsapp).toBe(21999999998);
    expect(updatedOrganization?.street).toBe("Teste");
    expect(updatedOrganization?.name).toBe("Teste Org");
    expect(updatedOrganization?.email).toBe("teste@gmail.com");
    expect(updatedOrganization?.cnpj).toBe(46367217000135);
    expect(updatedOrganization?.whatsapp).toBe(21999999998);
    expect(updatedOrganization?.street).toBe("Teste");
    expect(updatedOrganization?.city).toBe("Rio de Janeiro");
    expect(updatedOrganization?.state).toBe("Rio de Janeiro");
    expect(updatedOrganization?.cep).toBe(22790710);
    expect(updatedOrganization?.country).toBe("BRA");
  });
});
