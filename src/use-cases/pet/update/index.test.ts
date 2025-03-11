import { describe, it, expect, vi, beforeAll } from "vitest";
import { UpdatePetUseCase } from ".";
import { PetInMemoryRepository } from "@/repositories/in-memory/pet.in-memory";
import { OrganizationInMemoryRepository } from "@/repositories/in-memory/organization.in-memory";
import { LoggerType } from "@/utils/logger";
import {
  ErrorPetNotFound,
  ErrorPetNotAssociatedWithOrganization,
} from "../errors";
import { ErrorOrganizationNotFound } from "@/use-cases/organization/errors";
import { Organization } from "database/entities/Organization";

let sut: UpdatePetUseCase;
let petRepository: PetInMemoryRepository;
let organizationRepository: OrganizationInMemoryRepository;

const logger: LoggerType = vi.fn(() => ({
  info: vi.fn(),
  error: vi.fn(),
  warn: vi.fn(),
  debug: vi.fn(),
  fatal: vi.fn(),
  trace: vi.fn(),
  silent: vi.fn(),
  level: "info",
}));

describe("Update Pet UseCase", () => {
  beforeAll(() => {
    petRepository = new PetInMemoryRepository();
    organizationRepository = new OrganizationInMemoryRepository();
    sut = new UpdatePetUseCase(petRepository, organizationRepository, logger);
  });

  it("should be able to update a pet", async () => {
    const organization = await organizationRepository.create({
      id: "valid-org-id",
      name: "Teste Org",
      email: "org@gmail.com",
      cnpj: "46367217000135",
      whatsapp: "21999999999",
      street: "Av Alfredo Balthazar da silveira",
      city: "Rio de Janeiro",
      state: "Rio de Janeiro",
      cep: "22790710",
      country: "BRA",
    });

    const pet = await petRepository.create({
      id: "pet-id",
      name: "Buddy",
      age: "2",
      breed: "Labrador",
      gender: "M",
      profilePhoto: "https://example.com/buddy.jpg",
      photos: [
        "https://example.com/buddy1.jpg",
        "https://example.com/buddy2.jpg",
      ],
      description: "Cute and friendly",
      traits: ["Friendly", "Playful"],
      organization: organization,
    });

    await organizationRepository.create(organization);

    const { pet: updatedPet } = await sut.execute({
      id: pet.id as string,
      data: {
        name: "Max",
        age: "3",
      },
    });

    expect(updatedPet).toHaveProperty("name", "Max");
    expect(updatedPet).toHaveProperty("age", "3");
  });

  it("should not be able to update a non-existent pet", async () => {
    await expect(() =>
      sut.execute({
        id: "non-existent-pet",
        data: {
          name: "Max",
        },
      }),
    ).rejects.toBeInstanceOf(ErrorPetNotFound);
  });

  it("should not be able to update a pet that has no organization", async () => {
    const pet = await petRepository.create({
      id: "pet-id-2",
      name: "Luna",
      age: "1",
      breed: "Poodle",
      gender: "F",
      profilePhoto: "https://example.com/luna.jpg",
      photos: ["https://example.com/luna1.jpg"],
      description: "Sweet and gentle",
      traits: ["Sweet", "Gentle"],
      organization: { id: "" } as Organization,
    });

    await expect(() =>
      sut.execute({
        id: pet.id as string,
        data: {
          name: "Luna Updated",
        },
      }),
    ).rejects.toBeInstanceOf(ErrorPetNotAssociatedWithOrganization);
  });

  it("should not be able to update a pet whose organization does not exist", async () => {
    const organization = {
      id: "non-existent-org-id",
      name: "Non Existent Org",
      email: "org@gmail.com",
      cnpj: "46367217000135",
      whatsapp: "21999999999",
      street: "Av Alfredo Balthazar da silveira",
      city: "Rio de Janeiro",
      state: "Rio de Janeiro",
      cep: "22790710",
      country: "BRA",
    } as Organization;

    const pet = await petRepository.create({
      id: "pet-id-3",
      name: "Rex",
      age: "4",
      breed: "German Shepherd",
      gender: "M",
      profilePhoto: "https://example.com/rex.jpg",
      photos: ["https://example.com/rex1.jpg"],
      description: "Loyal and protective",
      traits: ["Loyal", "Protective"],
      organization,
    });

    await expect(() =>
      sut.execute({
        id: pet.id as string,
        data: {
          name: "Rex Updated",
        },
      }),
    ).rejects.toBeInstanceOf(ErrorOrganizationNotFound);
  });
});
