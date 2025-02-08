import { beforeEach, describe, expect, it, vi } from "vitest";
import { DeleteOrganizationByIdUseCase } from ".";
import { Organization } from "database/entities/Organization";
import { OrganizationInMemoryRepository } from "@/repositories/in-memory/organization.in-memory";
import { ErrorOrganizationNotFound } from "../errors";

let sut: DeleteOrganizationByIdUseCase;
let organizationInMemoryRepository: OrganizationInMemoryRepository;
const logger = vi.fn((level: string = "info") => ({
  level,
  info: vi.fn(),
  warn: vi.fn(),
  error: vi.fn(),
  fatal: vi.fn(),
  debug: vi.fn(),
  trace: vi.fn(),
  silent: vi.fn(),
}));

describe("Delete Organization Use Case", () => {
  beforeEach(() => {
    organizationInMemoryRepository = new OrganizationInMemoryRepository();
    sut = new DeleteOrganizationByIdUseCase(
      organizationInMemoryRepository,
      logger,
    );
  });

  it("should delete an organization", async () => {
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

    await sut.execute({ id: "org-123" });

    const organization =
      await organizationInMemoryRepository.getById("org-123");
    expect(organization).toBeNull();
  });

  it("should not delete an organization that does not exist", async () => {
    await expect(sut.execute({ id: "org-123" })).rejects.toBeInstanceOf(
      ErrorOrganizationNotFound,
    );
  });
});
