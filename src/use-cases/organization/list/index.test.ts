import { OrganizationInMemoryRepository } from "@/repositories/in-memory/organization.in-memory";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { ListOrganizationUseCase } from ".";

let listOrganizationUseCase: ListOrganizationUseCase;
let repository: OrganizationInMemoryRepository;
const logger = vi.fn((level: string = "info") => ({
  level,
  debug: vi.fn(),
  error: vi.fn(),
  fatal: vi.fn(),
  info: vi.fn(),
  warn: vi.fn(),
  trace: vi.fn(),
  silent: vi.fn(),
}));

describe("ListOrganizationUseCase", () => {
  beforeEach(() => {
    repository = new OrganizationInMemoryRepository();
    listOrganizationUseCase = new ListOrganizationUseCase(repository, logger);
  });

  it("should return all organizations when no filters or pagination are provided", async () => {
    for (let i = 0; i < 10; i++) {
      await repository.create({
        name: `Organization ${i + 1}`,
        cnpj: `1234567800011${i + 1}`,
        street: "Address 1",
        city: `City ${i + 1}`,
        state: `State  ${i + 1}`,
        cep: "12345-678",
        country: "Brazil",
        email: "2eOxN@example.com",
        whatsapp: "1234567890",
      });
    }

    const { organizations } = await listOrganizationUseCase.execute({});

    expect(organizations).toHaveLength(10);
  });

  it("should return organizations matching the 'where' filter", async () => {
    for (let i = 0; i < 10; i++) {
      await repository.create({
        name: `Organization ${i + 1}`,
        cnpj: `1234567800011${i + 1}`,
        street: "Address 1",
        city: `City ${i + 1}`,
        state: `State  ${i + 1}`,
        cep: "12345-678",
        country: "Brazil",
        email: "2eOxN@example.com",
        whatsapp: "1234567890",
      });
    }

    const { organizations } = await listOrganizationUseCase.execute({
      where: { name: "Organization 1" },
    });
    expect(organizations).toHaveLength(1);
    expect(organizations[0].name).toBe("Organization 1");
  });

  it("should return organizations matching the 'filter' criteria", async () => {
    await repository.create({
      name: `Organization 1`,
      cnpj: `12345678000111`,
      street: "Address 1",
      city: `City 1`,
      state: `State  1`,
      cep: "12345-678",
      country: "Brazil",
      email: "2eOxN@example.com",
      whatsapp: "1234567890",
    });

    const { organizations } = await listOrganizationUseCase.execute({
      filter: { cnpj: "1234567800011" },
    });

    expect(organizations).toHaveLength(1);
    expect(organizations[0].cnpj).toBe("12345678000111");
  });

  it("should apply pagination with 'take' and 'skip' parameters", async () => {
    for (let i = 0; i < 10; i++) {
      await repository.create({
        name: `Organization ${i + 1}`,
        cnpj: `1234567800011${i + 1}`,
        street: "Address 1",
        city: `City ${i + 1}`,
        state: `State  ${i + 1}`,
        cep: "12345-678",
        country: "Brazil",
        email: "2eOxN@example.com",
        whatsapp: "1234567890",
      });
    }

    const { organizations } = await listOrganizationUseCase.execute({
      take: 1,
      skip: 1,
    });

    expect(organizations).toHaveLength(1);
    expect(organizations[0].name).toBe("Organization 2");
  });

  it("should apply sorting using 'order' parameter", async () => {
    for (let i = 0; i < 2; i++) {
      await repository.create({
        name: `Organization ${i + 1}`,
        cnpj: `1234567800011${i + 1}`,
        street: "Address 1",
        city: `City ${i + 1}`,
        state: `State  ${i + 1}`,
        cep: "12345-678",
        country: "Brazil",
        email: "2eOxN@example.com",
        whatsapp: "1234567890",
      });
    }
    const { organizations } = await listOrganizationUseCase.execute({
      order: { name: "ASC" },
    });
    expect(organizations[0].name).toBe("Organization 1");
    expect(organizations[1].name).toBe("Organization 2");
  });

  it("should handle multiple filters, where, and order parameters", async () => {
    for (let i = 0; i < 10; i++) {
      await repository.create({
        name: `Organization ${i + 1}`,
        cnpj: `1234567800011${i + 1}`,
        street: "Address 1",
        city: `City ${i + 1}`,
        state: `State  ${i + 1}`,
        cep: "12345-678",
        country: "Brazil",
        email: "2eOxN@example.com",
        whatsapp: "1234567890",
      });
    }
    const { organizations } = await listOrganizationUseCase.execute({
      where: { city: "City 1" },
      filter: { cnpj: "1234567800011" },
      order: { name: "ASC" },
      take: 1,
    });

    expect(organizations).toHaveLength(1);
    expect(organizations[0].cnpj).toBe("12345678000111");
    expect(organizations[0].name).toBe("Organization 1");
  });
});
