import { beforeEach, describe, expect, it, vi } from "vitest";
import { GetByIdOrganizationUseCase } from ".";
import { LoggerType } from "@/utils/logger";
import { OrganizationInMemoryRepository } from "@/repositories/in-memory/organization.in-memory";
import { Organization } from "database/entities/Organization";
import { ErrorOrganizationNotFound } from "../errors";

let sut: GetByIdOrganizationUseCase;
let organizationInMemoryRepository: OrganizationInMemoryRepository;

const logger: LoggerType = vi.fn((level: string = "info") => ({
  level,
  debug: vi.fn(),
  error: vi.fn(),
  fatal: vi.fn(),
  info: vi.fn(),
  warn: vi.fn(),
  trace: vi.fn(),
  silent: vi.fn(),
}));

describe("GetByIdOrganizationUseCase", () => {
  beforeEach(() => {
    organizationInMemoryRepository = new OrganizationInMemoryRepository();
    sut = new GetByIdOrganizationUseCase(
      organizationInMemoryRepository,
      logger,
    );
  });

  it("should retrieve an organization by ID", async () => {
    const data: Organization = {
      id: "org-123",
      name: "Test Org",
      email: "org@gmail.com",
      cnpj: "46367217000135",
      whatsapp: "21999999999",
      street: "Av Alfredo Balthazar da Silveira",
      city: "Rio de Janeiro",
      state: "Rio de Janeiro",
      cep: "22790710",
      country: "BRA",
    };

    organizationInMemoryRepository.create(data);

    const { organization } = await sut.execute({ id: "org-123" });

    expect(organization).toBeDefined();
    expect(organization.id).toBe("org-123");
    expect(organization.name).toBe("Test Org");
  });

  it("should throw an error if the organization does not exist", async () => {
    await expect(sut.execute({ id: "non-existing-id" })).rejects.toBeInstanceOf(
      ErrorOrganizationNotFound,
    );
  });
});
